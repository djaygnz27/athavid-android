import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const message = `🔔 JMUX Status Update — Mar 24, 2026, 11:42 AM

**CURRENT PERIOD HIGHLIGHTS:**
✅ DC power at Northport — COMPLETE
✅ Hicksville-Syosset link ACTIVE
✅ BGP design APPROVED (peer review in progress)
✅ NSP Hicksville wiring in progress
✅ ILO configuration in progress
✅ Nokia training courses selected
✅ Phase 2 material review underway

**NEXT 2 WEEKS (Critical Path):**
📅 Mar 26 — Phase 2 staging & equipment call
📅 Mar 27 — Nokia training dates confirmed + NSP remote access setup
📅 Mar 30 — IFR packages due (Green Acres + Berry Street)
📅 Mar 31 — BGP peer review + CRB approval
📅 Apr 1 — BGP execution at Hicksville (Rahiq/Brianna on-site)
📅 Apr 2 — BGP execution at Melville (Rahiq/Brianna on-site)

**RISK STATUS:** Schedule YELLOW
• BGP execution (Apr 1-2) on track
• ILO cables still pending from Bill
• Recovery to GREEN upon BGP completion`;

    await base44.asServiceRole.messaging.broadcast({
      message: message,
      channels: ["whatsapp", "web"]
    });

    return Response.json({ 
      ok: true, 
      status: 'JMUX notification sent',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});
