// ⛔ LOCKED — Toast.jsx
// DO NOT MODIFY unless fixing a Toast-specific bug.
// Last verified working: 2026-05-23

import React from "react";

function Toast({ msg, type="success" }) {
  if (!msg) return null;
  const bg = type==="error" ? "linear-gradient(135deg,#c62828,#b71c1c)" : type==="live" ? "linear-gradient(135deg,#e53935,#b71c1c)" : "linear-gradient(135deg,#2e7d32,#1b5e20)";
  return (
    <div style={{ position:"fixed", bottom:100, left:"50%", transform:"translateX(-50%)", zIndex:9999, background:bg, color:"#fff", fontWeight:700, fontSize:14, padding:"12px 24px", borderRadius:30, boxShadow:"0 6px 28px rgba(0,0,0,0.5)", whiteSpace:"nowrap", pointerEvents:"none" }}>
      {msg}
    </div>
  );
}

// ── RECENT EPISODES COMPONENT v2 ──

export default Toast;
