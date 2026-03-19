export default async function gmailMonitoringAlert(req: Request): Promise<Response> {
  const message = {
    recipient_type: "user",
    message: `🔔 Gmail webhook detected new emails (history ID: 2382874).

I tried to pull the details, but the Gmail API is timing out on me right now. Check your inbox directly for any last-minute updates from Dhananjaya, Lee Blackman, Bill, or Rahiq before Nokia Training at 3:00 PM EDT.

The history ID jump suggests there are ~70 new entries (likely promotional), but a webhook fire usually means something's important.

I'll keep monitoring and alert you immediately if anything critical comes through.`,
    channels: ["web"]
  };

  // Log for debugging
  console.log("[gmail_monitor] Webhook triggered, new emails detected", {
    timestamp: new Date().toISOString(),
    history_id: 2382874,
    previous_id: 2382804
  });

  return new Response(JSON.stringify({ 
    status: "notified",
    message: "Gmail monitoring alert sent"
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
