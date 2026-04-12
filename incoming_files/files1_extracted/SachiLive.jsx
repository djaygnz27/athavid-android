// SachiLive.jsx — Sachi LIVE Hub v3.0 — with Gift System
import React, { useState, useEffect, useRef, useCallback } from "react";
import { GiftTray, GiftAnimationOverlay, HostEarningsPanel, CoinWalletWidget, getWallet, GIFTS } from "./SachiGifts.jsx";

const APP_ID = "69b2ee18a8e6fb58c7f0261c";
const BASE_URL = "https://sachi-c7f0261c.base44.app/api";
const APP_BASE = `/apps/${APP_ID}`;

// Auth-aware fetch with proper error handling
async function apiReq(method, path, body) {
  const token = localStorage.getItem("sachi_token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(BASE_URL + path, {
    method, headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || `Error ${res.status}`);
  return data;
}

const liveRooms = {
  list:   ()      => apiReq("GET",  `${APP_BASE}/entities/SachiLiveRoom?sort=-viewer_count&limit=50`),
  get:    (id)    => apiReq("GET",  `${APP_BASE}/entities/SachiLiveRoom/${id}`),
  create: (data)  => apiReq("POST", `${APP_BASE}/entities/SachiLiveRoom`, data),
  update: (id, d) => apiReq("PUT",  `${APP_BASE}/entities/SachiLiveRoom/${id}`, d),
};
const liveComments = {
  list:   (rid)   => apiReq("GET",  `${APP_BASE}/entities/SachiLiveComment?room_id=${rid}&sort=created_date&limit=100`),
  create: (data)  => apiReq("POST", `${APP_BASE}/entities/SachiLiveComment`, data),
};
const guestReqs = {
  list:   (rid)   => apiReq("GET",  `${APP_BASE}/entities/SachiGuestRequest?room_id=${rid}&limit=20`),
  create: (data)  => apiReq("POST", `${APP_BASE}/entities/SachiGuestRequest`, data),
  update: (id, d) => apiReq("PUT",  `${APP_BASE}/entities/SachiGuestRequest/${id}`, d),
};
const sachiGifts = {
  list: (rid) => apiReq("GET", `${APP_BASE}/entities/SachiGift?room_id=${rid}&sort=-created_date&limit=30`),
};

const NEWS_CHANNELS = [
  { id:"dn",  name:"Democracy Now", emoji:"🗽", url:"https://www.youtube.com/embed/live_stream?channel=UCzuqE7-t13O4NIDYJfakERg&autoplay=1", color:"#c62828" },
  { id:"bbc", name:"BBC News",      emoji:"🇬🇧", url:"https://www.youtube.com/embed/live_stream?channel=UC16niRr50-MSBwiO3YDb3RA&autoplay=1", color:"#b71c1c" },
  { id:"alj", name:"Al Jazeera",    emoji:"🌍", url:"https://www.youtube.com/embed/live_stream?channel=UCSNeTbWve-VALqR4qxIgY-w&autoplay=1", color:"#1565c0" },
  { id:"ctv", name:"CTV News",      emoji:"🇨🇦", url:"https://www.youtube.com/embed/live_stream?channel=UCt2RawFZhd-CHQH-yFB6Q8Q&autoplay=1", color:"#e65100" },
  { id:"sky", name:"Sky News",      emoji:"☁️",  url:"https://www.youtube.com/embed/live_stream?channel=UCoMdktPbSTixAyNGwb-UYkQ&autoplay=1", color:"#0d47a1" },
  { id:"dw",  name:"DW News",       emoji:"🇩🇪", url:"https://www.youtube.com/embed/live_stream?channel=UCknLrEdhRCp1aegoMqRaCZg&autoplay=1", color:"#880e4f" },
  { id:"f24", name:"France 24",     emoji:"🇫🇷", url:"https://www.youtube.com/embed/live_stream?channel=UCQfwfsi5VrQ8yKZ-UWmAEFg&autoplay=1", color:"#1a237e" },
];

const CATS = { Music:"🎵", Talk:"💬", News:"📰", Gaming:"🎮", Sports:"⚽", Comedy:"😂", Education:"📚", Other:"🎤" };
const RTC_CONFIG = { iceServers: [{ urls:"stun:stun.l.google.com:19302" },{ urls:"stun:stun1.l.google.com:19302" }] };

