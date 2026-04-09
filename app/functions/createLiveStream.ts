import base44 from "../src/api.js";

const CF_ACCOUNT_ID = "a346b1c78fc48549d2de3de99a789a2d";
const CF_TOKEN = Deno.env.get("CLOUDFLARE_API_TOKEN");

export default async function handler(req: Request) {
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
        meta: { name: `${podcast_title} - ${host_username}` },
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
  const playbackUrl = `https://customer-i1lj9522l179k.cloudflarestream.com/${input.uid}/manifest/video.m3u8`;
  const cfInputId = input.uid;

  // Update the podcast record with stream details
  await base44.asServiceRole.entities.SachiPodcast.update(podcast_id, {
    live_stream_url: playbackUrl,
    cf_input_id: cfInputId,
    rtmp_url: rtmpUrl,
    stream_key: streamKey,
  });

  return new Response(JSON.stringify({
    success: true,
    rtmp_url: rtmpUrl,
    stream_key: streamKey,
    playback_url: playbackUrl,
    cf_input_id: cfInputId,
  }), { status: 200 });
}
