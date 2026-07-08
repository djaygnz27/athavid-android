// ╔════════════════════════════════════════════════════════════════════════╗
// ║ api/_videofix.js                                                        ║
// ║ Shared "fix black-screen video" logic. See r2-complete-multipart.js for ║
// ║ full root-cause writeup. Exposed here so both the automatic post-upload ║
// ║ hook and the one-off admin repair endpoint use the exact same code.     ║
// ╚════════════════════════════════════════════════════════════════════════╝

const { signedRequest } = require("./_r2sign.js");
const { execFile } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const ffmpegPath = require("ffmpeg-static");
const ffprobePath = require("ffprobe-static").path;

const CF_ACCOUNT = "a346b1c78fc48549d2de3de99a789a2d";
const R2_BUCKET   = "sachi-media";
const PUBLIC_BASE = "https://media.sachistream.com";

function isVideoKey(key) {
  return /\.(mp4|mov|m4v)$/i.test(key || "");
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, { maxBuffer: 1024 * 1024 * 64, timeout: 280000, ...opts }, (err, stdout, stderr) => {
      if (err) return reject(new Error(stderr ? String(stderr).slice(-800) : err.message));
      resolve(stdout);
    });
  });
}

async function probeVideoCodec(filePath) {
  const out = await run(ffprobePath, [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=codec_name",
    "-of", "json",
    filePath,
  ]);
  try {
    const parsed = JSON.parse(out);
    return parsed.streams && parsed.streams[0] ? parsed.streams[0].codec_name : null;
  } catch (e) {
    return null;
  }
}

function looksAlreadyFaststart(buf) {
  const head = buf.subarray(0, Math.min(buf.length, 2 * 1024 * 1024));
  const moovIdx = head.indexOf(Buffer.from("moov"));
  const mdatIdx = head.indexOf(Buffer.from("mdat"));
  if (moovIdx === -1) return false;
  if (mdatIdx === -1) return true;
  return moovIdx < mdatIdx;
}

async function fixVideo(key) {
  const publicUrl = `${PUBLIC_BASE}/${key}`;
  const dlRes = await fetch(publicUrl);
  if (!dlRes.ok) throw new Error(`fixVideo: download failed ${dlRes.status}`);
  const inBuf = Buffer.from(await dlRes.arrayBuffer());

  const stamp = Date.now();
  const tmpIn = path.join(os.tmpdir(), `fv-in-${stamp}.mp4`);
  fs.writeFileSync(tmpIn, inBuf);

  let codec = null;
  try { codec = await probeVideoCodec(tmpIn); } catch (e) { /* unknown — will transcode to be safe */ }

  const alreadyGood = codec === "h264" && looksAlreadyFaststart(inBuf);
  if (alreadyGood) {
    try { fs.unlinkSync(tmpIn); } catch (e) {}
    return { skipped: true, reason: "already h264 + faststart", codec };
  }

  const tmpOut = path.join(os.tmpdir(), `fv-out-${stamp}.mp4`);
  const needsTranscode = codec !== "h264";

  if (needsTranscode) {
    await run(ffmpegPath, [
      "-y", "-i", tmpIn,
      "-c:v", "libx264", "-preset", "veryfast", "-crf", "23", "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", "128k",
      "-movflags", "+faststart",
      tmpOut,
    ]);
  } else {
    await run(ffmpegPath, ["-y", "-i", tmpIn, "-c", "copy", "-movflags", "+faststart", tmpOut]);
  }

  const outBuf = fs.readFileSync(tmpOut);
  try { fs.unlinkSync(tmpIn); } catch (e) {}
  try { fs.unlinkSync(tmpOut); } catch (e) {}

  const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY_ID;
  const R2_SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY;
  const putRes = await signedRequest({
    accountId: CF_ACCOUNT, bucket: R2_BUCKET,
    accessKey: R2_ACCESS_KEY, secretKey: R2_SECRET_KEY,
    method: "PUT", key, body: outBuf,
    extraHeaders: { "content-type": "video/mp4" },
  });
  if (!putRes.ok) {
    const t = await putRes.text().catch(() => "");
    throw new Error(`fixVideo: re-upload failed ${putRes.status} ${t}`);
  }
  return { skipped: false, transcoded: needsTranscode, codec, bytes: outBuf.length };
}

module.exports = { fixVideo, isVideoKey };
