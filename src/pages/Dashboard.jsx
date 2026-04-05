import { useState, useEffect } from "react";
import { SachiVideo } from "@/api/entities";
import { SachiComment } from "@/api/entities";
import { BetaTester } from "@/api/entities";
import { SachiPodcast } from "@/api/entities";
import { AthaVidVideo } from "@/api/entities";

const COLORS = {
  navy: "#0B0C1A",
  gold: "#F5C842",
  coral: "#FF6B6B",
  purple: "#8B5CF6",
  green: "#10B981",
  blue: "#3B82F6",
  cardBg: "#12132A",
  border: "#1E2040",
  textMuted: "#8B8FA8",
};

function StatCard({ title, value, sub, color, icon }) {
  return (
    <div style={{
      background: COLORS.cardBg,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 16,
      padding: "20px 24px",
      flex: 1,
      minWidth: 150,
    }}>
      <div style={{ fontSize: 26, marginBottom: 4 }}>{icon}</div>
      <div style={{ color: COLORS.textMuted, fontSize: 11, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{title}</div>
      <div style={{ color, fontSize: 32, fontWeight: 800, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ color: COLORS.textMuted, fontSize: 11, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{
      color: COLORS.gold,
      fontWeight: 700,
      fontSize: 15,
      marginBottom: 12,
      marginTop: 28,
      borderLeft: `3px solid ${COLORS.gold}`,
      paddingLeft: 12,
    }}>{children}</div>
  );
}

function CreatorBar({ name, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>@{name}</span>
        <span style={{ color, fontSize: 13, fontWeight: 700 }}>{value.toLocaleString()} views</span>
      </div>
      <div style={{ background: COLORS.border, borderRadius: 8, height: 8 }}>
        <div style={{ background: color, width: `${pct}%`, height: 8, borderRadius: 8, transition: "width 0.6s" }} />
      </div>
    </div>
  );
}

function VideoRow({ video, rank }) {
  const views = video.views_count || 0;
  const likes = video.likes_count || 0;
  const comments = video.comments_count || 0;
  const caption = video.caption || "(no caption)";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "10px 0", borderBottom: `1px solid ${COLORS.border}`,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: rank <= 3 ? COLORS.gold : COLORS.border,
        color: rank <= 3 ? "#000" : COLORS.textMuted,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 800, fontSize: 13, flexShrink: 0,
      }}>{rank}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{caption}</div>
        <div style={{ color: COLORS.textMuted, fontSize: 11 }}>@{video.username}</div>
      </div>
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        <span style={{ color: COLORS.blue, fontSize: 12 }}>👁 {views}</span>
        <span style={{ color: COLORS.coral, fontSize: 12 }}>❤️ {likes}</span>
        <span style={{ color: COLORS.purple, fontSize: 12 }}>💬 {comments}</span>
      </div>
    </div>
  );
}

