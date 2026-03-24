import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const message = `📋 JMUX One-Pager Update Arrived — Mar 24, 2026

Your updated PRJ13797 JMUX One-Pager just landed in your inbox this morning.

📌 KEY STATUS SNAPSHOT:
✅ BGP Architecture — APPROVED (standardized ASN framework)
✅ Firewall Strategy — LOCKED IN (Cisco 4145s consolidation)
⏳ ILO Console Cables — PENDING (Bill purchasing 4 units)

🎯 SCHEDULE STATUS: AMBER ⚠️
BGP configuration window (Mar 24-28) dependent on console cable delivery.

💰 COST FORECAST:
• Labor: $150K–$160K (worst-case)
• Rate uncertainty: Chad confirming $65–$70/hour
• Supervisor/relay team split pending validation

⚠️ TOP RISKS:
1. ILO Cable Delivery (HIGH) — Follow up with Bill
2. Labor Cost Uncertainty (MEDIUM) — Rate finalization needed
3. Melville Antenna Scope (MEDIUM) — Documented as OUT OF SCOPE

📅 NEXT ACTIONS (by Mar 31):
→ Confirm hourly rates with Chad
→ Validate per-substation hours (150 hrs)
→ Follow up on cable delivery status
→ Finalize Phase 2 vs Phase 3 labor split

Full weekly report available in your email.`;
    
    await base44.asServiceRole.messaging.broadcast({
      message: message,
      channels: ["whatsapp", "web"]
    });
    
    return Response.json({ 
      ok: true, 
      status: 'JMUX One-Pager notification sent',
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
