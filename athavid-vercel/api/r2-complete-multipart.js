// ╔════════════════════════════════════════════════════════════════════════╗
// ║ api/r2-complete-multipart.js                                            ║
// ║ Finalizes an R2 multipart upload once all parts are uploaded.           ║
// ║ Added 2026-07-02 as part of the multipart video upload fix.             ║
// ║                                                                          ║
// ║ Updated 2026-07-07 — ROOT CAUSE FIX for "video plays but black screen": ║
// ║ Verified on a real production file (Pixel 9 Pro upload): the video was  ║
// ║ encoded as HEVC/H.265, which most desktop/Android Chrome + Firefox      ║
// ║ builds cannot decode at all (no license/hardware decoder) — the audio   ║
// ║ track still decodes and the duration/timer still advances, but no      ║
// ║ video frame ever paints, exactly matching the reported symptom. On top ║
// ║ of that, the file's 'moov' atom (frame index) was at the very END of   ║
// ║ the file instead of the front ("faststart"), which independently can   ║
// ║ delay/break frame rendering on large files.                            ║
// ║                                                                          ║
// ║ Fix: after the multipart upload completes, call the shared fixVideo()   ║
// ║ helper (api/_videofix.js) — probes the codec with ffprobe; if it's      ║
// ║ already H.264 + faststart, does nothing; if H.264 but moov is          ║
// ║ misplaced, does a cheap stream-copy remux; if it's HEVC or anything     ║
// ║ else, fully transcodes to H.264/AAC with +faststart (also correctly    ║
// ║ bakes in the phone's rotation metadata). Non-fatal: if this step fails  ║
// ║ for any reason, the original upload (already saved) is left as-is and  ║
// ║ the request still reports success.                                     ║
// ╚════════════════════════════════════════════════════════════════════════╝

const { signedRequest } = require("./_r2sign.js");
const { fixVideo, isVideoKey } = require("./_videofix.js");

const CF_ACCOUNT = "a346b1c78fc48549d2de3de99a789a2d";
const R2_BUCKET   = "sachi-media";

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://sachistream.com");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY_ID;
  const R2_SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY;
  if (!R2_ACCESS_KEY || !R2_SECRET_KEY) {
    return res.status(500).json({ error: "R2_ACCESS_KEY_ID or R2_SECRET_ACCESS_KEY not set" });
  }

  let body = req.body || {};
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) {} }
  const { key, upload_id, parts } = body; // parts: [{ part_number, etag }, ...]

  if (!key || !upload_id || !Array.isArray(parts) || parts.length === 0) {
    return res.status(400).json({ error: "key, upload_id, and parts[] are required" });
  }

  try {
    const sorted = [...parts].sort((a, b) => a.part_number - b.part_number);
    const partsXml = sorted
      .map(p => `<Part><PartNumber>${p.part_number}</PartNumber><ETag>${p.etag}</ETag></Part>`)
      .join("");
    const xmlBody = `<CompleteMultipartUpload>${partsXml}</CompleteMultipartUpload>`;

    const completeRes = await signedRequest({
      accountId: CF_ACCOUNT, bucket: R2_BUCKET,
      accessKey: R2_ACCESS_KEY, secretKey: R2_SECRET_KEY,
      method: "POST", key, query: { uploadId: upload_id },
      body: xmlBody,
      extraHeaders: { "content-type": "application/xml" },
    });

    if (!completeRes.ok) {
      const errText = await completeRes.text();
      return res.status(500).json({ error: `R2 complete multipart failed: ${completeRes.status} ${errText}` });
    }

    // ── Respond immediately so the phone's upload completes right away ───
    // fixVideo (ffprobe + optional ffmpeg transcode) can take 2-4 min for
    // HEVC clips from modern phones — blocking this response was the root
    // cause of "stuck on Uploading for 3+ minutes" on mobile devices.
    // Vercel keeps the lambda alive after res.json() until async work
    // finishes (up to the maxDuration set in vercel.json = 300s), so the
    // transcode still runs and completes in the background — the client
    // just doesn't have to wait for it.
    res.status(200).json({ success: true, videoFix: { attempted: false, async: true } });

    if (isVideoKey(key)) {
      try {
        const r = await fixVideo(key);
        console.log("video fix complete for", key, r);
      } catch (e) {
        console.error("video fix failed for", key, e.message);
      }
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
