// Cloudflare Stream - Create Live Input for Sachi Podcast Hosts
// v2 - no base44 import, returns credentials directly

const CF_ACCOUNT_ID = "a346b1c78fc48549d2de3de99a789a2d";

export default async function handler(req: Request) {
  const CF_TOKEN = Deno.env.get("CLOUDFLARE_API_TOKEN");

  if (!CF_TOKEN) {
    return new Response(JSON.stringify({ error: "CLOUDFLARE_API_TOKEN not configured" }), { status: 500 });
  }

  const { podcast_id, podcast_title, host_username } = await req.json();

  if (!podcast_id || !podcast_title) {
    return new Response(JSON.stringify({ error: "podcast_id and podcast_title required" }), { status: 400 });
  }

  // Create a live input on Cloudflare Stream
  const cfRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/live_inputs`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${CF_TOKEN}`,
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
    return new Response(JSON.stringify({ error: "Cloudflare error", details: cfData.errors }), { status: 500 });
  }

  const input = cfData.result;
  const rtmpUrl = input.rtmps?.url;
  const streamKey = input.rtmps?.streamKey;
  const cfInputId = input.uid;
  const playbackUrl = `https://customer-i1lj9522l179k.cloudflarestream.com/${cfInputId}/manifest/video.m3u8`;

  return new Response(JSON.stringify({
    success: true,
    rtmp_url: rtmpUrl,
    stream_key: streamKey,
    playback_url: playbackUrl,
    cf_input_id: cfInputId,
    podcast_id,
  }), { status: 200 });
}
