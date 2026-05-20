import base44 from "npm:@base44/sdk";

const app = base44.init({ appId: "69e79122bcc8fb5a04cfb834" });

export default async function handler(req: Request): Promise<Response> {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ error: "Email required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min

    // Delete any existing codes for this email
    const existing = await app.asServiceRole.entities.PasswordReset.filter({ email });
    for (const rec of existing) {
      await app.asServiceRole.entities.PasswordReset.delete(rec.id);
    }

    // Store new OTP
    await app.asServiceRole.entities.PasswordReset.create({ email, code, expiry });

    // Send via Resend
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Sachi Stream <noreply@sachistream.com>",
        to: [email],
        subject: "Your Sachi verification code",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0B0C1A;color:#fff;border-radius:12px;">
            <div style="text-align:center;margin-bottom:24px;">
              <span style="font-size:40px;">🌸</span>
              <h1 style="color:#F5C842;margin:8px 0;font-size:24px;">Sachi Stream</h1>
            </div>
            <p style="color:#ccc;font-size:16px;">Your verification code is:</p>
            <div style="background:#1a1b2e;border:2px solid #F5C842;border-radius:8px;padding:20px;text-align:center;margin:16px 0;">
              <span style="font-size:40px;font-weight:bold;letter-spacing:8px;color:#F5C842;">${code}</span>
            </div>
            <p style="color:#888;font-size:13px;">This code expires in 10 minutes. Don't share it with anyone.</p>
            <p style="color:#555;font-size:12px;margin-top:24px;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      }),
    });

    if (!resendRes.ok) {
      const err = await resendRes.text();
      console.error("Resend error:", err);
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (e) {
    console.error("sendOTP error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
