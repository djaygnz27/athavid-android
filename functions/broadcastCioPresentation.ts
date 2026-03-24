import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const message = `📢 **JMUX CIO PRESENTATION — READY TO SEND**

Your final presentation materials just arrived (2:17 PM):

**2 Files Attached:**
1. **Final Presentation v2** — All spelling fixed, Next Steps fully updated
2. **Oral Presentation Script** — Word-for-word CIO briefing + Q&A prep

**Next Steps Updated (10 items):**
✅ iLO config — Rahiq/Brianna this week
✅ BGP peer review — CRB target March 31
✅ BGP execution — Hicksville Apr 1 + Melville Apr 2
✅ Nokia NSP remote — March 27
✅ Phase 2 staging call — March 26, 3pm
✅ IFR packages — March 30
✅ Nokia training dates — March 27
✅ Northport C37.94 — Phase 2 order
✅ PAR circuit pilot — Bench test (April)
✅ OTDR trace files — Final request (March 30)

**Status:** Schedule on track. BGP execution 4/1-4/2 is the critical path.

Ready to brief the CIO! 🚀`;

    await base44.asServiceRole.messaging.broadcast({
      message: message,
      channels: ["web"]
    });

    return Response.json({ 
      ok: true, 
      status: 'CIO presentation notification sent',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});
