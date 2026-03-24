import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const message = `🚀 JMUX UPDATE — Mar 24 @ 8:43 AM

✅ NSP Hicksville equipment wiring COMPLETED (03/24)
Equipment now ready for Nokia configuration.

📚 Nokia training courses selected with Shelton
Awaiting confirmed dates from Glenn Leaming (returning 03/25)
Confirmation expected by 03/27

Latest: One-pager revised to reflect these updates.`;
    
    await base44.asServiceRole.messaging.broadcast({
      message: message,
      channels: ["whatsapp"]
    });
    
    return Response.json({ 
      status: "success", 
      message: "JMUX Mar 24 update sent via WhatsApp",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
});
