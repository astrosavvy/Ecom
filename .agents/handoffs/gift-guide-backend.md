# Younoya gift guide — backend completion and release handoff

Updated: 2026-09-30. Implementation baseline: `72f4d3d` (`feat(gift-guide): build orderable guided recommendations`).

## Start here

Read `AGENTS.md`, `.agents/CHECKPOINT.md`, `.agents/memory/commerce_api.md`, and `backend/GIFT_GUIDE.md` before editing. This handoff records implemented code and remaining work; it is not evidence that production integrations work.

The user requested this file for a backend agent to complete the remaining work and explicitly authorized pushing the current implementation and this handoff to `origin`. A later backend task must follow the project's checkpoint and single-final-commit rules and obtain permission for its own push when required.

## Approved outcome and constraints

- Anyone can complete the guide and view a recommendation. Login is required only to save, reopen a saved result, or order.
- Guide sequence: self/someone else; relationship/name where relevant; occasion/life moment; intention; optional birth details.
- Complete date/time/resolved place uses Moon sign and current Antardasha. Date-only or incomplete details uses numerology. No date uses intention. Age 32 belongs to the Destiny-number path.
- Apply the supplied Mercury/Ketu matrices where available. Label other-period guidance as broader guidance. AI writes only the final explanation; rules select products.
- No budget input, filter, or price-based sorting.
- Recommendation-only offers are unlisted, not secret. Hide them from collection, public search, related lists and sitemap. Direct recommendation links may display approved offers.
- Bundles are one independently priced Medusa variant with inventory links to component items. Checkout uses the backend variant and backend totals.
- Saved records keep derived method, explanation and product references; do not retain raw birth date, time or place by default.
- India-only INR checkout, OTP customer login and real Razorpay verification. No synthetic payment success or client-calculated promotions.
- Keep the storefront light and conversational. Aster has no voice. The current guide uses the established lady portrait assets with restrained motion and a static reduced-motion view; it requires no WebGL.
- Medusa admin remains disabled on the VPS. Admin UI is the edge SPA. Build backend artifacts outside the 956MB VPS and deploy the runtime; preserve uploaded media.

## What is implemented

### Frontend

- Latest visual update: single light conversation canvas with one optimized 3D-style lady portrait, magnetic reply pills, bottom reply dock, full scrollable history (including results), rounded birth composer and compact product cards. The guide-only header is 72px. Saved recommendations is hidden for guests and shown only after customer verification. API answer values and login gates remain unchanged. Do not restore the removed orb, rejected procedural avatar or dark theme.

- `younoya-web/src/pages/GiftFinder.jsx`: guest conversation, session result, authenticated save/reopen/order actions, login return to the current result, clearly labelled intention preview when the live API is unavailable. Raw birth details are cleared after reveal.
- `younoya-web/src/components/gift-guide/`: animated conversation/reply controls, 120-year calendar, debounced place search, result cards, email OTP login, light guide stage.
- `AsterStage.jsx`: procedural Aster3D.jsx and Three.js were removed after the user rejected the distorted model. Current artwork is public/media/aster-3d-guide.webp, generated from the established lady and optimized to 61KB with alpha. Pointer response is restrained; reduced motion is static. This is 3D-style rendered artwork, not a rigged model or a video. The silent loop prompt is creative/younoya-scroll-film/aster-loop-omni-flash.md; no clip has been generated. Any replacement must preserve identity, full face/hands, light theme and reduced-motion fallback.
- `younoya-web/src/lib/giftGuideApi.js`: Medusa requests, customer token, email OTP request/verify, customer registration/refresh.
- `younoya-web/src/lib/checkout.js` and `pages/Checkout.jsx`: customer checkout, India region, current variant lookup, Medusa cart/address/shipping/promotion/totals, Razorpay window, server confirmation and cart completion. A received gateway receipt is retained in the browser session so a confirmation retry can reuse it; pending-cart ownership is checked before reopening.
- `pages/PrivateOffer.jsx`: direct unlisted offer page. `/offer/:handle` and `/checkout` have `noindex` metadata.
- `components/CartDrawer.jsx`: routes to real checkout, removes client-only promotion calculation, clears stale guide offer on bag checkout, shows delivery calculated at checkout.
- `src/admin/pages/OfferManager.tsx` plus `pages/gift-guide/`: `/admin/gift-guide` catalog import, private offer/bundle editing, imagery and inventory controls.
- Static storefront `PRODUCTS` remains the public catalog. Private offers are not added to public listing/search/related-product data or generated sitemap.

