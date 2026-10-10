# Mobile UX audit results

Date: 10 October 2026. Plan: [mobile-ux-audit-plan.md](mobile-ux-audit-plan.md).

## Completed changes

| Area | Finding and resolution |
| --- | --- |
| Shop Navratri hero | `ShopHero.jsx` had its own hard-coded red daily-kit image, despite the tile and gallery already using the approved complete-box photo. It now reads `NAVRATRI_PRODUCT.gallery[0]`, including responsive sources, dimensions and original-photo fallback. Contain framing retains the product edges; the mobile price card sits below the image. |
| Shared page rhythm | Reconciled legacy overrides through `MobileLayout.css`, imported after page styles. Public mobile layouts now use a 20px gutter with safe-area accommodation and a 72px header. Page clearance and footer edges align. |
| Product pages | Removed intrinsic grid overflow with shrinkable tracks/children. Breadcrumbs, thumbnails, actions and related headings wrap. Narrow product tabs stack. Purchase bars reserve content space and account for the bottom safe area. |
| Touch controls | Header, gallery, quantity, cart, catalogue, personalization, calendar navigation and footer form controls are at least 44px tall; relevant small icon buttons also have 44px widths. Calendar day cells retain seven columns and 44px height, with narrower widths on small phones. |
| Search and checkout | Catalogue filters wrap instead of starting outside the screen. Promotion input/button use a shrinkable grid. Form fields use 16px text to avoid small-input zoom on mobile browsers. Existing guest checkout, PIN lookup, consent and payment logic are unchanged. |
| Gift guide | Time and city fields stack. Calendar selectors show complete month/year labels at 320/360px. Dialog width escapes the browser's default narrow maximum. Below 550px height, the portrait collapses to leave room for the form; one native scroll region keeps actions reachable. |
| Login | Aligned padding and balanced heading sizes. Short-height layouts use smaller branding and tighter spacing while retaining native scrolling, focus containment and Escape dismissal. No authentication changes or OTP requests. |
| Cart/footer | Aligned outer padding, enlarged quantity/remove controls, wrapped totals, stacked the footer email form and removed excessive empty-cart minimum height. |
| Other public pages | Aligned policy, Journal, private-offer, customer-order and 404 gutters. Added wrapping and shrinkable account/private-offer tracks; order request fields use readable mobile input sizing. |

## Verification

| Check | Result |
| --- | --- |
| 320px narrow phone | All ten existing brooch routes, Navratri, Shop/search/saved, checkout, five policies, loaded Journal/article, private-offer unavailable and 404 checked. No horizontal document overflow. |
| 360px phone | Main storefront/product/checkout layouts, loaded Coming Soon, guide steps, calendar/time picker and sign-in checked. No horizontal document overflow. |
| 390px and 430px | Shop, Navratri, brooch, checkout and policy layouts checked; guide birth details fit at 430×932. Document scroll width matches its content viewport. A desktop scrollbar consumes 15px during some browser checks. |
| Short screen, 360×480 | Guide portrait disappears, focused form action scrolls into view, and calendar/time/login dialogs retain native internal scrolling. Login action is visible after the compact layout adjustment. |
| Desktop, 1024×768 and 1920×1080 | Shop, Navratri, brooch and checkout checked. No horizontal overflow; approved hero loads with contain framing. Shared spacing overrides remain mobile-only. |
| Product interactions | Closed-box thumbnail selection and keyboard Enter on Day 9 worked. Brooch personalization opened/closed without overflow or undersized controls. Sticky purchase bar leaves footer information visible. |
| Dialog keyboard behavior | Escape closed calendar/time dialogs and restored focus to their trigger. Sign-in also dismissed with Escape. |
| Hero failure fallback | Temporarily renamed the two edited hero sources; Shop successfully displayed the original photograph. Sources restored immediately; approved image confirmed loading afterward. |
| Production build | Root `npm run build` exited 0, producing 22 crawlable route shells and 12 admin shells, then synchronizing root `dist/`. Existing Vite chunk-size advisory remains. |
| Meta Pixel regression | All three existing Node tests passed, including route-specific built noscript fallback. |
| Browser errors | No console errors or warnings observed after restoring image sources. |

The oversized Shop promotional background is decorative and already clipped by its section. Its off-screen bounding rectangle does not widen the document or hide interactive content.

## Evidence and practical limits

- Screenshots: `.tmp/mobile-ux-shop.png` and `.tmp/mobile-ux-shop-desktop.png`.
- Authenticated order details, private offers with protected data and generated gift results were inspected in source; no authorized customer session was available for live data verification. No OTP, recommendation submission, order, payment, refund or pickup was generated for this audit.
- Physical iOS/Android keyboards, autofill and device safe-area insets require a real-device check. Short-height browser emulation verifies layout behavior, not an actual operating-system keyboard.
- Bag remained one Navratri set at ₹1,499. Original photographs in `9inone/` remain untouched and untracked. Product identity, pricing, API contracts, email OTP, PIN lookup and route-scoped Meta Pixel are preserved.
- Frontend source, documentation, generated distribution and checkpoint are delivered in one local commit. GitHub push and release require fresh explicit permission; no backend deployment is needed.
