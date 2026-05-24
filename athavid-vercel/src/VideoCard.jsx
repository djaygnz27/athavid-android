// ╔════════════════════════════════════════════════════════════════════╗
// ║ ⛔ LOCKED — VideoCard.jsx                                         ║
// ║ SEGREGATED SECTION — DO NOT MODIFY navigation or engagement logic ║
import PhotoCarousel from "./PhotoCarousel.jsx";
import VideoPlayer from "./VideoPlayer.jsx";
// ╚════════════════════════════════════════════════════════════════════╝
// VideoCard.jsx
// This component handles video playback, likes (hearts), follows, bookmarks, share.
// DO NOT MODIFY unless fixing a VideoCard-specific bug.
// Last verified working: 2026-05-23
// Test: heart a video, verify count updates, verify bruh toast on double-like

import React, { useState, useEffect, useRef } from "react";
import { videos, likes, follows, bookmarks, request, AthaVidUser } from "./api.js";
import { formatDate, formatCount, getStateAbbr, countryFlag, resolveMediaUrl, createNotif } from "./utils.jsx";
import ShareSheet from "./ShareSheet.jsx";
import ReportModal from "./ReportModal.jsx";

function getUserAge() {
  try {
    const dob = localStorage.getItem("sachi_dob");
    if (!dob) return null;
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age;
  } catch(e) { return null; }
}

