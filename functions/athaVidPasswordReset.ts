import base44 from "../base44_client.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function base64url(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

  const url = new URL(req.url);
  const action = url.searchParams.get("action");
  const body = await req.json().catch(() => ({}));
  const db = base44.asServiceRole.entities;

  // ── Step 1: Send OTP to email via Gmail ───────────────────────────
  if (action === "request") {
    const { email } = body;
    if (!email) return new Response(JSON.stringify({ error: "Email required" }), { status: 400, headers: cors });

    // Check user exists
    const users = await db.User.filter({ email });
    if (!users.length) return new Response(JSON.stringify({ error: "No account found for this email" }), { status: 404, headers: cors });

    const code = generateCode();
    const expiry = (Date.now() + 15 * 60 * 1000).toString();

    // Delete old reset codes for this email
    try {
      const existing = await db.PasswordReset.filter({ email });
      for (const r of existing) await db.PasswordReset.delete(r.id);
    } catch {}

    await db.PasswordReset.create({ email, code, expiry });

    // Get a fresh Gmail token via Base44 connector
    const gmailToken = Deno.env.get("GMAIL_ACCESS_TOKEN");
    if (!gmailToken) {
      return new Response(JSON.stringify({ error: "Email service unavailable" }), { status: 500, headers: cors });
    }

    const html = `
<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#0f0f1a;padding:32px 24px;border-radius:20px;color:#fff;text-align:center;">
  <div style="font-size:48px;margin-bottom:12px;">🔑</div>
  <h2 style="color:#ff6b6b;margin:0 0 8px;">AthaVid Password Reset</h2>
  <p style="color:#888;font-size:14px;margin:0 0 24px;">Your reset code expires in 15 minutes:</p>
  <div style="background:rgba(255,107,107,0.1);border:2px solid rgba(255,107,107,0.3);border-radius:16px;padding:24px;margin-bottom:24px;">
    <div style="font-size:44px;font-weight:900;letter-spacing:14px;color:#fff;">${code}</div>
  </div>
  <p style="color:#555;font-size:12px;">If you didn't request this, ignore this email.</p>
</div>`;

    const raw = `To: ${email}\nSubject: AthaVid — Password Reset Code\nMIME-Version: 1.0\nContent-Type: text/html; charset=utf-8\n\n${html}`;
    const encoded = base64url(raw);

    const gmailRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: { "Authorization": `Bearer ${gmailToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ raw: encoded }),
    });

    if (!gmailRes.ok) {
      const err = await gmailRes.text();
      return new Response(JSON.stringify({ error: "Failed to send email", detail: err }), { status: 500, headers: cors });
    }

    return new Response(JSON.stringify({ ok: true }), { headers: cors });
  }

  // ── Step 2: Verify code is valid ──────────────────────────────────
  if (action === "verify") {
    const { email, code } = body;
    if (!email || !code) return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400, headers: cors });

    const records = await db.PasswordReset.filter({ email });
    const record = records.find((r: any) => r.code === code);

    if (!record) return new Response(JSON.stringify({ error: "Invalid code. Please check and try again." }), { status: 400, headers: cors });
    if (Date.now() > parseInt(record.expiry)) return new Response(JSON.stringify({ error: "Code expired. Please request a new one." }), { status: 400, headers: cors });

    return new Response(JSON.stringify({ ok: true }), { headers: cors });
  }

  // ── Step 3: Update password after code verified ───────────────────
  if (action === "reset") {
    const { email, code, new_password } = body;
    if (!email || !code || !new_password) return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400, headers: cors });
    if (new_password.length < 6) return new Response(JSON.stringify({ error: "Password must be at least 6 characters" }), { status: 400, headers: cors });

    // Re-verify code
    const records = await db.PasswordReset.filter({ email });
    const record = records.find((r: any) => r.code === code);
    if (!record) return new Response(JSON.stringify({ error: "Invalid or expired code" }), { status: 400, headers: cors });
    if (Date.now() > parseInt(record.expiry)) return new Response(JSON.stringify({ error: "Code expired" }), { status: 400, headers: cors });

    // Get user
    const users = await db.User.filter({ email });
    if (!users.length) return new Response(JSON.stringify({ error: "Account not found" }), { status: 404, headers: cors });
    const userId = users[0].id;

    // Update password via Base44 admin API
    const appId = "69b2ee18a8e6fb58c7f0261c";
    const apiKey = Deno.env.get("BASE44_API_KEY") || "";

    const adminRes = await fetch(`https://app.base44.com/api/apps/${appId}/auth/admin/users/${userId}/set-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify({ new_password }),
    });

    if (!adminRes.ok) {
      // Try the change-password endpoint with a workaround
      // Since we verified identity via OTP, we'll log them in and let them change it
      const loginRes = await fetch(`https://sachi-c7f0261c.base44.app/api/apps/${appId}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: new_password }), // will fail but gets us the user session
      });
      // Final fallback: store the new password hash in notes (not ideal) — instead send confirmation email
      return new Response(JSON.stringify({ 
        error: "Password update failed — please use the app's change-password feature after logging in, or contact athavid.app@gmail.com" 
      }), { status: 500, headers: cors });
    }

    // Clean up reset code
    await db.PasswordReset.delete(record.id);

    // Send confirmation email
    const gmailToken = Deno.env.get("GMAIL_ACCESS_TOKEN");
    if (gmailToken) {
      const html = `<div style="font-family:Arial,sans-serif;background:#0f0f1a;padding:24px;color:#fff;text-align:center;border-radius:16px;"><div style="font-size:40px">✅</div><h2 style="color:#6bff9a;">Password Updated!</h2><p style="color:#888;">Your AthaVid password has been successfully changed. You can now log in with your new password.</p></div>`;
      const raw = `To: ${email}\nSubject: AthaVid — Password Updated Successfully\nMIME-Version: 1.0\nContent-Type: text/html; charset=utf-8\n\n${html}`;
      const encoded = base64url(raw);
      await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: { "Authorization": `Bearer ${gmailToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ raw: encoded }),
      }).catch(() => {});
    }

    return new Response(JSON.stringify({ ok: true }), { headers: cors });
  }

  return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: cors });
}
