// ╔════════════════════════════════════════════════════════════════════╗
// ║ ⛔ LOCKED — api/verifyOTP.js v3                                   ║
// ║ Stateless OTP verification — no database required                 ║
// ║ Re-derives HMAC for current + previous 10-min window              ║
// ║ Then looks up AthaVidUser to return isNewUser + user session      ║
// ╚════════════════════════════════════════════════════════════════════╝

import crypto from "crypto";

const APP_ID     = "69e79122bcc8fb5a04cfb834";
const BASE44_KEY = process.env.BASE44_SERVICE_TOKEN;
const OTP_SECRET = process.env.OTP_SECRET || process.env.BASE44_SERVICE_TOKEN || "sachi-otp-secret-2026";

function generateOtp(email, windowOffset) {
  const window = Math.floor(Date.now() / (10 * 60 * 1000)) + windowOffset;
  const hmac = crypto.createHmac("sha256", OTP_SECRET)
    .update(`${email.toLowerCase()}:${window}`)
    .digest("hex");
  const num = parseInt(hmac.slice(0, 8), 16) % 1000000;
  return String(num).padStart(6, "0");
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: "Email and code required" });

    const normalizedEmail = email.trim().toLowerCase();

    // Check current window AND previous window (handles edge case near boundary)
    const validCodes = [
      generateOtp(normalizedEmail, 0),
      generateOtp(normalizedEmail, -1),
    ];

    if (!validCodes.includes(code.trim())) {
      return res.status(200).json({ success: false, error: "Invalid or expired code. Please request a new one." });
    }

    // Code is valid — look up existing AthaVidUser profile
    let existingUser = null;
    if (BASE44_KEY) {
      try {
        const userRes = await fetch(
          `https://app.base44.com/api/apps/${APP_ID}/entities/AthaVidUser?email=${encodeURIComponent(normalizedEmail)}&limit=5`,
          { headers: { "api-key": BASE44_KEY } }
        );
        const userData = await userRes.json().catch(() => ({}));
        const users = Array.isArray(userData) ? userData : (userData.items || userData.records || []);
        existingUser = users.find(u => u.email === normalizedEmail) || users[0] || null;
      } catch (lookupErr) {
        console.warn("User lookup failed:", lookupErr.message);
      }
    }

    if (existingUser) {
      const sessionUser = {
        id: existingUser.id,
        email: existingUser.email,
        full_name: existingUser.display_name || existingUser.full_name || existingUser.username || "",
        avatar_url: existingUser.avatar_url || "",
        username: existingUser.username || "",
        _sachiProfileId: existingUser.id,
      };
      return res.status(200).json({ success: true, isNewUser: false, user: sessionUser });
    } else {
      return res.status(200).json({ success: true, isNewUser: true });
    }

  } catch (e) {
    console.error("verifyOTP error:", e);
    return res.status(500).json({ success: false, error: e.message });
  }
}
