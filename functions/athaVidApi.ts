import base44 from "../base44_client.ts";

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const action = url.searchParams.get("action") || "list";
  const db = base44.asServiceRole.entities;

  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

  try {
    if (action === "list") {
      const videos = await db.AthaVidVideo.list({ sort: "-created_date", limit: 100 });
      const active = videos.filter((v: any) => !v.is_archived);
      return new Response(JSON.stringify(active), { headers: cors });
    }

    if (action === "create" && req.method === "POST") {
      const body = await req.json();
      const video = await db.AthaVidVideo.create(body);
      return new Response(JSON.stringify(video), { status: 201, headers: cors });
    }

    if (action === "listComments") {
      const videoId = url.searchParams.get("video_id");
      const comments = videoId
        ? await db.AthaVidComment.filter({ video_id: videoId })
        : [];
      return new Response(JSON.stringify(comments), { headers: cors });
    }

    if (action === "createComment" && req.method === "POST") {
      const body = await req.json();
      const comment = await db.AthaVidComment.create(body);
      return new Response(JSON.stringify(comment), { status: 201, headers: cors });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: cors });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
  }
}
