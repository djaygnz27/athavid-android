import { useState, useEffect } from "react";
import { AthaVidVideo as Video, AthaVidComment as Comment, User } from "../api/entities";
import { base44 } from "../api/base44Client";

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatCount(n) {
  if (!n) return "0";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

function safeHashtags(h) {
  if (!h) return [];
  if (Array.isArray(h)) return h;
  if (typeof h === "string") return h.split(/[\s,#]+/).filter(Boolean);
  return [];
}

async function uploadFile(file) {
  const { file_url } = await base44.integrations.Core.UploadFile({ file });
  if (!file_url) throw new Error("Upload failed");
  return file_url;
}

// ── Auth Gate ─────────────────────────────────────────────────────────────────
function AuthGate({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);

  useEffect(() => {
    User.me()
      .then(u => { setUser(u); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const login = async () => {
    if (!email.trim() || !password.trim()) return setError("Enter email and password");
    setWorking(true); setError("");
    try {
      await User.login({ email: email.trim(), password });
      const u = await User.me();
      setUser(u);
    } catch(e) { setError(e.message || "Login failed"); }
    finally { setWorking(false); }
  };

  const signup = async () => {
    if (!email.trim() || !password.trim()) return setError("Enter email and password");
    if (!username.trim()) return setError("Choose a username");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    setWorking(true); setError("");
    try {
      const clean = username.trim().replace(/^@/, "").replace(/\s+/g, "_").toLowerCase();
      await User.register({ email: email.trim(), password, full_name: displayName.trim() || clean });
      const u = await User.me();
      try { await User.updateMyUserData({ username: clean }); } catch(e) {}
      setUser(u);
    } catch(e) { setError(e.message || "Sign up failed"); }
    finally { setWorking(false); }
  };

  const logout = async () => {
    await User.logout().catch(() => {});
    setUser(null);
  };

  if (loading) return (
    <div style={{ background:"#0a0a0a", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:40, height:4, background:"#e63946", borderRadius:2 }} />
    </div>
  );

  if (!user) return (
    <div style={{ background:"#0a0a0a", minHeight:"100vh", maxWidth:480, margin:"0 auto", fontFamily:"'Inter',-apple-system,sans-serif", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32 }}>
      <style>{`* { box-sizing: border-box } body { background: #0a0a0a; margin: 0 }`}</style>
      <div style={{ marginBottom:48, textAlign:"center" }}>
        <div style={{ width:60, height:3, background:"#e63946", margin:"0 auto 16px", borderRadius:2 }} />
        <div style={{ fontSize:48, fontWeight:900, letterSpacing:"-3px", color:"#fff", textTransform:"uppercase", fontStyle:"italic" }}>SACHI</div>
        <div style={{ width:60, height:3, background:"#e63946", margin:"16px auto 0", borderRadius:2 }} />
        <div style={{ color:"#444", fontSize:10, letterSpacing:"5px", textTransform:"uppercase", marginTop:12 }}>real people · real moments</div>
      </div>
      <div style={{ display:"flex", gap:0, marginBottom:28, border:"1px solid #1f1f1f", borderRadius:4, overflow:"hidden", width:"100%" }}>
        {["login","signup"].map(m => (
          <button key={m} onClick={() => { setMode(m); setError(""); }}
            style={{ flex:1, padding:"12px", border:"none", cursor:"pointer", fontWeight:800, fontSize:11, letterSpacing:"3px", textTransform:"uppercase", background:mode===m?"#e63946":"transparent", color:mode===m?"#fff":"#444", transition:"all 0.2s" }}>
            {m === "login" ? "SIGN IN" : "JOIN"}
          </button>
        ))}
      </div>
      <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:10 }}>
        {mode === "signup" && (
          <>
            <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Display name"
              style={{ background:"#0d0d0d", border:"1px solid #1f1f1f", borderRadius:4, padding:"13px 16px", color:"#fff", fontSize:13, outline:"none" }} />
            <input value={username} onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_.]/g,""))} placeholder="@username"
              style={{ background:"#0d0d0d", border:"1px solid #1f1f1f", borderRadius:4, padding:"13px 16px", color:"#fff", fontSize:13, outline:"none" }} />
          </>
        )}
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email"
          style={{ background:"#0d0d0d", border:"1px solid #1f1f1f", borderRadius:4, padding:"13px 16px", color:"#fff", fontSize:13, outline:"none" }} />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password"
          onKeyDown={e => e.key === "Enter" && (mode === "login" ? login() : signup())}
          style={{ background:"#0d0d0d", border:"1px solid #1f1f1f", borderRadius:4, padding:"13px 16px", color:"#fff", fontSize:13, outline:"none" }} />
        {error && <div style={{ color:"#e63946", fontSize:12 }}>{error}</div>}
        <button onClick={mode === "login" ? login : signup} disabled={working}
          style={{ padding:"15px", background:working?"#1a1a1a":"#e63946", border:"none", borderRadius:4, color:"#fff", fontSize:11, fontWeight:800, letterSpacing:"4px", textTransform:"uppercase", cursor:working?"not-allowed":"pointer", marginTop:4 }}>
          {working ? "..." : (mode === "login" ? "SIGN IN" : "CREATE ACCOUNT")}
        </button>
      </div>
    </div>
  );

  return children(user, logout);
}

// ── Feed ──────────────────────────────────────────────────────────────────────
function FeedPage({ currentUser }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Video.filter({ is_archived: false })
      .then(r => { setVideos(Array.isArray(r) ? r : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", color:"#444", fontSize:11, letterSpacing:"3px" }}>LOADING...</div>
  );

  if (videos.length === 0) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", color:"#333" }}>
      <div style={{ fontSize:11, letterSpacing:"3px", textTransform:"uppercase" }}>No videos yet</div>
      <div style={{ fontSize:11, letterSpacing:"2px", textTransform:"uppercase", marginTop:8, color:"#e63946" }}>Be the first to post</div>
    </div>
  );

  return (
    <div style={{ height:"100%", overflowY:"auto", scrollSnapType:"y mandatory" }}>
      {videos.map(v => (
        <div key={v.id} style={{ height:"100svh", scrollSnapAlign:"start", position:"relative", background:"#000", flexShrink:0 }}>
          <video src={v.video_url} poster={v.thumbnail_url || ""} style={{ width:"100%", height:"100%", objectFit:"cover" }}
            muted playsInline loop
            onClick={e => { if(e.currentTarget.paused) e.currentTarget.play(); else e.currentTarget.pause(); }} />
          <div style={{ position:"absolute", bottom:80, left:16, right:60, pointerEvents:"none" }}>
            <div style={{ color:"#fff", fontWeight:800, fontSize:13, letterSpacing:"0.5px" }}>@{v.username || "user"}</div>
            <div style={{ color:"rgba(255,255,255,0.8)", fontSize:12, marginTop:4, lineHeight:1.5 }}>{v.caption || ""}</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:4 }}>
              {safeHashtags(v.hashtags).map(h => (
                <span key={h} style={{ color:"#e63946", fontSize:10, fontWeight:700 }}>#{h.toUpperCase()}</span>
              ))}
            </div>
          </div>
          <div style={{ position:"absolute", right:12, bottom:100, display:"flex", flexDirection:"column", gap:20, alignItems:"center" }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ color:"#fff", fontSize:22 }}>♥</div>
              <div style={{ color:"#fff", fontSize:10, fontWeight:700 }}>{formatCount(v.likes_count)}</div>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ color:"#fff", fontSize:20 }}>💬</div>
              <div style={{ color:"#fff", fontSize:10, fontWeight:700 }}>{formatCount(v.comments_count)}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Upload ────────────────────────────────────────────────────────────────────
function UploadPage({ currentUser, onPosted }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [hashtagsRaw, setHashtagsRaw] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  const autoUsername = (currentUser?.username || currentUser?.full_name || currentUser?.email?.split("@")[0] || "user")
    .replace(/^@/, "").replace(/\s+/g, "_").toLowerCase();

  const pickFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
  };

  const post = async () => {
    if (!file) return setError("Pick a video first");
    setUploading(true); setError("");
    try {
      const videoUrl = await uploadFile(file);
      const hashtags = hashtagsRaw.split(/[\s,#]+/).map(h => h.trim().replace(/^#/, "")).filter(Boolean);
      await Video.create({
        user_id: currentUser?.id || "",
        username: autoUsername,
        display_name: currentUser?.full_name || autoUsername,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${autoUsername}`,
        video_url: videoUrl,
        thumbnail_url: "",
        caption: caption.trim(),
        hashtags,
        likes_count: 0,
        comments_count: 0,
        views_count: 0,
        shares_count: 0,
        is_approved: true,
        is_archived: false,
      });
      setFile(null); setCaption(""); setHashtagsRaw(""); setPreview(null);
      if (onPosted) onPosted();
    } catch(e) { setError(e.message || "Upload failed"); }
    finally { setUploading(false); }
  };

  return (
    <div style={{ padding:"60px 20px 100px", maxWidth:480, margin:"0 auto" }}>
      <div style={{ color:"#fff", fontWeight:900, fontSize:22, letterSpacing:"-1px", marginBottom:4 }}>POST</div>
      <div style={{ width:40, height:3, background:"#e63946", marginBottom:24, borderRadius:2 }} />

      <label style={{ display:"block", cursor:"pointer" }}>
        <div style={{ border:"2px dashed #2a2a2a", borderRadius:8, aspectRatio:"9/16", maxHeight:320, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#0d0d0d", overflow:"hidden", position:"relative" }}>
          {preview
            ? <video src={preview} style={{ width:"100%", height:"100%", objectFit:"cover" }} muted playsInline />
            : <>
                <div style={{ fontSize:32, marginBottom:12 }}>📹</div>
                <div style={{ color:"#444", fontSize:11, letterSpacing:"3px", textTransform:"uppercase" }}>TAP TO SELECT VIDEO</div>
              </>
          }
        </div>
        <input type="file" accept="video/*" onChange={pickFile} style={{ display:"none" }} />
      </label>

      <div style={{ marginTop:20, display:"flex", flexDirection:"column", gap:12 }}>
        <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Write a caption..."
          rows={3}
          style={{ background:"#0d0d0d", border:"1px solid #1f1f1f", borderRadius:4, padding:"12px 16px", color:"#fff", fontSize:13, outline:"none", resize:"none", fontFamily:"inherit" }} />
        <input value={hashtagsRaw} onChange={e => setHashtagsRaw(e.target.value)} placeholder="#hashtags"
          style={{ background:"#0d0d0d", border:"1px solid #1f1f1f", borderRadius:4, padding:"12px 16px", color:"#fff", fontSize:13, outline:"none" }} />
        {error && <div style={{ color:"#e63946", fontSize:12 }}>{error}</div>}
        <button onClick={post} disabled={uploading || !file}
          style={{ padding:"15px", background:(uploading||!file)?"#1a1a1a":"#e63946", border:"none", borderRadius:4, color:(uploading||!file)?"#444":"#fff", fontSize:11, fontWeight:800, letterSpacing:"4px", textTransform:"uppercase", cursor:(uploading||!file)?"not-allowed":"pointer" }}>
          {uploading ? "UPLOADING..." : "POST VIDEO"}
        </button>
      </div>
    </div>
  );
}

// ── Profile ───────────────────────────────────────────────────────────────────
function ProfilePage({ currentUser, onLogout }) {
  const [videos, setVideos] = useState([]);
  const username = (currentUser?.username || currentUser?.full_name || currentUser?.email?.split("@")[0] || "user")
    .replace(/^@/, "").replace(/\s+/g, "_").toLowerCase();

  useEffect(() => {
    Video.filter({ username }).then(r => setVideos(Array.isArray(r) ? r : [])).catch(() => {});
  }, [username]);

  return (
    <div style={{ padding:"60px 20px 100px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
          style={{ width:72, height:72, borderRadius:8, background:"#1a1a1a", filter:"grayscale(20%)" }} />
        <div>
          <div style={{ color:"#fff", fontWeight:900, fontSize:18, letterSpacing:"-0.5px" }}>{currentUser?.full_name || username}</div>
          <div style={{ color:"#e63946", fontSize:12, fontWeight:700, letterSpacing:"1px" }}>@{username}</div>
          <div style={{ color:"#333", fontSize:10, marginTop:4 }}>{currentUser?.email}</div>
        </div>
      </div>
      <div style={{ display:"flex", gap:24, marginBottom:24 }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ color:"#fff", fontWeight:900, fontSize:20 }}>{videos.length}</div>
          <div style={{ color:"#444", fontSize:10, letterSpacing:"2px", textTransform:"uppercase" }}>Posts</div>
        </div>
      </div>
      {videos.length > 0 && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2 }}>
          {videos.map(v => (
            <div key={v.id} style={{ aspectRatio:"9/16", background:"#0d0d0d", overflow:"hidden" }}>
              <video src={v.video_url} poster={v.thumbnail_url||""} style={{ width:"100%", height:"100%", objectFit:"cover" }} muted playsInline />
            </div>
          ))}
        </div>
      )}
      <button onClick={onLogout}
        style={{ marginTop:32, width:"100%", padding:"14px", background:"transparent", border:"1px solid #2a2a2a", borderRadius:4, color:"#444", fontSize:11, fontWeight:800, letterSpacing:"3px", textTransform:"uppercase", cursor:"pointer" }}>
        SIGN OUT
      </button>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
function SachiApp({ currentUser, onLogout }) {
  const [tab, setTab] = useState("feed");

  const tabs = [
    { key:"feed",    label:"HOME",    icon:"▶" },
    { key:"upload",  label:"POST",    icon:"+" },
    { key:"profile", label:"ME",      icon:"◉" },
  ];

  return (
    <div style={{ background:"#0a0a0a", minHeight:"100svh", maxWidth:480, margin:"0 auto", fontFamily:"'Inter',-apple-system,sans-serif", position:"relative", display:"flex", flexDirection:"column" }}>
      <style>{`* { box-sizing: border-box } body { background: #0a0a0a; margin: 0 } ::-webkit-scrollbar { display: none }`}</style>

      {/* Top bar */}
      <div style={{ position:"fixed", top:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, zIndex:100, padding:"12px 20px 8px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"linear-gradient(to bottom,rgba(10,10,10,0.95),transparent)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:24, height:3, background:"#e63946", borderRadius:2 }} />
          <div style={{ fontSize:18, fontWeight:900, letterSpacing:"-1px", color:"#fff", textTransform:"uppercase", fontStyle:"italic" }}>SACHI</div>
          <div style={{ width:24, height:3, background:"#e63946", borderRadius:2 }} />
        </div>
        <div style={{ color:"#e63946", fontSize:10, fontWeight:800, letterSpacing:"2px" }}>@{(currentUser?.username || currentUser?.email?.split("@")[0] || "user").replace(/^@/,"")}</div>
      </div>

      {/* Content */}
      <div style={{ flex:1, paddingBottom:60 }}>
        {tab === "feed"    && <FeedPage currentUser={currentUser} />}
        {tab === "upload"  && <UploadPage currentUser={currentUser} onPosted={() => setTab("feed")} />}
        {tab === "profile" && <ProfilePage currentUser={currentUser} onLogout={onLogout} />}
      </div>

      {/* Bottom nav */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, zIndex:100, display:"flex", borderTop:"1px solid #1a1a1a", background:"rgba(10,10,10,0.97)", backdropFilter:"blur(12px)" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ flex:1, padding:"10px 0 14px", border:"none", background:"transparent", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, borderTop:`2px solid ${tab===t.key?"#e63946":"transparent"}`, transition:"border-color 0.2s" }}>
            <span style={{ fontSize:16, color:tab===t.key?"#e63946":"#333" }}>{t.icon}</span>
            <span style={{ fontSize:9, color:tab===t.key?"#fff":"#333", fontWeight:800, letterSpacing:"2px", textTransform:"uppercase" }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Entry Point ───────────────────────────────────────────────────────────────
export default function Index() {
  return (
    <AuthGate>
      {(currentUser, logout) => <SachiApp currentUser={currentUser} onLogout={logout} />}
    </AuthGate>
  );
}
// Mon Mar 30 17:48:58 UTC 2026
