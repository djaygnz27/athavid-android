// api/trigger-mp4.js
// Called immediately after a video TUS upload completes.
// Triggers Cloudflare Stream to generate an MP4 download for the stream.
// Returns { media_url } when ready (polls for up to 30s), or { media_url: null } on timeout.
// This ensures every uploaded video gets a direct MP4 link — no more HLS-only uploads.

const CF_ACCOUNT = "a346b1c78fc48549d2de3de99a789a2d";
const POLL_INTERVAL_MS = 3000;
const MAX_ATTEMPTS = 10; // 30 seconds total

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://sachistream.com");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
  if (!CF_TOKEN) return res.status(500).json({ error: "CLOUDFLARE_API_TOKEN not set" });

  let body = req.body || {};
  if (typeof body === "string") { try { body = JSON.parse(body); } catch(e) {} }

  const { stream_uid } = body;
  if (!stream_uid) return res.status(400).json({ error: "stream_uid required" });

  const downloadUrl = `https://customer-i1ij9522l179kiqc.cloudflarestream.com/${stream_uid}/downloads/default.mp4`;

  try {
    // Step 1: Request download generation
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/stream/${stream_uid}/downloads`,
      {
        method: "POST",
        headers: { "Authorization": `Bearer ${CF_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }
    );

    // Step 2: Poll until ready or timeout
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      await sleep(POLL_INTERVAL_MS);

      const pollRes = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/stream/${stream_uid}/downloads`,
        { headers: { "Authorization": `Bearer ${CF_TOKEN}` } }
      );
      const pollData = await pollRes.json();
      const status = pollData?.result?.default?.status;

      if (status === "ready") {
        return res.status(200).json({ media_url: downloadUrl, status: "ready" });
      }
      // status = "inprogress" — keep polling
    }

    // Timed out — return null, the video still plays via HLS, backfill will fix it later
    return res.status(200).json({ media_url: null, status: "timeout" });

  } catch (e) {
    // Non-fatal — return null so upload doesn't fail
    return res.status(200).json({ media_url: null, status: "error", detail: e.message });
  }
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
