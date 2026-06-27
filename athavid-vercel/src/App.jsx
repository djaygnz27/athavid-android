// ╔════════════════════════════════════════════════════════════════════╗
// ║ ⛔ LOCKED — App.jsx (MAIN APP SHELL)                              ║
// ║ SEGREGATED SECTIONS INSIDE — see inline ⛔ LOCKED markers         ║
// ║ Protected: hooks order, progressive load, handleLike,            ║
// ║            handleCommentCount, Orbital Arc nav, windowed feed     ║
// ║ DO NOT reorder hooks, remove prefetch logic, or touch nav         ║
// ║ Last verified: 2026-05-23                                         ║
// ║ Run: scripts/verify-before-change.sh BEFORE any modification     ║
// ╚════════════════════════════════════════════════════════════════════╝


// Sachi v2.2.0 - photo fallback fix, version auto-reload
import React, { useState, useEffect, useRef, useMemo } from "react";
import Landing from "./Landing";
import { auth, videos, comments, uploadFile, follows, request, interests, reports, bookmarks, blocks, likes, messages, notifications } from "./api.js";
import AuthModal, { initGoogleOneTap, handleGoogleRedirectCallback } from "./AuthModal.jsx";
import Terms from "./Terms.jsx";
import SachiLiveHub from "./SachiLive.jsx";
import Privacy from "./Privacy.jsx";
import ChildSafety from "./ChildSafety.jsx";
import FoundingCreatorPage from "./FoundingCreator.jsx";
import MusicPicker from "./MusicPicker.jsx";
import CommentSheet from "./CommentSheet.jsx";
import VideoCard from "./VideoCard.jsx";
import UploadModal from "./UploadModal.jsx";
import ReportModal from "./ReportModal.jsx";
import UserProfileSheet from "./UserProfileSheet.jsx";
import AdminPanel from "./AdminPanel.jsx";
import ModNavButton from "./ModNavButton.jsx";
import GoLiveModal from "./GoLiveModal.jsx";
import CreatorDashboard from "./CreatorDashboard.jsx";
import AvatarCropEditor from "./AvatarCropEditor.jsx";
import AvatarPickerModal from "./AvatarPickerModal.jsx";
import ProfileVideoPlayer from "./ProfileVideoPlayer.jsx";
import VideoManageGrid from "./VideoManageGrid.jsx";
import Toast from "./Toast.jsx";
import RecentEpisodes from "./RecentEpisodes.jsx";
import PodcastPage from "./PodcastPage.jsx";
import NotificationsPanel from "./NotificationsPanel.jsx";
import InboxPanel from "./InboxPanel.jsx";
import HlsLivePlayer from "./HlsLivePlayer.jsx";
import { formatDate, formatCount, getStateAbbr, countryFlag, resolveMediaUrl, createNotif } from "./utils.jsx";

// ── Auto-reload when new version deploys ──────────────────────────────────
const APP_VERSION = "2.2.0";
(function checkVersion() {
  const stored = localStorage.getItem("sachi_app_version");
  if (stored && stored !== APP_VERSION) {
    localStorage.setItem("sachi_app_version", APP_VERSION);
    window.location.reload(true);
  } else {
    localStorage.setItem("sachi_app_version", APP_VERSION);
  }
})();
// ─────────────────────────────────────────────────────────────────────────

// ✅ formatDate, formatCount, getStateAbbr, countryFlag → moved to utils.jsx

// ✅ CommentSheet → moved to CommentSheet.jsx (LOCKED)

// ─── GO LIVE MODAL ────────────────────────────────────────────────
// ✅ GoLiveModal → moved to src/GoLiveModal.jsx (LOCKED)

// ✅ AvatarCropEditor → moved to src/AvatarCropEditor.jsx (LOCKED)

// ✅ AvatarPickerModal → moved to src/AvatarPickerModal.jsx (LOCKED)

// ✅ ProfileVideoPlayer → moved to src/ProfileVideoPlayer.jsx (LOCKED)

// ✅ UserProfileSheet → moved to src/UserProfileSheet.jsx (LOCKED)

// ✅ VideoManageGrid → moved to src/VideoManageGrid.jsx (LOCKED)

// ✅ Toast → moved to src/Toast.jsx (LOCKED)

// ✅ RecentEpisodes → moved to src/RecentEpisodes.jsx (LOCKED)

// ✅ PodcastPage → moved to src/PodcastPage.jsx (LOCKED)

// ✅ NotificationsPanel → moved to src/NotificationsPanel.jsx (LOCKED)

// ✅ InboxPanel → moved to src/InboxPanel.jsx (LOCKED)

// ✅ AdminPanel → moved to src/AdminPanel.jsx (LOCKED)
// ✅ ModNavButton → moved to src/ModNavButton.jsx (LOCKED)

// ✅ HlsLivePlayer → moved to src/HlsLivePlayer.jsx (LOCKED)

