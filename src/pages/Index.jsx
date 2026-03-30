import { useState, useEffect, useRef } from "react";
import { Video, Comment, User } from "../api/entities";
import { base44 } from "../api/base44Client";

const OWNER_EMAIL = "jaygnz27@gmail.com";

function formatCount(n) {
  if (!n) return "0";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

async function captureVideoThumbnail(file) {
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
          try { const { file_url } = await base44.integrations.Core.UploadFile({ file: thumbFile }); resolve(file_url); }
          catch { resolve(null); }
        }, "image/jpeg", 0.85);
      } catch { URL.revokeObjectURL(url); resolve(null); }
    };
    video.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
  });
}

async function compressVideo(file) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.muted = true; video.playsInline = true;
    video.onloadedmetadata = () => {
      const MAX_W = 720;
      const scale = Math.min(1, MAX_W / video.videoWidth);
      const w = Math.round(video.videoWidth * scale);
      const h = Math.round(video.videoHeight * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      const stream = canvas.captureStream(30);
      const chunks = [];
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9"
        : MediaRecorder.isTypeSupported("video/webm;codecs=vp8") ? "video/webm;codecs=vp8" : "video/webm";
      let recorder;
      try { recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 1_500_000 }); }
      catch { URL.revokeObjectURL(video.src); resolve(file); return; }
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = () => {
        URL.revokeObjectURL(video.src);
        const blob = new Blob(chunks, { type: mimeType });
        resolve(blob.size < file.size ? new File([blob], "compressed.webm", { type: mimeType }) : file);
      };
      recorder.start();
      video.currentTime = 0; video.play();
      const draw = () => { if (video.ended || video.paused) { recorder.stop(); return; } ctx.drawImage(video, 0, 0, w, h); requestAnimationFrame(draw); };
      video.onplay = () => requestAnimationFrame(draw);
      video.onended = () => recorder.stop();
    };
    video.onerror = () => resolve(file);
    video.load();
  });
}

async function uploadVideoFile(file) {
  const { file_url } = await base44.integrations.Core.UploadFile({ file });
  if (!file_url) throw new Error("Upload succeeded but no URL returned");
  return file_url;
}

// ── Splash ────────────────────────────────────────────────────────────────────
function Splash() {
  return (
    <div style={{ position:"fixed",inset:0,background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:9999 }}>
      <div style={{ width:80,height:4,background:"#e63946",marginBottom:24,borderRadius:2 }} />
      <div style={{ fontSize:52,fontWeight:900,letterSpacing:"-3px",color:"#fff",textTransform:"uppercase",fontStyle:"italic" }}>SACHI</div>
      <div style={{ width:80,height:4,background:"#e63946",marginTop:24,borderRadius:2 }} />
      <div style={{ color:"#444",fontSize:11,letterSpacing:"6px",textTransform:"uppercase",marginTop:20 }}>real people · real moments</div>
    </div>
  );
}

