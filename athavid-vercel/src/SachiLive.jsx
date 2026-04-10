// SachiLive.jsx — Sachi LIVE Hub v1.0
// Full TikTok-style live experience: news channels, creator live rooms, go live, guest requests
import React, { useState, useEffect, useRef, useCallback } from "react";

const APP_ID = "69b2ee18a8e6fb58c7f0261c";
const BASE_URL = "https://sachi-c7f0261c.base44.app/api";

function req(method, path, body) {
  return fetch(BASE_URL + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  }).then(r => r.json());
}

// ─── Live Room entity helpers ─────────────────────────────────────────────────
const liveRooms = {
  list: () => req("GET", `/apps/${APP_ID}/entities/SachiLiveRoom?sort=-viewer_count&limit=50`),
  create: (data) => req("POST", `/apps/${APP_ID}/entities/SachiLiveRoom`, data),
  update: (id, data) => req("PUT", `/apps/${APP_ID}/entities/SachiLiveRoom/${id}`, data),
  delete: (id) => req("DELETE", `/apps/${APP_ID}/entities/SachiLiveRoom/${id}`, {}),
};
const liveComments = {
  list: (roomId) => req("GET", `/apps/${APP_ID}/entities/SachiLiveComment?room_id=${roomId}&sort=-created_date&limit=80`),
  create: (data) => req("POST", `/apps/${APP_ID}/entities/SachiLiveComment`, data),
};
const guestRequests = {
  list: (roomId) => req("GET", `/apps/${APP_ID}/entities/SachiGuestRequest?room_id=${roomId}&limit=20`),
  create: (data) => req("POST", `/apps/${APP_ID}/entities/SachiGuestRequest`, data),
  update: (id, data) => req("PUT", `/apps/${APP_ID}/entities/SachiGuestRequest/${id}`, data),
};

// ─── News Channels ────────────────────────────────────────────────────────────
const NEWS_CHANNELS = [
  { id:"dn",  name:"Democracy Now",  emoji:"🗽", url:"https://www.youtube.com/embed/live_stream?channel=UCzuqE7-t13O4NIDYJfakERg&autoplay=1", color:"#c62828" },
  { id:"bbc", name:"BBC News",       emoji:"🇬🇧", url:"https://www.youtube.com/embed/live_stream?channel=UC16niRr50-MSBwiO3YDb3RA&autoplay=1", color:"#b71c1c" },
  { id:"alj", name:"Al Jazeera",     emoji:"🌍", url:"https://www.youtube.com/embed/live_stream?channel=UCSNeTbWve-VALqR4qxIgY-w&autoplay=1", color:"#1565c0" },
  { id:"ctv", name:"CTV News",       emoji:"🇨🇦", url:"https://www.youtube.com/embed/live_stream?channel=UCt2RawFZhd-CHQH-yFB6Q8Q&autoplay=1", color:"#e65100" },
  { id:"sky", name:"Sky News",       emoji:"☁️", url:"https://www.youtube.com/embed/live_stream?channel=UCoMdktPbSTixAyNGwb-UYkQ&autoplay=1", color:"#0d47a1" },
  { id:"dw",  name:"DW News",        emoji:"🇩🇪", url:"https://www.youtube.com/embed/live_stream?channel=UCknLrEdhRCp1aegoMqRaCZg&autoplay=1", color:"#880e4f" },
  { id:"f24", name:"France 24",      emoji:"🇫🇷", url:"https://www.youtube.com/embed/live_stream?channel=UCQfwfsi5VrQ8yKZ-UWmAEFg&autoplay=1", color:"#1a237e" },
];

const CATEGORY_ICONS = { Music:"🎵", Talk:"💬", News:"📰", Gaming:"🎮", Sports:"⚽", Comedy:"😂", Education:"📚", Other:"🎤" };

