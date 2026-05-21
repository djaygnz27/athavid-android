# SACHI STREAM — API IDs (NEVER CHANGE)

## Sachi Stream App (ALL Sachi code goes here)
- APP_ID:  `69e79122bcc8fb5a04cfb834`
- BASE_URL: `https://sachi-04cfb834.base44.app/api`
- Upload:  `https://sachi-04cfb834.base44.app/api/apps/69e79122bcc8fb5a04cfb834/...`

## Daminie Agent App (JMUX only — NEVER use in Sachi code)
- APP_ID: `69b2ee18a8e6fb58c7f0261c`
- BASE_URL: `https://sachi-c7f0261c.base44.app/api`

## Rules
1. BEFORE touching api.js for ANY reason, verify the first two lines match Sachi values above.
2. BEFORE every deploy, run `node scripts/validate-api.js` — it will abort if wrong.
3. NEVER copy-paste the Daminie app ID into any Sachi file.
4. If api.js ever shows `69b2ee18`, STOP everything and fix it before proceeding.
5. The validate-api.js script runs automatically as part of `npm run build` — a wrong ID will fail the build loudly.
