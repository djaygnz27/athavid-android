import { useState, useEffect, useRef } from "react";
import { AthaVidVideo, AthaVidComment, User } from "../api/entities";
import { base44 } from "../api/base44Client";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatCount(n) {
  if (!n) return "0";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

// ── Upload helper ─────────────────────────────────────────────────────────────
async function captureVideoThumbnail(file) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    const url = URL.createObjectURL(file);
    video.src = url;
    video.onloadeddata = () => {
      // seek to 1 second in (or 10% of duration)
      video.currentTime = Math.min(1, video.duration * 0.1);
    };
    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 500;
        canvas.height = 888; // 9:16 portrait
        const ctx = canvas.getContext("2d");
        // center-crop the frame to 9:16
        const vw = video.videoWidth;
        const vh = video.videoHeight;
        const targetRatio = 500 / 888;
        const srcRatio = vw / vh;
        let sx = 0, sy = 0, sw = vw, sh = vh;
        if (srcRatio > targetRatio) {
          sw = vh * targetRatio;
          sx = (vw - sw) / 2;
        } else {
          sh = vw / targetRatio;
          sy = (vh - sh) / 2;
        }
        ctx.drawImage(video, sx, sy, sw, sh, 0, 0, 500, 888);
        URL.revokeObjectURL(url);
        canvas.toBlob(async (blob) => {
          if (!blob) return resolve(null);
          const thumbFile = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
          try {
            const { file_url } = await base44.integrations.Core.UploadFile({ file: thumbFile });
            resolve(file_url);
          } catch {
            resolve(null);
          }
        }, "image/jpeg", 0.85);
      } catch {
        URL.revokeObjectURL(url);
        resolve(null);
      }
    };
    video.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
  });
}

