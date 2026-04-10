// SachiLive.jsx — Sachi LIVE Hub v2.0
// Full TikTok-style: news, creator rooms, go live, guest requests + WebRTC audio/video
import React, { useState, useEffect, useRef, useCallback } from "react";

const APP_ID = "69b2ee18a8e6fb58c7f0261c";
const BASE_URL = "https://sachi-c7f0261c.base44.app/api";

function apiReq(method, path, body) {
  return fetch(BASE_URL + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  }).then(r => r.json());
}

const liveRooms  = {
  list:   ()       => apiReq("GET",    `/apps/${APP_ID}/entities/SachiLiveRoom?sort=-viewer_count&limit=50`),
  get:    (id)     => apiReq("GET",    `/apps/${APP_ID}/entities/SachiLiveRoom/${id}`),
  create: (data)   => apiReq("POST",   `/apps/${APP_ID}/entities/SachiLiveRoom`, data),
  update: (id, d)  => apiReq("PUT",    `/apps/${APP_ID}/entities/SachiLiveRoom/${id}`, d),
};
const liveComments = {
  list:   (rid)    => apiReq("GET",  `/apps/${APP_ID}/entities/SachiLiveComment?room_id=${rid}&sort=created_date&limit=100`),
  create: (data)   => apiReq("POST", `/apps/${APP_ID}/entities/SachiLiveComment`, data),
};
const guestReqs = {
  list:   (rid)    => apiReq("GET",  `/apps/${APP_ID}/entities/SachiGuestRequest?room_id=${rid}&limit=20`),
  create: (data)   => apiReq("POST", `/apps/${APP_ID}/entities/SachiGuestRequest`, data),
  update: (id, d)  => apiReq("PUT",  `/apps/${APP_ID}/entities/SachiGuestRequest/${id}`, d),
};

// ─── WebRTC signalling via SachiLiveRoom.stream_key field (JSON encoded) ──────
// We store offer/answer/candidates as JSON in stream_key to avoid needing a
// dedicated signalling server. It's polled every 2s.
async function writeSignal(roomId, payload) {
  await liveRooms.update(roomId, { stream_key: JSON.stringify(payload) });
}
async function readSignal(roomId) {
  const room = await liveRooms.get(roomId);
  if (!room.stream_key) return null;
  try { return JSON.parse(room.stream_key); } catch { return null; }
}

const NEWS_CHANNELS = [
  { id:"dn",  name:"Democracy Now",  emoji:"🗽", url:"https://www.youtube.com/embed/live_stream?channel=UCzuqE7-t13O4NIDYJfakERg&autoplay=1", color:"#c62828" },
  { id:"bbc", name:"BBC News",       emoji:"🇬🇧", url:"https://www.youtube.com/embed/live_stream?channel=UC16niRr50-MSBwiO3YDb3RA&autoplay=1", color:"#b71c1c" },
  { id:"alj", name:"Al Jazeera",     emoji:"🌍", url:"https://www.youtube.com/embed/live_stream?channel=UCSNeTbWve-VALqR4qxIgY-w&autoplay=1", color:"#1565c0" },
  { id:"ctv", name:"CTV News",       emoji:"🇨🇦", url:"https://www.youtube.com/embed/live_stream?channel=UCt2RawFZhd-CHQH-yFB6Q8Q&autoplay=1", color:"#e65100" },
  { id:"sky", name:"Sky News",       emoji:"☁️",  url:"https://www.youtube.com/embed/live_stream?channel=UCoMdktPbSTixAyNGwb-UYkQ&autoplay=1", color:"#0d47a1" },
  { id:"dw",  name:"DW News",        emoji:"🇩🇪", url:"https://www.youtube.com/embed/live_stream?channel=UCknLrEdhRCp1aegoMqRaCZg&autoplay=1", color:"#880e4f" },
  { id:"f24", name:"France 24",      emoji:"🇫🇷", url:"https://www.youtube.com/embed/live_stream?channel=UCQfwfsi5VrQ8yKZ-UWmAEFg&autoplay=1", color:"#1a237e" },
];

const CATS = { Music:"🎵", Talk:"💬", News:"📰", Gaming:"🎮", Sports:"⚽", Comedy:"😂", Education:"📚", Other:"🎤" };

// ─── STUN config (Google public STUN — free, no auth needed) ─────────────────
const RTC_CONFIG = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

