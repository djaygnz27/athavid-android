import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    
    // Fallback: Using the SDK's messaging if broadcast not available
    // Assuming the user wants an immediate notify on their channel
    await base44.asServiceRole.notifications.send({
      message: body.message,
      channel: "whatsapp"
    });
    
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
