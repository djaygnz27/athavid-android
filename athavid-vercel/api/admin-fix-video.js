// ╔════════════════════════════════════════════════════════════════════════╗
// ║ api/admin-fix-video.js                                                  ║
// ║ One-off repair tool: re-runs the fixVideo() pipeline (see               ║
// ║ api/_videofix.js) against an ALREADY-uploaded R2 video key. Used to fix ║
// ║ black-screen videos that were uploaded before the 2026-07-07 automatic  ║
// ║ fix was added to r2-complete-multipart.js.                              ║
// ║ Auth: requires header x-fix-key to match R2_SECRET_ACCESS_KEY (already a    ║
// ║ private server secret) — not for public/client use.                     ║
// ╚════════════════════════════════════════════════════════════════════════╝

const { fixVideo, isVideoKey } = require("./_videofix.js");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://sachistream.com");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,x-fix-key");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const provided = req.headers["x-fix-key"];
  if (!provided || provided !== process.env.R2_SECRET_ACCESS_KEY) {
    return res.status(403).json({ error: "forbidden" });
  }

  let body = req.body || {};
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) {} }
  const { key } = body;
  if (!key) return res.status(400).json({ error: "key required" });
  if (!isVideoKey(key)) return res.status(400).json({ error: "key does not look like a video file" });

  try {
    const result = await fixVideo(key);
    return res.status(200).json({ success: true, result });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
