// Vercel serverless function — looks up a SachiUser by email using service token
// Avoids CORS issues with client-side Base44 API calls
const APP_ID = "69e79122bcc8fb5a04cfb834";
const BASE_URL = "https://api.base44.com/api";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "email required" });

  const SERVICE_TOKEN = process.env.BASE44_SERVICE_TOKEN;
  if (!SERVICE_TOKEN) return res.status(500).json({ error: "Service token not configured" });

  try {
    const apiRes = await fetch(
      `${BASE_URL}/apps/${APP_ID}/entities/SachiUser?email=${encodeURIComponent(email)}&limit=5`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SERVICE_TOKEN}`,
        },
      }
    );

    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ error: "API error", status: apiRes.status });
    }

    const data = await apiRes.json();
    const items = Array.isArray(data) ? data : (data?.items || data?.records || []);
    const found = items.find(u => u.email === email);

    if (found) return res.status(200).json(found);
    return res.status(404).json({ error: "User not found" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
