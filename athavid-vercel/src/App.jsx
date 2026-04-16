
// Sachi v2.2.1 - bulletproof build, mod panel fixed, toast system
import React, { useState, useEffect, useRef, useMemo } from "react";
import Landing from "./Landing";
import { auth, videos, comments, uploadFile, follows, request, interests, reports, bookmarks, blocks } from "./api.js";
import AuthModal, { initGoogleOneTap, handleGoogleRedirectCallback } from "./AuthModal.jsx";
import Terms from "./Terms.jsx";
import Privacy from "./Privacy.jsx";
import ChildSafety from "./ChildSafety.jsx";
import FoundingCreatorPage from "./FoundingCreator.jsx";
import MusicPicker from "./MusicPicker.jsx";

const APP_ID = "69b2ee18a8e6fb58c7f0261c";

// ── Audio Preloader Cache ─────────────────────────────────────────────────
// Pre-fetches audio for upcoming videos so playback starts instantly
const audioCache = new Map();
const MAX_CACHE = 5;

function preloadAudio(url) {
  if (!url || audioCache.has(url)) return;
  if (audioCache.size >= MAX_CACHE) {
    // Evict oldest entry
    const firstKey = audioCache.keys().next().value;
    const evicted = audioCache.get(firstKey);
    evicted.pause();
    evicted.src = "";
    audioCache.delete(firstKey);
  }
  const audio = new Audio(url);
  audio.preload = "auto";
  audio.load();
  audioCache.set(url, audio);
}

function getCachedAudio(url) {
  return audioCache.get(url) || null;
}

// ── SachiHype API helpers ─────────────────────────────────────────────────
const hypes = {
  async add(video_id, user_id, username) {
    return request("POST", `/apps/${APP_ID}/entities/SachiHype`, { video_id, user_id, username });
  },
  async remove(id) {
    return request("DELETE", `/apps/${APP_ID}/entities/SachiHype/${id}`);
  },
  async getByUserAndVideo(video_id, user_id) {
    try {
      const res = await request("GET", `/apps/${APP_ID}/entities/SachiHype?video_id=${video_id}&user_id=${user_id}&limit=5`);
      return Array.isArray(res) ? res : (res?.items || []);
    } catch { return []; }
  },
  async countToday(user_id) {
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await request("GET", `/apps/${APP_ID}/entities/SachiHype?user_id=${user_id}&limit=100`);
      const all = Array.isArray(res) ? res : (res?.items || []);
      return all.filter(h => h.created_date?.startsWith(today)).length;
    } catch { return 0; }
  }
};

// ── SachiLike API helpers ─────────────────────────────────────────────────
const likes = {
  async add(video_id, user_id, username, display_name, avatar_url) {
    return request("POST", `/apps/${APP_ID}/entities/SachiLike`, {
      video_id, user_id, username, display_name, avatar_url
    });
  },
  async remove(id) {
    return request("DELETE", `/apps/${APP_ID}/entities/SachiLike/${id}`);
  },
  async getByVideo(video_id) {
    try {
      const res = await request("GET", `/apps/${APP_ID}/entities/SachiLike?video_id=${video_id}&limit=200`);
      return Array.isArray(res) ? res : (res?.items || []);
    } catch { return []; }
  },
  async getByUser(user_id) {
    try {
      const res = await request("GET", `/apps/${APP_ID}/entities/SachiLike?user_id=${user_id}&limit=500`);
      return Array.isArray(res) ? res : (res?.items || []);
    } catch { return []; }
  },
};

// Module-level mute store — avoids window globals, survives stale closures
const muteStore = {
  _muted: false,
  get() { return this._muted; },
  set(val) { this._muted = val; },
};

// Spotlight colors — assigned per creator for stage effect
const SPOTLIGHT_COLORS = [
  'rgba(108,60,247,0.18)','rgba(229,57,53,0.15)','rgba(2,136,209,0.15)',
  'rgba(46,125,50,0.15)','rgba(245,127,23,0.15)','rgba(173,20,87,0.15)',
  'rgba(0,131,143,0.15)','rgba(78,52,46,0.12)','rgba(21,101,192,0.15)',
  'rgba(130,119,23,0.15)',
];
function getSpotlightColor(userId) {
  if (!userId) return SPOTLIGHT_COLORS[0];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  return SPOTLIGHT_COLORS[Math.abs(hash) % SPOTLIGHT_COLORS.length];
}

// Safe JSON parse for photo_urls that may come back as string or array
function safeParsePhotoUrls(raw) {
  if (!raw) return null;
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return null; }
}

// ── Toast notification system ─────────────────────────────────────────────
const toastBus = {
  _listeners: [],
  emit(msg, type = "error") {
    this._listeners.forEach(fn => fn({ msg, type, id: Date.now() + Math.random() }));
  },
  on(fn) { this._listeners.push(fn); return () => { this._listeners = this._listeners.filter(l => l !== fn); }; }
};
const toast = {
  error: (msg) => toastBus.emit(msg, "error"),
  success: (msg) => toastBus.emit(msg, "success"),
  info: (msg) => toastBus.emit(msg, "info"),
  warn: (msg) => toastBus.emit(msg, "warn"),
};

function ToastContainer() {
  const [toasts, setToasts] = React.useState([]);
  React.useEffect(() => {
    return toastBus.on(t => {
      setToasts(prev => [...prev.slice(-3), t]);
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 3500);
    });
  }, []);
  if (!toasts.length) return null;
  const colors = {
    error:   { bg: "rgba(220,38,38,0.92)",  icon: "✕" },
    success: { bg: "rgba(22,163,74,0.92)",  icon: "✓" },
    info:    { bg: "rgba(37,99,235,0.92)",  icon: "ℹ" },
    warn:    { bg: "rgba(202,138,4,0.92)",  icon: "⚠" },
  };
  return (
    <div style={{ position:"fixed", top:24, left:"50%", transform:"translateX(-50%)", zIndex:99999,
      display:"flex", flexDirection:"column", gap:8, alignItems:"center", pointerEvents:"none", width:"90vw", maxWidth:380 }}>
      {toasts.map(t => {
        const c = colors[t.type] || colors.error;
        return (
          <div key={t.id} style={{
            background: c.bg, backdropFilter:"blur(12px)", borderRadius:14, padding:"12px 18px",
            color:"#fff", fontSize:14, fontWeight:500, display:"flex", alignItems:"center", gap:10,
            boxShadow:"0 4px 24px rgba(0,0,0,0.4)", width:"100%",
            animation:"sachiToastIn 0.25s ease"
          }}>
            <span style={{ fontWeight:700, fontSize:16 }}>{c.icon}</span>
            <span style={{ flex:1 }}>{t.msg}</span>
          </div>
        );
      })}
      <style>{`@keyframes sachiToastIn { from { opacity:0; transform:translateY(-10px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>
    </div>
  );
}

function formatDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric", timeZone:"America/New_York" });
}

function formatCount(n) {
  if (!n) return "0";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

const resolveMediaUrl = (url, isVideo) => {
  if (!url) return url;
  // Cloudflare Stream HLS URLs — pass through directly, no proxy needed
  if (url.includes('videodelivery.net') || url.includes('cloudflarestream.com') || url.endsWith('.m3u8')) {
    return url;
  }
  const match = url.match(/\/files\/mp\/public\/([^/]+)\/(.+)$/);
  if (match) {
    const filename = match[2];
    const isVideoFile = isVideo || /\.(mp4|mov|webm|avi|mkv|m4v)$/i.test(filename);
    const bucket = isVideoFile ? 'videos' : 'images';
    const directUrl = `https://media.base44.com/${bucket}/public/${match[1]}/${match[2]}`;
    if (isVideoFile) return directUrl;
    return `https://wsrv.nl/?url=${encodeURIComponent(directUrl)}&w=1200&q=75&output=webp`;
  }
  if (url.includes('media.base44.com/images/')) {
    const isVideoFile = isVideo || /\.(mp4|mov|webm|avi|mkv|m4v)$/i.test(url);
    if (!isVideoFile) return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=1200&q=75&output=webp`;
  }
  // Cloudflare R2 URLs — try loading directly via wsrv.nl which handles any image format
  // The .heic extension may be wrong — R2 files are often JPEGs with incorrect extensions
  if (url.includes('.r2.dev') || url.includes('r2.cloudflarestorage.com')) {
    const isVideoFile = isVideo || /\.(mp4|mov|webm|avi|mkv|m4v)$/i.test(url);
    if (isVideoFile) return url;
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=1200&q=75&output=webp`;
  }
  return url;
};
// ── HEIC to JPEG converter ───────────────────────────────────────────────────
async function convertHeicToJpeg(file) {
  if (!file) return file;
  const name = file.name || '';
  const type = file.type || '';
  const isHeic = /\.heic$/i.test(name) || /\.heif$/i.test(name) || type === 'image/heic' || type === 'image/heif';
  if (!isHeic) return file;
  try {
    // Dynamically load heic2any from CDN
    if (!window._heic2any) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
      window._heic2any = window.heic2any;
    }
    const blob = await window._heic2any({ blob: file, toType: 'image/jpeg', quality: 0.85 });
    const converted = new File([blob], name.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg'), { type: 'image/jpeg' });
    console.log(`[Sachi] HEIC converted: ${(file.size/1024).toFixed(0)}KB → ${(converted.size/1024).toFixed(0)}KB`);
    return converted;
  } catch(e) {
    console.warn('[Sachi] HEIC conversion failed, uploading original:', e);
    return file;
  }
}

// ── Cloudflare Stream Upload ─────────────────────────────────────────────────
// Routes video through Cloudflare Stream for HLS adaptive streaming & edge CDN
// Falls back to direct Base44 upload if Stream is unavailable
const CF_ACCOUNT_ID = "a346b1c78fc48549d2de3de99a789a2d";
const CF_STREAM_TOKEN = "cfut_q99HNXQZVyo68QBa5jIqaj8EXs1jXbkFOa0EQHQg0861d85d";

async function uploadToCloudflareStream(file, onProgress) {
  // If credentials not set, fall back to Base44
  // Cloudflare Stream active
  try {
    // Step 1: Get a one-time upload URL from Cloudflare Stream
    onProgress && onProgress(5, "Connecting to Cloudflare Stream...");
    const initRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/direct_upload`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${CF_STREAM_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maxDurationSeconds: 600,
          requireSignedURLs: false,
          allowedOrigins: ["sachistream.com", "*.sachistream.com", "localhost"],
        }),
      }
    );
    if (!initRes.ok) throw new Error(`Stream init failed: ${initRes.status}`);
    const { result } = await initRes.json();
    const { uploadURL, uid } = result;

    // Step 2: Upload the video file via tus resumable upload
    onProgress && onProgress(15, "Uploading to Cloudflare Stream...");

    // Use XMLHttpRequest for upload progress tracking
    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", uploadURL);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 60) + 15;
          onProgress && onProgress(pct, `Uploading... ${Math.round((e.loaded / e.total) * 100)}%`);
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error(`Upload failed: ${xhr.status}`));
      };
      xhr.onerror = () => reject(new Error("Network error during upload"));
      const formData = new FormData();
      formData.append("file", file);
      xhr.send(formData);
    });

    // Step 3: Wait for Stream to process (transcode to HLS)
    onProgress && onProgress(80, "Processing video for fast streaming...");
    let attempts = 0;
    let streamUrl = null;
    let thumbnailUrl = null;

    while (attempts < 30) {
      await new Promise(r => setTimeout(r, 2000)); // poll every 2s
      const statusRes = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/${uid}`,
        { headers: { "Authorization": `Bearer ${CF_STREAM_TOKEN}` } }
      );
      if (!statusRes.ok) { attempts++; continue; }
      const { result: video } = await statusRes.json();
      if (video.readyToStream) {
        // HLS manifest URL — adaptive bitrate, edge delivered
        streamUrl = video.playback?.hls || `https://customer-i1ij9522l179kiqc.cloudflarestream.com/${uid}/manifest/video.m3u8`;
        thumbnailUrl = video.thumbnail || `https://customer-i1ij9522l179kiqc.cloudflarestream.com/${uid}/thumbnails/thumbnail.jpg`;
        break;
      }
      attempts++;
    }

    if (!streamUrl) throw new Error("Stream processing timed out");
    onProgress && onProgress(95, "Almost there...");
    return { streamUrl, thumbnailUrl, uid };
  } catch(e) {
    console.error("[Sachi Stream] Upload failed:", e);
    return null; // Fall back to Base44
  }
}

// Get user's location for post geo-tagging
async function getPostLocation() {
  const savedCode = localStorage.getItem('sachi_country_code');
  const savedRegion = localStorage.getItem('sachi_region');
  const savedCity = localStorage.getItem('sachi_city');
  const savedCountry = localStorage.getItem('sachi_country');
  // Use cached data if available
  if (savedCode) {
    return { post_country: savedCode, post_region: savedRegion || null, post_city: savedCity || null };
  }
  if (savedCountry) {
    return { post_country: savedCountry, post_region: savedRegion || null, post_city: savedCity || null };
  }
  // Fallback: try GPS reverse geocode
  try {
    const pos = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
    );
    const { latitude, longitude } = pos.coords;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );
    const data = await res.json();
    const addr = data.address || {};
    const country = addr.country_code ? addr.country_code.toUpperCase() : null;
    const city = addr.city || addr.town || addr.village || addr.county || null;
    const region = addr.state || addr.region || null;
    if (country) localStorage.setItem('sachi_country_code', country);
    if (region) localStorage.setItem('sachi_region', region);
    if (city) localStorage.setItem('sachi_city', city);
    return { post_country: country, post_region: region, post_city: city };
  } catch {
    // Final fallback: IP geolocation
    try {
      const r = await fetch('https://ipapi.co/json/');
      const d = await r.json();
      const country = d.country_code || null;
      const region = d.region || null;
      const city = d.city || null;
      if (country) localStorage.setItem('sachi_country_code', country);
      if (region) localStorage.setItem('sachi_region', region);
      if (city) localStorage.setItem('sachi_city', city);
      return { post_country: country, post_region: region, post_city: city };
    } catch {
      return {};
    }
  }
}

// US/AU/CA state abbreviation helper
function getStateAbbr(state, countryCode) {
  if (!state) return '';
  const US_STATES = {
    'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA',
    'Colorado':'CO','Connecticut':'CT','Delaware':'DE','Florida':'FL','Georgia':'GA',
    'Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA',
    'Kansas':'KS','Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD',
    'Massachusetts':'MA','Michigan':'MI','Minnesota':'MN','Mississippi':'MS','Missouri':'MO',
    'Montana':'MT','Nebraska':'NE','Nevada':'NV','New Hampshire':'NH','New Jersey':'NJ',
    'New Mexico':'NM','New York':'NY','North Carolina':'NC','North Dakota':'ND','Ohio':'OH',
    'Oklahoma':'OK','Oregon':'OR','Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC',
    'South Dakota':'SD','Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT',
    'Virginia':'VA','Washington':'WA','West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY',
    'District of Columbia':'DC'
  };
  const AU_STATES = {
    'New South Wales':'NSW','Victoria':'VIC','Queensland':'QLD','South Australia':'SA',
    'Western Australia':'WA','Tasmania':'TAS','Northern Territory':'NT',
    'Australian Capital Territory':'ACT'
  };
  const CA_PROVINCES = {
    'Ontario':'ON','Quebec':'QC','British Columbia':'BC','Alberta':'AB',
    'Manitoba':'MB','Saskatchewan':'SK','Nova Scotia':'NS','New Brunswick':'NB',
    'Newfoundland and Labrador':'NL','Prince Edward Island':'PE','Northwest Territories':'NT',
    'Nunavut':'NU','Yukon':'YT'
  };
  if (countryCode === 'US' && US_STATES[state]) return US_STATES[state];
  if (countryCode === 'AU' && AU_STATES[state]) return AU_STATES[state];
  if (countryCode === 'CA' && CA_PROVINCES[state]) return CA_PROVINCES[state];
  // For other countries, return state as-is (already short)
  if (state.length <= 4) return state;
  return state; // Return full state name for others
}

// Country code -> emoji flag
function countryFlag(code) {
  if (!code || code.length !== 2) return "";
  return code.toUpperCase().replace(/./g, c =>
    String.fromCodePoint(127397 + c.charCodeAt(0))
  );
}



async function captureThumbnail(file) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata"; video.muted = true; video.playsInline = true;
    const url = URL.createObjectURL(file);
    video.src = url;
    video.onloadeddata = () => { video.currentTime = Math.min(1, video.duration * 0.1); };
    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 500; canvas.height = 888;
        const ctx = canvas.getContext("2d");
        const vw = video.videoWidth, vh = video.videoHeight;
        const targetRatio = 500 / 888, srcRatio = vw / vh;
        let sx = 0, sy = 0, sw = vw, sh = vh;
        if (srcRatio > targetRatio) { sw = vh * targetRatio; sx = (vw - sw) / 2; }
        else { sh = vw / targetRatio; sy = (vh - sh) / 2; }
        ctx.drawImage(video, sx, sy, sw, sh, 0, 0, 500, 888);
        URL.revokeObjectURL(url);
        canvas.toBlob(async (blob) => {
          if (!blob) return resolve(null);
          const thumbFile = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
          try { const url = await uploadFile(thumbFile); resolve(url); }
          catch { resolve(null); }
        }, "image/jpeg", 0.85);
      } catch { URL.revokeObjectURL(url); resolve(null); }
    };
    video.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
  });
}

// ── Auth Modal ────────────────────────────────────────────────────────────────

// ── Comment Sheet ─────────────────────────────────────────────────────────────
function CommentSheet({ video, currentUser, onClose, onCommentPosted, onNeedAuth }) {
  const [list, setList] = useState([]);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null); // { id, username }
  const [expandedReplies, setExpandedReplies] = useState({});
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!video) return;
    comments.list(video.id)
      .then(r => setList(Array.isArray(r) ? r : []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, [video?.id]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [list]);

  const startReply = (c) => {
    if (!currentUser) { onNeedAuth(); return; }
    setReplyingTo({ id: c.id, username: c.username });
    setText(`@${c.username} `);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const cancelReply = () => { setReplyingTo(null); setText(""); };

  const post = async () => {
    if (!currentUser) { onNeedAuth(); return; }
    if (!text.trim()) return;
    setPosting(true);
    try {
      const username = currentUser.full_name || currentUser.email?.split("@")[0] || "user";
      if (replyingTo) {
        // Post as a reply stored locally under the parent comment
        const reply = { id: Date.now().toString(), username, avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`, comment_text: text.trim(), thumbsUp:0, hearts:0, thumbsDown:0 };
        setList(prev => prev.map(x => x.id === replyingTo.id ? {...x, replies: [...(x.replies||[]), reply]} : x));
        setExpandedReplies(prev => ({...prev, [replyingTo.id]: true}));
        setReplyingTo(null);
        setText("");
      } else {
        const c = await comments.create({
          video_id: video.id, username,
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`,
          comment_text: text.trim(), likes_count: 0,
        });
        const newCount = list.length + 1;
        setList(prev => [...prev, c]);
        setText("");
        await videos.update(video.id, { comments_count: newCount });
        if (onCommentPosted) onCommentPosted(video.id, newCount);
        setTimeout(() => onClose(), 600);
      }
    } catch(e) { toast.error("Error: " + e.message); }
    finally { setPosting(false); }
  };

  const reactToComment = (id, reaction, isReply, parentId) => {
    if (isReply) {
      setList(prev => prev.map(x => x.id === parentId ? {
        ...x, replies: (x.replies||[]).map(r => r.id === id ? {...r, [reaction]: (r[reaction]||0)+1} : r)
      } : x));
    } else {
      setList(prev => prev.map(x => x.id === id ? {...x, [reaction]: (x[reaction]||0)+1} : x));
    }
  };

  const CommentRow = ({ c, isReply=false, parentId=null }) => (
    <div style={{ display:"flex", gap:10, marginBottom:12, paddingLeft: isReply ? 44 : 0 }}>
      <img src={c.avatar_url} style={{ width: isReply?28:36, height: isReply?28:36, borderRadius:"50%", border:`2px solid rgba(108,99,255,${isReply?0.2:0.3})`, flexShrink:0 }} />
      <div style={{ flex:1 }}>
        <div style={{ color:"#ff6b6b", fontWeight:700, fontSize: isReply?12:13 }}>@{c.username}</div>
        <div style={{ color:"#ccc", fontSize: isReply?13:14, marginBottom:4 }}>{c.comment_text}</div>
        <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
          <button onClick={() => reactToComment(c.id, "thumbsUp", isReply, parentId)}
            style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:2, color: c.thumbsUp ? "#6bff9a" : "#666", fontSize:12, padding:0 }}>
            👍 <span style={{ fontSize:10 }}>{c.thumbsUp || 0}</span>
          </button>
          <button onClick={() => reactToComment(c.id, "hearts", isReply, parentId)}
            style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:2, color: c.hearts ? "#ff6b6b" : "#666", fontSize:12, padding:0 }}>
            ❤️ <span style={{ fontSize:10 }}>{c.hearts || 0}</span>
          </button>
          <button onClick={() => reactToComment(c.id, "thumbsDown", isReply, parentId)}
            style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:2, color: c.thumbsDown ? "#ff8e53" : "#666", fontSize:12, padding:0 }}>
            👎 <span style={{ fontSize:10 }}>{c.thumbsDown || 0}</span>
          </button>
          {!isReply && (
            <button onClick={() => startReply(c)}
              style={{ background:"none", border:"none", cursor:"pointer", color:"#888", fontSize:12, padding:0, marginLeft:4 }}>
              💬 Reply
            </button>
          )}
          {!isReply && c.replies?.length > 0 && (
            <button onClick={() => setExpandedReplies(prev => ({...prev, [c.id]: !prev[c.id]}))}
              style={{ background:"none", border:"none", cursor:"pointer", color:"#6c63ff", fontSize:12, padding:0 }}>
              {expandedReplies[c.id] ? "▲ Hide" : `▼ ${c.replies.length} repl${c.replies.length===1?"y":"ies"}`}
            </button>
          )}
        </div>
        {!isReply && expandedReplies[c.id] && (c.replies||[]).map(r => (
          <CommentRow key={r.id} c={r} isReply={true} parentId={c.id} />
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.7)" }} />
      <div style={{ position:"relative", background:"#1a1a2e", borderRadius:"24px 24px 0 0", maxHeight:"75vh", display:"flex", flexDirection:"column", zIndex:1001 }}>
        <div style={{ padding:"12px 16px 0", flexShrink:0 }}>
          <div style={{ width:40, height:4, background:"#444", borderRadius:99, margin:"0 auto 12px" }} />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ color:"#fff", fontWeight:700, fontSize:16 }}>💬 Comments {list.length > 0 && `(${list.length})`}</div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:"50%", width:30, height:30, color:"#fff", cursor:"pointer" }}>✕</button>
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"0 16px 8px" }}>
          {loading && <div style={{ color:"#666", textAlign:"center", padding:32 }}>Loading...</div>}
          {!loading && list.length === 0 && (
            <div style={{ color:"#555", textAlign:"center", padding:40 }}>
              <div style={{ fontSize:36, marginBottom:8 }}>💬</div>
              <div>No comments yet. Be first!</div>
            </div>
          )}
          {list.map(c => <CommentRow key={c.id} c={c} />)}
          <div ref={bottomRef} />
        </div>
        <div style={{ padding:"8px 16px 32px", borderTop:"1px solid rgba(255,255,255,0.07)", flexShrink:0 }}>
          {replyingTo && (
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6, padding:"4px 10px", background:"rgba(108,99,255,0.15)", borderRadius:8 }}>
              <span style={{ color:"#aaa", fontSize:12 }}>Replying to <span style={{ color:"#ff6b6b" }}>@{replyingTo.username}</span></span>
              <button onClick={cancelReply} style={{ background:"none", border:"none", color:"#666", cursor:"pointer", fontSize:14 }}>✕</button>
            </div>
          )}
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <input ref={inputRef} value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && post()}
              placeholder={currentUser ? (replyingTo ? `Reply to @${replyingTo.username}...` : "Add a comment...") : "Log in to comment..."}
              style={{ flex:1, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:20, padding:"8px 14px", color:"#fff", fontSize:14, outline:"none" }} />
            <button onClick={post} disabled={posting}
              style={{ background:"linear-gradient(135deg,#ff6b6b,#ff8e53)", border:"none", borderRadius:"50%", width:36, height:36, color:"#fff", cursor:"pointer", fontSize:16 }}>➤</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Music Library ─────────────────────────────────────────────────────────────
const MUSIC_LIBRARY = [
  // Lo-Fi Hip-Hop
  { id:"lo1", genre:"Lo-Fi", title:"City Lights",          artist:"Lukrembo",        url:"https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3",  emoji:"🌃" },
  { id:"lo2", genre:"Lo-Fi", title:"Sunset Boulevard",     artist:"Lukrembo",        url:"https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",  emoji:"🌅" },
  { id:"lo3", genre:"Lo-Fi", title:"Chill Lounge",         artist:"Chill Music Lab", url:"https://cdn.pixabay.com/audio/2022/03/15/audio_8cb749ef8e.mp3",  emoji:"☕" },
  { id:"lo4", genre:"Lo-Fi", title:"Late Night Drive",     artist:"Mubert",          url:"https://cdn.pixabay.com/audio/2022/10/25/audio_fc4e2ab87f.mp3",  emoji:"🚗" },
  { id:"lo5", genre:"Lo-Fi", title:"Rainy Window",         artist:"Lo-Fi Cafe",      url:"https://cdn.pixabay.com/audio/2023/01/25/audio_27788ce40e.mp3",  emoji:"🌧️" },

  // Hip-Hop / Trap
  { id:"hh1", genre:"Hip-Hop", title:"Dark Trap",          artist:"SoundGuy",        url:"https://cdn.pixabay.com/audio/2022/09/07/audio_51e01a5b75.mp3",  emoji:"🔥" },
  { id:"hh2", genre:"Hip-Hop", title:"Street Anthem",      artist:"Beat Factory",    url:"https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3",  emoji:"🏙️" },
  { id:"hh3", genre:"Hip-Hop", title:"Hustle Hard",        artist:"Rap Beats Lab",   url:"https://cdn.pixabay.com/audio/2022/06/08/audio_c8e134dc61.mp3",  emoji:"💪" },
  { id:"hh4", genre:"Hip-Hop", title:"Midnight Flex",      artist:"Urban Beats",     url:"https://cdn.pixabay.com/audio/2023/02/08/audio_d1718ab358.mp3",  emoji:"🌙" },

  // Electronic / EDM
  { id:"el1", genre:"Electronic", title:"Bass Rush",       artist:"EDM Factory",     url:"https://cdn.pixabay.com/audio/2022/07/25/audio_124bbbcb24.mp3",  emoji:"⚡" },
  { id:"el2", genre:"Electronic", title:"Neon Club",       artist:"Synth Lab",       url:"https://cdn.pixabay.com/audio/2022/08/23/audio_d16737dc28.mp3",  emoji:"🎛️" },
  { id:"el3", genre:"Electronic", title:"Future Drop",     artist:"Synth Lab",       url:"https://cdn.pixabay.com/audio/2021/11/13/audio_cb31b3a2ee.mp3",  emoji:"🚀" },
  { id:"el4", genre:"Electronic", title:"Cyber Pulse",     artist:"Digital Wave",    url:"https://cdn.pixabay.com/audio/2022/10/16/audio_99e31cb11f.mp3",  emoji:"🤖" },

  // R&B / Soul
  { id:"rb1", genre:"R&B", title:"Smooth Feelings",        artist:"Soul Kitchen",    url:"https://cdn.pixabay.com/audio/2022/05/16/audio_8c7760a56c.mp3",  emoji:"❤️" },
  { id:"rb2", genre:"R&B", title:"Late Night Feels",       artist:"Velvet Groove",   url:"https://cdn.pixabay.com/audio/2023/03/09/audio_c8690f4a79.mp3",  emoji:"🌙" },
  { id:"rb3", genre:"R&B", title:"Golden Hour",            artist:"Soul Kitchen",    url:"https://cdn.pixabay.com/audio/2022/11/09/audio_b9f8252784.mp3",  emoji:"✨" },

  // Pop
  { id:"pp1", genre:"Pop", title:"Good Vibes Only",        artist:"Pop Studio",      url:"https://cdn.pixabay.com/audio/2022/08/04/audio_2dde668d05.mp3",  emoji:"🌈" },
  { id:"pp2", genre:"Pop", title:"Summer Heat",            artist:"Pop Studio",      url:"https://cdn.pixabay.com/audio/2023/02/28/audio_7b006e5e1b.mp3",  emoji:"☀️" },
  { id:"pp3", genre:"Pop", title:"Dance Floor",            artist:"Feel Good Music", url:"https://cdn.pixabay.com/audio/2022/10/10/audio_4a7ad08048.mp3",  emoji:"💃" },

  // Chill / Ambient
  { id:"ch1", genre:"Chill", title:"Deep Breathe",         artist:"Ambient Lab",     url:"https://cdn.pixabay.com/audio/2022/03/10/audio_2da3e03e6c.mp3",  emoji:"🌊" },
  { id:"ch2", genre:"Chill", title:"Floating",             artist:"Ambient Lab",     url:"https://cdn.pixabay.com/audio/2021/10/19/audio_b0d94b61c8.mp3",  emoji:"☁️" },
  { id:"ch3", genre:"Chill", title:"Mountain Air",         artist:"Nature Sounds",   url:"https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1bab.mp3",  emoji:"🏔️" },

  // Afrobeats
  { id:"af1", genre:"Afrobeats", title:"Lagos Nights",     artist:"Afro Vibes",      url:"https://cdn.pixabay.com/audio/2022/12/06/audio_a2dc6bff25.mp3",  emoji:"🌍" },
  { id:"af2", genre:"Afrobeats", title:"Move Your Body",   artist:"Afro Vibes",      url:"https://cdn.pixabay.com/audio/2023/01/11/audio_9b03e2b205.mp3",  emoji:"🥁" },

  // Jazz
  { id:"jz1", genre:"Jazz", title:"Smooth Jazz Cafe",      artist:"Jazz Collective",  url:"https://cdn.pixabay.com/audio/2022/09/22/audio_d64adfa5d2.mp3",  emoji:"🎷" },
  { id:"jz2", genre:"Jazz", title:"Late Night Jazz",       artist:"Blue Note Studio", url:"https://cdn.pixabay.com/audio/2021/09/06/audio_6ef08cb620.mp3",  emoji:"🎺" },
  { id:"jz3", genre:"Jazz", title:"Midnight Sax",          artist:"Blue Note Studio", url:"https://cdn.pixabay.com/audio/2022/04/27/audio_12b0e6e3fb.mp3",  emoji:"🎶" },
];

const MUSIC_GENRES = ["All", "Lo-Fi", "Hip-Hop", "Electronic", "R&B", "Pop", "Chill", "Afrobeats", "Jazz"];


// ── Upload Modal ──────────────────────────────────────────────────────────────

