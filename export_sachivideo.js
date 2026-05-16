const https = require('https');
const fs = require('fs');

// Base44 SDK-style fetch against the app's entity endpoint
// Using the app ID from context: 69b2ee18a8e6fb58c7f0261c
const APP_ID = '69b2ee18a8e6fb58c7f0261c';
const ENTITY = 'SachiVideo';

async function fetchAll() {
  const allRecords = [];
  let skip = 0;
  const limit = 500;

  while (true) {
    const url = `https://app.base44.com/api/apps/${APP_ID}/entities/${ENTITY}?limit=${limit}&skip=${skip}`;
    const data = await new Promise((resolve, reject) => {
      https.get(url, { headers: { 'Accept': 'application/json' } }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try { resolve(JSON.parse(body)); }
          catch(e) { reject(e); }
        });
      }).on('error', reject);
    });

    const records = data.records || data;
    allRecords.push(...records);
    if (!data.has_more || records.length < limit) break;
    skip += limit;
  }

  return allRecords;
}

fetchAll().then(records => {
  fs.writeFileSync('/app/sachivideo_export.json', JSON.stringify(records, null, 2));
  console.log(`Exported ${records.length} records`);
}).catch(console.error);
