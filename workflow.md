# YOUNOYA — Architecture & Development Workflow

This document details the architecture, local setup, data models, checkout/OTP flows, and operational procedures for YOUNOYA on Medusa.js v2.

---

## 1. System Architecture

```text
Customer Browser
  └─ YOUNOYA Storefront (Next.js 14 App Router)
       ├─ Product Catalog & Search Pages
       ├─ Product Detail Pages
       ├─ Cart (Medusa JS SDK)
       ├─ Unified Single-Page Checkout
       ├─ Passwordless OTP Modal
       ├─ Account Dashboard (Orders, Addresses, Profile)
       └─ Static Pages (About, Contact, Blog, Policies)

Medusa.js v2 Backend (Node.js / TypeScript)
  ├─ Medusa Core Modules (Product, Cart, Order, Customer, Pricing, Inventory)
  ├─ Custom Module: younoya-otp (OTP challenge, rate limiting)
  ├─ Custom Module: younoya-cod (Cash on Delivery payment provider)
  ├─ Custom Module: younoya-blog (Blog posts data model)
  ├─ Razorpay Payment Provider (@alchemilla/medusa-razorpay or custom)
  ├─ Event Subscribers (OTP email, order confirmation, etc.)
  ├─ Workflows (checkout-with-otp, place-order-cod)
  ├─ Admin Dashboard (built-in at /app)
  └─ Custom API Routes (/store/otp/*, /store/blog/*)

PostgreSQL 15 Database
  ├─ Medusa Core Tables (product, cart, order, customer, etc.)
  ├─ OTP Extension Tables (otp_challenge, otp_rate_limit)
  └─ Blog Extension Tables (blog_post)

Redis
  ├─ Session Store
  ├─ BullMQ Job Queue
  └─ Cache Layer

External Services
  ├─ SMTP (SendPulse production / Mailpit dev)
  ├─ Cloudflare (CDN, DNS, Tunnel for TLS)
  └─ MinIO or Cloudflare R2 (Product images)
```

---

## 2. Local Setup & Commands

### Prerequisites
- Node.js 20+ and npm 9+
- Docker & Docker Compose
- Git

### Backend Commands
```bash
cd backend/
npm install
npx medusa db:migrate          # Run database migrations
npx medusa db:seed             # Seed initial data
npx medusa develop             # Start dev server (hot reload)
npx medusa build               # Production build
npx medusa start               # Start production server
```

### Storefront Commands
```bash
cd storefront/
npm install
npm run dev                    # Next.js dev server (port 8000)
npm run build                  # Production build
npm start                      # Start production server
```

### Docker
```bash
docker compose up -d           # Start all services (app, postgres, redis, mailpit)
docker compose down            # Stop all services
```

### URLs
- Storefront: `http://localhost:8000`
- Medusa API: `http://localhost:9000`
- Admin Dashboard: `http://localhost:9000/app`
- Mailpit: `http://localhost:8025`

---

## 3. Backend Module Structure

### Custom Module Template
```
backend/src/modules/<module-name>/
├── index.ts                   # Module definition (export default Module)
├── service.ts                 # Business logic (extends MedusaService)
├── models/                    # MikroORM data models
│   └── <entity-name>.ts
├── migrations/                # Database migrations
│   └── Migration<timestamp>.ts
└── loaders/                   # Module initialization hooks
```

### Registering a Module (medusa-config.ts)
```typescript
module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: { storeCors, adminCors, authCors },
  },
  modules: [
    { resolve: "./src/modules/younoya-otp" },
    { resolve: "./src/modules/younoya-cod" },
    { resolve: "./src/modules/younoya-blog" },
  ],
})
```

---

## 4. Customer Checkout & OTP State Machine

