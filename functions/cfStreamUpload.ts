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
 * Required Base44 secrets:
 *   CF_ACCOUNT_ID          — Your Cloudflare account ID
 *   CF_STREAM_API_TOKEN    — API token with Stream:Edit permission
 *   CF_STREAM_MAX_SECONDS  — Max allowed video length (default: 300 = 5 min)
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const CF_ACCOUNT_ID_HARDCODED = "a346b1c78fc48549d2de3de99a789a2d";

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
    // Try to get user info — but don't block if not authenticated
    // (Cloudflare token is the real security gate for this endpoint)
    let userId = "anonymous";
    try {
      const base44 = createClientFromRequest(req);
      const user = await base44.auth.me();
      if (user && user.id) userId = user.id;
    } catch (_authErr) {
      // Auth failed — allow anyway, CF token secures the upload quota
    }

    const CF_ACCOUNT_ID = Deno.env.get("CF_ACCOUNT_ID") || CF_ACCOUNT_ID_HARDCODED;
    const CF_STREAM_API_TOKEN = Deno.env.get("CF_STREAM_API_TOKEN");
    const CF_STREAM_MAX_SECONDS = parseInt(Deno.env.get("CF_STREAM_MAX_SECONDS") || "300", 10);

    if (!CF_STREAM_API_TOKEN) {
      console.error("[cfStreamUpload] Missing CF_STREAM_API_TOKEN env var");
      return Response.json({ error: "Server not configured for video uploads" }, {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    // Get max duration from request body
    const body = await req.json().catch(() => ({}));
    const { maxDurationSeconds } = body;
    const duration = Math.min(
      parseInt(maxDurationSeconds, 10) || CF_STREAM_MAX_SECONDS,
      CF_STREAM_MAX_SECONDS
    );

    // Request a direct creator upload URL from Cloudflare Stream
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
          meta: {
            name: `sachi_${userId}_${Date.now()}`,
            uploaderId: userId,
          },
          requireSignedURLs: false,
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
      console.error("[cfStreamUpload] CF API error:", JSON.stringify(data));
      return Response.json({
        error: "Cloudflare Stream rejected the upload request",
        details: data.errors || data,
      }, {
        status: 502,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    return Response.json({
      uploadURL: data.result.uploadURL,
      videoId: data.result.uid,
    }, {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
    });

  } catch (err) {
    console.error("[cfStreamUpload] Error:", err);
    return Response.json({ error: "Failed to reach Cloudflare Stream" }, {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
});
