// ╔══════════════════════════════════════════════════════════════╗
// ║  VideoPlayer.jsx — LOCKED MODULE                            ║
// ║  Owns ALL video playback logic:                             ║
// ║    • HLS.js attach for Cloudflare streams                   ║
// ║    • play / pause / mute / unmute                           ║
// ║    • sound track sync (separate audio element)              ║
// ║    • mute overlay ("Tap to unmute")                         ║
// ║    • static image fallback for image-url video fields       ║
// ║                                                             ║
// ║  Props:                                                     ║
// ║    video            object  — full video record             ║
// ║    videoRef         ref     — <video> element ref           ║
// ║    soundRef         ref     — <audio> element ref           ║
// ║    muted            bool                                    ║
// ║    setMuted         fn                                      ║
// ║    playing          bool                                    ║
// ║    setPlaying       fn                                      ║
// ║    resolveMediaUrl  fn                                      ║
// ║    hideUIAfterDelay fn                                      ║
// ╚══════════════════════════════════════════════════════════════╝

import { useEffect } from "react";

export default function VideoPlayer({
  video,
  videoRef,
  soundRef,
  muted,
  setMuted,
  playing,
  setPlaying,
  resolveMediaUrl,
  hideUIAfterDelay,
  userMuted,
}) {
  // Prefer media_url (direct MP4) over video_url (HLS) — avoids ABR blur on start
  const resolvedVideoUrl = video.media_url
    ? video.media_url
    : resolveMediaUrl(video.video_url);
  const isImg = /\.(png|jpe?g|gif|webp|bmp|heic)(\?|$)/i.test(resolvedVideoUrl || "");
  // ⛔ LOCKED — isHlsUrl START
  // DO NOT modify this function without explicit permission from Jay.
  // Rule: cloudflarestream.com URLs with /downloads/ are direct MP4s — NOT HLS.
  // Changing this causes VideoPlayer to set src=undefined on MP4 links → frozen video.
  const isHlsUrl = (url) =>
    url && (
      url.endsWith(".m3u8") ||
      (url.includes("cloudflarestream.com") && !url.includes("/downloads/"))
    );
  // ⛔ LOCKED — isHlsUrl END

  // ── Attach HLS for Cloudflare .m3u8 streams ──
  // Eagerly on mount so src is ready before IntersectionObserver fires play()
  useEffect(() => {
    const el = videoRef.current;
    const url = resolvedVideoUrl;
    if (!el || !url || !isHlsUrl(url)) return;

    const tryPlay = () => {
      if (el._hlsPendingPlay) {
        el._hlsPendingPlay = false;
        el.play().catch(() => {});
      }
    };

    const attachHls = () => {
      if (!window.Hls || !window.Hls.isSupported()) return;
      if (el._hls) { try { el._hls.destroy(); } catch (e) {} el._hls = null; }
      // ⛔ Tuned 2026-07-02 — was forcing highest-bitrate-first + partial-segment
      // rendering, which is exactly what causes "blurry for a few seconds then
      // clears up": startLevel:99 forced the biggest/slowest-to-download
      // rendition immediately, abrEwmaDefaultEstimate assumed a fake 20Mbps
      // connection, and progressive:true painted incomplete segment bytes to
      // screen before they finished downloading. Result: visible macroblocking/
      // blur while the oversized segment finished arriving, every single time.
      // Fix: let hls.js's normal ABR start at a safe/complete quality level and
      // ramp up once real bandwidth is measured, and never render partial
      // segment data.
      const hls = new window.Hls({
        maxBufferLength: 60,
        maxMaxBufferLength: 120,
        startLevel: -1,                    // auto — hls.js picks a safe starting quality from real conditions
        autoLevelCapping: -1,              // no cap — still allow ramping up to any quality level
        abrEwmaDefaultEstimate: 3000000,   // realistic ~3Mbps assumption until real bandwidth is measured
        abrBandWidthFactor: 0.9,           // slight safety margin so segments finish downloading before playback catches up
        abrBandWidthUpFactor: 0.7,         // ramp up smoothly instead of instantly jumping to max
        capLevelToPlayerSize: false,       // never cap quality to screen pixel size
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 30,
        progressive: false,                // only render fully-downloaded segments — no partial/blurry frames
      });
      hls.loadSource(url);
      hls.attachMedia(el);
      hls.on(window.Hls.Events.MANIFEST_PARSED, tryPlay);
      // If _hlsPendingPlay was already set before manifest parsed, fire immediately
      if (el._hlsPendingPlay) hls.once(window.Hls.Events.LEVEL_LOADED, tryPlay);
      el._hls = hls;
    };

    // Safari / iOS — native HLS
    if (el.canPlayType("application/vnd.apple.mpegurl")) {
      if (el.src !== url) {
        el.src = url;
        el.load();
      }
      // Safari: after src set, play when ready
      const onCanPlay = () => { tryPlay(); el.removeEventListener("canplay", onCanPlay); };
      el.addEventListener("canplay", onCanPlay);
      return () => el.removeEventListener("canplay", onCanPlay);
    }

    // Chrome / Android — load hls.js
    if (window.Hls && window.Hls.isSupported()) {
      attachHls();
    } else {
      const existing = document.getElementById("hlsjs-cdn");
      if (existing) {
        existing.addEventListener("load", attachHls, { once: true });
      } else {
        const sc = document.createElement("script");
        sc.id = "hlsjs-cdn";
        sc.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.7/dist/hls.min.js";
        sc.onload = attachHls;
        document.head.appendChild(sc);
      }
    }
    return () => {
      if (el && el._hls) { try { el._hls.destroy(); } catch (e) {} el._hls = null; }
    };
  }, [video.video_url]);

  const handleUnmute = (e) => {
    e.stopPropagation();
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    setMuted(false);
    el.play().catch(() => {});
    setPlaying(true);
    hideUIAfterDelay(1500);
    if (soundRef.current && video.sound_url) soundRef.current.play().catch(() => {});
  };

  // ── Static image fallback (video_url points to an image) ──
  if (isImg) {
    return (
      <img
        src={resolvedVideoUrl}
        style={{ width: "100%", height: "100%", objectFit: "contain", background: "#000", display: "block" }}
      />
    );
  }

  return (
    <>
      {/* ── VIDEO ELEMENT ── */}
      <video
        ref={videoRef}
        src={isHlsUrl(resolvedVideoUrl) ? undefined : resolvedVideoUrl}
        poster={
          video.thumbnail_url && !video.thumbnail_url.match(/\.mp4|\.mov|\.webm/i)
            ? resolveMediaUrl(video.thumbnail_url)
            : undefined
        }
        loop
        playsInline
        preload="auto"
        muted={muted || !!video.sound_url}
        onPlay={() => {
          setPlaying(true);
          hideUIAfterDelay(1500);
          window.dispatchEvent(new CustomEvent("sachiVideoPlay"));
          if (soundRef.current && video.sound_url && !muted) {
            soundRef.current.play().catch(() => {});
          }
        }}
        onPause={() => {
          setPlaying(false);
          window.dispatchEvent(new CustomEvent("sachiVideoPause"));
          if (soundRef.current) soundRef.current.pause();
        }}
        onEnded={(e) => {
          // HLS streams don't always respect the loop attribute — force replay
          const el = e.target;
          el.currentTime = 0;
          el.play().catch(() => {});
          if (soundRef.current && video.sound_url) {
            soundRef.current.currentTime = 0;
            soundRef.current.play().catch(() => {});
          }
        }}
        style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none", display: "block", imageRendering: "high-quality", WebkitBackfaceVisibility: "hidden", backfaceVisibility: "hidden", transform: "translateZ(0)" }}
      />

      {/* ── SOUND TRACK (separate audio element) ── */}
      {video.sound_url && (
        <audio ref={soundRef} src={video.sound_url} loop preload="none" style={{ display: "none" }} />
      )}

      {/* ── MUTE OVERLAY — only shown when autoplay was force-muted (not user-muted) ── */}
      {muted && !userMuted && (
        <div
          onTouchStart={handleUnmute}
          onClick={handleUnmute}
          style={{
            position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)",
            zIndex: 200, background: "rgba(0,0,0,0.7)",
            border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20,
            padding: "6px 16px", color: "#fff", fontSize: 12, fontWeight: 700,
            letterSpacing: 1, display: "flex", alignItems: "center", gap: 6,
            cursor: "pointer", whiteSpace: "nowrap",
          }}>
          🔇 Tap to unmute
        </div>
      )}
    </>
  );
}
// This file is intentionally left blank — lock marker below
