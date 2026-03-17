import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { message, channels } = await req.json();
    
    // Testing the correct API
    await base44.asServiceRole.messaging.sendToUser({
      userId: "me", // or another way to target user
      message,
      channels: channels || ["whatsapp"]
    });
    return Response.json({ status: "success" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
