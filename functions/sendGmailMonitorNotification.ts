export default async function sendGmailMonitorNotification() {
  const message = `📧 **JMUX Gmail Monitor — Mar 25, 6:06 AM**

✅ No NEW emails from today (March 25)

**Last Email on Record:**
📎 Fwd: PRJ13797 JMUX — Final Presentation v2 + CIO Oral Presentation Script
📅 Sent: Tue, Mar 24, 2:26 PM EDT
👤 To: Dhananjaya Gunaratne (PSEG LI)

Your presentation materials from yesterday remain current and ready.

**Upcoming Critical Dates:**
📍 Mar 26, 3 PM — Phase 2 Staging Call
📍 Mar 27 DUE — Nokia NSP Remote Access
📍 Mar 31 DUE — BGP Peer Review + CRB Approval
📍 Apr 1-2 — BGP Execution (Hicksville | Melville)

🟢 **Status**: No blockers detected. Proceeding on schedule.`;

  try {
    const response = await base44.sendMessage({
      to: 'jaygnz27@gmail.com',
      message: message,
      channels: ['whatsapp', 'web']
    });
    
    return {
      status: 'sent',
      message: 'Notification sent via WhatsApp',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'error',
      error: String(error)
    };
  }
}
