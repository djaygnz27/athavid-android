// ⛔ LOCKED — PodcastPage.jsx
// DO NOT MODIFY unless fixing a PodcastPage-specific bug.
// Last verified working: 2026-05-23

import React, { useState, useEffect } from "react";
import { request } from "./api.js";
import RecentEpisodes from "./RecentEpisodes.jsx";

function PodcastPage({ currentUser, onNeedAuth }) {
  const CATEGORIES = ["All","News & Politics","Business","Entertainment","Comedy","Sports","Technology","Health & Wellness","True Crime","Education"];
  const [podcasts, setPodcasts] = useState([]);
  const [myShows, setMyShows] = useState([]);
  const [loadingPodcasts, setLoadingPodcasts] = useState(true);
  const [selectedCat, setSelectedCat] = useState("All");
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [podcastEpisodes, setPodcastEpisodes] = useState([]);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerForm, setRegisterForm] = useState({ title:"", host_name:"", description:"", category:"Business", live_stream_url:"", coverIdx:0 });
  const [registering, setRegistering] = useState(false);
  const [registerDone, setRegisterDone] = useState(false);
  const [toast, setToast] = useState(null);
  const [goingLive, setGoingLive] = useState(false);
  const [loadingStreamKey, setLoadingStreamKey] = useState(false);
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [streamCreds, setStreamCreds] = useState(null);
  const [endingLive, setEndingLive] = useState(false);
  const [editingStream, setEditingStream] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [newStreamUrl, setNewStreamUrl] = useState("");
  const [liveNewsChannel, setLiveNewsChannel] = useState(null);

  const LIVE_NEWS_CHANNELS = [
    { id:"ctv",   name:"CTV News",      emoji:"🍁", desc:"Canada's #1 news network",     color:"linear-gradient(135deg,#c62828,#b71c1c)", url:"https://www.youtube.com/embed/live_stream?channel=UCt2BNvKMDuNg38w2MgI4mIA&autoplay=1" },
    { id:"dn",    name:"Democracy Now", emoji:"✊", desc:"Independent global news",      color:"linear-gradient(135deg,#4a148c,#1a237e)", url:"https://www.youtube.com/embed/live_stream?channel=UC3KEoMzNz8eYnwBC34RaKCQ&autoplay=1" },
    { id:"bbc",   name:"BBC News",      emoji:"🇬🇧", desc:"Global news from London",      color:"linear-gradient(135deg,#b71c1c,#880e4f)", url:"https://www.youtube.com/embed/live_stream?channel=UC16niRr50-MSBwiO3YDb3RA&autoplay=1" },
    { id:"aljaz", name:"Al Jazeera",    emoji:"🌍", desc:"Breaking news worldwide",       color:"linear-gradient(135deg,#1b5e20,#004d40)", url:"https://www.youtube.com/embed/live_stream?channel=UCNye-wNBqNL5ZzHSJj3l8Bg&autoplay=1" },
    { id:"sky",   name:"Sky News",      emoji:"🌐", desc:"Live from the UK",              color:"linear-gradient(135deg,#0277bd,#01579b)", url:"https://www.youtube.com/embed/live_stream?channel=UCiU6U_f2KO7P6LFID9eQ4bA&autoplay=1" },
    { id:"dw",    name:"DW News",       emoji:"🇩🇪", desc:"International news in English", color:"linear-gradient(135deg,#37474f,#263238)", url:"https://www.youtube.com/embed/live_stream?channel=UCknLrEdhRCp1aegoMqRaCZg&autoplay=1" },
    { id:"france",name:"France 24",     emoji:"🇫🇷", desc:"Global news in English",       color:"linear-gradient(135deg,#1565c0,#e53935)", url:"https://www.youtube.com/embed/live_stream?channel=UCQfwfsi5VrQ8yKZ-UWmAoBw&autoplay=1" },
  ];

  const showToast = (msg, type="success", ms=3000) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), ms);
  };

  useEffect(() => { loadPodcasts(); }, []);
  useEffect(() => { if (currentUser) loadMyShows(); }, [currentUser]);

  const loadPodcasts = async () => {
    setLoadingPodcasts(true);
    try {
      const APP_ID = "69e79122bcc8fb5a04cfb834";
      const data = await request("GET", `/apps/${APP_ID}/entities/SachiPodcast?status=Active`);
      const list = Array.isArray(data) ? data : (data.records || data.items || []);
      setPodcasts(list);
    } catch(e) {
      console.error("loadPodcasts failed:", e);
    } finally {
      setLoadingPodcasts(false);
    }
  };

  const loadMyShows = async () => {
    if (!currentUser) return;
    try {
      const APP_ID = "69e79122bcc8fb5a04cfb834";
      const data = await request("GET", `/apps/${APP_ID}/entities/SachiPodcast`);
      const all = Array.isArray(data) ? data : (data.records || data.items || []);
      const mine = all.filter(p =>
        p.host_user_id === currentUser.id ||
        p.host_username === (currentUser.full_name || currentUser.email?.split("@")[0]) ||
        p.created_by === currentUser.email ||
        currentUser.email === "jaygnz27@gmail.com" ||
        currentUser.email === "lasanjaya@gmail.com"
      );
      setMyShows(mine);
    } catch(e) { console.error("loadMyShows failed:", e); }
  };

  const filtered = selectedCat === "All" ? podcasts : podcasts.filter(p => p.category === selectedCat);
  const livePodcasts = filtered.filter(p => p.is_live);
  const regularPodcasts = filtered.filter(p => !p.is_live);

  const handleRegister = async () => {
    if (!registerForm.title || !registerForm.host_name) return;
    setRegistering(true);
    try {
      const cover = PODCAST_COVER_COLORS[registerForm.coverIdx || 0];
      await request("POST", `/apps/69e79122bcc8fb5a04cfb834/entities/SachiPodcast`, {
        title: registerForm.title,
        host_name: registerForm.host_name,
        description: registerForm.description,
        category: registerForm.category,
        live_stream_url: registerForm.live_stream_url || "",
        cover_color: cover.bg,
        cover_emoji: cover.emoji,
        status: "Active",
        is_live: false,
        listener_count: 0,
        episode_count: 0,
        follower_count: 0,
        host_user_id: currentUser?.id || "",
        host_username: currentUser?.full_name || currentUser?.email?.split("@")[0] || "",
      });
      setRegisterDone(true);
      await loadPodcasts();
      await loadMyShows();
      // Send welcome email to host
      fetch("https://app.base44.com/api/apps/69e79122bcc8fb5a04cfb834/functions/podcastWelcome" /* TODO: redeploy */, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          host_email: currentUser?.email || "",
          host_name: registerForm.host_name,
          podcast_title: registerForm.title,
          category: registerForm.category,
        })
      }).catch(() => {});
      setRegisterForm({ title:"", host_name:"", description:"", category:"Business", live_stream_url:"", coverIdx:0 });
    } catch(e) {
      console.error(e);
      showToast("Something went wrong. Please try again.", "error");
    }
    setRegistering(false);
  };

  // ── PODCAST DETAIL ──
  // Episode Player Overlay
  if (selectedEpisode) {
    const epUrl = selectedEpisode.live_stream_url || selectedEpisode.audio_url || selectedEpisode.video_url || "";
    const getEpEmbed = (url) => {
      if (!url) return null;
      if (url.includes("youtube.com/watch")) return url.replace("watch?v=","embed/").split("&")[0]+"?autoplay=1";
      if (url.includes("youtu.be/")) return "https://www.youtube.com/embed/"+url.split("youtu.be/")[1].split("?")[0]+"?autoplay=1";
      if (url.includes("rumble.com/embed")) return url.includes("?") ? url : url+"?pub=4";
      if (url.includes("rumble.com")) {
        // Convert regular rumble page URL to embed: rumble.com/vXXXX-title.html -> rumble.com/embed/vXXXX/
        const rmMatch = url.match(/rumble\.com\/(v[\w]+)-/);
        if (rmMatch) return `https://rumble.com/embed/${rmMatch[1]}/?pub=4`;
        return url; // fallback
      }
      if (url.includes("spotify.com/show/") || url.includes("spotify.com/episode/")) {
        const id = url.split("/").pop().split("?")[0];
        return url.includes("/episode/") ? `https://open.spotify.com/embed/episode/${id}` : `https://open.spotify.com/embed/show/${id}`;
      }
      return url;
    };
    const embedUrl = getEpEmbed(epUrl);
    return (
      <div style={{ position:"fixed", inset:0, background:"#0B0C1A", zIndex:200, display:"flex", flexDirection:"column" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.08)", flexShrink:0 }}>
          <button onClick={() => setSelectedEpisode(null)} style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:10, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#fff", fontSize:18 }}>←</button>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ color:"#fff", fontWeight:700, fontSize:15, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{selectedEpisode.title}</div>
            <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12 }}>Episode {selectedEpisode.episode_number}</div>
          </div>
        </div>
        {/* Player */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:20 }}>
          {embedUrl && (embedUrl.includes("youtube.com/embed") || embedUrl.includes("spotify.com/embed") || embedUrl.includes("rumble.com/embed")) ? (
            <iframe
              src={embedUrl}
              style={{ width:"100%", maxWidth:700, height: embedUrl.includes("spotify") ? 232 : "56vw", maxHeight:500, borderRadius:16, border:"none" }}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          ) : (
            <div style={{ width:"100%", maxWidth:500, background:"rgba(255,255,255,0.05)", borderRadius:20, padding:32, textAlign:"center" }}>
              <div style={{ fontSize:64, marginBottom:16 }}>🎙️</div>
              <div style={{ color:"#fff", fontWeight:700, fontSize:16, marginBottom:8 }}>{selectedEpisode.title}</div>
              {selectedEpisode.description && <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, marginBottom:24, lineHeight:1.6 }}>{selectedEpisode.description}</div>}
              {epUrl ? (
                <a href={epUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display:"inline-block", background:"linear-gradient(135deg,#6c3cf7,#4527a0)", color:"#fff", padding:"14px 28px", borderRadius:50, fontWeight:700, fontSize:15, textDecoration:"none" }}>
                  🎧 Listen Now
                </a>
              ) : (
                <div style={{ color:"rgba(255,255,255,0.3)", fontSize:14 }}>No stream URL available yet</div>
              )}
            </div>
          )}
          {/* Episode info */}
          <div style={{ marginTop:24, width:"100%", maxWidth:500 }}>
            <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, lineHeight:1.7 }}>{selectedEpisode.description}</div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedPodcast) {
    const isHost = currentUser && (
      currentUser.id === selectedPodcast.host_user_id ||
      currentUser.email === selectedPodcast.created_by ||
      (currentUser.full_name && currentUser.full_name === selectedPodcast.host_username) ||
      ((currentUser.email?.split("@")[0]) === selectedPodcast.host_username) ||
      currentUser.email === "jaygnz27@gmail.com" ||
      currentUser.email === "lasanjaya@gmail.com" ||
      currentUser.id === selectedPodcast.created_by_id
    );
    const coverBg = selectedPodcast.cover_color || "linear-gradient(135deg,#1a0a2e,#0d1b4b)";
    const coverEmoji = selectedPodcast.cover_emoji || "🎙️";
    return (
      <div style={{ position:"fixed", inset:0, zIndex:600, background:"#0B0C1A", overflowY:"auto" }}>
        {toast && <Toast msg={toast.msg} type={toast.type} />}
        {/* HERO */}
        <div style={{ position:"relative", height:240, background:coverBg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <button onClick={() => setSelectedPodcast(null)}
            style={{ position:"absolute", top:16, left:16, background:"rgba(0,0,0,0.3)", border:"none", borderRadius:"50%", width:38, height:38, color:"#fff", fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>←</button>
          <div style={{ fontSize:60, marginBottom:10 }}>{coverEmoji}</div>
          <div style={{ color:"#fff", fontWeight:800, fontSize:20, textAlign:"center", padding:"0 60px", textShadow:"0 2px 8px rgba(0,0,0,0.5)" }}>{selectedPodcast.title}</div>
          <div style={{ color:"rgba(255,255,255,0.65)", fontSize:13, marginTop:4 }}>by {selectedPodcast.host_name}</div>
          {selectedPodcast.is_live && (
            <div style={{ position:"absolute", top:16, right:16, background:"#e53935", borderRadius:20, padding:"5px 12px", display:"flex", alignItems:"center", gap:6, animation:"pulse 1.5s infinite" }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#fff" }} />
              <span style={{ color:"#fff", fontWeight:800, fontSize:12 }}>LIVE</span>
            </div>
          )}
          {selectedPodcast.status === "Pending" && (
            <div style={{ position:"absolute", top:16, right:16, background:"rgba(245,200,66,0.9)", borderRadius:20, padding:"5px 12px" }}>
              <span style={{ color:"#000", fontWeight:800, fontSize:11 }}>⏳ PENDING REVIEW</span>
            </div>
          )}
        </div>
        <div style={{ padding:"20px 20px 100px" }}>
          {/* STATS */}
          <div style={{ display:"flex", gap:0, marginBottom:20, background:"rgba(255,255,255,0.04)", borderRadius:16, overflow:"hidden" }}>
            {[
              { val: selectedPodcast.follower_count||0, label:"Followers" },
              { val: selectedPodcast.episode_count||0, label:"Episodes" },
              { val: selectedPodcast.is_live ? (selectedPodcast.listener_count||0) : "—", label:"Listening", red: selectedPodcast.is_live },
            ].map((s,i) => (
              <div key={i} style={{ flex:1, textAlign:"center", padding:"14px 0", borderLeft: i>0?"1px solid rgba(255,255,255,0.06)":"none" }}>
                <div style={{ color: s.red?"#e53935":"#fff", fontWeight:800, fontSize:18 }}>{s.val}</div>
                <div style={{ color:"rgba(255,255,255,0.35)", fontSize:11, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* DESCRIPTION */}
          {selectedPodcast.description ? (
            <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:16, marginBottom:20 }}>
              <div style={{ color:"rgba(255,255,255,0.7)", fontSize:14, lineHeight:1.6 }}>{selectedPodcast.description}</div>
            </div>
          ) : null}

          {/* HOST CONTROLS */}
          {isHost && (
            <div style={{ marginBottom:20 }}>
              <div style={{ color:"#F5C842", fontWeight:700, fontSize:12, letterSpacing:1.2, textTransform:"uppercase", marginBottom:12 }}>🎙️ Host Controls</div>
              {selectedPodcast.is_live ? (
                <>
                  <div style={{ background:"rgba(229,57,53,0.08)", border:"1px solid rgba(229,57,53,0.3)", borderRadius:14, padding:14, marginBottom:12, textAlign:"center" }}>
                    <div style={{ color:"#e53935", fontWeight:700, fontSize:13 }}>🔴 You are currently LIVE</div>
                    <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12, marginTop:4 }}>{selectedPodcast.listener_count||0} listeners tuned in</div>
                  </div>
                  {/* Stream URL editor — available even while live */}
                  <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:14, marginBottom:14 }}>
                    <div style={{ color:"rgba(255,255,255,0.5)", fontSize:12, marginBottom:6 }}>🔗 Stream URL</div>
                    {editingStream ? (
                      <div style={{ display:"flex", gap:8 }}>
                        <input value={newStreamUrl} onChange={e => setNewStreamUrl(e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                          style={{ flex:1, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, padding:"8px 12px", color:"#fff", fontSize:13, outline:"none" }} />
                        <button onClick={async () => {
                          try {
                            await request("PATCH", `/apps/69e79122bcc8fb5a04cfb834/entities/SachiPodcast/${selectedPodcast.id}`, { live_stream_url: newStreamUrl });
                            setSelectedPodcast(p => ({...p, live_stream_url: newStreamUrl}));
                            setEditingStream(false);
                            showToast("✅ Stream URL saved!", "success");
                          } catch(e) { showToast("Failed to save URL", "error"); }
                        }} style={{ background:"#6c3cf7", border:"none", borderRadius:10, padding:"8px 14px", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>Save</button>
                        <button onClick={() => setEditingStream(false)} style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:10, padding:"8px 14px", color:"#fff", fontSize:13, cursor:"pointer" }}>✕</button>
                      </div>
                    ) : (
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <div style={{ color: selectedPodcast.live_stream_url ? "#a78bfa" : "rgba(255,255,255,0.25)", fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"75%" }}>
                          {selectedPodcast.live_stream_url || "No stream URL set yet"}
                        </div>
                        <button onClick={() => { setNewStreamUrl(selectedPodcast.live_stream_url||""); setEditingStream(true); }}
                          style={{ background:"rgba(108,60,247,0.2)", border:"1px solid rgba(108,60,247,0.4)", borderRadius:8, padding:"5px 12px", color:"#a78bfa", fontSize:12, cursor:"pointer", fontWeight:600, flexShrink:0 }}>
                          {selectedPodcast.live_stream_url ? "Edit" : "Add URL"}
                        </button>
                      </div>
                    )}
                  </div>
                  <button onClick={async () => {
                    if (endingLive) return;
                    setEndingLive(true);
                    try {
                      await fetch("https://app.base44.com/api/apps/69e79122bcc8fb5a04cfb834/functions/podcastGoLiveNotify" /* TODO: redeploy */, {
                        method:"POST", headers:{"Content-Type":"application/json"},
                        body:JSON.stringify({ podcast_id:selectedPodcast.id, set_live:false, admin_email: currentUser?.email })
                      }).catch(()=>{});
                      try { await request("PATCH", `/apps/69e79122bcc8fb5a04cfb834/entities/SachiPodcast/${selectedPodcast.id}`, { is_live:false, listener_count:0 }); } catch {}
                      setSelectedPodcast(p => ({...p, is_live:false, listener_count:0}));
                      setPodcasts(ps => ps.map(p => p.id===selectedPodcast.id ? {...p, is_live:false} : p));
                      showToast("✅ Live session ended successfully", "success");
                    } catch(e) { showToast("Failed to end session. Try again.", "error"); }
                    setEndingLive(false);
                  }}
                    style={{ width:"100%", padding:"15px 0", background:endingLive?"rgba(229,57,53,0.3)":"rgba(229,57,53,0.12)", border:"2px solid #e53935", borderRadius:16, color:"#e53935", fontWeight:800, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                    {endingLive ? "Ending..." : "⏹️ End Live Session"}
                  </button>
                </>
              ) : (
                <>
                  {/* Stream URL editor */}
                  <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:14, marginBottom:14 }}>
                    <div style={{ color:"rgba(255,255,255,0.5)", fontSize:12, marginBottom:6 }}>🔗 Stream URL <span style={{ color:"rgba(255,255,255,0.25)" }}>(YouTube Live, Twitch, etc.)</span></div>
                    {editingStream ? (
                      <div style={{ display:"flex", gap:8 }}>
                        <input value={newStreamUrl} onChange={e => setNewStreamUrl(e.target.value)}
                          placeholder="https://youtube.com/live/..."
                          style={{ flex:1, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, padding:"8px 12px", color:"#fff", fontSize:13, outline:"none" }} />
                        <button onClick={async () => {
                          try {
                            await request("PATCH", `/apps/69e79122bcc8fb5a04cfb834/entities/SachiPodcast/${selectedPodcast.id}`, { live_stream_url: newStreamUrl });
                            setSelectedPodcast(p => ({...p, live_stream_url: newStreamUrl}));
                            setEditingStream(false);
                            showToast("✅ Stream URL saved!", "success");
                          } catch(e) { showToast("Failed to save URL", "error"); }
                        }} style={{ background:"#6c3cf7", border:"none", borderRadius:10, padding:"8px 14px", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>Save</button>
                        <button onClick={() => setEditingStream(false)} style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:10, padding:"8px 14px", color:"#fff", fontSize:13, cursor:"pointer" }}>✕</button>
                      </div>
                    ) : (
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <div style={{ color: selectedPodcast.live_stream_url ? "#a78bfa" : "rgba(255,255,255,0.25)", fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"75%" }}>
                          {selectedPodcast.live_stream_url || "No stream URL set yet"}
                        </div>
                        <button onClick={() => { setNewStreamUrl(selectedPodcast.live_stream_url||""); setEditingStream(true); }}
                          style={{ background:"rgba(108,60,247,0.2)", border:"1px solid rgba(108,60,247,0.4)", borderRadius:8, padding:"5px 12px", color:"#a78bfa", fontSize:12, cursor:"pointer", fontWeight:600, flexShrink:0 }}>
                          {selectedPodcast.live_stream_url ? "Edit" : "Add URL"}
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Cloudflare Native Streaming */}
                  <div style={{ background:"rgba(245,200,66,0.06)", border:"1px solid rgba(245,200,66,0.2)", borderRadius:14, padding:14, marginBottom:14 }}>
                    <div style={{ color:"#F5C842", fontSize:12, fontWeight:700, marginBottom:8 }}>🎙️ Native Sachi Live (OBS / Streamlabs)</div>
                    {selectedPodcast.stream_key ? (
                      <>
                        <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11, marginBottom:6 }}>Paste these into OBS → Settings → Stream:</div>
                        <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:8, padding:10, marginBottom:6 }}>
                          <div style={{ color:"rgba(255,255,255,0.4)", fontSize:10, marginBottom:2 }}>RTMP Server</div>
                          <div style={{ color:"#a78bfa", fontSize:12, wordBreak:"break-all", userSelect:"all" }}>rtmps://live.cloudflare.com:443/live/</div>
                        </div>
                        <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:8, padding:10, marginBottom:8 }}>
                          <div style={{ color:"rgba(255,255,255,0.4)", fontSize:10, marginBottom:2 }}>Stream Key</div>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <div style={{ color:"#F5C842", fontSize:12, wordBreak:"break-all", userSelect:"all", flex:1 }}>
                              {showStreamKey ? selectedPodcast.stream_key : "••••••••••••••••••••••••"}
                            </div>
                            <button onClick={() => setShowStreamKey(s => !s)}
                              style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:6, padding:"4px 8px", color:"#fff", fontSize:11, cursor:"pointer" }}>
                              {showStreamKey ? "Hide" : "Show"}
                            </button>
                            <button onClick={() => { navigator.clipboard.writeText(selectedPodcast.stream_key); showToast("✅ Stream key copied!", "success"); }}
                              style={{ background:"rgba(108,60,247,0.3)", border:"none", borderRadius:6, padding:"4px 8px", color:"#a78bfa", fontSize:11, cursor:"pointer" }}>Copy</button>
                          </div>
                        </div>
                        <div style={{ color:"rgba(255,255,255,0.3)", fontSize:10 }}>Your stream saves automatically as an episode after going live 🎬</div>
                      </>
                    ) : (
                      <div>
                        <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12, marginBottom:10 }}>Get your personal RTMP stream key to broadcast live directly on Sachi using OBS or Streamlabs.</div>
                        <button onClick={async () => {
                          if (loadingStreamKey) return;
                          setLoadingStreamKey(true);
                          try {
                            // Route through Vercel serverless proxy to avoid CORS
                            const cfRes = await fetch("https://app.base44.com/api/apps/69e79122bcc8fb5a04cfb834/functions/createLiveStream" /* TODO: redeploy */, {
                              method:"POST",
                              headers:{"Content-Type":"application/json"},
                              body: JSON.stringify({ podcast_id: selectedPodcast.id, podcast_title: selectedPodcast.title, host_username: selectedPodcast.host_username || currentUser?.username })
                            });
                            const cfData = await cfRes.json();
                            if (cfData.success) {
                              setSelectedPodcast(p => ({...p, stream_key: cfData.stream_key, cf_input_id: cfData.cf_input_id, live_stream_url: cfData.playback_url, rtmp_url: cfData.rtmp_url}));
                              showToast("🎙️ Stream key generated!", "success");
                            } else {
                              showToast("Failed: " + (cfData.error || "Unknown error"), "error");
                            }
                          } catch(e) { showToast("Error creating stream", "error"); }
                          setLoadingStreamKey(false);
                        }} style={{ width:"100%", padding:"11px 0", background: loadingStreamKey ? "rgba(245,200,66,0.2)" : "rgba(245,200,66,0.15)", border:"1px solid #F5C842", borderRadius:12, color:"#F5C842", fontWeight:700, fontSize:14, cursor:"pointer" }}>
                          {loadingStreamKey ? "⏳ Generating..." : "⚡ Generate My Stream Key"}
                        </button>
                      </div>
                    )}
                  </div>
                  <button onClick={async () => {
                    if (goingLive) return;
                    setGoingLive(true);
                    try {
                      // Use podcastGoLiveNotify which handles the DB update via service role
                      const resp = await fetch("https://app.base44.com/api/apps/69e79122bcc8fb5a04cfb834/functions/podcastGoLiveNotify" /* TODO: redeploy */, {
                        method:"POST", headers:{"Content-Type":"application/json"},
                        body:JSON.stringify({ podcast_id:selectedPodcast.id, podcast_title:selectedPodcast.title, host_name:selectedPodcast.host_name, live_stream_url:selectedPodcast.live_stream_url||"", set_live:true, admin_email: currentUser?.email })
                      });
                      // Also try direct PATCH (works if user has token)
                      try { await request("PATCH", `/apps/69e79122bcc8fb5a04cfb834/entities/SachiPodcast/${selectedPodcast.id}`, { is_live:true }); } catch {}
                      setSelectedPodcast(p => ({...p, is_live:true}));
                      setPodcasts(ps => ps.map(p => p.id===selectedPodcast.id ? {...p, is_live:true} : p));
                      showToast("🔴 You are LIVE! Users are being notified.", "live");
                    } catch(e) { showToast("Could not go live. Try again.", "error"); }
                    setGoingLive(false);
                  }}
                    style={{ width:"100%", padding:"16px 0", background:goingLive?"rgba(229,57,53,0.4)":"linear-gradient(135deg,#e53935,#b71c1c)", border:"none", borderRadius:16, color:"#fff", fontWeight:800, fontSize:17, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10, boxShadow:"0 4px 24px rgba(229,57,53,0.35)" }}>
                    {goingLive ? "Going Live..." : "🔴 Go Live Now"}
                  </button>
                  <div style={{ color:"rgba(255,255,255,0.3)", fontSize:12, textAlign:"center", marginTop:8 }}>Tapping Go Live notifies ALL Sachi users instantly via email</div>
                </>
              )}
            </div>
          )}

          {/* LISTENER CONTROLS */}
          {!isHost && currentUser && (
            <div style={{ marginBottom:16 }}>
              {selectedPodcast.is_live && selectedPodcast.live_stream_url ? (() => {
                const streamUrl = selectedPodcast.live_stream_url;
                const isCloudflare = streamUrl.includes("cloudflarestream.com") || streamUrl.includes(".m3u8");
                const getEmbedUrl = (url) => {
                  if (!url) return null;
                  if (url.includes("rumble.com/c/")) { const ch = url.split("rumble.com/c/")[1].replace(/\/.*/, "").replace(/\?.*/, ""); return `https://rumble.com/embed/live_feed/?url=https%3A%2F%2Frumble.com%2Fc%2F${ch}`; }
                  const rumbleVideo = url.match(/rumble\.com\/(v[a-zA-Z0-9]+)-/); if (rumbleVideo) return `https://rumble.com/embed/${rumbleVideo[1]}/`;
                  if (url.includes("rumble.com/embed/")) return url;
                  if (url.includes("youtube.com/embed/")) return url + (url.includes("?") ? "&autoplay=1" : "?autoplay=1&rel=0");
                  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/); if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&rel=0`;
                  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/); if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&rel=0`;
                  const liveMatch = url.match(/youtube\.com\/live\/([a-zA-Z0-9_-]+)/); if (liveMatch) return `https://www.youtube.com/embed/${liveMatch[1]}?autoplay=1&rel=0`;
                  return url;
                };
                const embedUrl = !isCloudflare ? getEmbedUrl(streamUrl) : null;
                const [showPlayer, setShowPlayer] = React.useState(false);
                return (
                  <div style={{ marginBottom:16 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                      <div style={{ width:10, height:10, background:"#e53935", borderRadius:"50%", animation:"pulse 1.2s infinite" }}/>
                      <span style={{ color:"#e53935", fontWeight:800, fontSize:13, letterSpacing:1 }}>LIVE NOW</span>
                      <span style={{ color:"rgba(255,255,255,0.35)", fontSize:12 }}>· {selectedPodcast.listener_count||0} watching</span>
                    </div>
                    <button onClick={() => setShowPlayer(true)}
                      style={{ display:"flex", width:"100%", padding:"16px 0", background:"linear-gradient(135deg,#e53935,#b71c1c)", border:"none", borderRadius:16, color:"#fff", fontWeight:800, fontSize:17, cursor:"pointer", alignItems:"center", justifyContent:"center", gap:10, marginBottom:12, boxShadow:"0 4px 20px rgba(229,57,53,0.35)" }}>
                      {isCloudflare ? "📡 Watch Live on Sachi" : "🎧 Watch Live Now"}
                    </button>
                    {showPlayer && (
                      isCloudflare
                        ? <HlsLivePlayer src={streamUrl} title={selectedPodcast.title} onClose={() => setShowPlayer(false)} />
                        : (
                          <div style={{ position:"fixed", top:0, left:0, width:"100vw", height:"100vh", background:"#000", zIndex:9999, display:"flex", flexDirection:"column" }}>
                            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:"rgba(0,0,0,0.85)", flexShrink:0 }}>
                              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                <div style={{ width:10, height:10, background:"#e53935", borderRadius:"50%", animation:"pulse 1.2s infinite" }}/>
                                <span style={{ color:"#fff", fontWeight:800, fontSize:15 }}>{selectedPodcast.title}</span>
                              </div>
                              <button onClick={() => setShowPlayer(false)} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", borderRadius:"50%", width:34, height:34, fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                            </div>
                            <iframe src={embedUrl} style={{ flex:1, width:"100%", border:"none" }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen title={selectedPodcast.title} />
                            <div style={{ padding:"10px 16px", background:"rgba(0,0,0,0.85)", textAlign:"center", flexShrink:0 }}>
                              <span style={{ color:"rgba(255,255,255,0.35)", fontSize:12 }}>Streaming via Sachi · sachistream.com</span>
                            </div>
                          </div>
                        )
                    )}
                  </div>
                );
              })() : !selectedPodcast.is_live ? (
                <button onClick={() => showToast("🔔 You will be notified when " + selectedPodcast.title + " goes live!", "success")}
                  style={{ width:"100%", padding:"16px 0", background:"linear-gradient(135deg,#6c3cf7,#4527a0)", border:"none", borderRadius:16, color:"#fff", fontWeight:800, fontSize:17, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:12 }}>
                  🔔 Follow & Get Notified
                </button>
              ) : null}
            </div>
          )}

          {!isHost && !currentUser && (
            <div style={{ marginBottom:16 }}>
              {selectedPodcast.is_live && selectedPodcast.live_stream_url ? (() => {
                const streamUrl = selectedPodcast.live_stream_url;
                const isCloudflare = streamUrl.includes("cloudflarestream.com") || streamUrl.includes(".m3u8");
                const getEmbedUrl = (url) => {
                  if (!url) return null;
                  if (url.includes("rumble.com/c/")) { const ch = url.split("rumble.com/c/")[1].replace(/\/.*/, "").replace(/\?.*/, ""); return `https://rumble.com/embed/live_feed/?url=https%3A%2F%2Frumble.com%2Fc%2F${ch}`; }
                  const rumbleVideo = url.match(/rumble\.com\/(v[a-zA-Z0-9]+)-/); if (rumbleVideo) return `https://rumble.com/embed/${rumbleVideo[1]}/`;
                  if (url.includes("rumble.com/embed/")) return url;
                  if (url.includes("youtube.com/embed/")) return url + (url.includes("?") ? "&autoplay=1" : "?autoplay=1&rel=0");
                  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/); if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&rel=0`;
                  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/); if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&rel=0`;
                  const liveMatch = url.match(/youtube\.com\/live\/([a-zA-Z0-9_-]+)/); if (liveMatch) return `https://www.youtube.com/embed/${liveMatch[1]}?autoplay=1&rel=0`;
                  return url;
                };
                const embedUrl = !isCloudflare ? getEmbedUrl(streamUrl) : null;
                const [showGuestPlayer, setShowGuestPlayer] = React.useState(false);
                return (
                  <div style={{ marginBottom:16 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                      <div style={{ width:10, height:10, background:"#e53935", borderRadius:"50%", animation:"pulse 1.2s infinite" }}/>
                      <span style={{ color:"#e53935", fontWeight:800, fontSize:13, letterSpacing:1 }}>LIVE NOW</span>
                    </div>
                    {isCloudflare ? (
                      <>
                        <button onClick={() => setShowGuestPlayer(true)}
                          style={{ width:"100%", padding:"16px 0", background:"linear-gradient(135deg,#e53935,#b71c1c)", border:"none", borderRadius:16, color:"#fff", fontWeight:800, fontSize:17, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:12, boxShadow:"0 4px 20px rgba(229,57,53,0.35)" }}>
                          📡 Watch Live on Sachi
                        </button>
                        {showGuestPlayer && <HlsLivePlayer src={streamUrl} title={selectedPodcast.title} onClose={() => setShowGuestPlayer(false)} />}
                      </>
                    ) : embedUrl ? (
                      <div style={{ position:"relative", width:"100%", paddingBottom:"56.25%", borderRadius:14, overflow:"hidden", background:"#000", boxShadow:"0 4px 24px rgba(229,57,53,0.25)" }}>
                        <iframe src={embedUrl} style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", border:"none" }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={selectedPodcast.title} />
                      </div>
                    ) : null}
                    <button onClick={onNeedAuth} style={{ width:"100%", marginTop:12, padding:"13px 0", background:"rgba(108,60,247,0.15)", border:"1px solid rgba(108,60,247,0.4)", borderRadius:14, color:"#a78bfa", fontWeight:700, fontSize:15, cursor:"pointer" }}>
                      Sign in to Follow this Podcast
                    </button>
                  </div>
                );
              })() : (
                <button onClick={onNeedAuth} style={{ width:"100%", padding:"16px 0", background:"linear-gradient(135deg,#6c3cf7,#4527a0)", border:"none", borderRadius:16, color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer", marginBottom:16 }}>
                  Sign in to Follow
                </button>
              )}
            </div>
          )}

          {/* RECENT EPISODES */}
          <RecentEpisodes episodes={podcastEpisodes} loading={episodesLoading} onEpisodeClick={setSelectedEpisode} />

          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:16 }}>
            <div style={{ background:"rgba(108,60,247,0.2)", border:"1px solid rgba(108,60,247,0.4)", borderRadius:20, padding:"4px 14px", color:"#a78bfa", fontSize:12, fontWeight:600 }}>{selectedPodcast.category}</div>
          </div>
        </div>
      </div>
    );
  }

  // ── REGISTER FORM ──
  if (showRegister) {
    const selectedCover = PODCAST_COVER_COLORS[registerForm.coverIdx || 0];
    return (
      <div style={{ position:"fixed", inset:0, zIndex:600, background:"#0B0C1A", overflowY:"auto" }}>
        {toast && <Toast msg={toast.msg} type={toast.type} />}
        <div style={{ padding:"20px", paddingTop:"calc(env(safe-area-inset-top,0px) + 20px)", paddingBottom:60 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
            <button onClick={() => setShowRegister(false)} style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:"50%", width:38, height:38, color:"#fff", fontSize:20, cursor:"pointer", flexShrink:0 }}>←</button>
            <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>🎙️ Register Your Podcast</div>
          </div>
          {registerDone ? (
            <div style={{ textAlign:"center", padding:"40px 20px" }}>
              <div style={{ fontSize:72, marginBottom:16 }}>🎉</div>
              <div style={{ color:"#fff", fontWeight:800, fontSize:24, marginBottom:10 }}>You are on the list!</div>
              <div style={{ color:"rgba(255,255,255,0.5)", fontSize:15, marginBottom:8, lineHeight:1.6 }}>
                Your show is <strong style={{ color:"#81c784" }}>live on Sachi right now.</strong><br/>No waiting. No approval needed.
              </div>
              <div style={{ background:"rgba(46,125,50,0.1)", border:"1px solid rgba(46,125,50,0.3)", borderRadius:14, padding:16, margin:"20px 0 28px", textAlign:"left" }}>
                <div style={{ color:"#81c784", fontWeight:700, fontSize:13, marginBottom:8 }}>⚡ You are all set — here's how to go live:</div>
                <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13, lineHeight:1.7 }}>
                  1. Go to <strong style={{ color:"#fff" }}>Podcasts tab</strong> and find your show under "My Shows"<br/>
                  2. Tap your show to open it<br/>
                  3. (Optional) Add your stream link — YouTube Live, Twitch, etc.<br/>
                  4. Tap <strong style={{ color:"#e53935" }}>🔴 Go Live Now</strong> — all Sachi users get notified instantly
                </div>
              </div>
              <button onClick={() => { setRegisterDone(false); setShowRegister(false); }}
                style={{ background:"linear-gradient(135deg,#6c3cf7,#4527a0)", border:"none", borderRadius:14, padding:"14px 36px", color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer" }}>
                Back to Podcasts
              </button>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              {/* COVER PICKER */}
              <div>
                <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13, marginBottom:10, fontWeight:600 }}>Choose Your Show Cover</div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  {PODCAST_COVER_COLORS.map((c, i) => (
                    <button key={i} onClick={() => setRegisterForm(p => ({...p, coverIdx:i}))}
                      style={{ width:52, height:52, borderRadius:14, background:c.bg, border: registerForm.coverIdx===i ? "3px solid #F5C842":"3px solid transparent", cursor:"pointer", fontSize:22, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {c.emoji}
                    </button>
                  ))}
                </div>
                <div style={{ marginTop:12, width:"100%", height:70, borderRadius:16, background:selectedCover.bg, display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
                  <span style={{ fontSize:32 }}>{selectedCover.emoji}</span>
                  <span style={{ color:"#fff", fontWeight:800, fontSize:15, opacity: registerForm.title ? 1 : 0.4 }}>{registerForm.title || "Your Show Name"}</span>
                </div>
              </div>

              {/* TITLE */}
              <div>
                <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13, marginBottom:6, fontWeight:600 }}>Podcast Title <span style={{ color:"#e53935" }}>*</span></div>
                <input value={registerForm.title} onChange={e => setRegisterForm(p => ({...p, title:e.target.value}))}
                  placeholder="e.g. The Daily Grind"
                  style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"13px 14px", color:"#fff", fontSize:15, outline:"none", boxSizing:"border-box" }} />
              </div>

              {/* HOST NAME */}
              <div>
                <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13, marginBottom:6, fontWeight:600 }}>Your Name <span style={{ color:"#e53935" }}>*</span></div>
                <input value={registerForm.host_name} onChange={e => setRegisterForm(p => ({...p, host_name:e.target.value}))}
                  placeholder="Full name or stage name"
                  style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"13px 14px", color:"#fff", fontSize:15, outline:"none", boxSizing:"border-box" }} />
              </div>

              {/* DESCRIPTION */}
              <div>
                <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13, marginBottom:6, fontWeight:600 }}>What is your podcast about?</div>
                <textarea value={registerForm.description} onChange={e => setRegisterForm(p => ({...p, description:e.target.value}))}
                  placeholder="Tell listeners what to expect — topics, guests, vibe..."
                  rows={3}
                  style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"13px 14px", color:"#fff", fontSize:15, outline:"none", resize:"none", boxSizing:"border-box" }} />
              </div>

              {/* CATEGORY */}
              <div>
                <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13, marginBottom:6, fontWeight:600 }}>Category</div>
                <select value={registerForm.category} onChange={e => setRegisterForm(p => ({...p, category:e.target.value}))}
                  style={{ width:"100%", background:"#1a1a2e", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"13px 14px", color:"#fff", fontSize:15, outline:"none" }}>
                  {["Business","News & Politics","Entertainment","Comedy","Sports","Technology","Health & Wellness","True Crime","Society & Culture","Education","Other"].map(c =>
                    <option key={c} value={c} style={{ background:"#111" }}>{c}</option>
                  )}
                </select>
              </div>

              {/* STREAM URL - OPTIONAL */}
              <div>
                <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13, marginBottom:6, fontWeight:600 }}>
                  Stream URL <span style={{ color:"rgba(255,255,255,0.25)", fontWeight:400 }}>(optional — add later too)</span>
                </div>
                <input value={registerForm.live_stream_url} onChange={e => setRegisterForm(p => ({...p, live_stream_url:e.target.value}))}
                  placeholder="https://youtube.com/live/... or Twitch link"
                  style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"13px 14px", color:"#fff", fontSize:15, outline:"none", boxSizing:"border-box" }} />
                <div style={{ color:"rgba(255,255,255,0.25)", fontSize:12, marginTop:5 }}>Where listeners will tune in when you go live. You can update this anytime.</div>
              </div>

              <button onClick={handleRegister} disabled={registering || !registerForm.title || !registerForm.host_name}
                style={{ width:"100%", padding:"16px 0", background: (!registerForm.title || !registerForm.host_name) ? "rgba(108,60,247,0.3)" : registering ? "rgba(108,60,247,0.5)" : "linear-gradient(135deg,#6c3cf7,#4527a0)", border:"none", borderRadius:16, color:"#fff", fontWeight:800, fontSize:17, cursor: (!registerForm.title || !registerForm.host_name) ? "not-allowed" : "pointer", marginTop:4 }}>
                {registering ? "⏳ Submitting..." : "Submit My Podcast →"}
              </button>
              <div style={{ color:"rgba(255,255,255,0.2)", fontSize:12, textAlign:"center" }}>Reviewed and approved within 24 hours</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── MAIN PODCAST LIST ──
  return (
    <>
    <div style={{ paddingTop:70, paddingBottom:80, minHeight:"100svh", background:"#0B0C1A" }}>
      <div style={{ margin:"0 16px 20px", background:"linear-gradient(135deg,#1a0a2e,#0d1b4b)", borderRadius:20, padding:"24px 20px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-20, right:-20, fontSize:100, opacity:0.07 }}>🎙️</div>
        <div style={{ color:"#a78bfa", fontSize:12, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:8 }}>Sachi Podcasts</div>
        <div style={{ color:"#fff", fontWeight:800, fontSize:22, lineHeight:1.3, marginBottom:8 }}>Listen Live.<br/>Discover New Shows.</div>
        <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, marginBottom:16, lineHeight:1.5 }}>Tune into live sessions or browse on-demand — all in one place.</div>
        <button onClick={() => { if (!currentUser) { onNeedAuth(); return; } setShowRegister(true); }}
          style={{ background:"linear-gradient(135deg,#6c3cf7,#4527a0)", border:"none", borderRadius:12, padding:"10px 20px", color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer" }}>
          🎙️ Register Your Podcast
        </button>
      </div>

      {/* MY SHOWS — only visible to logged-in hosts */}
      {currentUser && myShows.length > 0 && (
        <div style={{ margin:"0 16px 20px" }}>
          <div style={{ color:"#F5C842", fontWeight:700, fontSize:13, letterSpacing:1.2, textTransform:"uppercase", marginBottom:12 }}>🎙️ My Shows</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {myShows.map(p => {
              const coverBg = p.cover_color || "linear-gradient(135deg,#1a0a2e,#0d1b4b)";
              const coverEmoji = p.cover_emoji || "🎙️";
              return (
                <div key={p.id} onClick={async () => {
                  setSelectedPodcast(p);
                  setEpisodesLoading(true);
                  setPodcastEpisodes([]);
                  try {
                    const token = localStorage.getItem("token");
                    const hdrs = token ? { "Authorization": `Bearer ${token}` } : {};
                    const res = await fetch(`https://app.base44.com/api/apps/69e79122bcc8fb5a04cfb834/entities/SachiPodcastEpisode?limit=50`, { headers: hdrs });
                    const json = await res.json();
                    const items = Array.isArray(json) ? json : (json?.records || json?.items || []);
                    const filtered = items.filter(ep => ep.podcast_id === p.id);
                    const sorted = filtered.sort((a,b) => (b.episode_number||0)-(a.episode_number||0));
                    setPodcastEpisodes(sorted);
                  } catch(e) { setPodcastEpisodes([]); }
                  finally { setEpisodesLoading(false); }
                }}
                  style={{ background:"rgba(245,200,66,0.05)", border:"1px solid rgba(245,200,66,0.2)", borderRadius:16, padding:14, cursor:"pointer", display:"flex", gap:14, alignItems:"center" }}>
                  <div style={{ width:52, height:52, borderRadius:12, background:coverBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{coverEmoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                      <div style={{ color:"#fff", fontWeight:700, fontSize:15, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.title}</div>
                      {p.is_live && <div style={{ background:"#e53935", borderRadius:20, padding:"2px 8px", color:"#fff", fontWeight:700, fontSize:10, flexShrink:0 }}>LIVE</div>}
                    </div>
                    <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12, marginBottom:4 }}>by {p.host_name}</div>
                    <div style={{ display:"inline-block", background: p.is_live ? "rgba(229,57,53,0.2)" : "rgba(46,125,50,0.2)", borderRadius:20, padding:"2px 10px", color: p.is_live ? "#ef9a9a" : "#81c784", fontSize:11, fontWeight:700 }}>
                      {p.is_live ? "🔴 Live Now" : "✅ Active"}
                    </div>
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.2)", fontSize:20 }}>›</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Live News Section ─── */}
      <div style={{ padding:"0 16px 4px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#e53935", animation:"heartbeat 1.4s ease-in-out infinite" }} />
          <span style={{ color:"#fff", fontWeight:800, fontSize:16 }}>Live News</span>
          <span style={{ color:"rgba(255,255,255,0.3)", fontSize:12 }}>• tap to watch</span>
        </div>
        <div style={{ overflowX:"auto", display:"flex", gap:12, paddingBottom:16, scrollbarWidth:"none" }}>
          {LIVE_NEWS_CHANNELS.map(ch => (
            <div key={ch.id}
              onClick={() => setLiveNewsChannel(ch)}
              style={{ flexShrink:0, width:140, borderRadius:16, overflow:"hidden", cursor:"pointer", position:"relative" }}>
              <div style={{ height:80, background:ch.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36 }}>
                {ch.emoji}
              </div>
              <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderTop:"none", borderRadius:"0 0 16px 16px", padding:"8px 10px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:2 }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background:"#e53935", flexShrink:0 }} />
                  <span style={{ color:"#fff", fontWeight:700, fontSize:13, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{ch.name}</span>
                </div>
                <div style={{ color:"rgba(255,255,255,0.4)", fontSize:10, lineHeight:1.3 }}>{ch.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ overflowX:"auto", display:"flex", gap:8, padding:"0 16px 16px", scrollbarWidth:"none" }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setSelectedCat(cat)}
            style={{ flexShrink:0, padding:"7px 16px", borderRadius:20, border:"none", cursor:"pointer", fontWeight:600, fontSize:13, background:selectedCat===cat?"#6c3cf7":"rgba(255,255,255,0.07)", color:selectedCat===cat?"#fff":"rgba(255,255,255,0.5)", WebkitTapHighlightColor:"transparent" }}>
            {cat}
          </button>
        ))}
      </div>

      {livePodcasts.length > 0 && (
        <div style={{ marginBottom:24 }}>
          <div style={{ padding:"0 16px 12px", display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#e53935" }} />
            <span style={{ color:"#fff", fontWeight:800, fontSize:16 }}>Live Now</span>
          </div>
          <div style={{ display:"flex", gap:12, padding:"0 16px", overflowX:"auto", scrollbarWidth:"none" }}>
            {livePodcasts.map(p => (
              <div key={p.id} onClick={async () => {
                  setSelectedPodcast(p);
                  setEpisodesLoading(true);
                  setPodcastEpisodes([]);
                  try {
                    const token = localStorage.getItem("token");
                    const hdrs = token ? { "Authorization": `Bearer ${token}` } : {};
                    const res = await fetch(`https://app.base44.com/api/apps/69e79122bcc8fb5a04cfb834/entities/SachiPodcastEpisode?limit=50`, { headers: hdrs });
                    const json = await res.json();
                    const items = Array.isArray(json) ? json : (json?.records || json?.items || []);
                    const filtered = items.filter(ep => ep.podcast_id === p.id);
                    const sorted = filtered.sort((a,b) => (b.episode_number||0)-(a.episode_number||0));
                    setPodcastEpisodes(sorted);
                  } catch(e) { setPodcastEpisodes([]); }
                  finally { setEpisodesLoading(false); }
                }}
                style={{ flexShrink:0, width:200, background:"rgba(229,57,53,0.08)", border:"1.5px solid rgba(229,57,53,0.3)", borderRadius:16, padding:16, cursor:"pointer" }}>
                <div style={{ background:"#e53935", display:"inline-flex", alignItems:"center", gap:5, borderRadius:20, padding:"3px 10px", marginBottom:10 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:"#fff" }} />
                  <span style={{ color:"#fff", fontWeight:700, fontSize:11 }}>LIVE</span>
                </div>
                <div style={{ fontSize:28, marginBottom:8 }}>🎙️</div>
                <div style={{ color:"#fff", fontWeight:700, fontSize:15, marginBottom:4 }}>{p.title}</div>
                <div style={{ color:"rgba(255,255,255,0.5)", fontSize:12, marginBottom:8 }}>{p.host_name}</div>
                <div style={{ color:"#e53935", fontSize:12, fontWeight:600 }}>🎧 {p.listener_count||0} listening</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding:"0 16px" }}>
        <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, fontWeight:700, marginBottom:12, letterSpacing:1, textTransform:"uppercase" }}>
          {selectedCat==="All" ? "All Shows" : selectedCat}
        </div>
        {loadingPodcasts && (
          <div style={{ textAlign:"center", padding:"60px 0", color:"rgba(245,200,66,0.5)", fontSize:14 }}>
            <div style={{ fontSize:40, marginBottom:12, animation:"spin 1.5s linear infinite", display:"inline-block" }}>⟳</div>
            <div>Loading podcasts...</div>
          </div>
        )}
        {!loadingPodcasts && regularPodcasts.length === 0 && livePodcasts.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 0", color:"rgba(255,255,255,0.25)", fontSize:14 }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🎙️</div>
            No podcasts in this category yet.
          </div>
        )}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {regularPodcasts.map(p => (
            <div key={p.id} onClick={async () => {
                  setSelectedPodcast(p);
                  setEpisodesLoading(true);
                  setPodcastEpisodes([]);
                  try {
                    const token = localStorage.getItem("token");
                    const hdrs = token ? { "Authorization": `Bearer ${token}` } : {};
                    const res = await fetch(`https://app.base44.com/api/apps/69e79122bcc8fb5a04cfb834/entities/SachiPodcastEpisode?limit=50`, { headers: hdrs });
                    const json = await res.json();
                    const items = Array.isArray(json) ? json : (json?.records || json?.items || []);
                    const filtered = items.filter(ep => ep.podcast_id === p.id);
                    const sorted = filtered.sort((a,b) => (b.episode_number||0)-(a.episode_number||0));
                    setPodcastEpisodes(sorted);
                  } catch(e) { setPodcastEpisodes([]); }
                  finally { setEpisodesLoading(false); }
                }}
              style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:16, cursor:"pointer", display:"flex", gap:14, alignItems:"center" }}>
              <div style={{ width:64, height:64, borderRadius:12, background:"linear-gradient(135deg,#1a0a2e,#0d1b4b)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>🎙️</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ color:"#fff", fontWeight:700, fontSize:15, marginBottom:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.title}</div>
                <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12, marginBottom:6 }}>{p.host_name}</div>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ background:"rgba(108,60,247,0.2)", borderRadius:20, padding:"2px 10px", color:"#a78bfa", fontSize:11, fontWeight:600 }}>{p.category}</div>
                  <div style={{ color:"rgba(255,255,255,0.25)", fontSize:11 }}>{p.follower_count||0} followers</div>
                </div>
              </div>
              <div style={{ color:"rgba(255,255,255,0.2)", fontSize:20 }}>›</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ margin:"32px 16px 0", background:"rgba(108,60,247,0.08)", border:"1px solid rgba(108,60,247,0.2)", borderRadius:20, padding:24, textAlign:"center" }}>
        <div style={{ fontSize:32, marginBottom:12 }}>🚀</div>
        <div style={{ color:"#fff", fontWeight:800, fontSize:18, marginBottom:8 }}>Have a podcast?</div>
        <div style={{ color:"rgba(255,255,255,0.5)", fontSize:14, marginBottom:16, lineHeight:1.5 }}>Join Sachi and reach new listeners through our For You feed every day.</div>
        <button onClick={() => { if (!currentUser) { onNeedAuth(); return; } setShowRegister(true); }}
          style={{ background:"linear-gradient(135deg,#6c3cf7,#4527a0)", border:"none", borderRadius:14, padding:"13px 28px", color:"#fff", fontWeight:800, fontSize:15, cursor:"pointer" }}>
          Get Started Free →
        </button>
      </div>
    </div>

    {/* ─── Live News Viewer Modal ─── */}
    {liveNewsChannel && (
      <div style={{ position:"fixed", inset:0, zIndex:9999, background:"#000", display:"flex", flexDirection:"column" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px",
          background:"rgba(0,0,0,0.9)", borderBottom:"1px solid rgba(255,255,255,0.1)", zIndex:10000 }}>
          <button onClick={() => setLiveNewsChannel(null)}
            style={{ background:"none", border:"none", color:"#fff", fontSize:24, cursor:"pointer", lineHeight:1, padding:4 }}>✕</button>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#e53935", animation:"heartbeat 1.4s ease-in-out infinite" }} />
            <span style={{ color:"#fff", fontWeight:800, fontSize:16 }}>{liveNewsChannel.emoji} {liveNewsChannel.name}</span>
            <span style={{ background:"#e53935", color:"#fff", fontSize:10, fontWeight:800, borderRadius:6, padding:"2px 8px", letterSpacing:1 }}>LIVE</span>
          </div>
          <div style={{ width:40 }} />
        </div>
        {/* Stream */}
        <div style={{ flex:1, position:"relative" }}>
          <iframe
            src={liveNewsChannel.url}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", border:"none" }}
            title={liveNewsChannel.name + " Live"}
          />
        </div>
        {/* Channel selector strip */}
        <div style={{ background:"rgba(0,0,0,0.9)", borderTop:"1px solid rgba(255,255,255,0.08)",
          padding:"10px 16px", overflowX:"auto", display:"flex", gap:10, scrollbarWidth:"none" }}>
          {LIVE_NEWS_CHANNELS.map(ch => (
            <button key={ch.id} onClick={() => setLiveNewsChannel(ch)}
              style={{ flexShrink:0, display:"flex", alignItems:"center", gap:6,
                padding:"8px 14px", borderRadius:20, border:"none", cursor:"pointer",
                background: ch.id === liveNewsChannel.id ? "rgba(229,57,53,0.3)" : "rgba(255,255,255,0.07)",
                outline: ch.id === liveNewsChannel.id ? "1.5px solid #e53935" : "none" }}>
              <span style={{ fontSize:16 }}>{ch.emoji}</span>
              <span style={{ color:"#fff", fontWeight:600, fontSize:12, whiteSpace:"nowrap" }}>{ch.name}</span>
            </button>
          ))}
        </div>
      </div>
    )}
    </>
  );
}


// ─── Notifications Panel ─────────────────────────────────────────────────────
const NOTIF_PREFS_KEY = "sachi_notif_prefs";
const DEFAULT_NOTIF_PREFS = { likes: true, comments: true, follows: true, messages: true, live: true };

export default PodcastPage;
