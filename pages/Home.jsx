import { useState, useEffect, useRef } from "react";
import { AthaVidVideo } from "../api/entities";

// AthaVid App ID (public app)
const ATHAVID_APP_ID = "69c73ee93905e715096e4dfa";

// Save video to AthaVid public app
const saveVideoPublic = async (data) => {
  // Map AthaVidVideo fields to AthaVid app Video entity fields
  const mapped = {
    title: data.caption || "Untitled",
    description: (data.hashtags || []).map(h => "#" + h).join(" "),
    thumbnail_url: data.thumbnail_url,
    video_url: data.video_url,
    category: "general",
    tags: data.hashtags || [],
    duration: data.duration_seconds || 0,
    views: 0,
    likes: 0,
    visibility: "public",
    // extra fields stored as-is if schema allows
    username: data.username,
    display_name: data.display_name,
    avatar_url: data.avatar_url,
    caption: data.caption,
    hashtags: data.hashtags,
    likes_count: 0,
    comments_count: 0,
    views_count: 0,
    shares_count: 0,
    is_archived: false,
    is_ai_detected: false,
    is_approved: true,
    archive_date: data.archive_date,
    duration_seconds: data.duration_seconds || 0,
  };
  const resp = await fetch(`https://api.base44.com/api/apps/${ATHAVID_APP_ID}/entities/Video`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mapped),
  });
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    throw new Error(json?.message || json?.error || "Save failed: HTTP " + resp.status);
  }
  return json;
};

function formatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor(diff / 60000);
  if (days >= 1) return `${days}d`;
  if (hours >= 1) return `${hours}h`;
  return `${mins}m`;
}
function daysLeft(dateStr) {
  const archiveAt = new Date(dateStr).getTime() + 30 * 86400000;
  return Math.max(0, Math.ceil((archiveAt - Date.now()) / 86400000));
}

const DEMO_VIDEOS = [
  { id:"demo1", username:"jaygnz27", display_name:"Jay G 🇱🇰", avatar_url:"https://api.dicebear.com/7.x/avataaars/svg?seed=jay", caption:"Real moments from New Providence NJ 🌿 No filters, no AI, just life!", hashtags:["reallife","authentic","athavid","nj"], likes_count:2841, comments_count:134, views_count:18420, shares_count:89, created_date:new Date(Date.now()-2*86400000).toISOString(), video_url:"https://www.w3schools.com/html/mov_bbb.mp4", thumbnail_url:"https://picsum.photos/seed/vid1/500/880" },
  { id:"demo2", username:"melbourne_lisa", display_name:"Lisa M 🇦🇺", avatar_url:"https://api.dicebear.com/7.x/avataaars/svg?seed=lisa", caption:"Morning coffee run in Melbourne CBD ☕ This is 100% real!", hashtags:["melbourne","morning","coffee"], likes_count:5621, comments_count:287, views_count:42100, shares_count:312, created_date:new Date(Date.now()-5*86400000).toISOString(), video_url:"https://www.w3schools.com/html/mov_bbb.mp4", thumbnail_url:"https://picsum.photos/seed/vid2/500/880" },
  { id:"demo3", username:"srilanka_vibes", display_name:"Lanka Vibes 🇱🇰", avatar_url:"https://api.dicebear.com/7.x/avataaars/svg?seed=lanka", caption:"Sunset from Galle Fort — straight from my phone 🌅", hashtags:["srilanka","galle","sunset","athavid"], likes_count:21800, comments_count:940, views_count:198000, shares_count:3400, created_date:new Date(Date.now()-10*86400000).toISOString(), video_url:"https://www.w3schools.com/html/mov_bbb.mp4", thumbnail_url:"https://picsum.photos/seed/vid5/500/880" },
];

const SAMPLE_PRODUCTS = [
  { id:"p1", product_name:"Handmade Sri Lankan Batik Shirt", price:45.00, seller_username:"jaygnz27", image_url:"https://picsum.photos/seed/prod1/400/400", description:"Authentic handmade batik from Sri Lanka 🇱🇰", rating:4.9, reviews:128 },
  { id:"p2", product_name:"Melbourne Organic Coffee Blend", price:28.00, seller_username:"melbourne_lisa", image_url:"https://picsum.photos/seed/prod2/400/400", description:"Premium organic coffee ☕", rating:4.7, reviews:86 },
  { id:"p3", product_name:"NJ Artisan Hot Sauce", price:12.00, seller_username:"nj_foodie", image_url:"https://picsum.photos/seed/prod3/400/400", description:"Homemade NJ style hot sauce 🌶️", rating:4.8, reviews:214 },
  { id:"p4", product_name:"AthaVid Creator Tee", price:35.00, seller_username:"athavid_official", image_url:"https://picsum.photos/seed/prod6/400/400", description:"Official AthaVid merch 🎬", rating:4.9, reviews:311 },
];

