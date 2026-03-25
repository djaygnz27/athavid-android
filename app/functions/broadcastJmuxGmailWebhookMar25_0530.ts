/**
 * Broadcast JMUX Gmail Webhook notification
 * Triggered by: gmail_project_monitor automation (History ID 2412057)
 * Date: Mar 25, 2026, 5:30 AM EDT
 * Purpose: Notify about latest JMUX emails and critical path status
 */

import { base44 } from "https://deno.land/x/base44_sdk@0.1.0/mod.ts";

export async function broadcastJmuxGmailWebhookMar25_0530(req: Request) {
  try {
    const message = `📨 JMUX Email Monitor — Mar 25, 5:30 AM EDT

**Latest Emails (3 detected):**

[1] **Final Presentation v2 + CIO Oral Script** (Your draft — forwarded)
    Date: Mar 24, 2:26 PM EDT
    Status: ✅ Ready for CIO briefing
    Includes: Polished presentation deck + speaking script

[2] **Final Presentation v2 + CIO Oral Script** (Original)
    Date: Mar 24, 11:17 AM PDT
    Status: Spelling corrections applied, all 10 action items updated on Next Steps

[3] **JMUX Replacement Update** (from PSEGLI)
    Date: Mar 24, 6:12 PM UTC
    From: Dhananjaya Gunaratne (PSEGLI)
    Status: ✅ Scanned clean by Forcepoint

---

**Status Snapshot (Mar 24):**
✅ DC Power (Northport) — COMPLETE
✅ Phase 1 Construction — COMPLETE
✅ BGP Design — APPROVED
⏳ ILO Configuration — IN PROGRESS
⏳ Nokia Training — Due Mar 27

**Critical Path Ahead:**
🔵 Mar 26, 3 PM — Phase 2 Staging Call
🔵 Mar 27 — Nokia NSP Remote Access (DUE)
🔵 Mar 30 — IFR Packages (DUE)
🔵 Mar 31 — BGP Peer Review + CRB Approval (DUE)
🔵 Apr 1-2 — BGP Execution (Hicksville → Melville)

📊 Risk Level: Yellow 🟨 (BGP execution on track, recovery path clear)

No new action items since Mar 24. All CIO briefing materials confirmed ready.`;

    // Send broadcast message to user via SDK
    await base44.sendMessageToUser(message);

    return new Response(
      JSON.stringify({
        success: true,
        message: "JMUX Gmail webhook notification sent (Mar 25, 5:30 AM)",
        timestamp: new Date().toISOString(),
        email_count: 3,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Broadcast error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