### Backend routes

| Route | Access | Implemented purpose |
| --- | --- | --- |
| `GET /store/gift-guide/places?q=…` | Guest | GeoNames city suggestions, throttled by IP |
| `POST /store/gift-guide/recommend` | Guest | Validated answers, rules-selected offers, explanation, signed result |
| `GET /store/gift-guide/saved` | Customer | Customer's saved results |
| `POST /store/gift-guide/saved` | Customer | Verify guest snapshot and save result/references |
| `GET /store/gift-guide/saved/:id` | Customer | Owner-only reopen with current offers/prices/availability |
| `GET /store/gift-guide/offers/:handle` | Guest | Direct unlisted offer lookup |
| `GET /store/gift-guide/checkout-config` | Guest | Public Razorpay key ID |
| `GET /store/gift-guide/payment-confirm?cartId=…` | Customer | Cart ownership/completion status for recovery |
| `POST /store/gift-guide/payment-confirm` | Customer | Signature, actual gateway payment, cart/session/order/amount validation |
| `GET/POST /admin/gift-guide/offers` | Admin | List/create private editions and kit variants |
| `PUT /admin/gift-guide/offers/:id` | Admin | Update private edition, price, approval and inventory links |
| `POST /admin/gift-guide/catalog` | Admin | Idempotent import of missing public brooches |

Normal Medusa cart, customer, inventory, promotion, shipping and payment-collection routes handle the rest. `backend/src/api/middlewares.ts` registers authentication and filters recommendation-only products from the public product-list response.

### Backend rules and payment code

- `backend/src/modules/younoya-astro/gift-guide.ts`: validated answer shape, three paths, age boundary, matrix keys, approved/in-stock ranking, deterministic wording and optional OpenRouter narration.
- `data/matrix.json`: 96 Mercury/Ketu entries (12 signs × 2 periods × 4 intentions). `scripts/generate-gift-matrix.py` generates it from the supplied root Markdown documents. The generated data contains set titles; approved offer composition must be entered/verified in admin.
- `data/brooches.json`: public brooch import data; current public brooches are the intended fallback while private offers are not ready.
- `gift-guide-token.ts`: HMAC-signed guest result with a 24-hour lifetime and no raw birth fields.
- `offers.ts`: INR price and inventory checks for current variants/sales channel, response offer shape.
- `utils/geonames.ts`: city/place/time-zone lookup, request cache and per-process service quota (850/hour, 9,000/day).
- `utils/chart.ts`: IANA time-zone conversion for the birth date; `utils/dasha.ts`: corrected Antardasha duration divisor and initial-period timeline.
- Existing `/store/astro/profiles` no longer silently assigns Delhi when a place is unresolved.
- `backend/src/modules/younoya-razorpay/service.ts`: real gateway order creation, signed/fetched authorization, capture/refund, signed webhook processing. Dummy credentials and synthetic success were removed from provider setup.
- OTP request fails closed for storage/delivery/unconfigured service failures. OTP ticket creation/verification requires an explicit `JWT_SECRET`.
- `backend/src/scripts/configure-checkout.ts`: links only `pp_razorpay_razorpay` to the existing India/INR region when credentials exist. It has not been run against a database.

## Known review items — resolve before enabling real checkout

These are targeted backend follow-ups identified from the current source. Compilation and mocked tests do not validate these behaviors.

