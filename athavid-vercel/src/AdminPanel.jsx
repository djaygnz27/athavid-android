import React, { useState, useEffect } from "react";

const APP_ID = "69e79122bcc8fb5a04cfb834";
const BASE_URL = "https://sachi-04cfb834.base44.app/api";

function getToken() { return localStorage.getItem("sachi_token"); }

async function apiGet(entity, params = "") {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}/apps/${APP_ID}/entities/${entity}?sort=-created_date&limit=500${params}`, { headers });
  if (!res.ok) throw new Error(`${entity} fetch failed`);
  return res.json();
}

async function apiPut(entity, id, data) {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}/apps/${APP_ID}/entities/${entity}/${id}`, {
    method: "PUT", headers, body: JSON.stringify(data)
  });
  return res.json();
}

async function apiDelete(entity, id) {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  await fetch(`${BASE_URL}/apps/${APP_ID}/entities/${entity}/${id}`, { method: "DELETE", headers });
}

// ── NAV ──────────────────────────────────────────────────────────
function Nav({ active, setActive }) {
  const tabs = [
    { id: "dashboard", label: "🎛️ Dashboard" },
    { id: "videos",    label: "🎬 Videos" },
    { id: "users",     label: "👤 Users" },
    { id: "reports",   label: "🚩 Reports" },
    { id: "live",      label: "🔴 Live" },
    { id: "podcasts",  label: "🎙️ Podcasts" },
    { id: "bugs",      label: "🐛 Bugs" },
  ];
  return (
    <div style={{ background: "#111827", borderBottom: "1px solid #374151", padding: "0 16px", display: "flex", overflowX: "auto", gap: 4 }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setActive(t.id)}
          style={{
            background: active === t.id ? "#7c3aed" : "transparent",
            color: active === t.id ? "#fff" : "#9ca3af",
            border: "none", borderRadius: 8, padding: "10px 14px",
            cursor: "pointer", fontWeight: active === t.id ? 700 : 400,
            fontSize: 13, whiteSpace: "nowrap"
          }}>
          {t.label}
        </button>
      ))}
      <div style={{ flex: 1 }} />
      <a href="/" style={{ color: "#9ca3af", fontSize: 12, padding: "10px 8px", textDecoration: "none" }}>← Back to Sachi</a>
    </div>
  );
}

// ── DASHBOARD ────────────────────────────────────────────────────
function Dashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    Promise.all([
      apiGet("AthaVidUser"),
      apiGet("SachiVideo"),
      apiGet("SachiReport"),
      apiGet("BugReport"),
      apiGet("SachiLiveRoom", "&is_live=true"),
      apiGet("SachiPodcast"),
    ]).then(([users, videos, reports, bugs, live, podcasts]) => {
      setStats({
        users: users.length, videos: videos.length,
        reports: reports.length, pendingReports: reports.filter(r => r.status === "pending").length,
        bugs: bugs.length, openBugs: bugs.filter(b => b.status === "open").length,
        live: live.length, podcasts: podcasts.length,
        recentVideos: videos.slice(0, 5), recentUsers: users.slice(0, 5),
      });
    }).catch(console.error);
  }, []);

  if (!stats) return <Spinner text="Loading dashboard..." />;

  const cards = [
    { label: "Users", value: stats.users, bg: "#4f46e5", icon: "👤" },
    { label: "Videos", value: stats.videos, bg: "#7c3aed", icon: "🎬" },
    { label: "Live Now", value: stats.live, bg: "#dc2626", icon: "🔴" },
    { label: "Podcasts", value: stats.podcasts, bg: "#d97706", icon: "🎙️" },
    { label: "Reports", value: stats.reports, sub: `${stats.pendingReports} pending`, bg: "#ea580c", icon: "🚩" },
    { label: "Bugs", value: stats.bugs, sub: `${stats.openBugs} open`, bg: "#db2777", icon: "🐛" },
  ];

  return (
    <div style={{ padding: 24, color: "#fff" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>🎛️ Sachi Admin</h1>
      <p style={{ color: "#9ca3af", marginBottom: 24, fontSize: 14 }}>
        {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 16, marginBottom: 32 }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: c.bg, borderRadius: 16, padding: 16 }}>
            <div style={{ fontSize: 28 }}>{c.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{c.value}</div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>{c.label}</div>
            {c.sub && <div style={{ fontSize: 11, opacity: 0.7 }}>{c.sub}</div>}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#1f2937", borderRadius: 16, padding: 20 }}>
          <h2 style={{ color: "#fbbf24", fontSize: 15, fontWeight: 700, marginBottom: 12 }}>🎬 Recent Videos</h2>
          {stats.recentVideos.map(v => (
            <div key={v.id} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10, background: "#111827", borderRadius: 10, padding: 10 }}>
              {v.thumbnail_url
                ? <img src={v.thumbnail_url} style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }} />
                : <div style={{ width: 44, height: 44, borderRadius: 8, background: "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}>🎬</div>}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.caption || "No caption"}</div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>@{v.username} · {v.views_count || 0} views</div>
              </div>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: v.is_approved ? "#166534" : "#991b1b" }}>
                {v.is_approved ? "✓" : "Pending"}
              </span>
            </div>
          ))}
        </div>

        <div style={{ background: "#1f2937", borderRadius: 16, padding: 20 }}>
          <h2 style={{ color: "#60a5fa", fontSize: 15, fontWeight: 700, marginBottom: 12 }}>👤 Recent Users</h2>
          {stats.recentUsers.map(u => (
            <div key={u.id} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10, background: "#111827", borderRadius: 10, padding: 10 }}>
              {u.avatar_url
                ? <img src={u.avatar_url} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                : <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{u.display_name?.[0] || "?"}</div>}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.display_name || u.username}</div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>@{u.username}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── VIDEOS ───────────────────────────────────────────────────────
