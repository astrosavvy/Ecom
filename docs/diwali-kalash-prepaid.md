# Diwali Kalash and prepaid-only storefront

## Product

- Public preview: `/product/diwali-wealth-kalash`; SKU `YN-DIWALI-KALASH-001`; one Standard variant; displayed INR 5,599.
- Initial inventory authorized by owner: 50. `medusa exec ./src/scripts/prepare-kalash.js` upserts only the owned product. Its initial Medusa status is draft, so the preview cannot enter recommendations or checkout. The static public preview remains crawlable.
- Inventory initialization is serialized. Existing levels, including zero-stock or reduced-stock levels, are preserved. A missing previously initialized level fails closed. Reruns never replenish to 50 or change other products/tax preferences.
- HSN 7116 is owner-approved. Exact GST percentage, packed weight/dimensions and full contents/quantities remain unconfirmed. No GST percentage or parcel has been invented; no tax-inclusive storefront copy.
- Listing names only the supplied six item types. No claim of eleven verified items, included yantra, muhurat delivery, natural/certified stones, pure metal or guaranteed financial outcomes.
- Five responsive images plus original fallbacks; provenance/prompts in `creative/younoya-kalash/`.

## Purchase readiness

`GET /store/commerce/products/:handle/availability` returns public `purchasable`, `availableQuantity`, `price`, `currency`. `/store/navratri` remains a compatible alias. Kalash needs publication, managed inventory/no backorder, the correct variant/price, ritual release approval, an explicitly approved GST rate and packaging approval plus configured per-variant HSN/parcel. Checkout also verifies publication/release for every line item, including authenticated carts and mixed carts.

When packing/tax is confirmed, configure the exact product-specific tax rate and inclusive pricing while preserving other tax rules; record its reviewed parcel and per-variant HSN in Launch Settings, approve metadata, then publish the Medusa product. This is a later activation step. Other products remain orderable throughout.

## Prepaid-only cutover

- Only Razorpay can prepare new checkout. Explicit `payment_method: "cod"` returns 409; omitted method stays prepaid. Public config returns `codEnabled: false`, `codFee: 0` for older clients.
- COD confirmation may return an already-created owned order, but never creates sessions/orders. Completion refuses an uncompleted COD cart. Payment-session middleware still accepts only the approved Razorpay provider.
- `configure-checkout` disables existing COD shipping rules, stops recreating COD options, removes manual payment from new region checkout and republishes the existing approved business fields with policy version `2026-10-17-prepaid`. Earlier accepted policy snapshots are retained.
- Existing confirmed COD orders retain their payment status, 49 INR charge, amount due, historical emails and Shiprocket COD method. Their cancellation/support/fulfilment compatibility remains.
- The owned payment-status GET is read-only and shares the completion lock. A pending old COD key returns an existing order or allows restart only when no completion workflow or payment session exists. Uncertain attempts and storage outages stay blocked for reconciliation. The browser never automatically confirms COD.
- Safe abandoned carts preserve items/address, clear the old pending key, require new consent and are server-requoted with the free prepaid shipping option before Razorpay. Until requoted the UI uses the current bag estimate, not a stale fee-bearing total. Pending Razorpay sessions continue their existing recovery path.

## Release

Build locally, deploy compiled backend artifacts over the established SSH route, run non-destructive migrations, `configure-checkout` and `prepare-kalash`, restart PM2 and verify health/config/catalogue. Never build on the VPS or copy private env files. Back up compiled source/settings privately before replacement. Frontend release follows backend verification; GitHub push requires fresh user permission.

No real charge, refund, pickup or test order is part of verification. Packaging and GST activation remain pending owner information.

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
