import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    
    // Simplest possible broadcast logic
    // Assuming channels is available or defaults to all.
    // Based on the error 'Cannot read properties of undefined (reading 'send')', 
    // the previous attempts were likely missing a properly initialized messaging client.
    
    // Try using base44.messaging.broadcast
    await base44.asServiceRole.messaging.broadcast({
      message: body.message,
      channels: ["whatsapp"]
    });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
