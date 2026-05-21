# SACHI STREAM — API IDs (NEVER CHANGE)

## Sachi Stream App (ALL Sachi code goes here)
- APP_ID:  `69e79122bcc8fb5a04cfb834`
- BASE_URL: `https://sachi-04cfb834.base44.app/api`

## Daminie Agent App (JMUX only — NEVER use in Sachi code)
- APP_ID: `69b2ee18a8e6fb58c7f0261c`
- BASE_URL: `https://sachi-c7f0261c.base44.app/api`

## ⛔ HARD RULES — NO EXCEPTIONS

1. BEFORE touching ANY Sachi source file, run:
   `grep -rn "69b2ee18\|sachi-c7f0261c" /app/athavid-vercel/src/ --include="*.jsx" --include="*.js"`
   If ANY result comes back → fix it BEFORE doing anything else.

2. The wrong ID is NOT just in api.js — it has been found in:
   App.jsx, AdminPanel.jsx, AuthModal.jsx, MusicPicker.jsx,
   SachiLive.jsx, PodcastHost.jsx, FoundingCreator.jsx, SachiGifts.jsx, Landing.jsx
   CHECK ALL OF THEM every time.

3. `npm run build` runs `node scripts/validate-api.js` first — wrong ID = build aborted.

4. A git pre-commit hook also blocks commits with the wrong ID.

5. NEVER copy-paste from backup files (*.bak, *.bak2, backup_*) — they all contain the wrong ID.

6. If any file is rewritten from scratch, the FIRST two lines of any standalone component must be:
   const APP_ID = "69e79122bcc8fb5a04cfb834";
   const BASE_URL = "https://sachi-04cfb834.base44.app/api";
