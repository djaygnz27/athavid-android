import { useState, useEffect, useRef } from "react";
import { auth, videos, comments, uploadFile } from "./api.js";

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
function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!email || !password) return setError("Please fill in all fields.");
    setLoading(true); setError("");
    try {
      if (mode === "signup") {
        await auth.signUp(email, password, name || email.split("@")[0]);
      } else {
        await auth.signIn(email, password);
      }
      const user = auth.getUser();
      onSuccess(user);
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:3000, display:"flex", alignItems:"flex-end" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.85)" }} />
      <div style={{ position:"relative", width:"100%", maxWidth:480, margin:"0 auto", background:"#0f0f1a", borderRadius:"24px 24px 0 0", padding:"24px 24px 48px", zIndex:3001 }}>
        <div style={{ width:40, height:4, background:"#333", borderRadius:99, margin:"0 auto 24px" }} />
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:36, marginBottom:8 }}>🎬</div>
          <div style={{ color:"#fff", fontWeight:900, fontSize:22, marginBottom:4 }}>Join Sachi</div>
          <div style={{ color:"#666", fontSize:14 }}>Create an account to post videos</div>
        </div>
        <div style={{ display:"flex", background:"rgba(255,255,255,0.06)", borderRadius:12, padding:4, marginBottom:20 }}>
          {["signup","login"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }}
              style={{ flex:1, padding:"10px 0", border:"none", borderRadius:10, cursor:"pointer", fontWeight:700, fontSize:14,
                background: mode === m ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "transparent",
                color: mode === m ? "#fff" : "#666" }}>
              {m === "signup" ? "Sign Up" : "Log In"}
            </button>
          ))}
        </div>
        {mode === "signup" && (
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
            style={{ width:"100%", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"13px 16px", color:"#fff", fontSize:15, outline:"none", boxSizing:"border-box", marginBottom:12 }} />
        )}
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" type="email"
          style={{ width:"100%", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"13px 16px", color:"#fff", fontSize:15, outline:"none", boxSizing:"border-box", marginBottom:12 }} />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password"
          onKeyDown={e => e.key === "Enter" && submit()}
          style={{ width:"100%", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"13px 16px", color:"#fff", fontSize:15, outline:"none", boxSizing:"border-box", marginBottom:16 }} />
        {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:12, textAlign:"center" }}>{error}</div>}
        <button onClick={submit} disabled={loading}
          style={{ width:"100%", padding:14, background:"linear-gradient(135deg,#ff6b6b,#ff8e53)", border:"none", borderRadius:14, color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Please wait..." : mode === "signup" ? "Create Account" : "Log In"}
        </button>
      </div>
    </div>
  );
}

// ── Comment Sheet ─────────────────────────────────────────────────────────────
function CommentSheet({ video, currentUser, onClose, onCommentPosted, onNeedAuth }) {
  const [list, setList] = useState([]);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!video) return;
    comments.list(video.id)
      .then(r => setList(Array.isArray(r) ? r : []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, [video?.id]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [list]);

  const post = async () => {
    if (!currentUser) { onNeedAuth(); return; }
    if (!text.trim()) return;
    setPosting(true);
    try {
      const username = currentUser.full_name || currentUser.email?.split("@")[0] || "user";
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
    } catch(e) { alert("Error: " + e.message); }
    finally { setPosting(false); }
  };

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
          {list.map(c => (
            <div key={c.id} style={{ display:"flex", gap:10, marginBottom:16 }}>
              <img src={c.avatar_url} style={{ width:36, height:36, borderRadius:"50%", border:"2px solid rgba(108,99,255,0.3)" }} />
              <div>
                <div style={{ color:"#ff6b6b", fontWeight:700, fontSize:13 }}>@{c.username}</div>
                <div style={{ color:"#ccc", fontSize:14 }}>{c.comment_text}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div style={{ padding:"12px 16px 32px", borderTop:"1px solid rgba(255,255,255,0.07)", flexShrink:0 }}>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && post()}
              placeholder={currentUser ? "Add a comment..." : "Log in to comment..."}
              style={{ flex:1, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:20, padding:"8px 14px", color:"#fff", fontSize:14, outline:"none" }} />
            <button onClick={post} disabled={posting}
              style={{ background:"linear-gradient(135deg,#ff6b6b,#ff8e53)", border:"none", borderRadius:"50%", width:36, height:36, color:"#fff", cursor:"pointer", fontSize:16 }}>➤</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Upload Modal ──────────────────────────────────────────────────────────────
function UploadModal({ currentUser, onClose, onUploaded }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState("");
  const fileRef = useRef();

  const upload = async () => {
    if (!file) return;
    setUploading(true); setProgress(10);
    try {
      setStep("Generating thumbnail..."); 
      const thumbnail_url = await captureThumbnail(file);
      setProgress(35);
      setStep("Uploading video...");
      const video_url = await uploadFile(file);
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
      alert("Upload failed: " + e.message);
      setUploading(false); setProgress(0); setStep("");
    }
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:2000, display:"flex", alignItems:"flex-end" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.85)" }} />
      <div style={{ position:"relative", width:"100%", maxWidth:480, margin:"0 auto", background:"#0f0f1a", borderRadius:"24px 24px 0 0", padding:"24px 24px 48px", zIndex:2001 }}>
        <div style={{ width:40, height:4, background:"#444", borderRadius:99, margin:"0 auto 20px" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>📹 Post a Video</div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:"50%", width:32, height:32, color:"#fff", cursor:"pointer" }}>✕</button>
        </div>
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
        <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Write a caption... #hashtags" rows={3}
          style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:12, color:"#fff", fontSize:14, resize:"none", outline:"none", boxSizing:"border-box", marginBottom:16 }} />
        {uploading && (
          <div style={{ marginBottom:16 }}>
            <div style={{ color:"#aaa", fontSize:13, marginBottom:6 }}>{step}</div>
            <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:99, height:6, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#ff6b6b,#ff8e53)", borderRadius:99, transition:"width 0.4s ease" }} />
            </div>
          </div>
        )}
        <button onClick={upload} disabled={!file || uploading}
          style={{ width:"100%", padding:14, background: file && !uploading ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "rgba(255,255,255,0.08)", border:"none", borderRadius:14, color:"#fff", fontWeight:800, fontSize:16, cursor: file && !uploading ? "pointer" : "not-allowed", opacity: file && !uploading ? 1 : 0.5 }}>
          {uploading ? step : "🚀 Post Video"}
        </button>
      </div>
    </div>
  );
}

