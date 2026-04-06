import base44 from "../base44_client.ts";

export default async function handler(req: Request): Promise<Response> {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const { podcast_id, is_live, email } = await req.json();

    const ADMIN_EMAILS = ["jaygnz27@gmail.com", "lasanjaya@gmail.com"];
    if (!ADMIN_EMAILS.includes(email)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403, headers: cors });
    }

    const update: any = { is_live };
    if (!is_live) update.listener_count = 0;

    await base44.asServiceRole.entities.SachiPodcast.update(podcast_id, update);

    return new Response(JSON.stringify({ success: true, is_live }), { headers: cors });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
  }
}
