import { base44 } from "https://deno.land/x/base44_sdk@0.1.0/mod.ts";

export async function sendJmuxStatusMar25(req: Request) {
  try {
    const message = `🟢 JMUX Status — No new emails since yesterday.

Most recent: Fwd: Final Presentation v2 + CIO Oral Presentation Script (Mar 24, 2:26 PM EDT) — all materials prepped.

Critical dates coming:
• Mar 26, 3 PM — Phase 2 Staging Call
• Mar 27 — Nokia NSP Remote Access DUE
• Mar 30 — IFR Packages DUE
• Mar 31 — BGP Peer Review + CRB Approval DUE
• Apr 1–2 — BGP Execution (Hicksville Apr 1 | Melville Apr 2)

Everything on track. 🟢`;

    await base44.sendMessageToUser(message);

    return new Response(
      JSON.stringify({ success: true, message: "Status sent" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
