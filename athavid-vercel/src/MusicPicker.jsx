import React, { useState, useEffect, useRef, useCallback } from "react";

const APP_NAME = "SachiStream";
const AUDIUS_BASE = "https://api.audius.co/v1";

const GENRES = ["All", "Hip-Hop", "Pop", "Electronic", "R&B/Soul", "Latin", "Rock", "Metal", "Country", "Jazz", "Classical", "Reggae", "Podcasts", "Alternative", "Ambient"];

function formatDuration(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

async function fetchTrending(genre) {
  const url = genre && genre !== "All"
    ? `${AUDIUS_BASE}/tracks/trending?app_name=${APP_NAME}&limit=20&genre=${encodeURIComponent(genre)}`
    : `${AUDIUS_BASE}/tracks/trending?app_name=${APP_NAME}&limit=20`;
  const res = await fetch(url);
  const data = await res.json();
  return data.data || [];
}

async function searchTracks(query) {
  const res = await fetch(`${AUDIUS_BASE}/tracks/search?app_name=${APP_NAME}&query=${encodeURIComponent(query)}&limit=20`);
  const data = await res.json();
  return data.data || [];
}

function getStreamUrl(trackId) {
  return `${AUDIUS_BASE}/tracks/${trackId}/stream?app_name=${APP_NAME}`;
}

export default function MusicPicker({ onSelect, onClose, currentSound }) {
  const [tab, setTab] = useState("trending"); // trending | search | original
  const [genre, setGenre] = useState("All");
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [playing, setPlaying] = useState(null); // track id currently previewing
  const [originalSounds, setOriginalSounds] = useState([]);
  const audioRef = useRef(null);
  const searchTimer = useRef(null);

  // Load trending on mount / genre change
  useEffect(() => {
    if (tab !== "trending") return;
    setLoading(true);
    fetchTrending(genre)
      .then(setTracks)
      .catch(() => setTracks([]))
      .finally(() => setLoading(false));
  }, [genre, tab]);

  // Live search
  useEffect(() => {
    if (tab !== "search") return;
    clearTimeout(searchTimer.current);
    if (!searchQuery.trim()) { setTracks([]); return; }
    setSearching(true);
    searchTimer.current = setTimeout(() => {
      searchTracks(searchQuery)
        .then(setTracks)
        .catch(() => setTracks([]))
        .finally(() => setSearching(false));
    }, 400);
  }, [searchQuery, tab]);

  // Load original sounds (SachiVideo entries that have sound_url)
  useEffect(() => {
    if (tab !== "original") return;
    // Fetch from Sachi API
    fetch(`https://sachi-c7f0261c.base44.app/api/apps/69b2ee18a8e6fb58c7f0261c/entities/SachiVideo?has_sound=true&limit=50&sort=-created_date`, {
      headers: { "Content-Type": "application/json" }
    })
      .then(r => r.json())
      .then(d => {
        const all = Array.isArray(d) ? d : (d.records || d.data || []);
        // Filter to ones with a sound_url or video_url (videos have audio)
        const withSound = all.filter(v => v.sound_url || v.video_url);
        setOriginalSounds(withSound);
      })
      .catch(() => setOriginalSounds([]));
  }, [tab]);

  const stopAudio = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
    setPlaying(null);
  };

  const previewTrack = (track) => {
    if (playing === track.id) { stopAudio(); return; }
    stopAudio();
    const audio = new Audio(getStreamUrl(track.id));
    audio.volume = 0.7;
    audio.play().catch(() => {});
    audio.onended = () => setPlaying(null);
    audioRef.current = audio;
    setPlaying(track.id);
  };

  const selectAudiusTrack = (track) => {
    stopAudio();
    onSelect({
      sound_title: track.title,
      sound_artist: track.user?.name || "Unknown",
      sound_url: getStreamUrl(track.id),
      sound_artwork: track.artwork?.["150x150"] || null,
      sound_type: "audius",
      sound_id: track.id,
    });
  };

  const selectOriginalSound = (video) => {
    stopAudio();
    onSelect({
      sound_title: video.sound_title || video.caption || "Original Sound",
      sound_artist: video.display_name || video.username || "Sachi Creator",
      sound_url: video.sound_url || video.video_url,
      sound_type: "original",
      sound_id: video.id,
    });
  };

  const clearSound = () => {
    stopAudio();
    onSelect(null);
  };

  const TAB_STYLE = (active) => ({
    flex: 1, padding: "10px 4px", background: "none", border: "none",
    borderBottom: active ? "2px solid #F5C842" : "2px solid transparent",
    color: active ? "#F5C842" : "#888", fontSize: 13, fontWeight: active ? 700 : 400,
    cursor: "pointer", transition: "all 0.15s"
  });

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "flex-end" }}>
      <div style={{ width: "100%", maxHeight: "85dvh", background: "#13142A", borderRadius: "20px 20px 0 0", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>🎵 Add Music</div>
          <button onClick={() => { stopAudio(); onClose(); }} style={{ background: "none", border: "none", color: "#888", fontSize: 22, cursor: "pointer", padding: 0 }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <button style={TAB_STYLE(tab === "trending")} onClick={() => setTab("trending")}>🔥 Trending</button>
          <button style={TAB_STYLE(tab === "search")} onClick={() => setTab("search")}>🔍 Search</button>
          <button style={TAB_STYLE(tab === "original")} onClick={() => setTab("original")}>🎤 Sachi Sounds</button>
        </div>

        {/* Genre pills — only on trending */}
        {tab === "trending" && (
          <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "10px 16px", scrollbarWidth: "none" }}>
            {GENRES.map(g => (
              <button key={g} onClick={() => setGenre(g)} style={{
                flexShrink: 0, background: genre === g ? "#F5C842" : "rgba(255,255,255,0.07)",
                color: genre === g ? "#0B0C1A" : "#bbb", border: "none",
                borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: genre === g ? 700 : 400, cursor: "pointer"
              }}>{g}</button>
            ))}
          </div>
        )}

        {/* Search bar */}
        {tab === "search" && (
          <div style={{ padding: "12px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 14px", gap: 8 }}>
              <span style={{ fontSize: 16 }}>🔍</span>
              <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search songs, artists..."
                style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontSize: 15 }} />
              {searchQuery && <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 18, padding: 0 }}>✕</button>}
            </div>
          </div>
        )}

        {/* Current sound strip */}
        {currentSound && (
          <div style={{ margin: "0 16px 8px", background: "rgba(245,200,66,0.1)", border: "1px solid rgba(245,200,66,0.3)", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ color: "#F5C842", fontSize: 12, fontWeight: 700 }}>♪ Now using</div>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{currentSound.sound_title}</div>
              <div style={{ color: "#aaa", fontSize: 11 }}>{currentSound.sound_artist}</div>
            </div>
            <button onClick={clearSound} style={{ background: "rgba(255,80,80,0.15)", border: "1px solid rgba(255,80,80,0.3)", borderRadius: 8, padding: "6px 10px", color: "#ff6666", fontSize: 12, cursor: "pointer" }}>Remove</button>
          </div>
        )}

        {/* Track list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 0 20px" }}>

          {/* TRENDING / SEARCH RESULTS */}
          {(tab === "trending" || tab === "search") && (
            <>
              {(loading || searching) && (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🎵</div>
                  <div>{searching ? "Searching..." : "Loading music..."}</div>
                </div>
              )}
              {!loading && !searching && tracks.length === 0 && tab === "search" && searchQuery && (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>No results for "{searchQuery}"</div>
              )}
              {!loading && !searching && tracks.length === 0 && tab === "search" && !searchQuery && (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🎵</div>
                  <div>Type to search for music</div>
                </div>
              )}
              {!loading && !searching && tracks.map(track => {
                const isPlaying = playing === track.id;
                const artwork = track.artwork?.["150x150"];
                return (
                  <div key={track.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", background: isPlaying ? "rgba(245,200,66,0.06)" : "transparent" }}>
                    {/* Artwork */}
                    <div style={{ width: 48, height: 48, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                      {artwork ? <img src={artwork} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 20 }}>🎵</span>}
                      {isPlaying && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#F5C842", fontSize: 18 }}>▶</span></div>}
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: isPlaying ? "#F5C842" : "#fff", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{track.title}</div>
                      <div style={{ color: "#888", fontSize: 12 }}>{track.user?.name} · {formatDuration(track.duration)}</div>
                      <div style={{ color: "#555", fontSize: 11, marginTop: 1 }}>{track.genre} {track.play_count ? `· ${(track.play_count/1000).toFixed(0)}K plays` : ""}</div>
                    </div>
                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button onClick={() => previewTrack(track)} style={{ background: isPlaying ? "rgba(245,200,66,0.2)" : "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, width: 34, height: 34, cursor: "pointer", color: isPlaying ? "#F5C842" : "#ccc", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {isPlaying ? "⏸" : "▶"}
                      </button>
                      <button onClick={() => selectAudiusTrack(track)} style={{ background: "rgba(245,200,66,0.15)", border: "1px solid rgba(245,200,66,0.3)", borderRadius: 8, padding: "0 12px", height: 34, cursor: "pointer", color: "#F5C842", fontSize: 12, fontWeight: 700 }}>
                        Use
                      </button>
                    </div>
                  </div>
                );
              })}
              {/* Audius attribution */}
              {!loading && tracks.length > 0 && (
                <div style={{ textAlign: "center", padding: "12px", color: "#444", fontSize: 11 }}>
                  Music powered by <span style={{ color: "#666" }}>Audius</span> · Free & licensed for creators
                </div>
              )}
            </>
          )}

          {/* ORIGINAL / SACHI SOUNDS */}
          {tab === "original" && (
            <>
              <div style={{ padding: "12px 16px 4px" }}>
                <div style={{ color: "#888", fontSize: 13, lineHeight: 1.5 }}>
                  🎤 Sounds created by Sachi creators. Use them on your own videos.
                </div>
              </div>
              {originalSounds.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>🎤</div>
                  <div style={{ fontWeight: 700, color: "#888", marginBottom: 6 }}>No original sounds yet</div>
                  <div style={{ fontSize: 13 }}>Post a video — your audio becomes a sound other creators can use.</div>
                </div>
              ) : originalSounds.map(v => (
                <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "rgba(255,255,255,0.08)" }}>
                    {v.thumbnail_url ? <img src={v.thumbnail_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎵</div>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.sound_title || v.caption || "Original Sound"}</div>
                    <div style={{ color: "#888", fontSize: 12 }}>{v.display_name || v.username}</div>
                  </div>
                  <button onClick={() => selectOriginalSound(v)} style={{ background: "rgba(245,200,66,0.15)", border: "1px solid rgba(245,200,66,0.3)", borderRadius: 8, padding: "0 12px", height: 34, cursor: "pointer", color: "#F5C842", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                    Use
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