// ── Live Comment Feed ─────────────────────────────────────────────────────────
function LiveCommentFeed({ roomId, currentUser, gifts }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const data = await liveComments.list(roomId);
      setComments(Array.isArray(data) ? data : (data?.items || []));
    } catch {}
  }, [roomId]);

  useEffect(() => { load(); const t = setInterval(load, 3000); return () => clearInterval(t); }, [load]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [comments, gifts]);

  const send = async () => {
    if (!text.trim() || !currentUser) return;
    const msg = text.trim(); setText("");
    try {
      await liveComments.create({ room_id:roomId, user_id:currentUser.id, username:currentUser.username||"user", avatar_url:currentUser.avatar_url||"", text:msg });
      load();
    } catch {}
  };

  // Merge comments + gift events into a single timeline
  const timeline = [
    ...comments.map(c => ({ ...c, _type:"comment", _ts: new Date(c.created_date).getTime() })),
    ...(gifts||[]).map(g => ({ ...g, _type:"gift",    _ts: new Date(g.created_date||Date.now()).getTime() })),
  ].sort((a,b) => a._ts - b._ts);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      <div style={{ flex:1, overflowY:"auto", padding:"10px 12px", display:"flex", flexDirection:"column", gap:6 }}>
        {timeline.map((item, i) => item._type === "gift" ? (
          <div key={`g${i}`} style={{ display:"flex", alignItems:"center", gap:8, background:`${(GIFTS.find(g=>g.id===item.gift_id)||GIFTS[0]).color}18`, borderRadius:10, padding:"6px 10px", border:`1px solid ${(GIFTS.find(g=>g.id===item.gift_id)||GIFTS[0]).color}33` }}>
            <span style={{ fontSize:18 }}>{item.gift_emoji}</span>
            <span style={{ color:"#F5C842", fontWeight:700, fontSize:11 }}>@{item.sender_username}</span>
            <span style={{ color:"#ccc", fontSize:11 }}>sent {item.gift_name} {item.quantity>1?`×${item.quantity}`:""}</span>
            <span style={{ marginLeft:"auto", fontSize:11, color:"#888" }}>🪙{(item.coin_cost*(item.quantity||1)).toLocaleString()}</span>
          </div>
        ) : (
          <div key={`c${i}`} style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
            <img src={item.avatar_url||`https://ui-avatars.com/api/?name=${item.username}&background=random&color=fff&size=40&bold=true`}
              style={{ width:26, height:26, borderRadius:"50%", flexShrink:0, border:"1.5px solid rgba(124,77,255,0.3)" }} />
            <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:10, padding:"5px 10px", maxWidth:"80%" }}>
              <span style={{ color:"#b388ff", fontWeight:700, fontSize:11 }}>@{item.username} </span>
              <span style={{ color:"#e0e0e0", fontSize:13 }}>{item.text}</span>
            </div>
          </div>
        ))}
        {timeline.length === 0 && <div style={{ textAlign:"center", color:"rgba(255,255,255,0.2)", fontSize:13, marginTop:32 }}>💬 Be the first to say something</div>}
        <div ref={bottomRef} />
      </div>
      {currentUser ? (
        <div style={{ display:"flex", gap:8, padding:"8px 12px", borderTop:"1px solid rgba(255,255,255,0.06)", background:"rgba(0,0,0,0.4)", backdropFilter:"blur(10px)" }}>
          <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder="Say something..." maxLength={200}
            style={{ flex:1, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:20, padding:"8px 14px", color:"#fff", fontSize:13, outline:"none" }} />
          <button onClick={send} disabled={!text.trim()}
            style={{ background:"linear-gradient(135deg,#7c4dff,#651fff)", border:"none", borderRadius:20, padding:"8px 16px", color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer", opacity:text.trim()?1:0.4 }}>→</button>
        </div>
      ) : <div style={{ padding:"10px", textAlign:"center", color:"rgba(255,255,255,0.3)", fontSize:12 }}>Sign in to chat</div>}
    </div>
  );
}

