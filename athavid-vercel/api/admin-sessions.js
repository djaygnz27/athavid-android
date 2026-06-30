// admin-sessions.js — service-token-backed endpoint to fetch all SachiSession records
// Used by AdminPanel to build the Last Seen map for each user
// Bypasses RLS so all sessions are visible, not just the logged-in user's

const APP_ID = "69e79122bcc8fb5a04cfb834";
const BASE44_URL = `https://sachi-${APP_ID}.base44.app/api/apps/${APP_ID}`;

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const SERVICE_TOKEN = process.env.BASE44_SERVICE_TOKEN;
  if (!SERVICE_TOKEN) return res.status(500).json({ error: "Service token not configured" });

  try {
    // Fetch all sessions, sorted newest first, limit 2000 (enough for last-seen per user)
    const r = await fetch(
      `${BASE44_URL}/entities/SachiSession?limit=2000&sort=-session_start`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SERVICE_TOKEN}`
        }
      }
    );

    if (!r.ok) {
      const text = await r.text();
      console.error("admin-sessions fetch error:", r.status, text);
      return res.status(r.status).json({ error: text });
    }

    const data = await r.json();
    const items = Array.isArray(data) ? data : (data?.items || data?.records || []);
    return res.status(200).json({ items });
  } catch (e) {
    console.error("admin-sessions error:", e);
    return res.status(500).json({ error: e.message });
  }
}
