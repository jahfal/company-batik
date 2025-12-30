#!/bin/bash

# 1. Validasi Input
if [ -z "$1" ]; then
    echo "❌ Error: Masukkan URL Cloudflare baru!"
    exit 1
fi

NEW_URL=$(echo $1 | sed 's|/$||')
TEMPLATE_URL="http://localhost:3000/api"

echo "🔄 1. Patching Dockerfile..."
sed -i "s|$TEMPLATE_URL|$NEW_URL/api|g" company-profile-batik/Dockerfile
sed -i "s|$TEMPLATE_URL|$NEW_URL/api|g" dashboard-cms/Dockerfile

echo "🏗️  2. Membangun Service (Build Ulang)..."
# Menggunakan nama service: frontend & cms
docker-compose build --no-cache frontend cms
docker-compose up -d frontend cms

echo "🧹 3. Membersihkan Dockerfile (Git Reset)..."
git checkout company-profile-batik/Dockerfile
git checkout dashboard-cms/Dockerfile

echo "⚡ 4. Menjalankan Hotfix ke File JS (Penting!)..."
# Menggunakan nama container: company-profile-frontend & cms_app
# Kita paksa ganti semua teks localhost di dalam file .js yang sudah terlanjur jadi
docker exec -it company-profile-frontend sh -c "find .next -type f -name '*.js' | xargs sed -i 's|http://localhost:3000/api|$NEW_URL/api|g'"
docker exec -it cms_app sh -c "find build -type f -name '*.js' | xargs sed -i 's|http://localhost:3000/api|$NEW_URL/api|g'"

echo "✅ Selesai! Silakan buka browser (Mode Incognito)."