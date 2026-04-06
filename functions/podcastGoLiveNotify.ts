import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Known Sachi users - updated April 2026
const SACHI_USER_EMAILS = [
  "jaygnz27@gmail.com",
  "lasanjaya@gmail.com",
  "djaygnz27@gmail.com",
  "acegun39@gmail.com",
  "lasanjaya172@gmail.com",
  "dharshienie2002@gmail.com",
  "gunzboi56@gmail.com",
  "workplayhard785@gmail.com",
  "mary.manj@gmail.com",
  "amnyc86@gmail.com",
  "jcnet2626@outlook.com",
  "testcheck999@gmail.com",
];

Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const { podcast_title, host_name, live_stream_url } = body;

    if (!podcast_title) {
      return Response.json({ error: "podcast_title required" }, { status: 400, headers: corsHeaders });
    }

    // Try to get live users from DB; fall back to known list
    let emailsToNotify: string[] = SACHI_USER_EMAILS;
    try {
      const users = await base44.asServiceRole.entities.User.filter({}, { limit: 500 });
      const userList = Array.isArray(users) ? users : (users?.records || users?.items || []);
      if (userList.length > 0) {
        emailsToNotify = userList
          .map((u: any) => u.email)
          .filter((e: any) => typeof e === "string" && e.includes("@"));
      }
    } catch (_) {
      // Use fallback list
    }

    const uniqueEmails = [...new Set(emailsToNotify)] as string[];
    const liveUrl = live_stream_url || "https://sachistream.com";
    const results: any[] = [];
    let sent = 0;

    for (const email of uniqueEmails) {
      try {
        // Correct Base44 SDK pattern: integrations.Core.SendEmail
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: email,
          subject: `🔴 LIVE NOW on Sachi: ${podcast_title}`,
          sender_name: "Sachi Stream",
          body: `
            <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; background: #0B0C1A; color: #fff; padding: 32px; border-radius: 16px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="font-size: 52px; margin-bottom: 12px;">🎙️</div>
                <div style="background: #e53935; display: inline-block; padding: 5px 18px; border-radius: 20px; font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">
                  🔴 &nbsp;LIVE NOW
                </div>
              </div>
              <h2 style="text-align: center; color: #F5C842; margin: 0 0 8px; font-size: 22px;">${podcast_title}</h2>
              <p style="text-align: center; color: rgba(255,255,255,0.55); margin: 0 0 28px; font-size: 14px;">Hosted by <strong style="color:rgba(255,255,255,0.85)">${host_name}</strong></p>
              <div style="text-align: center; margin-bottom: 28px;">
                <a href="${liveUrl}" style="background: linear-gradient(135deg, #e53935, #b71c1c); color: #fff; text-decoration: none; padding: 15px 36px; border-radius: 30px; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 4px 20px rgba(229,57,53,0.4);">
                  🎧 &nbsp;Tune In Now
                </a>
              </div>
              <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin-bottom: 20px;">
              <p style="text-align: center; color: rgba(255,255,255,0.25); font-size: 11px; margin: 0;">
                Sachi™ &nbsp;·&nbsp; <a href="https://sachistream.com" style="color: #F5C842; text-decoration: none;">sachistream.com</a>
              </p>
            </div>
          `,
        });
        results.push({ user: email, status: "sent" });
        sent++;
      } catch (err: any) {
        results.push({ user: email, status: "failed", error: err.message || String(err) });
      }
    }

    return Response.json(
      { ok: true, podcast_title, emails_sent: sent, total_users: uniqueEmails.length, results },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    return Response.json({ error: error.message || String(error) }, { status: 500, headers: corsHeaders });
  }
});
