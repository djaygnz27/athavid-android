// api/admin-delete-video.js — admin-only video deletion
const APP_ID = "69e79122bcc8fb5a04cfb834";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-Admin-Token");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { video_id } = req.body || {};
  const adminToken = req.headers["x-admin-token"];
  const SERVICE_TOKEN = process.env.BASE44_SERVICE_TOKEN;

  if (!video_id) return res.status(400).json({ error: "video_id required" });
  if (!SERVICE_TOKEN) return res.status(500).json({ error: "no service token" });
  if (adminToken !== process.env.ADMIN_SECRET) return res.status(403).json({ error: "forbidden" });

  // Try service-role delete
  const delRes = await fetch(
    `https://app.base44.com/api/apps/${APP_ID}/entities/SachiVideo/${video_id}`,
    { method: "DELETE", headers: { "api-key": SERVICE_TOKEN, "X-Service-Role": "true" } }
  );
  const body = await delRes.text();
  return res.status(delRes.status).json({ status: delRes.status, body });
}
