/**
 * Base44 Backend Function: cfStreamUpload
 * Runtime: Deno
 *
 * Mints a one-time Cloudflare Stream Direct Upload URL for an authenticated user.
 *
 * Required env secrets (set in Base44 Secrets, attached to this function):
 *   CF_ACCOUNT_ID          — Cloudflare account ID
 *   CF_STREAM_API_TOKEN    — CF API token with Stream:Edit permission
 *
 * Auth: requires a logged-in Base44 user. Unauthenticated requests → 401.
 * This is deliberate. Do NOT make auth optional — the endpoint mints upload
 * URLs that consume paid Cloudflare resources.
 */

export default async function handler(req, res) {
  // ── Auth (required) ─────────────────────────────────────────────────────────
  // Base44's Deno runtime should populate req.user from the session cookie.
  // If you're not sure of the exact auth API on Base44, call base44.auth.me()
  // inside a try/catch — but still REQUIRE a valid user afterward.
  let user = null;
  try {
    // Option A: Base44 injects req.user (most common pattern)
    if (req.user && req.user.id) {
      user = req.user;
    } else {
      // Option B: fall back to base44.auth.me() if the global is available
      // (this is what Base44's AI referenced in its logs)
      // deno-lint-ignore no-explicit-any
      const globalBase44 = (globalThis as any).base44;
      if (globalBase44?.auth?.me) {
        user = await globalBase44.auth.me();
      }
    }
  } catch (_err) {
    // auth lookup itself threw — treat as unauthenticated
    user = null;
  }

  if (!user || !user.id) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // ── Env vars ────────────────────────────────────────────────────────────────
  const CF_ACCOUNT_ID = Deno.env.get("CF_ACCOUNT_ID");
  const CF_STREAM_API_TOKEN = Deno.env.get("CF_STREAM_API_TOKEN");
  const CF_STREAM_MAX_SECONDS = parseInt(
    Deno.env.get("CF_STREAM_MAX_SECONDS") || "300",
    10,
  );

  if (!CF_ACCOUNT_ID || !CF_STREAM_API_TOKEN) {
    console.error("[cfStreamUpload] Missing CF env vars");
    return res.status(500).json({ error: "Server not configured for video uploads" });
  }

  // ── Request body ────────────────────────────────────────────────────────────
  const { maxDurationSeconds } = req.body || {};
  const duration = Math.min(
    parseInt(maxDurationSeconds, 10) || CF_STREAM_MAX_SECONDS,
    CF_STREAM_MAX_SECONDS,
  );

  // ── Call Cloudflare Stream ──────────────────────────────────────────────────
  try {
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
            name: `sachi_${user.id}_${Date.now()}`,
            uploaderId: user.id,
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
      },
    );

    const data = await cfResponse.json();

    if (!cfResponse.ok || !data.success) {
      console.error("[cfStreamUpload] CF API error:", data);
      return res.status(502).json({
        error: "Cloudflare Stream rejected the upload request",
        details: data.errors || data,
      });
    }

    return res.status(200).json({
      uploadURL: data.result.uploadURL,
      videoId: data.result.uid,
    });
  } catch (err) {
    console.error("[cfStreamUpload] Fetch error:", err);
    return res.status(500).json({ error: "Failed to reach Cloudflare Stream" });
  }
}
