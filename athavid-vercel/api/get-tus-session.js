// api/get-tus-session.js
// Creates a Cloudflare Stream TUS (resumable, chunked) upload session and
// returns the one-time Location URL for the browser to PATCH chunks to
// directly. This replaces the single-POST direct_upload flow (get-cf-session)
// which was hitting net::ERR_HTTP2_PROTOCOL_ERROR in Chrome on real
// multi-MB video files -- a known Chrome/Cloudflare bug on large single-shot
// HTTP/2 uploads. Verified via live testing 2026-07-01: TUS chunked PATCH
// requests (5MB chunks) never trigger this error, at any file size tested.

const https = require("https");

function httpsRequest(method, hostname, path, headers) {
  return new Promise((resolve, reject) => {
    const req = https.request({ hostname, path, method, headers }, (res) => {
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => resolve({
        status: res.statusCode,
        headers: res.headers,
        body: Buffer.concat(chunks).toString(),
      }));
    });
    req.on("error", reject);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-Max-Duration,X-File-Size,X-File-Name");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const CF_TOKEN   = process.env.CLOUDFLARE_API_TOKEN;
  const CF_ACCOUNT = "a346b1c78fc48549d2de3de99a789a2d";
  if (!CF_TOKEN) return res.status(500).json({ error: "CLOUDFLARE_API_TOKEN not set" });

  const maxDuration = Math.min(parseInt(req.headers["x-max-duration"] || "600", 10), 1800);
  const fileSize     = parseInt(req.headers["x-file-size"] || "0", 10);
  const fileName      = req.headers["x-file-name"] || "video.mp4";

  if (!fileSize || fileSize <= 0) {
    return res.status(400).json({ error: "X-File-Size header required" });
  }

  try {
    const nameMeta = Buffer.from(decodeURIComponent(fileName)).toString("base64");
    const durMeta  = Buffer.from(String(maxDuration)).toString("base64");

    const cfRes = await httpsRequest(
      "POST",
      "api.cloudflare.com",
      `/client/v4/accounts/${CF_ACCOUNT}/stream?direct_user=true`,
      {
        "Authorization": `Bearer ${CF_TOKEN}`,
        "Tus-Resumable": "1.0.0",
        "Upload-Length": String(fileSize),
        "Upload-Metadata": `name ${nameMeta},maxdurationseconds ${durMeta}`,
      }
    );

    if (cfRes.status !== 201) {
      return res.status(500).json({ error: "CF TUS session failed", status: cfRes.status, details: cfRes.body.slice(0, 300) });
    }

    const location = cfRes.headers["location"];
    const streamUid = cfRes.headers["stream-media-id"];
    if (!location || !streamUid) {
      return res.status(500).json({ error: "CF response missing Location/Stream-Media-Id", headers: cfRes.headers });
    }

    const subdomain = "customer-i1ij9522l179kiqc.cloudflarestream.com";

    return res.status(200).json({
      tus_upload_url: location,
      stream_uid:     streamUid,
      playback_url:   `https://${subdomain}/${streamUid}/manifest/video.m3u8`,
      thumbnail_url:  `https://${subdomain}/${streamUid}/thumbnails/thumbnail.jpg`,
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
