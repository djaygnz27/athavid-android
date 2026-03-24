import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const message = `🚀 **JMUX PROJECT UPDATE — Mar 24, 11:43 AM**

**NEW: NSP Hicksville Equipment Wiring — COMPLETE** ✅
(Was in progress, now done — major milestone!)

**Status Summary:**
✅ DC Power (Northport) — Complete
✅ Hicksville-Syosset Link — Active
✅ NSP Equipment Wiring — **COMPLETE** (NEW)
✅ BGP Design — Approved, peer review in progress
⏳ ILO Configuration — In progress
⏳ Phase 2 Materials — Under review

**Next 2 Weeks:**
• BGP execution: Apr 1-2 (on track)
• IFR packages due: Mar 30
• Phase 2 staging call: Mar 26
• Nokia training dates: Confirmed by Mar 27

Status: **YELLOW → GREEN track** — Schedule accelerating!

Full details in revised one-pager attached to latest email.`;
    
    // Send via messaging.broadcast
    await base44.asServiceRole.messaging.broadcast({
      message: message,
      channels: ["whatsapp", "web"]
    });
    
    return Response.json({ 
      ok: true, 
      status: 'notification sent',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Send error:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});
