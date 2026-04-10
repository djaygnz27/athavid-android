import base44 from "npm:@base44/sdk";

const app = base44.createClient({ appId: "69b2ee18a8e6fb58c7f0261c" });

export default async function handler(req: Request): Promise<Response> {
  try {
    const { poster_id, poster_username, poster_avatar, video_caption, video_id } = await req.json();

    // Get all followers of the poster
    const followRes = await app.asServiceRole.entities.Follow.filter({ following_id: poster_id });
    const followers = Array.isArray(followRes) ? followRes : (followRes?.records || followRes?.items || []);

    if (!followers.length) return new Response(JSON.stringify({ sent: 0 }), { status: 200 });

    // Get follower emails from AthaVidUser
    let emailsSent = 0;
    for (const follow of followers) {
      try {
        const userRes = await app.asServiceRole.entities.AthaVidUser.filter({ id: follow.follower_id });
        const users = Array.isArray(userRes) ? userRes : (userRes?.records || userRes?.items || []);
        const user = users[0];
        if (!user?.email) continue;

        // Send email notification
        await fetch("https://api.base44.com/api/apps/69b2ee18a8e6fb58c7f0261c/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api_key": Deno.env.get("BASE44_API_KEY") || ""
          },
          body: JSON.stringify({
            to: user.email,
            subject: `@${poster_username} just posted on Sachi 🎬`,
            html: `
              <div style="font-family:sans-serif;background:#0B0C1A;color:#fff;padding:32px;max-width:480px;margin:0 auto;border-radius:16px;">
                <div style="text-align:center;margin-bottom:24px;">
                  <img src="https://www.sachistream.com/sachi-logo.png" style="height:40px;" />
                </div>
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
                  <img src="${poster_avatar}" style="width:52px;height:52px;border-radius:50%;border:2px solid #F5C842;" />
                  <div>
                    <div style="font-weight:700;font-size:16px;color:#fff;">@${poster_username}</div>
                    <div style="color:#888;font-size:13px;">Someone you follow just posted</div>
                  </div>
                </div>
                ${video_caption ? `<div style="background:rgba(255,255,255,0.06);border-radius:12px;padding:16px;margin-bottom:20px;color:#ddd;font-size:14px;">"${video_caption}"</div>` : ""}
                <a href="https://www.sachistream.com" style="display:block;text-align:center;background:linear-gradient(135deg,#6c63ff,#ff6b6b);color:#fff;font-weight:700;font-size:15px;padding:14px;border-radius:12px;text-decoration:none;">Watch Now on Sachi 🎬</a>
                <div style="text-align:center;margin-top:20px;color:#444;font-size:11px;">You're receiving this because you follow @${poster_username} on Sachi.<br/>Manage notifications in your profile settings.</div>
              </div>
            `
          })
        });
        emailsSent++;
      } catch(e) {}
    }

    return new Response(JSON.stringify({ sent: emailsSent, followers: followers.length }), { status: 200 });
  } catch(e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
