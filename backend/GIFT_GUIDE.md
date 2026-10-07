# Gift guide release notes

The guide works for guests. Account login is required only to save a recommendation, reopen it, or order. Saved records contain the method, derived guide, wording, product IDs, and a price snapshot; they do not store the birth date, time, or place. A signed guest snapshot expires after 24 hours.

## Services and configuration

- `JWT_SECRET` (or `GIFT_GUIDE_SIGNING_SECRET`): signs guest results for saving. Keep it stable across backend instances.
- `GEONAMES_USERNAME`: enables the worldwide place picker and historical IANA time-zone resolution. GeoNames is credited in the UI. The service limits outbound requests to 850 per hour and 9,000 per day, with cached search and place results.
- `OPENROUTER_API_KEY` and `OPENROUTER_MODEL`: enable the final explanation only. The rules always select the offers. An unavailable or invalid AI reply falls back to deterministic wording.
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET`: required for live payments and verified webhooks. No dummy payment keys or synthetic success are used.
- Frontend `VITE_API_BASE` and `VITE_PUBLISHABLE_KEY` must point to the same Medusa environment and its active storefront sales channel.

Checkout launch setup is now governed by [COMMERCE_LAUNCH.md](COMMERCE_LAUNCH.md). Complete owner-approved business/policy, pickup and measured parcel settings first; provision India free delivery through Launch Settings or `npx medusa exec ./src/scripts/configure-checkout.ts`. Preparation does not require provider credentials. Add private credentials and verify approved provider accounts last; checkout remains disabled until the full readiness gate and activation flag pass.

In `/admin/gift-guide`, import missing public brooches, set stock at an active location, and create private editions. The import is idempotent by handle and never overwrites an existing product. A private edition needs a title, SKU, image, INR price, intention and approval. A set uses one Medusa variant, its own backend price, and inventory links to its component pieces. It is hidden from the site's collection, search, related pieces and sitemap; its approved direct page is `noindex`. It is unlisted, not secret.

The public Medusa product-list response also filters recommendation-only offers. Checkout keeps a Razorpay receipt in the browser session until Medusa confirms the order; a retry reuses that receipt rather than opening a second charge. If cart recovery fails, the UI asks the customer to contact the atelier before paying again.

Use Razorpay **test** credentials and a non-production Medusa environment for end-to-end payment testing. Verify email OTP, guest result, save/reopen, current price, cart totals, shipping, promotion, payment success/failure/cancel/retry, and duplicate confirmation before configuring production keys. Do not run a real payment from a developer machine.
