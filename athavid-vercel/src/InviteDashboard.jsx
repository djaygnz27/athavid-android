// ╔══════════════════════════════════════════════════════════════════╗
// ║ ⛔ LOCKED — INVITE DASHBOARD (user-facing referral panel)        ║
// ║  • Shows user's unique invite link                               ║
// ║  • Shows how many people they've referred                        ║
// ║  • Copy-to-clipboard + share sheet support                       ║
// ║  • Top referrers leaderboard for gamification                    ║
// ╚══════════════════════════════════════════════════════════════════╝
import React, { useState, useEffect } from "react";
import { invites } from "./inviteApi.js";

export default function InviteDashboard({ currentUser, onClose }) {
  const [myInvite, setMyInvite] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) return;
    loadData();
  }, [currentUser]);

  async function loadData() {
    setLoading(true);
    try {
      // Get or create invite record for this user
      const invite = await invites.getOrCreate(currentUser.id, currentUser.username || currentUser.full_name);
      setMyInvite(invite);
      // Get people I referred
      const refs = await invites.getReferrals(currentUser.id);
      setReferrals(refs);
      // Get top referrers
      const top = await invites.getLeaderboard();
      setLeaderboard(top);
    } catch (e) {
      console.error("InviteDashboard load error", e);
    } finally {
      setLoading(false);
    }
  }

  const inviteLink = myInvite?.code
    ? `https://sachistream.com/?ref=${myInvite.code}`
    : null;

  const handleCopy = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleShare = async () => {
    if (!inviteLink) return;
    if (navigator.share) {
      await navigator.share({
        title: "Join me on Sachi",
        text: "I'm on Sachi — real short-form video, no algorithm games. Join me during beta:",
        url: inviteLink
      });
    } else {
      handleCopy();
    }
  };

  if (loading) return (
    <div style={panelStyle}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:200 }}>
        <div style={{ width:28, height:28, border:"3px solid rgba(245,200,66,0.3)", borderTopColor:"#F5C842", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  return (
    <div style={panelStyle}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>Invite Friends</div>
          <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12, marginTop:2 }}>Earn Beta OG status for every referral</div>
        </div>
        <button onClick={onClose} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.4)", fontSize:22, cursor:"pointer" }}>✕</button>
      </div>

      {/* Stats row */}
      <div style={{ display:"flex", gap:10, marginBottom:20 }}>
        <StatCard label="Invited" value={referrals.length} emoji="👥" />
        <StatCard label="Your rank" value={myInvite?.referral_count > 0 ? `#${leaderboard.findIndex(l => l.user_id === currentUser.id) + 1 || "—"}` : "—"} emoji="🏆" />
        <StatCard label="Beta OG" value={referrals.length >= 3 ? "✅" : `${referrals.length}/3`} emoji="⭐" />
      </div>

      {/* Invite link */}
      <div style={{ background:"rgba(245,200,66,0.08)", border:"1px solid rgba(245,200,66,0.2)", borderRadius:14, padding:"14px 16px", marginBottom:14 }}>
        <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11, marginBottom:6, letterSpacing:0.5 }}>YOUR INVITE LINK</div>
        <div style={{ color:"#F5C842", fontSize:13, fontWeight:600, wordBreak:"break-all", marginBottom:12 }}>
          {inviteLink || "Generating..."}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={handleCopy} style={{ flex:1, padding:"10px 0", background:copied?"rgba(80,200,80,0.15)":"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, color:copied?"#5cc85c":"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>
            {copied ? "✅ Copied!" : "📋 Copy"}
          </button>
          <button onClick={handleShare} style={{ flex:1, padding:"10px 0", background:"linear-gradient(135deg,#F5C842,#FF9500)", border:"none", borderRadius:10, color:"#0B0C1A", fontSize:13, fontWeight:800, cursor:"pointer" }}>
            🚀 Share
          </button>
        </div>
      </div>

      {/* Referrals list */}
      {referrals.length > 0 && (
        <div style={{ marginBottom:16 }}>
          <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11, letterSpacing:0.5, marginBottom:8 }}>PEOPLE YOU INVITED</div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {referrals.slice(0,5).map(r => (
              <div key={r.id} style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"8px 12px" }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#F5C842,#FF9500)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, color:"#0B0C1A", fontSize:12 }}>{(r.invitee_username||"?")[0].toUpperCase()}</div>
                <span style={{ color:"#fff", fontSize:13 }}>@{r.invitee_username || "new user"}</span>
                <span style={{ marginLeft:"auto", color:"rgba(255,255,255,0.3)", fontSize:11 }}>{new Date(r.created_date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <div>
          <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11, letterSpacing:0.5, marginBottom:8 }}>TOP INVITERS 🏆</div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {leaderboard.slice(0,5).map((l, i) => (
              <div key={l.user_id} style={{ display:"flex", alignItems:"center", gap:10, background: l.user_id===currentUser.id ? "rgba(245,200,66,0.08)" : "rgba(255,255,255,0.04)", borderRadius:10, padding:"8px 12px" }}>
                <span style={{ color:i===0?"#F5C842":i===1?"#C0C0C0":i===2?"#CD7F32":"rgba(255,255,255,0.4)", fontWeight:700, fontSize:14, width:20 }}>{i+1}</span>
                <span style={{ color:"#fff", fontSize:13, flex:1 }}>@{l.username}</span>
                <span style={{ color:"rgba(255,255,255,0.5)", fontSize:12 }}>{l.referral_count} invited</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, emoji }) {
  return (
    <div style={{ flex:1, background:"rgba(255,255,255,0.05)", borderRadius:12, padding:"12px 8px", textAlign:"center" }}>
      <div style={{ fontSize:20, marginBottom:4 }}>{emoji}</div>
      <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>{value}</div>
      <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11, marginTop:2 }}>{label}</div>
    </div>
  );
}

const panelStyle = {
  background:"#0F1020",
  borderRadius:"20px 20px 0 0",
  padding:"24px 20px 40px",
  maxWidth:480,
  margin:"0 auto",
  fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"
};
