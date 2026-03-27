const https = require('https');
const querystring = require('querystring');

const token = process.env.GMAIL_ACCESS_TOKEN;

// Read last known history ID
const fs = require('fs');
let lastHistoryId = null;
try {
  lastHistoryId = fs.readFileSync('/app/gmail_history_id.txt', 'utf8').trim();
} catch (e) {
  console.log('No history file found, will fetch latest messages');
}

async function fetchLatestEmails() {
  return new Promise((resolve, reject) => {
    const query = encodeURIComponent('subject:JMUX OR subject:PRJ13797 OR from:jmux');
    const path = `/gmail/v1/users/me/messages?q=${query}&maxResults=10`;
    
    const options = {
      hostname: 'gmail.googleapis.com',
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function fetchMessageDetails(messageId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'gmail.googleapis.com',
      path: `/gmail/v1/users/me/messages/${messageId}?format=full`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function getProfile() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'gmail.googleapis.com',
      path: '/gmail/v1/users/me/profile',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function main() {
  try {
    const profile = await getProfile();
    console.log(`Connected to Gmail: ${profile.emailAddress}`);
    console.log(`Current historyId: ${profile.historyId}`);
    
    if (lastHistoryId) {
      console.log(`Last known historyId: ${lastHistoryId}`);
      console.log(`New emails since last check: ${parseInt(profile.historyId) > parseInt(lastHistoryId) ? 'YES' : 'NO'}`);
    }

    const result = await fetchLatestEmails();
    
    if (!result.messages || result.messages.length === 0) {
      console.log('No JMUX emails found in recent results.');
      console.log(JSON.stringify({ status: 'no_emails', lastHistoryId, currentHistoryId: profile.historyId }, null, 2));
      return;
    }

    console.log(`Found ${result.messages.length} JMUX-related messages`);
    
    // Fetch details for top 5 most recent
    const recentMessages = result.messages.slice(0, 5);
    const details = [];
    
    for (const msg of recentMessages) {
      const msgDetails = await fetchMessageDetails(msg.id);
      const headers = msgDetails.payload.headers;
      const subject = headers.find(h => h.name === 'Subject')?.value || '(no subject)';
      const from = headers.find(h => h.name === 'From')?.value || '(unknown sender)';
      const date = headers.find(h => h.name === 'Date')?.value || '(no date)';
      
      details.push({
        id: msg.id,
        subject,
        from,
        date,
        internalDate: new Date(parseInt(msgDetails.internalDate))
      });
    }
    
    // Sort by date descending (newest first)
    details.sort((a, b) => new Date(b.internalDate) - new Date(a.internalDate));
    
    console.log('\n=== TOP RECENT JMUX EMAILS ===');
    details.forEach((msg, idx) => {
      console.log(`${idx + 1}. [${msg.internalDate.toISOString()}] ${msg.subject}`);
      console.log(`   From: ${msg.from}`);
    });
    
    // Update history ID
    fs.writeFileSync('/app/gmail_history_id.txt', profile.historyId.toString());
    
    console.log(JSON.stringify({
      status: 'success',
      emails_found: details.length,
      latest_emails: details,
      current_history_id: profile.historyId
    }, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    console.log(JSON.stringify({ status: 'error', message: error.message }, null, 2));
  }
}

main();
