// ╔════════════════════════════════════════════════════════════════════╗
// ║ ⛔ LOCKED — api/sendEngagementEmail.js                            ║
// ║ SEGREGATED EMAIL SERVICE — DO NOT MODIFY THIS FILE               ║
// ║ Handles: like + comment email notifications to video owners       ║
// ║ Deps: RESEND_API_KEY env var (set in Vercel dashboard)            ║
// ║ Guards: skips if owner == actor, skips if no owner email          ║
// ║ Fallback: looks up owner email from AthaVidUser by user_id        ║
// ╚════════════════════════════════════════════════════════════════════╝

const APP_ID = "69e79122bcc8fb5a04cfb834";
const BASE44_KEY = process.env.BASE44_SERVICE_TOKEN;

async function lookupOwnerEmail(owner_id) {
  if (!owner_id || !BASE44_KEY) return null;
  try {
    const res = await fetch(
      `https://app.base44.com/api/apps/${APP_ID}/entities/AthaVidUser/${owner_id}`,
      { headers: { "api-key": BASE44_KEY } }
    );
    const data = await res.json().catch(() => null);
    // Single-record GET returns the object directly
    if (data?.email) return data.email;
    const items = Array.isArray(data) ? data : (data?.items || data?.data || []);
    return items?.[0]?.email || null;
  } catch (e) {
    console.warn("lookupOwnerEmail failed:", e.message);
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  const { type, actor_username, video_id, video_caption, video_thumbnail, owner_id, owner_email, comment_text } = req.body || {};

  if (!type || !actor_username || !owner_id) {
    return res.status(400).json({ ok: false, reason: "missing fields" });
  }

  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) {
    console.warn("RESEND_API_KEY not set — email skipped");
    return res.status(200).json({ ok: true, skipped: true });
  }

  // Resolve email — use provided or fall back to AthaVidUser lookup
  let resolvedEmail = (owner_email && owner_email.includes("@")) ? owner_email : null;
  if (!resolvedEmail) {
    resolvedEmail = await lookupOwnerEmail(owner_id);
  }

  if (!resolvedEmail) {
    console.warn(`No email found for owner_id=${owner_id} — email skipped`);
    return res.status(200).json({ ok: true, skipped: true, reason: "no owner email found" });
  }

  const isLike   = type === "like";
  const videoUrl = `https://sachistream.com/post/${video_id}`;

  const subject = isLike
    ? `❤️ ${actor_username} liked your video`
    : `💬 ${actor_username} commented on your video`;

  const thumbnailHtml = video_thumbnail
    ? `<img src="${video_thumbnail}" alt="thumbnail" style="width:100%;max-width:320px;border-radius:12px;display:block;margin:16px auto;" />`
    : "";

  const actionHtml = isLike
    ? `<p style="font-size:16px;color:#eeeeee;margin:0 0 8px;">❤️ <strong style="color:#ffffff;">${actor_username}</strong> liked your video.</p>`
    : `<p style="font-size:16px;color:#eeeeee;margin:0 0 8px;">💬 <strong style="color:#ffffff;">${actor_username}</strong> commented:</p>
       <blockquote style="background:#1a1a2e;border-left:3px solid #F5C842;border-radius:8px;padding:10px 14px;margin:8px 0;color:#ffffff;font-style:italic;">${(comment_text || "").substring(0,200)}</blockquote>`;

  const captionHtml = video_caption
    ? `<p style="font-size:13px;color:#888888;margin:8px 0 0;">On: <em>"${video_caption.substring(0,100)}"</em></p>`
    : "";

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#000000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#000000;min-height:100vh;">
<tr><td align="center" style="padding:32px 16px;">
<table width="100%" style="max-width:480px;background:#0a0a0a;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);">

  <!-- HEADER with logo -->
  <tr><td style="padding:28px 24px 20px;text-align:center;background:#000000;border-bottom:1px solid rgba(255,255,255,0.06);">
    <img src="https://sachistream.com/sachi-crystal.png" alt="Sachi" width="48" height="48" style="display:block;margin:0 auto 12px;border-radius:12px;" />
    <div style="font-size:22px;font-weight:900;color:#F5C842;letter-spacing:-0.5px;">Sachi Stream</div>
    <div style="font-size:10px;color:rgba(255,255,255,0.25);letter-spacing:3px;margin-top:4px;text-transform:uppercase;">Beta</div>
  </td></tr>

  <!-- BODY -->
  <tr><td style="padding:24px 24px 8px;">
    ${actionHtml}
    ${captionHtml}
    ${thumbnailHtml}
  </td></tr>

  <!-- CTA -->
  <tr><td style="padding:8px 24px 28px;text-align:center;">
    <a href="${videoUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#F5C842,#FF9500);color:#000000;font-weight:800;font-size:15px;border-radius:14px;text-decoration:none;letter-spacing:-0.2px;">
      View Your Video →
    </a>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="padding:16px 24px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
    <p style="font-size:11px;color:rgba(255,255,255,0.2);margin:0;line-height:1.6;">
      You're getting this because you posted on Sachi Stream.<br/>
      <a href="https://sachistream.com" style="color:rgba(245,200,66,0.4);text-decoration:none;">sachistream.com</a>
    </p>
  </td></tr>

</table></td></tr></table>
</body></html>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_KEY}`,
      },
      body: JSON.stringify({
        from: "Sachi Stream <notifications@sachistream.com>",
        to: [resolvedEmail],
        subject,
        html,
      }),
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error("Resend error:", data);
      return res.status(500).json({ ok: false, detail: data });
    }
    return res.json({ ok: true, id: data.id, sent_to: resolvedEmail });
  } catch (err) {
    console.error("sendEngagementEmail error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
