# --- STAGE 1: BUILDER ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Suntikkan variabel API saat build
ARG NEXT_PUBLIC_API_URL=https://api-batik.jahfallazuardi.my.id
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# --- STAGE 2: RUNNER (HARDENED) ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# 1. Buat User & Group Non-Root khusus untuk Next.js
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 2. Copy file statis dan standalone dengan kepemilikan user non-root
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 3. Pindahkan eksekusi ke User 'nextjs' (Bukan Root!)
USER nextjs

EXPOSE 3001

ENTRYPOINT ["node", "server.js"]