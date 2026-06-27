// ⛔ LOCKED — InboxPanel.jsx
// DO NOT MODIFY unless fixing a InboxPanel-specific bug.
// Last verified working: 2026-05-23

import React, { useState, useEffect, useRef } from "react";
import { messages, request } from "./api.js";

function InboxPanel({ currentUser, onClose, initialDMTarget, onOpen, fromProfile }) {
  const enteredDirectly = React.useRef(!!(initialDMTarget && initialDMTarget.userId));
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeThread, setActiveThread] = useState(null); // { userId, username, avatar }
  const [threadMsgs, setThreadMsgs] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [showNewDM, setShowNewDM] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const bottomRef = useRef(null);

  // If opened via Message button, jump straight to that DM
  useEffect(() => {
    if (initialDMTarget && initialDMTarget.userId) {
      openThread(initialDMTarget.userId, initialDMTarget.username, initialDMTarget.avatar);
      if (onOpen) onOpen();
    }
  }, []);

  // Load inbox — group by sender, get latest per thread
  const loadInbox = async () => {
    try {
      const res = await messages.getInbox(currentUser.id);
      const items = Array.isArray(res) ? res : (res?.records || res?.items || []);
      // dedupe by thread_id, keep latest
      const map = {};
      items.forEach(m => {
        if (!map[m.thread_id] || new Date(m.created_date) > new Date(map[m.thread_id].created_date)) {
          map[m.thread_id] = m;
        }
      });
      setThreads(Object.values(map).sort((a,b) => new Date(b.created_date) - new Date(a.created_date)));
    } catch(e) {}
    setLoading(false);
  };

  useEffect(() => { loadInbox(); }, [currentUser.id]);

  // Search users for new DM
  useEffect(() => {
    if (!userSearch.trim()) { setUserResults([]); return; }
    const t = setTimeout(async () => {
      setSearchingUsers(true);
      try {
        const res = await AthaVidUser.filter({ username__icontains: userSearch.trim() });
        const items = Array.isArray(res) ? res : (res?.records || []);
        setUserResults(items.filter(u => u.id !== currentUser.id).slice(0, 8));
      } catch(e) { setUserResults([]); }
      setSearchingUsers(false);
    }, 300);
    return () => clearTimeout(t);
  }, [userSearch]);

  const openThread = async (senderId, senderUsername, senderAvatar) => {
    setActiveThread({ userId: senderId, username: senderUsername, avatar: senderAvatar });
    const res = await messages.getThread(currentUser.id, senderId);
    const items = Array.isArray(res) ? res : (res?.records || res?.items || []);
    const sorted = items.sort((a,b) => new Date(a.created_date) - new Date(b.created_date));
    setThreadMsgs(sorted);
    // mark unread as read
    items.filter(m => m.recipient_id === currentUser.id && !m.is_read).forEach(m => messages.markRead(m.id));
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior:"smooth" }), 100);
  };

  const sendMsg = async () => {
    if (!newMsg.trim() || !activeThread) return;
    setSending(true);
    const thread_id = [currentUser.id, activeThread.userId].sort().join("_");
    try {
      const sent = await messages.send({
        sender_id: currentUser.id,
        sender_username: currentUser.username,
        sender_avatar: currentUser.avatar_url || "",
        recipient_id: activeThread.userId,
        recipient_username: activeThread.username,
        text: newMsg.trim(),
        is_read: false,
        thread_id
      });
      setThreadMsgs(prev => [...prev, sent]);
      setNewMsg("");
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior:"smooth" }), 100);
    } catch(e) { alert("Failed to send"); }
    setSending(false);
  };

  const fmtTime = (d) => {
    const dt = new Date(d);
    const now = new Date();
    const diff = now - dt;
    if (diff < 60000) return "just now";
    if (diff < 3600000) return Math.floor(diff/60000) + "m ago";
    if (diff < 86400000) return Math.floor(diff/3600000) + "h ago";
    return dt.toLocaleDateString();
  };

  if (activeThread) return (
    <div style={{ position:"fixed", inset:0, background:"#0B0C1A", zIndex:500, display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"14px 16px", paddingTop:"calc(env(safe-area-inset-top,0px) + 14px)", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", gap:12, background:"rgba(14,14,28,0.98)", backdropFilter:"blur(20px)" }}>
        <button onClick={() => { if (fromProfile || enteredDirectly.current) { onClose(); } else { setActiveThread(null); setThreadMsgs([]); loadInbox(); } }} style={{ background:"none", border:"none", color:"#F5C842", cursor:"pointer", fontSize:22, padding:"0 8px 0 0", lineHeight:1 }}>←</button>
        <img src={activeThread.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed="+activeThread.username} style={{ width:36, height:36, borderRadius:"50%", border:"2px solid rgba(108,99,255,0.4)" }} />
        <div style={{ color:"#fff", fontWeight:700 }}>@{activeThread.username}</div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"16px", display:"flex", flexDirection:"column", gap:10 }}>
        {threadMsgs.map((m, i) => {
          const isMine = m.sender_id === currentUser.id;
          return (
            <div key={m.id||i} style={{ display:"flex", justifyContent: isMine ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth:"72%", background: isMine ? "linear-gradient(135deg,#6c63ff,#ff6b6b)" : "rgba(255,255,255,0.08)", borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding:"10px 14px" }}>
                <div style={{ color:"#fff", fontSize:14 }}>{m.text}</div>
                <div style={{ color:"rgba(255,255,255,0.4)", fontSize:10, marginTop:4, textAlign: isMine ? "right" : "left" }}>{fmtTime(m.created_date)}</div>
              </div>
            </div>
          );
        })}
        {threadMsgs.length === 0 && <div style={{ textAlign:"center", color:"#555", marginTop:60 }}>Start the conversation 👋</div>}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding:"10px 16px 32px", borderTop:"1px solid rgba(255,255,255,0.07)", display:"flex", gap:8, alignItems:"center", background:"rgba(14,14,28,0.98)" }}>
        <input value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key==="Enter" && sendMsg()}
          placeholder="Message..." autoFocus
          style={{ flex:1, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:24, padding:"10px 16px", color:"#fff", fontSize:14, outline:"none" }} />
        <button onClick={sendMsg} disabled={sending || !newMsg.trim()}
          style={{ background:"linear-gradient(135deg,#6c63ff,#ff6b6b)", border:"none", borderRadius:"50%", width:40, height:40, color:"#fff", cursor:"pointer", fontSize:18 }}>➤</button>
      </div>
    </div>
  );

  return (
    <div style={{ position:"fixed", inset:0, background:"#0B0C1A", zIndex:100, display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"16px", paddingTop:"calc(env(safe-area-inset-top,0px) + 16px)", borderBottom:"1px solid rgba(255,255,255,0.08)", background:"rgba(14,14,28,0.98)", backdropFilter:"blur(20px)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <button onClick={onClose} style={{ background:"none", border:"none", color:"#F5C842", cursor:"pointer", fontSize:22, padding:0, lineHeight:1 }}>←</button>
            <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>✉️ Inbox</div>
          </div>
          <button onClick={() => { setShowNewDM(true); setUserSearch(""); setUserResults([]); }}
            style={{ background:"linear-gradient(135deg,#6c63ff,#a855f7)", border:"none", borderRadius:20, padding:"7px 14px", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
            ✏️ New
          </button>
        </div>
      </div>

      {/* New DM search overlay */}
      {showNewDM && (
        <div style={{ position:"absolute", inset:0, background:"#0B0C1A", zIndex:200, display:"flex", flexDirection:"column", paddingTop:"calc(env(safe-area-inset-top,0px) + 0px)" }}>
          <div style={{ padding:"14px 16px", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", gap:10, background:"rgba(14,14,28,0.98)" }}>
            <button onClick={() => setShowNewDM(false)} style={{ background:"none", border:"none", color:"#F5C842", fontSize:20, cursor:"pointer", padding:0 }}>←</button>
            <div style={{ color:"#fff", fontWeight:700, fontSize:16 }}>New Message</div>
          </div>
          <div style={{ padding:"12px 16px" }}>
            <input
              autoFocus
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              placeholder="Search by username..."
              style={{ width:"100%", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:24, padding:"10px 16px", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box" }}
            />
          </div>
          <div style={{ flex:1, overflowY:"auto" }}>
            {searchingUsers && <div style={{ textAlign:"center", color:"#555", padding:20 }}>Searching...</div>}
            {!searchingUsers && userSearch && userResults.length === 0 && (
              <div style={{ textAlign:"center", color:"#555", padding:40 }}>No users found</div>
            )}
            {!userSearch && (
              <div style={{ textAlign:"center", color:"#555", padding:40 }}>
                <div style={{ fontSize:36, marginBottom:8 }}>🔍</div>
                <div>Type a username to find someone</div>
              </div>
            )}
            {userResults.map(u => (
              <div key={u.id} onClick={() => {
                setShowNewDM(false);
                openThread(u.id, u.username, u.avatar_url || "");
              }}
                style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.05)", cursor:"pointer" }}>
                <img src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`}
                  style={{ width:44, height:44, borderRadius:"50%", border:"2px solid rgba(108,99,255,0.3)" }} />
                <div>
                  <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>@{u.username}</div>
                  {u.display_name && <div style={{ color:"#888", fontSize:12 }}>{u.display_name}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ flex:1, overflowY:"auto" }}>
        {loading && <div style={{ textAlign:"center", color:"#555", padding:40 }}>Loading...</div>}
        {!loading && threads.length === 0 && (
          <div style={{ textAlign:"center", color:"#555", padding:60 }}>
            <div style={{ fontSize:48, marginBottom:12 }}>✉️</div>
            <div style={{ fontSize:16 }}>No messages yet</div>
            <div style={{ fontSize:13, marginTop:8, color:"#444" }}>When someone messages you, it will appear here</div>
          </div>
        )}
        {threads.map(t => {
          const isIncoming = t.sender_id !== currentUser.id;
          const otherId = isIncoming ? t.sender_id : t.recipient_id;
          const otherUsername = isIncoming ? t.sender_username : t.recipient_username;
          const otherAvatar = isIncoming ? t.sender_avatar : "";
          const unread = !t.is_read && t.recipient_id === currentUser.id;
          return (
            <div key={t.id} onClick={() => openThread(otherId, otherUsername, otherAvatar)}
              style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", borderBottom:"1px solid rgba(255,255,255,0.05)", cursor:"pointer", background: unread ? "rgba(108,99,255,0.08)" : "transparent" }}>
              <div style={{ position:"relative" }}>
                <img src={otherAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed="+otherUsername} style={{ width:46, height:46, borderRadius:"50%", border:"2px solid rgba(108,99,255,0.3)" }} />
                {unread && <div style={{ position:"absolute", top:0, right:0, width:12, height:12, background:"#ff6b6b", borderRadius:"50%", border:"2px solid #0B0C1A" }} />}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ color: unread ? "#fff" : "#ccc", fontWeight: unread ? 700 : 400, fontSize:14 }}>@{otherUsername}</div>
                <div style={{ color:"#555", fontSize:12, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", marginTop:2 }}>{t.text}</div>
              </div>
              <div style={{ color:"#444", fontSize:11 }}>{fmtTime(t.created_date)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ─── Admin Panel ─────────────────────────────────────────────────────────────

export default InboxPanel;