function WeekSelector({ weeks, selected, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
      {weeks.map((w) => (
        <button key={w.key} onClick={() => onChange(w.key)} style={{
          padding: "6px 16px", borderRadius: 20,
          border: `1px solid ${selected === w.key ? COLORS.gold : COLORS.border}`,
          background: selected === w.key ? COLORS.gold : "transparent",
          color: selected === w.key ? "#000" : COLORS.textMuted,
          fontWeight: selected === w.key ? 700 : 400,
          fontSize: 13, cursor: "pointer",
        }}>{w.label}</button>
      ))}
    </div>
  );
}

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildWeeks(allVideos, allComments) {
  if (allVideos.length === 0) return [];
  const allDates = allVideos.map(v => new Date(v.created_date)).sort((a, b) => a - b);
  const earliest = getWeekStart(allDates[0]);
  const thisWeekStart = getWeekStart(new Date());
  const weeks = [];
  let cursor = new Date(earliest);
  while (cursor <= thisWeekStart) {
    const start = new Date(cursor);
    const end = new Date(cursor);
    end.setDate(end.getDate() + 7);
    const vids = allVideos.filter(v => { const d = new Date(v.created_date); return d >= start && d < end; });
    const cmts = allComments.filter(c => { const d = new Date(c.created_date); return d >= start && d < end; });
    const label = `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(end - 1).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
    weeks.push({ key: start.toISOString(), label, start, end, videos: vids, comments: cmts });
    cursor.setDate(cursor.getDate() + 7);
  }
  return weeks.reverse();
}

export default function Dashboard() {
  const [allVideos, setAllVideos] = useState([]);
  const [sachiVideos, setSachiVideos] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [betaTesters, setBetaTesters] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [v1, v2, cmts, bt, pc] = await Promise.all([
          AthaVidVideo.list(),
          SachiVideo.list(),
          SachiComment.list(),
          BetaTester.list(),
          SachiPodcast.list(),
        ]);
        setAllVideos(v1 || []);
        setSachiVideos(v2 || []);
        setAllComments(cmts || []);
        setBetaTesters(bt || []);
        setPodcasts(pc || []);
      } catch (e) {
        setError(e.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const combinedVideos = [...allVideos, ...sachiVideos];
  const weeks = buildWeeks(combinedVideos, allComments);

  useEffect(() => {
    if (weeks.length > 0 && !selectedWeek) setSelectedWeek(weeks[0].key);
  }, [weeks.length]);

  if (loading) return (
    <div style={{ background: COLORS.navy, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 36 }}>🌸</div>
      <div style={{ color: COLORS.gold, fontSize: 18, fontWeight: 700 }}>Loading Sachi Analytics...</div>
      <div style={{ color: COLORS.textMuted, fontSize: 13 }}>Fetching platform data</div>
    </div>
  );

  if (error) return (
    <div style={{ background: COLORS.navy, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 36 }}>😅</div>
      <div style={{ color: COLORS.coral, fontSize: 16, fontWeight: 700 }}>Error loading dashboard</div>
      <div style={{ color: COLORS.textMuted, fontSize: 13 }}>{error}</div>
    </div>
  );

  const currentWeek = weeks.find(w => w.key === selectedWeek) || weeks[0];
  const prevWeek = currentWeek ? weeks[weeks.indexOf(currentWeek) + 1] : null;

  if (!currentWeek) return (
    <div style={{ background: COLORS.navy, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: COLORS.textMuted, fontSize: 16 }}>No video data yet.</div>
    </div>
  );

  const wVideos = currentWeek.videos;
  const totalViews = wVideos.reduce((s, v) => s + (v.views_count || 0), 0);
  const totalLikes = wVideos.reduce((s, v) => s + (v.likes_count || 0), 0);
  const totalComments = wVideos.reduce((s, v) => s + (v.comments_count || 0), 0);
  const prevViews = prevWeek ? prevWeek.videos.reduce((s, v) => s + (v.views_count || 0), 0) : null;
  const prevLikes = prevWeek ? prevWeek.videos.reduce((s, v) => s + (v.likes_count || 0), 0) : null;

  function delta(curr, prev) {
    if (prev === null) return null;
    if (prev === 0) return curr > 0 ? "+∞" : "—";
    const d = Math.round(((curr - prev) / prev) * 100);
    return d >= 0 ? `↑ +${d}% vs prev week` : `↓ ${d}% vs prev week`;
  }

  const creatorMap = {};
  wVideos.forEach(v => {
    const u = v.username || "unknown";
    if (!creatorMap[u]) creatorMap[u] = { views: 0, likes: 0, videos: 0 };
    creatorMap[u].views += v.views_count || 0;
    creatorMap[u].likes += v.likes_count || 0;
    creatorMap[u].videos += 1;
  });
  const creators = Object.entries(creatorMap).sort((a, b) => b[1].views - a[1].views);
  const maxViews = creators.length > 0 ? creators[0][1].views : 1;
  const topVideos = [...wVideos].sort((a, b) => (b.views_count || 0) - (a.views_count || 0)).slice(0, 8);
  const allTimeTop = [...combinedVideos].sort((a, b) => (b.views_count || 0) - (a.views_count || 0)).slice(0, 5);
  const activeTesters = betaTesters.filter(t => t.status === "Active").length;
  const invitedTesters = betaTesters.filter(t => t.status === "Invited").length;
  const engRate = totalViews > 0 ? ((totalLikes + totalComments) / totalViews * 100).toFixed(1) : "0.0";
  const uniqueCreators = new Set(wVideos.map(v => v.username)).size;
  const allTimeTotalViews = combinedVideos.reduce((s, v) => s + (v.views_count || 0), 0);
  const allTimeTotalLikes = combinedVideos.reduce((s, v) => s + (v.likes_count || 0), 0);

  return (
    <div style={{ background: COLORS.navy, minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif", color: "#fff", paddingBottom: 60 }}>

      {/* Header */}
      <div style={{
        background: "#0D0E1F", borderBottom: `1px solid ${COLORS.border}`,
        padding: "16px 24px", display: "flex", alignItems: "center", gap: 12,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ fontSize: 22 }}>🌸</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 17, color: "#fff" }}>Sachi™ Analytics</div>
          <div style={{ color: COLORS.textMuted, fontSize: 11 }}>Owner Dashboard · LDNA Consulting</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <div style={{ background: COLORS.green + "22", border: `1px solid ${COLORS.green}`, color: COLORS.green, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 600 }}>🟢 Live</div>
          <div style={{ background: COLORS.gold + "22", border: `1px solid ${COLORS.gold}`, color: COLORS.gold, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 600 }}>🔒 Private</div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>

        {/* Week selector */}
        <div style={{ color: COLORS.textMuted, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Select Week</div>
        <WeekSelector weeks={weeks} selected={selectedWeek} onChange={setSelectedWeek} />

        {/* KPIs */}
        <SectionTitle>📊 Key Metrics — {currentWeek.label}</SectionTitle>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <StatCard title="Total Views" value={totalViews.toLocaleString()} sub={delta(totalViews, prevViews)} color={COLORS.blue} icon="👁" />
          <StatCard title="Total Likes" value={totalLikes.toLocaleString()} sub={delta(totalLikes, prevLikes)} color={COLORS.coral} icon="❤️" />
          <StatCard title="Comments" value={totalComments.toLocaleString()} color={COLORS.purple} icon="💬" />
          <StatCard title="New Videos" value={wVideos.length} color={COLORS.gold} icon="🎬" />
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
          <StatCard title="Engagement Rate" value={`${engRate}%`} sub="(likes+comments)÷views" color={COLORS.green} icon="📈" />
          <StatCard title="Active Creators" value={uniqueCreators} color={COLORS.gold} icon="🎭" />
          <StatCard title="Beta Testers" value={activeTesters} sub={`${invitedTesters} invited`} color={COLORS.purple} icon="🧪" />
          <StatCard title="Podcasts" value={podcasts.length} sub={`${podcasts.filter(p => p.is_live).length} live`} color={COLORS.coral} icon="🎙" />
        </div>

        {/* Creator bars */}
        {creators.length > 0 && <>
          <SectionTitle>🏆 Creator Performance This Week</SectionTitle>
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "20px 24px" }}>
            {creators.map(([name, stats]) => (
              <div key={name}>
                <CreatorBar name={name} value={stats.views} max={maxViews} color={COLORS.blue} />
                <div style={{ display: "flex", gap: 14, marginBottom: 14, marginTop: -8 }}>
                  <span style={{ color: COLORS.textMuted, fontSize: 11 }}>❤️ {stats.likes} likes</span>
                  <span style={{ color: COLORS.textMuted, fontSize: 11 }}>🎬 {stats.videos} video{stats.videos !== 1 ? "s" : ""}</span>
                </div>
              </div>
            ))}
          </div>
        </>}

        {/* Top videos this week */}
        {topVideos.length > 0 && <>
          <SectionTitle>🔥 Top Videos This Week</SectionTitle>
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "8px 24px 16px" }}>
            {topVideos.map((v, i) => <VideoRow key={v.id} video={v} rank={i + 1} />)}
          </div>
        </>}

        {/* All-time top */}
        <SectionTitle>🌟 All-Time Top Videos</SectionTitle>
        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "8px 24px 16px" }}>
          {allTimeTop.map((v, i) => <VideoRow key={v.id} video={v} rank={i + 1} />)}
        </div>

        {/* Platform totals */}
        <SectionTitle>📱 Platform Totals — All Time</SectionTitle>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <StatCard title="Total Videos" value={combinedVideos.length} color={COLORS.gold} icon="🎬" />
          <StatCard title="Total Views" value={allTimeTotalViews.toLocaleString()} color={COLORS.blue} icon="👁" />
          <StatCard title="Total Likes" value={allTimeTotalLikes.toLocaleString()} color={COLORS.coral} icon="❤️" />
          <StatCard title="Total Comments" value={allComments.length} color={COLORS.purple} icon="💬" />
        </div>

        {/* Beta testers */}
        <SectionTitle>🧪 Beta Testing Status</SectionTitle>
        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "20px 24px" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {betaTesters.map(t => (
              <div key={t.id} style={{
                background: t.status === "Active" ? COLORS.green + "22" : COLORS.border,
                border: `1px solid ${t.status === "Active" ? COLORS.green : COLORS.border}`,
                borderRadius: 20, padding: "6px 14px", fontSize: 12,
              }}>
                <span style={{ color: t.status === "Active" ? COLORS.green : COLORS.textMuted, fontWeight: 600 }}>
                  {t.status === "Active" ? "✅" : "⏳"} {t.name}
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, color: COLORS.textMuted, fontSize: 12 }}>
            {activeTesters} active · {invitedTesters} pending · {betaTesters.length} total
          </div>
        </div>

        {/* Podcasts */}
        <SectionTitle>🎙 Podcast Status</SectionTitle>
        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "16px 24px" }}>
          {podcasts.map((p, i) => (
            <div key={p.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 0",
              borderBottom: i < podcasts.length - 1 ? `1px solid ${COLORS.border}` : "none",
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                background: p.is_live ? COLORS.coral : COLORS.textMuted,
                boxShadow: p.is_live ? `0 0 8px ${COLORS.coral}` : "none",
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{p.title}</div>
                <div style={{ color: COLORS.textMuted, fontSize: 11 }}>{p.category} · @{p.host_username}</div>
              </div>
              {p.is_live && (
                <div style={{ color: COLORS.coral, fontSize: 11, fontWeight: 700, background: COLORS.coral + "22", border: `1px solid ${COLORS.coral}`, borderRadius: 12, padding: "2px 10px" }}>
                  🔴 LIVE · {p.listener_count} listeners
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, textAlign: "center", color: COLORS.textMuted, fontSize: 11 }}>
          Sachi™ · LDNA Consulting · {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </div>
      </div>
    </div>
  );
}
