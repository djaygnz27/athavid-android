import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const message = `🚨 JMUX PROJECT ALERT — Phase 2/3 Schedule & Updates Received

Jaya, I detected new JMUX project updates from Alex Lenox in your inbox. It looks like he sent over the updated Phase 1 and 2/3 project schedules along with the 2025 presentation.

📁 FILES RECEIVED (Mar 19 @ 3:14 AM UTC):
✅ Phase 1 Schedule (Updated)
✅ Phase 2/3 Engineering Schedule (NEW)
✅ 2025 CIO Presentation (NEW)
✅ Phase 2 SOW Document

📊 10-STEP CRITICAL PATH:

TOMORROW (March 19):
🔴 ILO Console Cable & Firmware — Bill & Rahiq
🔴 Nokia Training @ 3:00 PM EDT

NEXT WEEK:
📋 Mar 21-24: ILO Port Activation
📋 Mar 24-28: BGP Configuration (CRITICAL)
📋 Week of Mar 23: Phase 2 BOM Reconciliation

EARLY APRIL:
🔗 Apr 1-18: Remote Access Config (18-DAY BLOCKER)
🔗 Mid-Late Apr: NSP Software Install

All files saved to inbox. CIO Deck v7 current.`;
    
    await base44.asServiceRole.messaging.broadcast({
      message: message,
      channels: ["whatsapp"]
    });
    
    return Response.json({ status: "success", message: "JMUX notification sent via WhatsApp" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
