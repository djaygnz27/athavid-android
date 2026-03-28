import { base44 } from "npm:@base44/sdk";

const client = base44({ appId: "69bafc2c944948084350efb0" });

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
    const record = await client.asServiceRole.entities.AthaVidVideo.create(body);
    return new Response(JSON.stringify({ success: true, id: record.id }), { status: 200, headers: cors });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: cors });
  }
}
