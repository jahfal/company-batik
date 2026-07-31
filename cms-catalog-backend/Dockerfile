FROM node:18-alpine

WORKDIR /app

# 1. Salin file package untuk memanfaatkan Docker layer caching
COPY package*.json ./

# 2. Install dependencies (Hanya dependensi production untuk menghemat storage/RAM)
RUN npm install --production

# 3. Salin sisa source code backend
COPY . .

# 4. Set environment ke production agar runtime Node.js lebih optimal
ENV NODE_ENV=production

EXPOSE 3000

# 5. Jalankan langsung menggunakan node (sesuaikan index.js/server.js dengan main file Anda)
CMD ["node", "server.js"]