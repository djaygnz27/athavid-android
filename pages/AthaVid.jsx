import { useState, useEffect, useRef } from "react";
import { AthaVidVideo, AthaVidComment, AthaVidUser, User } from "../api/entities";
import { base44 } from "../api/base44Client";

function formatCount(n) {
  if (!n) return "0";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

async function captureVideoThumbnail(file) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
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
          try {
            const { file_url } = await base44.integrations.Core.UploadFile({ file: thumbFile });
            resolve(file_url);
          } catch { resolve(null); }
        }, "image/jpeg", 0.85);
      } catch { URL.revokeObjectURL(url); resolve(null); }
    };
    video.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
  });
}

async function uploadVideoFile(file) {
  const { file_url } = await base44.integrations.Core.UploadFile({ file });
  if (!file_url) throw new Error("Upload succeeded but no URL returned");
  return file_url;
}

// ── Comment Sheet ─────────────────────────────────────────────────────────────
function CommentSheet({ video, currentUser, onClose, onCommentPosted }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!video) return;
    AthaVidComment.filter({ video_id: video.id })
      .then(r => {
        const list = Array.isArray(r) ? r : [];
        setComments(list);
        if (list.length !== (video.comments_count || 0)) {
          AthaVidVideo.update(video.id, { comments_count: list.length }).catch(() => {});
          if (onCommentPosted) onCommentPosted(video.id, list.length);
        }
      })
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [video?.id]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [comments]);

  const post = async () => {
    if (!text.trim() || !currentUser) return;
    setPosting(true);
    try {
      const username = currentUser.username || currentUser.full_name || currentUser.email?.split("@")[0] || "user";
      const c = await AthaVidComment.create({
        video_id: video.id,
        username,
        avatar_url: currentUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        comment_text: text.trim(),
        likes_count: 0,
      });
      const newCount = comments.length + 1;
      setComments(prev => [...prev, c]);
      setText("");
      await AthaVidVideo.update(video.id, { comments_count: newCount });
      if (onCommentPosted) onCommentPosted(video.id, newCount);
      setTimeout(() => onClose(), 800);
    } catch(e) {
      alert("Could not post comment: " + e.message);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.7)" }} />
      <div style={{ position:"relative", background:"#1a1a2e", borderRadius:"24px 24px 0 0", maxHeight:"80vh", display:"flex", flexDirection:"column", zIndex:1001 }}>
        <div style={{ padding:"12px 16px 0", flexShrink:0 }}>
          <div style={{ width:40, height:4, background:"#444", borderRadius:99, margin:"0 auto 12px" }} />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ color:"#fff", fontWeight:700, fontSize:16 }}>💬 Comments {comments.length > 0 && `(${comments.length})`}</div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:"50%", width:30, height:30, color:"#fff", cursor:"pointer", fontSize:16 }}>✕</button>
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"0 16px 8px" }}>
          {loading && <div style={{ color:"#666", textAlign:"center", padding:32 }}>Loading...</div>}
          {!loading && comments.length === 0 && (
            <div style={{ color:"#555", textAlign:"center", padding:40 }}>
              <div style={{ fontSize:36, marginBottom:8 }}>💬</div>
              <div style={{ fontSize:14 }}>No comments yet. Be first!</div>
            </div>
          )}
          {comments.map(c => (
            <div key={c.id} style={{ display:"flex", gap:10, marginBottom:16, alignItems:"flex-start" }}>
              <img src={c.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.username}`} style={{ width:36, height:36, borderRadius:"50%", flexShrink:0, border:"2px solid rgba(108,99,255,0.3)" }} />
              <div style={{ flex:1 }}>
                <div style={{ color:"#ff6b6b", fontWeight:700, fontSize:13, marginBottom:2 }}>@{c.username}</div>
                <div style={{ color:"#ccc", fontSize:14, lineHeight:1.4 }}>{c.comment_text}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        {currentUser && (
          <div style={{ padding:"12px 16px 24px", borderTop:"1px solid rgba(255,255,255,0.07)", flexShrink:0 }}>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <img src={currentUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.email}`} style={{ width:32, height:32, borderRadius:"50%", border:"2px solid #ff6b6b" }} />
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && post()}
                placeholder="Add a comment..."
                style={{ flex:1, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:20, padding:"8px 14px", color:"#fff", fontSize:14, outline:"none" }}
              />
              <button onClick={post} disabled={posting || !text.trim()} style={{ background:"linear-gradient(135deg,#ff6b6b,#ff8e53)", border:"none", borderRadius:"50%", width:36, height:36, color:"#fff", cursor:"pointer", fontSize:16, opacity: posting || !text.trim() ? 0.5 : 1 }}>➤</button>
            </div>
          </div>
        )}
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
  const [step, setStep] = useState("idle");
  const fileRef = useRef();

  const handleFile = (f) => {
    if (!f || !f.type.startsWith("video/")) return alert("Please select a video file.");
    if (f.size > 500 * 1024 * 1024) return alert("File too large. Max 500MB.");
    setFile(f);
  };

  const upload = async () => {
    if (!file || !currentUser) return;
    setUploading(true);
    setProgress(10);
    try {
      setStep("Generating thumbnail...");
      const thumbnail_url = await captureVideoThumbnail(file);
      setProgress(30);
      setStep("Uploading video...");
      const video_url = await uploadVideoFile(file);
      setProgress(80);
      setStep("Saving to feed...");
      const username = currentUser.username || currentUser.full_name || currentUser.email?.split("@")[0] || "user";
      const tags = (caption.match(/#\w+/g) || []).map(t => t.toLowerCase());
      await AthaVidVideo.create({
        user_id: currentUser.id,
        username,
        display_name: currentUser.full_name || username,
        avatar_url: currentUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        video_url,
        thumbnail_url,
        caption: caption.trim(),
        hashtags: tags,
        likes_count: 0, comments_count: 0, views_count: 0, shares_count: 0,
        is_approved: true, is_archived: false, is_ai_detected: false,
      });
      setProgress(100);
      setStep("Done!");
      setTimeout(() => { onUploaded(); onClose(); }, 800);
    } catch(e) {
      alert("Upload failed: " + e.message);
      setUploading(false);
      setProgress(0);
      setStep("idle");
    }
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:2000, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.85)" }} />
      <div style={{ position:"relative", width:"100%", maxWidth:480, background:"#0f0f1a", borderRadius:"24px 24px 0 0", padding:24, zIndex:2001 }}>
        <div style={{ width:40, height:4, background:"#444", borderRadius:99, margin:"0 auto 20px" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>📹 Upload Video</div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:"50%", width:32, height:32, color:"#fff", cursor:"pointer" }}>✕</button>
        </div>

        {!file ? (
          <div
            onClick={() => fileRef.current?.click()}
            style={{ border:"2px dashed rgba(255,107,107,0.4)", borderRadius:16, padding:40, textAlign:"center", cursor:"pointer", marginBottom:16 }}
          >
            <div style={{ fontSize:48, marginBottom:12 }}>🎬</div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:16, marginBottom:6 }}>Tap to select video</div>
            <div style={{ color:"#666", fontSize:13 }}>MP4, MOV, WebM — max 500MB</div>
            <input ref={fileRef} type="file" accept="video/*" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />
          </div>
        ) : (
          <div style={{ background:"rgba(255,107,107,0.08)", border:"1px solid rgba(255,107,107,0.2)", borderRadius:12, padding:14, marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ fontSize:32 }}>🎥</div>
            <div style={{ flex:1 }}>
              <div style={{ color:"#fff", fontWeight:600, fontSize:14 }}>{file.name}</div>
              <div style={{ color:"#888", fontSize:12 }}>{(file.size / 1024 / 1024).toFixed(1)} MB</div>
            </div>
            <button onClick={() => setFile(null)} style={{ background:"none", border:"none", color:"#ff6b6b", cursor:"pointer", fontSize:18 }}>✕</button>
          </div>
        )}

        <textarea
          value={caption}
          onChange={e => setCaption(e.target.value)}
          placeholder="Write a caption... #hashtags"
          rows={3}
          style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:12, color:"#fff", fontSize:14, resize:"none", outline:"none", boxSizing:"border-box", marginBottom:16 }}
        />

        {uploading && (
          <div style={{ marginBottom:16 }}>
            <div style={{ color:"#aaa", fontSize:13, marginBottom:6 }}>{step}</div>
            <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:99, height:6, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#ff6b6b,#ff8e53)", borderRadius:99, transition:"width 0.3s ease" }} />
            </div>
          </div>
        )}

        <button
          onClick={upload}
          disabled={!file || uploading}
          style={{ width:"100%", padding:"14px", background: file && !uploading ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "rgba(255,255,255,0.08)", border:"none", borderRadius:14, color:"#fff", fontWeight:800, fontSize:16, cursor: file && !uploading ? "pointer" : "not-allowed", opacity: file && !uploading ? 1 : 0.5 }}
        >
          {uploading ? `${step}` : "🚀 Post Video"}
        </button>
      </div>
    </div>
  );
}

