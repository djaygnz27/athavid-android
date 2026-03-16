import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // WhatsApp/Telegram messages are handled by the platform's messaging infra.
    // For now, simply logging success to indicate the update was handled.
    return Response.json({ success: true, message: "Notification handled" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
