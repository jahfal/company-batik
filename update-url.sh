#!/bin/bash

# Pastikan user memasukkan URL baru sebagai argumen
if [ -z "$1" ]; then
    echo "❌ Error: Masukkan URL Cloudflare baru!"
    echo "Contoh: ./update-url.sh https://contoh.trycloudflare.com"
    exit 1
fi

# Hilangkan slash (/) di akhir URL jika user memasukkannya agar tidak dobel
NEW_URL=$(echo $1 | sed 's|/$||')
TEMPLATE_URL="http://localhost:3000/api"

echo "🔄 Memproses Patch URL ke: $NEW_URL/api"

# Patch Frontend
# Kita gunakan pemisah '#' agar tidak bentrok dengan '/' milik https://
if [ -f "company-profile-batik/Dockerfile" ]; then
    echo "📂 Patching Frontend..."
    sed -i "s|$TEMPLATE_URL|$NEW_URL/api|g" company-profile-batik/Dockerfile
fi

# Patch CMS
if [ -f "dashboard-cms/Dockerfile" ]; then
    echo "📂 Patching CMS..."
    sed -i "s|$TEMPLATE_URL|$NEW_URL/api|g" dashboard-cms/Dockerfile
fi

echo "🏗️  Membangun ulang container..."
# Gunakan 'docker compose' (tanpa tanda hubung) untuk versi terbaru
docker-compose build --no-cache frontend cms
docker-compose up -d frontend cms

# KEMBALIKAN KE TEMPLATE (PENTING!)
echo "🧹 Membersihkan Dockerfile agar tidak bentrok dengan Git..."
git checkout company-profile-batik/Dockerfile
git checkout dashboard-cms/Dockerfile

echo "✅ Selesai! Container sudah pakai URL baru: $NEW_URL/api"