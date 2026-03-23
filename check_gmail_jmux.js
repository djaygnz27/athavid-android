const fs = require('fs');

// Decode the webhook payload
const payload = {
  "emailAddress": "jaygnz27@gmail.com",
  "historyId": 2404637
};

console.log(`Checking Gmail history starting from ID: ${payload.historyId}`);
console.log(`Email: ${payload.emailAddress}`);

// We'll use the Gmail API to fetch messages
const { google } = require('googleapis');

// For now, log what we're checking
console.log('Webhook triggered - monitoring for JMUX emails');
console.log(`Timestamp: 2026-03-23T21:29:03.91Z`);
console.log(`History ID: ${payload.historyId}`);
