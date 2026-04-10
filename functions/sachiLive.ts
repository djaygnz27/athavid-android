// sachiLive.ts — Cloudflare Calls SFU proxy for Sachi LIVE guest system
// Handles: create session, push tracks (publish), pull tracks (subscribe)

import { createClientFromRequest } from "base44/server";

const CF_ACCOUNT = "a346b1c78fc48549d2de3de99a789a2d";
const CF_CALLS_BASE = `https://rtc.live.cloudflare.com/v1/apps`;

// You need a Cloudflare Calls App ID — different from Stream
// We'll use the same API token but need a Calls App ID
// We'll create one dynamically on first use and cache it in an entity

async function getCFToken(base44: any): Promise<string> {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!token) throw new Error("CLOUDFLARE_API_TOKEN not set");
  return token;
}

async function getOrCreateCallsApp(token: string): Promise<string> {
  // Check if we have a stored Calls App ID
  const storedId = process.env.CF_CALLS_APP_ID;
  if (storedId) return storedId;

  // Create a new Calls App via Cloudflare API
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/calls/apps`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "SachiLive" }),
    }
  );
  const data = await res.json();
  if (!data.success) {
    throw new Error("Failed to create Calls app: " + JSON.stringify(data.errors));
  }
  return data.result.uid;
}

export default async function handler(req: Request) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { action, session_id, offer_sdp, track_mids, pull_sessions, app_id: callsAppId } = body;

    const token = await getCFToken(null);
    const appId = callsAppId || await getOrCreateCallsApp(token);

    const cfBase = `${CF_CALLS_BASE}/${appId}/sessions`;
    const authHeader = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    // ── Action: create new session ──────────────────────────────────────────
    if (action === "new_session") {
      const res = await fetch(`${cfBase}/new`, { method: "POST", headers: authHeader });
      const data = await res.json();
      if (!data.sessionDescription && !data.sessionId) {
        throw new Error("Session creation failed: " + JSON.stringify(data));
      }
      return new Response(JSON.stringify({ ...data, calls_app_id: appId }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // ── Action: push (publish) tracks ───────────────────────────────────────
    if (action === "push_tracks") {
      if (!session_id || !offer_sdp) throw new Error("session_id and offer_sdp required");
      const tracks = (body.tracks || []).map((t: any) => ({
        location: "local",
        mid: t.mid,
        trackName: t.trackName || t.mid,
      }));
      const res = await fetch(`${cfBase}/${session_id}/tracks/new`, {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify({ sessionDescription: { type: "offer", sdp: offer_sdp }, tracks }),
      });
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // ── Action: pull (subscribe) tracks from other sessions ─────────────────
    if (action === "pull_tracks") {
      if (!session_id) throw new Error("session_id required");
      // pull_sessions: [{ sessionId, trackName }]
      const tracks = (pull_sessions || []).map((t: any) => ({
        location: "remote",
        sessionId: t.sessionId,
        trackName: t.trackName,
      }));
      const res = await fetch(`${cfBase}/${session_id}/tracks/new`, {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify({ tracks }),
      });
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // ── Action: send ICE/renegotiation answer ───────────────────────────────
    if (action === "renegotiate") {
      if (!session_id || !body.answer_sdp) throw new Error("session_id and answer_sdp required");
      const res = await fetch(`${cfBase}/${session_id}/renegotiate`, {
        method: "PUT",
        headers: authHeader,
        body: JSON.stringify({ sessionDescription: { type: "answer", sdp: body.answer_sdp } }),
      });
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // ── Action: get Calls App ID ────────────────────────────────────────────
    if (action === "get_app_id") {
      return new Response(JSON.stringify({ calls_app_id: appId }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // ── Action: list existing Calls apps ────────────────────────────────────
    if (action === "list_apps") {
      const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/calls/apps`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    throw new Error(`Unknown action: ${action}`);
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}
