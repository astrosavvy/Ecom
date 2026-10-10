# Navratri product update — 2026-10-10

## Photography
- Four built-in imagegen background edits accepted after comparison with the photographs in `F:/Savvy_Ecom/9inone`.
- Main photo retried for a quieter background; final edits preserve the visible logo, Hindi artwork, compartment divisions, packets, bangle colours, containers and devotional offerings.
- Edited exports and original fallbacks checked against their manifest dimensions. No output is upscaled; closed-box output remains 1086px wide.
- Ten gallery selections verified: four box views followed by the six existing daily-kit details.
- Local failure test temporarily hid both edited hero resolutions; the original open-box photograph loaded successfully. Both files were restored and no `.qa-hidden` files remain.
- Styling-prop captions state that background flowers and idols are not included.

## Page and ordering
- Product page checked at 360px, 430px, 1024px and 1920px: no horizontal overflow, readable content, and correct image selection.
- Mobile day selector retains three columns; thumbnail controls are at least 53px tall at 360px. Purchase bar is 73px tall, with 94px reserved beneath page content.
- Keyboard Enter selected Day 8 and displayed Maa Mahagauri, its exact contents and the mehendi cone.
- Saved-piece toggle verified and restored. Order now added one set to the existing bag, yielding two sets / ₹2,998. Quantity restored to one set / ₹1,499; checkout was not started.
- Shop tile loads the new main image with `object-fit: contain`, preserving the full box.
- Metadata includes the new product title, description, main image and all ten product photographs in schema. Existing route, SKU, price and ordering identity remain stable.

## Build and evidence
- Root `npm run build`: exit 0 after adding the Node JSON import attribute; 22 crawlable route shells and 12 admin shells synced to root `dist/`.
- Published policy snapshots retained by a successful public backend configuration fetch. No business or policy settings changed.
- Source whitespace checks passed. Existing Vite chunk-size warning remains.
- Screenshots: `.tmp/navratri-festive-desktop.png`, `.tmp/navratri-festive-mobile.png`, `.tmp/navratri-festive-description.png`.
- One final local commit; push and production frontend release await explicit permission. No backend/API changes or deployment required.
