import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

async function sendEmail(accessToken: string, to: string, subject: string, htmlBody: string) {
  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: text/html; charset=UTF-8`,
    ``,
    htmlBody
  ].join("\n");

  const encoded = btoa(unescape(encodeURIComponent(message)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ raw: encoded })
  });
  return res.ok;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "";
    const body = await req.json().catch(() => ({}));

    // --- REQUEST RESET CODE ---
    if (action === "request") {
      const { email } = body;
      if (!email) return Response.json({ error: "Email required" }, { status: 400 });

      // Check user exists
      const users = await base44.asServiceRole.entities.User.filter({ email });
      if (!users || users.length === 0) {
        return Response.json({ success: true, message: "If that email exists, a code was sent." });
      }

      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 15 * 60 * 1000).toISOString();

      // Delete existing reset records
      const existing = await base44.asServiceRole.entities.PasswordReset.filter({ email });
      for (const r of (existing || [])) {
        await base44.asServiceRole.entities.PasswordReset.delete(r.id);
      }

      // Store new code
      await base44.asServiceRole.entities.PasswordReset.create({ email, code, expiry });

      // Get Gmail token and send email
      const { accessToken } = await base44.asServiceRole.connectors.getConnection("gmail");

      const html = `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#0f0f1a;color:#fff;padding:32px;border-radius:16px;">
          <div style="text-align:center;margin-bottom:24px;">
            <div style="font-size:48px;">🎬</div>
            <h1 style="color:#ff6b6b;margin:8px 0;">AthaVid</h1>
            <p style="color:#888;">Password Reset</p>
          </div>
          <div style="background:#1a1a2e;border-radius:12px;padding:24px;text-align:center;">
            <p style="color:#ccc;margin:0 0 16px;">Your password reset code is:</p>
            <div style="font-size:48px;font-weight:900;letter-spacing:12px;color:#ff6b6b;margin:16px 0;">${code}</div>
            <p style="color:#888;font-size:13px;margin:16px 0 0;">This code expires in 15 minutes.</p>
          </div>
          <p style="color:#555;font-size:12px;text-align:center;margin-top:24px;">If you didn't request this, ignore this email.</p>
        </div>
      `;

      await sendEmail(accessToken, email, "AthaVid - Your Password Reset Code", html);
      return Response.json({ success: true, message: "Reset code sent." });
    }

    // --- RESET PASSWORD ---
    if (action === "reset") {
      const { email, code, new_password } = body;
      if (!email || !code || !new_password) {
        return Response.json({ error: "Email, code, and new_password required" }, { status: 400 });
      }
      if (new_password.length < 6) {
        return Response.json({ error: "Password must be at least 6 characters" }, { status: 400 });
      }

      // Find the reset record
      const records = await base44.asServiceRole.entities.PasswordReset.filter({ email, code });
      if (!records || records.length === 0) {
        return Response.json({ error: "Invalid or expired reset code." }, { status: 400 });
      }

      const record = records[0];
      if (new Date(record.expiry) < new Date()) {
        await base44.asServiceRole.entities.PasswordReset.delete(record.id);
        return Response.json({ error: "Reset code has expired. Please request a new one." }, { status: 400 });
      }

      // Update the user's password via Base44 auth
      const users = await base44.asServiceRole.entities.User.filter({ email });
      if (!users || users.length === 0) {
        return Response.json({ error: "User not found." }, { status: 404 });
      }

      await base44.asServiceRole.auth.updateUserPassword(users[0].id, new_password);

      // Clean up
      await base44.asServiceRole.entities.PasswordReset.delete(record.id);

      return Response.json({ success: true, message: "Password updated successfully." });
    }

    return Response.json({ error: "Invalid action. Use ?action=request or ?action=reset" }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