// Compress video via canvas + MediaRecorder before uploading
async function compressVideo(file, onProgress) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      // Target max 720p
      const MAX_W = 720;
      const scale = Math.min(1, MAX_W / video.videoWidth);
      const w = Math.round(video.videoWidth * scale);
      const h = Math.round(video.videoHeight * scale);

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");

      const stream = canvas.captureStream(30);
      const chunks = [];
      // Pick best supported codec
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : MediaRecorder.isTypeSupported("video/webm;codecs=vp8")
        ? "video/webm;codecs=vp8"
        : "video/webm";

      let recorder;
      try {
        recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 1_500_000 });
      } catch (e) {
        // If MediaRecorder fails, just return original
        URL.revokeObjectURL(video.src);
        resolve(file);
        return;
      }

      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = () => {
        URL.revokeObjectURL(video.src);
        const blob = new Blob(chunks, { type: mimeType });
        // Only use compressed if it's actually smaller
        const compressed = blob.size < file.size
          ? new File([blob], "compressed.webm", { type: mimeType })
          : file;
        resolve(compressed);
      };

      recorder.start();
      video.currentTime = 0;
      video.play();

      const draw = () => {
        if (video.ended || video.paused) { recorder.stop(); return; }
        ctx.drawImage(video, 0, 0, w, h);
        requestAnimationFrame(draw);
      };
      video.onplay = () => requestAnimationFrame(draw);
      video.onended = () => recorder.stop();
    };

    video.onerror = () => resolve(file); // fallback
    video.load();
  });
}

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
      <img src="https://media.base44.com/images/public/69b2ee18a8e6fb58c7f0261c/99914c9a7_generated_image.png" alt="Sachi" style={{ width:80, height:80, borderRadius:20, marginBottom:8, boxShadow:"0 8px 30px rgba(255,107,107,0.4)" }} />
      <div style={{ fontSize:42, fontWeight:900, letterSpacing:"-1px", background:"linear-gradient(135deg,#ff6b6b,#ff8e53,#ffd93d)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>sachi</div>
      <div style={{ color:"#888", fontSize:12, letterSpacing:"3px", textTransform:"uppercase", marginTop:4 }}>real moments. real you.</div>
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
      .then(r => {
        const list = Array.isArray(r) ? r : [];
        setComments(list);
        // sync real count back to feed and DB if it's off
        if (list.length !== (video.comments_count || 0)) {
          AthaVidVideo.update(video.id, { comments_count: list.length }).catch(() => {});
          if (onCommentPosted) onCommentPosted(video.id, list.length);
        }
      })
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
      // count will be set accurately after list re-renders
      const newCount = comments.length + 1;
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
                <div style={{ color:"#ff8e53", fontSize:12, fontWeight:700, marginBottom:3 }}>@{c.username}</div>
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
            style={{ width:"100%", padding:"14px", background: (posting || !text.trim() || !name.trim()) ? "#2a2a3e" : "linear-gradient(135deg,#ff6b6b,#ff8e53)", border:"none", borderRadius:12, color: (posting || !text.trim() || !name.trim()) ? "#555" : "#fff", fontWeight:700, fontSize:16, cursor: (posting || !text.trim() || !name.trim()) ? "not-allowed" : "pointer", letterSpacing:"0.3px" }}
          >
            {posting ? "Posting..." : "💬 Post Comment"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Share Sheet ───────────────────────────────────────────────────────────────
function ShareSheet({ video, onClose }) {
  const videoUrl = `${window.location.origin}/AthaVid?v=${video.id}`;
  const text = `Check out this video on Sachi: "${video.caption}" ${videoUrl}`;
  const [copied, setCopied] = useState(false);

  const copyLink = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(videoUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = videoUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareOptions = [
    {
      icon: "🔗", label: "Copy Link", color: "#ff6b6b",
      action: copyLink,
    },
    {
      icon: "💬", label: "SMS / iMessage", color: "#34C759",
      action: (e) => { e.stopPropagation(); window.open(`sms:?&body=${encodeURIComponent(text)}`); onClose(); },
    },
    {
      icon: "📧", label: "Email", color: "#00ADEF",
      action: (e) => { e.stopPropagation(); window.open(`mailto:?subject=${encodeURIComponent("Check out this Sachi video!")}&body=${encodeURIComponent(text)}`); onClose(); },
    },
    {
      icon: "🟢", label: "WhatsApp", color: "#25D366",
      action: (e) => { e.stopPropagation(); window.open(`https://wa.me/?text=${encodeURIComponent(text)}`); onClose(); },
    },
    {
      icon: "🐦", label: "X (Twitter)", color: "#1DA1F2",
      action: (e) => { e.stopPropagation(); window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`); onClose(); },
    },
    {
      icon: "📘", label: "Facebook", color: "#1877F2",
      action: (e) => { e.stopPropagation(); window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`); onClose(); },
    },
    {
      icon: "💼", label: "LinkedIn", color: "#0A66C2",
      action: (e) => { e.stopPropagation(); window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(videoUrl)}`); onClose(); },
    },
    {
      icon: "📱", label: "More Options", color: "#888",
      action: (e) => {
        e.stopPropagation();
        navigator.share ? navigator.share({ title: "Sachi", text: video.caption, url: videoUrl }).catch(()=>{}) : copyLink(e);
        onClose();
      },
    },
  ];

  return (
    <div style={{ position:"fixed", inset:0, zIndex:400, display:"flex", flexDirection:"column" }} onClick={onClose}>
      <div style={{ flex:1, background:"rgba(0,0,0,0.5)" }} />
      <div onClick={e => e.stopPropagation()} style={{ background:"#0d0d1a", borderRadius:"24px 24px 0 0", padding:"20px 16px 40px" }}>
        {/* handle */}
        <div style={{ width:40, height:4, background:"#333", borderRadius:99, margin:"0 auto 16px" }} />
        <div style={{ color:"#fff", fontWeight:800, fontSize:17, marginBottom:4 }}>Share</div>
        <div style={{ color:"#555", fontSize:12, marginBottom:20, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{videoUrl}</div>

        {/* grid of share options */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:16, marginBottom:16 }}>
          {shareOptions.map(opt => (
            <div key={opt.label} onClick={opt.action}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, cursor:"pointer" }}>
              <div style={{ width:56, height:56, borderRadius:16, background: opt.label === "Copy Link" && copied ? "#22c55e" : opt.color + "22",
                border:`1.5px solid ${opt.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>
                {opt.label === "Copy Link" && copied ? "✓" : opt.icon}
              </div>
              <span style={{ color:"#aaa", fontSize:11, textAlign:"center", lineHeight:1.2 }}>
                {opt.label === "Copy Link" && copied ? "Copied!" : opt.label}
              </span>
            </div>
          ))}
        </div>

        <button onClick={onClose}
          style={{ width:"100%", padding:14, background:"rgba(255,255,255,0.07)", border:"none", borderRadius:12, color:"#888", fontSize:15, cursor:"pointer", marginTop:4 }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Video Card ────────────────────────────────────────────────────────────────
function VideoCard({ video, liked, onLike, onComment }) {
  const vidRef = useRef(null);
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // Create sound track audio element
  useEffect(() => {
    if (!video.sound_url) return;
    const a = new Audio(video.sound_url);
    a.loop = true;
    a.volume = 0.7;
    a.preload = "auto";
    audioRef.current = a;
    return () => {
      a.pause();
      a.src = "";
      audioRef.current = null;
    };
  }, [video.sound_url]);

  // Pause when scrolled out of view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        vidRef.current?.pause();
        audioRef.current?.pause();
        setPlaying(false);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Tap to play/pause — must be direct user gesture for audio to work
  const toggle = () => {
    if (!vidRef.current) return;
    if (playing) {
      vidRef.current.pause();
      audioRef.current?.pause();
      setPlaying(false);
    } else {
      vidRef.current.play().then(() => {
        setPlaying(true);
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(e => console.warn("Sound blocked:", e));
        }
      }).catch(e => console.warn("Video failed:", e));
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const nm = !muted;
    setMuted(nm);
    if (vidRef.current) vidRef.current.muted = nm;
    if (audioRef.current) audioRef.current.muted = nm;
  };

  return (
    <div ref={containerRef} style={{ position:"relative", width:"100%", height:"calc(100vh - 56px)", background:"#000", flexShrink:0, overflow:"hidden" }}>
      <video
        ref={vidRef}
        src={video.video_url}
        poster={video.thumbnail_url}
        loop playsInline muted={muted}
        style={{ width:"100%", height:"100%", objectFit:"cover" }}
        onClick={toggle}
      />
      {/* gradient overlay — fades out when playing */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)", pointerEvents:"none", opacity:playing?0:1, transition:"opacity 0.4s ease" }} />

      {/* mute btn */}
      <button onClick={toggleMute}
        style={{ position:"absolute", top:16, right:16, background:"rgba(0,0,0,0.5)", border:"none", borderRadius:"50%", width:40, height:40, color:"#fff", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", opacity:playing?0:1, transition:"opacity 0.4s ease", pointerEvents:playing?"none":"auto" }}>
        {muted ? "🔇" : "🔊"}
      </button>

      {/* right action bar */}
      <div style={{ position:"absolute", right:12, bottom:100, display:"flex", flexDirection:"column", gap:20, alignItems:"center", opacity:playing?0:1, transition:"opacity 0.4s ease", pointerEvents:playing?"none":"auto" }}>
        {/* like */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <button onClick={e => { e.stopPropagation(); onLike(); }}
            style={{ background:"none", border:"none", fontSize:32, cursor:"pointer", filter: liked ? "none" : "grayscale(1)", transition:"transform 0.15s", transform: liked ? "scale(1.2)" : "scale(1)" }}>
            ❤️
          </button>
          <span style={{ color:"#fff", fontSize:12, fontWeight:700 }}>{(video.likes_count||0) + (liked?1:0)}</span>
        </div>
        {/* comment */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <button onClick={e => { e.stopPropagation(); onComment(); }}
            style={{ background:"none", border:"none", fontSize:32, cursor:"pointer" }}>
            💬
          </button>
          <span style={{ color:"#fff", fontSize:12, fontWeight:700 }}>{video.comments_count||0}</span>
        </div>
        {/* share */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <button onClick={e => { e.stopPropagation(); setShowShare(true); }}
            style={{ background:"none", border:"none", fontSize:32, cursor:"pointer" }}>
            ↗️
          </button>
          <span style={{ color:"#fff", fontSize:12, fontWeight:700 }}>Share</span>
        </div>
      </div>

      {/* bottom info */}
      <div style={{ position:"absolute", bottom:0, left:0, right:60, padding:"0 16px 80px", opacity:playing?0:1, transition:"opacity 0.4s ease", pointerEvents:playing?"none":"auto" }}>
        {/* avatar + username */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
          <img src={video.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.username}`}
            style={{ width:42, height:42, borderRadius:"50%", border:"2px solid #fff", objectFit:"cover" }} />
          <span style={{ color:"#fff", fontWeight:700, fontSize:15 }}>@{video.username}</span>
        </div>
        {/* caption */}
        <div style={{ color:"#fff", fontSize:14, fontWeight:500, lineHeight:1.4, marginBottom:8 }}>{video.caption}</div>
        {/* sound ticker */}
        {video.sound_title && (
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8, background:"rgba(0,0,0,0.45)", borderRadius:99, padding:"5px 12px", width:"fit-content", backdropFilter:"blur(4px)" }}>
            <span style={{ fontSize:13, display:"inline-block", animation: playing ? "spin 3s linear infinite" : "none" }}>💿</span>
            <span style={{ color:"#fff", fontSize:12, fontWeight:600 }}>{video.sound_title} · {video.sound_artist}</span>
          </div>
        )}
        {/* hashtags */}
        {video.hashtags?.length > 0 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {video.hashtags.map((h,i) => (
              <span key={i} style={{ color:"#ff8e53", fontSize:13, fontWeight:600 }}>#{h}</span>
            ))}
          </div>
        )}
      </div>

      {/* play/pause indicator */}
      {!playing && (
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:56, opacity:0.6, pointerEvents:"none" }}>▶️</div>
      )}
      {/* share sheet */}
      {showShare && <ShareSheet video={video} onClose={() => setShowShare(false)} />}
    </div>
  );
}

// ── Feed ──────────────────────────────────────────────────────────────────────
function FeedPage({ likedVideos, onLike }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeComment, setActiveComment] = useState(null);
  const videoRefs = useRef({});

  const handleCommentPosted = (videoId, newCount) => {
    setVideos(prev => prev.map(v => v.id === videoId ? { ...v, comments_count: newCount } : v));
    setActiveComment(prev => prev && prev.id === videoId ? { ...prev, comments_count: newCount } : prev);
  };

  useEffect(() => {
    AthaVidVideo.list()
      .then(r => {
        const sorted = Array.isArray(r) ? r.filter(v => !v.is_archived).sort((a,b) => new Date(b.created_date) - new Date(a.created_date)) : [];
        setVideos(sorted);
        // deep link: scroll to ?v=VIDEO_ID
        const params = new URLSearchParams(window.location.search);
        const deepId = params.get("v");
        if (deepId) {
          setTimeout(() => {
            const el = document.getElementById("vid-" + deepId);
            if (el) el.scrollIntoView({ behavior:"smooth" });
          }, 400);
        }
      })
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ color:"#ff8e53", textAlign:"center", paddingTop:200, fontSize:18 }}>Loading...</div>
  );

  if (!videos.length) return (
    <div style={{ color:"#666", textAlign:"center", paddingTop:200 }}>
      <div style={{ fontSize:48, marginBottom:16 }}>🎬</div>
      <div style={{ fontSize:18, color:"#ff8e53", fontWeight:700 }}>No videos yet</div>
      <div style={{ fontSize:14, marginTop:8 }}>Be the first to post!</div>
    </div>
  );

  return (
    <>
      <div style={{ height:"calc(100vh - 56px)", overflowY:"scroll", scrollSnapType:"y mandatory" }}>
        {videos.map(v => (
          <div key={v.id} id={"vid-" + v.id} style={{ scrollSnapAlign:"start" }}>
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


// ── Royalty-Free Sounds Library ───────────────────────────────────────────────
const SOUNDS = [
  { id:"s1", title:"Summer Bounce",    artist:"SoundHelix", genre:"Pop",        mood:"Happy",    duration:"3:45", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id:"s2", title:"Chill Vibes",      artist:"SoundHelix", genre:"Ambient",    mood:"Chill",    duration:"4:12", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id:"s3", title:"Hip Hop Groove",   artist:"SoundHelix", genre:"Hip-Hop",    mood:"Hype",     duration:"3:28", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { id:"s4", title:"Lofi Dreaming",    artist:"SoundHelix", genre:"Lo-Fi",      mood:"Relaxed",  duration:"3:02", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { id:"s5", title:"Night Drive",      artist:"SoundHelix", genre:"Electronic", mood:"Energy",   duration:"3:18", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
  { id:"s6", title:"Acoustic Morning", artist:"SoundHelix", genre:"Acoustic",   mood:"Calm",     duration:"3:55", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
  { id:"s7", title:"Epic Cinematic",   artist:"SoundHelix", genre:"Cinematic",  mood:"Dramatic", duration:"4:30", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3" },
];

const MOOD_COLORS = { Happy:"#FFD700", Chill:"#00CED1", Hype:"#FF4500", Relaxed:"#7CFC00", Dramatic:"#8A2BE2", Energy:"#FF1493", Calm:"#87CEEB" };

function SoundPicker({ selected, onSelect, onClose }) {
  const [playing, setPlaying] = useState(null);
  const [loading, setLoading] = useState(null);
  const audioRef = useRef(null);

  const togglePlay = (sound) => {
    // Stop current track
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (playing === sound.id) {
      setPlaying(null);
      setLoading(null);
      return;
    }
    // Start new track
    setLoading(sound.id);
    setPlaying(null);
    const a = new Audio();
    a.preload = "auto";
    a.oncanplay = () => {
      setLoading(null);
      setPlaying(sound.id);
      a.play().catch(e => { console.warn("Audio play blocked:", e); setPlaying(null); setLoading(null); });
    };
    a.onended = () => { setPlaying(null); setLoading(null); };
    a.onerror = () => { setLoading(null); setPlaying(null); console.warn("Audio load error"); };
    a.src = sound.url;
    audioRef.current = a;
  };

  const pick = (sound) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; audioRef.current = null; }
    setPlaying(null);
    setLoading(null);
    onSelect(sound);
    onClose();
  };

  useEffect(() => () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; } }, []);

  return (
    <div style={{ position:"fixed", inset:0, zIndex:300, display:"flex", flexDirection:"column" }}>
      <div onClick={() => { audioRef.current?.pause(); onClose(); }} style={{ flex:1, background:"rgba(0,0,0,0.6)" }} />
      <div style={{ background:"#0d0d1a", borderRadius:"24px 24px 0 0", padding:"20px 16px 32px", maxHeight:"75vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ color:"#fff", fontSize:18, fontWeight:800 }}>🎵 Sounds</div>
          <div style={{ color:"#555", fontSize:11 }}>All royalty-free · Safe to post</div>
        </div>
        {SOUNDS.map(s => (
          <div key={s.id} onClick={() => pick(s)}
            style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 10px", borderRadius:12, marginBottom:8,
              background: selected?.id === s.id ? "rgba(255,107,107,0.2)" : "rgba(255,255,255,0.04)",
              border: selected?.id === s.id ? "1px solid #ff6b6b" : "1px solid transparent", cursor:"pointer" }}>
            <button onClick={e => { e.stopPropagation(); togglePlay(s); }}
              style={{ width:40, height:40, borderRadius:"50%",
                background: playing === s.id ? "#ff8e53" : loading === s.id ? "#ff6b6b44" : "rgba(255,255,255,0.1)",
                border: loading === s.id ? "2px solid #ff8e53" : "none",
                color:"#fff", fontSize:16, cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all 0.2s" }}>
              {loading === s.id ? "⏳" : playing === s.id ? "⏸" : "▶"}
            </button>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ color:"#fff", fontWeight:700, fontSize:14, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.title}</div>
              <div style={{ color:"#888", fontSize:11, marginTop:2 }}>{s.artist} · {s.duration}</div>
            </div>
            <div style={{ display:"flex", gap:6, flexShrink:0 }}>
              <span style={{ background:(MOOD_COLORS[s.mood]||"#888")+"33", color:MOOD_COLORS[s.mood]||"#888", fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:99 }}>{s.mood}</span>
              <span style={{ background:"rgba(255,255,255,0.08)", color:"#aaa", fontSize:10, padding:"3px 8px", borderRadius:99 }}>{s.genre}</span>
            </div>
          </div>
        ))}
        <button onClick={() => { audioRef.current?.pause(); onClose(); }}
          style={{ width:"100%", marginTop:8, padding:14, background:"rgba(255,255,255,0.07)", border:"none", borderRadius:12, color:"#888", fontSize:14, cursor:"pointer" }}>
          No music
        </button>
      </div>
    </div>
  );
}

// ── Upload ────────────────────────────────────────────────────────────────────
function UploadPage({ onVideoPosted, currentUser }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [username] = useState(() => {
    if (!currentUser) return "";
    return (currentUser.username || currentUser.full_name || currentUser.email?.split("@")[0] || "").replace(/^@/,"").replace(/\s+/g,"_").toLowerCase();
  });
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [selectedSound, setSelectedSound] = useState(null);
  const [showSoundPicker, setShowSoundPicker] = useState(false);

  const pickFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async () => {
    if (!file) return setError("Please select a video");
    if (!caption.trim()) return setError("Please add a caption");
    setError(""); setUploading(true); setProgress(10);
    try {
      setProgress(10);
      setProgressMsg("Compressing video...");
      const compressed = await compressVideo(file, setProgress);
      const savedPct = file.size > 0 ? Math.round((1 - compressed.size / file.size) * 100) : 0;
      console.log(`Compression: ${(file.size/1024/1024).toFixed(1)}MB → ${(compressed.size/1024/1024).toFixed(1)}MB (${savedPct}% smaller)`);
      setProgress(40);
      setProgressMsg("Uploading...");
      // Upload video + thumbnail in parallel
      const [videoUrl, thumbnailUrl] = await Promise.all([
        uploadVideoFile(compressed),
        captureVideoThumbnail(file),
      ]);
      setProgress(90);
      const clean = username.trim().replace(/^@/, "");
      const record = await AthaVidVideo.create({
        username: clean,
        display_name: clean,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${clean}`,
        caption: caption.trim(),
        hashtags: hashtags.split(/[\s,#]+/).filter(Boolean),
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl || `https://picsum.photos/seed/${Date.now()}/500/880`,
        sound_title: selectedSound ? selectedSound.title : null,
        sound_artist: selectedSound ? selectedSound.artist : null,
        sound_url: selectedSound ? selectedSound.url : null,
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
      <div style={{ color:"#ff8e53", fontSize:26, fontWeight:800 }}>Video Posted!</div>
      <div style={{ color:"#888", fontSize:14, marginTop:8 }}>Returning to feed...</div>
    </div>
  );

  return (
    <div style={{ padding:24, paddingTop:60, minHeight:"100%" }}>
      <div style={{ color:"#fff", fontSize:22, fontWeight:800, marginBottom:24 }}>Post a Video</div>
      <label style={{ display:"block", border:"2px dashed #ff6b6b", borderRadius:16, padding:32, textAlign:"center", cursor:"pointer", marginBottom:16 }}>
        <input type="file" accept="video/*" onChange={pickFile} style={{ display:"none" }} />
        {preview ? (
          <video src={preview} style={{ width:"100%", maxHeight:200, borderRadius:8, objectFit:"cover" }} muted />
        ) : (
          <>
            <div style={{ fontSize:48 }}>📹</div>
            <div style={{ color:"#ff8e53", fontWeight:600, marginTop:8 }}>Tap to select video</div>
            <div style={{ color:"#666", fontSize:12, marginTop:4 }}>MP4, MOV — any size</div>
          </>
        )}
      </label>
      {/* Locked username display */}
      <div style={{ marginBottom:14 }}>
        <div style={{ color:"#888", fontSize:12, fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px" }}>Posting as</div>
        <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,107,107,0.3)", borderRadius:10, padding:"12px 14px" }}>
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} style={{ width:32, height:32, borderRadius:"50%" }} />
          <div>
            <div style={{ color:"#ff8e53", fontWeight:700, fontSize:14 }}>@{username}</div>
            <div style={{ color:"#555", fontSize:11 }}>Username is permanent · cannot be changed</div>
          </div>
          <span style={{ marginLeft:"auto", fontSize:16 }}>🔒</span>
        </div>
      </div>
      {[
        { label:"Caption", val:caption, set:setCaption, ph:"What's this video about?" },
        { label:"Hashtags", val:hashtags, set:setHashtags, ph:"sachi reallife nj" },
      ].map(({ label, val, set, ph }) => (
        <div key={label} style={{ marginBottom:14 }}>
          <div style={{ color:"#aaa", fontSize:12, marginBottom:4 }}>{label}</div>
          <input
            value={val} onChange={e => set(e.target.value)} placeholder={ph}
            style={{ width:"100%", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 14px", color:"#fff", fontSize:14, outline:"none" }}
          />
        </div>
      ))}
      {/* Sound picker */}
      <div style={{ marginBottom:14 }}>
        <div style={{ color:"#aaa", fontSize:12, marginBottom:4 }}>Sound</div>
        <button onClick={() => setShowSoundPicker(true)}
          style={{ width:"100%", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 14px", color: selectedSound ? "#ff8e53" : "#555", fontSize:14, textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:18 }}>🎵</span>
          <span style={{ flex:1 }}>{selectedSound ? `${selectedSound.title} — ${selectedSound.artist}` : "Add a sound (royalty-free)"}</span>
          {selectedSound && <span onClick={e => { e.stopPropagation(); setSelectedSound(null); }} style={{ color:"#ff6b6b", fontSize:18, lineHeight:1 }}>✕</span>}
        </button>
      </div>
      {showSoundPicker && <SoundPicker selected={selectedSound} onSelect={setSelectedSound} onClose={() => setShowSoundPicker(false)} />}
      {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:12 }}>{error}</div>}
      {uploading && (
        <div style={{ marginBottom:16 }}>
          <div style={{ background:"rgba(255,255,255,0.1)", borderRadius:99, height:6 }}>
            <div style={{ background:"linear-gradient(90deg,#ff6b6b,#ffd93d)", borderRadius:99, height:6, width:progress + "%", transition:"width 0.4s" }} />
          </div>
          <div style={{ color:"#ff8e53", fontSize:12, marginTop:6, textAlign:"center" }}>{progressMsg || (progress < 60 ? "Uploading video..." : "Saving to feed...")}</div>
        </div>
      )}
      <button
        onClick={submit} disabled={uploading}
        style={{ width:"100%", padding:"16px", background: uploading ? "#333" : "linear-gradient(135deg,#ff6b6b,#ff8e53)", border:"none", borderRadius:14, color:"#fff", fontSize:16, fontWeight:700, cursor: uploading ? "not-allowed" : "pointer" }}
      >
        {uploading ? "Posting..." : "🚀 Post Video"}
      </button>
    </div>
  );
}

// ── Profile ───────────────────────────────────────────────────────────────────

// ── Explore ───────────────────────────────────────────────────────────────────
function ExplorePage() {
  return (
    <div style={{ padding:32, textAlign:"center", paddingTop:80 }}>
      <div style={{ fontSize:64, marginBottom:16 }}>🔍</div>
      <div style={{ color:"#ff8e53", fontSize:20, fontWeight:700 }}>Explore</div>
      <div style={{ color:"#666", fontSize:14, marginTop:8 }}>Coming soon</div>
    </div>
  );
}


// ── Auth Gate ─────────────────────────────────────────────────────────────────
function AuthGate({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [pendingUsername, setPendingUsername] = useState("");
  const [pendingDisplayName, setPendingDisplayName] = useState("");

  useEffect(() => {
    User.me().then(u => { setUser(u); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const login = async () => {
    if (!email.trim() || !password.trim()) return setError("Enter email and password");
    setWorking(true); setError("");
    try {
      await User.login({ email: email.trim(), password });
      const u = await User.me();
      setUser(u);
    } catch(e) { setError(e.message || "Login failed. Check your email and password."); }
    finally { setWorking(false); }
  };

  const signup = async () => {
    if (!email.trim() || !password.trim()) return setError("Enter email and password");
    if (!username.trim()) return setError("Choose a username");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    setWorking(true); setError("");
    try {
      const clean = username.trim().replace(/^@/, "").replace(/\s+/g, "_").toLowerCase();
      await User.register({ email: email.trim(), password, full_name: displayName.trim() || clean });
      setPendingUsername(clean);
      setPendingDisplayName(displayName.trim() || clean);
      setAwaitingVerification(true);
      setError("");
    } catch(e) { setError(e.message || "Sign up failed. Try a different email."); }
    finally { setWorking(false); }
  };

  const verifyEmail = async () => {
    if (!verifyCode.trim()) return setError("Enter the verification code from your email");
    setWorking(true); setError("");
    try {
      await User.verifyEmail({ email: email.trim(), code: verifyCode.trim() });
      const u = await User.me();
      try { await User.updateMyUserData({ username: pendingUsername, display_name: pendingDisplayName }); } catch(e) {}
      setUser(u);
    } catch(e) { setError(e.message || "Invalid code. Check your email and try again."); }
    finally { setWorking(false); }
  };

  const logout = async () => {
    await User.logout().catch(() => {});
    setUser(null);
    setEmail(""); setPassword(""); setDisplayName(""); setUsername("");
  };

  if (loading) return (
    <div style={{ background:"#050510", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ fontSize:40 }}>⏳</div>
    </div>
  );

  if (!user) return (
    <div style={{ background:"#050510", minHeight:"100vh", maxWidth:480, margin:"0 auto", fontFamily:"'Inter',-apple-system,sans-serif", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32 }}>
      <style>{`* { box-sizing: border-box } body { background: #050510; margin: 0 }`}</style>
      <img src="https://media.base44.com/images/public/69b2ee18a8e6fb58c7f0261c/99914c9a7_generated_image.png" alt="Sachi" style={{ width:72, height:72, borderRadius:18, marginBottom:12, boxShadow:"0 8px 30px rgba(255,107,107,0.4)" }} />
      <div style={{ fontSize:36, fontWeight:900, letterSpacing:"-1px", background:"linear-gradient(135deg,#ff6b6b,#ff8e53,#ffd93d)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:4 }}>sachi</div>
      <div style={{ color:"#555", fontSize:12, letterSpacing:"3px", textTransform:"uppercase", marginBottom:32 }}>real moments. real you.</div>

      {awaitingVerification ? (
        <div style={{ width:"100%", background:"rgba(255,255,255,0.04)", borderRadius:16, padding:24, textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>📧</div>
          <div style={{ color:"#fff", fontWeight:800, fontSize:18, marginBottom:8 }}>Check your email</div>
          <div style={{ color:"#888", fontSize:13, marginBottom:24 }}>We sent a verification code to<br/><span style={{color:"#ff8e53"}}>{email}</span></div>
          <input value={verifyCode} onChange={e => setVerifyCode(e.target.value.trim())} placeholder="Enter verification code"
            onKeyDown={e => e.key === "Enter" && verifyEmail()}
            style={{ width:"100%", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, padding:"14px", color:"#fff", fontSize:18, textAlign:"center", letterSpacing:"4px", marginBottom:16, outline:"none" }} />
          {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:12 }}>{error}</div>}
          <button onClick={verifyEmail} disabled={working}
            style={{ width:"100%", padding:"14px", background: working ? "#333" : "linear-gradient(135deg,#ff6b6b,#ff8e53)", border:"none", borderRadius:12, color:"#fff", fontSize:16, fontWeight:700, cursor: working ? "not-allowed" : "pointer", marginBottom:12 }}>
            {working ? "Verifying..." : "Verify & Continue"}
          </button>
          <button onClick={() => { setAwaitingVerification(false); setVerifyCode(""); setError(""); }}
            style={{ background:"none", border:"none", color:"#666", fontSize:13, cursor:"pointer" }}>
            ← Back to sign up
          </button>
        </div>
      ) : (
      <div style={{ width:"100%", background:"rgba(255,255,255,0.04)", borderRadius:16, padding:24 }}>
        <div style={{ display:"flex", gap:8, marginBottom:24 }}>
          {["login","signup"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }}
              style={{ flex:1, padding:"10px", borderRadius:10, border:"none", cursor:"pointer", fontWeight:700, fontSize:14,
                background: mode === m ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "rgba(255,255,255,0.06)",
                color: mode === m ? "#fff" : "#666" }}>
              {m === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        {mode === "signup" && (
          <>
            <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Display name (e.g. Libi Sachi)"
              style={{ width:"100%", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"12px 14px", color:"#fff", fontSize:14, marginBottom:12, outline:"none" }} />
            <div style={{ position:"relative", marginBottom:12 }}>
              <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"#ff8e53", fontWeight:700 }}>@</span>
              <input value={username} onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_.]/g,""))} placeholder="username"
                style={{ width:"100%", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"12px 14px 12px 28px", color:"#fff", fontSize:14, outline:"none" }} />
            </div>
          </>
        )}
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" type="email"
          style={{ width:"100%", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"12px 14px", color:"#fff", fontSize:14, marginBottom:12, outline:"none" }} />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password"
          onKeyDown={e => e.key === "Enter" && (mode === "login" ? login() : signup())}
          style={{ width:"100%", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"12px 14px", color:"#fff", fontSize:14, marginBottom:16, outline:"none" }} />

        {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:12, textAlign:"center" }}>{error}</div>}

        <button onClick={mode === "login" ? login : signup} disabled={working}
          style={{ width:"100%", padding:"14px", background: working ? "#333" : "linear-gradient(135deg,#ff6b6b,#ff8e53)", border:"none", borderRadius:12, color:"#fff", fontSize:16, fontWeight:700, cursor: working ? "not-allowed" : "pointer" }}>
          {working ? "..." : mode === "login" ? "Log In" : "Create Account"}
        </button>
      </div>
      )}
    </div>
  );

  return children(user, logout);
}

// ── Main ──────────────────────────────────────────────────────────────────────
// ── Profile Page ──────────────────────────────────────────────────────────────
function ProfilePage({ currentUser, onLogout }) {
  const username = (currentUser?.username || currentUser?.full_name || currentUser?.email?.split("@")[0] || "").replace(/^@/,"").replace(/\s+/g,"_").toLowerCase();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    AthaVidVideo.filter({ username }).then(setVideos).catch(() => {});
  }, [username]);

  return (
    <div style={{ padding:"60px 20px 20px", minHeight:"100%" }}>
      {/* Avatar & info */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:28 }}>
        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} style={{ width:88, height:88, borderRadius:"50%", border:"3px solid #ff8e53", marginBottom:12 }} />
        <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>{currentUser?.full_name || username}</div>
        <div style={{ color:"#ff8e53", fontSize:14, marginTop:2 }}>@{username}</div>
        <div style={{ color:"#555", fontSize:12, marginTop:4 }}>{currentUser?.email}</div>
        <div style={{ display:"flex", gap:24, marginTop:16 }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>{videos.length}</div>
            <div style={{ color:"#666", fontSize:11 }}>Videos</div>
          </div>
        </div>
      </div>
      {/* My Videos grid */}
      <div style={{ color:"#888", fontSize:12, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", marginBottom:12 }}>My Videos</div>
      {videos.length === 0 ? (
        <div style={{ textAlign:"center", color:"#444", padding:32 }}>No videos yet — post your first one!</div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:3 }}>
          {videos.map(v => (
            <div key={v.id} style={{ aspectRatio:"9/16", background:"#111", borderRadius:4, overflow:"hidden" }}>
              <video src={v.video_url} poster={v.thumbnail_url} style={{ width:"100%", height:"100%", objectFit:"cover" }} muted playsInline />
            </div>
          ))}
        </div>
      )}
      {/* Logout */}
      <button onClick={onLogout}
        style={{ width:"100%", marginTop:32, padding:"14px", background:"rgba(255,107,107,0.1)", border:"1px solid rgba(255,107,107,0.3)", borderRadius:12, color:"#ff6b6b", fontSize:15, fontWeight:600, cursor:"pointer" }}>
        Log Out
      </button>
    </div>
  );
}

export default function AthaVid() {
  return (
    <AuthGate>
      {(currentUser, logout) => <SachiApp currentUser={currentUser} onLogout={logout} />}
    </AuthGate>
  );
}

function SachiApp({ currentUser, onLogout }) {
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
      <style>{`* { box-sizing: border-box } ::-webkit-scrollbar { display: none } body { background: #050510; margin: 0 } @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
      {splash && <Splash />}
      <div style={{ height:"calc(100vh - 56px)", overflowY:"auto" }}>
        {tab === "feed"    && <FeedPage key={feedKey} likedVideos={liked} onLike={onLike} />}
        {tab === "explore" && <ExplorePage />}
        {tab === "upload"  && <UploadPage onVideoPosted={onPosted} currentUser={currentUser} />}
        {tab === "profile" && <ProfilePage currentUser={currentUser} onLogout={onLogout} />}
      </div>
      {/* Bottom nav */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:"rgba(5,5,16,0.97)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-around", padding:"6px 0 10px", zIndex:200 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => { if (t.key === "feed") setFeedKey(k => k + 1); setTab(t.key); }}
            style={{ background: t.key === "upload" ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding: t.key === "upload" ? "10px 20px" : "8px 16px", borderRadius: t.key === "upload" ? 20 : 10, transform: t.key === "upload" ? "translateY(-12px)" : "none", boxShadow: t.key === "upload" ? "0 8px 25px rgba(255,107,107,0.5)" : "none" }}>
            <span style={{ fontSize: t.key === "upload" ? 24 : 22 }}>{t.icon}</span>
            <span style={{ fontSize:10, fontWeight:600, color: t.key === "upload" ? "#fff" : tab === t.key ? "#ff8e53" : "#555" }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