// ─── Scrolling comment feed ───────────────────────────────────────────────────
function LiveCommentFeed({ roomId, currentUser, small }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const feedRef = useRef(null);
  const pollRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const data = await liveComments.list(roomId);
      const items = Array.isArray(data) ? data : (data?.items || []);
      setComments(items.reverse());
    } catch {}
  }, [roomId]);

  useEffect(() => {
    load();
    pollRef.current = setInterval(load, 3000);
    return () => clearInterval(pollRef.current);
  }, [load]);

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [comments]);

  const send = async () => {
    if (!text.trim() || !currentUser) return;
    const msg = text.trim();
    setText("");
    try {
      await liveComments.create({
        room_id: roomId,
        user_id: currentUser.id,
        username: currentUser.username || "user",
        avatar_url: currentUser.avatar_url || "",
        text: msg,
      });
      load();
    } catch {}
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      {/* Comments */}
      <div ref={feedRef} style={{ flex:1, overflowY:"auto", padding: small ? "8px 10px" : "12px 16px", display:"flex", flexDirection:"column", gap:8 }}>
        {comments.map(c => (
          <div key={c.id} style={{ display:"flex", gap:8, alignItems:"flex-start", animation:"fadeInUp 0.3s ease" }}>
            <img src={c.avatar_url || `https://ui-avatars.com/api/?name=${c.username}&background=random&color=fff&size=48&bold=true`}
              style={{ width:28, height:28, borderRadius:"50%", flexShrink:0, border:"1.5px solid rgba(245,200,66,0.3)" }} />
            <div>
              <span style={{ color:"#F5C842", fontWeight:700, fontSize:12 }}>{c.username} </span>
              <span style={{ color:"#e0e0e0", fontSize:13 }}>{c.text}</span>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <div style={{ textAlign:"center", color:"rgba(255,255,255,0.3)", fontSize:13, marginTop:40 }}>
            Be the first to comment 👋
          </div>
        )}
      </div>
      {/* Input */}
      {currentUser ? (
        <div style={{ display:"flex", gap:8, padding: small ? "8px 10px" : "12px 16px", borderTop:"1px solid rgba(255,255,255,0.08)", background:"rgba(0,0,0,0.3)", backdropFilter:"blur(10px)" }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Say something..."
            style={{ flex:1, background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:20, padding:"8px 14px", color:"#fff", fontSize:13, outline:"none" }}
          />
          <button onClick={send} disabled={!text.trim()}
            style={{ background:"#F5C842", border:"none", borderRadius:20, padding:"8px 16px", color:"#0B0C1A", fontWeight:800, fontSize:13, cursor:"pointer", opacity: text.trim() ? 1 : 0.4 }}>
            →
          </button>
        </div>
      ) : (
        <div style={{ padding:"10px 16px", textAlign:"center", color:"rgba(255,255,255,0.4)", fontSize:12 }}>
          Sign in to comment
        </div>
      )}
    </div>
  );
}

// ─── Go Live Modal ────────────────────────────────────────────────────────────
function GoLivePanel({ currentUser, onClose, onLive }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Talk");
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  const start = async () => {
    if (!title.trim()) return setError("Please add a title for your live room.");
    setStarting(true);
    try {
      const room = await liveRooms.create({
        host_id: currentUser.id,
        host_username: currentUser.username || currentUser.email?.split("@")[0],
        host_avatar: currentUser.avatar_url || "",
        title: title.trim(),
        category,
        is_live: true,
        viewer_count: 0,
        stream_type: "webrtc",
      });
      onLive(room);
    } catch (e) {
      setError("Could not start your live room. Try again.");
      setStarting(false);
    }
  };

  const inp = { display:"block", width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(245,200,66,0.2)", borderRadius:12, padding:"12px 14px", color:"#fff", fontSize:14, outline:"none", marginBottom:12 };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:5000, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.7)" }} />
      <div style={{ position:"relative", zIndex:5001, background:"linear-gradient(180deg,#1a1040,#0B0C1A)", borderRadius:"24px 24px 0 0", padding:"28px 24px 40px", width:"100%", maxWidth:480 }}>
        <div style={{ width:40, height:4, background:"rgba(255,255,255,0.2)", borderRadius:2, margin:"0 auto 24px" }} />
        <div style={{ color:"#fff", fontWeight:900, fontSize:20, marginBottom:4 }}>🔴 Go Live</div>
        <div style={{ color:"#888", fontSize:13, marginBottom:20 }}>Start a live room — anyone on Sachi can join and comment</div>

        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="What's your live about?" style={inp} maxLength={80} />

        <div style={{ marginBottom:12 }}>
          <div style={{ color:"#888", fontSize:12, marginBottom:8 }}>Category</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {Object.entries(CATEGORY_ICONS).map(([cat, icon]) => (
              <button key={cat} onClick={() => setCategory(cat)}
                style={{ background: category===cat ? "rgba(245,200,66,0.2)" : "rgba(255,255,255,0.07)", border: category===cat ? "1.5px solid #F5C842" : "1.5px solid rgba(255,255,255,0.12)", borderRadius:20, padding:"6px 14px", color: category===cat ? "#F5C842" : "#aaa", fontSize:13, cursor:"pointer", fontWeight: category===cat ? 700 : 400 }}>
                {icon} {cat}
              </button>
            ))}
          </div>
        </div>

        {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:12 }}>{error}</div>}

        <button onClick={start} disabled={starting}
          style={{ display:"block", width:"100%", padding:"15px 0", background:"linear-gradient(135deg,#e53935,#c62828)", border:"none", borderRadius:14, color:"#fff", fontWeight:900, fontSize:16, cursor:"pointer", opacity: starting ? 0.7 : 1, letterSpacing:0.3 }}>
          {starting ? "Starting..." : "🔴 Start Live Room"}
        </button>
      </div>
    </div>
  );
}

