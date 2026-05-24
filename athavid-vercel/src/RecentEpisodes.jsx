// ⛔ LOCKED — RecentEpisodes.jsx
// DO NOT MODIFY unless fixing a RecentEpisodes-specific bug.
// Last verified working: 2026-05-23

import React from "react";

function RecentEpisodes({ episodes = [], loading = false, onEpisodeClick }) {

  if (loading) return (
    <div style={{ marginTop:24, marginBottom:8 }}>
      <div style={{ color:"rgba(255,255,255,0.35)", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1.2, marginBottom:12 }}>Recent Episodes</div>
      <div style={{ color:"rgba(255,255,255,0.2)", fontSize:13, padding:"12px 0" }}>Loading...</div>
    </div>
  );

  if (!episodes || !episodes.length) return null;

  const fmtDuration = (sec) => {
    if (!sec) return "";
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <div style={{ marginTop:24, marginBottom:8 }}>
      <div style={{ color:"rgba(255,255,255,0.5)", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1.2, marginBottom:12 }}>Recent Episodes</div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {episodes.map((ep, i) => (
          <div key={ep.id || i} onClick={() => onEpisodeClick && onEpisodeClick(ep)} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"14px 16px", display:"flex", alignItems:"flex-start", gap:14, cursor:"pointer", transition:"background 0.2s" }} onMouseEnter={e=>e.currentTarget.style.background="rgba(108,60,247,0.15)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}>
            {/* Episode number bubble */}
            <div style={{ width:40, height:40, borderRadius:10, background:"linear-gradient(135deg,#6c3cf7,#4527a0)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontWeight:800, color:"#fff", fontSize:14 }}>
              {ep.episode_number || i + 1}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ color:"#fff", fontWeight:700, fontSize:14, lineHeight:1.4, marginBottom:4, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                {ep.title}
              </div>
              {ep.description && (
                <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12, lineHeight:1.5, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", marginBottom:6 }}>
                  {ep.description}
                </div>
              )}
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                {ep.duration_seconds > 0 && (
                  <span style={{ color:"rgba(255,255,255,0.3)", fontSize:11 }}>⏱ {fmtDuration(ep.duration_seconds)}</span>
                )}
                {ep.listener_count > 0 && (
                  <span style={{ color:"rgba(255,255,255,0.3)", fontSize:11 }}>🎧 {ep.listener_count}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const PODCAST_COVER_COLORS = [
  { bg:"linear-gradient(135deg,#6c3cf7,#4527a0)", emoji:"🎙️" },
  { bg:"linear-gradient(135deg,#e53935,#b71c1c)", emoji:"🔥" },
  { bg:"linear-gradient(135deg,#0288d1,#01579b)", emoji:"🌊" },
  { bg:"linear-gradient(135deg,#2e7d32,#1b5e20)", emoji:"🌿" },
  { bg:"linear-gradient(135deg,#f57c00,#e65100)", emoji:"⚡" },
  { bg:"linear-gradient(135deg,#ad1457,#880e4f)", emoji:"💫" },
  { bg:"linear-gradient(135deg,#00838f,#006064)", emoji:"🎵" },
  { bg:"linear-gradient(135deg,#4e342e,#3e2723)", emoji:"☕" },
];

export default RecentEpisodes;
