import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const CF_ACCOUNT = "a346b1c78fc48549d2de3de99a789a2d";

Deno.serve(async (req) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });

  try {
    const base44 = createClientFromRequest(req);
    const CF_TOKEN = Deno.env.get("CLOUDFLARE_API_TOKEN") || "";

    if (!CF_TOKEN) {
      return Response.json({ error: "CLOUDFLARE_API_TOKEN not configured" }, { status: 500, headers });
    }

    const body = await req.json().catch(() => ({}));
    const { podcast_id, podcast_title, host_username } = body;

    if (!podcast_id || !podcast_title) {
      return Response.json({ error: "podcast_id and podcast_title required" }, { status: 400, headers });
    }

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
      return Response.json({ error: "Cloudflare error", details: cfData.errors }, { status: 500, headers });
    }

    const input = cfData.result;
    const playback_url = `https://customer-i1ij9522l179kiqc.cloudflarestream.com/${input.uid}/manifest/video.m3u8`;

    // Update the podcast record with stream credentials
    await base44.asServiceRole.entities.SachiPodcast.update(podcast_id, {
      stream_key: input.rtmps?.streamKey,
      cf_input_id: input.uid,
      rtmp_url: input.rtmps?.url,
      live_stream_url: playback_url,
    });

    return Response.json({
      success: true,
      rtmp_url: input.rtmps?.url,
      stream_key: input.rtmps?.streamKey,
      playback_url,
      cf_input_id: input.uid,
      podcast_id,
    }, { headers });

  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500, headers });
  }
});
