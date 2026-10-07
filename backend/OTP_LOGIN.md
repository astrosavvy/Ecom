# Passwordless customer login

The gift-guide and checkout share one responsive sign-in overlay. Guests may view recommendations. Saving, reopening saved results and ordering require a customer session. Existing email accounts retain email OTP access; phone accounts do not merge automatically with email accounts.

## Server configuration

Put credentials only in the backend service's private environment. Never put Gupshup credentials in `VITE_*`, frontend source, public assets, logs, query strings or Git. The Medusa publishable storefront key is intentionally public.

WhatsApp requires `GUPSHUP_WHATSAPP_ENABLED=true`, `GUPSHUP_WA_API_KEY`, `GUPSHUP_WA_SOURCE` (digits including country code), `GUPSHUP_WA_APP_NAME`, and an approved authentication `GUPSHUP_WA_TEMPLATE_ID`. The adapter supplies the six-digit code twice, for the body and copy-code button.

SMS requires `GUPSHUP_SMS_ENABLED=true`, `GUPSHUP_SMS_USER_ID`, `GUPSHUP_SMS_PASSWORD`, `GUPSHUP_SMS_SENDER`, `GUPSHUP_SMS_ENTITY_ID`, `GUPSHUP_SMS_TEMPLATE_ID`, and `GUPSHUP_SMS_TEMPLATE_TEXT`. Set the exact approved DLT message with `{{otp}}` where the code belongs. The adapter uses HTTPS POST, form encoding and the provider's documented text success response. No credentials appear in the URL.

Both flags default to disabled. Configure and approve each channel separately, then perform a controlled OTP delivery/verification test with the owner's test recipient before activation. SMTP email remains the backup. No automatic paid fallback or timeout retry is performed. Provider acceptance is not a guarantee of final delivery.

## API

- `GET /store/otp/config`: enabled `channels`, `code_length`, `expiry_seconds`, `resend_seconds`; no credentials or sender configuration.
- `POST /store/otp/request` and `/resend`: `{phone, channel: "whatsapp" | "sms"}` or `{email}`. Response adds `challenge_id`, `expires_at`, `resend_at` to existing success fields.
- `POST /store/otp/verify`: same contact plus `otp` and optional `challenge_id`. Legacy email requests without a challenge id remain supported. Returns the existing short-lived ticket for `/auth/customer/younoya-mobile-otp`.
- WhatsApp and SMS share one normalized `+91` identity. Only Indian mobile numbers are accepted. First verified phone sign-in creates a customer with a phone and no fabricated email; checkout collects email separately.
- Cooldown/rate-limit responses use HTTP 429 and `Retry-After` plus `retry_after`. Provider/storage unavailability returns a sanitized 503.

## Persistence and security

The OTP module uses PostgreSQL transaction-scoped advisory locks through its Medusa transaction manager. Identifier and IP limits are checked together before reserving delivery. Cooldown is 60 seconds across channels; default hourly request limits are 10 per identifier and 20 per IP (`OTP_RATE_LIMIT_MAX_PER_HOUR` controls the first; the IP cap is twice it). Storage failures deny delivery.

Codes use PBKDF2-SHA512, expire after at most ten minutes and allow five failed checks. Delivery metadata tracks queued, accepted and failed requests. Codes activate after provider acceptance; a failed resend leaves the earlier valid code intact. Verification consumes a code atomically. Production ignores `OTP_MODE=mock`; development mock codes are six digits and never sent externally.

Build locally, transfer compiled artifacts via SSH, run migrations and restart the existing PM2 process. Never build on the VPS. Apply the additive migration before deploying new routes; deploy the backend before the frontend. Preserve the server's `.env`, uploads and installed dependencies. Frontend rollout safely falls back to email when an older backend lacks `/config`.

Run the OTP and auth Jest suites plus checkout checks. For real PostgreSQL concurrency/migration checks after a local build, explicitly set `OTP_QA_ALLOW_ISOLATED_SCHEMA=true` and run `node scripts/test-otp-postgres.cjs`. This runner uses a uniquely named QA schema, verifies its name before cleanup, removes the schema in `finally`, and creates no production customer rows. It requires permission to create/drop this disposable schema; it never resets application tables.

### Verified rollout — 2026-10-07

- Frontend root build and backend build exited 0; 19 targeted OTP/provider/auth/checkout tests passed. Provider fixtures cover success, rejection, malformed output and timeout without real delivery.
- The additive `Migration20261007120136` passed against an isolated PostgreSQL schema, including legacy defaults, concurrent cooldown/limits, shared phone channels, expiry, failed-resend preservation, supersession, five attempts and one successful consume under concurrency. The disposable schema was removed.
- Compiled backend artifacts were deployed via SSH, the migration applied and the existing PM2 service restarted. Public health and `/store/otp/config` return 200; configuration enables email only. Negative API checks reject invalid numbers, disabled mobile delivery and invalid codes. No live OTP message or production customer was created.
- The migration CLI initially loaded the wrong environment. Previous code was restored, then deployment succeeded by loading `loadEnv('production', runtimeDirectory)` in a Node parent and spawning the Medusa CLI with that environment. Keep this explicit loading when invoking migrations, and allow more than 30 seconds for a cold backend restart. Private environment files were untouched.
- Browser checks covered 1024/1920px desktop, 360/430px mobile, a 360 × 500 reduced-height viewport, native modal focus containment, Escape/focus restoration, phone formatting, masked contact, six-digit input, wrong-code feedback, resend countdown and mocked successful return. Dark autofill and reduced-motion rules were source-reviewed; actual OS keyboard, saved autofill and device OTP autofill still require a physical-device check.
- Both production asset folders were scanned for Gupshup secrets/direct provider URLs and mock OTP response fields: no matches. Existing large-bundle warning remains.
- A broader backend test run has four unrelated gift-guide expectation failures (numerology output, old place fixture, city minimum length and fallback copy). These were not changed by the login task.
- Activation remains gated on private Gupshup credentials, approved WhatsApp authentication/DLT SMS templates and a controlled live OTP test. Frontend release/push awaits fresh explicit permission.

Official references: [WhatsApp authentication](https://docs.gupshup.io/reference/sending-authentication-template), [SMS sending](https://docs.gupshup.io/docs/send-message-to-single-number), [POST examples](https://docs.gupshup.io/docs/sample-code).
