import { useState, useEffect } from "react";
import { SachiVideo } from "@/api/entities";
import { SachiUser } from "@/api/entities";
import { SachiReport } from "@/api/entities";
import { FoundingCreator } from "@/api/entities";
import { BugReport } from "@/api/entities";
import { SachiLiveRoom } from "@/api/entities";
import { SachiPodcast } from "@/api/entities";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVideos: 0,
    totalReports: 0,
    totalFoundingCreators: 0,
    totalBugReports: 0,
    liveRooms: 0,
    totalPodcasts: 0,
    pendingReports: 0,
    pendingCreators: 0,
    openBugs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentVideos, setRecentVideos] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const [videos, users, reports, creators, bugs, liveRooms, podcasts] =
        await Promise.all([
          SachiVideo.list("-created_date", 5),
          SachiUser.list("-created_date", 5),
          SachiReport.list(),
          FoundingCreator.list(),
          BugReport.list(),
          SachiLiveRoom.filter({ is_live: true }),
          SachiPodcast.list(),
        ]);

      const allVideos = await SachiVideo.list();
      const allUsers = await SachiUser.list();

      setStats({
        totalUsers: allUsers.length,
        totalVideos: allVideos.length,
        totalReports: reports.length,
        pendingReports: reports.filter((r) => r.status === "pending").length,
        totalFoundingCreators: creators.length,
        pendingCreators: creators.filter((c) => c.status === "pending").length,
        totalBugReports: bugs.length,
        openBugs: bugs.filter((b) => b.status === "open").length,
        liveRooms: liveRooms.length,
        totalPodcasts: podcasts.length,
      });

      setRecentVideos(videos);
      setRecentUsers(users);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading Sachi Admin...</div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, color: "bg-indigo-600", icon: "👤" },
    { label: "Total Videos", value: stats.totalVideos, color: "bg-purple-600", icon: "🎬" },
    { label: "Live Rooms", value: stats.liveRooms, color: "bg-red-600", icon: "🔴" },
    { label: "Podcasts", value: stats.totalPodcasts, color: "bg-yellow-600", icon: "🎙️" },
    { label: "Reports", value: stats.totalReports, sub: `${stats.pendingReports} pending`, color: "bg-orange-600", icon: "🚩" },
    { label: "Founding Creators", value: stats.totalFoundingCreators, sub: `${stats.pendingCreators} pending`, color: "bg-green-600", icon: "⭐" },
    { label: "Bug Reports", value: stats.totalBugReports, sub: `${stats.openBugs} open`, color: "bg-pink-600", icon: "🐛" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">🎛️ Sachi Stream Admin</h1>
        <p className="text-gray-400 mt-1">Platform overview — {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((card) => (
          <div key={card.label} className={`${card.color} rounded-2xl p-4 shadow-lg`}>
            <div className="text-3xl mb-1">{card.icon}</div>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="text-sm font-medium opacity-90">{card.label}</div>
            {card.sub && <div className="text-xs opacity-75 mt-1">{card.sub}</div>}
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Videos */}
        <div className="bg-gray-900 rounded-2xl p-5">
          <h2 className="text-lg font-bold mb-4 text-yellow-400">🎬 Recent Videos</h2>
          {recentVideos.length === 0 ? (
            <p className="text-gray-500">No videos yet.</p>
          ) : (
            <div className="space-y-3">
              {recentVideos.map((v) => (
                <div key={v.id} className="flex items-center gap-3 bg-gray-800 rounded-xl p-3">
                  {v.thumbnail_url ? (
                    <img src={v.thumbnail_url} className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center text-xl">🎬</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{v.caption || "No caption"}</p>
                    <p className="text-xs text-gray-400">@{v.username} · {v.views_count || 0} views</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${v.is_approved ? "bg-green-700" : "bg-red-800"}`}>
                    {v.is_approved ? "✓" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="bg-gray-900 rounded-2xl p-5">
          <h2 className="text-lg font-bold mb-4 text-blue-400">👤 Recent Users</h2>
          {recentUsers.length === 0 ? (
            <p className="text-gray-500">No users yet.</p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3 bg-gray-800 rounded-xl p-3">
                  {u.avatar_url ? (
                    <img src={u.avatar_url} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center font-bold">
                      {u.display_name?.[0] || "?"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{u.display_name || u.username}</p>
                    <p className="text-xs text-gray-400">@{u.username} · {u.location_city || u.location || "Unknown"}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${u.status === "active" ? "bg-green-700" : "bg-gray-700"}`}>
                    {u.status || "active"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8 bg-gray-900 rounded-2xl p-5">
        <h2 className="text-lg font-bold mb-4 text-gray-300">⚡ Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Manage Videos", href: "/admin-videos", icon: "🎬" },
            { label: "Manage Users", href: "/admin-users", icon: "👤" },
            { label: "Reports", href: "/admin-reports", icon: "🚩" },
            { label: "Founding Creators", href: "/admin-creators", icon: "⭐" },
            { label: "Live Rooms", href: "/admin-live", icon: "🔴" },
            { label: "Podcasts", href: "/admin-podcasts", icon: "🎙️" },
            { label: "Bug Reports", href: "/admin-bugs", icon: "🐛" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 transition px-4 py-2 rounded-xl text-sm font-medium"
            >
              {link.icon} {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
