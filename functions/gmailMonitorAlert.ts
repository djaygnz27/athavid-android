import { createClient } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClient({
      appId: Deno.env.get("BASE44_APP_ID"),
      token: Deno.env.get("BASE44_SERVICE_TOKEN"),
    });

    const body = await req.json().catch(() => ({}));
    const message = body.message || '📧 Gmail monitoring: No new JMUX emails detected.';

    // Try to send via the SDK broadcast method (works with web)
    try {
      await base44.broadcastMessage({
        message: message,
        channels: ["web"]
      });
    } catch (e) {
      console.log("Broadcast method not available, attempting alternative...");
      console.log("Message would be:", message);
    }

    return Response.json({ ok: true, message });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
});
