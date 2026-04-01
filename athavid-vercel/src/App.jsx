import React, { useState, useEffect, useRef, useMemo } from "react";
import Landing from "./Landing";
import { auth, videos, comments, uploadFile, follows, request } from "./api.js";
import AuthModal from "./AuthModal.jsx";

function formatDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
}

function formatCount(n) {
  if (!n) return "0";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
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
        const reply = { id: Date.now().toString(), username, avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`, comment_text: text.trim(), thumbsUp:0, hearts:0, thumbsDown:0 };
        setList(prev => prev.map(x => x.id === replyingTo.id ? {...x, replies: [...(x.replies||[]), reply]} : x));
        setExpandedReplies(prev => ({...prev, [replyingTo.id]: true}));
        setReplyingTo(null);
        setText("");
      } else {
        const c = await comments.create({
          video_id: video.id, username,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          comment_text: text.trim(), likes_count: 0,
        });
        const newCount = list.length + 1;
        setList(prev => [...prev, c]);
        setText("");
        await videos.update(video.id, { comments_count: newCount });
        if (onCommentPosted) onCommentPosted(video.id, newCount);
        setTimeout(() => onClose(), 600);
      }
    } catch(e) { alert("Error: " + e.message); }
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
  // ── Pop ──────────────────────────────────────────────────────────────────
  { id:"pop1", genre:"Pop", title:"Summer Vibes",         artist:"Free Beats",      url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",  emoji:"🌊" },
  { id:"pop2", genre:"Pop", title:"Happy Days",           artist:"Feel Good Music", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",  emoji:"☀️" },
  { id:"pop3", genre:"Pop", title:"Good Energy",          artist:"Pop Studio",      url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",  emoji:"✨" },
  { id:"pop4", genre:"Pop", title:"Dance All Night",      artist:"Pop Studio",      url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3", emoji:"💃" },
  { id:"pop5", genre:"Pop", title:"Neon Lights",          artist:"Synth Pop",       url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", emoji:"🌈" },
  // ── Jazz ─────────────────────────────────────────────────────────────────
  { id:"jz1", genre:"Jazz", title:"Smooth Jazz Cafe",     artist:"Jazz Collective",  url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",  emoji:"🎷" },
  { id:"jz2", genre:"Jazz", title:"Late Night Jazz",      artist:"Blue Note Studio", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",  emoji:"🌙" },
  { id:"jz3", genre:"Jazz", title:"Uptown Swing",         artist:"Jazz Collective",  url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",  emoji:"🎺" },
  { id:"jz4", genre:"Jazz", title:"Bossa Nova Breeze",    artist:"Cafe Jazz",        url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", emoji:"🌴" },
  { id:"jz5", genre:"Jazz", title:"Midnight Sax",         artist:"Blue Note Studio", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3", emoji:"🎶" },
  // ── Classic Rock ─────────────────────────────────────────────────────────
  { id:"cr1", genre:"Classic Rock", title:"Guitar Highway",    artist:"Rock Legends",   url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",  emoji:"🎸" },
  { id:"cr2", genre:"Classic Rock", title:"Power Chord",       artist:"Rock Legends",   url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",  emoji:"🤘" },
  { id:"cr3", genre:"Classic Rock", title:"Road Trip Anthem",  artist:"Fuzz & Roll",    url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",  emoji:"🛣️" },
  { id:"cr4", genre:"Classic Rock", title:"Stadium Rock",      artist:"Fuzz & Roll",    url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", emoji:"🏟️" },
  { id:"cr5", genre:"Classic Rock", title:"Blues Driver",      artist:"Rock Legends",   url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3", emoji:"🔥" },
  // ── Contemporary ─────────────────────────────────────────────────────────
  { id:"co1", genre:"Contemporary", title:"Midnight Drive",    artist:"Lo-Fi Studio",   url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", emoji:"🚗" },
  { id:"co2", genre:"Contemporary", title:"Urban Groove",      artist:"Street Beats",   url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3", emoji:"🏙️" },
  { id:"co3", genre:"Contemporary", title:"Chill Wave",        artist:"Ambient Lab",    url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3", emoji:"🌊" },
  { id:"co4", genre:"Contemporary", title:"Deep Focus",        artist:"Study Sounds",   url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3", emoji:"🧠" },
  { id:"co5", genre:"Contemporary", title:"Indie Morning",     artist:"Indie Lab",      url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3", emoji:"☕" },
  // ── Lo-Fi / Chill ────────────────────────────────────────────────────────
  { id:"lo1", genre:"Lo-Fi", title:"Rainy Day Study",    artist:"Lo-Fi Beats",    url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-21.mp3", emoji:"🌧️" },
  { id:"lo2", genre:"Lo-Fi", title:"Coffee Shop Vibes",  artist:"Lo-Fi Cafe",     url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-22.mp3", emoji:"☕" },
  { id:"lo3", genre:"Lo-Fi", title:"Evening Chill",      artist:"Chill Lab",      url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-23.mp3", emoji:"🌅" },
  // ── Hip-Hop / R&B ────────────────────────────────────────────────────────
  { id:"hh1", genre:"Hip-Hop", title:"Energy Boost",      artist:"Epic Sounds",    url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-24.mp3", emoji:"⚡" },
  { id:"hh2", genre:"Hip-Hop", title:"Street Heat",       artist:"Street Beats",   url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-25.mp3", emoji:"🔥" },
  { id:"hh3", genre:"Hip-Hop", title:"Trap Sunrise",      artist:"Beat Factory",   url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-26.mp3", emoji:"🌄" },
  // ── Electronic ───────────────────────────────────────────────────────────
  { id:"el1", genre:"Electronic", title:"Neon Rush",      artist:"Synth Lab",      url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-27.mp3", emoji:"🤖" },
  { id:"el2", genre:"Electronic", title:"Bass Drop",      artist:"EDM Factory",    url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-28.mp3", emoji:"🎛️" },
  { id:"el3", genre:"Electronic", title:"Future Wave",    artist:"Synth Lab",      url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-29.mp3", emoji:"🚀" },
];

const MUSIC_GENRES = ["All", "Pop", "Jazz", "Classic Rock", "Contemporary", "Lo-Fi", "Hip-Hop", "Electronic"];


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
  const [cropMode, setCropMode] = useState("original"); // original | square | portrait
  const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const onMeta = () => {
    const dur = videoRef.current?.duration || 0;
    setDuration(dur);
    setTrimEnd(dur);
  };

  const onTimeUpdate = () => setCurrentTime(videoRef.current?.currentTime || 0);

  const seekTo = (t) => {
    if (videoRef.current) {
      videoRef.current.currentTime = t;
    }
  };

  const fmtTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const doTrim = async () => {
    // If no real trim or crop needed, just pass through original
    if (trimStart <= 0.5 && trimEnd >= duration - 0.5 && cropMode === "original") {
      onDone(file);
      return;
    }

    setTrimming(true);
    try {
      // Use MediaRecorder to trim the video in-browser
      const video = document.createElement("video");
      video.src = previewUrl;
      video.muted = true;
      await new Promise(r => { video.onloadedmetadata = r; video.load(); });

      const canvas = document.createElement("canvas");
      const vw = video.videoWidth;
      const vh = video.videoHeight;

      // Set canvas dimensions based on crop mode
      if (cropMode === "square") {
        const size = Math.min(vw, vh);
        canvas.width = size; canvas.height = size;
      } else if (cropMode === "portrait") {
        const targetH = Math.round(vw * (16/9));
        canvas.width = vw; canvas.height = Math.min(targetH, vh);
      } else {
        canvas.width = vw; canvas.height = vh;
      }

      const ctx = canvas.getContext("2d");
      const stream = canvas.captureStream(30);

      // Add audio
      let audioStream = null;
      try {
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaElementSource(video);
        const dest = audioCtx.createMediaStreamDestination();
        source.connect(dest);
        audioStream = dest.stream;
      } catch {}

      const combinedStream = audioStream
        ? new MediaStream([...stream.getTracks(), ...audioStream.getTracks()])
        : stream;

      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
        ? "video/webm;codecs=vp9,opus"
        : "video/webm";

      const recorder = new MediaRecorder(combinedStream, { mimeType, videoBitsPerSecond: 4000000 });
      const chunks = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

      let animFrame;
      const drawFrame = () => {
        if (video.paused || video.ended) return;
        const sx = cropMode === "square" ? (vw - Math.min(vw,vh)) / 2 : 0;
        const sy = cropMode === "square" ? (vh - Math.min(vw,vh)) / 2 : 0;
        const sw = cropMode === "square" ? Math.min(vw,vh) : vw;
        const sh = cropMode === "square" ? Math.min(vw,vh) : (cropMode === "portrait" ? canvas.height : vh);
        ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
        animFrame = requestAnimationFrame(drawFrame);
      };

      const blob = await new Promise((resolve) => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
        video.currentTime = trimStart;
        video.oncanplay = async () => {
          video.oncanplay = null;
          recorder.start(100);
          drawFrame();
          await video.play();
          const remaining = (trimEnd - trimStart) * 1000;
          setTimeout(() => {
            cancelAnimationFrame(animFrame);
            video.pause();
            recorder.stop();
          }, remaining);
        };
      });

      const ext = mimeType.includes("mp4") ? "mp4" : "webm";
      const trimmedFile = new File([blob], `trimmed_${Date.now()}.${ext}`, { type: mimeType });
      onDone(trimmedFile);
    } catch(err) {
      console.error("Trim failed", err);
      // Fallback — use original
      onDone(file);
    }
    setTrimming(false);
  };

  const cropLabel = { original: "Original", square: "1:1 Square", portrait: "9:16 Portrait" };
  const trimDuration = Math.max(0, trimEnd - trimStart);

  return (
    <div style={{ position:"fixed", inset:0, zIndex:3000, background:"#000", display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid #222" }}>
        <button onClick={onSkip} style={{ background:"none", border:"none", color:"#aaa", fontSize:15, cursor:"pointer" }}>Skip</button>
        <div style={{ color:"#fff", fontWeight:700, fontSize:16 }}>✂️ Edit Video</div>
        <button onClick={doTrim} disabled={trimming}
          style={{ background:"linear-gradient(135deg,#ff6b6b,#ff8e53)", border:"none", borderRadius:20, padding:"8px 18px", color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer" }}>
          {trimming ? "Processing..." : "Done"}
        </button>
      </div>

      {/* Video Preview */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", background:"#111", overflow:"hidden" }}>
        <video ref={videoRef} src={previewUrl}
          onLoadedMetadata={onMeta} onTimeUpdate={onTimeUpdate}
          onClick={() => videoRef.current?.paused ? videoRef.current.play() : videoRef.current.pause()}
          style={{
            maxWidth:"100%", maxHeight:"100%",
            aspectRatio: cropMode === "square" ? "1/1" : cropMode === "portrait" ? "9/16" : "auto",
            objectFit: cropMode === "original" ? "contain" : "cover",
            cursor:"pointer"
          }}
          playsInline loop muted={false}
        />
      </div>

      {/* Controls */}
      <div style={{ background:"#0f0f1a", padding:"20px 20px 40px" }}>

        {/* Crop Mode */}
        <div style={{ marginBottom:20 }}>
          <div style={{ color:"#aaa", fontSize:12, fontWeight:600, marginBottom:10, textTransform:"uppercase", letterSpacing:1 }}>Crop</div>
          <div style={{ display:"flex", gap:8 }}>
            {["original","square","portrait"].map(m => (
              <button key={m} onClick={() => setCropMode(m)}
                style={{ flex:1, padding:"10px 0", borderRadius:12, border: cropMode===m ? "2px solid #ff6b6b" : "2px solid #333",
                  background: cropMode===m ? "rgba(255,107,107,0.15)" : "#1a1a2e",
                  color: cropMode===m ? "#ff6b6b" : "#888", fontWeight:700, fontSize:12, cursor:"pointer" }}>
                {m === "original" ? "📐 Original" : m === "square" ? "⬜ Square" : "📱 Portrait"}
              </button>
            ))}
          </div>
        </div>

        {/* Trim */}
        {duration > 0 && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div style={{ color:"#aaa", fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Trim</div>
              <div style={{ color:"#ff6b6b", fontSize:13, fontWeight:700 }}>{fmtTime(trimStart)} – {fmtTime(trimEnd)} ({fmtTime(trimDuration)})</div>
            </div>

            {/* Trim bar */}
            <div style={{ position:"relative", height:44, background:"#1a1a2e", borderRadius:12, overflow:"hidden", marginBottom:8 }}>
              {/* Selected range highlight */}
              <div style={{
                position:"absolute", top:0, bottom:0,
                left: `${(trimStart/duration)*100}%`,
                width: `${((trimEnd-trimStart)/duration)*100}%`,
                background:"rgba(255,107,107,0.25)", border:"2px solid #ff6b6b", borderRadius:8
              }} />
              {/* Playhead */}
              <div style={{
                position:"absolute", top:0, bottom:0, width:2, background:"#fff",
                left: `${(currentTime/duration)*100}%`
              }} />
              {/* Start thumb */}
              <input type="range" min={0} max={duration} step={0.1} value={trimStart}
                onChange={e => { const v = Math.min(parseFloat(e.target.value), trimEnd-1); setTrimStart(v); seekTo(v); }}
                style={{ position:"absolute", inset:0, width:"100%", opacity:0, cursor:"ew-resize", zIndex:2 }} />
            </div>

            {/* Start / End sliders */}
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <div>
                <div style={{ color:"#888", fontSize:11, marginBottom:4 }}>Start: {fmtTime(trimStart)}</div>
                <input type="range" min={0} max={duration} step={0.1} value={trimStart}
                  onChange={e => { const v = Math.min(parseFloat(e.target.value), trimEnd-1); setTrimStart(v); seekTo(v); }}
                  style={{ width:"100%", accentColor:"#ff6b6b" }} />
              </div>
              <div>
                <div style={{ color:"#888", fontSize:11, marginBottom:4 }}>End: {fmtTime(trimEnd)}</div>
                <input type="range" min={0} max={duration} step={0.1} value={trimEnd}
                  onChange={e => { const v = Math.max(parseFloat(e.target.value), trimStart+1); setTrimEnd(v); seekTo(v); }}
                  style={{ width:"100%", accentColor:"#ff6b6b" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {trimming && (
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.85)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:10 }}>
          <div style={{ fontSize:40, marginBottom:16 }}>✂️</div>
          <div style={{ color:"#fff", fontSize:18, fontWeight:700 }}>Processing video...</div>
          <div style={{ color:"#aaa", fontSize:14, marginTop:8 }}>This may take a moment</div>
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
  const [maxDuration, setMaxDuration] = useState(60);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  const [musicGenreFilter, setMusicGenreFilter] = useState("All");
  const [previewTrack, setPreviewTrack] = useState(null);
  const previewAudioRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState("");
  const fileRef = useRef();

  const [notAiConfirmed, setNotAiConfirmed] = useState(false);
  const [aiBlocked, setAiBlocked] = useState(false);

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

  const handleFileSelect = (f) => {
    if (!f) return;
    setFile(f);
    setEditedFile(null);
    setAiBlocked(false);
    setExplicitBlocked(false);
    if (checkForAiSignatures(f, caption)) { setAiBlocked(true); return; }
    if (checkForExplicitContent(f, caption)) { setExplicitBlocked(true); return; }
    // Show editor for video files
    if (f.type.startsWith("video/")) setShowEditor(true);
  };

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setPhotos(prev => {
      const combined = [...prev, ...files];
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
        const url = await uploadFile(photos[i]);
        urls.push(url);
        setProgress(10 + Math.round(((i+1)/photos.length)*70));
      }
      setProgress(85); setStep("Saving to feed...");
      const username = currentUser.full_name || currentUser.email?.split("@")[0] || "user";
      const tags = (caption.match(/#\w+/g) || []).map(t => t.toLowerCase());
      await videos.create({
        user_id: currentUser.id, username,
        display_name: currentUser.full_name || username,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        video_url: urls[0],
        thumbnail_url: urls[0],
        photo_urls: JSON.stringify(urls),
        is_photo: true,
        caption: caption.trim(), hashtags: tags,
        likes_count: 0, comments_count: 0, views_count: 0, shares_count: 0,
        is_approved: true, is_archived: false, is_ai_detected: false,
      });
      setProgress(100); setStep("Posted! 🎉");
      setTimeout(() => { onUploaded(); onClose(); }, 1000);
    } catch(e) {
      alert("Upload failed: " + (e.message || JSON.stringify(e)));
      setUploading(false); setProgress(0); setStep("");
    }
  };

  const upload = async () => {
    if (!file) return;
    if (checkForExplicitContent(file, caption)) { alert("🔞 Sexual or explicit content is not allowed on AthaVid."); return; }
    if (aiBlocked || checkForAiSignatures(file, caption)) {
      alert("🚫 This video appears to be AI-generated and cannot be posted on AthaVid.");
      return;
    }
    if (!notAiConfirmed) {
      alert("⚠️ Please confirm your video is NOT AI-generated before posting.");
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
        alert(`⚠️ Your video is ${Math.round(dur)}s long. The limit for this format is ${maxDuration === 600 ? "10 minutes" : maxDuration + " seconds"}. Please trim it and try again.`);
        return;
      }
    } catch {}
    setUploading(true); setProgress(10);
    try {
      setStep("Uploading video...");
      const video_url = await uploadFile(editedFile || file);
      setProgress(60);
      setStep("Generating thumbnail...");
      let thumbnail_url = null;
      try { thumbnail_url = await Promise.race([captureThumbnail(file), new Promise(r => setTimeout(() => r(null), 5000))]); } catch {}
      setProgress(80);
      setStep("Saving to feed...");
      const username = currentUser.full_name || currentUser.email?.split("@")[0] || "user";
      const tags = (caption.match(/#\w+/g) || []).map(t => t.toLowerCase());
      await videos.create({
        user_id: currentUser.id, username,
        display_name: currentUser.full_name || username,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        video_url, thumbnail_url, caption: caption.trim(), hashtags: tags,
        likes_count: 0, comments_count: 0, views_count: 0, shares_count: 0,
        is_approved: true, is_archived: false, is_ai_detected: false,
      });
      setProgress(100); setStep("Posted! 🎉");
      setTimeout(() => { onUploaded(); onClose(); }, 1000);
    } catch(e) {
      alert("Upload failed: " + (e.message || JSON.stringify(e)));
      setUploading(false); setProgress(0); setStep("");
    }
  };

  return (
    <>
    {showEditor && (
      <VideoEditor
        file={file}
        onDone={(processed) => { setEditedFile(processed); setShowEditor(false); }}
        onSkip={() => { setEditedFile(null); setShowEditor(false); }}
      />
    )}
    <div style={{ position:"fixed", inset:0, zIndex:2000, display:"flex", alignItems:"flex-end" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.85)" }} />
      <div style={{ position:"relative", width:"100%", maxWidth:480, margin:"0 auto", background:"#0f0f1a", borderRadius:"24px 24px 0 0", padding:"24px 24px 48px", zIndex:2001 }}>
        <div style={{ width:40, height:4, background:"#444", borderRadius:99, margin:"0 auto 20px" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>{uploadTab==="video" ? "📹 Post a Video" : "🖼️ Post Photos"}</div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:"50%", width:32, height:32, color:"#fff", cursor:"pointer" }}>✕</button>
        </div>
        {/* Tab switcher */}
        <div style={{ display:"flex", gap:8, marginBottom:18, background:"rgba(255,255,255,0.05)", borderRadius:14, padding:4 }}>
          {[{id:"video",label:"🎬 Video"},{id:"photo",label:"🖼️ Photos"}].map(t => (
            <button key={t.id} onClick={() => { setUploadTab(t.id); setFile(null); setPhotos([]); }}
              style={{ flex:1, padding:"10px 0", borderRadius:11, border:"none",
                background: uploadTab===t.id ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "transparent",
                color: uploadTab===t.id ? "#fff" : "#888", fontWeight:800, fontSize:14, cursor:"pointer" }}>
              {t.label}
            </button>
          ))}
        </div>

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
            <input ref={fileRef} type="file" accept="video/*" style={{ display:"none" }} onChange={e => e.target.files[0] && setFile(e.target.files[0])} />
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
        <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Write a caption... #hashtags" rows={3}
          style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:12, color:"#fff", fontSize:14, resize:"none", outline:"none", boxSizing:"border-box", marginBottom:16 }} />
        {/* Music Picker Button */}
        <div onClick={() => setShowMusicPicker(s => !s)}
          style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"12px 14px", marginBottom:12, cursor:"pointer" }}>
          <div style={{ fontSize:22 }}>🎵</div>
          <div style={{ flex:1 }}>
            <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{selectedTrack ? selectedTrack.title : "Add Sound"}</div>
            <div style={{ color:"#888", fontSize:12 }}>{selectedTrack ? selectedTrack.artist : "Pick from free music library"}</div>
          </div>
          {selectedTrack && <button onClick={e => { e.stopPropagation(); setSelectedTrack(null); }} style={{ background:"none", border:"none", color:"#ff6b6b", fontSize:16, cursor:"pointer" }}>✕</button>}
          <div style={{ color:"#888", fontSize:18 }}>{showMusicPicker ? "▲" : "▼"}</div>
        </div>

        {/* Music Library */}
        {showMusicPicker && (
          <div style={{ background:"rgba(0,0,0,0.5)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, marginBottom:14 }}>
            {/* Genre filter tabs */}
            <div style={{ display:"flex", gap:6, padding:"10px 10px 6px", overflowX:"auto", scrollbarWidth:"none" }}>
              {MUSIC_GENRES.map(g => (
                <button key={g} onClick={() => setMusicGenreFilter(g)}
                  style={{ flexShrink:0, padding:"5px 12px", borderRadius:20, border:"none", cursor:"pointer", fontSize:11, fontWeight:700,
                    background: musicGenreFilter === g ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "rgba(255,255,255,0.07)",
                    color: musicGenreFilter === g ? "#fff" : "#aaa" }}>
                  {g}
                </button>
              ))}
            </div>
            {/* Track list */}
            <div style={{ maxHeight:200, overflowY:"auto" }}>
              {MUSIC_LIBRARY.filter(t => musicGenreFilter === "All" || t.genre === musicGenreFilter).map(track => (
                <div key={track.id} onClick={() => { setSelectedTrack(track); setShowMusicPicker(false); if(previewAudioRef.current){ previewAudioRef.current.pause(); setPreviewTrack(null); } }}
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderBottom:"1px solid rgba(255,255,255,0.05)", cursor:"pointer", background: selectedTrack?.id === track.id ? "rgba(255,107,107,0.15)" : "transparent" }}>
                  <div style={{ fontSize:20 }}>{track.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ color:"#fff", fontWeight:600, fontSize:13 }}>{track.title}</div>
                    <div style={{ color:"#888", fontSize:11 }}>{track.artist} · <span style={{ color:"rgba(255,107,107,0.7)" }}>{track.genre}</span></div>
                  </div>
                  <button onClick={e => {
                    e.stopPropagation();
                    if (previewTrack === track.id) {
                      previewAudioRef.current?.pause();
                      setPreviewTrack(null);
                    } else {
                      if (previewAudioRef.current) { previewAudioRef.current.pause(); previewAudioRef.current.src = track.url; previewAudioRef.current.play(); }
                      setPreviewTrack(track.id);
                    }
                  }} style={{ background:"rgba(255,107,107,0.2)", border:"none", borderRadius:"50%", width:30, height:30, color:"#ff6b6b", cursor:"pointer", fontSize:14, flexShrink:0 }}>
                    {previewTrack === track.id ? "⏹" : "▶"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <audio ref={previewAudioRef} onEnded={() => setPreviewTrack(null)} style={{ display:"none" }} />

        {/* Explicit Content Block Warning */}
        {explicitBlocked && (
          <div style={{ background:"rgba(255,50,50,0.12)", border:"1px solid rgba(255,50,50,0.4)", borderRadius:12, padding:"14px 16px", marginBottom:12, display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ fontSize:22, flexShrink:0 }}>🔞</div>
            <div>
              <div style={{ color:"#ff4444", fontWeight:700, fontSize:14, marginBottom:4 }}>Explicit Content Not Allowed</div>
              <div style={{ color:"#cc6666", fontSize:13, lineHeight:1.5 }}>AthaVid does not allow sexual or explicit content. Please upload appropriate videos only.</div>
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

        {/* Not AI Confirmation Checkbox */}
        {!aiBlocked && !explicitBlocked && file && (
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

        {uploading && (
          <div style={{ marginBottom:16 }}>
            <div style={{ color:"#aaa", fontSize:13, marginBottom:6 }}>{step}</div>
            <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:99, height:6, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#ff6b6b,#ff8e53)", borderRadius:99, transition:"width 0.4s ease" }} />
            </div>
          </div>
        )}
        {uploadTab === "photo" ? (
          <button onClick={uploadPhotos} disabled={!photos.length || uploading}
            style={{ width:"100%", padding:14, background: photos.length && !uploading ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "rgba(255,255,255,0.08)", border:"none", borderRadius:14, color:"#fff", fontWeight:800, fontSize:16, cursor: photos.length && !uploading ? "pointer" : "not-allowed", opacity: photos.length && !uploading ? 1 : 0.5 }}>
            {uploading ? step : `🖼️ Post ${photos.length > 0 ? photos.length : ""} Photo${photos.length !== 1 ? "s" : ""}`}
          </button>
        ) : (
          <button onClick={upload} disabled={!file || uploading || aiBlocked || explicitBlocked || !notAiConfirmed}
            style={{ width:"100%", padding:14, background: file && !uploading ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "rgba(255,255,255,0.08)", border:"none", borderRadius:14, color:"#fff", fontWeight:800, fontSize:16, cursor: file && !uploading && !aiBlocked && !explicitBlocked && notAiConfirmed ? "pointer" : "not-allowed", opacity: file && !uploading && !aiBlocked && !explicitBlocked && notAiConfirmed ? 1 : 0.5 }}>
            {uploading ? step : "🚀 Post Video"}
          </button>
        )}
      </div>
    </div>
    </>
  );
}

// ── Video Card ────────────────────────────────────────────────────────────────
function VideoCard({ video, currentUser, onCommentOpen, onLike, onView, onNeedAuth, onDelete, onProfileOpen }) {
  const videoRef = useRef(null);
  const viewedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [muted, setMuted] = useState(true);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [followRecord, setFollowRecord] = useState(null);
  const [followLoading, setFollowLoading] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);

  const isOwnVideo = currentUser && (currentUser.id === video.user_id || currentUser.id === video.created_by || (currentUser.username && currentUser.username === video.username));

  // Auto-play via IntersectionObserver
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.muted = true;
        setMuted(true);
        el.play().catch(() => {});
        setPlaying(true);
        if (!viewedRef.current) { viewedRef.current = true; onView && onView(video.id); }
      } else {
        el.pause();
        setPlaying(false);
      }
    }, { threshold: 0.6 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Load follow state
  useEffect(() => {
    if (!currentUser || isOwnVideo) return;
    follows.getFollowing(currentUser.id).then(res => {
      const rec = (res.items || res || []).find(r => r.following_id === video.user_id);
      if (rec) setFollowRecord(rec);
    }).catch(() => {});
  }, [currentUser, video.user_id]);

  const doMute = () => {
    const el = videoRef.current;
    if (!el) return;
    const nm = !muted;
    setMuted(nm);
    el.muted = nm;
    if (!nm) {
      // Unmuting on mobile requires user gesture — we already have it here
      const t = el.currentTime;
      el.pause();
      el.muted = false;
      el.currentTime = t;
      el.play().catch(() => {});
    }
  };

  const doTogglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) { el.play(); setPlaying(true); } else { el.pause(); setPlaying(false); }
  };

  const doLike = () => {
    if (!currentUser) { onNeedAuth(); return; }
    setLiked(l => !l);
    onLike(video.id, liked ? -1 : 1);
  };

  const doFollow = async () => {
    if (!currentUser) { onNeedAuth(); return; }
    if (isOwnVideo) return;
    setFollowLoading(true);
    try {
      if (followRecord) {
        await follows.unfollow(followRecord.id);
        setFollowRecord(null);
      } else {
        const rec = await follows.follow(
          currentUser.id,
          currentUser.username || currentUser.email?.split("@")[0],
          video.user_id,
          video.username
        );
        setFollowRecord(rec);
      }
    } catch(err) { console.error(err); }
    setFollowLoading(false);
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const doDelete = async () => {
    if (!currentUser || !isOwnVideo) return;
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      await videos.delete(video.id);
      onDelete && onDelete(video.id);
    } catch(err) { alert("Failed to delete. Try again."); }
  };

  const photoUrls = video.is_photo && video.photo_urls
    ? (Array.isArray(video.photo_urls) ? video.photo_urls : JSON.parse(video.photo_urls))
    : null;

  const tap = (fn) => (e) => { e.stopPropagation(); fn(); };

  return (
    <div style={{ position:"relative", width:"100%", height:"100svh", background:"#000", flexShrink:0, scrollSnapAlign:"start" }}>

      {/* ── MEDIA ── */}
      {photoUrls ? (
        <div style={{ width:"100%", height:"100%", position:"relative", overflow:"hidden" }}>
          <img src={photoUrls[photoIdx]} style={{ width:"100%", height:"100%", objectFit:"contain", background:"#000" }} />
          {photoIdx > 0 && (
            <button onClick={tap(() => setPhotoIdx(p=>p-1))}
              style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", zIndex:50,
                background:"rgba(0,0,0,0.6)", border:"none", borderRadius:"50%", width:44, height:44,
                color:"#fff", fontSize:22, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
          )}
          {photoIdx < photoUrls.length-1 && (
            <button onClick={tap(() => setPhotoIdx(p=>p+1))}
              style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", zIndex:50,
                background:"rgba(0,0,0,0.6)", border:"none", borderRadius:"50%", width:44, height:44,
                color:"#fff", fontSize:22, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
          )}
          {photoUrls.length > 1 && (
            <div style={{ position:"absolute", bottom:110, left:"50%", transform:"translateX(-50%)", display:"flex", gap:6, zIndex:50, pointerEvents:"none" }}>
              {photoUrls.map((_,i) => (
                <div key={i} style={{ width:i===photoIdx?20:7, height:7, borderRadius:99,
                  background:i===photoIdx?"#ff6b6b":"rgba(255,255,255,0.5)", transition:"all 0.25s" }} />
              ))}
            </div>
          )}
          <div style={{ position:"absolute", top:60, right:16, background:"rgba(0,0,0,0.6)", borderRadius:20,
            padding:"4px 12px", fontSize:13, fontWeight:700, color:"#fff", zIndex:50, pointerEvents:"none" }}>
            {photoIdx+1} / {photoUrls.length}
          </div>
        </div>
      ) : (() => {
        const isImg = /\.(png|jpe?g|gif|webp|bmp|heic)(\?|$)/i.test(video.video_url || "");
        if (isImg) return (
          <img src={video.video_url}
            style={{ width:"100%", height:"100%", objectFit:"contain", background:"#000", display:"block" }} />
        );
        return (
          <video ref={videoRef} src={video.video_url} poster={video.thumbnail_url}
            loop playsInline muted
            style={{ width:"100%", height:"100%", objectFit:"cover", pointerEvents:"none", display:"block" }} />
        );
      })()}

      {/* ── GRADIENT OVERLAY (no pointer events) ── */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)", pointerEvents:"none", zIndex:10 }} />

      {/* ── TAP TO PAUSE (middle area only) ── */}
      <div onClick={tap(doTogglePlay)}
        style={{ position:"absolute", top:60, left:0, right:80, bottom:300, zIndex:15, cursor:"pointer" }} />

      {/* ── PAUSED INDICATOR ── */}
      {!playing && (
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none", zIndex:20 }}>
          <div onClick={tap(doTogglePlay)} style={{ background:"rgba(0,0,0,0.55)", borderRadius:"50%", width:72, height:72,
            display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"auto", cursor:"pointer", fontSize:30 }}>▶</div>
        </div>
      )}



      {/* ── BOTTOM LEFT: user info + caption ── */}
      <div style={{ position:"absolute", bottom:150, left:16, right:72, zIndex:250 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:2, marginBottom:8, cursor:"pointer" }}
          onClick={tap(() => onProfileOpen && (video.user_id || video.created_by) && onProfileOpen(video.user_id || video.created_by, video.username || video.display_name))}>
          <div style={{ color:"#fff", fontWeight:800, fontSize:15 }}>{video.display_name || video.username}</div>
          <div style={{ color:"rgba(255,255,255,0.55)", fontSize:13 }}>@{video.username}</div>
        </div>
        {video.sound_title && (
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6, overflow:"hidden" }}>
          <div style={{ fontSize:14, flexShrink:0, animation: playing ? "spin 3s linear infinite" : "none",
            display:"inline-block" }}>🎵</div>
          <div style={{ overflow:"hidden", flex:1 }}>
            <div style={{ color:"rgba(255,255,255,0.85)", fontSize:12, fontWeight:600, whiteSpace:"nowrap",
              animation: playing ? "marquee 8s linear infinite" : "none",
              display:"inline-block" }}>
              {video.sound_title}{video.sound_artist ? ` · ${video.sound_artist}` : ""}
            </div>
          </div>
        </div>
      )}
      <div style={{ color:"#fff", fontSize:14, lineHeight:1.5 }}>{video.caption}</div>
        {video.hashtags?.length > 0 && (
          <div style={{ color:"#ff8e53", fontSize:13, marginTop:4 }}>
            {video.hashtags.slice(0,4).map(t => `#${t.replace(/^#/,"")}`).join(" ")}
          </div>
        )}
        {video.created_date && (
          <div style={{ display:"inline-flex", alignItems:"center", gap:5, marginTop:8,
            background:"rgba(0,0,0,0.45)", borderRadius:20, padding:"3px 10px", width:"fit-content" }}>
            <span style={{ fontSize:12 }}>📅</span>
            <span style={{ color:"rgba(255,255,255,0.85)", fontSize:12, fontWeight:600 }}>{formatDate(video.created_date)}</span>
          </div>
        )}
      </div>

      {/* ── RIGHT SIDEBAR: actions ── */}
      <div style={{ position:"absolute", bottom:150, right:10, display:"flex", flexDirection:"column", alignItems:"center", gap:14, zIndex:250 }}>

        {/* Avatar + Follow button — TikTok style */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:0, marginBottom:4 }}>
          <img src={video.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.username}`}
            onClick={tap(() => onProfileOpen && (video.user_id || video.created_by) && onProfileOpen(video.user_id || video.created_by, video.username || video.display_name))}
            style={{ width:46, height:46, borderRadius:"50%", border:"2px solid #fff", cursor:"pointer", flexShrink:0 }} />
          {!isOwnVideo && (
            <button onClick={tap(doFollow)} disabled={followLoading}
              style={{ marginTop:-10, width:22, height:22, borderRadius:"50%", border:"none",
                background: followRecord ? "rgba(255,255,255,0.85)" : "#fe2c55",
                color:"#fff", fontWeight:900, fontSize:14, cursor:"pointer", lineHeight:1,
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 2px 6px rgba(0,0,0,0.4)",
                WebkitTapHighlightColor:"transparent", touchAction:"manipulation" }}>
              {followLoading ? "·" : followRecord ? "✓" : "+"}
            </button>
          )}
        </div>

        {/* Mute button */}
        <button onClick={tap(doMute)}
          style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2,
            WebkitTapHighlightColor:"transparent", touchAction:"manipulation" }}>
          <div style={{ fontSize:26 }}>{muted ? "🔇" : "🔊"}</div>
        </button>

        {/* Like */}
        <button onClick={tap(doLike)}
          style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4,
            WebkitTapHighlightColor:"transparent", touchAction:"manipulation" }}>
          <div style={{ width:38, height:38, borderRadius:"50%", background:"rgba(255,255,255,0.12)", display:"flex", alignItems:"center", justifyContent:"center",
            animation: liked ? "heartpop 0.5s ease forwards" : "heartbeat 1.4s ease-in-out infinite", transformOrigin:"center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fe2c55" stroke="#fe2c55" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <div style={{ color:"#fff", fontSize:12, fontWeight:600 }}>{formatCount((video.likes_count||0)+(liked?1:0))}</div>
        </button>

        {/* Comment */}
        <button onClick={tap(() => onCommentOpen(video))}
          style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4,
            WebkitTapHighlightColor:"transparent", touchAction:"manipulation" }}>
          <div style={{ width:38, height:38, borderRadius:"50%", background:"rgba(255,255,255,0.12)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div style={{ color:"#fff", fontSize:12, fontWeight:600 }}>{formatCount(video.comments_count)}</div>
        </button>

        {/* Share */}
        <button onClick={tap(() => {
            if(navigator.share){ navigator.share({ title: video.caption||"Check this out", url: window.location.href }); }
            else { navigator.clipboard?.writeText(window.location.href); alert("Link copied!"); }
          })}
          style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4,
            WebkitTapHighlightColor:"transparent", touchAction:"manipulation" }}>
          <div style={{ width:38, height:38, borderRadius:"50%", background:"rgba(255,255,255,0.12)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
          </div>
          <div style={{ color:"#fff", fontSize:12, fontWeight:600 }}>{formatCount(video.shares_count||0)}</div>
        </button>

        {/* Delete — only for own videos */}
        {isOwnVideo && (
          <button onClick={tap(doDelete)}
            style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2,
              WebkitTapHighlightColor:"transparent", touchAction:"manipulation" }}>
            <div style={{ width:38, height:38, borderRadius:"50%", background:"rgba(255,60,60,0.18)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>
            <div style={{ color:"#ff4444", fontSize:11, fontWeight:600 }}>Delete</div>
          </button>
        )}






      </div>

      {reportTarget && <ReportModal video={reportTarget} onClose={() => setReportTarget(null)} />}

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

function ReportModal({ video, onClose }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (!selected) return;
    // Store report in localStorage for now
    const key = `reports_${video.id}`;
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.push({ reason: selected, time: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(existing));
    setSubmitted(true);
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
            <div style={{ color:"#888", fontSize:14 }}>Thanks for keeping AthaVid safe. We'll review this video.</div>
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
  @keyframes heartpop {
    0%   { transform: scale(1); }
    30%  { transform: scale(1.5); }
    60%  { transform: scale(0.9); }
    80%  { transform: scale(1.15); }
    100% { transform: scale(1); }
  }
`;
if (!document.getElementById('spin-style')) { spinStyle.id='spin-style'; document.head.appendChild(spinStyle); }

