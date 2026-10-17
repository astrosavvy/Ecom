# Storefront Specialist Agent

## Ownership
- **Directory**: [`younoya-web/`](file:///F:/Savvy_Ecom/younoya-web)
- **Key Files**:
  - `src/App.jsx` (router configuration)
  - `src/pages/Home.jsx` (homepage composition), `src/components/StoryFilm.jsx` (cinematic stage and scroll scrubber)
  - `src/components/Navbar.jsx`, `CartDrawer.jsx`, `SmoothScroll.jsx`
  - `src/styles/*.css` (design tokens, layout, typography)
  - `public/media/*` (hero video and intention stills)
  - `vite.config.js`, `package.json`, `index.html`

## Directives
1. Maintain the luxury Cartier/editorial feel with midnight obsidian canvas (`#050403`) and champagne gold typography.
2. Keep the first hero viewport sparse. Do not add promo banners or heavy grids.
3. Preserve Blob loading for video seeking in `StoryFilm.jsx`, mounted by `Home.jsx`.
4. Ensure `npm run build` exits with code 0 before concluding any turn.

## Shop Footer Navigation

- `components/shop/ShopFooter.jsx` groups order history, shipping, cancellations/refunds and contact under Here to help. Terms and Privacy use a separate legal row aligned with the brand/navigation content; avoid full-width uncontained policy rows or duplicate support links.
- `styles/ShopFooter.css` owns footer spacing and focus styles. Below 670px, Shop and Explore form two columns, followed by a full-width, two-column help section. Footer links keep 44px minimum touch targets.
- Shared `components/PolicyLinks.jsx` accepts optional `paths`, `includeOrders` and `className`; defaults retain all five policy destinations and order history for checkout, account pages and policy navigation.

## Navratri and checkout surfaces
- NavratriDetail is a dedicated light view with exact nine-day contents, six authentic individual-kit photos and mobile three-column day navigation. Never inherit brooch materials, consecration, reviews or personalisation claims. The preview enters the bag; backend approval/inventory/readiness gates actual payment.
- `/` defaults to ComingSoon; Shop remains `/shop`. Match SEO generator and public backend setting. Keep archived hero film unchanged.
- Checkout uses an ivory two-column desktop form/summary and mobile stack: saved address/edit, free shipping, official Razorpay SVG, promotion, totals, consent and action. Guest ordering has no OTP. PIN lookup goes through Younoya's backend with manual fallback.
- Shared GuideLogin remains a native account modal, now ivory/champagne. Preserve email OTP, exact state/action return handlers, focus restoration and keyboard-aware height. Do not add passwords or enable mobile delivery providers.

- Checkout City and State are always visible required inputs, silently filled by PIN lookup and bound to the checkout shipping address. Retain editing fallback and stale-request abort; do not restore Guest checkout copy, manual edit toggles or search/success messages. Explain unpublished policy/payment readiness beside disabled controls without bypassing backend launch checks.
- Homepage must resolve initial SiteConfig before displaying Coming Soon or Shop; keep root navigation hidden during loading. Keep current mode if a later refresh fails. Coming Soon remains live at /, collection at /shop through an explicit link. Do not add GST-inclusive price copy to storefront or search metadata; retain backend tax accounting.

## Diwali Kalash and prepaid checkout (2026-10-17)
- ShopHero re-exports ShopEditions: Kalash first and Navratri second, 8-second rotation, manual controls, drag/swipe and pause. Keep header clearance, whole-product framing and reduced-motion/focus/visibility suppression.
- KalashDetail uses data/kalash.js and kalashPhotos.json with five AI-styled assets and original-product fallbacks. INR 5,599 / SKU YN-DIWALI-KALASH-001. Do not fabricate eleven inclusions, quantities, yantra/muhurat fulfilment, materials or financial results. Public preview stays disabled until the backend confirms readiness.
- New checkout is Razorpay-only; no new COD selection or handling charge. Keep historical COD order displays accurate. A persisted yn_pending_cod key triggers owned read-only recovery, never automatic confirmation. Only a verified unattempted cart can return to prepaid preparation with fresh policy acceptance.
- Temporary storefront QA fixture lives in tests/fixtures/storefront-preview.cjs. It is localhost-only and mocks all commerce/provider calls; stop it after use. See docs/diwali-kalash-prepaid.md and the checkpoint for deployment approval status.