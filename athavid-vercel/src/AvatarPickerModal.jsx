// ⛔ LOCKED — AvatarPickerModal.jsx
// DO NOT MODIFY unless fixing a AvatarPickerModal-specific bug.
// Last verified working: 2026-05-23

import { uploadFile } from './post/upload.js';
import React, { useState, useRef } from "react";
import AvatarCropEditor from "./AvatarCropEditor.jsx";

function AvatarPickerModal({ currentAvatar, onSelect, onClose }) {
  const [uploading, setUploading] = useState(false);
  const [activeStyle, setActiveStyle] = useState(0);
  const [cropImageUrl, setCropImageUrl] = useState(null);
  const fileRef = useRef();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Show crop editor first
    const url = URL.createObjectURL(file);
    setCropImageUrl(url);
  };

  const handleCropSave = async (dataUrl) => {
    setCropImageUrl(null);
    setUploading(true);
    try {
      // Convert dataUrl to File and upload to R2 via uploadFile
      const blob = await fetch(dataUrl).then(r => r.blob());
      const file = new File([blob], `avatar_${Date.now()}.jpg`, { type: "image/jpeg" });
      const result = await uploadFile(file);
      const fileUrl = result?.file_url || result;
      if (fileUrl) {
        onSelect(fileUrl);
        return;
      }
      throw new Error("Upload failed — no file_url returned");
    } catch(e) {
      console.warn("Avatar upload failed:", e);
      alert("Could not save avatar. Please try again.");
    } finally { setUploading(false); }
  };

  return (
    <>
      {cropImageUrl && (
        <AvatarCropEditor
          imageUrl={cropImageUrl}
          onSave={handleCropSave}
          onCancel={() => setCropImageUrl(null)}
        />
      )}

      <div style={{ position:"fixed", inset:0, zIndex:2000, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
        <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.75)" }} />
        <div style={{ position:"relative", background:"#1a1a2e", borderRadius:"24px 24px 0 0", width:"100%", maxWidth:480, padding:"20px 20px 36px", zIndex:2001 }}>
          <div style={{ width:40, height:4, background:"#444", borderRadius:99, margin:"0 auto 16px" }} />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div style={{ color:"#fff", fontWeight:700, fontSize:16 }}>🎨 Choose your avatar</div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:"50%", width:30, height:30, color:"#fff", cursor:"pointer" }}>✕</button>
          </div>

          {/* Upload own photo */}
          <div style={{ marginBottom:14 }}>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFileUpload} />
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              style={{ width:"100%", padding:"13px", background:"linear-gradient(135deg,rgba(245,200,66,0.15),rgba(255,149,0,0.1))", border:"2px dashed rgba(245,200,66,0.5)", borderRadius:14, color:"#F5C842", fontWeight:800, fontSize:15, cursor:"pointer" }}>
              {uploading ? "⏳ Uploading..." : "📷 Upload & crop your photo"}
            </button>
          </div>

          {/* Style tabs */}
          <div style={{ display:"flex", gap:6, marginBottom:12, overflowX:"auto", scrollbarWidth:"none" }}>
            {AVATAR_STYLES.map((s, i) => (
              <button key={i} onClick={() => setActiveStyle(i)}
                style={{ flexShrink:0, padding:"6px 14px", borderRadius:20, border:"none", cursor:"pointer", fontSize:12, fontWeight:700,
                  background: activeStyle === i ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "rgba(255,255,255,0.07)",
                  color: activeStyle === i ? "#fff" : "#aaa" }}>
                {s.label}
              </button>
            ))}
          </div>

          {/* Avatar grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:14, maxHeight:260, overflowY:"auto", paddingBottom:4 }}>
            {AVATAR_STYLES[activeStyle].seeds.map((seed, i) => {
              const style = AVATAR_STYLES[activeStyle].style;
              const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0B0C1A,1a1a2e,2d2d44`;
              return (
                <button key={i}
                  onClick={() => onSelect(url)}
                  style={{ background: currentAvatar===url ? "rgba(245,200,66,0.2)" : "rgba(255,255,255,0.06)",
                    border: currentAvatar===url ? "3px solid #F5C842" : "3px solid rgba(255,255,255,0.08)",
                    borderRadius:16, width:64, height:64, margin:"0 auto", padding:4,
                    cursor:"pointer", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center",
                    transition:"border 0.2s, transform 0.15s, box-shadow 0.2s",
                    boxShadow: currentAvatar===url ? "0 0 12px rgba(245,200,66,0.4)" : "none",
                    transform: currentAvatar===url ? "scale(1.12)" : "scale(1)" }}>
                  <img src={url} style={{ width:"100%", height:"100%", pointerEvents:"none", display:"block", borderRadius:10, background:"rgba(255,255,255,0.05)" }} loading="lazy" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}



// ─── User Profile Sheet ──────────────────────────────────────────────────────
// ─── Profile Video Player (full-screen TikTok-style) ────────────────────────

export default AvatarPickerModal;
