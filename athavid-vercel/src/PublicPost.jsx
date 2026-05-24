// ╔══════════════════════════════════════════════════════════════════╗
// ║ ⛔ LOCKED — PUBLIC POST PAGE (shareable, no login required)      ║
// ║  • Renders a single post for non-logged-in users                 ║
// ║  • Shows video/photo + creator info + engagement counts          ║
// ║  • Big "Join Sachi" CTA that deep-links to signup                ║
// ║  • Tracks invite code from URL if present (?ref=CODE)            ║
// ╚══════════════════════════════════════════════════════════════════╝
import React, { useState, useEffect } from "react";
import { resolveMediaUrl, formatCount } from "./utils.jsx";

const APP_ID = "69e79122bcc8fb5a04cfb834";
const BASE_URL = "https://app.base44.com/api";

async function publicRequest(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  try { return await res.json(); } catch { return {}; }
}

export default function PublicPost({ postId, inviteCode, onJoin }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!postId) return;
    publicRequest(`/apps/${APP_ID}/entities/SachiVideo/${postId}`)
      .then(data => {
        if (data?.id) setPost(data);
        else setError("Post not found");
      })
      .catch(() => setError("Could not load post"))
      .finally(() => setLoading(false));
  }, [postId]);

  const handleJoin = () => {
    // Store invite code so signup flow can attribute it
    if (inviteCode) localStorage.setItem("sachi_invite_code", inviteCode);
    if (onJoin) onJoin();
    else window.location.href = inviteCode ? `/?ref=${inviteCode}` : "/";
  };

  if (loading) return (
    <div style={{ background:"#0B0C1A", minHeight:"100svh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:32, height:32, border:"3px solid rgba(245,200,66,0.3)", borderTopColor:"#F5C842", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error || !post) return (
    <div style={{ background:"#0B0C1A", minHeight:"100svh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, padding:24 }}>
      <div style={{ fontSize:48 }}>🎬</div>
      <div style={{ color:"#fff", fontSize:18, fontWeight:700 }}>This post isn't available</div>
      <button onClick={handleJoin} style={ctaStyle}>Join Sachi</button>
    </div>
  );

  const isVideo = !post.is_photo && (post.video_url || post.media_url);
  const mediaUrl = resolveMediaUrl(post.video_url || post.media_url || (post.photo_urls?.[0]));
  const username = post.username || post.display_name || "sachi user";
  const avatar = post.avatar_url;
  const caption = post.caption || post.description || "";

  return (
    <div style={{ background:"#0B0C1A", minHeight:"100svh", maxWidth:480, margin:"0 auto", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", display:"flex", flexDirection:"column" }}>
      
      {/* Header */}
      <div style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:12, borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
        <img src="/sachi-crystal.png" alt="Sachi" style={{ height:32, borderRadius:8 }} onError={e => e.target.style.display="none"} />
        <span style={{ color:"#fff", fontWeight:800, fontSize:18, letterSpacing:"-0.5px" }}>Sachi™</span>
        <span style={{ marginLeft:"auto", color:"rgba(255,255,255,0.4)", fontSize:12 }}>Beta</span>
      </div>

      {/* Creator info */}
      <div style={{ padding:"12px 20px", display:"flex", alignItems:"center", gap:10 }}>
        {avatar
          ? <img src={avatar} style={{ width:40, height:40, borderRadius:"50%", objectFit:"cover", border:"2px solid #F5C842" }} />
          : <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#F5C842,#FF9500)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"#0B0C1A", fontSize:16 }}>{username[0]?.toUpperCase()}</div>
        }
        <div>
          <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>@{username}</div>
          <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12 }}>{new Date(post.created_date).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Media */}
      <div style={{ position:"relative", background:"#000", aspectRatio:"9/16", maxHeight:"60svh", overflow:"hidden" }}>
        {isVideo ? (
          <video
            src={mediaUrl}
            poster={post.thumbnail_url || undefined}
            preload="metadata"
            controls
            playsInline
            style={{ width:"100%", height:"100%", objectFit:"cover" }}
          />
        ) : (
          <img
            src={resolveMediaUrl(post.photo_urls?.[0] || post.thumbnail_url)}
            alt={caption}
            style={{ width:"100%", height:"100%", objectFit:"cover" }}
          />
        )}
      </div>

      {/* Caption */}
      {caption && (
        <div style={{ padding:"12px 20px", color:"rgba(255,255,255,0.85)", fontSize:14, lineHeight:1.5 }}>
          {caption}
        </div>
      )}

      {/* Engagement counts */}
      <div style={{ padding:"8px 20px 16px", display:"flex", gap:24, borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
        <span style={{ color:"rgba(255,255,255,0.5)", fontSize:13 }}>❤️ {formatCount(post.likes_count || 0)}</span>
        <span style={{ color:"rgba(255,255,255,0.5)", fontSize:13 }}>💬 {formatCount(post.comments_count || 0)}</span>
        <span style={{ color:"rgba(255,255,255,0.5)", fontSize:13 }}>▶️ {formatCount(post.views_count || 0)}</span>
      </div>

      {/* CTA */}
      <div style={{ padding:"24px 20px", display:"flex", flexDirection:"column", alignItems:"center", gap:12, marginTop:"auto" }}>
        <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13, textAlign:"center" }}>
          {inviteCode ? "You've been invited to Sachi 🎉" : "See more on Sachi"}
        </div>
        <button onClick={handleJoin} style={ctaStyle}>
          {inviteCode ? "Accept Invite & Join Free" : "Join Sachi — It's Free"}
        </button>
        <div style={{ color:"rgba(255,255,255,0.3)", fontSize:11, textAlign:"center" }}>
          Short-form video for real people. No algorithm games.
        </div>
      </div>
    </div>
  );
}

const ctaStyle = {
  width:"100%",
  padding:"16px 0",
  background:"linear-gradient(135deg,#F5C842,#FF9500)",
  border:"none",
  borderRadius:16,
  color:"#0B0C1A",
  fontWeight:800,
  fontSize:17,
  cursor:"pointer",
  letterSpacing:"-0.3px"
};
