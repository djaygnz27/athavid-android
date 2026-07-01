// api/upload-edge.js — Edge Function streaming proxy
// WHY THIS EXISTS:
//   1. Browser -> upload.cloudflarestream.com direct POST fails in Chrome with
//      ERR_HTTP2_PROTOCOL_ERROR on real video files (confirmed via live testing
//      on 2026-07-01 -- small test files succeed, real video uploads fail).
//   2. TUS chunked PATCH is NOT supported on CF's /stream/direct_upload one-time
//      URLs -- CF returns "Basic uploads must be made using POST method" (confirmed
//      via curl testing). Real TUS creation (POST to /accounts/{id}/stream) requires
//      a Bearer token and has no CORS -- unusable directly from the browser.
//   3. The old Node.js serverless proxy (api/upload-video.js) hits Vercel's hard
//      4.5MB request body limit -- unusable for real video files.
//
// FIX: Edge Functions stream the request body (no 4.5MB cap, no full buffering).
// Browser uploads to OUR domain (same-origin -- no cross-origin CF upload
// subdomain involved), we stream-pipe it to Cloudflare server-side using a
// streaming fetch() body. Edge runtime supports this natively.

export const config = { runtime: "edge" };

const CF_ACCOUNT = "a346b1c78fc48549d2de3de99a789a2d";

export default async function handler(req) {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,X-Max-Duration,X-File-Name",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: cors });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST only" }), { status: 405, headers: cors });
  }

  const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
  if (!CF_TOKEN) {
    return new Response(JSON.stringify({ error: "CLOUDFLARE_API_TOKEN not set" }), { status: 500, headers: cors });
  }

  const url = new URL(req.url);
  const maxDuration = Math.min(parseInt(url.searchParams.get("maxDuration") || "600", 10), 1800);
  const fileName = decodeURIComponent(url.searchParams.get("fileName") || "upload.mp4");

  try {
    const sessionRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/stream/direct_upload`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${CF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ maxDurationSeconds: maxDuration, requireSignedURLs: false }),
      }
    );

    if (!sessionRes.ok) {
      const errText = await sessionRes.text();
      return new Response(JSON.stringify({ error: "CF session failed", details: errText.slice(0, 300) }), { status: 500, headers: cors });
    }

    const sessionData = await sessionRes.json();
    const uploadURL = sessionData.result.uploadURL;
    const streamUid = sessionData.result.uid;
    const subdomain = "customer-i1ij9522l179kiqc.cloudflarestream.com";

    const boundary = "SachiEdgeBoundary" + Date.now().toString(36);
    const partHead = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}"\r\nContent-Type: video/mp4\r\n\r\n`;
    const partFoot = `\r\n--${boundary}--\r\n`;

    const encoder = new TextEncoder();
    const headBytes = encoder.encode(partHead);
    const footBytes = encoder.encode(partFoot);

    const incomingBody = req.body;

    const combinedStream = new ReadableStream({
      async start(controller) {
        controller.enqueue(headBytes);
        const reader = incomingBody.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
        controller.enqueue(footBytes);
        controller.close();
      },
    });

    const uploadRes = await fetch(uploadURL, {
      method: "POST",
      headers: { "Content-Type": `multipart/form-data; boundary=${boundary}` },
      body: combinedStream,
      duplex: "half",
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text().catch(() => "");
      return new Response(JSON.stringify({ error: `CF upload rejected: HTTP ${uploadRes.status}`, details: errText.slice(0, 300) }), { status: 500, headers: cors });
    }

    return new Response(JSON.stringify({
      stream_uid:    streamUid,
      playback_url:  `https://${subdomain}/${streamUid}/manifest/video.m3u8`,
      thumbnail_url: `https://${subdomain}/${streamUid}/thumbnails/thumbnail.jpg`,
    }), { status: 200, headers: { ...cors, "Content-Type": "application/json" } });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || String(e) }), { status: 500, headers: cors });
  }
}
