import base44 from "../base44_sdk_stub.ts";

export default async function handler(req: Request): Promise<Response> {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { email, display_name, full_name, bio } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: "Email required" }), { status: 400, headers: corsHeaders });
    }

    // Use service role to bypass RLS for Google-authenticated users
    const results = await base44.asServiceRole.entities.SachiUser.filter({ email });
    const users = Array.isArray(results) ? results : (results?.items || []);
    const match = users.find((u: any) => u.email === email);

    if (!match) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers: corsHeaders });
    }

    const updated = await base44.asServiceRole.entities.SachiUser.update(match.id, {
      ...match,
      display_name: display_name !== undefined ? display_name : match.display_name,
      full_name: full_name !== undefined ? full_name : match.full_name,
      bio: bio !== undefined ? bio : match.bio,
    });

    return new Response(JSON.stringify({ success: true, user: updated }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("updateSachiUser error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
