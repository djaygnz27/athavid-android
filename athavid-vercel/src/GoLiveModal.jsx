// ⛔ LOCKED — GoLiveModal.jsx
// DO NOT MODIFY unless fixing a GoLiveModal-specific bug.
// Last verified working: 2026-05-23

import React, { useState, useEffect, useRef } from "react";
import { videos, request, uploadFile } from "./post/upload.js";

function GoLiveModal({ currentUser, onClose, onUploaded }) {
  const [phase, setPhase] = useState("preview"); // preview | live | uploading | done
  const [elapsed, setElapsed] = useState(0);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [reviewUrl, setReviewUrl] = useState("");
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
      recorderRef.current.onstop = () => {
        const mimeType = chunksRef.current[0]?.type || "video/webm";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setReviewUrl(url);
        setPhase("review");
      };
      recorderRef.current.stop();
    } else {
      setPhase("uploading");
      setTimeout(() => uploadLive(), 800);
    }
  };

  const uploadLive = async () => {
    try {
      const mimeType = chunksRef.current[0]?.type || "video/webm";
      const ext = mimeType.includes("mp4") ? "mp4" : "webm";
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const file = new File([blob], `live_${Date.now()}.${ext}`, { type: mimeType });

      // Upload video using the shared uploadFile helper (avoids CORS issues)
      const uploadRes = await uploadFile(file, (pct) => console.log("GoLive upload:", pct + "%"));
      const file_url = uploadRes.file_url || uploadRes;

      // Generate thumbnail
      let thumbUrl = "";
      try {
        const thumbBlob = await captureThumbnail(file);
        const thumbFile = new File([thumbBlob], "thumb.jpg", { type:"image/jpeg" });
        const thumbRes = await uploadFile(thumbFile);
        thumbUrl = thumbRes.file_url || thumbRes;
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
        style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"contain",
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

      {/* Review phase — watch back before posting */}
      {phase === "review" && reviewUrl && (
        <div style={{ position:"absolute", inset:0, background:"#000", zIndex:150,
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:0 }}>
          <video src={reviewUrl} controls autoPlay playsInline
            style={{ width:"100%", height:"70%", objectFit:"contain", background:"#000" }} />
          <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13, marginTop:8 }}>Review your live recording</div>
          <div style={{ display:"flex", gap:16, marginTop:16 }}>
            <button onClick={() => { URL.revokeObjectURL(reviewUrl); setReviewUrl(""); chunksRef.current=[]; onClose(); }}
              style={{ padding:"12px 28px", borderRadius:12, background:"rgba(255,255,255,0.1)",
                border:"1px solid rgba(255,255,255,0.2)", color:"#fff", fontSize:14, cursor:"pointer" }}>
              🗑️ Discard
            </button>
            <button onClick={() => { setPhase("uploading"); setTimeout(() => uploadLive(), 300); }}
              style={{ padding:"12px 28px", borderRadius:12,
                background:"linear-gradient(135deg,#F5C842,#FF9500)",
                border:"none", color:"#0B0C1A", fontWeight:800, fontSize:14, cursor:"pointer" }}>
              📤 Post Live
            </button>
          </div>
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
// ✅ VideoEditor → moved to VideoEditor.jsx (LOCKED)

// ✅ UploadModal → moved to UploadModal.jsx (LOCKED)

// ✅ VideoCard + getUserAge → moved to VideoCard.jsx (LOCKED)

// ✅ ReportModal → moved to ReportModal.jsx (LOCKED)

export default GoLiveModal;
