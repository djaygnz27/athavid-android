import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const APP_ID = "69b2ee18a8e6fb58c7f0261c";
const BASE_URL = "https://sachi-c7f0261c.base44.app/api";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
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

    // Store new OTP
    await fetch(`${BASE_URL}/apps/${APP_ID}/entities/PasswordReset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalizedEmail, code: otp, expiry })
    });

    // Send via Zoho SMTP using smtplib-style TCP (use fetch to Zoho API)
    const zohoToken = Deno.env.get("ZOHO_API_TOKEN") || "";
    const zohoAccountId = Deno.env.get("ZOHO_ACCOUNT_ID") || "";

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

    const zohoRes = await fetch(`https://mail.zoho.com/api/accounts/${zohoAccountId}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Zoho-oauthtoken ${zohoToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fromAddress: "support@sachistream.com",
        toAddress: normalizedEmail,
        subject: "Your Sachi verification code",
        mailFormat: "html",
        content: htmlBody,
      }),
    });

    const zohoData = await zohoRes.json().catch(() => ({}));
    console.log("Zoho response:", JSON.stringify(zohoData));

    return Response.json({ success: true }, { headers: corsHeaders });

  } catch (e) {
    console.error("sendOTP error:", e);
    return Response.json({ error: "Server error", detail: String(e) }, { status: 500, headers: corsHeaders });
  }
});