// ─── Live comment feed ────────────────────────────────────────────────────────
function LiveCommentFeed({ roomId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const data = await liveComments.list(roomId);
      const items = Array.isArray(data) ? data : (data?.items || []);
      setComments(items);
    } catch {}
  }, [roomId]);

  useEffect(() => {
    load();
    pollRef.current = setInterval(load, 3000);
    return () => clearInterval(pollRef.current);
  }, [load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const send = async () => {
    if (!text.trim() || !currentUser) return;
    const msg = text.trim(); setText("");
    try {
      await liveComments.create({
        room_id: roomId, user_id: currentUser.id,
        username: currentUser.username || "user",
        avatar_url: currentUser.avatar_url || "", text: msg,
      });
      load();
    } catch {}
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      <div style={{ flex:1, overflowY:"auto", padding:"10px 14px", display:"flex", flexDirection:"column", gap:7 }}>
        {comments.map(c => (
          <div key={c.id} style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
            <img src={c.avatar_url || `https://ui-avatars.com/api/?name=${c.username}&background=random&color=fff&size=40&bold=true`}
              style={{ width:26, height:26, borderRadius:"50%", flexShrink:0, border:"1.5px solid rgba(245,200,66,0.3)" }} />
            <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:10, padding:"5px 10px", maxWidth:"80%" }}>
              <span style={{ color:"#F5C842", fontWeight:700, fontSize:11 }}>@{c.username} </span>
              <span style={{ color:"#e0e0e0", fontSize:13 }}>{c.text}</span>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <div style={{ textAlign:"center", color:"rgba(255,255,255,0.25)", fontSize:13, marginTop:32 }}>💬 Be the first to comment</div>
        )}
        <div ref={bottomRef} />
      </div>
      {currentUser ? (
        <div style={{ display:"flex", gap:8, padding:"10px 14px", borderTop:"1px solid rgba(255,255,255,0.08)", background:"rgba(0,0,0,0.4)", backdropFilter:"blur(10px)" }}>
          <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key==="Enter" && send()}
            placeholder="Say something..." maxLength={200}
            style={{ flex:1, background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:20, padding:"8px 14px", color:"#fff", fontSize:13, outline:"none" }} />
          <button onClick={send} disabled={!text.trim()}
            style={{ background:"#F5C842", border:"none", borderRadius:20, padding:"8px 16px", color:"#0B0C1A", fontWeight:800, fontSize:14, cursor:"pointer", opacity:text.trim()?1:0.4 }}>
            →
          </button>
        </div>
      ) : (
        <div style={{ padding:"10px", textAlign:"center", color:"rgba(255,255,255,0.35)", fontSize:12 }}>Sign in to chat</div>
      )}
    </div>
  );
}

// ─── Go Live Panel ────────────────────────────────────────────────────────────
function GoLivePanel({ currentUser, onClose, onLive }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Talk");
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  const start = async () => {
    if (!title.trim()) return setError("Add a title for your live room.");
    setStarting(true);
    try {
      const room = await liveRooms.create({
        host_id: currentUser.id,
        host_username: currentUser.username || currentUser.email?.split("@")[0] || "host",
        host_avatar: currentUser.avatar_url || "",
        title: title.trim(), category, is_live: true,
        viewer_count: 0, stream_type: "webrtc",
        rtmp_url: "", stream_key: "", hls_url: "",
      });
      onLive(room);
    } catch { setError("Could not start. Try again."); setStarting(false); }
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:7000, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.75)" }} />
      <div style={{ position:"relative", zIndex:7001, background:"linear-gradient(180deg,#1a1040,#0B0C1A)", borderRadius:"24px 24px 0 0", padding:"28px 24px 44px", width:"100%", maxWidth:480 }}>
        <div style={{ width:40, height:4, background:"rgba(255,255,255,0.2)", borderRadius:2, margin:"0 auto 22px" }} />
        <div style={{ color:"#fff", fontWeight:900, fontSize:22, marginBottom:6 }}>🔴 Start a Live Room</div>
        <div style={{ color:"#888", fontSize:13, marginBottom:20 }}>Your camera goes live — anyone on Sachi can join and comment</div>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="What's your live about?" maxLength={80}
          style={{ display:"block", width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(245,200,66,0.2)", borderRadius:12, padding:"13px 14px", color:"#fff", fontSize:15, outline:"none", marginBottom:14 }} />
        <div style={{ marginBottom:16 }}>
          <div style={{ color:"#888", fontSize:12, marginBottom:8 }}>Category</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {Object.entries(CATS).map(([cat, icon]) => (
              <button key={cat} onClick={() => setCategory(cat)}
                style={{ background:category===cat?"rgba(245,200,66,0.2)":"rgba(255,255,255,0.07)", border:category===cat?"1.5px solid #F5C842":"1.5px solid rgba(255,255,255,0.12)", borderRadius:20, padding:"7px 15px", color:category===cat?"#F5C842":"#aaa", fontSize:13, cursor:"pointer", fontWeight:category===cat?700:400 }}>
                {icon} {cat}
              </button>
            ))}
          </div>
        </div>
        {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:12 }}>{error}</div>}
        <button onClick={start} disabled={starting}
          style={{ display:"block", width:"100%", padding:"15px 0", background:"linear-gradient(135deg,#e53935,#c62828)", border:"none", borderRadius:14, color:"#fff", fontWeight:900, fontSize:16, cursor:"pointer", opacity:starting?0.7:1 }}>
          {starting ? "Starting..." : "🔴 Go Live Now"}
        </button>
      </div>
    </div>
  );
}

