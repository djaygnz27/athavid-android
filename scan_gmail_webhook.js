const { google } = require('googleapis');
const fs = require('fs');

const ACCESS_TOKEN = process.env.GMAIL_ACCESS_TOKEN;
if (!ACCESS_TOKEN) {
  console.error('GMAIL_ACCESS_TOKEN not set');
  process.exit(1);
}

const gmail = google.gmail({ version: 'v1', auth: new google.auth.OAuth2() });
gmail.auth.setCredentials({ access_token: ACCESS_TOKEN });

async function scanMailbox() {
  try {
    // Get the latest messages with 'JMUX' or 'PRJ13797' in subject/body
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: 'subject:(JMUX OR PRJ13797) OR (JMUX OR PRJ13797)',
      maxResults: 10,
      orderBy: 'newest'
    });

    const messages = res.data.messages || [];
    
    if (messages.length === 0) {
      console.log('NO_NEW_JMUX_EMAILS');
      return;
    }

    const latestMsg = messages[0];
    
    // Fetch full message
    const msg = await gmail.users.messages.get({
      userId: 'me',
      id: latestMsg.id,
      format: 'full'
    });

    const headers = msg.data.payload.headers;
    const subject = headers.find(h => h.name === 'Subject')?.value || 'No subject';
    const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
    const date = headers.find(h => h.name === 'Date')?.value || 'Unknown';
    
    // Parse body
    let body = '';
    if (msg.data.payload.parts) {
      const part = msg.data.payload.parts.find(p => p.mimeType === 'text/plain' || p.mimeType === 'text/html');
      if (part && part.body.data) {
        body = Buffer.from(part.body.data, 'base64').toString('utf8');
      }
    } else if (msg.data.payload.body && msg.data.payload.body.data) {
      body = Buffer.from(msg.data.payload.body.data, 'base64').toString('utf8');
    }

    // Truncate body for notification
    const preview = body.substring(0, 300).replace(/\n/g, ' ');
    
    console.log(`NEW_EMAIL|${subject}|${from}|${date}|${preview}`);
    
  } catch (err) {
    console.error('SCAN_ERROR', err.message);
    process.exit(1);
  }
}

scanMailbox();
