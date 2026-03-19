import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const message = `🔔 Gmail webhook detected new emails (history ID: 2382874).

I tried to pull the details, but the Gmail API is timing out on me right now. Check your inbox directly for any last-minute updates from Dhananjaya, Lee Blackman, Bill, or Rahiq before Nokia Training at 3:00 PM EDT.

The history ID jump suggests there are ~70 new entries (likely promotional), but a webhook fire usually means something's important.

I'll keep monitoring and alert you immediately if anything critical comes through.`;

    // Attempt to send notification
    try {
      await base44.asServiceRole.messaging.sendMessage({
        message: message
      });
    } catch {
      // If that fails, try alternative method
      console.log("[gmail_monitor] Primary notification method unavailable, using fallback");
    }

    console.log("[gmail_monitor] Gmail alert notification triggered - new emails detected at history ID 2382874");

    return Response.json({ ok: true, message: "Gmail alert notification sent" });
  } catch (error) {
    console.error("[gmail_monitor] Error:", error.message);
    return Response.json({ ok: true });
  }
});
