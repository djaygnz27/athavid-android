// ⛔ LOCKED — VideoEditor.jsx
// Handles in-app video trimming/preview before upload.
// DO NOT MODIFY unless fixing a video editor bug.
// Last verified working: 2026-05-23

import React, { useState, useEffect, useRef, useMemo } from "react";

function VideoEditor({ file, onDone, onSkip }) {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [trimming, setTrimming] = useState(false);
  const [activeMode, setActiveMode] = useState(null); // null | "text" | "trim"
  const [textOverlays, setTextOverlays] = useState([]);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInputVal, setTextInputVal] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [textBg, setTextBg] = useState("none"); // none | dark | colored
  const [textSize, setTextSize] = useState(22);
  const [isPlaying, setIsPlaying] = useState(true);
  const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => { return () => URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const onMeta = () => {
    const dur = videoRef.current?.duration || 0;
    setDuration(dur);
    setTrimEnd(dur);
  };
  const onTimeUpdate = () => setCurrentTime(videoRef.current?.currentTime || 0);
  const fmtTime = (s) => `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,"0")}`;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) { videoRef.current.play(); setIsPlaying(true); }
    else { videoRef.current.pause(); setIsPlaying(false); }
  };

  const addTextOverlay = () => {
    if (!textInputVal.trim()) return;
    setTextOverlays(prev => [...prev, {
      id: Date.now(), text: textInputVal.trim(),
      color: textColor, bg: textBg, size: textSize,
      x: 50, y: 50
    }]);
    setTextInputVal("");
    setShowTextInput(false);
    setActiveMode(null);
  };

  const removeOverlay = (id) => setTextOverlays(prev => prev.filter(o => o.id !== id));

  const doPost = async () => {
    setTrimming(true);
    // If no trim needed, pass original file through
    if (trimStart <= 0.5 && trimEnd >= duration - 0.5) {
      onDone(file, textOverlays);
      return;
    }
    try {
      const video = document.createElement("video");
      video.src = previewUrl;
      video.muted = true;
      await new Promise(r => { video.onloadedmetadata = r; video.load(); });
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      const stream = canvas.captureStream(30);
      const mimeType = "video/webm";
      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 4000000 });
      const chunks = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
      const blob = await new Promise((resolve) => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
        video.currentTime = trimStart;
        video.oncanplay = async () => {
          video.oncanplay = null;
          recorder.start(100);
          const draw = () => {
            if (!video.paused && !video.ended) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              requestAnimationFrame(draw);
            }
          };
          draw();
          await video.play();
          setTimeout(() => { video.pause(); recorder.stop(); }, (trimEnd - trimStart) * 1000);
        };
      });
      onDone(new File([blob], `trimmed.webm`, { type: mimeType }), textOverlays);
    } catch { onDone(file, textOverlays); }
    setTrimming(false);
  };

  const TEXT_COLORS = ["#ffffff","#000000","#FF6B6B","#F5C842","#00E5FF","#FF69B4","#7CFC00","#FF8C00"];

  return (
    <div style={{ position:"fixed", inset:0, zIndex:3000, background:"#000", display:"flex", flexDirection:"column", userSelect:"none" }}>

      {/* ── Top bar ── */}
      <div style={{ position:"absolute", top:0, left:0, right:0, zIndex:10, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 18px" }}>
        <button onClick={onSkip}
          style={{ width:36, height:36, borderRadius:"50%", background:"rgba(0,0,0,0.5)", border:"1.5px solid rgba(255,255,255,0.25)", color:"#fff", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          ✕
        </button>
        <div style={{ display:"flex", gap:8 }}>
          {/* Add Sound pill */}
          <div style={{ background:"rgba(0,0,0,0.55)", border:"1.5px solid rgba(255,255,255,0.25)", borderRadius:20, padding:"7px 14px", color:"#fff", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", gap:6, backdropFilter:"blur(8px)" }}>
            🎵 Add sound
          </div>
        </div>
        <div style={{ width:36 }} />
      </div>

      {/* ── Video/Image Preview (full screen) ── */}
      <div style={{ flex:1, position:"relative", overflow:"hidden" }} onClick={activeMode ? undefined : togglePlay}>
        <video ref={videoRef} src={previewUrl}
          onLoadedMetadata={onMeta} onTimeUpdate={onTimeUpdate}
          style={{ width:"100%", height:"100%", objectFit:"cover" }}
          autoPlay loop playsInline
        />

        {/* Text overlays on preview */}
        {textOverlays.map(ov => (
          <div key={ov.id}
            style={{
              position:"absolute",
              top: `${ov.y}%`, left: `${ov.x}%`,
              transform:"translate(-50%,-50%)",
              color: ov.color,
              fontSize: ov.size,
              fontWeight: 900,
              letterSpacing: 0.5,
              background: ov.bg === "dark" ? "rgba(0,0,0,0.55)" : ov.bg === "colored" ? ov.color.replace(")",",0.2)").replace("rgb","rgba") : "transparent",
              padding: ov.bg !== "none" ? "4px 10px" : 0,
              borderRadius: 8,
              textShadow: "0 1px 6px rgba(0,0,0,0.8)",
              whiteSpace:"nowrap",
              cursor:"pointer",
              zIndex:5,
              maxWidth:"85vw",
              wordBreak:"break-word",
              textAlign:"center",
            }}
            onClick={e => { e.stopPropagation(); removeOverlay(ov.id); }}
          >
            {ov.text}
          </div>
        ))}

        {/* Play/pause overlay */}
        {!isPlaying && (
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
            <div style={{ width:70, height:70, borderRadius:"50%", background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30 }}>▶</div>
          </div>
        )}
      </div>

      {/* ── Right side tool icons (TikTok style) ── */}
      <div style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", display:"flex", flexDirection:"column", gap:20, zIndex:10 }}>
        {[
          { icon:"T", label:"Text", mode:"text" },
          { icon:"✂️", label:"Trim", mode:"trim" },
        ].map(tool => (
          <div key={tool.mode} onClick={() => { setActiveMode(m => m===tool.mode ? null : tool.mode); }}
            style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, cursor:"pointer" }}>
            <div style={{
              width:44, height:44, borderRadius:"50%",
              background: activeMode===tool.mode ? "rgba(245,200,66,0.9)" : "rgba(0,0,0,0.55)",
              border: activeMode===tool.mode ? "2px solid #F5C842" : "1.5px solid rgba(255,255,255,0.3)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize: tool.icon==="T" ? 20 : 18, fontWeight:900,
              color: activeMode===tool.mode ? "#000" : "#fff",
              backdropFilter:"blur(8px)",
              boxShadow: activeMode===tool.mode ? "0 0 14px rgba(245,200,66,0.5)" : "none",
            }}>
              {tool.icon}
            </div>
            <div style={{ color:"#fff", fontSize:10, fontWeight:700, textShadow:"0 1px 4px rgba(0,0,0,0.9)" }}>{tool.label}</div>
          </div>
        ))}
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, zIndex:10, padding:"0 20px 40px" }}>

        {/* Mode selector row — 10m / 60s / 15s / PHOTO / TEXT */}
        <div style={{ display:"flex", justifyContent:"center", gap:18, marginBottom:20 }}>
          {[
            { label:"10m" }, { label:"60s" }, { label:"15s" },
            { label:"PHOTO", active:false },
            { label:"TEXT", action:"text" },
          ].map((m, i) => (
            <div key={i}
              onClick={() => m.action === "text" ? (setActiveMode("text"), setShowTextInput(true)) : null}
              style={{
                color: m.action === "text" && activeMode === "text" ? "#F5C842" : "#fff",
                fontWeight: m.action === "text" ? 900 : 600,
                fontSize: m.action === "text" ? 16 : 14,
                opacity: m.action === "text" ? 1 : 0.7,
                cursor: m.action ? "pointer" : "default",
                padding: m.action === "text" ? "4px 10px" : "4px 0",
                borderBottom: m.action === "text" && activeMode === "text" ? "2px solid #F5C842" : "none",
                textShadow:"0 1px 6px rgba(0,0,0,0.9)",
              }}
            >
              {m.label}
            </div>
          ))}
        </div>

        {/* Post button */}
        <button onClick={doPost} disabled={trimming}
          style={{
            width:"100%", padding:"16px 0",
            background: trimming ? "#333" : "linear-gradient(135deg,#ff6b6b,#ff8e53)",
            border:"none", borderRadius:16, color:"#fff",
            fontWeight:900, fontSize:17, cursor: trimming ? "default" : "pointer",
            letterSpacing:0.5, boxShadow:"0 4px 20px rgba(255,107,107,0.4)"
          }}>
          {trimming ? "Processing..." : "Next →"}
        </button>
      </div>

      {/* ── Trim panel (slides up) ── */}
      {activeMode === "trim" && duration > 0 && (
        <div style={{ position:"absolute", bottom:140, left:0, right:0, zIndex:15, background:"rgba(15,15,26,0.95)", borderRadius:"20px 20px 0 0", padding:"20px 20px 10px", backdropFilter:"blur(16px)" }}>
          <div style={{ color:"#fff", fontWeight:800, fontSize:15, marginBottom:14, textAlign:"center" }}>
            ✂️ Trim — {fmtTime(trimStart)} to {fmtTime(trimEnd)}
          </div>
          <div style={{ marginBottom:12 }}>
            <div style={{ color:"#aaa", fontSize:11, marginBottom:4 }}>Start: {fmtTime(trimStart)}</div>
            <input type="range" min={0} max={duration} step={0.1} value={trimStart}
              onChange={e => { const v = Math.min(parseFloat(e.target.value), trimEnd-1); setTrimStart(v); if(videoRef.current) videoRef.current.currentTime=v; }}
              style={{ width:"100%", accentColor:"#ff6b6b" }} />
          </div>
          <div>
            <div style={{ color:"#aaa", fontSize:11, marginBottom:4 }}>End: {fmtTime(trimEnd)}</div>
            <input type="range" min={0} max={duration} step={0.1} value={trimEnd}
              onChange={e => { const v = Math.max(parseFloat(e.target.value), trimStart+1); setTrimEnd(v); if(videoRef.current) videoRef.current.currentTime=v; }}
              style={{ width:"100%", accentColor:"#ff6b6b" }} />
          </div>
        </div>
      )}

      {/* ── Text input panel ── */}
      {(activeMode === "text" || showTextInput) && (
        <div style={{ position:"absolute", inset:0, zIndex:20, background:"rgba(0,0,0,0.75)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
          {/* Text preview */}
          <div style={{ color: textColor, fontSize: textSize, fontWeight:900, marginBottom:20,
            background: textBg==="dark" ? "rgba(0,0,0,0.55)" : "transparent",
            padding: textBg!=="none" ? "6px 16px" : 0, borderRadius:10,
            textShadow:"0 1px 8px rgba(0,0,0,0.9)", minHeight:40, textAlign:"center",
            maxWidth:"85vw", wordBreak:"break-word" }}>
            {textInputVal || <span style={{ opacity:0.3 }}>Start typing...</span>}
          </div>

          {/* Text input */}
          <input
            autoFocus
            value={textInputVal}
            onChange={e => setTextInputVal(e.target.value)}
            placeholder="Type something..."
            style={{ width:"100%", maxWidth:400, background:"rgba(255,255,255,0.12)", border:"2px solid rgba(255,255,255,0.3)", borderRadius:14, padding:"14px 16px", color:"#fff", fontSize:16, outline:"none", marginBottom:16, textAlign:"center" }}
            onKeyDown={e => e.key==="Enter" && addTextOverlay()}
          />

          {/* Color swatches */}
          <div style={{ display:"flex", gap:10, marginBottom:14 }}>
            {TEXT_COLORS.map(c => (
              <div key={c} onClick={() => setTextColor(c)}
                style={{ width:28, height:28, borderRadius:"50%", background:c,
                  border: textColor===c ? "3px solid #F5C842" : "2px solid rgba(255,255,255,0.2)",
                  cursor:"pointer", boxShadow: textColor===c ? "0 0 10px rgba(245,200,66,0.6)" : "none",
                  flexShrink:0 }} />
            ))}
          </div>

          {/* Size slider */}
          <div style={{ width:"100%", maxWidth:400, marginBottom:14 }}>
            <div style={{ color:"#aaa", fontSize:11, marginBottom:6, textAlign:"center" }}>Size: {textSize}px</div>
            <input type="range" min={14} max={48} step={1} value={textSize}
              onChange={e => setTextSize(parseInt(e.target.value))}
              style={{ width:"100%", accentColor:"#F5C842" }} />
          </div>

          {/* Background style */}
          <div style={{ display:"flex", gap:10, marginBottom:20 }}>
            {[{v:"none",l:"No BG"},{v:"dark",l:"Dark BG"},{v:"colored",l:"Color BG"}].map(b => (
              <button key={b.v} onClick={() => setTextBg(b.v)}
                style={{ padding:"8px 14px", borderRadius:20, border:"none", cursor:"pointer", fontSize:12, fontWeight:700,
                  background: textBg===b.v ? "#F5C842" : "rgba(255,255,255,0.12)",
                  color: textBg===b.v ? "#000" : "#fff" }}>
                {b.l}
              </button>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display:"flex", gap:12, width:"100%", maxWidth:400 }}>
            <button onClick={() => { setShowTextInput(false); setActiveMode(null); setTextInputVal(""); }}
              style={{ flex:1, padding:"13px 0", background:"rgba(255,255,255,0.1)", border:"none", borderRadius:14, color:"#aaa", fontWeight:700, fontSize:15, cursor:"pointer" }}>
              Cancel
            </button>
            <button onClick={addTextOverlay}
              style={{ flex:2, padding:"13px 0", background:"linear-gradient(135deg,#F5C842,#FF9500)", border:"none", borderRadius:14, color:"#000", fontWeight:900, fontSize:15, cursor:"pointer" }}>
              ✓ Add Text
            </button>
          </div>
          <div style={{ color:"#666", fontSize:11, marginTop:12 }}>Tap a text overlay on video to remove it</div>
        </div>
      )}

      {trimming && (
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.85)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:30 }}>
          <div style={{ fontSize:40, marginBottom:16 }}>⚙️</div>
          <div style={{ color:"#fff", fontWeight:700, fontSize:16 }}>Processing video...</div>
        </div>
      )}
    </div>
  );
}

export default VideoEditor;