```text
[ Visitor Adds Product to Cart (Medusa JS SDK) ]
              │
              ▼
[ Opens /checkout — Fills Contact & Address ]
              │
              ▼
[ Clicks "Place Order — ₹X,XXX" ]
              │
              ├── Form Validation Fail ──► [ Show Inline Errors (Preserve Inputs) ]
              │
              ▼ Form Valid
[ POST /store/otp/request ] ──► [ Hash OTP → Store in DB ] ──► [ Send Email ]
              │
              ▼
[ Display Inline OTP Verification Modal ]
              │
              ├── Expired / Invalid OTP ──► [ Show Error Message (Keep Form State) ]
              │
              ▼ Valid 6-Digit OTP
[ POST /store/otp/verify ]
              │
              ├─ Find or Create Medusa Customer (email as key)
              ├─ Authenticate customer session (Medusa auth)
              ├─ Set shipping address on cart
              ├─ Select shipping method
              ├─ Select payment method (COD or Razorpay)
              │
              ├── COD Path ──► Complete cart → Create order → Redirect to confirmation
              └── Razorpay Path ──► Create Razorpay order → Client-side payment
                                    → Webhook verifies → Complete cart → Order created
```

---

## 5. OTP Database Model

```sql
-- Custom table in younoya-otp module
CREATE TABLE otp_challenge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 5,
    expires_at TIMESTAMP NOT NULL,
    consumed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    ip_address INET,
    status VARCHAR(20) DEFAULT 'pending'
);

CREATE TABLE otp_rate_limit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier VARCHAR(255) NOT NULL,
    identifier_type VARCHAR(10) NOT NULL,
    request_count INTEGER DEFAULT 1,
    window_start TIMESTAMP DEFAULT NOW(),
    window_minutes INTEGER DEFAULT 60
);
```

---

## 6. API Routes

### Custom Store API Routes (backend/src/api/store/)
| Method | Path | Description |
|---|---|---|
| POST | `/store/otp/request` | Generate and email OTP |
| POST | `/store/otp/verify` | Verify OTP, find/create customer, set session |
| POST | `/store/otp/resend` | Resend OTP with cooldown check |
| GET | `/store/blog/posts` | List published blog posts |
| GET | `/store/blog/posts/:slug` | Get single blog post by slug |

### Medusa Built-in Store API (used by storefront)
| Feature | Endpoint |
|---|---|
| Products | `GET /store/products`, `GET /store/products/:id` |
| Collections | `GET /store/collections` |
| Cart | `POST /store/carts`, `POST /store/carts/:id/line-items` |
| Checkout | `POST /store/carts/:id/complete` |
| Customer | `GET /store/customers/me`, `POST /store/customers` |
| Orders | `GET /store/orders` |
| Regions | `GET /store/regions` |

---

## 7. Event Subscribers

| Event | Subscriber Action |
|---|---|
| `order.placed` | Send order confirmation email |
| `otp.requested` | Send OTP email via SMTP |
| `customer.created` | Send welcome email |
| `order.fulfillment_created` | Send shipping notification |

---

## 8. Data to Migrate from EverShop

### Products (10 items)
| SKU | Name | Price (INR) |
|---|---|---|
| YN-TEE-001 | YOUNOYA Classic Organic Cotton Tee | 799 |
| YN-EAR-002 | Wireless Noise-Canceling Earbuds Pro | 2499 |
| YN-LMP-003 | Ergonomic Smart Desk Lamp | 1899 |
| YN-WLT-004 | Handcrafted Genuine Leather Wallet | 1199 |
| YN-PWR-005 | Fast Charging Power Bank 20000mAh | 1599 |
| YN-BTL-006 | Premium Stainless Steel Water Bottle 1L | 699 |
| YN-HDP-007 | Over-Ear Bluetooth Headphones | 3499 |
| YN-BPK-008 | Minimalist Waterproof Backpack | 1999 |
| YN-SNK-009 | Breathable Running Sneakers | 2799 |
| YN-WTC-010 | Smart Fitness Band with SpO2 Tracker | 1799 |

