# Prepaid delivery advisory and Cash on Delivery

Implemented 10 October 2026. The user's follow-up replaces the planned product PIN checker with delivery information in the product details. Checkout retains its address PIN lookup and editable city/state fields. No product PIN checker or saved product PIN remains.

## Storefront

- Navratri's Delivery detail and the shared brooch purchase summary explain free India shipping and prepaid Delhi NCR same-day delivery for orders placed by 6 PM, subject to courier confirmation. COD takes an estimated 3–5 working days after dispatch. Festival, weather and unforeseen delays may affect delivery.
- Checkout defaults to Razorpay. Cash on Delivery immediately follows it as a native radio option. Its ₹49 handling fee appears once in the summary and total; a ₹1,499 selection totals ₹1,548. Payment failure preserves the selection and entered address.
- The checkout postal lookup updates city/state without a separate checker or searching message. Manual edits survive periodic refreshes and payment preparation. Changing the PIN clears the previous delivery eligibility.
- The backend uses validated postal state/district to identify Delhi, Gurugram/Gurgaon, Faridabad, Ghaziabad and Gautam Buddha/Budh Nagar. At 18:00 Asia/Kolkata the prepaid same-day advisory changes to the standard estimate. COD never gets that advisory.
- Pending online payments lock method/address changes. Uncertain COD confirmation persists its cart reference and retries the same order; do not start another order to recover it. Confirmation shows the total due on delivery rather than a paid state.

## Backend contracts

- `POST /store/commerce/prepare`: existing ownership and policy-revision requirements, plus optional `payment_method: "razorpay" | "cod"`. Omitted values preserve prepaid. The returned cart, fee, method and delivery information are authoritative.
- Preparation attaches the configured shipping option server-side. The COD option is calculated at ₹49, tax inclusive, once per order. Shipping promotions cannot discount the handling fee. Signed approval binds method, fee, address and total. Existing Razorpay sessions must be resolved first.
- `POST /store/commerce/cod`: confirms an owned, approved cart through Medusa's `pp_system` provider. No Razorpay or OTP. PostgreSQL advisory locking and a stable completion transaction preserve duplicate/restart recovery. Completed carts return their existing order.
- COD is unpaid; customer/admin presentation and emails say payment due on delivery. Uncollected cancellation uses the existing approval workflow without an online refund. Collected COD refunds require support; this change introduces no collection/refund administration.
- Existing durable shipping submission receives `COD` or `Prepaid`. COD merchandise subtotal plus ₹49 equals the exact collectible total; merchant shipping remains free to customers. Existing AWB, pickup, tracking and staff controls remain intact. Failed or uncertain shipping submissions stay visible for resolution and are not blindly duplicated.
- Invalid provider serviceability responses no longer invent a fallback courier. Explicit Shiprocket credentials stay server-side. A guest token cannot bypass ownership of a customer-bound cart.

## Verification

- Backend: 9 relevant suites, 47 tests, covering coverage/cutoff, fixed fees, signed totals, fractional discounted line amounts and quantities, provider failure, manual-session reuse, completed-order recovery, ownership, approval expiry, stock/workflow failure, payment lifecycle, money units and checkout guards.
- Frontend: 5 Node tests for fee switching, COD/prepaid notices and existing Navratri Pixel behavior. Frontend and backend builds exit 0. Vite's existing bundle-size advisory remains.
- Isolated localhost mock checkout: carried the test PIN from the earlier checker before it was removed; city/state filled correctly. Switched prepaid ₹1,499 ↔ COD ₹1,548, verified advisory replacement, native keyboard radio navigation and completed a mock COD order without opening Razorpay or OTP. No real charge, refund, order or pickup was created by testing.
- Product and checkout checked at 360, 430, 1024 and 1920px without horizontal overflow. Latest product check confirms no postal input; delivery text appears in the requested details section. Shared brooch markup uses the same note. Physical-device keyboard and real provider order acceptance remain rollout checks.
- Screenshots: `.tmp/product-delivery-note-mobile.png`, `.tmp/cod-checkout-mobile.png` (local ignored evidence).
- Built storefront assets scanned against private environment values and provider URLs; no matching private values or direct Shiprocket calls.

## Deployment and rollback

Locally built `.medusa/server/src` artifacts were transferred over SSH to `ubuntu@140.245.7.165`, deployed under `/home/ubuntu/younoya/backend`, migrations completed, and the COD option/manual provider provisioned. Approved settings were republished with policy document version `2026-10-10-cod`. PM2 `younoya-backend` restarted and passed health verification. No VPS build and no GitHub deployment was used.

Read-only production verification found exactly one calculated `india-cod` option. Public configuration returns checkout/COD enabled, COD fee 49, free shipping and policy revision `0b7fd2bea0a02a8e`. Postal lookup for 110001 returns New Delhi/Delhi with the correct advisory; deployed cutoff checks pass before/at 6 PM and for COD.

Rollback backup: `/tmp/younoya-cod-rollback-20261010/compiled-src.tar.gz` plus private `settings.json`. Restore the compiled source and launch settings row, then restart the same PM2 service. No new data model/migration was introduced; the new COD option may remain unused after restoring settings. Deployment used the running service's environment because shell `.env` database settings differ; do not overwrite production credentials with the shell file.

Frontend release remains pending fresh user authorization to push. Keep existing backend private keys, pickup, parcel and policy configuration. No courier-selection screens or new same-day provider were added.

References: [Medusa manual payment provider](https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider), [Shiprocket API](https://apidocs.shiprocket.in/).
