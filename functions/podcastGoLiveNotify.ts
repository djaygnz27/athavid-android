import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Called when a podcast flips is_live = true
// Sends email notifications to all followers of that podcast
// Also notifies Jaya (app owner) that a show went live

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const { podcast_id, podcast_title, host_name, live_stream_url } = body;

    if (!podcast_id || !podcast_title) {
      return Response.json({ error: 'podcast_id and podcast_title are required' }, { status: 400 });
    }

    const results: any[] = [];
    let emailsSent = 0;

    // Get all AthaVid users (followers will be in here)
    // In a full system we'd filter by Follow entity — for now notify all active users
    const usersRes = await base44.asServiceRole.entities.AthaVidUser.list();
    const users = Array.isArray(usersRes) ? usersRes : (usersRes?.items || []);

    const activeUsers = users.filter((u: any) => u.status !== 'banned' && u.email);

    const streamLink = live_stream_url || 'https://sachistream.com';
    const podcastsLink = 'https://sachistream.com';

    for (const user of activeUsers) {
      try {
        await base44.asServiceRole.integrations.email.send({
          to: user.email,
          subject: `🔴 ${podcast_title} is LIVE on Sachi right now!`,
          html: `
            <div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#0a0a14;color:#fff;border-radius:16px;overflow:hidden;">
              <div style="background:linear-gradient(135deg,#1a0a2e,#0d1b4b);padding:32px 24px;text-align:center;">
                <div style="font-size:48px;margin-bottom:12px;">🎙️</div>
                <div style="background:#e53935;display:inline-flex;align-items:center;gap:8px;border-radius:20px;padding:6px 16px;margin-bottom:16px;">
                  <div style="width:8px;height:8px;border-radius:50%;background:#fff;"></div>
                  <span style="color:#fff;font-weight:800;font-size:14px;letter-spacing:1px;">LIVE NOW</span>
                </div>
                <h1 style="color:#fff;margin:0 0 8px;font-size:24px;">${podcast_title}</h1>
                <p style="color:rgba(255,255,255,0.6);margin:0;font-size:15px;">hosted by ${host_name || 'Unknown Host'}</p>
              </div>
              <div style="padding:28px 24px;text-align:center;">
                <p style="color:rgba(255,255,255,0.8);font-size:16px;line-height:1.6;margin:0 0 24px;">
                  ${host_name || 'Your favorite podcaster'} just went live on Sachi.<br/>Tune in now before you miss it!
                </p>
                <a href="${podcastsLink}" style="display:inline-block;background:linear-gradient(135deg,#e53935,#b71c1c);color:#fff;text-decoration:none;padding:16px 32px;border-radius:14px;font-weight:800;font-size:17px;">
                  🎧 Listen Live Now
                </a>
                <p style="color:rgba(255,255,255,0.3);font-size:12px;margin-top:24px;">
                  You're receiving this because you have an account on Sachi.<br/>
                  <a href="${podcastsLink}" style="color:rgba(255,255,255,0.4);">Manage your notifications</a>
                </p>
              </div>
              <div style="background:rgba(255,255,255,0.03);padding:16px 24px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
                <span style="color:rgba(255,255,255,0.3);font-size:12px;">Sachi — sachistream.com</span>
              </div>
            </div>
          `
        });
        emailsSent++;
        results.push({ user: user.email, status: 'sent' });
      } catch (e: any) {
        results.push({ user: user.email, status: 'failed', error: e.message });
      }
    }

    // Also notify Jaya (app owner) directly
    try {
      await base44.asServiceRole.integrations.email.send({
        to: 'jaygnz27@gmail.com',
        subject: `🔴 ${podcast_title} just went LIVE on Sachi — ${emailsSent} users notified`,
        html: `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto;">
            <h2>Sachi Podcast Live Alert</h2>
            <p><strong>${podcast_title}</strong> by ${host_name} just went live.</p>
            <p>Emails sent to <strong>${emailsSent}</strong> Sachi users.</p>
            <p><a href="${podcastsLink}">View on sachistream.com</a></p>
          </div>
        `
      });
    } catch(_) {}

    return Response.json({
      ok: true,
      podcast_title,
      emails_sent: emailsSent,
      total_users: activeUsers.length,
      results
    });

  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
