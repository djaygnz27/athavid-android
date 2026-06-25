// ⛔ LOCKED — NotificationsPanel.jsx
// DO NOT MODIFY unless fixing a NotificationsPanel-specific bug.
// Last verified working: 2026-05-23

import React, { useState, useEffect } from "react";
import { notifications, request } from "./api.js";

function NotificationsPanel({ currentUser, onClose, onNotifRead }) {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [prefs, setPrefs] = useState(() => {
    try { return { ...DEFAULT_NOTIF_PREFS, ...JSON.parse(localStorage.getItem(NOTIF_PREFS_KEY) || "{}") }; }
    catch { return DEFAULT_NOTIF_PREFS; }
  });

  const savePrefs = (newPrefs) => {
    setPrefs(newPrefs);
    localStorage.setItem(NOTIF_PREFS_KEY, JSON.stringify(newPrefs));
  };

  const togglePref = (key) => savePrefs({ ...prefs, [key]: !prefs[key] });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await request("GET", `/apps/69e79122bcc8fb5a04cfb834/entities/SachiNotification?recipient_id=${currentUser.id}&limit=50&sort=-created_date`);
        const items = Array.isArray(res) ? res : (res?.records || res?.items || []);
        setNotifs(items);
        items.filter(n => !n.is_read).forEach(n =>
          request("PATCH", `/apps/69e79122bcc8fb5a04cfb834/entities/SachiNotification/${n.id}`, { is_read: true }).catch(() => {})
        );
        if (onNotifRead) onNotifRead();
      } catch(e) {}
      setLoading(false);
    };
    load();
  }, [currentUser.id]);

  const fmtTime = (d) => {
    const dt = new Date(d);
    const diff = Date.now() - dt;
    if (diff < 60000) return "just now";
    if (diff < 3600000) return Math.floor(diff/60000) + "m ago";
    if (diff < 86400000) return Math.floor(diff/3600000) + "h ago";
    return dt.toLocaleDateString();
  };

  const icon = (type) => ({ like:"❤️", comment:"💬", follow:"👤", message:"✉️" }[type] || "🔔");

  // Filter notifs based on prefs
  const typeMap = { like: "likes", comment: "comments", follow: "follows", message: "messages" };
  const visibleNotifs = notifs.filter(n => {
    const prefKey = typeMap[n.type] || "likes";
    return prefs[prefKey] !== false;
  });

  const allOff = Object.values(prefs).every(v => !v);

  // ── Settings Screen ──
  if (showSettings) {
    const items = [
      { key: "likes", icon: "❤️", label: "Likes", desc: "When someone likes your post" },
      { key: "comments", icon: "💬", label: "Comments", desc: "When someone comments on your post" },
      { key: "follows", icon: "👤", label: "New Followers", desc: "When someone follows you" },
      { key: "messages", icon: "✉️", label: "Messages", desc: "When you receive a direct message" },
      { key: "live", icon: "🔴", label: "Live Streams", desc: "When creators you follow go live" },
    ];
    return (
      <div style={{ position:"fixed", inset:0, background:"#0B0C1A", zIndex:100, display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"16px", paddingTop:"calc(env(safe-area-inset-top,0px) + 16px)", borderBottom:"1px solid rgba(255,255,255,0.08)", background:"rgba(14,14,28,0.98)", backdropFilter:"blur(20px)", display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={() => setShowSettings(false)} style={{ background:"none", border:"none", color:"#aaa", fontSize:22, cursor:"pointer", padding:"0 4px", lineHeight:1 }}>←</button>
          <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>Notification Settings</div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"8px 0" }}>
          {/* Master toggle */}
          <div style={{ padding:"12px 20px", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>All Notifications</div>
              <div style={{ color:"#666", fontSize:12, marginTop:2 }}>Turn off all notifications at once</div>
            </div>
            <button onClick={() => {
              const newVal = allOff;
              savePrefs({ likes: newVal, comments: newVal, follows: newVal, messages: newVal, live: newVal });
            }} style={{ width:50, height:28, borderRadius:14, border:"none", cursor:"pointer", background: allOff ? "rgba(255,255,255,0.1)" : "#6C63FF", transition:"background 0.2s", position:"relative", flexShrink:0 }}>
              <div style={{ position:"absolute", top:3, left: allOff ? 3 : 25, width:22, height:22, borderRadius:"50%", background:"#fff", transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.4)" }} />
            </button>
          </div>

          <div style={{ padding:"16px 20px 8px", color:"#888", fontSize:11, letterSpacing:0.8, textTransform:"uppercase" }}>Notify me about</div>

          {items.map(item => (
            <div key={item.key} style={{ display:"flex", alignItems:"center", padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize:22, marginRight:14 }}>{item.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ color:"#fff", fontWeight:600, fontSize:14 }}>{item.label}</div>
                <div style={{ color:"#666", fontSize:12, marginTop:2 }}>{item.desc}</div>
              </div>
              <button onClick={() => togglePref(item.key)} style={{ width:50, height:28, borderRadius:14, border:"none", cursor:"pointer", background: prefs[item.key] ? "#6C63FF" : "rgba(255,255,255,0.1)", transition:"background 0.2s", position:"relative", flexShrink:0 }}>
                <div style={{ position:"absolute", top:3, left: prefs[item.key] ? 25 : 3, width:22, height:22, borderRadius:"50%", background:"#fff", transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.4)" }} />
              </button>
            </div>
          ))}

          <div style={{ padding:"24px 20px", color:"#555", fontSize:12, textAlign:"center" }}>
            Changes are saved automatically and apply instantly
          </div>
        </div>
      </div>
    );
  }

  // ── Main Activity Screen ──
  return (
    <div style={{ position:"fixed", inset:0, background:"#0B0C1A", zIndex:100, display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"16px", paddingTop:"calc(env(safe-area-inset-top,0px) + 16px)", borderBottom:"1px solid rgba(255,255,255,0.08)", background:"rgba(14,14,28,0.98)", backdropFilter:"blur(20px)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>🔔 Activity</div>
        <button onClick={() => setShowSettings(true)} style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, padding:"6px 14px", color:"#aaa", fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          Settings
        </button>
      </div>

      {allOff && (
        <div style={{ margin:16, padding:"12px 16px", background:"rgba(108,99,255,0.1)", border:"1px solid rgba(108,99,255,0.3)", borderRadius:12, color:"#aaa", fontSize:13, textAlign:"center" }}>
          🔕 Notifications are turned off. <button onClick={() => setShowSettings(true)} style={{ background:"none", border:"none", color:"#6C63FF", cursor:"pointer", fontSize:13, fontWeight:600 }}>Manage settings</button>
        </div>
      )}

      <div style={{ flex:1, overflowY:"auto" }}>
        {loading && <div style={{ textAlign:"center", color:"#555", padding:40 }}>Loading...</div>}
        {!loading && visibleNotifs.length === 0 && !allOff && (
          <div style={{ textAlign:"center", color:"#555", padding:60 }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🔔</div>
            <div style={{ fontSize:16 }}>No activity yet</div>
            <div style={{ fontSize:13, marginTop:8, color:"#444" }}>Likes, comments and follows will appear here</div>
          </div>
        )}
        {visibleNotifs.map(n => (
          <div key={n.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", borderBottom:"1px solid rgba(255,255,255,0.05)", background: n.is_read ? "transparent" : "rgba(108,99,255,0.06)" }}>
            <div style={{ position:"relative" }}>
              <img src={n.sender_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${n.sender_username}`}
                style={{ width:44, height:44, borderRadius:"50%", border:"2px solid rgba(108,99,255,0.3)" }} />
              <div style={{ position:"absolute", bottom:-2, right:-2, background:"#1a1a2e", borderRadius:"50%", width:20, height:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11 }}>{icon(n.type)}</div>
            </div>
            <div style={{ flex:1 }}>
              <span style={{ color:"#fff", fontWeight:700, fontSize:13 }}>@{n.sender_username}</span>
              <span style={{ color:"#aaa", fontSize:13 }}> {n.text}</span>
            </div>
            {n.video_thumbnail && (
              <img src={n.video_thumbnail} style={{ width:40, height:40, borderRadius:6, objectFit:"cover" }} />
            )}
            <div style={{ color:"#444", fontSize:11, flexShrink:0 }}>{fmtTime(n.created_date)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Inbox Panel ────────────────────────────────────────────────────────────

export default NotificationsPanel;