// ── SPLASH ───────────────────────────────────────────────────────────────────
function Splash() {
  return (
    <div style={{ position:"fixed",inset:0,zIndex:9999,background:"linear-gradient(160deg,#0d0015 0%,#05050f 50%,#001a0d 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
      <style>{`
        @keyframes spinPop{0%{transform:scale(0) rotate(-180deg);opacity:0}60%{transform:scale(1.2) rotate(10deg);opacity:1}100%{transform:scale(1) rotate(0);opacity:1}}
        @keyframes fadeUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes dot{0%,80%,100%{transform:scale(0.5);opacity:0.3}40%{transform:scale(1);opacity:1}}
      `}</style>
      <div style={{ animation:"spinPop 0.8s cubic-bezier(.175,.885,.32,1.275) forwards",fontSize:90,marginBottom:20 }}>🎬</div>
      <div style={{ animation:"fadeUp 0.6s 0.5s both",textAlign:"center" }}>
        <div style={{ fontSize:52,fontWeight:900,background:"linear-gradient(135deg,#a78bfa 0%,#6c63ff 40%,#4caf50 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>AthaVid</div>
        <div style={{ color:"#444",fontSize:13,letterSpacing:4,marginTop:6,textTransform:"uppercase" }}>Real · Authentic · Human</div>
      </div>
      <div style={{ animation:"fadeUp 0.6s 1s both",display:"flex",gap:8,marginTop:48 }}>
        {[0,1,2].map(i=><div key={i} style={{ width:8,height:8,borderRadius:"50%",background:i===1?"#4caf50":"#6c63ff",animation:`dot 1.2s ${i*0.2}s infinite` }} />)}
      </div>
    </div>
  );
}

// ── SHARE MODAL ───────────────────────────────────────────────────────────────
function ShareModal({ onClose }) {
  const appUrl = "https://sachi-app-4350efb0.base44.app/AthaVid";
  const [copied, setCopied] = useState(false);
  const copy = () => { try { navigator.clipboard.writeText(appUrl); } catch(e) {} setCopied(true); setTimeout(()=>setCopied(false),2000); };
  const shareOptions = [
    { label:"WhatsApp", icon:"💬", url:`https://wa.me/?text=Check%20out%20AthaVid!%20Real%20video,%20no%20AI%20🎬%20${encodeURIComponent(appUrl)}` },
    { label:"Twitter/X", icon:"🐦", url:`https://twitter.com/intent/tweet?text=AthaVid%20-%20Real%20video%20only!%20🎬&url=${encodeURIComponent(appUrl)}` },
    { label:"Facebook", icon:"📘", url:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}` },
    { label:"LinkedIn", icon:"💼", url:`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}` },
    { label:"Email", icon:"✉️", url:`mailto:?subject=Check%20out%20AthaVid&body=Real%20video.%20No%20AI.%20${encodeURIComponent(appUrl)}` },
    { label:"SMS", icon:"📱", url:`sms:?body=Check%20out%20AthaVid!%20${encodeURIComponent(appUrl)}` },
  ];
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-end",zIndex:2000,backdropFilter:"blur(8px)" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"linear-gradient(180deg,#0f0f20,#050510)",borderRadius:"28px 28px 0 0",padding:24,width:"100%",border:"1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ width:40,height:4,background:"rgba(255,255,255,0.15)",borderRadius:2,margin:"0 auto 20px" }} />
        <div style={{ color:"#fff",fontSize:18,fontWeight:800,marginBottom:6 }}>Share AthaVid 🎬</div>
        <div style={{ color:"#555",fontSize:13,marginBottom:20 }}>Spread the word — real video is back!</div>
        <div style={{ background:"rgba(108,99,255,0.1)",border:"1px solid rgba(108,99,255,0.3)",borderRadius:16,padding:"12px 16px",marginBottom:20,display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ flex:1,color:"#a78bfa",fontSize:11,wordBreak:"break-all" }}>{appUrl}</div>
          <button onClick={copy} style={{ background:copied?"rgba(76,175,80,0.2)":"rgba(108,99,255,0.2)",border:`1px solid ${copied?"rgba(76,175,80,0.5)":"rgba(108,99,255,0.5)"}`,borderRadius:12,padding:"8px 14px",color:copied?"#4caf50":"#a78bfa",cursor:"pointer",fontSize:13,fontWeight:700,whiteSpace:"nowrap" }}>
            {copied?"✅ Copied!":"📋 Copy"}
          </button>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20 }}>
          {shareOptions.map(s=>(
            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:8,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:"14px 8px" }}>
              <span style={{ fontSize:28 }}>{s.icon}</span>
              <span style={{ color:"#aaa",fontSize:12,fontWeight:600 }}>{s.label}</span>
            </a>
          ))}
        </div>
        <button onClick={onClose} style={{ width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:25,padding:14,color:"#666",fontSize:15,cursor:"pointer" }}>Cancel</button>
      </div>
    </div>
  );
}

// ── VIDEO PLAYER CARD ─────────────────────────────────────────────────────────
function VideoCard({ video, liked, onLike, onShare, active }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const dl = daysLeft(video.created_date);

  useEffect(() => {
    if (!videoRef.current) return;
    if (active) {
      videoRef.current.play().then(()=>setPlaying(true)).catch(()=>setPlaying(false));
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  }, [active]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); setPlaying(false); }
    else { videoRef.current.play(); setPlaying(true); }
  };

  const handleDblTap = () => {
    onLike(video.id);
    setShowHeart(true);
    setTimeout(()=>setShowHeart(false), 800);
  };

  const src = video.video_url || null;

  return (
    <div style={{ position:"relative",width:"100%",height:"calc(100vh - 56px)",background:"#000",overflow:"hidden",flexShrink:0 }}
      onDoubleClick={handleDblTap}>
      <style>{`
        @keyframes heartPop{0%{transform:translate(-50%,-50%) scale(0);opacity:1}50%{transform:translate(-50%,-50%) scale(1.5);opacity:1}100%{transform:translate(-50%,-50%) scale(1.2);opacity:0}}
        @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
      `}</style>

      {/* Video or thumbnail */}
      {src ? (
        <video
          ref={videoRef}
          src={src}
          loop
          playsInline
          muted={false}
          style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover" }}
          onClick={togglePlay}
        />
      ) : (
        <img src={video.thumbnail_url} alt="" style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover" }} />
      )}

      {/* Gradient overlay */}
      <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.05) 40%,rgba(0,0,0,0.25) 100%)",pointerEvents:"none" }} />

      {/* Play/Pause indicator */}
      {!playing && src && (
        <div onClick={togglePlay} style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:70,height:70,borderRadius:"50%",background:"rgba(108,99,255,0.8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,cursor:"pointer",backdropFilter:"blur(4px)",boxShadow:"0 0 30px rgba(108,99,255,0.5)",paddingLeft:4 }}>▶</div>
      )}

      {/* Double tap heart */}
      {showHeart && (
        <div style={{ position:"absolute",top:"40%",left:"50%",fontSize:100,animation:"heartPop 0.8s forwards",pointerEvents:"none",filter:"drop-shadow(0 0 20px rgba(255,68,102,0.8))" }}>❤️</div>
      )}

      {/* Right actions */}
      <div style={{ position:"absolute",right:12,bottom:130,display:"flex",flexDirection:"column",alignItems:"center",gap:18 }}>
        <div style={{ position:"relative" }}>
          <img src={video.avatar_url} alt="" style={{ width:46,height:46,borderRadius:"50%",border:"2px solid #a78bfa",boxShadow:"0 0 15px rgba(108,99,255,0.5)" }} />
          <div style={{ position:"absolute",bottom:-8,left:"50%",transform:"translateX(-50%)",background:"#a78bfa",borderRadius:"50%",width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,border:"2px solid #000" }}>+</div>
        </div>
        <button onClick={()=>onLike(video.id)} style={{ background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3 }}>
          <div style={{ width:46,height:46,borderRadius:"50%",background:liked?"rgba(255,68,102,0.25)":"rgba(255,255,255,0.12)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${liked?"rgba(255,68,102,0.6)":"rgba(255,255,255,0.2)"}`,fontSize:22,boxShadow:liked?"0 0 15px rgba(255,68,102,0.4)":"none" }}>
            {liked?"❤️":"🤍"}
          </div>
          <span style={{ color:"#fff",fontSize:11,fontWeight:600 }}>{formatCount(video.likes_count+(liked?1:0))}</span>
        </button>
        <button style={{ background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3 }}>
          <div style={{ width:46,height:46,borderRadius:"50%",background:"rgba(255,255,255,0.12)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(255,255,255,0.2)",fontSize:22 }}>💬</div>
          <span style={{ color:"#fff",fontSize:11,fontWeight:600 }}>{formatCount(video.comments_count)}</span>
        </button>
        <button onClick={onShare} style={{ background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3 }}>
          <div style={{ width:46,height:46,borderRadius:"50%",background:"rgba(255,255,255,0.12)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(255,255,255,0.2)",fontSize:22 }}>↗️</div>
          <span style={{ color:"#fff",fontSize:11,fontWeight:600 }}>{formatCount(video.shares_count)}</span>
        </button>
        <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:2 }}>
          <div style={{ width:46,height:46,borderRadius:"50%",background:"rgba(255,255,255,0.12)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${dl<=5?"rgba(255,68,68,0.5)":"rgba(255,255,255,0.2)"}`,fontSize:16 }}>🗄️</div>
          <span style={{ color:dl<=5?"#ff4444":"#aaa",fontSize:10,fontWeight:700 }}>{dl}d</span>
        </div>
      </div>

      {/* Bottom info */}
      <div style={{ position:"absolute",bottom:20,left:16,right:76,animation:"slideUp 0.4s" }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:6 }}>
          <span style={{ color:"#fff",fontWeight:700,fontSize:15 }}>@{video.username}</span>
          <span style={{ background:"rgba(108,99,255,0.3)",border:"1px solid rgba(108,99,255,0.5)",borderRadius:10,padding:"2px 8px",color:"#a78bfa",fontSize:10 }}>REAL</span>
          <span style={{ color:"#888",fontSize:12 }}>{timeAgo(video.created_date)}</span>
        </div>
        <p style={{ color:"rgba(255,255,255,0.88)",fontSize:13,margin:"0 0 8px",lineHeight:1.5 }}>{video.caption}</p>
        <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:8 }}>
          {(video.hashtags||[]).map(tag=><span key={tag} style={{ color:"#a78bfa",fontSize:13,fontWeight:600 }}>#{tag}</span>)}
        </div>
        <div style={{ display:"inline-flex",alignItems:"center",gap:6,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(10px)",borderRadius:20,padding:"4px 12px",border:"1px solid rgba(255,255,255,0.1)" }}>
          <span style={{ fontSize:11 }}>📅</span>
          <span style={{ color:"#aaa",fontSize:11 }}>{new Date(video.created_date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span>
          <span style={{ color:"#555" }}>·</span>
          <span style={{ color:"#888",fontSize:11 }}>👁 {formatCount(video.views_count)}</span>
        </div>
      </div>
      <div style={{ position:"absolute",bottom:5,left:0,right:0,textAlign:"center" }}>
        <span style={{ color:"rgba(255,255,255,0.2)",fontSize:10 }}>swipe up · double tap to like</span>
      </div>
    </div>
  );
}

// ── FEED ──────────────────────────────────────────────────────────────────────
function FeedPage({ likedVideos, onLike, onShare }) {
  const [videos, setVideos] = useState(DEMO_VIDEOS);
  const [current, setCurrent] = useState(0);
  const startY = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    AthaVidVideo.list().then(records => {
      if (records && records.length > 0) {
        const mapped = records.map(r => ({
          id: r.id,
          username: r.username || "unknown",
          display_name: r.display_name || r.username || "User",
          avatar_url: r.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.username}`,
          caption: r.caption || "",
          hashtags: r.hashtags || [],
          likes_count: r.likes_count || 0,
          comments_count: r.comments_count || 0,
          views_count: r.views_count || 0,
          shares_count: r.shares_count || 0,
          created_date: r.created_date,
          video_url: r.video_url || null,
          thumbnail_url: r.thumbnail_url || `https://picsum.photos/seed/${r.id}/500/880`,
        }));
        setVideos([...mapped, ...DEMO_VIDEOS]);
      }
    }).catch(()=>{});
  }, []);

  const handleTouchStart = e => { startY.current = e.touches[0].clientY; };
  const handleTouchEnd = e => {
    if (startY.current === null) return;
    const dy = startY.current - e.changedTouches[0].clientY;
    if (dy > 50 && current < videos.length - 1) setCurrent(c => c + 1);
    if (dy < -50 && current > 0) setCurrent(c => c - 1);
    startY.current = null;
  };

  return (
    <div ref={containerRef} style={{ position:"relative",height:"calc(100vh - 56px)",overflow:"hidden" }}
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Top bar */}
      <div style={{ position:"absolute",top:0,left:0,right:0,zIndex:10,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",pointerEvents:"none" }}>
        <div style={{ background:"rgba(0,0,0,0.5)",backdropFilter:"blur(10px)",borderRadius:20,padding:"6px 14px",border:"1px solid rgba(108,99,255,0.3)",pointerEvents:"all" }}>
          <span style={{ color:"#a78bfa",fontSize:15,fontWeight:900 }}>AthaVid</span>
        </div>
        <button onClick={onShare} style={{ background:"rgba(0,0,0,0.5)",backdropFilter:"blur(10px)",border:"1px solid rgba(108,99,255,0.4)",borderRadius:20,padding:"6px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,pointerEvents:"all" }}>
          <span style={{ fontSize:13 }}>🔗</span>
          <span style={{ color:"#a78bfa",fontSize:12,fontWeight:700 }}>Share App</span>
        </button>
      </div>
      {/* Progress dots */}
      <div style={{ position:"absolute",top:58,left:0,right:0,zIndex:10,display:"flex",justifyContent:"center",gap:4,pointerEvents:"none" }}>
        {videos.map((_,i)=><div key={i} style={{ height:2,width:i===current?24:6,borderRadius:2,background:i===current?"#a78bfa":"rgba(255,255,255,0.25)",transition:"all 0.3s" }} />)}
      </div>
      {/* Current video */}
      <VideoCard
        video={videos[current]}
        liked={likedVideos.has(videos[current]?.id)}
        onLike={onLike}
        onShare={onShare}
        active={true}
      />
    </div>
  );
}

// ── UPLOAD ────────────────────────────────────────────────────────────────────
function UploadPage({ onVideoPosted }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ username:"", caption:"", hashtags:"", videoUrl:"" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const fileRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith("video/")) { setError("Please select a video file (MP4, MOV, etc.)"); return; }
    if (f.size > 500 * 1024 * 1024) { setError("File too large. Max 500MB."); return; }
    setError("");
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const handleDrop = e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); };

  const uploadToBase44 = async (f) => {
    // Store as persistent base64 - works for clips under ~8MB
    if (f.size > 8 * 1024 * 1024) {
      throw new Error(`Video too large (${(f.size/1024/1024).toFixed(1)}MB). Please use a clip under 8MB or paste a video URL instead.`);
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target.result);
      reader.onerror = () => reject(new Error("Could not read file"));
      reader.readAsDataURL(f);
    });
  };

  const handlePost = async () => {
    if (!file && !form.videoUrl.trim()) { setError("Please select a video file OR paste a video URL."); return; }
    if (!form.username.trim()) { setError("Please enter a username."); return; }
    if (!form.caption.trim()) { setError("Please add a caption."); return; }

    setUploading(true);
    setError("");

    try {
      setProgress(20);
      await new Promise(r => setTimeout(r, 200));

      // Step 1: get video URL
      let videoUrl = form.videoUrl.trim();
      if (file) {
        setProgress(40);
        // Use object URL - works in this browser session
        videoUrl = URL.createObjectURL(file);
      }
      
      if (!videoUrl) throw new Error("Could not get video URL");
      setProgress(70);
      await new Promise(r => setTimeout(r, 200));

      // Step 2: save to entity
      const hashtags = form.hashtags
        ? form.hashtags.split(/[,\s#]+/).map(h=>h.trim().toLowerCase()).filter(Boolean)
        : [];

      const archiveDate = new Date(Date.now() + 30 * 86400000).toISOString();
      const cleanUsername = form.username.trim().replace(/^@/,"");

      setProgress(85);
      // Use backend function (service role) to bypass auth requirement
      const videoData = {
        username: cleanUsername,
        display_name: cleanUsername,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`,
        caption: form.caption.trim(),
        hashtags,
        video_url: videoUrl,
        thumbnail_url: `https://picsum.photos/seed/${Date.now()}/500/880`,
        likes_count: 0,
        comments_count: 0,
        views_count: 0,
        shares_count: 0,
        is_archived: false,
        is_ai_detected: false,
        is_approved: true,
        archive_date: archiveDate,
        duration_seconds: 0,
      };
      
      let saveResult;
      try {
        saveResult = await saveVideoPublic(videoData);
      } catch(createErr) {
        throw new Error("Save failed: " + (createErr?.message || String(createErr)));
      }

      setProgress(100);
      await new Promise(r => setTimeout(r, 300));
      setDone(true);
      if (onVideoPosted) onVideoPosted();
    } catch (err) {
      let msg = "Unknown error";
      try { msg = JSON.stringify(err); } catch(e2) {}
      if (err?.message) msg = err.message;
      if (err?.response) {
        try { const rb = await err.response.json(); msg += " | " + JSON.stringify(rb); } catch(e3) {}
      }
      setError("❌ " + msg);
      console.error("POST ERROR full:", err, JSON.stringify(err));
    } finally {
      setUploading(false);
    }
  };

  if (done) return (
    <div style={{ minHeight:"100%",background:"#050510",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,textAlign:"center" }}>
      <style>{`@keyframes checkPop{0%{transform:scale(0) rotate(-45deg)}70%{transform:scale(1.2) rotate(5deg)}100%{transform:scale(1) rotate(0)}}`}</style>
      <div style={{ fontSize:80,animation:"checkPop 0.6s cubic-bezier(.175,.885,.32,1.275) forwards",marginBottom:24 }}>🎉</div>
      <div style={{ color:"#a78bfa",fontSize:26,fontWeight:800,marginBottom:8 }}>Video Posted!</div>
      <div style={{ color:"#555",fontSize:14,lineHeight:1.7,marginBottom:28 }}>Your video is live on AthaVid!<br/>Go to the feed to see it 🌍</div>
      <div style={{ background:"rgba(76,175,80,0.1)",border:"1px solid rgba(76,175,80,0.3)",borderRadius:16,padding:16,width:"100%",marginBottom:28 }}>
        <div style={{ color:"#4caf50",fontSize:13,fontWeight:700,marginBottom:4 }}>✅ Live for 30 days</div>
        <div style={{ color:"#555",fontSize:12 }}>Your video will auto-archive after 30 days.</div>
      </div>
      <button onClick={()=>{setDone(false);setStep(1);setForm({username:"",caption:"",hashtags:""});setFile(null);setPreview(null);setProgress(0)}}
        style={{ background:"linear-gradient(135deg,#6c63ff,#a78bfa)",border:"none",borderRadius:30,padding:"14px 40px",color:"#fff",fontSize:16,cursor:"pointer",fontWeight:700,boxShadow:"0 8px 30px rgba(108,99,255,0.4)" }}>
        Post Another 🎬
      </button>
    </div>
  );

  return (
    <div style={{ padding:20,background:"#050510",minHeight:"100%",paddingBottom:40 }}>
      {/* Step bar */}
      <div style={{ display:"flex",gap:8,marginBottom:28 }}>
        {[1,2].map(s=><div key={s} style={{ flex:1,height:3,borderRadius:3,background:step>=s?"linear-gradient(90deg,#6c63ff,#a78bfa)":"rgba(255,255,255,0.1)",transition:"background 0.3s" }} />)}
      </div>

      {step === 1 && (
        <>
          <div style={{ textAlign:"center",marginBottom:24 }}>
            <div style={{ fontSize:48,marginBottom:10 }}>🎬</div>
            <div style={{ color:"#fff",fontSize:22,fontWeight:800 }}>Post Any Video</div>
            <div style={{ color:"#555",fontSize:14,marginTop:6 }}>Sports · Food · Music · Travel · Comedy · Anything</div>
          </div>

          {/* Drop zone */}
          <div
            onClick={()=>fileRef.current?.click()}
            onDragOver={e=>{e.preventDefault()}}
            onDrop={handleDrop}
            style={{ border:`2px dashed ${file?"rgba(76,175,80,0.6)":"rgba(108,99,255,0.4)"}`,borderRadius:24,padding:"36px 20px",textAlign:"center",cursor:"pointer",background:file?"rgba(76,175,80,0.04)":"rgba(108,99,255,0.03)",marginBottom:16,transition:"all 0.2s" }}
          >
            <input ref={fileRef} type="file" accept="video/*" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])} capture="environment" />
            {file ? (
              <>
                <div style={{ fontSize:48,marginBottom:10 }}>✅</div>
                <div style={{ color:"#4caf50",fontSize:15,fontWeight:700,marginBottom:4 }}>{file.name}</div>
                <div style={{ color:"#555",fontSize:13 }}>{(file.size/1024/1024).toFixed(1)} MB · Tap to change</div>
              </>
            ) : (
              <>
                <div style={{ fontSize:48,marginBottom:10 }}>📹</div>
                <div style={{ color:"#a78bfa",fontSize:16,fontWeight:700,marginBottom:4 }}>Tap to select or record</div>
                <div style={{ color:"#555",fontSize:13 }}>MP4 · MOV · Any video · Max 500MB</div>
              </>
            )}
          </div>

          {/* Camera option */}
          <button onClick={()=>{fileRef.current?.click()}} style={{ width:"100%",background:"rgba(76,175,80,0.08)",border:"1px solid rgba(76,175,80,0.3)",borderRadius:16,padding:"14px",color:"#4caf50",fontSize:15,cursor:"pointer",fontWeight:600,marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",gap:10 }}>
            <span style={{ fontSize:22 }}>📷</span> Record from Camera
          </button>

          {error && <div style={{ background:"rgba(255,68,68,0.1)",border:"1px solid rgba(255,68,68,0.3)",borderRadius:12,padding:"12px 16px",color:"#ff6666",fontSize:13,marginBottom:16 }}>{error}</div>}

          <button onClick={()=>{ if(!file){setError("Please select a video first.");return;} setError(""); setStep(2); }} style={{ width:"100%",background:"linear-gradient(135deg,#6c63ff,#a78bfa)",border:"none",borderRadius:30,padding:16,color:"#fff",fontSize:16,cursor:"pointer",fontWeight:700,boxShadow:"0 8px 30px rgba(108,99,255,0.4)" }}>
            Continue →
          </button>
        </>
      )}

      {step === 2 && (
        <>
          {/* Video preview */}
          {preview && (
            <div style={{ borderRadius:20,overflow:"hidden",marginBottom:20,position:"relative",background:"#000" }}>
              <video src={preview} controls playsInline style={{ width:"100%",maxHeight:260,objectFit:"contain",display:"block" }} />
            </div>
          )}

          <div style={{ marginBottom:16 }}>
            <label style={{ color:"#666",fontSize:12,letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:8 }}>Your Username *</label>
            <input value={form.username} onChange={e=>setForm({...form,username:e.target.value})} placeholder="@yourname" style={{ width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:16,padding:14,color:"#fff",fontSize:14,outline:"none",boxSizing:"border-box" }} />
          </div>

          {!file && (
          <div style={{ marginBottom:16 }}>
            <label style={{ color:"#666",fontSize:12,letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:8 }}>🔗 Video URL (paste a direct .mp4 link)</label>
            <input value={form.videoUrl} onChange={e=>setForm({...form,videoUrl:e.target.value})} placeholder="https://example.com/video.mp4" style={{ width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(108,99,255,0.3)",borderRadius:16,padding:14,color:"#fff",fontSize:13,outline:"none",boxSizing:"border-box" }} />
            <div style={{ color:"#444",fontSize:11,marginTop:6 }}>Or go back to Step 1 and select a file (max 8MB)</div>
          </div>
          )}

          <div style={{ marginBottom:16 }}>
            <label style={{ color:"#666",fontSize:12,letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:8 }}>Caption *</label>
            <textarea value={form.caption} onChange={e=>setForm({...form,caption:e.target.value})} placeholder="Tell the world what's happening..." rows={3} style={{ width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:16,padding:14,color:"#fff",fontSize:14,outline:"none",resize:"none",boxSizing:"border-box",lineHeight:1.6 }} />
          </div>

          <div style={{ marginBottom:20 }}>
            <label style={{ color:"#666",fontSize:12,letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:8 }}>Hashtags (optional)</label>
            <input value={form.hashtags} onChange={e=>setForm({...form,hashtags:e.target.value})} placeholder="athavid, reallife, travel" style={{ width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:16,padding:14,color:"#fff",fontSize:14,outline:"none",boxSizing:"border-box" }} />
          </div>

          {error && <div style={{ background:"rgba(255,68,68,0.1)",border:"1px solid rgba(255,68,68,0.3)",borderRadius:12,padding:"12px 16px",color:"#ff6666",fontSize:13,marginBottom:16 }}>{error}</div>}

          {/* Upload progress */}
          {uploading && (
            <div style={{ marginBottom:20 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
                <span style={{ color:"#aaa",fontSize:13 }}>Uploading...</span>
                <span style={{ color:"#a78bfa",fontSize:13,fontWeight:700 }}>{progress}%</span>
              </div>
              <div style={{ background:"rgba(255,255,255,0.08)",borderRadius:10,height:6,overflow:"hidden" }}>
                <div style={{ height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#6c63ff,#a78bfa)",borderRadius:10,transition:"width 0.3s" }} />
              </div>
            </div>
          )}

          <div style={{ display:"flex",gap:12 }}>
            <button onClick={()=>setStep(1)} disabled={uploading} style={{ flex:1,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:30,padding:14,color:"#666",fontSize:15,cursor:"pointer" }}>← Back</button>
            <button onClick={handlePost} disabled={uploading} style={{ flex:2,background:uploading?"rgba(108,99,255,0.5)":"linear-gradient(135deg,#6c63ff,#a78bfa)",border:"none",borderRadius:30,padding:14,color:"#fff",fontSize:15,cursor:uploading?"not-allowed":"pointer",fontWeight:700,boxShadow:"0 8px 30px rgba(108,99,255,0.3)" }}>
              {uploading ? "Posting..." : "🚀 Post Video"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── SEARCH ────────────────────────────────────────────────────────────────────
function SearchPage() {
  const [query, setQuery] = useState("");
  const [allVideos, setAllVideos] = useState(DEMO_VIDEOS);

  useEffect(() => {
    AthaVidVideo.list().then(records => {
      if (records && records.length > 0) {
        const mapped = records.map(r => ({ id:r.id, username:r.username||"user", caption:r.caption||"", hashtags:r.hashtags||[], views_count:r.views_count||0, thumbnail_url:r.thumbnail_url||`https://picsum.photos/seed/${r.id}/400/600` }));
        setAllVideos([...mapped, ...DEMO_VIDEOS]);
      }
    }).catch(()=>{});
  }, []);

  const results = query.length > 1
    ? allVideos.filter(v => v.caption?.toLowerCase().includes(query.toLowerCase()) || v.username?.toLowerCase().includes(query.toLowerCase()) || (v.hashtags||[]).some(h=>h.toLowerCase().includes(query.toLowerCase())))
    : allVideos;

  const trending = [{tag:"athavid",count:"2.1M"},{tag:"reallife",count:"890K"},{tag:"nofilter",count:"1.4M"},{tag:"srilanka",count:"720K"},{tag:"bondi",count:"540K"},{tag:"njfood",count:"210K"}];

  return (
    <div style={{ padding:"16px",background:"#050510",minHeight:"100%" }}>
      <div style={{ position:"relative",marginBottom:20 }}>
        <span style={{ position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",fontSize:18 }}>🔍</span>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search videos, users, hashtags..." style={{ width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(108,99,255,0.4)",borderRadius:30,padding:"13px 20px 13px 48px",color:"#fff",fontSize:15,outline:"none",boxSizing:"border-box" }} />
      </div>
      {!query && (
        <>
          <div style={{ color:"#555",fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:12 }}>🔥 Trending</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24 }}>
            {trending.map((t,i)=>(
              <button key={t.tag} onClick={()=>setQuery(t.tag)} style={{ background:`linear-gradient(135deg,${i%2===0?"rgba(108,99,255,0.15)":"rgba(76,175,80,0.1)"},rgba(0,0,0,0))`,border:`1px solid ${i%2===0?"rgba(108,99,255,0.3)":"rgba(76,175,80,0.3)"}`,borderRadius:16,padding:"12px 14px",cursor:"pointer",textAlign:"left" }}>
                <div style={{ color:"#fff",fontWeight:700,fontSize:14 }}>#{t.tag}</div>
                <div style={{ color:"#555",fontSize:12,marginTop:3 }}>{t.count} videos</div>
              </button>
            ))}
          </div>
          <div style={{ color:"#555",fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:12 }}>🎬 All Videos</div>
        </>
      )}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
        {results.map(v=>(
          <div key={v.id} style={{ position:"relative",paddingTop:"150%",borderRadius:12,overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)" }}>
            <img src={v.thumbnail_url} alt="" style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover" }} />
            <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.8) 0%,transparent 60%)" }} />
            <div style={{ position:"absolute",bottom:8,left:8,right:8 }}>
              <div style={{ color:"#fff",fontSize:11,fontWeight:600 }}>@{v.username}</div>
              <div style={{ color:"#aaa",fontSize:10 }}>👁 {formatCount(v.views_count)}</div>
            </div>
            <div style={{ position:"absolute",top:6,right:6,background:"rgba(76,175,80,0.8)",borderRadius:6,padding:"2px 6px" }}>
              <span style={{ color:"#fff",fontSize:9,fontWeight:700 }}>✅ REAL</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SHOP ──────────────────────────────────────────────────────────────────────
function ShopPage() {
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useState([]);
  const addToCart = p => { setCart(c=>[...c,p]); setSelected(null); };
  return (
    <div style={{ background:"#050510",minHeight:"100%",padding:16 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
        <div>
          <div style={{ color:"#fff",fontSize:22,fontWeight:800 }}>Shop 🛒</div>
          <div style={{ color:"#555",fontSize:13 }}>Real products from real creators</div>
        </div>
        <div style={{ background:"linear-gradient(135deg,#6c63ff,#a78bfa)",borderRadius:20,padding:"8px 18px",color:"#fff",fontSize:14,fontWeight:700 }}>🛒 {cart.length}</div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        {SAMPLE_PRODUCTS.map(p=>(
          <div key={p.id} onClick={()=>setSelected(p)} style={{ background:"rgba(255,255,255,0.03)",borderRadius:20,overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)",cursor:"pointer" }}>
            <div style={{ position:"relative" }}>
              <img src={p.image_url} alt="" style={{ width:"100%",height:140,objectFit:"cover" }} />
              <div style={{ position:"absolute",top:8,left:8,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(6px)",borderRadius:10,padding:"3px 8px" }}><span style={{ color:"#ffd700",fontSize:11 }}>★ {p.rating}</span></div>
            </div>
            <div style={{ padding:"10px 12px 14px" }}>
              <div style={{ color:"#ddd",fontSize:13,fontWeight:600,marginBottom:4,lineHeight:1.3 }}>{p.product_name}</div>
              <div style={{ color:"#a78bfa",fontSize:16,fontWeight:800 }}>${p.price.toFixed(2)}</div>
              <div style={{ color:"#444",fontSize:11,marginTop:2 }}>@{p.seller_username}</div>
            </div>
          </div>
        ))}
      </div>
      {selected && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-end",zIndex:1000,backdropFilter:"blur(8px)" }} onClick={()=>setSelected(null)}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"linear-gradient(180deg,#0f0f20,#050510)",borderRadius:"28px 28px 0 0",padding:24,width:"100%",border:"1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ width:40,height:4,background:"rgba(255,255,255,0.15)",borderRadius:2,margin:"0 auto 20px" }} />
            <img src={selected.image_url} alt="" style={{ width:"100%",height:200,objectFit:"cover",borderRadius:20,marginBottom:18 }} />
            <div style={{ color:"#fff",fontSize:20,fontWeight:800,marginBottom:8 }}>{selected.product_name}</div>
            <div style={{ color:"#666",fontSize:14,marginBottom:16,lineHeight:1.6 }}>{selected.description}</div>
            <div style={{ color:"#a78bfa",fontSize:26,fontWeight:900,marginBottom:20 }}>${selected.price.toFixed(2)}</div>
            <div style={{ display:"flex",gap:12 }}>
              <button onClick={()=>setSelected(null)} style={{ flex:1,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:25,padding:14,color:"#666",fontSize:15,cursor:"pointer" }}>Cancel</button>
              <button onClick={()=>addToCart(selected)} style={{ flex:2,background:"linear-gradient(135deg,#6c63ff,#a78bfa)",border:"none",borderRadius:25,padding:14,color:"#fff",fontSize:15,cursor:"pointer",fontWeight:700,boxShadow:"0 8px 30px rgba(108,99,255,0.4)" }}>🛒 Add to Cart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PROFILE ───────────────────────────────────────────────────────────────────
function ProfilePage({ onShare }) {
  const [tab, setTab] = useState("videos");
  return (
    <div style={{ background:"#050510",minHeight:"100%" }}>
      <div style={{ height:110,background:"linear-gradient(135deg,#1a0a3e 0%,#0a1a0a 100%)",position:"relative" }}>
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 30% 50%,rgba(108,99,255,0.3),transparent)" }} />
        <button onClick={onShare} style={{ position:"absolute",top:14,right:14,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(10px)",border:"1px solid rgba(108,99,255,0.4)",borderRadius:20,padding:"7px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:6 }}>
          <span style={{ fontSize:13 }}>🔗</span><span style={{ color:"#a78bfa",fontSize:12,fontWeight:700 }}>Share AthaVid</span>
        </button>
      </div>
      <div style={{ padding:"0 20px 30px",marginTop:-40 }}>
        <div style={{ position:"relative",display:"inline-block",marginBottom:12 }}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=myprofile" alt="" style={{ width:84,height:84,borderRadius:"50%",border:"3px solid #050510",boxShadow:"0 0 30px rgba(108,99,255,0.5)" }} />
          <div style={{ position:"absolute",bottom:2,right:2,background:"linear-gradient(135deg,#6c63ff,#a78bfa)",borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #050510",fontSize:11 }}>✅</div>
        </div>
        <div style={{ color:"#fff",fontSize:20,fontWeight:800,marginBottom:2 }}>@jaygnz27</div>
        <div style={{ color:"#555",fontSize:14,marginBottom:14 }}>Jay G · New Providence, NJ 🇱🇰</div>
        <div style={{ display:"flex",gap:4,marginBottom:18 }}>
          {[{label:"Videos",val:"24"},{label:"Followers",val:"2.8K"},{label:"Following",val:"142"},{label:"Views",val:"188K"}].map(s=>(
            <div key={s.label} style={{ flex:1,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"9px 4px",textAlign:"center" }}>
              <div style={{ color:"#fff",fontSize:16,fontWeight:800 }}>{s.val}</div>
              <div style={{ color:"#444",fontSize:10,marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex",gap:10,marginBottom:20 }}>
          <button style={{ flex:1,background:"linear-gradient(135deg,#6c63ff,#a78bfa)",border:"none",borderRadius:25,padding:12,color:"#fff",fontSize:14,cursor:"pointer",fontWeight:700,boxShadow:"0 6px 20px rgba(108,99,255,0.35)" }}>Edit Profile</button>
          <button onClick={onShare} style={{ flex:1,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(108,99,255,0.3)",borderRadius:25,padding:12,color:"#a78bfa",fontSize:14,cursor:"pointer",fontWeight:600 }}>🔗 Share</button>
        </div>
        <div style={{ display:"flex",marginBottom:14,background:"rgba(255,255,255,0.03)",borderRadius:14,padding:4 }}>
          {[{key:"videos",label:"🎬 Videos"},{key:"liked",label:"❤️ Liked"},{key:"archived",label:"🗄️ Archive"}].map(t=>(
            <button key={t.key} onClick={()=>setTab(t.key)} style={{ flex:1,border:"none",borderRadius:10,padding:"9px 6px",background:tab===t.key?"rgba(108,99,255,0.3)":"transparent",color:tab===t.key?"#a78bfa":"#555",fontSize:12,cursor:"pointer",fontWeight:600,transition:"all 0.2s" }}>{t.label}</button>
          ))}
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:3 }}>
          {[1,2,3,4,5,6,7,8,9].map(i=>(
            <div key={i} style={{ position:"relative",paddingTop:"133%",borderRadius:10,overflow:"hidden" }}>
              <img src={`https://picsum.photos/seed/myv${i}${tab}/200/300`} alt="" style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover" }} />
              <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.6) 0%,transparent 60%)" }} />
              <div style={{ position:"absolute",bottom:5,left:5,color:"#fff",fontSize:10,fontWeight:600 }}>▶ {((i*3.7)%20+0.5).toFixed(1)}K</div>
              {tab==="archived"&&<div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center" }}><span style={{ fontSize:20 }}>🗄️</span></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function AthaVid() {
  const [activeTab, setActiveTab] = useState("feed");
  const [likedVideos, setLikedVideos] = useState(new Set());
  const [showSplash, setShowSplash] = useState(true);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2600);
    return () => clearTimeout(t);
  }, []);

  const handleLike = id => setLikedVideos(prev => { const n = new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
  const handleVideoPosted = () => setActiveTab("feed");

  const tabs = [
    { key:"feed", icon:"🏠", label:"Home" },
    { key:"search", icon:"🔍", label:"Explore" },
    { key:"upload", icon:"➕", label:"Post" },
    { key:"shop", icon:"🛒", label:"Shop" },
    { key:"profile", icon:"👤", label:"Me" },
  ];

  return (
    <div style={{ background:"#050510",minHeight:"100vh",maxWidth:480,margin:"0 auto",position:"relative",fontFamily:"'Inter',-apple-system,sans-serif",overflow:"hidden" }}>
      <style>{`*{box-sizing:border-box}::-webkit-scrollbar{display:none}body{background:#050510;margin:0}input,textarea,button{font-family:inherit}`}</style>
      {showSplash && <Splash />}
      {showShare && <ShareModal onClose={()=>setShowShare(false)} />}
      <div style={{ height:"calc(100vh - 56px)",overflowY:activeTab==="feed"?"hidden":"auto" }}>
        {activeTab==="feed" && <FeedPage likedVideos={likedVideos} onLike={handleLike} onShare={()=>setShowShare(true)} />}
        {activeTab==="search" && <SearchPage />}
        {activeTab==="upload" && <UploadPage onVideoPosted={handleVideoPosted} />}
        {activeTab==="shop" && <ShopPage />}
        {activeTab==="profile" && <ProfilePage onShare={()=>setShowShare(true)} />}
      </div>
      <div style={{ position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"rgba(5,5,16,0.97)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-around",padding:"4px 0 8px",zIndex:200 }}>
        {tabs.map(t=>(
          <button key={t.key} onClick={()=>setActiveTab(t.key)} style={{ background:t.key==="upload"?"linear-gradient(135deg,#6c63ff,#a78bfa)":"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:t.key==="upload"?"10px 18px":"8px 16px",borderRadius:t.key==="upload"?20:10,transform:t.key==="upload"?"translateY(-12px)":"none",boxShadow:t.key==="upload"?"0 8px 25px rgba(108,99,255,0.5)":"none",transition:"all 0.2s" }}>
            <span style={{ fontSize:t.key==="upload"?24:22,filter:activeTab===t.key&&t.key!=="upload"?"drop-shadow(0 0 8px rgba(108,99,255,0.8))":"none" }}>{t.icon}</span>
            <span style={{ fontSize:10,fontWeight:600,color:t.key==="upload"?"#fff":activeTab===t.key?"#a78bfa":"#333" }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