// ── Go Live Panel ─────────────────────────────────────────────────────────────
function GoLivePanel({ currentUser, onClose, onLive }) {
  const [title, setTitle] = useState(""); const [category, setCategory] = useState("Talk");
  const [starting, setStarting] = useState(false); const [error, setError] = useState("");
  const start = async () => {
    if (!title.trim()) return setError("Add a title for your live room.");
    setStarting(true);
    try {
      const room = await liveRooms.create({ host_id:currentUser.id, host_username:currentUser.username||currentUser.email?.split("@")[0]||"host", host_avatar:currentUser.avatar_url||"", title:title.trim(), category, is_live:true, viewer_count:0, stream_type:"webrtc", rtmp_url:"", stream_key:"", hls_url:"" });
      onLive(room);
    } catch { setError("Could not start. Try again."); setStarting(false); }
  };
  return (
    <div style={{ position:"fixed", inset:0, zIndex:7000, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.75)" }} />
      <div style={{ position:"relative", zIndex:7001, background:"linear-gradient(180deg,#1a1040,#0B0C1A)", borderRadius:"24px 24px 0 0", padding:"28px 24px 44px", width:"100%", maxWidth:480 }}>
        <div style={{ width:40, height:4, background:"rgba(255,255,255,0.2)", borderRadius:2, margin:"0 auto 22px" }} />
        <div style={{ color:"#fff", fontWeight:900, fontSize:22, marginBottom:6 }}>🔴 Start a Live Room</div>
        <div style={{ color:"#888", fontSize:13, marginBottom:20 }}>Go live — viewers can gift you coins & earn real money</div>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="What's your live about?" maxLength={80}
          style={{ display:"block", width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(124,77,255,0.3)", borderRadius:12, padding:"13px 14px", color:"#fff", fontSize:15, outline:"none", marginBottom:14 }} />
        <div style={{ marginBottom:16 }}>
          <div style={{ color:"#888", fontSize:12, marginBottom:8 }}>Category</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {Object.entries(CATS).map(([cat,icon]) => (
              <button key={cat} onClick={()=>setCategory(cat)} style={{ background:category===cat?"rgba(124,77,255,0.2)":"rgba(255,255,255,0.07)", border:category===cat?"1.5px solid #7c4dff":"1.5px solid rgba(255,255,255,0.12)", borderRadius:20, padding:"7px 15px", color:category===cat?"#b388ff":"#aaa", fontSize:13, cursor:"pointer", fontWeight:category===cat?700:400 }}>{icon} {cat}</button>
            ))}
          </div>
        </div>
        {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:12 }}>{error}</div>}
        <button onClick={start} disabled={starting} style={{ display:"block", width:"100%", padding:"15px 0", background:"linear-gradient(135deg,#7c4dff,#651fff)", border:"none", borderRadius:14, color:"#fff", fontWeight:900, fontSize:16, cursor:"pointer", opacity:starting?0.7:1, boxShadow:"0 4px 20px rgba(124,77,255,0.4)" }}>
          {starting ? "Starting..." : "🔴 Go Live Now"}
        </button>
      </div>
    </div>
  );
}

// ── Guest Video Panel ─────────────────────────────────────────────────────────
function GuestVideoPanel({ guest, onRemove }) {
  const videoRef = useRef(null);
  useEffect(() => { if (videoRef.current && guest.stream) { videoRef.current.srcObject = guest.stream; videoRef.current.play().catch(()=>{}); } }, [guest.stream]);
  return (
    <div style={{ position:"relative", width:120, height:160, borderRadius:14, overflow:"hidden", border:"2px solid #7c4dff", background:"#111" }}>
      <video ref={videoRef} autoPlay playsInline style={{ width:"100%", height:"100%", objectFit:"cover", transform:"scaleX(-1)" }} />
      <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(to top,rgba(0,0,0,0.9),transparent)", padding:"6px 8px" }}>
        <div style={{ color:"#fff", fontSize:11, fontWeight:700 }}>@{guest.username}</div>
        <div style={{ background:"rgba(124,77,255,0.9)", borderRadius:4, padding:"1px 6px", color:"#fff", fontSize:9, fontWeight:800, display:"inline-block", marginTop:2 }}>GUEST</div>
      </div>
      <button onClick={onRemove} style={{ position:"absolute", top:4, right:4, background:"rgba(229,57,53,0.85)", border:"none", borderRadius:"50%", width:22, height:22, color:"#fff", fontSize:11, cursor:"pointer" }}>✕</button>
    </div>
  );
}

// ── HOST LIVE ROOM ────────────────────────────────────────────────────────────
function HostLiveRoom({ room, currentUser, onEnd }) {
  const videoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peersRef = useRef({});
  const guestVideosRef = useRef({});
  const [guests, setGuests] = useState([]);
  const [pendingReqs, setPendingReqs] = useState([]);
  const [viewerCount, setViewerCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [showComments, setShowComments] = useState(true);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [showGiftTray, setShowGiftTray] = useState(false);
  const [showEarnings, setShowEarnings] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [roomGifts, setRoomGifts] = useState([]);
  const [activeGiftAnim, setActiveGiftAnim] = useState(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video:{ facingMode:"user", width:{ideal:1280}, height:{ideal:720} }, audio:true })
      .then(stream => { localStreamRef.current=stream; if(videoRef.current){videoRef.current.srcObject=stream;videoRef.current.play();} }).catch(()=>{});
    const timer = setInterval(() => setElapsed(p=>p+1), 1000);
    getWallet(currentUser.id).then(w=>setWallet(w)).catch(()=>{});
    const poll = setInterval(async()=>{
      try { const r=await liveRooms.get(room.id); setViewerCount(r.viewer_count||0); } catch{}
      try { const d=await guestReqs.list(room.id); const items=Array.isArray(d)?d:(d?.items||[]); setPendingReqs(items.filter(r=>r.status==="pending")); for(const req of items.filter(r=>r.status==="accepted")) await processGuestSignal(req); } catch{}
      try { const g=await sachiGifts.list(room.id); setRoomGifts(Array.isArray(g)?g:(g?.items||[])); } catch{}
    }, 3000);
    return ()=>{ clearInterval(timer); clearInterval(poll); if(localStreamRef.current)localStreamRef.current.getTracks().forEach(t=>t.stop()); Object.values(peersRef.current).forEach(pc=>pc.close()); };
  }, [room.id]);

  const processGuestSignal = async(req) => {
    if(!req.notes) return;
    let sig; try { sig=JSON.parse(req.notes); } catch { return; }
    const guestId=req.id;
    if(sig.type==="offer"&&!peersRef.current[guestId]){
      const pc=new RTCPeerConnection(RTC_CONFIG); peersRef.current[guestId]=pc;
      if(localStreamRef.current) localStreamRef.current.getTracks().forEach(t=>pc.addTrack(t,localStreamRef.current));
      const guestStream=new MediaStream();
      pc.ontrack=(e)=>{ e.streams[0]?.getTracks().forEach(t=>guestStream.addTrack(t)); guestVideosRef.current[guestId]=guestStream; setGuests(gs=>{ const ex=gs.find(g=>g.id===guestId); if(ex)return gs.map(g=>g.id===guestId?{...g,stream:guestStream}:g); return[...gs,{id:guestId,username:req.username,avatar_url:req.avatar_url,stream:guestStream}]; }); };
      pc.onicecandidate=async(e)=>{ if(e.candidate){ const cur=await guestReqs.list(room.id); const items=Array.isArray(cur)?cur:(cur?.items||[]); const mine=items.find(r=>r.id===guestId); if(mine){let es={};try{es=JSON.parse(mine.notes||"{}");}catch{} const cands=es.hostCandidates||[]; cands.push(e.candidate); await guestReqs.update(guestId,{notes:JSON.stringify({...es,hostCandidates:cands})}); } } };
      await pc.setRemoteDescription({type:"offer",sdp:sig.sdp});
      if(sig.candidates) for(const c of sig.candidates){try{await pc.addIceCandidate(c);}catch{}}
      const answer=await pc.createAnswer(); await pc.setLocalDescription(answer);
      await guestReqs.update(guestId,{notes:JSON.stringify({type:"answer",sdp:answer.sdp,from:"host"})});
    }
  };

  const handleGiftSent = (gift) => { setActiveGiftAnim(gift); setTimeout(()=>setActiveGiftAnim(null), 3500); };
  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <div style={{ position:"fixed", inset:0, zIndex:8000, background:"#000", display:"flex" }}>
      {/* Gift animations */}
      {activeGiftAnim && <GiftAnimationOverlay gift={activeGiftAnim} sender={currentUser} />}

      {/* Main video */}
      <div style={{ flex:1, position:"relative", overflow:"hidden" }}>
        <video ref={videoRef} autoPlay muted playsInline style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", transform:"scaleX(-1)" }} />
        <div style={{ position:"absolute", top:0, inset:"0 0 auto", height:120, background:"linear-gradient(to bottom,rgba(0,0,0,0.8),transparent)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:0, inset:"auto 0 0", height:200, background:"linear-gradient(to top,rgba(0,0,0,0.9),transparent)", pointerEvents:"none" }} />

        {/* Top bar */}
        <div style={{ position:"absolute", top:16, left:16, right:16, display:"flex", alignItems:"center", justifyContent:"space-between", zIndex:10 }}>
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ background:"linear-gradient(135deg,#7c4dff,#651fff)", borderRadius:6, padding:"4px 10px", color:"#fff", fontWeight:900, fontSize:12, letterSpacing:1, boxShadow:"0 0 12px rgba(124,77,255,0.8)" }}>🔴 LIVE</div>
            <div style={{ background:"rgba(0,0,0,0.55)", borderRadius:6, padding:"4px 10px", color:"#fff", fontWeight:700, fontSize:12 }}>{fmt(elapsed)}</div>
            <div style={{ background:"rgba(0,0,0,0.55)", borderRadius:6, padding:"4px 10px", color:"#fff", fontWeight:700, fontSize:12 }}>👁 {viewerCount}</div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>setShowEarnings(true)} style={{ background:"linear-gradient(135deg,rgba(245,200,66,0.25),rgba(245,200,66,0.1))", border:"1px solid rgba(245,200,66,0.4)", borderRadius:20, padding:"6px 12px", color:"#F5C842", fontWeight:800, fontSize:12, cursor:"pointer" }}>
              💰 Earnings
            </button>
            <button onClick={async()=>{ if(localStreamRef.current)localStreamRef.current.getTracks().forEach(t=>t.stop()); Object.values(peersRef.current).forEach(pc=>pc.close()); await liveRooms.update(room.id,{is_live:false,viewer_count:0}); onEnd(); }} style={{ background:"rgba(229,57,53,0.8)", border:"none", borderRadius:20, padding:"6px 14px", color:"#fff", fontWeight:800, fontSize:12, cursor:"pointer" }}>End</button>
          </div>
        </div>

        <div style={{ position:"absolute", top:58, left:16, color:"#fff", fontWeight:700, fontSize:14, textShadow:"0 2px 8px rgba(0,0,0,0.9)" }}>{room.title}</div>

        {/* Guest panels */}
        {guests.length>0 && <div style={{ position:"absolute", bottom:130, right:12, display:"flex", flexDirection:"column", gap:8, zIndex:10 }}>{guests.slice(0,3).map(g=><GuestVideoPanel key={g.id} guest={g} onRemove={async()=>{ if(peersRef.current[g.id]){peersRef.current[g.id].close();delete peersRef.current[g.id];} await guestReqs.update(g.id,{status:"removed"}); setGuests(gs=>gs.filter(x=>x.id!==g.id)); }} />)}</div>}

        {/* Pending guest requests */}
        {pendingReqs.length>0 && <div style={{ position:"absolute", top:100, right:12, display:"flex", flexDirection:"column", gap:8, zIndex:10, maxWidth:210 }}>
          {pendingReqs.slice(0,3).map(r=>(
            <div key={r.id} style={{ background:"rgba(11,12,26,0.92)", borderRadius:14, padding:"12px 14px", border:"1px solid rgba(124,77,255,0.35)", backdropFilter:"blur(10px)" }}>
              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8 }}>
                <img src={r.avatar_url||`https://ui-avatars.com/api/?name=${r.username}&background=random&color=fff&size=40&bold=true`} style={{ width:34, height:34, borderRadius:"50%", border:"2px solid #7c4dff" }} />
                <div><div style={{ color:"#fff", fontWeight:700, fontSize:13 }}>@{r.username}</div><div style={{ color:"#b388ff", fontSize:11 }}>🙋 Wants to join</div></div>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <button onClick={async()=>{ await guestReqs.update(r.id,{status:"accepted",notes:r.notes||""}); setPendingReqs(p=>p.filter(x=>x.id!==r.id)); }} style={{ flex:1, background:"#4caf50", border:"none", borderRadius:8, padding:"7px 0", color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer" }}>✓ Accept</button>
                <button onClick={async()=>{ await guestReqs.update(r.id,{status:"declined"}); setPendingReqs(p=>p.filter(x=>x.id!==r.id)); }} style={{ flex:1, background:"rgba(229,57,53,0.8)", border:"none", borderRadius:8, padding:"7px 0", color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer" }}>✕ Decline</button>
              </div>
            </div>
          ))}
        </div>}

        {/* Bottom controls */}
        <div style={{ position:"absolute", bottom:24, left:"50%", transform:"translateX(-50%)", display:"flex", gap:12, zIndex:10 }}>
          {[
            { icon:muted?"🔇":"🎤", action:()=>{ if(localStreamRef.current)localStreamRef.current.getAudioTracks().forEach(t=>{t.enabled=muted;}); setMuted(!muted); }, active:muted },
            { icon:camOff?"📵":"📹", action:()=>{ if(localStreamRef.current)localStreamRef.current.getVideoTracks().forEach(t=>{t.enabled=camOff;}); setCamOff(!camOff); }, active:camOff },
            { icon:"💬", action:()=>setShowComments(s=>!s), active:false },
          ].map((btn,i)=>(
            <button key={i} onClick={btn.action} style={{ background:btn.active?"rgba(229,57,53,0.8)":"rgba(255,255,255,0.12)", backdropFilter:"blur(8px)", border:"none", borderRadius:"50%", width:50, height:50, color:"#fff", fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>{btn.icon}</button>
          ))}
          <button onClick={()=>setShowGiftTray(true)} style={{ background:"linear-gradient(135deg,rgba(124,77,255,0.4),rgba(101,0,255,0.4))", backdropFilter:"blur(8px)", border:"1.5px solid rgba(124,77,255,0.6)", borderRadius:"50%", width:50, height:50, color:"#fff", fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 16px rgba(124,77,255,0.4)" }}>🎁</button>
        </div>
      </div>

      {/* Comment sidebar */}
      {showComments && (
        <div style={{ width:280, background:"rgba(11,12,26,0.97)", borderLeft:"1px solid rgba(124,77,255,0.1)", display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ color:"#b388ff", fontWeight:800, fontSize:13 }}>💬 Live Chat</div>
            <div style={{ color:"#888", fontSize:12 }}>{viewerCount} watching</div>
          </div>
          <div style={{ flex:1, overflow:"hidden" }}><LiveCommentFeed roomId={room.id} currentUser={currentUser} gifts={roomGifts} /></div>
        </div>
      )}

      {showGiftTray && <GiftTray room={room} currentUser={currentUser} wallet={wallet} onWalletUpdate={c=>setWallet(w=>({...w,coins:c}))} onClose={()=>setShowGiftTray(false)} onGiftSent={handleGiftSent} />}
      {showEarnings && <HostEarningsPanel currentUser={currentUser} onClose={()=>setShowEarnings(false)} />}
    </div>
  );
}

// ── VIEWER LIVE ROOM ──────────────────────────────────────────────────────────
function ViewerLiveRoom({ room, currentUser, onClose }) {
  const [viewerCount, setViewerCount] = useState(room.viewer_count||0);
  const [reqStatus, setReqStatus] = useState(null);
  const [myReqId, setMyReqId] = useState(null);
  const [roomEnded, setRoomEnded] = useState(false);
  const [showGiftTray, setShowGiftTray] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [roomGifts, setRoomGifts] = useState([]);
  const [activeGiftAnim, setActiveGiftAnim] = useState(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    liveRooms.update(room.id,{viewer_count:(room.viewer_count||0)+1}).catch(()=>{});
    if(currentUser) getWallet(currentUser.id).then(w=>setWallet(w)).catch(()=>{});
    const poll = setInterval(async()=>{
      try{ const r=await liveRooms.get(room.id); setViewerCount(r.viewer_count||0); if(!r.is_live)setRoomEnded(true); }catch{}
      try{ const g=await sachiGifts.list(room.id); const items=Array.isArray(g)?g:(g?.items||[]); if(items.length>roomGifts.length&&items[0]){ setActiveGiftAnim(items[0]); setTimeout(()=>setActiveGiftAnim(null),3500); } setRoomGifts(items); }catch{}
      if(myReqId){
        try{ const d=await guestReqs.list(room.id); const items=Array.isArray(d)?d:(d?.items||[]); const mine=items.find(r=>r.id===myReqId); if(mine){setReqStatus(mine.status);if(mine.status==="accepted")handleGuestAccepted(mine);} }catch{}
      }
    }, 3000);
    return ()=>{ clearInterval(poll); liveRooms.update(room.id,{viewer_count:Math.max(0,viewerCount-1)}).catch(()=>{}); if(localStreamRef.current)localStreamRef.current.getTracks().forEach(t=>t.stop()); if(pcRef.current)pcRef.current.close(); };
  }, [room.id, myReqId]);

  const handleGuestAccepted = async(req) => {
    if(pcRef.current||reqStatus==="connected") return;
    try {
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user"},audio:true});
      localStreamRef.current=stream;
      const pc=new RTCPeerConnection(RTC_CONFIG); pcRef.current=pc;
      stream.getTracks().forEach(t=>pc.addTrack(t,stream));
      pc.ontrack=(e)=>{ if(remoteVideoRef.current&&e.streams[0]){remoteVideoRef.current.srcObject=e.streams[0];remoteVideoRef.current.play().catch(()=>{});} };
      const iceCandidates=[];
      pc.onicecandidate=(e)=>{ if(e.candidate)iceCandidates.push(e.candidate); };
      pc.onicegatheringstatechange=async()=>{
        if(pc.iceGatheringState==="complete"){
          const offer=pc.localDescription;
          await guestReqs.update(req.id,{notes:JSON.stringify({type:"offer",sdp:offer.sdp,candidates:iceCandidates})});
        }
      };
      const offer=await pc.createOffer(); await pc.setLocalDescription(offer);
      let answered=false;
      const ap=setInterval(async()=>{
        if(answered){clearInterval(ap);return;}
        try{ const d=await guestReqs.list(room.id); const items=Array.isArray(d)?d:(d?.items||[]); const mine=items.find(r=>r.id===req.id); if(!mine?.notes)return; let sig;try{sig=JSON.parse(mine.notes);}catch{return;} if(sig.type==="answer"&&sig.from==="host"&&!answered){answered=true;clearInterval(ap);await pc.setRemoteDescription({type:"answer",sdp:sig.sdp});if(sig.hostCandidates)for(const c of sig.hostCandidates){try{await pc.addIceCandidate(c);}catch{}}setReqStatus("connected");} }catch{}
      }, 2000);
    } catch(e){console.error(e);}
  };

  const handleGiftSent = (gift) => { setActiveGiftAnim(gift); setTimeout(()=>setActiveGiftAnim(null), 3500); };

  if(roomEnded) return (
    <div style={{ position:"fixed", inset:0, zIndex:8000, background:"#0B0C1A", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
      <div style={{ fontSize:60 }}>📴</div>
      <div style={{ color:"#fff", fontWeight:800, fontSize:22 }}>Live Room Ended</div>
      <div style={{ color:"#888", fontSize:14 }}>The host ended this stream</div>
      <button onClick={onClose} style={{ background:"linear-gradient(135deg,#7c4dff,#651fff)", border:"none", borderRadius:20, padding:"12px 32px", color:"#fff", fontWeight:800, fontSize:15, cursor:"pointer", marginTop:8 }}>← Back to LIVE</button>
    </div>
  );

  return (
    <div style={{ position:"fixed", inset:0, zIndex:8000, background:"#0B0C1A", display:"flex", flexDirection:"column" }}>
      {activeGiftAnim && <GiftAnimationOverlay gift={activeGiftAnim} sender={null} />}

      <div style={{ flex:1, position:"relative", background:"linear-gradient(145deg,#1a0a2e,#0B0C1A)", overflow:"hidden" }}>
        {reqStatus==="connected" && <video ref={remoteVideoRef} autoPlay playsInline style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />}
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, pointerEvents:"none" }}>
          <div style={{ position:"relative" }}>
            <img src={room.host_avatar||`https://ui-avatars.com/api/?name=${room.host_username}&background=random&color=fff&size=120&bold=true`}
              style={{ width:90, height:90, borderRadius:"50%", border:"3px solid #7c4dff", boxShadow:"0 0 30px rgba(124,77,255,0.6)" }} />
            <div style={{ position:"absolute", bottom:-4, left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,#7c4dff,#651fff)", borderRadius:4, padding:"2px 8px", color:"#fff", fontWeight:900, fontSize:10, whiteSpace:"nowrap" }}>🔴 LIVE</div>
          </div>
          <div style={{ color:"#fff", fontWeight:800, fontSize:17 }}>@{room.host_username}</div>
          <div style={{ color:"#b388ff", fontWeight:700, fontSize:15, textAlign:"center", padding:"0 32px" }}>{room.title}</div>
          <div style={{ color:"#888", fontSize:13 }}>{CATS[room.category]||"🎤"} {room.category} · 👁 {viewerCount} watching</div>
          {reqStatus==="connected" && <div style={{ background:"rgba(76,175,80,0.2)", border:"1px solid #4caf50", borderRadius:12, padding:"8px 20px", color:"#4caf50", fontWeight:700, fontSize:13, pointerEvents:"auto" }}>✅ You're live as a guest!</div>}
        </div>

        {/* Top bar */}
        <div style={{ position:"absolute", top:16, left:16, right:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <button onClick={onClose} style={{ background:"rgba(0,0,0,0.55)", backdropFilter:"blur(8px)", border:"none", borderRadius:"50%", width:40, height:40, color:"#fff", fontSize:18, cursor:"pointer" }}>✕</button>
          <div style={{ background:"rgba(0,0,0,0.55)", borderRadius:10, padding:"5px 12px", color:"#fff", fontSize:12, fontWeight:700 }}>👁 {viewerCount}</div>
        </div>

        {/* Bottom action buttons */}
        <div style={{ position:"absolute", bottom:24, right:16, display:"flex", flexDirection:"column", gap:10, alignItems:"flex-end" }}>
          {currentUser && (
            <button onClick={()=>setShowGiftTray(true)}
              style={{ background:"linear-gradient(135deg,#7c4dff,#651fff)", border:"none", borderRadius:24, padding:"12px 20px", color:"#fff", fontWeight:900, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", gap:8, boxShadow:"0 4px 20px rgba(124,77,255,0.5)" }}>
              🎁 Send Gift
              {wallet && <span style={{ background:"rgba(255,255,255,0.2)", borderRadius:10, padding:"2px 8px", fontSize:12 }}>🪙{(wallet.coins||0).toLocaleString()}</span>}
            </button>
          )}
          {!reqStatus && currentUser && (
            <button onClick={async()=>{ setReqStatus("pending"); try{ const r=await guestReqs.create({room_id:room.id,user_id:currentUser.id,username:currentUser.username||"user",avatar_url:currentUser.avatar_url||"",status:"pending",notes:""}); setMyReqId(r.id); }catch{setReqStatus(null);} }}
              style={{ background:"rgba(255,255,255,0.1)", backdropFilter:"blur(8px)", border:"1.5px solid rgba(255,255,255,0.2)", borderRadius:24, padding:"10px 18px", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>
              🙋 Request to Join
            </button>
          )}
          {reqStatus==="pending" && <div style={{ background:"rgba(245,200,66,0.15)", border:"1px solid rgba(245,200,66,0.4)", borderRadius:20, padding:"10px 18px", color:"#F5C842", fontWeight:700, fontSize:13 }}>⏳ Waiting for host...</div>}
          {reqStatus==="declined" && <div style={{ background:"rgba(229,57,53,0.15)", border:"1px solid rgba(229,57,53,0.4)", borderRadius:20, padding:"10px 18px", color:"#ff6b6b", fontWeight:700, fontSize:13 }}>Request declined</div>}
        </div>
      </div>

      {/* Chat */}
      <div style={{ height:280, background:"rgba(11,12,26,0.98)", borderTop:"1px solid rgba(124,77,255,0.1)" }}>
        <div style={{ padding:"8px 16px", borderBottom:"1px solid rgba(255,255,255,0.05)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ color:"#b388ff", fontWeight:800, fontSize:13 }}>💬 Live Chat</div>
          <div style={{ color:"#888", fontSize:12 }}>{viewerCount} watching</div>
        </div>
        <div style={{ height:236, overflow:"hidden" }}><LiveCommentFeed roomId={room.id} currentUser={currentUser} gifts={roomGifts} /></div>
      </div>

      {showGiftTray && <GiftTray room={room} currentUser={currentUser} wallet={wallet} onWalletUpdate={c=>setWallet(w=>({...w,coins:c}))} onClose={()=>setShowGiftTray(false)} onGiftSent={handleGiftSent} />}
    </div>
  );
}

// ── News Channel Viewer ───────────────────────────────────────────────────────
function NewsViewer({ channel, onClose }) {
  const [current, setCurrent] = useState(channel);
  return (
    <div style={{ position:"fixed", inset:0, zIndex:8000, background:"#000", display:"flex", flexDirection:"column" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, zIndex:10, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 16px 10px", background:"linear-gradient(to bottom,rgba(0,0,0,0.85),transparent)" }}>
        <button onClick={onClose} style={{ background:"rgba(0,0,0,0.55)", backdropFilter:"blur(6px)", border:"none", borderRadius:"50%", width:40, height:40, color:"#fff", fontSize:18, cursor:"pointer" }}>✕</button>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ background:"linear-gradient(135deg,#7c4dff,#651fff)", borderRadius:6, padding:"3px 10px", color:"#fff", fontWeight:900, fontSize:11, letterSpacing:1 }}>🔴 LIVE</div>
          <div style={{ color:"#fff", fontWeight:800, fontSize:15 }}>{current.emoji} {current.name}</div>
        </div>
        <div style={{ width:40 }} />
      </div>
      <iframe src={current.url} style={{ flex:1, border:"none", width:"100%" }} allow="autoplay; encrypted-media" allowFullScreen title={current.name} />
      <div style={{ background:"rgba(11,12,26,0.97)", borderTop:"1px solid rgba(124,77,255,0.1)", padding:"12px 16px", overflowX:"auto", display:"flex", gap:10, flexShrink:0 }}>
        {NEWS_CHANNELS.map(ch=>(
          <button key={ch.id} onClick={()=>setCurrent(ch)} style={{ flexShrink:0, background:current.id===ch.id?`${ch.color}33`:"rgba(255,255,255,0.06)", border:current.id===ch.id?`1.5px solid ${ch.color}`:"1.5px solid transparent", borderRadius:20, padding:"7px 15px", color:"#fff", fontSize:12, fontWeight:current.id===ch.id?700:400, cursor:"pointer", whiteSpace:"nowrap" }}>{ch.emoji} {ch.name}</button>
        ))}
      </div>
    </div>
  );
}

// ── Live Room Card ────────────────────────────────────────────────────────────
function LiveRoomCard({ room, onClick }) {
  // Stable decorative gift index — don't call Math.random() in render
  const gDef = React.useMemo(() => GIFTS[room.id ? (room.id.charCodeAt(0) % 3) : 0], [room.id]);
  return (
    <button onClick={onClick} style={{ background:"rgba(255,255,255,0.04)", border:"1.5px solid rgba(124,77,255,0.2)", borderRadius:18, padding:0, cursor:"pointer", textAlign:"left", overflow:"hidden", width:"100%", position:"relative" }}>
      {/* Aurora glow top bar */}
      <div style={{ height:3, background:"linear-gradient(90deg,#7c4dff,#00bcd4,#F5C842)", width:"100%" }} />
      <div style={{ padding:"14px 12px 12px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
          <img src={room.host_avatar||`https://ui-avatars.com/api/?name=${room.host_username}&background=random&color=fff&size=80&bold=true`}
            style={{ width:44, height:44, borderRadius:"50%", border:"2.5px solid #7c4dff", flexShrink:0 }} />
          <div style={{ minWidth:0 }}>
            <div style={{ color:"#fff", fontWeight:700, fontSize:13, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>@{room.host_username}</div>
            <div style={{ background:"linear-gradient(135deg,#7c4dff,#651fff)", borderRadius:4, padding:"2px 7px", color:"#fff", fontWeight:900, fontSize:10, letterSpacing:1, display:"inline-block", marginTop:2 }}>🔴 LIVE</div>
          </div>
        </div>
        <div style={{ color:"#fff", fontWeight:700, fontSize:13, marginBottom:6, lineHeight:1.35, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{room.title}</div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ color:"#888", fontSize:11 }}>{CATS[room.category]||"🎤"} {room.category}</div>
          <div style={{ color:"#888", fontSize:11 }}>👁 {room.viewer_count||0}</div>
        </div>
      </div>
    </button>
  );
}

// ── MAIN LIVE HUB ─────────────────────────────────────────────────────────────
export default function SachiLiveHub({ currentUser, onClose, onNeedAuth }) {
  const [tab, setTab] = useState("creators");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNews, setActiveNews] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [showGoLive, setShowGoLive] = useState(false);
  const [myRoom, setMyRoom] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [showEarnings, setShowEarnings] = useState(false);

  const loadRooms = useCallback(async()=>{
    try{ const data=await liveRooms.list(); setRooms((Array.isArray(data)?data:(data?.items||[])).filter(r=>r.is_live)); }catch{}
    setLoading(false);
  }, []);

  useEffect(()=>{
    loadRooms();
    if(currentUser) getWallet(currentUser.id).then(w=>setWallet(w)).catch(()=>{});
    const t=setInterval(loadRooms,8000);
    return()=>clearInterval(t);
  },[loadRooms, currentUser]);

  if(activeNews) return <NewsViewer channel={activeNews} onClose={()=>setActiveNews(null)} />;
  if(myRoom) return <HostLiveRoom room={myRoom} currentUser={currentUser} onEnd={()=>{setMyRoom(null);loadRooms();}} />;
  if(activeRoom) return <ViewerLiveRoom room={activeRoom} currentUser={currentUser} onClose={()=>{setActiveRoom(null);loadRooms();}} />;

  return (
    <div style={{ position:"fixed", inset:0, zIndex:4500, background:"#0B0C1A", display:"flex", flexDirection:"column" }}>
      {/* Aurora gradient top accent */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#7c4dff,#00bcd4,#F5C842,#ff6b6b,#7c4dff)", backgroundSize:"200% 100%", zIndex:10 }} />

      <div style={{ padding:"20px 20px 0", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:"50%", width:38, height:38, color:"#fff", fontSize:18, cursor:"pointer" }}>✕</button>
            <div>
              <div style={{ color:"#fff", fontWeight:900, fontSize:22 }}>🔴 Sachi LIVE</div>
              <div style={{ color:"#888", fontSize:12 }}>{rooms.length>0?`${rooms.length} rooms live`:"Be the first to go live"}</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            {currentUser && (
              <>
                {wallet !== null && (
                  <button onClick={()=>setShowEarnings(true)} style={{ background:"linear-gradient(135deg,rgba(245,200,66,0.15),rgba(245,200,66,0.05))", border:"1px solid rgba(245,200,66,0.3)", borderRadius:20, padding:"6px 12px", color:"#F5C842", fontWeight:700, fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
                    🪙 {(wallet?.coins||0).toLocaleString()}
                  </button>
                )}
                <button onClick={()=>setShowGoLive(true)}
                  style={{ background:"linear-gradient(135deg,#7c4dff,#651fff)", border:"none", borderRadius:22, padding:"9px 18px", color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6, boxShadow:"0 4px 16px rgba(124,77,255,0.45)" }}>
                  <span style={{ width:8,height:8,borderRadius:"50%",background:"#ff6b6b",display:"inline-block" }} />
                  Go Live
                </button>
              </>
            )}
            {!currentUser && (
              <button onClick={onNeedAuth} style={{ background:"linear-gradient(135deg,#7c4dff,#651fff)", border:"none", borderRadius:22, padding:"9px 18px", color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer" }}>Sign In</button>
            )}
          </div>
        </div>

        <div style={{ display:"flex", background:"rgba(255,255,255,0.06)", borderRadius:24, padding:3, gap:2, marginBottom:4 }}>
          {[["creators","👥 Creator Rooms"],["news","📺 News"]].map(([key,label])=>(
            <button key={key} onClick={()=>setTab(key)} style={{ flex:1, background:tab===key?"rgba(124,77,255,0.2)":"none", border:"none", cursor:"pointer", padding:"8px 0", color:tab===key?"#b388ff":"rgba(255,255,255,0.4)", fontWeight:tab===key?700:500, fontSize:13, borderRadius:20, transition:"all 0.2s" }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 80px" }}>
        {tab==="creators" && (
          <>
            {loading && <div style={{ textAlign:"center",padding:60,color:"#888" }}>Loading...</div>}
            {!loading&&rooms.length===0 && (
              <div style={{ textAlign:"center", padding:"60px 24px" }}>
                <div style={{ fontSize:64, marginBottom:16 }}>🎙️</div>
                <div style={{ color:"#fff", fontWeight:800, fontSize:22, marginBottom:8 }}>No one's live yet</div>
                <div style={{ color:"#888", fontSize:14, marginBottom:12 }}>Start a live — viewers can send you gifts</div>
                <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:28 }}>
                  {["🌸 Sakura","💎 Crystal","🌌 Aurora","👑 Cosmos"].map(g=>(
                    <div key={g} style={{ background:"rgba(124,77,255,0.12)", border:"1px solid rgba(124,77,255,0.25)", borderRadius:12, padding:"8px 12px", color:"#b388ff", fontSize:12, fontWeight:600 }}>{g}</div>
                  ))}
                </div>
                {currentUser
                  ? <button onClick={()=>setShowGoLive(true)} style={{ background:"linear-gradient(135deg,#7c4dff,#651fff)", border:"none", borderRadius:22, padding:"13px 32px", color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer", boxShadow:"0 4px 20px rgba(124,77,255,0.4)" }}>🔴 Start a Live Room</button>
                  : <button onClick={onNeedAuth} style={{ background:"linear-gradient(135deg,#7c4dff,#651fff)", border:"none", borderRadius:22, padding:"13px 32px", color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer" }}>Sign In to Go Live</button>
                }
              </div>
            )}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {rooms.map(r=><LiveRoomCard key={r.id} room={r} onClick={()=>setActiveRoom(r)} />)}
            </div>
          </>
        )}
        {tab==="news" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {NEWS_CHANNELS.map(ch=>(
              <button key={ch.id} onClick={()=>setActiveNews(ch)} style={{ background:`linear-gradient(135deg,${ch.color}22,rgba(11,12,26,0.8))`, border:`1.5px solid ${ch.color}44`, borderRadius:18, padding:"18px 14px", cursor:"pointer", textAlign:"left" }}>
                <div style={{ fontSize:34, marginBottom:8 }}>{ch.emoji}</div>
                <div style={{ color:"#fff", fontWeight:800, fontSize:14, marginBottom:6 }}>{ch.name}</div>
                <div style={{ background:"linear-gradient(135deg,#7c4dff,#651fff)", borderRadius:4, padding:"2px 8px", color:"#fff", fontWeight:800, fontSize:10, letterSpacing:1, display:"inline-block" }}>🔴 LIVE</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {showGoLive && <GoLivePanel currentUser={currentUser} onClose={()=>setShowGoLive(false)} onLive={room=>{setShowGoLive(false);setMyRoom(room);}} />}
      {showEarnings && <HostEarningsPanel currentUser={currentUser} onClose={()=>setShowEarnings(false)} />}
    </div>
  );
}
