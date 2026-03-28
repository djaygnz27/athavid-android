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

    // Save video record using service role (bypasses auth)
    const record = await base44.asServiceRole.entities.AthaVidVideo.create(body);

    return new Response(JSON.stringify({ success: true, id: record.id }), {
      status: 200, headers: corsHeaders,
    });
  } catch (err) {
    console.error("uploadVideo error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: corsHeaders,
    });
  }
}
