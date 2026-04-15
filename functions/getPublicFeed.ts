import base44 from "../base44_sdk_stub.ts";

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
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "200");
    const skip = parseInt(url.searchParams.get("skip") || "0");

    // Service role bypasses RLS — returns ALL approved public posts regardless of created_by
    const records = await base44.asServiceRole.entities.SachiVideo.filter(
      { is_approved: true, is_archived: false },
      { sort: "-created_date", limit, skip }
    );

    return new Response(JSON.stringify(records), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("getPublicFeed error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