1. **Money units:** verify the installed Medusa 2.18 price/cart/payment amount convention against the real database and official documentation. Current import/edit code multiplies INR input by 100; offer and checkout displays divide by 100; the Razorpay provider currently forwards the session amount directly. Establish one Medusa money convention and convert explicitly at the Razorpay paise boundary. Validate a known ₹2,499 item, shipping, discounts, tax, capture, refund and webhook amounts. Do this before importing prices or initiating payments.
2. **Editing a single private item:** `api/admin/gift-guide/offers/[id]/route.ts` builds an empty kit for an offer with no components, then dismisses previous inventory links. Preserve the item's own inventory link when editing a single-piece offer. Validate transitions between single items and kits or prohibit unsupported transitions.
3. **Public listing pagination:** `hideRecommendationOffers` currently filters after retrieval, reads only the first 1,000 product IDs and subtracts the global hidden count from each filtered query's count. Replace this with query-level visibility filtering or accurate filtered pagination/counting. Test search, handle, category, page boundaries and more than 1,000 products. Preserve direct unlisted links and checkout eligibility.
4. **Approval changes:** `liveProduct` checks publication, price and stock but does not itself enforce `gift_guide_approved`. Ensure revoked/unapproved private offers cannot reappear through saved results or direct offer lookup/order, while retaining the approved public fallback policy.
5. **Payment concurrency/recovery:** confirmation currently uses a read-then-write idempotency check. Test simultaneous duplicate confirmations, webhook-first arrival, gateway success followed by a network timeout, completion retry after page reload, and a cart already completed by a callback. Use workflow/locking/idempotency mechanisms where needed. Return/recover the existing order instead of leaving a completed-cart customer stuck.
6. **Webhook lifecycle:** verify the configured webhook URL/provider ID and Medusa's expected webhook amounts/actions. Confirm that a webhook can complete the authorization lifecycle with the provider's required payment ID/signature data; the current action response supplies session ID and amount only. Test duplicate, invalid-signature, failed, authorized and captured events.
7. **Historical time zones:** test known historical offsets, half/quarter-hour zones, DST skipped and repeated local times. Ask the visitor to correct unresolved/ambiguous local times. The place-search response currently returns city/coordinates; the timezone ID is resolved later via `resolvePlace`, so align the public response with the approved interface if callers require it in every suggestion.
8. **Catalog/inventory correctness:** validate Medusa graph field shapes, inventory link create/update/dismiss workflows, kit quantity aggregation and sales-channel/location availability with a real database. Stock controls must not edit component inventory accidentally or create unsellable variants. Check bundle component quantities on result and order displays.
9. **Rule coverage:** verify all 96 generated titles against supplied Mercury/Ketu compositions. Verify known Moon/dasha charts and numerology examples. Numerology values are currently computed and explained, while product selection primarily follows intention; implement any additional approved numerology-to-offer rules from the supplied process. Do not invent missing Antardasha matrices or effects.
10. **Operational safeguards:** anonymous recommendations need abuse/rate controls when enabling paid AI. GeoNames quotas/cache are in memory per process, so coordinate limits for multiple backend instances. Verify model JSON-schema support and wording/fact constraints. Recheck publication/approval/stock/price at save, reopen and order; a signed token does not reserve stock.
11. **Authentication hardening:** verify existing OTP attempt/rate limits, ticket replay/expiry, customer creation/refresh and expired-token return to the result. Existing Medusa config and unrelated legacy admin helpers still contain fallback secrets; remove unsafe runtime defaults through an appropriate migration/configuration process before production. Never commit credentials.
12. **Backend packaging:** root `.gitignore` ignores `backend/`; this feature's routes/modules are force-tracked, but many existing backend manifests/modules remain ignored and are present only in the local workspace/VPS. Compare the complete runtime with Git before deploying. Make the release reproducible without committing `.env`, database files, node_modules, uploads or build caches. Do not overwrite the existing backend with an incomplete checkout.

## Configuration needed

| Variable/setup | Purpose |
| --- | --- |
| `JWT_SECRET`, `COOKIE_SECRET` | Medusa/customer auth; stable private secrets |
| `GIFT_GUIDE_SIGNING_SECRET` | Optional separate guest-snapshot secret; otherwise uses `JWT_SECRET` |
| `GEONAMES_USERNAME` | Worldwide city/time-zone service; enable the account's web services |
| `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` | Optional final narration; deterministic fallback must remain usable |
| `SMTP_HOST`, port/security/auth/from settings | Deliver real email OTP; test delivery rather than just checking configuration |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Start with test credentials in a non-production backend |
| `RAZORPAY_WEBHOOK_SECRET` | Signature verification for the configured webhook |
| `DATABASE_URL`, Redis/runtime service configuration | Real Medusa persistence and concurrency behavior |
| `VITE_API_BASE`, `VITE_PUBLISHABLE_KEY` | Match frontend to the same backend/storefront sales channel |
| Store/auth/admin CORS | Allow the actual storefront and development origin used for testing |

No secret values are in this handoff. At the last implementation check, local GeoNames/OpenRouter/Razorpay configuration was absent; port 9000 was unavailable. Recheck the target environment rather than assuming these observations describe production.

## Completion sequence for the backend agent

