import { createClient } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClient({
      appId: Deno.env.get("BASE44_APP_ID"),
      token: Deno.env.get("BASE44_SERVICE_TOKEN"),
    });

    const body = await req.json().catch(() => ({}));
    const { message, channels = ["web"] } = body;

    if (!message) {
      return Response.json({ error: "No message provided" }, { status: 400 });
    }

    // Send notification to user via the platform's messaging system
    const result = await (base44 as any).broadcast({
      message,
      channels,
    });

    return Response.json({ ok: true, result });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
});