// ── Comment Sheet ─────────────────────────────────────────────────────────────
function CommentSheet({ video, currentUser, onClose, onCommentPosted }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const autoName = (currentUser?.username || currentUser?.full_name || currentUser?.email?.split("@")[0] || "").replace(/^@/,"").replace(/\s+/g,"_").toLowerCase();

  useEffect(() => {
    if (!video) return;
    Comment.filter({ video_id: video.id })
      .then(r => {
        const list = Array.isArray(r) ? r : [];
        setComments(list);
        if (list.length !== (video.comments_count || 0)) {
          Video.update(video.id, { comments_count: list.length }).catch(() => {});
          if (onCommentPosted) onCommentPosted(video.id, list.length);
        }
      })
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [video?.id]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [comments]);

  const post = async () => {
    if (!text.trim()) return;
    setPosting(true);
    try {
      const c = await Comment.create({
        video_id: video.id,
        username: autoName,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${autoName}`,
        comment_text: text.trim(),
        likes_count: 0,
      });
      const newCount = comments.length + 1;
      setComments(prev => [...prev, c]);
      setText("");
      await Video.update(video.id, { comments_count: newCount });
      if (onCommentPosted) onCommentPosted(video.id, newCount);
      setTimeout(() => onClose(), 600);
    } catch(e) { alert("Could not post comment: " + e.message); }
    finally { setPosting(false); }
  };

  return (
    <div style={{ position:"fixed",inset:0,zIndex:1000,display:"flex",flexDirection:"column",justifyContent:"flex-end" }}>
      <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.85)" }} />
      <div style={{ position:"relative",background:"#111",borderTop:"2px solid #e63946",maxHeight:"75vh",display:"flex",flexDirection:"column",zIndex:1001 }}>
        <div style={{ padding:"16px 20px 0",flexShrink:0 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
            <div style={{ color:"#fff",fontWeight:900,fontSize:14,letterSpacing:"3px",textTransform:"uppercase" }}>Comments</div>
            <button onClick={onClose} style={{ background:"#1a1a1a",border:"1px solid #333",borderRadius:4,width:28,height:28,color:"#888",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
          </div>
        </div>
        <div style={{ flex:1,overflowY:"auto",padding:"0 20px 8px" }}>
          {loading && <div style={{ color:"#444",textAlign:"center",padding:32,fontSize:13 }}>Loading...</div>}
          {!loading && comments.length === 0 && (
            <div style={{ color:"#444",textAlign:"center",padding:40 }}>
              <div style={{ fontSize:13,letterSpacing:"2px",textTransform:"uppercase" }}>No comments yet</div>
            </div>
          )}
          {comments.map(c => (
            <div key={c.id} style={{ display:"flex",gap:12,marginBottom:18,alignItems:"flex-start",borderBottom:"1px solid #1a1a1a",paddingBottom:14 }}>
              <img src={c.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.username}`} style={{ width:34,height:34,borderRadius:4,flexShrink:0,filter:"grayscale(30%)" }} />
              <div style={{ flex:1 }}>
                <div style={{ color:"#e63946",fontSize:11,fontWeight:800,letterSpacing:"1px",textTransform:"uppercase",marginBottom:4 }}>{c.username}</div>
                <div style={{ color:"#ccc",fontSize:14,lineHeight:1.5 }}>{c.comment_text}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div style={{ flexShrink:0,borderTop:"1px solid #1f1f1f",background:"#0d0d0d",padding:"14px 20px 28px" }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10,padding:"6px 10px",background:"#1a1a1a",borderRadius:4 }}>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${autoName}`} style={{ width:24,height:24,borderRadius:4,filter:"grayscale(30%)" }} />
            <div style={{ color:"#e63946",fontSize:11,fontWeight:700,letterSpacing:"1px" }}>@{autoName}</div>
          </div>
          <div style={{ display:"flex",gap:8 }}>
            <input value={text} onChange={e => setText(e.target.value)} placeholder="Drop a comment..."
              onKeyDown={e => { if (e.key==="Enter") post(); }}
              style={{ flex:1,background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:4,padding:"12px 14px",color:"#fff",fontSize:14,outline:"none",fontFamily:"inherit" }} />
            <button onClick={post} disabled={posting || !text.trim()}
              style={{ padding:"12px 20px",background:(posting||!text.trim())?"#1a1a1a":"#e63946",border:"none",borderRadius:4,color:(posting||!text.trim())?"#333":"#fff",fontWeight:800,fontSize:13,cursor:(posting||!text.trim())?"not-allowed":"pointer",letterSpacing:"1px",textTransform:"uppercase",whiteSpace:"nowrap" }}>
              {posting ? "..." : "POST"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Direct Inbox Sheet ────────────────────────────────────────────────────────
function DirectInboxSheet({ video, currentUser, onClose }) {
  const [recipientName, setRecipientName] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const videoUrl = `${window.location.origin}/AthaVid?v=${video.id}`;
  const autoName = (currentUser?.username || currentUser?.full_name || currentUser?.email?.split("@")[0] || "").replace(/^@/,"").replace(/\s+/g,"_").toLowerCase();

  const send = () => {
    if (!recipientName.trim()) return;
    const sub = encodeURIComponent(`@${autoName} shared a video with you on Sachi`);
    const body = encodeURIComponent(`Hey ${recipientName},\n\n@${autoName} sent you a video on Sachi:\n"${video.caption}"\n\n${videoUrl}\n\n${note ? `Note: ${note}` : ""}`);
    window.open(`mailto:?subject=${sub}&body=${body}`);
    setSent(true);
    setTimeout(() => onClose(), 1200);
  };

  return (
    <div style={{ position:"fixed",inset:0,zIndex:1000,display:"flex",flexDirection:"column",justifyContent:"flex-end" }}>
      <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.85)" }} />
      <div style={{ position:"relative",background:"#111",borderTop:"2px solid #e63946",zIndex:1001,padding:"20px 20px 40px" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
          <div>
            <div style={{ color:"#fff",fontWeight:900,fontSize:14,letterSpacing:"3px",textTransform:"uppercase" }}>SEND TO INBOX</div>
            <div style={{ color:"#444",fontSize:10,letterSpacing:"1px",marginTop:2 }}>Share this video with someone you follow</div>
          </div>
          <button onClick={onClose} style={{ background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:4,width:28,height:28,color:"#666",cursor:"pointer",fontSize:14 }}>✕</button>
        </div>

        {/* Video preview strip */}
        <div style={{ display:"flex",alignItems:"center",gap:12,padding:"12px",background:"#0d0d0d",border:"1px solid #1f1f1f",borderRadius:4,marginBottom:16 }}>
          <video src={video.video_url} poster={video.thumbnail_url} style={{ width:44,height:72,objectFit:"cover",borderRadius:3,flexShrink:0 }} muted playsInline />
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ color:"#e63946",fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:3 }}>@{video.username}</div>
            <div style={{ color:"#888",fontSize:12,lineHeight:1.4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{video.caption}</div>
          </div>
        </div>

        {sent ? (
          <div style={{ textAlign:"center",padding:"20px 0" }}>
            <div style={{ color:"#e63946",fontSize:22,fontWeight:900,letterSpacing:"-1px",marginBottom:4 }}>SENT.</div>
            <div style={{ color:"#444",fontSize:11,letterSpacing:"2px",textTransform:"uppercase" }}>Video shared to inbox</div>
          </div>
        ) : (
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:"#1a1a1a",borderRadius:4 }}>
              <div style={{ color:"#444",fontSize:10,letterSpacing:"1px",textTransform:"uppercase" }}>From:</div>
              <div style={{ color:"#e63946",fontSize:11,fontWeight:700,letterSpacing:"1px" }}>@{autoName}</div>
            </div>
            <input value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="Send to: @username or email"
              style={{ background:"#0d0d0d",border:"1px solid #2a2a2a",borderRadius:4,padding:"12px 14px",color:"#fff",fontSize:13,outline:"none",letterSpacing:"0.5px" }} />
            <input value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note... (optional)"
              style={{ background:"#0d0d0d",border:"1px solid #2a2a2a",borderRadius:4,padding:"12px 14px",color:"#fff",fontSize:13,outline:"none",letterSpacing:"0.5px" }} />
            <button onClick={send} disabled={!recipientName.trim()}
              style={{ padding:"14px",background:!recipientName.trim()?"#0d0d0d":"#e63946",border:`1px solid ${!recipientName.trim()?"#1a1a1a":"#e63946"}`,borderRadius:4,color:!recipientName.trim()?"#333":"#fff",fontSize:11,fontWeight:800,letterSpacing:"4px",textTransform:"uppercase",cursor:!recipientName.trim()?"not-allowed":"pointer" }}>
              SEND VIDEO
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Share Sheet ───────────────────────────────────────────────────────────────
function ShareSheet({ video, onClose }) {
  const videoUrl = `${window.location.origin}/AthaVid?v=${video.id}`;
  const text = `Check out this on Sachi: "${video.caption}" ${videoUrl}`;
  const [copied, setCopied] = useState(false);

  const copyLink = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(videoUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
      .catch(() => { const ta = document.createElement("textarea"); ta.value = videoUrl; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const options = [
    { label:"COPY LINK",  action: copyLink, active: copied },
    { label:"SMS",        action: (e) => { e.stopPropagation(); window.open(`sms:?&body=${encodeURIComponent(text)}`); onClose(); } },
    { label:"EMAIL",      action: (e) => { e.stopPropagation(); window.open(`mailto:?subject=Check this out on Sachi&body=${encodeURIComponent(text)}`); onClose(); } },
    { label:"WHATSAPP",   action: (e) => { e.stopPropagation(); window.open(`https://wa.me/?text=${encodeURIComponent(text)}`); onClose(); } },
    { label:"X / TWITTER",action: (e) => { e.stopPropagation(); window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`); onClose(); } },
    { label:"FACEBOOK",   action: (e) => { e.stopPropagation(); window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`); onClose(); } },
  ];

  return (
    <div style={{ position:"fixed",inset:0,zIndex:400,display:"flex",flexDirection:"column" }} onClick={onClose}>
      <div style={{ flex:1,background:"rgba(0,0,0,0.7)" }} />
      <div onClick={e => e.stopPropagation()} style={{ background:"#111",borderTop:"2px solid #e63946",padding:"20px 20px 36px" }}>
        <div style={{ color:"#fff",fontWeight:900,fontSize:13,letterSpacing:"4px",textTransform:"uppercase",marginBottom:20 }}>Share This</div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12 }}>
          {options.map(opt => (
            <button key={opt.label} onClick={opt.action}
              style={{ padding:"14px",background:opt.active?"#e63946":"#1a1a1a",border:`1px solid ${opt.active?"#e63946":"#2a2a2a"}`,borderRadius:4,color:opt.active?"#fff":"#888",fontSize:11,fontWeight:800,letterSpacing:"2px",cursor:"pointer",textTransform:"uppercase",transition:"all 0.2s" }}>
              {opt.active && opt.label==="COPY LINK" ? "✓ COPIED" : opt.label}
            </button>
          ))}
        </div>
        <button onClick={onClose} style={{ width:"100%",padding:"13px",background:"transparent",border:"1px solid #2a2a2a",borderRadius:4,color:"#444",fontSize:11,letterSpacing:"3px",textTransform:"uppercase",cursor:"pointer" }}>CANCEL</button>
      </div>
    </div>
  );
}

