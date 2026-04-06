import base44 from "../base44client.ts";

export default async function handler(req: Request): Promise<Response> {
  const { host_email, host_name, podcast_title, category } = await req.json();

  if (!host_email || !host_name || !podcast_title) {
    return new Response(JSON.stringify({ ok: false, error: "Missing fields" }), { status: 400 });
  }

  await base44.email.send({
    to: host_email,
    subject: `🎙️ Welcome to Sachi Podcasts — "${podcast_title}" is LIVE!`,
    html: `
      <div style="background:#0B0C1A;padding:40px 24px;font-family:sans-serif;max-width:520px;margin:0 auto;border-radius:16px;">
        <div style="text-align:center;margin-bottom:28px;">
          <span style="font-size:52px;">🎙️</span>
          <h1 style="color:#F5C842;font-size:24px;margin:12px 0 4px;">You're live on Sachi!</h1>
          <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0;">${podcast_title} is now discoverable by all Sachi users</p>
        </div>

        <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:20px;margin-bottom:24px;">
          <p style="color:#fff;font-size:15px;margin:0 0 6px;"><strong>Hi ${host_name},</strong></p>
          <p style="color:rgba(255,255,255,0.65);font-size:14px;line-height:1.7;margin:0;">
            Your podcast <strong style="color:#fff;">"${podcast_title}"</strong> in the <strong style="color:#a78bfa;">${category}</strong> category is now active on Sachi. No waiting, no approval — you're already on the platform.
          </p>
        </div>

        <div style="background:rgba(229,57,53,0.08);border:1px solid rgba(229,57,53,0.25);border-radius:14px;padding:20px;margin-bottom:24px;">
          <p style="color:#e57373;font-weight:700;font-size:13px;margin:0 0 10px;letter-spacing:1px;text-transform:uppercase;">How to go live in 3 steps</p>
          <p style="color:rgba(255,255,255,0.7);font-size:14px;line-height:1.9;margin:0;">
            1️⃣ Open <a href="https://sachistream.com" style="color:#F5C842;">sachistream.com</a> and tap the <strong style="color:#fff;">Podcasts</strong> tab<br/>
            2️⃣ Find your show under <strong style="color:#F5C842;">My Shows</strong> and tap it<br/>
            3️⃣ Tap <strong style="color:#e53935;">🔴 Go Live Now</strong> — all Sachi users get notified instantly
          </p>
        </div>

        <div style="background:rgba(108,60,247,0.1);border:1px solid rgba(108,60,247,0.25);border-radius:14px;padding:16px;margin-bottom:28px;">
          <p style="color:#a78bfa;font-weight:700;font-size:13px;margin:0 0 6px;">💡 Pro tip</p>
          <p style="color:rgba(255,255,255,0.6);font-size:13px;line-height:1.6;margin:0;">
            Add your stream URL (YouTube Live, Twitch, or any link) before going live so listeners can tap straight into your session.
          </p>
        </div>

        <div style="text-align:center;">
          <a href="https://sachistream.com" style="display:inline-block;background:linear-gradient(135deg,#6c3cf7,#4527a0);color:#fff;font-weight:700;font-size:15px;padding:14px 36px;border-radius:12px;text-decoration:none;">Open Sachi Now →</a>
        </div>

        <p style="color:rgba(255,255,255,0.2);font-size:11px;text-align:center;margin-top:28px;">
          Sachi™ by LDNA Consulting · sachistream.com<br/>
          Questions? Email us at jaygnz27@gmail.com
        </p>
      </div>
    `,
  });

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