// ── Video Card ────────────────────────────────────────────────────────────────
function VideoCard({ video, currentUser, onCommentOpen, onLike, onNeedAuth }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.play().catch(() => {}); setPlaying(true); }
      else { el.pause(); setPlaying(false); }
    }, { threshold: 0.6 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) { el.play(); setPlaying(true); } else { el.pause(); setPlaying(false); }
  };

  const handleLike = () => {
    if (!currentUser) { onNeedAuth(); return; }
    setLiked(l => !l);
    onLike(video.id, liked ? -1 : 1);
  };

  return (
    <div style={{ position:"relative", width:"100%", height:"100svh", background:"#000", flexShrink:0, scrollSnapAlign:"start" }}>
      <video ref={videoRef} src={video.video_url} poster={video.thumbnail_url}
        loop muted={muted} playsInline onClick={togglePlay}
        style={{ width:"100%", height:"100%", objectFit:"cover" }} />
      {!playing && (
        <div onClick={togglePlay} style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
          <div style={{ background:"rgba(0,0,0,0.45)", borderRadius:"50%", width:72, height:72, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ fontSize:30, marginLeft:6 }}>▶</div>
          </div>
        </div>
      )}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)", pointerEvents:"none" }} />
      <button onClick={() => setMuted(m => !m)}
        style={{ position:"absolute", top:16, right:16, background:"rgba(0,0,0,0.5)", border:"none", borderRadius:"50%", width:38, height:38, color:"#fff", cursor:"pointer", fontSize:16, zIndex:10 }}>
        {muted ? "🔇" : "🔊"}
      </button>
      <div style={{ position:"absolute", bottom:90, left:16, right:80, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
          <img src={video.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.username}`}
            style={{ width:44, height:44, borderRadius:"50%", border:"2px solid #ff6b6b" }} />
          <div>
            <div style={{ color:"#fff", fontWeight:800, fontSize:15 }}>{video.display_name || video.username}</div>
            <div style={{ color:"rgba(255,255,255,0.55)", fontSize:12 }}>@{video.username}</div>
          </div>
        </div>
        <div style={{ color:"#fff", fontSize:14, lineHeight:1.5 }}>{video.caption}</div>
        {video.hashtags?.length > 0 && (
          <div style={{ color:"#ff8e53", fontSize:13, marginTop:4 }}>
            {video.hashtags.slice(0,4).map(t => `#${t.replace(/^#/,"")}`).join(" ")}
          </div>
        )}
      </div>
      <div style={{ position:"absolute", bottom:90, right:12, display:"flex", flexDirection:"column", alignItems:"center", gap:20, zIndex:10 }}>
        <button onClick={handleLike} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
          <div style={{ fontSize:30 }}>{liked ? "❤️" : "🤍"}</div>
          <div style={{ color:"#fff", fontSize:12, fontWeight:700 }}>{formatCount((video.likes_count||0)+(liked?1:0))}</div>
        </button>
        <button onClick={() => onCommentOpen(video)} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
          <div style={{ fontSize:28 }}>💬</div>
          <div style={{ color:"#fff", fontSize:12, fontWeight:700 }}>{formatCount(video.comments_count)}</div>
        </button>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
          <div style={{ fontSize:26 }}>👁</div>
          <div style={{ color:"#fff", fontSize:12, fontWeight:700 }}>{formatCount(video.views_count)}</div>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(() => auth.getUser());
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("feed");
  const [commentVideo, setCommentVideo] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [myVideos, setMyVideos] = useState([]);

  useEffect(() => { loadVideos(); }, []);

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

  const handleCommentCount = (videoId, count) => {
    setVideoList(vs => vs.map(v => v.id === videoId ? { ...v, comments_count: count } : v));
  };

  const requireAuth = (cb) => { if (currentUser) cb(); else setShowAuth(true); };

  const username = currentUser?.full_name || currentUser?.email?.split("@")[0] || "";

  return (
    <div style={{ background:"#000", minHeight:"100svh", maxWidth:480, margin:"0 auto", position:"relative", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", overflow:"hidden" }}>

      {/* Header */}
      <div style={{ position:"fixed", top:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, zIndex:100, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"linear-gradient(to bottom,rgba(0,0,0,0.75),transparent)" }}>
        <div style={{ fontSize:26, fontWeight:900, background:"linear-gradient(135deg,#ff6b6b,#ff8e53)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>sachi</div>
        {currentUser
          ? <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} style={{ width:34, height:34, borderRadius:"50%", border:"2px solid #ff6b6b" }} />
              <button onClick={() => { auth.signOut(); setCurrentUser(null); }} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:20, padding:"5px 12px", color:"#aaa", fontSize:12, cursor:"pointer" }}>Out</button>
            </div>
          : <button onClick={() => setShowAuth(true)} style={{ background:"linear-gradient(135deg,#ff6b6b,#ff8e53)", border:"none", borderRadius:20, padding:"6px 16px", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>Log In</button>
        }
      </div>

      {/* Feed */}
      {activeTab === "feed" && (
        <div style={{ height:"100svh", overflowY:"scroll", scrollSnapType:"y mandatory" }}>
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
          {videoList.map(v => (
            <VideoCard key={v.id} video={v} currentUser={currentUser}
              onCommentOpen={setCommentVideo}
              onLike={handleLike}
              onNeedAuth={() => setShowAuth(true)} />
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
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} style={{ width:80, height:80, borderRadius:"50%", border:"3px solid #ff6b6b", marginBottom:12 }} />
                <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>{currentUser.full_name || username}</div>
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
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:2 }}>
                {myVideos.length === 0
                  ? <div style={{ gridColumn:"1/-1", textAlign:"center", padding:40, color:"#555" }}>
                      <div style={{ fontSize:40, marginBottom:8 }}>📹</div>
                      <div>No videos yet</div>
                    </div>
                  : myVideos.map(v => (
                    <div key={v.id} style={{ aspectRatio:"9/16", background:"#111", overflow:"hidden" }}>
                      {v.thumbnail_url
                        ? <img src={v.thumbnail_url} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>🎬</div>}
                    </div>
                  ))
                }
              </div>
            </>
          )}
        </div>
      )}

      {/* Bottom Nav */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:"rgba(8,8,16,0.96)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", zIndex:200, paddingBottom:"env(safe-area-inset-bottom,16px)" }}>
        {[{ id:"feed", icon:"🏠", label:"Feed" }, { id:"post", icon:"➕", label:"Post" }, { id:"profile", icon:"👤", label:"Me" }].map(tab => (
          <button key={tab.id}
            onClick={() => tab.id === "post" ? requireAuth(() => setShowUpload(true)) : setActiveTab(tab.id)}
            style={{ flex:1, padding:"10px 0 8px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
            <div style={{ fontSize:22 }}>{tab.icon}</div>
            <div style={{ fontSize:10, color: activeTab === tab.id ? "#ff6b6b" : "#555", fontWeight: activeTab === tab.id ? 700 : 400 }}>{tab.label}</div>
          </button>
        ))}
      </div>

      {commentVideo && <CommentSheet video={commentVideo} currentUser={currentUser} onClose={() => setCommentVideo(null)} onCommentPosted={handleCommentCount} onNeedAuth={() => { setCommentVideo(null); setShowAuth(true); }} />}
      {showUpload && currentUser && <UploadModal currentUser={currentUser} onClose={() => setShowUpload(false)} onUploaded={loadVideos} />}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={(user) => { setCurrentUser(user); setShowAuth(false); }} />}
    </div>
  );
}