function Videos() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => { apiGet("SachiVideo").then(d => { setVideos(d); setLoading(false); }).catch(console.error); }, []);

  const filtered = videos.filter(v => {
    const m = (v.caption || "").toLowerCase().includes(search.toLowerCase()) || (v.username || "").toLowerCase().includes(search.toLowerCase());
    if (filter === "pending") return m && !v.is_approved;
    if (filter === "approved") return m && v.is_approved;
    if (filter === "archived") return m && v.is_archived;
    if (filter === "ai") return m && v.is_ai_detected;
    return m;
  });

  if (loading) return <Spinner text="Loading videos..." />;

  return (
    <div style={{ padding: 24, color: "#fff" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>🎬 Videos</h1>
      <p style={{ color: "#9ca3af", marginBottom: 20, fontSize: 13 }}>{videos.length} total</p>
      <SearchFilter value={search} onChange={setSearch} filters={["all","pending","approved","archived","ai"]} active={filter} onFilter={setFilter} accent="#7c3aed" placeholder="Search caption or username..." />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(v => (
          <div key={v.id} style={{ background: "#1f2937", borderRadius: 16, padding: 16, display: "flex", gap: 12, alignItems: "center" }}>
            {v.thumbnail_url
              ? <img src={v.thumbnail_url} style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
              : <div style={{ width: 60, height: 60, borderRadius: 10, background: "#374151", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🎬</div>}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.caption || "No caption"}</div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>@{v.username} · {v.views_count || 0} views · {v.likes_count || 0} likes</div>
              <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                {v.is_approved && <Badge color="#166534">✓ Approved</Badge>}
                {v.is_archived && <Badge color="#374151">Archived</Badge>}
                {v.is_ai_detected && <Badge color="#991b1b">🤖 AI</Badge>}
                {v.is_mature && <Badge color="#92400e">🔞</Badge>}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
              <Btn color={v.is_approved ? "#854d0e" : "#166534"} onClick={() => apiPut("SachiVideo", v.id, { is_approved: !v.is_approved }).then(() => apiGet("SachiVideo").then(setVideos))}>
                {v.is_approved ? "Unapprove" : "Approve"}
              </Btn>
              <Btn color="#374151" onClick={() => apiPut("SachiVideo", v.id, { is_archived: !v.is_archived }).then(() => apiGet("SachiVideo").then(setVideos))}>
                {v.is_archived ? "Unarchive" : "Archive"}
              </Btn>
              <Btn color="#7f1d1d" onClick={() => confirm("Delete?") && apiDelete("SachiVideo", v.id).then(() => setVideos(vs => vs.filter(x => x.id !== v.id)))}>Delete</Btn>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <Empty />}
      </div>
    </div>
  );
}

// ── USERS ────────────────────────────────────────────────────────
function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => { apiGet("AthaVidUser").then(d => { setUsers(d); setLoading(false); }).catch(console.error); }, []);

  const filtered = users.filter(u => {
    const m = (u.display_name || "").toLowerCase().includes(search.toLowerCase()) ||
              (u.username || "").toLowerCase().includes(search.toLowerCase()) ||
              (u.email || "").toLowerCase().includes(search.toLowerCase());
    if (filter === "verified") return m && u.is_verified;
    if (filter === "banned") return m && u.status === "banned";
    if (filter === "18+") return m && u.is_18_plus;
    return m;
  });

  if (loading) return <Spinner text="Loading users..." />;

  return (
    <div style={{ padding: 24, color: "#fff" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>👤 Users</h1>
      <p style={{ color: "#9ca3af", marginBottom: 20, fontSize: 13 }}>{users.length} total</p>
      <SearchFilter value={search} onChange={setSearch} filters={["all","verified","banned","18+"]} active={filter} onFilter={setFilter} accent="#4f46e5" placeholder="Search name, username, email..." />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(u => (
          <div key={u.id} style={{ background: "#1f2937", borderRadius: 16, padding: 16, display: "flex", gap: 12, alignItems: "center" }}>
            {u.avatar_url
              ? <img src={u.avatar_url} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
              : <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>{u.display_name?.[0] || "?"}</div>}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600 }}>{u.display_name || u.username}</div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>@{u.username} · {u.email}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                {u.is_verified && <Badge color="#1e3a5f">✓ Verified</Badge>}
                {u.is_18_plus && <Badge color="#92400e">18+</Badge>}
                {u.status === "banned" && <Badge color="#7f1d1d">🚫 Banned</Badge>}
                <Badge color="#374151">{u.followers_count || 0} followers</Badge>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
              <Btn color={u.is_verified ? "#374151" : "#1e40af"} onClick={() => apiPut("AthaVidUser", u.id, { is_verified: !u.is_verified }).then(() => apiGet("AthaVidUser").then(setUsers))}>
                {u.is_verified ? "Unverify" : "Verify"}
              </Btn>
              <Btn color={u.status === "banned" ? "#166534" : "#7f1d1d"} onClick={() => apiPut("AthaVidUser", u.id, { status: u.status === "banned" ? "active" : "banned" }).then(() => apiGet("AthaVidUser").then(setUsers))}>
                {u.status === "banned" ? "Unban" : "Ban"}
              </Btn>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <Empty />}
      </div>
    </div>
  );
}

// ── REPORTS ──────────────────────────────────────────────────────
function Reports() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => { apiGet("SachiReport").then(d => { setReports(d); setLoading(false); }).catch(console.error); }, []);

  const filtered = reports.filter(r => {
    const m = (r.video_caption || "").toLowerCase().includes(search.toLowerCase()) || (r.reporter_username || "").toLowerCase().includes(search.toLowerCase());
    if (filter !== "all") return m && r.status === filter;
    return m;
  });

  if (loading) return <Spinner text="Loading reports..." />;

  const statusBg = { pending: "#92400e", reviewed: "#1e40af", resolved: "#166534", dismissed: "#374151" };

  return (
    <div style={{ padding: 24, color: "#fff" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>🚩 Reports</h1>
      <p style={{ color: "#9ca3af", marginBottom: 20, fontSize: 13 }}>{reports.length} total · {reports.filter(r => r.status === "pending").length} pending</p>
      <SearchFilter value={search} onChange={setSearch} filters={["all","pending","reviewed","resolved","dismissed"]} active={filter} onFilter={setFilter} accent="#ea580c" placeholder="Search reporter or video..." />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(r => (
          <div key={r.id} style={{ background: "#1f2937", borderRadius: 16, padding: 16 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                  <Badge color={statusBg[r.status] || "#374151"}>{r.status || "pending"}</Badge>
                  <span style={{ fontSize: 11, color: "#6b7280" }}>{new Date(r.created_date).toLocaleDateString()}</span>
                </div>
                <div style={{ fontWeight: 600 }}>Reported by: <span style={{ color: "#fb923c" }}>@{r.reporter_username}</span></div>
                <div style={{ fontSize: 13, color: "#9ca3af" }}>Video by: @{r.video_username}</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>Reason: <span style={{ color: "#fbbf24" }}>{r.reason}</span></div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                <Btn color="#1e40af" onClick={() => apiPut("SachiReport", r.id, { status: "reviewed" }).then(() => apiGet("SachiReport").then(setReports))}>Reviewed</Btn>
                <Btn color="#166534" onClick={() => apiPut("SachiReport", r.id, { status: "resolved" }).then(() => apiGet("SachiReport").then(setReports))}>Resolve</Btn>
                <Btn color="#374151" onClick={() => apiPut("SachiReport", r.id, { status: "dismissed" }).then(() => apiGet("SachiReport").then(setReports))}>Dismiss</Btn>
                <Btn color="#7f1d1d" onClick={() => confirm("Delete?") && apiDelete("SachiReport", r.id).then(() => setReports(rs => rs.filter(x => x.id !== r.id)))}>Delete</Btn>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <Empty />}
      </div>
    </div>
  );
}

// ── LIVE ROOMS ───────────────────────────────────────────────────
function Live() {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => { apiGet("SachiLiveRoom").then(d => { setRooms(d); setLoading(false); }).catch(console.error); }, []);

  const filtered = rooms.filter(r => {
    const m = (r.title || "").toLowerCase().includes(search.toLowerCase()) || (r.host_username || "").toLowerCase().includes(search.toLowerCase());
    if (filter === "live") return m && r.is_live;
    if (filter === "ended") return m && !r.is_live;
    return m;
  });

  if (loading) return <Spinner text="Loading live rooms..." />;

  return (
    <div style={{ padding: 24, color: "#fff" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>🔴 Live Rooms</h1>
      <p style={{ color: "#9ca3af", marginBottom: 20, fontSize: 13 }}>{rooms.length} total · {rooms.filter(r => r.is_live).length} live now</p>
      <SearchFilter value={search} onChange={setSearch} filters={["all","live","ended"]} active={filter} onFilter={setFilter} accent="#dc2626" placeholder="Search title or host..." />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(r => (
          <div key={r.id} style={{ background: "#1f2937", borderRadius: 16, padding: 16, display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#7f1d1d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🔴</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                {r.is_live && <Badge color="#dc2626" pulse>● LIVE</Badge>}
                <Badge color="#374151">{r.category || "General"}</Badge>
              </div>
              <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title || "Untitled Room"}</div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>@{r.host_username} · {r.viewer_count || 0} viewers</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
              {r.is_live && <Btn color="#c2410c" onClick={() => apiPut("SachiLiveRoom", r.id, { is_live: false }).then(() => apiGet("SachiLiveRoom").then(setRooms))}>End Room</Btn>}
              <Btn color="#7f1d1d" onClick={() => confirm("Delete?") && apiDelete("SachiLiveRoom", r.id).then(() => setRooms(rs => rs.filter(x => x.id !== r.id)))}>Delete</Btn>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <Empty />}
      </div>
    </div>
  );
}

// ── PODCASTS ─────────────────────────────────────────────────────
function Podcasts() {
  const [podcasts, setPodcasts] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiGet("SachiPodcast"), apiGet("SachiPodcastEpisode")])
      .then(([p, e]) => { setPodcasts(p); setEpisodes(e); setLoading(false); })
      .catch(console.error);
  }, []);

  const filtered = podcasts.filter(p => {
    const m = (p.title || "").toLowerCase().includes(search.toLowerCase()) || (p.host_username || "").toLowerCase().includes(search.toLowerCase());
    if (filter === "live") return m && p.is_live;
    if (filter === "active") return m && p.status === "active";
    if (filter === "inactive") return m && p.status === "inactive";
    return m;
  });

  if (loading) return <Spinner text="Loading podcasts..." />;

  return (
    <div style={{ padding: 24, color: "#fff" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>🎙️ Podcasts</h1>
      <p style={{ color: "#9ca3af", marginBottom: 20, fontSize: 13 }}>{podcasts.length} podcasts · {episodes.length} episodes</p>
      <SearchFilter value={search} onChange={setSearch} filters={["all","live","active","inactive"]} active={filter} onFilter={setFilter} accent="#d97706" placeholder="Search title or host..." />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background: "#1f2937", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: 16, display: "flex", gap: 12, alignItems: "center" }}>
              {p.cover_image_url
                ? <img src={p.cover_image_url} style={{ width: 52, height: 52, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                : <div style={{ width: 52, height: 52, borderRadius: 10, background: "#92400e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🎙️</div>}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                  {p.is_live && <Badge color="#dc2626" pulse>● LIVE</Badge>}
                  <Badge color={p.status === "active" ? "#166534" : "#374151"}>{p.status || "active"}</Badge>
                </div>
                <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>@{p.host_username} · {p.episode_count || 0} eps · {p.follower_count || 0} followers</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                <Btn color="#374151" onClick={() => setExpanded(expanded === p.id ? null : p.id)}>{expanded === p.id ? "Hide" : "Episodes"}</Btn>
                <Btn color={p.status === "active" ? "#854d0e" : "#166534"} onClick={() => apiPut("SachiPodcast", p.id, { status: p.status === "active" ? "inactive" : "active" }).then(() => apiGet("SachiPodcast").then(setPodcasts))}>
                  {p.status === "active" ? "Deactivate" : "Activate"}
                </Btn>
                <Btn color="#7f1d1d" onClick={() => confirm("Delete?") && apiDelete("SachiPodcast", p.id).then(() => setPodcasts(ps => ps.filter(x => x.id !== p.id)))}>Delete</Btn>
              </div>
            </div>
            {expanded === p.id && (
              <div style={{ borderTop: "1px solid #374151", padding: 16 }}>
                <div style={{ color: "#fbbf24", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Episodes</div>
                {episodes.filter(e => e.podcast_id === p.id).length === 0
                  ? <div style={{ color: "#6b7280", fontSize: 13 }}>No episodes yet.</div>
                  : episodes.filter(e => e.podcast_id === p.id).map(ep => (
                    <div key={ep.id} style={{ display: "flex", gap: 10, alignItems: "center", background: "#111827", borderRadius: 10, padding: 10, marginBottom: 6 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>Ep {ep.episode_number || "?"} — {ep.title}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>{ep.duration_seconds ? `${Math.floor(ep.duration_seconds/60)}m` : "N/A"} · {ep.like_count || 0} likes</div>
                      </div>
                      <Btn color="#7f1d1d" onClick={() => confirm("Delete episode?") && apiDelete("SachiPodcastEpisode", ep.id).then(() => setEpisodes(es => es.filter(x => x.id !== ep.id)))}>Delete</Btn>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <Empty />}
      </div>
    </div>
  );
}

// ── BUG REPORTS ──────────────────────────────────────────────────
function Bugs() {
  const [bugs, setBugs] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => { apiGet("BugReport").then(d => { setBugs(d); setLoading(false); }).catch(console.error); }, []);

  const filtered = bugs.filter(b => {
    const m = (b.bug_description || "").toLowerCase().includes(search.toLowerCase()) || (b.tester_name || "").toLowerCase().includes(search.toLowerCase());
    if (filter !== "all") return m && b.status === filter;
    return m;
  });

  if (loading) return <Spinner text="Loading bug reports..." />;

  const sevBg = { critical: "#7f1d1d", high: "#c2410c", medium: "#854d0e", low: "#166534" };
  const stBg = { open: "#7f1d1d", "in-progress": "#1e40af", resolved: "#166534", closed: "#374151" };

  return (
    <div style={{ padding: 24, color: "#fff" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>🐛 Bug Reports</h1>
      <p style={{ color: "#9ca3af", marginBottom: 20, fontSize: 13 }}>{bugs.length} total · {bugs.filter(b => b.status === "open").length} open · {bugs.filter(b => b.severity === "critical").length} critical</p>
      <SearchFilter value={search} onChange={setSearch} filters={["all","open","in-progress","resolved","closed"]} active={filter} onFilter={setFilter} accent="#db2777" placeholder="Search description or tester..." />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(b => (
          <div key={b.id} style={{ background: "#1f2937", borderRadius: 16, padding: 16 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
                  <Badge color={sevBg[b.severity] || "#374151"}>{b.severity || "unknown"}</Badge>
                  <Badge color={stBg[b.status] || "#374151"}>{b.status || "open"}</Badge>
                  <span style={{ fontSize: 11, color: "#6b7280" }}>{new Date(b.created_date).toLocaleDateString()}</span>
                </div>
                <div style={{ fontWeight: 600 }}>{b.bug_description}</div>
                <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>👤 {b.tester_name} · 📱 {b.device || "Unknown"}</div>
                {b.screenshot_url && <a href={b.screenshot_url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#60a5fa" }}>📸 Screenshot</a>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                <Btn color="#1e40af" onClick={() => apiPut("BugReport", b.id, { status: "in-progress" }).then(() => apiGet("BugReport").then(setBugs))}>In Progress</Btn>
                <Btn color="#166534" onClick={() => apiPut("BugReport", b.id, { status: "resolved" }).then(() => apiGet("BugReport").then(setBugs))}>Resolve</Btn>
                <Btn color="#374151" onClick={() => apiPut("BugReport", b.id, { status: "closed" }).then(() => apiGet("BugReport").then(setBugs))}>Close</Btn>
                <Btn color="#7f1d1d" onClick={() => confirm("Delete?") && apiDelete("BugReport", b.id).then(() => setBugs(bs => bs.filter(x => x.id !== b.id)))}>Delete</Btn>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <Empty />}
      </div>
    </div>
  );
}

// ── SHARED COMPONENTS ────────────────────────────────────────────
function Spinner({ text }) {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#9ca3af", fontSize: 18 }}>{text}</div>
    </div>
  );
}

function Empty() {
  return <div style={{ color: "#6b7280", textAlign: "center", padding: 32 }}>Nothing found.</div>;
}

function Badge({ color, children, pulse }) {
  return (
    <span style={{
      background: color, color: "#fff", fontSize: 11,
      padding: "2px 8px", borderRadius: 20, fontWeight: 500,
      animation: pulse ? "pulse 2s infinite" : "none"
    }}>{children}</span>
  );
}

function Btn({ color, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      background: color, color: "#fff", border: "none", borderRadius: 8,
      padding: "5px 12px", fontSize: 12, cursor: "pointer", fontWeight: 500,
      transition: "opacity 0.15s"
    }} onMouseOver={e => e.target.style.opacity = 0.8} onMouseOut={e => e.target.style.opacity = 1}>
      {children}
    </button>
  );
}

function SearchFilter({ value, onChange, filters, active, onFilter, accent, placeholder }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ background: "#1f2937", color: "#fff", border: `1px solid ${active !== "all" ? accent : "#374151"}`, borderRadius: 10, padding: "8px 14px", flex: 1, minWidth: 200, outline: "none", fontSize: 13 }} />
      {filters.map(f => (
        <button key={f} onClick={() => onFilter(f)}
          style={{ background: active === f ? accent : "#1f2937", color: active === f ? "#fff" : "#9ca3af", border: "none", borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontSize: 12, fontWeight: active === f ? 700 : 400, textTransform: "capitalize" }}>
          {f}
        </button>
      ))}
    </div>
  );
}

// ── MAIN EXPORT ──────────────────────────────────────────────────
export default function AdminPanel() {
  const [tab, setTab] = useState("dashboard");

  const pages = {
    dashboard: <Dashboard />,
    videos: <Videos />,
    users: <Users />,
    reports: <Reports />,
    live: <Live />,
    podcasts: <Podcasts />,
    bugs: <Bugs />,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#030712", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Nav active={tab} setActive={setTab} />
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {pages[tab]}
      </div>
    </div>
  );
}
