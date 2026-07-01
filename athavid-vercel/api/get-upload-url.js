// ╔════════════════════════════════════════════════════════════════════════╗
// ║ api/get-upload-url.js                                                  ║
// ║ Returns upload credentials for direct client-side uploads:             ║
// ║   Videos  → Cloudflare Stream TUS direct upload URL                   ║
// ║   Images  → R2 presigned PUT URL                                       ║
// ║ NO file data passes through this server — fully direct upload          ║
// ╚════════════════════════════════════════════════════════════════════════╝

const CF_ACCOUNT    = "a346b1c78fc48549d2de3de99a789a2d";
const R2_BUCKET     = "sachi-media";
const R2_PUBLIC_URL = "https://media.sachistream.com";

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://sachistream.com");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const CF_TOKEN       = process.env.CLOUDFLARE_API_TOKEN;
  const R2_ACCESS_KEY  = process.env.R2_ACCESS_KEY_ID;
  const R2_SECRET_KEY  = process.env.R2_SECRET_ACCESS_KEY;

  let body = req.body || {};
  if (typeof body === "string") { try { body = JSON.parse(body); } catch(e) {} }

  const { type, filename, filesize, filetype } = body;
  // type = "video" | "image"

  if (!type || !filename) {
    return res.status(400).json({ error: "type and filename required" });
  }

  // ── VIDEO: Cloudflare Stream direct upload (non-TUS, simple form POST) ──
  // Uses /stream/direct_upload to get a one-time upload URL the browser can
  // POST a multipart form to. No TUS, no HTTP/2 issues, no chunking needed.
  if (type === "video") {
    if (!CF_TOKEN) return res.status(500).json({ error: "CLOUDFLARE_API_TOKEN not set" });

    // maxDuration from client (seconds), default 600 (10 min), max 1800 (30 min)
    const maxDuration = Math.min(parseInt(body.maxDuration || "600", 10), 1800);

    try {
      const cfRes = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/stream/direct_upload`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${CF_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            maxDurationSeconds: maxDuration,
            requireSignedURLs: false,
          }),
        }
      );

      if (!cfRes.ok) {
        const err = await cfRes.text();
        return res.status(500).json({ error: "Cloudflare Stream error", details: err });
      }

      const data = await cfRes.json();
      const streamUid = data.result.uid;
      const playbackUrl = `https://customer-i1ij9522l179kiqc.cloudflarestream.com/${streamUid}/manifest/video.m3u8`;
      const thumbnailUrl = `https://customer-i1ij9522l179kiqc.cloudflarestream.com/${streamUid}/thumbnails/thumbnail.jpg`;

      // IMPORTANT: return /api/upload-video as upload_url so ALL client versions
      // (old fetch() and new XHR) route through our HTTP/1.1 server proxy.
      // This works regardless of which JS bundle the browser has cached.
      return res.status(200).json({
        upload_url:    "/api/upload-video",  // proxy endpoint — works with any client version
        stream_uid:    streamUid,
        playback_url:  playbackUrl,
        thumbnail_url: thumbnailUrl,
        method:        "proxy",
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // ── IMAGE: R2 presigned PUT URL ─────────────────────────────────────────
  if (type === "image") {
    if (!R2_ACCESS_KEY || !R2_SECRET_KEY) {
      return res.status(500).json({ error: "R2_ACCESS_KEY_ID or R2_SECRET_ACCESS_KEY not set" });
    }

    try {
      const ext = filename.split(".").pop().toLowerCase() || "jpg";
      const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
      const presigned = await generateR2PresignedUrl(key, filetype || "image/jpeg", R2_ACCESS_KEY, R2_SECRET_KEY);

      return res.status(200).json({
        upload_url:  presigned,           // PUT directly to this URL
        public_url:  `${R2_PUBLIC_URL}/${key}`, // save this as the final image URL
        key,
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(400).json({ error: "type must be 'video' or 'image'" });
};

// ── R2 presigned URL generator (AWS S3-compatible sig v4) ─────────────────
async function generateR2PresignedUrl(key, contentType, accessKey, secretKey) {
  const R2_ENDPOINT = `https://${CF_ACCOUNT}.r2.cloudflarestorage.com`;
  const bucket = R2_BUCKET;
  const region = "auto";
  const service = "s3";

  const now = new Date();
  const dateStr = now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const dateOnly = dateStr.slice(0, 8);

  const credentialScope = `${dateOnly}/${region}/${service}/aws4_request`;
  const credential = `${accessKey}/${credentialScope}`;

  const expires = "3600"; // 1 hour

  const queryParams = new URLSearchParams({
    "X-Amz-Algorithm":     "AWS4-HMAC-SHA256",
    "X-Amz-Credential":    credential,
    "X-Amz-Date":          dateStr,
    "X-Amz-Expires":       expires,
    "X-Amz-SignedHeaders": "host",
  });

  const host = `${bucket}.${CF_ACCOUNT}.r2.cloudflarestorage.com`;
  const canonicalRequest = [
    "PUT",
    `/${key}`,
    queryParams.toString(),
    `host:${host}\n`,
    "host",
    "UNSIGNED-PAYLOAD",
  ].join("\n");

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    dateStr,
    credentialScope,
    await sha256hex(canonicalRequest),
  ].join("\n");

  const signingKey = await getSigningKey(secretKey, dateOnly, region, service);
  const signature = await hmacHex(signingKey, stringToSign);

  return `https://${host}/${key}?${queryParams.toString()}&X-Amz-Signature=${signature}`;
}

async function sha256hex(data) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join("");
}

async function hmacRaw(key, data) {
  const k = typeof key === "string"
    ? await crypto.subtle.importKey("raw", new TextEncoder().encode(key), { name:"HMAC", hash:"SHA-256" }, false, ["sign"])
    : await crypto.subtle.importKey("raw", key, { name:"HMAC", hash:"SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(data)));
}

async function hmacHex(key, data) {
  const raw = await hmacRaw(key, data);
  return Array.from(raw).map(b => b.toString(16).padStart(2,"0")).join("");
}

async function getSigningKey(secret, date, region, service) {
  const kDate    = await hmacRaw(`AWS4${secret}`, date);
  const kRegion  = await hmacRaw(kDate, region);
  const kService = await hmacRaw(kRegion, service);
  return await hmacRaw(kService, "aws4_request");
}
