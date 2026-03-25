import { createClient } from 'npm:@base44/sdk@0.8.20';

export default Deno.serve(async (req) => {
  try {
    const base44 = createClient({
      appId: Deno.env.get("BASE44_APP_ID"),
      token: Deno.env.get("BASE44_SERVICE_TOKEN"),
    });

    const body = await req.json();
    
    // Send message to user
    await base44.asServiceRole.broadcastMessage({
      message: body.message,
      channels: body.channels || ["web"]
    });
    
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
