FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=2048"
COPY package*.json ./
RUN npm ci
COPY . .
RUN chmod +x ./node_modules/.bin/* || true
RUN npx medusa build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app ./
EXPOSE 9000
CMD ["npm", "run", "start"]
