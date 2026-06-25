// ONE-SHOT: Backfill media_url for Cloudflare videos missing direct MP4 links
// DELETE THIS FILE AFTER USE
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const SERVICE_TOKEN = process.env.BASE44_SERVICE_TOKEN;
  const APP_ID = "69e79122bcc8fb5a04cfb834";
  const BASE = `https://app.base44.com/api/apps/${APP_ID}/entities/SachiVideo`;

  // Fetch all videos
  const listRes = await fetch(`${BASE}?limit=500`, {
    headers: { Authorization: `Bearer ${SERVICE_TOKEN}` }
  });
  const data = await listRes.json();
  const videos = Array.isArray(data) ? data : (data.items || []);

  const toFix = videos.filter(v =>
    !v.media_url &&
    v.video_url &&
    v.video_url.includes("cloudflarestream.com")
  );

  const results = [];
  for (const v of toFix) {
    const m = v.video_url.match(/cloudflarestream\.com\/([a-f0-9]+)/);
    const uid = m ? m[1] : null;
    if (!uid) { results.push({ id: v.id, status: "skip-no-uid" }); continue; }

    const mp4_url = `https://customer-i1ij9522l179kiqc.cloudflarestream.com/${uid}/downloads/default.mp4`;

    const putRes = await fetch(`${BASE}/${v.id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${SERVICE_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ...v, media_url: mp4_url })
    });
    results.push({ id: v.id, username: v.username, status: putRes.ok ? "ok" : `fail-${putRes.status}` });
  }

  return res.status(200).json({ total: toFix.length, results });
}
