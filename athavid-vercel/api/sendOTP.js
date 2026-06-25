// ╔════════════════════════════════════════════════════════════════════╗
// ║ ⛔ LOCKED — api/sendOTP.js v3                                     ║
// ║ Stateless OTP — no database required                              ║
// ║ HMAC-signs the code with OTP_SECRET + email + timestamp           ║
// ║ verifyOTP re-derives the HMAC to validate without DB lookup       ║
// ╚════════════════════════════════════════════════════════════════════╝

import crypto from "crypto";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const OTP_SECRET     = process.env.OTP_SECRET || process.env.BASE44_SERVICE_TOKEN || "sachi-otp-secret-2026";

function generateOtp(email, windowMin) {
  // Deterministic 6-digit OTP for a given email + 10-minute window
  const window = Math.floor(Date.now() / (10 * 60 * 1000)) + windowMin;
  const hmac = crypto.createHmac("sha256", OTP_SECRET)
    .update(`${email.toLowerCase()}:${window}`)
    .digest("hex");
  // Take 6 digits from the hex
  const num = parseInt(hmac.slice(0, 8), 16) % 1000000;
  return String(num).padStart(6, "0");
}

export { generateOtp }; // shared with verifyOTP

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { email } = req.body;
    if (!email || !email.includes("@")) return res.status(400).json({ error: "Valid email required" });

    const code = generateOtp(email.trim().toLowerCase(), 0);

    // Send email via Resend
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Sachi Stream <noreply@sachistream.com>",
        to: [email.trim()],
        subject: "Your Sachi verification code",
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0B0C1A;color:#fff;border-radius:12px;">
          <div style="text-align:center;margin-bottom:24px;">
            <span style="font-size:40px;">🌸</span>
            <h1 style="color:#F5C842;margin:8px 0;font-size:24px;">Sachi Stream</h1>
          </div>
          <p style="color:#ccc;font-size:16px;">Your verification code is:</p>
          <div style="background:#1a1b2e;border:2px solid #F5C842;border-radius:8px;padding:20px;text-align:center;margin:16px 0;">
            <span style="font-size:40px;font-weight:bold;letter-spacing:8px;color:#F5C842;">${code}</span>
          </div>
          <p style="color:#888;font-size:13px;">This code expires in 10 minutes. Don't share it with anyone.</p>
        </div>`
      })
    });

    if (!emailRes.ok) {
      const err = await emailRes.text();
      console.error("Resend error:", err);
      return res.status(500).json({ success: false, error: "Failed to send verification email. Please try again." });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error("sendOTP error:", e);
    return res.status(500).json({ success: false, error: e.message });
  }
}
