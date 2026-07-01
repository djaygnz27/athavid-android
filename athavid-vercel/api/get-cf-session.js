// api/get-cf-session.js
// Returns a Cloudflare direct upload URL for the browser to use
// The browser then uploads directly to CF — bypassing Vercel's 4.5MB limit entirely

const https = require("https");

function httpsPost(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname, path, method: "POST", headers },
      (res) => {
        const chunks = [];
        res.on("data", c => chunks.push(c));
        res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString() }));
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-Max-Duration");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const CF_TOKEN   = process.env.CLOUDFLARE_API_TOKEN;
  const CF_ACCOUNT = "a346b1c78fc48549d2de3de99a789a2d";

  if (!CF_TOKEN) return res.status(500).json({ error: "CLOUDFLARE_API_TOKEN not set" });

  const maxDuration = Math.min(parseInt(req.headers["x-max-duration"] || "600", 10), 1800);

  try {
    const sessionBody = JSON.stringify({
      maxDurationSeconds: maxDuration,
      requireSignedURLs: false,
    });

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
      return res.status(500).json({ error: "CF session failed", details: sessionRes.body.slice(0, 200) });
    }

    const data = JSON.parse(sessionRes.body);
    const uploadURL  = data.result.uploadURL;
    const streamUid  = data.result.uid;
    const subdomain  = "customer-i1ij9522l179kiqc.cloudflarestream.com";

    return res.status(200).json({
      upload_url:    uploadURL,
      stream_uid:    streamUid,
      playback_url:  `https://${subdomain}/${streamUid}/manifest/video.m3u8`,
      thumbnail_url: `https://${subdomain}/${streamUid}/thumbnails/thumbnail.jpg`,
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
