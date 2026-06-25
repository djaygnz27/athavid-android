// ⛔ LOCKED — AvatarCropEditor.jsx
// DO NOT MODIFY unless fixing a AvatarCropEditor-specific bug.
// Last verified working: 2026-05-23

import React, { useState, useRef } from "react";

function AvatarCropEditor({ imageUrl, onSave, onCancel }) {
  const canvasRef = useRef();
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);
  const imgRef = useRef(new window.Image());
  const SIZE = 300;

  useEffect(() => {
    const img = imgRef.current;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const fit = Math.max(SIZE / img.width, SIZE / img.height);
      setScale(fit);
      setOffset({ x: (SIZE - img.width * fit) / 2, y: (SIZE - img.height * fit) / 2 });
      draw(fit, { x: (SIZE - img.width * fit) / 2, y: (SIZE - img.height * fit) / 2 });
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const draw = (s = scale, o = offset) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, SIZE, SIZE);
    // White background so JPEG export works correctly
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, SIZE, SIZE);
    // Clip to circle before drawing image
    ctx.save();
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(imgRef.current, o.x, o.y, imgRef.current.width * s, imgRef.current.height * s);
    ctx.restore();
  };

  useEffect(() => { draw(); }, [scale, offset]);

  const onMouseDown = (e) => {
    setDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };
  const onMouseMove = (e) => {
    if (!dragging) return;
    const newOffset = { x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y };
    setOffset(newOffset);
  };
  const onMouseUp = () => setDragging(false);

  const onTouchStart = (e) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = { x: e.touches[0].clientX - offset.x, y: e.touches[0].clientY - offset.y };
  };
  const onTouchMove = (e) => {
    e.preventDefault();
    if (!dragging) return;
    setOffset({ x: e.touches[0].clientX - dragStart.current.x, y: e.touches[0].clientY - dragStart.current.y });
  };
  const onTouchEnd = () => setDragging(false);

  const handleSave = () => {
    const canvas = canvasRef.current;
    // Return base64 data URL directly — works for all auth types (Google, email)
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    onSave(dataUrl);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:3000, background:"rgba(0,0,0,0.95)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ color:"#fff", fontWeight:900, fontSize:18, marginBottom:8 }}>✂️ Crop your avatar</div>
      <div style={{ color:"#888", fontSize:13, marginBottom:20 }}>Drag to reposition • Zoom with slider</div>

      {/* Canvas crop area */}
      <div style={{ borderRadius:"50%", overflow:"hidden", border:"3px solid #F5C842", boxShadow:"0 0 30px rgba(245,200,66,0.3)", marginBottom:20, cursor: dragging ? "grabbing" : "grab" }}>
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{ display:"block", touchAction:"none" }}
        />
      </div>

      {/* Zoom slider */}
      <div style={{ width:"100%", maxWidth:280, marginBottom:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <div style={{ color:"#aaa", fontSize:12 }}>🔍 Zoom</div>
          <button onClick={() => {
            const img = imgRef.current;
            const fit = Math.min(SIZE / img.width, SIZE / img.height);
            setScale(fit);
            setOffset({ x: (SIZE - img.width * fit) / 2, y: (SIZE - img.height * fit) / 2 });
          }} style={{ background:"rgba(245,200,66,0.15)", border:"1px solid rgba(245,200,66,0.4)", borderRadius:8, padding:"3px 10px", color:"#F5C842", fontSize:11, fontWeight:700, cursor:"pointer" }}>
            Fit whole image
          </button>
        </div>
        <input
          type="range"
          min={0.05}
          max={4}
          step={0.01}
          value={scale}
          onChange={e => setScale(parseFloat(e.target.value))}
          style={{ width:"100%", accentColor:"#F5C842" }}
        />
      </div>

      <div style={{ display:"flex", gap:12, width:"100%", maxWidth:280 }}>
        <button onClick={onCancel} style={{ flex:1, padding:"13px 0", background:"rgba(255,255,255,0.08)", border:"none", borderRadius:14, color:"#aaa", fontWeight:700, fontSize:15, cursor:"pointer" }}>
          Cancel
        </button>
        <button onClick={handleSave} style={{ flex:2, padding:"13px 0", background:"linear-gradient(135deg,#F5C842,#FF9500)", border:"none", borderRadius:14, color:"#0B0C1A", fontWeight:900, fontSize:15, cursor:"pointer" }}>
          ✓ Use this photo
        </button>
      </div>
    </div>
  );
}

export default AvatarCropEditor;
