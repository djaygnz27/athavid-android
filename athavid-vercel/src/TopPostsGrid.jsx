// ⛔ LOCKED — TOP POSTS HOLD-TO-PREVIEW
// DO NOT MODIFY without explicit authorization from Jay Guns.
// Lock date: 2026-06-27
// Description: 4-column grid of creator's top posts. Hold to preview video (muted, silent loop).
//              Release or lift finger to stop. Tap = open video in feed.
// Key behaviours:
//   - Thumbnail shown by default (fast, zero extra load)
//   - touchstart (300ms hold) → muted video preview plays
//   - touchend / touchcancel → video stops, thumbnail re-shown
//   - No more than 1 video plays at a time (prev is stopped before next starts)
//   - Videos stream from existing media_url / video_url — zero extra storage
//   - Gold border on every tile; gold/silver/bronze rank badge on top 3
//   - Like count centred at bottom of every tile

import React, { useRef, useCallback } from "react";

const HOLD_MS = 300; // ms before preview fires

export default function TopPostsGrid({ topPosts, fmtCount }) {
  const holdTimers = useRef({}); // tileId → setTimeout handle
  const activeVideo = useRef(null); // currently playing video element

  const stopActive = useCallback(() => {
    if (activeVideo.current) {
      activeVideo.current.pause();
      activeVideo.current.currentTime = 0;
      activeVideo.current = null;
    }
  }, []);

  const handleHoldStart = useCallback((v) => {
    const src = v.media_url || v.video_url;
    if (!src) return;
    holdTimers.current[v.id] = setTimeout(() => {
      stopActive();
      // Find the video element for this tile
      const el = document.getElementById(`top-preview-${v.id}`);
      if (el) {
        el.currentTime = 0;
        el.play().catch(() => {});
        activeVideo.current = el;
      }
    }, HOLD_MS);
  }, [stopActive]);

  const handleHoldEnd = useCallback((v) => {
    clearTimeout(holdTimers.current[v.id]);
    stopActive();
  }, [stopActive]);

  return (
    <div style={{ padding: "0 16px 20px" }}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
        🔥 <span>Your Top Posts</span>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "#555", fontWeight: 400 }}>{topPosts.length} videos</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 5 }}>
        {topPosts.map((v, i) => {
          const thumb = v.thumbnail_url || v.cover_image || `https://ui-avatars.com/api/?name=${i+1}&background=1a1b2e&color=F5C842&size=128`;
          const src = v.media_url || v.video_url;
          const rankColor = i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : "#CD7F32";

          return (
            <div
              key={v.id}
              onTouchStart={() => handleHoldStart(v)}
              onTouchEnd={() => handleHoldEnd(v)}
              onTouchCancel={() => handleHoldEnd(v)}
              onMouseDown={() => handleHoldStart(v)}
              onMouseUp={() => handleHoldEnd(v)}
              onMouseLeave={() => handleHoldEnd(v)}
              style={{
                position: "relative",
                aspectRatio: "9/13",
                borderRadius: 7,
                overflow: "hidden",
                border: "2px solid #F5C842",
                background: "#111",
                boxShadow: "0 0 6px rgba(245,200,66,0.3)",
                cursor: "pointer",
                userSelect: "none",
                WebkitUserSelect: "none",
              }}
            >
              {/* Thumbnail */}
              <img
                src={thumb}
                alt=""
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }}
              />

              {/* Hidden video — plays on hold */}
              {src && (
                <video
                  id={`top-preview-${v.id}`}
                  src={src}
                  muted
                  playsInline
                  loop
                  preload="none"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 2, opacity: 0 }}
                  onPlay={e => { e.target.style.opacity = 1; }}
                  onPause={e => { e.target.style.opacity = 0; }}
                />
              )}

              {/* Gradient overlay */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)", zIndex: 3 }} />

              {/* Like count */}
              <div style={{ position: "absolute", bottom: 4, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 2, fontSize: 10, fontWeight: 800, color: "#fff", zIndex: 4 }}>
                <span style={{ fontSize: 9 }}>❤️</span>
                {fmtCount(v.likes_count || v.like_count || 0)}
              </div>

              {/* Hold hint on first tile only */}
              {i === 0 && src && (
                <div style={{ position: "absolute", top: 4, right: 3, fontSize: 8, color: "rgba(255,255,255,0.5)", zIndex: 4, letterSpacing: 0 }}>▶ hold</div>
              )}

              {/* Rank badge */}
              {i < 3 && (
                <div style={{ position: "absolute", top: 3, left: 3, background: rankColor, borderRadius: 99, width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 900, color: "#000", zIndex: 4 }}>
                  {i + 1}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
// ⛔ LOCKED — TOP POSTS HOLD-TO-PREVIEW END
