// ⛔ LOCKED — ProfileVideoPlayer.jsx
// DO NOT MODIFY unless fixing a ProfileVideoPlayer-specific bug.
// Last verified working: 2026-05-23
// Updated 2026-07-05: Added photo post support (render <img> for JPEG/PNG posts)

import React, { useState, useEffect, useRef } from "react";
import { formatDate, resolveMediaUrl } from "./utils.jsx";

function isImageUrl(u) {
  return /\.(jpg|jpeg|png|webp|gif|bmp|heic)(\?|$)/i.test(u || "");
}

function isVideoUrl(u) {
  return /\.(mp4|mov|webm|m4v|avi|mkv)(\?|$)/i.test(u || "");
}

function getPhotoUrls(v) {
  if (!v) return null;
  const vurl = resolveMediaUrl(v.video_url);
  if (isVideoUrl(vurl)) return null;
  let parsedPhotos = null;
  if (v.photo_urls) {
    let arr = v.photo_urls;
    if (typeof arr === "string") { try { arr = JSON.parse(arr); } catch(e) { arr = []; } }
    if (Array.isArray(arr)) {
      parsedPhotos = arr.filter(u => u && typeof u === "string" && u.trim() && !isVideoUrl(u));
      if (parsedPhotos.length === 0) parsedPhotos = null;
    }
  }
  const looksLikeImage = isImageUrl(vurl);
  const isPhotoPost = v.is_photo || parsedPhotos || looksLikeImage;
  if (!isPhotoPost) return null;
  if (parsedPhotos) return parsedPhotos.map(resolveMediaUrl);
  return vurl ? [vurl] : null;
}

