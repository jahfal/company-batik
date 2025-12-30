#!/bin/bash

# Pastikan user memasukkan URL baru sebagai argumen
if [ -z "$1" ]; then
    echo "❌ Error: Masukkan URL Cloudflare baru!"
    echo "Contoh: ./update-url.sh https://contoh.trycloudflare.com"
    exit 1
fi

NEW_URL=$1
# IP ini adalah 'placeholder' yang ada di Dockerfile asli kamu di GitHub
TEMPLATE_URL="http://192.168.1.53:3000"

echo "🔄 Memproses Patch URL ke: $NEW_URL"

# Patch Frontend (Next.js menggunakan folder .next)
sed -i "s|$TEMPLATE_URL|$NEW_URL|g" company-profile-batik/Dockerfile

# Patch CMS (React/Vite menggunakan folder build)
sed -i "s|$TEMPLATE_URL|$NEW_URL|g" dashboard-cms/Dockerfile

echo "🏗️  Membangun ulang container..."
docker compose build --no-cache frontend cms_app
docker compose up -d frontend cms_app

# KEMBALIKAN KE TEMPLATE (PENTING!)
# Agar saat nanti kamu git pull lagi, tidak ada konflik
git checkout company-profile-batik/Dockerfile
git checkout dashboard-cms/Dockerfile

echo "✅ Selesai! Container sudah pakai URL baru, dan Dockerfile dikembalikan ke template agar tidak bentrok dengan Git."