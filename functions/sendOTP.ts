Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const APP_ID = "69b2ee18a8e6fb58c7f0261c";
  const BASE_URL = "https://sachi-c7f0261c.base44.app/api";

  function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { email } = body;

    if (!email || !email.includes("@")) {
      return Response.json({ error: "Invalid email address" }, { status: 400, headers: corsHeaders });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Delete any existing OTPs for this email
    try {
      const existing = await fetch(
        `${BASE_URL}/apps/${APP_ID}/entities/PasswordReset?email=${encodeURIComponent(normalizedEmail)}&limit=10`,
        { headers: { "Content-Type": "application/json" } }
      );
      const existingData = await existing.json();
      const items = Array.isArray(existingData) ? existingData : (existingData?.items || []);
      for (const item of items) {
        await fetch(`${BASE_URL}/apps/${APP_ID}/entities/PasswordReset/${item.id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
        });
      }
    } catch (_) {}

    // Store new OTP in database
    await fetch(`${BASE_URL}/apps/${APP_ID}/entities/PasswordReset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalizedEmail, code: otp, expiry })
    });

    // Send email via Zoho SMTP using SmtpClient
    const { SMTPClient } = await import("npm:emailjs@4.0.3");

    const zohoPassword = Deno.env.get("ZOHO_APP_PASSWORD") || "";

    const client = new SMTPClient({
      user: "support@sachistream.com",
      password: zohoPassword,
      host: "smtppro.zoho.com",
      port: 465,
      ssl: true,
    });

    const htmlBody = `
      <div style="font-family:sans-serif;background:#0B0C1A;color:#fff;padding:40px;max-width:480px;margin:0 auto;border-radius:16px;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="font-size:40px;">🌸</div>
          <h2 style="color:#F5C842;margin:8px 0;">Sachi Stream</h2>
          <p style="color:#aaa;font-size:14px;">Where truth meets community</p>
        </div>
        <div style="background:#1a1b2e;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
          <p style="color:#ccc;font-size:14px;margin:0 0 16px;">Your verification code is:</p>
          <div style="font-size:42px;font-weight:900;letter-spacing:12px;color:#F5C842;">${otp}</div>
          <p style="color:#666;font-size:12px;margin:16px 0 0;">Expires in 10 minutes</p>
        </div>
        <p style="color:#555;font-size:12px;text-align:center;">If you didn't request this, ignore this email.</p>
      </div>
    `;

    await client.sendAsync({
      text: `Your Sachi verification code is: ${otp} (expires in 10 minutes)`,
      from: "Sachi Stream <support@sachistream.com>",
      to: normalizedEmail,
      subject: "Your Sachi verification code",
      attachment: [{ data: htmlBody, alternative: true }],
    });

    console.log(`OTP sent to ${normalizedEmail}`);
    return Response.json({ success: true }, { headers: corsHeaders });

  } catch (e) {
    console.error("sendOTP error:", e);
    return Response.json({ error: "Server error", detail: String(e) }, { status: 500, headers: corsHeaders });
  }
});