1. Inventory the current backend/runtime, read the rules, and establish a non-production database/service environment. Preserve uploaded media and back up relevant data before migration/deployment work.
2. Resolve the review items above, starting with money units, inventory links, visibility/approval and payment lifecycle. Add meaningful integration tests using the installed Medusa APIs/workflows.
3. Verify required migrations for OTP, toolkits and astro modules against the target DB. Run only necessary non-destructive migrations. Keep the VPS admin build disabled.
4. Configure GeoNames and SMTP; prove guest viewing plus OTP return-to-result. Enable OpenRouter only after deterministic behavior works and invalid/timeout responses are verified.
5. Import missing public brooches via `/admin/gift-guide`; inspect existing handles instead of overwriting them. Set actual stock at a location linked to the storefront sales channel. Enter approved private single items and dedicated bundle SKUs with backend prices and verified composition/imagery.
6. Create/verify India INR region, India delivery service zone, stock location, fulfillment/shipping options and channel/location links. Run `npx medusa exec ./src/scripts/configure-checkout.ts` with test credentials after the money convention is fixed.
7. Run the end-to-end acceptance checklist below. Keep real production payments disabled until all payment/inventory/totals cases pass.
8. Build backend outside the VPS, deploy the complete headless runtime through the existing deployment process, and verify `api.younoya.com` routes/CORS/webhooks. Frontend Git/Cloudflare publication alone does not deploy these APIs.
9. Update `.agents/CHECKPOINT.md` with exact completed checks and remaining blockers, make one final semantic commit for the backend task, and follow the applicable permission rules for release/push.

## Acceptance checklist

- Guest intention, partial birth/numerology and complete chart paths return labelled explanations and eligible offers.
- Age 31/32 boundary, all Mercury/Ketu keys, other-period fallback, known chart calculations and invalid birth dates are correct.
- Ambiguous cities remain distinguishable; unresolved city/timezone cannot silently become Delhi; historical/DST cases are tested.
- AI absent, timeout, invalid JSON and disallowed claims keep a deterministic truthful explanation; AI cannot choose arbitrary products.
- Unapproved, unpublished, unpriced and unavailable items/kits cannot be recommended or ordered.
- Private offers are absent from collection/search/related lists/sitemap with correct pagination; direct approved links are usable and noindex.
- Guest viewing needs no login. Save/reopen/order require OTP; another customer cannot access a saved result/cart. Login preserves the selected result.
- Saved storage and logs do not retain raw birth date/time/place by default. Reopen reflects changed price, approval and stock.
- Kit SKU has independent backend price; stock decreases/reserves by component quantity; out-of-stock components reject checkout.
- Backend promotions, shipping and tax produce the exact total shown in Razorpay. India-only address and INR are enforced.
- Razorpay test success/failure/cancel/retry, bad signature, wrong amount/order/cart/customer, webhook duplicates and concurrent callbacks are covered.
- Paid-but-unconfirmed or already-completed carts recover an existing order without a second charge.
- Mobile/desktop and keyboard behavior are checked; reduced motion keeps the lady static. Aster no longer depends on WebGL. Preserve the approved character artwork while completing backend readiness.

## Verification already performed

- Root `npm run build`: passed, generated 16 crawlable route shells and 11 admin shells, synced `dist/`.
- Backend `npx tsc --noEmit --pretty false`: passed.
- Backend `npm run build`: passed with admin disabled. On this Windows workspace it needed `XDG_CONFIG_HOME` redirected to a temporary workspace directory; that directory was removed afterward.
- Focused Jest: 11 tests passed across `gift-guide.unit.spec.ts` and `checkout.unit.spec.ts`. Tests cover rules/age/matrix/timezone/fallback/signing, public-list filtering and mocked payment verification/idempotency. They are not database or real-gateway tests.
- `npx wrangler deploy --dry-run`: passed for 178 assets. No production deployment or payment was performed during implementation.
- Backend lint unavailable: the project's `medusa lint` reported that `eslint` is not installed.
- Original implementation browser verification was unavailable. The subsequent avatar correction was visually checked in the in-app browser at desktop, 430px and 360px widths, including progression to the next question. The full face remains visible below the header and all portrait assets load without a canvas.
- Existing main frontend chunk warning remains. The approximately 927KB Three.js avatar chunk has been removed by the correction.

## Source references

- Approved user source: root `younoya recommendation engine.md` and `YOUNOYA_Mercury_Antardasha_x_Zodiacs_Revised (1).md`.
- Setup notes: `backend/GIFT_GUIDE.md`.
- Shared state: `.agents/CHECKPOINT.md`.
- Official references supplied in the approved plan: <https://www.geonames.org/export/>, <https://www.geonames.org/export/web-services.html>, <https://docs.medusajs.com/user-guide/products/create/bundle>.
