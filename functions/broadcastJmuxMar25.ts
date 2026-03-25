import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const message = `🟢 JMUX Status — No new emails since yesterday.

Most recent: Fwd: Final Presentation v2 + CIO Oral Presentation Script (Mar 24, 2:26 PM EDT) — all materials prepped.

Critical dates coming:
• Mar 26, 3 PM — Phase 2 Staging Call
• Mar 27 — Nokia NSP Remote Access DUE
• Mar 30 — IFR Packages DUE
• Mar 31 — BGP Peer Review + CRB Approval DUE
• Apr 1–2 — BGP Execution (Hicksville Apr 1 | Melville Apr 2)

Everything on track. 🟢`;
    
    await base44.asServiceRole.broadcastMessage({
      message: message,
      channels: ["web"]
    });
    
    return Response.json({ ok: true, message: "Notification sent" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
