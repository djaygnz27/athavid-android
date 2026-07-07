// ╔════════════════════════════════════════════════════════════════════╗
// ║ api/video-tags.js — Moment Tags (tag people in videos)             ║
// ║ Actions:                                                           ║
// ║   POST { action:"create",  video_id, video_owner_id,               ║
// ║          video_caption, video_thumbnail, tagged_username,          ║
// ║          tagged_by_user_id, tagged_by_username,                    ║
// ║          timestamp_sec, frame_thumbnail_url }                      ║
// ║     -> looks up tagged user, creates a SachiVideoTag (pending),     ║
// ║        sends the "you were tagged" email via Resend                ║
// ║   POST { action:"approve", tag_id }  -> sets status=approved       ║
// ║   POST { action:"decline", tag_id }  -> sets status=declined       ║
// ║   GET  ?video_id=...   -> tags for a video (approved only)         ║
// ║   GET  ?user_id=...&status=pending  -> tags for a user's profile /  ║
// ║        pending-approval inbox                                      ║
// ╚════════════════════════════════════════════════════════════════════╝

const APP_ID = "69e79122bcc8fb5a04cfb834";
const BASE_URL = "https://app.base44.com/api";
const SERVICE_TOKEN = process.env.BASE44_SERVICE_TOKEN;
const RESEND_KEY = process.env.RESEND_API_KEY;

function authHeaders() {
  return { "Content-Type": "application/json", "api-key": SERVICE_TOKEN };
}

async function b44(path, opts = {}) {
  const r = await fetch(`${BASE_URL}/apps/${APP_ID}${path}`, {
    ...opts,
    headers: { ...authHeaders(), ...(opts.headers || {}) },
  });
  const data = await r.json().catch(() => null);
  if (!r.ok) throw new Error(`Base44 ${path} failed: ${r.status} ${JSON.stringify(data)}`);
  return data;
}

function normalize(res) {
  return Array.isArray(res) ? res : (res?.items || res?.data || res?.records || []);
}

async function lookupUserByUsername(username) {
  if (!username) return null;
  try {
    const res = await b44(`/entities/SachiUser?username=${encodeURIComponent(username)}&limit=1`);
    const items = normalize(res);
    return items?.[0] || null;
  } catch (e) {
    console.error("lookupUserByUsername failed:", e.message);
    return null;
  }
}

