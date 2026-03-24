const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Load the token from environment or stored file
async function getAuthenticatedClient() {
  // For automation, we'd use service account or stored refresh token
  // This is a fallback to read from stored credentials
  const tokenPath = path.join(__dirname, 'gmail_token.json');
  
  if (!fs.existsSync(tokenPath)) {
    throw new Error('No Gmail token found. Cannot authenticate.');
  }
  
  const credentials = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials(credentials);
  return oauth2Client;
}

async function checkJmuxEmails() {
  try {
    const auth = await getAuthenticatedClient();
    const gmail = google.gmail({ version: 'v1', auth });
    
    // Query for JMUX-related emails from the last 24 hours
    const query = 'subject:(JMUX OR "Project 13797" OR "PRJ13797") after:2026/03/23';
    
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 10,
    });
    
    if (!response.data.messages || response.data.messages.length === 0) {
      return { found: 0, emails: [] };
    }
    
    const emails = [];
    for (const message of response.data.messages) {
      const msg = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
        format: 'full',
      });
      
      const headers = msg.data.payload.headers;
      const subject = headers.find(h => h.name === 'Subject')?.value || '(no subject)';
      const from = headers.find(h => h.name === 'From')?.value || '(unknown)';
      const date = headers.find(h => h.name === 'Date')?.value || '(no date)';
      
      let body = '';
      if (msg.data.payload.parts) {
        const textPart = msg.data.payload.parts.find(p => p.mimeType === 'text/plain');
        if (textPart && textPart.body.data) {
          body = Buffer.from(textPart.body.data, 'base64').toString('utf-8').substring(0, 300);
        }
      } else if (msg.data.payload.body?.data) {
        body = Buffer.from(msg.data.payload.body.data, 'base64').toString('utf-8').substring(0, 300);
      }
      
      emails.push({
        id: message.id,
        subject,
        from,
        date,
        preview: body,
      });
    }
    
    return { found: emails.length, emails };
  } catch (error) {
    console.error('Error checking JMUX emails:', error.message);
    return { found: 0, emails: [], error: error.message };
  }
}

checkJmuxEmails().then(result => {
  console.log(JSON.stringify(result, null, 2));
});