// ─── GO LIVE MODAL ────────────────────────────────────────────────
function GoLiveModal({ currentUser, onClose, onUploaded }) {
  const [phase, setPhase] = useState("preview"); // preview | live | uploading | done
  const [elapsed, setElapsed] = useState(0);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [chunks, setChunks] = useState([]);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const timerRef = useRef(null);
  const chunksRef = useRef([]);

  // Start camera preview on mount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode:"user" }, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch(e) {
      setError("Camera access denied. Please allow camera and microphone permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startLive = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : MediaRecorder.isTypeSupported("video/webm")
      ? "video/webm"
      : "video/mp4";
    const recorder = new MediaRecorder(streamRef.current, { mimeType });
    recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    recorder.start(500);
    recorderRef.current = recorder;
    setPhase("live");
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed(p => p + 1), 1000);
  };

  const stopLive = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    setPhase("uploading");
    setTimeout(() => uploadLive(), 800);
  };

  const uploadLive = async () => {
    try {
      const mimeType = chunksRef.current[0]?.type || "video/webm";
      const ext = mimeType.includes("mp4") ? "mp4" : "webm";
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const file = new File([blob], `live_${Date.now()}.${ext}`, { type: mimeType });

      // Upload video using the shared uploadFile helper (avoids CORS issues)
      const file_url = await uploadFile(file);

      // Generate thumbnail
      let thumbUrl = "";
      try {
        const thumbBlob = await captureThumbnail(file);
        const thumbFile = new File([thumbBlob], "thumb.jpg", { type:"image/jpeg" });
        thumbUrl = await uploadFile(thumbFile);
      } catch(_) {}

      // Save to DB
      const liveGeo = await getPostLocation();
      await videos.create({
        user_id: currentUser.id,
        username: currentUser.username || currentUser.email?.split("@")[0] || "user",
        display_name: currentUser.display_name || currentUser.full_name || currentUser.username || "",
        avatar_url: currentUser.avatar_url || "",
        video_url: file_url,
        thumbnail_url: thumbUrl,
        caption: caption || "🔴 Live recording",
        hashtags: ["live"],
        likes_count: 0, comments_count: 0, views_count: 0, shares_count: 0,
        is_approved: true, is_archived: false, is_ai_detected: false,
        duration_seconds: elapsed,
        ...liveGeo,
      });

      setPhase("done");
      setTimeout(() => { onUploaded(); onClose(); }, 2000);
    } catch(e) {
      setError("Upload failed: " + e.message);
      setPhase("preview");
    }
  };

  const formatElapsed = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2,"0");
    const sec = (s % 60).toString().padStart(2,"0");
    return `${m}:${sec}`;
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"#000", zIndex:9000, display:"flex", flexDirection:"column" }}>
      {/* Camera preview / live feed */}
      <video ref={videoRef} autoPlay muted playsInline
        style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover",
          transform:"scaleX(-1)" /* mirror front cam */ }} />

      {/* Dark overlay at top and bottom */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:120,
        background:"linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:200,
        background:"linear-gradient(to top, rgba(0,0,0,0.85), transparent)", pointerEvents:"none" }} />

      {/* Close button */}
      <button onClick={() => { stopCamera(); onClose(); }}
        style={{ position:"absolute", top:16, left:16, zIndex:100, background:"rgba(0,0,0,0.5)",
          border:"none", borderRadius:"50%", width:44, height:44, color:"#fff", fontSize:22,
          cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
        ✕
      </button>

      {/* LIVE badge + timer */}
      {phase === "live" && (
        <div style={{ position:"absolute", top:16, left:"50%", transform:"translateX(-50%)",
          display:"flex", alignItems:"center", gap:8, zIndex:100 }}>
          <div style={{ background:"#e53935", borderRadius:6, padding:"3px 10px",
            color:"#fff", fontWeight:800, fontSize:13, letterSpacing:1,
            boxShadow:"0 0 12px rgba(229,57,53,0.8)", animation:"livePulse 1.2s ease infinite" }}>
            🔴 LIVE
          </div>
          <div style={{ background:"rgba(0,0,0,0.6)", borderRadius:6, padding:"3px 10px",
            color:"#fff", fontWeight:700, fontSize:13, backdropFilter:"blur(4px)" }}>
            {formatElapsed(elapsed)}
          </div>
        </div>
      )}

      {/* Caption input */}
      {(phase === "preview" || phase === "live") && (
        <div style={{ position:"absolute", bottom:160, left:16, right:16, zIndex:100 }}>
          <input
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="Add a caption for your live..."
            style={{ width:"100%", background:"rgba(0,0,0,0.55)", border:"1px solid rgba(255,255,255,0.2)",
              borderRadius:12, padding:"10px 14px", color:"#fff", fontSize:14,
              backdropFilter:"blur(8px)", outline:"none", boxSizing:"border-box" }}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
          background:"rgba(200,0,0,0.85)", borderRadius:12, padding:"16px 24px",
          color:"#fff", fontSize:14, zIndex:200, textAlign:"center", maxWidth:280 }}>
          {error}
        </div>
      )}

      {/* Uploading state */}
      {phase === "uploading" && (
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.75)", zIndex:150,
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
          <div style={{ fontSize:48 }}>📤</div>
          <div style={{ color:"#fff", fontSize:18, fontWeight:700 }}>Uploading your live...</div>
          <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13 }}>This may take a moment</div>
        </div>
      )}

      {/* Done state */}
      {phase === "done" && (
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.85)", zIndex:150,
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
          <div style={{ fontSize:56 }}>✅</div>
          <div style={{ color:"#fff", fontSize:20, fontWeight:800 }}>Posted to feed!</div>
        </div>
      )}

      {/* Bottom action button */}
      {phase === "preview" && (
        <div style={{ position:"absolute", bottom:60, left:"50%", transform:"translateX(-50%)", zIndex:100 }}>
          <button onClick={startLive}
            style={{ width:80, height:80, borderRadius:"50%", background:"#e53935",
              border:"5px solid rgba(255,255,255,0.3)", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 0 24px rgba(229,57,53,0.7)", fontSize:28 }}>
            🔴
          </button>
          <div style={{ color:"rgba(255,255,255,0.7)", fontSize:12, textAlign:"center", marginTop:8 }}>
            Tap to Go Live
          </div>
        </div>
      )}

      {phase === "live" && (
        <div style={{ position:"absolute", bottom:60, left:"50%", transform:"translateX(-50%)", zIndex:100 }}>
          <button onClick={stopLive}
            style={{ width:80, height:80, borderRadius:"50%", background:"#222",
              border:"5px solid #e53935", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 0 24px rgba(229,57,53,0.5)", fontSize:28 }}>
            ⏹️
          </button>
          <div style={{ color:"rgba(255,255,255,0.7)", fontSize:12, textAlign:"center", marginTop:8 }}>
            Tap to Stop & Post
          </div>
        </div>
      )}

      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity:1; box-shadow: 0 0 12px rgba(229,57,53,0.8); }
          50% { opacity:0.7; box-shadow: 0 0 24px rgba(229,57,53,1); }
        }
      `}</style>
    </div>
  );
}

// ── Video Editor Component ────────────────────────────────────────────────────
function VideoEditor({ file, onDone, onSkip }) {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [trimming, setTrimming] = useState(false);
  const [activeMode, setActiveMode] = useState(null); // null | "text" | "trim"
  const [textOverlays, setTextOverlays] = useState([]);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInputVal, setTextInputVal] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [textBg, setTextBg] = useState("none"); // none | dark | colored
  const [textSize, setTextSize] = useState(22);
  const [isPlaying, setIsPlaying] = useState(true);
  const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => { return () => URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const onMeta = () => {
    const dur = videoRef.current?.duration || 0;
    setDuration(dur);
    setTrimEnd(dur);
  };
  const onTimeUpdate = () => setCurrentTime(videoRef.current?.currentTime || 0);
  const fmtTime = (s) => `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,"0")}`;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) { videoRef.current.play(); setIsPlaying(true); }
    else { videoRef.current.pause(); setIsPlaying(false); }
  };

  const addTextOverlay = () => {
    if (!textInputVal.trim()) return;
    setTextOverlays(prev => [...prev, {
      id: Date.now(), text: textInputVal.trim(),
      color: textColor, bg: textBg, size: textSize,
      x: 50, y: 50
    }]);
    setTextInputVal("");
    setShowTextInput(false);
    setActiveMode(null);
  };

  const removeOverlay = (id) => setTextOverlays(prev => prev.filter(o => o.id !== id));

  const doPost = async () => {
    setTrimming(true);
    // If no trim needed, pass original file through
    if (trimStart <= 0.5 && trimEnd >= duration - 0.5) {
      onDone(file, textOverlays);
      return;
    }
    try {
      const video = document.createElement("video");
      video.src = previewUrl;
      video.muted = true;
      await new Promise(r => { video.onloadedmetadata = r; video.load(); });
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      const stream = canvas.captureStream(30);
      const mimeType = "video/webm";
      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 4000000 });
      const chunks = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
      const blob = await new Promise((resolve) => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
        video.currentTime = trimStart;
        video.oncanplay = async () => {
          video.oncanplay = null;
          recorder.start(100);
          const draw = () => {
            if (!video.paused && !video.ended) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              requestAnimationFrame(draw);
            }
          };
          draw();
          await video.play();
          setTimeout(() => { video.pause(); recorder.stop(); }, (trimEnd - trimStart) * 1000);
        };
      });
      onDone(new File([blob], `trimmed.webm`, { type: mimeType }), textOverlays);
    } catch { onDone(file, textOverlays); }
    setTrimming(false);
  };

  const TEXT_COLORS = ["#ffffff","#000000","#FF6B6B","#F5C842","#00E5FF","#FF69B4","#7CFC00","#FF8C00"];

  return (
    <div style={{ position:"fixed", inset:0, zIndex:3000, background:"#000", display:"flex", flexDirection:"column", userSelect:"none" }}>

      {/* ── Top bar ── */}
      <div style={{ position:"absolute", top:0, left:0, right:0, zIndex:10, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 18px" }}>
        <button onClick={onSkip}
          style={{ width:36, height:36, borderRadius:"50%", background:"rgba(0,0,0,0.5)", border:"1.5px solid rgba(255,255,255,0.25)", color:"#fff", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          ✕
        </button>
        <div style={{ display:"flex", gap:8 }}>
          {/* Add Sound pill */}
          <div style={{ background:"rgba(0,0,0,0.55)", border:"1.5px solid rgba(255,255,255,0.25)", borderRadius:20, padding:"7px 14px", color:"#fff", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", gap:6, backdropFilter:"blur(8px)" }}>
            🎵 Add sound
          </div>
        </div>
        <div style={{ width:36 }} />
      </div>

      {/* ── Video/Image Preview (full screen) ── */}
      <div style={{ flex:1, position:"relative", overflow:"hidden" }} onClick={activeMode ? undefined : togglePlay}>
        <video ref={videoRef} src={previewUrl}
          onLoadedMetadata={onMeta} onTimeUpdate={onTimeUpdate}
          style={{ width:"100%", height:"100%", objectFit:"cover" }}
          autoPlay loop playsInline
        />

        {/* Text overlays on preview */}
        {textOverlays.map(ov => (
          <div key={ov.id}
            style={{
              position:"absolute",
              top: `${ov.y}%`, left: `${ov.x}%`,
              transform:"translate(-50%,-50%)",
              color: ov.color,
              fontSize: ov.size,
              fontWeight: 900,
              letterSpacing: 0.5,
              background: ov.bg === "dark" ? "rgba(0,0,0,0.55)" : ov.bg === "colored" ? ov.color.replace(")",",0.2)").replace("rgb","rgba") : "transparent",
              padding: ov.bg !== "none" ? "4px 10px" : 0,
              borderRadius: 8,
              textShadow: "0 1px 6px rgba(0,0,0,0.8)",
              whiteSpace:"nowrap",
              cursor:"pointer",
              zIndex:5,
              maxWidth:"85vw",
              wordBreak:"break-word",
              textAlign:"center",
            }}
            onClick={e => { e.stopPropagation(); removeOverlay(ov.id); }}
          >
            {ov.text}
          </div>
        ))}

        {/* Play/pause overlay */}
        {!isPlaying && (
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
            <div style={{ width:70, height:70, borderRadius:"50%", background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30 }}>▶</div>
          </div>
        )}
      </div>

      {/* ── Right side tool icons (TikTok style) ── */}
      <div style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", display:"flex", flexDirection:"column", gap:20, zIndex:10 }}>
        {[
          { icon:"T", label:"Text", mode:"text" },
          { icon:"✂️", label:"Trim", mode:"trim" },
        ].map(tool => (
          <div key={tool.mode} onClick={() => { setActiveMode(m => m===tool.mode ? null : tool.mode); }}
            style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, cursor:"pointer" }}>
            <div style={{
              width:44, height:44, borderRadius:"50%",
              background: activeMode===tool.mode ? "rgba(245,200,66,0.9)" : "rgba(0,0,0,0.55)",
              border: activeMode===tool.mode ? "2px solid #F5C842" : "1.5px solid rgba(255,255,255,0.3)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize: tool.icon==="T" ? 20 : 18, fontWeight:900,
              color: activeMode===tool.mode ? "#000" : "#fff",
              backdropFilter:"blur(8px)",
              boxShadow: activeMode===tool.mode ? "0 0 14px rgba(245,200,66,0.5)" : "none",
            }}>
              {tool.icon}
            </div>
            <div style={{ color:"#fff", fontSize:10, fontWeight:700, textShadow:"0 1px 4px rgba(0,0,0,0.9)" }}>{tool.label}</div>
          </div>
        ))}
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, zIndex:10, padding:"0 20px 40px" }}>

        {/* Mode selector row — 10m / 60s / 15s / PHOTO / TEXT */}
        <div style={{ display:"flex", justifyContent:"center", gap:18, marginBottom:20 }}>
          {[
            { label:"10m" }, { label:"60s" }, { label:"15s" },
            { label:"PHOTO", active:false },
            { label:"TEXT", action:"text" },
          ].map((m, i) => (
            <div key={i}
              onClick={() => m.action === "text" ? (setActiveMode("text"), setShowTextInput(true)) : null}
              style={{
                color: m.action === "text" && activeMode === "text" ? "#F5C842" : "#fff",
                fontWeight: m.action === "text" ? 900 : 600,
                fontSize: m.action === "text" ? 16 : 14,
                opacity: m.action === "text" ? 1 : 0.7,
                cursor: m.action ? "pointer" : "default",
                padding: m.action === "text" ? "4px 10px" : "4px 0",
                borderBottom: m.action === "text" && activeMode === "text" ? "2px solid #F5C842" : "none",
                textShadow:"0 1px 6px rgba(0,0,0,0.9)",
              }}
            >
              {m.label}
            </div>
          ))}
        </div>

        {/* Post button */}
        <button onClick={doPost} disabled={trimming}
          style={{
            width:"100%", padding:"16px 0",
            background: trimming ? "#333" : "linear-gradient(135deg,#ff6b6b,#ff8e53)",
            border:"none", borderRadius:16, color:"#fff",
            fontWeight:900, fontSize:17, cursor: trimming ? "default" : "pointer",
            letterSpacing:0.5, boxShadow:"0 4px 20px rgba(255,107,107,0.4)"
          }}>
          {trimming ? "Processing..." : "Next →"}
        </button>
      </div>

      {/* ── Trim panel (slides up) ── */}
      {activeMode === "trim" && duration > 0 && (
        <div style={{ position:"absolute", bottom:140, left:0, right:0, zIndex:15, background:"rgba(15,15,26,0.95)", borderRadius:"20px 20px 0 0", padding:"20px 20px 10px", backdropFilter:"blur(16px)" }}>
          <div style={{ color:"#fff", fontWeight:800, fontSize:15, marginBottom:14, textAlign:"center" }}>
            ✂️ Trim — {fmtTime(trimStart)} to {fmtTime(trimEnd)}
          </div>
          <div style={{ marginBottom:12 }}>
            <div style={{ color:"#aaa", fontSize:11, marginBottom:4 }}>Start: {fmtTime(trimStart)}</div>
            <input type="range" min={0} max={duration} step={0.1} value={trimStart}
              onChange={e => { const v = Math.min(parseFloat(e.target.value), trimEnd-1); setTrimStart(v); if(videoRef.current) videoRef.current.currentTime=v; }}
              style={{ width:"100%", accentColor:"#ff6b6b" }} />
          </div>
          <div>
            <div style={{ color:"#aaa", fontSize:11, marginBottom:4 }}>End: {fmtTime(trimEnd)}</div>
            <input type="range" min={0} max={duration} step={0.1} value={trimEnd}
              onChange={e => { const v = Math.max(parseFloat(e.target.value), trimStart+1); setTrimEnd(v); if(videoRef.current) videoRef.current.currentTime=v; }}
              style={{ width:"100%", accentColor:"#ff6b6b" }} />
          </div>
        </div>
      )}

      {/* ── Text input panel ── */}
      {(activeMode === "text" || showTextInput) && (
        <div style={{ position:"absolute", inset:0, zIndex:20, background:"rgba(0,0,0,0.75)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
          {/* Text preview */}
          <div style={{ color: textColor, fontSize: textSize, fontWeight:900, marginBottom:20,
            background: textBg==="dark" ? "rgba(0,0,0,0.55)" : "transparent",
            padding: textBg!=="none" ? "6px 16px" : 0, borderRadius:10,
            textShadow:"0 1px 8px rgba(0,0,0,0.9)", minHeight:40, textAlign:"center",
            maxWidth:"85vw", wordBreak:"break-word" }}>
            {textInputVal || <span style={{ opacity:0.3 }}>Start typing...</span>}
          </div>

          {/* Text input */}
          <input
            autoFocus
            value={textInputVal}
            onChange={e => setTextInputVal(e.target.value)}
            placeholder="Type something..."
            style={{ width:"100%", maxWidth:400, background:"rgba(255,255,255,0.12)", border:"2px solid rgba(255,255,255,0.3)", borderRadius:14, padding:"14px 16px", color:"#fff", fontSize:16, outline:"none", marginBottom:16, textAlign:"center" }}
            onKeyDown={e => e.key==="Enter" && addTextOverlay()}
          />

          {/* Color swatches */}
          <div style={{ display:"flex", gap:10, marginBottom:14 }}>
            {TEXT_COLORS.map(c => (
              <div key={c} onClick={() => setTextColor(c)}
                style={{ width:28, height:28, borderRadius:"50%", background:c,
                  border: textColor===c ? "3px solid #F5C842" : "2px solid rgba(255,255,255,0.2)",
                  cursor:"pointer", boxShadow: textColor===c ? "0 0 10px rgba(245,200,66,0.6)" : "none",
                  flexShrink:0 }} />
            ))}
          </div>

          {/* Size slider */}
          <div style={{ width:"100%", maxWidth:400, marginBottom:14 }}>
            <div style={{ color:"#aaa", fontSize:11, marginBottom:6, textAlign:"center" }}>Size: {textSize}px</div>
            <input type="range" min={14} max={48} step={1} value={textSize}
              onChange={e => setTextSize(parseInt(e.target.value))}
              style={{ width:"100%", accentColor:"#F5C842" }} />
          </div>

          {/* Background style */}
          <div style={{ display:"flex", gap:10, marginBottom:20 }}>
            {[{v:"none",l:"No BG"},{v:"dark",l:"Dark BG"},{v:"colored",l:"Color BG"}].map(b => (
              <button key={b.v} onClick={() => setTextBg(b.v)}
                style={{ padding:"8px 14px", borderRadius:20, border:"none", cursor:"pointer", fontSize:12, fontWeight:700,
                  background: textBg===b.v ? "#F5C842" : "rgba(255,255,255,0.12)",
                  color: textBg===b.v ? "#000" : "#fff" }}>
                {b.l}
              </button>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display:"flex", gap:12, width:"100%", maxWidth:400 }}>
            <button onClick={() => { setShowTextInput(false); setActiveMode(null); setTextInputVal(""); }}
              style={{ flex:1, padding:"13px 0", background:"rgba(255,255,255,0.1)", border:"none", borderRadius:14, color:"#aaa", fontWeight:700, fontSize:15, cursor:"pointer" }}>
              Cancel
            </button>
            <button onClick={addTextOverlay}
              style={{ flex:2, padding:"13px 0", background:"linear-gradient(135deg,#F5C842,#FF9500)", border:"none", borderRadius:14, color:"#000", fontWeight:900, fontSize:15, cursor:"pointer" }}>
              ✓ Add Text
            </button>
          </div>
          <div style={{ color:"#666", fontSize:11, marginTop:12 }}>Tap a text overlay on video to remove it</div>
        </div>
      )}

      {trimming && (
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.85)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:30 }}>
          <div style={{ fontSize:40, marginBottom:16 }}>⚙️</div>
          <div style={{ color:"#fff", fontWeight:700, fontSize:16 }}>Processing video...</div>
        </div>
      )}
    </div>
  );
}


function UploadModal({ currentUser, onClose, onUploaded }) {
  const [file, setFile] = useState(null);
  const [editedFile, setEditedFile] = useState(null); // trimmed/cropped version
  const [showEditor, setShowEditor] = useState(false);
  const [uploadTab, setUploadTab] = useState("video");
  const [photos, setPhotos] = useState([]);
  const photoRef = useRef();
  const [caption, setCaption] = useState("");
  const [isMature, setIsMature] = useState(false);
  const [matureReason, setMatureReason] = useState("other");
  const [maxDuration, setMaxDuration] = useState(60);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  const [musicGenreFilter, setMusicGenreFilter] = useState("All");
  const [previewTrack, setPreviewTrack] = useState(null);
  const previewAudioRef = useRef(null);
  const [musicTracks, setMusicTracks] = useState([]);
  const [musicLoading, setMusicLoading] = useState(false);
  const [musicSearch, setMusicSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState("");
  const fileRef = useRef();

  const [notAiConfirmed, setNotAiConfirmed] = useState(false);
  const [aiBlocked, setAiBlocked] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  // Text post states
  const [textPostContent, setTextPostContent] = useState("");
  const [textPostTemplate, setTextPostTemplate] = useState(0);

  // Post details step
  const [showPostDetails, setShowPostDetails] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postVisibility, setPostVisibility] = useState("everyone"); // everyone | followers | only_me
  const [postLocation, setPostLocation] = useState(null); // { name, city }
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [showVisibilityPicker, setShowVisibilityPicker] = useState(false);

  const checkForExplicitContent = (f, cap) => {
    const explicit = ["nude", "naked", "nsfw", "xxx", "porn", "sex", "explicit", "adult only", "18+", "onlyfans", "erotic"];
    const name = f.name.toLowerCase();
    const capLower = (cap||"").toLowerCase();
    return explicit.some(kw => name.includes(kw) || capLower.includes(kw));
  };

  const checkForAiSignatures = (f, cap) => {
    const name = f.name.toLowerCase();
    const capLower = (cap || "").toLowerCase();
    const combined = name + " " + capLower;

    const aiKeywords = [
      // ── Top AI video generators ──
      "sora", "runway", "runwayml", "pika", "pikaart", "kling", "luma", "lumalabs",
      "gen2", "gen3", "gen4", "gen-2", "gen-3", "synthesia", "deepfake", "deep fake",
      "invideo", "heygen", "he-gen", "d-id", "did_video", "veed", "capcut_ai",
      "dreamina", "pixverse", "pixart", "haiper", "morph", "kaiber", "moonvalley",
      "stablevideo", "stable video", "stablediffusion", "stable diffusion",
      "animatediff", "animate diff", "modelscope", "zeroscope", "cogvideo",
      "text2video", "text to video", "img2video", "image to video",
      "openai video", "dalle video", "gemini video",
      "vidnoz", "fliki", "pictory", "flexclip_ai", "elai", "colossyan",
      "movio", "windsor", "tavus", "argil", "captions_ai", "captions.ai",
      "nova ai", "novaai", "steve ai", "steveai", "rawshorts",
      "wisecut", "descript_ai", "opus_ai", "munch_ai",

      // ── AI image generators used in video ──
      "midjourney", "midjrny", "dalle", "dall-e", "dall_e",
      "firefly", "adobe_ai", "ideogram", "leonardo_ai", "leonardoai",
      "nightcafe", "artbreeder", "civitai", "civit_ai",
      "playground_ai", "playgroundai", "tensor_art", "tensorart",
      "novelai", "novel_ai", "nijijourney",

      // ── Generic AI tags ──
      "ai_generated", "ai-generated", "aigenerated", "aigc", "ai_made",
      "ai_video", "aivideo", "made_by_ai", "created_by_ai", "generated_by_ai",
      "synthetic_media", "synthetic media", "deepfake", "deep_fake",
      "neural_render", "neural render", "gan_video", "diffusion_video",
      "aiart", "ai art", "ai content", "aicontent",
      "virtual human", "virtual_human", "digital human", "digital_human",
      "avatar video", "avatar_video", "ai avatar", "ai_avatar",
      "face swap", "faceswap", "face_swap", "voice clone", "voice_clone",
      "lip sync", "lipsync", "lip_sync",

      // ── Caption/hashtag signals ──
      "#ai", "#aiart", "#aivideo", "#aigc", "#artificialintelligence",
      "#aigenerated", "#deepfake", "#synthetic", "#notreal", "#virtualinfluencer",
      "#aiinfluencer", "#digitalavatar"
    ];

    return aiKeywords.some(kw => combined.includes(kw));
  };

  const [explicitBlocked, setExplicitBlocked] = useState(false);

  const handleFileSelect = async (f) => {
    if (!f) return;
    // Convert HEIC before any checks
    f = await convertHeicToJpeg(f);
    setFile(f);
    setEditedFile(null);
    setAiBlocked(false);
    setExplicitBlocked(false);
    if (checkForAiSignatures(f, caption)) { setAiBlocked(true); return; }
    if (checkForExplicitContent(f, caption)) { setExplicitBlocked(true); return; }
    // Show editor for video AND image files
    if (f.type.startsWith("video/") || f.type.startsWith("image/")) setShowEditor(true);
  };

  const handlePhotoSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    // Convert any HEIC files to JPEG
    const converted = await Promise.all(files.map(f => convertHeicToJpeg(f)));
    setPhotos(prev => {
      const combined = [...prev, ...converted];
      return combined.slice(0, 6);
    });
  };

  const removePhoto = (idx) => setPhotos(p => p.filter((_,i) => i !== idx));

  const uploadPhotos = async () => {
    if (!photos.length) return;
    setUploading(true); setProgress(10);
    try {
      setStep("Uploading photos...");
      const urls = [];
      for (let i = 0; i < photos.length; i++) {
        let photo = photos[i];
        // Convert HEIC to JPEG before upload
        setStep(`Processing photo ${i+1} of ${photos.length}...`);
        photo = await convertHeicToJpeg(photo);
        // Check file size — 20MB limit per photo
        if (photo.size > 20 * 1024 * 1024) {
          throw new Error(`Photo ${i+1} is too large. Max 20MB per photo.`);
        }
        setStep(`Uploading photo ${i+1} of ${photos.length}...`);
        const url = await uploadFile(photo);
        if (!url) throw new Error(`Failed to upload photo ${i+1}. Please try again.`);
        urls.push(url);
        setProgress(10 + Math.round(((i+1)/photos.length)*70));
      }
      setProgress(85); setStep("Saving to feed...");
      const photoGeo = await getPostLocation();
      const username = currentUser.full_name || currentUser.email?.split("@")[0] || "user";
      const tags = (caption.match(/#\w+/g) || []).map(t => t.toLowerCase());
      await videos.create({
        user_id: currentUser.id, username,
        display_name: currentUser.full_name || username,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`,
        video_url: urls[0],
        thumbnail_url: urls[0],
        photo_urls: urls,
        is_photo: true,
        caption: (postTitle ? postTitle + "\n" : "") + caption.trim(),
        hashtags: tags,
        likes_count: 0, comments_count: 0, views_count: 0, shares_count: 0,
        is_approved: true,
        is_archived: false, is_ai_detected: isAiGenerated,
        is_mature: isMature, mature_reason: isMature ? matureReason : null,
        post_visibility: postVisibility,
        post_location_name: postLocation?.name || null,
        post_city: postLocation?.city || photoGeo.post_city || null,
        ...photoGeo,
      });
      setProgress(100);
      if (isAiGenerated) {
        setStep("🤖 Bruh, AI has been flagged! Sent to MOD for review.");
        setTimeout(() => { onClose(); }, 2500);
      } else {
        setStep("Posted! 🎉");
        setTimeout(() => { onUploaded(); onClose(); }, 1000);
      }
    } catch(e) {
      toast.error("Upload failed: " + (e.message || "Please try again"));
      setUploading(false); setProgress(0); setStep("");
    }
  };

  const upload = async () => {
    if (!file) return;
    if (checkForExplicitContent(file, caption)) { toast.warn("🔞 Sexual or explicit content is not allowed on Sachi."); return; }
    if (aiBlocked || checkForAiSignatures(file, caption)) {
      toast.warn("🚫 AI-generated content is not allowed on Sachi.");
      return;
    }
    if (!notAiConfirmed && !isAiGenerated) {
      toast.warn("⚠️ Please confirm your video is NOT AI-generated before posting.");
      return;
    }
    // Check video duration
    try {
      const dur = await new Promise((res, rej) => {
        const v = document.createElement("video");
        v.preload = "metadata";
        v.onloadedmetadata = () => { URL.revokeObjectURL(v.src); res(v.duration); };
        v.onerror = rej;
        v.src = URL.createObjectURL(file);
      });
      if (dur > maxDuration) {
        toast.warn(`⚠️ Video is ${Math.round(dur)}s — limit is ${maxDuration === 600 ? "10 min" : maxDuration + "s"}. Please trim it.`);
        return;
      }
    } catch {}
    setUploading(true); setProgress(10);
    try {
      // Try Cloudflare Stream first for HLS adaptive streaming
      let video_url = null;
      let thumbnail_url = null;
      const streamResult = await uploadToCloudflareStream(
        editedFile || file,
        (pct, msg) => { setProgress(pct); setStep(msg); }
      );
      if (streamResult) {
        // Stream upload succeeded — use HLS URL
        video_url = streamResult.streamUrl;
        thumbnail_url = streamResult.thumbnailUrl;
        setProgress(95);
        setStep("Saving to feed...");
      } else {
        // Fall back to Base44 direct upload
        setStep("Uploading video...");
        video_url = await uploadFile(editedFile || file);
        setProgress(60);
        setStep("Generating thumbnail...");
        try { thumbnail_url = await Promise.race([captureThumbnail(file), new Promise(r => setTimeout(() => r(null), 5000))]); } catch {}
        setProgress(80);
        setStep("Saving to feed...");
      }
      const videoGeo = await getPostLocation();
      const username = currentUser.full_name || currentUser.email?.split("@")[0] || "user";
      const tags = (caption.match(/#\w+/g) || []).map(t => t.toLowerCase());
      await videos.create({
        user_id: currentUser.id, username,
        display_name: currentUser.full_name || username,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`,
        video_url, thumbnail_url,
        caption: (postTitle ? postTitle + "\n" : "") + caption.trim(),
        hashtags: tags,
        likes_count: 0, comments_count: 0, views_count: 0, shares_count: 0,
        is_approved: true,
        is_archived: false, is_ai_detected: isAiGenerated,
        is_mature: isMature, mature_reason: isMature ? matureReason : null,
        post_visibility: postVisibility,
        post_location_name: postLocation?.name || null,
        post_city: postLocation?.city || null,
        sound_title: selectedTrack?.sound_title || selectedTrack?.title || null,
        sound_artist: selectedTrack?.sound_artist || selectedTrack?.artist || null,
        sound_url: selectedTrack?.sound_url || selectedTrack?.url || null,
        ...videoGeo,
      });
      setProgress(100);
      if (isAiGenerated) {
        setStep("🤖 Bruh, AI has been flagged! Sent to MOD for review.");
        setTimeout(() => { onClose(); }, 2500);
      } else {
        setStep("Posted! 🎉");
        setTimeout(() => { onUploaded(); onClose(); }, 1000);
      }
    } catch(e) {
      toast.error("Upload failed: " + (e.message || "Please try again"));
      setUploading(false); setProgress(0); setStep("");
    }
  };

  const JAMENDO_CLIENT_ID = "c9f4d87f";
  const GENRE_TAG_MAP = {
    "All":"","Lo-Fi":"lounge","Hip-Hop":"hiphop","Electronic":"electronic",
    "R&B":"rnb","Pop":"pop","Chill":"relaxation","Afrobeats":"afrobeats",
    "Jazz":"jazz","Rock":"rock","Acoustic":"acoustic","Classical":"classical"
  };
  const GENRE_EMOJI = {
    "lounge":"🌆","hiphop":"🔥","electronic":"⚡","rnb":"❤️","pop":"🌈",
    "relaxation":"🌊","afrobeats":"🌍","jazz":"🎷","rock":"🎸","acoustic":"🎸","classical":"🎻"
  };

  const fetchMusicTracks = async (genre = "All", search = "") => {
    setMusicLoading(true);
    setMusicTracks([]);
    try {
      const tag = GENRE_TAG_MAP[genre] || "";
      // Use Base44 backend as proxy to avoid mobile CORS/SSL issues
      let apiUrl = `https://sachi-c7f0261c.base44.app/api/functions/getMusicTracks?genre=${encodeURIComponent(genre)}&limit=30`;
      if (search) apiUrl += `&search=${encodeURIComponent(search)}`;
      let tracks = [];
      try {
        const resp = await fetch(apiUrl);
        if (resp.ok) {
          const data = await resp.json();
          tracks = data.tracks || [];
        }
      } catch(proxyErr) {
        console.warn("[Sachi Music] Proxy failed, trying direct:", proxyErr);
      }
      // If proxy failed or returned nothing, try direct Jamendo
      if (tracks.length === 0) {
        let directUrl = `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=30&order=popularity_week&include=musicinfo&audioformat=mp31&imagesize=100`;
        if (tag)    directUrl += `&tags=${encodeURIComponent(tag)}`;
        if (search) directUrl += `&namesearch=${encodeURIComponent(search)}`;
        const resp2 = await fetch(directUrl);
        if (resp2.ok) {
          const data2 = await resp2.json();
          tracks = (data2.results || []).map(t => ({
            id:       `j_${t.id}`,
            title:    t.name,
            artist:   t.artist_name,
            url:      t.audio || t.audiodownload,
            genre:    genre === "All" ? (t.musicinfo?.tags?.genres?.[0] || "Music") : genre,
            emoji:    GENRE_EMOJI[tag] || "🎵",
            duration: t.duration,
            image:    t.image,
          })).filter(t => t.url);
        }
      }
      if (tracks.length > 0) {
        setMusicTracks(tracks);
      } else {
        throw new Error("No tracks from any source");
      }
    } catch(e) {
      console.error("[Sachi Music] All sources failed:", e);
      // Final fallback: curated local tracks
      const fallback = MUSIC_TRACKS.filter(t => genre === "All" || t.genre === genre);
      setMusicTracks(fallback.length > 0 ? fallback : MUSIC_TRACKS);
    }
    setMusicLoading(false);
  };

  const detectLocation = async () => {
    setDetectingLocation(true);
    try {
      const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout:8000 }));
      const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
      const data = await resp.json();
      const addr = data.address || {};
      const city = addr.city || addr.town || addr.village || addr.county || "";
      const state = addr.state || addr.region || "";
      const country_code = addr.country_code ? addr.country_code.toUpperCase() : "";
      // Save to localStorage for future posts
      if (city) localStorage.setItem('sachi_city', city);
      if (state) localStorage.setItem('sachi_region', state);
      if (country_code) localStorage.setItem('sachi_country_code', country_code);
      // Build display label: "New Providence, NJ" or "Auckland, New Zealand"
      const stateAbbr = getStateAbbr(state, country_code);
      const label = [city, stateAbbr || state].filter(Boolean).join(', ');
      setPostLocation({ name: label, city, state, country_code });
    } catch {
      // Fallback: try IP-based
      try {
        const r = await fetch('https://ipapi.co/json/');
        const d = await r.json();
        const city = d.city || '';
        const state = d.region || '';
        const country_code = d.country_code || '';
        if (city) localStorage.setItem('sachi_city', city);
        if (state) localStorage.setItem('sachi_region', state);
        if (country_code) localStorage.setItem('sachi_country_code', country_code);
        const stateAbbr = getStateAbbr(state, country_code);
        const label = [city, stateAbbr || state].filter(Boolean).join(', ');
        setPostLocation({ name: label, city, state, country_code });
      } catch { setPostLocation(null); }
    }
    setDetectingLocation(false);
  };

  // Intercept post buttons — go to details step first
  const goToPostDetails = () => {
    // Always re-detect location on each post (mandatory)
    detectLocation();
    setShowPostDetails(true);
  };

  const uploadTextPost = async () => {
    if (!textPostContent.trim()) { toast.warn("Please write something first!"); return; }
    setUploading(true); setProgress(10);
    try {
      setStep("Creating text post...");
      // Canvas render — matches each template style
      const UPLOAD_TPLS = [
        { bg:["#f8b4cb","#f8b4cb"], style:"highlight", hlColor:"#e91e8c", textColor:"#111", emoji:"😊", emojiTop:true },
        { bg:["#b8d4f0","#d6e8ff"], style:"highlight", hlColor:"#F5C842", textColor:"#222", emoji:"", emojiTop:false },
        { bg:["#0B0C1A","#1a1040"], style:"plain", textColor:"#F5C842", emoji:"🌸", emojiTop:true },
        { bg:["#d8e8f5","#eaf2ff"], style:"plain", textColor:"#4a6fa5", emoji:"", emojiTop:false },
        { bg:["#111111","#111111"], style:"plain", textColor:"#ffffff", emoji:"🌙", emojiTop:true },
        { bg:["#FF416C","#FF9500"], style:"plain", textColor:"#ffffff", emoji:"🌅", emojiTop:true },
        { bg:["#0F2027","#2C5364"], style:"plain", textColor:"#00E5FF", emoji:"🌊", emojiTop:true },
        { bg:["#1a1a1a","#2d1a00"], style:"plain", textColor:"#F5C842", emoji:"✨", emojiTop:true },
      ];
      const tpl = UPLOAD_TPLS[textPostTemplate] || UPLOAD_TPLS[0];

      const canvas = document.createElement("canvas");
      canvas.width = 540; canvas.height = 960;
      const ctx = canvas.getContext("2d");

      // Background
      const grad = ctx.createLinearGradient(0, 0, 540, 960);
      grad.addColorStop(0, tpl.bg[0]); grad.addColorStop(1, tpl.bg[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 540, 960);

      const fontSize = 58;
      const lineH = fontSize * 1.45;
      const maxW = 460;
      ctx.font = `900 ${fontSize}px 'Arial Black', Arial, sans-serif`;
      ctx.textBaseline = "top";

      // Word-wrap into lines
      const allWords = textPostContent.trim().split(" ");
      const lines = []; let curLine = "";
      for (const w of allWords) {
        const test = curLine ? curLine + " " + w : w;
        if (ctx.measureText(test).width > maxW && curLine) { lines.push(curLine); curLine = w; }
        else curLine = test;
      }
      if (curLine) lines.push(curLine);

      const totalTextH = lines.length * lineH;
      const emojiH = tpl.emoji ? 90 : 0;
      const emojiGap = tpl.emoji ? 24 : 0;
      const blockH = emojiH + emojiGap + totalTextH;
      let startY = (960 - blockH) / 2;

      // Emoji
      if (tpl.emoji) {
        ctx.font = "80px Arial"; ctx.textAlign = "left"; ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
        ctx.fillText(tpl.emoji, 40, startY);
        startY += emojiH + emojiGap;
      }

      ctx.font = `900 ${fontSize}px 'Arial Black', Arial, sans-serif`;

      if (tpl.style === "highlight") {
        // Draw highlight block behind each line (left aligned)
        const padX = 14, padY = 8;
        lines.forEach((l, i) => {
          const tw = ctx.measureText(l).width;
          const rx = 36, ry = startY + i * lineH - padY;
          // rounded rect fill
          ctx.fillStyle = tpl.hlColor;
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(rx, ry, tw + padX*2, fontSize + padY*2, 6) :
            ctx.rect(rx, ry, tw + padX*2, fontSize + padY*2);
          ctx.fill();
          ctx.fillStyle = tpl.textColor;
          ctx.textAlign = "left";
          ctx.fillText(l, rx + padX, startY + i * lineH);
        });
      } else {
        // Plain centered text
        ctx.textAlign = "center";
        ctx.shadowColor = tpl.bg[0] === "#ffffff" ? "transparent" : "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 10;
        lines.forEach((l, i) => {
          ctx.fillStyle = tpl.textColor;
          ctx.fillText(l, 270, startY + i * lineH);
        });
      }

      // Watermark
      ctx.font = "700 18px Arial"; ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.textAlign = "right"; ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
      ctx.fillText("sachi™", 520, 930);

      setProgress(30);
      const blob = await new Promise(r => canvas.toBlob(r, "image/jpeg", 0.92));
      const imgFile = new File([blob], `textpost_${Date.now()}.jpg`, { type:"image/jpeg" });
      setStep("Uploading...");
      const img_url = await uploadFile(imgFile);
      setProgress(75); setStep("Posting...");
      const textGeo = await getPostLocation();
      const username = currentUser.full_name || currentUser.email?.split("@")[0] || "user";
      await videos.create({
        user_id: currentUser.id, username,
        display_name: currentUser.full_name || username,
        avatar_url: localStorage.getItem(`avatar_${currentUser.id}`) || localStorage.getItem("avatar_last") ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`,
        video_url: img_url, thumbnail_url: img_url,
        photo_urls: [img_url], is_photo: true,
        caption: (postTitle ? postTitle + "\n" : "") + textPostContent.trim(),
        hashtags: (textPostContent.match(/#\w+/g) || []).map(t => t.toLowerCase()),
        likes_count:0, comments_count:0, views_count:0, shares_count:0,
        is_approved: postVisibility !== "only_me", is_archived: false, is_ai_detected: false, is_mature: false,
        sound_title: "Text Post", sound_artist: "sachi",
        post_visibility: postVisibility,
        post_location_name: postLocation?.name || null,
        post_city: postLocation?.city || null,
        ...textGeo,
      });
      setProgress(100); setStep("Posted! 🎉");
      setTimeout(() => { onUploaded(); onClose(); }, 1000);
    } catch(e) {
      toast.error("Upload failed: " + (e.message || "Please try again"));
      setUploading(false); setProgress(0); setStep("");
    }
  };

  return (
    <>
    {showEditor && (
      <VideoEditor
        file={file}
        onDone={(processed, overlays) => {
          setEditedFile(processed);
          // Append text overlays to caption
          if (overlays && overlays.length > 0) {
            const overlayText = overlays.map(o => o.text).join(" · ");
            setCaption(prev => prev ? prev + "\n" + overlayText : overlayText);
          }
          setShowEditor(false);
        }}
        onSkip={() => { setEditedFile(null); setShowEditor(false); }}
      />
    )}
    {/* ── POST DETAILS STEP ── */}
    {showPostDetails && (
      <div style={{ position:"fixed", inset:0, zIndex:3500, background:"#0B0C1A", display:"flex", flexDirection:"column" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={() => setShowPostDetails(false)}
            style={{ background:"none", border:"none", color:"#fff", fontSize:22, cursor:"pointer", lineHeight:1 }}>‹</button>
          <div style={{ color:"#fff", fontWeight:800, fontSize:17 }}>Post details</div>
          <div style={{ width:32 }} />
        </div>

        {/* Scrollable body */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 20px 40px" }}>

          {/* Title field */}
          <div style={{ marginBottom:20 }}>
            <input
              value={postTitle}
              onChange={e => setPostTitle(e.target.value)}
              placeholder="Add a catchy title..."
              style={{ width:"100%", background:"transparent", border:"none", borderBottom:"1.5px solid rgba(255,255,255,0.15)",
                padding:"10px 0", color:"#fff", fontSize:18, fontWeight:700, outline:"none",
                boxSizing:"border-box" }}
            />
            <div style={{ color:"#555", fontSize:12, marginTop:6 }}>Writing a title helps get 3× more views on average</div>
          </div>

          {/* Caption */}
          <div style={{ marginBottom:20 }}>
            <textarea
              value={uploadTab === "text" ? textPostContent : caption}
              onChange={e => uploadTab === "text" ? setTextPostContent(e.target.value) : setCaption(e.target.value)}
              placeholder="Write a caption... #hashtags"
              rows={3}
              style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
                borderRadius:12, padding:"12px 14px", color:"#fff", fontSize:14, resize:"none", outline:"none",
                boxSizing:"border-box" }}
            />
          </div>

          {/* Divider */}
          <div style={{ height:1, background:"rgba(255,255,255,0.06)", marginBottom:20 }} />

          {/* Location row - MANDATORY */}
          <div style={{ marginBottom:4 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", cursor:"pointer" }}
              onClick={detectLocation}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:20 }}>📍</span>
                <div>
                  <span style={{ color:"#fff", fontWeight:700, fontSize:15 }}>Location</span>
                  <span style={{ marginLeft:8, background:"rgba(245,200,66,0.15)", color:"#F5C842", fontSize:10, fontWeight:800, borderRadius:6, padding:"2px 6px", letterSpacing:0.5 }}>REQUIRED</span>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                {detectingLocation && <span style={{ color:"#F5C842", fontSize:12, fontWeight:600 }}>📡 Detecting...</span>}
                {postLocation && !detectingLocation && (
                  <span style={{ color:"#8BC34A", fontSize:13, fontWeight:600 }}>
                    ✓ {postLocation.name}
                  </span>
                )}
                {!postLocation && !detectingLocation && (
                  <span style={{ color:"#ff6b6b", fontSize:12, fontWeight:600 }}>Not set — tap to detect</span>
                )}
              </div>
            </div>
            {postLocation && !detectingLocation && (
              <div style={{ display:"flex", gap:8, paddingBottom:12, flexWrap:"wrap" }}>
                <div style={{ background:"rgba(139,195,74,0.12)", border:"1px solid rgba(139,195,74,0.25)", borderRadius:20, padding:"5px 14px", fontSize:13, color:"#8BC34A", display:"flex", alignItems:"center", gap:6 }}>
                  📍 {postLocation.name}
                  <span onClick={detectLocation} style={{ cursor:"pointer", color:"#666", fontSize:11, marginLeft:4 }}>↺ refresh</span>
                </div>
              </div>
            )}
            {!postLocation && !detectingLocation && (
              <div style={{ paddingBottom:12 }}>
                <div style={{ color:"#ff6b6b", fontSize:11, opacity:0.8 }}>📍 Location is required to post on Sachi. Tap above to detect automatically.</div>
              </div>
            )}
          </div>

          <div style={{ height:1, background:"rgba(255,255,255,0.06)", marginBottom:4 }} />

          {/* Who can view row */}
          <div style={{ padding:"14px 0", cursor:"pointer" }} onClick={() => setShowVisibilityPicker(v => !v)}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:20 }}>🌐</span>
                <span style={{ color:"#fff", fontWeight:700, fontSize:15 }}>Who can view</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ color:"#aaa", fontSize:13 }}>
                  {postVisibility === "everyone" ? "Everyone" : postVisibility === "followers" ? "Followers only" : "Only me"}
                </span>
                <span style={{ color:"#555", fontSize:18 }}>{showVisibilityPicker ? "▾" : "›"}</span>
              </div>
            </div>
            {showVisibilityPicker && (
              <div style={{ marginTop:12, background:"rgba(255,255,255,0.04)", borderRadius:14, overflow:"hidden" }}>
                {[
                  { val:"everyone", icon:"🌐", label:"Everyone", sub:"Anyone on Sachi can see this" },
                  { val:"followers", icon:"👥", label:"Followers only", sub:"Only people who follow you" },
                  { val:"only_me", icon:"🔒", label:"Only me", sub:"Saved privately, not shown in feed" },
                ].map(v => (
                  <div key={v.val}
                    onClick={e => { e.stopPropagation(); setPostVisibility(v.val); setShowVisibilityPicker(false); }}
                    style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px",
                      borderBottom:"1px solid rgba(255,255,255,0.05)", cursor:"pointer",
                      background: postVisibility===v.val ? "rgba(245,200,66,0.07)" : "transparent" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <span style={{ fontSize:20 }}>{v.icon}</span>
                      <div>
                        <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{v.label}</div>
                        <div style={{ color:"#666", fontSize:11 }}>{v.sub}</div>
                      </div>
                    </div>
                    {postVisibility===v.val && <span style={{ color:"#F5C842", fontSize:18 }}>✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ height:1, background:"rgba(255,255,255,0.06)", marginBottom:24 }} />

          {/* Mature content toggle */}
          {uploadTab !== "text" && (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"4px 0", marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:20 }}>🔞</span>
                <div>
                  <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>Mature content</div>
                  <div style={{ color:"#555", fontSize:11 }}>18+ viewers only</div>
                </div>
              </div>
              <div onClick={() => setIsMature(m => !m)}
                style={{ width:48, height:26, borderRadius:13,
                  background: isMature ? "#ff6b6b" : "rgba(255,255,255,0.12)",
                  position:"relative", cursor:"pointer", transition:"background 0.2s" }}>
                <div style={{ position:"absolute", top:3, left: isMature ? 25 : 3, width:20, height:20,
                  borderRadius:"50%", background:"#fff", transition:"left 0.2s",
                  boxShadow:"0 1px 4px rgba(0,0,0,0.3)" }} />
              </div>
            </div>
          )}

          {/* Upload progress */}
          {uploading && (
            <div style={{ marginBottom:20 }}>
              <div style={{ color:"#aaa", fontSize:13, marginBottom:8 }}>{step}</div>
              <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:99, height:6, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#ff6b6b,#ff8e53)", borderRadius:99, transition:"width 0.4s ease" }} />
              </div>
            </div>
          )}
        </div>

        {/* Bottom buttons */}
        <div style={{ padding:"12px 20px 40px", display:"flex", gap:12, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={() => setShowPostDetails(false)} disabled={uploading}
            style={{ flex:1, padding:"14px 0", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:14, color:"#aaa", fontWeight:700, fontSize:15, cursor:"pointer" }}>
            ← Back
          </button>
          <button
            onClick={() => {
              if (!postLocation) { toast.warn('📍 Please allow location access to post on Sachi.'); detectLocation(); return; }
              if (uploadTab === "text") uploadTextPost();
              else if (uploadTab === "photo") uploadPhotos();
              else upload();
            }}
            disabled={uploading || detectingLocation}
            style={{ flex:2.5, padding:"14px 0",
              background: uploading ? "#333" : (!postLocation || detectingLocation) ? "rgba(255,107,107,0.25)" : "linear-gradient(135deg,#ff6b6b,#ff8e53)",
              border: (!postLocation && !uploading) ? "1.5px solid rgba(255,107,107,0.4)" : "none",
              borderRadius:14, color: (!postLocation && !uploading) ? "rgba(255,255,255,0.4)" : "#fff",
              fontWeight:900, fontSize:16, cursor: (uploading || detectingLocation) ? "default" : "pointer",
              boxShadow: postLocation && !uploading ? "0 4px 20px rgba(255,107,107,0.35)" : "none",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            {uploading ? step : detectingLocation ? "📡 Detecting location..." : !postLocation ? "📍 Location required" : <><span style={{ fontSize:18 }}>⬆</span> Post</>}
          </button>
        </div>
      </div>
    )}

    <div style={{ position:"fixed", inset:0, zIndex:2000, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.85)" }} />
      <div style={{ position:"relative", width:"100%", maxWidth:480, margin:"0 auto", background:"#0f0f1a", borderRadius:"24px 24px 0 0", zIndex:2001,
        maxHeight:"92vh", display:"flex", flexDirection:"column",
        paddingBottom:"env(safe-area-inset-bottom, 24px)" }}>
        {/* Scrollable inner content */}
        <div style={{ overflowY:"auto", flex:1, padding:"24px 24px 32px", WebkitOverflowScrolling:"touch" }}>
        <div style={{ width:40, height:4, background:"#444", borderRadius:99, margin:"0 auto 20px" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>{uploadTab==="video" ? "📹 Post a Video" : uploadTab==="photo" ? "🖼️ Post Photos" : "✏️ Text Post"}</div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:"50%", width:32, height:32, color:"#fff", cursor:"pointer" }}>✕</button>
        </div>
        {/* Tab switcher */}
        <div style={{ display:"flex", gap:8, marginBottom:18, background:"rgba(255,255,255,0.05)", borderRadius:14, padding:4 }}>
          {[{id:"video",label:"🎬 Video"},{id:"photo",label:"🖼️ Photos"},{id:"text",label:"✏️ Text"}].map(t => (
            <button key={t.id} onClick={() => { setUploadTab(t.id); setFile(null); setPhotos([]); }}
              style={{ flex:1, padding:"10px 0", borderRadius:11, border:"none",
                background: uploadTab===t.id ? (t.id==="text" ? "linear-gradient(135deg,#7C3AED,#A855F7)" : "linear-gradient(135deg,#ff6b6b,#ff8e53)") : "transparent",
                color: uploadTab===t.id ? "#fff" : "#888", fontWeight:800, fontSize:13, cursor:"pointer" }}>
              {t.label}
            </button>
          ))}
        </div>

        {uploadTab !== "text" && (<>
        {/* Duration Selector */}
        <div style={{ marginBottom:16 }}>
          <div style={{ color:"#aaa", fontSize:12, fontWeight:600, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Video Length</div>
          <div style={{ display:"flex", gap:8 }}>
            {[
              { label:"15s", val:15, icon:"⚡" },
              { label:"60s", val:60, icon:"🎬" },
              { label:"10 min", val:600, icon:"🎥" },
            ].map(opt => (
              <button key={opt.val} onClick={() => setMaxDuration(opt.val)}
                style={{
                  flex:1, padding:"10px 0", borderRadius:12, border: maxDuration === opt.val ? "2px solid #ff6b6b" : "1px solid rgba(255,255,255,0.1)",
                  background: maxDuration === opt.val ? "rgba(255,107,107,0.18)" : "rgba(255,255,255,0.05)",
                  color: maxDuration === opt.val ? "#ff6b6b" : "#aaa",
                  fontWeight:700, fontSize:14, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3
                }}>
                <span style={{ fontSize:18 }}>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {uploadTab === "photo" ? (
          <div style={{ marginBottom:16 }}>
            {/* Photo grid preview */}
            {photos.length > 0 && (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6, marginBottom:12 }}>
                {photos.map((p,i) => (
                  <div key={i} style={{ position:"relative", aspectRatio:"1", borderRadius:10, overflow:"hidden", border:"2px solid rgba(255,107,107,0.3)" }}>
                    <img src={URL.createObjectURL(p)} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    <button onClick={() => removePhoto(i)}
                      style={{ position:"absolute", top:4, right:4, background:"rgba(0,0,0,0.7)", border:"none",
                        borderRadius:"50%", width:22, height:22, color:"#fff", fontSize:13, cursor:"pointer",
                        display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1 }}>✕</button>
                    {i===0 && <div style={{ position:"absolute", bottom:4, left:4, background:"rgba(255,107,107,0.85)", borderRadius:6, padding:"1px 6px", fontSize:10, color:"#fff", fontWeight:700 }}>Cover</div>}
                  </div>
                ))}
                {photos.length < 6 && (
                  <div onClick={() => photoRef.current?.click()}
                    style={{ aspectRatio:"1", borderRadius:10, border:"2px dashed rgba(255,255,255,0.2)",
                      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                      cursor:"pointer", color:"#888", fontSize:12, gap:4 }}>
                    <span style={{ fontSize:24 }}>＋</span>
                    <span>Add more</span>
                  </div>
                )}
              </div>
            )}
            {photos.length === 0 && (
              <div onClick={() => photoRef.current?.click()}
                style={{ border:"2px dashed rgba(255,107,107,0.4)", borderRadius:16, padding:40, textAlign:"center", cursor:"pointer" }}>
                <div style={{ fontSize:48, marginBottom:10 }}>🖼️</div>
                <div style={{ color:"#fff", fontWeight:700, fontSize:16, marginBottom:6 }}>Tap to select photos</div>
                <div style={{ color:"#666", fontSize:13 }}>Up to 6 photos · JPG, PNG, HEIC</div>
              </div>
            )}
            <input ref={photoRef} type="file" accept="image/*" multiple style={{ display:"none" }} onChange={handlePhotoSelect} />
            {photos.length > 0 && <div style={{ color:"#888", fontSize:12, textAlign:"center", marginTop:4 }}>{photos.length}/6 photos selected · Tap ✕ to remove</div>}
          </div>
        ) : (
        <>
        {!file ? (
          <div onClick={() => fileRef.current?.click()}
            style={{ border:"2px dashed rgba(255,107,107,0.4)", borderRadius:16, padding:48, textAlign:"center", cursor:"pointer", marginBottom:16 }}>
            <div style={{ fontSize:48, marginBottom:10 }}>🎬</div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:16, marginBottom:6 }}>Tap to select video</div>
            <div style={{ color:"#666", fontSize:13 }}>MP4, MOV, WebM · Max 500MB</div>
            <input ref={fileRef} type="file" accept="video/*" style={{ display:"none" }} onChange={e => {
              const f = e.target.files[0];
              if (!f) return;
              if (f.size > 150 * 1024 * 1024) {
                toast.warn("Video must be under 150MB — please trim or compress it first.");
                e.target.value = "";
                return;
              }
              setFile(f);
            }} />
          </div>
        ) : (
          <div style={{ background:"rgba(255,107,107,0.08)", border:"1px solid rgba(255,107,107,0.2)", borderRadius:12, padding:14, marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ fontSize:32 }}>🎥</div>
            <div style={{ flex:1 }}>
              <div style={{ color:"#fff", fontWeight:600, fontSize:14 }}>{file.name}</div>
              <div style={{ color:"#888", fontSize:12 }}>{(file.size/1024/1024).toFixed(1)} MB</div>
            </div>
            <button onClick={() => setFile(null)} style={{ background:"none", border:"none", color:"#ff6b6b", cursor:"pointer", fontSize:18 }}>✕</button>
          </div>
        )}
        </>
        )}
        {uploadTab !== "text" && (
          <div style={{ position:"relative", marginBottom:16 }}>
            <textarea value={caption} onChange={e => setCaption(e.target.value.slice(0,500))} placeholder="Write a caption... #hashtags" rows={3}
              style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:`1px solid ${caption.length > 480 ? "rgba(255,107,107,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius:12, padding:12, color:"#fff", fontSize:14, resize:"none", outline:"none", boxSizing:"border-box", paddingBottom:28 }} />
            <div style={{ position:"absolute", bottom:8, right:12, fontSize:11, color: caption.length > 480 ? "#ff6b6b" : "#555" }}>{caption.length}/500</div>
          </div>
        )}



        </>)}

        {/* ── TEXT POST MODE ── */}
        {uploadTab === "text" && (() => {
          // Template definitions — each has a render function for the preview
          const TEXT_TEMPLATES = [
            {
              name:"Blush", id:0,
              // Pink bg, black text, pink HIGHLIGHT block behind each line, emoji top-left
              bgStyle:"#f8b4cb",
              render:(text, mini) => {
                const lines = text ? text.split(" ").reduce((acc,w) => {
                  const last = acc[acc.length-1];
                  if (last && (last + " " + w).length <= 12) { acc[acc.length-1] = last + " " + w; }
                  else acc.push(w);
                  return acc;
                }, []) : ["Hey","happy","Monday"];
                const fs = mini ? 11 : 38;
                const pad = mini ? "2px 5px" : "6px 14px";
                return (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", gap: mini?3:8, padding: mini?"8px":"20px", width:"100%" }}>
                    {!mini && <div style={{ fontSize:36, marginBottom:4 }}>😊</div>}
                    {mini && <div style={{ fontSize:14, marginBottom:2 }}>😊</div>}
                    {lines.map((l,i) => (
                      <div key={i} style={{ background:"#e91e8c", display:"inline-block", padding:pad, borderRadius:4 }}>
                        <span style={{ fontSize:fs, fontWeight:900, color:"#111", fontFamily:"'Arial Black',sans-serif", lineHeight:1.1 }}>{l}</span>
                      </div>
                    ))}
                  </div>
                );
              }
            },
            {
              name:"Note", id:1,
              bgStyle:"linear-gradient(160deg,#b8d4f0,#d6e8ff)",
              render:(text, mini) => {
                const lines = text ? text.split(" ").reduce((acc,w) => {
                  const last = acc[acc.length-1];
                  if (last && (last + " " + w).length <= 12) { acc[acc.length-1] = last + " " + w; }
                  else acc.push(w);
                  return acc;
                }, []) : ["Hey","happy","Monday"];
                const fs = mini ? 10 : 34;
                return (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:mini?2:6, padding:mini?"8px":"24px", width:"100%", height:"100%" }}>
                    {lines.map((l,i) => (
                      <div key={i} style={{ background:"#F5C842", display:"inline-block", padding:mini?"1px 5px":"4px 12px", borderRadius:3, transform:`rotate(${i%2===0?-1:1}deg)` }}>
                        <span style={{ fontSize:fs, fontWeight:900, color:"#222", fontFamily:"'Arial Black',sans-serif", lineHeight:1.1 }}>{l}</span>
                      </div>
                    ))}
                  </div>
                );
              }
            },
            {
              name:"Sakura", id:2,
              bgStyle:"linear-gradient(135deg,#0B0C1A,#1a1040)",
              render:(text, mini) => {
                const words = text || "Hey happy Monday";
                const fs = mini ? 9 : 34;
                return (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:mini?3:10, padding:mini?"8px":"24px", width:"100%", height:"100%" }}>
                    {!mini && <div style={{ fontSize:32, marginBottom:4 }}>🌸</div>}
                    {mini && <div style={{ fontSize:12 }}>🌸</div>}
                    <span style={{ fontSize:fs, fontWeight:900, color:"#F5C842", fontFamily:"Georgia,serif", textAlign:"center", lineHeight:1.3, wordBreak:"break-word" }}>{words}</span>
                  </div>
                );
              }
            },
            {
              name:"Misty", id:3,
              bgStyle:"linear-gradient(160deg,#d8e8f5,#eaf2ff)",
              render:(text, mini) => {
                const words = text || "Hey happy Monday";
                const fs = mini ? 9 : 30;
                return (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:mini?"8px":"24px", width:"100%", height:"100%" }}>
                    <span style={{ fontSize:fs, fontWeight:700, color:"#4a6fa5", fontFamily:"Georgia,serif", textAlign:"center", lineHeight:1.4, wordBreak:"break-word", opacity:0.85 }}>{words}</span>
                  </div>
                );
              }
            },
            {
              name:"Midnight", id:4,
              bgStyle:"#111111",
              render:(text, mini) => {
                const words = text || "Hey happy Monday";
                const fs = mini ? 9 : 34;
                return (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:mini?"8px":"24px", width:"100%", height:"100%" }}>
                    {mini && <div style={{ fontSize:12 }}>🌙</div>}
                    {!mini && <div style={{ fontSize:32, marginBottom:8 }}>🌙</div>}
                    <span style={{ fontSize:fs, fontWeight:900, color:"#fff", fontFamily:"'Arial Black',sans-serif", textAlign:"center", lineHeight:1.3, wordBreak:"break-word" }}>{words}</span>
                  </div>
                );
              }
            },
            {
              name:"Sunset", id:5,
              bgStyle:"linear-gradient(135deg,#FF416C,#FF9500)",
              render:(text, mini) => {
                const words = text || "Hey happy Monday";
                const fs = mini ? 9 : 34;
                return (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:mini?"8px":"24px", width:"100%", height:"100%" }}>
                    {!mini && <div style={{ fontSize:32, marginBottom:8 }}>🌅</div>}
                    {mini && <div style={{ fontSize:12 }}>🌅</div>}
                    <span style={{ fontSize:fs, fontWeight:900, color:"#fff", fontFamily:"'Arial Black',sans-serif", textAlign:"center", lineHeight:1.3, wordBreak:"break-word", textShadow:"0 2px 8px rgba(0,0,0,0.3)" }}>{words}</span>
                  </div>
                );
              }
            },
            {
              name:"Ocean", id:6,
              bgStyle:"linear-gradient(160deg,#0F2027,#2C5364)",
              render:(text, mini) => {
                const words = text || "Hey happy Monday";
                const fs = mini ? 9 : 32;
                return (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:mini?"8px":"24px", width:"100%", height:"100%" }}>
                    {!mini && <div style={{ fontSize:32, marginBottom:8 }}>🌊</div>}
                    {mini && <div style={{ fontSize:12 }}>🌊</div>}
                    <span style={{ fontSize:fs, fontWeight:800, color:"#00E5FF", fontFamily:"Arial,sans-serif", textAlign:"center", lineHeight:1.3, wordBreak:"break-word" }}>{words}</span>
                  </div>
                );
              }
            },
            {
              name:"Gold", id:7,
              bgStyle:"linear-gradient(135deg,#1a1a1a,#2d1a00)",
              render:(text, mini) => {
                const words = text || "Hey happy Monday";
                const fs = mini ? 9 : 34;
                return (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:mini?"8px":"24px", width:"100%", height:"100%" }}>
                    {!mini && <div style={{ fontSize:32, marginBottom:8 }}>✨</div>}
                    {mini && <div style={{ fontSize:12 }}>✨</div>}
                    <span style={{ fontSize:fs, fontWeight:900, color:"#F5C842", fontFamily:"Georgia,serif", textAlign:"center", lineHeight:1.3, wordBreak:"break-word", textShadow:"0 0 20px rgba(245,200,66,0.4)" }}>{words}</span>
                  </div>
                );
              }
            },
          ];

          const tpl = TEXT_TEMPLATES[textPostTemplate] || TEXT_TEMPLATES[0];
          const displayText = textPostContent || "";

          return (
            <div style={{ marginBottom:16 }}>
              {/* ── Big preview card ── */}
              <div style={{
                borderRadius:20, overflow:"hidden", marginBottom:14,
                aspectRatio:"4/5", maxHeight:420,
                display:"flex", flexDirection:"column", alignItems:"stretch",
                position:"relative",
                background: tpl.bgStyle,
                boxShadow:"0 8px 40px rgba(0,0,0,0.5)",
              }}>
                {tpl.render(displayText, false)}
                <div style={{ position:"absolute", bottom:10, right:14,
                  color:"rgba(0,0,0,0.18)", fontSize:10, fontWeight:700, letterSpacing:1 }}>sachi™</div>
              </div>

              {/* ── Text input ── */}
              <textarea
                autoFocus
                value={textPostContent}
                onChange={e => setTextPostContent(e.target.value)}
                placeholder="What's on your mind?"
                rows={2}
                style={{ width:"100%", background:"rgba(255,255,255,0.07)", border:"2px solid rgba(255,255,255,0.12)",
                  borderRadius:14, padding:"12px 14px", color:"#fff", fontSize:16, resize:"none", outline:"none",
                  boxSizing:"border-box", marginBottom:14, fontWeight:600, lineHeight:1.5 }}
              />

              {/* ── "Select a style" label ── */}
              <div style={{ color:"#aaa", fontSize:13, fontWeight:600, marginBottom:10 }}>Select a style</div>

              {/* ── Template thumbnail strip ── */}
              <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:8, scrollbarWidth:"none", WebkitOverflowScrolling:"touch" }}>
                {TEXT_TEMPLATES.map((t, i) => (
                  <div key={i} onClick={() => setTextPostTemplate(i)}
                    style={{
                      flexShrink:0, width:76, height:104, borderRadius:12,
                      background: t.bgStyle,
                      border: textPostTemplate===i ? "3px solid #F5C842" : "2px solid rgba(255,255,255,0.08)",
                      display:"flex", alignItems:"stretch",
                      cursor:"pointer", overflow:"hidden", position:"relative",
                      boxShadow: textPostTemplate===i ? "0 0 16px rgba(245,200,66,0.5)" : "0 2px 8px rgba(0,0,0,0.4)",
                      transition:"all 0.15s",
                      transform: textPostTemplate===i ? "scale(1.06)" : "scale(1)",
                    }}>
                    {t.render(displayText || "Hey happy Monday", true)}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {uploadTab !== "text" && <>
        {/* Music Picker Button */}
        <div onClick={() => setShowMusicPicker(true)}
          style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.06)", border:`1px solid ${selectedTrack ? "rgba(245,200,66,0.4)" : "rgba(255,255,255,0.1)"}`, borderRadius:12, padding:"12px 14px", marginBottom:12, cursor:"pointer" }}>
          <div style={{ fontSize:22 }}>🎵</div>
          <div style={{ flex:1 }}>
            <div style={{ color: selectedTrack ? "#F5C842" : "#fff", fontWeight:700, fontSize:14 }}>{selectedTrack ? selectedTrack.sound_title || selectedTrack.title : "Add Sound"}</div>
            <div style={{ color:"#888", fontSize:12 }}>{selectedTrack ? (selectedTrack.sound_artist || selectedTrack.artist) : "Pick from trending, search, or Sachi creators"}</div>
          </div>
          {selectedTrack && <button onClick={e => { e.stopPropagation(); setSelectedTrack(null); }} style={{ background:"none", border:"none", color:"#ff6b6b", fontSize:16, cursor:"pointer", padding:0 }}>✕</button>}
          <div style={{ color:"#888", fontSize:18 }}>▶</div>
        </div>

        {showMusicPicker && (
          <MusicPicker
            currentSound={selectedTrack}
            onSelect={track => { setSelectedTrack(track); setShowMusicPicker(false); }}
            onClose={() => setShowMusicPicker(false)}
          />
        )}
        {/* Explicit Content Block Warning */}
        {explicitBlocked && (
          <div style={{ background:"rgba(255,50,50,0.12)", border:"1px solid rgba(255,50,50,0.4)", borderRadius:12, padding:"14px 16px", marginBottom:12, display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ fontSize:22, flexShrink:0 }}>🔞</div>
            <div>
              <div style={{ color:"#ff4444", fontWeight:700, fontSize:14, marginBottom:4 }}>Explicit Content Not Allowed</div>
              <div style={{ color:"#cc6666", fontSize:13, lineHeight:1.5 }}>Sachi does not allow sexual or explicit content. Please upload appropriate videos only.</div>
            </div>
          </div>
        )}

        {/* AI Block Warning */}
        {aiBlocked && (
          <div style={{ background:"rgba(255,50,50,0.12)", border:"1px solid rgba(255,50,50,0.4)", borderRadius:12, padding:"14px 16px", marginBottom:12, display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ fontSize:22, flexShrink:0 }}>🚫</div>
            <div>
              <div style={{ color:"#ff4444", fontWeight:700, fontSize:16, marginBottom:4 }}>Bruh. 💀</div>
              <div style={{ color:"#cc6666", fontSize:14, lineHeight:1.6 }}>You can't upload AI videos on this site. 🚫🤖<br/>Keep it real — post your own original content.</div>
            </div>
          </div>
        )}

        {/* Mature Content Toggle */}
        {!aiBlocked && !explicitBlocked && file && (
          <div style={{ marginBottom:14 }}>
            <div onClick={() => setIsMature(p => !p)}
              style={{ display:"flex", gap:10, alignItems:"center", cursor:"pointer", padding:"10px 14px", background:"rgba(255,255,255,0.04)", borderRadius:10, border:`1px solid ${isMature ? "rgba(255,107,107,0.5)" : "rgba(255,255,255,0.1)"}` }}>
              <div style={{ width:20, height:20, borderRadius:5, border:`2px solid ${isMature ? "#ff6b6b" : "#555"}`, background: isMature ? "#ff6b6b" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s" }}>
                {isMature && <span style={{ color:"#fff", fontSize:13, fontWeight:900 }}>✓</span>}
              </div>
              <div style={{ color: isMature ? "#ff6b6b" : "#888", fontSize:13, lineHeight:1.4 }}>
                🔞 This video contains <strong>mature content</strong> (violence, fighting, adult themes)
              </div>
            </div>
            {isMature && (
              <select value={matureReason} onChange={e => setMatureReason(e.target.value)}
                style={{ marginTop:8, width:"100%", padding:"10px 14px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,107,107,0.3)", borderRadius:10, color:"#fff", fontSize:13, outline:"none" }}>
                <option value="violence">⚔️ Violence</option>
                <option value="fighting">🥊 Fighting / Combat</option>
                <option value="adult_themes">🔞 Adult Themes</option>
                <option value="strong_language">🤬 Strong Language</option>
                <option value="other">⚠️ Other Mature Content</option>
              </select>
            )}
          </div>
        )}

        {/* AI Generated Disclosure Toggle */}
        {!aiBlocked && !explicitBlocked && (
          <div style={{ marginBottom:14 }}>
            <div onClick={() => setIsAiGenerated(p => !p)}
              style={{ display:"flex", gap:10, alignItems:"center", cursor:"pointer", padding:"10px 14px",
                background: isAiGenerated ? "rgba(255,149,0,0.08)" : "rgba(255,255,255,0.04)",
                borderRadius:10, border:`1px solid ${isAiGenerated ? "rgba(255,149,0,0.5)" : "rgba(255,255,255,0.1)"}` }}>
              <div style={{ width:20, height:20, borderRadius:5,
                border:`2px solid ${isAiGenerated ? "#FF9500" : "#555"}`,
                background: isAiGenerated ? "#FF9500" : "transparent",
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s",
                boxShadow: isAiGenerated ? "0 0 10px 3px rgba(255,149,0,0.7), 0 0 20px 6px rgba(255,149,0,0.3)" : "none" }}>
                {isAiGenerated && <span style={{ color:"#fff", fontSize:13, fontWeight:900 }}>✓</span>}
              </div>
              <div style={{ color: isAiGenerated ? "#FF9500" : "#888", fontSize:13, lineHeight:1.4 }}>
                🤖 <strong>Flag as AI</strong> — let your viewers know this content was AI generated
              </div>
            </div>
            {isAiGenerated && (
              <div style={{ marginTop:8, padding:"10px 14px", background:"rgba(255,149,0,0.07)", borderRadius:10, border:"1px solid rgba(255,149,0,0.2)" }}>
                <div style={{ color:"#FF9500", fontSize:12, lineHeight:1.5 }}>
                  ⚠️ Your post will be <strong>held for MOD review</strong> before going live. If approved, it will show an <strong>🤖 AI Generated</strong> badge. Sachi values truth — thanks for being honest.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Not AI Confirmation Checkbox */}
        {!aiBlocked && !explicitBlocked && !isAiGenerated && file && (
          <div onClick={() => setNotAiConfirmed(p => !p)}
            style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14, cursor:"pointer", padding:"10px 14px", background:"rgba(255,255,255,0.04)", borderRadius:10, border:`1px solid ${notAiConfirmed ? "rgba(107,255,154,0.4)" : "rgba(255,255,255,0.1)"}` }}>
            <div style={{ width:20, height:20, borderRadius:5, border:`2px solid ${notAiConfirmed ? "#6bff9a" : "#555"}`, background: notAiConfirmed ? "#6bff9a" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s" }}>
              {notAiConfirmed && <span style={{ color:"#0a0a14", fontSize:13, fontWeight:900 }}>✓</span>}
            </div>
            <div style={{ color: notAiConfirmed ? "#6bff9a" : "#888", fontSize:13, lineHeight:1.4 }}>
              I confirm this is <strong>my original video</strong> and is <strong>NOT AI-generated</strong>
            </div>
          </div>
        )}

        </>}

        {uploading && (
          <div style={{ marginBottom:16 }}>
            <div style={{ color:"#aaa", fontSize:13, marginBottom:6 }}>{step}</div>
            <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:99, height:6, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#ff6b6b,#ff8e53)", borderRadius:99, transition:"width 0.4s ease" }} />
            </div>
          </div>
        )}
        {uploadTab === "text" ? (
          <button onClick={() => textPostContent.trim() && !uploading && goToPostDetails()}
            disabled={!textPostContent.trim() || uploading}
            style={{ width:"100%", padding:14, background: textPostContent.trim() && !uploading ? "linear-gradient(135deg,#7C3AED,#A855F7)" : "rgba(255,255,255,0.08)", border:"none", borderRadius:14, color:"#fff", fontWeight:800, fontSize:16, cursor: textPostContent.trim() && !uploading ? "pointer" : "not-allowed", opacity: textPostContent.trim() && !uploading ? 1 : 0.5 }}>
            {uploading ? step : "Next →"}
          </button>
        ) : uploadTab === "photo" ? (
          <button onClick={() => photos.length && !uploading && goToPostDetails()}
            disabled={!photos.length || uploading}
            style={{ width:"100%", padding:14, background: photos.length && !uploading ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "rgba(255,255,255,0.08)", border:"none", borderRadius:14, color:"#fff", fontWeight:800, fontSize:16, cursor: photos.length && !uploading ? "pointer" : "not-allowed", opacity: photos.length && !uploading ? 1 : 0.5 }}>
            {uploading ? step : "Next →"}
          </button>
        ) : (
          <button onClick={() => file && !uploading && !aiBlocked && !explicitBlocked && (notAiConfirmed || isAiGenerated) && goToPostDetails()}
            disabled={!file || uploading || aiBlocked || explicitBlocked || (!notAiConfirmed && !isAiGenerated)}
            style={{ width:"100%", padding:14, background: file && !uploading ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "rgba(255,255,255,0.08)", border:"none", borderRadius:14, color:"#fff", fontWeight:800, fontSize:16, cursor: file && !uploading && !aiBlocked && !explicitBlocked && (notAiConfirmed || isAiGenerated) ? "pointer" : "not-allowed", opacity: file && !uploading && !aiBlocked && !explicitBlocked && (notAiConfirmed || isAiGenerated) ? 1 : 0.5 }}>
            {uploading ? step : "Next →"}
          </button>
        )}
        </div>{/* end scrollable inner */}
      </div>
    </div>
    {/* Audio preview player - always mounted */}
    <audio ref={previewAudioRef} onEnded={() => setPreviewTrack(null)} style={{ display:"none" }} />
    </>
  );
}

// ── HLS Video Component ─────────────────────────────────────────────────────────
function HLSVideo({ src, isHLS, videoRef, poster, muted, onPlay, onPause }) {
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;
    if (isHLS && !video.canPlayType('application/vnd.apple.mpegurl')) {
      const loadHLS = async () => {
        if (!window.Hls) {
          await new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.7/dist/hls.min.js';
            s.onload = resolve; s.onerror = reject;
            document.head.appendChild(s);
          });
        }
        if (window.Hls && window.Hls.isSupported()) {
          if (video._hls) { video._hls.destroy(); }
          const hls = new window.Hls({ maxBufferLength: 30, startLevel: -1 });
          hls.loadSource(src);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, () => { video.play().catch(() => {}); });
          video._hls = hls;
        }
      };
      loadHLS().catch(console.error);
      return () => { if (video._hls) { video._hls.destroy(); video._hls = null; } };
    } else {
      video.src = src;
    }
  }, [src]);
  return (
    <video ref={videoRef} poster={poster} loop playsInline preload="auto" muted={muted}
      onPlay={onPlay} onPause={onPause}
      style={{ width:"100%", height:"100%", objectFit:"cover", pointerEvents:"none", display:"block" }} />
  );
}

