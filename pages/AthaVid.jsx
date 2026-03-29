import { useState, useEffect, useRef } from "react";
import { AthaVidVideo, AthaVidComment } from "../api/entities";
import { base44 } from "../api/base44Client";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatCount(n) {
  if (!n) return "0";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

// ── Upload helper ─────────────────────────────────────────────────────────────
async function uploadVideoFile(file) {
  // Use Base44 SDK built-in UploadFile — works directly in the browser
  const { file_url } = await base44.integrations.Core.UploadFile({ file });
  if (!file_url) throw new Error("Upload succeeded but no URL returned");
  return file_url;
}

// ── Splash ────────────────────────────────────────────────────────────────────
function Splash() {
  return (
    <div style={{ position:"fixed",inset:0,background:"#050510",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:9999 }}>
      <div style={{ fontSize:64, marginBottom:16 }}>🎬</div>
      <div style={{ fontSize:36, fontWeight:900, background:"linear-gradient(135deg,#6c63ff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>AthaVid</div>
      <div style={{ color:"#666", fontSize:14, marginTop:8 }}>Real People. Real Moments.</div>
    </div>
  );
}

// ── Comment Sheet ─────────────────────────────────────────────────────────────
function CommentSheet({ video, onClose, onCommentPosted }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!video) return;
    AthaVidComment.filter({ video_id: video.id })
      .then(r => setComments(Array.isArray(r) ? r : []))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [video?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const post = async () => {
    if (!text.trim()) return;
    if (!name.trim()) return;
    setPosting(true);
    try {
      const c = await AthaVidComment.create({
        video_id: video.id,
        username: name.trim().replace(/^@/, ""),
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.trim()}`,
        comment_text: text.trim(),
        likes_count: 0,
      });
      const newCount = (video.comments_count || 0) + 1;
      setComments(prev => [...prev, c]);
      setText("");
      setName("");
      // bump comment count in DB
      await AthaVidVideo.update(video.id, { comments_count: newCount });
      // update count in feed immediately
      if (onCommentPosted) onCommentPosted(video.id, newCount);
      // close sheet after posting
      setTimeout(() => onClose(), 800);
    } catch(e) {
      alert("Could not post comment: " + e.message);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
      {/* backdrop */}
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.7)" }} />
      {/* sheet — sits above everything including bottom nav */}
      <div style={{ position:"relative", background:"#1a1a2e", borderRadius:"24px 24px 0 0", maxHeight:"80vh", display:"flex", flexDirection:"column", zIndex:1001 }}>
        {/* handle + header */}
        <div style={{ padding:"12px 16px 0", flexShrink:0 }}>
          <div style={{ width:40, height:4, background:"#444", borderRadius:99, margin:"0 auto 12px" }} />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ color:"#fff", fontWeight:700, fontSize:16 }}>💬 Comments {comments.length > 0 && `(${comments.length})`}</div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:"50%", width:30, height:30, color:"#fff", cursor:"pointer", fontSize:16 }}>✕</button>
          </div>
        </div>

        {/* comment list */}
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
                <div style={{ color:"#a78bfa", fontSize:12, fontWeight:700, marginBottom:3 }}>@{c.username}</div>
                <div style={{ color:"#eee", fontSize:14, lineHeight:1.4 }}>{c.comment_text}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* input area — always visible, never hidden */}
        <div style={{ flexShrink:0, borderTop:"1px solid rgba(255,255,255,0.1)", background:"#12122a", padding:"14px 16px 28px" }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name or @username"
            style={{ width:"100%", background:"rgba(255,255,255,0.09)", border:"1.5px solid rgba(108,99,255,0.4)", borderRadius:12, padding:"11px 14px", color:"#fff", fontSize:14, outline:"none", marginBottom:10, display:"block" }}
          />
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Write your comment here..."
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); post(); } }}
            style={{ width:"100%", background:"rgba(255,255,255,0.09)", border:"1.5px solid rgba(108,99,255,0.4)", borderRadius:12, padding:"11px 14px", color:"#fff", fontSize:14, outline:"none", marginBottom:12, display:"block" }}
          />
          <button
            onClick={post}
            disabled={posting || !text.trim() || !name.trim()}
            style={{ width:"100%", padding:"14px", background: (posting || !text.trim() || !name.trim()) ? "#2a2a3e" : "linear-gradient(135deg,#6c63ff,#a78bfa)", border:"none", borderRadius:12, color: (posting || !text.trim() || !name.trim()) ? "#555" : "#fff", fontWeight:700, fontSize:16, cursor: (posting || !text.trim() || !name.trim()) ? "not-allowed" : "pointer", letterSpacing:"0.3px" }}
          >
            {posting ? "Posting..." : "💬 Post Comment"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Video Card ────────────────────────────────────────────────────────────────
function VideoCard({ video, liked, onLike, onComment }) {
  const vidRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const toggle = () => {
    if (!vidRef.current) return;
    if (playing) { vidRef.current.pause(); setPlaying(false); }
    else { vidRef.current.play().then(() => setPlaying(true)).catch(() => {}); }
  };

  return (
    <div style={{ position:"relative", width:"100%", height:"calc(100vh - 56px)", background:"#000", flexShrink:0, overflow:"hidden" }}>
      <video
        ref={vidRef}
        src={video.video_url}
        poster={video.thumbnail_url}
        loop playsInline muted={muted}
        style={{ width:"100%", height:"100%", objectFit:"cover" }}
        onClick={toggle}
      />
      {/* gradient */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)", pointerEvents:"none" }} />
      {/* info */}
      <div style={{ position:"absolute", bottom:24, left:16, right:72, color:"#fff" }}>
        <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>@{video.username}</div>
        <div style={{ fontSize:13, opacity:0.9, marginBottom:6, lineHeight:1.4 }}>{video.caption}</div>
        {(video.hashtags || []).map(h => (
          <span key={h} style={{ color:"#a78bfa", fontSize:12, marginRight:6 }}>#{h}</span>
        ))}
      </div>
      {/* actions */}
      <div style={{ position:"absolute", right:12, bottom:30, display:"flex", flexDirection:"column", alignItems:"center", gap:22 }}>
        <button onClick={onLike} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
          <span style={{ fontSize:30 }}>{liked ? "❤️" : "🤍"}</span>
          <span style={{ color:"#fff", fontSize:11, fontWeight:700 }}>{formatCount((video.likes_count || 0) + (liked ? 1 : 0))}</span>
        </button>
        <button onClick={onComment} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
          <span style={{ fontSize:28 }}>💬</span>
          <span style={{ color:"#fff", fontSize:11, fontWeight:700 }}>{formatCount(video.comments_count)}</span>
        </button>
        <button onClick={() => setMuted(m => !m)} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
          <span style={{ fontSize:26 }}>{muted ? "🔇" : "🔊"}</span>
          <span style={{ color:"#fff", fontSize:10 }}>{muted ? "Unmute" : "Mute"}</span>
        </button>
      </div>
      {/* play indicator */}
      {!playing && (
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:56, opacity:0.6, pointerEvents:"none" }}>▶️</div>
      )}
    </div>
  );
}

// ── Feed ──────────────────────────────────────────────────────────────────────
function FeedPage({ likedVideos, onLike }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeComment, setActiveComment] = useState(null);

  const handleCommentPosted = (videoId, newCount) => {
    setVideos(prev => prev.map(v => v.id === videoId ? { ...v, comments_count: newCount } : v));
    setActiveComment(prev => prev && prev.id === videoId ? { ...prev, comments_count: newCount } : prev);
  };

  useEffect(() => {
    AthaVidVideo.list()
      .then(r => setVideos(Array.isArray(r) ? r.filter(v => !v.is_archived) : []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ color:"#a78bfa", textAlign:"center", paddingTop:200, fontSize:18 }}>Loading...</div>
  );

  if (!videos.length) return (
    <div style={{ color:"#666", textAlign:"center", paddingTop:200 }}>
      <div style={{ fontSize:48, marginBottom:16 }}>🎬</div>
      <div style={{ fontSize:18, color:"#a78bfa", fontWeight:700 }}>No videos yet</div>
      <div style={{ fontSize:14, marginTop:8 }}>Be the first to post!</div>
    </div>
  );

  return (
    <>
      <div style={{ height:"calc(100vh - 56px)", overflowY:"scroll", scrollSnapType:"y mandatory" }}>
        {videos.map(v => (
          <div key={v.id} style={{ scrollSnapAlign:"start" }}>
            <VideoCard
              video={v}
              liked={likedVideos.has(v.id)}
              onLike={() => onLike(v.id)}
              onComment={() => setActiveComment(v)}
            />
          </div>
        ))}
      </div>
      {activeComment && (
        <CommentSheet video={activeComment} onClose={() => setActiveComment(null)} onCommentPosted={handleCommentPosted} />
      )}
    </>
  );
}

// ── Upload ────────────────────────────────────────────────────────────────────
function UploadPage({ onVideoPosted }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [username, setUsername] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const pickFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async () => {
    if (!file) return setError("Please select a video");
    if (!caption.trim()) return setError("Please add a caption");
    if (!username.trim()) return setError("Please enter a username");
    setError(""); setUploading(true); setProgress(10);
    try {
      setProgress(30);
      const videoUrl = await uploadVideoFile(file);
      setProgress(70);
      const clean = username.trim().replace(/^@/, "");
      const record = await AthaVidVideo.create({
        username: clean,
        display_name: clean,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${clean}`,
        caption: caption.trim(),
        hashtags: hashtags.split(/[\s,#]+/).filter(Boolean),
        video_url: videoUrl,
        thumbnail_url: `https://picsum.photos/seed/${Date.now()}/500/880`,
        likes_count: 0, comments_count: 0, views_count: 0, shares_count: 0,
        is_archived: false, is_ai_detected: false, is_approved: true,
        archive_date: new Date(Date.now() + 30 * 86400000).toISOString(),
        duration_seconds: 0,
      });
      setProgress(100);
      setDone(true);
      setTimeout(() => onVideoPosted && onVideoPosted(record), 2000);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (done) return (
    <div style={{ minHeight:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, textAlign:"center" }}>
      <div style={{ fontSize:80, marginBottom:16 }}>🎉</div>
      <div style={{ color:"#a78bfa", fontSize:26, fontWeight:800 }}>Video Posted!</div>
      <div style={{ color:"#888", fontSize:14, marginTop:8 }}>Returning to feed...</div>
    </div>
  );

  return (
    <div style={{ padding:24, paddingTop:60, minHeight:"100%" }}>
      <div style={{ color:"#fff", fontSize:22, fontWeight:800, marginBottom:24 }}>Post a Video</div>
      <label style={{ display:"block", border:"2px dashed #6c63ff", borderRadius:16, padding:32, textAlign:"center", cursor:"pointer", marginBottom:16 }}>
        <input type="file" accept="video/*" onChange={pickFile} style={{ display:"none" }} />
        {preview ? (
          <video src={preview} style={{ width:"100%", maxHeight:200, borderRadius:8, objectFit:"cover" }} muted />
        ) : (
          <>
            <div style={{ fontSize:48 }}>📹</div>
            <div style={{ color:"#a78bfa", fontWeight:600, marginTop:8 }}>Tap to select video</div>
            <div style={{ color:"#666", fontSize:12, marginTop:4 }}>MP4, MOV — any size</div>
          </>
        )}
      </label>
      {[
        { label:"Your username", val:username, set:setUsername, ph:"e.g. jaygnz27" },
        { label:"Caption", val:caption, set:setCaption, ph:"What's this video about?" },
        { label:"Hashtags", val:hashtags, set:setHashtags, ph:"athavid reallife nj" },
      ].map(({ label, val, set, ph }) => (
        <div key={label} style={{ marginBottom:14 }}>
          <div style={{ color:"#aaa", fontSize:12, marginBottom:4 }}>{label}</div>
          <input
            value={val} onChange={e => set(e.target.value)} placeholder={ph}
            style={{ width:"100%", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 14px", color:"#fff", fontSize:14, outline:"none" }}
          />
        </div>
      ))}
      {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:12 }}>{error}</div>}
      {uploading && (
        <div style={{ marginBottom:16 }}>
          <div style={{ background:"rgba(255,255,255,0.1)", borderRadius:99, height:6 }}>
            <div style={{ background:"linear-gradient(90deg,#6c63ff,#a78bfa)", borderRadius:99, height:6, width:progress + "%", transition:"width 0.4s" }} />
          </div>
          <div style={{ color:"#a78bfa", fontSize:12, marginTop:6, textAlign:"center" }}>{progress < 60 ? "Uploading video..." : "Saving to feed..."}</div>
        </div>
      )}
      <button
        onClick={submit} disabled={uploading}
        style={{ width:"100%", padding:"16px", background: uploading ? "#333" : "linear-gradient(135deg,#6c63ff,#a78bfa)", border:"none", borderRadius:14, color:"#fff", fontSize:16, fontWeight:700, cursor: uploading ? "not-allowed" : "pointer" }}
      >
        {uploading ? "Posting..." : "🚀 Post Video"}
      </button>
    </div>
  );
}

// ── Profile ───────────────────────────────────────────────────────────────────
function ProfilePage() {
  return (
    <div style={{ padding:32, textAlign:"center", paddingTop:80 }}>
      <div style={{ fontSize:64, marginBottom:16 }}>👤</div>
      <div style={{ color:"#a78bfa", fontSize:20, fontWeight:700 }}>Your Profile</div>
      <div style={{ color:"#666", fontSize:14, marginTop:8 }}>Coming soon</div>
    </div>
  );
}

// ── Explore ───────────────────────────────────────────────────────────────────
function ExplorePage() {
  return (
    <div style={{ padding:32, textAlign:"center", paddingTop:80 }}>
      <div style={{ fontSize:64, marginBottom:16 }}>🔍</div>
      <div style={{ color:"#a78bfa", fontSize:20, fontWeight:700 }}>Explore</div>
      <div style={{ color:"#666", fontSize:14, marginTop:8 }}>Coming soon</div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AthaVid() {
  const [tab, setTab] = useState("feed");
  const [liked, setLiked] = useState(new Set());
  const [splash, setSplash] = useState(true);
  const [feedKey, setFeedKey] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 2200);
    return () => clearTimeout(t);
  }, []);

  const onLike = id => setLiked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const onPosted = () => { setFeedKey(k => k + 1); setTab("feed"); };

  const tabs = [
    { key:"feed",    icon:"🏠", label:"Home"    },
    { key:"explore", icon:"🔍", label:"Explore" },
    { key:"upload",  icon:"➕", label:"Post"    },
    { key:"profile", icon:"👤", label:"Me"      },
  ];

  return (
    <div style={{ background:"#050510", minHeight:"100vh", maxWidth:480, margin:"0 auto", fontFamily:"'Inter',-apple-system,sans-serif", position:"relative" }}>
      <style>{`* { box-sizing: border-box } ::-webkit-scrollbar { display: none } body { background: #050510; margin: 0 }`}</style>
      {splash && <Splash />}
      <div style={{ height:"calc(100vh - 56px)", overflowY:"auto" }}>
        {tab === "feed"    && <FeedPage key={feedKey} likedVideos={liked} onLike={onLike} />}
        {tab === "explore" && <ExplorePage />}
        {tab === "upload"  && <UploadPage onVideoPosted={onPosted} />}
        {tab === "profile" && <ProfilePage />}
      </div>
      {/* Bottom nav */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:"rgba(5,5,16,0.97)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-around", padding:"6px 0 10px", zIndex:200 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ background: t.key === "upload" ? "linear-gradient(135deg,#6c63ff,#a78bfa)" : "none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding: t.key === "upload" ? "10px 20px" : "8px 16px", borderRadius: t.key === "upload" ? 20 : 10, transform: t.key === "upload" ? "translateY(-12px)" : "none", boxShadow: t.key === "upload" ? "0 8px 25px rgba(108,99,255,0.5)" : "none" }}>
            <span style={{ fontSize: t.key === "upload" ? 24 : 22 }}>{t.icon}</span>
            <span style={{ fontSize:10, fontWeight:600, color: t.key === "upload" ? "#fff" : tab === t.key ? "#a78bfa" : "#555" }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
