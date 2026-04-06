#!/bin/bash
# =============================================
# 🔁 SACHI RESTORE SCRIPT
# Restores App.jsx from the last known good locked backup
# Then redeploys to sachistream.com
# =============================================
set -e

echo "⚠️  Restoring App.jsx from locked backup..."
cp /app/athavid-vercel/App.jsx.LOCKED /app/athavid-vercel/src/App.jsx
echo "✅ App.jsx restored ($(wc -l < /app/athavid-vercel/src/App.jsx) lines)"

echo "🚀 Redeploying..."
bash /app/athavid-vercel/deploy.sh
