// ╔════════════════════════════════════════════════════════════════════╗
// ║ api/spotify-add.js — "Add to Spotify" (deep-link version)           ║
// ║                                                                      ║
// ║ POST { video_id }                                                    ║
// ║   -> looks up the video's sound_title / sound_artist                ║
// ║   -> if a Spotify match is already cached, returns it instantly     ║
// ║   -> otherwise searches Spotify (Client Credentials flow — no user  ║
// ║      login needed for search) for a matching track, caches the      ║
// ║      result on the SachiVideo record, and returns it                ║
// ║                                                                      ║
// ║ Response: { status: "matched", spotify_track_id, spotify_url }      ║
// ║        or { status: "no_match" }                                    ║
// ║                                                                      ║
// ║ Requires env vars: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET          ║
// ║ (register a free app at https://developer.spotify.com/dashboard —   ║
// ║  Client Credentials flow only, no redirect URI needed)              ║
// ╚════════════════════════════════════════════════════════════════════╝

const APP_ID = "69e79122bcc8fb5a04cfb834";
const BASE_URL = "https://app.base44.com/api";
const SERVICE_TOKEN = process.env.BASE44_SERVICE_TOKEN;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Module-level token cache — survives across warm invocations of the same lambda
let cachedToken = null;
let cachedTokenExpiry = 0;

function authHeaders() {
  return { "Content-Type": "application/json", "api-key": SERVICE_TOKEN };
}

async function b44(path, opts = {}) {
  const r = await fetch(`${BASE_URL}/apps/${APP_ID}${path}`, {
    ...opts,
    headers: { ...authHeaders(), ...(opts.headers || {}) },
  });
  const data = await r.json().catch(() => null);
  if (!r.ok) throw new Error(`Base44 ${path} failed: ${r.status} ${JSON.stringify(data)}`);
  return data;
}

function normalize(res) {
  return Array.isArray(res) ? res : (res?.items || res?.data || res?.records || []);
}

async function getSpotifyToken() {
  const now = Date.now();
  if (cachedToken && now < cachedTokenExpiry) return cachedToken;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error("Spotify credentials not configured (SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET)");
  }

  const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");
  const r = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basic}`,
    },
    body: "grant_type=client_credentials",
  });
  const data = await r.json();
  if (!r.ok) throw new Error(`Spotify token request failed: ${JSON.stringify(data)}`);

  cachedToken = data.access_token;
  cachedTokenExpiry = now + (data.expires_in - 60) * 1000; // refresh 1 min early
  return cachedToken;
}

// Very light cleanup — strips common noise from user-uploaded sound titles
// (e.g. "(Official Audio)", "ft.", trailing platform tags) to improve match odds.
function cleanForSearch(str) {
  if (!str) return "";
  return str
    .replace(/\(.*?\)/g, "")
    .replace(/\[.*?\]/g, "")
    .replace(/official\s*(audio|video|music video)?/gi, "")
    .replace(/lyrics?/gi, "")
    .trim();
}

async function searchSpotifyTrack(title, artist) {
  const token = await getSpotifyToken();
  const cleanTitle = cleanForSearch(title);
  const cleanArtist = cleanForSearch(artist);
  if (!cleanTitle) return null;

  const q = cleanArtist
    ? `track:${cleanTitle} artist:${cleanArtist}`
    : cleanTitle;

  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=1`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await r.json();
  if (!r.ok) throw new Error(`Spotify search failed: ${JSON.stringify(data)}`);

  const track = data?.tracks?.items?.[0];
  return track || null;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });

  try {
    const { video_id } = req.body || {};
    if (!video_id) return res.status(400).json({ error: "video_id required" });

    const videoRes = await b44(`/entities/SachiVideo/${video_id}`);
    const video = videoRes?.id ? videoRes : normalize(videoRes)[0];
    if (!video) return res.status(404).json({ error: "video not found" });

    // Already resolved — return cached result instantly
    if (video.spotify_match_status === "matched" && video.spotify_track_id) {
      return res.status(200).json({
        status: "matched",
        spotify_track_id: video.spotify_track_id,
        spotify_url: `https://open.spotify.com/track/${video.spotify_track_id}`,
      });
    }
    if (video.spotify_match_status === "no_match") {
      return res.status(200).json({ status: "no_match" });
    }

    if (!video.sound_title) {
      await b44(`/entities/SachiVideo/${video_id}`, {
        method: "PUT",
        body: JSON.stringify({ spotify_match_status: "no_match" }),
      });
      return res.status(200).json({ status: "no_match" });
    }

    const track = await searchSpotifyTrack(video.sound_title, video.sound_artist);

    if (!track) {
      await b44(`/entities/SachiVideo/${video_id}`, {
        method: "PUT",
        body: JSON.stringify({ spotify_match_status: "no_match" }),
      });
      return res.status(200).json({ status: "no_match" });
    }

    await b44(`/entities/SachiVideo/${video_id}`, {
      method: "PUT",
      body: JSON.stringify({
        spotify_track_id: track.id,
        spotify_match_status: "matched",
      }),
    });

    return res.status(200).json({
      status: "matched",
      spotify_track_id: track.id,
      spotify_url: `https://open.spotify.com/track/${track.id}`,
      matched_name: track.name,
      matched_artist: track.artists?.[0]?.name,
    });
  } catch (e) {
    console.error("spotify-add error:", e.message);
    return res.status(500).json({ error: e.message });
  }
}
