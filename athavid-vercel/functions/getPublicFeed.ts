// getPublicFeed — service-role fetch of all approved, non-archived SachiVideo records
// Bypasses RLS so ALL public posts show regardless of created_by value

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "200");
  const skip = parseInt(url.searchParams.get("skip") || "0");

  try {
    // @ts-ignore
    const videos = await base44.asServiceRole.entities.SachiVideo.filter(
      { is_archived: false, is_approved: true },
      { limit, skip, sort: "-created_date" }
    );

    return new Response(JSON.stringify(Array.isArray(videos) ? videos : []), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