// ── Avatar Picker Modal ───────────────────────────────────────────────────────
const AVATAR_STYLES = [
  { label: "Cartoon", style: "avataaars", seeds: ["Felix","Aneka","Mia","Zara","Leo","Nova","Kira","Blaze","Pixel","Storm","Echo","Sage","Raya","Kofi","Priya","Omar","Mei","Ava","Jake","Luna","Diego","Aisha","Nate","Yuki"] },
  { label: "Portraits", style: "lorelei", seeds: ["Alex","Sam","Jordan","Taylor","Morgan","Casey","Jamie","Riley","Quinn","Avery","Blake","Cameron","Dana","Ellis","Fynn","Gwen","Harley","Indie","Jules","Kai"] },
  { label: "Fun", style: "bottts", seeds: ["R2D2","BB8","Wall-E","Robo","Zap","Bolt","Chip","Digi","Glitch","Mega","Nano","Pixel","Spark","Vibe","Wave","Flux","Glow","Nova","Atom","Echo"] },
  { label: "Minimal", style: "thumbs", seeds: ["Alpha","Beta","Gamma","Delta","Epsilon","Zeta","Eta","Theta","Iota","Kappa","Lambda","Mu","Nu","Xi","Omicron","Pi","Rho","Sigma","Tau","Upsilon"] },
];

