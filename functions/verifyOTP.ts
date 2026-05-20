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

  try {
    const body = await req.json().catch(() => ({}));
    const { email, code } = body;

    if (!email || !code) {
      return Response.json({ error: "Missing email or code" }, { status: 400, headers: corsHeaders });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Fetch OTP record
    const res = await fetch(
      `${BASE_URL}/apps/${APP_ID}/entities/PasswordReset?email=${encodeURIComponent(normalizedEmail)}&limit=5`,
      { headers: { "Content-Type": "application/json" } }
    );
    const data = await res.json();
    const items = Array.isArray(data) ? data : (data?.items || []);
    const record = items.find((r: any) => r.email === normalizedEmail);

    if (!record) {
      return Response.json({ error: "No code found. Please request a new one." }, { status: 400, headers: corsHeaders });
    }

    // Check expiry
    if (new Date() > new Date(record.expiry)) {
      return Response.json({ error: "Code has expired. Please request a new one." }, { status: 400, headers: corsHeaders });
    }

    // Check code
    if (record.code !== code.trim()) {
      return Response.json({ error: "Incorrect code. Please try again." }, { status: 400, headers: corsHeaders });
    }

    // Delete the used OTP
    await fetch(`${BASE_URL}/apps/${APP_ID}/entities/PasswordReset/${record.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });

    // Check if user already exists
    const userRes = await fetch(
      `${BASE_URL}/apps/${APP_ID}/entities/AthaVidUser?email=${encodeURIComponent(normalizedEmail)}&limit=5`,
      { headers: { "Content-Type": "application/json" } }
    );
    const userData = await userRes.json();
    const userItems = Array.isArray(userData) ? userData : (userData?.items || []);
    const existingUser = userItems.find((u: any) => u.email === normalizedEmail);

    if (existingUser) {
      return Response.json({
        success: true,
        isNewUser: false,
        user: {
          id: existingUser.id,
          email: existingUser.email,
          full_name: existingUser.display_name || existingUser.email,
          avatar_url: existingUser.avatar_url || "",
          username: existingUser.username || existingUser.email.split("@")[0],
          _sachiProfileId: existingUser.id,
        }
      }, { headers: corsHeaders });
    }

    // New user — needs profile setup
    return Response.json({
      success: true,
      isNewUser: true,
      email: normalizedEmail,
    }, { headers: corsHeaders });

  } catch (e) {
    console.error("verifyOTP error:", e);
    return Response.json({ error: "Server error", detail: String(e) }, { status: 500, headers: corsHeaders });
  }
});