function VideoCard({ video, currentUser, onCommentOpen, onLike, onView, onNeedAuth, onDelete, onProfileOpen, followedUserIds, onFollowChange, onShareCount, onBookmark, blockedIds }) {
  const [showShareSheet, setShowShareSheet] = React.useState(false);
  const videoRef = useRef(null);
  const soundRef = useRef(null);
  const viewedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showAlreadyLikedToast, setShowAlreadyLikedToast] = useState(false);
  const [likeRecordId, setLikeRecordId] = useState(null);
  const [showLikesPanel, setShowLikesPanel] = useState(false);
  const [likesList, setLikesList] = useState([]);
  const [likesListLoading, setLikesListLoading] = useState(false);
  // Global mute stored on window — readable by stale closures, no prop-drilling
  if (window.__sachiMuted === undefined) window.__sachiMuted = false;
  const [muted, _setMutedLocal] = useState(() => window.__sachiMuted ?? false);
  const setMuted = (val) => {
    const newVal = typeof val === 'function' ? val(window.__sachiMuted) : val;
    window.__sachiMuted = newVal;
    _setMutedLocal(newVal);
    // Broadcast to all other mounted VideoCards
    window.dispatchEvent(new CustomEvent('sachi-mute-change', { detail: newVal }));
  };
  // Listen for mute changes from other cards
  useEffect(() => {
    const handler = (e) => { _setMutedLocal(e.detail); };
    window.addEventListener('sachi-mute-change', handler);
    return () => window.removeEventListener('sachi-mute-change', handler);
  }, []);
  const [photoSwiping, setPhotoSwiping] = useState(false); // hides UI chrome during swipe (set by PhotoCarousel)
  const photoCarouselRef = useRef(null);
  const [followRecord, setFollowRecord] = useState(null);
  const isFollowing = followedUserIds ? followedUserIds.has(video.user_id || video.created_by) : !!followRecord;
  const [followLoading, setFollowLoading] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [showUI, setShowUI] = useState(false);
  const [userTapped, setUserTapped] = useState(false);
  const uiTimerRef = useRef(null);

  // Derived from video prop — must be declared before useEffect that references it
  const photoUrls = (() => {
    // HARD GUARD: video extensions are NEVER treated as photos, regardless of DB flags
    const isVideoUrl = (u) => /\.(mp4|mov|webm|m4v|avi|mkv)(\?|$)/i.test(u || "");
    const isImageUrl = (u) => /\.(jpg|jpeg|png|webp|gif|bmp|heic)(\?|$)/i.test(u || "");

    const vurl = video.video_url || "";

    // If video_url itself is a video file — this is always a video post, full stop
    if (isVideoUrl(vurl)) return null;

    // Parse photo_urls, stripping out any video files that snuck in
    let parsedPhotos = null;
    if (video.photo_urls) {
      let arr = video.photo_urls;
      if (typeof arr === "string") { try { arr = JSON.parse(arr); } catch(e) { arr = []; } }
      if (Array.isArray(arr)) {
        // Filter out any video URLs that don't belong here
        parsedPhotos = arr.filter(u => u && typeof u === "string" && u.trim() && !isVideoUrl(u));
        if (parsedPhotos.length === 0) parsedPhotos = null;
      }
    }

    // Determine if this is actually a photo post
    const looksLikeImage = isImageUrl(vurl);
    const isPhotoPost = video.is_photo || parsedPhotos || looksLikeImage;
    if (!isPhotoPost) return null;

    // Return photo sources
    if (parsedPhotos) return parsedPhotos;
    return vurl ? [vurl] : null;
  })()?.filter(u => u && typeof u === "string" && u.trim().length > 0) || null;

  // Carousel navigation via tap zones only (no swipe — feed scroll intercepts)


  const isOwnVideo = currentUser && (currentUser.id === video.user_id || currentUser.email === video.created_by || (currentUser.username && currentUser.username === video.username));
  const [ageGateUnlocked, setAgeGateUnlocked] = useState(false);
  const userAge = getUserAge();
  const isUnder18 = userAge !== null && userAge < 18;
  const showMatureBlock = video.is_mature && isUnder18 && !ageGateUnlocked;


  const hideUIAfterDelay = (delay = 2000) => {
    if (uiTimerRef.current) clearTimeout(uiTimerRef.current);
    uiTimerRef.current = setTimeout(() => {
      setShowUI(false);
      setUserTapped(false);
    }, delay);
  };

  const showUIBriefly = () => {
    setShowUI(true);
    setUserTapped(true);
    hideUIAfterDelay(2500);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => { if (uiTimerRef.current) clearTimeout(uiTimerRef.current); };
  }, []);

  // Sync video element muted attribute whenever global mute state changes
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = video.sound_url ? true : muted;
    if (soundRef.current) {
      if (muted) { soundRef.current.pause(); }
      else if (playing && video.sound_url) { soundRef.current.play().catch(() => {}); }
    }
  }, [muted]);

  // Auto-play via IntersectionObserver
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const currentlyMuted = window.__sachiMuted !== undefined ? window.__sachiMuted : false;
        el.muted = video.sound_url ? true : currentlyMuted;
        // For HLS streams: if manifest not loaded yet, flag for deferred play
        const isHlsStream = (el.src === "" || !el.src) && el._hls;
        if (isHlsStream && el.readyState < 2) {
          el._hlsPendingPlay = true;
        } else {
          el.play().catch(() => {});
        }
        setPlaying(true);
        // Start sound track if unmuted and post has music (video audio stays muted)
        if (!currentlyMuted && soundRef.current && video.sound_url) {
          soundRef.current.play().catch(() => {});
        }
        setShowUI(true);
        hideUIAfterDelay(1500);
        if (!viewedRef.current) { viewedRef.current = true; onView && onView(video.id); }
      } else {
        el.pause();
        setPlaying(false);
        if (soundRef.current) soundRef.current.pause();
        if (uiTimerRef.current) clearTimeout(uiTimerRef.current);
        setShowUI(false);
        setUserTapped(false);
      }
    }, { threshold: 0.6 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── IntersectionObserver for PHOTO posts — triggers showUI when card enters viewport ──
  React.useEffect(() => {
    if (!photoUrls) return; // only for photo posts
    const outer = document.querySelector(`[data-videoid="${video.id}"]`);
    if (!outer) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setShowUI(true);
        hideUIAfterDelay(3000);
        if (!viewedRef.current) { viewedRef.current = true; onView && onView(video.id); }
      } else {
        setShowUI(false);
      }
    }, { threshold: 0.6 });
    obs.observe(outer);
    return () => obs.disconnect();
  }, [video.id, !!photoUrls]);

  // Follow state is driven by the shared followedUserIds prop — no per-card API call needed

  // Check if current user has already liked this video
  // Uses a short-circuit: if parent passes likedByMe=true, trust it immediately
  // then confirm with DB in background (no UI flicker)
  useEffect(() => {
    if (!currentUser) return;
    // Instant pre-seed if parent already knows
    if (video._likedByMe === true && !liked) {
      setLiked(true);
    }
    // Always confirm with DB — updates likeRecordId needed for unlike
    likes.checkUserLiked(video.id, currentUser.id).then(rec => {
      if (rec) { setLiked(true); setLikeRecordId(rec.id); }
      else if (video._likedByMe !== true) { setLiked(false); setLikeRecordId(null); }
    }).catch(() => {});
  }, [video.id, currentUser?.id]);

  const doMute = () => {
    const el = videoRef.current;
    if (!el) return;
    const wasPlaying = !el.paused;
    const nm = !muted;
    el.muted = video.sound_url ? true : nm;
    setMuted(nm);
    // If video was already playing and we're unmuting, browser needs .play()
    // at this exact user-gesture moment to allow audio — but only resume if
    // it was already playing. If it was paused, do nothing extra.
    if (!nm && wasPlaying) {
      el.play().catch(() => {});
      setPlaying(true);
      hideUIAfterDelay(1500);
    }
  };



  const cancelUITimer = () => {
    if (uiTimerRef.current) clearTimeout(uiTimerRef.current);
  };

  // ── HLS attach logic lives in VideoPlayer.jsx ──

  const doTogglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setPlaying(true);
      // Immediately hide UI when resuming play
      if (uiTimerRef.current) clearTimeout(uiTimerRef.current);
      uiTimerRef.current = setTimeout(() => { setShowUI(false); }, 400);
    } else {
      el.pause();
      setPlaying(false);
      // Show controls when paused
      if (uiTimerRef.current) clearTimeout(uiTimerRef.current);
      setShowUI(true);
    }
  };

  // ⛔ LOCKED — doLike: bruh toast + verify-then-write pattern. Do not refactor.
  const likeLockedRef = React.useRef(false);
  const doLike = async () => {
    if (!currentUser) { onNeedAuth(); return; }
    // If they tap the heart when already liked — show bruh toast, don't unlike
    if (liked && !likeLockedRef.current) {
      setShowAlreadyLikedToast(true);
      setTimeout(() => setShowAlreadyLikedToast(false), 2500);
      return;
    }
    if (likeLockedRef.current || likeLoading) return;
    likeLockedRef.current = true;
    setLikeLoading(true);
    setTimeout(() => { likeLockedRef.current = false; }, 1000);
    try {
      if (liked) {
        // Unlike: delete the record
        if (likeRecordId) await likes.remove(likeRecordId, video.id, currentUser.id);
        setLiked(false);
        setLikeRecordId(null);
        onLike(video.id, -1);
      } else {
        // Like: create record
        const rec = await likes.add(
          video.id,
          currentUser.id,
          currentUser.username || currentUser.email?.split("@")[0] || "user",
          currentUser.display_name || currentUser.full_name || currentUser.username || "User",
          currentUser.avatar_url || currentUser.picture || ""
        );
        setLiked(true);
        setLikeRecordId(rec.id);
        onLike(video.id, 1);
        // notify video owner
        if (video.user_id && video.user_id !== currentUser.id) {
          createNotif({
            recipient_id: video.user_id,
            sender_id: currentUser.id,
            sender_username: currentUser.username || currentUser.email?.split("@")[0] || "user",
            sender_avatar: currentUser.avatar_url || currentUser.picture || "",
            type: "like",
            video_id: video.id,
            video_thumbnail: video.thumbnail_url || "",
            text: "liked your video"
          });
          // ⛔ LOCKED — send email notification to video owner
          // Resolve owner email from AthaVidUser table using video.user_id
          (async () => {
            try {
              const ownerRecords = await AthaVidUser.filter({ id: video.user_id });
              const ownerArr = Array.isArray(ownerRecords) ? ownerRecords : (ownerRecords?.records || ownerRecords?.items || []);
              const ownerEmail = ownerArr[0]?.email || null;
              if (ownerEmail && ownerEmail.includes("@")) {
                fetch("/api/sendEngagementEmail", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    type: "like",
                    actor_username: currentUser.username || currentUser.email?.split("@")[0] || "user",
                    video_id: video.id,
                    video_caption: video.caption || video.description || "",
                    video_thumbnail: video.thumbnail_url || "",
                    owner_id: video.user_id,
                    owner_email: ownerEmail,
                  }),
                }).catch(() => {});
              }
            } catch(e) {} // fire-and-forget, never block UI
          })();
        }
      }
    } catch(e) { console.error("like error", e); }
    setLikeLoading(false);
  };

  const openLikesPanel = async () => {
    setShowLikesPanel(true);
    setLikesListLoading(true);
    try {
      const res = await likes.getByVideo(video.id);
      const items = Array.isArray(res) ? res : (res?.records || res?.items || []);
      setLikesList(items);
    } catch(e) { setLikesList([]); }
    setLikesListLoading(false);
  };

  const doFollow = async () => {
    if (!currentUser) { onNeedAuth(); return; }
    if (isOwnVideo) return;
    setFollowLoading(true);
    try {
      if (isFollowing) {
        // Need to find the record to delete it
        try {
          const res = await follows.getFollowing(currentUser.id);
          const rec = (res.items || res || []).find(r => r.following_id === (video.user_id || video.created_by));
          if (rec) await follows.unfollow(rec.id);
        } catch(e) {}
        setFollowRecord(null);
        if (onFollowChange) onFollowChange(video.user_id || video.created_by, false);
      } else {
        const rec = await follows.follow(
          currentUser.id,
          currentUser.username || currentUser.email?.split("@")[0],
          video.user_id,
          video.username
        );
        setFollowRecord(rec);
        if (onFollowChange) onFollowChange(video.user_id || video.created_by, true);
        // notify the person being followed
        if (video.user_id && video.user_id !== currentUser.id) {
          createNotif({
            recipient_id: video.user_id,
            sender_id: currentUser.id,
            sender_username: currentUser.username || currentUser.email?.split("@")[0] || "user",
            sender_avatar: currentUser.avatar_url || currentUser.picture || "",
            type: "follow",
            text: "started following you"
          });
        }
      }
    } catch(err) { console.error(err); }
    setFollowLoading(false);
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);


  const doDelete = async () => {
    if (!currentUser || !isOwnVideo) return;
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      // Route through serverless function to bypass RLS
      const res = await fetch("/api/delete-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: video.id,
          user_id: currentUser?.id,
          username: currentUser?.username
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      onDelete && onDelete(video.id);
    } catch(err) { alert("Failed to delete. Try again."); }
  };

  const tap = (fn) => (e) => { e.stopPropagation(); fn(); };

  return (
    <div data-videoid={video.id} style={{ position:"relative", width:"100%", height:"calc(100dvh - 80px)", background:"#0B0C1A", flexShrink:0, scrollSnapAlign:"start", scrollSnapStop:"always", overflow:"hidden" }}>

      {/* ── AGE GATE OVERLAY ── */}
      {showMatureBlock && (
        <div style={{ position:"absolute", inset:0, zIndex:200, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          background:"rgba(11,12,26,0.92)", backdropFilter:"blur(20px)", gap:16, padding:32 }}>
          <div style={{ fontSize:52 }}>🔞</div>
          <div style={{ color:"#fff", fontWeight:900, fontSize:20, textAlign:"center" }}>Mature Content</div>
          <div style={{ color:"#aaa", fontSize:14, textAlign:"center", lineHeight:1.6 }}>
            This video contains content that may not be suitable for viewers under 18.
          </div>
          <div style={{ color:"#666", fontSize:12, textAlign:"center" }}>
            Content type: {video.mature_reason ? video.mature_reason.replace(/_/g," ") : "mature"}
          </div>
          {userAge === null && (
            <div style={{ color:"#F5C842", fontSize:13, textAlign:"center" }}>
              Sign in or verify your age to view this content.
            </div>
          )}
          {userAge !== null && userAge >= 18 && (
            <button onClick={() => setAgeGateUnlocked(true)}
              style={{ padding:"12px 28px", background:"linear-gradient(135deg,#ff6b6b,#ff8e53)", border:"none",
                borderRadius:14, color:"#fff", fontWeight:800, fontSize:15, cursor:"pointer" }}>
              I'm 18+ — View Anyway
            </button>
          )}
        </div>
      )}

      {/* ── MEDIA ── */}
      {photoUrls ? (
        <PhotoCarousel
          photoUrls={photoUrls}
          resolveMediaUrl={resolveMediaUrl}
          soundRef={soundRef}
          muted={muted}
          setMuted={setMuted}
          sound_url={video.sound_url}
          sound_title={video.sound_title}
          showUI={showUI}
          setShowUI={setShowUI}
          setShowFullCaption={setShowFullCaption}
          onSwiping={setPhotoSwiping}
          onArrowNav={() => {
            // Hide all UI chrome when arrow is tapped; restore after 5s
            setShowUI(false);
            if (uiTimerRef.current) clearTimeout(uiTimerRef.current);
            uiTimerRef.current = setTimeout(() => setShowUI(true), 5000);
          }}
        />
      ) : (
        <VideoPlayer
          video={video}
          videoRef={videoRef}
          soundRef={soundRef}
          muted={muted}
          setMuted={setMuted}
          playing={playing}
          setPlaying={setPlaying}
          resolveMediaUrl={resolveMediaUrl}
          hideUIAfterDelay={hideUIAfterDelay}
        />
      )}

      {/* ── GRADIENT OVERLAY (no pointer events) ── */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(11,12,26,0.95) 0%, rgba(11,12,26,0.3) 50%, transparent 80%)", pointerEvents:"none", zIndex:10, transition:"opacity 0.4s ease", opacity: (showUI || !!photoUrls) ? 1 : 0, visibility: (showUI || !!photoUrls) ? "visible" : "hidden" }} />

      {/* Tap hint removed — content-first UI */}

      {/* ── TAP: toggle UI visibility on images/photos, toggle play/pause on videos ── */}
      {/* Tap zone — video posts only; photo posts handle taps inside their own container */}
      {!photoUrls && <div onClick={tap(() => {
        const resolvedVideoUrl = resolveMediaUrl(video.video_url);
        const isImg = /\.(png|jpe?g|gif|webp|bmp|heic)(\?|$)/i.test(resolvedVideoUrl || "");
        if (isImg || !(video.video_url)) {
          setShowUI(v => !v);
          if (!showUI) setShowFullCaption(true);
        } else {
          doTogglePlay();
        }
      })}
        style={{ position:"absolute", top:60, left:0, right:0, bottom:80, zIndex:50, cursor:"pointer" }} />}



      {/* ── PLAY/PAUSE INDICATOR — videos only ── */}
      {!playing && !photoUrls && (
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none", zIndex:20 }}>
          <div onClick={tap(doTogglePlay)} style={{ background:"rgba(11,12,26,0.7)", border:"1.5px solid rgba(245,200,66,0.4)", borderRadius:"50%", width:64, height:64,
            display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"auto", cursor:"pointer", fontSize:26 }}>▶</div>
        </div>
      )}



      {/* ── BOTTOM LEFT: user info + caption ── */}
      <div style={{ position:"absolute", bottom:96, left:16, right:72, zIndex:500, transition:"opacity 0.25s ease", opacity: photoSwiping ? 0 : (showUI || !!photoUrls) ? 1 : 0, pointerEvents: (photoSwiping || !(showUI || !!photoUrls)) ? "none" : "auto", visibility: (showUI || !!photoUrls) ? "visible" : "hidden" }}>
        <div style={{ display:"flex", flexDirection:"row", alignItems:"center", gap:8, marginBottom:8, cursor:"pointer" }}
          onClick={tap(() => onProfileOpen && (video.user_id || video.created_by) && onProfileOpen(video.user_id || video.created_by, video.username || video.display_name))}>
          <div style={{ color:"#F5C842", fontWeight:800, fontSize:16, letterSpacing:-0.3 }}>{video.display_name || video.username}</div>
          <div style={{ color:"rgba(255,255,255,0.35)", fontSize:12 }}>@{video.username}</div>
        </div>
        {video.sound_title && (
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6, overflow:"hidden" }}>
          <div style={{ fontSize:14, flexShrink:0, animation: playing ? "spin 3s linear infinite" : "none", display:"inline-block" }}>🎵</div>
          <div style={{ overflow:"hidden", flex:1 }}>
            <div style={{ color:"rgba(255,255,255,0.85)", fontSize:12, fontWeight:600, whiteSpace:"nowrap",
              animation: playing ? "marquee 8s linear infinite" : "none", display:"inline-block" }}>
              {video.sound_title}{video.sound_artist ? ` · ${video.sound_artist}` : ""}
            </div>
          </div>
        </div>
      )}
      {/* Real / AI badge + date + location on same row */}
      <div style={{ display:"flex", gap:6, marginBottom:4, flexWrap:"wrap", alignItems:"center" }}>
        {!video.is_ai_detected ? (
          <span style={{ fontSize:10, background:"rgba(107,255,154,0.15)", color:"#6BFFB8", padding:"2px 9px", borderRadius:20, fontWeight:700, border:"1px solid rgba(107,255,154,0.3)" }}>
            ✓ Real
          </span>
        ) : (
          <span style={{ fontSize:10, background:"rgba(255,149,0,0.15)", color:"#FF9500", padding:"2px 9px", borderRadius:20, fontWeight:700, border:"1px solid rgba(255,149,0,0.3)" }}>
            🤖 AI Generated
          </span>
        )}
        {video.created_date && (
          <div style={{ display:"inline-flex", alignItems:"center", gap:5,
            background:"rgba(0,0,0,0.45)", borderRadius:20, padding:"3px 10px", width:"fit-content" }}>
            <span style={{ fontSize:12 }}>📅</span>
            <span style={{ color:"rgba(255,255,255,0.85)", fontSize:12, fontWeight:600 }}>
              {formatDate(video.created_date)}
              {video.post_country && (
                <span style={{ marginLeft:6, opacity:0.9 }}>
                  {countryFlag(video.post_country)}
                  {(() => {
                    const city = video.post_city || null;
                    const stateAbbr = video.post_region ? getStateAbbr(video.post_region, video.post_country) : null;
                    if (city && stateAbbr) return ` ${city}, ${stateAbbr}`;
                    if (city) return ` ${city}`;
                    if (stateAbbr) return ` ${stateAbbr}`;
                    return ` ${video.post_country}`;
                  })()}
                </span>
              )}
            </span>
          </div>
        )}
      </div>
      {video.caption && (
        <div style={{ color:"#fff", fontSize:14, lineHeight:1.5 }}>
          {showFullCaption || (video.caption || "").length <= 80
            ? video.caption
            : (video.caption || "").slice(0, 80) + "…"}
          {(video.caption || "").length > 80 && (
            <span onClick={tap(() => setShowFullCaption(v => !v))}
              style={{ color:"rgba(255,255,255,0.6)", fontSize:13, marginLeft:6, cursor:"pointer", fontWeight:600 }}>
              {showFullCaption ? "see less" : "see more"}
            </span>
          )}
        </div>
      )}
        {video.hashtags?.length > 0 && (
          <div style={{ color:"#F5C842", fontSize:13, marginTop:4 }}>
            {video.hashtags.slice(0,4).map(t => `#${t.replace(/^#/,"")}`).join(" ")}
          </div>
        )}

      </div>

      {/* ── AVATAR + FOLLOW — top left, always visible — Sachi original ── */}
      <div style={{ position:"absolute", top:72, left:14, display:"flex", flexDirection:"row", alignItems:"center", gap:10, zIndex:999 }}>
        {/* Avatar */}
        <div onClick={(e) => { e.stopPropagation(); onProfileOpen && (video.user_id || video.created_by) && onProfileOpen(video.user_id || video.created_by, video.username || video.display_name); }}
          style={{ width:22, height:22, borderRadius:"50%", overflow:"hidden", border:"1.5px solid rgba(245,200,66,0.7)", cursor:"pointer", flexShrink:0, boxShadow:"0 2px 8px rgba(0,0,0,0.5)" }}>
          <img src={video.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(video.username)}&background=random&color=fff&size=128&bold=true&format=png`}
            style={{ width:"100%", height:"100%", objectFit:"cover", pointerEvents:"none" }} />
        </div>
        {/* Follow pill — inline next to avatar */}
        {!isOwnVideo && (
          <button
            onClick={(e) => { e.stopPropagation(); doFollow(); }}
            disabled={followLoading}
            style={{
              height: 28,
              borderRadius: 20,
              border: isFollowing ? "1.5px solid #F5C842" : "1.5px solid rgba(255,255,255,0.5)",
              background: isFollowing ? "rgba(245,200,66,0.15)" : "rgba(0,0,0,0.45)",
              backdropFilter: "blur(8px)",
              color: isFollowing ? "#F5C842" : "#fff",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: 0.3,
              padding: "0 12px",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              boxShadow: isFollowing ? "0 0 10px rgba(245,200,66,0.3)" : "none",
              transition: "all 0.25s",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
            }}>
            {followLoading ? "·" : isFollowing ? "✓ Following" : "+ Follow"}
          </button>
        )}
      </div>

      {/* ── RIGHT SIDE ACTION BAR — vertical stack, TikTok style ── */}
      <div style={{ position:"absolute", right:12, bottom:12, display:"flex", flexDirection:"column", alignItems:"center", gap:10, zIndex: 500, transition:"opacity 0.25s ease", opacity: (photoSwiping) ? 0 : (showUI || !!photoUrls) ? 1 : 0, pointerEvents: (photoSwiping || !(showUI || !!photoUrls)) ? "none" : "auto", visibility: (showUI || !!photoUrls) ? "visible" : "hidden" }}>

        {/* Mute button */}
        <button onClick={tap(doMute)}
          style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3,
            WebkitTapHighlightColor:"transparent", touchAction:"manipulation" }}>
          <div style={{ width:28, height:28, borderRadius:8, background: muted ? "rgba(245,200,66,0.12)" : "rgba(255,255,255,0.08)", backdropFilter:"blur(12px)", border: muted ? "1px solid rgba(245,200,66,0.35)" : "1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}>
            {muted
              ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F5C842" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
              : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            }
          </div>
        </button>


        {/* Like */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
          {/* "Bruh" toast — shows when user taps heart on already-liked video */}
          {showAlreadyLikedToast && (
            <div style={{
              position:"absolute", bottom: 140, right: -10,
              background:"linear-gradient(135deg,rgba(30,10,30,0.97),rgba(20,5,20,0.97))",
              border:"1px solid rgba(255,107,107,0.6)",
              borderRadius:18, padding:"10px 16px",
              fontSize:13, color:"#FF6B6B", fontWeight:700,
              zIndex:9999, whiteSpace:"nowrap",
              boxShadow:"0 6px 24px rgba(255,60,60,0.3), 0 2px 8px rgba(0,0,0,0.6)",
              animation:"bruhPop 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards",
              letterSpacing:0.2
            }}>
              💀 bruh, you already liked this
            </div>
          )}
          <button onClick={tap(doLike)} disabled={likeLoading}
            style={{ background:"none", border:"none", cursor: likeLoading ? "default" : "pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3,
              WebkitTapHighlightColor:"transparent", touchAction:"manipulation", opacity: likeLoading ? 0.6 : 1 }}>
            <div style={{ width:28, height:28, borderRadius:8, background: liked ? "rgba(255,107,107,0.25)" : "rgba(255,255,255,0.08)", backdropFilter:"blur(12px)", border: liked ? "1px solid rgba(255,107,107,0.5)" : "1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center",
              animation: showAlreadyLikedToast ? "heartShake 0.4s ease" : (liked ? "heartpop 0.4s ease forwards" : "none"), transformOrigin:"center", transition:"background 0.2s, border 0.2s" }}>
              {likeLoading ? <span style={{ fontSize:10 }}>⏳</span> : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill={liked ? "#FF6B6B" : "none"} stroke="#FF6B6B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              )}
            </div>
          </button>
          <button onClick={tap(openLikesPanel)}
            style={{ background:"none", border:"none", cursor:"pointer", padding:0, WebkitTapHighlightColor:"transparent" }}>
            <div style={{ color:"rgba(255,255,255,0.8)", fontSize:9, fontWeight:600, textDecoration:"underline", textDecorationColor:"rgba(255,255,255,0.3)" }}>{formatCount(video.likes_count||0)}</div>
          </button>
        </div>

        {/* Comment */}
        <button onClick={tap(() => onCommentOpen(video))}
          style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3,
            WebkitTapHighlightColor:"transparent", touchAction:"manipulation" }}>
          <div style={{ width:28, height:28, borderRadius:8, background:"rgba(255,255,255,0.08)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div style={{ color:"rgba(255,255,255,0.8)", fontSize:9, fontWeight:600 }}>{formatCount(video.comments_count)}</div>
        </button>

        {/* Share */}
        <button onClick={tap(() => setShowShareSheet(true))}
          style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3,
            WebkitTapHighlightColor:"transparent", touchAction:"manipulation" }}>
          <div style={{ width:28, height:28, borderRadius:8, background:"rgba(255,255,255,0.08)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </div>
          <div style={{ color:"rgba(255,255,255,0.8)", fontSize:9, fontWeight:600 }}>{formatCount(video.shares_count||0)}</div>
        </button>

        {/* Bookmark */}
        {currentUser && (() => {
          const isBookmarked = onBookmark?.isBookmarked?.(video.id);
          return (
            <button onClick={tap(async () => {
                if(!currentUser){ onNeedAuth && onNeedAuth(); return; }
                onBookmark?.handle && onBookmark.handle(video.id, !isBookmarked);
              })}
              style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3,
                WebkitTapHighlightColor:"transparent", touchAction:"manipulation" }}>
              <div style={{ width:28, height:28, borderRadius:8, background: isBookmarked ? "rgba(245,200,66,0.15)" : "rgba(255,255,255,0.08)", backdropFilter:"blur(12px)", border:`1px solid ${isBookmarked ? "rgba(245,200,66,0.5)" : "rgba(255,255,255,0.1)"}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill={isBookmarked ? "#F5C842" : "none"} stroke={isBookmarked ? "#F5C842" : "rgba(255,255,255,0.9)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div style={{ color: isBookmarked ? "#F5C842" : "rgba(255,255,255,0.8)", fontSize:9, fontWeight:600 }}>Save</div>
            </button>
          );
        })()}

        {/* Delete — only for own videos */}
        {isOwnVideo && (
          <button onClick={tap(doDelete)}
            style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3,
              WebkitTapHighlightColor:"transparent", touchAction:"manipulation" }}>
            <div style={{ width:28, height:28, borderRadius:8, background:"rgba(255,60,60,0.12)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,60,60,0.3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ff5555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
              </svg>
            </div>
          </button>
        )}






      </div>

      {reportTarget && <ReportModal video={reportTarget} currentUser={currentUser} onClose={() => setReportTarget(null)} />}

      {/* Likes Panel */}
      {showLikesPanel && (
        <div style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"flex-end", justifyContent:"center" }}
          onClick={() => setShowLikesPanel(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width:"100%", maxWidth:480, background:"#13142A", borderRadius:"24px 24px 0 0", padding:"0 0 40px", maxHeight:"70vh", display:"flex", flexDirection:"column" }}>
            {/* Header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 20px 14px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:18 }}>❤️</span>
                <span style={{ color:"#fff", fontWeight:800, fontSize:16 }}>
                  {likesListLoading ? "Likes" : `${likesList.length} ${likesList.length === 1 ? "Like" : "Likes"}`}
                </span>
              </div>
              <button onClick={() => setShowLikesPanel(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.5)", fontSize:22, lineHeight:1, padding:"2px 6px" }}>✕</button>
            </div>
            {/* Body */}
            <div style={{ overflowY:"auto", flex:1 }}>
              {likesListLoading ? (
                <div style={{ textAlign:"center", color:"#555", padding:40, fontSize:14 }}>Loading…</div>
              ) : likesList.length === 0 ? (
                <div style={{ textAlign:"center", padding:40 }}>
                  <div style={{ fontSize:36, marginBottom:8 }}>🤍</div>
                  <div style={{ color:"rgba(255,255,255,0.4)", fontSize:14 }}>No likes yet — be the first!</div>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column" }}>
                  {likesList.map((lk, i) => (
                    <div key={lk.id || i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                      <img
                        src={lk.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(lk.display_name || lk.username || "?")}&background=random&color=fff&size=64&bold=true&format=png`}
                        style={{ width:40, height:40, borderRadius:"50%", objectFit:"cover", flexShrink:0 }}
                      />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ color:"#fff", fontWeight:700, fontSize:14, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {lk.display_name || lk.username || "User"}
                        </div>
                        {lk.username && (
                          <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12 }}>@{lk.username}</div>
                        )}
                      </div>
                      <div style={{ color:"#FF6B6B", fontSize:16 }}>❤️</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"flex-end", justifyContent:"center" }}
          onClick={() => setShowDeleteConfirm(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width:"100%", maxWidth:480, background:"#1a1a2e", borderRadius:"24px 24px 0 0", padding:"28px 24px 48px", display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:36, marginBottom:8 }}>🗑️</div>
              <div style={{ color:"#fff", fontSize:18, fontWeight:700 }}>Delete Video?</div>
              <div style={{ color:"rgba(255,255,255,0.5)", fontSize:14, marginTop:6 }}>This can't be undone.</div>
            </div>
            <button onClick={confirmDelete}
              style={{ width:"100%", padding:"14px", background:"#ff3b30", border:"none", borderRadius:14, color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer" }}>
              Yes, Delete
            </button>
            <button onClick={() => setShowDeleteConfirm(false)}
              style={{ width:"100%", padding:"14px", background:"rgba(255,255,255,0.1)", border:"none", borderRadius:14, color:"#fff", fontSize:16, fontWeight:600, cursor:"pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ⛔ LOCKED — Share Sheet */}
      {showShareSheet && (() => {
        const shareUrl = `${window.location.origin}/post/${video.id}`;
        const storedCode = localStorage.getItem("sachi_invite_code");
        const fullShareUrl = storedCode ? `${shareUrl}?ref=${storedCode}` : shareUrl;
        return (
          <ShareSheet
            url={fullShareUrl}
            title="Sachi Stream"
            caption={video.caption || video.description || ""}
            onClose={() => setShowShareSheet(false)}
            onShared={async () => {
              setShowShareSheet(false);
              try {
                const newCount = (video.shares_count || 0) + 1;
                onShareCount && onShareCount(video.id, newCount);
                await videos.update(video.id, { shares_count: newCount });
              } catch(e) {}
            }}
          />
        );
      })()}
    </div>
  );
}


// ── Report Modal ─────────────────────────────────────────────────────────────
const REPORT_REASONS = [
  { id:"ai",       icon:"🤖", label:"AI-Generated Video",        desc:"This video was made by AI, not a real person" },
  { id:"sexual",   icon:"🔞", label:"Sexual / Explicit Content",  desc:"Contains nudity or sexual content" },
  { id:"fake",     icon:"🎭", label:"Fake / Misleading",          desc:"This video is fake or spreading misinformation" },
  { id:"spam",     icon:"📢", label:"Spam",                       desc:"Repetitive, irrelevant, or promotional spam" },
  { id:"violence", icon:"⚠️", label:"Violence / Harmful Content", desc:"Contains graphic violence or harmful acts" },
  { id:"other",    icon:"💬", label:"Other",                      desc:"Something else not listed above" },
];


export default VideoCard;
