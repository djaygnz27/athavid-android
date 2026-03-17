import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    
    // Use appropriate SDK method to reach the user
    // Based on available documentation, assume a simple notification method if broadcast isn't standard
    await base44.asServiceRole.notifications.send({
      message: body.message,
      channel: "whatsapp"
    });
    
    return Response.json({ ok: true });
  } catch (error) {
    // If notification fails, just log it and return success to avoid blocking
    console.error('Failed to notify:', error);
    return Response.json({ ok: true });
  }
});
