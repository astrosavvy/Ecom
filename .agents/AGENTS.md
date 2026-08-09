# YOUNOYA — Project Rules

Rules for all agents modifying code, config, or design in this repository.

---

## 1. Mission

YOUNOYA is a self-hosted, mobile-first e-commerce storefront with **zero-password checkout**. Email OTP is the only authentication method — no usernames, no passwords, no sign-up pages.

**Conversion path:** Browse → Add to cart → One-page checkout → Email OTP → Payment/COD → Order confirmation

---

## 2. Stack

| Layer | Technology |
|---|---|
| Commerce backend | **Medusa.js v2** (Node.js, TypeScript, PostgreSQL) |
| Storefront | **Next.js 14+** (App Router, React, TypeScript) |
| Admin | Medusa Admin Dashboard (built-in at `/app`) |
| Database | PostgreSQL 15+ (only database) |
| Cache / Jobs | Redis + BullMQ |
| Auth | Passwordless email OTP (custom Medusa Module) |
| Payments | Razorpay (via community plugin) + COD (custom provider) |
| Email | SMTP (SendPulse / Mailpit for dev) |
| Deployment | Docker Compose on self-managed Linux VPS |
| Support | Chatwoot (self-hosted widget) |

### 2.1 Project Structure
```
younoya/
├── backend/           # Medusa v2 application
│   ├── src/
│   │   ├── modules/   # Custom Medusa modules (OTP, COD, blog)
│   │   ├── api/       # Custom API routes
│   │   ├── workflows/ # Medusa workflows
│   │   ├── subscribers/ # Event subscribers
│   │   └── jobs/      # Scheduled jobs
│   ├── medusa-config.ts
│   └── package.json
├── storefront/        # Next.js 14 application
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/# React components
│   │   ├── lib/       # Medusa JS SDK, utilities
│   │   └── styles/    # CSS (design tokens, globals)
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

### 2.2 Rules
- Custom logic goes in `backend/src/modules/`, `backend/src/workflows/`, or `backend/src/subscribers/`.
- Storefront pages go in `storefront/src/app/`.
- Never modify files inside `node_modules`. Use Medusa's module/plugin/subscriber system.
- Register custom modules in `medusa-config.ts`.
- Use MikroORM for data models. Run `npx medusa db:migrate` for schema changes.

---

## 3. Security

- **Sessions:** Secure, HttpOnly, SameSite cookies only. Never use `localStorage`/`sessionStorage` for auth tokens.
- **Secrets:** Never commit `.env`, credentials, or keys. Maintain `.env.example` with variable names only.
- **Logging:** Never log OTPs, session tokens, payment data, or PII. Log security events (failed OTP, rate-limit hits) without sensitive payloads.
- **Payments:** Webhook handlers must be idempotent and verify provider signatures. Payment starts only after OTP verification.
- **Account enumeration:** Never reveal whether an email has an account before successful OTP verification.

---

## 4. OTP Requirements

| Rule | Value |
|---|---|
| Format | 6-digit numeric, `crypto.randomInt` |
| Expiry | ≤ 10 minutes |
| Storage | Salted hash only (never raw) |
| Usage | Single-use, invalidated after verification |
| Max attempts | 5 per challenge |
| Resend cooldown | 60 seconds |
| Rate limit | By email AND IP |
| Account creation | Only after valid OTP |

**Flow:** Form validated → OTP sent → Inline modal (form state preserved) → Verify → Find-or-create customer → Set session → Place order → Confirmation page + email.

---

## 5. Checkout

- **Single page** — no separate sign-up, login, or multi-step navigation.
- **Required fields:** email, full name, mobile (+91), house/flat, street/area, city, state, PIN code (6-digit), payment method, terms checkbox.
- **Optional:** landmark, delivery instructions, marketing consent (unchecked default).
- **Preserve** all form and cart state through OTP, validation errors, and network failures. Never clear input on error.
- **Inline validation** after blur and on submit. No errors before interaction.
- **Transparent pricing** — subtotal, shipping, discounts, and tax visible before payment.
- **Duplicate prevention** — disable submit button while request is in-flight.

---

## 6. UI/UX

- **Brand:** YOUNOYA. Warm, trustworthy, modern, premium. Never cluttered.
- **Mobile-first.** 44×44px minimum touch targets. One primary CTA per view.
- **Accessibility:** WCAG 2.1 AA contrast, visible focus states, semantic HTML, `aria-live` for dynamic updates.
- **States:** Every feature must handle: loading/skeleton, empty, success, error, network failure, and retry.
- **No dark patterns:** No forced consent, fake urgency, hidden fees, or excessive modals.

### Design Tokens (preserve from current theme)
```css
--yn-primary: hsl(24, 75%, 48%);      /* Warm amber */
--yn-accent: hsl(168, 55%, 35%);       /* Rich teal */
--yn-surface: hsl(30, 20%, 98%);       /* Warm white */
--yn-text: hsl(20, 15%, 18%);          /* Deep charcoal */
--yn-font-heading: 'Outfit', sans-serif;
--yn-font-body: 'Inter', sans-serif;
```

---

## 7. Out of Scope (MVP)

🚫 Password auth, social login, wishlists, loyalty, referrals, subscriptions, marketplace, native apps, custom CRM/ERP/helpdesk, Vercel deployment (unless approved).

---

## 9. VPS Backend Deployment Rules (Strict Direct File Transfer)

1. **No Git Pull on VPS**: The VPS backend does not use git pull for deployments.
2. **Transfer via SCP as `ubuntu` User**:
   - Transfer updated backend files using SCP with SSH key `id_ed25519_clean` to the `ubuntu` user home or `/tmp/` directory on IP `140.245.7.165`.
   - Command: `scp -i "C:\Users\Palak\.ssh\id_ed25519_clean" <local_file> ubuntu@140.245.7.165:/tmp/<file_name>`
3. **Move & Restart Services**:
   - Copy file into Nginx web root `/var/www/younoya/backend/public/`.
   - Fix ownership to `www-data:www-data`.
   - Restart PHP-FPM and Nginx: `sudo systemctl restart php8.4-fpm nginx`.
   - Command: `ssh -i "C:\Users\Palak\.ssh\id_ed25519_clean" ubuntu@140.245.7.165 "sudo cp /tmp/<file_name> /var/www/younoya/backend/public/<file_name> && sudo chown www-data:www-data /var/www/younoya/backend/public/<file_name> && sudo systemctl restart php8.4-fpm nginx"`

