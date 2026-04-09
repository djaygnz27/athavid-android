import { useState, useEffect, useRef } from "react";

const API = "https://api.base44.app";
const APP_ID = "69b2ee18a8e6fb58c7f0261c";
const GOOGLE_CLIENT_ID = "742987369203-2in74gg9jdv3g14v8b0eo0g3clptp32gosdt.apps.googleusercontent.com";
const SACHI_FN = "https://sachi-c7f0261c.base44.app/functions";

const COVER_COLORS = [
  { bg:"linear-gradient(135deg,#1a0a2e,#6c3cf7)", emoji:"🎙️" },
  { bg:"linear-gradient(135deg,#0d2137,#1565C0)", emoji:"🎧" },
  { bg:"linear-gradient(135deg,#1a0a2e,#e53935)", emoji:"🔴" },
  { bg:"linear-gradient(135deg,#0a1a0a,#2e7d32)", emoji:"🌿" },
  { bg:"linear-gradient(135deg,#1a0f0a,#F57C00)", emoji:"🔥" },
  { bg:"linear-gradient(135deg,#0a0a1a,#F5C842)", emoji:"⭐" },
];

const CATEGORIES = ["Business","Education","Entertainment","News & Politics","Technology","Health & Wellness","Sports","Music","Comedy","True Crime","Society & Culture","Science"];