// ── Video Card ─────────────────────────────────────────────────────────────────
function VideoCard({ video, currentUser, onCommentOpen, onLike }) {
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
    setLiked(l => !l);
    onLike(video.id, liked ? -1 : 1);
  };

  return (
    <div style={{ position:"relative", width:"100%", height:"100vh", background:"#000", flexShrink:0, scrollSnapAlign:"start" }}>
      <video
        ref={videoRef}
        src={video.video_url}
        poster={video.thumbnail_url}
        loop muted={muted} playsInline
        onClick={togglePlay}
        style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
      />

      {/* play/pause overlay */}
      {!playing && (
        <div onClick={togglePlay} style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
          <div style={{ background:"rgba(0,0,0,0.4)", borderRadius:"50%", width:72, height:72, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ fontSize:32, marginLeft:6 }}>▶</div>
          </div>
        </div>
      )}

      {/* gradient overlay */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)", pointerEvents:"none" }} />

      {/* mute toggle */}
      <button onClick={() => setMuted(m => !m)} style={{ position:"absolute", top:16, right:16, background:"rgba(0,0,0,0.5)", border:"none", borderRadius:"50%", width:38, height:38, color:"#fff", cursor:"pointer", fontSize:16, zIndex:10 }}>
        {muted ? "🔇" : "🔊"}
      </button>

      {/* user info + caption */}
      <div style={{ position:"absolute", bottom:90, left:16, right:80, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
          <img src={video.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.username}`} style={{ width:44, height:44, borderRadius:"50%", border:"2px solid #ff6b6b" }} />
          <div>
            <div style={{ color:"#fff", fontWeight:800, fontSize:15 }}>{video.display_name || video.username}</div>
            <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12 }}>@{video.username}</div>
          </div>
        </div>
        <div style={{ color:"#fff", fontSize:14, lineHeight:1.5, maxHeight:80, overflow:"hidden" }}>{video.caption}</div>
        {video.hashtags?.length > 0 && (
          <div style={{ color:"#ff8e53", fontSize:13, marginTop:4 }}>{video.hashtags.slice(0,4).map(t => `#${t.replace(/^#/,"")}`).join(" ")}</div>
        )}
      </div>

      {/* action buttons */}
      <div style={{ position:"absolute", bottom:90, right:12, display:"flex", flexDirection:"column", alignItems:"center", gap:20, zIndex:10 }}>
        <button onClick={handleLike} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <div style={{ fontSize:30, filter: liked ? "none" : "grayscale(0.3)" }}>{liked ? "❤️" : "🤍"}</div>
          <div style={{ color:"#fff", fontSize:12, fontWeight:700 }}>{formatCount((video.likes_count || 0) + (liked ? 1 : 0))}</div>
        </button>
        <button onClick={() => onCommentOpen(video)} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <div style={{ fontSize:28 }}>💬</div>
          <div style={{ color:"#fff", fontSize:12, fontWeight:700 }}>{formatCount(video.comments_count)}</div>
        </button>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <div style={{ fontSize:28 }}>👁</div>
          <div style={{ color:"#fff", fontSize:12, fontWeight:700 }}>{formatCount(video.views_count)}</div>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function AthaVidApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("feed");
  const [commentVideo, setCommentVideo] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [myVideos, setMyVideos] = useState([]);

  // Load current user from Base44 session
  useEffect(() => {
    User.me().then(u => setCurrentUser(u)).catch(() => setCurrentUser(null));
  }, []);

  // Load feed
  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const all = await AthaVidVideo.filter({ is_approved: true, is_archived: false });
      setVideos(Array.isArray(all) ? all.sort((a,b) => new Date(b.created_date) - new Date(a.created_date)) : []);
    } catch { setVideos([]); }
    setLoading(false);
  };

  // Load my videos when profile tab opens
  useEffect(() => {
    if (activeTab === "profile" && currentUser) {
      AthaVidVideo.filter({ user_id: currentUser.id })
        .then(r => setMyVideos(Array.isArray(r) ? r : []))
        .catch(() => setMyVideos([]));
    }
  }, [activeTab, currentUser]);

  const handleLike = async (videoId, delta) => {
    setVideos(vs => vs.map(v => v.id === videoId ? { ...v, likes_count: Math.max(0, (v.likes_count || 0) + delta) } : v));
    const vid = videos.find(v => v.id === videoId);
    if (vid) AthaVidVideo.update(videoId, { likes_count: Math.max(0, (vid.likes_count || 0) + delta) }).catch(() => {});
  };

  const handleCommentCount = (videoId, count) => {
    setVideos(vs => vs.map(v => v.id === videoId ? { ...v, comments_count: count } : v));
  };

  const username = currentUser?.username || currentUser?.full_name || currentUser?.email?.split("@")[0] || "you";
  const avatarUrl = currentUser?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

  return (
    <div style={{ background:"#000", minHeight:"100vh", maxWidth:480, margin:"0 auto", position:"relative", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>

      {/* Header */}
      <div style={{ position:"fixed", top:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, zIndex:100, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)" }}>
        <div style={{ fontSize:24, fontWeight:900, background:"linear-gradient(135deg,#ff6b6b,#ff8e53)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>sachi</div>
        {currentUser && (
          <img src={avatarUrl} style={{ width:34, height:34, borderRadius:"50%", border:"2px solid #ff6b6b" }} />
        )}
      </div>

      {/* Feed Tab */}
      {activeTab === "feed" && (
        <div style={{ height:"100vh", overflowY:"scroll", scrollSnapType:"y mandatory" }}>
          {loading && (
            <div style={{ height:"100vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
              <div style={{ fontSize:48 }}>🎬</div>
              <div style={{ color:"#fff", fontSize:16 }}>Loading feed...</div>
            </div>
          )}
          {!loading && videos.length === 0 && (
            <div style={{ height:"100vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
              <div style={{ fontSize:64 }}>🎬</div>
              <div style={{ color:"#fff", fontWeight:800, fontSize:22 }}>No videos yet</div>
              <div style={{ color:"#888", fontSize:15 }}>Be the first to post!</div>
              <button onClick={() => setShowUpload(true)} style={{ marginTop:16, background:"linear-gradient(135deg,#ff6b6b,#ff8e53)", border:"none", borderRadius:14, padding:"12px 28px", color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer" }}>+ Upload Video</button>
            </div>
          )}
          {videos.map(v => (
            <VideoCard key={v.id} video={v} currentUser={currentUser} onCommentOpen={setCommentVideo} onLike={handleLike} />
          ))}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div style={{ paddingTop:70, paddingBottom:80, minHeight:"100vh", background:"#0a0a14" }}>
          <div style={{ padding:"20px 20px 0", textAlign:"center" }}>
            <img src={avatarUrl} style={{ width:80, height:80, borderRadius:"50%", border:"3px solid #ff6b6b", marginBottom:12 }} />
            <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>{currentUser?.full_name || username}</div>
            <div style={{ color:"#888", fontSize:14 }}>@{username}</div>
            <div style={{ color:"#666", fontSize:13, marginTop:4 }}>{currentUser?.email}</div>
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
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:2, padding:"0 2px" }}>
            {myVideos.map(v => (
              <div key={v.id} style={{ aspectRatio:"9/16", background:"#111", position:"relative", overflow:"hidden" }}>
                {v.thumbnail_url
                  ? <img src={v.thumbnail_url} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>🎬</div>}
              </div>
            ))}
            {myVideos.length === 0 && (
              <div style={{ gridColumn:"1/-1", textAlign:"center", padding:40, color:"#555" }}>
                <div style={{ fontSize:40, marginBottom:8 }}>📹</div>
                <div>No videos yet</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:"rgba(10,10,20,0.95)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", zIndex:200, paddingBottom:"env(safe-area-inset-bottom)" }}>
        {[
          { id:"feed", icon:"🏠", label:"Feed" },
          { id:"upload", icon:"➕", label:"Post" },
          { id:"profile", icon:"👤", label:"Profile" },
        ].map(tab => (
          <button key={tab.id} onClick={() => tab.id === "upload" ? setShowUpload(true) : setActiveTab(tab.id)}
            style={{ flex:1, padding:"10px 0 8px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
            <div style={{ fontSize:22 }}>{tab.icon}</div>
            <div style={{ fontSize:10, color: activeTab === tab.id ? "#ff6b6b" : "#555", fontWeight: activeTab === tab.id ? 700 : 400 }}>{tab.label}</div>
          </button>
        ))}
      </div>

      {/* Modals */}
      {commentVideo && (
        <CommentSheet video={commentVideo} currentUser={currentUser} onClose={() => setCommentVideo(null)} onCommentPosted={handleCommentCount} />
      )}
      {showUpload && (
        <UploadModal currentUser={currentUser} onClose={() => setShowUpload(false)} onUploaded={loadVideos} />
      )}
    </div>
  );
}
