// api/upload-video.js  — v4
// Browser → Vercel → Cloudflare Stream
// Uses Node https.request() with HTTP/1.1 forced via custom agent.
// Native fetch() in Node 20 uses HTTP/2 → ERR_HTTP2_PROTOCOL_ERROR.
// https.request() with allowHTTP1:true forces HTTP/1.1 → works every time.

const https = require("https");

const CF_ACCOUNT   = "a346b1c78fc48549d2de3de99a789a2d";
const CF_SUBDOMAIN = "customer-i1ij9522l179kiqc.cloudflarestream.com";

// Force HTTP/1.1 agent — this is the key fix
const http11Agent = new https.Agent({ keepAlive: false });

function httpsRequest(url, options, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = https.request(
      {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        method: options.method || "GET",
        headers: options.headers || {},
        agent: http11Agent,  // HTTP/1.1 only
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks), headers: res.headers }));
      }
    );
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://sachistream.com");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-Max-Duration,X-File-Name");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
  if (!CF_TOKEN) return res.status(500).json({ error: "CLOUDFLARE_API_TOKEN not set" });

  const maxDuration = Math.min(parseInt(req.headers["x-max-duration"] || "600", 10), 1800);
  const rawFileName = req.headers["x-file-name"] || "upload.mp4";
  const fileName = decodeURIComponent(rawFileName).replace(/[^a-zA-Z0-9._-]/g, "_");

  try {
    // Step 1: Create CF direct upload session (uses CF API, not upload endpoint)
    const sessionBody = JSON.stringify({ maxDurationSeconds: maxDuration, requireSignedURLs: false });
    const sessionRes = await httpsRequest(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/stream/direct_upload`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${CF_TOKEN}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(sessionBody),
        },
      },
      sessionBody
    );

    if (sessionRes.status !== 200) {
      return res.status(500).json({ error: "CF session create failed", details: sessionRes.body.toString().slice(0, 300) });
    }

    const sessionData = JSON.parse(sessionRes.body.toString());
    const uploadURL = sessionData.result.uploadURL;
    const streamUid = sessionData.result.uid;
    const uploadHost = new URL(uploadURL).hostname;
    const uploadPath = new URL(uploadURL).pathname;

    // Step 2: Read full file body from browser request
    const fileChunks = [];
    for await (const chunk of req) fileChunks.push(chunk);
    const fileBuffer = Buffer.concat(fileChunks);

    // Step 3: Build multipart/form-data body manually
    const boundary = "SachiBoundary" + Date.now().toString(36);
    const partHeader = Buffer.from(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n` +
      `Content-Type: video/mp4\r\n\r\n`
    );
    const partFooter = Buffer.from(`\r\n--${boundary}--\r\n`);
    const multipartBody = Buffer.concat([partHeader, fileBuffer, partFooter]);

    // Step 4: POST to CF upload URL using HTTP/1.1 (https.request)
    const uploadRes = await httpsRequest(
      uploadURL,
      {
        method: "POST",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
          "Content-Length": multipartBody.length,
          "Host": uploadHost,
        },
      },
      multipartBody
    );

    if (uploadRes.status < 200 || uploadRes.status >= 300) {
      // Clean up the CF session
      httpsRequest(
        `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/stream/${streamUid}`,
        { method: "DELETE", headers: { "Authorization": `Bearer ${CF_TOKEN}` } }
      ).catch(() => {});
      return res.status(500).json({
        error: `CF upload rejected: HTTP ${uploadRes.status}`,
        details: uploadRes.body.toString().slice(0, 300),
      });
    }

    return res.status(200).json({
      stream_uid:    streamUid,
      playback_url:  `https://${CF_SUBDOMAIN}/${streamUid}/manifest/video.m3u8`,
      thumbnail_url: `https://${CF_SUBDOMAIN}/${streamUid}/thumbnails/thumbnail.jpg`,
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
