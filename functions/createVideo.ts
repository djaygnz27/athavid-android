import base44 from "npm:@base44/sdk@latest";

export default async function handler(req: Request): Promise<Response> {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

  try {
    const body = await req.json();
    const client = base44({ appId: Deno.env.get("APP_ID")! });
    const record = await client.asServiceRole.entities.AthaVidVideo.create(body);
    return new Response(JSON.stringify({ success: true, record }), { status: 200, headers: cors });
  } catch (err: any) {
    console.error("createVideo error:", err);
    return new Response(JSON.stringify({ error: err?.message || String(err) }), { status: 500, headers: cors });
  }
}
