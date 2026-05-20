import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") return new Response(null, { headers });

  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { email, display_name, full_name, bio } = body;

    if (!email) return Response.json({ error: "Email required" }, { status: 400, headers });

    // Use service role to bypass RLS
    const results = await base44.asServiceRole.entities.SachiUser.filter({ email });
    const users = Array.isArray(results) ? results : (results?.items || []);
    const match = users.find((u: any) => u.email === email);

    if (!match) return Response.json({ error: "User not found" }, { status: 404, headers });

    const updated = await base44.asServiceRole.entities.SachiUser.update(match.id, {
      ...match,
      display_name: display_name !== undefined ? display_name : match.display_name,
      full_name: full_name !== undefined ? full_name : match.full_name,
      bio: bio !== undefined ? bio : match.bio,
    });

    return Response.json({ success: true, user: updated }, { headers });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500, headers });
  }
});
