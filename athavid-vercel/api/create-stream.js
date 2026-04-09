// Vercel serverless function — proxies Cloudflare Stream API (avoids CORS)
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
  const CF_ACCOUNT = "a346b1c78fc48549d2de3de99a789a2d";

  if (!CF_TOKEN) {
    return res.status(500).json({ error: "CLOUDFLARE_API_TOKEN not set in Vercel env" });
  }

  const { podcast_id, podcast_title, host_username } = req.body || {};

  if (!podcast_id || !podcast_title) {
    return res.status(400).json({ error: "podcast_id and podcast_title required" });
  }

  try {
    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/stream/live_inputs`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meta: { name: `${podcast_title} - ${host_username || "host"}` },
          recording: { mode: "automatic", timeoutSeconds: 10 },
          deleteRecordingAfterDays: 30,
        }),
      }
    );

    const cfData = await cfRes.json();

    if (!cfData.success) {
      return res.status(500).json({ error: "Cloudflare error", details: cfData.errors });
    }

    const input = cfData.result;
    const rtmpUrl = input.rtmps?.url;
    const streamKey = input.rtmps?.streamKey;
    const cfInputId = input.uid;
    const playbackUrl = `https://customer-i1ij9522l179kiqc.cloudflarestream.com/${cfInputId}/manifest/video.m3u8`;

    return res.status(200).json({
      success: true,
      rtmp_url: rtmpUrl,
      stream_key: streamKey,
      playback_url: playbackUrl,
      cf_input_id: cfInputId,
      podcast_id,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
