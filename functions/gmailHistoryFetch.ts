export default async function gmailHistoryFetch(req: Request): Promise<Response> {
  const body = await req.json();
  const { previousHistoryId, currentHistoryId, emailAddress } = body;

  try {
    // Get Gmail access token from environment
    const accessToken = process.env.GMAIL_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error("Gmail access token not available");
    }

    // Call Gmail History API to get changes between history IDs
    const historyUrl = `https://www.googleapis.com/gmail/v1/users/me/history?startHistoryId=${previousHistoryId}&historyTypes=messageAdded`;
    
    const historyResponse = await fetch(historyUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!historyResponse.ok) {
      throw new Error(`Gmail API error: ${historyResponse.status}`);
    }

    const historyData = await historyResponse.json();
    const messages = historyData.history || [];

    // Filter for JMUX-related emails
    let jmuxEmails = [];
    
    for (const entry of messages) {
      if (entry.messagesAdded) {
        for (const msg of entry.messagesAdded) {
          const msgId = msg.message.id;
          
          // Get message details
          const msgUrl = `https://www.googleapis.com/gmail/v1/users/me/messages/${msgId}?format=full`;
          const msgResponse = await fetch(msgUrl, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });

          if (msgResponse.ok) {
            const msgData = await msgResponse.json();
            const headers = msgData.payload.headers || [];
            const subject = headers.find(h => h.name === "Subject")?.value || "";
            const from = headers.find(h => h.name === "From")?.value || "";
            const snippet = msgData.snippet || "";

            // Check if JMUX-related
            if (subject.includes("JMUX") || subject.includes("PRJ13797") || from.includes("psegliny.com")) {
              jmuxEmails.push({
                id: msgId,
                subject,
                from,
                snippet: snippet.substring(0, 100)
              });
            }
          }
        }
      }
    }

    return new Response(JSON.stringify({
      status: "success",
      previousHistoryId,
      currentHistoryId,
      totalNewMessages: messages.length,
      jmuxEmailsFound: jmuxEmails.length,
      jmuxEmails
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
