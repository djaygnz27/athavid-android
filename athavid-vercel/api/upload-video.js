// api/upload-video.js — v5
// Universal upload proxy: handles both raw bytes AND multipart/form-data from browser
// Works with ALL client bundle versions (old cached and new)
// Uses Node https.request() to force HTTP/1.1 to Cloudflare (never HTTP/2)

const https = require("https");
const CF_ACCOUNT   = "a346b1c78fc48549d2de3de99a789a2d";
const CF_SUBDOMAIN = "customer-i1ij9522l179kiqc.cloudflarestream.com";
const http11Agent  = new https.Agent({ keepAlive: false });

function httpsPost(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname, path, method: "POST", headers, agent: http11Agent },
      (res) => {
        const chunks = [];
        res.on("data", c => chunks.push(c));
        res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

function httpsDelete(hostname, path, headers) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname, path, method: "DELETE", headers, agent: http11Agent },
      (res) => { res.resume(); res.on("end", resolve); }
    );
    req.on("error", reject);
    req.end();
  });
}


// CRITICAL: disable Vercel's default 4.5MB body size limit
module.exports.config = { api: { bodyParser: false, responseLimit: false } };

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-Max-Duration,X-File-Name,Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
  if (!CF_TOKEN) return res.status(500).json({ error: "CLOUDFLARE_API_TOKEN not set" });

  const maxDuration = Math.min(parseInt(req.headers["x-max-duration"] || "600", 10), 1800);
  const rawFileName = req.headers["x-file-name"] || "upload.mp4";
  const fileName = decodeURIComponent(rawFileName).replace(/[^a-zA-Z0-9._-]/g, "_");

  try {
    // Step 1: Read raw request body
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks);

    // Step 2: Extract the actual video bytes
    // Could be: raw bytes (new client) or multipart/form-data (old client)
    let fileBuffer = rawBody;
    const contentType = req.headers["content-type"] || "";
    
    if (contentType.includes("multipart/form-data")) {
      // Parse multipart: find the file part between boundaries
      const boundaryMatch = contentType.match(/boundary=([^\s;]+)/);
      if (boundaryMatch) {
        const boundary = boundaryMatch[1];
        const sep = Buffer.from("\r\n\r\n");
        const end = Buffer.from(`\r\n--${boundary}`);
        const sepIdx = rawBody.indexOf(sep);
        if (sepIdx !== -1) {
          const startIdx = sepIdx + sep.length;
          const endIdx = rawBody.indexOf(end, startIdx);
          fileBuffer = endIdx !== -1 ? rawBody.slice(startIdx, endIdx) : rawBody.slice(startIdx);
        }
      }
    }

    // Step 3: Create CF upload session
    const sessionBody = JSON.stringify({ maxDurationSeconds: maxDuration, requireSignedURLs: false });
    const sessionRes = await httpsPost(
      "api.cloudflare.com",
      `/client/v4/accounts/${CF_ACCOUNT}/stream/direct_upload`,
      {
        "Authorization": `Bearer ${CF_TOKEN}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(sessionBody),
      },
      sessionBody
    );

    if (sessionRes.status !== 200) {
      return res.status(500).json({ error: "CF session failed", details: sessionRes.body.toString().slice(0, 200) });
    }

    const sessionData = JSON.parse(sessionRes.body.toString());
    const uploadURL  = new URL(sessionData.result.uploadURL);
    const streamUid  = sessionData.result.uid;

    // Step 4: Upload to CF as multipart/form-data over HTTP/1.1
    const boundary = "SachiBoundary" + Date.now().toString(36);
    const partHead = Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: video/mp4\r\n\r\n`
    );
    const partFoot = Buffer.from(`\r\n--${boundary}--\r\n`);
    const multipart = Buffer.concat([partHead, fileBuffer, partFoot]);

    const uploadRes = await httpsPost(
      uploadURL.hostname,
      uploadURL.pathname,
      {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        "Content-Length": multipart.length,
      },
      multipart
    );

    if (uploadRes.status < 200 || uploadRes.status >= 300) {
      // Clean up
      httpsDelete(
        "api.cloudflare.com",
        `/client/v4/accounts/${CF_ACCOUNT}/stream/${streamUid}`,
        { "Authorization": `Bearer ${CF_TOKEN}` }
      ).catch(() => {});
      return res.status(500).json({
        error: `CF upload rejected: HTTP ${uploadRes.status}`,
        details: uploadRes.body.toString().slice(0, 200),
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