// ─── HOST LIVE ROOM — WebRTC host with guest support ─────────────────────────
function HostLiveRoom({ room, currentUser, onEnd }) {
  const videoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peersRef = useRef({}); // guestId → RTCPeerConnection
  const guestVideosRef = useRef({}); // guestId → stream
  const [guests, setGuests] = useState([]); // accepted guests with streams
  const [pendingReqs, setPendingReqs] = useState([]);
  const [viewerCount, setViewerCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [showComments, setShowComments] = useState(true);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);

  useEffect(() => {
    // Start camera
    navigator.mediaDevices.getUserMedia({ video: { facingMode:"user", width:{ ideal:1280 }, height:{ ideal:720 } }, audio: true })
      .then(stream => {
        localStreamRef.current = stream;
        if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      }).catch(() => {});

    const timer = setInterval(() => setElapsed(p => p+1), 1000);

    // Poll room stats + guest requests
    const poll = setInterval(async () => {
      try {
        const r = await liveRooms.get(room.id);
        setViewerCount(r.viewer_count || 0);
      } catch {}
      try {
        const d = await guestReqs.list(room.id);
        const items = Array.isArray(d) ? d : (d?.items || []);
        setPendingReqs(items.filter(r => r.status === "pending"));
        // Handle WebRTC signaling for accepted guests
        for (const req of items.filter(r => r.status === "accepted")) {
          await processGuestSignal(req);
        }
      } catch {}
    }, 2500);

    return () => {
      clearInterval(timer); clearInterval(poll);
      if (localStreamRef.current) localStreamRef.current.getTracks().forEach(t => t.stop());
      Object.values(peersRef.current).forEach(pc => pc.close());
    };
  }, [room.id]);

  const processGuestSignal = async (req) => {
    if (!req.notes) return; // notes stores JSON signaling data
    let sig;
    try { sig = JSON.parse(req.notes); } catch { return; }

    const guestId = req.id;
    if (sig.type === "offer" && !peersRef.current[guestId]) {
      // New guest connection — create peer connection
      const pc = new RTCPeerConnection(RTC_CONFIG);
      peersRef.current[guestId] = pc;

      // Add local tracks so guest can hear/see host
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => pc.addTrack(t, localStreamRef.current));
      }

      // Handle incoming guest tracks
      const guestStream = new MediaStream();
      pc.ontrack = (e) => {
        e.streams[0]?.getTracks().forEach(t => guestStream.addTrack(t));
        guestVideosRef.current[guestId] = guestStream;
        setGuests(gs => {
          const existing = gs.find(g => g.id === guestId);
          if (existing) return gs.map(g => g.id===guestId ? {...g, stream: guestStream} : g);
          return [...gs, { id: guestId, username: req.username, avatar_url: req.avatar_url, stream: guestStream }];
        });
      };

      pc.onicecandidate = async (e) => {
        if (e.candidate) {
          // Store ICE candidate in guest request notes
          const current = await guestReqs.list(room.id);
          const items = Array.isArray(current) ? current : (current?.items || []);
          const mine = items.find(r => r.id === guestId);
          if (mine) {
            let existingSig = {};
            try { existingSig = JSON.parse(mine.notes || "{}"); } catch {}
            const candidates = existingSig.hostCandidates || [];
            candidates.push(e.candidate);
            await guestReqs.update(guestId, { notes: JSON.stringify({ ...existingSig, hostCandidates: candidates }) });
          }
        }
      };

      await pc.setRemoteDescription({ type:"offer", sdp: sig.sdp });
      if (sig.candidates) {
        for (const c of sig.candidates) { try { await pc.addIceCandidate(c); } catch {} }
      }
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      // Store answer back in the request
      await guestReqs.update(guestId, { notes: JSON.stringify({ type:"answer", sdp: answer.sdp, from:"host" }) });
    }
  };

  const acceptGuest = async (req) => {
    await guestReqs.update(req.id, { status: "accepted", notes: req.notes || "" });
    setPendingReqs(p => p.filter(r => r.id !== req.id));
  };

  const declineGuest = async (req) => {
    await guestReqs.update(req.id, { status: "declined" });
    setPendingReqs(p => p.filter(r => r.id !== req.id));
  };

  const removeGuest = async (guest) => {
    if (peersRef.current[guest.id]) { peersRef.current[guest.id].close(); delete peersRef.current[guest.id]; }
    await guestReqs.update(guest.id, { status: "removed" });
    setGuests(gs => gs.filter(g => g.id !== guest.id));
  };

  const endLive = async () => {
    if (localStreamRef.current) localStreamRef.current.getTracks().forEach(t => t.stop());
    Object.values(peersRef.current).forEach(pc => pc.close());
    await liveRooms.update(room.id, { is_live: false, viewer_count: 0 });
    onEnd();
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(t => { t.enabled = muted; });
      setMuted(!muted);
    }
  };

  const toggleCam = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(t => { t.enabled = camOff; });
      setCamOff(!camOff);
    }
  };

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <div style={{ position:"fixed", inset:0, zIndex:8000, background:"#000", display:"flex" }}>
      {/* Main video area */}
      <div style={{ flex:1, position:"relative", overflow:"hidden" }}>
        {/* Host video */}
        <video ref={videoRef} autoPlay muted playsInline
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", transform:"scaleX(-1)" }} />

        {/* Gradient overlays */}
        <div style={{ position:"absolute", top:0, inset:"0 0 auto", height:120, background:"linear-gradient(to bottom,rgba(0,0,0,0.75),transparent)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:0, inset:"auto 0 0", height:180, background:"linear-gradient(to top,rgba(0,0,0,0.85),transparent)", pointerEvents:"none" }} />

        {/* Top bar */}
        <div style={{ position:"absolute", top:16, left:16, right:16, display:"flex", alignItems:"center", justifyContent:"space-between", zIndex:10 }}>
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ background:"#e53935", borderRadius:6, padding:"4px 10px", color:"#fff", fontWeight:900, fontSize:12, letterSpacing:1, boxShadow:"0 0 12px rgba(229,57,53,0.8)" }}>🔴 LIVE</div>
            <div style={{ background:"rgba(0,0,0,0.55)", borderRadius:6, padding:"4px 10px", color:"#fff", fontWeight:700, fontSize:12 }}>{fmt(elapsed)}</div>
            <div style={{ background:"rgba(0,0,0,0.55)", borderRadius:6, padding:"4px 10px", color:"#fff", fontWeight:700, fontSize:12 }}>👁 {viewerCount}</div>
          </div>
          <button onClick={endLive} style={{ background:"#e53935", border:"none", borderRadius:20, padding:"7px 18px", color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer" }}>End Live</button>
        </div>

        {/* Room title */}
        <div style={{ position:"absolute", top:58, left:16, color:"#fff", fontWeight:700, fontSize:15, textShadow:"0 2px 8px rgba(0,0,0,0.9)" }}>{room.title}</div>

        {/* Guest video panels */}
        {guests.length > 0 && (
          <div style={{ position:"absolute", bottom:120, right:12, display:"flex", flexDirection:"column", gap:8, zIndex:10 }}>
            {guests.slice(0,3).map(g => (
              <GuestVideoPanel key={g.id} guest={g} onRemove={() => removeGuest(g)} />
            ))}
          </div>
        )}

        {/* Guest request notifications */}
        {pendingReqs.length > 0 && (
          <div style={{ position:"absolute", top:100, right:12, display:"flex", flexDirection:"column", gap:8, zIndex:10, maxWidth:210 }}>
            {pendingReqs.slice(0,3).map(r => (
              <div key={r.id} style={{ background:"rgba(11,12,26,0.92)", borderRadius:14, padding:"12px 14px", border:"1px solid rgba(245,200,66,0.35)", backdropFilter:"blur(10px)" }}>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8 }}>
                  <img src={r.avatar_url || `https://ui-avatars.com/api/?name=${r.username}&background=random&color=fff&size=40&bold=true`} style={{ width:34, height:34, borderRadius:"50%", border:"2px solid #F5C842" }} />
                  <div>
                    <div style={{ color:"#fff", fontWeight:700, fontSize:13 }}>@{r.username}</div>
                    <div style={{ color:"#F5C842", fontSize:11 }}>🙋 Wants to join</div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  <button onClick={() => acceptGuest(r)} style={{ flex:1, background:"#4caf50", border:"none", borderRadius:8, padding:"7px 0", color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer" }}>✓ Accept</button>
                  <button onClick={() => declineGuest(r)} style={{ flex:1, background:"rgba(229,57,53,0.8)", border:"none", borderRadius:8, padding:"7px 0", color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer" }}>✕ Decline</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom controls */}
        <div style={{ position:"absolute", bottom:24, left:"50%", transform:"translateX(-50%)", display:"flex", gap:14, zIndex:10 }}>
          <button onClick={toggleMute} style={{ background:muted?"#e53935":"rgba(255,255,255,0.18)", backdropFilter:"blur(8px)", border:"none", borderRadius:"50%", width:52, height:52, color:"#fff", fontSize:22, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {muted ? "🔇" : "🎤"}
          </button>
          <button onClick={toggleCam} style={{ background:camOff?"#e53935":"rgba(255,255,255,0.18)", backdropFilter:"blur(8px)", border:"none", borderRadius:"50%", width:52, height:52, color:"#fff", fontSize:22, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {camOff ? "📵" : "📹"}
          </button>
          <button onClick={() => setShowComments(s => !s)} style={{ background:"rgba(245,200,66,0.18)", backdropFilter:"blur(8px)", border:"none", borderRadius:"50%", width:52, height:52, color:"#F5C842", fontSize:22, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            💬
          </button>
        </div>
      </div>

      {/* Comment sidebar */}
      {showComments && (
        <div style={{ width:290, background:"rgba(11,12,26,0.97)", borderLeft:"1px solid rgba(255,255,255,0.08)", display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"14px 16px", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ color:"#F5C842", fontWeight:800, fontSize:14 }}>💬 Live Chat</div>
            <div style={{ color:"#888", fontSize:12 }}>{viewerCount} watching</div>
          </div>
          <div style={{ flex:1, overflow:"hidden" }}>
            <LiveCommentFeed roomId={room.id} currentUser={currentUser} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Guest Video Panel (shown in host view) ───────────────────────────────────
function GuestVideoPanel({ guest, onRemove }) {
  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current && guest.stream) {
      videoRef.current.srcObject = guest.stream;
      videoRef.current.play().catch(() => {});
    }
  }, [guest.stream]);

  return (
    <div style={{ position:"relative", width:120, height:160, borderRadius:14, overflow:"hidden", border:"2px solid #F5C842", background:"#111" }}>
      <video ref={videoRef} autoPlay playsInline style={{ width:"100%", height:"100%", objectFit:"cover", transform:"scaleX(-1)" }} />
      <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(to top,rgba(0,0,0,0.9),transparent)", padding:"6px 8px" }}>
        <div style={{ color:"#fff", fontSize:11, fontWeight:700 }}>@{guest.username}</div>
        <div style={{ background:"rgba(245,200,66,0.9)", borderRadius:4, padding:"1px 6px", color:"#0B0C1A", fontSize:9, fontWeight:800, display:"inline-block", marginTop:2 }}>GUEST</div>
      </div>
      <button onClick={onRemove} style={{ position:"absolute", top:4, right:4, background:"rgba(229,57,53,0.85)", border:"none", borderRadius:"50%", width:22, height:22, color:"#fff", fontSize:11, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
    </div>
  );
}

// ─── VIEWER LIVE ROOM — watch stream + chat + request to join ─────────────────
function ViewerLiveRoom({ room, currentUser, onClose }) {
  const [viewerCount, setViewerCount] = useState(room.viewer_count || 0);
  const [reqStatus, setReqStatus] = useState(null); // null | pending | accepted | declined | removed
  const [myReqId, setMyReqId] = useState(null);
  const [roomEnded, setRoomEnded] = useState(false);
  // WebRTC for when guest is accepted
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    // Bump viewer count
    liveRooms.update(room.id, { viewer_count: (room.viewer_count || 0) + 1 }).catch(() => {});

    pollRef.current = setInterval(async () => {
      try {
        const r = await liveRooms.get(room.id);
        setViewerCount(r.viewer_count || 0);
        if (!r.is_live) setRoomEnded(true);
      } catch {}
      if (myReqId) {
        try {
          const d = await guestReqs.list(room.id);
          const items = Array.isArray(d) ? d : (d?.items || []);
          const mine = items.find(r => r.id === myReqId);
          if (mine) {
            setReqStatus(mine.status);
            if (mine.status === "accepted") handleGuestAccepted(mine);
          }
        } catch {}
      }
    }, 3000);

    return () => {
      clearInterval(pollRef.current);
      liveRooms.update(room.id, { viewer_count: Math.max(0, viewerCount - 1) }).catch(() => {});
      if (localStreamRef.current) localStreamRef.current.getTracks().forEach(t => t.stop());
      if (pcRef.current) pcRef.current.close();
    };
  }, [room.id, myReqId]);

  const handleGuestAccepted = async (req) => {
    if (pcRef.current || reqStatus === "connected") return;
    // Start WebRTC as guest
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode:"user" }, audio: true });
      localStreamRef.current = stream;

      const pc = new RTCPeerConnection(RTC_CONFIG);
      pcRef.current = pc;

      stream.getTracks().forEach(t => pc.addTrack(t, stream));

      pc.ontrack = (e) => {
        if (remoteVideoRef.current && e.streams[0]) {
          remoteVideoRef.current.srcObject = e.streams[0];
          remoteVideoRef.current.play().catch(() => {});
        }
      };

      const iceCandidates = [];
      pc.onicecandidate = (e) => { if (e.candidate) iceCandidates.push(e.candidate); };
      pc.onicegatheringstatechange = async () => {
        if (pc.iceGatheringState === "complete") {
          const offer = pc.localDescription;
          // Write offer to req.notes for host to pick up
          await guestReqs.update(req.id, {
            notes: JSON.stringify({ type:"offer", sdp: offer.sdp, candidates: iceCandidates })
          });
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Poll for host answer
      let answered = false;
      const answerPoll = setInterval(async () => {
        if (answered) { clearInterval(answerPoll); return; }
        try {
          const d = await guestReqs.list(room.id);
          const items = Array.isArray(d) ? d : (d?.items || []);
          const mine = items.find(r => r.id === req.id);
          if (!mine?.notes) return;
          let sig; try { sig = JSON.parse(mine.notes); } catch { return; }
          if (sig.type === "answer" && sig.from === "host" && !answered) {
            answered = true;
            clearInterval(answerPoll);
            await pc.setRemoteDescription({ type:"answer", sdp: sig.sdp });
            if (sig.hostCandidates) {
              for (const c of sig.hostCandidates) { try { await pc.addIceCandidate(c); } catch {} }
            }
            setReqStatus("connected");
          }
        } catch {}
      }, 2000);
    } catch (e) { console.error("WebRTC guest error", e); }
  };

  const requestToJoin = async () => {
    if (!currentUser) return;
    setReqStatus("pending");
    try {
      const req = await guestReqs.create({
        room_id: room.id, user_id: currentUser.id,
        username: currentUser.username || "user",
        avatar_url: currentUser.avatar_url || "",
        status: "pending", notes: "",
      });
      setMyReqId(req.id);
    } catch { setReqStatus(null); }
  };

  if (roomEnded) {
    return (
      <div style={{ position:"fixed", inset:0, zIndex:8000, background:"#0B0C1A", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
        <div style={{ fontSize:60 }}>📴</div>
        <div style={{ color:"#fff", fontWeight:800, fontSize:22 }}>Live Room Ended</div>
        <div style={{ color:"#888", fontSize:14 }}>The host ended this stream</div>
        <button onClick={onClose} style={{ background:"#F5C842", border:"none", borderRadius:20, padding:"12px 32px", color:"#0B0C1A", fontWeight:800, fontSize:15, cursor:"pointer", marginTop:8 }}>Back to LIVE</button>
      </div>
    );
  }

  return (
    <div style={{ position:"fixed", inset:0, zIndex:8000, background:"#0B0C1A", display:"flex", flexDirection:"column" }}>
      {/* Stream area — shows host info + if accepted as guest shows local cam */}
      <div style={{ flex:1, position:"relative", background:"linear-gradient(145deg,#1a0a2e,#0B0C1A)", overflow:"hidden" }}>
        {/* If connected as guest, show remote (host) video */}
        {reqStatus === "connected" && (
          <video ref={remoteVideoRef} autoPlay playsInline style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
        )}

        {/* Host info card */}
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, pointerEvents:"none" }}>
          <div style={{ position:"relative" }}>
            <img src={room.host_avatar || `https://ui-avatars.com/api/?name=${room.host_username}&background=random&color=fff&size=120&bold=true`}
              style={{ width:90, height:90, borderRadius:"50%", border:"3px solid #e53935", boxShadow:"0 0 30px rgba(229,57,53,0.5)" }} />
            <div style={{ position:"absolute", bottom:-4, left:"50%", transform:"translateX(-50%)", background:"#e53935", borderRadius:4, padding:"2px 8px", color:"#fff", fontWeight:900, fontSize:10, letterSpacing:1, whiteSpace:"nowrap" }}>🔴 LIVE</div>
          </div>
          <div style={{ color:"#fff", fontWeight:800, fontSize:17 }}>@{room.host_username}</div>
          <div style={{ color:"#F5C842", fontWeight:700, fontSize:15, textAlign:"center", padding:"0 32px" }}>{room.title}</div>
          <div style={{ color:"#888", fontSize:13 }}>{CATS[room.category] || "🎤"} {room.category} · 👁 {viewerCount} watching</div>
          {reqStatus === "connected" && (
            <div style={{ background:"rgba(76,175,80,0.2)", border:"1px solid #4caf50", borderRadius:12, padding:"8px 20px", color:"#4caf50", fontWeight:700, fontSize:13, pointerEvents:"none" }}>
              ✅ You're live as a guest!
            </div>
          )}
        </div>

        {/* Top bar */}
        <div style={{ position:"absolute", top:16, left:16, right:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <button onClick={onClose} style={{ background:"rgba(0,0,0,0.55)", backdropFilter:"blur(8px)", border:"none", borderRadius:"50%", width:40, height:40, color:"#fff", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          <div style={{ background:"rgba(0,0,0,0.55)", backdropFilter:"blur(8px)", borderRadius:10, padding:"5px 12px", color:"#fff", fontSize:12, fontWeight:700 }}>👁 {viewerCount}</div>
        </div>

        {/* Request to join button / status */}
        <div style={{ position:"absolute", bottom:24, right:16 }}>
          {!reqStatus && currentUser && (
            <button onClick={requestToJoin}
              style={{ background:"linear-gradient(135deg,#F5C842,#FF9500)", border:"none", borderRadius:24, padding:"10px 20px", color:"#0B0C1A", fontWeight:900, fontSize:14, cursor:"pointer", boxShadow:"0 4px 20px rgba(245,200,66,0.4)", display:"flex", alignItems:"center", gap:6 }}>
              🙋 Request to Join
            </button>
          )}
          {reqStatus === "pending" && (
            <div style={{ background:"rgba(245,200,66,0.15)", border:"1px solid rgba(245,200,66,0.4)", borderRadius:20, padding:"10px 18px", color:"#F5C842", fontWeight:700, fontSize:13 }}>
              ⏳ Waiting for host...
            </div>
          )}
          {reqStatus === "declined" && (
            <div style={{ background:"rgba(229,57,53,0.15)", border:"1px solid rgba(229,57,53,0.4)", borderRadius:20, padding:"10px 18px", color:"#ff6b6b", fontWeight:700, fontSize:13 }}>
              Request declined
            </div>
          )}
        </div>
      </div>

      {/* Chat panel */}
      <div style={{ height:300, background:"rgba(11,12,26,0.98)", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ padding:"10px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ color:"#F5C842", fontWeight:800, fontSize:13 }}>💬 Live Chat</div>
          <div style={{ color:"#888", fontSize:12 }}>{viewerCount} watching</div>
        </div>
        <div style={{ height:248, overflow:"hidden" }}>
          <LiveCommentFeed roomId={room.id} currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
}

// ─── Live Room Card ───────────────────────────────────────────────────────────
function LiveRoomCard({ room, onClick }) {
  return (
    <button onClick={onClick} style={{ background:"rgba(255,255,255,0.04)", border:"1.5px solid rgba(229,57,53,0.25)", borderRadius:16, padding:0, cursor:"pointer", textAlign:"left", overflow:"hidden", position:"relative", width:"100%" }}>
      <div style={{ background:`linear-gradient(135deg, rgba(229,57,53,0.15), rgba(11,12,26,0.9))`, padding:"14px 12px 12px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
          <img src={room.host_avatar || `https://ui-avatars.com/api/?name=${room.host_username}&background=random&color=fff&size=80&bold=true`}
            style={{ width:44, height:44, borderRadius:"50%", border:"2.5px solid #e53935", flexShrink:0 }} />
          <div style={{ minWidth:0 }}>
            <div style={{ color:"#fff", fontWeight:700, fontSize:13, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>@{room.host_username}</div>
            <div style={{ background:"#e53935", borderRadius:4, padding:"2px 7px", color:"#fff", fontWeight:900, fontSize:10, letterSpacing:1, display:"inline-block", marginTop:2 }}>🔴 LIVE</div>
          </div>
        </div>
        <div style={{ color:"#fff", fontWeight:700, fontSize:13, marginBottom:6, lineHeight:1.35, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{room.title}</div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ color:"#888", fontSize:11 }}>{CATS[room.category]||"🎤"} {room.category}</div>
          <div style={{ color:"#aaa", fontSize:11 }}>👁 {room.viewer_count||0}</div>
        </div>
      </div>
    </button>
  );
}

// ─── NEWS CHANNEL VIEWER ──────────────────────────────────────────────────────
function NewsViewer({ channel, onClose }) {
  const [current, setCurrent] = useState(channel);
  return (
    <div style={{ position:"fixed", inset:0, zIndex:8000, background:"#000", display:"flex", flexDirection:"column" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, zIndex:10, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 16px 10px", background:"linear-gradient(to bottom,rgba(0,0,0,0.85),transparent)" }}>
        <button onClick={onClose} style={{ background:"rgba(0,0,0,0.55)", backdropFilter:"blur(6px)", border:"none", borderRadius:"50%", width:40, height:40, color:"#fff", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ background:"#e53935", borderRadius:6, padding:"3px 10px", color:"#fff", fontWeight:900, fontSize:11, letterSpacing:1 }}>🔴 LIVE</div>
          <div style={{ color:"#fff", fontWeight:800, fontSize:15 }}>{current.emoji} {current.name}</div>
        </div>
        <div style={{ width:40 }} />
      </div>
      <iframe src={current.url} style={{ flex:1, border:"none", width:"100%" }} allow="autoplay; encrypted-media" allowFullScreen title={current.name} />
      <div style={{ background:"rgba(11,12,26,0.97)", borderTop:"1px solid rgba(255,255,255,0.08)", padding:"12px 16px", overflowX:"auto", display:"flex", gap:10, flexShrink:0 }}>
        {NEWS_CHANNELS.map(ch => (
          <button key={ch.id} onClick={() => setCurrent(ch)}
            style={{ flexShrink:0, background:current.id===ch.id?`${ch.color}33`:"rgba(255,255,255,0.06)", border:current.id===ch.id?`1.5px solid ${ch.color}`:"1.5px solid transparent", borderRadius:20, padding:"7px 15px", color:"#fff", fontSize:12, fontWeight:current.id===ch.id?700:400, cursor:"pointer", whiteSpace:"nowrap" }}>
            {ch.emoji} {ch.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN LIVE HUB ────────────────────────────────────────────────────────────
export default function SachiLiveHub({ currentUser, onClose, onNeedAuth }) {
  const [tab, setTab] = useState("creators");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNews, setActiveNews] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [showGoLive, setShowGoLive] = useState(false);
  const [myRoom, setMyRoom] = useState(null);
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

  if (activeNews) return <NewsViewer channel={activeNews} onClose={() => setActiveNews(null)} />;
  if (myRoom) return <HostLiveRoom room={myRoom} currentUser={currentUser} onEnd={() => { setMyRoom(null); loadRooms(); }} />;
  if (activeRoom) return <ViewerLiveRoom room={activeRoom} currentUser={currentUser} onClose={() => { setActiveRoom(null); loadRooms(); }} />;

  return (
    <div style={{ position:"fixed", inset:0, zIndex:4500, background:"#0B0C1A", display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ padding:"16px 20px 0", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:"50%", width:38, height:38, color:"#fff", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
            <div>
              <div style={{ color:"#fff", fontWeight:900, fontSize:22 }}>🔴 Sachi LIVE</div>
              <div style={{ color:"#888", fontSize:12 }}>{rooms.length > 0 ? `${rooms.length} live now` : "Be the first to go live"}</div>
            </div>
          </div>
          <button onClick={() => { if (!currentUser) { onNeedAuth(); return; } setShowGoLive(true); }}
            style={{ background:"linear-gradient(135deg,#e53935,#c62828)", border:"none", borderRadius:22, padding:"9px 20px", color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6, boxShadow:"0 4px 16px rgba(229,57,53,0.4)" }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background:"#fff", display:"inline-block", animation:"heartbeat 1.2s ease infinite" }} />
            Go Live
          </button>
        </div>

        <div style={{ display:"flex", background:"rgba(255,255,255,0.07)", borderRadius:24, padding:3, gap:2, marginBottom:4 }}>
          {[["creators","👥 Creator Rooms"],["news","📺 News"]].map(([key,label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ flex:1, background:tab===key?"rgba(229,57,53,0.2)":"none", border:"none", cursor:"pointer", padding:"8px 0", color:tab===key?"#ff6b6b":"rgba(255,255,255,0.45)", fontWeight:tab===key?700:500, fontSize:13, borderRadius:20, transition:"all 0.2s" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 80px" }}>
        {tab === "creators" && (
          <>
            {loading && <div style={{ textAlign:"center", padding:60, color:"#888" }}>Loading...</div>}
            {!loading && rooms.length === 0 && (
              <div style={{ textAlign:"center", padding:"60px 24px" }}>
                <div style={{ fontSize:64, marginBottom:16 }}>🎙️</div>
                <div style={{ color:"#fff", fontWeight:800, fontSize:22, marginBottom:8 }}>No one's live yet</div>
                <div style={{ color:"#888", fontSize:14, marginBottom:28 }}>Start a live room — anyone on Sachi can join, comment, and request to be a guest</div>
                <button onClick={() => { if (!currentUser) { onNeedAuth(); return; } setShowGoLive(true); }}
                  style={{ background:"linear-gradient(135deg,#e53935,#c62828)", border:"none", borderRadius:22, padding:"13px 32px", color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer", boxShadow:"0 4px 20px rgba(229,57,53,0.4)" }}>
                  🔴 Start a Live Room
                </button>
              </div>
            )}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {rooms.map(r => <LiveRoomCard key={r.id} room={r} onClick={() => setActiveRoom(r)} />)}
            </div>
          </>
        )}

        {tab === "news" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {NEWS_CHANNELS.map(ch => (
              <button key={ch.id} onClick={() => setActiveNews(ch)}
                style={{ background:`linear-gradient(135deg,${ch.color}22,rgba(11,12,26,0.8))`, border:`1.5px solid ${ch.color}44`, borderRadius:16, padding:"18px 14px", cursor:"pointer", textAlign:"left" }}>
                <div style={{ fontSize:34, marginBottom:8 }}>{ch.emoji}</div>
                <div style={{ color:"#fff", fontWeight:800, fontSize:14, marginBottom:6 }}>{ch.name}</div>
                <div style={{ background:"#e53935", borderRadius:4, padding:"2px 8px", color:"#fff", fontWeight:800, fontSize:10, letterSpacing:1, display:"inline-block" }}>🔴 LIVE</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {showGoLive && (
        <GoLivePanel currentUser={currentUser} onClose={() => setShowGoLive(false)}
          onLive={room => { setShowGoLive(false); setMyRoom(room); }} />
      )}
    </div>
  );
}