function App() {
  // ╔════════════════════════════════════════════════════════════════════╗
  // ║ ⛔ LOCKED — SECTION: STATE & HOOKS                                ║
  // ║ ALL hooks must come before any conditional returns (Rules of Hooks)║
  // ║ Do NOT reorder, move, or add hooks after the first early return   ║
  // ╚════════════════════════════════════════════════════════════════════╝
  // Routing is handled in main.jsx Root() component, NOT here
  // ⛔ LOCKED — Progressive load states. Do not reorder or remove.
  // Stage 1: shell renders (instant)
  // Stage 2: splash shows + video prefetch starts in background
  // Stage 3: user taps Enter → feed shows with data already ready
  // Deep link: read /post/:id from URL on load
  const deepLinkPostId = (() => {
    const m = window.location.pathname.match(/^\/post\/([a-zA-Z0-9]+)/);
    return m ? m[1] : null;
  })();
  const [hasEntered, setHasEntered] = useState(() => !!deepLinkPostId); // skip splash for deep links
  const [prefetchDone, setPrefetchDone] = useState(false);
  const [deepLinkScrolled, setDeepLinkScrolled] = useState(false); // only scroll once
  const [globalIsPlaying, setGlobalIsPlaying] = useState(false);
  useEffect(() => {
    const onPlay = () => setGlobalIsPlaying(true);
    const onPause = () => setGlobalIsPlaying(false);
    window.addEventListener("sachiVideoPlay", onPlay);
    window.addEventListener("sachiVideoPause", onPause);
    return () => {
      window.removeEventListener("sachiVideoPlay", onPlay);
      window.removeEventListener("sachiVideoPause", onPause);
    };
  }, []);
  const [currentUser, setCurrentUser] = useState(() => {
    // ⛔ LOCKED — safe auth init: never crash on corrupt localStorage
    try { return auth.getUser(); } catch(e) { localStorage.removeItem("sachi_user"); return null; }
  });

  // ── Handle Google OAuth redirect callback (runs on every page load) ──
  useEffect(() => {
    handleGoogleRedirectCallback().then(result => {
      if (!result) return;
      if (result.sessionUser) {
        // Existing user — log them in directly
        setCurrentUser(result.sessionUser);
        setFeedKey(k => k + 1);
        setLoginToast(true);
        setTimeout(() => setLoginToast(false), 4000);
      } else if (result.needsProfile) {
        // New user — open modal so they can finish their profile
        setShowAuth(true);
      }
    });

    // If user clicked "Sign in" and was redirected to Google, re-open modal on return
    if (localStorage.getItem('sachi_auth_intent') && window.location.hash.includes('id_token')) {
      localStorage.removeItem('sachi_auth_intent');
    }
  }, []);

  // ⛔ LOCKED — USER ID NORMALIZER START
  // DO NOT MODIFY WITHOUT EXPLICIT PERMISSION FROM JAY
  //
  // WHY THIS EXISTS:
  // lookupSachiUser() used to query AthaVidUser (empty table) → returned null every time
  // → App fell back to stale localStorage ghost ID (69b2ee18...) instead of real SachiUser ID
  // → Likes/follows were written under ghost ID → invisible on next session → duplicates
  // → 26 of 27 follows were stored under wrong ID, causing "follow" to never persist
  //
  // WHAT IT DOES:
  // On every app load, verifies currentUser.id against the canonical SachiUser record
  // If a stale/ghost ID is detected in localStorage → silently corrects it before any writes
  // Writes corrected ID back to both sachi_user and sachi_google_user keys
  // dep array = [currentUser?.email] — runs once per email change, not on every render
  //
  // DO NOT:
  // - Remove this useEffect
  // - Change the dep array to [currentUser] (causes infinite re-render loop)
  // - Skip the canonical.id !== currentUser.id check (causes unnecessary setCurrentUser calls)
  // - Change BASE_URL or APP_ID inline — use constants at top of file
  useEffect(() => {
    if (!currentUser?.email) return;
    const normalize = async () => {
      try {
        const res = await fetch(
          `https://api.base44.com/api/apps/69e79122bcc8fb5a04cfb834/entities/SachiUser?email=${encodeURIComponent(currentUser.email)}&limit=2`,
          { headers: { "Content-Type": "application/json" } }
        );
        const data = await res.json();
        const items = Array.isArray(data) ? data : (data?.items || data?.records || []);
        const canonical = items.find(u => u.email === currentUser.email);
        if (canonical && canonical.id && canonical.id !== currentUser.id) {
          // Stale/ghost ID detected — silently correct it
          console.log("[SachiAuth] Normalizing user ID:", currentUser.id, "→", canonical.id);
          const corrected = {
            ...currentUser,
            id: canonical.id,
            full_name: canonical.full_name || currentUser.full_name,
            username: canonical.username || currentUser.username,
            avatar_url: canonical.avatar_url || currentUser.avatar_url,
            _sachiProfileId: canonical.id,
          };
          localStorage.setItem("sachi_user", JSON.stringify(corrected));
          localStorage.setItem("sachi_google_user", JSON.stringify(corrected));
          setCurrentUser(corrected);
        }
      } catch { /* silent — don't break the app if this fails */ }
    };
    normalize();
  }, [currentUser?.email]);
  // ⛔ LOCKED — USER ID NORMALIZER END

  const isAdmin = currentUser?.email === "jaygnz27@gmail.com" || currentUser?.email === "lasanjaya@gmail.com" || currentUser?.email === "shakeebjasim.mail@gmail.com" || currentUser?.email === "helloshakeeb.mail@gmail.com" || currentUser?.email === "hasini.thisaravi@gmail.com" || currentUser?.email === "henderson.keith2@gmail.com";
  const [videoList, setVideoList] = useState([]);
  const feedContainerRef = useRef(null);
  const [feedKey, setFeedKey] = React.useState(0);
  const [prevTab, setPrevTab] = React.useState(null); // tracks where user came from, for back button
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifCount, setNotifCount] = useState(0);
  const [inboxDMTarget, setInboxDMTarget] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showGoLive, setShowGoLive] = useState(false);
  const [showLiveHub, setShowLiveHub] = useState(false);
  const [profileSheet, setProfileSheet] = useState(null); // { userId, username }
  const [showSearch, setShowSearch] = useState(false);
  const [authToast, setAuthToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedTab, setFeedTab] = useState("forYou"); // forYou | following
  const [followingVideos, setFollowingVideos] = useState([]);
  const [followedUserIds, setFollowedUserIds] = useState(new Set());

  // Load all followed user IDs once on login
  React.useEffect(() => {
    if (!currentUser) { setFollowedUserIds(new Set()); return; }
    follows.getFollowing(currentUser.id, currentUser.username || currentUser.email?.split("@")[0]).then(res => {
      setFollowedUserIds(new Set((Array.isArray(res) ? res : (res?.items || res?.records || [])).map(r => r.following_id)));
    }).catch(() => {});
  }, [currentUser]);

  // Poll unread message count + notif count
  React.useEffect(() => {
    if (!currentUser) { setUnreadCount(0); setNotifCount(0); return; }
    // Reset badge immediately on user change to clear any ghost-ID stale count
    setUnreadCount(0);
    const poll = async () => {
      // Query unread by recipient_id (canonical ID) — DB has 0 messages so this should always return 0
      // If ghost ID was used before, this corrects the badge immediately
      messages.getUnreadCount(currentUser.id).then(count => {
        setUnreadCount(count);
      }).catch(() => setUnreadCount(0));
      try {
        const res = await request("GET", `/apps/69e79122bcc8fb5a04cfb834/entities/SachiNotification?recipient_id=${currentUser.id}&is_read=false&limit=50`);
        const items = Array.isArray(res) ? res : (res?.records || res?.items || []);
        setNotifCount(items.length);
      } catch(e) {}
    };
    poll();
    const iv = setInterval(poll, 20000);
    return () => clearInterval(iv);
  }, [currentUser]);

  // Expose openDM globally so profile sheet can trigger it
  React.useEffect(() => {
    window.__openDM = (userId, username, avatar) => {
      setInboxDMTarget({ userId, username, avatar, fromProfile: true });
      setActiveTab("inbox");
    };
    return () => { delete window.__openDM; };
  }, []);

  const handleFollowChange = (userId, isNowFollowing) => {
    setFollowedUserIds(prev => {
      const next = new Set(prev);
      if (isNowFollowing) next.add(userId);
      else next.delete(userId);
      return next;
    });
  };
  const [followingIds, setFollowingIds] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set()); // video_id -> bookmark record id
  const [bookmarkRecords, setBookmarkRecords] = useState({}); // video_id -> bookmark record id
  const [blockedIds, setBlockedIds] = useState(new Set()); // blocked user ids
  const [feedPage, setFeedPage] = useState(1);
  const [showInviteDashboard, setShowInviteDashboard] = useState(false);
  const [feedHasMore, setFeedHasMore] = useState(false);
  const FEED_PAGE_SIZE = 30; // ⚡ perf: load 30, auto-fetch more as user scrolls
  const [commentVideo, setCommentVideo] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0); // tracks which video is in view for windowing
  const [showUpload, setShowUpload] = useState(false);
  const [uploadToast, setUploadToast] = useState(false);
  const [loginToast, setLoginToast] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [myVideos, setMyVideos] = useState([]);
  const [meFollowersCount, setMeFollowersCount] = useState(0);
  const [meFollowingCount, setMeFollowingCount] = useState(0);
  const [showFollowersList, setShowFollowersList] = useState(false);
  const [showFollowingList, setShowFollowingList] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [followListLoading, setFollowListLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(() => {
    // Pre-load from localStorage to avoid flash on reload
    try {
      const last = localStorage.getItem('avatar_last');
      if (last) return last;
      const keys = Object.keys(localStorage).filter(k => k.startsWith('avatar_'));
      if (keys.length > 0) return localStorage.getItem(keys[0]) || null;
    } catch(e) {}
    return null;
  });
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editProfileName, setEditProfileName] = useState('');
  const [editProfileSaving, setEditProfileSaving] = useState(false);

  // ⛔ LOCKED — Invite attribution: called after successful signup to credit referrer
  async function handlePostSignup(user) {
    const code = localStorage.getItem("sachi_invite_code");
    if (code && user?.id) {
      await invites.attributeSignup(code, user.id, user.username || user.full_name);
    }
  }

  // ╔════════════════════════════════════════════════════════════════════╗
  // ║ ⛔ LOCKED — SECTION: SPLASH / PREFETCH TIMING                     ║
  // ║ Prefetch starts on mount, NOT when user taps Enter.               ║
  // ║ Do NOT move feed fetch inside onEnter — causes blank screen       ║
  // ╚════════════════════════════════════════════════════════════════════╝
  // ⛔ LOCKED — Prefetch starts on mount, NOT when user taps Enter.
  // Videos are already loaded by the time the feed is shown.
  useEffect(() => {
    loadVideos(undefined, false, 1, () => setPrefetchDone(true));
  }, []);

  // Handle Android share intent from TikTok/Instagram etc.
  useEffect(() => {
    const handleSachiShare = (e) => {
      const { type, uri, url } = e.detail || {};
      if (type === "video" || type === "url") {
        setShowUpload(true);
        // Store shared data for upload screen to pick up
        window._sachiSharedContent = { type, uri, url };
      }
    };
    window.addEventListener("sachi-share", handleSachiShare);
    return () => window.removeEventListener("sachi-share", handleSachiShare);
  }, []);
  useEffect(() => { if (currentUser) loadFollowingVideos(currentUser); }, [currentUser]);
  useEffect(() => {
    const loadAvatar = async () => {
      if (currentUser) {
        // Try to load avatar from DB first (most up to date)
        try {
          // Use authenticated request (with Bearer token) to fetch user profile
          const usersData = await request("GET", `/apps/69e79122bcc8fb5a04cfb834/entities/AthaVidUser/?email=${encodeURIComponent(currentUser.email)}`);
          const users = Array.isArray(usersData) ? usersData : (usersData.items || []);
          const match = users.find(u => u.email === currentUser.email || u.user_id === currentUser.id);
          // DB takes priority — always use latest CDN avatar_url
          if (match && match.avatar_url && !match.avatar_url.startsWith('data:')) {
            setAvatarUrl(match.avatar_url);
            localStorage.setItem(`avatar_${currentUser.id}`, match.avatar_url);
            localStorage.setItem('avatar_last', match.avatar_url);
          } else if (currentUser.avatar_url && !currentUser.avatar_url.startsWith('data:')) {
            setAvatarUrl(currentUser.avatar_url);
          } else {
            const localSaved = localStorage.getItem(`avatar_${currentUser.id}`);
            if (localSaved && !localSaved.startsWith('data:')) setAvatarUrl(localSaved);
          }
        } catch(e) {
          // Fall back to auth user avatar_url first, then localStorage
          if (currentUser.avatar_url) setAvatarUrl(currentUser.avatar_url);
          else {
            const saved = localStorage.getItem(`avatar_${currentUser.id}`);
            if (saved) setAvatarUrl(saved);
          }
        }
      }
    };
    loadAvatar();
  }, [currentUser]);

  const loadFollowingVideos = async (user) => {
    if (!user) return;
    try {
      const res = await follows.getFollowing(user.id, user.username || user.email?.split("@")[0]);
      const items = Array.isArray(res) ? res : (res?.items || res?.records || []);
      const ids = items.map(r => r.following_id);
      setFollowingIds(ids);
      if (ids.length === 0) { setFollowingVideos([]); return; }
      const allVids = await videos.list();
      const vids = (allVids.items || allVids || [])
        .filter(v => ids.includes(v.user_id))
        .map(v => ({ ...v, likes_count: v.likes_count ?? v.like_count ?? 0, comments_count: v.comments_count ?? v.comment_count ?? 0 }));
      setFollowingVideos(vids);
    } catch(e) { console.error(e); }
  };

  const loadVideos = async (user, append = false, page = 1, onReady = null) => {
    if (!append) setLoading(true);
    // ⛔ LOCKED — do NOT wipe videoList before fetch completes (causes blank feed flash)
    try {
      const skip = (page - 1) * FEED_PAGE_SIZE;
      const data = await videos.list(FEED_PAGE_SIZE, skip);
      const rawAll = Array.isArray(data) ? data : (data?.items || data?.records || []);
      // Normalize singular field names (like_count, comment_count) to plural (likes_count, comments_count)
      const normalized = rawAll.map(v => ({
        ...v,
        likes_count: v.likes_count ?? v.like_count ?? 0,
        comments_count: v.comments_count ?? v.comment_count ?? 0,
        hypes_count: v.hypes_count ?? v.hype_count ?? 0,
      }));
      const raw = normalized.filter(v => {
        if (v.is_archived) return false;
        // Strip posts with broken legacy upload URLs (old Node server — no longer exists)
        const thumb = v.thumbnail_url || "";
        const vid = v.video_url || "";
        if (thumb.includes("media.sachistream.com/uploads/")) return false;
        if (vid.includes("media.sachistream.com/uploads/") && !vid.endsWith(".mp4") && !vid.endsWith(".mov") && !vid.endsWith(".webm")) return false;
        // Strip test/junk URLs
        if (thumb.includes("test.com") || thumb.includes("test.example")) return false;
        return true;
      });
      setFeedHasMore(rawAll.length === FEED_PAGE_SIZE);
      // Only clear the list if we genuinely got zero results back — never clear optimistically
      if (!raw.length && !append) { setLoading(false); if (onReady) onReady(); return; }
      // Sort: newest first, then interleave by user (round-robin) so no one floods the feed
      const sorted = [...raw].sort((a,b) => new Date(b.created_date||0) - new Date(a.created_date||0));

      // Round-robin diversity: group posts by user, then interleave 1 post per user per round
      const ranked2 = (() => {
        const byUser = {};
        for (const v of sorted) {
          const uid = v.user_id || v.created_by || "unknown";
          if (!byUser[uid]) byUser[uid] = [];
          byUser[uid].push(v);
        }
        // Sort user buckets by their most recent post date so freshest users lead
        const userQueues = Object.values(byUser).sort((a,b) =>
          new Date(b[0].created_date||0) - new Date(a[0].created_date||0)
        );
        const result = [];
        let round = 0;
        while (result.length < sorted.length) {
          let added = 0;
          for (const queue of userQueues) {
            if (queue[round]) { result.push(queue[round]); added++; }
          }
          if (added === 0) break;
          round++;
        }
        return result;
      })();
      // Bulk-fetch liked video IDs for the current user so VideoCard initialises correctly
      const tagWithLiked = async (videos) => {
        if (!user?.id) return videos;
        try {
          const res = await request("GET", `/apps/${APP_ID}/entities/SachiLike?user_id=${user.id}&limit=500`);
          const likeRecords = Array.isArray(res) ? res : (res?.items || res?.records || []);
          const likedSet = new Set(likeRecords.map(r => r.video_id));
          return videos.map(v => likedSet.has(v.id) ? { ...v, _likedByMe: true } : v);
        } catch { return videos; }
      };

      if (append) {
        const tagged = await tagWithLiked(ranked2);
        setVideoList(prev => {
          const existing = new Set(prev.map(v => v.id));
          return [...prev, ...tagged.filter(v => !existing.has(v.id))];
        });
      } else {
        const tagged = await tagWithLiked(ranked2);
        setVideoList(tagged);
        if (onReady) onReady(); // signal prefetch complete
        requestAnimationFrame(() => {
          const el = feedContainerRef.current || window.__sachiEl;
          if (el) el.scrollTo({ top: 0, behavior: 'instant' });
        });
      }
    } catch(err) {
      console.error('loadVideos error:', err);
      // ⛔ LOCKED — never wipe the feed on a failed fetch. Keep existing posts visible.
      if (onReady) onReady(); // always unblock splash even on error
    }
    setLoading(false);
  };

  const loadMoreVideos = () => {
    if (!feedHasMore || loading) return;
    const nextPage = feedPage + 1;
    setFeedPage(nextPage);
    loadVideos(currentUser, true, nextPage);
  };

  // Load bookmarks and blocks when user logs in
  useEffect(() => {
    if (!currentUser) { setBookmarkedIds(new Set()); setBookmarkRecords({}); setBlockedIds(new Set()); return; }
    bookmarks.getByUser(currentUser.id).then(res => {
      const items = res.items || res || [];
      const ids = new Set(items.map(b => b.video_id));
      const recs = {};
      items.forEach(b => { recs[b.video_id] = b.id; });
      setBookmarkedIds(ids);
      setBookmarkRecords(recs);
    }).catch(() => {});
    blocks.getBlockedByUser(currentUser.id).then(res => {
      const items = res.items || res || [];
      setBlockedIds(new Set(items.map(b => b.blocked_id)));
    }).catch(() => {});
  }, [currentUser]);

  const handleBookmark = async (videoId, shouldBookmark) => {
    if (!currentUser) { setShowAuth(true); return; }
    if (shouldBookmark) {
      try {
        const rec = await bookmarks.add(currentUser.id, currentUser.username || currentUser.email, videoId);
        setBookmarkedIds(prev => new Set([...prev, videoId]));
        setBookmarkRecords(prev => ({ ...prev, [videoId]: rec.id }));
      } catch(e) {}
    } else {
      const recId = bookmarkRecords[videoId];
      if (recId) {
        try {
          await bookmarks.remove(recId);
          setBookmarkedIds(prev => { const n = new Set(prev); n.delete(videoId); return n; });
          setBookmarkRecords(prev => { const n = {...prev}; delete n[videoId]; return n; });
        } catch(e) {}
      }
    }
  };

  const goHome = () => {
    // If already on feed, scroll to top. Otherwise go to dashboard.
    if (activeTab === "feed") {
      setFeedPage(1);
      setFeedKey(k => k + 1);
      loadVideos(currentUser, false, 1);
    } else {
      setActiveTab(currentUser ? "dashboard" : "feed");
    }
  };

  useEffect(() => {
    if (activeTab === "profile" && currentUser) {
      // Load my videos - match by both current ID and email to catch legacy posts
      videos.myVideos(currentUser.id, currentUser.email)
        .then(r => setMyVideos(Array.isArray(r) ? r : []))
        .catch(() => setMyVideos([]));
      // Live follow counts - check both current ID and legacy username match
      const myUsername = currentUser.full_name || currentUser.email?.split("@")[0] || "";
      (async () => {
        try {
          const r1 = await request("GET", `/apps/69e79122bcc8fb5a04cfb834/entities/Follow?following_id=${currentUser.id}&limit=500`).catch(()=>null);
          const r2 = await request("GET", `/apps/69e79122bcc8fb5a04cfb834/entities/Follow?following_username=${encodeURIComponent(myUsername)}&limit=500`).catch(()=>null);
          const all = [...(r1?.items||r1||[]), ...(r2?.items||r2||[])];
          const unique = [...new Map(all.map(f => [f.id, f])).values()];
          setMeFollowersCount(unique.length);
        } catch(e) {}
      })();
      (async () => {
        try {
          const r1 = await request("GET", `/apps/69e79122bcc8fb5a04cfb834/entities/Follow?follower_id=${currentUser.id}&limit=500`).catch(()=>null);
          const r2 = await request("GET", `/apps/69e79122bcc8fb5a04cfb834/entities/Follow?follower_username=${encodeURIComponent(myUsername)}&limit=500`).catch(()=>null);
          const all = [...(r1?.items||r1||[]), ...(r2?.items||r2||[])];
          const unique = [...new Map(all.map(f => [f.id, f])).values()];
          setMeFollowingCount(unique.length);
        } catch(e) {}
      })();
    }
  }, [activeTab, currentUser]);

  // ╔════════════════════════════════════════════════════════════════════╗
  // ║ ⛔ LOCKED — SECTION: HEARTS / LIKES (handleLike)                  ║
  // ║ Uses verify-then-write against SachiLike table                    ║
  // ║ Do NOT switch to delta-only. Do NOT remove zero-write guard       ║
  // ║ Test: double-tap heart → 'bruh' toast fires, count stays correct  ║
  // ╚════════════════════════════════════════════════════════════════════╝
  // ⛔ LOCKED — handleLike: optimistic UI + verify-then-write via SachiLike ground truth. Do not change to delta-only.
  const handleLike = React.useCallback((videoId, delta) => {
    // Save scroll position before state update to prevent snap-to-top
    const feedEl = feedContainerRef.current;
    const savedScroll = feedEl ? feedEl.scrollTop : 0;

    // Optimistic UI update first — instant feedback
    setVideoList(vs => vs.map(v => {
      if (v.id !== videoId) return v;
      const optimisticCount = Math.max(0, (v.likes_count || 0) + delta);
      if (currentUser && v.hashtags?.length) {
        interests.signal(currentUser.id, v.hashtags, delta > 0 ? 3 : -1).catch(() => {});
      }
      return { ...v, likes_count: optimisticCount };
    }));

    // Restore scroll
    if (feedEl) {
      requestAnimationFrame(() => { feedEl.scrollTop = savedScroll; });
    }

    // Verify-then-write: query ground truth from SachiLike table, write back
    (async () => {
      try {
        const res = await likes.getByVideo(videoId);
        const records = Array.isArray(res) ? res : (res?.records || res?.items || []);
        const verifiedCount = records.length;
        if (verifiedCount === 0 && delta > 0) return; // safety: don't write 0 on a fresh like
        videos.update(videoId, { likes_count: verifiedCount, like_count: verifiedCount }).catch(() => {});
        // Sync UI to verified count
        setVideoList(vs => vs.map(v => v.id === videoId ? { ...v, likes_count: verifiedCount } : v));
      } catch(e) {
        // Fallback: just write delta-based count if verify fails
        setVideoList(vs => vs.map(v => {
          if (v.id !== videoId) return v;
          const fallbackCount = Math.max(0, (v.likes_count || 0));
          videos.update(videoId, { likes_count: fallbackCount, like_count: fallbackCount }).catch(() => {});
          return v;
        }));
      }
    })();
  }, [currentUser, feedContainerRef]);

  // Deep link: once videoList is populated and feed container is ready, scroll to the target post
  useEffect(() => {
    if (!deepLinkPostId || deepLinkScrolled || videoList.length === 0) return;
    const idx = videoList.findIndex(v => v.id === deepLinkPostId);
    if (idx === -1) {
      // Post not in current feed — fetch it directly and prepend so user sees it
      request("GET", `/apps/69e79122bcc8fb5a04cfb834/entities/SachiVideo/${deepLinkPostId}`)
        .then(post => {
          if (post && post.id) {
            setVideoList(prev => {
              if (prev.find(v => v.id === post.id)) return prev;
              return [post, ...prev];
            });
          }
        }).catch(() => {});
      return;
    }
    setActiveIndex(idx);
    setDeepLinkScrolled(true);
    // Use RAF to wait for DOM to be ready
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = feedContainerRef.current;
        if (el) {
          el.scrollTo({ top: idx * el.clientHeight, behavior: "instant" });
        }
        // Clean up URL so sharing again works correctly
        window.history.replaceState({}, "", "/");
      }, 100);
    });
  }, [videoList, deepLinkPostId, deepLinkScrolled]);

  const handleView = (videoId) => {
    setVideoList(vs => vs.map(v => v.id === videoId ? { ...v, views_count: (v.views_count||0)+1 } : v));
    const vid = videoList.find(v => v.id === videoId);
    if (vid) {
      videos.update(videoId, { views_count: (vid.views_count||0)+1 }).catch(()=>{});
      // Record watch signal: 1 point (weaker than a like)
      if (currentUser && vid.hashtags?.length) {
        interests.signal(currentUser.id, vid.hashtags, 1).catch(()=>{});
      }
    }
  };

  // ╔════════════════════════════════════════════════════════════════════╗
  // ║ ⛔ LOCKED — SECTION: COMMENTS (handleCommentCount)                ║
  // ║ Always receives verified DB count, never a delta                  ║
  // ║ Do NOT change to increment-only logic                             ║
  // ╚════════════════════════════════════════════════════════════════════╝
  // ⛔ LOCKED — handleCommentCount: always receives verified count from DB, never delta. Do not change.
  const handleCommentCount = (videoId, count) => {
    setVideoList(vs => vs.map(v => v.id === videoId ? { ...v, comments_count: count } : v));
  };

  const requireAuth = (cb) => { if (currentUser) { cb(); } else { setShowAuth(true); setAuthToast(true); setTimeout(() => setAuthToast(false), 3000); } };

  const username = currentUser?.full_name || currentUser?.email?.split("@")[0] || "";

  if (!hasEntered) {
    // prefetchDone=true means videos are preloaded — feed will appear instantly on Enter
    return <Landing onEnter={() => setHasEntered(true)} prefetchDone={prefetchDone} />;
  }

  return (
    <div style={{ background:"#0B0C1A", minHeight:"100svh", maxWidth:480, margin:"0 auto", position:"relative", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>

      {/* Header — Sachi original — hidden on dashboard (dashboard has its own header) */}
      <div style={{ position:"fixed", top:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, zIndex:300, display: activeTab === "dashboard" ? "none" : undefined, paddingTop:"env(safe-area-inset-top,0px)", overflow:"visible", background:"linear-gradient(to bottom, rgba(11,12,26,0.92) 0%, transparent 100%)", backdropFilter:"blur(8px)", pointerEvents:"none" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 16px 6px", pointerEvents:"auto" }}>

          {/* Left: back button (when coming from dashboard) + logo */}
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            {activeTab === "feed" && prevTab === "dashboard" && (
              <button
                onClick={() => { setPrevTab(null); setActiveTab("dashboard"); }}
                style={{ background:"none", border:"none", cursor:"pointer", padding:"4px 6px 4px 0", WebkitTapHighlightColor:"transparent", display:"flex", alignItems:"center" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F5C842" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
            )}
            <img src="/sachi-logo-new.png" alt="Sachi" style={{ width:36, height:36, borderRadius:0, objectFit:"contain", filter:"drop-shadow(0 0 8px rgba(232,64,12,0.55))" }} />
            <div style={{ display:"flex", alignItems:"baseline", gap:1 }}>
              <span style={{ fontSize:24, fontWeight:900, letterSpacing:-0.5, background:"linear-gradient(135deg,#F5C842,#FF9500)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Sachi</span>
              <span style={{ fontSize:12, fontWeight:700, color:"#F5C842", lineHeight:1, marginBottom:2 }}>™</span>
            </div>
          </div>{/* end left logo+back wrapper */}

          {/* Center: feed tabs — subtle pill style */}
          {activeTab === "feed" && (
            <div style={{ display:"flex", background:"rgba(255,255,255,0.07)", borderRadius:24, padding:3, gap:2 }}>
              <button onClick={() => { setFeedTab("following"); if(currentUser) loadFollowingVideos(currentUser); }}
                style={{ background: feedTab==="following" ? "rgba(245,200,66,0.2)" : "none", border:"none", cursor:"pointer", padding:"5px 16px",
                  color: feedTab==="following" ? "#F5C842" : "rgba(255,255,255,0.45)",
                  fontWeight: feedTab==="following" ? 700 : 500,
                  fontSize: 13, borderRadius:20, transition:"all 0.2s",
                  WebkitTapHighlightColor:"transparent" }}>
                Following
              </button>
              <button onClick={() => setFeedTab("forYou")}
                style={{ background: feedTab==="forYou" ? "rgba(245,200,66,0.2)" : "none", border:"none", cursor:"pointer", padding:"5px 16px",
                  color: feedTab==="forYou" ? "#F5C842" : "rgba(255,255,255,0.45)",
                  fontWeight: feedTab==="forYou" ? 700 : 500,
                  fontSize: 13, borderRadius:20, transition:"all 0.2s",
                  WebkitTapHighlightColor:"transparent" }}>
                For You
              </button>
            </div>
          )}
          {activeTab !== "feed" && (
            <div style={{ fontSize:16, fontWeight:800, color:"#fff", letterSpacing:0.2 }}>
              {activeTab === "profile" ? "Profile" : activeTab === "explore" ? "Explore" : activeTab === "podcast" ? "Podcasts" : ""}
            </div>
          )}

          {/* Right: search + rec */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <button onClick={() => setShowLiveHub(true)}
              style={{ background:"rgba(245,200,66,0.12)", border:"1px solid rgba(245,200,66,0.3)", borderRadius:20, padding:"4px 10px", color:"#F5C842", fontSize:11, fontWeight:700, cursor:"pointer", letterSpacing:0.3, WebkitTapHighlightColor:"transparent", display:"flex", alignItems:"center", gap:4 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#F5C842", display:"inline-block", animation:"heartbeat 1.4s ease-in-out infinite" }} />
              Live
            </button>
          </div>

        </div>
      </div>

      {/* Dashboard */}
      {activeTab === "dashboard" && currentUser && (
        <CreatorDashboard
          currentUser={currentUser}
          unreadCount={unreadCount}
          notifCount={notifCount}
          onOpenInbox={() => { setPrevTab("dashboard"); setActiveTab("inbox"); }}
          onOpenNotifications={() => { setPrevTab("dashboard"); setActiveTab("activity"); }}
          onGoToFeed={(tab) => { setFeedTab(tab); setPrevTab("dashboard"); setActiveTab("feed"); }}
        />
      )}
      {activeTab === "dashboard" && !currentUser && (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"80dvh", gap:16, padding:"0 32px" }}>
          <div style={{ fontSize:48 }}>👋</div>
          <div style={{ color:"#fff", fontWeight:800, fontSize:22 }}>Welcome to Sachi</div>
          <div style={{ color:"rgba(255,255,255,0.5)", fontSize:14, textAlign:"center", maxWidth:260 }}>Sign in to see your dashboard, stats, and start watching</div>
          <button onClick={() => setShowAuth(true)} style={{ marginTop:8, background:"linear-gradient(135deg,#F5C842,#FF8C00)", color:"#0B0C1A", fontWeight:800, fontSize:16, border:"none", borderRadius:14, padding:"14px 40px", cursor:"pointer" }}>Sign In</button>
          <button onClick={() => setActiveTab("feed")} style={{ background:"none", border:"1px solid rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.6)", fontSize:14, borderRadius:12, padding:"10px 24px", cursor:"pointer" }}>Browse Without Signing In</button>
        </div>
      )}

      {/* Feed */}
      {activeTab === "feed" && (
        <div key={feedKey} ref={el => { feedContainerRef.current = el; window.__sachiEl = el; }} onScroll={e => {
              const el = e.currentTarget;
              const idx = Math.round(el.scrollTop / el.clientHeight);
              setActiveIndex(idx);
              // ⚡ Auto-fetch next page when user is 3 cards from the end
              const feedItems = (feedTab === "forYou" ? videoList : followingVideos).filter(v => !blockedIds.has(v.user_id));
              if (feedTab === "forYou" && feedHasMore && !loading && idx >= feedItems.length - 3) {
                loadMoreVideos();
              }
            }} style={{ height:"calc(100dvh - 80px)", overflowY:"scroll", scrollSnapType:"y mandatory", isolation:"isolate", touchAction:"pan-y", overflowX:"hidden" }}>
          {feedTab === "following" && followingIds.length === 0 && (
            <div style={{ height:"100svh", display:"flex", flexDirection:"column", alignItems:"center",
              justifyContent:"center", color:"rgba(255,255,255,0.5)", gap:16, padding:32, textAlign:"center" }}>
              <div style={{ fontSize:56 }}>👥</div>
              {!currentUser ? (
                <>
                  <div style={{ fontSize:18, fontWeight:700, color:"#fff" }}>Sign in to follow people</div>
                  <div style={{ fontSize:14 }}>Create a free account to follow your favourite creators</div>
                  <button onClick={() => setShowAuth(true)}
                    style={{ marginTop:8, background:"linear-gradient(135deg,#F5C842,#FF9500)", border:"none", borderRadius:14, padding:"12px 28px", color:"#0B0C1A", fontWeight:800, fontSize:15, cursor:"pointer" }}>
                    Sign Up / Log In
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontSize:18, fontWeight:700, color:"#fff" }}>No one to show yet</div>
                  <div style={{ fontSize:14 }}>Tap <b>+ Follow</b> on any video to see their posts here</div>
                  <button onClick={() => setFeedTab("forYou")}
                    style={{ marginTop:8, background:"rgba(255,255,255,0.1)", border:"1.5px solid rgba(255,255,255,0.2)", borderRadius:14, padding:"10px 24px", color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer" }}>
                    Browse For You →
                  </button>
                </>
              )}
            </div>
          )}
          {loading && (
            <div style={{ height:"calc(100dvh - 80px)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
              <div style={{ fontSize:48 }}>🎬</div>
              <div style={{ color:"rgba(245,200,66,0.7)", fontSize:14, letterSpacing:1, fontWeight:600 }}>Loading...</div>
            </div>
          )}
          {!loading && videoList.length === 0 && (
            <div style={{ height:"calc(100dvh - 80px)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
              <div style={{ fontSize:64 }}>🎬</div>
              <div style={{ color:"#fff", fontWeight:800, fontSize:22 }}>No videos yet</div>
              <div style={{ color:"#888", fontSize:15 }}>Be the first to post!</div>
              <button onClick={() => requireAuth(() => setShowUpload(true))}
                style={{ marginTop:12, background:"linear-gradient(135deg,#F5C842,#FF9500)", border:"none", borderRadius:14, padding:"12px 28px", color:"#0B0C1A", fontWeight:800, fontSize:16, cursor:"pointer" }}>
                + Upload Video
              </button>
            </div>
          )}
          {(() => {
            // ╔══════════════════════════════════════════════════════════════════╗
            // ║ ⛔ LOCKED — WINDOWED FEED (DO NOT MODIFY WITHOUT REVIEW)          ║
            // ║  • Only renders active index ±2 cards — max 5 VideoCards in DOM  ║
            // ║  • Placeholder divs keep scroll snap geometry intact              ║
            // ║  • activeIndex is driven by onScroll on the container div         ║
            // ║  • DO NOT revert to .map() all cards — causes 200 <video> mounts  ║
            // ╚══════════════════════════════════════════════════════════════════╝
            const feedItems = (feedTab === "forYou" ? videoList : followingVideos).filter(v => !blockedIds.has(v.user_id));
            const windowStart = Math.max(0, activeIndex - 2);
            const windowEnd = Math.min(feedItems.length - 1, activeIndex + 2);
            return feedItems.map((v, idx) => {
              const inWindow = idx >= windowStart && idx <= windowEnd;
              if (!inWindow) {
                // Render a placeholder div to maintain scroll position
                return <div key={v.id} style={{ height:"calc(100dvh - 80px)", scrollSnapAlign:"start", scrollSnapStop:"always", flexShrink:0, overflow:"hidden" }} />;
              }
              return (
                <VideoCard key={v.id} video={v} currentUser={currentUser}
                  onCommentOpen={setCommentVideo}
                  onLike={handleLike}
                  onView={(videoId) => { handleView(videoId); }}
                  onNeedAuth={() => setShowAuth(true)}
                  onDelete={(id) => setVideoList(prev => prev.filter(v => v.id !== id))}
                  onProfileOpen={(uid, uname) => setProfileSheet({ userId: uid, username: uname })}
                  followedUserIds={followedUserIds}
                  onFollowChange={handleFollowChange}
                  onShareCount={(videoId, newCount) => setVideoList(prev => prev.map(v => v.id === videoId ? {...v, shares_count: newCount} : v))}
                  onBookmark={{ isBookmarked: (vid) => bookmarkedIds.has(vid), handle: handleBookmark }}
                  blockedIds={blockedIds}
                />
              );
            });
          })()}
          {feedTab === "forYou" && feedHasMore && (
            <div style={{ height:"calc(100dvh - 80px)", scrollSnapAlign:"start", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, color:"rgba(245,200,66,0.6)" }}>
                <div style={{ width:32, height:32, border:"3px solid rgba(245,200,66,0.2)", borderTop:"3px solid #F5C842", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
                <div style={{ fontSize:12, letterSpacing:1, fontWeight:600 }}>Loading more</div>
              </div>
            </div>
          )}
          {feedTab === "following" && followingVideos.length === 0 && !loading && (
            <div style={{ textAlign:"center", padding:"60px 24px", color:"rgba(255,255,255,0.3)" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>👀</div>
              <div style={{ fontSize:16, fontWeight:600, marginBottom:8 }}>Nothing here yet</div>
              <div style={{ fontSize:13 }}>Follow creators to see their posts here</div>
            </div>
          )}
        </div>
      )}

      {/* Profile */}
      {activeTab === "profile" && (
        <div style={{ paddingTop:70, paddingBottom:80, minHeight:"100svh", background:"#0B0C1A", position:"relative", zIndex:10, isolation:"isolate" }}>
          {!currentUser ? (
            <div style={{ textAlign:"center", padding:60 }}>
              <div style={{ position:"relative", display:"inline-block", cursor:"pointer", marginBottom:16 }}
                onClick={() => setShowAuth(true)}>
                <div style={{ width:90, height:90, borderRadius:"50%", background:"rgba(255,255,255,0.08)",
                  border:"3px solid rgba(245,200,66,0.4)", display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:44 }}>👤</div>
                <div style={{ position:"absolute", bottom:2, right:2, background:"#F5C842", borderRadius:"50%", width:26, height:26,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, border:"2px solid #0B0C1A" }}>📷</div>
              </div>
              <div style={{ color:"#fff", fontWeight:800, fontSize:20, marginBottom:8 }}>You're not logged in</div>
              <div style={{ color:"#666", fontSize:14, marginBottom:24 }}>Sign up to post and build your profile</div>
              <button onClick={() => setShowAuth(true)}
                style={{ background:"linear-gradient(135deg,#F5C842,#FF9500)", border:"none", borderRadius:14, padding:"13px 32px", color:"#0B0C1A", fontWeight:800, fontSize:16, cursor:"pointer" }}>
                Sign Up / Log In
              </button>
            </div>
          ) : (
            <>
              <div style={{ padding:"20px 20px 0", textAlign:"center" }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:12, gap:8 }}>
                  <div style={{ position:"relative", display:"inline-block", cursor:"pointer" }}
                    onClick={() => setShowAvatarPicker(true)}>
                    <img src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`}
                      style={{ width:90, height:90, borderRadius:"50%", border:"3px solid #F5C842", display:"block", background:"rgba(255,255,255,0.05)" }} />
                    <div style={{ position:"absolute", bottom:2, right:2, background:"#F5C842", borderRadius:"50%", width:26, height:26,
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, border:"2px solid #0B0C1A" }}>✏️</div>
                  </div>
                  <button
                    onClick={() => setShowAvatarPicker(true)}
                    style={{ background:"rgba(245,200,66,0.1)", border:"1px solid rgba(245,200,66,0.3)", borderRadius:20,
                      padding:"6px 18px", color:"#F5C842", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                    Change Avatar
                  </button>
                </div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, cursor:"pointer" }}
                  onClick={() => { setEditProfileName(currentUser?.full_name || ''); setShowEditProfile(true); }}>
                  <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>{currentUser.full_name || username}</div>
                  <div style={{ fontSize:13, color:"#888" }}>✏️</div>
                </div>
                <div style={{ color:"#888", fontSize:13, marginTop:2 }}>@{username}</div>
                <div style={{ display:"flex", justifyContent:"center", gap:0, marginTop:20, marginBottom:20, pointerEvents:"auto" }}>
                  <div style={{ textAlign:"center", padding:"10px 24px" }}>
                    <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>{myVideos.length}</div>
                    <div style={{ color:"#888", fontSize:12 }}>Videos</div>
                  </div>
                  <button style={{ textAlign:"center", padding:"10px 24px", background:"none", border:"none", cursor:"pointer", pointerEvents:"auto", WebkitTapHighlightColor:"transparent" }}
                    onClick={async () => {
                      setShowFollowersList(true);
                      setFollowListLoading(true);
                      try {
                        const r1 = await request("GET", `/apps/69e79122bcc8fb5a04cfb834/entities/Follow?following_id=${currentUser.id}&limit=500`).catch(()=>null);
                        const all = r1?.items || r1 || [];
                        const unique = [...new Map(all.map(f=>[f.id,f])).values()];
                        setFollowersList(unique);
                      } catch(e) { setFollowersList([]); }
                      setFollowListLoading(false);
                    }}>
                    <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>{meFollowersCount}</div>
                    <div style={{ color:"#F5C842", fontSize:12, fontWeight:600 }}>Followers</div>
                  </button>
                  <button style={{ textAlign:"center", padding:"10px 24px", background:"none", border:"none", cursor:"pointer", pointerEvents:"auto", WebkitTapHighlightColor:"transparent" }}
                    onClick={async () => {
                      setShowFollowingList(true);
                      setFollowListLoading(true);
                      try {
                        const r1 = await request("GET", `/apps/69e79122bcc8fb5a04cfb834/entities/Follow?follower_id=${currentUser.id}&limit=500`).catch(()=>null);
                        const all = r1?.items || r1 || [];
                        const unique = [...new Map(all.map(f=>[f.id,f])).values()];
                        setFollowingList(unique);
                      } catch(e) { setFollowingList([]); }
                      setFollowListLoading(false);
                    }}>
                    <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>{meFollowingCount}</div>
                    <div style={{ color:"#F5C842", fontSize:12, fontWeight:600 }}>Following</div>
                  </button>
                </div>
              </div>
              <VideoManageGrid videos={myVideos} onRefresh={() => videos.myVideos(currentUser.id, currentUser.email).then(r => setMyVideos(Array.isArray(r)?r:[])).catch(()=>{})} />

              {/* Founding Creator CTA */}
              <div style={{ padding:"0 20px 12px" }}>
                <button onClick={() => window.location.href='/founding-creator'}
                  style={{ width:"100%", padding:"15px 0", background:"linear-gradient(135deg,rgba(245,200,66,0.15),rgba(245,200,66,0.08))",
                    border:"1.5px solid rgba(245,200,66,0.4)", borderRadius:14,
                    color:"#F5C842", fontWeight:700, fontSize:15, cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  🌸 Apply to be a Founding Creator
                </button>
              </div>
              {/* Log Out */}
              <div style={{ padding:"24px 20px 32px" }}>
                <button onClick={() => { auth.signOut(); localStorage.removeItem('sachi_google_user'); setCurrentUser(null); setActiveTab('feed'); }}
                  style={{ width:"100%", padding:"14px 0", background:"rgba(255,50,50,0.1)",
                    border:"1.5px solid rgba(255,80,80,0.3)", borderRadius:14,
                    color:"#ff5555", fontWeight:700, fontSize:15, cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  🚪 Log Out
                </button>
              </div>
            </>
          )}
        </div>
      )}

            {/* Explore Tab */}
      {activeTab === "explore" && (
        <div style={{ paddingTop:70, paddingBottom:80, minHeight:"100svh", background:"#0B0C1A" }}>
          <div style={{ padding:"16px 16px 8px", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ flex:1, display:"flex", alignItems:"center", background:"rgba(255,255,255,0.08)", borderRadius:22, padding:"8px 14px", gap:8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search users or videos..."
                style={{ flex:1, background:"none", border:"none", outline:"none", color:"#fff", fontSize:15 }} />
              {searchQuery && <button onClick={() => setSearchQuery("")} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:18, padding:0 }}>✕</button>}
            </div>
          </div>
          <div style={{ padding:16 }}>
            {searchQuery.trim() === "" ? (
              <>
                <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, fontWeight:700, marginBottom:12, letterSpacing:1, textTransform:"uppercase" }}>🔥 Trending Now</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:2 }}>
                  {[...videoList].sort((a,b) => (b.views_count||0)-(a.views_count||0)).slice(0,18).map(v => (
                    <div key={v.id} style={{ aspectRatio:"9/16", background:"#111", borderRadius:4, overflow:"hidden", position:"relative", cursor:"pointer" }}
                      onClick={() => { setSearchQuery(""); setActiveTab("feed"); }}>
                      <video src={resolveMediaUrl(v.video_url)} style={{ width:"100%", height:"100%", objectFit:"cover" }} muted playsInline preload="metadata" />
                      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"4px 6px", background:"linear-gradient(transparent,rgba(0,0,0,0.8))", fontSize:10, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        <div>@{v.username}</div>
                        {v.views_count > 0 && <div style={{ color:"#aaa" }}>👁 {v.views_count}</div>}
                      </div>
                    </div>
                  ))}
                </div>
                {videoList.length === 0 && (
                  <div style={{ textAlign:"center", color:"rgba(255,255,255,0.25)", marginTop:60, fontSize:14 }}>No videos yet — be the first to post!</div>
                )}
              </>
            ) : (
              <>
                <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, fontWeight:700, marginBottom:12, letterSpacing:1, textTransform:"uppercase" }}>Results</div>
                {videoList.filter(v =>
                  (v.caption || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (v.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (v.display_name || "").toLowerCase().includes(searchQuery.toLowerCase())
                ).length === 0 ? (
                  <div style={{ textAlign:"center", color:"rgba(255,255,255,0.25)", marginTop:60, fontSize:14 }}>No results for "{searchQuery}"</div>
                ) : (
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:2 }}>
                    {videoList.filter(v =>
                      (v.caption || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (v.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (v.display_name || "").toLowerCase().includes(searchQuery.toLowerCase())
                    ).map(v => (
                      <div key={v.id} style={{ aspectRatio:"9/16", background:"#111", borderRadius:4, overflow:"hidden", position:"relative", cursor:"pointer" }}
                        onClick={() => { setSearchQuery(""); setActiveTab("feed"); }}>
                        <video src={resolveMediaUrl(v.video_url)} style={{ width:"100%", height:"100%", objectFit:"cover" }} muted playsInline preload="metadata" />
                        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"4px 6px", background:"linear-gradient(transparent,rgba(0,0,0,0.7))", fontSize:10, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>@{v.username}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Podcast Tab */}
      {activeTab === "podcast" && (
        <PodcastPage currentUser={currentUser} onNeedAuth={() => setShowAuth(true)} />
      )}

      {activeTab === "admin" && (
        <AdminPanel currentUser={currentUser} />
      )}

      {activeTab === "inbox" && currentUser && (
        <InboxPanel
          currentUser={currentUser}
          onClose={() => { const dest = prevTab || "feed"; setPrevTab(null); setActiveTab(dest); }}
          initialDMTarget={inboxDMTarget}
          onOpen={() => setInboxDMTarget(null)}
          fromProfile={inboxDMTarget?.fromProfile || false}
        />
      )}

      {/* ⛔ LOCKED SECTION — DO NOT MODIFY WITHOUT RUNNING scripts/verify-before-change.sh
           Nav: 5 items only — Home, Explore, [+] Post (raised), Activity, Me
           Post button MUST have marginTop:"-18px" (raised circle style)
           Any change here MUST pass the GitHub Actions deploy-gate before merge. */}
      {/* ⛔ LOCKED — Floating Invite CTA — only on feed when logged in */}
      {currentUser && activeTab === "home" && (
        <div onClick={() => setShowInviteDashboard(true)} style={{ position:"fixed", top:16, right:16, zIndex:200, background:"linear-gradient(135deg,#F5C842,#FF9500)", borderRadius:20, padding:"6px 14px", display:"flex", alignItems:"center", gap:6, cursor:"pointer", boxShadow:"0 4px 16px rgba(245,200,66,0.4)", fontFamily:"-apple-system,sans-serif" }}>
          <span style={{ fontSize:14 }}>🚀</span>
          <span style={{ color:"#0B0C1A", fontWeight:800, fontSize:12 }}>Invite</span>
        </div>
      )}

      {/* ╔════════════════════════════════════════════════════════════════════╗ */}
      {/* ║ ⛔ LOCKED — SECTION: ORBITAL ARC NAVIGATION                       ║ */}
      {/* ║ Exactly 5 icons: Home, Explore, [+] Post (raised), Activity, Me  ║ */}
      {/* ║ Do NOT add icons, remove icons, or change Post button styling     ║ */}
      {/* ║ Post button MUST have marginTop:"-18px" raised circle style       ║ */}
      {/* ║ Run verify-before-change.sh before touching this section          ║ */}
      {/* ╚════════════════════════════════════════════════════════════════════╝ */}
      {/* Bottom Nav — Orbital Arc: 5 icons + raised center Post button */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, zIndex:200, pointerEvents:"none", opacity: (activeTab==="feed" || activeTab==="dashboard") && globalIsPlaying ? 0.25 : 1, transition:"opacity 0.4s ease" }}>
        {/* Arc SVG background */}
        <svg viewBox="0 0 480 70" xmlns="http://www.w3.org/2000/svg" style={{ position:"absolute", bottom:0, left:0, width:"100%", height:70, display:"block" }} preserveAspectRatio="none">
          <defs>
            <filter id="navBlur">
              <feGaussianBlur stdDeviation="0.5"/>
            </filter>
          </defs>
          <path d="M0,70 L0,40 Q80,42 180,38 Q220,20 240,18 Q260,20 300,38 Q400,42 480,40 L480,70 Z"
            fill="rgba(14,14,28,0.97)" filter="url(#navBlur)"/>
          <path d="M0,40 Q80,42 180,38 Q220,20 240,18 Q260,20 300,38 Q400,42 480,40"
            fill="none" stroke="rgba(245,200,66,0.18)" strokeWidth="1"/>
        </svg>
        <div style={{ pointerEvents:"auto", position:"relative", display:"flex", alignItems:"flex-end", justifyContent:"space-around", paddingBottom:"calc(env(safe-area-inset-bottom,0px) + 6px)", paddingLeft:8, paddingRight:8, height:70, width:"100%" }}>

          {/* Home */}
          <button onClick={goHome}
            style={{ flex:1, padding:"4px 8px 6px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, WebkitTapHighlightColor:"transparent", borderRadius:32, transition:"background 0.15s", marginBottom:4 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill={activeTab==="feed" || activeTab==="dashboard" ? "#F5C842" : "none"} stroke={activeTab==="feed" || activeTab==="dashboard" ? "#F5C842" : "#4A4A6A"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <div style={{ fontSize:9, color: activeTab==="feed" || activeTab==="dashboard" ? "#F5C842" : "#4A4A6A", fontWeight: activeTab==="feed" || activeTab==="dashboard" ? 700 : 400, letterSpacing:0.3 }}>Home</div>
          </button>

          {/* Explore */}
          <button onClick={() => setActiveTab("explore")}
            style={{ flex:1, padding:"4px 8px 6px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, WebkitTapHighlightColor:"transparent", borderRadius:32, transition:"background 0.15s", marginBottom:8 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={activeTab==="explore" ? "#F5C842" : "#4A4A6A"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <div style={{ fontSize:9, color: activeTab==="explore" ? "#F5C842" : "#4A4A6A", fontWeight: activeTab==="explore" ? 700 : 400, letterSpacing:0.3 }}>Explore</div>
          </button>

          {/* Post — raised circle center button */}
          <button onClick={() => requireAuth(() => setShowUpload(true))}
            style={{ flex:"0 0 64px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"none", border:"none", cursor:"pointer", WebkitTapHighlightColor:"transparent", padding:"0 4px", marginBottom:30, gap:3, position:"relative", zIndex:2 }}>
            <div style={{ width:50, height:50, borderRadius:"50%", background:"linear-gradient(135deg,#F5C842,#f97316)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 18px rgba(245,200,66,0.55), 0 2px 8px rgba(0,0,0,0.5)", border:"3px solid rgba(14,14,28,0.96)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B0C1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <div style={{ fontSize:9, color:"#F5C842", fontWeight:600, letterSpacing:0.3, marginTop:2 }}>Post</div>
          </button>

          {/* Notifications (bell) — with badge */}
          <button onClick={() => requireAuth(() => setActiveTab("notifications"))}
            style={{ flex:1, padding:"4px 8px 6px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, WebkitTapHighlightColor:"transparent", borderRadius:32, transition:"background 0.15s", position:"relative", marginBottom:8 }}>
            <div style={{ position:"relative" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={activeTab==="notifications" ? "#F5C842" : "#4A4A6A"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {notifCount > 0 && <div style={{ position:"absolute", top:-4, right:-4, background:"#F5C842", borderRadius:"50%", width:14, height:14, fontSize:8, color:"#0B0C1A", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>{notifCount > 9 ? "9+" : notifCount}</div>}
            </div>
            <div style={{ fontSize:9, color: activeTab==="notifications" ? "#F5C842" : "#4A4A6A", fontWeight: activeTab==="notifications" ? 700 : 400, letterSpacing:0.3 }}>Activity</div>
          </button>

          {/* Me / Profile */}
          <button onClick={() => setActiveTab("profile")}
            style={{ flex:1, padding:"4px 8px 6px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, WebkitTapHighlightColor:"transparent", borderRadius:32, transition:"background 0.15s", marginBottom:4 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill={activeTab==="profile" ? "#F5C842" : "none"} stroke={activeTab==="profile" ? "#F5C842" : "#4A4A6A"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <div style={{ fontSize:9, color: activeTab==="profile" ? "#F5C842" : "#4A4A6A", fontWeight: activeTab==="profile" ? 700 : 400, letterSpacing:0.3 }}>Me</div>
          </button>

          {/* Mod — admin only */}
          {isAdmin && <ModNavButton activeTab={activeTab} setActiveTab={setActiveTab} />}

        </div>
      </div>

      {/* Search Sheet */}
      {showSearch && (
        <div style={{ position:"fixed", inset:0, zIndex:500, background:"#000", display:"flex", flexDirection:"column" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", paddingTop:"calc(env(safe-area-inset-top,0px) + 12px)", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ flex:1, display:"flex", alignItems:"center", background:"rgba(255,255,255,0.08)", borderRadius:22, padding:"8px 14px", gap:8 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search users or videos..."
                style={{ flex:1, background:"none", border:"none", outline:"none", color:"#fff", fontSize:15 }} />
              {searchQuery && <button onClick={() => setSearchQuery("")} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:18, padding:0 }}>✕</button>}
            </div>
            <button onClick={() => { setShowSearch(false); setSearchQuery(""); }} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.6)", fontSize:14, cursor:"pointer", fontWeight:600, padding:"0 4px", WebkitTapHighlightColor:"transparent" }}>Cancel</button>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:16 }}>
            {searchQuery.trim() === "" ? (
              <div style={{ textAlign:"center", color:"rgba(255,255,255,0.25)", marginTop:60, fontSize:14 }}>Search for users or video captions</div>
            ) : (
              videoList.filter(v =>
                (v.caption || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                (v.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                (v.display_name || "").toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 ? (
                <div style={{ textAlign:"center", color:"rgba(255,255,255,0.25)", marginTop:60, fontSize:14 }}>No results for "{searchQuery}"</div>
              ) : (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:2 }}>
                  {videoList.filter(v =>
                    (v.caption || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (v.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (v.display_name || "").toLowerCase().includes(searchQuery.toLowerCase())
                  ).map(v => (
                    <div key={v.id} style={{ aspectRatio:"9/16", background:"#111", borderRadius:4, overflow:"hidden", position:"relative", cursor:"pointer" }}
                      onClick={() => { setShowSearch(false); setSearchQuery(""); }}>
                      <video src={resolveMediaUrl(v.video_url)} style={{ width:"100%", height:"100%", objectFit:"cover" }} muted playsInline preload="metadata" />
                      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"4px 6px", background:"linear-gradient(transparent,rgba(0,0,0,0.7))", fontSize:10, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>@{v.username}</div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {profileSheet && (
        <UserProfileSheet
          userId={profileSheet.userId}
          username={profileSheet.username}
          currentUser={currentUser}
          onClose={() => setProfileSheet(null)} />
      )}
      {/* ── Followers Sheet (top-level so nothing clips it) ── */}
      {showFollowersList && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:19999, display:"flex", alignItems:"flex-end" }}
          onClick={e => { if(e.target===e.currentTarget) setShowFollowersList(false); }}>
          <div style={{ width:"100%", maxHeight:"75vh", background:"#13142A", borderRadius:"20px 20px 0 0", overflowY:"auto", paddingBottom:32 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 20px 12px",
              borderBottom:"1px solid rgba(255,255,255,0.08)", position:"sticky", top:0, background:"#13142A", zIndex:1 }}>
              <div style={{ fontWeight:800, fontSize:17, color:"#fff" }}>Followers ({followersList.length})</div>
              <button onClick={() => setShowFollowersList(false)}
                style={{ background:"none", border:"none", color:"#888", fontSize:24, cursor:"pointer", lineHeight:1 }}>✕</button>
            </div>
            {followListLoading ? (
              <div style={{ textAlign:"center", padding:40, color:"#888" }}>Loading...</div>
            ) : followersList.length === 0 ? (
              <div style={{ textAlign:"center", padding:40, color:"#888" }}>No followers yet</div>
            ) : followersList.map((f, i) => (
              <div key={f.id||i} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 20px",
                borderBottom:"1px solid rgba(255,255,255,0.05)", cursor:"pointer" }}
                onClick={() => { setShowFollowersList(false); setProfileSheet({ userId: f.follower_id, username: f.follower_username }); }}>
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(f.follower_username||'U')}&background=random&color=fff&size=80&bold=true&format=png`}
                  style={{ width:48, height:48, borderRadius:"50%", border:"2px solid rgba(245,200,66,0.4)" }} />
                <div>
                  <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{f.follower_username || "Unknown"}</div>
                  <div style={{ color:"#888", fontSize:12 }}>@{f.follower_username}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Following Sheet (top-level so nothing clips it) ── */}
      {showFollowingList && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:19999, display:"flex", alignItems:"flex-end" }}
          onClick={e => { if(e.target===e.currentTarget) setShowFollowingList(false); }}>
          <div style={{ width:"100%", maxHeight:"75vh", background:"#13142A", borderRadius:"20px 20px 0 0", overflowY:"auto", paddingBottom:32 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 20px 12px",
              borderBottom:"1px solid rgba(255,255,255,0.08)", position:"sticky", top:0, background:"#13142A", zIndex:1 }}>
              <div style={{ fontWeight:800, fontSize:17, color:"#fff" }}>Following ({followingList.length})</div>
              <button onClick={() => setShowFollowingList(false)}
                style={{ background:"none", border:"none", color:"#888", fontSize:24, cursor:"pointer", lineHeight:1 }}>✕</button>
            </div>
            {followListLoading ? (
              <div style={{ textAlign:"center", padding:40, color:"#888" }}>Loading...</div>
            ) : followingList.length === 0 ? (
              <div style={{ textAlign:"center", padding:40, color:"#888" }}>Not following anyone yet</div>
            ) : followingList.map((f, i) => (
              <div key={f.id||i} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 20px",
                borderBottom:"1px solid rgba(255,255,255,0.05)", cursor:"pointer" }}
                onClick={() => { setShowFollowingList(false); setProfileSheet({ userId: f.following_id, username: f.following_username }); }}>
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(f.following_username||'U')}&background=random&color=fff&size=80&bold=true&format=png`}
                  style={{ width:48, height:48, borderRadius:"50%", border:"2px solid rgba(245,200,66,0.4)" }} />
                <div>
                  <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{f.following_username || "Unknown"}</div>
                  <div style={{ color:"#888", fontSize:12 }}>@{f.following_username}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {commentVideo && <CommentSheet video={commentVideo} currentUser={currentUser} onClose={() => setCommentVideo(null)} onCommentPosted={handleCommentCount} onNeedAuth={() => { setCommentVideo(null); setShowAuth(true); }} />}
      {showUpload && currentUser && <UploadModal currentUser={currentUser} onClose={() => setShowUpload(false)} onUploaded={(newPost) => {
              // Immediately prepend the new post to the feed so it's visible right away
              if (newPost && newPost.id) {
                setVideoList(prev => [newPost, ...prev.filter(v => v.id !== newPost.id)]);
              }
              goHome();
              setUploadToast(true);
              setTimeout(() => setUploadToast(false), 4000);
            }} />}
      {showGoLive && currentUser && <GoLiveModal currentUser={currentUser} onClose={() => setShowGoLive(false)} onUploaded={(newPost) => {
              // Immediately prepend the new post to the feed so it's visible right away
              if (newPost && newPost.id) {
                setVideoList(prev => [newPost, ...prev.filter(v => v.id !== newPost.id)]);
              }
              goHome();
              setUploadToast(true);
              setTimeout(() => setUploadToast(false), 4000);
            }} />}
      {/* Auth required toast */}
      {authToast && (
        <div style={{ position:"fixed", bottom:90, left:"50%", transform:"translateX(-50%)", zIndex:9999,
          background:"linear-gradient(135deg,#1a1a2e,#16213e)", border:"1.5px solid #ff6b6b",
          borderRadius:16, padding:"14px 22px", display:"flex", alignItems:"center", gap:12,
          boxShadow:"0 8px 32px rgba(0,0,0,0.5)", whiteSpace:"nowrap" }}>
          <div style={{ fontSize:22 }}>🔐</div>
          <div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>Sign in required</div>
            <div style={{ color:"#ff9999", fontSize:12, marginTop:2 }}>Create a free account to continue</div>
          </div>
        </div>
      )}

      {/* Upload success toast */}
      {uploadToast && (
        <div style={{ position:"fixed", bottom:90, left:"50%", transform:"translateX(-50%)", zIndex:9999,
          background:"linear-gradient(135deg,#1a2e1a,#1e3a1e)", border:"1.5px solid #4caf50",
          borderRadius:16, padding:"14px 22px", display:"flex", alignItems:"center", gap:12,
          boxShadow:"0 8px 32px rgba(0,0,0,0.5)", animation:"slideUp 0.35s ease" }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:"#4caf50", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>✓</div>
          <div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>Your video has been uploaded!</div>
            <div style={{ color:"#81c784", fontSize:12, marginTop:2 }}>Now live in the feed 🎉</div>
          </div>
        </div>
      )}
      {/* Login success toast */}
      {loginToast && (
        <div style={{ position:"fixed", top:24, left:"50%", transform:"translateX(-50%)", zIndex:9999,
          background:"linear-gradient(135deg,#1a1a2e,#16213e)", border:"1.5px solid #6c63ff",
          borderRadius:18, padding:"14px 22px", display:"flex", alignItems:"center", gap:12,
          boxShadow:"0 8px 32px rgba(0,0,0,0.6)", animation:"slideDown 0.35s ease", whiteSpace:"nowrap" }}>
          <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#6c63ff,#ff6b6b)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>✓</div>
          <div>
            <div style={{ color:"#fff", fontWeight:800, fontSize:15, letterSpacing:0.3 }}>✨ Sachi is Live for you</div>
            <div style={{ color:"#a09de8", fontSize:12, marginTop:2 }}>Welcome in — let's go 🔥</div>
          </div>
        </div>
      )}
      {showLiveHub && <SachiLiveHub currentUser={currentUser} onClose={() => setShowLiveHub(false)} onNeedAuth={() => { setShowLiveHub(false); setShowAuth(true); }} />}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={(user) => { setCurrentUser(user); setShowAuth(false); setActiveTab("dashboard"); setFeedKey(k => k+1); setLoginToast(true); setTimeout(() => setLoginToast(false), 4000); }} />}
      {showEditProfile && (
        <div style={{ position:"fixed", inset:0, zIndex:9000, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
          onClick={() => setShowEditProfile(false)}>
          <div style={{ background:"#1a1a2e", borderRadius:20, padding:24, width:"100%", maxWidth:420 }}
            onClick={e => e.stopPropagation()}>
            <div style={{ color:"#fff", fontWeight:700, fontSize:17, marginBottom:16 }}>✏️ Edit Display Name</div>
            <input
              value={editProfileName}
              onChange={e => setEditProfileName(e.target.value)}
              placeholder={currentUser?.full_name || username || "Your display name"}
              defaultValue={currentUser?.full_name || ""}
              style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)",
                borderRadius:12, color:"#fff", padding:"12px 14px", fontSize:15, outline:"none",
                fontFamily:"inherit", boxSizing:"border-box" }}
            />
            <div style={{ display:"flex", gap:10, marginTop:14 }}>
              <button onClick={() => setShowEditProfile(false)}
                style={{ flex:1, padding:"12px 0", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:12, color:"#aaa", fontSize:14, cursor:"pointer" }}>
                Cancel
              </button>
              <button onClick={async () => {
                  if (!editProfileName.trim()) return;
                  setEditProfileSaving(true);
                  try {
                    await request("PATCH", `/apps/69e79122bcc8fb5a04cfb834/auth/me`, { full_name: editProfileName.trim() });
                    setCurrentUser(u => ({ ...u, full_name: editProfileName.trim() }));
                    setShowEditProfile(false);
                  } catch(e) { alert("Save failed: " + e.message); }
                  finally { setEditProfileSaving(false); }
                }}
                disabled={editProfileSaving}
                style={{ flex:2, padding:"12px 0", background:"linear-gradient(135deg,#F5C842,#FF9500)",
                  border:"none", borderRadius:12, color:"#fff", fontSize:14, fontWeight:700,
                  cursor:editProfileSaving?"not-allowed":"pointer" }}>
                {editProfileSaving ? "Saving..." : "Save Name"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showAvatarPicker && <AvatarPickerModal currentAvatar={avatarUrl} onSelect={async (url) => {
        // Immediately update UI state
        setAvatarUrl(url);
        setCurrentUser(u => ({ ...u, avatar_url: url }));
        setShowAvatarPicker(false);

        if (!currentUser || url.startsWith("data:")) return;

        // Persist to localStorage
        localStorage.setItem(`avatar_${currentUser.id}`, url);
        localStorage.setItem('avatar_last', url);
        localStorage.setItem('sachi_user', JSON.stringify({ ...currentUser, avatar_url: url }));

        // Background sync to DB — works for ALL auth types (Google + email)
        try {
          const usersData = await request("GET", `/apps/69e79122bcc8fb5a04cfb834/entities/AthaVidUser/?email=${encodeURIComponent(currentUser.email)}`);
          const users = Array.isArray(usersData) ? usersData : (usersData?.items || usersData?.records || []);
          const match = users.find(u => u.email === currentUser.email || u.user_id === currentUser.id);
          if (match) {
            if (url.startsWith("https://") || url.startsWith("http://")) {
              // Already a URL (DiceBear, CDN etc) — direct entity update
              await request("PATCH", `/apps/69e79122bcc8fb5a04cfb834/entities/AthaVidUser/${match.id}/`, { avatar_url: url });
            }
          }
        } catch(e) { console.warn("User entity update failed:", e); }

        // Also try auth/me update (works for email users)
        try {
          await request("PUT", `/apps/69e79122bcc8fb5a04cfb834/auth/me`, { avatar_url: url });
        } catch(e) { console.warn("Auth avatar update failed (ok for Google users):", e); }

        // Update all existing videos so feed shows new avatar immediately
        try {
          const vidsData = await request("GET", `/apps/69e79122bcc8fb5a04cfb834/entities/SachiVideo/?username=${encodeURIComponent(currentUser.username || currentUser.email?.split("@")[0])}&limit=200`);
          const vids = Array.isArray(vidsData) ? vidsData : (vidsData?.items || vidsData?.records || []);
          await Promise.all(vids.map(v => request("PATCH", `/apps/69e79122bcc8fb5a04cfb834/entities/SachiVideo/${v.id}/`, { avatar_url: url })));
          setVideoList(vs => vs.map(v =>
            (v.user_id === currentUser.id || v.created_by === currentUser.id || v.username === (currentUser.username || currentUser.email?.split("@")[0]))
              ? { ...v, avatar_url: url } : v
          ));
        } catch(e) { console.warn("Video avatar sync failed:", e); }
      }} onClose={() => setShowAvatarPicker(false)} />}

      {/* ⛔ LOCKED — Invite Dashboard modal */}
      {showInviteDashboard && currentUser && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:9999, display:"flex", alignItems:"flex-end" }} onClick={e => { if(e.target===e.currentTarget) setShowInviteDashboard(false); }}>
          <div style={{ width:"100%", maxWidth:480, margin:"0 auto", animation:"slideUp 0.3s ease" }}>
            <InviteDashboard currentUser={currentUser} onClose={() => setShowInviteDashboard(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
// v1775417720513

// Deploy trigger: 1775677881
