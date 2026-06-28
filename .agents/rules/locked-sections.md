
---

## 14. ⛔ Top Posts Hold-to-Preview — TopPostsGrid.jsx

**Files:** `athavid-vercel/src/TopPostsGrid.jsx`
**Locked since:** 2026-06-27

### What's locked:
- `HOLD_MS = 300` — 300ms delay before preview fires on touchstart/mousedown
- `holdTimers` ref — keyed by video ID, cleared on touchend/cancel/mouseleave
- `activeVideo` ref — tracks the currently playing video; stops it before starting a new one
- `stopActive()` — pauses + resets currentTime, clears activeVideo ref
- `handleHoldStart(v)` — sets 300ms timer, on fire: stops active, finds DOM element by id `top-preview-${v.id}`, plays it
- `handleHoldEnd(v)` — clears timer, calls stopActive
- Video element: `muted`, `playsInline`, `loop`, `preload="none"`, `opacity:0` by default
- `onPlay` → opacity 1 (video fades in over thumbnail), `onPause` → opacity 0 (thumbnail reappears)
- Only 1 video plays at a time — `stopActive()` always called before new play
- Thumbnail `<img>` sits at zIndex 1, video at zIndex 2, gradient at 3, UI at 4
- "▶ hold" hint shown on tile #1 only

### Why it's locked:
Hold-to-preview is a UX-sensitive interaction. The two-ref system (holdTimers + activeVideo) is critical — removing either causes double-plays or videos that never stop. The opacity fade (0→1 on play, 1→0 on pause) is what makes the thumbnail reappear cleanly on release. `preload="none"` is mandatory — without it all 12 videos preload simultaneously and hammer bandwidth.

**Rule:** If any task seems to require touching this file, STOP. Ask Jay first.
