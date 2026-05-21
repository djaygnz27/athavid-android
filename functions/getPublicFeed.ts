import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "200");
    const skip = parseInt(url.searchParams.get("skip") || "0");

    const base44 = createClientFromRequest(req);

    // Use service role to bypass RLS — return ALL approved, non-archived videos
    const videos = await base44.asServiceRole.entities.SachiVideo.filter(
      { is_archived: false, is_approved: true },
      { limit, skip, sort: "-created_date" }
    );

    const result = Array.isArray(videos) ? videos : (videos?.records || videos?.items || []);

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
