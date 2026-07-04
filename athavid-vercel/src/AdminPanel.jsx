// ⛔ LOCKED — AdminPanel.jsx
// DO NOT MODIFY unless fixing a AdminPanel-specific bug.
// Last verified working: 2026-05-23

import React, { useState, useEffect } from "react";
import { videos, request } from "./api.js";
import { resolveMediaUrl } from "./utils.jsx";

function AdminPanel({ currentUser }) {
  const [modTab, setModTab] = useState("videos"); // videos | ai | analytics
  const [allVideos, setAllVideos] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsError, setAnalyticsError] = useState(null);
  const [saving, setSaving] = useState(null);
  const [filter, setFilter] = useState("all"); // all | mature | clean
  const [search, setSearch] = useState("");

  const loadVideos = async () => {
    setLoading(true);
    try {
      const res = await request("GET", "/apps/69e79122bcc8fb5a04cfb834/entities/SachiVideo?limit=500&sort=-created_date");
      const all = res.items || res || [];
      // Filter out archived posts — they're gone, don't show them in Mod
      setAllVideos(all.filter(v => !v.is_archived));
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const loadAnalytics = async () => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    try {
      // ⛔ LOCKED — uses /api/admin-users (service token) to bypass RLS for user list
      const [usersResp, videosResp] = await Promise.all([
        fetch("/api/admin-users").then(r => r.json()),
        request("GET", "/apps/69e79122bcc8fb5a04cfb834/entities/SachiVideo?limit=500&sort=-created_date")
      ]);
      const users = usersResp?.items || [];
      const videos = Array.isArray(videosResp) ? videosResp : (videosResp?.items || videosResp?.records || []);
      setAllUsers(users);

      // ── Compute all fields the UI needs ──
      const today = new Date();
      const todayStr = today.toISOString().slice(0,10);
      const weekAgo = new Date(); weekAgo.setDate(today.getDate()-7);

      const newToday = users.filter(u => (u.created_date||"").slice(0,10) === todayStr).length;
      const newThisWeek = users.filter(u => new Date(u.created_date) >= weekAgo).length;

      const totalViews    = videos.reduce((s,v) => s + (v.views_count||0), 0);
      const totalLikes    = videos.reduce((s,v) => s + (v.likes_count||0), 0);
      const totalComments = videos.reduce((s,v) => s + (v.comments_count||0), 0);
      const matureCount   = videos.filter(v => v.is_mature).length;

      // Daily videos — last 14 days
      const dailyVideos = Array.from({length:14}, (_,i) => {
        const d = new Date(); d.setDate(today.getDate() - (13-i));
        const ds = d.toISOString().slice(0,10);
        return { date: ds, count: videos.filter(v => (v.created_date||"").slice(0,10) === ds).length };
      });

      // Daily users — last 14 days
      const dailyUsers = Array.from({length:14}, (_,i) => {
        const d = new Date(); d.setDate(today.getDate() - (13-i));
        const ds = d.toISOString().slice(0,10);
        return { date: ds, count: users.filter(u => (u.created_date||"").slice(0,10) === ds).length };
      });

      // Top creators by video count
      const creatorMap = {};
      videos.forEach(v => {
        const uname = v.username || v.created_by || "unknown";
        creatorMap[uname] = (creatorMap[uname]||0) + 1;
      });
      const topCreators = Object.entries(creatorMap)
        .sort((a,b) => b[1]-a[1]).slice(0,10)
        .map(([username,count]) => ({ username, count }));

      // Top videos by views
      const topVideos = [...videos].sort((a,b) => (b.views_count||0)-(a.views_count||0)).slice(0,10);

      setAnalyticsData({
        totalUsers: users.length,
        totalVideos: videos.length,
        totalViews,
        totalLikes,
        totalComments,
        matureCount,
        newToday,
        newThisWeek,
        recentUsers: [...users].sort((a,b) => new Date(b.created_date) - new Date(a.created_date)).slice(0,50),
        dailyVideos,
        dailyUsers,
        topCreators,
        topVideos,
      });
    } catch(e) {
      console.error("analytics error", e);
      setAnalyticsError(e.message || "Failed to load analytics");
    }
    setAnalyticsLoading(false);
  };

  useEffect(() => { loadVideos(); }, []);
  useEffect(() => { loadAnalytics(); }, []); // load on mount
  useEffect(() => { if (modTab === "analytics") loadAnalytics(); }, [modTab]);
  useEffect(() => { if (modTab === "users") loadRegisteredUsers(); }, [modTab]);

  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [lastSeenMap, setLastSeenMap] = useState({}); // username -> last session_start ISO string

  // ── Founding Creators state ──
  const [founders, setFounders] = useState([]);
  const [foundersLoading, setFoundersLoading] = useState(false);
  const [selectedFounder, setSelectedFounder] = useState(null);
  const [founderNote, setFounderNote] = useState("");

  const loadFounders = async () => {
    setFoundersLoading(true);
    try {
      const res = await request("GET", "/apps/69e79122bcc8fb5a04cfb834/entities/FoundingCreator?sort=-created_date&limit=100");
      setFounders(res.items || res || []);
    } catch(e) { console.error(e); }
    setFoundersLoading(false);
  };

  useEffect(() => { if (modTab === "founders") loadFounders(); }, [modTab]);

  // ── Referrals state ──
  const [referrals, setReferrals] = useState([]);
  const [invites, setInvites] = useState([]);
  const [refLoading, setRefLoading] = useState(false);

  const loadReferrals = async () => {
    setRefLoading(true);
    try {
      const [refRes, invRes] = await Promise.all([
        request("GET", "/apps/69e79122bcc8fb5a04cfb834/entities/SachiReferral?limit=500&sort=-created_date"),
        request("GET", "/apps/69e79122bcc8fb5a04cfb834/entities/SachiInvite?limit=500"),
      ]);
      setReferrals(Array.isArray(refRes) ? refRes : (refRes?.items || refRes?.records || []));
      setInvites(Array.isArray(invRes) ? invRes : (invRes?.items || invRes?.records || []));
    } catch(e) { console.error("Referral load error:", e); }
    setRefLoading(false);
  };

  useEffect(() => { if (modTab === "referrals") loadReferrals(); }, [modTab]);

  const updateFounderStatus = async (founder, status) => {
    try {
      await request("PUT", `/apps/69e79122bcc8fb5a04cfb834/entities/FoundingCreator/${founder.id}`, { status, notes: founderNote || founder.notes });
      setFounders(prev => prev.map(f => f.id === founder.id ? { ...f, status, notes: founderNote || f.notes } : f));
      setSelectedFounder(null);
      setFounderNote("");
    } catch(e) { alert("Failed: " + e.message); }
  };

  // ⛔ LOCKED — loadRegisteredUsers uses /api/admin-users (service token) to bypass RLS
  // Do NOT revert to request("GET", entities/SachiUser) — that only returns Jay's own record
  const loadRegisteredUsers = async () => {
    setUsersLoading(true);
    try {
      const [usersResp, sessionsResp] = await Promise.all([
        fetch("/api/admin-users").then(r => r.json()),
        fetch("/api/admin-sessions").then(r => r.json()).catch(() => ({ items: [] }))
      ]);
      const users = usersResp?.items || [];
      setRegisteredUsers(users);

      // Build lastSeenMap: username -> most recent session_start
      const sessions = sessionsResp?.items || [];
      const map = {};
      sessions.forEach(s => {
        if (!s.username) return;
        const key = s.username.toLowerCase();
        const ts = s.session_start || s.created_date;
        if (!map[key] || ts > map[key]) map[key] = ts;
      });
      setLastSeenMap(map);
    } catch(e) { console.error("loadRegisteredUsers error", e); }
    setUsersLoading(false);
  };

  const toggleMature = async (video, reason) => {
    setSaving(video.id);
    try {
      const newMature = !video.is_mature;
      await request("PUT", `/apps/69e79122bcc8fb5a04cfb834/entities/SachiVideo/${video.id}`, {
        is_mature: newMature,
        mature_reason: newMature ? (reason || "other") : null,
      });
      setAllVideos(prev => prev.map(v => v.id === video.id ? { ...v, is_mature: newMature, mature_reason: newMature ? (reason || "other") : null } : v));
    } catch(e) { alert("Failed to update: " + e.message); }
    setSaving(null);
  };

  const deleteVideo = async (video) => {
    if (!window.confirm(`Delete "${video.caption || "this video"}"? This cannot be undone.`)) return;
    setSaving(video.id);
    try {
      await request("DELETE", `/apps/69e79122bcc8fb5a04cfb834/entities/SachiVideo/${video.id}`);
    } catch(e) {
      // 404 = already deleted — still remove from UI
      if (!e.message?.includes("not found") && !e.message?.includes("404")) {
        alert("Failed to delete: " + e.message);
        setSaving(null);
        return;
      }
    }
    // Remove from UI regardless — deleted or already gone
    setAllVideos(prev => prev.filter(v => v.id !== video.id));
    setSaving(null);
  };

  const flagAI = async (video) => {
    setSaving(video.id);
    try {
      const newFlag = !video.is_ai_detected;
      await request("PUT", `/apps/69e79122bcc8fb5a04cfb834/entities/SachiVideo/${video.id}`, { is_ai_detected: newFlag });
      setAllVideos(prev => prev.map(v => v.id === video.id ? { ...v, is_ai_detected: newFlag } : v));
    } catch(e) { alert("Failed to update: " + e.message); }
    setSaving(null);
  };

  const filtered = allVideos.filter(v => {
    if (filter === "mature" && !v.is_mature) return false;
    if (filter === "clean" && v.is_mature) return false;
    if (search && !((v.caption||"").toLowerCase().includes(search.toLowerCase()) || (v.username||"").toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const reasons = ["violence","fighting","adult_themes","strong_language","other"];

  return (
    <div style={{ minHeight:"100svh", background:"#0B0C1A", paddingBottom:120, paddingTop:0 }}>
      {/* Header */}
      <div style={{ background:"rgba(14,14,28,0.98)", borderBottom:"1px solid rgba(245,200,66,0.15)", padding:"16px 20px 10px", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <div style={{ color:"#F5C842", fontWeight:900, fontSize:20 }}>🛡️ Mod Panel</div>
          <button onClick={() => modTab==="analytics" ? loadAnalytics() : modTab==="users" ? loadRegisteredUsers() : modTab==="founders" ? loadFounders() : loadVideos()}
            style={{ background:"rgba(255,255,255,0.07)", border:"none", borderRadius:20, padding:"7px 14px", color:"#888", fontWeight:700, fontSize:12, cursor:"pointer" }}>
            ↻ Refresh
          </button>
        </div>
        {/* Tab switcher */}
        <div style={{ display:"flex", gap:6, marginBottom: modTab==="videos" ? 10 : 0 }}>
          {[["videos","🎬 Videos"],["ai","🤖 AI Flagged"],["users","👥 Users"],["founders","🌟 Creators"],["referrals","🎁 Referrals"],["analytics","📊 Analytics"]].map(([val,label]) => (
            <button key={val} onClick={() => setModTab(val)}
              style={{ padding:"8px 18px", borderRadius:20, border:"none", cursor:"pointer", fontSize:13, fontWeight:700,
                background: modTab===val ? "linear-gradient(135deg,#F5C842,#FF9500)" : "rgba(255,255,255,0.07)",
                color: modTab===val ? "#0B0C1A" : "#888", transition:"all 0.2s" }}>
              {label}
            </button>
          ))}
        </div>
        {/* Search + filter — only on videos tab */}
        {modTab === "videos" && (<>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by caption or username…"
            style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"10px 14px", color:"#fff", fontSize:14, outline:"none", marginBottom:10 }} />
          <div style={{ display:"flex", gap:8 }}>
            {[["all","All"],["mature","🔞 Mature"],["clean","✅ Clean"]].map(([val,label]) => (
              <button key={val} onClick={() => setFilter(val)}
                style={{ padding:"6px 14px", borderRadius:20, border:"none", cursor:"pointer", fontSize:12, fontWeight:700,
                  background: filter===val ? "linear-gradient(135deg,#F5C842,#FF9500)" : "rgba(255,255,255,0.07)",
                  color: filter===val ? "#0B0C1A" : "#888" }}>
                {label}
              </button>
            ))}
          </div>
        </>)}
      </div>

      {/* ── ANALYTICS TAB ── */}
      {modTab === "analytics" && (
        <div style={{ padding:"16px 16px 20px" }}>
          {analyticsLoading ? (
            <div style={{ textAlign:"center", color:"#555", padding:60, fontSize:14 }}>Loading analytics…</div>
          ) : analyticsError ? (
            <div style={{ textAlign:"center", color:"#FF6B6B", padding:40, fontSize:13 }}>⚠️ {analyticsError}<br/><button onClick={loadAnalytics} style={{ marginTop:12, background:"#F5C842", color:"#0B0C1A", border:"none", borderRadius:8, padding:"8px 20px", fontWeight:700, cursor:"pointer" }}>Retry</button></div>
          ) : !analyticsData ? (
            <div style={{ textAlign:"center", color:"#555", padding:60, fontSize:14 }}>No data yet.</div>
          ) : (
            <>
              {/* KPI Cards */}
              {(() => {
                const engRate = analyticsData.totalViews > 0
                  ? (((analyticsData.totalLikes + analyticsData.totalComments) / analyticsData.totalViews) * 100).toFixed(1)
                  : "0.0";
                const avgViews = analyticsData.totalVideos > 0
                  ? Math.round(analyticsData.totalViews / analyticsData.totalVideos)
                  : 0;
                const activeCreators = analyticsData.topCreators ? analyticsData.topCreators.length : 0;
                return (
                  <>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:10 }}>
                      {[
                        ["👥","Users",analyticsData.totalUsers,"#6B8AFF"],
                        ["🎬","Videos",analyticsData.totalVideos,"#F5C842"],
                        ["👁","Views",analyticsData.totalViews.toLocaleString(),"#6BFFB8"],
                        ["❤️","Likes",analyticsData.totalLikes,"#FF9500"],
                        ["💬","Comments",analyticsData.totalComments,"#FF6B6B"],
                        ["🔞","Mature",analyticsData.matureCount,"#FF6B6B"],
                      ].map(([icon,label,val,color]) => (
                        <div key={label} style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:"12px 10px", textAlign:"center", border:`1px solid ${color}22` }}>
                          <div style={{ fontSize:18, marginBottom:3 }}>{icon}</div>
                          <div style={{ color, fontWeight:900, fontSize:18, lineHeight:1 }}>{typeof val === "number" ? val.toLocaleString() : val}</div>
                          <div style={{ color:"#555", fontSize:10, marginTop:3 }}>{label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:20 }}>
                      {[
                        ["📊","Eng. Rate",`${engRate}%`,"#A78BFA"],
                        ["🎯","Avg Views",avgViews,"#34D399"],
                        ["🎨","Creators",activeCreators,"#F472B6"],
                      ].map(([icon,label,val,color]) => (
                        <div key={label} style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:"12px 10px", textAlign:"center", border:`1px solid ${color}22` }}>
                          <div style={{ fontSize:18, marginBottom:3 }}>{icon}</div>
                          <div style={{ color, fontWeight:900, fontSize:18, lineHeight:1 }}>{typeof val === "number" ? val.toLocaleString() : val}</div>
                          <div style={{ color:"#555", fontSize:10, marginTop:3 }}>{label}</div>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}

              {/* Registrations Summary */}
              <div style={{ background:"rgba(107,138,255,0.07)", borderRadius:16, padding:"14px 16px", marginBottom:14, border:"1px solid rgba(107,138,255,0.2)" }}>
                <div style={{ color:"#6B8AFF", fontWeight:900, fontSize:15, marginBottom:12 }}>👥 User Registrations</div>
                <div style={{ display:"flex", gap:10, marginBottom:14 }}>
                  {(() => {
                    const today = new Date();
                    const weekAgoD = new Date(); weekAgoD.setDate(today.getDate()-6);
                    const weekLabel = `${weekAgoD.toLocaleDateString("en-US",{month:"short",day:"numeric"})}–${today.toLocaleDateString("en-US",{month:"short",day:"numeric"})}`;
                    return [
                      ["Today",analyticsData.newToday,"#6BFFB8"],
                      [weekLabel,analyticsData.newThisWeek,"#F5C842"],
                      ["All Time",analyticsData.totalUsers,"#6B8AFF"],
                    ].map(([label,val,color]) => (
                    <div key={label} style={{ flex:1, background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"10px 6px", textAlign:"center" }}>
                      <div style={{ color, fontWeight:900, fontSize:22, lineHeight:1 }}>{val}</div>
                      <div style={{ color:"#555", fontSize:10, marginTop:4 }}>{label}</div>
                    </div>
                  ))})()}
                </div>
                {/* All registrants list */}
                <div style={{ color:"#888", fontWeight:700, fontSize:11, marginBottom:8, letterSpacing:0.5, textTransform:"uppercase" }}>
                  All Registered Users ({(analyticsData.recentUsers||[]).length})
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:320, overflowY:"auto" }}>
                  {(analyticsData.recentUsers||[]).map((u,i) => {
                    const joinDate = u.created_date ? new Date(u.created_date) : null;
                    const today = new Date();
                    const isNew = joinDate && (today - joinDate) < 24*60*60*1000;
                    const isThisWeek = joinDate && (today - joinDate) < 7*24*60*60*1000;
                    return (
                      <div key={u.id||i} style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.03)", borderRadius:10, padding:"10px 12px", border: isNew ? "1px solid rgba(107,255,184,0.25)" : "1px solid transparent" }}>
                        <div style={{ color:"#444", fontWeight:700, fontSize:11, width:18, textAlign:"right", flexShrink:0 }}>{i+1}</div>
                        <img src={u.avatar_url || u.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.display_name||u.username||u.email||"?")}&background=random&color=fff&size=64&bold=true&format=png`}
                          style={{ width:32, height:32, borderRadius:"50%", flexShrink:0, objectFit:"cover" }} />
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ color:"#fff", fontSize:13, fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                            {u.display_name || u.full_name || u.username || "—"}
                            {isNew && <span style={{ marginLeft:6, background:"#6BFFB8", color:"#0B0C1A", fontSize:9, fontWeight:900, padding:"1px 6px", borderRadius:20 }}>NEW</span>}
                          </div>
                          <div style={{ color:"#555", fontSize:11, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                            {u.email || ""}{u.username ? ` · @${u.username}` : ""}
                          </div>
                          {u.location && <div style={{ color:"#444", fontSize:10, marginTop:1 }}>📍 {u.location}</div>}
                        </div>
                        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:3, flexShrink:0 }}>
                          <div style={{ color: isNew ? "#6BFFB8" : isThisWeek ? "#F5C842" : "#444", fontSize:10, fontWeight:600 }}>
                            {joinDate ? joinDate.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "—"}
                          </div>
                          <div style={{ fontSize:9, color:"#333" }}>
                            {joinDate ? joinDate.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}) : ""}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Daily Videos — bar chart */}
              <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:16, padding:"14px 16px", marginBottom:14, border:"1px solid rgba(245,200,66,0.1)" }}>
                <div style={{ color:"#F5C842", fontWeight:800, fontSize:14, marginBottom:12 }}>📈 Daily Videos (14 days)</div>
                <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:60 }}>
                  {analyticsData.dailyVideos.map(({date,count},i) => {
                    const maxV = Math.max(...analyticsData.dailyVideos.map(d=>d.count), 1);
                    const h = Math.max((count/maxV)*56, count>0?4:1);
                    return (
                      <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                        <div style={{ fontSize:9, color:"#555" }}>{count>0?count:""}</div>
                        <div style={{ width:"100%", height:h, borderRadius:3, background: count>0 ? "linear-gradient(180deg,#F5C842,#FF9500)" : "rgba(255,255,255,0.06)", transition:"height 0.3s" }} />
                        <div style={{ fontSize:8, color:"#444", writingMode:"vertical-rl", transform:"rotate(180deg)", height:22, overflow:"hidden" }}>
                          {date.slice(5)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Daily Users — bar chart */}
              <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:16, padding:"14px 16px", marginBottom:14, border:"1px solid rgba(107,138,255,0.15)" }}>
                <div style={{ color:"#6B8AFF", fontWeight:800, fontSize:14, marginBottom:12 }}>👥 Daily New Users (14 days)</div>
                <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:60 }}>
                  {analyticsData.dailyUsers.map(({date,count},i) => {
                    const maxV = Math.max(...analyticsData.dailyUsers.map(d=>d.count), 1);
                    const h = Math.max((count/maxV)*56, count>0?4:1);
                    return (
                      <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                        <div style={{ fontSize:9, color:"#555" }}>{count>0?count:""}</div>
                        <div style={{ width:"100%", height:h, borderRadius:3, background: count>0 ? "linear-gradient(180deg,#6B8AFF,#4A67FF)" : "rgba(255,255,255,0.06)", transition:"height 0.3s" }} />
                        <div style={{ fontSize:8, color:"#444", writingMode:"vertical-rl", transform:"rotate(180deg)", height:22, overflow:"hidden" }}>
                          {date.slice(5)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Creators */}
              <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:16, padding:"14px 16px", marginBottom:14, border:"1px solid rgba(107,255,184,0.1)" }}>
                <div style={{ color:"#6BFFB8", fontWeight:800, fontSize:14, marginBottom:10 }}>🏆 Top Creators</div>
                {analyticsData.topCreators.map(({username,count},i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                    <div style={{ color:"#F5C842", fontWeight:900, fontSize:13, width:18 }}>#{i+1}</div>
                    <div style={{ flex:1, color:"#fff", fontSize:13 }}>@{username}</div>
                    <div style={{ background:"rgba(245,200,66,0.15)", color:"#F5C842", fontWeight:800, fontSize:12, padding:"3px 10px", borderRadius:20 }}>{count} videos</div>
                  </div>
                ))}
              </div>

              {/* Top Videos */}
              <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:16, padding:"14px 16px", border:"1px solid rgba(255,107,107,0.1)" }}>
                <div style={{ color:"#FF6B6B", fontWeight:800, fontSize:14, marginBottom:10 }}>🔥 Top Videos by Views</div>
                {analyticsData.topVideos.map((v,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                    <div style={{ color:"#F5C842", fontWeight:900, fontSize:13, width:18 }}>#{i+1}</div>
                    <div style={{ width:36, height:44, borderRadius:8, overflow:"hidden", flexShrink:0, background:"#1a1a2e" }}>
                      {v.thumbnail_url ? <img src={resolveMediaUrl(v.thumbnail_url)} style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <div style={{ color:"#333", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", height:"100%" }}>🎬</div>}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ color:"#fff", fontSize:12, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{v.caption||"(no caption)"}</div>
                      <div style={{ color:"#555", fontSize:11 }}>@{v.username} · 👁 {(v.views_count||0).toLocaleString()} · ❤️ {(v.likes_count||0)} · 💬 {(v.comments_count||0)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── VIDEOS TAB ── */}
      {/* ── AI FLAGGED TAB ── */}
      {/* ── USERS TAB ── */}
      {modTab === "users" && (
        <div style={{ padding:"16px 16px 20px" }}>
          {usersLoading ? (
            <div style={{ textAlign:"center", color:"#555", padding:60, fontSize:14 }}>Loading users…</div>
          ) : (
            (() => {
              const todayStr = new Date().toISOString().slice(0,10);
              const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate()-7);
              const newToday = registeredUsers.filter(u => (u.created_date||"").slice(0,10) === todayStr).length;
              const newThisWeek = registeredUsers.filter(u => new Date(u.created_date) >= weekAgo).length;
              return (
                <>
                  {/* Summary cards */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:20 }}>
                    {[
                      ["👥","Total",registeredUsers.length,"#6B8AFF"],
                      ["🌅","Today",newToday,"#6BFFB8"],
                      ["📅","This Week",newThisWeek,"#F5C842"],
                    ].map(([icon,label,val,color]) => (
                      <div key={label} style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:"14px 10px", textAlign:"center", border:`1px solid ${color}33` }}>
                        <div style={{ fontSize:20, marginBottom:4 }}>{icon}</div>
                        <div style={{ color, fontWeight:900, fontSize:26, lineHeight:1 }}>{val}</div>
                        <div style={{ color:"#555", fontSize:11, marginTop:4 }}>{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Country breakdown */}
                  {(() => {
                    const countries = {};
                    registeredUsers.forEach(u => {
                      const loc = u.location || "Unknown";
                      countries[loc] = (countries[loc] || 0) + 1;
                    });
                    const sorted = Object.entries(countries).sort((a,b) => b[1]-a[1]);
                    return sorted.length > 0 ? (
                      <div style={{ background:"rgba(245,200,66,0.06)", borderRadius:16, border:"1px solid rgba(245,200,66,0.15)", padding:"12px 16px", marginBottom:12 }}>
                        <div style={{ color:"#F5C842", fontWeight:800, fontSize:13, marginBottom:8 }}>🌍 Users by Location</div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                          {sorted.map(([loc, count]) => (
                            <div key={loc} style={{ background:"rgba(245,200,66,0.12)", borderRadius:20, padding:"4px 12px", fontSize:12, color:"#F5C842", fontWeight:600 }}>
                              {loc === "Unknown" ? "🌍" : loc.toLowerCase().includes("australia") ? "🇦🇺" : loc.toLowerCase().includes("sri lanka") ? "🇱🇰" : loc.toLowerCase().includes("united states") || loc.toLowerCase().includes("usa") ? "🇺🇸" : "🌍"} {loc} · {count}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })()}

                  {/* User list */}
                  <div style={{ background:"rgba(107,138,255,0.06)", borderRadius:16, border:"1px solid rgba(107,138,255,0.15)", overflow:"hidden" }}>
                    <div style={{ padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ color:"#6B8AFF", fontWeight:800, fontSize:14 }}>All Registered Users</div>
                      <div style={{ color:"#444", fontSize:12 }}>{registeredUsers.length} total</div>
                    </div>
                    <div style={{ maxHeight:500, overflowY:"auto" }}>
                      {registeredUsers.map((u, i) => {
                        const locationFlag = (loc) => {
                          if (!loc) return "🌍 Unknown";
                          const l = loc.toLowerCase();
                          if (l.includes("australia") || l.includes("au")) return "🇦🇺 " + loc;
                          if (l.includes("sri lanka") || l.includes("lk")) return "🇱🇰 " + loc;
                          if (l.includes("united states") || l.includes("usa") || l.includes("us")) return "🇺🇸 " + loc;
                          if (l.includes("new zealand") || l.includes("nz")) return "🇳🇿 " + loc;
                          if (l.includes("india")) return "🇮🇳 " + loc;
                          if (l.includes("canada")) return "🇨🇦 " + loc;
                          if (l.includes("uk") || l.includes("united kingdom")) return "🇬🇧 " + loc;
                          return "🌍 " + loc;
                        };
                        return (
                        <div key={u.id||i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.04)", background: i%2===0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                          <img
                            src={u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username||u.email||"?")}&background=random&color=fff&size=64&bold=true&format=png`}
                            style={{ width:40, height:40, borderRadius:"50%", flexShrink:0, objectFit:"cover", border:"2px solid rgba(107,138,255,0.3)" }}
                          />
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ color:"#fff", fontWeight:700, fontSize:14, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                              {u.display_name || u.username || "—"}
                            </div>
                            <div style={{ color:"#aaa", fontSize:11, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginTop:1 }}>
                              @{u.username || "?"} · {u.email || "no email"}
                            </div>
                            <div style={{ color:"#F5C842", fontSize:11, fontWeight:600, marginTop:2 }}>
                              {locationFlag(u.location)}
                            </div>
                          </div>
                          <div style={{ flexShrink:0, textAlign:"right" }}>
                            <div style={{ color:"#888", fontSize:11 }}>
                              {u.created_date ? new Date(u.created_date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : ""}
                            </div>
                            <div style={{ color: u.status==="active" ? "#6BFFB8" : "#FF6B6B", fontSize:10, fontWeight:700, marginTop:2 }}>
                              {u.status || "active"}
                            </div>
                            {(() => {
                              const ls = lastSeenMap[(u.username||"").toLowerCase()];
                              if (!ls) return <div style={{ color:"#555", fontSize:10, marginTop:2 }}>Never seen</div>;
                              const diff = Date.now() - new Date(ls).getTime();
                              const mins = Math.floor(diff/60000);
                              const hrs = Math.floor(mins/60);
                              const days = Math.floor(hrs/24);
                              let label;
                              if (mins < 5) label = "🟢 Just now";
                              else if (mins < 60) label = `🟢 ${mins}m ago`;
                              else if (hrs < 24) label = `🟡 ${hrs}h ago`;
                              else if (days === 1) label = "🟠 Yesterday";
                              else if (days < 7) label = `🟠 ${days}d ago`;
                              else if (days < 30) label = `🔴 ${days}d ago`;
                              else label = `⚫ ${Math.floor(days/30)}mo ago`;
                              return <div style={{ fontSize:10, marginTop:2, fontWeight:700 }}>{label}</div>;
                            })()}
                          </div>
                        </div>
                        );
                      })}
                      {registeredUsers.length === 0 && (
                        <div style={{ textAlign:"center", color:"#444", padding:40, fontSize:13 }}>No users yet.</div>
                      )}
                    </div>
                  </div>
                </>
              );
            })()
          )}
        </div>
      )}

      {modTab === "ai" && (
        <div style={{ padding:"16px" }}>
          <div style={{ display:"flex", gap:12, marginBottom:16 }}>
            {[
              ["⏳ Pending Review", allVideos.filter(v=>v.is_ai_detected && !v.is_approved).length, "#FF9500"],
              ["🤖 Live AI Posts", allVideos.filter(v=>v.is_ai_detected && v.is_approved).length, "#ffcc44"],
              ["✅ Clean Posts", allVideos.filter(v=>!v.is_ai_detected && v.is_approved).length, "#6BFFB8"],
            ].map(([label,count,color]) => (
              <div key={label} style={{ flex:1, background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"10px 0", textAlign:"center", border:`1px solid ${color}22` }}>
                <div style={{ color, fontWeight:900, fontSize:20 }}>{count}</div>
                <div style={{ color:"#555", fontSize:11 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* PENDING AI REVIEW SECTION */}
          {allVideos.filter(v => v.is_ai_detected && !v.is_approved).length > 0 && (
            <div style={{ marginBottom:20 }}>
              <div style={{ color:"#FF9500", fontWeight:800, fontSize:13, marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
                ⏳ Pending Your Review
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {allVideos.filter(v => v.is_ai_detected && !v.is_approved).map(video => (
                  <div key={video.id} style={{ background:"rgba(255,149,0,0.08)", borderRadius:16, border:"2px solid rgba(255,149,0,0.5)", overflow:"hidden" }}>
                    <div style={{ display:"flex", gap:12, padding:"12px 14px" }}>
                      <div style={{ width:64, height:80, borderRadius:10, overflow:"hidden", flexShrink:0, background:"#1a1a2e" }}>
                        {video.thumbnail_url
                          ? <img src={video.thumbnail_url} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                          : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", color:"#444", fontSize:24 }}>🎬</div>}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                          <span style={{ fontSize:11, background:"rgba(255,149,0,0.3)", color:"#FF9500", padding:"2px 8px", borderRadius:20, fontWeight:700 }}>⏳ Awaiting MOD</span>
                        </div>
                        <div style={{ color:"#aaa", fontSize:11, marginBottom:3 }}>@{video.username || "unknown"}</div>
                        <div style={{ color:"#fff", fontSize:13, fontWeight:600, marginBottom:6, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {video.caption || "(no caption)"}
                        </div>
                        <div style={{ fontSize:11, color:"#FF9500" }}>Creator self-disclosed as AI</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:0, borderTop:"1px solid rgba(255,255,255,0.05)" }}>
                      <button onClick={async () => { setSaving(video.id); await request("PUT", `/apps/69e79122bcc8fb5a04cfb834/entities/SachiVideo/${video.id}`, { is_approved: true }); setAllVideos(p => p.map(v => v.id===video.id ? {...v, is_approved:true} : v)); setSaving(null); }}
                        disabled={saving===video.id}
                        style={{ flex:1, padding:"10px 0", border:"none", cursor:"pointer", fontSize:13, fontWeight:700,
                          borderRight:"1px solid rgba(255,255,255,0.05)",
                          background:"rgba(107,255,154,0.1)", color:"#6bff9a" }}>
                        {saving===video.id ? "Saving…" : "✅ Approve & Post with AI Badge"}
                      </button>
                      <button onClick={() => deleteVideo(video)} disabled={saving===video.id}
                        style={{ width:56, padding:"10px 0", border:"none", cursor:"pointer", fontSize:16,
                          background:"rgba(255,0,0,0.08)", color:"#ff4444" }}>
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LIVE AI POSTS SECTION */}
          <div style={{ color:"#ffcc44", fontWeight:800, fontSize:13, marginBottom:10 }}>🤖 Live AI-Badged Posts</div>
          {allVideos.filter(v => v.is_ai_detected && v.is_approved).length === 0 ? (
            <div style={{ textAlign:"center", color:"#555", padding:24 }}>
              <div style={{ fontSize:12, color:"#444" }}>No approved AI posts yet.</div>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {allVideos.filter(v => v.is_ai_detected && v.is_approved).map(video => (
                <div key={video.id} style={{ background:"rgba(255,149,0,0.06)", borderRadius:16, border:"1px solid rgba(255,149,0,0.3)", overflow:"hidden" }}>
                  <div style={{ display:"flex", gap:12, padding:"12px 14px" }}>
                    <div style={{ width:64, height:80, borderRadius:10, overflow:"hidden", flexShrink:0, background:"#1a1a2e" }}>
                      {video.thumbnail_url
                        ? <img src={video.thumbnail_url} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", color:"#444", fontSize:24 }}>🎬</div>}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                        <span style={{ fontSize:11, background:"rgba(255,149,0,0.2)", color:"#FF9500", padding:"2px 8px", borderRadius:20, fontWeight:700 }}>🤖 AI Detected</span>
                      </div>
                      <div style={{ color:"#aaa", fontSize:11, marginBottom:3 }}>@{video.username || "unknown"}</div>
                      <div style={{ color:"#fff", fontSize:13, fontWeight:600, marginBottom:6, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {video.caption || "(no caption)"}
                      </div>
                      <div style={{ display:"flex", gap:8 }}>
                        <span style={{ fontSize:11, color:"#555" }}>👁 {video.views_count||0}</span>
                        <span style={{ fontSize:11, color:"#555" }}>❤️ {video.likes_count||0}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:0, borderTop:"1px solid rgba(255,255,255,0.05)" }}>
                    <button onClick={() => flagAI(video)} disabled={saving===video.id}
                      style={{ flex:1, padding:"10px 0", border:"none", cursor:"pointer", fontSize:13, fontWeight:700,
                        borderRight:"1px solid rgba(255,255,255,0.05)",
                        background:"rgba(107,255,154,0.08)", color:"#6bff9a" }}>
                      {saving===video.id ? "Saving…" : "✅ Clear AI Flag"}
                    </button>
                    <button onClick={() => deleteVideo(video)} disabled={saving===video.id}
                      style={{ width:56, padding:"10px 0", border:"none", cursor:"pointer", fontSize:16,
                        background:"rgba(255,0,0,0.06)", color:"#ff4444" }}>
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {modTab === "videos" && (<>
      {/* Stats bar */}
      <div style={{ display:"flex", gap:12, padding:"12px 20px" }}>
        {[
          ["Total",allVideos.length,"#F5C842"],
          ["Mature",allVideos.filter(v=>v.is_mature).length,"#ff6b6b"],
          ["Clean",allVideos.filter(v=>!v.is_mature).length,"#6bff9a"],
        ].map(([label,count,color]) => (
          <div key={label} style={{ flex:1, background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"10px 0", textAlign:"center", border:`1px solid ${color}22` }}>
            <div style={{ color, fontWeight:900, fontSize:20 }}>{count}</div>
            <div style={{ color:"#555", fontSize:11 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Video list */}
      {loading ? (
        <div style={{ textAlign:"center", color:"#555", padding:40 }}>Loading videos…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:"center", color:"#555", padding:40 }}>No videos match this filter.</div>
      ) : (
        <div style={{ padding:"0 16px", display:"flex", flexDirection:"column", gap:12 }}>
          {filtered.map(video => (
            <div key={video.id} style={{ background:"rgba(255,255,255,0.04)", borderRadius:16, border:`1px solid ${video.is_mature ? "rgba(255,107,107,0.3)" : "rgba(255,255,255,0.07)"}`, overflow:"hidden" }}>
              <div style={{ display:"flex", gap:12, padding:"12px 14px" }}>
                {/* Thumbnail */}
                <div style={{ width:64, height:80, borderRadius:10, overflow:"hidden", flexShrink:0, background:"#1a1a2e" }}>
                  {video.thumbnail_url ? (
                    <img src={video.thumbnail_url} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  ) : (
                    <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", color:"#444", fontSize:24 }}>🎬</div>
                  )}
                </div>
                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ color:"#aaa", fontSize:11, marginBottom:3 }}>@{video.username || "unknown"}</div>
                  <div style={{ color:"#fff", fontSize:13, fontWeight:600, marginBottom:6, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {video.caption || "(no caption)"}
                  </div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:6 }}>
                    <span style={{ fontSize:11, color:"#555" }}>👁 {video.views_count||0}</span>
                    <span style={{ fontSize:11, color:"#555" }}>❤️ {video.likes_count||0}</span>
                    {video.is_mature && (
                      <span style={{ fontSize:11, background:"rgba(255,107,107,0.2)", color:"#ff6b6b", padding:"2px 8px", borderRadius:20, fontWeight:700 }}>
                        🔞 {(video.mature_reason||"mature").replace(/_/g," ")}
                      </span>
                    )}
                  </div>
                  {/* Mature reason selector (only when mature) */}
                  {video.is_mature && (
                    <select value={video.mature_reason||"other"}
                      onChange={e => toggleMature({...video, is_mature: true}, e.target.value)}
                      style={{ width:"100%", padding:"6px 10px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,107,107,0.3)", borderRadius:8, color:"#fff", fontSize:12, outline:"none", marginBottom:4 }}>
                      {reasons.map(r => <option key={r} value={r}>{r.replace(/_/g," ")}</option>)}
                    </select>
                  )}
                </div>
              </div>
              {/* Action buttons */}
              <div style={{ display:"flex", gap:0, borderTop:"1px solid rgba(255,255,255,0.05)" }}>
                <button onClick={() => toggleMature(video)}
                  disabled={saving===video.id}
                  style={{ flex:1, padding:"10px 0", border:"none", cursor:"pointer", fontSize:13, fontWeight:700, borderRight:"1px solid rgba(255,255,255,0.05)",
                    background: video.is_mature ? "rgba(107,255,154,0.08)" : "rgba(255,107,107,0.08)",
                    color: video.is_mature ? "#6bff9a" : "#ff6b6b" }}>
                  {saving===video.id ? "Saving…" : video.is_mature ? "✅ Clear Mature Flag" : "🔞 Mark as Mature"}
                </button>
                <button onClick={() => deleteVideo(video)}
                  disabled={saving===video.id}
                  style={{ width:56, padding:"10px 0", border:"none", cursor:"pointer", fontSize:16,
                    background:"rgba(255,0,0,0.06)", color:"#ff4444" }}>
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </>)}

      {/* ── FOUNDING CREATORS TAB ── */}
      {modTab === "founders" && (
        <div style={{ padding:"16px" }}>
          {/* Summary bar */}
          {(() => {
            const counts = { Pending:0, Approved:0, Rejected:0, Contacted:0, Waitlisted:0 };
            founders.forEach(f => { if (counts[f.status] !== undefined) counts[f.status]++; else counts.Pending++; });
            return (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8, marginBottom:16 }}>
                {[
                  ["Pending","🟡",counts.Pending,"rgba(245,200,66,0.15)","#F5C842"],
                  ["Approved","✅",counts.Approved,"rgba(76,175,80,0.15)","#4caf50"],
                  ["Contacted","📩",counts.Contacted,"rgba(100,181,246,0.15)","#64b5f6"],
                  ["Waitlisted","⏳",counts.Waitlisted,"rgba(255,152,0,0.15)","#ff9800"],
                  ["Rejected","❌",counts.Rejected,"rgba(229,57,53,0.15)","#ef5350"],
                ].map(([label,icon,count,bg,color]) => (
                  <div key={label} style={{ background:bg, border:`1px solid ${color}44`, borderRadius:12, padding:"10px 6px", textAlign:"center" }}>
                    <div style={{ fontSize:18 }}>{icon}</div>
                    <div style={{ color, fontWeight:900, fontSize:20 }}>{count}</div>
                    <div style={{ color:"#888", fontSize:10 }}>{label}</div>
                  </div>
                ))}
              </div>
            );
          })()}

          {foundersLoading && <div style={{ textAlign:"center", color:"#888", padding:40 }}>Loading applications…</div>}

          {!foundersLoading && founders.length === 0 && (
            <div style={{ textAlign:"center", padding:60 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🌟</div>
              <div style={{ color:"#fff", fontWeight:700, fontSize:18 }}>No applications yet</div>
              <div style={{ color:"#888", fontSize:13, marginTop:6 }}>Applications from sachistream.com/apply will appear here</div>
            </div>
          )}

          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {founders.map(f => {
              const statusColor = f.status==="Approved"?"#4caf50":f.status==="Rejected"?"#ef5350":f.status==="Contacted"?"#64b5f6":f.status==="Waitlisted"?"#ff9800":"#F5C842";
              const isOpen = selectedFounder?.id === f.id;
              return (
                <div key={f.id} style={{ background:"rgba(255,255,255,0.04)", border:`1.5px solid ${statusColor}33`, borderRadius:16, overflow:"hidden" }}>
                  {/* Card header — always visible */}
                  <div onClick={() => { setSelectedFounder(isOpen ? null : f); setFounderNote(f.notes||""); }}
                    style={{ padding:"14px 16px", cursor:"pointer", display:"flex", alignItems:"flex-start", gap:12 }}>
                    {/* Avatar */}
                    <div style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg,${statusColor}44,rgba(11,12,26,0.9))`, border:`2px solid ${statusColor}66`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                      {f.full_name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                        <div style={{ color:"#fff", fontWeight:800, fontSize:15 }}>{f.full_name}</div>
                        <div style={{ background:`${statusColor}22`, border:`1px solid ${statusColor}55`, borderRadius:20, padding:"2px 10px", color:statusColor, fontWeight:700, fontSize:11 }}>{f.status || "Pending"}</div>
                      </div>
                      <div style={{ color:"#888", fontSize:12, marginTop:2 }}>{f.email} {f.phone ? `· ${f.phone}` : ""}</div>
                      <div style={{ color:"#aaa", fontSize:12, marginTop:2 }}>📍 {f.location || "—"} · 🎯 {f.content_type || "—"} · 👥 {f.follower_count || "—"}</div>
                    </div>
                    <div style={{ color:"#888", fontSize:18 }}>{isOpen ? "▲" : "▼"}</div>
                  </div>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div style={{ padding:"0 16px 16px", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
                      {/* Why Sachi */}
                      {f.why_sachi && (
                        <div style={{ background:"rgba(124,77,255,0.08)", border:"1px solid rgba(124,77,255,0.2)", borderRadius:12, padding:"12px 14px", marginTop:14, marginBottom:12 }}>
                          <div style={{ color:"#b388ff", fontWeight:700, fontSize:11, marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>💬 Why Sachi</div>
                          <div style={{ color:"#e0e0e0", fontSize:13, lineHeight:1.6 }}>{f.why_sachi}</div>
                        </div>
                      )}
                      {/* Content description */}
                      {f.content_description && (
                        <div style={{ marginBottom:10 }}>
                          <div style={{ color:"#888", fontSize:11, marginBottom:4 }}>CONTENT</div>
                          <div style={{ color:"#ccc", fontSize:13 }}>{f.content_description}</div>
                        </div>
                      )}
                      {/* Social links */}
                      {f.social_links && (
                        <div style={{ marginBottom:12 }}>
                          <div style={{ color:"#888", fontSize:11, marginBottom:4 }}>SOCIAL</div>
                          <div style={{ color:"#64b5f6", fontSize:13 }}>{f.social_links}</div>
                        </div>
                      )}
                      {/* Applied date */}
                      <div style={{ color:"#555", fontSize:11, marginBottom:14 }}>
                        Applied: {new Date(f.created_date).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric", hour:"2-digit", minute:"2-digit" })}
                      </div>
                      {/* Internal note */}
                      <div style={{ marginBottom:12 }}>
                        <div style={{ color:"#888", fontSize:11, marginBottom:6 }}>INTERNAL NOTE</div>
                        <textarea value={founderNote} onChange={e => setFounderNote(e.target.value)} placeholder="Add a note (optional)…" rows={2}
                          style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"8px 12px", color:"#fff", fontSize:13, outline:"none", resize:"vertical" }} />
                      </div>
                      {/* Action buttons */}
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                        <button onClick={() => updateFounderStatus(f, "Approved")}
                          style={{ flex:1, minWidth:80, background:"linear-gradient(135deg,#4caf50,#388e3c)", border:"none", borderRadius:10, padding:"10px 0", color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer" }}>
                          ✅ Approve
                        </button>
                        <button onClick={() => updateFounderStatus(f, "Waitlisted")}
                          style={{ flex:1, minWidth:80, background:"linear-gradient(135deg,#ff9800,#e65100)", border:"none", borderRadius:10, padding:"10px 0", color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer" }}>
                          ⏳ Waitlist
                        </button>
                        <button onClick={() => updateFounderStatus(f, "Contacted")}
                          style={{ flex:1, minWidth:80, background:"linear-gradient(135deg,#1976d2,#0d47a1)", border:"none", borderRadius:10, padding:"10px 0", color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer" }}>
                          📩 Contacted
                        </button>
                        <button onClick={() => updateFounderStatus(f, "Rejected")}
                          style={{ flex:1, minWidth:80, background:"rgba(229,57,53,0.2)", border:"1px solid rgba(229,57,53,0.4)", borderRadius:10, padding:"10px 0", color:"#ef5350", fontWeight:800, fontSize:13, cursor:"pointer" }}>
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {modTab === "referrals" && (
        <div style={{ marginTop:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ color:"#F5C842", fontWeight:800, fontSize:18 }}>🎁 Referral Dashboard</div>
            <button onClick={loadReferrals} style={{ background:"rgba(255,255,255,0.07)", border:"none", borderRadius:20, padding:"7px 14px", color:"#888", fontWeight:700, fontSize:12, cursor:"pointer" }}>↻ Refresh</button>
          </div>

          {refLoading ? (
            <div style={{ textAlign:"center", color:"#888", padding:40, fontSize:14 }}>Loading referrals…</div>
          ) : (
            <>
              {/* Top Inviters Leaderboard */}
              <div style={{ marginBottom:24 }}>
                <div style={{ color:"#fff", fontWeight:700, fontSize:14, marginBottom:10 }}>🏆 Top Inviters</div>
                {invites.length === 0 ? (
                  <div style={{ color:"#666", fontSize:13, padding:16, textAlign:"center", background:"rgba(255,255,255,0.03)", borderRadius:12 }}>No invite data yet</div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {[...invites].sort((a,b) => (b.referral_count||0) - (a.referral_count||0)).slice(0, 10).map((inv, i) => (
                      <div key={inv.id || i} style={{ display:"flex", alignItems:"center", gap:12, background:"rgba(255,255,255,0.05)", borderRadius:10, padding:"10px 14px" }}>
                        <div style={{ width:28, height:28, borderRadius:"50%", background: i===0 ? "linear-gradient(135deg,#F5C842,#FF9500)" : "rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", color: i===0 ? "#0B0C1A" : "#888", fontWeight:800, fontSize:12 }}>{i+1}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ color:"#fff", fontWeight:700, fontSize:13 }}>@{inv.username || "unknown"}</div>
                          <div style={{ color:"#666", fontSize:11 }}>Code: {inv.code || "—"}</div>
                        </div>
                        <div style={{ color:"#F5C842", fontWeight:800, fontSize:16 }}>{inv.referral_count || 0}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Referrals */}
              <div>
                <div style={{ color:"#fff", fontWeight:700, fontSize:14, marginBottom:10 }}>📋 Recent Referrals</div>
                {referrals.length === 0 ? (
                  <div style={{ color:"#666", fontSize:13, padding:16, textAlign:"center", background:"rgba(255,255,255,0.03)", borderRadius:12 }}>No referrals recorded yet</div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:400, overflowY:"auto" }}>
                    {referrals.map((ref, i) => (
                      <div key={ref.id || i} style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.05)", borderRadius:10, padding:"10px 14px" }}>
                        <div style={{ fontSize:18 }}>🤝</div>
                        <div style={{ flex:1 }}>
                          <div style={{ color:"#fff", fontSize:13 }}>
                            <span style={{ fontWeight:700 }}>@{ref.invitee_username || "new user"}</span>
                            <span style={{ color:"#888" }}> was invited by </span>
                            <span style={{ fontWeight:700, color:"#F5C842" }}>@{ref.inviter_username || "unknown"}</span>
                          </div>
                          <div style={{ color:"#555", fontSize:11 }}>{(ref.created_date||"").slice(0,10)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Summary stats */}
              <div style={{ display:"flex", gap:12, marginTop:20 }}>
                <div style={{ flex:1, background:"rgba(255,255,255,0.05)", borderRadius:12, padding:16, textAlign:"center" }}>
                  <div style={{ color:"#F5C842", fontWeight:800, fontSize:24 }}>{referrals.length}</div>
                  <div style={{ color:"#888", fontSize:11, marginTop:4 }}>Total Referrals</div>
                </div>
                <div style={{ flex:1, background:"rgba(255,255,255,0.05)", borderRadius:12, padding:16, textAlign:"center" }}>
                  <div style={{ color:"#F5C842", fontWeight:800, fontSize:24 }}>{invites.length}</div>
                  <div style={{ color:"#888", fontSize:11, marginTop:4 }}>Active Inviters</div>
                </div>
                <div style={{ flex:1, background:"rgba(255,255,255,0.05)", borderRadius:12, padding:16, textAlign:"center" }}>
                  <div style={{ color:"#F5C842", fontWeight:800, fontSize:24 }}>{invites.reduce((s,i) => s + (i.referral_count||0), 0)}</div>
                  <div style={{ color:"#888", fontSize:11, marginTop:4 }}>Total Invites Sent</div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
}


// ── HLS Live Player (Cloudflare Stream native) ──────────────────────────────

export default AdminPanel;
