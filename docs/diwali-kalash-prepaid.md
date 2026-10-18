# Diwali Kalash and prepaid-only storefront

## Product

- Public preview: `/product/diwali-wealth-kalash`; SKU `YN-DIWALI-KALASH-001`; one Standard variant; displayed INR 5,599.
- Initial inventory authorized by owner: 50. `medusa exec ./src/scripts/prepare-kalash.js` upserts only the owned product. Its initial Medusa status is draft, so the preview cannot enter recommendations or checkout. The static public preview remains crawlable.
- Inventory initialization is serialized. Existing levels, including zero-stock or reduced-stock levels, are preserved. A missing previously initialized level fails closed. Reruns never replenish to 50 or change other products/tax preferences.
- HSN 7116 is owner-approved. On 18 October the owner confirmed 0% GST and a final 2.5 kg parcel measuring 14 × 14 × 5 inches (35.56 × 35.56 × 12.7 cm). These are product-specific values; no tax-inclusive storefront copy.
- Listing names only the supplied six item types. No claim of eleven verified items, included yantra, muhurat delivery, natural/certified stones, pure metal or guaranteed financial outcomes.
- Six responsive images plus original fallbacks; provenance/prompts in `creative/younoya-kalash/`. The sixth shows the confirmed included box, labelled red potli and printed puja-guidance envelope; its realism revision uses natural daylight and restrained materials/colour.

## Purchase readiness

`GET /store/commerce/products/:handle/availability` returns public `purchasable`, `availableQuantity`, `price`, `currency`. `/store/navratri` remains a compatible alias. Kalash needs publication, managed inventory/no backorder, the correct variant/price, ritual release approval, an explicitly approved GST rate and packaging approval plus configured per-variant HSN/parcel. Checkout also verifies publication/release for every line item, including authenticated carts and mixed carts.

The explicit owner-approved `release-kalash` script now configures the product-only zero rate and single-set parcel before enabling the release flags and publishing. It verifies price, sales-channel/stock readiness and an actual zero tax calculation. Other products remain orderable throughout; normal imports still preserve status/approval and never replenish inventory.

## Prepaid-only cutover

- Only Razorpay can prepare new checkout. Explicit `payment_method: "cod"` returns 409; omitted method stays prepaid. Public config returns `codEnabled: false`, `codFee: 0` for older clients.
- COD confirmation may return an already-created owned order, but never creates sessions/orders. Completion refuses an uncompleted COD cart. Payment-session middleware still accepts only the approved Razorpay provider.
- `configure-checkout` disables existing COD shipping rules, stops recreating COD options, removes manual payment from new region checkout and republishes the existing approved business fields with policy version `2026-10-17-prepaid`. Earlier accepted policy snapshots are retained.
- Existing confirmed COD orders retain their payment status, 49 INR charge, amount due, historical emails and Shiprocket COD method. Their cancellation/support/fulfilment compatibility remains.
- The owned payment-status GET is read-only and shares the completion lock. A pending old COD key returns an existing order or allows restart only when no completion workflow or payment session exists. Uncertain attempts and storage outages stay blocked for reconciliation. The browser never automatically confirms COD.
- Safe abandoned carts preserve items/address, clear the old pending key, require new consent and are server-requoted with the free prepaid shipping option before Razorpay. Until requoted the UI uses the current bag estimate, not a stale fee-bearing total. Pending Razorpay sessions continue their existing recovery path.

## Release

Build locally, deploy compiled backend artifacts over the established SSH route, run non-destructive migrations, `configure-checkout` and `prepare-kalash`, restart PM2 and verify health/config/catalogue. Never build on the VPS or copy private env files. Back up compiled source/settings privately before replacement. Frontend release follows backend verification; GitHub push requires fresh user permission.

No real charge, refund, pickup or test order is part of verification. Packaging and GST activation were completed with owner confirmation on 18 October 2026.

## Verification

Implementation verification and deployment results are recorded in the project checkpoint. Browser checks use the temporary localhost fixture at `younoya-web/tests/fixtures/storefront-preview.cjs`, which rewrites provider URLs in served responses only and never forwards API calls. `/qa/fresh`, `/qa/legacy-safe`, `/qa/legacy-uncertain` and `/qa/legacy-completed` initialize isolated synthetic cases; `/qa/requests` reports method/path counts without contact data. Stop the fixture after QA; it must never be used for real orders.

