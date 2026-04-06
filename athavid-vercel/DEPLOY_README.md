# 🔒 Sachi Deploy System

## Live Site
- https://www.sachistream.com
- https://sachistream.com

## Vercel Project
- Name: athavid-vercel
- Project ID: prj_7V2taBrhaBnslgsvWamtuxKA0NAx
- Org ID: team_29auQvEPvNEdVoXHsPeql01G

## Known Good Build
- JS hash: sachi-4cdd7cc5.js
- Locked on: April 5, 2026
- Source: App.jsx.LOCKED (3494 lines)

## How to Deploy
```bash
bash /app/athavid-vercel/deploy.sh
```
Always builds fresh, locks cache headers, locks project target, verifies alias to sachistream.com.

## How to Restore (if something breaks)
```bash
bash /app/athavid-vercel/restore.sh
```
Restores App.jsx from the last locked backup and redeploys.

## Rules
1. NEVER run `vercel deploy` manually from the dist/ folder without setting project.json first
2. ALWAYS use deploy.sh — it handles project locking automatically
3. After any major working update, run: `cp src/App.jsx App.jsx.LOCKED` to update the backup
