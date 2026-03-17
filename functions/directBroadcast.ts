import { createClient } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClient({
      appId: Deno.env.get("BASE44_APP_ID"),
      token: Deno.env.get("BASE44_SERVICE_TOKEN"),
    });

    const body = await req.json().catch(() => ({}));
    
    // Attempting a simple notification via the service role
    await base44.asServiceRole.broadcastMessage({
        message: body.message,
        channels: ["whatsapp"]
    });
    
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
