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

async function compressVideo(file, onProgress) {
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
        const compressed = blob.size < file.size ? new File([blob], "compressed.webm", { type: mimeType }) : file;
        resolve(compressed);
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
    <div style={{ position:"fixed",inset:0,background:"#050510",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:9999 }}>
      <div style={{ fontSize:64,marginBottom:16 }}>🎬</div>
      <img src="https://media.base44.com/images/public/69b2ee18a8e6fb58c7f0261c/99914c9a7_generated_image.png" alt="Sachi" style={{ width:80,height:80,borderRadius:20,marginBottom:8,boxShadow:"0 8px 30px rgba(255,107,107,0.4)" }} />
      <div style={{ fontSize:42,fontWeight:900,letterSpacing:"-1px",background:"linear-gradient(135deg,#ff6b6b,#ff8e53,#ffd93d)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>sachi</div>
      <div style={{ color:"#888",fontSize:12,letterSpacing:"3px",textTransform:"uppercase",marginTop:4 }}>real moments. real you.</div>
    </div>
  );
}

// ── Inbox Page ────────────────────────────────────────────────────────────────
function InboxPage({ currentUser }) {
  const username = (currentUser?.username || currentUser?.full_name || currentUser?.email?.split("@")[0] || "you");
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || !senderName.trim()) return;
    setSending(true);
    try {
      const subject = encodeURIComponent(`Message from @${senderName} on Sachi`);
      const body = encodeURIComponent(`You received a message on Sachi!\n\nFrom: ${senderName}\nEmail: ${senderEmail || "not provided"}\n\nMessage:\n${message}`);
      window.open(`mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`);
      setSent(true);
    } catch(e) {
      alert("Could not send: " + e.message);
    } finally {
      setSending(false);
    }
  };

  if (sent) return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",padding:32 }}>
      <div style={{ fontSize:64,marginBottom:16 }}>✅</div>
      <div style={{ color:"#fff",fontWeight:800,fontSize:22,marginBottom:8 }}>Message Sent!</div>
      <div style={{ color:"#888",fontSize:14,textAlign:"center",marginBottom:24 }}>Your message was sent to the Sachi team. We'll get back to you soon.</div>
      <button onClick={() => setSent(false)} style={{ background:"linear-gradient(135deg,#ff6b6b,#ff8e53)",border:"none",borderRadius:12,color:"#fff",fontSize:15,fontWeight:700,padding:"12px 32px",cursor:"pointer" }}>Send Another</button>
    </div>
  );

  return (
    <div style={{ padding:"60px 20px 20px" }}>
      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <div style={{ color:"#fff",fontWeight:900,fontSize:24,marginBottom:4 }}>📬 Inbox</div>
        <div style={{ color:"#666",fontSize:13 }}>Send a direct message to the Sachi team</div>
      </div>

      {/* Contact card */}
      <div style={{ background:"linear-gradient(135deg,rgba(255,107,107,0.15),rgba(255,142,83,0.1))",border:"1px solid rgba(255,107,107,0.3)",borderRadius:16,padding:20,marginBottom:24,display:"flex",alignItems:"center",gap:16 }}>
        <img src="https://media.base44.com/images/public/69b2ee18a8e6fb58c7f0261c/99914c9a7_generated_image.png" alt="Sachi" style={{ width:56,height:56,borderRadius:14,border:"2px solid #ff8e53" }} />
        <div>
          <div style={{ color:"#fff",fontWeight:800,fontSize:16 }}>Sachi Team</div>
          <div style={{ color:"#ff8e53",fontSize:13 }}>@sachi_official</div>
          <div style={{ color:"#555",fontSize:11,marginTop:2 }}>Usually replies within 24 hours</div>
        </div>
      </div>

      {/* Form */}
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        <input value={senderName} onChange={e => setSenderName(e.target.value)} placeholder="Your name or @username"
          style={{ background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,padding:"13px 16px",color:"#fff",fontSize:14,outline:"none" }} />
        <input value={senderEmail} onChange={e => setSenderEmail(e.target.value)} placeholder="Your email (optional — for replies)"
          type="email"
          style={{ background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,padding:"13px 16px",color:"#fff",fontSize:14,outline:"none" }} />
        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Write your message..."
          rows={5}
          style={{ background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,padding:"13px 16px",color:"#fff",fontSize:14,outline:"none",resize:"none",fontFamily:"inherit" }} />
        <button onClick={sendMessage} disabled={sending || !message.trim() || !senderName.trim()}
          style={{ padding:"14px",background:(sending||!message.trim()||!senderName.trim())?"#222":"linear-gradient(135deg,#ff6b6b,#ff8e53)",border:"none",borderRadius:12,color:(sending||!message.trim()||!senderName.trim())?"#555":"#fff",fontSize:16,fontWeight:700,cursor:(sending||!message.trim()||!senderName.trim())?"not-allowed":"pointer" }}>
          {sending ? "Sending..." : "📨 Send Message"}
        </button>
      </div>

      {/* Also show email directly */}
      <div style={{ marginTop:24,padding:16,background:"rgba(255,255,255,0.03)",borderRadius:12,display:"flex",alignItems:"center",gap:12 }}>
        <div style={{ fontSize:24 }}>📧</div>
        <div>
          <div style={{ color:"#888",fontSize:12 }}>Or email us directly</div>
          <a href={`mailto:${OWNER_EMAIL}`} style={{ color:"#ff8e53",fontSize:14,fontWeight:600,textDecoration:"none" }}>{OWNER_EMAIL}</a>
        </div>
      </div>
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
      setTimeout(() => onClose(), 800);
    } catch(e) { alert("Could not post comment: " + e.message); }
    finally { setPosting(false); }
  };

  return (
    <div style={{ position:"fixed",inset:0,zIndex:1000,display:"flex",flexDirection:"column",justifyContent:"flex-end" }}>
      <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.7)" }} />
      <div style={{ position:"relative",background:"#1a1a2e",borderRadius:"24px 24px 0 0",maxHeight:"80vh",display:"flex",flexDirection:"column",zIndex:1001 }}>
        <div style={{ padding:"12px 16px 0",flexShrink:0 }}>
          <div style={{ width:40,height:4,background:"#444",borderRadius:99,margin:"0 auto 12px" }} />
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
            <div style={{ color:"#fff",fontWeight:700,fontSize:16 }}>💬 Comments {comments.length > 0 && `(${comments.length})`}</div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)",border:"none",borderRadius:"50%",width:30,height:30,color:"#fff",cursor:"pointer",fontSize:16 }}>✕</button>
          </div>
        </div>
        <div style={{ flex:1,overflowY:"auto",padding:"0 16px 8px" }}>
          {loading && <div style={{ color:"#666",textAlign:"center",padding:32 }}>Loading...</div>}
          {!loading && comments.length === 0 && (
            <div style={{ color:"#555",textAlign:"center",padding:40 }}>
              <div style={{ fontSize:36,marginBottom:8 }}>💬</div>
              <div style={{ fontSize:14 }}>No comments yet. Be first!</div>
            </div>
          )}
          {comments.map(c => (
            <div key={c.id} style={{ display:"flex",gap:10,marginBottom:16,alignItems:"flex-start" }}>
              <img src={c.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.username}`} style={{ width:36,height:36,borderRadius:"50%",flexShrink:0,border:"2px solid rgba(108,99,255,0.3)" }} />
              <div style={{ flex:1 }}>
                <div style={{ color:"#ff8e53",fontSize:12,fontWeight:700,marginBottom:3 }}>@{c.username}</div>
                <div style={{ color:"#eee",fontSize:14,lineHeight:1.4 }}>{c.comment_text}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div style={{ flexShrink:0,borderTop:"1px solid rgba(255,255,255,0.1)",background:"#12122a",padding:"14px 16px 28px" }}>
          {/* show who is commenting — read only */}
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10,padding:"8px 12px",background:"rgba(255,255,255,0.04)",borderRadius:10 }}>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${autoName}`} style={{ width:28,height:28,borderRadius:"50%" }} />
            <div style={{ color:"#ff8e53",fontSize:13,fontWeight:600 }}>@{autoName}</div>
            <div style={{ color:"#555",fontSize:11,marginLeft:"auto" }}>Commenting as you</div>
          </div>
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Write your comment here..."
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); post(); } }}
            style={{ width:"100%",background:"rgba(255,255,255,0.09)",border:"1.5px solid rgba(108,99,255,0.4)",borderRadius:12,padding:"11px 14px",color:"#fff",fontSize:14,outline:"none",marginBottom:12,display:"block" }} />
          <button onClick={post} disabled={posting || !text.trim()}
            style={{ width:"100%",padding:"14px",background:(posting||!text.trim())?"#2a2a3e":"linear-gradient(135deg,#ff6b6b,#ff8e53)",border:"none",borderRadius:12,color:(posting||!text.trim())?"#555":"#fff",fontWeight:700,fontSize:16,cursor:(posting||!text.trim())?"not-allowed":"pointer" }}>
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
    navigator.clipboard.writeText(videoUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
      .catch(() => { const ta = document.createElement("textarea"); ta.value = videoUrl; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const shareOptions = [
    { icon:"🔗", label:"Copy Link", color:"#ff6b6b", action: copyLink },
    { icon:"💬", label:"SMS", color:"#34C759", action: (e) => { e.stopPropagation(); window.open(`sms:?&body=${encodeURIComponent(text)}`); onClose(); } },
    { icon:"📧", label:"Email", color:"#00ADEF", action: (e) => { e.stopPropagation(); window.open(`mailto:?subject=${encodeURIComponent("Check out this Sachi video!")}&body=${encodeURIComponent(text)}`); onClose(); } },
    { icon:"🟢", label:"WhatsApp", color:"#25D366", action: (e) => { e.stopPropagation(); window.open(`https://wa.me/?text=${encodeURIComponent(text)}`); onClose(); } },
    { icon:"🐦", label:"X (Twitter)", color:"#1DA1F2", action: (e) => { e.stopPropagation(); window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`); onClose(); } },
    { icon:"📘", label:"Facebook", color:"#1877F2", action: (e) => { e.stopPropagation(); window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`); onClose(); } },
    { icon:"💼", label:"LinkedIn", color:"#0A66C2", action: (e) => { e.stopPropagation(); window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(videoUrl)}`); onClose(); } },
    { icon:"📱", label:"More", color:"#888", action: (e) => { e.stopPropagation(); navigator.share ? navigator.share({ title:"Sachi", text:video.caption, url:videoUrl }).catch(()=>{}) : copyLink(e); onClose(); } },
  ];

  return (
    <div style={{ position:"fixed",inset:0,zIndex:400,display:"flex",flexDirection:"column" }} onClick={onClose}>
      <div style={{ flex:1,background:"rgba(0,0,0,0.5)" }} />
      <div onClick={e => e.stopPropagation()} style={{ background:"#0d0d1a",borderRadius:"24px 24px 0 0",padding:"20px 16px 40px" }}>
        <div style={{ width:40,height:4,background:"#333",borderRadius:99,margin:"0 auto 16px" }} />
        <div style={{ color:"#fff",fontWeight:800,fontSize:17,marginBottom:4 }}>Share</div>
        <div style={{ color:"#555",fontSize:12,marginBottom:20,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{videoUrl}</div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:16,marginBottom:16 }}>
          {shareOptions.map(opt => (
            <div key={opt.label} onClick={opt.action} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:8,cursor:"pointer" }}>
              <div style={{ width:56,height:56,borderRadius:16,background:opt.label==="Copy Link"&&copied?"#22c55e":opt.color+"22",border:`1.5px solid ${opt.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26 }}>
                {opt.label==="Copy Link"&&copied?"✓":opt.icon}
              </div>
              <span style={{ color:"#aaa",fontSize:11,textAlign:"center",lineHeight:1.2 }}>{opt.label==="Copy Link"&&copied?"Copied!":opt.label}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} style={{ width:"100%",padding:14,background:"rgba(255,255,255,0.07)",border:"none",borderRadius:12,color:"#888",fontSize:15,cursor:"pointer",marginTop:4 }}>Cancel</button>
      </div>
    </div>
  );
}

