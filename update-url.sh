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
# Menggunakan docker-compose sesuai sistem kamu
docker-compose build --no-cache frontend cms
docker-compose up -d frontend cms

echo "🧹 3. Membersihkan Dockerfile (Git Reset)..."
# Penting: Menggunakan -C karena ini folder submodule
git -C company-profile-batik checkout Dockerfile
git -C dashboard-cms checkout Dockerfile

echo "⚡ 4. Menjalankan Hotfix ke File JS di dalam Container..."
echo "🧹 Menghapus Cache Next.js..."
docker exec -it company-profile-frontend rm -rf .next/cache

echo "📂 Patching Frontend Container..."
docker exec -it company-profile-frontend sh -c "find .next -type f -exec sed -i \"s|http://localhost:3000/api|$NEW_URL/api|g\" {} +"

echo "📂 Patching CMS Container..."
docker exec -it cms_app sh -c "find build -type f -name '*.js' | xargs sed -i \"s|http://localhost:3000/api|$NEW_URL/api|g\""

# Restart agar perubahan terbaca sempurna
echo "🔄 Me-restart container..."
docker-compose restart frontend cms

echo "✅ Selesai! Silakan buka browser (Mode Incognito)."