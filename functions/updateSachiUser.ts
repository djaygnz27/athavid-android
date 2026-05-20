export async function updateSachiUser(req: Request): Promise<Response> {
  const { email, userId, updates } = await req.json();

  if (!updates || typeof updates !== "object") {
    return Response.json({ error: "updates object required" }, { status: 400 });
  }

  const APP_ID = "69e79122bcc8fb5a04cfb834";
  const BASE_URL = "https://sachi-04cfb834.base44.app/api";
  const SERVICE_KEY = Deno.env.get("BASE44_SERVICE_ROLE_KEY") || "";

  try {
    // Find user
    let user: any = null;

    if (userId) {
      const r = await fetch(`${BASE_URL}/apps/${APP_ID}/entities/SachiUser/${userId}`, {
        headers: { "x-service-role-key": SERVICE_KEY }
      });
      if (r.ok) user = await r.json();
    } else if (email) {
      const r = await fetch(`${BASE_URL}/apps/${APP_ID}/entities/SachiUser?email=${encodeURIComponent(email)}&limit=5`, {
        headers: { "x-service-role-key": SERVICE_KEY }
      });
      const data = await r.json();
      const items = Array.isArray(data) ? data : (data?.items || []);
      user = items.find((u: any) => u.email === email) || null;
    } else {
      return Response.json({ error: "Email or userId required" }, { status: 400 });
    }

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Update user
    const updated_payload = { ...user, ...updates };
    const putRes = await fetch(`${BASE_URL}/apps/${APP_ID}/entities/SachiUser/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-service-role-key": SERVICE_KEY },
      body: JSON.stringify(updated_payload)
    });

    const result = await putRes.json();
    return Response.json({ success: true, user: result });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
