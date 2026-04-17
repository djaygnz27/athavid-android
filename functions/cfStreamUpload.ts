// cfStreamUpload — Cloudflare Stream Direct Upload (TUS)
// Generates a one-time upload URL so clients can upload video directly to Cloudflare Stream
// without routing the video through the Base44 backend.
// Usage: POST /functions/cfStreamUpload
// Body (optional): { max_duration_seconds, caption, creator_id }
// Returns: { upload_url, uid, upload_expiry }

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const CF_ACCOUNT_ID = "a346b1c78fc48549d2de3de99a789a2d";

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, {
      status: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  try {
    const CF_TOKEN = Deno.env.get("CLOUDFLARE_API_TOKEN");
    if (!CF_TOKEN) {
      return Response.json(
        { error: "CLOUDFLARE_API_TOKEN not configured" },
        { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const {
      max_duration_seconds = 3600,  // default 1 hour max
      caption = "",
      creator_id = "",
    } = body;

    // Request a direct upload URL from Cloudflare Stream (TUS protocol)
    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/direct_upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CF_TOKEN}`,
          "Content-Type": "application/json",
          "Tus-Resumable": "1.0.0",
        },
        body: JSON.stringify({
          maxDurationSeconds: max_duration_seconds,
          expiry: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min expiry
          meta: {
            name: caption || `sachi_upload_${Date.now()}`,
            ...(creator_id ? { creator: creator_id } : {}),
          },
          requireSignedURLs: false,
          allowedOrigins: ["sachistream.com", "*.sachistream.com", "localhost"],
        }),
      }
    );

    const cfData = await cfRes.json();

    if (!cfData.success) {
      console.error("Cloudflare error:", JSON.stringify(cfData.errors));
      return Response.json(
        { error: "Cloudflare API error", details: cfData.errors },
        { status: 502, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    const result = cfData.result;

    return Response.json(
      {
        success: true,
        upload_url: result.uploadURL,
        uid: result.uid,
        upload_expiry: result.watermark?.uid || null,
        playback_url: `https://customer-i1ij9522l179kiqc.cloudflarestream.com/${result.uid}/manifest/video.m3u8`,
        thumbnail_url: `https://customer-i1ij9522l179kiqc.cloudflarestream.com/${result.uid}/thumbnails/thumbnail.jpg`,
        embed_url: `https://customer-i1ij9522l179kiqc.cloudflarestream.com/${result.uid}/iframe`,
      },
      {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  } catch (error) {
    console.error("cfStreamUpload error:", error);
    return Response.json(
      { error: error.message },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
});
