#!/bin/bash
set -e

# Default process type
app_name="spd-elearning--backend"

echo "Start deployment..."

echo ""
echo "1. Install Packages"
npm i

echo ""
echo "2. Generate schema"
npx prisma generate


echo ""
echo "3. Deploy"
npm run build
 
if pm2 jlist | grep -q "\"name\":\"$app_name\""; then
    echo "✅ $app_name exists"
    pm2 restart $app_name
else
    echo "❌ $app_name not found"
    pm2 start 'npm run start' --name $app_name
fi