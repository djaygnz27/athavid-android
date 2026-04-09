// Cloudflare Stream - Create Live Input for Sachi Podcast Hosts
// v8 FRESH DEPLOY - reuses existing cf_input_id if podcast already has one
// deployed: 2026-04-09

const CF_ACCOUNT_ID = "a346b1c78fc48549d2de3de99a789a2d";
const APP_ID = "69b2ee18a8e6fb58c7f0261c";
const BASE44_URL = "https://base44.app";
const CUSTOMER_SUBDOMAIN = "customer-i1ij9522l179kiqc.cloudflarestream.com";

export default async function handler(req: Request) {
  const CF_TOKEN = Deno.env.get("CLOUDFLARE_API_TOKEN");
  const SERVICE_TOKEN = Deno.env.get("BASE44_SERVICE_TOKEN");

  if (!CF_TOKEN) {
    return new Response(JSON.stringify({ error: "CLOUDFLARE_API_TOKEN not configured" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  const body = await req.json();
  const { podcast_id, podcast_title, host_username } = body;

  if (!podcast_id) {
    return new Response(JSON.stringify({ success: false, error: "podcast_id is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  // Step 1: Fetch existing podcast record
  let existingInputId: string | null = null;
  let existingStreamKey: string | null = null;
  let existingRtmpUrl: string | null = null;
  let existingPlaybackUrl: string | null = null;

  try {
    const podcastRes = await fetch(
      `${BASE44_URL}/api/apps/${APP_ID}/entities/SachiPodcast/${podcast_id}`,
      { headers: { "Authorization": `Bearer ${SERVICE_TOKEN}` } }
    );
    if (podcastRes.ok) {
      const p = await podcastRes.json();
      existingInputId = p.cf_input_id || null;
      existingStreamKey = p.stream_key || null;
      existingRtmpUrl = p.rtmp_url || null;
      existingPlaybackUrl = p.live_stream_url || null;
    }
  } catch (_) {}

  // Step 2: If we have one, verify it still exists on Cloudflare
  if (existingInputId) {
    try {
      const verRes = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/live_inputs/${existingInputId}`,
        { headers: { "Authorization": `Bearer ${CF_TOKEN}` } }
      );
      const verData = await verRes.json();
      if (verData.success) {
        const inp = verData.result;
        return new Response(JSON.stringify({
          success: true,
          reused: true,
          cf_input_id: existingInputId,
          rtmp_url: inp.rtmps?.url ?? existingRtmpUrl,
          stream_key: inp.rtmps?.streamKey ?? existingStreamKey,
          playback_url: existingPlaybackUrl ?? `https://${CUSTOMER_SUBDOMAIN}/${existingInputId}/manifest/video.m3u8`,
          podcast_id,
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
    } catch (_) {}
  }

  // Step 3: Create fresh Cloudflare live input
  const title = podcast_title || "Sachi Podcast";
  const cfRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/live_inputs`,
    {
      method: "POST",
      headers: { "Authorization": `Bearer ${CF_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        meta: { name: `${title} - ${host_username || "host"}` },
        recording: { mode: "automatic", timeoutSeconds: 10 },
        deleteRecordingAfterDays: 30,
      }),
    }
  );
  const cfData = await cfRes.json();
  if (!cfData.success) {
    return new Response(JSON.stringify({ error: "Cloudflare error", details: cfData.errors }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  const inp = cfData.result;
  const rtmpUrl = inp.rtmps?.url;
  const streamKey = inp.rtmps?.streamKey;
  const cfInputId = inp.uid;
  const playbackUrl = `https://${CUSTOMER_SUBDOMAIN}/${cfInputId}/manifest/video.m3u8`;

  // Step 4: Save back to database
  try {
    await fetch(
      `${BASE44_URL}/api/apps/${APP_ID}/entities/SachiPodcast/${podcast_id}`,
      {
        method: "PUT",
        headers: { "Authorization": `Bearer ${SERVICE_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ cf_input_id: cfInputId, rtmp_url: rtmpUrl, stream_key: streamKey, live_stream_url: playbackUrl }),
      }
    );
  } catch (_) {}

  return new Response(JSON.stringify({
    success: true,
    reused: false,
    cf_input_id: cfInputId,
    rtmp_url: rtmpUrl,
    stream_key: streamKey,
    playback_url: playbackUrl,
    podcast_id,
  }), { status: 200, headers: { "Content-Type": "application/json" } });
}
