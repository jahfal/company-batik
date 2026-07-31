# --- STAGE 1: BUILDER ---
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Suntikkan variabel API saat build agar Next.js membungkus URL API ke file statis
ARG NEXT_PUBLIC_API_URL=https://api-batik.jahfallazuardi.my.id
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# --- STAGE 2: RUNNER ---
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# Mengambil hasil standalone build (Sangat Ringan!)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3001
ENV PORT 3001

CMD ["node", "server.js"]