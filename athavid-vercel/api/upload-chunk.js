// api/upload-chunk.js
// Proxies TUS PATCH chunks from the browser to Cloudflare Stream.
// This bypasses ERR_HTTP2_PROTOCOL_ERROR — browser talks HTTP/2 to Vercel,
// Vercel talks HTTP/1.1 to Cloudflare. Problem gone.

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://sachistream.com");
  res.setHeader("Access-Control-Allow-Methods", "PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Upload-Offset,Tus-Resumable,X-CF-Upload-URL");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "PATCH") return res.status(405).json({ error: "PATCH only" });

  // The actual Cloudflare TUS upload URL is passed in a header
  const cfUploadUrl = req.headers["x-cf-upload-url"];
  if (!cfUploadUrl || !cfUploadUrl.includes("cloudflarestream.com")) {
    return res.status(400).json({ error: "Missing or invalid X-CF-Upload-URL header" });
  }

  const offset = req.headers["upload-offset"];
  const tusResumable = req.headers["tus-resumable"] || "1.0.0";

  // Read raw body
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks);

  try {
    const cfRes = await fetch(cfUploadUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/offset+octet-stream",
        "Upload-Offset": offset,
        "Tus-Resumable": tusResumable,
        "Content-Length": String(body.length),
      },
      body,
      // Node fetch uses HTTP/1.1 by default — no HTTP/2 issue
      duplex: "half",
    });

    if (!cfRes.ok) {
      const errText = await cfRes.text();
      return res.status(cfRes.status).json({ error: `CF rejected chunk: ${cfRes.status}`, details: errText });
    }

    // Forward the Upload-Offset response header back to client
    const newOffset = cfRes.headers.get("upload-offset");
    if (newOffset) res.setHeader("Upload-Offset", newOffset);
    return res.status(204).end();

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
