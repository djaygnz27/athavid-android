// api/create-post.js
// Server-side SachiVideo record creation using service token.
// Fixes: Google-auth users have no Base44 JWT → 404 on direct entity writes.
// Solution: browser POSTs post data here, server writes to Base44 with service token.

const APP_ID = "69e79122bcc8fb5a04cfb834";
const BASE_URL = "https://sachi-04cfb834.base44.app/api";

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const SERVICE_TOKEN = process.env.BASE44_SERVICE_TOKEN;
  if (!SERVICE_TOKEN) return res.status(500).json({ error: "Service token not configured" });

  let body = req.body || {};
  if (typeof body === "string") { try { body = JSON.parse(body); } catch {} }

  // Read raw body if not parsed
  if (!body || !body.user_id) {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    try { body = JSON.parse(Buffer.concat(chunks).toString()); } catch {}
  }

  if (!body.user_id) return res.status(400).json({ error: "user_id required" });

  // Safety defaults — prevent "only_me" or missing visibility from hiding content
  if (!body.post_visibility || body.post_visibility === "") {
    body.post_visibility = "everyone";
  }
  if (body.is_approved === undefined || body.is_approved === null) {
    body.is_approved = body.post_visibility !== "only_me";
  }

  try {
    const apiRes = await fetch(`${BASE_URL}/apps/${APP_ID}/entities/SachiVideo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SERVICE_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    const data = await apiRes.json();
    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ error: data.message || data.error || "Base44 write failed" });
    }
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