// ── Video Card ────────────────────────────────────────────────────────────────
function VideoCard({ video, liked, onLike, onComment, currentUser, onOpenInbox }) {
  const vidRef = useRef(null);
  const containerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [muted, setMuted] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [heartPulse, setHeartPulse] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) { vidRef.current?.pause(); setPlaying(false); setShowUI(true); }
    }, { threshold: 0.6 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleVideoClick = () => {
    if (!vidRef.current) return;
    if (vidRef.current.paused) {
      vidRef.current.play().catch(() => {});
      setShowUI(false);
    } else {
      vidRef.current.pause();
      setShowUI(true);
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setHeartPulse(true);
    setTimeout(() => setHeartPulse(false), 600);
    onLike(video.id);
  };

  const username = video.username || "creator";

  return (
    <div ref={containerRef} style={{ position:"relative",width:"100%",height:"100svh",background:"#000",flexShrink:0,overflow:"hidden" }}>
      <style>{`
        @keyframes heartbeat {
          0%   { transform: scale(1); }
          25%  { transform: scale(1.5); }
          50%  { transform: scale(1.2); }
          75%  { transform: scale(1.6); }
          100% { transform: scale(1); }
        }
        .heart-pulse { animation: heartbeat 0.6s ease; }
      `}</style>

      {/* Video */}
      <video ref={vidRef} src={video.video_url} poster={video.thumbnail_url} loop playsInline
        style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover" }}
        onPlay={() => setPlaying(true)}
        onPause={() => { setPlaying(false); setShowUI(true); }}
        onClick={handleVideoClick} />

      {/* Vignette */}
      <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.4) 100%)",pointerEvents:"none",zIndex:1 }} />

      {/* Pause indicator — only when paused */}
      {!playing && (
        <div onClick={handleVideoClick} style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:3,cursor:"pointer" }}>
          <div style={{ width:56,height:56,border:"2px solid rgba(255,255,255,0.6)",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.4)" }}>
            <div style={{ width:0,height:0,borderStyle:"solid",borderWidth:"12px 0 12px 20px",borderColor:"transparent transparent transparent rgba(255,255,255,0.9)",marginLeft:4 }} />
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <div style={{ position:"absolute",top:0,left:0,right:0,zIndex:10,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",
        opacity:showUI?1:0,visibility:showUI?"visible":"hidden",transition:"opacity 0.25s ease",pointerEvents:showUI?"auto":"none" }}>
        <div style={{ fontSize:18,fontWeight:900,color:"#fff",letterSpacing:"-1px",textTransform:"uppercase",fontStyle:"italic" }}>SACHI</div>
        <button onClick={(e) => { e.stopPropagation(); if (!vidRef.current) return; vidRef.current.muted = !muted; setMuted(m=>!m); }}
          style={{ background:"rgba(0,0,0,0.5)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:4,width:32,height:32,color:"#fff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
          {muted ? "🔇" : "🔊"}
        </button>
      </div>

      {/* BOTTOM SECTION */}
      <div style={{ position:"absolute",bottom:0,left:0,right:0,zIndex:10,padding:"0 0 80px 0",
        opacity:showUI?1:0,visibility:showUI?"visible":"hidden",transition:"opacity 0.25s ease",pointerEvents:showUI?"auto":"none" }}>

        {/* Creator strip */}
        <div style={{ padding:"0 16px 10px",display:"flex",alignItems:"center",gap:10 }}>
          <img src={video.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
            style={{ width:36,height:36,borderRadius:4,border:"1px solid rgba(255,255,255,0.3)",flexShrink:0,filter:"grayscale(20%)" }} />
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ color:"#fff",fontWeight:800,fontSize:13,letterSpacing:"0.5px" }}>{video.display_name || username}</div>
            <div style={{ color:"rgba(255,255,255,0.5)",fontSize:10,letterSpacing:"1px",textTransform:"uppercase" }}>@{username}</div>
          </div>
        </div>

        {/* Caption */}
        <div style={{ padding:"0 16px 8px" }}>
          <div style={{ color:"rgba(255,255,255,0.85)",fontSize:12,lineHeight:1.5,fontStyle:"italic" }}>{video.caption}</div>
          {video.hashtags?.length > 0 && (
            <div style={{ display:"flex",flexWrap:"wrap",gap:4,marginTop:4 }}>
              {video.hashtags.map(h => <span key={h} style={{ color:"#e63946",fontSize:10,fontWeight:700,letterSpacing:"1px" }}>#{h.toUpperCase()}</span>)}
            </div>
          )}
        </div>

        {/* ACTION BAR */}
        <div style={{ display:"flex",borderTop:"1px solid rgba(255,255,255,0.08)",background:"rgba(0,0,0,0.6)",backdropFilter:"blur(10px)" }}>

          {/* LIKE */}
          <button onClick={handleLike}
            style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"7px 0",background:"none",border:"none",borderRight:"1px solid rgba(255,255,255,0.08)",cursor:"pointer" }}>
            <svg className={heartPulse?"heart-pulse":""} width="11" height="11" viewBox="0 0 24 24"
              fill={liked?"#e63946":"none"} stroke={liked?"#e63946":"rgba(255,255,255,0.7)"} strokeWidth="2"
              style={{ display:"block",transformOrigin:"center" }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span style={{ color:liked?"#e63946":"rgba(255,255,255,0.6)",fontSize:9,fontWeight:700,letterSpacing:"1px" }}>{formatCount((video.likes_count||0)+(liked?1:0))}</span>
          </button>

          {/* COMMENT */}
          <button onClick={(e) => { e.stopPropagation(); onComment(video); }}
            style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"7px 0",background:"none",border:"none",borderRight:"1px solid rgba(255,255,255,0.08)",cursor:"pointer" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span style={{ color:"rgba(255,255,255,0.6)",fontSize:9,fontWeight:700,letterSpacing:"1px" }}>{formatCount(video.comments_count||0)}</span>
          </button>

          {/* INBOX */}
          <button onClick={(e) => { e.stopPropagation(); if (onOpenInbox) onOpenInbox(video); }}
            style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"7px 0",background:"none",border:"none",borderRight:"1px solid rgba(255,255,255,0.08)",cursor:"pointer" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2">
              <path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/>
            </svg>
            <span style={{ color:"rgba(255,255,255,0.6)",fontSize:9,fontWeight:700,letterSpacing:"1px" }}>INBOX</span>
          </button>

          {/* FOLLOW */}
          <button onClick={(e) => { e.stopPropagation(); setFollowed(f=>!f); }}
            style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"7px 0",background:"none",border:"none",borderRight:"1px solid rgba(255,255,255,0.08)",cursor:"pointer" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill={followed?"#e63946":"none"} stroke={followed?"#e63946":"rgba(255,255,255,0.7)"} strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
            <span style={{ color:followed?"#e63946":"rgba(255,255,255,0.6)",fontSize:9,fontWeight:700,letterSpacing:"1px" }}>{followed?"FOLLOWING":"FOLLOW"}</span>
          </button>

          {/* SHARE */}
          <button onClick={(e) => { e.stopPropagation(); setShowShare(true); }}
            style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"7px 0",background:"none",border:"none",cursor:"pointer" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            <span style={{ color:"rgba(255,255,255,0.6)",fontSize:9,fontWeight:700,letterSpacing:"1px" }}>SHARE</span>
          </button>

        </div>
      </div>

      {showShare && <ShareSheet video={video} onClose={() => setShowShare(false)} />}
    </div>
  );
}

// ── Feed ──────────────────────────────────────────────────────────────────────
function FeedPage({ feedKey, currentUser }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(new Set());
  const [commentVideo, setCommentVideo] = useState(null);
  const [inboxVideo, setInboxVideo] = useState(null);

  useEffect(() => {
    setLoading(true);
    Video.list().then(r => { setVideos(Array.isArray(r)?r:[]); setLoading(false); }).catch(() => setLoading(false));
  }, [feedKey]);

  const onLike = async (id) => {
    setLiked(prev => { const n = new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
    const v = videos.find(x => x.id === id);
    if (v) Video.update(id, { likes_count: Math.max(0,(v.likes_count||0)+(liked.has(id)?-1:1)) }).catch(()=>{});
  };

  const onCommentPosted = (id, count) => setVideos(prev => prev.map(v => v.id===id?{...v,comments_count:count}:v));

  if (loading) return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"100%",flexDirection:"column",gap:12 }}>
      <div style={{ width:40,height:2,background:"#e63946",borderRadius:2 }} />
      <div style={{ color:"#333",fontSize:11,letterSpacing:"4px",textTransform:"uppercase" }}>Loading</div>
    </div>
  );

  if (videos.length === 0) return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",padding:32 }}>
      <div style={{ width:60,height:3,background:"#e63946",marginBottom:24,borderRadius:2 }} />
      <div style={{ color:"#fff",fontWeight:900,fontSize:22,marginBottom:8,letterSpacing:"-1px" }}>No videos yet.</div>
      <div style={{ color:"#444",fontSize:13,textAlign:"center",letterSpacing:"1px" }}>Be the first to post.</div>
    </div>
  );

  return (
    <>
      <div style={{ height:"100%",overflowY:"scroll",scrollSnapType:"y mandatory",scrollbarWidth:"none" }}>
        {videos.map(v => (
          <div key={v.id} style={{ scrollSnapAlign:"start",height:"100svh" }}>
            <VideoCard video={v} liked={liked.has(v.id)} onLike={onLike} onComment={setCommentVideo} currentUser={currentUser} onOpenInbox={setInboxVideo} />
          </div>
        ))}
      </div>
      {commentVideo && <CommentSheet video={commentVideo} currentUser={currentUser} onClose={() => setCommentVideo(null)} onCommentPosted={onCommentPosted} />}
      {inboxVideo && <DirectInboxSheet video={inboxVideo} currentUser={currentUser} onClose={() => setInboxVideo(null)} />}
    </>
  );
}

