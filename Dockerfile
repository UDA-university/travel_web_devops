# --- Base ---
FROM node:20-alpine AS base
WORKDIR /app

# Install openssl for Prisma on alpine
RUN apk add --no-cache openssl

# --- Dependencies ---
FROM base AS deps
COPY package*.json ./
RUN npm ci

# --- Build ---
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate \
 && npm run build

# --- Production deps ---
FROM base AS prod-deps
COPY package*.json ./
RUN npm ci --omit=dev

# --- Production ---
FROM node:20-alpine AS prod
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production

# Copy production deps
COPY --from=prod-deps /app/node_modules ./node_modules
# Copy app build and needed files
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma

# Generate Prisma client in production
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "dist/main.js"]


