# Security & Authentication Rules

## 1. Zero-Password Mobile & Email OTP
- **Algorithm**: PBKDF2-SHA512, 100,000 iterations + cryptographic salt.
- **Timing-Safe Comparison**: Always use `hash_equals` / timing-safe byte comparison to prevent side-channel timing attacks.
- **Rate Limits**:
  - Max 5 failed attempts per challenge.
  - 10-minute expiry on challenges (`expires_at`).
  - Cooldown: 60 seconds between all requests/resends across phone channels. Codes activate after provider acceptance; failed resends preserve an earlier valid code and verification is single-use.
  - Default max 10 requests per hour per identifier; 20 per hour per IP. PostgreSQL transactions enforce limits atomically, with a shared normalized phone identity across WhatsApp/SMS. Storage failure rejects delivery.
- **Ticket Token**: Verification emits a single-purpose, 10-minute JWT ticket (`otp-login`) used to establish the customer session.

## 2. API Keys & Secrets Hygiene
- **Publishable Key**: `pk_d4577228b532cf8c81a5b63e898652da2dbaf9730acd3f8f449ccda1f8482c75` is client-safe by design for store requests.
- **Admin JWT & Database URL**: Secret. NEVER hardcode in client bundles or public commits. Always inject via environment variables (`.env`).
- **CORS Allowlist**:
  - `STORE_CORS`: `https://younoya.com,https://www.younoya.com,http://localhost:5173,http://localhost:3000`
  - `ADMIN_CORS`: `https://younoya.com,https://www.younoya.com,https://api.younoya.com`
  - `AUTH_CORS`: matching store and admin domains.

- Gupshup credentials, sender/entity/template configuration and SMTP secrets belong only in private backend environment files. New mobile channels remain disabled until approved templates and a controlled live test. No automatic retry or SMS fallback. OTP values never appear in API responses or logs.
