import React, { useEffect, useState } from "react";
import { videos, follows, likes, request } from "./api.js";

const SACHI_APP_ID = "69e79122bcc8fb5a04cfb834";

export default function CreatorDashboard({ currentUser, onGoToFeed, onOpenProfile, unreadCount, notifCount, onOpenInbox, onOpenNotifications }) {
  const [stats, setStats] = useState({ videoCount: 0, totalLikes: 0, followers: 0, following: 0 });
  const [topPosts, setTopPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [foundingCreator, setFoundingCreator] = useState(false);
  // Stat drawer state
  const [drawer, setDrawer] = useState(null); // "videos" | "likes" | "followers" | "following"
  const [drawerData, setDrawerData] = useState([]);
  const [drawerLoading, setDrawerLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    loadStats();
  }, [currentUser]);

  async function loadStats() {
    setLoading(true);
    try {
      // Load user's videos
      const userVideos = await videos.byUser(currentUser.id).catch(() => []);
      const videoArr = Array.isArray(userVideos) ? userVideos : (userVideos?.items || userVideos?.records || []);

      // Total likes across all videos
      const totalLikes = videoArr.reduce((sum, v) => sum + (v.likes_count || v.like_count || 0), 0);

      // Top 3 posts by likes
      const sorted = [...videoArr].sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
      setTopPosts(sorted.slice(0, 3));

      // Followers count
      const followersRes = await request("GET", `/apps/${SACHI_APP_ID}/entities/Follow?following_id=${currentUser.id}&limit=500`).catch(() => []);
      const followersArr = Array.isArray(followersRes) ? followersRes : (followersRes?.items || followersRes?.records || []);

      // Following count
      const followingRes = await follows.getFollowing(currentUser.id, currentUser.username || currentUser.email?.split("@")[0]).catch(() => []);
      const followingArr = Array.isArray(followingRes) ? followingRes : (followingRes?.items || followingRes?.records || []);

      // Founding creator badge
      const sachiUserRes = await request("GET", `/apps/${SACHI_APP_ID}/entities/SachiUser?email=${encodeURIComponent(currentUser.email)}&limit=2`).catch(() => []);
      const sachiUsers = Array.isArray(sachiUserRes) ? sachiUserRes : (sachiUserRes?.items || sachiUserRes?.records || []);
      const sachiUser = sachiUsers.find(u => u.email === currentUser.email);
      if (sachiUser?.badge === "FC") setFoundingCreator(true);

      setStats({
        videoCount: videoArr.length,
        totalLikes,
        followers: followersArr.length,
        following: followingArr.length,
      });
    } catch (e) {
      console.warn("[CreatorDashboard] loadStats error", e);
    } finally {
      setLoading(false);
    }
  }

  async function openDrawer(type) {
    setDrawer(type);
    setDrawerData([]);
    setDrawerLoading(true);
    try {
      if (type === "videos") {
        const res = await videos.byUser(currentUser.id).catch(() => []);
        const arr = Array.isArray(res) ? res : (res?.items || res?.records || []);
        setDrawerData(arr.sort((a,b) => (b.likes_count||0)-(a.likes_count||0)));
      } else if (type === "likes") {
        // Load people who liked YOUR videos
        // Step 1: Get your videos
        const vRes = await videos.byUser(currentUser.id).catch(() => []);
        const myVideos = Array.isArray(vRes) ? vRes : (vRes?.items || vRes?.records || []);
        const myVideoIds = myVideos.map(v => v.id).filter(Boolean);
        // Step 2: Fetch SachiLike records for each of your videos
        const likerMap = new Map(); // keyed by liker username to deduplicate
        await Promise.all(
          myVideoIds.map(vid =>
            request("GET", `/apps/${SACHI_APP_ID}/entities/SachiLike?video_id=${vid}&limit=200`)
              .then(res => {
                const arr = Array.isArray(res) ? res : (res?.items || res?.records || []);
                arr.forEach(r => {
                  const key = r.username || r.user_id;
                  if (key && !likerMap.has(key)) likerMap.set(key, r);
                });
              })
              .catch(() => {})
          )
        );
        // Remove yourself from the list
        const myUsername = currentUser.username || currentUser.email?.split("@")[0];
        likerMap.delete(myUsername);
        likerMap.delete(currentUser.id);
        setDrawerData([...likerMap.values()]);
      } else if (type === "followers") {
        const res = await follows.getFollowers(currentUser.id).catch(() => []);
        const arr = Array.isArray(res) ? res : (res?.items || res?.records || []);
        setDrawerData(arr);
      } else if (type === "following") {
        const res = await follows.getFollowing(currentUser.id, currentUser.username || currentUser.email?.split("@")[0]).catch(() => []);
        const arr = Array.isArray(res) ? res : (res?.items || res?.records || []);
        setDrawerData(arr);
      }
    } catch(e) {
      console.warn("[CreatorDashboard] drawer load error", e);
    } finally {
      setDrawerLoading(false);
    }
  }

  const username = currentUser?.username || currentUser?.email?.split("@")[0] || "You";
  const avatarUrl = currentUser?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=1a1b2e&color=F5C842&size=128&bold=true&format=png`;

  function fmtCount(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    return String(n);
  }

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#0B0C1A",
      color: "#fff",
      fontFamily: "'Inter', sans-serif",
      paddingBottom: 90,
      overflowY: "auto",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "calc(env(safe-area-inset-top, 0px) + 14px) 20px 10px",
        position: "sticky",
        top: 0,
        background: "#0B0C1A",
        zIndex: 10,
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src="/sachi-logo-new.png" alt="Sachi" style={{ width: 32, height: 32, borderRadius: 0, objectFit: "contain", filter: "drop-shadow(0 0 6px rgba(232,64,12,0.5))" }} />
          <div style={{ display: "flex", alignItems: "baseline", gap: 1 }}>
            <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5, background: "linear-gradient(135deg,#F5C842,#FF9500)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Sachi</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#F5C842", lineHeight: 1, marginBottom: 2 }}>™</span>
          </div>
        </div>
        {/* Notification + Inbox icons */}
        <div style={{ display: "flex", gap: 16 }}>
          {/* Inbox */}
          <button onClick={onOpenInbox} style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: 4 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={unreadCount > 0 ? "#F5C842" : "#4A4A6A"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {unreadCount > 0 && (
              <span style={{ position: "absolute", top: 0, right: 0, background: "#F5C842", color: "#0B0C1A", borderRadius: "50%", fontSize: 9, fontWeight: 800, width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          {/* Notifications */}
          <button onClick={onOpenNotifications} style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: 4 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={notifCount > 0 ? "#F5C842" : "#4A4A6A"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {notifCount > 0 && (
              <span style={{ position: "absolute", top: 0, right: 0, background: "#FF4444", color: "#fff", borderRadius: "50%", fontSize: 9, fontWeight: 800, width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {notifCount > 9 ? "9+" : notifCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Profile Section */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 20px 12px" }}>
        <div style={{ position: "relative", marginBottom: 12 }}>
          <div style={{
            width: 88, height: 88, borderRadius: "50%",
            background: "linear-gradient(135deg, #F5C842, #FF8C00)",
            padding: 3,
          }}>
            <img
              src={avatarUrl}
              alt={username}
              style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" }}
            />
          </div>
          {/* Online dot */}
          <div style={{ position: "absolute", bottom: 4, right: 4, width: 14, height: 14, background: "#22C55E", borderRadius: "50%", border: "2px solid #0B0C1A" }} />
        </div>

        <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>@{username}</div>

        {foundingCreator && (
          <div style={{
            background: "rgba(245,200,66,0.15)",
            border: "1px solid rgba(245,200,66,0.4)",
            color: "#F5C842",
            fontSize: 11,
            fontWeight: 700,
            borderRadius: 20,
            padding: "3px 12px",
            marginBottom: 8,
            letterSpacing: 0.5,
          }}>
            ✨ Founding Creator
          </div>
        )}

        {currentUser?.bio && (
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textAlign: "center", maxWidth: 260, lineHeight: 1.5 }}>
            {currentUser.bio}
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, padding: "0 16px 20px" }}>
        {[
          { label: "Videos", value: fmtCount(stats.videoCount), type: "videos" },
          { label: "Likes", value: fmtCount(stats.totalLikes), type: "likes" },
          { label: "Followers", value: fmtCount(stats.followers), type: "followers" },
          { label: "Following", value: fmtCount(stats.following), type: "following" },
        ].map(s => (
          <div key={s.label} onClick={() => openDrawer(s.type)} style={{
            background: "#141528",
            border: "1px solid rgba(245,200,66,0.15)",
            borderRadius: 12,
            padding: "12px 6px",
            textAlign: "center",
            cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
            transition: "border-color 0.15s",
            active: { borderColor: "rgba(245,200,66,0.5)" },
          }}>
            {loading ? (
              <div style={{ height: 24, background: "rgba(255,255,255,0.08)", borderRadius: 6, marginBottom: 4 }} />
            ) : (
              <div style={{ fontWeight: 800, fontSize: 18, color: "#fff", lineHeight: 1 }}>{s.value}</div>
            )}
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 4, letterSpacing: 0.3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Top Posts */}
      {topPosts.length > 0 && (
        <div style={{ padding: "0 16px 24px" }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            🔥 <span>Your Top Posts</span>
          </div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
            {topPosts.map((v, i) => (
              <div key={v.id} style={{
                position: "relative",
                minWidth: 110,
                height: 160,
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid rgba(245,200,66,0.2)",
                flexShrink: 0,
              }}>
                <img
                  src={v.thumbnail_url || v.cover_image || `https://ui-avatars.com/api/?name=${i+1}&background=1a1b2e&color=F5C842&size=128`}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {/* Gradient overlay */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />
                {/* Like count */}
                <div style={{ position: "absolute", bottom: 8, left: 8, display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: "#fff" }}>
                  <span style={{ color: "#F5C842" }}>❤️</span>
                  {fmtCount(v.likes_count || v.like_count || 0)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 16px 24px" }} />

      {/* Main Action Buttons */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Following */}
        <button
          onClick={() => onGoToFeed("following")}
          style={{
            width: "100%",
            background: "#141528",
            border: "1.5px solid rgba(245,200,66,0.5)",
            borderRadius: 16,
            padding: "18px 20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 14,
            textAlign: "left",
            boxShadow: "0 0 20px rgba(245,200,66,0.08)",
          }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "rgba(245,200,66,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, flexShrink: 0,
          }}>👥</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#fff", marginBottom: 2 }}>Following</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Videos from people you follow</div>
          </div>
          <div style={{ marginLeft: "auto", color: "rgba(245,200,66,0.6)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </button>

        {/* For You */}
        <button
          onClick={() => onGoToFeed("forYou")}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #F5C842 0%, #FF8C00 100%)",
            border: "none",
            borderRadius: 16,
            padding: "18px 20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 14,
            textAlign: "left",
            boxShadow: "0 4px 24px rgba(245,200,66,0.3)",
          }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "rgba(0,0,0,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, flexShrink: 0,
          }}>🔥</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#0B0C1A", marginBottom: 2 }}>For You</div>
            <div style={{ fontSize: 12, color: "rgba(11,12,26,0.6)" }}>Discover everyone on Sachi</div>
          </div>
          <div style={{ marginLeft: "auto", color: "rgba(11,12,26,0.5)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </button>
      </div>
      {/* ── Stat Drawer ─────────────────────────────────────── */}
      {drawer && (
        <div
          onClick={() => setDrawer(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 400,
            display: "flex", alignItems: "flex-end",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 480, margin: "0 auto",
              background: "#141528",
              borderRadius: "20px 20px 0 0",
              maxHeight: "72dvh",
              display: "flex", flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Drawer header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <span style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>
                { drawer === "videos" ? "🎬 My Videos"
                : drawer === "likes" ? "❤️ People Who Liked You"
                : drawer === "followers" ? "👥 Followers"
                : "👣 Following" }
              </span>
              <button onClick={() => setDrawer(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: 22, lineHeight: 1, padding: 0 }}>×</button>
            </div>

            {/* Drawer body */}
            <div style={{ overflowY: "auto", flex: 1, padding: "8px 0 20px" }}>
              {drawerLoading ? (
                <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: "40px 0", fontSize: 14 }}>Loading…</div>
              ) : drawerData.length === 0 ? (
                <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: "40px 0", fontSize: 14 }}>
                  { drawer === "followers" ? "No followers yet" : drawer === "following" ? "Not following anyone yet" : drawer === "likes" ? "No likes yet" : "No videos yet" }
                </div>
              ) : (drawer === "followers" || drawer === "following" || drawer === "likes") ? (
                // People list
                drawerData.map((r, i) => {
                  const name = drawer === "followers"
                    ? (r.follower_username || r.follower_id || "Unknown")
                    : drawer === "following"
                    ? (r.following_username || r.following_id || "Unknown")
                    : (r.username || r.user_id || "Unknown");
                  const userId = drawer === "followers"
                    ? (r.follower_id || r.follower_username)
                    : drawer === "following"
                    ? (r.following_id || r.following_username)
                    : (r.user_id || r.username);
                  const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a1b2e&color=F5C842&size=64&bold=true&format=png`;
                  return (
                    <div key={r.id || i}
                      onClick={() => {
                        setDrawer(null);
                        if (onOpenProfile) onOpenProfile(userId, name);
                      }}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <img src={r.follower_avatar || r.following_avatar || r.avatar_url || avatarFallback} alt={name}
                        style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", background: "#0B0C1A" }}
                        onError={e => { e.target.src = avatarFallback; }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>@{name}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Tap to view profile</div>
                      </div>
                      <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 18 }}>›</span>
                    </div>
                  );
                })
              ) : (
                // Video grid (videos + liked videos)
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, padding: "0 2px" }}>
                  {drawerData.map((r, i) => {
                    const thumb = r.thumbnail_url || r.cover_image || null;
                    const likeCount = r.likes_count || r.like_count || 0;
                    return (
                      <div key={r.id || i} style={{ position: "relative", aspectRatio: "9/16", overflow: "hidden", background: "#141528", borderRadius: 4 }}>
                        {thumb ? (
                          <img src={thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={e => { e.target.style.display = "none"; }}
                          />
                        ) : (
                          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#1a1b2e,#0B0C1A)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(245,200,66,0.3)" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                          </div>
                        )}
                        <div style={{ position: "absolute", bottom: 4, left: 4, fontSize: 11, fontWeight: 700, color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.8)", display: "flex", alignItems: "center", gap: 2 }}>
                          <span>❤️</span> {likeCount}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}