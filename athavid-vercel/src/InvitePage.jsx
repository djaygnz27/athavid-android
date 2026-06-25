// ╔══════════════════════════════════════════════════════════════════╗
// ║ ⛔ LOCKED — INVITE / REFERRAL PAGE                               ║
// ║  • Each user gets a unique invite link: /?ref=CODE               ║
// ║  • Landing page variant shown when ?ref= param is present        ║
// ║  • Stores invite code to localStorage before signup              ║
// ║  • Tracks who invited who in SachiInvite entity                  ║
// ╚══════════════════════════════════════════════════════════════════╝
import React, { useEffect, useState } from "react";

export default function InvitePage({ inviteCode, inviterName, inviterAvatar, onJoin }) {
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    // Store code for post-signup attribution
    if (inviteCode) localStorage.setItem("sachi_invite_code", inviteCode);
  }, [inviteCode]);

  // Countdown to auto-prompt
  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  return (
    <div style={{ background:"#0B0C1A", minHeight:"100svh", maxWidth:480, margin:"0 auto", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 24px", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", gap:0 }}>

      {/* Logo */}
      <div style={{ fontSize:52, marginBottom:8 }}>🎬</div>
      <div style={{ color:"#F5C842", fontWeight:900, fontSize:28, letterSpacing:"-1px", marginBottom:4 }}>Sachi™</div>
      <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12, marginBottom:32, letterSpacing:2 }}>BETA</div>

      {/* Invite card */}
      <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(245,200,66,0.25)", borderRadius:20, padding:"24px 20px", width:"100%", textAlign:"center", marginBottom:24 }}>
        {inviterAvatar
          ? <img src={inviterAvatar} style={{ width:64, height:64, borderRadius:"50%", objectFit:"cover", border:"3px solid #F5C842", marginBottom:12 }} />
          : <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#F5C842,#FF9500)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:"#0B0C1A", fontSize:28, margin:"0 auto 12px" }}>{(inviterName||"S")[0].toUpperCase()}</div>
        }
        <div style={{ color:"#fff", fontWeight:700, fontSize:16, marginBottom:4 }}>
          {inviterName ? `@${inviterName} invited you` : "You've been invited!"}
        </div>
        <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13 }}>
          Join the Sachi beta — real short-form video, no algorithm games.
        </div>
      </div>

      {/* Perks */}
      <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
        {["🎯 Beta access before public launch", "⭐ Beta OG badge on your profile", "🚀 Be part of building something real"].map(perk => (
          <div key={perk} style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"10px 14px" }}>
            <span style={{ fontSize:18 }}>{perk.split(" ")[0]}</span>
            <span style={{ color:"rgba(255,255,255,0.75)", fontSize:13 }}>{perk.slice(perk.indexOf(" ")+1)}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button onClick={onJoin} style={{ width:"100%", padding:"16px 0", background:"linear-gradient(135deg,#F5C842,#FF9500)", border:"none", borderRadius:16, color:"#0B0C1A", fontWeight:900, fontSize:17, cursor:"pointer", letterSpacing:"-0.3px", boxShadow:"0 8px 32px rgba(245,200,66,0.35)" }}>
        Accept Invite — Join Free
      </button>

      <div style={{ color:"rgba(255,255,255,0.25)", fontSize:11, marginTop:16, textAlign:"center" }}>
        No credit card. Beta is free.
      </div>
    </div>
  );
}
