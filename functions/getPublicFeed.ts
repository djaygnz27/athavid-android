import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });

  try {
    const base44 = createClientFromRequest(req);
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "200");
    const skip = parseInt(url.searchParams.get("skip") || "0");

    // Service role bypasses RLS — returns ALL approved public posts
    const records = await base44.asServiceRole.entities.SachiVideo.filter(
      { is_approved: true, is_archived: false },
      { sort: "-created_date", limit, skip }
    );

    return Response.json(records, { headers });

  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500, headers });
  }
});
