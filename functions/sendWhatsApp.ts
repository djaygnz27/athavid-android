import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    
    // Correct way to broadcast via SDK
    await base44.asServiceRole.messaging.broadcast({
      message: body.message,
      channels: ["whatsapp"]
    });
    
    return Response.json({ status: "success" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
