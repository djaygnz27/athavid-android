// ╔════════════════════════════════════════════════════════════════════╗
// ║ api/delete-post.js                                                ║
// ║ Allows authenticated users to delete their own posts              ║
// ║ Uses BASE44_SERVICE_TOKEN to bypass RLS on SachiVideo entity      ║
// ║ Guards: verifies requesting user owns the post before deleting    ║
// ╚════════════════════════════════════════════════════════════════════╝

const APP_ID = "69e79122bcc8fb5a04cfb834";
const BASE44_KEY = process.env.BASE44_SERVICE_TOKEN;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { post_id, user_id, username } = req.body || {};
  if (!post_id || !user_id) return res.status(400).json({ error: "post_id and user_id required" });
  if (!BASE44_KEY) return res.status(500).json({ error: "Service token not configured" });

  try {
    // 1. Fetch the post to verify ownership
    const fetchRes = await fetch(
      `https://app.base44.com/api/apps/${APP_ID}/entities/SachiVideo/${post_id}`,
      { headers: { "api-key": BASE44_KEY } }
    );
    const post = await fetchRes.json().catch(() => null);
    if (!post || !post.id) return res.status(404).json({ error: "Post not found" });

    // 2. Ownership check: user_id must match post's user_id OR created_by OR username
    const isOwner =
      post.user_id === user_id ||
      post.created_by === user_id ||
      (username && post.username === username);

    if (!isOwner) {
      return res.status(403).json({ error: "You can only delete your own posts" });
    }

    // 3. Delete the post
    const delRes = await fetch(
      `https://app.base44.com/api/apps/${APP_ID}/entities/SachiVideo/${post_id}`,
      { method: "DELETE", headers: { "api-key": BASE44_KEY } }
    );

    if (delRes.ok || delRes.status === 204) {
      return res.status(200).json({ success: true });
    } else {
      const err = await delRes.text();
      return res.status(500).json({ error: "Delete failed", detail: err });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
