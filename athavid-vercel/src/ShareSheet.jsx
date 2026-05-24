// ╔══════════════════════════════════════════════════════════════════╗
// ║ ⛔ LOCKED — SHARE SHEET                                          ║
// ║  • WhatsApp, Messenger, SMS/iMessage, Twitter/X, copy link      ║
// ║  • Falls back gracefully on all browsers                         ║
// ║  • Tracks share count on close                                   ║
// ╚══════════════════════════════════════════════════════════════════╝
import React, { useState, useEffect } from "react";

export default function ShareSheet({ url, title, caption, onClose, onShared }) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Close on backdrop tap or Escape
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const text = encodeURIComponent(`${caption ? caption + " — " : ""}Watch on Sachi Stream`);
  const encodedUrl = encodeURIComponent(url);

  const platforms = [
    {
      name: "WhatsApp",
      emoji: "💬",
      color: "#25D366",
      bg: "rgba(37,211,102,0.12)",
      border: "rgba(37,211,102,0.25)",
      action: () => {
        window.open(`https://wa.me/?text=${text}%20${encodedUrl}`, "_blank");
        done();
      }
    },
    {
      name: "Messenger",
      emoji: "📘",
      color: "#0084FF",
      bg: "rgba(0,132,255,0.12)",
      border: "rgba(0,132,255,0.25)",
      action: () => {
        window.open(`fb-messenger://share?link=${encodedUrl}`, "_blank");
        // fallback for desktop
        setTimeout(() => window.open(`https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=291494419107518&redirect_uri=${encodedUrl}`, "_blank"), 500);
        done();
      }
    },
    {
      name: "iMessage / SMS",
      emoji: "📱",
      color: "#30D158",
      bg: "rgba(48,209,88,0.12)",
      border: "rgba(48,209,88,0.25)",
      action: () => {
        window.location.href = `sms:?&body=${text}%20${encodedUrl}`;
        done();
      }
    },
    {
      name: "X (Twitter)",
      emoji: "🐦",
      color: "#fff",
      bg: "rgba(255,255,255,0.06)",
      border: "rgba(255,255,255,0.15)",
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`, "_blank");
        done();
      }
    },
    {
      name: "Instagram Story",
      emoji: "📸",
      color: "#E1306C",
      bg: "rgba(225,48,108,0.12)",
      border: "rgba(225,48,108,0.25)",
      action: () => {
        // Copy link, then prompt them to paste in story
        navigator.clipboard?.writeText(url).then(() => {
          alert("Link copied! Open Instagram, create a Story, and paste the link as a sticker.");
        });
        done();
      }
    },
  ];

  function done() {
    setShared(true);
    onShared && onShared();
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      onShared && onShared();
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      onShared && onShared();
    }
  }

  async function handleNativeShare() {
    if (!navigator.share) return false;
    try {
      await navigator.share({ title: "Sachi Stream", text: caption || "Watch this on Sachi Stream", url });
      done();
      return true;
    } catch { return false; }
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:9999, display:"flex", alignItems:"flex-end", justifyContent:"center", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}
    >
      <div style={{ width:"100%", maxWidth:480, background:"#141428", borderRadius:"24px 24px 0 0", padding:"0 0 40px", animation:"slideUp 0.28s cubic-bezier(0.34,1.2,0.64,1)" }}>
        <style>{`@keyframes slideUp { from { transform:translateY(100%) } to { transform:translateY(0) } }`}</style>

        {/* Handle */}
        <div style={{ display:"flex", justifyContent:"center", padding:"12px 0 0" }}>
          <div style={{ width:36, height:4, borderRadius:2, background:"rgba(255,255,255,0.15)" }} />
        </div>

        {/* Header */}
        <div style={{ padding:"12px 20px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ color:"#fff", fontWeight:800, fontSize:16 }}>Share this video</div>
            {caption && <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12, marginTop:2, maxWidth:260, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{caption}</div>}
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.08)", border:"none", color:"rgba(255,255,255,0.5)", width:28, height:28, borderRadius:"50%", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>

        {/* Platform buttons */}
        <div style={{ display:"flex", gap:10, padding:"0 16px 20px", overflowX:"auto", scrollbarWidth:"none" }}>
          {platforms.map(p => (
            <button
              key={p.name}
              onClick={p.action}
              style={{ flex:"0 0 auto", display:"flex", flexDirection:"column", alignItems:"center", gap:6, padding:"12px 10px", background:p.bg, border:`1px solid ${p.border}`, borderRadius:16, cursor:"pointer", minWidth:68 }}
            >
              <span style={{ fontSize:24 }}>{p.emoji}</span>
              <span style={{ color:p.color, fontSize:10, fontWeight:700, textAlign:"center", lineHeight:1.2 }}>{p.name}</span>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height:1, background:"rgba(255,255,255,0.06)", margin:"0 16px 16px" }} />

        {/* URL + copy */}
        <div style={{ margin:"0 16px", display:"flex", gap:8, alignItems:"center" }}>
          <div style={{ flex:1, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"10px 12px", color:"rgba(255,255,255,0.4)", fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {url}
          </div>
          <button onClick={handleCopy} style={{ padding:"10px 16px", background:copied?"rgba(80,200,80,0.15)":"rgba(255,255,255,0.08)", border:`1px solid ${copied?"rgba(80,200,80,0.3)":"rgba(255,255,255,0.12)"}`, borderRadius:12, color:copied?"#5cc85c":"#fff", fontWeight:700, fontSize:13, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>
            {copied ? "✅ Copied" : "Copy"}
          </button>
        </div>

        {/* Native share (mobile) */}
        {typeof navigator !== "undefined" && navigator.share && (
          <button onClick={handleNativeShare} style={{ display:"block", width:"calc(100% - 32px)", margin:"12px 16px 0", padding:"14px 0", background:"linear-gradient(135deg,#F5C842,#FF9500)", border:"none", borderRadius:14, color:"#0B0C1A", fontWeight:800, fontSize:15, cursor:"pointer" }}>
            Share via…
          </button>
        )}
      </div>
    </div>
  );
}
