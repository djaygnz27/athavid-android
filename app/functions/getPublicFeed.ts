import base44 from "../base44_sdk_stub.ts";

// v7 - force redeploy April 6 2026
export default async function handler(req: Request): Promise<Response> {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const records = await base44.asServiceRole.entities.SachiVideo.filter({
      is_approved: true,
      is_archived: false,
    }, { sort: "-created_date", limit: 100 });

    return new Response(JSON.stringify({ items: records, count: records.length }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
