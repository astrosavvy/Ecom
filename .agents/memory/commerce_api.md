# Commerce API & Backend Specification (Medusa 2.18)

## 1. Core Endpoints
- **Store Products**: `GET /store/products`, `GET /store/products/:id`
- **Store Cart**:
  - `POST /store/carts` (create cart)
  - `POST /store/carts/:id/line-items` (add item)
  - `POST /store/carts/:id/complete` (place order)
- **OTP Challenge Routes**:
  - `POST /store/otp/request` (payload: `{ email }` or `{ phone }`)
  - `POST /store/otp/verify` (payload: `{ identifier, code }` -> returns customer session JWT)
  - `POST /store/otp/resend` (cooldown check: 60s)
- **Storefront Blog**: `GET /store/blog/posts`, `GET /store/blog/posts/:slug`

## 2. OTP Security Architecture
- Hash algorithm: PBKDF2-SHA512, 100,000 iterations, 32-byte salt.
- In dev mode: `OTP_MODE=mock` returns `1234` for rapid testing.
- In production: 6-digit random int sent via SMTP (SendPulse) or SMS.
- Expiry: 10 minutes (`expires_at`), max 5 attempts before invalidation.

## 3. Custom Modules in `backend/src/modules/`
1. `younoya-otp`: OTP challenges, verification, and rate limiting.
2. `younoya-blog`: Journal articles (`cover_image 16:9`, `list_image 1:1`).
3. `younoya-themes`: Keepsake gift themes and product groupings.
4. `younoya-toolkits`: Curated gift boxes and recommendation rules.
5. `younoya-recipients`: Gift recipient profiles and address management.
6. `younoya-astro`: Vedic astrology calculation utilities (Moon sign, nakshatra, dasha).
