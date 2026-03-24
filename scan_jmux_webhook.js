const { google } = require('googleapis');

// Get token from environment
const token = process.env.GMAIL_ACCESS_TOKEN;

if (!token) {
  console.error('ERROR: GMAIL_ACCESS_TOKEN not set');
  process.exit(1);
}

async function scanJmuxEmails() {
  const gmail = google.gmail({ version: 'v1', auth: { getAccessToken: () => ({ token }) } });
  
  try {
    // Get latest JMUX emails
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: 'subject:(JMUX OR "Project Meeting Analysis") is:unread after:2026/03/23',
      maxResults: 5
    });

    if (!response.data.messages || response.data.messages.length === 0) {
      console.log('NO_NEW_JMUX_EMAILS');
      return null;
    }

    const messages = [];
    for (const msg of response.data.messages) {
      const fullMsg = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'full'
      });

      const headers = fullMsg.data.payload.headers;
      const subject = headers.find(h => h.name === 'Subject')?.value || '(no subject)';
      const from = headers.find(h => h.name === 'From')?.value || '(no from)';
      const date = headers.find(h => h.name === 'Date')?.value || '(no date)';
      
      // Extract body
      let body = '';
      if (fullMsg.data.payload.parts) {
        const textPart = fullMsg.data.payload.parts.find(p => p.mimeType === 'text/plain');
        if (textPart && textPart.body.data) {
          body = Buffer.from(textPart.body.data, 'base64').toString('utf-8').substring(0, 500);
        }
      } else if (fullMsg.data.payload.body.data) {
        body = Buffer.from(fullMsg.data.payload.body.data, 'base64').toString('utf-8').substring(0, 500);
      }

      messages.push({
        id: msg.id,
        subject,
        from,
        date,
        snippet: fullMsg.data.snippet
      });
    }

    return messages;
  } catch (error) {
    console.error('Gmail API error:', error.message);
    process.exit(1);
  }
}

scanJmuxEmails().then(result => {
  if (result) {
    console.log(JSON.stringify(result, null, 2));
  }
});
