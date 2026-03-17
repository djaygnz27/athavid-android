import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const { message, channels } = await req.json();
  
  try {
    await base44.asServiceRole.notifications.broadcast({
      message,
      channels: channels || ["whatsapp"]
    });
    return Response.json({ status: "success" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
