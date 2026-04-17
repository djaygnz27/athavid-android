/**
 * Base44 Backend Function: cfStreamUpload
 *
 * Mints a one-time "Direct Creator Upload" URL from Cloudflare Stream.
 * The frontend calls this function, receives an upload URL, then uploads the
 * video file bytes directly to Cloudflare (bypassing Base44).
 *
 * Cloudflare transcodes the upload to HLS with adaptive bitrate automatically.
 * The frontend saves the returned `videoId` (uid) to the SachiVideo record.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Required Base44 environment variables (set in Base44 dashboard → Secrets):
 *   CF_ACCOUNT_ID          — Your Cloudflare account ID
 *   CF_STREAM_API_TOKEN    — API token with Stream:Edit permission
 *
 * Optional:
 *   CF_STREAM_MAX_SECONDS  — Max allowed video length (default: 300 = 5 min)
 * ─────────────────────────────────────────────────────────────────────────────
 */

export default async function handler(req, res) {
  // Only allow authenticated users
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
  const CF_STREAM_API_TOKEN = process.env.CF_STREAM_API_TOKEN;
  const CF_STREAM_MAX_SECONDS = parseInt(process.env.CF_STREAM_MAX_SECONDS || "300", 10);

  if (!CF_ACCOUNT_ID || !CF_STREAM_API_TOKEN) {
    console.error("[cfStreamUpload] Missing CF_ACCOUNT_ID or CF_STREAM_API_TOKEN env vars");
    return res.status(500).json({ error: "Server not configured for video uploads" });
  }

  // Get expected content length from request body (optional, helps CF enforce limits)
  const { maxDurationSeconds } = req.body || {};
  const duration = Math.min(
    parseInt(maxDurationSeconds, 10) || CF_STREAM_MAX_SECONDS,
    CF_STREAM_MAX_SECONDS
  );

  try {
    // Request a direct creator upload URL from Cloudflare Stream
    // Docs: https://developers.cloudflare.com/stream/uploading-videos/direct-creator-uploads/
    const cfResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/direct_upload`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${CF_STREAM_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maxDurationSeconds: duration,
          // Tag videos with the uploader's user ID so we can find/delete them later
          meta: {
            name: `sachi_${req.user.id}_${Date.now()}`,
            uploaderId: req.user.id,
          },
          // Enable creator-facing options
          requireSignedURLs: false,  // Set to true later if you want access control
          allowedOrigins: [
            "sachistream.com",
            "www.sachistream.com",
            "*.sachistream.com",
            "*.base44.app",
            "localhost:3000",
            "localhost:5173",
          ],
        }),
      }
    );

    const data = await cfResponse.json();

    if (!cfResponse.ok || !data.success) {
      console.error("[cfStreamUpload] CF API error:", data);
      return res.status(502).json({
        error: "Cloudflare Stream rejected the upload request",
        details: data.errors || data,
      });
    }

    // Return the upload URL + video ID to the frontend.
    // Frontend uses the URL to POST the video file, then saves `uid` to the DB.
    return res.status(200).json({
      uploadURL: data.result.uploadURL,
      videoId: data.result.uid,
    });
  } catch (err) {
    console.error("[cfStreamUpload] Network/fetch error:", err);
    return res.status(500).json({ error: "Failed to reach Cloudflare Stream" });
  }
}
