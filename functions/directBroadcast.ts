import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const body = await req.json().catch(() => ({}));
  
  // Use the established channel messaging if available
  // Broadcast message is a core platform tool for me
  await base44.asServiceRole.messaging.broadcast({
    message: body.message,
    channels: ["whatsapp"]
  });

  return Response.json({ success: true });
});