// ── Video Card ────────────────────────────────────────────────────────────────
// ─── Age Gate Helper ──────────────────────────────────────────────────────────
function getUserAge() {
  const dob = localStorage.getItem("sachi_dob");
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

function FlameIcon({ views = 0 }) {
  const lvl = views >= 10000 ? 3 : views >= 1000 ? 2 : views >= 100 ? 1 : 0;
  const sizes = [28, 32, 38, 44];
  const sz = sizes[lvl];
  const themes = [
    { outer: '#378ADD', mid: '#85B7EB', inner: '#E6F1FB', glow: 'rgba(55,138,221,0.6)' },
    { outer: '#BA7517', mid: '#EF9F27', inner: '#FAC775', glow: 'rgba(239,159,39,0.6)' },
    { outer: '#D85A30', mid: '#EF9F27', inner: '#FAC775', glow: 'rgba(216,90,48,0.7)' },
    { outer: '#A32D2D', mid: '#D85A30', inner: '#EF9F27', glow: 'rgba(163,45,45,0.8)' },
  ];
  const t = themes[lvl];
  const styleId = 'sachi-flame-css';
  if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
    const s = document.createElement('style');
    s.id = styleId;
    s.textContent = `
      @keyframes sachiFlameWave { 0%,100%{transform:scaleX(1) skewX(-2deg)} 25%{transform:scaleX(0.92) skewX(4deg)} 75%{transform:scaleX(1.06) skewX(-5deg)} }
      @keyframes sachiFlameRise { 0%,100%{transform:scaleY(1) translateY(0)} 50%{transform:scaleY(0.93) translateY(2px)} }
      @keyframes sachiFlameInner { 0%,100%{transform:scaleX(1) skewX(3deg)} 40%{transform:scaleX(0.88) skewX(-4deg)} }
      .sachi-flame-outer { animation: sachiFlameWave 1.6s ease-in-out infinite, sachiFlameRise 2s ease-in-out infinite; transform-origin: center bottom; }
      .sachi-flame-inner { animation: sachiFlameInner 1.2s ease-in-out infinite reverse; transform-origin: center bottom; }
    `;
    document.head.appendChild(s);
  }
  return (
    <div style={{ filter: `drop-shadow(0 0 6px ${t.glow})`, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <svg width={sz} height={sz} viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg" style={{overflow:'visible'}}>
        <defs>
          <linearGradient id={`sfg${lvl}`} x1="40%" y1="0%" x2="60%" y2="100%">
            <stop offset="0%" stopColor={t.inner}/>
            <stop offset="45%" stopColor={t.mid}/>
            <stop offset="100%" stopColor={t.outer}/>
          </linearGradient>
          <linearGradient id={`sfi${lvl}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95"/>
            <stop offset="60%" stopColor={t.inner}/>
            <stop offset="100%" stopColor={t.mid} stopOpacity="0.7"/>
          </linearGradient>
        </defs>
        <path className="sachi-flame-outer"
          d="M20 47 C8 47 2 39 2 30 C2 20 8 12 12 7 C14 4 13 1 13 1 C17 6 16 11 20 14 C22 9 25 4 23 1 C30 7 38 18 38 29 C38 39 31 47 20 47Z"
          fill={`url(#sfg${lvl})`}/>
        <path className="sachi-flame-inner"
          d="M20 43 C14 43 12 37 12 32 C12 27 16 21 18 17 C20 21 20 25 21 28 C23 23 25 18 24 13 C29 19 28 28 28 32 C28 38 26 43 20 43Z"
          fill={`url(#sfi${lvl})`}/>
      </svg>
    </div>
  );
}

function VideoCard({ video, currentUser, onCommentOpen, onLike, onView, onNeedAuth, onDelete, onProfileOpen, followedUserIds, onFollowChange, onShareCount, onBookmark, blockedIds }) {
  const [showLikers, setShowLikers] = React.useState(false);
  const [hyped, setHyped] = React.useState(false);
  const [hypeCount, setHypeCount] = React.useState(video.hype_count || 0);
  const [hypeAnim, setHypeAnim] = React.useState(false);
  const [myHypeId, setMyHypeId] = React.useState(null);
  const [likersList, setLikersList] = React.useState([]);
  const [likersLoading, setLikersLoading] = React.useState(false);
  const [myLikeId, setMyLikeId] = React.useState(null); // SachiLike record ID for unlike
  const swipeRef = React.useRef({ startX: 0, startY: 0, swiping: false });
  const videoRef = useRef(null);
  const soundRef = useRef(null);
  const viewedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  // Global mute stored in module-level store — readable by stale closures, no prop-drilling
  const [muted, _setMutedLocal] = useState(() => muteStore.get());
  const setMuted = (val) => {
    const newVal = typeof val === 'function' ? val(muteStore.get()) : val;
    muteStore.set(newVal);
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
  const [photoIdx, setPhotoIdx] = useState(0);
  const photoCarouselRef = useRef(null);
  const [followRecord, setFollowRecord] = useState(null);
  const isFollowing = followedUserIds ? followedUserIds.has(video.user_id || video.created_by) : !!followRecord;
  const [followLoading, setFollowLoading] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [showUI, setShowUI] = useState(false);
  const [userTapped, setUserTapped] = useState(false);
  const uiTimerRef = useRef(null);

  // Derived from video prop — must be declared before useEffect that references it
  // Detect photos — either by is_photo flag OR by video_url being an image
  const videoUrlIsImage = /\.(png|jpe?g|gif|webp|bmp|heic)(\?|$)/i.test(video.video_url || "");
  const photoUrls = (video.is_photo || videoUrlIsImage) && video.photo_urls
    ? safeParsePhotoUrls(video.photo_urls)
    : (videoUrlIsImage && video.video_url)
    ? [video.video_url]
    : null;

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
        const currentlyMuted = muteStore.get();
        el.muted = video.sound_url ? true : currentlyMuted;
        el.play().catch(() => {});
        setPlaying(true);
        if (!currentlyMuted && soundRef.current && video.sound_url) {
          soundRef.current.play().catch(() => {});
        }
        setShowUI(true);
        hideUIAfterDelay(1500);
        if (!viewedRef.current) { viewedRef.current = true; onView && onView(video.id); }
      } else {
        el.pause();
        el.currentTime = 0;
        setPlaying(false);
        if (soundRef.current) { soundRef.current.pause(); soundRef.current.currentTime = 0; }
        if (uiTimerRef.current) clearTimeout(uiTimerRef.current);
        setShowUI(false);
        setUserTapped(false);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // For photo posts — pause sound when card scrolls out of view
  const cardRef = useRef(null);
  useEffect(() => {
    if (!photoUrls) return;
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) {
        if (soundRef.current) { soundRef.current.pause(); soundRef.current.currentTime = 0; }
        setPlaying(false);
      } else {
        const currentlyMuted = muteStore.get();
        if (!currentlyMuted && soundRef.current && video.sound_url) {
          soundRef.current.play().catch(() => {});
        }
        if (!viewedRef.current) { viewedRef.current = true; onView && onView(video.id); }
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [photoUrls]);

  // Follow state is driven by the shared followedUserIds prop — no per-card API call needed

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

  const likeLockedRef = React.useRef(false);
  const doLike = async () => {
    if (!currentUser) { onNeedAuth(); return; }
    if (liked) { toast.info("Dude, you already liked this video!"); return; }
    if (likeLockedRef.current) return;
    likeLockedRef.current = true;
    setTimeout(() => { likeLockedRef.current = false; }, 800);
    const newLiked = !liked;
    setLiked(newLiked);
    onLike(video.id, newLiked ? 1 : -1);
    try {
      if (newLiked) {
        const rec = await likes.add(video.id, currentUser.id, currentUser.username || currentUser.email?.split("@")[0], currentUser.full_name || currentUser.display_name || "", currentUser.avatar_url || "");
        setMyLikeId(rec?.id || null);
      } else {
        if (myLikeId) {
          await likes.remove(myLikeId);
          setMyLikeId(null);
        } else {
          // Find and delete by user+video
          const existing = await likes.getByVideo(video.id);
          const mine = existing.find(l => l.user_id === currentUser.id);
          if (mine) await likes.remove(mine.id);
        }
      }
    } catch(e) { console.error("Like record error:", e); }
  };

  const doHype = async () => {
    if (!currentUser) { onNeedAuth(); return; }
    if (hyped) { toast.info("You already LIT this! 🔥"); return; }
    // Check daily limit — 5 hypes per day
    const todayCount = await hypes.countToday(currentUser.id);
    if (todayCount >= 5) { toast.warn("You've used all 5 LITs for today! Come back tomorrow 🔥"); return; }
    try {
      setHyped(true);
      setHypeCount(c => c + 1);
      setHypeAnim(true);
      setTimeout(() => setHypeAnim(false), 600);
      const rec = await hypes.add(video.id, currentUser.id, currentUser.username || currentUser.email?.split("@")[0]);
      setMyHypeId(rec?.id || null);
      // Update hype_count on the video
      await videos.update(video.id, { hype_count: (video.hype_count || 0) + 1 });
      toast.success("🔥 LIT! This post is getting boosted to more feeds!");
    } catch(e) {
      setHyped(false);
      setHypeCount(c => Math.max(0, c - 1));
      toast.error("Lit failed: " + e.message);
    }
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
      await videos.delete(video.id);
      onDelete && onDelete(video.id);
    } catch(err) { toast.error("Failed to delete. Try again."); }
  };

  const tap = (fn) => (e) => { e.stopPropagation(); fn(); };

  return (
    <div ref={cardRef} style={{ position:"relative", width:"100%", height:"100svh", background:"#0B0C1A", flexShrink:0, scrollSnapAlign:"start" }}>

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
        <div
          style={{ width:"100%", height:"100%", position:"relative", overflow:"hidden", background:"#000", display:"flex", flexDirection:"column", touchAction:"pan-y" }}
        >
          {/* Flame icon — top right corner */}
          <div style={{ position:"absolute", top:8, right:8, zIndex:350, pointerEvents:"none" }}>
            <FlameIcon views={video.views_count || video.view_count || 0} />
          </div>
          {/* Arrow nav — prev */}
          {photoUrls.length > 1 && photoIdx > 0 && (
            <div onClick={e => { e.stopPropagation(); setPhotoIdx(p => Math.max(p-1, 0)); }}
              style={{ position:"absolute", left:8, bottom:"38%", zIndex:350,
                width:36, height:36, borderRadius:"50%", background:"rgba(0,0,0,0.55)",
                display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
                border:"1px solid rgba(255,255,255,0.2)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </div>
          )}
          {/* Arrow nav — next */}
          {photoUrls.length > 1 && photoIdx < photoUrls.length - 1 && (
            <div onClick={e => { e.stopPropagation(); setPhotoIdx(p => Math.min(p+1, photoUrls.length-1)); }}
              style={{ position:"absolute", right:48, bottom:"38%", zIndex:350,
                width:36, height:36, borderRadius:"50%", background:"rgba(0,0,0,0.55)",
                display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
                border:"1px solid rgba(255,255,255,0.2)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          )}
          {/* Photo takes up most of the space */}
          <div style={{ flex:1, position:"relative", overflow:"hidden", pointerEvents:"none" }}>
            <img
              src={resolveMediaUrl(photoUrls[photoIdx])}
              loading="lazy"
              style={{ width:"100%", height:"100%", objectFit:"contain", display:"block", userSelect:"none", WebkitUserSelect:"none", pointerEvents:"none" }}
              onError={e => { e.target.style.display="none"; e.target.nextSibling && (e.target.nextSibling.style.display="flex"); }}
            />
            <div style={{ display:"none", position:"absolute", inset:0, alignItems:"center", justifyContent:"center", flexDirection:"column", gap:8, color:"#555" }}>
              <div style={{ fontSize:48 }}>🖼️</div>
              <div style={{ fontSize:13 }}>Image could not load</div>
            </div>
            {/* Counter badge top-left */}
            {photoUrls.length > 1 && (
              <div style={{ position:"absolute", top:12, left:12, background:"rgba(0,0,0,0.7)",
                borderRadius:20, padding:"4px 12px", fontSize:13, fontWeight:700,
                color:"#fff", zIndex:50, pointerEvents:"none", letterSpacing:0.5 }}>
                {photoIdx+1} / {photoUrls.length}
              </div>
            )}
          </div>

          {/* Dots only — swipe left/right to navigate */}
          {photoUrls.length > 1 && (
            <div style={{
              position:"absolute", bottom:70, left:"50%", transform:"translateX(-50%)",
              display:"flex", alignItems:"center", gap:8, zIndex:400,
              background:"rgba(0,0,0,0.5)", borderRadius:40, padding:"8px 16px",
              backdropFilter:"blur(4px)"
            }}>
              {photoUrls.map((_,i) => (
                <div key={i} style={{
                  width: i===photoIdx ? 28 : 8, height:8, borderRadius:99,
                  background: i===photoIdx ? "#F5C842" : "rgba(255,255,255,0.5)",
                  transition:"all 0.25s ease",
                  boxShadow: i===photoIdx ? "0 0 10px rgba(245,200,66,0.9)" : "none"
                }} />
              ))}
            </div>
          )}

          {/* ── SOUND for photo posts ── */}
          {video.sound_url && (
            <>
              <audio ref={soundRef} src={video.sound_url} loop preload="auto"
                style={{ display:"none" }}
                onCanPlay={() => { if(!muted && soundRef.current) soundRef.current.play().catch(()=>{}); }} />
              {muted ? (
                <div
                  onTouchStart={e => { e.stopPropagation(); setMuted(false); if(soundRef.current){ soundRef.current.play().catch(()=>{}); } }}
                  onClick={e => { e.stopPropagation(); setMuted(false); if(soundRef.current){ soundRef.current.play().catch(()=>{}); } }}
                  style={{ position:"absolute", bottom:80, left:"50%", transform:"translateX(-50%)", zIndex:200,
                    background:"rgba(0,0,0,0.7)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:20,
                    padding:"6px 16px", color:"#fff", fontSize:12, fontWeight:700, letterSpacing:1,
                    display:"flex", alignItems:"center", gap:6, cursor:"pointer", whiteSpace:"nowrap" }}>
                  🔇 Tap to hear music
                </div>
              ) : (
                <div
                  onTouchStart={e => { e.stopPropagation(); setMuted(true); if(soundRef.current){ soundRef.current.pause(); } }}
                  onClick={e => { e.stopPropagation(); setMuted(true); if(soundRef.current){ soundRef.current.pause(); } }}
                  style={{ position:"absolute", bottom:80, left:"50%", transform:"translateX(-50%)", zIndex:200,
                    background:"rgba(245,200,66,0.2)", border:"1px solid rgba(245,200,66,0.5)", borderRadius:20,
                    padding:"6px 16px", color:"#F5C842", fontSize:12, fontWeight:700, letterSpacing:1,
                    display:"flex", alignItems:"center", gap:6, cursor:"pointer", whiteSpace:"nowrap" }}>
                  🎵 {video.sound_title || "Playing music"}
                </div>
              )}
            </>
          )}
        </div>
      ) : (() => {
        const resolvedVideoUrl = resolveMediaUrl(video.video_url);
        const isImg = /\.(png|jpe?g|gif|webp|bmp|heic)(\?|$)/i.test(resolvedVideoUrl || "");
        if (isImg) return (
          <img src={resolvedVideoUrl}
            loading="lazy"
            style={{ width:"100%", height:"100%", objectFit:"contain", background:"#000", display:"block" }} />
        );
        const isHLS = resolvedVideoUrl?.endsWith('.m3u8') || resolvedVideoUrl?.includes('cloudflarestream.com') || resolvedVideoUrl?.includes('customer-i1ij9522l179kiqc');
        return (
          <>
            <HLSVideo src={resolvedVideoUrl} isHLS={isHLS} videoRef={videoRef}
              poster={resolveMediaUrl(video.thumbnail_url)}
              muted={muted || !!video.sound_url}
              onPlay={() => {
                setPlaying(true); hideUIAfterDelay(1500);
                if (soundRef.current && video.sound_url && !muted) {
                  soundRef.current.play().catch(() => {});
                }
              }}
              onPause={() => {
                setPlaying(false);
                if (soundRef.current) soundRef.current.pause();
              }}
            />
            {video.sound_url && (
              <audio ref={soundRef} src={video.sound_url} loop preload="none"
                style={{ display:"none" }} />
            )}

          </>
        );
      })()}

      {/* ── SPOTLIGHT — unique color per creator ── */}
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 80% 60% at 50% 20%, ${getSpotlightColor(video.user_id || video.created_by)}, transparent)`, pointerEvents:"none", zIndex:5 }} />
      {/* ── GRADIENT OVERLAY (no pointer events) ── */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(11,12,26,0.95) 0%, rgba(11,12,26,0.3) 50%, transparent 80%)", pointerEvents:"none", zIndex:10, transition:"opacity 0.4s ease", opacity: (showUI || !!photoUrls) ? 1 : 0, visibility: (showUI || !!photoUrls) ? "visible" : "hidden" }} />

      {/* Tap hint removed — content-first UI */}

      {/* ── TAP: toggle play/pause on single tap, toggle mute on double tap ── */}
      {!photoUrls && (
          <div
            onClick={tap(() => {
              const resolvedVideoUrl = resolveMediaUrl(video.video_url);
              const isImg = /\.(png|jpe?g|gif|webp|bmp|heic)(\?|$)/i.test(resolvedVideoUrl || "");
              if (isImg || !(video.video_url)) {
                setShowUI(v => !v);
                if (!showUI) setShowFullCaption(true);
              } else {
                doTogglePlay();
              }
            })}
            onDoubleClick={e => {
              e.stopPropagation();
              // Double tap toggles mute
              const newMuted = !muted;
              setMuted(newMuted);
              const el = videoRef.current;
              if (el) el.muted = newMuted;
              if (soundRef.current) {
                if (newMuted) soundRef.current.pause();
                else if (playing && video.sound_url) soundRef.current.play().catch(()=>{});
              }
            }}
            style={{ position:"absolute", top:60, left:0, right:0, bottom:80, zIndex:50, cursor:"pointer" }} />
      )}

      {/* ── PLAY/PAUSE INDICATOR — videos only ── */}
      {!playing && !photoUrls && (
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none", zIndex:20 }}>
          <div onClick={tap(doTogglePlay)} style={{ background:"rgba(11,12,26,0.7)", border:"1.5px solid rgba(245,200,66,0.4)", borderRadius:"50%", width:64, height:64,
            display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"auto", cursor:"pointer", fontSize:26 }}>▶</div>
        </div>
      )}



      {/* ── BOTTOM LEFT: user info + caption ── */}
      <div style={{ position:"absolute", bottom:148, left:16, right:16, zIndex:500, transition:"opacity 0.4s ease", opacity: (showUI || !!photoUrls) ? 1 : 0, pointerEvents: (showUI || !!photoUrls) ? "auto" : "none", visibility: (showUI || !!photoUrls) ? "visible" : "hidden" }}>
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
      {/* Real / AI badge */}
      <div style={{ display:"flex", gap:6, marginBottom:4, flexWrap:"wrap" }}>
        {!video.is_ai_detected ? (
          <span style={{ fontSize:10, background:"rgba(107,255,154,0.15)", color:"#6BFFB8", padding:"2px 9px", borderRadius:20, fontWeight:700, border:"1px solid rgba(107,255,154,0.3)" }}>
            ✓ Real
          </span>
        ) : (
          <span style={{ fontSize:10, background:"rgba(255,149,0,0.15)", color:"#FF9500", padding:"2px 9px", borderRadius:20, fontWeight:700, border:"1px solid rgba(255,149,0,0.3)" }}>
            🤖 AI Generated
          </span>
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
        {video.created_date && (
          <div style={{ display:"inline-flex", alignItems:"center", gap:5, marginTop:8,
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

      {/* ── REACTION RINGS — right side action bar ── */}
      {(() => {
        const CIRC = 100;
        const isBookmarked = onBookmark?.isBookmarked?.(video.id);
        const fId = `f${video.id}`;
        const litRingOffset = Math.max(CIRC - (hypeCount / 20) * CIRC, hyped ? 10 : CIRC);
        const likeRingOffset = liked ? Math.max(CIRC - ((video.likes_count||0) / 50) * CIRC, 10) : CIRC;
        const commentRingOffset = Math.max(CIRC - ((video.comments_count||0) / 20) * CIRC, 10);
        const crownRingOffset = isBookmarked ? 18 : CIRC;
        const shareRingOffset = Math.max(CIRC - ((video.shares_count||0) / 15) * CIRC, 10);

        const RingBtn = ({ onClick, color, ringOffset, label, children }) => {
          const [bursting, setBursting] = React.useState(false);
          const handleClick = (e) => { setBursting(true); setTimeout(() => setBursting(false), 600); onClick(e); };
          return (
            <button onClick={handleClick}
              style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column",
                alignItems:"center", gap:2, WebkitTapHighlightColor:"transparent", touchAction:"manipulation", position:"relative" }}>
              <div style={{ position:"relative", width:44, height:44 }}>
                <svg style={{ position:"absolute", inset:0, transform:"rotate(-90deg)" }} viewBox="0 0 44 44" width="44" height="44">
                  <circle cx="22" cy="22" r="16" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2.5"/>
                  <circle cx="22" cy="22" r="16" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
                    strokeDasharray={CIRC} strokeDashoffset={ringOffset}
                    style={{ transition:"stroke-dashoffset 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}/>
                </svg>
                {bursting && (
                  <div style={{ position:"absolute", inset:-4, borderRadius:"50%", border:`2px solid ${color}`,
                    animation:"ringBurst 0.5s ease forwards", pointerEvents:"none" }} />
                )}
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
                  animation: bursting ? "ringIconPop 0.4s ease forwards" : "none" }}>
                  {children}
                </div>
              </div>
              <div style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.55)", lineHeight:1 }}>{label}</div>
            </button>
          );
        };

        return (
          <div style={{ position:"absolute", right:10, bottom:120, display:"flex", flexDirection:"column", alignItems:"center", gap:6,
            zIndex:500, transition:"opacity 0.4s ease", opacity:(showUI||!!photoUrls)?1:0,
            pointerEvents:(showUI||!!photoUrls)?"auto":"none", visibility:(showUI||!!photoUrls)?"visible":"hidden" }}>

            {/* Mute pill */}
            <button onClick={tap(doMute)}
              style={{ background:muted?"rgba(245,200,66,0.15)":"rgba(255,255,255,0.08)",
                border:muted?"1px solid rgba(245,200,66,0.4)":"1px solid rgba(255,255,255,0.1)",
                borderRadius:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                WebkitTapHighlightColor:"transparent", marginBottom:2, width:36, height:24 }}>
              {muted
                ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#F5C842" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
              }
            </button>

            {/* LIT flame ring */}
            <RingBtn color="#FF6B00" ringOffset={litRingOffset}
              label={hypeCount > 0 ? String(hypeCount) : "LIT"}
              onClick={tap(doHype)}>
              <div style={{ filter: hyped ? "drop-shadow(0 0 6px rgba(255,107,0,0.9))" : "none",
                animation: hypeAnim ? "firepop 0.5s ease forwards" : "none" }}>
                <svg width="18" height="22" viewBox="0 0 20 28" xmlns="http://www.w3.org/2000/svg" style={{ overflow:"visible" }}>
                  <defs>
                    <linearGradient id={fId} x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#fff176"/>
                      <stop offset="35%" stopColor="#ffb300"/>
                      <stop offset="70%" stopColor="#f4511e"/>
                      <stop offset="100%" stopColor="#b71c1c"/>
                    </linearGradient>
                    <linearGradient id={fId+"i"} x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff"/>
                      <stop offset="50%" stopColor="#fff9c4"/>
                      <stop offset="100%" stopColor="#ffcc02" stopOpacity="0.6"/>
                    </linearGradient>
                  </defs>
                  <path d="M10 27 C4 27 1 22 1 17 C1 12 4 8 6 5 C7 3 7 1 7 1 C9 4 8 7 10 9 C11 6 13 3 14 1 C15 4 19 9 19 16 C19 22 15 27 10 27Z"
                    fill={`url(#${fId})`} style={{ animation:"flameWave 1.8s ease-in-out infinite", transformOrigin:"10px 27px" }}/>
                  <path d="M10 24 C7 24 6 21 6 18 C6 16 8 13 9 11 C10 13 10 15 11 16 C12 14 13 11 14 10 C15 13 14 17 14 18 C14 22 13 24 10 24Z"
                    fill={`url(#${fId+"i"})`} style={{ animation:"flameWave 1.2s ease-in-out infinite reverse", transformOrigin:"10px 24px" }}/>
                </svg>
              </div>
            </RingBtn>

            {/* Heart ring */}
            <RingBtn color="#FF6B6B" ringOffset={likeRingOffset}
              label={formatCount(video.likes_count||0)}
              onClick={tap(doLike)}>
              <svg width="16" height="16" viewBox="0 0 24 24"
                fill={liked ? "#FF6B6B" : "none"} stroke="#FF6B6B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                style={{ transition:"fill 0.2s" }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </RingBtn>

            {/* Likers Modal */}
            {showLikers && (
              <div onClick={() => setShowLikers(false)}
                style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"flex-end" }}>
                <div onClick={e => e.stopPropagation()}
                  style={{ width:"100%", maxHeight:"60vh", background:"#1a1a2e", borderRadius:"20px 20px 0 0", padding:"20px 0 40px", overflowY:"auto" }}>
                  <div style={{ textAlign:"center", padding:"0 20px 16px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ width:40, height:4, borderRadius:2, background:"rgba(255,255,255,0.15)", margin:"0 auto 16px" }} />
                    <div style={{ color:"#fff", fontWeight:800, fontSize:16 }}>❤️ {formatCount(video.likes_count||0)} Likes</div>
                  </div>
                  {likersLoading ? (
                    <div style={{ textAlign:"center", padding:32, color:"#555" }}>Loading…</div>
                  ) : likersList.length === 0 ? (
                    <div style={{ textAlign:"center", padding:32, color:"#555" }}>No like records found</div>
                  ) : likersList.map((l,i) => (
                    <div key={l.id||i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 20px" }}>
                      <img src={l.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(l.display_name||l.username||"?")}&background=random&color=fff&size=64&bold=true&format=png`}
                        style={{ width:36, height:36, borderRadius:"50%", objectFit:"cover", flexShrink:0 }} />
                      <div>
                        <div style={{ color:"#fff", fontWeight:600, fontSize:14 }}>{l.display_name || l.username || "Sachi User"}</div>
                        <div style={{ color:"#555", fontSize:12 }}>@{l.username || "user"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comment ring */}
            <RingBtn color="#6c63ff" ringOffset={commentRingOffset}
              label={formatCount(video.comments_count)}
              onClick={tap(() => onCommentOpen(video))}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </RingBtn>

            {/* Crown ring — replaces bookmark */}
            <RingBtn color="#F5C842" ringOffset={crownRingOffset}
              label={isBookmarked ? "Crowned" : "Crown"}
              onClick={tap(async () => { if(!currentUser){onNeedAuth&&onNeedAuth();return;} onBookmark?.handle&&onBookmark.handle(video.id,!isBookmarked); })}>
              <svg width="16" height="16" viewBox="0 0 24 24"
                fill={isBookmarked ? "rgba(245,200,66,0.25)" : "none"}
                stroke={isBookmarked ? "#F5C842" : "rgba(255,255,255,0.55)"}
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                style={{ transition:"all 0.3s",
                  animation: isBookmarked ? "crownFloat 2s ease-in-out infinite" : "none",
                  filter: isBookmarked ? "drop-shadow(0 0 6px rgba(245,200,66,0.7))" : "none" }}>
                <path d="M2 20h20M5 20V10l7-6 7 6v10"/><path d="M9 20v-5h6v5"/>
              </svg>
            </RingBtn>

            {/* Broadcast ring — share */}
            {(() => {
              const [pulsing, setPulsing] = React.useState(false);
              const handleShare = tap(async () => {
                setPulsing(true); setTimeout(() => setPulsing(false), 900);
                const shareUrl = `${window.location.origin}?v=${video.id}`;
                if(navigator.share){ navigator.share({ title: video.caption||"Check this out on Sachi", url: shareUrl }); }
                else { navigator.clipboard?.writeText(shareUrl); toast.success("Link copied!"); }
                try {
                  const newCount = (video.shares_count||0)+1;
                  onShareCount&&onShareCount(video.id,newCount);
                  await videos.update(video.id,{shares_count:newCount});
                } catch(e){}
              });
              return (
                <RingBtn color="#a78bfa" ringOffset={shareRingOffset}
                  label={formatCount(video.shares_count||0)||"Share"}
                  onClick={handleShare}>
                  <div style={{ position:"relative" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                    {pulsing && <div style={{ position:"absolute", inset:-10, borderRadius:"50%", border:"1.5px solid #a78bfa",
                      animation:"broadcastPulse 0.8s ease forwards", pointerEvents:"none" }} />}
                  </div>
                </RingBtn>
              );
            })()}

            {/* Delete — own videos only */}
            {isOwnVideo && (
              <button onClick={tap(doDelete)}
                style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2,
                  WebkitTapHighlightColor:"transparent", touchAction:"manipulation", marginTop:2 }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(255,60,60,0.12)",
                  border:"1px solid rgba(255,60,60,0.3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ff5555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6"/><path d="M14 11v6"/>
                  </svg>
                </div>
              </button>
            )}

          </div>
        );
      })()}

      {reportTarget && <ReportModal video={reportTarget} currentUser={currentUser} onClose={() => setReportTarget(null)} />}

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

function ReportModal({ video, currentUser, onClose }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const submit = async () => {
    if (!selected) return;
    setSubmitted(true);
    try {
      await reports.create({
        video_id: video.id,
        reporter_id: currentUser?.id || "guest",
        reporter_username: currentUser?.username || currentUser?.email || "guest",
        video_caption: video.caption || "",
        video_username: video.username || video.display_name || "",
        reason: selected,
        status: "pending",
      });
    } catch(e) { console.error("Report failed:", e); }
    setTimeout(() => onClose(), 1800);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:3000, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.8)" }} />
      <div style={{ position:"relative", background:"#1a1a2e", borderRadius:"24px 24px 0 0", width:"100%", maxWidth:480, padding:"20px 20px 40px", zIndex:3001 }}>
        <div style={{ width:40, height:4, background:"#444", borderRadius:99, margin:"0 auto 16px" }} />

        {submitted ? (
          <div style={{ textAlign:"center", padding:"24px 0" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:18, marginBottom:6 }}>Report Submitted</div>
            <div style={{ color:"#888", fontSize:14 }}>Thanks for keeping Sachi safe. We'll review this video.</div>
          </div>
        ) : (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <div style={{ color:"#fff", fontWeight:700, fontSize:16 }}>🚩 Report Video</div>
              <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:"50%", width:30, height:30, color:"#fff", cursor:"pointer" }}>✕</button>
            </div>
            <div style={{ color:"#888", fontSize:13, marginBottom:16 }}>Why are you reporting this video?</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
              {REPORT_REASONS.map(r => (
                <div key={r.id} onClick={() => setSelected(r.id)}
                  style={{ display:"flex", gap:12, alignItems:"center", padding:"12px 14px", borderRadius:12, cursor:"pointer", background: selected===r.id ? "rgba(255,107,107,0.15)" : "rgba(255,255,255,0.04)", border:`1px solid ${selected===r.id ? "rgba(255,107,107,0.5)" : "rgba(255,255,255,0.08)"}`, transition:"all 0.15s" }}>
                  <div style={{ fontSize:22, flexShrink:0 }}>{r.icon}</div>
                  <div>
                    <div style={{ color: selected===r.id ? "#ff6b6b" : "#fff", fontWeight:600, fontSize:14 }}>{r.label}</div>
                    <div style={{ color:"#666", fontSize:12, marginTop:2 }}>{r.desc}</div>
                  </div>
                  <div style={{ marginLeft:"auto", width:18, height:18, borderRadius:"50%", border:`2px solid ${selected===r.id ? "#ff6b6b" : "#444"}`, background: selected===r.id ? "#ff6b6b" : "transparent", flexShrink:0 }} />
                </div>
              ))}
            </div>
            <button onClick={submit} disabled={!selected}
              style={{ width:"100%", padding:14, background: selected ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "rgba(255,255,255,0.08)", border:"none", borderRadius:14, color:"#fff", fontWeight:700, fontSize:15, cursor: selected ? "pointer" : "not-allowed", opacity: selected ? 1 : 0.5 }}>
              Submit Report
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const spinStyle = document.createElement('style');
spinStyle.textContent = `
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
  @keyframes heartbeat {
    0%   { transform: scale(1); }
    14%  { transform: scale(1.35); }
    28%  { transform: scale(1); }
    42%  { transform: scale(1.25); }
    56%  { transform: scale(1); }
    100% { transform: scale(1); }
  }
  @keyframes flameWave {
  0%, 100% { transform: scaleX(1) scaleY(1) rotate(-1deg); }
  25% { transform: scaleX(0.92) scaleY(1.06) rotate(1.5deg); }
  50% { transform: scaleX(1.06) scaleY(0.96) rotate(-0.5deg); }
  75% { transform: scaleX(0.95) scaleY(1.04) rotate(2deg); }
}
@keyframes firepop {
  0%   { transform: scale(1) rotate(0deg); filter: brightness(1); }
  20%  { transform: scale(1.7) rotate(-12deg); filter: brightness(1.4); }
  40%  { transform: scale(1.4) rotate(10deg); filter: brightness(1.2); }
  60%  { transform: scale(1.6) rotate(-8deg); filter: brightness(1.5); }
  80%  { transform: scale(1.2) rotate(5deg); filter: brightness(1.1); }
  100% { transform: scale(1) rotate(0deg); filter: brightness(1); }
}
@keyframes fireflicker {
  0%   { transform: scale(1)    rotate(-2deg) translateY(0px);  filter: brightness(1.1)  drop-shadow(0 0 4px #ff6600)  drop-shadow(0 0 8px #ff2200); }
  15%  { transform: scale(1.1)  rotate(2deg)  translateY(-2px); filter: brightness(1.4)  drop-shadow(0 0 8px #ff8800)  drop-shadow(0 0 16px #ff4400); }
  30%  { transform: scale(0.95) rotate(-3deg) translateY(1px);  filter: brightness(0.95) drop-shadow(0 0 6px #ff4400)  drop-shadow(0 0 10px #ff1100); }
  45%  { transform: scale(1.12) rotate(2deg)  translateY(-3px); filter: brightness(1.5)  drop-shadow(0 0 10px #ffaa00) drop-shadow(0 0 20px #ff5500); }
  60%  { transform: scale(1.04) rotate(-2deg) translateY(0px);  filter: brightness(1.2)  drop-shadow(0 0 7px #ff6600)  drop-shadow(0 0 14px #ff3300); }
  75%  { transform: scale(0.97) rotate(3deg)  translateY(1px);  filter: brightness(1.0)  drop-shadow(0 0 5px #ff4400)  drop-shadow(0 0 10px #ff2200); }
  90%  { transform: scale(1.06) rotate(2deg) translateY(-1px); filter: brightness(1.15); }
  100% { transform: scale(1) rotate(0deg) translateY(0px); filter: brightness(1); }
}
@keyframes firerise {
  0%   { transform: scaleY(1) translateY(0px); }
  25%  { transform: scaleY(1.1) translateY(-2px); }
  50%  { transform: scaleY(0.95) translateY(1px); }
  75%  { transform: scaleY(1.08) translateY(-1px); }
  100% { transform: scaleY(1) translateY(0px); }
}
@keyframes heartpop {
    0%   { transform: scale(1); }
    30%  { transform: scale(1.5); }
    60%  { transform: scale(0.9); }
    80%  { transform: scale(1.15); }
    100% { transform: scale(1); }
  }
  @keyframes ringBurst { 0%{transform:scale(1);opacity:1} 100%{transform:scale(2.4);opacity:0} }
  @keyframes ringParticle { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0} }
  @keyframes crownFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
  @keyframes broadcastPulse { 0%{transform:scale(1);opacity:0.8} 100%{transform:scale(2.2);opacity:0} }
  @keyframes ringIconPop { 0%{transform:scale(1)} 35%{transform:scale(1.5)} 65%{transform:scale(0.88)} 100%{transform:scale(1)} }
`;
if (!document.getElementById('spin-style')) { spinStyle.id='spin-style'; document.head.appendChild(spinStyle); }

// ── Avatar Picker Modal ───────────────────────────────────────────────────────
const AVATAR_COLORS = [
  ["e94560","fff"],["f5a623","000"],["22c55e","fff"],["6c63ff","fff"],["0ea5e9","fff"],
  ["ec4899","fff"],["f97316","fff"],["14b8a6","fff"],["8b5cf6","fff"],["ef4444","fff"],
  ["10b981","fff"],["3b82f6","fff"],["a855f7","fff"],["f59e0b","000"],["06b6d4","fff"],
  ["84cc16","000"],["fb7185","fff"],["34d399","000"],["60a5fa","fff"],["c084fc","fff"],
];
const AVATAR_NAMES = ["Nova","Zara","Kai","Milo","Aria","Finn","Luna","Rex","Sage","Cleo","Axel","Nadia","Blake","Iris","Cruz","Ember","Jax","Lyra","Orion","Veda"];

// ── Avatar Picker Modal ──────────────────────────────────────────────────────
const AVATAR_STYLES = [
  { label: "Cartoon", style: "avataaars", seeds: ["Felix","Aneka","Mia","Zara","Leo","Nova","Kira","Blaze","Pixel","Storm","Echo","Sage","Raya","Kofi","Priya","Omar","Mei","Ava","Jake","Luna","Diego","Aisha","Nate","Yuki"] },
  { label: "Portraits", style: "lorelei", seeds: ["Alex","Sam","Jordan","Taylor","Morgan","Casey","Jamie","Riley","Quinn","Avery","Blake","Cameron","Dana","Ellis","Fynn","Gwen","Harley","Indie","Jules","Kai"] },
  { label: "Fun", style: "bottts", seeds: ["R2D2","BB8","Wall-E","Robo","Zap","Bolt","Chip","Digi","Glitch","Mega","Nano","Pixel","Spark","Vibe","Wave","Flux","Glow","Nova","Atom","Echo"] },
  { label: "Minimal", style: "thumbs", seeds: ["Alpha","Beta","Gamma","Delta","Epsilon","Zeta","Eta","Theta","Iota","Kappa","Lambda","Mu","Nu","Xi","Omicron","Pi","Rho","Sigma","Tau","Upsilon"] },
];

// ── Avatar Crop Editor ──────────────────────────────────────────────────────
function AvatarCropEditor({ imageUrl, onSave, onCancel }) {
  const canvasRef = useRef();
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);
  const imgRef = useRef(new window.Image());
  const SIZE = 300;

  useEffect(() => {
    const img = imgRef.current;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const fit = Math.max(SIZE / img.width, SIZE / img.height);
      setScale(fit);
      setOffset({ x: (SIZE - img.width * fit) / 2, y: (SIZE - img.height * fit) / 2 });
      draw(fit, { x: (SIZE - img.width * fit) / 2, y: (SIZE - img.height * fit) / 2 });
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const draw = (s = scale, o = offset) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, SIZE, SIZE);
    // White background so JPEG export works correctly
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, SIZE, SIZE);
    // Clip to circle before drawing image
    ctx.save();
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(imgRef.current, o.x, o.y, imgRef.current.width * s, imgRef.current.height * s);
    ctx.restore();
  };

  useEffect(() => { draw(); }, [scale, offset]);

  const onMouseDown = (e) => {
    setDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };
  const onMouseMove = (e) => {
    if (!dragging) return;
    const newOffset = { x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y };
    setOffset(newOffset);
  };
  const onMouseUp = () => setDragging(false);

  const onTouchStart = (e) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = { x: e.touches[0].clientX - offset.x, y: e.touches[0].clientY - offset.y };
  };
  const onTouchMove = (e) => {
    e.preventDefault();
    if (!dragging) return;
    setOffset({ x: e.touches[0].clientX - dragStart.current.x, y: e.touches[0].clientY - dragStart.current.y });
  };
  const onTouchEnd = () => setDragging(false);

  const handleSave = () => {
    const canvas = canvasRef.current;
    // Return base64 data URL directly — works for all auth types (Google, email)
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    onSave(dataUrl);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:3000, background:"rgba(0,0,0,0.95)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ color:"#fff", fontWeight:900, fontSize:18, marginBottom:8 }}>✂️ Crop your avatar</div>
      <div style={{ color:"#888", fontSize:13, marginBottom:20 }}>Drag to reposition • Zoom with slider</div>

      {/* Canvas crop area */}
      <div style={{ borderRadius:"50%", overflow:"hidden", border:"3px solid #F5C842", boxShadow:"0 0 30px rgba(245,200,66,0.3)", marginBottom:20, cursor: dragging ? "grabbing" : "grab" }}>
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{ display:"block", touchAction:"none" }}
        />
      </div>

      {/* Zoom slider */}
      <div style={{ width:"100%", maxWidth:280, marginBottom:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <div style={{ color:"#aaa", fontSize:12 }}>🔍 Zoom</div>
          <button onClick={() => {
            const img = imgRef.current;
            const fit = Math.min(SIZE / img.width, SIZE / img.height);
            setScale(fit);
            setOffset({ x: (SIZE - img.width * fit) / 2, y: (SIZE - img.height * fit) / 2 });
          }} style={{ background:"rgba(245,200,66,0.15)", border:"1px solid rgba(245,200,66,0.4)", borderRadius:8, padding:"3px 10px", color:"#F5C842", fontSize:11, fontWeight:700, cursor:"pointer" }}>
            Fit whole image
          </button>
        </div>
        <input
          type="range"
          min={0.05}
          max={4}
          step={0.01}
          value={scale}
          onChange={e => setScale(parseFloat(e.target.value))}
          style={{ width:"100%", accentColor:"#F5C842" }}
        />
      </div>

      <div style={{ display:"flex", gap:12, width:"100%", maxWidth:280 }}>
        <button onClick={onCancel} style={{ flex:1, padding:"13px 0", background:"rgba(255,255,255,0.08)", border:"none", borderRadius:14, color:"#aaa", fontWeight:700, fontSize:15, cursor:"pointer" }}>
          Cancel
        </button>
        <button onClick={handleSave} style={{ flex:2, padding:"13px 0", background:"linear-gradient(135deg,#F5C842,#FF9500)", border:"none", borderRadius:14, color:"#0B0C1A", fontWeight:900, fontSize:15, cursor:"pointer" }}>
          ✓ Use this photo
        </button>
      </div>
    </div>
  );
}

function AvatarPickerModal({ currentAvatar, onSelect, onClose }) {
  const [uploading, setUploading] = useState(false);
  const [activeStyle, setActiveStyle] = useState(0);
  const [cropImageUrl, setCropImageUrl] = useState(null);
  const fileRef = useRef();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Show crop editor first
    const url = URL.createObjectURL(file);
    setCropImageUrl(url);
  };

  const handleCropSave = async (dataUrl) => {
    setCropImageUrl(null);
    setUploading(true);
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      const url = await uploadFile(file);
      if (!url) throw new Error("No URL returned from upload");
      onSelect(url);
    } catch(e) {
      console.error("Avatar upload failed:", e);
      toast.error("Avatar upload failed. Check your connection and try again.");
    }
    finally { setUploading(false); }
  };

  return (
    <>
      {cropImageUrl && (
        <AvatarCropEditor
          imageUrl={cropImageUrl}
          onSave={handleCropSave}
          onCancel={() => setCropImageUrl(null)}
        />
      )}

      <div style={{ position:"fixed", inset:0, zIndex:2000, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
        <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.75)" }} />
        <div style={{ position:"relative", background:"#1a1a2e", borderRadius:"24px 24px 0 0", width:"100%", maxWidth:480, padding:"20px 20px 36px", zIndex:2001 }}>
          <div style={{ width:40, height:4, background:"#444", borderRadius:99, margin:"0 auto 16px" }} />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div style={{ color:"#fff", fontWeight:700, fontSize:16 }}>🎨 Choose your avatar</div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:"50%", width:30, height:30, color:"#fff", cursor:"pointer" }}>✕</button>
          </div>

          {/* Upload own photo */}
          <div style={{ marginBottom:14 }}>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFileUpload} />
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              style={{ width:"100%", padding:"13px", background:"linear-gradient(135deg,rgba(245,200,66,0.15),rgba(255,149,0,0.1))", border:"2px dashed rgba(245,200,66,0.5)", borderRadius:14, color:"#F5C842", fontWeight:800, fontSize:15, cursor:"pointer" }}>
              {uploading ? "⏳ Uploading..." : "📷 Upload & crop your photo"}
            </button>
          </div>

          {/* Style tabs */}
          <div style={{ display:"flex", gap:6, marginBottom:12, overflowX:"auto", scrollbarWidth:"none" }}>
            {AVATAR_STYLES.map((s, i) => (
              <button key={i} onClick={() => setActiveStyle(i)}
                style={{ flexShrink:0, padding:"6px 14px", borderRadius:20, border:"none", cursor:"pointer", fontSize:12, fontWeight:700,
                  background: activeStyle === i ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "rgba(255,255,255,0.07)",
                  color: activeStyle === i ? "#fff" : "#aaa" }}>
                {s.label}
              </button>
            ))}
          </div>

          {/* Avatar grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:14, maxHeight:260, overflowY:"auto", paddingBottom:4 }}>
            {AVATAR_STYLES[activeStyle].seeds.map((seed, i) => {
              const style = AVATAR_STYLES[activeStyle].style;
              const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0B0C1A,1a1a2e,2d2d44`;
              return (
                <button key={i}
                  onClick={() => onSelect(url)}
                  style={{ background: currentAvatar===url ? "rgba(245,200,66,0.2)" : "rgba(255,255,255,0.06)",
                    border: currentAvatar===url ? "3px solid #F5C842" : "3px solid rgba(255,255,255,0.08)",
                    borderRadius:16, width:64, height:64, margin:"0 auto", padding:4,
                    cursor:"pointer", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center",
                    transition:"border 0.2s, transform 0.15s, box-shadow 0.2s",
                    boxShadow: currentAvatar===url ? "0 0 12px rgba(245,200,66,0.4)" : "none",
                    transform: currentAvatar===url ? "scale(1.12)" : "scale(1)" }}>
                  <img src={url} style={{ width:"100%", height:"100%", pointerEvents:"none", display:"block", borderRadius:10, background:"rgba(255,255,255,0.05)" }} loading="lazy" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}



// ─── User Profile Sheet ──────────────────────────────────────────────────────
// ─── Profile Video Player (full-screen TikTok-style) ────────────────────────
function ProfileVideoPlayer({ videos: vids, startIndex, onClose, profile, username }) {
  const [idx, setIdx] = React.useState(startIndex || 0);
  const [muted, setMuted] = React.useState(false);
  const videoRef = React.useRef(null);
  const touchStartY = React.useRef(null);

  const v = vids[idx];

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [idx]);

  const goNext = () => { if (idx < vids.length - 1) setIdx(i => i + 1); };
  const goPrev = () => { if (idx > 0) setIdx(i => i - 1); };

  const onTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
  const onTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) { diff > 0 ? goNext() : goPrev(); }
    touchStartY.current = null;
  };

  if (!v) return null;

  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      style={{ position:"fixed", inset:0, zIndex:5000, background:"#000", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>

      {/* Video */}
      <video ref={videoRef} key={v.id} src={resolveMediaUrl(v.video_url)} autoPlay playsInline loop muted={muted}
        onClick={() => { if(videoRef.current.paused) videoRef.current.play(); else videoRef.current.pause(); }}
        style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />

      {/* Gradient overlay */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)", pointerEvents:"none" }} />

      {/* Top bar */}
      <div style={{ position:"absolute", top:0, left:0, right:0, display:"flex", alignItems:"center", padding:"50px 16px 16px", zIndex:10 }}>
        <button onClick={onClose}
          style={{ background:"rgba(0,0,0,0.4)", border:"none", borderRadius:"50%", width:40, height:40,
            color:"#fff", fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>←</button>
        <div style={{ flex:1, textAlign:"center", color:"#fff", fontWeight:800, fontSize:15 }}>
          {profile?.display_name || username}
        </div>
        <button onClick={() => setMuted(m => !m)}
          style={{ background:"rgba(0,0,0,0.4)", border:"none", borderRadius:"50%", width:40, height:40,
            color:"#fff", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          {muted ? "🔇" : "🔊"}
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
      {idx > 0 && (
        <button onClick={goPrev}
          style={{ position:"absolute", top:"50%", left:12, transform:"translateY(-50%)", background:"rgba(0,0,0,0.5)",
            border:"none", borderRadius:"50%", width:40, height:40, color:"#fff", fontSize:18, cursor:"pointer", zIndex:10 }}>↑</button>
      )}
      {idx < vids.length - 1 && (
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
function UserProfileSheet({ userId, username, currentUser, onClose }) {
  const [profile, setProfile] = React.useState(null);
  const [userVideos, setUserVideos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [followRecord, setFollowRecord] = React.useState(null);
  const [followLoading, setFollowLoading] = React.useState(false);
  const [playerIndex, setPlayerIndex] = React.useState(null);
  const [showFollowersList, setShowFollowersList] = React.useState(false);
  const [showFollowingList, setShowFollowingList] = React.useState(false);
  const [followersList, setFollowersList] = React.useState([]);
  const [followingList, setFollowingList] = React.useState([]);
  const [listLoading, setListLoading] = React.useState(false);

  const isOwnProfile = currentUser && currentUser.id === userId;

  const openFollowers = async () => {
    setShowFollowersList(true);
    setListLoading(true);
    try {
      const res = await request("GET", `/apps/${APP_ID}/entities/Follow?following_id=${userId}&limit=500`);
      const items = res?.items || res || [];
      const userIds = items.map(r => r.follower_id).filter(Boolean);
      const usersRes = await request("GET", `/apps/${APP_ID}/entities/AthaVidUser?limit=500`);
      const allUsers = usersRes?.items || usersRes || [];
      setFollowersList(allUsers.filter(u => userIds.includes(u.id)));
    } catch(e) { setFollowersList([]); }
    setListLoading(false);
  };

  const openFollowing = async () => {
    setShowFollowingList(true);
    setListLoading(true);
    try {
      const res = await request("GET", `/apps/${APP_ID}/entities/Follow?follower_id=${userId}&limit=500`);
      const items = res?.items || res || [];
      const userIds = items.map(r => r.following_id).filter(Boolean);
      const usersRes = await request("GET", `/apps/${APP_ID}/entities/AthaVidUser?limit=500`);
      const allUsers = usersRes?.items || usersRes || [];
      setFollowingList(allUsers.filter(u => userIds.includes(u.id)));
    } catch(e) { setFollowingList([]); }
    setListLoading(false);
  };

  React.useEffect(() => {
    setLoading(true);
    Promise.all([
      request("GET", `/apps/${APP_ID}/entities/AthaVidUser?limit=200`).catch(() => null),
      videos.byUser(userId).catch(() => []),
      // Live follower count: how many people follow this profile
      request("GET", `/apps/${APP_ID}/entities/Follow?following_id=${userId}&limit=500`).catch(() => null),
      // Live following count: how many people this profile follows
      request("GET", `/apps/${APP_ID}/entities/Follow?follower_id=${userId}&limit=500`).catch(() => null),
    ]).then(([userRes, vids, followersRes, followingRes]) => {
      const allUsers = userRes?.items || userRes || [];
      const u = allUsers.find(x => x.id === userId || x.created_by === userId) || null;
      const liveFollowers = (followersRes?.items || followersRes || []).length;
      const liveFollowing = (followingRes?.items || followingRes || []).length;
      setProfile(u ? { ...u, followers_count: liveFollowers, following_count: liveFollowing } : { followers_count: liveFollowers, following_count: liveFollowing });
      const vidList = Array.isArray(vids) ? vids : (vids?.items || []);
      setUserVideos(vidList);
      setLoading(false);
    });
    if (currentUser && !isOwnProfile) {
      follows.getFollowing(currentUser.id).then(res => {
        const rec = (res.items || res || []).find(r => r.following_id === userId);
        if (rec) setFollowRecord(rec);
      }).catch(() => {});
    }
  }, [userId]);

  const doFollow = async () => {
    if (!currentUser || isOwnProfile) return;
    setFollowLoading(true);
    try {
      if (followRecord) {
        await follows.unfollow(followRecord.id);
        setFollowRecord(null);
        setProfile(p => p ? { ...p, followers_count: Math.max(0, (p.followers_count || 1) - 1) } : p);
      } else {
        const rec = await follows.follow(
          currentUser.id,
          currentUser.username || currentUser.email?.split("@")[0],
          userId,
          username
        );
        setFollowRecord(rec);
        setProfile(p => p ? { ...p, followers_count: (p.followers_count || 0) + 1 } : p);
      }
      // Refresh live following count for the current user's Me tab too
      try {
        const myFollowingRes = await request("GET", `/apps/${APP_ID}/entities/Follow?follower_id=${currentUser.id}&limit=500`);
        const myFollowingCount = (myFollowingRes?.items || myFollowingRes || []).length;
        setProfile(p => p ? { ...p } : p); // trigger re-render if needed
        // store for Me tab
        localStorage.setItem(`sachi_following_count_${currentUser.id}`, myFollowingCount);
      } catch(e) {}
    } catch(e) { console.error(e); }
    setFollowLoading(false);
  };

  const displayName = profile?.display_name || username || "User";
  const avatarUrl = profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`;

  return (
    <>
      <div style={{ position:"fixed", inset:0, zIndex:4000, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
        {/* Backdrop */}
        <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.75)" }} />

        {/* Sheet */}
        <div style={{ position:"relative", background:"#0f0f1a", borderRadius:"24px 24px 0 0",
          width:"100%", maxWidth:480, maxHeight:"88vh", display:"flex", flexDirection:"column",
          zIndex:4001, overflow:"hidden" }}>

          {/* Handle */}
          <div style={{ width:40, height:4, background:"#333", borderRadius:99, margin:"14px auto 0", flexShrink:0 }} />

          {/* Close */}
          <button onClick={onClose} style={{ position:"absolute", top:12, right:16, background:"none", border:"none",
            color:"#888", fontSize:22, cursor:"pointer", zIndex:1 }}>✕</button>

          {loading ? (
            <div style={{ textAlign:"center", padding:60, color:"#555" }}>
              <div style={{ fontSize:36, marginBottom:8 }}>⏳</div>
              <div>Loading profile...</div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ padding:"16px 20px 20px", textAlign:"center", borderBottom:"1px solid rgba(255,255,255,0.06)", flexShrink:0 }}>
                <img src={avatarUrl}
                  style={{ width:80, height:80, borderRadius:"50%", border:"3px solid #ff6b6b", marginBottom:10, background:"#1a1a2e" }} />
                <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>{displayName}</div>
                <div style={{ color:"#666", fontSize:13, marginBottom:4 }}>@{username}</div>
                {profile?.bio && <div style={{ color:"#aaa", fontSize:13, marginBottom:8, lineHeight:1.5 }}>{profile.bio}</div>}
                {profile?.location && <div style={{ color:"#666", fontSize:12, marginBottom:8 }}>📍 {profile.location}</div>}

                {/* Stats */}
                <div style={{ display:"flex", justifyContent:"center", gap:28, marginTop:12, marginBottom:14 }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>{userVideos.length}</div>
                    <div style={{ color:"#666", fontSize:11 }}>Videos</div>
                  </div>
                  <div style={{ textAlign:"center", cursor:"pointer", WebkitTapHighlightColor:"transparent" }} onClick={openFollowers}>
                    <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>{profile?.followers_count || 0}</div>
                    <div style={{ color:"#F5C842", fontSize:11, fontWeight:600 }}>Followers</div>
                  </div>
                  <div style={{ textAlign:"center", cursor:"pointer", WebkitTapHighlightColor:"transparent" }} onClick={openFollowing}>
                    <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>{profile?.following_count || 0}</div>
                    <div style={{ color:"#F5C842", fontSize:11, fontWeight:600 }}>Following</div>
                  </div>
                </div>

                {!isOwnProfile && currentUser && (
                  <button onClick={doFollow} disabled={followLoading}
                    style={{ padding:"10px 40px", borderRadius:24,
                      background: followRecord ? "#22c55e" : "#ff0000",
                      border: "none",
                      color:"#fff", fontWeight:800, fontSize:15, cursor:"pointer",
                      opacity: followLoading ? 0.6 : 1,
                      boxShadow: followRecord ? "0 2px 12px rgba(34,197,94,0.5)" : "0 2px 12px rgba(255,0,0,0.4)",
                      transition:"background 0.25s, box-shadow 0.25s",
                      WebkitTapHighlightColor:"transparent", touchAction:"manipulation" }}>
                    {followLoading ? "..." : followRecord ? "✓ Following" : "+ Follow"}
                  </button>
                )}
              </div>

              {/* Followers list modal */}
              {showFollowersList && (
                <div style={{ position:"absolute", inset:0, zIndex:200, background:"#0B0C1A", display:"flex", flexDirection:"column" }}>
                  <div style={{ display:"flex", alignItems:"center", padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                    <button onClick={() => setShowFollowersList(false)} style={{ background:"none", border:"none", color:"#fff", fontSize:20, cursor:"pointer", marginRight:12 }}>←</button>
                    <div style={{ color:"#fff", fontWeight:800, fontSize:16 }}>Followers</div>
                  </div>
                  <div style={{ overflowY:"auto", flex:1 }}>
                    {listLoading && <div style={{ color:"#666", textAlign:"center", padding:32 }}>Loading...</div>}
                    {!listLoading && followersList.length === 0 && <div style={{ color:"#666", textAlign:"center", padding:32 }}>No followers yet</div>}
                    {followersList.map(u => (
                      <div key={u.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 20px", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                        <img src={u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.display_name||u.username||'U')}&background=random&color=fff&size=64&bold=true`}
                          style={{ width:44, height:44, borderRadius:"50%", background:"#1a1a2e" }} loading="lazy" />
                        <div>
                          <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{u.display_name || u.username}</div>
                          <div style={{ color:"#666", fontSize:12 }}>@{u.username}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Following list modal */}
              {showFollowingList && (
                <div style={{ position:"absolute", inset:0, zIndex:200, background:"#0B0C1A", display:"flex", flexDirection:"column" }}>
                  <div style={{ display:"flex", alignItems:"center", padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                    <button onClick={() => setShowFollowingList(false)} style={{ background:"none", border:"none", color:"#fff", fontSize:20, cursor:"pointer", marginRight:12 }}>←</button>
                    <div style={{ color:"#fff", fontWeight:800, fontSize:16 }}>Following</div>
                  </div>
                  <div style={{ overflowY:"auto", flex:1 }}>
                    {listLoading && <div style={{ color:"#666", textAlign:"center", padding:32 }}>Loading...</div>}
                    {!listLoading && followingList.length === 0 && <div style={{ color:"#666", textAlign:"center", padding:32 }}>Not following anyone yet</div>}
                    {followingList.map(u => (
                      <div key={u.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 20px", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                        <img src={u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.display_name||u.username||'U')}&background=random&color=fff&size=64&bold=true`}
                          style={{ width:44, height:44, borderRadius:"50%", background:"#1a1a2e" }} loading="lazy" />
                        <div>
                          <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{u.display_name || u.username}</div>
                          <div style={{ color:"#666", fontSize:12 }}>@{u.username}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Grid */}
              <div style={{ overflowY:"auto", flex:1, padding:2 }}>
                {userVideos.length === 0 ? (
                  <div style={{ textAlign:"center", padding:40, color:"#444" }}>
                    <div style={{ fontSize:36, marginBottom:8 }}>🎬</div>
                    <div>No videos yet</div>
                  </div>
                ) : (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:2 }}>
                    {userVideos.map((v, i) => (
                      <div key={v.id} onClick={() => setPlayerIndex(i)}
                        style={{ position:"relative", aspectRatio:"1/1", background:"#111", overflow:"hidden", cursor:"pointer" }}>
                        {v.thumbnail_url ? (
                          <img src={resolveMediaUrl(v.thumbnail_url)} loading="lazy" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        ) : (
                          <video src={resolveMediaUrl(v.video_url)} style={{ width:"100%", height:"100%", objectFit:"cover" }} muted playsInline preload="metadata" />
                        )}
                        {/* Play icon overlay */}
                        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <div style={{ fontSize:22, opacity:0.8 }}>▶</div>
                        </div>
                        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }} />
                        <div style={{ position:"absolute", bottom:4, left:6, color:"#fff", fontSize:11, fontWeight:700 }}>
                          ❤️ {v.likes_count || 0}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Full screen TikTok-style player */}
      {playerIndex !== null && userVideos.length > 0 && (
        <ProfileVideoPlayer
          videos={userVideos}
          startIndex={playerIndex}
          profile={profile}
          username={username}
          onClose={() => setPlayerIndex(null)} />
      )}
    </>
  );
}

// ─── VideoManageGrid ────────────────────────────────────────────────────────
function VideoManageGrid({ videos: vids, onRefresh }) {
  const [menuVideo, setMenuVideo] = React.useState(null);
  const [editVideo, setEditVideo] = React.useState(null);
  const [editCaption, setEditCaption] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(null);

  const handleDelete = async () => {
    try {
      setSaving(true);
      await videos.delete(confirmDelete.id);
      setConfirmDelete(null);
      onRefresh();
    } catch(e) { toast.error("Delete failed: " + e.message); }
    finally { setSaving(false); }
  };

  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      await videos.update(editVideo.id, { caption: editCaption });
      setEditVideo(null);
      onRefresh();
    } catch(e) { toast.error("Save failed: " + e.message); }
    finally { setSaving(false); }
  };

  if (!vids || vids.length === 0) return (
    <div style={{ gridColumn:"1/-1", textAlign:"center", padding:40, color:"#555" }}>
      <div style={{ fontSize:40, marginBottom:8 }}>📹</div>
      <div>No videos yet</div>
    </div>
  );

  return (
    <>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:2 }}>
        {vids.map(v => (
          <div key={v.id} style={{ position:"relative", aspectRatio:"9/16", background:"#111", overflow:"hidden", cursor:"pointer" }}
            onClick={() => setMenuVideo(v)}>
            {v.thumbnail_url
              ? <img src={resolveMediaUrl(v.thumbnail_url)} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>🎬</div>}
            {/* Three-dot indicator */}
            <div style={{ position:"absolute", top:6, right:6, background:"rgba(0,0,0,0.6)", borderRadius:"50%",
              width:24, height:24, display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:14, color:"#fff", lineHeight:1 }}>⋮</div>
            {/* Views badge */}
            {v.views_count > 0 && <div style={{ position:"absolute", bottom:4, left:4, background:"rgba(0,0,0,0.6)",
              borderRadius:8, padding:"2px 6px", fontSize:10, color:"#fff" }}>👁 {v.views_count}</div>}
          </div>
        ))}
      </div>

      {/* Action Menu Sheet */}
      {menuVideo && (
        <div style={{ position:"fixed", inset:0, zIndex:8000, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}
          onClick={() => setMenuVideo(null)}>
          <div style={{ background:"#1a1a2e", borderRadius:"20px 20px 0 0", padding:20, maxWidth:480, width:"100%", margin:"0 auto" }}
            onClick={e => e.stopPropagation()}>
            {/* Thumbnail preview */}
            <div style={{ display:"flex", gap:12, marginBottom:20, alignItems:"center" }}>
              <div style={{ width:54, height:72, background:"#111", borderRadius:8, overflow:"hidden", flexShrink:0 }}>
                {menuVideo.thumbnail_url
                  ? <img src={menuVideo.thumbnail_url} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🎬</div>}
              </div>
              <div>
                <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{menuVideo.caption || "(no caption)"}</div>
                <div style={{ color:"#888", fontSize:12, marginTop:4 }}>👁 {menuVideo.views_count || 0}  ❤️ {menuVideo.likes_count || 0}  💬 {menuVideo.comments_count || 0}</div>
              </div>
            </div>

            {/* Edit button */}
            <button onClick={() => { setEditCaption(menuVideo.caption || ""); setEditVideo(menuVideo); setMenuVideo(null); }}
              style={{ width:"100%", padding:"14px 0", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:12, color:"#fff", fontSize:15, fontWeight:600, cursor:"pointer", marginBottom:10,
                display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
              ✏️ Edit Caption
            </button>

            {/* Delete button */}
            <button onClick={() => { setConfirmDelete(menuVideo); setMenuVideo(null); }}
              style={{ width:"100%", padding:"14px 0", background:"rgba(229,57,53,0.15)", border:"1px solid rgba(229,57,53,0.4)",
                borderRadius:12, color:"#ff6b6b", fontSize:15, fontWeight:600, cursor:"pointer", marginBottom:10,
                display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
              🗑️ Delete Video
            </button>

            {/* Cancel */}
            <button onClick={() => setMenuVideo(null)}
              style={{ width:"100%", padding:"12px 0", background:"none", border:"none", color:"#888", fontSize:14, cursor:"pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Caption Modal */}
      {editVideo && (
        <div style={{ position:"fixed", inset:0, zIndex:8000, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
          onClick={() => setEditVideo(null)}>
          <div style={{ background:"#1a1a2e", borderRadius:20, padding:24, width:"100%", maxWidth:420 }}
            onClick={e => e.stopPropagation()}>
            <div style={{ color:"#fff", fontWeight:700, fontSize:17, marginBottom:16 }}>✏️ Edit Caption</div>
            <textarea
              value={editCaption}
              onChange={e => setEditCaption(e.target.value)}
              placeholder="Write a caption..."
              rows={4}
              style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)",
                borderRadius:12, color:"#fff", padding:12, fontSize:14, resize:"none", outline:"none",
                fontFamily:"inherit", boxSizing:"border-box" }}
            />
            <div style={{ display:"flex", gap:10, marginTop:14 }}>
              <button onClick={() => setEditVideo(null)}
                style={{ flex:1, padding:"12px 0", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:12, color:"#aaa", fontSize:14, cursor:"pointer" }}>
                Cancel
              </button>
              <button onClick={handleSaveEdit} disabled={saving}
                style={{ flex:2, padding:"12px 0", background:"linear-gradient(135deg,#e91e63,#9c27b0)",
                  border:"none", borderRadius:12, color:"#fff", fontSize:14, fontWeight:700,
                  cursor:saving?"not-allowed":"pointer", opacity:saving?0.7:1 }}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

      )}
      {confirmDelete && (
        <div style={{ position:"fixed", inset:0, zIndex:8000, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"#1a1a2e", borderRadius:20, padding:24, width:"100%", maxWidth:380, textAlign:"center" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🗑️</div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:17, marginBottom:8 }}>Delete this video?</div>
            <div style={{ color:"#888", fontSize:13, marginBottom:24 }}>This can't be undone. The video will be permanently removed.</div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setConfirmDelete(null)}
                style={{ flex:1, padding:"12px 0", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:12, color:"#aaa", fontSize:14, cursor:"pointer" }}>
                Keep it
              </button>
              <button onClick={handleDelete} disabled={saving}
                style={{ flex:1, padding:"12px 0", background:"rgba(229,57,53,0.9)",
                  border:"none", borderRadius:12, color:"#fff", fontSize:14, fontWeight:700,
                  cursor:saving?"not-allowed":"pointer" }}>
                {saving ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// PODCAST PAGE
// ─────────────────────────────────────────────
function Toast({ msg, type="success" }) {
  if (!msg) return null;
  const bg = type==="error" ? "linear-gradient(135deg,#c62828,#b71c1c)" : type==="live" ? "linear-gradient(135deg,#e53935,#b71c1c)" : "linear-gradient(135deg,#2e7d32,#1b5e20)";
  return (
    <div style={{ position:"fixed", bottom:100, left:"50%", transform:"translateX(-50%)", zIndex:9999, background:bg, color:"#fff", fontWeight:700, fontSize:14, padding:"12px 24px", borderRadius:30, boxShadow:"0 6px 28px rgba(0,0,0,0.5)", whiteSpace:"nowrap", pointerEvents:"none" }}>
      {msg}
    </div>
  );
}

// ── RECENT EPISODES COMPONENT v2 ──
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

function PodcastPage({ currentUser, onNeedAuth }) {
  const CATEGORIES = ["All","News & Politics","Business","Entertainment","Comedy","Sports","Technology","Health & Wellness","True Crime","Education"];
  const [podcasts, setPodcasts] = useState([]);
  const [myShows, setMyShows] = useState([]);
  const [loadingPodcasts, setLoadingPodcasts] = useState(true);
  const [selectedCat, setSelectedCat] = useState("All");
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [podcastEpisodes, setPodcastEpisodes] = useState([]);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerForm, setRegisterForm] = useState({ title:"", host_name:"", description:"", category:"Business", live_stream_url:"", coverIdx:0 });
  const [registering, setRegistering] = useState(false);
  const [registerDone, setRegisterDone] = useState(false);
  const [toast, setToast] = useState(null);
  const [goingLive, setGoingLive] = useState(false);
  const [endingLive, setEndingLive] = useState(false);
  const [editingStream, setEditingStream] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [newStreamUrl, setNewStreamUrl] = useState("");
  const [liveNewsChannel, setLiveNewsChannel] = useState(null);

  const LIVE_NEWS_CHANNELS = [
    { id:"ctv",   name:"CTV News",      emoji:"🍁", desc:"Canada's #1 news network",     color:"linear-gradient(135deg,#c62828,#b71c1c)", url:"https://www.youtube.com/embed/live_stream?channel=UCt2BNvKMDuNg38w2MgI4mIA&autoplay=1" },
    { id:"abc",   name:"ABC News",      emoji:"🇺🇸", desc:"Live U.S. news coverage",      color:"linear-gradient(135deg,#1565c0,#0d47a1)", url:"https://www.youtube.com/embed/live_stream?channel=UCBi2mrWuNuyYy4gbM6fU18Q&autoplay=1" },
    { id:"bbc",   name:"BBC News",      emoji:"🇬🇧", desc:"Global news from London",      color:"linear-gradient(135deg,#b71c1c,#880e4f)", url:"https://www.youtube.com/embed/live_stream?channel=UC16niRr50-MSBwiO3YDb3RA&autoplay=1" },
    { id:"aljaz", name:"Al Jazeera",    emoji:"🌍", desc:"Breaking news worldwide",       color:"linear-gradient(135deg,#1b5e20,#004d40)", url:"https://www.youtube.com/embed/live_stream?channel=UCNye-wNBqNL5ZzHSJj3l8Bg&autoplay=1" },
    { id:"cnn",   name:"CNN",           emoji:"📡", desc:"24/7 breaking news",            color:"linear-gradient(135deg,#c62828,#4a148c)", url:"https://www.youtube.com/embed/live_stream?channel=UCupvZG-5ko_eiXAupbDfxWw&autoplay=1" },
    { id:"sky",   name:"Sky News",      emoji:"🌐", desc:"Live from the UK",              color:"linear-gradient(135deg,#0277bd,#01579b)", url:"https://www.youtube.com/embed/live_stream?channel=UCiU6U_f2KO7P6LFID9eQ4bA&autoplay=1" },
    { id:"dw",    name:"DW News",       emoji:"🇩🇪", desc:"International news in English", color:"linear-gradient(135deg,#37474f,#263238)", url:"https://www.youtube.com/embed/live_stream?channel=UCknLrEdhRCp1aegoMqRaCZg&autoplay=1" },
    { id:"france",name:"France 24",     emoji:"🇫🇷", desc:"Global news in English",       color:"linear-gradient(135deg,#1565c0,#e53935)", url:"https://www.youtube.com/embed/live_stream?channel=UCQfwfsi5VrQ8yKZ-UWmAoBw&autoplay=1" },
  ];

  const showToast = (msg, type="success", ms=3000) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), ms);
  };

  useEffect(() => { loadPodcasts(); }, []);
  useEffect(() => { if (currentUser) loadMyShows(); }, [currentUser]);

  const loadPodcasts = async () => {
    setLoadingPodcasts(true);
    try {

      const data = await request("GET", `/apps/${APP_ID}/entities/SachiPodcast?status=Active`);
      const list = Array.isArray(data) ? data : (data.records || data.items || []);
      setPodcasts(list);
    } catch(e) {
      console.error("loadPodcasts failed:", e);
    } finally {
      setLoadingPodcasts(false);
    }
  };

  const loadMyShows = async () => {
    if (!currentUser) return;
    try {

      const data = await request("GET", `/apps/${APP_ID}/entities/SachiPodcast`);
      const all = Array.isArray(data) ? data : (data.records || data.items || []);
      const mine = all.filter(p =>
        p.host_user_id === currentUser.id ||
        p.host_username === (currentUser.full_name || currentUser.email?.split("@")[0]) ||
        p.created_by === currentUser.email ||
        currentUser.email === "jaygnz27@gmail.com" ||
        currentUser.email === "lasanjaya@gmail.com"
      );
      setMyShows(mine);
    } catch(e) { console.error("loadMyShows failed:", e); }
  };

  const filtered = selectedCat === "All" ? podcasts : podcasts.filter(p => p.category === selectedCat);
  const livePodcasts = filtered.filter(p => p.is_live);
  const regularPodcasts = filtered.filter(p => !p.is_live);

  const handleRegister = async () => {
    if (!registerForm.title || !registerForm.host_name) return;
    setRegistering(true);
    try {
      const cover = PODCAST_COVER_COLORS[registerForm.coverIdx || 0];
      await request("POST", `/apps/${APP_ID}/entities/SachiPodcast`, {
        title: registerForm.title,
        host_name: registerForm.host_name,
        description: registerForm.description,
        category: registerForm.category,
        live_stream_url: registerForm.live_stream_url || "",
        cover_color: cover.bg,
        cover_emoji: cover.emoji,
        status: "Active",
        is_live: false,
        listener_count: 0,
        episode_count: 0,
        follower_count: 0,
        host_user_id: currentUser?.id || "",
        host_username: currentUser?.full_name || currentUser?.email?.split("@")[0] || "",
      });
      setRegisterDone(true);
      await loadPodcasts();
      await loadMyShows();
      // Send welcome email to host
      fetch("https://sachi-c7f0261c.base44.app/functions/podcastWelcome", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          host_email: currentUser?.email || "",
          host_name: registerForm.host_name,
          podcast_title: registerForm.title,
          category: registerForm.category,
        })
      }).catch(() => {});
      setRegisterForm({ title:"", host_name:"", description:"", category:"Business", live_stream_url:"", coverIdx:0 });
    } catch(e) {
      console.error(e);
      showToast("Something went wrong. Please try again.", "error");
    }
    setRegistering(false);
  };

  // ── PODCAST DETAIL ──
  // Episode Player Overlay
  if (selectedEpisode) {
    const epUrl = selectedEpisode.live_stream_url || selectedEpisode.audio_url || selectedEpisode.video_url || "";
    const getEpEmbed = (url) => {
      if (!url) return null;
      if (url.includes("youtube.com/watch")) return url.replace("watch?v=","embed/").split("&")[0]+"?autoplay=1";
      if (url.includes("youtu.be/")) return "https://www.youtube.com/embed/"+url.split("youtu.be/")[1].split("?")[0]+"?autoplay=1";
      if (url.includes("rumble.com/embed")) return url.includes("?") ? url : url+"?pub=4";
      if (url.includes("rumble.com")) {
        // Convert regular rumble page URL to embed: rumble.com/vXXXX-title.html -> rumble.com/embed/vXXXX/
        const rmMatch = url.match(/rumble\.com\/(v[\w]+)-/);
        if (rmMatch) return `https://rumble.com/embed/${rmMatch[1]}/?pub=4`;
        return url; // fallback
      }
      if (url.includes("spotify.com/show/") || url.includes("spotify.com/episode/")) {
        const id = url.split("/").pop().split("?")[0];
        return url.includes("/episode/") ? `https://open.spotify.com/embed/episode/${id}` : `https://open.spotify.com/embed/show/${id}`;
      }
      return url;
    };
    const embedUrl = getEpEmbed(epUrl);
    return (
      <div style={{ position:"fixed", inset:0, background:"#0B0C1A", zIndex:200, display:"flex", flexDirection:"column" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.08)", flexShrink:0 }}>
          <button onClick={() => setSelectedEpisode(null)} style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:10, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#fff", fontSize:18 }}>←</button>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ color:"#fff", fontWeight:700, fontSize:15, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{selectedEpisode.title}</div>
            <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12 }}>Episode {selectedEpisode.episode_number}</div>
          </div>
        </div>
        {/* Player */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:20 }}>
          {embedUrl && (embedUrl.includes("youtube.com/embed") || embedUrl.includes("spotify.com/embed") || embedUrl.includes("rumble.com/embed")) ? (
            <iframe
              src={embedUrl}
              style={{ width:"100%", maxWidth:700, height: embedUrl.includes("spotify") ? 232 : "56vw", maxHeight:500, borderRadius:16, border:"none" }}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          ) : (
            <div style={{ width:"100%", maxWidth:500, background:"rgba(255,255,255,0.05)", borderRadius:20, padding:32, textAlign:"center" }}>
              <div style={{ fontSize:64, marginBottom:16 }}>🎙️</div>
              <div style={{ color:"#fff", fontWeight:700, fontSize:16, marginBottom:8 }}>{selectedEpisode.title}</div>
              {selectedEpisode.description && <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, marginBottom:24, lineHeight:1.6 }}>{selectedEpisode.description}</div>}
              {epUrl ? (
                <a href={epUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display:"inline-block", background:"linear-gradient(135deg,#6c3cf7,#4527a0)", color:"#fff", padding:"14px 28px", borderRadius:50, fontWeight:700, fontSize:15, textDecoration:"none" }}>
                  🎧 Listen Now
                </a>
              ) : (
                <div style={{ color:"rgba(255,255,255,0.3)", fontSize:14 }}>No stream URL available yet</div>
              )}
            </div>
          )}
          {/* Episode info */}
          <div style={{ marginTop:24, width:"100%", maxWidth:500 }}>
            <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, lineHeight:1.7 }}>{selectedEpisode.description}</div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedPodcast) {
    const isHost = currentUser && (
      currentUser.id === selectedPodcast.host_user_id ||
      currentUser.email === selectedPodcast.created_by ||
      (currentUser.full_name && currentUser.full_name === selectedPodcast.host_username) ||
      ((currentUser.email?.split("@")[0]) === selectedPodcast.host_username) ||
      currentUser.email === "jaygnz27@gmail.com" ||
      currentUser.email === "lasanjaya@gmail.com"
    );
    const coverBg = selectedPodcast.cover_color || "linear-gradient(135deg,#1a0a2e,#0d1b4b)";
    const coverEmoji = selectedPodcast.cover_emoji || "🎙️";
    return (
      <div style={{ position:"fixed", inset:0, zIndex:600, background:"#0B0C1A", overflowY:"auto" }}>
        {toast && <Toast msg={toast.msg} type={toast.type} />}
        {/* HERO */}
        <div style={{ position:"relative", height:240, background:coverBg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <button onClick={() => setSelectedPodcast(null)}
            style={{ position:"absolute", top:16, left:16, background:"rgba(0,0,0,0.3)", border:"none", borderRadius:"50%", width:38, height:38, color:"#fff", fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>←</button>
          <div style={{ fontSize:60, marginBottom:10 }}>{coverEmoji}</div>
          <div style={{ color:"#fff", fontWeight:800, fontSize:20, textAlign:"center", padding:"0 60px", textShadow:"0 2px 8px rgba(0,0,0,0.5)" }}>{selectedPodcast.title}</div>
          <div style={{ color:"rgba(255,255,255,0.65)", fontSize:13, marginTop:4 }}>by {selectedPodcast.host_name}</div>
          {selectedPodcast.is_live && (
            <div style={{ position:"absolute", top:16, right:16, background:"#e53935", borderRadius:20, padding:"5px 12px", display:"flex", alignItems:"center", gap:6, animation:"pulse 1.5s infinite" }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#fff" }} />
              <span style={{ color:"#fff", fontWeight:800, fontSize:12 }}>LIVE</span>
            </div>
          )}
          {selectedPodcast.status === "Pending" && (
            <div style={{ position:"absolute", top:16, right:16, background:"rgba(245,200,66,0.9)", borderRadius:20, padding:"5px 12px" }}>
              <span style={{ color:"#000", fontWeight:800, fontSize:11 }}>⏳ PENDING REVIEW</span>
            </div>
          )}
        </div>
        <div style={{ padding:"20px 20px 100px" }}>
          {/* STATS */}
          <div style={{ display:"flex", gap:0, marginBottom:20, background:"rgba(255,255,255,0.04)", borderRadius:16, overflow:"hidden" }}>
            {[
              { val: selectedPodcast.follower_count||0, label:"Followers" },
              { val: selectedPodcast.episode_count||0, label:"Episodes" },
              { val: selectedPodcast.is_live ? (selectedPodcast.listener_count||0) : "—", label:"Listening", red: selectedPodcast.is_live },
            ].map((s,i) => (
              <div key={i} style={{ flex:1, textAlign:"center", padding:"14px 0", borderLeft: i>0?"1px solid rgba(255,255,255,0.06)":"none" }}>
                <div style={{ color: s.red?"#e53935":"#fff", fontWeight:800, fontSize:18 }}>{s.val}</div>
                <div style={{ color:"rgba(255,255,255,0.35)", fontSize:11, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* DESCRIPTION */}
          {selectedPodcast.description ? (
            <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:16, marginBottom:20 }}>
              <div style={{ color:"rgba(255,255,255,0.7)", fontSize:14, lineHeight:1.6 }}>{selectedPodcast.description}</div>
            </div>
          ) : null}

          {/* HOST CONTROLS */}
          {isHost && (
            <div style={{ marginBottom:20 }}>
              <div style={{ color:"#F5C842", fontWeight:700, fontSize:12, letterSpacing:1.2, textTransform:"uppercase", marginBottom:12 }}>🎙️ Host Controls</div>
              {selectedPodcast.is_live ? (
                <>
                  <div style={{ background:"rgba(229,57,53,0.08)", border:"1px solid rgba(229,57,53,0.3)", borderRadius:14, padding:14, marginBottom:12, textAlign:"center" }}>
                    <div style={{ color:"#e53935", fontWeight:700, fontSize:13 }}>🔴 You are currently LIVE</div>
                    <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12, marginTop:4 }}>{selectedPodcast.listener_count||0} listeners tuned in</div>
                  </div>
                  {/* Stream URL editor — available even while live */}
                  <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:14, marginBottom:14 }}>
                    <div style={{ color:"rgba(255,255,255,0.5)", fontSize:12, marginBottom:6 }}>🔗 Stream URL</div>
                    {editingStream ? (
                      <div style={{ display:"flex", gap:8 }}>
                        <input value={newStreamUrl} onChange={e => setNewStreamUrl(e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                          style={{ flex:1, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, padding:"8px 12px", color:"#fff", fontSize:13, outline:"none" }} />
                        <button onClick={async () => {
                          try {
                            await request("PATCH", `/apps/${APP_ID}/entities/SachiPodcast/${selectedPodcast.id}`, { live_stream_url: newStreamUrl });
                            setSelectedPodcast(p => ({...p, live_stream_url: newStreamUrl}));
                            setEditingStream(false);
                            showToast("✅ Stream URL saved!", "success");
                          } catch(e) { showToast("Failed to save URL", "error"); }
                        }} style={{ background:"#6c3cf7", border:"none", borderRadius:10, padding:"8px 14px", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>Save</button>
                        <button onClick={() => setEditingStream(false)} style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:10, padding:"8px 14px", color:"#fff", fontSize:13, cursor:"pointer" }}>✕</button>
                      </div>
                    ) : (
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <div style={{ color: selectedPodcast.live_stream_url ? "#a78bfa" : "rgba(255,255,255,0.25)", fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"75%" }}>
                          {selectedPodcast.live_stream_url || "No stream URL set yet"}
                        </div>
                        <button onClick={() => { setNewStreamUrl(selectedPodcast.live_stream_url||""); setEditingStream(true); }}
                          style={{ background:"rgba(108,60,247,0.2)", border:"1px solid rgba(108,60,247,0.4)", borderRadius:8, padding:"5px 12px", color:"#a78bfa", fontSize:12, cursor:"pointer", fontWeight:600, flexShrink:0 }}>
                          {selectedPodcast.live_stream_url ? "Edit" : "Add URL"}
                        </button>
                      </div>
                    )}
                  </div>
                  <button onClick={async () => {
                    if (endingLive) return;
                    setEndingLive(true);
                    try {
                      await fetch("https://sachi-c7f0261c.base44.app/functions/podcastGoLiveNotify", {
                        method:"POST", headers:{"Content-Type":"application/json"},
                        body:JSON.stringify({ podcast_id:selectedPodcast.id, set_live:false, admin_email: currentUser?.email })
                      }).catch(()=>{});
                      try { await request("PATCH", `/apps/${APP_ID}/entities/SachiPodcast/${selectedPodcast.id}`, { is_live:false, listener_count:0 }); } catch {}
                      setSelectedPodcast(p => ({...p, is_live:false, listener_count:0}));
                      setPodcasts(ps => ps.map(p => p.id===selectedPodcast.id ? {...p, is_live:false} : p));
                      showToast("✅ Live session ended successfully", "success");
                    } catch(e) { showToast("Failed to end session. Try again.", "error"); }
                    setEndingLive(false);
                  }}
                    style={{ width:"100%", padding:"15px 0", background:endingLive?"rgba(229,57,53,0.3)":"rgba(229,57,53,0.12)", border:"2px solid #e53935", borderRadius:16, color:"#e53935", fontWeight:800, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                    {endingLive ? "Ending..." : "⏹️ End Live Session"}
                  </button>
                </>
              ) : (
                <>
                  {/* Stream URL editor */}
                  <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:14, marginBottom:14 }}>
                    <div style={{ color:"rgba(255,255,255,0.5)", fontSize:12, marginBottom:6 }}>🔗 Stream URL <span style={{ color:"rgba(255,255,255,0.25)" }}>(YouTube Live, Twitch, etc.)</span></div>
                    {editingStream ? (
                      <div style={{ display:"flex", gap:8 }}>
                        <input value={newStreamUrl} onChange={e => setNewStreamUrl(e.target.value)}
                          placeholder="https://youtube.com/live/..."
                          style={{ flex:1, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, padding:"8px 12px", color:"#fff", fontSize:13, outline:"none" }} />
                        <button onClick={async () => {
                          try {
                            await request("PATCH", `/apps/${APP_ID}/entities/SachiPodcast/${selectedPodcast.id}`, { live_stream_url: newStreamUrl });
                            setSelectedPodcast(p => ({...p, live_stream_url: newStreamUrl}));
                            setEditingStream(false);
                            showToast("✅ Stream URL saved!", "success");
                          } catch(e) { showToast("Failed to save URL", "error"); }
                        }} style={{ background:"#6c3cf7", border:"none", borderRadius:10, padding:"8px 14px", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>Save</button>
                        <button onClick={() => setEditingStream(false)} style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:10, padding:"8px 14px", color:"#fff", fontSize:13, cursor:"pointer" }}>✕</button>
                      </div>
                    ) : (
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <div style={{ color: selectedPodcast.live_stream_url ? "#a78bfa" : "rgba(255,255,255,0.25)", fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"75%" }}>
                          {selectedPodcast.live_stream_url || "No stream URL set yet"}
                        </div>
                        <button onClick={() => { setNewStreamUrl(selectedPodcast.live_stream_url||""); setEditingStream(true); }}
                          style={{ background:"rgba(108,60,247,0.2)", border:"1px solid rgba(108,60,247,0.4)", borderRadius:8, padding:"5px 12px", color:"#a78bfa", fontSize:12, cursor:"pointer", fontWeight:600, flexShrink:0 }}>
                          {selectedPodcast.live_stream_url ? "Edit" : "Add URL"}
                        </button>
                      </div>
                    )}
                  </div>
                  <button onClick={async () => {
                    if (goingLive) return;
                    setGoingLive(true);
                    try {
                      // Use podcastGoLiveNotify which handles the DB update via service role
                      const resp = await fetch("https://sachi-c7f0261c.base44.app/functions/podcastGoLiveNotify", {
                        method:"POST", headers:{"Content-Type":"application/json"},
                        body:JSON.stringify({ podcast_id:selectedPodcast.id, podcast_title:selectedPodcast.title, host_name:selectedPodcast.host_name, live_stream_url:selectedPodcast.live_stream_url||"", set_live:true, admin_email: currentUser?.email })
                      });
                      // Also try direct PATCH (works if user has token)
                      try { await request("PATCH", `/apps/${APP_ID}/entities/SachiPodcast/${selectedPodcast.id}`, { is_live:true }); } catch {}
                      setSelectedPodcast(p => ({...p, is_live:true}));
                      setPodcasts(ps => ps.map(p => p.id===selectedPodcast.id ? {...p, is_live:true} : p));
                      showToast("🔴 You are LIVE! Users are being notified.", "live");
                    } catch(e) { showToast("Could not go live. Try again.", "error"); }
                    setGoingLive(false);
                  }}
                    style={{ width:"100%", padding:"16px 0", background:goingLive?"rgba(229,57,53,0.4)":"linear-gradient(135deg,#e53935,#b71c1c)", border:"none", borderRadius:16, color:"#fff", fontWeight:800, fontSize:17, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10, boxShadow:"0 4px 24px rgba(229,57,53,0.35)" }}>
                    {goingLive ? "Going Live..." : "🔴 Go Live Now"}
                  </button>
                  <div style={{ color:"rgba(255,255,255,0.3)", fontSize:12, textAlign:"center", marginTop:8 }}>Tapping Go Live notifies ALL Sachi users instantly via email</div>
                </>
              )}
            </div>
          )}

          {/* LISTENER CONTROLS */}
          {!isHost && currentUser && (
            <div style={{ marginBottom:16 }}>
              {selectedPodcast.is_live && selectedPodcast.live_stream_url ? (() => {
                // Convert any YouTube URL to embed format
                const getEmbedUrl = (url) => {
                  if (!url) return null;
                  // Rumble channel live feed
                  if (url.includes("rumble.com/c/")) {
                    const ch = url.split("rumble.com/c/")[1].replace(/\/.*/, "").replace(/\?.*/, "");
                    return `https://rumble.com/embed/live_feed/?url=https%3A%2F%2Frumble.com%2Fc%2F${ch}`;
                  }
                  // Rumble video page e.g. rumble.com/vXXXXX-title.html
                  const rumbleVideo = url.match(/rumble\.com\/(v[a-zA-Z0-9]+)-/);
                  if (rumbleVideo) return `https://rumble.com/embed/${rumbleVideo[1]}/`;
                  // Rumble embed already
                  if (url.includes("rumble.com/embed/")) return url;
                  // YouTube embed already
                  if (url.includes("youtube.com/embed/")) return url + (url.includes("?") ? "&autoplay=1" : "?autoplay=1&rel=0");
                  // youtube.com/watch?v=ID
                  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
                  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&rel=0`;
                  // youtu.be/ID
                  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
                  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&rel=0`;
                  // youtube.com/live/ID
                  const liveMatch = url.match(/youtube\.com\/live\/([a-zA-Z0-9_-]+)/);
                  if (liveMatch) return `https://www.youtube.com/embed/${liveMatch[1]}?autoplay=1&rel=0`;
                  return url; // fallback: try direct
                };
                const embedUrl = getEmbedUrl(selectedPodcast.live_stream_url);
                const [showPlayer, setShowPlayer] = React.useState(false);
                return (
                  <div style={{ marginBottom:16 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                      <div style={{ width:10, height:10, background:"#e53935", borderRadius:"50%", animation:"pulse 1.2s infinite" }}/>
                      <span style={{ color:"#e53935", fontWeight:800, fontSize:13, letterSpacing:1 }}>LIVE NOW</span>
                      <span style={{ color:"rgba(255,255,255,0.35)", fontSize:12 }}>· {selectedPodcast.listener_count||0} watching</span>
                    </div>
                    <button onClick={() => setShowPlayer(true)}
                      style={{ display:"flex", width:"100%", padding:"16px 0", background:"linear-gradient(135deg,#e53935,#b71c1c)", border:"none", borderRadius:16, color:"#fff", fontWeight:800, fontSize:17, cursor:"pointer", alignItems:"center", justifyContent:"center", gap:10, marginBottom:12, boxShadow:"0 4px 20px rgba(229,57,53,0.35)" }}>
                      🎧 Watch Live Now
                    </button>
                    {showPlayer && (
                      <div style={{ position:"fixed", top:0, left:0, width:"100vw", height:"100vh", background:"#000", zIndex:9999, display:"flex", flexDirection:"column" }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:"rgba(0,0,0,0.85)", flexShrink:0 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <div style={{ width:10, height:10, background:"#e53935", borderRadius:"50%", animation:"pulse 1.2s infinite" }}/>
                            <span style={{ color:"#fff", fontWeight:800, fontSize:15 }}>{selectedPodcast.title}</span>
                          </div>
                          <button onClick={() => setShowPlayer(false)} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", borderRadius:"50%", width:34, height:34, fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                        </div>
                        <iframe
                          src={embedUrl}
                          style={{ flex:1, width:"100%", border:"none" }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                          allowFullScreen
                          title={selectedPodcast.title}
                        />
                        <div style={{ padding:"10px 16px", background:"rgba(0,0,0,0.85)", textAlign:"center", flexShrink:0 }}>
                          <span style={{ color:"rgba(255,255,255,0.35)", fontSize:12 }}>Streaming via Sachi · sachistream.com</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })() : !selectedPodcast.is_live ? (
                <button onClick={() => showToast("🔔 You will be notified when " + selectedPodcast.title + " goes live!", "success")}
                  style={{ width:"100%", padding:"16px 0", background:"linear-gradient(135deg,#6c3cf7,#4527a0)", border:"none", borderRadius:16, color:"#fff", fontWeight:800, fontSize:17, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:12 }}>
                  🔔 Follow & Get Notified
                </button>
              ) : null}
            </div>
          )}

          {!isHost && !currentUser && (
            <div style={{ marginBottom:16 }}>
              {selectedPodcast.is_live && selectedPodcast.live_stream_url ? (() => {
                const getEmbedUrl = (url) => {
                  if (!url) return null;
                  // Rumble channel live feed
                  if (url.includes("rumble.com/c/")) {
                    const ch = url.split("rumble.com/c/")[1].replace(/\/.*/, "").replace(/\?.*/, "");
                    return `https://rumble.com/embed/live_feed/?url=https%3A%2F%2Frumble.com%2Fc%2F${ch}`;
                  }
                  // Rumble video page e.g. rumble.com/vXXXXX-title.html
                  const rumbleVideo = url.match(/rumble\.com\/(v[a-zA-Z0-9]+)-/);
                  if (rumbleVideo) return `https://rumble.com/embed/${rumbleVideo[1]}/`;
                  // Rumble embed already
                  if (url.includes("rumble.com/embed/")) return url;
                  // YouTube embed already
                  if (url.includes("youtube.com/embed/")) return url + (url.includes("?") ? "&autoplay=1" : "?autoplay=1&rel=0");
                  // youtube.com/watch?v=ID
                  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
                  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&rel=0`;
                  // youtu.be/ID
                  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
                  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&rel=0`;
                  // youtube.com/live/ID
                  const liveMatch = url.match(/youtube\.com\/live\/([a-zA-Z0-9_-]+)/);
                  if (liveMatch) return `https://www.youtube.com/embed/${liveMatch[1]}?autoplay=1&rel=0`;
                  return url; // fallback: try direct
                };
                const embedUrl = getEmbedUrl(selectedPodcast.live_stream_url);
                return embedUrl ? (
                  <div style={{ marginBottom:16 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                      <div style={{ width:10, height:10, background:"#e53935", borderRadius:"50%", animation:"pulse 1.2s infinite" }}/>
                      <span style={{ color:"#e53935", fontWeight:800, fontSize:13, letterSpacing:1 }}>LIVE NOW</span>
                    </div>
                    <div style={{ position:"relative", width:"100%", paddingBottom:"56.25%", borderRadius:14, overflow:"hidden", background:"#000", boxShadow:"0 4px 24px rgba(229,57,53,0.25)" }}>
                      <iframe
                        src={embedUrl}
                        style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", border:"none" }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={selectedPodcast.title}
                      />
                    </div>
                    <button onClick={onNeedAuth} style={{ width:"100%", marginTop:12, padding:"13px 0", background:"rgba(108,60,247,0.15)", border:"1px solid rgba(108,60,247,0.4)", borderRadius:14, color:"#a78bfa", fontWeight:700, fontSize:15, cursor:"pointer" }}>
                      Sign in to Follow this Podcast
                    </button>
                  </div>
                ) : null;
              })() : (
                <button onClick={onNeedAuth} style={{ width:"100%", padding:"16px 0", background:"linear-gradient(135deg,#6c3cf7,#4527a0)", border:"none", borderRadius:16, color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer", marginBottom:16 }}>
                  Sign in to Follow
                </button>
              )}
            </div>
          )}

          {/* RECENT EPISODES */}
          <RecentEpisodes episodes={podcastEpisodes} loading={episodesLoading} onEpisodeClick={setSelectedEpisode} />

          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:16 }}>
            <div style={{ background:"rgba(108,60,247,0.2)", border:"1px solid rgba(108,60,247,0.4)", borderRadius:20, padding:"4px 14px", color:"#a78bfa", fontSize:12, fontWeight:600 }}>{selectedPodcast.category}</div>
          </div>
        </div>
      </div>
    );
  }

  // ── REGISTER FORM ──
  if (showRegister) {
    const selectedCover = PODCAST_COVER_COLORS[registerForm.coverIdx || 0];
    return (
      <div style={{ position:"fixed", inset:0, zIndex:600, background:"#0B0C1A", overflowY:"auto" }}>
        {toast && <Toast msg={toast.msg} type={toast.type} />}
        <div style={{ padding:"20px", paddingTop:"calc(env(safe-area-inset-top,0px) + 20px)", paddingBottom:60 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
            <button onClick={() => setShowRegister(false)} style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:"50%", width:38, height:38, color:"#fff", fontSize:20, cursor:"pointer", flexShrink:0 }}>←</button>
            <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>🎙️ Register Your Podcast</div>
          </div>
          {registerDone ? (
            <div style={{ textAlign:"center", padding:"40px 20px" }}>
              <div style={{ fontSize:72, marginBottom:16 }}>🎉</div>
              <div style={{ color:"#fff", fontWeight:800, fontSize:24, marginBottom:10 }}>You are on the list!</div>
              <div style={{ color:"rgba(255,255,255,0.5)", fontSize:15, marginBottom:8, lineHeight:1.6 }}>
                Your show is <strong style={{ color:"#81c784" }}>live on Sachi right now.</strong><br/>No waiting. No approval needed.
              </div>
              <div style={{ background:"rgba(46,125,50,0.1)", border:"1px solid rgba(46,125,50,0.3)", borderRadius:14, padding:16, margin:"20px 0 28px", textAlign:"left" }}>
                <div style={{ color:"#81c784", fontWeight:700, fontSize:13, marginBottom:8 }}>⚡ You are all set — here's how to go live:</div>
                <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13, lineHeight:1.7 }}>
                  1. Go to <strong style={{ color:"#fff" }}>Podcasts tab</strong> and find your show under "My Shows"<br/>
                  2. Tap your show to open it<br/>
                  3. (Optional) Add your stream link — YouTube Live, Twitch, etc.<br/>
                  4. Tap <strong style={{ color:"#e53935" }}>🔴 Go Live Now</strong> — all Sachi users get notified instantly
                </div>
              </div>
              <button onClick={() => { setRegisterDone(false); setShowRegister(false); }}
                style={{ background:"linear-gradient(135deg,#6c3cf7,#4527a0)", border:"none", borderRadius:14, padding:"14px 36px", color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer" }}>
                Back to Podcasts
              </button>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              {/* COVER PICKER */}
              <div>
                <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13, marginBottom:10, fontWeight:600 }}>Choose Your Show Cover</div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  {PODCAST_COVER_COLORS.map((c, i) => (
                    <button key={i} onClick={() => setRegisterForm(p => ({...p, coverIdx:i}))}
                      style={{ width:52, height:52, borderRadius:14, background:c.bg, border: registerForm.coverIdx===i ? "3px solid #F5C842":"3px solid transparent", cursor:"pointer", fontSize:22, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {c.emoji}
                    </button>
                  ))}
                </div>
                <div style={{ marginTop:12, width:"100%", height:70, borderRadius:16, background:selectedCover.bg, display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
                  <span style={{ fontSize:32 }}>{selectedCover.emoji}</span>
                  <span style={{ color:"#fff", fontWeight:800, fontSize:15, opacity: registerForm.title ? 1 : 0.4 }}>{registerForm.title || "Your Show Name"}</span>
                </div>
              </div>

              {/* TITLE */}
              <div>
                <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13, marginBottom:6, fontWeight:600 }}>Podcast Title <span style={{ color:"#e53935" }}>*</span></div>
                <input value={registerForm.title} onChange={e => setRegisterForm(p => ({...p, title:e.target.value}))}
                  placeholder="e.g. The Daily Grind"
                  style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"13px 14px", color:"#fff", fontSize:15, outline:"none", boxSizing:"border-box" }} />
              </div>

              {/* HOST NAME */}
              <div>
                <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13, marginBottom:6, fontWeight:600 }}>Your Name <span style={{ color:"#e53935" }}>*</span></div>
                <input value={registerForm.host_name} onChange={e => setRegisterForm(p => ({...p, host_name:e.target.value}))}
                  placeholder="Full name or stage name"
                  style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"13px 14px", color:"#fff", fontSize:15, outline:"none", boxSizing:"border-box" }} />
              </div>

              {/* DESCRIPTION */}
              <div>
                <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13, marginBottom:6, fontWeight:600 }}>What is your podcast about?</div>
                <textarea value={registerForm.description} onChange={e => setRegisterForm(p => ({...p, description:e.target.value}))}
                  placeholder="Tell listeners what to expect — topics, guests, vibe..."
                  rows={3}
                  style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"13px 14px", color:"#fff", fontSize:15, outline:"none", resize:"none", boxSizing:"border-box" }} />
              </div>

              {/* CATEGORY */}
              <div>
                <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13, marginBottom:6, fontWeight:600 }}>Category</div>
                <select value={registerForm.category} onChange={e => setRegisterForm(p => ({...p, category:e.target.value}))}
                  style={{ width:"100%", background:"#1a1a2e", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"13px 14px", color:"#fff", fontSize:15, outline:"none" }}>
                  {["Business","News & Politics","Entertainment","Comedy","Sports","Technology","Health & Wellness","True Crime","Society & Culture","Education","Other"].map(c =>
                    <option key={c} value={c} style={{ background:"#111" }}>{c}</option>
                  )}
                </select>
              </div>

              {/* STREAM URL - OPTIONAL */}
              <div>
                <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13, marginBottom:6, fontWeight:600 }}>
                  Stream URL <span style={{ color:"rgba(255,255,255,0.25)", fontWeight:400 }}>(optional — add later too)</span>
                </div>
                <input value={registerForm.live_stream_url} onChange={e => setRegisterForm(p => ({...p, live_stream_url:e.target.value}))}
                  placeholder="https://youtube.com/live/... or Twitch link"
                  style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"13px 14px", color:"#fff", fontSize:15, outline:"none", boxSizing:"border-box" }} />
                <div style={{ color:"rgba(255,255,255,0.25)", fontSize:12, marginTop:5 }}>Where listeners will tune in when you go live. You can update this anytime.</div>
              </div>

              <button onClick={handleRegister} disabled={registering || !registerForm.title || !registerForm.host_name}
                style={{ width:"100%", padding:"16px 0", background: (!registerForm.title || !registerForm.host_name) ? "rgba(108,60,247,0.3)" : registering ? "rgba(108,60,247,0.5)" : "linear-gradient(135deg,#6c3cf7,#4527a0)", border:"none", borderRadius:16, color:"#fff", fontWeight:800, fontSize:17, cursor: (!registerForm.title || !registerForm.host_name) ? "not-allowed" : "pointer", marginTop:4 }}>
                {registering ? "⏳ Submitting..." : "Submit My Podcast →"}
              </button>
              <div style={{ color:"rgba(255,255,255,0.2)", fontSize:12, textAlign:"center" }}>Reviewed and approved within 24 hours</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── MAIN PODCAST LIST ──
  return (
    <>
    <div style={{ paddingTop:70, paddingBottom:80, minHeight:"100svh", background:"#0B0C1A" }}>
      <div style={{ margin:"0 16px 20px", background:"linear-gradient(135deg,#1a0a2e,#0d1b4b)", borderRadius:20, padding:"24px 20px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-20, right:-20, fontSize:100, opacity:0.07 }}>🎙️</div>
        <div style={{ color:"#a78bfa", fontSize:12, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:8 }}>Sachi Podcasts</div>
        <div style={{ color:"#fff", fontWeight:800, fontSize:22, lineHeight:1.3, marginBottom:8 }}>Listen Live.<br/>Discover New Shows.</div>
        <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, marginBottom:16, lineHeight:1.5 }}>Tune into live sessions or browse on-demand — all in one place.</div>
        <button onClick={() => { if (!currentUser) { onNeedAuth(); return; } setShowRegister(true); }}
          style={{ background:"linear-gradient(135deg,#6c3cf7,#4527a0)", border:"none", borderRadius:12, padding:"10px 20px", color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer" }}>
          🎙️ Register Your Podcast
        </button>
      </div>

      {/* MY SHOWS — only visible to logged-in hosts */}
      {currentUser && myShows.length > 0 && (
        <div style={{ margin:"0 16px 20px" }}>
          <div style={{ color:"#F5C842", fontWeight:700, fontSize:13, letterSpacing:1.2, textTransform:"uppercase", marginBottom:12 }}>🎙️ My Shows</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {myShows.map(p => {
              const coverBg = p.cover_color || "linear-gradient(135deg,#1a0a2e,#0d1b4b)";
              const coverEmoji = p.cover_emoji || "🎙️";
              return (
                <div key={p.id} onClick={async () => {
                  setSelectedPodcast(p);
                  setEpisodesLoading(true);
                  setPodcastEpisodes([]);
                  try {
                    const res = await request("GET", `/apps/${APP_ID}/entities/SachiPodcastEpisode?podcast_id=${p.id}&limit=100&sort=-episode_number`);
                    const items = Array.isArray(res) ? res : (res?.records || res?.items || []);
                    setPodcastEpisodes(items);
                  } catch(e) { setPodcastEpisodes([]); }
                  finally { setEpisodesLoading(false); }
                }}
                  style={{ background:"rgba(245,200,66,0.05)", border:"1px solid rgba(245,200,66,0.2)", borderRadius:16, padding:14, cursor:"pointer", display:"flex", gap:14, alignItems:"center" }}>
                  <div style={{ width:52, height:52, borderRadius:12, background:coverBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{coverEmoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                      <div style={{ color:"#fff", fontWeight:700, fontSize:15, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.title}</div>
                      {p.is_live && <div style={{ background:"#e53935", borderRadius:20, padding:"2px 8px", color:"#fff", fontWeight:700, fontSize:10, flexShrink:0 }}>LIVE</div>}
                    </div>
                    <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12, marginBottom:4 }}>by {p.host_name}</div>
                    <div style={{ display:"inline-block", background: p.is_live ? "rgba(229,57,53,0.2)" : "rgba(46,125,50,0.2)", borderRadius:20, padding:"2px 10px", color: p.is_live ? "#ef9a9a" : "#81c784", fontSize:11, fontWeight:700 }}>
                      {p.is_live ? "🔴 Live Now" : "✅ Active"}
                    </div>
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.2)", fontSize:20 }}>›</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Live News Section ─── */}
      <div style={{ padding:"0 16px 4px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#e53935", animation:"heartbeat 1.4s ease-in-out infinite" }} />
          <span style={{ color:"#fff", fontWeight:800, fontSize:16 }}>Live News</span>
          <span style={{ color:"rgba(255,255,255,0.3)", fontSize:12 }}>• tap to watch</span>
        </div>
        <div style={{ overflowX:"auto", display:"flex", gap:12, paddingBottom:16, scrollbarWidth:"none" }}>
          {LIVE_NEWS_CHANNELS.map(ch => (
            <div key={ch.id}
              onClick={() => setLiveNewsChannel(ch)}
              style={{ flexShrink:0, width:140, borderRadius:16, overflow:"hidden", cursor:"pointer", position:"relative" }}>
              <div style={{ height:80, background:ch.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36 }}>
                {ch.emoji}
              </div>
              <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderTop:"none", borderRadius:"0 0 16px 16px", padding:"8px 10px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:2 }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background:"#e53935", flexShrink:0 }} />
                  <span style={{ color:"#fff", fontWeight:700, fontSize:13, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{ch.name}</span>
                </div>
                <div style={{ color:"rgba(255,255,255,0.4)", fontSize:10, lineHeight:1.3 }}>{ch.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ overflowX:"auto", display:"flex", gap:8, padding:"0 16px 16px", scrollbarWidth:"none" }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setSelectedCat(cat)}
            style={{ flexShrink:0, padding:"7px 16px", borderRadius:20, border:"none", cursor:"pointer", fontWeight:600, fontSize:13, background:selectedCat===cat?"#6c3cf7":"rgba(255,255,255,0.07)", color:selectedCat===cat?"#fff":"rgba(255,255,255,0.5)", WebkitTapHighlightColor:"transparent" }}>
            {cat}
          </button>
        ))}
      </div>

      {livePodcasts.length > 0 && (
        <div style={{ marginBottom:24 }}>
          <div style={{ padding:"0 16px 12px", display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#e53935" }} />
            <span style={{ color:"#fff", fontWeight:800, fontSize:16 }}>Live Now</span>
          </div>
          <div style={{ display:"flex", gap:12, padding:"0 16px", overflowX:"auto", scrollbarWidth:"none" }}>
            {livePodcasts.map(p => (
              <div key={p.id} onClick={async () => {
                  setSelectedPodcast(p);
                  setEpisodesLoading(true);
                  setPodcastEpisodes([]);
                  try {
                    const res = await request("GET", `/apps/${APP_ID}/entities/SachiPodcastEpisode?podcast_id=${p.id}&limit=100&sort=-episode_number`);
                    const items = Array.isArray(res) ? res : (res?.records || res?.items || []);
                    setPodcastEpisodes(items);
                  } catch(e) { setPodcastEpisodes([]); }
                  finally { setEpisodesLoading(false); }
                }}
                style={{ flexShrink:0, width:200, background:"rgba(229,57,53,0.08)", border:"1.5px solid rgba(229,57,53,0.3)", borderRadius:16, padding:16, cursor:"pointer" }}>
                <div style={{ background:"#e53935", display:"inline-flex", alignItems:"center", gap:5, borderRadius:20, padding:"3px 10px", marginBottom:10 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:"#fff" }} />
                  <span style={{ color:"#fff", fontWeight:700, fontSize:11 }}>LIVE</span>
                </div>
                <div style={{ fontSize:28, marginBottom:8 }}>🎙️</div>
                <div style={{ color:"#fff", fontWeight:700, fontSize:15, marginBottom:4 }}>{p.title}</div>
                <div style={{ color:"rgba(255,255,255,0.5)", fontSize:12, marginBottom:8 }}>{p.host_name}</div>
                <div style={{ color:"#e53935", fontSize:12, fontWeight:600 }}>🎧 {p.listener_count||0} listening</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding:"0 16px" }}>
        <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, fontWeight:700, marginBottom:12, letterSpacing:1, textTransform:"uppercase" }}>
          {selectedCat==="All" ? "All Shows" : selectedCat}
        </div>
        {loadingPodcasts && (
          <div style={{ textAlign:"center", padding:"60px 0", color:"rgba(245,200,66,0.5)", fontSize:14 }}>
            <div style={{ fontSize:40, marginBottom:12, animation:"spin 1.5s linear infinite", display:"inline-block" }}>⟳</div>
            <div>Loading podcasts...</div>
          </div>
        )}
        {!loadingPodcasts && regularPodcasts.length === 0 && livePodcasts.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 0", color:"rgba(255,255,255,0.25)", fontSize:14 }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🎙️</div>
            No podcasts in this category yet.
          </div>
        )}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {regularPodcasts.map(p => (
            <div key={p.id} onClick={async () => {
                  setSelectedPodcast(p);
                  setEpisodesLoading(true);
                  setPodcastEpisodes([]);
                  try {
                    const res = await request("GET", `/apps/${APP_ID}/entities/SachiPodcastEpisode?podcast_id=${p.id}&limit=100&sort=-episode_number`);
                    const items = Array.isArray(res) ? res : (res?.records || res?.items || []);
                    setPodcastEpisodes(items);
                  } catch(e) { setPodcastEpisodes([]); }
                  finally { setEpisodesLoading(false); }
                }}
              style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:16, cursor:"pointer", display:"flex", gap:14, alignItems:"center" }}>
              <div style={{ width:64, height:64, borderRadius:12, background:"linear-gradient(135deg,#1a0a2e,#0d1b4b)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>🎙️</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ color:"#fff", fontWeight:700, fontSize:15, marginBottom:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.title}</div>
                <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12, marginBottom:6 }}>{p.host_name}</div>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ background:"rgba(108,60,247,0.2)", borderRadius:20, padding:"2px 10px", color:"#a78bfa", fontSize:11, fontWeight:600 }}>{p.category}</div>
                  <div style={{ color:"rgba(255,255,255,0.25)", fontSize:11 }}>{p.follower_count||0} followers</div>
                </div>
              </div>
              <div style={{ color:"rgba(255,255,255,0.2)", fontSize:20 }}>›</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ margin:"32px 16px 0", background:"rgba(108,60,247,0.08)", border:"1px solid rgba(108,60,247,0.2)", borderRadius:20, padding:24, textAlign:"center" }}>
        <div style={{ fontSize:32, marginBottom:12 }}>🚀</div>
        <div style={{ color:"#fff", fontWeight:800, fontSize:18, marginBottom:8 }}>Have a podcast?</div>
        <div style={{ color:"rgba(255,255,255,0.5)", fontSize:14, marginBottom:16, lineHeight:1.5 }}>Join Sachi and reach new listeners through our For You feed every day.</div>
        <button onClick={() => { if (!currentUser) { onNeedAuth(); return; } setShowRegister(true); }}
          style={{ background:"linear-gradient(135deg,#6c3cf7,#4527a0)", border:"none", borderRadius:14, padding:"13px 28px", color:"#fff", fontWeight:800, fontSize:15, cursor:"pointer" }}>
          Get Started Free →
        </button>
      </div>
    </div>

    {/* ─── Live News Viewer Modal ─── */}
    {liveNewsChannel && (
      <div style={{ position:"fixed", inset:0, zIndex:9999, background:"#000", display:"flex", flexDirection:"column" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px",
          background:"rgba(0,0,0,0.9)", borderBottom:"1px solid rgba(255,255,255,0.1)", zIndex:10000 }}>
          <button onClick={() => setLiveNewsChannel(null)}
            style={{ background:"none", border:"none", color:"#fff", fontSize:24, cursor:"pointer", lineHeight:1, padding:4 }}>✕</button>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#e53935", animation:"heartbeat 1.4s ease-in-out infinite" }} />
            <span style={{ color:"#fff", fontWeight:800, fontSize:16 }}>{liveNewsChannel.emoji} {liveNewsChannel.name}</span>
            <span style={{ background:"#e53935", color:"#fff", fontSize:10, fontWeight:800, borderRadius:6, padding:"2px 8px", letterSpacing:1 }}>LIVE</span>
          </div>
          <div style={{ width:40 }} />
        </div>
        {/* Stream */}
        <div style={{ flex:1, position:"relative" }}>
          <iframe
            src={liveNewsChannel.url}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", border:"none" }}
            title={liveNewsChannel.name + " Live"}
          />
        </div>
        {/* Channel selector strip */}
        <div style={{ background:"rgba(0,0,0,0.9)", borderTop:"1px solid rgba(255,255,255,0.08)",
          padding:"10px 16px", overflowX:"auto", display:"flex", gap:10, scrollbarWidth:"none" }}>
          {LIVE_NEWS_CHANNELS.map(ch => (
            <button key={ch.id} onClick={() => setLiveNewsChannel(ch)}
              style={{ flexShrink:0, display:"flex", alignItems:"center", gap:6,
                padding:"8px 14px", borderRadius:20, border:"none", cursor:"pointer",
                background: ch.id === liveNewsChannel.id ? "rgba(229,57,53,0.3)" : "rgba(255,255,255,0.07)",
                outline: ch.id === liveNewsChannel.id ? "1.5px solid #e53935" : "none" }}>
              <span style={{ fontSize:16 }}>{ch.emoji}</span>
              <span style={{ color:"#fff", fontWeight:600, fontSize:12, whiteSpace:"nowrap" }}>{ch.name}</span>
            </button>
          ))}
        </div>
      </div>
    )}
    </>
  );
}


// ─── Admin Panel ─────────────────────────────────────────────────────────────
function AdminPanel({ currentUser }) {
  const [modTab, setModTab] = useState("videos"); // videos | ai | analytics
  const [allVideos, setAllVideos] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [saving, setSaving] = useState(null);
  const [filter, setFilter] = useState("all"); // all | mature | clean
  const [search, setSearch] = useState("");
  const [founders, setFounders] = useState([]);
  const [foundersLoading, setFoundersLoading] = useState(false);
  const [founderNote, setFounderNote] = useState("");

  const loadFounders = async () => {
    setFoundersLoading(true);
    try {
      const res = await request("GET", `/apps/${APP_ID}/entities/FoundingCreator?sort=-created_date&limit=100`);
      setFounders(Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : []);
    } catch(e) { console.error(e); }
    setFoundersLoading(false);
  };

  const updateFounder = async (founder, status) => {
    try {
      await request("PUT", `/apps/${APP_ID}/entities/FoundingCreator/${founder.id}`, { status, notes: founderNote || founder.notes });
      setFounders(prev => prev.map(f => f.id === founder.id ? { ...f, status, notes: founderNote || f.notes } : f));
      setFounderNote("");
    } catch(e) { toast.error("Failed to update: " + e.message); }
  };

  const loadVideos = async () => {
    setLoading(true);
    try {
      const res = await request("GET", `/apps/${APP_ID}/entities/SachiVideo?limit=500&sort=-created_date`);
      setAllVideos(Array.isArray(res?.items) ? res.items : (Array.isArray(res) ? res : []));
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const loadAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      // Paginate through ALL users (AthaVidUser + legacy User entity merged)
      let allUsersFetched = [], uSkip = 0, uMore = true;
      while (uMore) {
        const uRes = await request("GET", `/apps/${APP_ID}/entities/AthaVidUser?limit=500&skip=${uSkip}&sort=-created_date`);
        const uItems = uRes.items || (Array.isArray(uRes) ? uRes : []);
        allUsersFetched = [...allUsersFetched, ...uItems];
        uMore = uRes.has_more === true && uItems.length === 500;
        uSkip += 500;
      }
      const normalizedLegacy = []; // Legacy User entity removed — 401 Unauthorized
      const [vRes, cRes] = await Promise.all([
        request("GET", `/apps/${APP_ID}/entities/SachiVideo?limit=500&sort=-created_date`),
        request("GET", `/apps/${APP_ID}/entities/SachiComment?limit=500&sort=-created_date`),
      ]);
      const videos = Array.isArray(vRes?.items) ? vRes.items : (Array.isArray(vRes) ? vRes : []);
      const users  = [...allUsersFetched, ...normalizedLegacy];
      const comments = Array.isArray(cRes?.items) ? cRes.items : (Array.isArray(cRes) ? cRes : []);
      setAllUsers(users);

      // Build daily buckets for last 14 days
      const now = new Date();
      const days = Array.from({length:14}, (_,i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (13-i));
        return d.toISOString().slice(0,10);
      });

      const byDay = (arr, dateField) => {
        const map = {};
        days.forEach(d => map[d] = 0);
        arr.forEach(item => {
          const d = (item[dateField]||"").slice(0,10);
          if (map[d] !== undefined) map[d]++;
        });
        return days.map(d => ({ date: d, count: map[d] }));
      };

      // Top creators by video count
      const creatorMap = {};
      videos.forEach(v => {
        const u = v.username || "unknown";
        creatorMap[u] = (creatorMap[u]||0) + 1;
      });
      const topCreators = Object.entries(creatorMap)
        .sort((a,b) => b[1]-a[1]).slice(0,5)
        .map(([username, count]) => ({ username, count }));

      // Top videos by views
      const topVideos = [...videos].sort((a,b) => (b.views_count||0)-(a.views_count||0)).slice(0,5);

      // Totals
      const totalViews  = videos.reduce((s,v) => s+(v.views_count||0), 0);
      const totalLikes  = videos.reduce((s,v) => s+(v.likes_count||0), 0);
      const matureCount = videos.filter(v => v.is_mature).length;

      // Today & this week registrations
      const todayStr = new Date().toISOString().slice(0,10);
      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate()-7);
      const newToday = users.filter(u => (u.created_date||"").slice(0,10) === todayStr).length;
      const newThisWeek = users.filter(u => new Date(u.created_date) >= weekAgo).length;

      // Recent registrants (last 20)
      const recentUsers = [...users]
        .sort((a,b) => new Date(b.created_date) - new Date(a.created_date))
        .slice(0, 20);

      setAnalyticsData({
        totalVideos: videos.length,
        totalUsers: users.length,
        totalComments: comments.length,
        totalViews, totalLikes, matureCount,
        newToday, newThisWeek,
        dailyVideos: byDay(videos, "created_date"),
        dailyUsers: byDay(users, "created_date"),
        topCreators,
        topVideos,
        recentUsers,
      });
    } catch(e) {
      console.error("analytics error", e);
      toast.error("Analytics failed to load: " + e.message);
    }
    setAnalyticsLoading(false);
  };


  useEffect(() => { loadVideos(); }, []);
  useEffect(() => { if (modTab === "founders") loadFounders(); }, [modTab]);
  useEffect(() => { if (modTab === "analytics") loadAnalytics(); }, [modTab]);
  useEffect(() => { if (modTab === "users") loadRegisteredUsers(); }, [modTab]);

  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const loadRegisteredUsers = async () => {
    setUsersLoading(true);
    try {
      // Fetch AthaVidUser (Google auth) - paginated
      let athavid = [], skip = 0, hasMore = true;
      while (hasMore) {
        const res = await request("GET", `/apps/${APP_ID}/entities/AthaVidUser?limit=500&skip=${skip}&sort=-created_date`);
        const items = res.items || (Array.isArray(res) ? res : []);
        athavid = [...athavid, ...items];
        hasMore = res.has_more === true && items.length === 500;
        skip += 500;
      }
      // Only use AthaVidUser — legacy User entity returns 401
      const merged = [...athavid].sort((a,b) => new Date(b.created_date) - new Date(a.created_date));
      setRegisteredUsers(merged);
    } catch(e) { console.error(e); }
    setUsersLoading(false);
  };

  const toggleMature = async (video, reason) => {
    setSaving(video.id);
    try {
      const newMature = !video.is_mature;
      await request("PUT", `/apps/${APP_ID}/entities/SachiVideo/${video.id}`, {
        is_mature: newMature,
        mature_reason: newMature ? (reason || "other") : null,
      });
      setAllVideos(prev => prev.map(v => v.id === video.id ? { ...v, is_mature: newMature, mature_reason: newMature ? (reason || "other") : null } : v));
    } catch(e) { toast.error("Failed to update: " + e.message); }
    setSaving(null);
  };

  const deleteVideo = async (video) => {
    if (!window.confirm(`Delete "${video.caption || "this video"}"? This cannot be undone.`)) return;
    setSaving(video.id);
    try {
      await request("DELETE", `/apps/${APP_ID}/entities/SachiVideo/${video.id}`);
      setAllVideos(prev => prev.filter(v => v.id !== video.id));
    } catch(e) { toast.error("Failed to delete: " + e.message); }
    setSaving(null);
  };

  const flagAI = async (video) => {
    setSaving(video.id);
    try {
      const newFlag = !video.is_ai_detected;
      await request("PUT", `/apps/${APP_ID}/entities/SachiVideo/${video.id}`, { is_ai_detected: newFlag });
      setAllVideos(prev => prev.map(v => v.id === video.id ? { ...v, is_ai_detected: newFlag } : v));
    } catch(e) { toast.error("Failed to update: " + e.message); }
    setSaving(null);
  };

  const filtered = allVideos.filter(v => {
    if (filter === "mature" && !v.is_mature) return false;
    if (filter === "clean" && v.is_mature) return false;
    if (search && !((v.caption||"").toLowerCase().includes(search.toLowerCase()) || (v.username||"").toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const reasons = ["violence","fighting","adult_themes","strong_language","other"];

  return (
    <div style={{ minHeight:"100svh", background:"#0B0C1A", paddingBottom:120, paddingTop:0 }}>
      {/* Header */}
      <div style={{ background:"rgba(14,14,28,0.98)", borderBottom:"1px solid rgba(245,200,66,0.15)", padding:"16px 20px 10px", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <div style={{ color:"#F5C842", fontWeight:900, fontSize:20 }}>🛡️ Mod Panel</div>
          <button onClick={() => modTab==="analytics" ? loadAnalytics() : modTab==="users" ? loadRegisteredUsers() : modTab==="founders" ? loadFounders() : loadVideos()}
            style={{ background:"rgba(255,255,255,0.07)", border:"none", borderRadius:20, padding:"7px 14px", color:"#888", fontWeight:700, fontSize:12, cursor:"pointer" }}>
            ↻ Refresh
          </button>
        </div>
        {/* Tab switcher */}
        <div style={{ display:"flex", gap:6, marginBottom: modTab==="videos" ? 10 : 0 }}>
          {[["videos","🎬 Videos"],["ai","🤖 AI Flagged"],["users","👥 Users"],["founders","🌟 Founders"],["creators","📊 Creators"],["analytics","📈 Analytics"]].map(([val,label]) => (
            <button key={val} onClick={() => setModTab(val)}
              style={{ padding:"8px 18px", borderRadius:20, border:"none", cursor:"pointer", fontSize:13, fontWeight:700,
                background: modTab===val ? "linear-gradient(135deg,#F5C842,#FF9500)" : "rgba(255,255,255,0.07)",
                color: modTab===val ? "#0B0C1A" : "#888", transition:"all 0.2s" }}>
              {label}
            </button>
          ))}
        </div>
        {/* Search + filter — only on videos tab */}
  
      {/* ── FOUNDING CREATORS TAB ── */}
      {modTab === "founders" && (
        <div style={{ padding:"16px" }}>
          {(() => {
            const counts = { Pending:0, Approved:0, Rejected:0, Contacted:0, Waitlisted:0 };
            founders.forEach(f => { if (counts[f.status] !== undefined) counts[f.status]++; else counts.Pending++; });
            return (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8, marginBottom:16 }}>
                {[
                  ["Pending","🟡",counts.Pending,"rgba(245,200,66,0.15)","#F5C842"],
                  ["Approved","✅",counts.Approved,"rgba(76,175,80,0.15)","#4caf50"],
                  ["Contacted","📩",counts.Contacted,"rgba(100,181,246,0.15)","#64b5f6"],
                  ["Waitlisted","⏳",counts.Waitlisted,"rgba(255,152,0,0.15)","#ff9800"],
                  ["Rejected","❌",counts.Rejected,"rgba(229,57,53,0.15)","#ef5350"],
                ].map(([label,icon,count,bg,color]) => (
                  <div key={label} style={{ background:bg, border:`1px solid ${color}44`, borderRadius:12, padding:"10px 4px", textAlign:"center" }}>
                    <div style={{ fontSize:16 }}>{icon}</div>
                    <div style={{ color, fontWeight:900, fontSize:18 }}>{count}</div>
                    <div style={{ color:"#888", fontSize:9 }}>{label}</div>
                  </div>
                ))}
              </div>
            );
          })()}
          {foundersLoading && <div style={{ textAlign:"center", color:"#888", padding:40 }}>Loading applications…</div>}
          {!foundersLoading && founders.length === 0 && (
            <div style={{ textAlign:"center", color:"#555", padding:40 }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🌟</div>
              <div>No applications yet</div>
            </div>
          )}
          {founders.map(f => {
            const statusColors = { Approved:"#4caf50", Rejected:"#ef5350", Contacted:"#64b5f6", Waitlisted:"#ff9800", Pending:"#F5C842" };
            const sc = statusColors[f.status] || "#F5C842";
            return (
              <div key={f.id} style={{ background:"rgba(255,255,255,0.04)", borderRadius:16, padding:16, marginBottom:12, border:`1px solid ${sc}33` }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                  <div>
                    <div style={{ color:"#fff", fontWeight:800, fontSize:15 }}>{f.full_name}</div>
                    <div style={{ color:"#888", fontSize:12 }}>{f.email}{f.phone ? ` · ${f.phone}` : ""}</div>
                    <div style={{ color:"#aaa", fontSize:12 }}>{f.location} · {f.content_type}</div>
                  </div>
                  <div style={{ background:`${sc}22`, color:sc, fontWeight:800, fontSize:11, padding:"4px 10px", borderRadius:20 }}>{f.status||"Pending"}</div>
                </div>
                {f.follower_count && <div style={{ color:"#aaa", fontSize:12, marginBottom:6 }}>👥 {f.follower_count} followers</div>}
                {f.why_sachi && <div style={{ color:"#ccc", fontSize:13, marginBottom:8, fontStyle:"italic" }}>"{f.why_sachi}"</div>}
                {f.social_links && <div style={{ color:"#6B8AFF", fontSize:12, marginBottom:8 }}>{f.social_links}</div>}
                <textarea
                  placeholder="Add note…"
                  value={f.notes||""}
                  onChange={e => setFounderNote(e.target.value)}
                  style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:8, color:"#fff", fontSize:12, resize:"vertical", marginBottom:8, boxSizing:"border-box" }}
                  rows={2}
                />
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {["Approved","Contacted","Waitlisted","Rejected"].map(s => (
                    <button key={s} onClick={() => updateFounder(f, s)}
                      style={{ padding:"6px 12px", borderRadius:20, border:"none", cursor:"pointer", fontSize:12, fontWeight:700,
                        background: f.status===s ? statusColors[s] : "rgba(255,255,255,0.08)",
                        color: f.status===s ? "#000" : "#aaa" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modTab === "videos" && (<>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by caption or username…"
            style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"10px 14px", color:"#fff", fontSize:14, outline:"none", marginBottom:10 }} />
          <div style={{ display:"flex", gap:8 }}>
            {[["all","All"],["mature","🔞 Mature"],["clean","✅ Clean"]].map(([val,label]) => (
              <button key={val} onClick={() => setFilter(val)}
                style={{ padding:"6px 14px", borderRadius:20, border:"none", cursor:"pointer", fontSize:12, fontWeight:700,
                  background: filter===val ? "linear-gradient(135deg,#F5C842,#FF9500)" : "rgba(255,255,255,0.07)",
                  color: filter===val ? "#0B0C1A" : "#888" }}>
                {label}
              </button>
            ))}
          </div>
        </>)}
      </div>

      {/* ── ANALYTICS TAB ── */}
      {modTab === "analytics" && (
        <div style={{ padding:"16px 16px 20px" }}>
          {analyticsLoading ? (
            <div style={{ textAlign:"center", color:"#555", padding:60, fontSize:14 }}>Loading analytics…</div>
          ) : !analyticsData ? (
            <div style={{ textAlign:"center", color:"#555", padding:60, fontSize:14 }}>
              <div style={{ fontSize:36, marginBottom:12 }}>📊</div>
              <div>Failed to load analytics.</div>
              <button onClick={loadAnalytics} style={{ marginTop:16, background:"rgba(245,200,66,0.15)", border:"1px solid rgba(245,200,66,0.3)", borderRadius:20, padding:"8px 20px", color:"#F5C842", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                ↻ Try Again
              </button>
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:20 }}>
                {[
                  ["👥","Users",analyticsData.totalUsers,"#6B8AFF"],
                  ["🎬","Videos",analyticsData.totalVideos,"#F5C842"],
                  ["💬","Comments",analyticsData.totalComments,"#FF6B6B"],
                  ["👁","Views",analyticsData.totalViews,"#6BFFB8"],
                  ["❤️","Likes",analyticsData.totalLikes,"#FF9500"],
                  ["🔞","Mature",analyticsData.matureCount,"#FF6B6B"],
                ].map(([icon,label,val,color]) => (
                  <div key={label} style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:"12px 10px", textAlign:"center", border:`1px solid ${color}22` }}>
                    <div style={{ fontSize:18, marginBottom:3 }}>{icon}</div>
                    <div style={{ color, fontWeight:900, fontSize:18, lineHeight:1 }}>{val.toLocaleString()}</div>
                    <div style={{ color:"#555", fontSize:10, marginTop:3 }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Registrations Summary */}
              <div style={{ background:"rgba(107,138,255,0.07)", borderRadius:16, padding:"14px 16px", marginBottom:14, border:"1px solid rgba(107,138,255,0.2)" }}>
                <div style={{ color:"#6B8AFF", fontWeight:900, fontSize:15, marginBottom:12 }}>👥 User Registrations</div>
                <div style={{ display:"flex", gap:10, marginBottom:14 }}>
                  {[
                    ["Today",analyticsData.newToday,"#6BFFB8"],
                    ["This Week",analyticsData.newThisWeek,"#F5C842"],
                    ["All Time",analyticsData.totalUsers,"#6B8AFF"],
                  ].map(([label,val,color]) => (
                    <div key={label} style={{ flex:1, background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"10px 6px", textAlign:"center" }}>
                      <div style={{ color, fontWeight:900, fontSize:22, lineHeight:1 }}>{val}</div>
                      <div style={{ color:"#555", fontSize:10, marginTop:4 }}>{label}</div>
                    </div>
                  ))}
                </div>
                {/* Recent registrants list */}
                <div style={{ color:"#888", fontWeight:700, fontSize:11, marginBottom:8, letterSpacing:0.5, textTransform:"uppercase" }}>Recent Sign-ups</div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {(analyticsData.recentUsers||[]).map((u,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.03)", borderRadius:10, padding:"8px 10px" }}>
                      <img src={u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username||u.email||"?")}&background=random&color=fff&size=64&bold=true&format=png`}
                        style={{ width:28, height:28, borderRadius:"50%", flexShrink:0, objectFit:"cover" }} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ color:"#fff", fontSize:13, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {u.display_name || u.username || "—"}
                        </div>
                        <div style={{ color:"#555", fontSize:11, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{u.email || "@" + (u.username||"")}</div>
                      </div>
                      <div style={{ color:"#444", fontSize:10, flexShrink:0 }}>
                        {u.created_date ? new Date(u.created_date).toLocaleDateString("en-US",{month:"short",day:"numeric"}) : ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Videos — bar chart */}
              <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:16, padding:"14px 16px", marginBottom:14, border:"1px solid rgba(245,200,66,0.1)" }}>
                <div style={{ color:"#F5C842", fontWeight:800, fontSize:14, marginBottom:12 }}>📈 Daily Videos (14 days)</div>
                <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:60 }}>
                  {(analyticsData.dailyVideos||[]).map(({date,count},i) => {
                    const maxV = Math.max(...(analyticsData.dailyVideos||[]).map(d=>d.count), 1);
                    const h = Math.max((count/maxV)*56, count>0?4:1);
                    return (
                      <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                        <div style={{ fontSize:9, color:"#555" }}>{count>0?count:""}</div>
                        <div style={{ width:"100%", height:h, borderRadius:3, background: count>0 ? "linear-gradient(180deg,#F5C842,#FF9500)" : "rgba(255,255,255,0.06)", transition:"height 0.3s" }} />
                        <div style={{ fontSize:8, color:"#444", writingMode:"vertical-rl", transform:"rotate(180deg)", height:22, overflow:"hidden" }}>
                          {date.slice(5)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Daily Users — bar chart */}
              <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:16, padding:"14px 16px", marginBottom:14, border:"1px solid rgba(107,138,255,0.15)" }}>
                <div style={{ color:"#6B8AFF", fontWeight:800, fontSize:14, marginBottom:12 }}>👥 Daily New Users (14 days)</div>
                <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:60 }}>
                  {(analyticsData.dailyUsers||[]).map(({date,count},i) => {
                    const maxV = Math.max(...(analyticsData.dailyUsers||[]).map(d=>d.count), 1);
                    const h = Math.max((count/maxV)*56, count>0?4:1);
                    return (
                      <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                        <div style={{ fontSize:9, color:"#555" }}>{count>0?count:""}</div>
                        <div style={{ width:"100%", height:h, borderRadius:3, background: count>0 ? "linear-gradient(180deg,#6B8AFF,#4A67FF)" : "rgba(255,255,255,0.06)", transition:"height 0.3s" }} />
                        <div style={{ fontSize:8, color:"#444", writingMode:"vertical-rl", transform:"rotate(180deg)", height:22, overflow:"hidden" }}>
                          {date.slice(5)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Creators */}
              <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:16, padding:"14px 16px", marginBottom:14, border:"1px solid rgba(107,255,184,0.1)" }}>
                <div style={{ color:"#6BFFB8", fontWeight:800, fontSize:14, marginBottom:10 }}>🏆 Top Creators</div>
                {(analyticsData.topCreators||[]).map(({username,count},i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                    <div style={{ color:"#F5C842", fontWeight:900, fontSize:13, width:18 }}>#{i+1}</div>
                    <div style={{ flex:1, color:"#fff", fontSize:13 }}>@{username}</div>
                    <div style={{ background:"rgba(245,200,66,0.15)", color:"#F5C842", fontWeight:800, fontSize:12, padding:"3px 10px", borderRadius:20 }}>{count} videos</div>
                  </div>
                ))}
              </div>

              {/* Top Videos */}
              <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:16, padding:"14px 16px", border:"1px solid rgba(255,107,107,0.1)" }}>
                <div style={{ color:"#FF6B6B", fontWeight:800, fontSize:14, marginBottom:10 }}>🔥 Top Videos by Views</div>
                {(analyticsData.topVideos||[]).map((v,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                    <div style={{ color:"#F5C842", fontWeight:900, fontSize:13, width:18 }}>#{i+1}</div>
                    <div style={{ width:36, height:44, borderRadius:8, overflow:"hidden", flexShrink:0, background:"#1a1a2e" }}>
                      {v.thumbnail_url ? <img src={resolveMediaUrl(v.thumbnail_url)} style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <div style={{ color:"#333", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", height:"100%" }}>🎬</div>}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ color:"#fff", fontSize:12, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{v.caption||"(no caption)"}</div>
                      <div style={{ color:"#555", fontSize:11 }}>@{v.username} · 👁 {(v.views_count||0).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── VIDEOS TAB ── */}
      {/* ── AI FLAGGED TAB ── */}
      {/* ── USERS TAB ── */}
      {modTab === "users" && (
        <div style={{ padding:"16px 16px 20px" }}>
          {usersLoading ? (
            <div style={{ textAlign:"center", color:"#555", padding:60, fontSize:14 }}>Loading users…</div>
          ) : (
            (() => {
              const todayStr = new Date().toISOString().slice(0,10);
              const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate()-7);
              const newToday = registeredUsers.filter(u => (u.created_date||"").slice(0,10) === todayStr).length;
              const newThisWeek = registeredUsers.filter(u => new Date(u.created_date) >= weekAgo).length;
              return (
                <>
                  {/* Summary cards */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:20 }}>
                    {[
                      ["👥","Total",registeredUsers.length,"#6B8AFF"],
                      ["🌅","Today",newToday,"#6BFFB8"],
                      ["📅","This Week",newThisWeek,"#F5C842"],
                    ].map(([icon,label,val,color]) => (
                      <div key={label} style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:"14px 10px", textAlign:"center", border:`1px solid ${color}33` }}>
                        <div style={{ fontSize:20, marginBottom:4 }}>{icon}</div>
                        <div style={{ color, fontWeight:900, fontSize:26, lineHeight:1 }}>{val}</div>
                        <div style={{ color:"#555", fontSize:11, marginTop:4 }}>{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Country breakdown */}
                  {(() => {
                    const countries = {};
                    registeredUsers.forEach(u => {
                      const loc = u.location || "Unknown";
                      countries[loc] = (countries[loc] || 0) + 1;
                    });
                    const sorted = Object.entries(countries).sort((a,b) => b[1]-a[1]);
                    return sorted.length > 0 ? (
                      <div style={{ background:"rgba(245,200,66,0.06)", borderRadius:16, border:"1px solid rgba(245,200,66,0.15)", padding:"12px 16px", marginBottom:12 }}>
                        <div style={{ color:"#F5C842", fontWeight:800, fontSize:13, marginBottom:8 }}>🌍 Users by Location</div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                          {sorted.map(([loc, count]) => (
                            <div key={loc} style={{ background:"rgba(245,200,66,0.12)", borderRadius:20, padding:"4px 12px", fontSize:12, color:"#F5C842", fontWeight:600 }}>
                              {loc === "Unknown" ? "🌍" : loc.toLowerCase().includes("australia") ? "🇦🇺" : loc.toLowerCase().includes("sri lanka") ? "🇱🇰" : loc.toLowerCase().includes("united states") || loc.toLowerCase().includes("usa") ? "🇺🇸" : "🌍"} {loc} · {count}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })()}

                  {/* User list */}
                  <div style={{ background:"rgba(107,138,255,0.06)", borderRadius:16, border:"1px solid rgba(107,138,255,0.15)", overflow:"hidden" }}>
                    <div style={{ padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ color:"#6B8AFF", fontWeight:800, fontSize:14 }}>All Registered Users</div>
                      <div style={{ color:"#444", fontSize:12 }}>{registeredUsers.length} total</div>
                    </div>
                    <div style={{ maxHeight:500, overflowY:"auto" }}>
                      {registeredUsers.map((u, i) => {
                        const locationFlag = (loc) => {
                          if (!loc) return "🌍 Unknown";
                          const l = loc.toLowerCase();
                          if (l.includes("australia") || l.includes("au")) return "🇦🇺 " + loc;
                          if (l.includes("sri lanka") || l.includes("lk")) return "🇱🇰 " + loc;
                          if (l.includes("united states") || l.includes("usa") || l.includes("us")) return "🇺🇸 " + loc;
                          if (l.includes("new zealand") || l.includes("nz")) return "🇳🇿 " + loc;
                          if (l.includes("india")) return "🇮🇳 " + loc;
                          if (l.includes("canada")) return "🇨🇦 " + loc;
                          if (l.includes("uk") || l.includes("united kingdom")) return "🇬🇧 " + loc;
                          return "🌍 " + loc;
                        };
                        return (
                        <div key={u.id||i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.04)", background: i%2===0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                          <img
                            src={u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username||u.email||"?")}&background=random&color=fff&size=64&bold=true&format=png`}
                            style={{ width:40, height:40, borderRadius:"50%", flexShrink:0, objectFit:"cover", border:"2px solid rgba(107,138,255,0.3)" }}
                          />
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ color:"#fff", fontWeight:700, fontSize:14, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                              {u.display_name || u.username || "—"}
                            </div>
                            <div style={{ color:"#aaa", fontSize:11, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginTop:1 }}>
                              @{u.username || "?"} · {u.email || "no email"}
                            </div>
                            <div style={{ color:"#F5C842", fontSize:11, fontWeight:600, marginTop:2 }}>
                              {locationFlag(u.location)}
                            </div>
                          </div>
                          <div style={{ flexShrink:0, textAlign:"right" }}>
                            <div style={{ color:"#888", fontSize:11 }}>
                              {u.created_date ? new Date(u.created_date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : ""}
                            </div>
                            <div style={{ color:"#777", fontSize:10, marginTop:1 }}>
                              {u.created_date ? new Date(u.created_date).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}) : ""}
                            </div>
                            <div style={{ color: u.status==="active" ? "#6BFFB8" : "#FF6B6B", fontSize:10, fontWeight:700, marginTop:2 }}>
                              {u.status || "active"}
                            </div>
                          </div>
                        </div>
                        );
                      })}
                      {registeredUsers.length === 0 && (
                        <div style={{ textAlign:"center", color:"#444", padding:40, fontSize:13 }}>No users yet.</div>
                      )}
                    </div>
                  </div>
                </>
              );
            })()
          )}
        </div>
      )}

      {modTab === "ai" && (
        <div style={{ padding:"16px" }}>
          <div style={{ display:"flex", gap:12, marginBottom:16 }}>
            {[
              ["⏳ Pending Review", allVideos.filter(v=>v.is_ai_detected && !v.is_approved).length, "#FF9500"],
              ["🤖 Live AI Posts", allVideos.filter(v=>v.is_ai_detected && v.is_approved).length, "#ffcc44"],
              ["✅ Clean Posts", allVideos.filter(v=>!v.is_ai_detected && v.is_approved).length, "#6BFFB8"],
            ].map(([label,count,color]) => (
              <div key={label} style={{ flex:1, background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"10px 0", textAlign:"center", border:`1px solid ${color}22` }}>
                <div style={{ color, fontWeight:900, fontSize:20 }}>{count}</div>
                <div style={{ color:"#555", fontSize:11 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* PENDING AI REVIEW SECTION */}
          {allVideos.filter(v => v.is_ai_detected && !v.is_approved).length > 0 && (
            <div style={{ marginBottom:20 }}>
              <div style={{ color:"#FF9500", fontWeight:800, fontSize:13, marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
                ⏳ Pending Your Review
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {allVideos.filter(v => v.is_ai_detected && !v.is_approved).map(video => (
                  <div key={video.id} style={{ background:"rgba(255,149,0,0.08)", borderRadius:16, border:"2px solid rgba(255,149,0,0.5)", overflow:"hidden" }}>
                    <div style={{ display:"flex", gap:12, padding:"12px 14px" }}>
                      <div style={{ width:64, height:80, borderRadius:10, overflow:"hidden", flexShrink:0, background:"#1a1a2e" }}>
                        {video.thumbnail_url
                          ? <img src={video.thumbnail_url} loading="lazy" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                          : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", color:"#444", fontSize:24 }}>🎬</div>}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                          <span style={{ fontSize:11, background:"rgba(255,149,0,0.3)", color:"#FF9500", padding:"2px 8px", borderRadius:20, fontWeight:700 }}>⏳ Awaiting MOD</span>
                        </div>
                        <div style={{ color:"#aaa", fontSize:11, marginBottom:3 }}>@{video.username || "unknown"}</div>
                        <div style={{ color:"#fff", fontSize:13, fontWeight:600, marginBottom:6, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {video.caption || "(no caption)"}
                        </div>
                        <div style={{ fontSize:11, color:"#FF9500" }}>Creator self-disclosed as AI</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:0, borderTop:"1px solid rgba(255,255,255,0.05)" }}>
                      <button onClick={async () => { setSaving(video.id); await request("PUT", `/apps/${APP_ID}/entities/SachiVideo/${video.id}`, { is_approved: true }); setAllVideos(p => p.map(v => v.id===video.id ? {...v, is_approved:true} : v)); setSaving(null); }}
                        disabled={saving===video.id}
                        style={{ flex:1, padding:"10px 0", border:"none", cursor:"pointer", fontSize:13, fontWeight:700,
                          borderRight:"1px solid rgba(255,255,255,0.05)",
                          background:"rgba(107,255,154,0.1)", color:"#6bff9a" }}>
                        {saving===video.id ? "Saving…" : "✅ Approve & Post with AI Badge"}
                      </button>
                      <button onClick={() => deleteVideo(video)} disabled={saving===video.id}
                        style={{ width:56, padding:"10px 0", border:"none", cursor:"pointer", fontSize:16,
                          background:"rgba(255,0,0,0.08)", color:"#ff4444" }}>
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LIVE AI POSTS SECTION */}
          <div style={{ color:"#ffcc44", fontWeight:800, fontSize:13, marginBottom:10 }}>🤖 Live AI-Badged Posts</div>
          {allVideos.filter(v => v.is_ai_detected && v.is_approved).length === 0 ? (
            <div style={{ textAlign:"center", color:"#555", padding:24 }}>
              <div style={{ fontSize:12, color:"#444" }}>No approved AI posts yet.</div>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {allVideos.filter(v => v.is_ai_detected && v.is_approved).map(video => (
                <div key={video.id} style={{ background:"rgba(255,149,0,0.06)", borderRadius:16, border:"1px solid rgba(255,149,0,0.3)", overflow:"hidden" }}>
                  <div style={{ display:"flex", gap:12, padding:"12px 14px" }}>
                    <div style={{ width:64, height:80, borderRadius:10, overflow:"hidden", flexShrink:0, background:"#1a1a2e" }}>
                      {video.thumbnail_url
                        ? <img src={video.thumbnail_url} loading="lazy" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", color:"#444", fontSize:24 }}>🎬</div>}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                        <span style={{ fontSize:11, background:"rgba(255,149,0,0.2)", color:"#FF9500", padding:"2px 8px", borderRadius:20, fontWeight:700 }}>🤖 AI Detected</span>
                      </div>
                      <div style={{ color:"#aaa", fontSize:11, marginBottom:3 }}>@{video.username || "unknown"}</div>
                      <div style={{ color:"#fff", fontSize:13, fontWeight:600, marginBottom:6, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {video.caption || "(no caption)"}
                      </div>
                      <div style={{ display:"flex", gap:8 }}>
                        <span style={{ fontSize:11, color:"#555" }}>👁 {video.views_count||0}</span>
                        <span style={{ fontSize:11, color:"#555" }}>❤️ {video.likes_count||0}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:0, borderTop:"1px solid rgba(255,255,255,0.05)" }}>
                    <button onClick={() => flagAI(video)} disabled={saving===video.id}
                      style={{ flex:1, padding:"10px 0", border:"none", cursor:"pointer", fontSize:13, fontWeight:700,
                        borderRight:"1px solid rgba(255,255,255,0.05)",
                        background:"rgba(107,255,154,0.08)", color:"#6bff9a" }}>
                      {saving===video.id ? "Saving…" : "✅ Clear AI Flag"}
                    </button>
                    <button onClick={() => deleteVideo(video)} disabled={saving===video.id}
                      style={{ width:56, padding:"10px 0", border:"none", cursor:"pointer", fontSize:16,
                        background:"rgba(255,0,0,0.06)", color:"#ff4444" }}>
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── CREATORS TAB ── */}
      {modTab === "creators" && (
        <div style={{ padding:"16px" }}>
          <div style={{ color:"#F5C842", fontWeight:800, fontSize:15, marginBottom:16 }}>🌟 Top Creators</div>
          {loading ? (
            <div style={{ textAlign:"center", color:"#555", padding:40 }}>Loading…</div>
          ) : (() => {
            const creatorMap = {};
            allVideos.forEach(v => {
              const key = v.user_id || v.username || "unknown";
              if (!creatorMap[key]) creatorMap[key] = { username: v.username || "unknown", display_name: v.display_name || v.username || "—", avatar_url: v.avatar_url || "", videos: 0, views: 0, likes: 0 };
              creatorMap[key].videos++;
              creatorMap[key].views += v.views_count || 0;
              creatorMap[key].likes += v.likes_count || 0;
            });
            const creators = Object.values(creatorMap).sort((a,b) => b.videos - a.videos);
            if (!creators.length) return <div style={{ textAlign:"center", color:"#555", padding:40 }}>No creators yet.</div>;
            return (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {creators.map((c, i) => (
                  <div key={c.username} style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:"12px 14px", border:"1px solid rgba(245,200,66,0.08)", display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ color:"#F5C842", fontWeight:900, fontSize:14, width:22, flexShrink:0 }}>#{i+1}</div>
                    <img src={c.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.display_name)}&background=random&color=fff&size=64&bold=true&format=png`}
                      style={{ width:40, height:40, borderRadius:"50%", objectFit:"cover", flexShrink:0 }} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ color:"#fff", fontWeight:700, fontSize:14, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.display_name}</div>
                      <div style={{ color:"#555", fontSize:11 }}>@{c.username}</div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:2, flexShrink:0 }}>
                      <div style={{ color:"#F5C842", fontWeight:800, fontSize:13 }}>{c.videos} 🎬</div>
                      <div style={{ color:"#555", fontSize:11 }}>👁 {c.views.toLocaleString()}</div>
                      <div style={{ color:"#555", fontSize:11 }}>❤️ {c.likes.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {modTab === "videos" && (<>
      {/* Stats bar */}
      <div style={{ display:"flex", gap:12, padding:"12px 20px" }}>
        {[
          ["Total",allVideos.length,"#F5C842"],
          ["Mature",allVideos.filter(v=>v.is_mature).length,"#ff6b6b"],
          ["Clean",allVideos.filter(v=>!v.is_mature).length,"#6bff9a"],
        ].map(([label,count,color]) => (
          <div key={label} style={{ flex:1, background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"10px 0", textAlign:"center", border:`1px solid ${color}22` }}>
            <div style={{ color, fontWeight:900, fontSize:20 }}>{count}</div>
            <div style={{ color:"#555", fontSize:11 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Video list */}
      {loading ? (
        <div style={{ textAlign:"center", color:"#555", padding:40 }}>Loading videos…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:"center", color:"#555", padding:40 }}>No videos match this filter.</div>
      ) : (
        <div style={{ padding:"0 16px", display:"flex", flexDirection:"column", gap:12 }}>
          {filtered.map(video => (
            <div key={video.id} style={{ background:"rgba(255,255,255,0.04)", borderRadius:16, border:`1px solid ${video.is_mature ? "rgba(255,107,107,0.3)" : "rgba(255,255,255,0.07)"}`, overflow:"hidden" }}>
              <div style={{ display:"flex", gap:12, padding:"12px 14px" }}>
                {/* Thumbnail */}
                <div style={{ width:64, height:80, borderRadius:10, overflow:"hidden", flexShrink:0, background:"#1a1a2e" }}>
                  {video.thumbnail_url ? (
                    <img src={video.thumbnail_url} loading="lazy" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  ) : (
                    <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", color:"#444", fontSize:24 }}>🎬</div>
                  )}
                </div>
                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ color:"#aaa", fontSize:11, marginBottom:3 }}>@{video.username || "unknown"}</div>
                  <div style={{ color:"#fff", fontSize:13, fontWeight:600, marginBottom:6, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {video.caption || "(no caption)"}
                  </div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:6 }}>
                    <span style={{ fontSize:11, color:"#555" }}>👁 {video.views_count||0}</span>
                    <span style={{ fontSize:11, color:"#555" }}>❤️ {video.likes_count||0}</span>
                    {video.is_mature && (
                      <span style={{ fontSize:11, background:"rgba(255,107,107,0.2)", color:"#ff6b6b", padding:"2px 8px", borderRadius:20, fontWeight:700 }}>
                        🔞 {(video.mature_reason||"mature").replace(/_/g," ")}
                      </span>
                    )}
                  </div>
                  {/* Mature reason selector (only when mature) */}
                  {video.is_mature && (
                    <select value={video.mature_reason||"other"}
                      onChange={e => toggleMature({...video, is_mature: true}, e.target.value)}
                      style={{ width:"100%", padding:"6px 10px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,107,107,0.3)", borderRadius:8, color:"#fff", fontSize:12, outline:"none", marginBottom:4 }}>
                      {reasons.map(r => <option key={r} value={r}>{r.replace(/_/g," ")}</option>)}
                    </select>
                  )}
                </div>
              </div>
              {/* Action buttons */}
              <div style={{ display:"flex", gap:0, borderTop:"1px solid rgba(255,255,255,0.05)" }}>
                <button onClick={() => toggleMature(video)}
                  disabled={saving===video.id}
                  style={{ flex:1, padding:"10px 0", border:"none", cursor:"pointer", fontSize:13, fontWeight:700, borderRight:"1px solid rgba(255,255,255,0.05)",
                    background: video.is_mature ? "rgba(107,255,154,0.08)" : "rgba(255,107,107,0.08)",
                    color: video.is_mature ? "#6bff9a" : "#ff6b6b" }}>
                  {saving===video.id ? "Saving…" : video.is_mature ? "✅ Clear Mature Flag" : "🔞 Mark as Mature"}
                </button>
                <button onClick={() => deleteVideo(video)}
                  disabled={saving===video.id}
                  style={{ width:56, padding:"10px 0", border:"none", cursor:"pointer", fontSize:16,
                    background:"rgba(255,0,0,0.06)", color:"#ff4444" }}>
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </>)}
    </div>
  );
}

function App() {
  // Simple client-side routing for terms/privacy pages
  const path = window.location.pathname;
  if (path === "/terms") return <Terms />;
  if (path === "/privacy") return <Privacy />;
  if (path === "/child-safety") return <ChildSafety />;
  if (path === "/founding-creator" || path === "/apply") return <FoundingCreatorPage onBack={() => window.location.href="/"} />;

  const [hasEntered, setHasEntered] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => auth.getUser());

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

  const isAdmin = currentUser?.email === "jaygnz27@gmail.com" || currentUser?.email === "lasanjaya@gmail.com";
  const [videoList, setVideoList] = useState([]);
  const feedContainerRef = useRef(null);
  const feedSentinelRef = useRef(null);
  const loadingMoreRef = useRef(false);
  const [feedKey, setFeedKey] = React.useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("feed");
  const [showAdmin, setShowAdmin] = useState(false);
  const [showGoLive, setShowGoLive] = useState(false);
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
    follows.getFollowing(currentUser.id).then(res => {
      setFollowedUserIds(new Set((res.items || res || []).map(r => r.following_id)));
    }).catch(() => {});
  }, [currentUser]);

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
  const [feedHasMore, setFeedHasMore] = useState(true);
  const FEED_PAGE_SIZE = 30;
  const [commentVideo, setCommentVideo] = useState(null);
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
  const [editProfileBio, setEditProfileBio] = useState('');
  const [editProfileSaving, setEditProfileSaving] = useState(false);
  const [userBio, setUserBio] = useState(currentUser?.bio || '');




  useEffect(() => { loadVideos(); }, []);


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
          const usersData = await request("GET", `/apps/${APP_ID}/entities/AthaVidUser/?email=${encodeURIComponent(currentUser.email)}`);
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
      const res = await follows.getFollowing(user.id);
      const items = res.items || res || [];
      const ids = items.map(r => r.following_id);
      setFollowingIds(ids);
      if (ids.length === 0) { setFollowingVideos([]); return; }
      const allVids = await request("GET", `/apps/${APP_ID}/entities/SachiVideo?limit=50&sort=-created_date`);
      const vids = ((allVids?.items || allVids) || []).filter(v => ids.includes(v.user_id));
      setFollowingVideos(vids);
    } catch(e) { console.error(e); }
  };

  const loadVideos = async (user, append = false, page = 1) => {
    if (!append) setLoading(true);
    try {
      const data = await request("GET", `/apps/${APP_ID}/entities/SachiVideo?limit=50&sort=-created_date`);
      const rawAll = Array.isArray(data) ? data : (data?.items || data?.records || []);
      const raw = rawAll.filter(v => !v.is_archived && (v.post_visibility == null || v.post_visibility !== "only_me"));
      setFeedHasMore(false);
      if (!raw.length && !append) { setVideoList([]); setLoading(false); return; }
      const sorted = [...raw].sort((a,b) => new Date(b.created_date||0) - new Date(a.created_date||0));
      setVideoList(sorted);
      requestAnimationFrame(() => {
        const el = feedContainerRef.current;
        if (el) el.scrollTo({ top: 0, behavior: 'instant' });
      });
    } catch(err) {
      console.error('loadVideos error:', err);
      if (!append) setVideoList([]);
    } finally {
      setLoading(false);
    }
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
    setActiveTab("feed");
    setFeedPage(1);
    setFeedKey(k => k + 1);   // remounts feed container → guaranteed scroll reset
    loadVideos(currentUser, false, 1);
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
          const r1 = await request("GET", `/apps/${APP_ID}/entities/Follow?following_id=${currentUser.id}&limit=500`).catch(()=>null);
          const r2 = await request("GET", `/apps/${APP_ID}/entities/Follow?following_username=${encodeURIComponent(myUsername)}&limit=500`).catch(()=>null);
          const all = [...(r1?.items||r1||[]), ...(r2?.items||r2||[])];
          const unique = [...new Map(all.map(f => [f.id, f])).values()];
          setMeFollowersCount(unique.length);
        } catch(e) {}
      })();
      (async () => {
        try {
          const r1 = await request("GET", `/apps/${APP_ID}/entities/Follow?follower_id=${currentUser.id}&limit=500`).catch(()=>null);
          const r2 = await request("GET", `/apps/${APP_ID}/entities/Follow?follower_username=${encodeURIComponent(myUsername)}&limit=500`).catch(()=>null);
          const all = [...(r1?.items||r1||[]), ...(r2?.items||r2||[])];
          const unique = [...new Map(all.map(f => [f.id, f])).values()];
          setMeFollowingCount(unique.length);
        } catch(e) {}
      })();
    }
  }, [activeTab, currentUser]);

  const handleLike = React.useCallback((videoId, delta) => {
    // Save scroll position before state update to prevent snap-to-top
    const feedEl = feedContainerRef.current;
    const savedScroll = feedEl ? feedEl.scrollTop : 0;
    // Single setVideoList call — update count AND fire side effects in one pass
    setVideoList(vs => {
      const updated = vs.map(v => {
        if (v.id !== videoId) return v;
        const newCount = Math.max(0, (v.likes_count || 0) + delta);
        // Side effects (DB + interests) inside the updater so we read fresh state
        videos.update(videoId, { likes_count: newCount }).catch(() => {});
        if (currentUser && v.hashtags?.length) {
          interests.signal(currentUser.id, v.hashtags, delta > 0 ? 3 : -1).catch(() => {});
        }
        return { ...v, likes_count: newCount };
      });
      return updated;
    });
    // Restore scroll position after React re-render
    if (feedEl) {
      requestAnimationFrame(() => { feedEl.scrollTop = savedScroll; });
    }
  }, [currentUser, feedContainerRef]);

  // Auto-load more when sentinel scrolls into view
  useEffect(() => {
    const sentinel = feedSentinelRef.current;
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && feedHasMore && !loading && !loadingMoreRef.current) {
          loadingMoreRef.current = true;
          const nextPage = feedPage + 1;
          setFeedPage(nextPage);
          loadVideos(currentUser, true, nextPage).finally(() => {
            loadingMoreRef.current = false;
          });
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [feedHasMore, loading, feedPage, currentUser]);

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

  const handleCommentCount = (videoId, count) => {
    setVideoList(vs => vs.map(v => v.id === videoId ? { ...v, comments_count: count } : v));
  };

  const requireAuth = (cb) => { if (currentUser) { cb(); } else { setShowAuth(true); setAuthToast(true); setTimeout(() => setAuthToast(false), 3000); } };

  const username = currentUser?.full_name || currentUser?.email?.split("@")[0] || "";

  if (!hasEntered) {
    return <Landing onEnter={() => setHasEntered(true)} />;
  }

  return (
    <div style={{ background:"#0B0C1A", minHeight:"100svh", maxWidth:480, margin:"0 auto", position:"relative", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
      <ToastContainer />

      {/* Header — Sachi original */}
      <div style={{ position:"fixed", top:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, zIndex:300, paddingTop:"env(safe-area-inset-top,0px)", background:"linear-gradient(to bottom, rgba(11,12,26,0.92) 0%, transparent 100%)", backdropFilter:"blur(8px)", pointerEvents:"none" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 16px 6px", pointerEvents:"auto" }}>

          {/* Left: Sachi logo + wordmark */}
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <img src="/sachi-icon-v4.png" alt="Sachi" style={{ width:30, height:30, borderRadius:8, filter:"drop-shadow(0 0 6px rgba(245,200,66,0.5))" }} />
            <div style={{ display:"flex", alignItems:"baseline", gap:1 }}>
              <span style={{ fontSize:24, fontWeight:900, letterSpacing:-0.5, background:"linear-gradient(135deg,#F5C842,#FF9500)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Sachi</span>
              <span style={{ fontSize:12, fontWeight:700, color:"#F5C842", lineHeight:1, marginBottom:2 }}>™</span>
            </div>
          </div>

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
            <button onClick={() => requireAuth(() => setShowGoLive(true))}
              style={{ background:"rgba(245,200,66,0.12)", border:"1px solid rgba(245,200,66,0.3)", borderRadius:20, padding:"4px 10px", color:"#F5C842", fontSize:11, fontWeight:700, cursor:"pointer", letterSpacing:0.3, WebkitTapHighlightColor:"transparent", display:"flex", alignItems:"center", gap:4 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#F5C842", display:"inline-block", animation:"heartbeat 1.4s ease-in-out infinite" }} />
              Live
            </button>
          </div>

        </div>
      </div>

      {/* Feed */}
      {activeTab === "feed" && (
        <div key={feedKey} ref={el => { feedContainerRef.current = el; }} style={{ height:"100svh", overflowY:"scroll", scrollSnapType:"y mandatory", isolation:"isolate", touchAction:"pan-y" }}>
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
            <div style={{ height:"100svh", display:"flex", flexDirection:"column", background:"#0B0C1A", overflow:"hidden" }}>
              <style>{`
                @keyframes sachiShimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
                @keyframes sachiPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
                .sachi-skeleton { background:linear-gradient(90deg,#1a1a2e 25%,#252540 50%,#1a1a2e 75%); background-size:400px 100%; animation:sachiShimmer 1.4s infinite; border-radius:8px; }
              `}</style>
              {/* Branded logo pulse at top */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"16px 0 8px", gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:10, animation:"sachiPulse 1.5s ease-in-out infinite", background:"linear-gradient(135deg,#F5C842,#FF9500)" }} />
                <div style={{ color:"#F5C842", fontWeight:900, fontSize:22, letterSpacing:0.5, animation:"sachiPulse 1.5s ease-in-out infinite" }}>Sachi</div>
              </div>
              {/* Skeleton video card */}
              <div style={{ flex:1, position:"relative", margin:"0 0 4px", borderRadius:0, overflow:"hidden", background:"#111120" }}>
                <div className="sachi-skeleton" style={{ position:"absolute", inset:0 }} />
                {/* Skeleton avatar + name bottom left */}
                <div style={{ position:"absolute", bottom:80, left:16, display:"flex", flexDirection:"column", gap:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div className="sachi-skeleton" style={{ width:40, height:40, borderRadius:"50%" }} />
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      <div className="sachi-skeleton" style={{ width:100, height:12 }} />
                      <div className="sachi-skeleton" style={{ width:70, height:10 }} />
                    </div>
                  </div>
                  <div className="sachi-skeleton" style={{ width:200, height:10, marginTop:4 }} />
                  <div className="sachi-skeleton" style={{ width:150, height:10 }} />
                </div>
                {/* Skeleton action buttons right */}
                <div style={{ position:"absolute", bottom:80, right:16, display:"flex", flexDirection:"column", gap:20, alignItems:"center" }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                      <div className="sachi-skeleton" style={{ width:28, height:28, borderRadius:8 }} />
                      <div className="sachi-skeleton" style={{ width:16, height:8 }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {!loading && videoList.length === 0 && (
            <div style={{ height:"100svh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
              <div style={{ fontSize:64 }}>🎬</div>
              <div style={{ color:"#fff", fontWeight:800, fontSize:22 }}>No videos yet</div>
              <div style={{ color:"#888", fontSize:15 }}>Be the first to post!</div>
              <button onClick={() => requireAuth(() => setShowUpload(true))}
                style={{ marginTop:12, background:"linear-gradient(135deg,#F5C842,#FF9500)", border:"none", borderRadius:14, padding:"12px 28px", color:"#0B0C1A", fontWeight:800, fontSize:16, cursor:"pointer" }}>
                + Upload Video
              </button>
            </div>
          )}
          {(feedTab === "forYou" ? videoList : followingVideos)
            .filter(v => !blockedIds.has(v.user_id))
            .map((v, idx, arr) => {
              // Preload audio for next 2 videos in background
              if (v.sound_url) preloadAudio(v.sound_url);
              const next1 = arr[idx + 1]; if (next1?.sound_url) preloadAudio(next1.sound_url);
              const next2 = arr[idx + 2]; if (next2?.sound_url) preloadAudio(next2.sound_url);
              // Preload video for next card so it starts instantly on scroll
              if (next1?.video_url && !next1?.is_photo) {
                const preloadVid = next1._preloadEl || (next1._preloadEl = document.createElement('video'));
                preloadVid.src = resolveMediaUrl(next1.video_url);
                preloadVid.preload = 'auto';
                preloadVid.muted = true;
                preloadVid.playsInline = true;
              }
              return (
                <VideoCard key={v.id} video={v} currentUser={currentUser}
                  onCommentOpen={setCommentVideo}
                  onLike={handleLike}
                  onView={handleView}
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
            })}
          {feedTab === "forYou" && feedHasMore && (
            <div ref={feedSentinelRef} style={{ height:1, marginBottom:80 }} />
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
                  onClick={() => { setEditProfileName(currentUser?.full_name || ''); setEditProfileBio(currentUser?.bio || userBio || ''); setShowEditProfile(true); }}>
                  <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>{currentUser.full_name || username}</div>
                  <div style={{ fontSize:13, color:"#888" }}>✏️</div>
                </div>
                <div style={{ color:"#888", fontSize:13, marginTop:2 }}>@{username}</div>
                {(userBio || currentUser?.bio) && (
                  <div style={{ color:"#aaa", fontSize:14, marginTop:8, lineHeight:1.6, maxWidth:300, textAlign:"center" }}>
                    {userBio || currentUser?.bio}
                  </div>
                )}
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
                        const myUsername = currentUser.full_name || currentUser.email?.split("@")[0] || "";
                        const r1 = await request("GET", `/apps/${APP_ID}/entities/Follow?following_id=${currentUser.id}&limit=500`).catch(()=>null);
                        const r2 = await request("GET", `/apps/${APP_ID}/entities/Follow?following_username=${encodeURIComponent(myUsername)}&limit=500`).catch(()=>null);
                        const all = [...(r1?.items||r1||[]), ...(r2?.items||r2||[])];
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
                        const r1 = await request("GET", `/apps/${APP_ID}/entities/Follow?follower_id=${currentUser.id}&limit=500`).catch(()=>null);
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

      {/* Bottom Nav — Arc command console */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, zIndex:200, pointerEvents:"none" }}>
        <svg viewBox="0 0 480 70" preserveAspectRatio="none" style={{ width:"100%", height:70, display:"block", pointerEvents:"none" }}>
          <path d="M0 35 Q240 -8 480 35 L480 70 L0 70 Z" fill="rgba(10,10,25,0.97)"/>
          <path d="M0 35 Q240 -8 480 35" fill="none" stroke="rgba(245,200,66,0.2)" strokeWidth="1"/>
        </svg>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:70, paddingBottom:"env(safe-area-inset-bottom,8px)", pointerEvents:"auto", display:"flex", alignItems:"flex-end", justifyContent:"space-around", padding:"0 8px 10px" }}>

          {/* Home */}
          <button onClick={goHome}
            style={{ width:52, padding:"4px 8px 4px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, WebkitTapHighlightColor:"transparent", borderRadius:20 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={activeTab==="feed" ? "#F5C842" : "none"} stroke={activeTab==="feed" ? "#F5C842" : "#4A4A6A"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <div style={{ fontSize:9, color: activeTab==="feed" ? "#F5C842" : "#4A4A6A", fontWeight: activeTab==="feed" ? 700 : 400 }}>Home</div>
          </button>

          {/* Explore */}
          <button onClick={() => setActiveTab("explore")}
            style={{ width:52, padding:"4px 8px 4px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, WebkitTapHighlightColor:"transparent", borderRadius:20 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={activeTab==="explore" ? "#F5C842" : "#4A4A6A"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <div style={{ fontSize:9, color: activeTab==="explore" ? "#F5C842" : "#4A4A6A", fontWeight: activeTab==="explore" ? 700 : 400 }}>Explore</div>
          </button>

          {/* Post button — elevated center, gold glowing circle */}
          <button onClick={() => requireAuth(() => setShowUpload(true))}
            style={{ width:56, marginBottom:14, padding:"0", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, WebkitTapHighlightColor:"transparent" }}>
            <div style={{ width:48, height:48, borderRadius:"50%", background:"linear-gradient(135deg,#F5C842,#FF9500)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 20px rgba(245,200,66,0.5), 0 4px 12px rgba(0,0,0,0.4)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <div style={{ fontSize:9, color:"#F5C842", fontWeight:700 }}>Post</div>
          </button>

          {/* Podcasts */}
          <button onClick={() => setActiveTab("podcast")}
            style={{ width:52, padding:"4px 8px 4px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, WebkitTapHighlightColor:"transparent", borderRadius:20 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={activeTab==="podcast" ? "#F5C842" : "#4A4A6A"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
            <div style={{ fontSize:9, color: activeTab==="podcast" ? "#F5C842" : "#4A4A6A", fontWeight: activeTab==="podcast" ? 700 : 400 }}>Pods</div>
          </button>

          {/* Mod (owner only) */}
          {(currentUser?.email === "jaygnz27@gmail.com" || currentUser?.email === "lasanjaya@gmail.com") && (
            <button onClick={() => setActiveTab("admin")}
              style={{ width:52, padding:"4px 8px 4px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, WebkitTapHighlightColor:"transparent", borderRadius:20 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={activeTab==="admin" ? "#F5C842" : "#4A4A6A"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <div style={{ fontSize:9, color: activeTab==="admin" ? "#F5C842" : "#4A4A6A", fontWeight: activeTab==="admin" ? 700 : 400 }}>Mod</div>
            </button>
          )}

          {/* Profile */}
          <button onClick={() => setActiveTab("profile")}
            style={{ width:52, padding:"4px 8px 4px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, WebkitTapHighlightColor:"transparent", borderRadius:20 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={activeTab==="profile" ? "#F5C842" : "none"} stroke={activeTab==="profile" ? "#F5C842" : "#4A4A6A"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <div style={{ fontSize:9, color: activeTab==="profile" ? "#F5C842" : "#4A4A6A", fontWeight: activeTab==="profile" ? 700 : 400 }}>Me</div>
          </button>

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
      {showUpload && currentUser && <UploadModal currentUser={currentUser} onClose={() => setShowUpload(false)} onUploaded={() => { goHome(); setUploadToast(true); setTimeout(() => setUploadToast(false), 4000); }} />}
      {showGoLive && currentUser && <GoLiveModal currentUser={currentUser} onClose={() => setShowGoLive(false)} onUploaded={() => { goHome(); setUploadToast(true); setTimeout(() => setUploadToast(false), 4000); }} />}
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
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={(user) => { setCurrentUser(user); setShowAuth(false); setActiveTab("feed"); setFeedKey(k => k+1); setLoginToast(true); setTimeout(() => setLoginToast(false), 4000); }} />}
      {showEditProfile && (
        <div style={{ position:"fixed", inset:0, zIndex:9000, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
          onClick={() => setShowEditProfile(false)}>
          <div style={{ background:"#1a1a2e", borderRadius:20, padding:24, width:"100%", maxWidth:420 }}
            onClick={e => e.stopPropagation()}>
            <div style={{ color:"#fff", fontWeight:700, fontSize:17, marginBottom:16 }}>✏️ Edit Profile</div>
            
            <div style={{ color:"#888", fontSize:12, fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:0.8 }}>Display Name</div>
            <input
              value={editProfileName}
              onChange={e => setEditProfileName(e.target.value)}
              placeholder={currentUser?.full_name || username || "Your display name"}
              style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)",
                borderRadius:12, color:"#fff", padding:"12px 14px", fontSize:15, outline:"none",
                fontFamily:"inherit", boxSizing:"border-box", marginBottom:16 }}
            />

            <div style={{ color:"#888", fontSize:12, fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:0.8 }}>Bio</div>
            <textarea
              value={editProfileBio}
              onChange={e => setEditProfileBio(e.target.value.slice(0, 150))}
              placeholder="Tell people who you are — influencer, trainer, mom, dad, musician... 🌸"
              rows={3}
              style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)",
                borderRadius:12, color:"#fff", padding:"12px 14px", fontSize:14, outline:"none",
                fontFamily:"inherit", boxSizing:"border-box", resize:"none", lineHeight:1.5 }}
            />
            <div style={{ color:"#555", fontSize:11, textAlign:"right", marginBottom:16 }}>{editProfileBio.length}/150</div>

            <div style={{ display:"flex", gap:10, marginTop:4 }}>
              <button onClick={() => setShowEditProfile(false)}
                style={{ flex:1, padding:"12px 0", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:12, color:"#aaa", fontSize:14, cursor:"pointer" }}>
                Cancel
              </button>
              <button onClick={async () => {
                  if (!editProfileName.trim()) return;
                  setEditProfileSaving(true);
                  try {
                    const newName = editProfileName.trim();
                    const newBio = editProfileBio.trim();
                    const usersData = await request("GET", `/apps/${APP_ID}/entities/AthaVidUser?email=${encodeURIComponent(currentUser.email)}&limit=5`);
                    const users = Array.isArray(usersData) ? usersData : (usersData?.items || []);
                    const match = users.find(u => u.email === currentUser.email);
                    if (match) {
                      await request("PUT", `/apps/${APP_ID}/entities/AthaVidUser/${match.id}`, { ...match, display_name: newName, full_name: newName, bio: newBio });
                    }
                    setCurrentUser(u => ({ ...u, full_name: newName, display_name: newName, bio: newBio }));
                    setUserBio(newBio);
                    localStorage.setItem("sachi_user", JSON.stringify({ ...currentUser, full_name: newName, display_name: newName, bio: newBio }));
                    setShowEditProfile(false);
                    toast.success("Profile updated!");
                  } catch(e) { toast.error("Save failed: " + e.message); }
                  finally { setEditProfileSaving(false); }
                }}
                disabled={editProfileSaving}
                style={{ flex:2, padding:"12px 0", background:"linear-gradient(135deg,#e91e63,#9c27b0)",
                  border:"none", borderRadius:12, color:"#fff", fontSize:14, fontWeight:700,
                  cursor:editProfileSaving?"not-allowed":"pointer" }}>
                {editProfileSaving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showAvatarPicker && <AvatarPickerModal currentAvatar={avatarUrl} onSelect={async (url) => {
        // Immediately update UI
        setAvatarUrl(url);
        setCurrentUser(u => ({ ...u, avatar_url: url }));
        if (currentUser) {
          // Clear old cached values so DB takes priority on next load
          localStorage.removeItem(`avatar_${currentUser.id}`);
          localStorage.removeItem('avatar_last');
          if (!url.startsWith('data:')) {
            localStorage.setItem(`avatar_${currentUser.id}`, url);
            localStorage.setItem('avatar_last', url);
          }
        }
        setShowAvatarPicker(false);

        // Background sync to DB — only for CDN URLs (not base64, too large for DB)
        if (currentUser && !url.startsWith("data:")) {
          try {
            // Skip auth/me — Base44 doesn't allow PUT on auth endpoint
          } catch(e) { console.warn("Auth avatar update failed:", e); }
          try {
            // Match by email (works for Google users)
            const usersData = await request("GET", `/apps/${APP_ID}/entities/AthaVidUser?email=${encodeURIComponent(currentUser.email)}&limit=5`);
            const users = Array.isArray(usersData) ? usersData : (usersData?.items || usersData?.records || []);
            const match = users.find(u => u.email === currentUser.email || u.user_id === currentUser.id);
            if (match) await request("PUT", `/apps/${APP_ID}/entities/AthaVidUser/${match.id}`, { ...match, avatar_url: url });
          } catch(e) { console.warn("User entity update failed:", e); }
          try {
            // Fetch all user videos by user_id AND created_by to catch all posts
            const [vRes1, vRes2] = await Promise.all([
              request("GET", `/apps/${APP_ID}/entities/SachiVideo?user_id=${currentUser.id}&limit=500`).catch(()=>null),
              request("GET", `/apps/${APP_ID}/entities/SachiVideo?created_by=${encodeURIComponent(currentUser.email)}&limit=500`).catch(()=>null),
            ]);
            const all = [...(Array.isArray(vRes1)?vRes1:(vRes1?.items||[])), ...(Array.isArray(vRes2)?vRes2:(vRes2?.items||[]))];
            const seen = new Set();
            const vids = all.filter(v => { if(seen.has(v.id)) return false; seen.add(v.id); return true; });
            await Promise.all(vids.map(v => request("PUT", `/apps/${APP_ID}/entities/SachiVideo/${v.id}`, { ...v, avatar_url: url }).catch(()=>{})));
            // Update feed in real time
            setVideoList(vs => vs.map(v =>
              (v.user_id === currentUser.id || v.created_by === currentUser.id || v.created_by === currentUser.email)
                ? { ...v, avatar_url: url } : v
            ));
          } catch(e) { console.warn("Video avatar sync failed:", e); }
        }
      }} onClose={() => setShowAvatarPicker(false)} />}
    </div>
  );
}

export default App;
// v1775417720513

