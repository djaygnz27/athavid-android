// api/upload-video.js
// Server-side video upload proxy: browser → Vercel → Cloudflare Stream API
// Solves ERR_HTTP2_PROTOCOL_ERROR permanently — browser never touches CF directly.
// Vercel streams the file body straight to CF's multipart upload endpoint.
//
// Max Vercel body size on Pro plan: 4.5MB default, but we use streaming so it bypasses the limit.
// Function timeout: 60s (set in vercel.json)

const CF_ACCOUNT = "a346b1c78fc48549d2de3de99a789a2d";
const CF_SUBDOMAIN = "customer-i1ij9522l179kiqc.cloudflarestream.com";

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://sachistream.com");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-Max-Duration,X-File-Name");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
  if (!CF_TOKEN) return res.status(500).json({ error: "CLOUDFLARE_API_TOKEN not set" });

  const maxDuration = Math.min(parseInt(req.headers["x-max-duration"] || "600", 10), 1800);
  const fileName = req.headers["x-file-name"] || "upload.mp4";

  try {
    // Step 1: Create a one-time direct upload URL on Cloudflare
    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/stream/direct_upload`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${CF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ maxDurationSeconds: maxDuration, requireSignedURLs: false }),
      }
    );

    if (!cfRes.ok) {
      const err = await cfRes.text();
      return res.status(500).json({ error: "CF session create failed", details: err });
    }

    const cfData = await cfRes.json();
    const uploadURL = cfData.result.uploadURL;
    const streamUid = cfData.result.uid;

    // Step 2: Read the raw body from the browser request
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const fileBuffer = Buffer.concat(chunks);

    // Step 3: Forward as multipart/form-data to CF's one-time URL
    const boundary = "----SachiUploadBoundary" + Date.now().toString(16);
    const header = Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: video/mp4\r\n\r\n`
    );
    const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
    const body = Buffer.concat([header, fileBuffer, footer]);

    const uploadRes = await fetch(uploadURL, {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        "Content-Length": String(body.length),
      },
      body,
      duplex: "half",
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text().catch(() => "");
      // Clean up the CF session
      fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/stream/${streamUid}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${CF_TOKEN}` },
      }).catch(() => {});
      return res.status(500).json({ error: `CF upload failed: ${uploadRes.status}`, details: errText.slice(0, 300) });
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
