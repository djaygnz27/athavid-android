// ╔══════════════════════════════════════════════════════════════╗
// ║  PhotoCarousel.jsx — LOCKED MODULE                          ║
// ║  Owns ALL photo carousel logic:                             ║
// ║    • left/right arrow buttons (auto-hide 5s after tap)      ║
// ║    • swipe left/right to navigate                           ║
// ║    • tap to toggle UI                                       ║
// ║    • counter badge (fades during swipe)                     ║
// ║    • sound overlay for photo posts with sound_url           ║
// ╚══════════════════════════════════════════════════════════════╝

import { useState, useRef, useEffect, useCallback } from "react";

export default function PhotoCarousel({
  photoUrls,
  resolveMediaUrl,
  soundRef,
  muted,
  setMuted,
  sound_url,
  sound_title,
  showUI,
  setShowUI,
  setShowFullCaption,
  onSwiping,
  onArrowNav,
}) {
  const [photoIdx, setPhotoIdx]     = useState(0);
  const [swiping, setSwiping]       = useState(false);
  const [arrowsVisible, setArrowsVisible] = useState(true); // arrows fade in/out
  const swipeTouchRef               = useRef(null);
  const containerRef                = useRef(null);
  const arrowTimerRef               = useRef(null);

  // Refs so stable event listeners can read latest state
  const photoUrlsRef  = useRef(photoUrls);
  const photoIdxRef   = useRef(photoIdx);
  const showUIRef     = useRef(showUI);
  useEffect(() => { photoUrlsRef.current = photoUrls; }, [photoUrls]);
  useEffect(() => { photoIdxRef.current = photoIdx; }, [photoIdx]);
  useEffect(() => { showUIRef.current = showUI; }, [showUI]);

  const goTo = useCallback((idx) => {
    setPhotoIdx(Math.max(0, Math.min(idx, photoUrls.length - 1)));
  }, [photoUrls.length]);

  // Hide arrows for 5s then fade back in
  const hideArrowsFor5s = useCallback(() => {
    setArrowsVisible(false);
    if (arrowTimerRef.current) clearTimeout(arrowTimerRef.current);
    arrowTimerRef.current = setTimeout(() => setArrowsVisible(true), 5000);
  }, []);

  // Clean up timer on unmount
  useEffect(() => () => { if (arrowTimerRef.current) clearTimeout(arrowTimerRef.current); }, []);

  // Arrow button handler
  const handleArrow = useCallback((dir, e) => {
    e.stopPropagation();
    e.preventDefault();
    const cur = photoIdxRef.current;
    const max = photoUrlsRef.current.length - 1;
    setPhotoIdx(dir === "left" ? Math.max(cur - 1, 0) : Math.min(cur + 1, max));
    hideArrowsFor5s();
    onArrowNav && onArrowNav(); // hide avatar/caption/buttons in parent
  }, [hideArrowsFor5s, onArrowNav]);

  // Native touch listeners with passive:false so preventDefault actually works
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onStart = (e) => {
      swipeTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onMove = (e) => {
      if (!swipeTouchRef.current || photoUrlsRef.current.length <= 1) return;
      const dx = Math.abs(e.touches[0].clientX - swipeTouchRef.current.x);
      const dy = Math.abs(e.touches[0].clientY - swipeTouchRef.current.y);
      if (dy > dx * 0.8) return; // vertical — let feed scroll
      if (dx > 8) {
        e.preventDefault();
        e.stopPropagation();
        setSwiping(true);
        onSwiping && onSwiping(true);
      }
    };

    const onEnd = (e) => {
      setSwiping(false);
      onSwiping && onSwiping(false);
      if (!swipeTouchRef.current) return;
      const dx = e.changedTouches[0].clientX - swipeTouchRef.current.x;
      const dy = e.changedTouches[0].clientY - swipeTouchRef.current.y;
      swipeTouchRef.current = null;

      // Horizontal swipe — navigate + hide arrows + hide parent UI
      if (photoUrlsRef.current.length > 1 && Math.abs(dx) >= 35 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        e.stopPropagation();
        const cur = photoIdxRef.current;
        const max = photoUrlsRef.current.length - 1;
        setPhotoIdx(dx < 0 ? Math.min(cur + 1, max) : Math.max(cur - 1, 0));
        hideArrowsFor5s();
        onArrowNav && onArrowNav();
        return;
      }
      // Tap — toggle UI
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
        setShowUI(v => !v);
        if (!showUIRef.current) setShowFullCaption(true);
      }
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove",  onMove,  { passive: false });
    el.addEventListener("touchend",   onEnd,   { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove",  onMove);
      el.removeEventListener("touchend",   onEnd);
    };
  }, [hideArrowsFor5s, onSwiping, setShowUI, setShowFullCaption]);

  const canGoPrev = photoIdx > 0;
  const canGoNext = photoIdx < photoUrls.length - 1;
  const isMulti   = photoUrls.length > 1;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%", height: "100%",
        position: "relative", overflow: "hidden",
        background: "#000", display: "flex", flexDirection: "column",
        touchAction: isMulti ? "none" : "pan-y",
      }}
    >
      {/* ⛔ LOCKED — PHOTO FIT (contain, not cover) START
          Photos must NEVER be cropped/zoomed to fill the frame. Non-matching
          aspect ratios (panoramas, screenshots, landscape shots) get a
          blurred cover backdrop + a fully-visible contain foreground —
          same pattern Instagram/Snapchat use. objectFit:"cover" here was
          reverted back in by a repo restore on 2026-06-25 (main-branch sync
          wiped a May 20 fix) — do NOT let that happen again. */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", pointerEvents: "auto", background: "#000" }}>
        {/* Blurred backdrop fill — avoids ugly black bars on mismatched aspect ratios */}
        <img
          src={resolveMediaUrl(photoUrls[photoIdx])}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
            filter: "blur(24px) saturate(1.3) brightness(0.55)",
            transform: "scale(1.15)",
            display: "block", pointerEvents: "none",
          }}
        />
        {/* Foreground — always fully visible, never cropped */}
        <img
          src={resolveMediaUrl(photoUrls[photoIdx])}
          alt=""
          onError={e => {
            if (!e.target.dataset.retried) {
              e.target.dataset.retried = "1";
              e.target.src = e.target.src.split("?")[0] + "?t=" + Date.now();
            } else {
              e.target.style.opacity = "0.15";
            }
          }}
          onLoad={e => {
            e.target.style.opacity = "1";
            e.target.style.filter = "none";
            delete e.target.dataset.retried;
          }}
          style={{
            position: "relative",
            width: "100%", height: "100%",
            objectFit: "contain", objectPosition: "center",
            display: "block", userSelect: "none",
            WebkitUserSelect: "none", pointerEvents: "none",
            opacity: 1, transition: "opacity 0.3s",
          }}
        />
        {/* ⛔ LOCKED — PHOTO FIT (contain, not cover) END */}

        {/* ── LEFT ARROW ── */}
        {isMulti && canGoPrev && (
          <button
            onTouchStart={e => handleArrow("left", e)}
            onClick={e => handleArrow("left", e)}
            style={{
              position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
              zIndex: 100,
              background: "rgba(0,0,0,0.45)",
              border: "1.5px solid rgba(245,200,66,0.6)",
              borderRadius: "50%",
              width: 38, height: 38,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              opacity: arrowsVisible ? 1 : 0,
              transition: "opacity 1.2s ease",
              pointerEvents: arrowsVisible ? "auto" : "none",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#F5C842" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
        )}

        {/* ── RIGHT ARROW ── */}
        {isMulti && canGoNext && (
          <button
            onTouchStart={e => handleArrow("right", e)}
            onClick={e => handleArrow("right", e)}
            style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              zIndex: 100,
              background: "rgba(0,0,0,0.45)",
              border: "1.5px solid rgba(245,200,66,0.6)",
              borderRadius: "50%",
              width: 38, height: 38,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              opacity: arrowsVisible ? 1 : 0,
              transition: "opacity 1.2s ease",
              pointerEvents: arrowsVisible ? "auto" : "none",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#F5C842" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        )}

        {/* Counter badge */}
        {isMulti && (
          <div style={{
            position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.55)", borderRadius: 20, padding: "3px 10px",
            fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.85)",
            zIndex: 50, pointerEvents: "none", letterSpacing: 0.5,
            backdropFilter: "blur(4px)",
            opacity: swiping ? 0 : 1, transition: "opacity 0.2s ease",
          }}>
            {photoIdx + 1} / {photoUrls.length}
          </div>
        )}
      </div>

      {/* ── SOUND OVERLAY ── */}
      {sound_url && (
        <>
          <audio
            ref={soundRef}
            src={sound_url}
            loop
            preload="auto"
            style={{ display: "none" }}
            onCanPlay={() => {
              if (!muted && soundRef.current) soundRef.current.play().catch(() => {});
            }}
          />

        </>
      )}
    </div>
  );
}
