import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const APP_ID = Deno.env.get("BASE44_APP_ID") || "69b2ee18a8e6fb58c7f0261c";
    const SERVICE_TOKEN = Deno.env.get("BASE44_SERVICE_TOKEN");
    const BASE_URL = "https://sachi-c7f0261c.base44.app/api";

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (SERVICE_TOKEN) headers["Authorization"] = `Bearer ${SERVICE_TOKEN}`;

    // Helper to paginate entity endpoint
    const fetchAll = async (entity: string) => {
      let all: any[] = [], skip = 0, hasMore = true;
      while (hasMore) {
        const res = await fetch(
          `${BASE_URL}/apps/${APP_ID}/entities/${entity}?limit=500&skip=${skip}&sort=-created_date`,
          { headers }
        );
        const data = await res.json();
        const items = data.items || (Array.isArray(data) ? data : []);
        all = [...all, ...items];
        hasMore = data.has_more === true && items.length === 500;
        skip += 500;
      }
      return all;
    };

    // Fetch all data in parallel
    const [allUsers, allVideos, allComments] = await Promise.all([
      fetchAll("AthaVidUser"),
      fetchAll("SachiVideo"),
      fetchAll("SachiComment"),
    ]);

    // Compute analytics
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);

    const newToday = allUsers.filter((u: any) => (u.created_date || "").slice(0, 10) === todayStr).length;
    const newThisWeek = allUsers.filter((u: any) => new Date(u.created_date) >= weekAgo).length;
    const totalViews = allVideos.reduce((s: number, v: any) => s + (v.views_count || 0), 0);
    const totalLikes = allVideos.reduce((s: number, v: any) => s + (v.likes_count || 0), 0);
    const matureCount = allVideos.filter((v: any) => v.is_mature).length;

    // Daily buckets 14 days
    const days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (13 - i));
      return d.toISOString().slice(0, 10);
    });
    const byDay = (arr: any[], dateField: string) => {
      const map: Record<string, number> = {};
      days.forEach(d => map[d] = 0);
      arr.forEach((item: any) => {
        const d = (item[dateField] || "").slice(0, 10);
        if (map[d] !== undefined) map[d]++;
      });
      return days.map(d => ({ date: d, count: map[d] }));
    };

    // Top creators by video count
    const creatorMap: Record<string, number> = {};
    allVideos.forEach((v: any) => {
      const u = v.username || "unknown";
      creatorMap[u] = (creatorMap[u] || 0) + 1;
    });
    const topCreators = Object.entries(creatorMap)
      .sort((a, b) => b[1] - a[1]).slice(0, 5)
      .map(([username, count]) => ({ username, count }));

    const topVideos = [...allVideos]
      .sort((a, b) => (b.views_count || 0) - (a.views_count || 0)).slice(0, 5);
    const recentUsers = [...allUsers]
      .sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime())
      .slice(0, 20);

    // Location breakdown
    const locationMap: Record<string, number> = {};
    allUsers.forEach((u: any) => {
      const loc = u.location || "Unknown";
      locationMap[loc] = (locationMap[loc] || 0) + 1;
    });

    return Response.json({
      users: allUsers,
      analytics: {
        totalUsers: allUsers.length,
        totalVideos: allVideos.length,
        totalComments: allComments.length,
        totalViews, totalLikes, matureCount,
        newToday, newThisWeek,
        dailyVideos: byDay(allVideos, "created_date"),
        dailyUsers: byDay(allUsers, "created_date"),
        topCreators, topVideos, recentUsers,
        locationBreakdown: Object.entries(locationMap).sort((a, b) => b[1] - a[1]),
      }
    });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
