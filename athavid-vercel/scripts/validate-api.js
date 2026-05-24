// ============================================================
// SACHI STREAM — PRE-DEPLOY VALIDATION
// Run: node scripts/validate-api.js
// Fails the build if api.js points to the wrong app.
// ============================================================
const fs = require("fs");
const path = require("path");

const apiPath = path.join(__dirname, "../src/api.js");
const src = fs.readFileSync(apiPath, "utf8");

const CORRECT_APP_ID = "69e79122bcc8fb5a04cfb834";
const WRONG_APP_ID   = "69b2ee18a8e6fb58c7f0261c"; // Daminie/JMUX — NEVER here

let errors = 0;

if (!src.includes(CORRECT_APP_ID)) {
  console.error(`❌ WRONG APP_ID in api.js! Must contain ${CORRECT_APP_ID}`);
  errors++;
}

if (src.includes(WRONG_APP_ID)) {
  console.error(`❌ JMUX app ID (${WRONG_APP_ID}) found in api.js — this is the WRONG app!`);
  errors++;
}

// Sanity check: must point to base44 domain
if (!src.includes("base44.com") && !src.includes("base44.app")) {
  console.error(`❌ No base44 domain found in api.js — check BASE_URL`);
  errors++;
}

if (errors > 0) {
  console.error("\n🚨 BUILD ABORTED — api.js is pointing to the wrong app.");
  process.exit(1);
} else {
  console.log("✅ api.js validation passed — correct Sachi Stream app ID confirmed.");
}
