// ⛔ LOCKED — UserProfileSheet.jsx
// DO NOT MODIFY unless fixing a UserProfileSheet-specific bug.
// Last verified working: 2026-05-24 (added Saved tab)

import React, { useState, useEffect } from "react";
import { videos, follows, bookmarks, blocks, request } from "./api.js";
import { resolveMediaUrl } from "./utils.jsx";
import ProfileVideoPlayer from "./ProfileVideoPlayer.jsx";
import AvatarPickerModal from "./AvatarPickerModal.jsx";

function UserProfileSheet({ userId, username, currentUser, onClose }) {
  const [profile, setProfile] = React.useState(null);
  const [userVideos, setUserVideos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [followRecord, setFollowRecord] = React.useState(null);
  const [followLoading, setFollowLoading] = React.useState(false);
  const [playerIndex, setPlayerIndex] = React.useState(null);
  const [profileTab, setProfileTab] = React.useState("posts"); // "posts" | "saved"
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
      // fetch each video
      const fetched = await Promise.all(
        videoIds.map(id =>
          request("GET", `/apps/69e79122bcc8fb5a04cfb834/entities/SachiVideo/${id}`).catch(() => null)
        )
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
      request("GET", `/apps/69e79122bcc8fb5a04cfb834/entities/AthaVidUser?limit=200`).catch(() => null),
      videos.byUser(userId).catch(() => []),
      // Live follower count: how many people follow this profile
      request("GET", `/apps/69e79122bcc8fb5a04cfb834/entities/Follow?following_id=${userId}&limit=500`).catch(() => null),
      // Live following count: how many people this profile follows
      request("GET", `/apps/69e79122bcc8fb5a04cfb834/entities/Follow?follower_id=${userId}&limit=500`).catch(() => null),
    ]).then(([userRes, vids, followersRes, followingRes]) => {
      const allUsers = userRes?.items || userRes || [];
      const u = allUsers.find(x => x.id === userId || x.created_by === userId) || null;
      const liveFollowers = (followersRes?.items || followersRes || []).length;
      const liveFollowing = (followingRes?.items || followingRes || []).length;
      setProfile(u ? { ...u, followers_count: liveFollowers, following_count: liveFollowing } : { followers_count: liveFollowers, following_count: liveFollowing });
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
        const rec = await follows.follow(
          currentUser.id,
          currentUser.username || currentUser.email?.split("@")[0],
          userId,
          username
        );
        setFollowRecord(rec);
        setProfile(p => p ? { ...p, followers_count: (p.followers_count || 0) + 1 } : p);
      }
      // Refresh live following count for the current user's Me tab too
      try {
        const myFollowingRes = await request("GET", `/apps/69e79122bcc8fb5a04cfb834/entities/Follow?follower_id=${currentUser.id}&limit=500`);
        const myFollowingCount = (myFollowingRes?.items || myFollowingRes || []).length;
        setProfile(p => p ? { ...p } : p); // trigger re-render if needed
        // store for Me tab
        localStorage.setItem(`sachi_following_count_${currentUser.id}`, myFollowingCount);
      } catch(e) {}
    } catch(e) { console.error(e); }
    setFollowLoading(false);
  };

  const displayName = profile?.display_name || username || "User";
  const avatarUrl = profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`;

  return (
    <>
      <div style={{ position:"fixed", inset:0, zIndex:4000, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
        {/* Backdrop */}
        <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.75)" }} />

        {/* Sheet */}
        <div style={{ position:"relative", background:"#0f0f1a", borderRadius:"24px 24px 0 0",
          width:"100%", maxWidth:480, maxHeight:"88vh", display:"flex", flexDirection:"column",
          zIndex:4001, overflow:"hidden" }}>

          {/* Handle */}
          <div style={{ width:40, height:4, background:"#333", borderRadius:99, margin:"14px auto 0", flexShrink:0 }} />

          {/* Close */}
          <button onClick={onClose} style={{ position:"absolute", top:12, right:16, background:"none", border:"none",
            color:"#888", fontSize:22, cursor:"pointer", zIndex:1 }}>✕</button>

          {loading ? (
            <div style={{ textAlign:"center", padding:60, color:"#555" }}>
              <div style={{ fontSize:36, marginBottom:8 }}>⏳</div>
              <div>Loading profile...</div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ padding:"16px 20px 20px", textAlign:"center", borderBottom:"1px solid rgba(255,255,255,0.06)", flexShrink:0 }}>
                <img src={avatarUrl}
                  style={{ width:80, height:80, borderRadius:"50%", border:"3px solid #ff6b6b", marginBottom:10, background:"#1a1a2e" }} />
                <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>{displayName}</div>
                <div style={{ color:"#666", fontSize:13, marginBottom:4 }}>@{username}</div>
                {profile?.bio && <div style={{ color:"#aaa", fontSize:13, marginBottom:8, lineHeight:1.5 }}>{profile.bio}</div>}
                {profile?.location && <div style={{ color:"#666", fontSize:12, marginBottom:8 }}>📍 {profile.location}</div>}

                {/* Stats */}
                <div style={{ display:"flex", justifyContent:"center", gap:28, marginTop:12, marginBottom:14 }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>{userVideos.length}</div>
                    <div style={{ color:"#666", fontSize:11 }}>Videos</div>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>{profile?.followers_count || 0}</div>
                    <div style={{ color:"#666", fontSize:11 }}>Followers</div>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>{profile?.following_count || 0}</div>
                    <div style={{ color:"#666", fontSize:11 }}>Following</div>
                  </div>
                </div>

                {!isOwnProfile && currentUser && (
                  <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                    <button onClick={doFollow} disabled={followLoading}
                      style={{ padding:"10px 32px", borderRadius:24,
                        background: followRecord ? "#22c55e" : "#ff0000",
                        border: "none",
                        color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer",
                        opacity: followLoading ? 0.6 : 1,
                        boxShadow: followRecord ? "0 2px 12px rgba(34,197,94,0.5)" : "0 2px 12px rgba(255,0,0,0.4)",
                        transition:"background 0.25s, box-shadow 0.25s",
                        WebkitTapHighlightColor:"transparent", touchAction:"manipulation" }}>
                      {followLoading ? "..." : followRecord ? "✓ Following" : "+ Follow"}
                    </button>
                    <button onClick={() => { onClose(); window.__openDM && window.__openDM(userId, username, profile?.avatar_url || ""); }}
                      style={{ padding:"10px 22px", borderRadius:24, background:"linear-gradient(135deg,#6c63ff,#a855f7)", border:"none",
                        color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer", WebkitTapHighlightColor:"transparent",
                        boxShadow:"0 2px 12px rgba(108,99,255,0.4)" }}>
                      💬 Send Message
                    </button>
                  </div>
                )}
              </div>

              {/* Tab switcher — only on own profile */}
              {isOwnProfile && (
                <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.08)", marginBottom:2 }}>
                  {[{id:"posts",label:"Posts",icon:"🎬"},{id:"saved",label:"Saved",icon:"🔖"}].map(t => (
                    <button key={t.id} onClick={() => setProfileTab(t.id)}
                      style={{ flex:1, background:"none", border:"none", borderBottom: profileTab===t.id ? "2px solid #F5C842" : "2px solid transparent",
                        color: profileTab===t.id ? "#F5C842" : "rgba(255,255,255,0.4)", fontWeight: profileTab===t.id ? 700 : 400,
                        fontSize:13, padding:"10px 0", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
                      <span>{t.icon}</span> {t.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Video Grid */}
              <div style={{ overflowY:"auto", flex:1, padding:2 }}>
                {profileTab === "saved" ? (
                  savedLoading ? (
                    <div style={{ textAlign:"center", padding:40, color:"#444" }}>Loading saved…</div>
                  ) : savedVideos.length === 0 ? (
                    <div style={{ textAlign:"center", padding:40, color:"#444" }}>
                      <div style={{ fontSize:36, marginBottom:8 }}>🔖</div>
                      <div style={{ color:"rgba(255,255,255,0.4)", fontSize:14 }}>No saved posts yet</div>
                    </div>
                  ) : (
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:2 }}>
                      {savedVideos.map((v, i) => (
                        <div key={v.id} onClick={() => { setPlayerIndex(i); }}
                          style={{ position:"relative", aspectRatio:"1/1", background:"#111", overflow:"hidden", cursor:"pointer" }}>
                          {v.thumbnail_url ? (
                            <img src={resolveMediaUrl(v.thumbnail_url)} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                          ) : (
                            <video src={resolveMediaUrl(v.video_url)} style={{ width:"100%", height:"100%", objectFit:"cover" }} muted playsInline preload="metadata"
                              onLoadedMetadata={e => { try { e.target.currentTime = 1; } catch {} }} />
                          )}
                          {!v.is_photo && (
                            <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                              <div style={{ fontSize:22, opacity:0.8 }}>▶</div>
                            </div>
                          )}
                          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }} />
                          <div style={{ position:"absolute", bottom:4, left:4, color:"#fff", fontSize:10, fontWeight:700, display:"flex", gap:6 }}>
                            <span>❤️ {v.likes_count || 0}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : userVideos.length === 0 ? (
                  <div style={{ textAlign:"center", padding:40, color:"#444" }}>
                    <div style={{ fontSize:36, marginBottom:8 }}>🎬</div>
                    <div>No videos yet</div>
                  </div>
                ) : (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:2 }}>
                    {userVideos.map((v, i) => (
                      <div key={v.id} onClick={() => setPlayerIndex(i)}
                        style={{ position:"relative", aspectRatio:"1/1", background:"#111", overflow:"hidden", cursor:"pointer" }}>
                        {v.thumbnail_url ? (
                          <img src={resolveMediaUrl(v.thumbnail_url)} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        ) : (
                          <video src={resolveMediaUrl(v.video_url)} style={{ width:"100%", height:"100%", objectFit:"cover" }} muted playsInline preload="metadata"
                            onLoadedMetadata={e => { try { e.target.currentTime = 1; } catch {} }} />
                        )}
                        {/* Play icon overlay — videos only */}
                        {!v.is_photo && (
                        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <div style={{ fontSize:22, opacity:0.8 }}>▶</div>
                        </div>
                        )}
                        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }} />
                        <div style={{ position:"absolute", bottom:4, left:4, color:"#fff", fontSize:10, fontWeight:700, display:"flex", gap:6 }}>
                          <span>❤️ {v.likes_count || 0}</span>
                          <span>👁 {v.views_count || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Full screen TikTok-style player — uses saved or posts list depending on active tab */}
      {playerIndex !== null && (
        <ProfileVideoPlayer
          videos={profileTab === "saved" ? savedVideos : userVideos}
          startIndex={playerIndex}
          profile={profile}
          username={username}
          onClose={() => setPlayerIndex(null)} />
      )}
    </>
  );
}

// ─── VideoManageGrid ────────────────────────────────────────────────────────

export default UserProfileSheet;