// ── Explore ───────────────────────────────────────────────────────────────────
function ExplorePage() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => { Video.list().then(r => setVideos(Array.isArray(r)?r:[])).catch(()=>{}); }, []);

  const filtered = videos.filter(v => {
    const q = search.toLowerCase();
    return !q || (v.caption||"").toLowerCase().includes(q) || (v.username||"").toLowerCase().includes(q) || (v.hashtags||[]).some(h=>h.toLowerCase().includes(q));
  });

  return (
    <div style={{ padding:"60px 16px 20px" }}>
      <div style={{ color:"#fff",fontWeight:900,fontSize:22,letterSpacing:"-1px",marginBottom:4 }}>DISCOVER</div>
      <div style={{ width:40,height:3,background:"#e63946",marginBottom:20,borderRadius:2 }} />
      <div style={{ position:"relative",marginBottom:20 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search people, moments, tags..."
          style={{ width:"100%",background:"#111",border:"1px solid #2a2a2a",borderRadius:4,padding:"12px 16px",color:"#fff",fontSize:13,outline:"none",letterSpacing:"0.5px",boxSizing:"border-box" }} />
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign:"center",color:"#333",padding:32,fontSize:12,letterSpacing:"2px",textTransform:"uppercase" }}>Nothing found</div>
      ) : (
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2 }}>
          {filtered.map(v => (
            <div key={v.id} style={{ aspectRatio:"9/16",background:"#0d0d0d",overflow:"hidden",position:"relative" }}>
              <video src={v.video_url} poster={v.thumbnail_url} style={{ width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.85)" }} muted playsInline />
              <div style={{ position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(to top,rgba(0,0,0,0.8),transparent)",padding:"8px 4px 4px" }}>
                <div style={{ color:"rgba(255,255,255,0.7)",fontSize:9,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>@{v.username}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Inbox ─────────────────────────────────────────────────────────────────────
function InboxPage({ currentUser }) {
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [sent, setSent] = useState(false);

  const sendMessage = () => {
    if (!message.trim() || !senderName.trim()) return;
    const sub = encodeURIComponent(`Message from @${senderName} on Sachi`);
    const body = encodeURIComponent(`You received a message on Sachi!\n\nFrom: ${senderName}\nEmail: ${senderEmail||"not provided"}\n\nMessage:\n${message}`);
    window.open(`mailto:${OWNER_EMAIL}?subject=${sub}&body=${body}`);
    setSent(true);
  };

  if (sent) return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",padding:32 }}>
      <div style={{ width:60,height:3,background:"#e63946",marginBottom:24,borderRadius:2 }} />
      <div style={{ color:"#fff",fontWeight:900,fontSize:20,marginBottom:8,letterSpacing:"-1px" }}>Message sent.</div>
      <div style={{ color:"#444",fontSize:13,textAlign:"center",marginBottom:32,letterSpacing:"1px" }}>We'll get back to you soon.</div>
      <button onClick={() => setSent(false)} style={{ background:"#e63946",border:"none",borderRadius:3,color:"#fff",fontSize:11,fontWeight:800,padding:"12px 32px",cursor:"pointer",letterSpacing:"3px",textTransform:"uppercase" }}>SEND ANOTHER</button>
    </div>
  );

  return (
    <div style={{ padding:"60px 20px 20px" }}>
      <div style={{ color:"#fff",fontWeight:900,fontSize:22,letterSpacing:"-1px",marginBottom:4 }}>INBOX</div>
      <div style={{ width:40,height:3,background:"#e63946",marginBottom:24,borderRadius:2 }} />

      <div style={{ display:"flex",alignItems:"center",gap:14,padding:"16px",background:"#0d0d0d",border:"1px solid #1f1f1f",borderRadius:4,marginBottom:28 }}>
        <img src="https://media.base44.com/images/public/69b2ee18a8e6fb58c7f0261c/99914c9a7_generated_image.png" style={{ width:48,height:48,borderRadius:4,border:"1px solid #2a2a2a",filter:"grayscale(20%)" }} />
        <div>
          <div style={{ color:"#fff",fontWeight:800,fontSize:15,letterSpacing:"0.5px" }}>Sachi Team</div>
          <div style={{ color:"#e63946",fontSize:11,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase" }}>@sachi_official</div>
          <div style={{ color:"#333",fontSize:10,marginTop:2,letterSpacing:"1px" }}>Usually replies within 24h</div>
        </div>
      </div>

      <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
        <input value={senderName} onChange={e => setSenderName(e.target.value)} placeholder="Your name or @username"
          style={{ background:"#0d0d0d",border:"1px solid #2a2a2a",borderRadius:4,padding:"13px 16px",color:"#fff",fontSize:13,outline:"none",letterSpacing:"0.5px" }} />
        <input value={senderEmail} onChange={e => setSenderEmail(e.target.value)} placeholder="Your email (optional)" type="email"
          style={{ background:"#0d0d0d",border:"1px solid #2a2a2a",borderRadius:4,padding:"13px 16px",color:"#fff",fontSize:13,outline:"none",letterSpacing:"0.5px" }} />
        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Write your message..." rows={5}
          style={{ background:"#0d0d0d",border:"1px solid #2a2a2a",borderRadius:4,padding:"13px 16px",color:"#fff",fontSize:13,outline:"none",resize:"none",fontFamily:"inherit",letterSpacing:"0.5px" }} />
        <button onClick={sendMessage} disabled={!message.trim()||!senderName.trim()}
          style={{ padding:"14px",background:(!message.trim()||!senderName.trim())?"#0d0d0d":"#e63946",border:`1px solid ${(!message.trim()||!senderName.trim())?"#1a1a1a":"#e63946"}`,borderRadius:4,color:(!message.trim()||!senderName.trim())?"#333":"#fff",fontSize:11,fontWeight:800,letterSpacing:"3px",textTransform:"uppercase",cursor:(!message.trim()||!senderName.trim())?"not-allowed":"pointer" }}>
          SEND MESSAGE
        </button>
      </div>

      <div style={{ marginTop:24,padding:"14px 16px",background:"#0d0d0d",border:"1px solid #1f1f1f",borderRadius:4,display:"flex",alignItems:"center",gap:14 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e63946" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        <div>
          <div style={{ color:"#444",fontSize:10,letterSpacing:"2px",textTransform:"uppercase",marginBottom:2 }}>Direct Email</div>
          <a href={`mailto:${OWNER_EMAIL}`} style={{ color:"#e63946",fontSize:13,fontWeight:700,textDecoration:"none" }}>{OWNER_EMAIL}</a>
        </div>
      </div>
    </div>
  );
}

// ── Upload ────────────────────────────────────────────────────────────────────
function UploadPage({ currentUser, onPosted }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [hashtagsRaw, setHashtagsRaw] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const autoUsername = (currentUser?.username||currentUser?.full_name||currentUser?.email?.split("@")[0]||"").replace(/^@/,"").replace(/\s+/g,"_").toLowerCase();
  const autoDisplayName = currentUser?.full_name || autoUsername;
  const autoAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${autoUsername}`;

  const pick = (e) => { const f = e.target.files?.[0]; if (!f) return; setFile(f); setPreview(URL.createObjectURL(f)); setError(""); };

  const upload = async () => {
    if (!file) return setError("Select a video first");
    setUploading(true); setError("");
    try {
      setProgress("Compressing...");
      const compressed = await compressVideo(file);
      setProgress("Capturing thumbnail...");
      const thumbUrl = await captureVideoThumbnail(file);
      setProgress("Uploading...");
      const videoUrl = await uploadVideoFile(compressed);
      setProgress("Saving...");
      const hashtags = hashtagsRaw.split(/[\s,#]+/).map(h=>h.trim().replace(/^#/,"")).filter(Boolean);
      await Video.create({ user_id:currentUser?.id||"", username:autoUsername, display_name:autoDisplayName, avatar_url:autoAvatar, video_url:videoUrl, thumbnail_url:thumbUrl||"", caption:caption.trim()||"", hashtags, likes_count:0, comments_count:0, views_count:0, shares_count:0, is_approved:true, is_archived:false });
      setProgress(""); setFile(null); setPreview(null); setCaption(""); setHashtagsRaw("");
      onPosted();
    } catch(e) { setError(e.message||"Upload failed"); setProgress(""); }
    finally { setUploading(false); }
  };

  return (
    <div style={{ padding:"60px 20px 30px",minHeight:"100%" }}>
      <div style={{ color:"#fff",fontWeight:900,fontSize:22,letterSpacing:"-1px",marginBottom:4 }}>POST A VIDEO</div>
      <div style={{ width:40,height:3,background:"#e63946",marginBottom:4,borderRadius:2 }} />
      <div style={{ color:"#444",fontSize:11,letterSpacing:"2px",marginBottom:20,textTransform:"uppercase" }}>Posting as @{autoUsername}</div>

      <input type="file" accept="video/*" ref={fileRef} onChange={pick} style={{ display:"none" }} />
      <div onClick={() => fileRef.current?.click()}
        style={{ width:"100%",aspectRatio:"9/16",maxHeight:300,background:"#0d0d0d",border:`1px solid ${file?"#e63946":"#1f1f1f"}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",marginBottom:16,position:"relative",borderRadius:4 }}>
        {preview ? (
          <video src={preview} style={{ width:"100%",height:"100%",objectFit:"cover" }} muted playsInline />
        ) : (
          <>
            <div style={{ width:48,height:48,border:"1px solid #2a2a2a",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2">
                <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
            </div>
            <div style={{ color:"#555",fontSize:12,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase" }}>Select Video</div>
            <div style={{ color:"#2a2a2a",fontSize:10,marginTop:4,letterSpacing:"1px" }}>MP4 · MOV · WEBM</div>
          </>
        )}
      </div>

      <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Caption..." rows={3}
        style={{ width:"100%",background:"#0d0d0d",border:"1px solid #1f1f1f",borderRadius:4,padding:"13px 16px",color:"#fff",fontSize:13,outline:"none",resize:"none",fontFamily:"inherit",marginBottom:10,boxSizing:"border-box",letterSpacing:"0.5px" }} />
      <input value={hashtagsRaw} onChange={e => setHashtagsRaw(e.target.value)} placeholder="Hashtags: music art life..."
        style={{ width:"100%",background:"#0d0d0d",border:"1px solid #1f1f1f",borderRadius:4,padding:"13px 16px",color:"#fff",fontSize:13,outline:"none",marginBottom:16,boxSizing:"border-box",letterSpacing:"0.5px" }} />

      {error && <div style={{ color:"#e63946",fontSize:12,marginBottom:12,letterSpacing:"1px" }}>{error}</div>}
      {progress && <div style={{ color:"#888",fontSize:11,marginBottom:12,letterSpacing:"2px",textTransform:"uppercase" }}>{progress}</div>}

      <button onClick={upload} disabled={uploading||!file}
        style={{ width:"100%",padding:"16px",background:(!file||uploading)?"#0d0d0d":"#e63946",border:`1px solid ${(!file||uploading)?"#1a1a1a":"#e63946"}`,borderRadius:4,color:(!file||uploading)?"#333":"#fff",fontSize:12,fontWeight:800,letterSpacing:"4px",textTransform:"uppercase",cursor:(!file||uploading)?"not-allowed":"pointer" }}>
        {uploading ? (progress||"UPLOADING...") : "PUBLISH"}
      </button>
    </div>
  );
}

// ── Profile ───────────────────────────────────────────────────────────────────
function ProfilePage({ currentUser, onLogout }) {
  const username = (currentUser?.username||currentUser?.full_name||currentUser?.email?.split("@")[0]||"").replace(/^@/,"").replace(/\s+/g,"_").toLowerCase();
  const [videos, setVideos] = useState([]);

  useEffect(() => { Video.filter({ username }).then(setVideos).catch(()=>{}); }, [username]);

  return (
    <div style={{ padding:"60px 20px 20px",minHeight:"100%" }}>
      <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:28,paddingBottom:24,borderBottom:"1px solid #1a1a1a" }}>
        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} style={{ width:72,height:72,borderRadius:4,border:"1px solid #2a2a2a",filter:"grayscale(20%)" }} />
        <div style={{ flex:1 }}>
          <div style={{ color:"#fff",fontWeight:900,fontSize:20,letterSpacing:"-0.5px" }}>{currentUser?.full_name||username}</div>
          <div style={{ color:"#e63946",fontSize:11,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",marginTop:2 }}>@{username}</div>
          <div style={{ color:"#333",fontSize:10,marginTop:4,letterSpacing:"1px" }}>{currentUser?.email}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ color:"#fff",fontWeight:900,fontSize:24 }}>{videos.length}</div>
          <div style={{ color:"#444",fontSize:9,letterSpacing:"2px",textTransform:"uppercase" }}>Videos</div>
        </div>
      </div>

      <div style={{ color:"#444",fontSize:10,fontWeight:800,letterSpacing:"3px",textTransform:"uppercase",marginBottom:12 }}>My Posts</div>
      {videos.length === 0 ? (
        <div style={{ textAlign:"center",color:"#2a2a2a",padding:32,fontSize:11,letterSpacing:"2px",textTransform:"uppercase" }}>No posts yet</div>
      ) : (
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2 }}>
          {videos.map(v => (
            <div key={v.id} style={{ aspectRatio:"9/16",background:"#0d0d0d",overflow:"hidden" }}>
              <video src={v.video_url} poster={v.thumbnail_url} style={{ width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.85)" }} muted playsInline />
            </div>
          ))}
        </div>
      )}

      <button onClick={onLogout}
        style={{ width:"100%",marginTop:32,padding:"13px",background:"transparent",border:"1px solid #2a2a2a",borderRadius:4,color:"#444",fontSize:10,fontWeight:800,letterSpacing:"4px",textTransform:"uppercase",cursor:"pointer" }}>
        SIGN OUT
      </button>
    </div>
  );
}

// ── Auth Gate ─────────────────────────────────────────────────────────────────
function AuthGate({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);

  useEffect(() => { User.me().then(u => { setUser(u); setLoading(false); }).catch(() => setLoading(false)); }, []);

  const login = async () => {
    if (!email.trim()||!password.trim()) return setError("Enter email and password");
    setWorking(true); setError("");
    try { await User.login({ email:email.trim(), password }); const u = await User.me(); setUser(u); }
    catch(e) { setError(e.message||"Login failed"); }
    finally { setWorking(false); }
  };

  const signup = async () => {
    if (!email.trim()||!password.trim()) return setError("Enter email and password");
    if (!username.trim()) return setError("Choose a username");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    setWorking(true); setError("");
    try {
      const clean = username.trim().replace(/^@/,"").replace(/\s+/g,"_").toLowerCase();
      await User.register({ email:email.trim(), password, full_name:displayName.trim()||clean });
      const u = await User.me();
      try { await User.updateMyUserData({ username:clean, display_name:displayName.trim()||clean }); } catch(e){}
      setUser(u);
    }
    catch(e) { setError(e.message||"Sign up failed"); }
    finally { setWorking(false); }
  };

  const logout = async () => { await User.logout().catch(()=>{}); setUser(null); setEmail(""); setPassword(""); setDisplayName(""); setUsername(""); };

  if (loading) return (
    <div style={{ background:"#0a0a0a",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ width:32,height:2,background:"#e63946",borderRadius:2 }} />
    </div>
  );

  if (!user) return (
    <div style={{ background:"#0a0a0a",minHeight:"100vh",maxWidth:480,margin:"0 auto",fontFamily:"'Inter',-apple-system,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32 }}>
      <style>{`* { box-sizing: border-box } body { background: #0a0a0a; margin: 0 }`}</style>
      {/* Logo */}
      <div style={{ marginBottom:48,textAlign:"center" }}>
        <div style={{ width:60,height:3,background:"#e63946",margin:"0 auto 16px",borderRadius:2 }} />
        <div style={{ fontSize:48,fontWeight:900,letterSpacing:"-3px",color:"#fff",textTransform:"uppercase",fontStyle:"italic" }}>SACHI</div>
        <div style={{ width:60,height:3,background:"#e63946",margin:"16px auto 0",borderRadius:2 }} />
        <div style={{ color:"#333",fontSize:10,letterSpacing:"5px",textTransform:"uppercase",marginTop:12 }}>real people · real moments</div>
      </div>

      {/* Mode toggle */}
      <div style={{ display:"flex",gap:0,marginBottom:28,border:"1px solid #1f1f1f",borderRadius:4,overflow:"hidden",width:"100%" }}>
        {["login","signup"].map(m => (
          <button key={m} onClick={() => { setMode(m); setError(""); }}
            style={{ flex:1,padding:"12px",border:"none",cursor:"pointer",fontWeight:800,fontSize:11,letterSpacing:"3px",textTransform:"uppercase",background:mode===m?"#e63946":"transparent",color:mode===m?"#fff":"#333",transition:"all 0.2s" }}>
            {m==="login"?"SIGN IN":"JOIN"}
          </button>
        ))}
      </div>

      <div style={{ width:"100%",display:"flex",flexDirection:"column",gap:10 }}>
        {mode==="signup" && (
          <>
            <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Display name"
              style={{ background:"#0d0d0d",border:"1px solid #1f1f1f",borderRadius:4,padding:"13px 16px",color:"#fff",fontSize:13,outline:"none",letterSpacing:"0.5px" }} />
            <input value={username} onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_.]/g,""))} placeholder="@username"
              style={{ background:"#0d0d0d",border:"1px solid #1f1f1f",borderRadius:4,padding:"13px 16px",color:"#fff",fontSize:13,outline:"none",letterSpacing:"0.5px" }} />
          </>
        )}
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email"
          style={{ background:"#0d0d0d",border:"1px solid #1f1f1f",borderRadius:4,padding:"13px 16px",color:"#fff",fontSize:13,outline:"none",letterSpacing:"0.5px" }} />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password"
          onKeyDown={e => e.key==="Enter"&&(mode==="login"?login():signup())}
          style={{ background:"#0d0d0d",border:"1px solid #1f1f1f",borderRadius:4,padding:"13px 16px",color:"#fff",fontSize:13,outline:"none",letterSpacing:"0.5px" }} />
        {error && <div style={{ color:"#e63946",fontSize:12,letterSpacing:"0.5px" }}>{error}</div>}
        <button onClick={mode==="login"?login:signup} disabled={working}
          style={{ padding:"15px",background:working?"#0d0d0d":"#e63946",border:"none",borderRadius:4,color:"#fff",fontSize:11,fontWeight:800,letterSpacing:"4px",textTransform:"uppercase",cursor:working?"not-allowed":"pointer",marginTop:4 }}>
          {working?"...":(mode==="login"?"SIGN IN":"CREATE ACCOUNT")}
        </button>
      </div>
    </div>
  );

  return children(user, logout);
}

// ── Main App ──────────────────────────────────────────────────────────────────
function SachiApp({ currentUser, onLogout }) {
  const [tab, setTab] = useState("feed");
  const [splash, setSplash] = useState(true);
  const [feedKey, setFeedKey] = useState(0);

  useEffect(() => { const t = setTimeout(() => setSplash(false), 2000); return () => clearTimeout(t); }, []);

  const onPosted = () => { setFeedKey(k => k+1); setTab("feed"); };

  // 5 tabs — text labels only, no bubbles (Gen X style)
  const tabs = [
    { key:"feed",    label:"HOME",     icon:"🏠" },
    { key:"explore", label:"DISCOVER", icon:null },
    { key:"upload",  label:"POST",     icon:null },
    { key:"inbox",   label:"INBOX",    icon:null },
    { key:"profile", label:"ME",       icon:null },
  ];

  return (
    <div style={{ background:"#0a0a0a",height:"100svh",maxWidth:480,margin:"0 auto",fontFamily:"'Inter',-apple-system,sans-serif",position:"relative",display:"flex",flexDirection:"column",overflow:"hidden" }}>
      <style>{`* { box-sizing: border-box } ::-webkit-scrollbar { display: none } body { background: #0a0a0a; margin: 0 }`}</style>
      {splash && <Splash />}

      {/* Page content */}
      <div style={{ flex:1,overflow:"hidden",position:"relative" }}>
        {tab==="feed"    && <FeedPage feedKey={feedKey} currentUser={currentUser} />}
        {tab==="explore" && <div style={{ height:"100%",overflowY:"auto" }}><ExplorePage /></div>}
        {tab==="upload"  && <div style={{ height:"100%",overflowY:"auto" }}><UploadPage currentUser={currentUser} onPosted={onPosted} /></div>}
        {tab==="inbox"   && <div style={{ height:"100%",overflowY:"auto" }}><InboxPage currentUser={currentUser} /></div>}
        {tab==="profile" && <div style={{ height:"100%",overflowY:"auto" }}><ProfilePage currentUser={currentUser} onLogout={onLogout} /></div>}
      </div>

      {/* Bottom Nav — Gen X: text only, no icons, red accent bar on active */}
      <div style={{ flexShrink:0,background:"#0a0a0a",borderTop:"1px solid #1a1a1a",paddingBottom:"env(safe-area-inset-bottom)" }}>
        {/* Active indicator bar */}
        <div style={{ height:2,background:"#1a1a1a",position:"relative",marginBottom:0 }}>
          {tabs.map((t,i) => (
            tab===t.key && <div key={t.key} style={{ position:"absolute",top:0,height:2,background:"#e63946",width:`${100/tabs.length}%`,left:`${i*(100/tabs.length)}%`,transition:"left 0.2s ease",borderRadius:0 }} />
          ))}
        </div>
        <div style={{ display:"flex" }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"12px 0",background:"none",border:"none",cursor:"pointer" }}>
              {/* POST gets special treatment */}
              {t.key==="upload" ? (
                <div style={{ width:32,height:32,background:"#e63946",borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:2 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </div>
              ) : null}
              {t.icon && <span style={{ fontSize:18,lineHeight:1,marginBottom:1 }}>{t.icon}</span>}
              <span style={{ fontSize:9,color:tab===t.key?"#fff":"#333",fontWeight:800,letterSpacing:"2px",textTransform:"uppercase",lineHeight:1 }}>
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>
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
