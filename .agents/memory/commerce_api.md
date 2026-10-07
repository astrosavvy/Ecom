# Commerce API & Backend Specification (Medusa 2.18)

## Core endpoints
- Products: GET /store/products and /store/products/:id.
- Cart: POST /store/carts, /store/carts/:id/line-items and /store/carts/:id/complete.
- OTP config: GET /store/otp/config exposes enabled channels, code length and expiry/resend seconds only.
- Request/resend: POST /store/otp/request or /resend accepts {email} or {phone, channel: "whatsapp" | "sms"}; returns challenge_id, expires_at and resend_at.
- Verify: POST /store/otp/verify accepts the same contact, otp and optional challenge_id. It returns a ten-minute otp-login ticket for /auth/customer/younoya-mobile-otp. Legacy email clients without challenge_id remain compatible.
- Storefront journal: GET /store/blog/posts and /store/blog/posts/:slug.

## OTP security and delivery
- PBKDF2-SHA512, 100,000 iterations, cryptographic salt and timing-safe comparison. Six digits, at most ten minutes and five failed checks. Verification consumes the code atomically.
- PostgreSQL transaction-scoped identifier/IP locks enforce shared 60s phone-channel cooldown and default hourly caps of ten per identifier/twenty per IP. Unavailable storage denies delivery.
- New codes activate after provider acceptance. A failed resend preserves the previous valid code; accepted resends invalidate older codes. Provider timeout/rejection never triggers automatic retry or SMS fallback.
- India-only +91 mobile identity is shared by WhatsApp and SMS. Phone-only customers are supported; email accounts remain separate and checkout collects email.
- SMTP email backup; Gupshup WhatsApp approved authentication templates; Enterprise SMS HTTPS POST with Indian DLT sender/entity/template settings. All private configuration remains on the backend, never VITE variables or responses/logs.
- Mobile channels default disabled and require complete configuration plus controlled live verification before activation. Production ignores mock mode. Development mock uses six digits but never returns the code in API responses.
- Protocol, environment placeholders, migration/testing and rollout: backend/OTP_LOGIN.md. As of 2026-10-07 the backend is migrated/deployed, public health/config pass and only email is enabled.

## Custom modules
- younoya-otp: challenge, secure delivery, verification and atomic limits.
- younoya-mobile-auth: verified contact ticket to Medusa auth identity.
- younoya-blog: journal stories (16:9 cover, 1:1 list).
- younoya-themes: keepsake themes/product groupings.
- younoya-toolkits: curated boxes/rules.
- younoya-recipients: recipient profiles/addresses.
- younoya-astro: Vedic calculation and recommendations.
