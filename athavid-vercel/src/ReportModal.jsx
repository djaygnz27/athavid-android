// ⛔ LOCKED — ReportModal.jsx
// Handles user content reporting.
// DO NOT MODIFY unless fixing a report-specific bug.
// Last verified working: 2026-05-23

import React, { useState } from "react";
import { request } from "./api.js";

function ReportModal({ video, currentUser, onClose }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const submit = async () => {
    if (!selected) return;
    setSubmitted(true);
    try {
      await reports.create({
        video_id: video.id,
        reporter_id: currentUser?.id || "guest",
        reporter_username: currentUser?.username || currentUser?.email || "guest",
        video_caption: video.caption || "",
        video_username: video.username || video.display_name || "",
        reason: selected,
        status: "pending",
      });
    } catch(e) { console.error("Report failed:", e); }
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
            <div style={{ color:"#888", fontSize:14 }}>Thanks for keeping Sachi safe. We'll review this video.</div>
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
  @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
  @keyframes heartbeat {
    0%   { transform: scale(1); }
    14%  { transform: scale(1.35); }
    28%  { transform: scale(1); }
    42%  { transform: scale(1.25); }
    56%  { transform: scale(1); }
    100% { transform: scale(1); }
  }
  @keyframes heartShake {
    0%,100% { transform: rotate(0deg) scale(1); }
    20%     { transform: rotate(-15deg) scale(1.2); }
    40%     { transform: rotate(15deg) scale(1.2); }
    60%     { transform: rotate(-10deg) scale(1.1); }
    80%     { transform: rotate(10deg) scale(1.1); }
  }
  @keyframes floatHeart {
    0%   { opacity:1; transform:translate(-50%,-50%) scale(0.5); }
    40%  { opacity:1; transform:translate(-50%,-120%) scale(1.3); }
    100% { opacity:0; transform:translate(-50%,-220%) scale(0.8); }
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
const AVATAR_COLORS = [
  ["e94560","fff"],["f5a623","000"],["22c55e","fff"],["6c63ff","fff"],["0ea5e9","fff"],
  ["ec4899","fff"],["f97316","fff"],["14b8a6","fff"],["8b5cf6","fff"],["ef4444","fff"],
  ["10b981","fff"],["3b82f6","fff"],["a855f7","fff"],["f59e0b","000"],["06b6d4","fff"],
  ["84cc16","000"],["fb7185","fff"],["34d399","000"],["60a5fa","fff"],["c084fc","fff"],
];
const AVATAR_NAMES = ["Nova","Zara","Kai","Milo","Aria","Finn","Luna","Rex","Sage","Cleo","Axel","Nadia","Blake","Iris","Cruz","Ember","Jax","Lyra","Orion","Veda"];

// ── Avatar Picker Modal ──────────────────────────────────────────────────────
const AVATAR_STYLES = [
  { label: "Cartoon", style: "avataaars", seeds: ["Felix","Aneka","Mia","Zara","Leo","Nova","Kira","Blaze","Pixel","Storm","Echo","Sage","Raya","Kofi","Priya","Omar","Mei","Ava","Jake","Luna","Diego","Aisha","Nate","Yuki"] },
  { label: "Portraits", style: "lorelei", seeds: ["Alex","Sam","Jordan","Taylor","Morgan","Casey","Jamie","Riley","Quinn","Avery","Blake","Cameron","Dana","Ellis","Fynn","Gwen","Harley","Indie","Jules","Kai"] },
  { label: "Fun", style: "bottts", seeds: ["R2D2","BB8","Wall-E","Robo","Zap","Bolt","Chip","Digi","Glitch","Mega","Nano","Pixel","Spark","Vibe","Wave","Flux","Glow","Nova","Atom","Echo"] },
  { label: "Minimal", style: "thumbs", seeds: ["Alpha","Beta","Gamma","Delta","Epsilon","Zeta","Eta","Theta","Iota","Kappa","Lambda","Mu","Nu","Xi","Omicron","Pi","Rho","Sigma","Tau","Upsilon"] },
];

// ── Avatar Crop Editor ──────────────────────────────────────────────────────


export default ReportModal;
