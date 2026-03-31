import { useState, useEffect, useRef } from "react";
import { auth, videos, comments, uploadFile } from "./api.js";
import AuthModal from "./AuthModal.jsx";

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
  { id:"m1", title:"Blinding Lights (Instrumental)", artist:"Royalty Free", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", emoji:"🎸" },
  { id:"m2", title:"Summer Vibes", artist:"Free Beats", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", emoji:"🌊" },
  { id:"m3", title:"Midnight Drive", artist:"Lo-Fi Studio", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", emoji:"🌙" },
  { id:"m4", title:"Energy Boost", artist:"Epic Sounds", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", emoji:"⚡" },
  { id:"m5", title:"Chill Wave", artist:"Ambient Lab", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", emoji:"🎵" },
  { id:"m6", title:"Urban Groove", artist:"Street Beats", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", emoji:"🎤" },
  { id:"m7", title:"Happy Days", artist:"Feel Good Music", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", emoji:"☀️" },
  { id:"m8", title:"Deep Focus", artist:"Study Sounds", url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", emoji:"🧠" },
];

// ── Upload Modal ──────────────────────────────────────────────────────────────
function UploadModal({ currentUser, onClose, onUploaded }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [maxDuration, setMaxDuration] = useState(60);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [showMusicPicker, setShowMusicPicker] = useState(false);
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
    setAiBlocked(false);
    setExplicitBlocked(false);
    if (checkForAiSignatures(f, caption)) { setAiBlocked(true); return; }
    if (checkForExplicitContent(f, caption)) { setExplicitBlocked(true); }
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
      const video_url = await uploadFile(file);
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
    <div style={{ position:"fixed", inset:0, zIndex:2000, display:"flex", alignItems:"flex-end" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.85)" }} />
      <div style={{ position:"relative", width:"100%", maxWidth:480, margin:"0 auto", background:"#0f0f1a", borderRadius:"24px 24px 0 0", padding:"24px 24px 48px", zIndex:2001 }}>
        <div style={{ width:40, height:4, background:"#444", borderRadius:99, margin:"0 auto 20px" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>📹 Post a Video</div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:"50%", width:32, height:32, color:"#fff", cursor:"pointer" }}>✕</button>
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
          <div style={{ background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, marginBottom:14, maxHeight:220, overflowY:"auto" }}>
            {MUSIC_LIBRARY.map(track => (
              <div key={track.id} onClick={() => { setSelectedTrack(track); setShowMusicPicker(false); if(previewAudioRef.current){ previewAudioRef.current.pause(); setPreviewTrack(null); } }}
                style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderBottom:"1px solid rgba(255,255,255,0.05)", cursor:"pointer", background: selectedTrack?.id === track.id ? "rgba(255,107,107,0.15)" : "transparent" }}>
                <div style={{ fontSize:22 }}>{track.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ color:"#fff", fontWeight:600, fontSize:13 }}>{track.title}</div>
                  <div style={{ color:"#888", fontSize:11 }}>{track.artist}</div>
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
                }} style={{ background:"rgba(255,107,107,0.2)", border:"none", borderRadius:"50%", width:30, height:30, color:"#ff6b6b", cursor:"pointer", fontSize:14 }}>
                  {previewTrack === track.id ? "⏹" : "▶"}
                </button>
              </div>
            ))}
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
        <button onClick={upload} disabled={!file || uploading || aiBlocked || explicitBlocked || !notAiConfirmed}
          style={{ width:"100%", padding:14, background: file && !uploading ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "rgba(255,255,255,0.08)", border:"none", borderRadius:14, color:"#fff", fontWeight:800, fontSize:16, cursor: file && !uploading && !aiBlocked && !explicitBlocked && notAiConfirmed ? "pointer" : "not-allowed", opacity: file && !uploading && !aiBlocked && !explicitBlocked && notAiConfirmed ? 1 : 0.5 }}>
          {uploading ? step : "🚀 Post Video"}
        </button>
      </div>
    </div>
  );
}

// ── Video Card ────────────────────────────────────────────────────────────────
function VideoCard({ video, currentUser, onCommentOpen, onLike, onView, onNeedAuth }) {
  const videoRef = useRef(null);
  const viewedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.play().catch(() => {});
        setPlaying(true);
        if (!viewedRef.current) {
          viewedRef.current = true;
          onView && onView(video.id);
        }
      } else {
        el.pause();
        setPlaying(false);
      }
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
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)", pointerEvents:"none", opacity: playing ? 0 : 1, transition:"opacity 0.3s" }} />
      <button onClick={() => setMuted(m => !m)}
        style={{ position:"absolute", top:16, right:16, background:"rgba(0,0,0,0.5)", border:"none", borderRadius:"50%", width:38, height:38, color:"#fff", cursor:"pointer", fontSize:16, zIndex:10, opacity: playing ? 0 : 1, transition:"opacity 0.3s", pointerEvents: playing ? "none" : "auto" }}>
        {muted ? "🔇" : "🔊"}
      </button>
      <div style={{ position:"absolute", bottom:90, left:16, right:80, zIndex:10, opacity: playing ? 0 : 1, transition:"opacity 0.3s", pointerEvents: playing ? "none" : "auto" }}>
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
      <div style={{ position:"absolute", bottom:90, right:10, display:"flex", flexDirection:"column", alignItems:"center", gap:16, zIndex:10, opacity: playing ? 0 : 1, transition:"opacity 0.3s", pointerEvents: playing ? "none" : "auto" }}>
        <button onClick={handleLike} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
          <div style={{ fontSize:22, display:"inline-block", animation: liked ? "heartpop 0.5s ease forwards, heartbeat 1.2s ease 0.5s infinite" : "heartbeat 1.8s ease infinite", transformOrigin:"center" }}>❤️</div>
          <div style={{ color:"#fff", fontSize:10, fontWeight:700 }}>{formatCount((video.likes_count||0)+(liked?1:0))}</div>
        </button>
        <button onClick={() => onCommentOpen(video)} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
          <div style={{ fontSize:22 }}>💬</div>
          <div style={{ color:"#fff", fontSize:10, fontWeight:700 }}>{formatCount(video.comments_count)}</div>
        </button>
        <button onClick={() => { if(navigator.share){ navigator.share({ title: video.caption || "Check this out", url: window.location.href }); } else { navigator.clipboard?.writeText(window.location.href); alert("Link copied!"); } }} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
          <div style={{ fontSize:22 }}>↪️</div>
          <div style={{ color:"#fff", fontSize:10, fontWeight:700 }}>Share</div>
        </button>
        <button onClick={() => setReportTarget(video)} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
          <div style={{ fontSize:22 }}>🚩</div>
          <div style={{ color:"#fff", fontSize:10, fontWeight:700 }}>Report</div>
        </button>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#333,#111)", border:"2px solid #555", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, animation: playing ? "spin 3s linear infinite" : "none" }}>🎵</div>
        </div>
      </div>
      {reportTarget && <ReportModal video={reportTarget} onClose={() => setReportTarget(null)} />}
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
const PRESET_AVATARS = [
  { id:"a1", url:"https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
  { id:"a2", url:"https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" },
  { id:"a3", url:"https://api.dicebear.com/7.x/avataaars/svg?seed=Mia" },
  { id:"a4", url:"https://api.dicebear.com/7.x/avataaars/svg?seed=Zara" },
  { id:"a5", url:"https://api.dicebear.com/7.x/avataaars/svg?seed=Leo" },
  { id:"a6", url:"https://api.dicebear.com/7.x/avataaars/svg?seed=Nova" },
  { id:"a7", url:"https://api.dicebear.com/7.x/avataaars/svg?seed=Kira" },
  { id:"a8", url:"https://api.dicebear.com/7.x/avataaars/svg?seed=Blaze" },
  { id:"a9", url:"https://api.dicebear.com/7.x/avataaars/svg?seed=Pixel" },
  { id:"a10", url:"https://api.dicebear.com/7.x/avataaars/svg?seed=Storm" },
  { id:"a11", url:"https://api.dicebear.com/7.x/avataaars/svg?seed=Echo" },
  { id:"a12", url:"https://api.dicebear.com/7.x/avataaars/svg?seed=Sage" },
];

function AvatarPickerModal({ currentAvatar, onSelect, onClose }) {
  const [uploading, setUploading] = useState(false);
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

  return (
    <div style={{ position:"fixed", inset:0, zIndex:2000, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.75)" }} />
      <div style={{ position:"relative", background:"#1a1a2e", borderRadius:"24px 24px 0 0", width:"100%", maxWidth:480, padding:"20px 20px 40px", zIndex:2001 }}>
        <div style={{ width:40, height:4, background:"#444", borderRadius:99, margin:"0 auto 16px" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ color:"#fff", fontWeight:700, fontSize:16 }}>Choose your avatar</div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:"50%", width:30, height:30, color:"#fff", cursor:"pointer" }}>✕</button>
        </div>

        {/* Upload own photo */}
        <div style={{ marginBottom:16 }}>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFileUpload} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            style={{ width:"100%", padding:"12px", background:"rgba(108,99,255,0.2)", border:"2px dashed rgba(108,99,255,0.5)", borderRadius:12, color:"#6c63ff", fontWeight:700, fontSize:14, cursor:"pointer" }}>
            {uploading ? "Uploading..." : "📷 Upload your own photo"}
          </button>
        </div>

        <div style={{ color:"#666", fontSize:12, marginBottom:12, textAlign:"center" }}>— or pick a preset —</div>

        {/* Preset grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:10 }}>
          {PRESET_AVATARS.map(a => (
            <div key={a.id} onClick={() => onSelect(a.url)}
              style={{ cursor:"pointer", borderRadius:"50%", border: currentAvatar===a.url ? "3px solid #ff6b6b" : "3px solid transparent", overflow:"hidden", width:60, height:60, margin:"0 auto", transition:"border 0.2s" }}>
              <img src={a.url} style={{ width:"100%", height:"100%" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => auth.getUser());
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("feed");
  const [commentVideo, setCommentVideo] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [myVideos, setMyVideos] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  useEffect(() => { loadVideos(); }, []);
  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`avatar_${currentUser.id}`);
      if (saved) setAvatarUrl(saved);
    }
  }, [currentUser]);

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

  return (
    <div style={{ background:"#000", minHeight:"100svh", maxWidth:480, margin:"0 auto", position:"relative", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", overflow:"hidden" }}>

      {/* Header */}
      <div style={{ position:"fixed", top:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, zIndex:100, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"linear-gradient(to bottom,rgba(0,0,0,0.75),transparent)" }}>
        <div style={{ fontSize:26, fontWeight:900, background:"linear-gradient(135deg,#ff6b6b,#ff8e53)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>sachi</div>
        {currentUser
          ? <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              
              
            </div>
          : <button onClick={() => setShowAuth(true)} style={{ background:"linear-gradient(135deg,#ff6b6b,#ff8e53)", border:"none", borderRadius:20, padding:"6px 16px", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>Log In</button>
        }
      </div>

      {/* Feed */}
      {activeTab === "feed" && (
        <div data-feed style={{ height:"100svh", overflowY:"scroll", scrollSnapType:"y mandatory" }}>
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
              onView={handleView}
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
                <div style={{ position:"relative", display:"inline-block", marginBottom:12 }} onClick={() => setShowAvatarPicker(true)}>
                  <img src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} style={{ width:80, height:80, borderRadius:"50%", border:"3px solid #ff6b6b", cursor:"pointer", display:"block" }} />
                  <div style={{ position:"absolute", bottom:0, right:0, background:"#ff6b6b", borderRadius:"50%", width:24, height:24, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, cursor:"pointer", border:"2px solid #0a0a14" }}>✏️</div>
                </div>
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
        {[{ id:"feed", icon:"🏠", label:"Home" }, { id:"post", icon:"➕", label:"Post" }, { id:"profile", icon:"👤", label:"Me" }, { id:"install", icon:"📲", label:"Install" }].map(tab => (
          <button key={tab.id}
            onClick={() => {
              if (tab.id === "post") { requireAuth(() => setShowUpload(true)); }
              else if (tab.id === "install") { window.showInstallInstructions && window.showInstallInstructions(); }
              else if (tab.id === "feed") { setActiveTab("feed"); loadVideos(); window.scrollTo(0, 0); document.querySelector("[data-feed]") && (document.querySelector("[data-feed]").scrollTop = 0); } else { setActiveTab(tab.id); }
            }}
            style={{ flex:1, padding:"10px 0 8px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
            <div style={{ fontSize:22 }}>{tab.icon}</div>
            <div style={{ fontSize:10, color: tab.id === "install" ? "#6bff9a" : activeTab === tab.id ? "#ff6b6b" : "#555", fontWeight: activeTab === tab.id ? 700 : 400 }}>{tab.label}</div>
          </button>
        ))}
      </div>

      {commentVideo && <CommentSheet video={commentVideo} currentUser={currentUser} onClose={() => setCommentVideo(null)} onCommentPosted={handleCommentCount} onNeedAuth={() => { setCommentVideo(null); setShowAuth(true); }} />}
      {showUpload && currentUser && <UploadModal currentUser={currentUser} onClose={() => setShowUpload(false)} onUploaded={loadVideos} />}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={(user) => { setCurrentUser(user); setShowAuth(false); }} />}
      {showAvatarPicker && <AvatarPickerModal currentAvatar={avatarUrl} onSelect={(url) => { setAvatarUrl(url); if(currentUser) localStorage.setItem(`avatar_${currentUser.id}`, url); setShowAvatarPicker(false); }} onClose={() => setShowAvatarPicker(false)} />}
    </div>
  );
}
