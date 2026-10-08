# Navratri release and native INR amounts

## Current behavior

Coming Soon is restored at `/`; `/shop` retains the brooch collection and leads with the Navratri box. `/product/navratri-shringaar-box` is a public preview with six authentic daily-kit photos, all nine exact daily contents, one Standard edition, and ₹1,499 including the supplied 18% GST. Nine individually packed daily kits arrive in one outer box. No invented size, natural emerald, silver purity, certification, consecration or review claims.

Order now adds the preview set to the bag. Checkout is a light two-column desktop layout and a mobile stack with a collapsible delivery address, free shipping, official Razorpay SVG/payment row, summary and action. Ordering does not require OTP. Account save/reopen still uses email OTP in the light native modal. WhatsApp/SMS remain disabled.

## Guest checkout contract

`POST /store/commerce/guest-cart` accepts an India INR region and actual variant IDs/quantities. It requires overall launch readiness and published, approved products; Medusa validates inventory. PostgreSQL atomically limits new guest carts to 20/IP/hour and fails closed. A random 32-byte secret is returned once, kept in sessionStorage, and only its SHA-256 hash/expiry is stored privately in commerce_setting. It expires after seven days and is bound to a guest cart with no customer account.

Prepare, payment-session creation, completion and recovery require `x-younoya-checkout-token` or authenticated ownership. Existing customer-owned order endpoints remain authenticated. Guest checkout never creates a customer or merges accounts. Email is collected for transactional updates. Recovery cannot expose a completed order to someone who only knows its cart ID. Cart/address/bag survive failed or cancelled payment. Uncertain payment retains the pending session instead of charging again.

`GET /store/commerce/pincode?pincode=110001` validates six digits, calls the third-party Postal PIN Code India API on the backend with a five-second timeout, validates matching India results, prefers delivery offices and caches up to 2,000 entries for 24 hours. It is not a government API. Ambiguous or unavailable results retain the entered address and offer manual city/state entry. Browser calls only Younoya's endpoint. PIN changes abort stale requests and clear the old location.

## Money convention and migration

Medusa 2 amounts use major currency units. Catalogue, admin editing, checkout, customer/admin order views, emails and Shiprocket use rupees. Razorpay uses `toPaise` at explicit provider boundaries: 1499 -> 149900. Decimal rounding is half-up and validates bounds. Unit markers are `inr-major-v2` and reviewed legacy `inr-paise-v1`; unknown financial records fail closed. Historical records are never rescaled by the catalogue migration.

1. Keep COMMERCE_LIVE_ENABLED=false. Back up PostgreSQL and affected code. Inventory catalogue/cart/payment/order/operation rows.
2. Run compiled Medusa `exec src/scripts/migrate-inr-money.js` for dry-run. Only known unedited legacy brooch prices with documented provenance can convert. Custom/edited prices and unclassified fiscal records stop the operation.
3. Set MONEY_MIGRATION_MODE=apply and execute the same script. A PostgreSQL transaction/advisory lock snapshots prices/raw amounts/product metadata/cart metadata/launch settings, converts identified prices once, marks unpaid carts for requote and restores Coming Soon. Repeat is a no-op.
4. Run compiled `exec src/scripts/prepare-navratri.js`. It upserts one draft product without assigning stock, ensures India INR/system-provider configuration, preserves existing brooch tax basis through regional prices, enables tax-inclusive INR base pricing for the box, and creates a product-specific 18% rate. A repeat preserves product/variant identity and six images.
5. Run `scripts/verify-navratri.cjs` via Medusa exec from the compiled runtime. It reads catalogue/pricing/tax data and uses Medusa totals utilities without creating carts, orders, messages or provider transactions.

The price/tax journal is private. MONEY_MIGRATION_MODE=rollback restores exact original catalogue/cart metadata only before new fiscal activity or edits and before tax preparation. After tax preparation, restore the reviewed regional prices/preferences/tax state first; the tool deliberately blocks a blind rollback. Full PostgreSQL/code backups provide paired disaster recovery. Never roll back code alone after changing amount units.

## Activation requirements still outstanding

- Actual count of complete boxes and inventory location. No stock was invented.
- Owner supplied **under 500g** and **14L x14W x5H**, but units and an exact protected packed weight remain unconfirmed. Do not enter assumed centimetres or shipping weights. Confirm outer-box dimensions and measured protected shipping parcel.
- Verified HSN/GST/invoice classification and applicable manufacturer/packer labels.
- Public business address, support phone, grievance contacts, damage-report window, refund initiation timeframe and owner-approved policies.
- Actual pickup location/pincode, compatible shipping profiles/parcels, Razorpay approval/capture/webhook and Shiprocket preparation.
- Add private backend credentials last; controlled provider verification and owner release approval (`navratri_release_approved=true`), published status and real stock are required before checkout activation.

No real charge/refund/pickup/OTP was sent in development. Preview availability schema is omitted until the backend verifies sale availability. Private credentials stay backend-only. GitHub push needs fresh explicit permission.

## Verification

Backend unit suites, isolated PostgreSQL migration/rollback/concurrency/guest-token tests, native Medusa inclusive/discounted/mixed product tax totals and four responsive storefront widths are recorded in `.agents/CHECKPOINT.md`. Physical mobile keyboard, real saved autofill and live provider tests remain activation checks; reduced motion/autofill declarations were source-reviewed. Temporary browser fixtures are removed before commit.