function ProfileVideoPlayer({ videos: vids, startIndex, onClose, profile, username }) {
  const [idx, setIdx] = React.useState(startIndex || 0);
  const [muted, setMuted] = React.useState(false);
  const [photoIdx, setPhotoIdx] = React.useState(0);
  const videoRef = React.useRef(null);
  const touchStartY = React.useRef(null);
  const touchStartX = React.useRef(null);

  const v = vids[idx];
  const photoUrls = getPhotoUrls(v);
  const isPhoto = !!photoUrls;

  React.useEffect(() => {
    setPhotoIdx(0);
    if (videoRef.current && !isPhoto) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [idx, isPhoto]);

  const goNext = () => { if (idx < vids.length - 1) setIdx(i => i + 1); };
  const goPrev = () => { if (idx > 0) setIdx(i => i - 1); };

  const onTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    // Horizontal swipe = photo navigation (photos only)
    if (isPhoto && photoUrls.length > 1 && Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        setPhotoIdx(p => Math.min(p + 1, photoUrls.length - 1));
      } else {
        setPhotoIdx(p => Math.max(p - 1, 0));
      }
      touchStartY.current = null;
      touchStartX.current = null;
      return;
    }
    // Vertical swipe = next/prev video
    if (Math.abs(diffY) > 50) { diffY > 0 ? goNext() : goPrev(); }
    touchStartY.current = null;
    touchStartX.current = null;
  };

  if (!v) return null;

  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      style={{ position:"fixed", inset:0, zIndex:9500, background:"#000", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>

      {/* Media — video or photo */}
      {isPhoto ? (
        <img src={photoUrls[photoIdx] || photoUrls[0]} alt=""
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"contain" }} />
      ) : (
        <video ref={videoRef} key={v.id} src={resolveMediaUrl(v.video_url)} autoPlay playsInline loop muted={muted}
          onClick={() => { if(videoRef.current.paused) videoRef.current.play(); else videoRef.current.pause(); }}
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
      )}

      {/* Gradient overlay */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)", pointerEvents:"none" }} />

      {/* Photo carousel dots (photos only, multiple images) */}
      {isPhoto && photoUrls.length > 1 && (
        <div style={{ position:"absolute", top:80, left:0, right:0, display:"flex", justifyContent:"center", gap:6, zIndex:15 }}>
          {photoUrls.map((_, i) => (
            <div key={i} style={{
              width: i === photoIdx ? 8 : 6, height: i === photoIdx ? 8 : 6, borderRadius:"50%",
              background: i === photoIdx ? "#F5C842" : "rgba(255,255,255,0.4)", transition:"all 0.2s"
            }} />
          ))}
        </div>
      )}

      {/* Top bar */}
      <div style={{ position:"absolute", top:0, left:0, right:0, display:"flex", alignItems:"center",
        padding:"calc(env(safe-area-inset-top, 20px) + 16px) 16px 16px",
        zIndex:20, background:"linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%)" }}>
        <button onClick={onClose}
          style={{ background:"rgba(0,0,0,0.55)", border:"1.5px solid rgba(255,255,255,0.25)",
            borderRadius:"50%", width:44, height:44, minWidth:44,
            color:"#fff", fontSize:22, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            WebkitTapHighlightColor:"transparent", flexShrink:0 }}>‹</button>
        <div style={{ flex:1, textAlign:"center", color:"#fff", fontWeight:800, fontSize:15, padding:"0 8px" }}>
          {profile?.display_name || username}
        </div>
        <button onClick={() => { if (!isPhoto) setMuted(m => !m); }}
          style={{ background:"rgba(0,0,0,0.55)", border:"1.5px solid rgba(255,255,255,0.25)",
            borderRadius:"50%", width:44, height:44, minWidth:44,
            color:"#fff", fontSize:18, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            WebkitTapHighlightColor:"transparent", flexShrink:0 }}>
          {isPhoto ? "🖼️" : (muted ? "🔇" : "🔊")}
        </button>
      </div>

      {/* Bottom info */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0 16px 40px", zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
          <img src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`}
            style={{ width:36, height:36, borderRadius:"50%", border:"2px solid #ff6b6b" }} />
          <div style={{ color:"#fff", fontWeight:800, fontSize:14 }}>@{username}</div>
        </div>
        {v.caption && <div style={{ color:"#fff", fontSize:13, lineHeight:1.5, marginBottom:8 }}>{v.caption}</div>}
        <div style={{ display:"flex", gap:16 }}>
          <span style={{ color:"rgba(255,255,255,0.7)", fontSize:12 }}>❤️ {v.likes_count || 0}</span>
          <span style={{ color:"rgba(255,255,255,0.7)", fontSize:12 }}>💬 {v.comments_count || 0}</span>
          <span style={{ color:"rgba(255,255,255,0.7)", fontSize:12 }}>👁 {v.views_count || 0}</span>
        </div>
      </div>

      {/* Photo nav arrows (desktop, photos only, multiple) */}
      {isPhoto && photoUrls.length > 1 && photoIdx > 0 && (
        <button onClick={() => setPhotoIdx(p => p - 1)}
          style={{ position:"absolute", top:"50%", left:12, transform:"translateY(-50%)", background:"rgba(0,0,0,0.5)",
            border:"none", borderRadius:"50%", width:40, height:40, color:"#fff", fontSize:18, cursor:"pointer", zIndex:15 }}>‹</button>
      )}
      {isPhoto && photoUrls.length > 1 && photoIdx < photoUrls.length - 1 && (
        <button onClick={() => setPhotoIdx(p => p + 1)}
          style={{ position:"absolute", top:"50%", right:12, transform:"translateY(-50%)", background:"rgba(0,0,0,0.5)",
            border:"none", borderRadius:"50%", width:40, height:40, color:"#fff", fontSize:18, cursor:"pointer", zIndex:15 }}>›</button>
      )}

      {/* Swipe hint dots */}
      <div style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", display:"flex", flexDirection:"column", gap:4, zIndex:10 }}>
        {vids.map((_, i) => (
          <div key={i} onClick={() => setIdx(i)}
            style={{ width:4, height: i === idx ? 20 : 6, borderRadius:4,
              background: i === idx ? "#ff6b6b" : "rgba(255,255,255,0.3)", cursor:"pointer",
              transition:"height 0.2s" }} />
        ))}
      </div>

      {/* Nav arrows (desktop) */}
      {!isPhoto && idx > 0 && (
        <button onClick={goPrev}
          style={{ position:"absolute", top:"50%", left:12, transform:"translateY(-50%)", background:"rgba(0,0,0,0.5)",
            border:"none", borderRadius:"50%", width:40, height:40, color:"#fff", fontSize:18, cursor:"pointer", zIndex:10 }}>↑</button>
      )}
      {!isPhoto && idx < vids.length - 1 && (
        <button onClick={goNext}
          style={{ position:"absolute", top:"50%", right:54, transform:"translateY(-50%)", background:"rgba(0,0,0,0.5)",
            border:"none", borderRadius:"50%", width:40, height:40, color:"#fff", fontSize:18, cursor:"pointer", zIndex:10 }}>↓</button>
      )}

      {/* Counter */}
      <div style={{ position:"absolute", bottom:16, right:16, color:"rgba(255,255,255,0.5)", fontSize:11, zIndex:10 }}>
        {idx + 1} / {vids.length}
      </div>
    </div>
  );
}

// ─── User Profile Sheet ───────────────────────────────────────────────────────

export default ProfileVideoPlayer;