// ─── Host Live Room View (host sees their own stream + guest requests) ─────────
function HostLiveRoom({ room, currentUser, onEnd }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [elapsed, setElapsed] = useState(0);
  const [viewerCount, setViewerCount] = useState(room.viewer_count || 0);
  const [requests, setRequests] = useState([]);
  const [guests, setGuests] = useState([]); // accepted guests
  const [showComments, setShowComments] = useState(true);

  // Start camera
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode:"user" }, audio: true })
      .then(stream => {
        streamRef.current = stream;
        if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      })
      .catch(() => {});
    const timer = setInterval(() => setElapsed(p => p+1), 1000);

    // Poll viewer count & guest requests
    const pollRoom = setInterval(async () => {
      try {
        const data = await req("GET", `/apps/${APP_ID}/entities/SachiLiveRoom/${room.id}`);
        setViewerCount(data.viewer_count || 0);
      } catch {}
    }, 5000);
    const pollReqs = setInterval(async () => {
      try {
        const data = await guestRequests.list(room.id);
        const items = Array.isArray(data) ? data : (data?.items || []);
        setRequests(items.filter(r => r.status === "pending"));
      } catch {}
    }, 4000);

    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      clearInterval(timer); clearInterval(pollRoom); clearInterval(pollReqs);
    };
  }, [room.id]);

  const endLive = async () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    try { await liveRooms.update(room.id, { is_live: false }); } catch {}
    onEnd();
  };

  const acceptGuest = async (reqItem) => {
    await guestRequests.update(reqItem.id, { status: "accepted" });
    setGuests(g => [...g, reqItem]);
    setRequests(r => r.filter(x => x.id !== reqItem.id));
  };
  const declineGuest = async (reqItem) => {
    await guestRequests.update(reqItem.id, { status: "declined" });
    setRequests(r => r.filter(x => x.id !== reqItem.id));
  };
  const removeGuest = (g) => setGuests(gs => gs.filter(x => x.id !== g.id));

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <div style={{ position:"fixed", inset:0, zIndex:6000, background:"#000", display:"flex" }}>
      {/* Camera feed */}
      <div style={{ flex:1, position:"relative" }}>
        <video ref={videoRef} autoPlay muted playsInline style={{ width:"100%", height:"100%", objectFit:"cover", transform:"scaleX(-1)" }} />

        {/* Overlays */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:100, background:"linear-gradient(to bottom,rgba(0,0,0,0.7),transparent)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:160, background:"linear-gradient(to top,rgba(0,0,0,0.8),transparent)", pointerEvents:"none" }} />

        {/* Top bar */}
        <div style={{ position:"absolute", top:16, left:16, right:16, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ background:"#e53935", borderRadius:6, padding:"3px 10px", color:"#fff", fontWeight:900, fontSize:12, letterSpacing:1, boxShadow:"0 0 12px rgba(229,57,53,0.8)" }}>🔴 LIVE</div>
            <div style={{ background:"rgba(0,0,0,0.5)", borderRadius:6, padding:"3px 10px", color:"#fff", fontWeight:700, fontSize:12 }}>{fmt(elapsed)}</div>
            <div style={{ background:"rgba(0,0,0,0.5)", borderRadius:6, padding:"3px 10px", color:"#fff", fontWeight:700, fontSize:12 }}>👁 {viewerCount}</div>
          </div>
          <button onClick={endLive} style={{ background:"#e53935", border:"none", borderRadius:20, padding:"6px 16px", color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer" }}>End Live</button>
        </div>

        {/* Room title */}
        <div style={{ position:"absolute", top:60, left:16, right:16, color:"#fff", fontWeight:700, fontSize:15, textShadow:"0 2px 8px rgba(0,0,0,0.8)" }}>{room.title}</div>

        {/* Guest panels (split screen) */}
        {guests.length > 0 && (
          <div style={{ position:"absolute", bottom:100, left:16, display:"flex", flexDirection:"column", gap:8 }}>
            {guests.map(g => (
              <div key={g.id} style={{ position:"relative", width:110, height:150, borderRadius:12, overflow:"hidden", border:"2px solid #F5C842", background:"#111" }}>
                <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6 }}>
                  <img src={g.avatar_url || `https://ui-avatars.com/api/?name=${g.username}&background=random&color=fff&size=80&bold=true`} style={{ width:48, height:48, borderRadius:"50%" }} />
                  <div style={{ color:"#fff", fontSize:11, fontWeight:700 }}>@{g.username}</div>
                  <div style={{ background:"rgba(245,200,66,0.8)", borderRadius:6, padding:"2px 8px", color:"#0B0C1A", fontSize:10, fontWeight:800 }}>GUEST</div>
                </div>
                <button onClick={() => removeGuest(g)} style={{ position:"absolute", top:4, right:4, background:"rgba(229,57,53,0.8)", border:"none", borderRadius:"50%", width:22, height:22, color:"#fff", fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
              </div>
            ))}
          </div>
        )}

        {/* Guest requests queue */}
        {requests.length > 0 && (
          <div style={{ position:"absolute", top:110, right:16, display:"flex", flexDirection:"column", gap:8, maxWidth:200 }}>
            {requests.slice(0,3).map(r => (
              <div key={r.id} style={{ background:"rgba(0,0,0,0.85)", borderRadius:12, padding:"10px 12px", border:"1px solid rgba(245,200,66,0.3)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <img src={r.avatar_url || `https://ui-avatars.com/api/?name=${r.username}&background=random&color=fff&size=48&bold=true`} style={{ width:32, height:32, borderRadius:"50%" }} />
                  <div style={{ color:"#fff", fontSize:12, fontWeight:700 }}>@{r.username}</div>
                </div>
                <div style={{ color:"#F5C842", fontSize:11, marginBottom:8 }}>🙋 Wants to join</div>
                <div style={{ display:"flex", gap:6 }}>
                  <button onClick={() => acceptGuest(r)} style={{ flex:1, background:"#4caf50", border:"none", borderRadius:8, padding:"6px 0", color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer" }}>Accept</button>
                  <button onClick={() => declineGuest(r)} style={{ flex:1, background:"rgba(229,57,53,0.7)", border:"none", borderRadius:8, padding:"6px 0", color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer" }}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment sidebar */}
      {showComments && (
        <div style={{ width:280, background:"rgba(11,12,26,0.95)", borderLeft:"1px solid rgba(255,255,255,0.08)", display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ color:"#F5C842", fontWeight:800, fontSize:13 }}>💬 Live Chat</div>
            <button onClick={() => setShowComments(false)} style={{ background:"none", border:"none", color:"#888", cursor:"pointer", fontSize:16 }}>✕</button>
          </div>
          <div style={{ flex:1, overflow:"hidden" }}>
            <LiveCommentFeed roomId={room.id} currentUser={currentUser} />
          </div>
        </div>
      )}
      {!showComments && (
        <button onClick={() => setShowComments(true)} style={{ position:"absolute", bottom:80, right:16, background:"rgba(245,200,66,0.15)", border:"1px solid rgba(245,200,66,0.4)", borderRadius:"50%", width:48, height:48, color:"#F5C842", fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>💬</button>
      )}
    </div>
  );
}

// ─── Viewer Live Room ─────────────────────────────────────────────────────────
function ViewerLiveRoom({ room, currentUser, onClose }) {
  const [requested, setRequested] = useState(false);
  const [guestStatus, setGuestStatus] = useState(null); // pending | accepted | declined
  const [viewerCount, setViewerCount] = useState(room.viewer_count || 0);
  const pollRef = useRef(null);

  useEffect(() => {
    // Increment viewer count
    liveRooms.update(room.id, { viewer_count: (room.viewer_count || 0) + 1 }).catch(() => {});
    // Poll viewer count
    pollRef.current = setInterval(async () => {
      try {
        const data = await req("GET", `/apps/${APP_ID}/entities/SachiLiveRoom/${room.id}`);
        setViewerCount(data.viewer_count || 0);
        if (!data.is_live) onClose(); // room ended
      } catch {}
    }, 5000);
    // Poll guest request status
    const pollStatus = setInterval(async () => {
      if (!requested || !currentUser) return;
      try {
        const data = await guestRequests.list(room.id);
        const items = Array.isArray(data) ? data : (data?.items || []);
        const mine = items.find(r => r.user_id === currentUser.id);
        if (mine) setGuestStatus(mine.status);
      } catch {}
    }, 3000);
    return () => {
      clearInterval(pollRef.current);
      clearInterval(pollStatus);
      liveRooms.update(room.id, { viewer_count: Math.max(0, viewerCount - 1) }).catch(() => {});
    };
  }, [room.id]);

  const requestToJoin = async () => {
    if (!currentUser) return;
    setRequested(true);
    setGuestStatus("pending");
    await guestRequests.create({
      room_id: room.id,
      user_id: currentUser.id,
      username: currentUser.username || "user",
      avatar_url: currentUser.avatar_url || "",
      status: "pending",
    });
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:6000, background:"#000", display:"flex", flexDirection:"column" }}>
      {/* Stream player — for now shows host avatar since WebRTC not yet bridged */}
      <div style={{ flex:1, position:"relative", background:"linear-gradient(135deg,#1a1040,#0B0C1A)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        {/* Host info */}
        <div style={{ textAlign:"center" }}>
          <img src={room.host_avatar || `https://ui-avatars.com/api/?name=${room.host_username}&background=random&color=fff&size=120&bold=true`}
            style={{ width:100, height:100, borderRadius:"50%", border:"3px solid #e53935", marginBottom:12, boxShadow:"0 0 30px rgba(229,57,53,0.5)" }} />
          <div style={{ color:"#fff", fontWeight:800, fontSize:18, marginBottom:4 }}>@{room.host_username}</div>
          <div style={{ background:"#e53935", borderRadius:6, padding:"3px 12px", color:"#fff", fontWeight:900, fontSize:12, letterSpacing:1, display:"inline-block", marginBottom:12 }}>🔴 LIVE</div>
          <div style={{ color:"#F5C842", fontWeight:700, fontSize:16, marginBottom:4 }}>{room.title}</div>
          <div style={{ color:"#888", fontSize:13 }}>{CATEGORY_ICONS[room.category] || "🎤"} {room.category}</div>
        </div>

        {/* Top bar */}
        <div style={{ position:"absolute", top:16, left:16, right:16, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <button onClick={onClose} style={{ background:"rgba(0,0,0,0.5)", border:"none", borderRadius:"50%", width:40, height:40, color:"#fff", fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ background:"rgba(0,0,0,0.5)", borderRadius:6, padding:"4px 10px", color:"#fff", fontSize:12, fontWeight:700 }}>👁 {viewerCount}</div>
          </div>
        </div>

        {/* Guest status */}
        {guestStatus === "accepted" && (
          <div style={{ position:"absolute", bottom:100, left:"50%", transform:"translateX(-50%)", background:"rgba(76,175,80,0.9)", borderRadius:12, padding:"10px 20px", color:"#fff", fontWeight:800, fontSize:14, textAlign:"center" }}>
            ✅ You're live as a guest!<br /><span style={{ fontSize:12, fontWeight:400 }}>Host can now see & hear you</span>
          </div>
        )}
        {guestStatus === "declined" && (
          <div style={{ position:"absolute", bottom:100, left:"50%", transform:"translateX(-50%)", background:"rgba(229,57,53,0.8)", borderRadius:12, padding:"10px 20px", color:"#fff", fontWeight:700, fontSize:14 }}>
            Request declined
          </div>
        )}
      </div>

      {/* Comments */}
      <div style={{ height:320, background:"rgba(11,12,26,0.97)", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ padding:"8px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ color:"#F5C842", fontWeight:800, fontSize:13 }}>💬 Live Chat</div>
          {currentUser && !requested && (
            <button onClick={requestToJoin}
              style={{ background:"linear-gradient(135deg,#F5C842,#FF9500)", border:"none", borderRadius:20, padding:"6px 16px", color:"#0B0C1A", fontWeight:800, fontSize:12, cursor:"pointer" }}>
              🙋 Request to Join
            </button>
          )}
          {guestStatus === "pending" && (
            <div style={{ color:"#F5C842", fontSize:12, fontWeight:700 }}>⏳ Waiting for host...</div>
          )}
        </div>
        <div style={{ height:260, overflow:"hidden" }}>
          <LiveCommentFeed roomId={room.id} currentUser={currentUser} small />
        </div>
      </div>
    </div>
  );
}

// ─── MAIN LIVE HUB ────────────────────────────────────────────────────────────
export default function SachiLiveHub({ currentUser, onClose, onNeedAuth }) {
  const [tab, setTab] = useState("creators"); // creators | news
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNews, setActiveNews] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [showGoLive, setShowGoLive] = useState(false);
  const [myRoom, setMyRoom] = useState(null); // if I'm hosting
  const pollRef = useRef(null);

  const loadRooms = useCallback(async () => {
    try {
      const data = await liveRooms.list();
      const items = Array.isArray(data) ? data : (data?.items || []);
      setRooms(items.filter(r => r.is_live));
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    loadRooms();
    pollRef.current = setInterval(loadRooms, 8000);
    return () => clearInterval(pollRef.current);
  }, [loadRooms]);

  if (activeNews) {
    return (
      <div style={{ position:"fixed", inset:0, zIndex:5000, background:"#000", display:"flex", flexDirection:"column" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, zIndex:10, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 16px 12px", background:"linear-gradient(to bottom,rgba(0,0,0,0.8),transparent)" }}>
          <button onClick={() => setActiveNews(null)} style={{ background:"rgba(0,0,0,0.5)", border:"none", borderRadius:"50%", width:40, height:40, color:"#fff", fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ background:"#e53935", borderRadius:6, padding:"3px 10px", color:"#fff", fontWeight:900, fontSize:11, letterSpacing:1 }}>🔴 LIVE</div>
            <div style={{ color:"#fff", fontWeight:800, fontSize:15 }}>{activeNews.emoji} {activeNews.name}</div>
          </div>
          <div style={{ width:40 }} />
        </div>
        <iframe src={activeNews.url} style={{ flex:1, border:"none", width:"100%" }} allow="autoplay; encrypted-media" allowFullScreen title={activeNews.name} />
        {/* Channel switcher */}
        <div style={{ background:"rgba(11,12,26,0.97)", borderTop:"1px solid rgba(255,255,255,0.08)", padding:"12px 16px", overflowX:"auto", display:"flex", gap:10, flexShrink:0 }}>
          {NEWS_CHANNELS.map(ch => (
            <button key={ch.id} onClick={() => setActiveNews(ch)}
              style={{ flexShrink:0, background: activeNews.id===ch.id ? `${ch.color}33` : "rgba(255,255,255,0.06)", border: activeNews.id===ch.id ? `1.5px solid ${ch.color}` : "1.5px solid transparent", borderRadius:20, padding:"6px 14px", color:"#fff", fontSize:12, fontWeight: activeNews.id===ch.id ? 700 : 400, cursor:"pointer", whiteSpace:"nowrap" }}>
              {ch.emoji} {ch.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (myRoom) return <HostLiveRoom room={myRoom} currentUser={currentUser} onEnd={() => { setMyRoom(null); loadRooms(); }} />;
  if (activeRoom) return <ViewerLiveRoom room={activeRoom} currentUser={currentUser} onClose={() => { setActiveRoom(null); loadRooms(); }} />;

  return (
    <div style={{ position:"fixed", inset:0, zIndex:4500, background:"#0B0C1A", display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ padding:"16px 20px 0", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:"50%", width:38, height:38, color:"#fff", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
            <div>
              <div style={{ color:"#fff", fontWeight:900, fontSize:20 }}>🔴 Sachi LIVE</div>
              <div style={{ color:"#888", fontSize:12 }}>{rooms.length} live room{rooms.length!==1?"s":""} now</div>
            </div>
          </div>
          <button onClick={() => { if (!currentUser) { onNeedAuth(); return; } setShowGoLive(true); }}
            style={{ background:"linear-gradient(135deg,#e53935,#c62828)", border:"none", borderRadius:20, padding:"8px 18px", color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background:"#fff", display:"inline-block" }} />
            Go Live
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", background:"rgba(255,255,255,0.07)", borderRadius:24, padding:3, gap:2, marginBottom:4 }}>
          <button onClick={() => setTab("creators")}
            style={{ flex:1, background: tab==="creators" ? "rgba(229,57,53,0.25)" : "none", border:"none", cursor:"pointer", padding:"7px 0", color: tab==="creators" ? "#ff6b6b" : "rgba(255,255,255,0.45)", fontWeight: tab==="creators" ? 700 : 500, fontSize:13, borderRadius:20, transition:"all 0.2s" }}>
            👥 Creator Rooms
          </button>
          <button onClick={() => setTab("news")}
            style={{ flex:1, background: tab==="news" ? "rgba(229,57,53,0.25)" : "none", border:"none", cursor:"pointer", padding:"7px 0", color: tab==="news" ? "#ff6b6b" : "rgba(255,255,255,0.45)", fontWeight: tab==="news" ? 700 : 500, fontSize:13, borderRadius:20, transition:"all 0.2s" }}>
            📺 News
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 80px" }}>

        {/* Creator Rooms */}
        {tab === "creators" && (
          <>
            {loading && <div style={{ textAlign:"center", padding:40, color:"#888" }}>Loading live rooms...</div>}
            {!loading && rooms.length === 0 && (
              <div style={{ textAlign:"center", padding:"60px 24px" }}>
                <div style={{ fontSize:64, marginBottom:16 }}>🎙️</div>
                <div style={{ color:"#fff", fontWeight:800, fontSize:20, marginBottom:8 }}>No one's live right now</div>
                <div style={{ color:"#888", fontSize:14, marginBottom:24 }}>Be the first to start a live room</div>
                <button onClick={() => { if (!currentUser) { onNeedAuth(); return; } setShowGoLive(true); }}
                  style={{ background:"linear-gradient(135deg,#e53935,#c62828)", border:"none", borderRadius:20, padding:"12px 28px", color:"#fff", fontWeight:800, fontSize:15, cursor:"pointer" }}>
                  🔴 Start a Live Room
                </button>
              </div>
            )}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {rooms.map(room => (
                <button key={room.id} onClick={() => setActiveRoom(room)}
                  style={{ background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(229,57,53,0.3)", borderRadius:16, padding:0, cursor:"pointer", textAlign:"left", overflow:"hidden", position:"relative" }}>
                  {/* Card */}
                  <div style={{ padding:"14px 12px 12px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                      <img src={room.host_avatar || `https://ui-avatars.com/api/?name=${room.host_username}&background=random&color=fff&size=80&bold=true`}
                        style={{ width:40, height:40, borderRadius:"50%", border:"2px solid #e53935" }} />
                      <div>
                        <div style={{ color:"#fff", fontWeight:700, fontSize:13 }}>@{room.host_username}</div>
                        <div style={{ background:"#e53935", borderRadius:4, padding:"1px 6px", color:"#fff", fontWeight:800, fontSize:10, letterSpacing:1, display:"inline-block" }}>🔴 LIVE</div>
                      </div>
                    </div>
                    <div style={{ color:"#fff", fontWeight:700, fontSize:13, marginBottom:4, lineHeight:1.3 }}>{room.title}</div>
                    <div style={{ color:"#888", fontSize:11 }}>{CATEGORY_ICONS[room.category] || "🎤"} {room.category}</div>
                    <div style={{ color:"#888", fontSize:11, marginTop:4 }}>👁 {room.viewer_count || 0} watching</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* News Channels */}
        {tab === "news" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {NEWS_CHANNELS.map(ch => (
              <button key={ch.id} onClick={() => setActiveNews(ch)}
                style={{ background:`linear-gradient(135deg,${ch.color}22,rgba(11,12,26,0.8))`, border:`1.5px solid ${ch.color}44`, borderRadius:16, padding:"18px 14px", cursor:"pointer", textAlign:"left", position:"relative" }}>
                <div style={{ fontSize:32, marginBottom:8 }}>{ch.emoji}</div>
                <div style={{ color:"#fff", fontWeight:800, fontSize:13, marginBottom:4 }}>{ch.name}</div>
                <div style={{ background:"#e53935", borderRadius:4, padding:"2px 8px", color:"#fff", fontWeight:800, fontSize:10, letterSpacing:1, display:"inline-block" }}>🔴 LIVE</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {showGoLive && (
        <GoLivePanel
          currentUser={currentUser}
          onClose={() => setShowGoLive(false)}
          onLive={(room) => { setShowGoLive(false); setMyRoom(room); }}
        />
      )}
    </div>
  );
}
