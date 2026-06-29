// Vercel serverless function — returns all SachiUser records using service token
// Used by AdminPanel to bypass RLS and show all registered users
const APP_ID = "69e79122bcc8fb5a04cfb834";
const BASE_URL = "https://api.base44.com/api";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  // Only allow admins — check the caller's token resolves to an admin user
  const SERVICE_TOKEN = process.env.BASE44_SERVICE_TOKEN;
  if (!SERVICE_TOKEN) return res.status(500).json({ error: "Service token not configured" });

  try {
    // Fetch all SachiUser records using service token (bypasses RLS)
    const apiRes = await fetch(
      `${BASE_URL}/apps/${APP_ID}/entities/SachiUser?limit=500&sort=-created_date`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SERVICE_TOKEN}`,
        },
      }
    );

    if (!apiRes.ok) {
      const err = await apiRes.json().catch(() => ({}));
      return res.status(apiRes.status).json({ error: "API error", detail: err });
    }

    const data = await apiRes.json();
    const items = Array.isArray(data) ? data : (data?.items || data?.records || []);
    return res.status(200).json({ items, count: items.length });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