function request(method, path, body) {
  const token = localStorage.getItem("sachi_token");
  return fetch(API + path, {
    method, headers: { "Content-Type":"application/json", ...(token ? { "Authorization":"Bearer "+token } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  }).then(r => r.json());
}

export default function PodcastHost() {
  const [user, setUser] = useState(null);
  const [myShows, setMyShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShow, setSelectedShow] = useState(null);
  const [view, setView] = useState("shows"); // shows | register | episode
  const [goingLive, setGoingLive] = useState(false);
  const [endingLive, setEndingLive] = useState(false);
  const [streamUrl, setStreamUrl] = useState("");
  const [editingUrl, setEditingUrl] = useState(false);
  const [toast, setToast] = useState(null);
  const [regForm, setRegForm] = useState({ title:"", host_name:"", description:"", category:"Business", coverIdx:0 });
  const [registering, setRegistering] = useState(false);
  const [epForm, setEpForm] = useState({ title:"", description:"", video_url:"", episode_number:"" });
  const [addingEp, setAddingEp] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const googleLoaded = useRef(false);

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Google Sign-In
  useEffect(() => {
    if (googleLoaded.current) return;
    googleLoaded.current = true;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
        ux_mode: "popup",
      });
    };
    document.head.appendChild(script);
    // Check existing session
    const token = localStorage.getItem("sachi_token");
    const saved = localStorage.getItem("sachi_user");
    if (token && saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
    setLoading(false);
  }, []);

  const handleGoogleLogin = async (resp) => {
    setLoading(true);
    try {
      const res = await fetch(API + `/apps/${APP_ID}/auth/google`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ token: resp.credential }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("sachi_token", data.token);
        localStorage.setItem("sachi_user", JSON.stringify(data.user || data));
        setUser(data.user || data);
      }
    } catch(e) { showToast("Login failed. Try again.", "error"); }
    setLoading(false);
  };

  const triggerGoogleLogin = () => {
    window.google?.accounts.id.prompt();
  };

  useEffect(() => {
    if (user) loadMyShows();
  }, [user]);

  const loadMyShows = async () => {
    setLoading(true);
    try {
      const res = await request("GET", `/apps/${APP_ID}/entities/SachiPodcast`);
      const all = res.records || res || [];
      const mine = all.filter(p =>
        p.host_user_id === user?.id ||
        p.created_by === user?.email ||
        p.created_by_id === user?.id
      );
      setMyShows(mine);
    } catch(e) {}
    setLoading(false);
  };

  const loadEpisodes = async (podcastId) => {
    try {
      const res = await request("GET", `/apps/${APP_ID}/entities/SachiPodcastEpisode`);
      const all = res.records || res || [];
      setEpisodes(all.filter(e => e.podcast_id === podcastId));
    } catch(e) {}
  };

  const handleRegister = async () => {
    if (!regForm.title || !regForm.host_name) return showToast("Show name and host name are required", "error");
    setRegistering(true);
    try {
      const cover = COVER_COLORS[regForm.coverIdx];
      await request("POST", `/apps/${APP_ID}/entities/SachiPodcast`, {
        title: regForm.title,
        host_name: regForm.host_name,
        description: regForm.description,
        category: regForm.category,
        cover_color: cover.bg,
        cover_emoji: cover.emoji,
        status: "Active",
        is_live: false,
        listener_count: 0,
        episode_count: 0,
        follower_count: 0,
        host_user_id: user?.id || "",
        host_username: user?.full_name || user?.email?.split("@")[0] || "",
        live_stream_url: "",
      });
      fetch(`${SACHI_FN}/podcastWelcome`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ host_email: user?.email, host_name: regForm.host_name, podcast_title: regForm.title, category: regForm.category })
      }).catch(()=>{});
      showToast("🎙️ Podcast registered! You're on Sachi.", "success");
      setRegForm({ title:"", host_name:"", description:"", category:"Business", coverIdx:0 });
      await loadMyShows();
      setView("shows");
    } catch(e) { showToast("Something went wrong. Try again.", "error"); }
    setRegistering(false);
  };

  const goLive = async () => {
    if (!selectedShow.live_stream_url) return showToast("Add a stream URL first", "error");
    setGoingLive(true);
    try {
      await fetch(`${SACHI_FN}/podcastGoLiveNotify`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ podcast_id: selectedShow.id, podcast_title: selectedShow.title, host_name: selectedShow.host_name, live_stream_url: selectedShow.live_stream_url, set_live: true, admin_email: user?.email })
      });
      await request("PATCH", `/apps/${APP_ID}/entities/SachiPodcast/${selectedShow.id}`, { is_live: true });
      setSelectedShow(s => ({...s, is_live: true}));
      setMyShows(ms => ms.map(s => s.id === selectedShow.id ? {...s, is_live: true} : s));
      showToast("🔴 You are LIVE on Sachi!", "live");
    } catch(e) { showToast("Could not go live. Check your stream URL.", "error"); }
    setGoingLive(false);
  };

  const endLive = async () => {
    setEndingLive(true);
    try {
      await fetch(`${SACHI_FN}/podcastGoLiveNotify`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ podcast_id: selectedShow.id, set_live: false, admin_email: user?.email })
      }).catch(()=>{});
      await request("PATCH", `/apps/${APP_ID}/entities/SachiPodcast/${selectedShow.id}`, { is_live: false, listener_count: 0 });
      setSelectedShow(s => ({...s, is_live: false, listener_count: 0}));
      setMyShows(ms => ms.map(s => s.id === selectedShow.id ? {...s, is_live: false} : s));
      showToast("⏹️ Live session ended", "success");
    } catch(e) { showToast("Failed to end session.", "error"); }
    setEndingLive(false);
  };

  const saveStreamUrl = async () => {
    try {
      await request("PATCH", `/apps/${APP_ID}/entities/SachiPodcast/${selectedShow.id}`, { live_stream_url: streamUrl });
      setSelectedShow(s => ({...s, live_stream_url: streamUrl}));
      setMyShows(ms => ms.map(s => s.id === selectedShow.id ? {...s, live_stream_url: streamUrl} : s));
      setEditingUrl(false);
      showToast("✅ Stream URL saved", "success");
    } catch(e) { showToast("Failed to save URL", "error"); }
  };

  const addEpisode = async () => {
    if (!epForm.title || !epForm.video_url) return showToast("Title and video URL are required", "error");
    setAddingEp(true);
    try {
      const epCount = episodes.length + 1;
      await request("POST", `/apps/${APP_ID}/entities/SachiPodcastEpisode`, {
        podcast_id: selectedShow.id,
        title: epForm.title,
        description: epForm.description,
        video_url: epForm.video_url,
        audio_url: epForm.video_url,
        live_stream_url: epForm.video_url,
        episode_number: parseInt(epForm.episode_number) || epCount,
        status: "published",
        like_count: 0, comment_count: 0, listener_count: 0,
      });
      await request("PATCH", `/apps/${APP_ID}/entities/SachiPodcast/${selectedShow.id}`, { episode_count: epCount });
      await loadEpisodes(selectedShow.id);
      setEpForm({ title:"", description:"", video_url:"", episode_number:"" });
      showToast("✅ Episode added!", "success");
      setView("shows");
    } catch(e) { showToast("Failed to add episode. Try again.", "error"); }
    setAddingEp(false);
  };

  const openShow = (show) => {
    setSelectedShow(show);
    setStreamUrl(show.live_stream_url || "");
    loadEpisodes(show.id);
    setView("manage");
  };

  // ── STYLES ──
  const s = {
    page: { minHeight:"100vh", background:"#0B0C1A", color:"#fff", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", padding:"0 0 80px" },
    header: { background:"rgba(11,12,26,0.95)", borderBottom:"1px solid rgba(255,255,255,0.07)", padding:"16px 20px", display:"flex", alignItems:"center", gap:12, position:"sticky", top:0, zIndex:50 },
    logo: { width:32, height:32, borderRadius:8 },
    title: { fontSize:18, fontWeight:800, color:"#F5C842", letterSpacing:0.3 },
    subtitle: { fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:1 },
    body: { maxWidth:600, margin:"0 auto", padding:"24px 20px" },
    card: { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:18, padding:20, marginBottom:14 },
    liveCard: { background:"rgba(229,57,53,0.08)", border:"2px solid rgba(229,57,53,0.5)", borderRadius:18, padding:20, marginBottom:14 },
    input: { width:"100%", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"12px 16px", color:"#fff", fontSize:15, outline:"none", boxSizing:"border-box", marginBottom:12 },
    label: { color:"rgba(255,255,255,0.5)", fontSize:12, marginBottom:6, display:"block" },
    btn: (bg, color="#fff") => ({ background:bg, border:"none", borderRadius:14, padding:"14px 0", width:"100%", color, fontWeight:700, fontSize:15, cursor:"pointer", marginBottom:10 }),
    smallBtn: (bg, color="#fff") => ({ background:bg, border:"none", borderRadius:10, padding:"8px 16px", color, fontWeight:600, fontSize:13, cursor:"pointer" }),
    tag: { background:"rgba(245,200,66,0.15)", color:"#F5C842", borderRadius:8, padding:"3px 10px", fontSize:11, fontWeight:700 },
    liveTag: { background:"rgba(229,57,53,0.2)", color:"#e53935", borderRadius:8, padding:"3px 10px", fontSize:11, fontWeight:800 },
  };

  // ── RENDER ──

  // Loading
  if (loading) return (
    <div style={{...s.page, display:"flex", alignItems:"center", justifyContent:"center"}}>
      <div style={{ textAlign:"center" }}>
        <img src="/sachi-icon-v4.png" style={{ width:60, height:60, borderRadius:16, marginBottom:16 }} />
        <div style={{ color:"rgba(255,255,255,0.4)", fontSize:14 }}>Loading...</div>
      </div>
    </div>
  );

  // Not logged in
  if (!user) return (
    <div style={{...s.page, display:"flex", alignItems:"center", justifyContent:"center"}}>
      <div style={{ textAlign:"center", padding:32, maxWidth:360 }}>
        <img src="/sachi-icon-v4.png" style={{ width:72, height:72, borderRadius:20, marginBottom:20, boxShadow:"0 0 40px rgba(245,200,66,0.3)" }} />
        <div style={{ fontSize:26, fontWeight:800, color:"#F5C842", marginBottom:8 }}>Podcast Host</div>
        <div style={{ color:"rgba(255,255,255,0.45)", fontSize:14, lineHeight:1.7, marginBottom:32 }}>
          Manage your Sachi podcast, go live, and add episodes — all from one place.
        </div>
        <button onClick={triggerGoogleLogin} style={{ background:"#fff", border:"none", borderRadius:14, padding:"14px 32px", color:"#1a1a2e", fontWeight:700, fontSize:15, cursor:"pointer", display:"flex", alignItems:"center", gap:10, margin:"0 auto" }}>
          <img src="https://www.google.com/favicon.ico" style={{ width:18, height:18 }} />
          Sign in with Google
        </button>
        <div style={{ color:"rgba(255,255,255,0.2)", fontSize:12, marginTop:20 }}>
          Use the same Google account you registered your podcast with
        </div>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", top:20, left:"50%", transform:"translateX(-50%)", background: toast.type==="error"?"#e53935": toast.type==="live"?"#e53935":"#2e7d32", color:"#fff", borderRadius:12, padding:"12px 24px", fontSize:14, fontWeight:600, zIndex:999, boxShadow:"0 4px 20px rgba(0,0,0,0.4)", whiteSpace:"nowrap" }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={s.header}>
        <img src="/sachi-icon-v4.png" style={s.logo} />
        <div style={{ flex:1 }}>
          <div style={s.title}>Sachi Podcast Host</div>
          <div style={s.subtitle}>Signed in as {user.email}</div>
        </div>
        {view !== "shows" && (
          <button onClick={() => setView("shows")} style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:10, padding:"7px 14px", color:"rgba(255,255,255,0.6)", fontSize:13, cursor:"pointer" }}>← Back</button>
        )}
      </div>

      <div style={s.body}>

        {/* ── MY SHOWS ── */}
        {view === "shows" && (
          <>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
              <div style={{ fontSize:20, fontWeight:800 }}>My Shows</div>
              <button onClick={() => setView("register")} style={s.smallBtn("linear-gradient(135deg,#F5C842,#F5A623)", "#0B0C1A")}>+ New Show</button>
            </div>

            {myShows.length === 0 ? (
              <div style={{ textAlign:"center", padding:"48px 0" }}>
                <div style={{ fontSize:48, marginBottom:16 }}>🎙️</div>
                <div style={{ color:"rgba(255,255,255,0.5)", fontSize:15, marginBottom:24 }}>You don't have any shows yet.</div>
                <button onClick={() => setView("register")} style={{ ...s.btn("linear-gradient(135deg,#F5C842,#F5A623)", "#0B0C1A"), width:"auto", padding:"14px 32px" }}>Register Your First Show</button>
              </div>
            ) : myShows.map(show => (
              <div key={show.id} onClick={() => openShow(show)} style={{ ...s.card, cursor:"pointer", display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ width:56, height:56, borderRadius:14, background: show.cover_color || "linear-gradient(135deg,#1a0a2e,#6c3cf7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>
                  {show.cover_emoji || "🎙️"}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:16, marginBottom:4 }}>{show.title}</div>
                  <div style={{ color:"rgba(255,255,255,0.4)", fontSize:13 }}>{show.category} · {show.episode_count||0} episodes</div>
                </div>
                {show.is_live && <div style={s.liveTag}>🔴 LIVE</div>}
                <div style={{ color:"rgba(255,255,255,0.3)", fontSize:18 }}>›</div>
              </div>
            ))}
          </>
        )}

        {/* ── REGISTER ── */}
        {view === "register" && (
          <>
            <div style={{ fontSize:20, fontWeight:800, marginBottom:20 }}>Register a New Show</div>

            <label style={s.label}>Show Name *</label>
            <input style={s.input} placeholder="e.g. The Daily Breakdown" value={regForm.title} onChange={e => setRegForm(f => ({...f, title:e.target.value}))} />

            <label style={s.label}>Your Name *</label>
            <input style={s.input} placeholder="e.g. John Smith" value={regForm.host_name} onChange={e => setRegForm(f => ({...f, host_name:e.target.value}))} />

            <label style={s.label}>Description</label>
            <textarea style={{...s.input, height:90, resize:"vertical"}} placeholder="What's your show about?" value={regForm.description} onChange={e => setRegForm(f => ({...f, description:e.target.value}))} />

            <label style={s.label}>Category</label>
            <select style={s.input} value={regForm.category} onChange={e => setRegForm(f => ({...f, category:e.target.value}))}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>

            <label style={s.label}>Cover Style</label>
            <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
              {COVER_COLORS.map((c,i) => (
                <div key={i} onClick={() => setRegForm(f => ({...f, coverIdx:i}))} style={{ width:52, height:52, borderRadius:14, background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, cursor:"pointer", border: regForm.coverIdx===i ? "3px solid #F5C842" : "3px solid transparent" }}>
                  {c.emoji}
                </div>
              ))}
            </div>

            <button onClick={handleRegister} disabled={registering} style={s.btn("linear-gradient(135deg,#F5C842,#F5A623)", "#0B0C1A")}>
              {registering ? "Registering..." : "Register Show 🎙️"}
            </button>
          </>
        )}

        {/* ── MANAGE SHOW ── */}
        {view === "manage" && selectedShow && (
          <>
            {/* Show card */}
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
              <div style={{ width:64, height:64, borderRadius:16, background: selectedShow.cover_color || "linear-gradient(135deg,#1a0a2e,#6c3cf7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>
                {selectedShow.cover_emoji || "🎙️"}
              </div>
              <div>
                <div style={{ fontSize:20, fontWeight:800 }}>{selectedShow.title}</div>
                <div style={{ color:"rgba(255,255,255,0.4)", fontSize:13 }}>{selectedShow.category} · {selectedShow.host_name}</div>
              </div>
            </div>

            {/* Live status */}
            {selectedShow.is_live ? (
              <div style={s.liveCard}>
                <div style={{ textAlign:"center", marginBottom:16 }}>
                  <div style={{ fontSize:32, marginBottom:4 }}>🔴</div>
                  <div style={{ color:"#e53935", fontWeight:800, fontSize:18 }}>YOU ARE LIVE</div>
                  <div style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginTop:4 }}>{selectedShow.listener_count||0} listeners tuned in</div>
                </div>
                <button onClick={endLive} disabled={endingLive} style={s.btn("rgba(229,57,53,0.15)", "#e53935")}>
                  {endingLive ? "Ending..." : "⏹️ End Live Session"}
                </button>
              </div>
            ) : (
              <div style={s.card}>
                <div style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>🔴 Go Live</div>

                {/* Stream URL */}
                <label style={s.label}>Your Stream URL (YouTube Live, Rumble, Twitch...)</label>
                {editingUrl ? (
                  <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                    <input style={{...s.input, marginBottom:0, flex:1}} placeholder="https://youtube.com/live/..." value={streamUrl} onChange={e => setStreamUrl(e.target.value)} />
                    <button onClick={saveStreamUrl} style={s.smallBtn("#6c3cf7")}>Save</button>
                    <button onClick={() => setEditingUrl(false)} style={s.smallBtn("rgba(255,255,255,0.08)", "rgba(255,255,255,0.6)")}>✕</button>
                  </div>
                ) : (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"10px 14px" }}>
                    <div style={{ color: selectedShow.live_stream_url ? "#a78bfa" : "rgba(255,255,255,0.25)", fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"75%" }}>
                      {selectedShow.live_stream_url || "No stream URL set yet"}
                    </div>
                    <button onClick={() => { setStreamUrl(selectedShow.live_stream_url||""); setEditingUrl(true); }} style={s.smallBtn("rgba(108,60,247,0.25)", "#a78bfa")}>
                      {selectedShow.live_stream_url ? "Edit" : "Add URL"}
                    </button>
                  </div>
                )}

                <button onClick={goLive} disabled={goingLive || !selectedShow.live_stream_url} style={{ ...s.btn(selectedShow.live_stream_url ? "linear-gradient(135deg,#e53935,#c62828)" : "rgba(255,255,255,0.06)"), opacity: selectedShow.live_stream_url ? 1 : 0.4 }}>
                  {goingLive ? "Going Live..." : "🔴 Go Live Now"}
                </button>

                {!selectedShow.live_stream_url && (
                  <div style={{ color:"rgba(255,255,255,0.3)", fontSize:12, textAlign:"center", marginTop:-6 }}>Add a stream URL above to enable Go Live</div>
                )}
              </div>
            )}

            {/* Episodes */}
            <div style={{ marginTop:8 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                <div style={{ fontWeight:700, fontSize:16 }}>📺 Episodes ({episodes.length})</div>
                <button onClick={() => setView("episode")} style={s.smallBtn("rgba(108,60,247,0.3)", "#a78bfa")}>+ Add Episode</button>
              </div>
              {episodes.length === 0 ? (
                <div style={{ ...s.card, textAlign:"center", color:"rgba(255,255,255,0.3)", fontSize:14 }}>No episodes yet. Add your first one!</div>
              ) : episodes.sort((a,b)=>b.episode_number-a.episode_number).map(ep => (
                <div key={ep.id} style={s.card}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:"rgba(108,60,247,0.2)", display:"flex", alignItems:"center", justifyContent:"center", color:"#a78bfa", fontWeight:800, fontSize:14, flexShrink:0 }}>
                      {ep.episode_number||"—"}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:600, fontSize:14, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ep.title}</div>
                      <div style={{ color:"rgba(255,255,255,0.35)", fontSize:12, marginTop:2 }}>{ep.status} · {ep.listener_count||0} plays</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── ADD EPISODE ── */}
        {view === "episode" && selectedShow && (
          <>
            <div style={{ fontSize:20, fontWeight:800, marginBottom:20 }}>Add an Episode</div>
            <div style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginBottom:20 }}>Adding to: <span style={{ color:"#F5C842" }}>{selectedShow.title}</span></div>

            <label style={s.label}>Episode Title *</label>
            <input style={s.input} placeholder="e.g. The Future of AI" value={epForm.title} onChange={e => setEpForm(f => ({...f, title:e.target.value}))} />

            <label style={s.label}>Description</label>
            <textarea style={{...s.input, height:80, resize:"vertical"}} placeholder="What's this episode about?" value={epForm.description} onChange={e => setEpForm(f => ({...f, description:e.target.value}))} />

            <label style={s.label}>Video / Audio URL * (YouTube, Rumble, Spotify...)</label>
            <input style={s.input} placeholder="https://youtube.com/watch?v=..." value={epForm.video_url} onChange={e => setEpForm(f => ({...f, video_url:e.target.value}))} />

            <label style={s.label}>Episode Number</label>
            <input style={s.input} type="number" placeholder={`${episodes.length + 1}`} value={epForm.episode_number} onChange={e => setEpForm(f => ({...f, episode_number:e.target.value}))} />

            <button onClick={addEpisode} disabled={addingEp} style={s.btn("linear-gradient(135deg,#6c3cf7,#a78bfa)")}>
              {addingEp ? "Adding..." : "Add Episode ✅"}
            </button>
          </>
        )}

      </div>
    </div>
  );
}
