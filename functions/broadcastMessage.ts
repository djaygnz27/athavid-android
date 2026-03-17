import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    
    // Attempt to use broadcastMessage from the client directly if possible
    // The previous error suggests broadcastMessage is missing on base44.asServiceRole
    // Trying the standard approach based on documentation.
    
    await base44.asServiceRole.broadcastMessage({
      message: body.message,
      channels: ["whatsapp"]
    });
    
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
