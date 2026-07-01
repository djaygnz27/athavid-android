// api/get-cf-session.js
// Creates a REAL TUS resumable upload session with Cloudflare Stream.
// Returns the TUS Location URL — browser PATCHes chunks directly to it.
//
// IMPORTANT: This is different from /stream/direct_upload (which only supports
// a single simple multipart POST). Real TUS requires creating the upload via
// the main /stream endpoint with Tus-Resumable + Upload-Length headers, which
// only works server-side (needs the CF API token). CF responds with a
// Location header = the one-time TUS upload URL that accepts PATCH chunks
// from the browser with no auth needed.

const https = require("https");

function httpsRequest(hostname, path, method, headers, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname, path, method, headers },
      (res) => {
        const chunks = [];
        res.on("data", c => chunks.push(c));
        res.on("end", () => resolve({
          status: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(chunks).toString(),
        }));
      }
    );
    req.on("error", reject);
    if (body) req.write(body);
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
  const fileSize = parseInt(req.headers["x-file-size"] || "0", 10);
  const fileName = req.headers["x-file-name"] || "upload.mp4";

  if (!fileSize || fileSize <= 0) {
    return res.status(400).json({ error: "X-File-Size header required and must be > 0" });
  }

  try {
    // Build Upload-Metadata: base64-encoded key/value pairs, space separated
    const metaName = Buffer.from(fileName).toString("base64");
    const metaMaxDuration = Buffer.from(String(maxDuration)).toString("base64");
    const uploadMetadata = `name ${metaName},maxdurationseconds ${metaMaxDuration}`;

    const createRes = await httpsRequest(
      "api.cloudflare.com",
      `/client/v4/accounts/${CF_ACCOUNT}/stream`,
      "POST",
      {
        "Authorization": `Bearer ${CF_TOKEN}`,
        "Tus-Resumable": "1.0.0",
        "Upload-Length": String(fileSize),
        "Upload-Metadata": uploadMetadata,
        "Content-Length": "0",
      },
      null
    );

    if (createRes.status !== 201) {
      return res.status(500).json({
        error: "CF TUS creation failed",
        status: createRes.status,
        details: createRes.body.slice(0, 300),
      });
    }

    // Location header = the TUS upload URL for PATCH chunks
    let location = createRes.headers["location"];
    if (!location) {
      return res.status(500).json({ error: "CF did not return a Location header", details: JSON.stringify(createRes.headers) });
    }
    // Location may be relative — normalize to absolute
    if (location.startsWith("/")) {
      location = `https://api.cloudflare.com${location}`;
    }

    // stream media id is in the stream-media-id response header
    const streamUid = createRes.headers["stream-media-id"] || null;
    const subdomain = "customer-i1ij9522l179kiqc.cloudflarestream.com";

    return res.status(200).json({
      upload_url:    location,
      stream_uid:    streamUid,
      playback_url:  streamUid ? `https://${subdomain}/${streamUid}/manifest/video.m3u8` : null,
      thumbnail_url: streamUid ? `https://${subdomain}/${streamUid}/thumbnails/thumbnail.jpg` : null,
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
