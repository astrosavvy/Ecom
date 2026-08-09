FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=400"

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/src ./src
COPY --from=builder /app/medusa-config.ts ./medusa-config.ts

EXPOSE 9000

CMD ["sh", "-c", "npx medusa db:migrate && npm run start"]
