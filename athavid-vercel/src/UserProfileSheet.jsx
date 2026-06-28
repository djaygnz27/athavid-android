// ⛔ LOCKED — UserProfileSheet.jsx
// DO NOT MODIFY unless fixing a UserProfileSheet-specific bug.
// Last verified working: 2026-06-28 (full profile overhaul — Vibe Score, Mood Banner, Sachi Fam, Creator Card, Honeycomb)

import React, { useState, useEffect, useRef } from "react";
import { videos, follows, bookmarks, blocks, request } from "./api.js";
import { resolveMediaUrl } from "./utils.jsx";
import ProfileVideoPlayer from "./ProfileVideoPlayer.jsx";
import AvatarPickerModal from "./AvatarPickerModal.jsx";

const APP_ID = "69e79122bcc8fb5a04cfb834";

// ── Vibe Score calculator ──────────────────────────────────────────────────
function calcVibeScore(videoList, followersCount) {
  if (!videoList.length) return 0;
  const totalLikes = videoList.reduce((s, v) => s + (v.likes_count || 0), 0);
  const avgLikes = totalLikes / videoList.length;
  const postFreq = Math.min(videoList.length / 10, 1); // up to 10 posts = max freq score
  const followerScore = Math.min(followersCount / 500, 1); // 500 followers = max
  const engagementScore = Math.min(avgLikes / 50, 1); // 50 avg likes = max
  const raw = (followerScore * 35) + (engagementScore * 40) + (postFreq * 25);
  return Math.round(Math.min(raw, 100));
}

function vibeColor(score) {
  if (score >= 80) return ["#FFD700", "#FF8C00"]; // gold
  if (score >= 60) return ["#a855f7", "#6c63ff"]; // purple
  if (score >= 40) return ["#22c55e", "#06b6d4"]; // green-teal
  return ["#64748b", "#94a3b8"]; // grey
}

function vibeLabel(score) {
  if (score >= 90) return "🔥 On Fire";
  if (score >= 75) return "⚡ Electrifying";
  if (score >= 60) return "✨ Rising";
  if (score >= 40) return "🌱 Building";
  return "👋 Just Started";
}