function AvatarPickerModal({ currentAvatar, onSelect, onClose }) {
  const [uploading, setUploading] = useState(false);
  const [activeStyle, setActiveStyle] = useState(0);
  const fileRef = useRef();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onSelect(url);
    } catch { alert("Upload failed, try again."); }
    finally { setUploading(false); }
  };

  const currentStyleData = AVATAR_STYLES[activeStyle];
  const avatarUrls = currentStyleData.seeds.map(seed =>
    `https://api.dicebear.com/7.x/${currentStyleData.style}/svg?seed=${seed}`
  );

  return (
    <div style={{ position:"fixed", inset:0, zIndex:2000, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.75)" }} />
      <div style={{ position:"relative", background:"#1a1a2e", borderRadius:"24px 24px 0 0", width:"100%", maxWidth:480, padding:"20px 20px 36px", zIndex:2001 }}>
        <div style={{ width:40, height:4, background:"#444", borderRadius:99, margin:"0 auto 16px" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={{ color:"#fff", fontWeight:700, fontSize:16 }}>Choose your avatar</div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:"50%", width:30, height:30, color:"#fff", cursor:"pointer" }}>✕</button>
        </div>

        {/* Upload own photo */}
        <div style={{ marginBottom:14 }}>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFileUpload} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            style={{ width:"100%", padding:"11px", background:"rgba(108,99,255,0.2)", border:"2px dashed rgba(108,99,255,0.5)", borderRadius:12, color:"#6c63ff", fontWeight:700, fontSize:14, cursor:"pointer" }}>
            {uploading ? "Uploading..." : "📷 Upload your own photo"}
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

        {/* Avatar grid — scrollable */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:14, maxHeight:300, overflowY:"auto", paddingBottom:4 }}>
          {avatarUrls.map((url, i) => (
            <button key={i}
              onClick={() => onSelect(url)}
              style={{ background: currentAvatar===url ? "rgba(255,107,107,0.2)" : "rgba(255,255,255,0.04)",
                border: currentAvatar===url ? "3px solid #ff6b6b" : "3px solid rgba(255,255,255,0.1)",
                borderRadius:"50%", width:64, height:64, margin:"0 auto", padding:0,
                cursor:"pointer", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center",
                transition:"border 0.2s, transform 0.15s",
                transform: currentAvatar===url ? "scale(1.12)" : "scale(1)" }}>
              <img src={url} style={{ width:"100%", height:"100%", pointerEvents:"none", display:"block" }} loading="lazy" />
            </button>
          ))}
        </div>
      </div>
    </div>
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
      <video ref={videoRef} key={v.id} src={v.video_url} autoPlay playsInline loop muted={muted}
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
          <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
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

  const isOwnProfile = currentUser && currentUser.id === userId;

  React.useEffect(() => {
    setLoading(true);
    Promise.all([
      request("GET", `/apps/69b2ee18a8e6fb58c7f0261c/entities/AthaVidUser?limit=200`).catch(() => null),
      videos.byUser(userId).catch(() => [])
    ]).then(([userRes, vids]) => {
      const allUsers = userRes?.items || userRes || [];
      const u = allUsers.find(x => x.id === userId || x.created_by === userId) || null;
      setProfile(u);
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
      } else {
        const rec = await follows.follow(
          currentUser.id,
          currentUser.username || currentUser.email?.split("@")[0],
          userId,
          username
        );
        setFollowRecord(rec);
      }
    } catch(e) { console.error(e); }
    setFollowLoading(false);
  };

  const displayName = profile?.display_name || username || "User";
  const avatarUrl = profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

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
                  <div style={{ textAlign:"center" }}>
                    <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>{profile?.followers_count || 0}</div>
                    <div style={{ color:"#666", fontSize:11 }}>Followers</div>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>{profile?.following_count || 0}</div>
                    <div style={{ color:"#666", fontSize:11 }}>Following</div>
                  </div>
                </div>

                {!isOwnProfile && currentUser && (
                  <button onClick={doFollow} disabled={followLoading}
                    style={{ padding:"10px 40px", borderRadius:24,
                      background: followRecord ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg,#ff6b6b,#e53935)",
                      border: followRecord ? "1.5px solid rgba(255,255,255,0.3)" : "none",
                      color:"#fff", fontWeight:800, fontSize:15, cursor:"pointer",
                      opacity: followLoading ? 0.6 : 1,
                      WebkitTapHighlightColor:"transparent", touchAction:"manipulation" }}>
                    {followLoading ? "..." : followRecord ? "✓ Following" : "+ Follow"}
                  </button>
                )}
              </div>

              {/* Video Grid */}
              <div style={{ overflowY:"auto", flex:1, padding:2 }}>
                {userVideos.length === 0 ? (
                  <div style={{ textAlign:"center", padding:40, color:"#444" }}>
                    <div style={{ fontSize:36, marginBottom:8 }}>🎬</div>
                    <div>No videos yet</div>
                  </div>
                ) : (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2 }}>
                    {userVideos.map((v, i) => (
                      <div key={v.id} onClick={() => setPlayerIndex(i)}
                        style={{ position:"relative", aspectRatio:"9/16", background:"#111", overflow:"hidden", cursor:"pointer" }}>
                        {v.thumbnail_url ? (
                          <img src={v.thumbnail_url} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        ) : (
                          <video src={v.video_url} style={{ width:"100%", height:"100%", objectFit:"cover" }} muted playsInline preload="metadata" />
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
    } catch(e) { alert("Delete failed: " + e.message); }
    finally { setSaving(false); }
  };

  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      await videos.update(editVideo.id, { caption: editCaption });
      setEditVideo(null);
      onRefresh();
    } catch(e) { alert("Save failed: " + e.message); }
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
              ? <img src={v.thumbnail_url} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
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

      {/* Confirm Delete Modal */}
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

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => auth.getUser());
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("feed");
  const [showGoLive, setShowGoLive] = useState(false);
  const [profileSheet, setProfileSheet] = useState(null); // { userId, username }
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedTab, setFeedTab] = useState("forYou"); // forYou | following
  const [followingVideos, setFollowingVideos] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const [commentVideo, setCommentVideo] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadToast, setUploadToast] = useState(false);
  const [loginToast, setLoginToast] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [myVideos, setMyVideos] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editProfileName, setEditProfileName] = useState('');
  const [editProfileSaving, setEditProfileSaving] = useState(false);

  useEffect(() => { loadVideos(); }, []);
  useEffect(() => { if (currentUser) loadFollowingVideos(currentUser); }, [currentUser]);
  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`avatar_${currentUser.id}`);
      if (saved) setAvatarUrl(saved);
    }
  }, [currentUser]);

  const loadFollowingVideos = async (user) => {
    if (!user) return;
    try {
      const res = await follows.getFollowing(user.id);
      const items = res.items || res || [];
      const ids = items.map(r => r.following_id);
      setFollowingIds(ids);
      if (ids.length === 0) { setFollowingVideos([]); return; }
      const allVids = await videos.list();
      const vids = (allVids.items || allVids || []).filter(v => ids.includes(v.user_id));
      setFollowingVideos(vids);
    } catch(e) { console.error(e); }
  };

  const loadVideos = async () => {
    setLoading(true);
    try {
      const data = await videos.list();
      setVideoList(Array.isArray(data) ? data : []);
    } catch { setVideoList([]); }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === "profile" && currentUser) {
      videos.myVideos(currentUser.id)
        .then(r => setMyVideos(Array.isArray(r) ? r : []))
        .catch(() => setMyVideos([]));
    }
  }, [activeTab, currentUser]);

  const handleLike = (videoId, delta) => {
    setVideoList(vs => vs.map(v => v.id === videoId ? { ...v, likes_count: Math.max(0, (v.likes_count||0)+delta) } : v));
    const vid = videoList.find(v => v.id === videoId);
    if (vid) videos.update(videoId, { likes_count: Math.max(0, (vid.likes_count||0)+delta) }).catch(()=>{});
  };

  const handleView = (videoId) => {
    setVideoList(vs => vs.map(v => v.id === videoId ? { ...v, views_count: (v.views_count||0)+1 } : v));
    const vid = videoList.find(v => v.id === videoId);
    if (vid) videos.update(videoId, { views_count: (vid.views_count||0)+1 }).catch(()=>{});
  };

  const handleCommentCount = (videoId, count) => {
    setVideoList(vs => vs.map(v => v.id === videoId ? { ...v, comments_count: count } : v));
  };

  const requireAuth = (cb) => { if (currentUser) cb(); else setShowAuth(true); };

  const username = currentUser?.full_name || currentUser?.email?.split("@")[0] || "";

  if (!hasEntered) {
    return <Landing onEnter={() => setHasEntered(true)} />;
  }

  return (
    <div style={{ background:"#000", minHeight:"100svh", maxWidth:480, margin:"0 auto", position:"relative", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>

      {/* Header — exact TikTok style */}
      <div style={{ position:"fixed", top:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, zIndex:300, display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:"env(safe-area-inset-top,0px)", background:"transparent" }}>

        {/* Left: Live button (TikTok style) */}
        <div style={{ width:56, display:"flex", alignItems:"center", justifyContent:"center", paddingTop:12 }}>
          <button onClick={() => requireAuth(() => setShowGoLive(true))}
            style={{ background:"none", border:"1.5px solid rgba(229,57,53,0.8)", borderRadius:6, padding:"3px 8px", color:"#e53935", fontSize:12, fontWeight:700, cursor:"pointer", letterSpacing:0.5, WebkitTapHighlightColor:"transparent" }}>
            ⏺ Rec
          </button>
        </div>

        {/* Center: Following | For You */}
        {activeTab === "feed" ? (
          <div style={{ display:"flex", alignItems:"center", gap:0, paddingTop:10 }}>
            <button onClick={() => { setFeedTab("following"); if(currentUser) loadFollowingVideos(currentUser); }}
              style={{ background:"none", border:"none", cursor:"pointer", padding:"6px 16px 8px",
                color: feedTab==="following" ? "#fff" : "rgba(255,255,255,0.5)",
                fontWeight: feedTab==="following" ? 700 : 500,
                fontSize: 16, letterSpacing:0.3, transition:"all 0.2s",
                borderBottom: feedTab==="following" ? "2px solid #fff" : "2px solid transparent",
                WebkitTapHighlightColor:"transparent" }}>
              Following
            </button>
            <button onClick={() => setFeedTab("forYou")}
              style={{ background:"none", border:"none", cursor:"pointer", padding:"6px 16px 8px",
                color: feedTab==="forYou" ? "#fff" : "rgba(255,255,255,0.5)",
                fontWeight: feedTab==="forYou" ? 700 : 500,
                fontSize: 16, letterSpacing:0.3, transition:"all 0.2s",
                borderBottom: feedTab==="forYou" ? "2px solid #fff" : "2px solid transparent",
                WebkitTapHighlightColor:"transparent" }}>
              For You
            </button>
          </div>
        ) : (
          <div style={{ fontSize:17, fontWeight:700, color:"#fff", paddingTop:10, letterSpacing:0.3 }}>
            {activeTab === "profile" ? "Profile" : "Sachi"}
          </div>
        )}

        {/* Right: Search icon */}
        <div style={{ width:56, display:"flex", alignItems:"center", justifyContent:"center", paddingTop:12 }}>
          <button onClick={() => setShowSearch(true)}
            style={{ background:"none", border:"none", cursor:"pointer", padding:4, WebkitTapHighlightColor:"transparent" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Feed */}
      {activeTab === "feed" && (
        <div data-feed style={{ height:"100svh", overflowY:"scroll", scrollSnapType:"y mandatory", isolation:"isolate" }}>
          {feedTab === "following" && followingIds.length === 0 && (
            <div style={{ height:"100svh", display:"flex", flexDirection:"column", alignItems:"center",
              justifyContent:"center", color:"rgba(255,255,255,0.5)", gap:16, padding:32, textAlign:"center" }}>
              <div style={{ fontSize:56 }}>👥</div>
              <div style={{ fontSize:18, fontWeight:700, color:"#fff" }}>Follow someone first</div>
              <div style={{ fontSize:14 }}>Hit <b>+ Follow</b> on any video to see their posts here</div>
            </div>
          )}
          {loading && (
            <div style={{ height:"100svh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
              <div style={{ fontSize:48 }}>🎬</div>
              <div style={{ color:"#fff", fontSize:16 }}>Loading...</div>
            </div>
          )}
          {!loading && videoList.length === 0 && (
            <div style={{ height:"100svh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
              <div style={{ fontSize:64 }}>🎬</div>
              <div style={{ color:"#fff", fontWeight:800, fontSize:22 }}>No videos yet</div>
              <div style={{ color:"#888", fontSize:15 }}>Be the first to post!</div>
              <button onClick={() => requireAuth(() => setShowUpload(true))}
                style={{ marginTop:12, background:"linear-gradient(135deg,#ff6b6b,#ff8e53)", border:"none", borderRadius:14, padding:"12px 28px", color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer" }}>
                + Upload Video
              </button>
            </div>
          )}
          {(feedTab === "forYou" ? videoList : followingVideos).map(v => (
            <VideoCard key={v.id} video={v} currentUser={currentUser}
              onCommentOpen={setCommentVideo}
              onLike={handleLike}
              onView={handleView}
              onNeedAuth={() => setShowAuth(true)}
              onDelete={(id) => setVideoList(prev => prev.filter(v => v.id !== id))}
              onProfileOpen={(uid, uname) => setProfileSheet({ userId: uid, username: uname })} />
          ))}
        </div>
      )}

      {/* Profile */}
      {activeTab === "profile" && (
        <div style={{ paddingTop:70, paddingBottom:80, minHeight:"100svh", background:"#0a0a14" }}>
          {!currentUser ? (
            <div style={{ textAlign:"center", padding:60 }}>
              <div style={{ fontSize:56, marginBottom:16 }}>👤</div>
              <div style={{ color:"#fff", fontWeight:800, fontSize:20, marginBottom:8 }}>You're not logged in</div>
              <div style={{ color:"#666", fontSize:14, marginBottom:24 }}>Sign up to post and build your profile</div>
              <button onClick={() => setShowAuth(true)}
                style={{ background:"linear-gradient(135deg,#ff6b6b,#ff8e53)", border:"none", borderRadius:14, padding:"13px 32px", color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer" }}>
                Sign Up / Log In
              </button>
            </div>
          ) : (
            <>
              <div style={{ padding:"20px 20px 0", textAlign:"center" }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:12, gap:8 }}>
                  <div style={{ position:"relative", display:"inline-block", cursor:"pointer" }}
                    onClick={() => setShowAvatarPicker(true)}>
                    <img src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
                      style={{ width:90, height:90, borderRadius:"50%", border:"3px solid #ff6b6b", display:"block", background:"rgba(255,255,255,0.05)" }} />
                    <div style={{ position:"absolute", bottom:2, right:2, background:"#ff6b6b", borderRadius:"50%", width:26, height:26,
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, border:"2px solid #0a0a14" }}>✏️</div>
                  </div>
                  <button
                    onClick={() => setShowAvatarPicker(true)}
                    style={{ background:"rgba(255,107,107,0.18)", border:"1px solid rgba(255,107,107,0.4)", borderRadius:20,
                      padding:"6px 18px", color:"#ff6b6b", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                    Change Avatar
                  </button>
                </div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, cursor:"pointer" }}
                  onClick={() => { setEditProfileName(currentUser?.full_name || ''); setShowEditProfile(true); }}>
                  <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>{currentUser.full_name || username}</div>
                  <div style={{ fontSize:13, color:"#888" }}>✏️</div>
                </div>
                <div style={{ color:"#888", fontSize:13, marginTop:2 }}>@{username}</div>
                <div style={{ display:"flex", justifyContent:"center", gap:32, marginTop:20, marginBottom:20 }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>{myVideos.length}</div>
                    <div style={{ color:"#888", fontSize:12 }}>Videos</div>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>0</div>
                    <div style={{ color:"#888", fontSize:12 }}>Followers</div>
                  </div>
                </div>
              </div>
              <VideoManageGrid videos={myVideos} onRefresh={() => videos.myVideos(currentUser.id).then(setMyVideos).catch(()=>{})} />
            </>
          )}
        </div>
      )}

      {/* Bottom Nav — TikTok style */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:"rgba(8,8,16,0.97)", backdropFilter:"blur(24px)", borderTop:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", zIndex:200, paddingBottom:"env(safe-area-inset-bottom,10px)", paddingTop:6 }}>
        {/* Home */}
        <button onClick={() => { setActiveTab("feed"); loadVideos(); window.scrollTo(0,0); }}
          style={{ flex:1, padding:"6px 0 4px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, WebkitTapHighlightColor:"transparent" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill={activeTab==="feed" ? "#fff" : "none"} stroke={activeTab==="feed" ? "#fff" : "#666"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <div style={{ fontSize:10, color: activeTab==="feed" ? "#fff" : "#666", fontWeight: activeTab==="feed" ? 700 : 400 }}>Home</div>
        </button>
        {/* Search/Explore */}
        <button onClick={() => setShowSearch(true)}
          style={{ flex:1, padding:"6px 0 4px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, WebkitTapHighlightColor:"transparent" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <div style={{ fontSize:10, color:"#666", fontWeight:400 }}>Explore</div>
        </button>
        {/* Center ➕ Post button — TikTok style */}
        <button onClick={() => requireAuth(() => setShowUpload(true))}
          style={{ flex:1, padding:"0 0 4px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, WebkitTapHighlightColor:"transparent", position:"relative" }}>
          <div style={{ position:"relative", width:46, height:32, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ position:"absolute", left:3, top:0, width:36, height:28, background:"#20d5ec", borderRadius:8 }} />
            <div style={{ position:"absolute", right:3, top:0, width:36, height:28, background:"#fe2c55", borderRadius:8 }} />
            <div style={{ position:"relative", width:36, height:28, background:"#fff", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", zIndex:1 }}>
              <span style={{ fontSize:20, fontWeight:900, color:"#000", lineHeight:1 }}>+</span>
            </div>
          </div>
          <div style={{ fontSize:10, color:"#666", fontWeight:400 }}>Post</div>
        </button>
        {/* Rec */}
        <button onClick={() => requireAuth(() => setShowGoLive(true))}
          style={{ flex:1, padding:"6px 0 4px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, WebkitTapHighlightColor:"transparent" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#e53935" stroke="none">
            <circle cx="12" cy="12" r="8"/>
          </svg>
          <div style={{ fontSize:10, color:"#e53935", fontWeight:700 }}>Rec</div>
        </button>
        {/* Profile / Me */}
        <button onClick={() => setActiveTab("profile")}
          style={{ flex:1, padding:"6px 0 4px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, WebkitTapHighlightColor:"transparent" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill={activeTab==="profile" ? "#fff" : "none"} stroke={activeTab==="profile" ? "#fff" : "#666"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <div style={{ fontSize:10, color: activeTab==="profile" ? "#fff" : "#666", fontWeight: activeTab==="profile" ? 700 : 400 }}>Me</div>
        </button>
      </div>

      {/* Search Sheet */}
      {showSearch && (
        <div style={{ position:"fixed", inset:0, zIndex:500, background:"#000", display:"flex", flexDirection:"column" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", paddingTop:"calc(env(safe-area-inset-top,0px) + 12px)", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ flex:1, display:"flex", alignItems:"center", background:"rgba(255,255,255,0.08)", borderRadius:22, padding:"8px 14px", gap:8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                      <video src={v.video_url} style={{ width:"100%", height:"100%", objectFit:"cover" }} muted playsInline preload="metadata" />
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
      {commentVideo && <CommentSheet video={commentVideo} currentUser={currentUser} onClose={() => setCommentVideo(null)} onCommentPosted={handleCommentCount} onNeedAuth={() => { setCommentVideo(null); setShowAuth(true); }} />}
      {showUpload && currentUser && <UploadModal currentUser={currentUser} onClose={() => setShowUpload(false)} onUploaded={() => { loadVideos(); setUploadToast(true); setTimeout(() => setUploadToast(false), 4000); }} />}
      {showGoLive && currentUser && <GoLiveModal currentUser={currentUser} onClose={() => setShowGoLive(false)} onUploaded={() => { loadVideos(); setUploadToast(true); setTimeout(() => setUploadToast(false), 4000); }} />}
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
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={(user) => { setCurrentUser(user); setShowAuth(false); setLoginToast(true); setTimeout(() => setLoginToast(false), 4000); }} />}
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
                    await request("PUT", `/apps/69b2ee18a8e6fb58c7f0261c/auth/me`, { full_name: editProfileName.trim() });
                    setCurrentUser(u => ({ ...u, full_name: editProfileName.trim() }));
                    setShowEditProfile(false);
                  } catch(e) { alert("Save failed: " + e.message); }
                  finally { setEditProfileSaving(false); }
                }}
                disabled={editProfileSaving}
                style={{ flex:2, padding:"12px 0", background:"linear-gradient(135deg,#e91e63,#9c27b0)",
                  border:"none", borderRadius:12, color:"#fff", fontSize:14, fontWeight:700,
                  cursor:editProfileSaving?"not-allowed":"pointer" }}>
                {editProfileSaving ? "Saving..." : "Save Name"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showAvatarPicker && <AvatarPickerModal currentAvatar={avatarUrl} onSelect={(url) => { setAvatarUrl(url); if(currentUser) localStorage.setItem(`avatar_${currentUser.id}`, url); setShowAvatarPicker(false); }} onClose={() => setShowAvatarPicker(false)} />}
    </div>
  );
}
