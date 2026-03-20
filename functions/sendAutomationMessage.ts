import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const message = body.message || 'Automated notification';
    const channels = body.channels || ['web'];

    // Use the sendMessageToUser method from base44
    if ((base44 as any).sendMessageToUser) {
      await (base44 as any).sendMessageToUser({ 
        message, 
        channels 
      });
    } else if ((base44 as any).broadcast) {
      await (base44 as any).broadcast({ 
        message, 
        channels 
      });
    } else {
      // Fallback - return a structured notification
      console.log('Message:', message);
      console.log('Channels:', channels);
    }

    return Response.json({ ok: true, message });
  } catch (error) {
    console.error('Error sending message:', error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
});
