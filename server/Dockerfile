# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Install PM2 globally
RUN npm install -g pm2

# Start with PM2 using ecosystem file
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