### Design Tokens (from tokens.css — port to Next.js globals.css)
```css
--yn-primary: hsl(24, 75%, 48%);
--yn-primary-hover: hsl(24, 75%, 40%);
--yn-secondary: hsl(36, 40%, 95%);
--yn-accent: hsl(168, 55%, 35%);
--yn-accent-hover: hsl(168, 55%, 28%);
--yn-surface: hsl(30, 20%, 98%);
--yn-surface-alt: hsl(30, 10%, 94%);
--yn-text: hsl(20, 15%, 18%);
--yn-text-muted: hsl(20, 10%, 45%);
--yn-error: hsl(0, 65%, 50%);
--yn-success: hsl(145, 45%, 42%);
--yn-warning: hsl(38, 90%, 50%);
--yn-border: hsl(30, 10%, 85%);
--yn-font-heading: 'Outfit', sans-serif;
--yn-font-body: 'Inter', sans-serif;
--yn-radius-sm: 8px;
--yn-radius-md: 12px;
--yn-radius-lg: 24px;
--yn-shadow-sm: 0 1px 3px hsla(20, 15%, 18%, 0.08);
--yn-shadow-md: 0 4px 12px hsla(20, 15%, 18%, 0.1);
--yn-shadow-lg: 0 8px 30px hsla(20, 15%, 18%, 0.12);
```

### Storefront Pages to Rebuild
| Route | Page |
|---|---|
| `/` | Homepage (hero, featured products, collections) |
| `/search` | Product catalog with search/filter |
| `/products/:handle` | Product detail page |
| `/cart` | Cart page |
| `/checkout` | Unified checkout (contact, address, OTP, payment) |
| `/order/confirmed/:id` | Order confirmation |
| `/account` | Account dashboard |
| `/account/orders` | Order history |
| `/account/orders/:id` | Order detail |
| `/account/addresses` | Saved addresses |
| `/about` | About YOUNOYA |
| `/contact` | Contact form |
| `/blog` | Blog listing |
| `/blog/:slug` | Blog detail |
| `/privacy` | Privacy policy |
| `/terms` | Terms and conditions |
| `/refund` | Refund policy |
| `/shipping` | Shipping policy |

---

## 9. Environment Variables

```env
# Database
DATABASE_URL=postgres://postgres:postgres@localhost:5432/younoya

# Redis
REDIS_URL=redis://localhost:6379

# Medusa
MEDUSA_ADMIN_ONBOARDING_TYPE=default
STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:8000,http://localhost:9000
COOKIE_SECRET=change_this_to_secure_random_string

# OTP
OTP_EXPIRY_MINUTES=10
OTP_MAX_ATTEMPTS=5
OTP_RESEND_COOLDOWN_SECONDS=60
OTP_RATE_LIMIT_MAX_PER_HOUR=10

# Email / SMTP
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM_EMAIL=noreply@younoya.com
SMTP_FROM_NAME=YOUNOYA

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Storage (MinIO / R2)
S3_ENDPOINT=http://localhost:9000
S3_BUCKET_NAME=younoya-media
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=

# Cloudflare Tunnel
TUNNEL_TOKEN=

# Storefront
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=
```

---

## 10. Deployment & Release Checklist

- [ ] Set all environment variables in production `.env`
- [ ] Connect PostgreSQL with SSL (`?sslmode=require` in DATABASE_URL)
- [ ] Run `npx medusa db:migrate` on production
- [ ] Seed initial data (products, regions, shipping options)
- [ ] Build backend: `npx medusa build`
- [ ] Build storefront: `npm run build`
- [ ] Verify Razorpay webhook endpoint is reachable
- [ ] Test end-to-end checkout with COD
- [ ] Test OTP flow with production SMTP
- [ ] Verify admin dashboard access at `/app`

---

## 11. Material Decision Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-08-06 | EverShop as commerce engine | Initial choice: open-source Node.js + PostgreSQL |
| 2026-08-06 | Passwordless email OTP auth | Frictionless zero-password checkout |
| 2026-08-06 | India / INR focus | PIN code, +91 phone, Indian states validation |
| 2026-08-07 | **Migrate to Medusa.js v2** | EverShop requires 4 monkey-patches, lacks workflow engine, weak event system, small ecosystem. Medusa has composable modules, workflow engine, 35k+ GitHub stars, India payment plugins. Same Node.js/TS stack — zero retraining. |
| 2026-08-07 | Next.js 14 storefront | App Router, React Server Components, same team skillset |
| 2026-08-07 | Razorpay + COD payments | Community Razorpay plugin available; COD via custom provider |
| 2026-08-07 | Docker Compose deployment | Self-hosted on Linux VPS with Cloudflare Tunnel for TLS |
