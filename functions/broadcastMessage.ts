import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { message, channels } = await req.json();
    
    // Using the correct SDK path: base44.asServiceRole.messaging.broadcast
    await base44.asServiceRole.messaging.broadcast({
      message,
      channels: channels || ["whatsapp"]
    });
    return Response.json({ status: "success" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
