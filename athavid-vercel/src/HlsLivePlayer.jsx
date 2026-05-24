// ⛔ LOCKED — HlsLivePlayer.jsx
// DO NOT MODIFY unless fixing a HlsLivePlayer-specific bug.
// Last verified working: 2026-05-23

import React, { useState, useEffect, useRef } from "react";

function HlsLivePlayer({ src, title, onClose }) {
  const videoRef = React.useRef(null);
  const [status, setStatus] = React.useState("loading"); // loading | live | error

  React.useEffect(() => {
    if (!src || !videoRef.current) return;
    const video = videoRef.current;

    // Native HLS (Safari / iOS)
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.play().catch(() => {});
      setStatus("live");
      return;
    }

    // Load hls.js from CDN dynamically
    if (window.Hls) {
      attachHls(video, src);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js";
    script.onload = () => attachHls(video, src);
    script.onerror = () => setStatus("error");
    document.head.appendChild(script);

    function attachHls(video, src) {
      if (!window.Hls || !window.Hls.isSupported()) { setStatus("error"); return; }
      const hls = new window.Hls({ liveSyncDurationCount: 3, liveMaxLatencyDurationCount: 6 });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
        setStatus("live");
      });
      hls.on(window.Hls.Events.ERROR, (e, data) => {
        if (data.fatal) setStatus("error");
      });
      video._hls = hls;
    }

    return () => { if (video._hls) { video._hls.destroy(); video._hls = null; } };
  }, [src]);

  return (
    <div style={{ position:"fixed", top:0, left:0, width:"100vw", height:"100vh", background:"#000", zIndex:9999, display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:"rgba(0,0,0,0.85)", flexShrink:0, zIndex:1 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:10, height:10, background:"#e53935", borderRadius:"50%", animation:"pulse 1.2s infinite" }}/>
          <span style={{ color:"#fff", fontWeight:800, fontSize:15 }}>{title}</span>
          {status === "live" && <span style={{ background:"#e53935", color:"#fff", fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:6, letterSpacing:1 }}>LIVE</span>}
        </div>
        <button onClick={onClose} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", borderRadius:"50%", width:34, height:34, fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
      </div>

      {/* Player area */}
      <div style={{ flex:1, position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
        {status === "loading" && (
          <div style={{ position:"absolute", zIndex:2, display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
            <div style={{ width:44, height:44, border:"4px solid rgba(255,255,255,0.15)", borderTopColor:"#F5C842", borderRadius:"50%", animation:"spin 0.9s linear infinite" }}/>
            <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13 }}>Connecting to stream…</div>
          </div>
        )}
        {status === "error" && (
          <div style={{ position:"absolute", zIndex:2, display:"flex", flexDirection:"column", alignItems:"center", gap:12, padding:24, textAlign:"center" }}>
            <div style={{ fontSize:36 }}>📡</div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:16 }}>Stream not active yet</div>
            <div style={{ color:"rgba(255,255,255,0.45)", fontSize:13 }}>The host may not be live yet. Try again in a moment.</div>
            <button onClick={onClose} style={{ marginTop:8, padding:"10px 24px", background:"rgba(245,200,66,0.15)", border:"1px solid #F5C842", borderRadius:12, color:"#F5C842", fontWeight:700, fontSize:14, cursor:"pointer" }}>Close</button>
          </div>
        )}
        <video
          ref={videoRef}
          controls
          autoPlay
          playsInline
          style={{ width:"100%", height:"100%", objectFit:"contain", display: status === "error" ? "none" : "block" }}
        />
      </div>

      {/* Footer */}
      <div style={{ padding:"10px 16px", background:"rgba(0,0,0,0.85)", textAlign:"center", flexShrink:0 }}>
        <span style={{ color:"rgba(255,255,255,0.3)", fontSize:11 }}>🌸 Streaming live on Sachi · sachistream.com</span>
      </div>
    </div>
  );
}
// ────────────────────────────────────────────────────────────────────────────

export default HlsLivePlayer;