// ── Video Card ────────────────────────────────────────────────────────────────
function VideoCard({ video, liked, onLike, onComment, currentUser }) {
  const vidRef = useRef(null);
  const containerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) { vidRef.current?.pause(); setPlaying(false); }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const togglePlay = () => {
    if (!vidRef.current) return;
    if (vidRef.current.paused) { vidRef.current.play().then(() => setPlaying(true)).catch(() => {}); }
    else { vidRef.current.pause(); setPlaying(false); }
  };

  const toggleMute = (e) => { e.stopPropagation(); if (!vidRef.current) return; vidRef.current.muted = !vidRef.current.muted; setMuted(!muted); };

  const handleFollow = (e) => {
    e.stopPropagation();
    setFollowed(f => !f);
  };

  const handleEmailCreator = (e) => {
    e.stopPropagation();
    const subject = encodeURIComponent(`Message for @${video.username} on Sachi`);
    const body = encodeURIComponent(`Hi ${video.display_name || video.username},\n\nI saw your video on Sachi and wanted to reach out!\n\n`);
    window.open(`mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`);
  };

  const isLiked = liked;
  const username = video.username || "creator";

  return (
    <div ref={containerRef} style={{ position:"relative",width:"100%",height:"100svh",background:"#000",flexShrink:0,overflow:"hidden" }}>
      {/* Video */}
      <video ref={vidRef} src={video.video_url} poster={video.thumbnail_url} loop playsInline
        style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover" }}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onClick={togglePlay} />

      {/* Play/Pause overlay */}
      {!playing && (
        <div onClick={togglePlay} style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.2)",zIndex:2,cursor:"pointer" }}>
          <div style={{ width:72,height:72,borderRadius:"50%",background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32 }}>▶</div>
        </div>
      )}

      {/* Mute button */}
      <button onClick={toggleMute} style={{ position:"absolute",top:16,right:16,zIndex:10,background:"rgba(0,0,0,0.5)",border:"none",borderRadius:"50%",width:40,height:40,color:"#fff",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
        {muted ? "🔇" : "🔊"}
      </button>

      {/* Bottom info */}
      <div style={{ position:"absolute",bottom:80,left:0,right:80,padding:"0 16px",zIndex:5 }}>
        {/* Creator row with follow button */}
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
          <img src={video.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
            style={{ width:44,height:44,borderRadius:"50%",border:"2px solid #fff",flexShrink:0 }} />
          <div style={{ flex:1 }}>
            <div style={{ color:"#fff",fontWeight:800,fontSize:15 }}>{video.display_name || username}</div>
            <div style={{ color:"rgba(255,255,255,0.7)",fontSize:12 }}>@{username}</div>
          </div>
          {/* Follow/Subscribe button */}
          <button onClick={handleFollow}
            style={{ padding:"7px 16px",borderRadius:20,border:followed?"2px solid #ff8e53":"2px solid #fff",background:followed?"linear-gradient(135deg,#ff6b6b,#ff8e53)":"transparent",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",flexShrink:0,transition:"all 0.2s" }}>
            {followed ? "✓ Following" : "+ Follow"}
          </button>
        </div>

        {/* Caption */}
        <div style={{ color:"#fff",fontSize:14,lineHeight:1.5,marginBottom:8,textShadow:"0 1px 4px rgba(0,0,0,0.8)" }}>
          {video.caption}
        </div>

        {/* Hashtags */}
        {video.hashtags?.length > 0 && (
          <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
            {video.hashtags.map(h => (
              <span key={h} style={{ color:"#ffd93d",fontSize:13,fontWeight:600 }}>#{h}</span>
            ))}
          </div>
        )}
      </div>

      {/* Right action bar */}
      <div style={{ position:"absolute",right:12,bottom:90,zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",gap:20 }}>
        {/* Like */}
        <div onClick={() => onLike(video.id)} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer" }}>
          <div style={{ width:48,height:48,borderRadius:"50%",background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,transition:"transform 0.15s",transform:isLiked?"scale(1.2)":"scale(1)" }}>
            {isLiked ? "❤️" : "🤍"}
          </div>
          <span style={{ color:"#fff",fontSize:12,fontWeight:600,textShadow:"0 1px 3px rgba(0,0,0,0.8)" }}>{formatCount((video.likes_count||0)+(isLiked?1:0))}</span>
        </div>

        {/* Comment */}
        <div onClick={() => onComment(video)} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer" }}>
          <div style={{ width:48,height:48,borderRadius:"50%",background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26 }}>💬</div>
          <span style={{ color:"#fff",fontSize:12,fontWeight:600,textShadow:"0 1px 3px rgba(0,0,0,0.8)" }}>{formatCount(video.comments_count||0)}</span>
        </div>

        {/* Email creator */}
        <div onClick={handleEmailCreator} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer" }}>
          <div style={{ width:48,height:48,borderRadius:"50%",background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26 }}>📧</div>
          <span style={{ color:"#fff",fontSize:12,fontWeight:600,textShadow:"0 1px 3px rgba(0,0,0,0.8)" }}>Contact</span>
        </div>

        {/* Share */}
        <div onClick={e => { e.stopPropagation(); setShowShare(true); }} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer" }}>
          <div style={{ width:48,height:48,borderRadius:"50%",background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26 }}>↗️</div>
          <span style={{ color:"#fff",fontSize:12,fontWeight:600,textShadow:"0 1px 3px rgba(0,0,0,0.8)" }}>{formatCount(video.shares_count||0)}</span>
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

  useEffect(() => {
    setLoading(true);
    Video.list().then(r => { setVideos(Array.isArray(r)?r:[]); setLoading(false); }).catch(() => setLoading(false));
  }, [feedKey]);

  const onLike = async (id) => {
    setLiked(prev => { const n = new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
    const v = videos.find(x => x.id === id);
    if (v) { const newCount = (v.likes_count||0) + (liked.has(id)?-1:1); Video.update(id,{likes_count:Math.max(0,newCount)}).catch(()=>{}); }
  };

  const onCommentPosted = (id, count) => { setVideos(prev => prev.map(v => v.id===id?{...v,comments_count:count}:v)); };

  if (loading) return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"100%",flexDirection:"column",gap:16 }}>
      <div style={{ fontSize:40 }}>⏳</div>
      <div style={{ color:"#555",fontSize:14 }}>Loading feed...</div>
    </div>
  );

  if (videos.length === 0) return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",padding:32 }}>
      <div style={{ fontSize:64,marginBottom:16 }}>🎬</div>
      <div style={{ color:"#fff",fontWeight:800,fontSize:20,marginBottom:8 }}>No videos yet</div>
      <div style={{ color:"#666",fontSize:14,textAlign:"center" }}>Be the first to post! Tap ➕ below.</div>
    </div>
  );

  return (
    <>
      <div style={{ height:"100%",overflowY:"scroll",scrollSnapType:"y mandatory",scrollbarWidth:"none" }}>
        {videos.map(v => (
          <div key={v.id} style={{ scrollSnapAlign:"start",height:"100svh" }}>
            <VideoCard video={v} liked={liked.has(v.id)} onLike={onLike} onComment={setCommentVideo} currentUser={currentUser} />
          </div>
        ))}
      </div>
      {commentVideo && <CommentSheet video={commentVideo} currentUser={currentUser} onClose={() => setCommentVideo(null)} onCommentPosted={onCommentPosted} />}
    </>
  );
}

// ── Explore ───────────────────────────────────────────────────────────────────
function ExplorePage({ currentUser }) {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => { Video.list().then(r => setVideos(Array.isArray(r)?r:[])).catch(()=>{}); }, []);

  const filtered = videos.filter(v => {
    const q = search.toLowerCase();
    return !q || (v.caption||"").toLowerCase().includes(q) || (v.username||"").toLowerCase().includes(q) || (v.hashtags||[]).some(h=>h.toLowerCase().includes(q));
  });

  return (
    <div style={{ padding:"60px 16px 20px" }}>
      <div style={{ color:"#fff",fontWeight:900,fontSize:24,marginBottom:16 }}>🔍 Explore</div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search videos, users, hashtags..."
        style={{ width:"100%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,padding:"12px 16px",color:"#fff",fontSize:14,outline:"none",marginBottom:20,boxSizing:"border-box" }} />
      {filtered.length === 0 ? (
        <div style={{ textAlign:"center",color:"#444",padding:32 }}>No videos found</div>
      ) : (
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:3 }}>
          {filtered.map(v => (
            <div key={v.id} style={{ aspectRatio:"9/16",background:"#111",borderRadius:4,overflow:"hidden",position:"relative" }}>
              <video src={v.video_url} poster={v.thumbnail_url} style={{ width:"100%",height:"100%",objectFit:"cover" }} muted playsInline />
              <div style={{ position:"absolute",bottom:4,left:4,right:4 }}>
                <div style={{ color:"#fff",fontSize:10,fontWeight:700,textShadow:"0 1px 3px rgba(0,0,0,0.9)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>@{v.username}</div>
              </div>
            </div>
          ))}
        </div>
      )}
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

  const autoUsername = (currentUser?.username || currentUser?.full_name || currentUser?.email?.split("@")[0] || "").replace(/^@/,"").replace(/\s+/g,"_").toLowerCase();
  const autoDisplayName = currentUser?.full_name || autoUsername;
  const autoAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${autoUsername}`;

  const pick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
  };

  const upload = async () => {
    if (!file) return setError("Pick a video first");
    setUploading(true); setError("");
    try {
      setProgress("Compressing video...");
      const compressed = await compressVideo(file, setProgress);
      setProgress("Capturing thumbnail...");
      const thumbUrl = await captureVideoThumbnail(file);
      setProgress("Uploading video...");
      const videoUrl = await uploadVideoFile(compressed);
      setProgress("Saving to feed...");
      const hashtags = hashtagsRaw.split(/[\s,#]+/).map(h=>h.trim().replace(/^#/,"")).filter(Boolean);
      await Video.create({
        user_id: currentUser?.id || "",
        username: autoUsername,
        display_name: autoDisplayName,
        avatar_url: autoAvatar,
        video_url: videoUrl,
        thumbnail_url: thumbUrl || "",
        caption: caption.trim() || "",
        hashtags,
        likes_count: 0,
        comments_count: 0,
        views_count: 0,
        shares_count: 0,
        is_approved: true,
        is_archived: false,
      });
      setProgress(""); setFile(null); setPreview(null); setCaption(""); setHashtagsRaw("");
      onPosted();
    } catch(e) { setError(e.message || "Upload failed"); setProgress(""); }
    finally { setUploading(false); }
  };

  return (
    <div style={{ padding:"60px 20px 30px",minHeight:"100%" }}>
      <div style={{ color:"#fff",fontWeight:900,fontSize:24,marginBottom:4 }}>➕ New Post</div>
      <div style={{ color:"#666",fontSize:13,marginBottom:20 }}>Posting as <span style={{ color:"#ff8e53" }}>@{autoUsername}</span></div>

      <input type="file" accept="video/*" ref={fileRef} onChange={pick} style={{ display:"none" }} />
      <div onClick={() => fileRef.current?.click()}
        style={{ width:"100%",aspectRatio:"9/16",maxHeight:320,background:"#111",borderRadius:16,border:`2px dashed ${file?"#ff8e53":"#333"}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",marginBottom:16,position:"relative" }}>
        {preview ? (
          <video src={preview} style={{ width:"100%",height:"100%",objectFit:"cover" }} muted playsInline />
        ) : (
          <>
            <div style={{ fontSize:48,marginBottom:12 }}>🎬</div>
            <div style={{ color:"#888",fontSize:16,fontWeight:600 }}>Tap to select video</div>
            <div style={{ color:"#555",fontSize:12,marginTop:4 }}>MP4, MOV, WebM supported</div>
          </>
        )}
      </div>

      <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Write a caption..." rows={3}
        style={{ width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,padding:"13px 16px",color:"#fff",fontSize:14,outline:"none",resize:"none",fontFamily:"inherit",marginBottom:12,boxSizing:"border-box" }} />
      <input value={hashtagsRaw} onChange={e => setHashtagsRaw(e.target.value)} placeholder="Add hashtags: fun travel food..."
        style={{ width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,padding:"13px 16px",color:"#fff",fontSize:14,outline:"none",marginBottom:16,boxSizing:"border-box" }} />

      {error && <div style={{ color:"#ff6b6b",fontSize:13,marginBottom:12,textAlign:"center" }}>{error}</div>}
      {progress && <div style={{ color:"#ffd93d",fontSize:13,marginBottom:12,textAlign:"center" }}>⏳ {progress}</div>}

      <button onClick={upload} disabled={uploading || !file}
        style={{ width:"100%",padding:"16px",background:(!file||uploading)?"#1a1a2e":"linear-gradient(135deg,#ff6b6b,#ff8e53)",border:"none",borderRadius:14,color:(!file||uploading)?"#555":"#fff",fontSize:17,fontWeight:800,cursor:(!file||uploading)?"not-allowed":"pointer" }}>
        {uploading ? progress || "Uploading..." : "🚀 Post Video"}
      </button>
    </div>
  );
}

// ── Profile ───────────────────────────────────────────────────────────────────
function ProfilePage({ currentUser, onLogout }) {
  const username = (currentUser?.username || currentUser?.full_name || currentUser?.email?.split("@")[0] || "").replace(/^@/,"").replace(/\s+/g,"_").toLowerCase();
  const [videos, setVideos] = useState([]);

  useEffect(() => { Video.filter({ username }).then(setVideos).catch(()=>{}); }, [username]);

  return (
    <div style={{ padding:"60px 20px 20px",minHeight:"100%" }}>
      <div style={{ display:"flex",flexDirection:"column",alignItems:"center",marginBottom:28 }}>
        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} style={{ width:88,height:88,borderRadius:"50%",border:"3px solid #ff8e53",marginBottom:12 }} />
        <div style={{ color:"#fff",fontWeight:800,fontSize:20 }}>{currentUser?.full_name || username}</div>
        <div style={{ color:"#ff8e53",fontSize:14,marginTop:2 }}>@{username}</div>
        <div style={{ color:"#555",fontSize:12,marginTop:4 }}>{currentUser?.email}</div>
        <div style={{ display:"flex",gap:24,marginTop:16 }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ color:"#fff",fontWeight:800,fontSize:20 }}>{videos.length}</div>
            <div style={{ color:"#666",fontSize:11 }}>Videos</div>
          </div>
        </div>
      </div>
      <div style={{ color:"#888",fontSize:12,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:12 }}>My Videos</div>
      {videos.length === 0 ? (
        <div style={{ textAlign:"center",color:"#444",padding:32 }}>No videos yet — post your first one!</div>
      ) : (
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:3 }}>
          {videos.map(v => (
            <div key={v.id} style={{ aspectRatio:"9/16",background:"#111",borderRadius:4,overflow:"hidden" }}>
              <video src={v.video_url} poster={v.thumbnail_url} style={{ width:"100%",height:"100%",objectFit:"cover" }} muted playsInline />
            </div>
          ))}
        </div>
      )}
      <button onClick={onLogout} style={{ width:"100%",marginTop:32,padding:"14px",background:"rgba(255,107,107,0.1)",border:"1px solid rgba(255,107,107,0.3)",borderRadius:12,color:"#ff6b6b",fontSize:15,fontWeight:600,cursor:"pointer" }}>
        Log Out
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
    if (!email.trim() || !password.trim()) return setError("Enter email and password");
    setWorking(true); setError("");
    try { await User.login({ email:email.trim(), password }); const u = await User.me(); setUser(u); }
    catch(e) { setError(e.message || "Login failed"); }
    finally { setWorking(false); }
  };

  const signup = async () => {
    if (!email.trim() || !password.trim()) return setError("Enter email and password");
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
    catch(e) { setError(e.message || "Sign up failed"); }
    finally { setWorking(false); }
  };

  const logout = async () => { await User.logout().catch(()=>{}); setUser(null); setEmail(""); setPassword(""); setDisplayName(""); setUsername(""); };

  if (loading) return (
    <div style={{ background:"#050510",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ fontSize:40 }}>⏳</div>
    </div>
  );

  if (!user) return (
    <div style={{ background:"#050510",minHeight:"100vh",maxWidth:480,margin:"0 auto",fontFamily:"'Inter',-apple-system,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32 }}>
      <style>{`* { box-sizing: border-box } body { background: #050510; margin: 0 }`}</style>
      <img src="https://media.base44.com/images/public/69b2ee18a8e6fb58c7f0261c/99914c9a7_generated_image.png" alt="Sachi" style={{ width:72,height:72,borderRadius:18,marginBottom:12,boxShadow:"0 8px 30px rgba(255,107,107,0.4)" }} />
      <div style={{ fontSize:36,fontWeight:900,letterSpacing:"-1px",background:"linear-gradient(135deg,#ff6b6b,#ff8e53,#ffd93d)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:4 }}>sachi</div>
      <div style={{ color:"#555",fontSize:12,letterSpacing:"3px",textTransform:"uppercase",marginBottom:32 }}>real moments. real you.</div>
      <div style={{ width:"100%",background:"rgba(255,255,255,0.04)",borderRadius:16,padding:24 }}>
        <div style={{ display:"flex",gap:8,marginBottom:24 }}>
          {["login","signup"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }}
              style={{ flex:1,padding:"10px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700,fontSize:14,background:mode===m?"linear-gradient(135deg,#ff6b6b,#ff8e53)":"rgba(255,255,255,0.06)",color:mode===m?"#fff":"#666" }}>
              {m==="login"?"Log In":"Sign Up"}
            </button>
          ))}
        </div>
        {mode==="signup" && (
          <>
            <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Display name"
              style={{ width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"12px 14px",color:"#fff",fontSize:14,marginBottom:12,outline:"none" }} />
            <div style={{ position:"relative",marginBottom:12 }}>
              <span style={{ position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#ff8e53",fontWeight:700 }}>@</span>
              <input value={username} onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_.]/g,""))} placeholder="username"
                style={{ width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"12px 14px 12px 28px",color:"#fff",fontSize:14,outline:"none" }} />
            </div>
          </>
        )}
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" type="email"
          style={{ width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"12px 14px",color:"#fff",fontSize:14,marginBottom:12,outline:"none" }} />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password"
          onKeyDown={e => e.key==="Enter"&&(mode==="login"?login():signup())}
          style={{ width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"12px 14px",color:"#fff",fontSize:14,marginBottom:16,outline:"none" }} />
        {error && <div style={{ color:"#ff6b6b",fontSize:13,marginBottom:12,textAlign:"center" }}>{error}</div>}
        <button onClick={mode==="login"?login:signup} disabled={working}
          style={{ width:"100%",padding:"14px",background:working?"#333":"linear-gradient(135deg,#ff6b6b,#ff8e53)",border:"none",borderRadius:12,color:"#fff",fontSize:16,fontWeight:700,cursor:working?"not-allowed":"pointer" }}>
          {working?"...":(mode==="login"?"Log In":"Create Account")}
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

  useEffect(() => { const t = setTimeout(() => setSplash(false), 2200); return () => clearTimeout(t); }, []);

  const onPosted = () => { setFeedKey(k => k+1); setTab("feed"); };

  // TikTok-style 5-tab bottom nav
  const tabs = [
    { key:"feed",    icon:"🏠", label:"Home"    },
    { key:"explore", icon:"🔍", label:"Explore" },
    { key:"upload",  icon:"➕", label:"Post"    },
    { key:"inbox",   icon:"📬", label:"Inbox"   },
    { key:"profile", icon:"👤", label:"Me"      },
  ];

  return (
    <div style={{ background:"#050510",height:"100svh",maxWidth:480,margin:"0 auto",fontFamily:"'Inter',-apple-system,sans-serif",position:"relative",display:"flex",flexDirection:"column",overflow:"hidden" }}>
      <style>{`* { box-sizing: border-box } ::-webkit-scrollbar { display: none } body { background: #050510; margin: 0 } @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
      {splash && <Splash />}

      {/* Top logo bar — only on feed */}
      {tab === "feed" && (
        <div style={{ position:"absolute",top:0,left:0,right:0,zIndex:20,display:"flex",justifyContent:"center",alignItems:"center",padding:"12px 0",background:"linear-gradient(to bottom,rgba(0,0,0,0.6),transparent)",pointerEvents:"none" }}>
          <div style={{ fontSize:22,fontWeight:900,background:"linear-gradient(135deg,#ff6b6b,#ff8e53)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>sachi</div>
        </div>
      )}

      {/* Page content */}
      <div style={{ flex:1,overflow:"hidden",position:"relative" }}>
        {tab === "feed"    && <FeedPage feedKey={feedKey} currentUser={currentUser} />}
        {tab === "explore" && <div style={{ height:"100%",overflowY:"auto" }}><ExplorePage currentUser={currentUser} /></div>}
        {tab === "upload"  && <div style={{ height:"100%",overflowY:"auto" }}><UploadPage currentUser={currentUser} onPosted={onPosted} /></div>}
        {tab === "inbox"   && <div style={{ height:"100%",overflowY:"auto" }}><InboxPage currentUser={currentUser} /></div>}
        {tab === "profile" && <div style={{ height:"100%",overflowY:"auto" }}><ProfilePage currentUser={currentUser} onLogout={onLogout} /></div>}
      </div>

      {/* Bottom Nav — TikTok style 5 tabs */}
      <div style={{ flexShrink:0,display:"flex",background:"rgba(5,5,16,0.95)",borderTop:"1px solid rgba(255,255,255,0.08)",paddingBottom:"env(safe-area-inset-bottom)",backdropFilter:"blur(20px)" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"10px 0",background:"none",border:"none",cursor:"pointer",gap:3,
              position:"relative" }}>
            {/* Upload button gets special styling */}
            {t.key === "upload" ? (
              <div style={{ width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#ff6b6b,#ff8e53)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:2,boxShadow:"0 4px 15px rgba(255,107,107,0.4)" }}>➕</div>
            ) : (
              <div style={{ fontSize:24,filter:tab===t.key?"none":"grayscale(1)",opacity:tab===t.key?1:0.5,transition:"all 0.2s" }}>{t.icon}</div>
            )}
            <span style={{ fontSize:10,color:tab===t.key?"#ff8e53":"#555",fontWeight:tab===t.key?700:400,transition:"color 0.2s" }}>{t.label}</span>
            {/* active dot */}
            {tab===t.key && t.key!=="upload" && <div style={{ position:"absolute",bottom:2,width:4,height:4,borderRadius:"50%",background:"#ff8e53" }} />}
          </button>
        ))}
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
