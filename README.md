# YOUNOYA E-Commerce Storefront

Self-hosted, mobile-first e-commerce storefront with zero-password checkout built on **Medusa.js v2** and **Next.js 14**.

## Architecture Overview

```text
YOUNOYA Storefront (Next.js 14 App Router) -> Port 8000
Medusa.js v2 Backend (Node.js / TypeScript)  -> Port 9000
PostgreSQL 15 Database                       -> Port 5432
Redis 7                                      -> Port 6379
Mailpit SMTP UI                              -> Port 8025
```

## Getting Started

### Local Development

1. **Start Infrastructure (Postgres, Redis, Mailpit):**
   ```bash
   docker compose up -d
   ```

2. **Start Backend (Medusa v2):**
   ```bash
   cd backend
   npm install
   npx medusa db:migrate
   npx medusa develop
   ```

3. **Start Storefront (Next.js 14):**
   ```bash
   cd storefront
   npm install
   npm run dev
   ```

### Production Deployment (Docker Compose)

```bash
docker compose -f docker-compose.prod.yml up -d --build
```
