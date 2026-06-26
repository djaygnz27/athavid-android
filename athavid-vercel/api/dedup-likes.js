// One-time admin endpoint — deduplicates SachiLike records by (video_id, user_id)
// Keeps the most recent like per user per video, deletes extras.
// Protected by admin token.

const APP_ID = "69e79122bcc8fb5a04cfb834";
const BASE44_KEY = process.env.BASE44_SERVICE_TOKEN;
const BASE = "https://api.base44.com/api";

async function b44(path, method = "GET", body = null) {
  const res = await fetch(`${BASE}/apps/${APP_ID}/entities/${path}`, {
    method,
    headers: { "Content-Type": "application/json", api_key: BASE44_KEY },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return res.json();
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const { admin_token } = req.body || {};
  if (admin_token !== process.env.BASE44_SERVICE_TOKEN) {
    return res.status(403).json({ error: "forbidden" });
  }

  // Fetch all SachiLike records
  let all = [];
  let skip = 0;
  while (true) {
    const chunk = await b44(`SachiLike?limit=500&skip=${skip}&sort=created_date`);
    const items = Array.isArray(chunk) ? chunk : (chunk.records || chunk.items || []);
    if (!items.length) break;
    all = all.concat(items);
    skip += items.length;
    if (items.length < 500) break;
  }

  // Group by (video_id, user_id)
  const groups = {};
  for (const lk of all) {
    const key = `${lk.video_id}__${lk.user_id}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(lk);
  }

  // Delete duplicates — keep newest
  const toDelete = [];
  for (const recs of Object.values(groups)) {
    if (recs.length <= 1) continue;
    recs.sort((a, b) => (b.created_date || "").localeCompare(a.created_date || ""));
    toDelete.push(...recs.slice(1));
  }

  let deleted = 0;
  for (const lk of toDelete) {
    await b44(`SachiLike/${lk.id}`, "DELETE");
    deleted++;
  }

  return res.status(200).json({
    total_records: all.length,
    duplicates_deleted: deleted,
    unique_combos: Object.keys(groups).length,
  });
}