Unit fixtures exercise COD rejection/recovery, unchanged historical payloads, catalogue initialization/repeat imports, tax/packaging gating and existing payment/ownership/money behaviour. Frontend SEO, Pixel and delivery suites remain required after final build. A browser click on policy consent/Pay is subject to separate automatic approval review even with mocked providers; do not represent that interaction as verified unless approval and execution actually occur.

## Approved rollout completed — 17 October 2026

The owner explicitly approved the production rollout and local mocked payment test. Backend artifacts were built locally, transferred through SSH/SCP and deployed to the established Medusa server. Non-destructive migrations passed and PM2 is online; the VPS did not run a build. Private rollback snapshots remain on the server.

Live configuration reports `checkoutEnabled: true`, `codEnabled: false`, `codFee: 0`, policy revision `fa33c3367b417aeb` and no configured COD shipping option. Its old visibility rule is false; two earlier policy revisions remain stored. Navratri remains purchasable.

The Kalash is a draft with one Standard variant, managed stock/no backorder, HSN 7116 and a stored major-INR price of 5599. Inventory is 50 with zero reserved. Repeat import preserved this level and persisted `kalash_stock_initialized: true`. GST rate, packaging and purchase approvals remain unset, so public availability correctly reports not purchasable.

Rollout verification corrected two Medusa API assumptions: shipping-rule updates require attribute/operator/value together, and product module updates require separate ID/data arguments. Regression tests validate the rule payload with Medusa's actual validator and enforce the product update signature.

The approved localhost test accepted test-only terms, cancelled payment through the stub and retried the same session. Bag/address remained; counters show one preparation, one payment session and zero confirmation/completion/COD calls. The recovery action now reads **Resume secure payment** when no receipt exists. The fixture was stopped and its tab closed.

Final frontend/backend builds pass. The verification total is 56 backend tests across 12 relevant suites and 18 frontend SEO/Pixel/delivery tests. Both generated distributions match; the final browser/Worker scan found no private environment values. The frontend build contains all 23 public indexable route shells. No real charge, refund, pickup or customer order was created. GitHub push/frontend release still requires fresh explicit permission.

## Boxed-set release — 18 October 2026

Owner confirmation supplied 0% GST, 2.5 kg final gross weight, a 14 × 14 × 5-inch final courier parcel and the included galaxy-print box, labelled red potli and printed puja-guidance envelope. The sixth image was generated, then refined at the owner's request for natural daylight, believable materials and restrained colour. Both generated originals and source hashes are recorded in the photography provenance.

`release-kalash` is separate from the safe catalogue import. It sets product-only non-combinable zero rates for existing India tax regions and verifies the actual calculated rate before publishing; it never changes default tax rates or global pricing preferences. It atomically adds only this variant's HSN/packed weight and a dedicated single-set parcel to Launch Settings. Gross weight is 2.5 kg, added tare is zero, dimensions are 35.56 × 35.56 × 12.7 cm, and maximum units is one. Existing suitable parcel rules continue to govern larger/mixed selections; absent approved packaging blocks payment while retaining the bag.

The approved SSH rollout completed with private rollback backup `/tmp/younoya-kalash-boxed-release-1792345570944`. Backend was built locally; non-destructive migrations and PM2 restart passed. The live product is published, price remains 5599 INR, stock is 50 with zero reserved, its owner-approved tax/packaging/release flags are true and the public availability endpoint returns purchasable true. The public website's Order now button was observed enabled. Navratri remains purchasable; public configuration remains Razorpay-only with COD disabled, zero COD fee and unchanged policy revision `fa33c3367b417aeb`.

Verification covers six gallery selections, keyboard selection, authentic-image fallback, unavailable-state protection, guest bag/checkout at 5599 INR without OTP, and mobile/desktop layouts at 360/430/1024/1920px. Backend tests cover zero tax over defaults, price-to-paise conversion (559900), Shiprocket payload (Prepaid, rupees and approved measurements), reservation/stock preservation, depleted stock, repeat release/import and unsupported parcel combinations. No real order or provider transaction was made. Frontend image/copy deployment remains pending fresh GitHub push permission.
