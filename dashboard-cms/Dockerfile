# Stage 1: Build the CMS application
FROM node:18-alpine AS builder
WORKDIR /app

# 1. Pindahkan ARG & ENV ke atas agar terbaca sejak awal proses build
ARG REACT_APP_API_URL=https://api-batik.jahfallazuardi.my.id
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY package*.json ./
RUN npm install
COPY . .

# Menjalankan build dengan env yang sudah dipastikan siap
RUN npm run build

# Stage 2: Production Image menggunakan Nginx (Super Hemat RAM)
FROM nginx:alpine
# Sesuaikan folder hasil build React Anda (biasanya 'build' atau 'dist')
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]