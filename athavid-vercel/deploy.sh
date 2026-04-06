#!/bin/bash
# =============================================
# Sachi Deploy Script — always deploys to sachistream.com
# Usage: cd /app/athavid-vercel && bash deploy.sh
# =============================================
set -e

VERCEL_TOKEN="vcp_28jLjwTb6A0mRMAOc523fAPjGByXZwBgUhYGxUXB4DNBfmftU91IA8lJ"
PROJECT_ID="prj_7V2taBrhaBnslgsvWamtuxKA0NAx"
ORG_ID="team_29auQvEPvNEdVoXHsPeql01G"

echo "🔨 Building Sachi..."
cd /app/athavid-vercel
npm run build

echo "📋 Writing cache headers..."
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

echo "🔒 Locking to correct Vercel project..."
mkdir -p dist/.vercel
cat > dist/.vercel/project.json << PEOF
{"projectId":"${PROJECT_ID}","orgId":"${ORG_ID}","projectName":"athavid-vercel"}
PEOF

echo "🚀 Deploying to sachistream.com..."
cd dist
npx vercel deploy --prod --token "$VERCEL_TOKEN" --yes --force

echo ""
echo "✅ DONE — sachistream.com updated!"
