const https = require('https');

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'gmail.googleapis.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${process.env.GMAIL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function scanGmail() {
  const previousHistoryId = 2402407;
  const currentHistoryId = 2402587;

  console.log(`📧 Scanning Gmail history from ${previousHistoryId} to ${currentHistoryId}...`);

  // Get history between IDs
  const historyRes = await makeRequest('GET', 
    `/gmail/v1/users/me/history?startHistoryId=${previousHistoryId}&maxResults=500`
  );

  if (historyRes.status !== 200) {
    console.log('❌ History fetch failed:', historyRes.status, historyRes.data);
    return { jmuxEmails: [], newCount: 0 };
  }

  const history = historyRes.data.history || [];
  const messageIds = new Set();

  // Collect all message IDs from history
  for (const h of history) {
    if (h.messagesAdded) {
      for (const m of h.messagesAdded) {
        messageIds.add(m.message.id);
      }
    }
  }

  console.log(`Found ${messageIds.size} new messages in history window`);

  // Fetch full details for each message
  const jmuxEmails = [];
  for (const msgId of messageIds) {
    const msgRes = await makeRequest('GET', 
      `/gmail/v1/users/me/messages/${msgId}?format=full`
    );

    if (msgRes.status === 200) {
      const msg = msgRes.data;
      const headers = msg.payload.headers;
      const subject = headers.find(h => h.name === 'Subject')?.value || '';
      const from = headers.find(h => h.name === 'From')?.value || '';
      const date = headers.find(h => h.name === 'Date')?.value || '';

      // Check if JMUX related
      if (subject.toUpperCase().includes('JMUX') || 
          subject.toUpperCase().includes('PRJ13797') ||
          from.includes('psegliny.com')) {
        jmuxEmails.push({ subject, from, date, id: msgId });
      }
    }
  }

  return { jmuxEmails, newCount: jmuxEmails.length };
}

scanGmail()
  .then(result => {
    console.log(`\n✅ Scan complete: ${result.newCount} new JMUX emails`);
    if (result.jmuxEmails.length > 0) {
      console.log('\nNew JMUX Emails:');
      result.jmuxEmails.forEach((e, i) => {
        console.log(`${i+1}. ${e.subject}`);
        console.log(`   From: ${e.from}`);
        console.log(`   Date: ${e.date}`);
      });
    }
    process.stdout.write(JSON.stringify(result));
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.stdout.write(JSON.stringify({ jmuxEmails: [], newCount: 0, error: err.message }));
  });