async function sendTaggedEmail({ to, tagged_username, tagged_by_username, video_caption, frame_thumbnail_url, video_id }) {
  if (!RESEND_KEY || !to) return { skipped: true };

  const videoUrl = `https://sachistream.com/post/${video_id}`;
  const frameHtml = frame_thumbnail_url
    ? `<img src="${frame_thumbnail_url}" alt="you were tagged here" style="width:100%;max-width:320px;border-radius:12px;display:block;margin:16px auto;" />`
    : "";
  const captionHtml = video_caption
    ? `<p style="font-size:13px;color:#888888;margin:8px 0 0;">On: <em>"${String(video_caption).substring(0, 100)}"</em></p>`
    : "";

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#000000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#000000;min-height:100vh;">
<tr><td align="center" style="padding:32px 16px;">
<table width="100%" style="max-width:480px;background:#0a0a0a;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);">
  <tr><td style="padding:28px 24px 20px;text-align:center;background:#000000;border-bottom:1px solid rgba(255,255,255,0.06);">
    <img src="https://sachistream.com/sachi-crystal.png" alt="Sachi" width="48" height="48" style="display:block;margin:0 auto 12px;border-radius:12px;" />
    <div style="font-size:22px;font-weight:900;color:#F5C842;letter-spacing:-0.5px;">Sachi Stream</div>
    <div style="font-size:10px;color:rgba(255,255,255,0.25);letter-spacing:3px;margin-top:4px;text-transform:uppercase;">You Were Tagged</div>
  </td></tr>
  <tr><td style="padding:24px 24px 8px;">
    <p style="font-size:16px;color:#eeeeee;margin:0 0 8px;">🏷️ <strong style="color:#ffffff;">${tagged_by_username}</strong> tagged you in a Sachi video — this is the exact moment you appear:</p>
    ${captionHtml}
    ${frameHtml}
    <p style="font-size:13px;color:#999999;margin:12px 0 0;">This tag won't show publicly until you approve it. You can also decline or remove yourself anytime.</p>
  </td></tr>
  <tr><td style="padding:8px 24px 28px;text-align:center;">
    <a href="${videoUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#F5C842,#FF9500);color:#000000;font-weight:800;font-size:15px;border-radius:14px;text-decoration:none;letter-spacing:-0.2px;">
      Review Tag →
    </a>
  </td></tr>
  <tr><td style="padding:16px 24px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
    <p style="font-size:11px;color:rgba(255,255,255,0.2);margin:0;line-height:1.6;">
      You're getting this because someone tagged you on Sachi Stream.<br/>
      <a href="https://sachistream.com" style="color:rgba(245,200,66,0.4);text-decoration:none;">sachistream.com</a>
    </p>
  </td></tr>
</table></td></tr></table>
</body></html>`;

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${RESEND_KEY}` },
    body: JSON.stringify({
      from: "Sachi Stream <notifications@sachistream.com>",
      to: [to],
      subject: `🏷️ ${tagged_by_username} tagged you in a Sachi video`,
      html,
    }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    console.error("Resend error (tag email):", data);
    return { ok: false, detail: data };
  }
  return { ok: true, id: data.id };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (!SERVICE_TOKEN) {
    return res.status(500).json({ ok: false, error: "BASE44_SERVICE_TOKEN not configured" });
  }

  try {
    if (req.method === "GET") {
      const { video_id, user_id, status } = req.query || {};
      if (video_id) {
        const res2 = await b44(`/entities/SachiVideoTag?video_id=${encodeURIComponent(video_id)}&limit=50`);
        let items = normalize(res2);
        if (!status) items = items.filter(t => t.status === "approved");
        return res.status(200).json({ ok: true, tags: items });
      }
      if (user_id) {
        const statusFilter = status ? `&status=${encodeURIComponent(status)}` : "";
        const res2 = await b44(`/entities/SachiVideoTag?tagged_user_id=${encodeURIComponent(user_id)}${statusFilter}&limit=100`);
        return res.status(200).json({ ok: true, tags: normalize(res2) });
      }
      return res.status(400).json({ ok: false, error: "video_id or user_id required" });
    }

    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    const body = req.body || {};
    const { action } = body;

    if (action === "create") {
      const {
        video_id, video_owner_id, video_caption, video_thumbnail,
        tagged_username, tagged_by_user_id, tagged_by_username,
        timestamp_sec, frame_thumbnail_url,
      } = body;

      if (!video_id || !tagged_username || !tagged_by_user_id) {
        return res.status(400).json({ ok: false, error: "video_id, tagged_username, tagged_by_user_id required" });
      }
      if (tagged_username.toLowerCase() === (tagged_by_username || "").toLowerCase()) {
        return res.status(400).json({ ok: false, error: "You can't tag yourself" });
      }

      const taggedUser = await lookupUserByUsername(tagged_username);
      if (!taggedUser) {
        return res.status(404).json({ ok: false, error: `No Sachi user found with username "${tagged_username}"` });
      }

      // Guardrail: max 10 tags per video
      const existingRes = await b44(`/entities/SachiVideoTag?video_id=${encodeURIComponent(video_id)}&limit=50`);
      const existing = normalize(existingRes);
      if (existing.length >= 10) {
        return res.status(400).json({ ok: false, error: "Max 10 tags per video reached" });
      }
      if (existing.some(t => t.tagged_user_id === taggedUser.id && t.status !== "declined")) {
        return res.status(400).json({ ok: false, error: `${tagged_username} is already tagged on this video` });
      }

      const created = await b44(`/entities/SachiVideoTag`, {
        method: "POST",
        body: JSON.stringify({
          video_id,
          video_owner_id: video_owner_id || tagged_by_user_id,
          tagged_user_id: taggedUser.id,
          tagged_username,
          tagged_by_user_id,
          tagged_by_username: tagged_by_username || "",
          timestamp_sec: typeof timestamp_sec === "number" ? timestamp_sec : 0,
          frame_thumbnail_url: frame_thumbnail_url || video_thumbnail || "",
          status: "pending",
          notified: false,
        }),
      });

      let emailResult = { skipped: true };
      if (taggedUser.email) {
        emailResult = await sendTaggedEmail({
          to: taggedUser.email,
          tagged_username,
          tagged_by_username: tagged_by_username || "someone",
          video_caption,
          frame_thumbnail_url: frame_thumbnail_url || video_thumbnail,
          video_id,
        });
        if (emailResult.ok) {
          await b44(`/entities/SachiVideoTag/${created.id}`, {
            method: "PUT",
            body: JSON.stringify({ notified: true }),
          });
        }
      }

      return res.status(200).json({ ok: true, tag: created, email: emailResult });
    }

    if (action === "approve" || action === "decline") {
      const { tag_id } = body;
      if (!tag_id) return res.status(400).json({ ok: false, error: "tag_id required" });
      const updated = await b44(`/entities/SachiVideoTag/${tag_id}`, {
        method: "PUT",
        body: JSON.stringify({ status: action === "approve" ? "approved" : "declined" }),
      });
      return res.status(200).json({ ok: true, tag: updated });
    }

    if (action === "remove") {
      // Tagged user removing themselves after the fact — same as decline
      const { tag_id } = body;
      if (!tag_id) return res.status(400).json({ ok: false, error: "tag_id required" });
      const updated = await b44(`/entities/SachiVideoTag/${tag_id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "declined" }),
      });
      return res.status(200).json({ ok: true, tag: updated });
    }

    return res.status(400).json({ ok: false, error: `Unknown action: ${action}` });
  } catch (err) {
    console.error("video-tags error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
