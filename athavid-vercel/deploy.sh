#!/bin/bash
# =============================================
# 🔒 SACHI LOCKED DEPLOY SCRIPT
# Always deploys to sachistream.com — DO NOT MODIFY
# Project: athavid-vercel | prj_7V2taBrhaBnslgsvWamtuxKA0NAx
# =============================================
set -e

VERCEL_TOKEN="vcp_28jLjwTb6A0mRMAOc523fAPjGByXZwBgUhYGxUXB4DNBfmftU91IA8lJ"
PROJECT_ID="prj_7V2taBrhaBnslgsvWamtuxKA0NAx"
ORG_ID="team_29auQvEPvNEdVoXHsPeql01G"
PROJECT_NAME="athavid-vercel"
TARGET_DOMAIN="sachistream.com"

echo "🔨 Building Sachi..."
cd /app/athavid-vercel
npm run build

echo "🔒 Locking vercel.json cache headers..."
cat > dist/vercel.json << 'EOF'
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/index.html",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" },
        { "key": "Pragma", "value": "no-cache" },
        { "key": "Expires", "value": "0" }
      ]
    },
    {
      "source": "/",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" },
        { "key": "Pragma", "value": "no-cache" },
        { "key": "Expires", "value": "0" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
EOF

echo "🔒 Locking project target to $TARGET_DOMAIN..."
mkdir -p dist/.vercel
cat > dist/.vercel/project.json << PEOF
{"projectId":"${PROJECT_ID}","orgId":"${ORG_ID}","projectName":"${PROJECT_NAME}"}
PEOF

echo "🚀 Deploying to $TARGET_DOMAIN..."
cd dist
RESULT=$(npx vercel deploy --prod --token "$VERCEL_TOKEN" --yes --force 2>&1)
echo "$RESULT" | grep -E "https://|Aliased|Production|Error"

# Verify it landed on the right domain
if echo "$RESULT" | grep -q "$TARGET_DOMAIN"; then
  echo ""
  echo "✅ SUCCESS — $TARGET_DOMAIN is live and up to date!"
else
  echo ""
  echo "⚠️  WARNING: Could not confirm alias to $TARGET_DOMAIN — check Vercel dashboard"
  exit 1
fi