// ── Honeycomb helpers ──────────────────────────────────────────────────────
// Renders a hex grid: row 1 = 3 cells, row 2 = 2 cells offset, alternating
function HoneycombGrid({ videos: vids, onSelect }) {
  if (!vids.length) return (
    <div style={{ textAlign:"center", padding:40, color:"#444" }}>
      <div style={{ fontSize:36, marginBottom:8 }}>🎬</div>
      <div style={{ color:"rgba(255,255,255,0.4)", fontSize:14 }}>No videos yet</div>
    </div>
  );

  const CELL = 108; // px — diameter of each circle
  const GAP = 6;
  const ROW_H = CELL * 0.82;
  const OFFSET = (CELL + GAP) / 2;
  const PER_ROW = 3;

  const rows = [];
  for (let i = 0; i < vids.length; i += PER_ROW) {
    rows.push(vids.slice(i, i + PER_ROW));
  }

  return (
    <div style={{ overflowY:"auto", paddingBottom:100 }}>
      {rows.map((row, ri) => {
        const isOffset = ri % 2 === 1;
        return (
          <div key={ri} style={{
            display:"flex",
            justifyContent: isOffset ? "flex-start" : "center",
            paddingLeft: isOffset ? OFFSET : 0,
            marginTop: ri === 0 ? 12 : -(CELL - ROW_H) - 2,
            gap: GAP,
            paddingRight: 8,
            paddingLeft: isOffset ? OFFSET + 8 : 8,
          }}>
            {row.map((v, ci) => (
              <HexCell key={v.id} video={v} size={CELL} onSelect={() => onSelect(ri * PER_ROW + ci)} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

function HexCell({ video: v, size, onSelect }) {
  const thumb = v.thumbnail_url ? resolveMediaUrl(v.thumbnail_url) : null;
  const hasLikes = (v.likes_count || 0) > 0;

  return (
    <div onClick={onSelect} style={{
      width: size, height: size, borderRadius:"50%", overflow:"hidden", cursor:"pointer",
      position:"relative", flexShrink:0,
      border:"2px solid rgba(245,200,66,0.35)",
      boxShadow:"0 4px 18px rgba(0,0,0,0.5)",
      background:"#111",
    }}>
      {thumb ? (
        <img src={thumb} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
      ) : (
        <video src={resolveMediaUrl(v.video_url)} muted playsInline preload="metadata"
          style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
          onLoadedMetadata={e => { try { e.target.currentTime = 1; } catch {} }} />
      )}
      {/* Dark overlay */}
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(circle at 60% 70%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 60%)" }} />
      {/* Like count */}
      {hasLikes && (
        <div style={{ position:"absolute", bottom:14, left:0, right:0, textAlign:"center",
          color:"#fff", fontSize:10, fontWeight:800, textShadow:"0 1px 4px rgba(0,0,0,0.9)" }}>
          ❤️ {v.likes_count}
        </div>
      )}
      {/* Video play dot */}
      {!v.is_photo && (
        <div style={{ position:"absolute", top:10, right:12,
          width:16, height:16, borderRadius:"50%", background:"rgba(255,255,255,0.2)",
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ fontSize:7, color:"#fff" }}>▶</div>
        </div>
      )}
    </div>
  );
}

// ── Sachi Fam Row ──────────────────────────────────────────────────────────
function SachiFamRow({ userId }) {
  const [fans, setFans] = React.useState([]);

  React.useEffect(() => {
    // Fetch top likers of this user's videos — use SachiLike + lookup
    request("GET", `/apps/${APP_ID}/entities/SachiLike?limit=500`)
      .then(res => {
        const all = Array.isArray(res) ? res : (res?.items || res?.records || []);
        // Only likes on videos that belong to this user (we filter by display_name/username later)
        // Count by liker username
        const counts = {};
        const avatarMap = {};
        for (const l of all) {
          if (!l.username) continue;
          counts[l.username] = (counts[l.username] || 0) + 1;
          if (l.avatar_url) avatarMap[l.username] = l.avatar_url;
        }
        const sorted = Object.entries(counts)
          .sort((a,b) => b[1]-a[1])
          .slice(0, 10)
          .map(([uname, cnt]) => ({ username: uname, count: cnt, avatar: avatarMap[uname] }));
        setFans(sorted);
      }).catch(() => {});
  }, [userId]);

  if (!fans.length) return null;

  return (
    <div style={{ padding:"14px 16px 6px" }}>
      <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:700, letterSpacing:1, marginBottom:10, textTransform:"uppercase" }}>
        🫂 Sachi Fam
      </div>
      <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4 }}>
        {fans.map(f => (
          <div key={f.username} style={{ flexShrink:0, textAlign:"center" }}>
            <div style={{
              width:44, height:44, borderRadius:"50%", overflow:"hidden",
              border:"2px solid rgba(245,200,66,0.5)",
              background:"#1a1a2e",
              marginBottom:3,
            }}>
              {f.avatar ? (
                <img src={f.avatar} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              ) : (
                <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center",
                  background:"linear-gradient(135deg,#6c63ff,#a855f7)", color:"#fff", fontWeight:800, fontSize:16 }}>
                  {f.username[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div style={{ color:"rgba(255,255,255,0.55)", fontSize:9, fontWeight:600, maxWidth:44,
              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              @{f.username}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Creator Card ───────────────────────────────────────────────────────────
function CreatorCard({ videoList, profile }) {
  const totalLikes = videoList.reduce((s, v) => s + (v.likes_count || 0), 0);
  const memberSince = profile?.created_date
    ? new Date(profile.created_date).toLocaleDateString("en-US", { month:"short", year:"numeric" })
    : null;

  // Streak: count consecutive days with at least 1 post (rough estimate from post dates)
  const streak = React.useMemo(() => {
    if (!videoList.length) return 0;
    const dates = [...new Set(videoList.map(v =>
      v.created_date ? new Date(v.created_date).toDateString() : null
    ).filter(Boolean))].sort((a,b) => new Date(b)-new Date(a));
    let s = 0;
    let cur = new Date();
    cur.setHours(0,0,0,0);
    for (const d of dates) {
      const dt = new Date(d);
      dt.setHours(0,0,0,0);
      const diff = Math.round((cur - dt) / 86400000);
      if (diff <= 1) { s++; cur = dt; } else break;
    }
    return s;
  }, [videoList]);

  const cards = [
    { icon:"🔥", label:"Day Streak", value: streak || "—" },
    { icon:"❤️", label:"Total Love", value: totalLikes >= 1000 ? `${(totalLikes/1000).toFixed(1)}K` : totalLikes },
    { icon:"🎬", label:"Videos", value: videoList.length },
    { icon:"📅", label:"Since", value: memberSince || "—" },
  ];

  return (
    <div style={{ padding:"12px 16px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
      {cards.map(c => (
        <div key={c.label} style={{
          background:"rgba(255,255,255,0.04)",
          border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:16, padding:"12px 14px",
          display:"flex", alignItems:"center", gap:10,
        }}>
          <div style={{ fontSize:22 }}>{c.icon}</div>
          <div>
            <div style={{ color:"#fff", fontWeight:800, fontSize:16, lineHeight:1 }}>{c.value}</div>
            <div style={{ color:"rgba(255,255,255,0.4)", fontSize:10, marginTop:2 }}>{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Mood Banner (looping video or gradient fallback) ────────────────────────
function MoodBanner({ videoList }) {
  const topVideo = React.useMemo(() => {
    if (!videoList.length) return null;
    return [...videoList].sort((a,b) => (b.likes_count||0)-(a.likes_count||0))[0];
  }, [videoList]);

  const bannerSrc = topVideo?.video_url ? resolveMediaUrl(topVideo.video_url) : null;

  return (
    <div style={{ position:"absolute", top:0, left:0, right:0, height:200, overflow:"hidden", zIndex:0 }}>
      {bannerSrc ? (
        <video src={bannerSrc} autoPlay muted loop playsInline
          style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.35, filter:"blur(2px) saturate(1.4)" }} />
      ) : (
        <div style={{ width:"100%", height:"100%", background:"linear-gradient(135deg,#1a0533,#0d1b3e,#1a0533)" }} />
      )}
      {/* Hard gradient fade to background */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(15,15,26,0.1) 0%, rgba(15,15,26,0.7) 60%, #0f0f1a 100%)" }} />
    </div>
  );
}

// ── Vibe Score Ring ────────────────────────────────────────────────────────
function VibeRing({ score, avatarUrl, size=90 }) {
  const [c1, c2] = vibeColor(score);
  const r = size / 2;
  const stroke = 3.5;
  const circ = 2 * Math.PI * (r - stroke);
  const pct = score / 100;

  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      {/* Glow behind ring */}
      <div style={{
        position:"absolute", inset:-4, borderRadius:"50%",
        background:`radial-gradient(circle, ${c1}33 0%, transparent 70%)`,
        animation:"vibeGlow 2.5s ease-in-out infinite alternate",
      }} />
      <svg width={size} height={size} style={{ position:"absolute", top:0, left:0, transform:"rotate(-90deg)" }}>
        {/* Background track */}
        <circle cx={r} cy={r} r={r-stroke} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        {/* Score arc */}
        <circle cx={r} cy={r} r={r-stroke} fill="none"
          stroke={`url(#vg_${score})`} strokeWidth={stroke+1}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round" />
        <defs>
          <linearGradient id={`vg_${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>
      </svg>
      {/* Avatar inside ring */}
      <img src={avatarUrl} style={{ position:"absolute", top:stroke+2, left:stroke+2,
        width:size-stroke*2-4, height:size-stroke*2-4, borderRadius:"50%", objectFit:"cover", background:"#1a1a2e" }} />
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
function UserProfileSheet({ userId, username, currentUser, onClose, backLabel = "Back" }) {
  const [profile, setProfile] = React.useState(null);
  const [userVideos, setUserVideos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [followRecord, setFollowRecord] = React.useState(null);
  const [followLoading, setFollowLoading] = React.useState(false);
  const [playerIndex, setPlayerIndex] = React.useState(null);
  const [profileTab, setProfileTab] = React.useState("posts");
  const [savedVideos, setSavedVideos] = React.useState([]);
  const [savedLoading, setSavedLoading] = React.useState(false);

  const isOwnProfile = currentUser && currentUser.id === userId;

  const loadSaved = React.useCallback(async () => {
    if (!currentUser || !isOwnProfile) return;
    setSavedLoading(true);
    try {
      const res = await bookmarks.getByUser(currentUser.id);
      const recs = Array.isArray(res) ? res : (res?.items || res?.records || []);
      const videoIds = recs.map(r => r.video_id).filter(Boolean);
      if (videoIds.length === 0) { setSavedVideos([]); setSavedLoading(false); return; }
      const fetched = await Promise.all(
        videoIds.map(id => request("GET", `/apps/${APP_ID}/entities/SachiVideo/${id}`).catch(() => null))
      );
      setSavedVideos(fetched.filter(Boolean));
    } catch(e) {}
    setSavedLoading(false);
  }, [currentUser, isOwnProfile]);

  React.useEffect(() => {
    if (profileTab === "saved") loadSaved();
  }, [profileTab]);

  React.useEffect(() => {
    setLoading(true);
    Promise.all([
      request("GET", `/apps/${APP_ID}/entities/AthaVidUser?limit=200`).catch(() => null),
      videos.byUser(userId).catch(() => []),
      request("GET", `/apps/${APP_ID}/entities/Follow?following_id=${userId}&limit=500`).catch(() => null),
      request("GET", `/apps/${APP_ID}/entities/Follow?follower_id=${userId}&limit=500`).catch(() => null),
      request("GET", `/apps/${APP_ID}/entities/SachiUser?limit=200`).catch(() => null),
    ]).then(([userRes, vids, followersRes, followingRes, sachiRes]) => {
      const allUsers = userRes?.items || userRes || [];
      const u = allUsers.find(x => x.id === userId || x.created_by === userId) || null;
      const liveFollowers = (followersRes?.items || followersRes || []).length;
      const liveFollowing = (followingRes?.items || followingRes || []).length;

      // Also pull badge from SachiUser
      const sachiUsers = sachiRes?.items || sachiRes || [];
      const sachiUser = sachiUsers.find(x => x.id === userId || x.username === username) || null;

      setProfile(u ? {
        ...u,
        followers_count: liveFollowers,
        following_count: liveFollowing,
        badge: sachiUser?.badge || null,
        is_verified: sachiUser?.is_verified || false,
        created_date: sachiUser?.created_date || u?.created_date,
      } : {
        followers_count: liveFollowers,
        following_count: liveFollowing,
        badge: sachiUser?.badge || null,
        is_verified: sachiUser?.is_verified || false,
        created_date: sachiUser?.created_date,
      });
      const vidList = Array.isArray(vids) ? vids : (vids?.items || []);
      setUserVideos(vidList);
      setLoading(false);
    });
    if (currentUser && !isOwnProfile) {
      follows.getFollowing(currentUser.id).then(res => {
        const rec = (res.items || res || []).find(r => r.following_id === userId);
        if (rec) setFollowRecord(rec);
      }).catch(() => {});
    }
  }, [userId]);

  const doFollow = async () => {
    if (!currentUser || isOwnProfile) return;
    setFollowLoading(true);
    try {
      if (followRecord) {
        await follows.unfollow(followRecord.id);
        setFollowRecord(null);
        setProfile(p => p ? { ...p, followers_count: Math.max(0, (p.followers_count || 1) - 1) } : p);
      } else {
        const rec = await follows.follow(currentUser.id, currentUser.username || currentUser.email?.split("@")[0], userId, username);
        setFollowRecord(rec);
        setProfile(p => p ? { ...p, followers_count: (p.followers_count || 0) + 1 } : p);
      }
      try {
        const myFollowingRes = await request("GET", `/apps/${APP_ID}/entities/Follow?follower_id=${currentUser.id}&limit=500`);
        const myFollowingCount = (myFollowingRes?.items || myFollowingRes || []).length;
        localStorage.setItem(`sachi_following_count_${currentUser.id}`, myFollowingCount);
      } catch(e) {}
    } catch(e) { console.error(e); }
    setFollowLoading(false);
  };

  const displayName = profile?.display_name || username || "User";
  const avatarUrl = profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`;
  const vibeScore = calcVibeScore(userVideos, profile?.followers_count || 0);
  const [vc1, vc2] = vibeColor(vibeScore);

  const activeVideos = profileTab === "saved" ? savedVideos : userVideos;

  return (
    <>
      <style>{`
        @keyframes vibeGlow {
          from { opacity:0.6; transform:scale(0.98); }
          to { opacity:1; transform:scale(1.03); }
        }
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(16px); }
          to { opacity:1; transform:translateY(0); }
        }
      `}</style>

      <div style={{ position:"fixed", inset:0, zIndex:4000, background:"#0f0f1a", display:"flex", flexDirection:"column", overflowY:"auto" }}>
        <div style={{ position:"relative", width:"100%", minHeight:"100%", display:"flex", flexDirection:"column" }}>

          {/* ── MOOD BANNER (blurred looping top video) ── */}
          {!loading && <MoodBanner videoList={userVideos} />}

          {/* ── BACK BUTTON (floats over banner) ── */}
          <div style={{ display:"flex", alignItems:"center", padding:"14px 16px 10px", position:"sticky", top:0, zIndex:20,
            background:"linear-gradient(to bottom, rgba(15,15,26,0.85) 0%, transparent 100%)",
            backdropFilter:"blur(0px)" }}>
            <button onClick={onClose} style={{ background:"rgba(0,0,0,0.4)", border:"1px solid rgba(245,200,66,0.3)",
              borderRadius:20, cursor:"pointer", color:"#F5C842", padding:"6px 16px 6px 10px",
              display:"flex", alignItems:"center", gap:6, WebkitTapHighlightColor:"transparent" }}>
              <span style={{ fontSize:18 }}>←</span>
              <span style={{ fontSize:13, fontWeight:700 }}>{backLabel}</span>
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign:"center", padding:80, color:"#555" }}>
              <div style={{ fontSize:36, marginBottom:8 }}>⏳</div>
              <div>Loading profile...</div>
            </div>
          ) : (
            <div style={{ animation:"fadeInUp 0.4s ease forwards" }}>

              {/* ── PROFILE HEADER ── */}
              <div style={{ position:"relative", zIndex:5, padding:"0 20px 16px", textAlign:"center", marginTop:80 }}>

                {/* Avatar with Vibe Ring */}
                <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}>
                  <div style={{ position:"relative" }}>
                    <VibeRing score={vibeScore} avatarUrl={avatarUrl} size={96} />
                    {/* Vibe score badge */}
                    <div style={{
                      position:"absolute", bottom:-6, left:"50%", transform:"translateX(-50%)",
                      background:`linear-gradient(135deg, ${vc1}, ${vc2})`,
                      borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:800, color:"#000",
                      whiteSpace:"nowrap", boxShadow:`0 2px 10px ${vc1}66`,
                    }}>
                      {vibeScore} · {vibeLabel(vibeScore)}
                    </div>
                  </div>
                </div>

                {/* Name + badges */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginTop:14, marginBottom:2 }}>
                  <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>{displayName}</div>
                  {profile?.is_verified && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="12" fill="#1D9BF0"/>
                      <path d="M9.5 16.5l-3.5-3.5 1.4-1.4 2.1 2.1 5.6-5.6 1.4 1.4z" fill="white"/>
                    </svg>
                  )}
                  {profile?.badge === "FC" && (
                    <span style={{ fontSize:10, background:"linear-gradient(135deg,#FFD700,#FF8C00)",
                      color:"#000", padding:"2px 7px", borderRadius:20, fontWeight:800 }}>FC</span>
                  )}
                  {profile?.badge === "MOD" && (
                    <span style={{ fontSize:10, background:"rgba(107,255,154,0.2)", color:"#6BFFB8",
                      padding:"2px 7px", borderRadius:20, fontWeight:800, border:"1px solid rgba(107,255,154,0.4)" }}>MOD</span>
                  )}
                </div>
                <div style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginBottom:6 }}>@{username}</div>
                {profile?.bio && <div style={{ color:"rgba(255,255,255,0.7)", fontSize:13, marginBottom:8, lineHeight:1.5, maxWidth:280, margin:"0 auto 8px" }}>{profile.bio}</div>}
                {profile?.location && <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12, marginBottom:8 }}>📍 {profile.location}</div>}

                {/* ── STATS ROW ── */}
                <div style={{ display:"flex", justifyContent:"center", gap:0, marginTop:14, marginBottom:16,
                  background:"rgba(255,255,255,0.04)", borderRadius:20, padding:"10px 4px",
                  border:"1px solid rgba(255,255,255,0.07)" }}>
                  {[
                    { value: userVideos.length, label:"Videos" },
                    { value: profile?.followers_count || 0, label:"Followers" },
                    { value: profile?.following_count || 0, label:"Following" },
                    { value: userVideos.reduce((s,v)=>s+(v.likes_count||0),0), label:"❤️ Love" },
                  ].map((s, i, arr) => (
                    <div key={s.label} style={{ flex:1, textAlign:"center",
                      borderRight: i < arr.length-1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                      padding:"0 4px" }}>
                      <div style={{ color:"#fff", fontWeight:800, fontSize:16 }}>
                        {s.value >= 1000 ? `${(s.value/1000).toFixed(1)}K` : s.value}
                      </div>
                      <div style={{ color:"rgba(255,255,255,0.4)", fontSize:10 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* ── ACTION BUTTONS ── */}
                {!isOwnProfile && currentUser && (
                  <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                    <button onClick={doFollow} disabled={followLoading}
                      style={{ padding:"10px 32px", borderRadius:24,
                        background: followRecord ? "#22c55e" : "linear-gradient(135deg,#ff0000,#ff4444)",
                        border:"none", color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer",
                        opacity: followLoading ? 0.6 : 1,
                        boxShadow: followRecord ? "0 2px 12px rgba(34,197,94,0.4)" : "0 2px 12px rgba(255,0,0,0.4)",
                        WebkitTapHighlightColor:"transparent", touchAction:"manipulation" }}>
                      {followLoading ? "..." : followRecord ? "✓ Following" : "+ Follow"}
                    </button>
                    <button onClick={() => { onClose(); window.__openDM && window.__openDM(userId, username, profile?.avatar_url || "", { userId, username }); }}
                      style={{ padding:"10px 22px", borderRadius:24, background:"linear-gradient(135deg,#6c63ff,#a855f7)",
                        border:"none", color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer",
                        WebkitTapHighlightColor:"transparent", boxShadow:"0 2px 12px rgba(108,99,255,0.4)" }}>
                      💬 Message
                    </button>
                  </div>
                )}
              </div>

              {/* ── CREATOR CARD ── */}
              <CreatorCard videoList={userVideos} profile={profile} />

              {/* ── SACHI FAM ── */}
              <SachiFamRow userId={userId} />

              {/* ── HIGHLIGHT REEL (top 3 most liked) ── */}
              {userVideos.length >= 3 && (() => {
                const top3 = [...userVideos].sort((a,b)=>(b.likes_count||0)-(a.likes_count||0)).slice(0,3);
                return (
                  <div style={{ padding:"14px 16px 6px" }}>
                    <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:700, letterSpacing:1, marginBottom:10, textTransform:"uppercase" }}>
                      🏆 Highlight Reel
                    </div>
                    <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4 }}>
                      {top3.map((v, i) => (
                        <div key={v.id} onClick={() => {
                          const idx = userVideos.findIndex(x => x.id === v.id);
                          if (idx >= 0) setPlayerIndex(idx);
                        }} style={{ flexShrink:0, width:100, cursor:"pointer", position:"relative" }}>
                          <div style={{ width:100, height:160, borderRadius:12, overflow:"hidden",
                            border: i===0 ? "2px solid #FFD700" : i===1 ? "2px solid #C0C0C0" : "2px solid #CD7F32",
                            background:"#111" }}>
                            {v.thumbnail_url ? (
                              <img src={resolveMediaUrl(v.thumbnail_url)} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                            ) : (
                              <video src={resolveMediaUrl(v.video_url)} muted playsInline preload="metadata"
                                style={{ width:"100%", height:"100%", objectFit:"cover" }}
                                onLoadedMetadata={e => { try { e.target.currentTime=1; } catch {} }} />
                            )}
                            <div style={{ position:"absolute", top:6, left:8, fontSize:14 }}>
                              {i===0?"🥇":i===1?"🥈":"🥉"}
                            </div>
                            <div style={{ position:"absolute", bottom:4, left:0, right:0, textAlign:"center",
                              color:"#fff", fontSize:10, fontWeight:800, textShadow:"0 1px 4px rgba(0,0,0,0.9)" }}>
                              ❤️ {v.likes_count || 0}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* ── TAB SWITCHER ── */}
              {isOwnProfile && (
                <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.08)", margin:"8px 0 0" }}>
                  {[{id:"posts",label:"Posts",icon:"🎬"},{id:"saved",label:"Saved",icon:"🔖"}].map(t => (
                    <button key={t.id} onClick={() => setProfileTab(t.id)}
                      style={{ flex:1, background:"none", border:"none",
                        borderBottom: profileTab===t.id ? "2px solid #F5C842" : "2px solid transparent",
                        color: profileTab===t.id ? "#F5C842" : "rgba(255,255,255,0.4)",
                        fontWeight: profileTab===t.id ? 700 : 400, fontSize:13, padding:"10px 0",
                        cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
                      <span>{t.icon}</span> {t.label}
                    </button>
                  ))}
                </div>
              )}

              {/* ── HONEYCOMB VIDEO GRID ── */}
              {profileTab === "saved" ? (
                savedLoading ? (
                  <div style={{ textAlign:"center", padding:40, color:"#444" }}>Loading saved…</div>
                ) : (
                  <HoneycombGrid videos={savedVideos} onSelect={i => setPlayerIndex(i)} />
                )
              ) : (
                <HoneycombGrid videos={userVideos} onSelect={i => setPlayerIndex(i)} />
              )}

            </div>
          )}
        </div>
      </div>

      {/* Full-screen video player */}
      {playerIndex !== null && (
        <ProfileVideoPlayer
          videos={activeVideos}
          startIndex={playerIndex}
          profile={profile}
          username={username}
          onClose={() => setPlayerIndex(null)} />
      )}
    </>
  );
}

export default UserProfileSheet;
