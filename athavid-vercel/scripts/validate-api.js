// ============================================================
// SACHI STREAM — PRE-DEPLOY VALIDATION
// Run: node scripts/validate-api.js
// Fails the build if api.js points to the wrong app.
// ============================================================
const fs = require("fs");
const path = require("path");

const apiPath = path.join(__dirname, "../src/api.js");
const src = fs.readFileSync(apiPath, "utf8");

const CORRECT_APP_ID   = "69e79122bcc8fb5a04cfb834";
const CORRECT_BASE_URL = "https://sachi-04cfb834.base44.app/api";
const WRONG_APP_ID     = "69b2ee18a8e6fb58c7f0261c"; // Daminie/JMUX — NEVER here

let errors = 0;

if (!src.includes(`APP_ID = "${CORRECT_APP_ID}"`)) {
  console.error(`❌ WRONG APP_ID in api.js! Must be ${CORRECT_APP_ID}`);
  errors++;
}
if (!src.includes(`BASE_URL = "${CORRECT_BASE_URL}"`)) {
  console.error(`❌ WRONG BASE_URL in api.js! Must be ${CORRECT_BASE_URL}`);
  errors++;
}
if (src.includes(WRONG_APP_ID)) {
  console.error(`❌ JMUX app ID (${WRONG_APP_ID}) found in api.js — this is the WRONG app!`);
  errors++;
}

if (errors > 0) {
  console.error("\n🚨 BUILD ABORTED — api.js is pointing to the wrong app.");
  console.error("   Sachi Stream App ID : 69e79122bcc8fb5a04cfb834");
  console.error("   Sachi BASE_URL       : https://sachi-04cfb834.base44.app/api");
  process.exit(1);
} else {
  console.log("✅ api.js validation passed — correct Sachi Stream app ID confirmed.");
}
