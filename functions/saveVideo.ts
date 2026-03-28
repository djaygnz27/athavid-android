import base44 from "../base44_sdk_stub.ts";

export default async function handler(req: Request): Promise<Response> {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // Save using service role (bypasses auth requirement)
    const record = await base44.asServiceRole.entities.AthaVidVideo.create(body);

    return new Response(JSON.stringify({ success: true, id: record.id }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("saveVideo error:", err);
    return new Response(JSON.stringify({ error: String(err), detail: JSON.stringify(err) }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
