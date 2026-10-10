# Mobile UX audit and implementation plan

Date: 10 October 2026. Scope: public storefront, shared customer overlays and checkout.

## Outcome

Consistent mobile gutters, header clearance, internal padding and touch controls, without changing desktop compositions, branding, product identity, pricing or checkout behavior. Shop's Navratri hero must use the same approved photograph as the product gallery and first collection tile.

## Findings from the initial audit

| Finding | Planned fix |
| --- | --- |
| Shop hero still hard-codes `red-kit-1200.webp`; gallery/tile use `festive-open-box` | Read the first approved gallery record, with responsive sources and original-photo fallback. Frame the whole box. |
| Mobile outer gutters vary between 18, 19, 20, 22 and 24px | Shared 20px mobile gutter, accommodating left/right safe areas. Align headers, pages and footer subsections. |
| Brooch product grid exceeds a 345px content viewport | Constrain grid tracks and children with `minmax(0, 1fr)` / `min-width: 0`. Wrap thumbnails, breadcrumbs and narrow purchase actions. |
| Header heights and page clearance differ | Use a 72px mobile header and predictable page offsets. |
| Gallery, quantity, cart, header and footer controls are undersized | Use 44px or larger controls; fit calendar days within a seven-column grid on narrow phones. |
| Time/city share narrow columns and visibly truncate | Stack birth-detail fields, preserving optional fields and current dialog behavior. |
| Footer subsections and form have inconsistent padding | Align outer edges and stack the email form when narrow. |
| Fixed purchase bars lack consistent safe-area clearance | Reserve bottom space equal to the bar plus device safe area. |

## Work sequence

1. Correct the hero image and add shared mobile spacing rules.
2. Fix product grids, forms, dialogs, drawers, footer and customer account layouts.
3. Complete browser checks on loaded Journal/home content, search, saved pieces, all product routes, the guide's five steps, calendar/clock and short-screen login.
4. Inspect authenticated order/result layouts in source; use available authorized sessions if present. Do not create an account, send an OTP or purchase merely to test spacing.
5. Verify at 320, 360, 390 and 430px, plus short-height mobile and 1024/1920px desktop. Check content overflow, target sizes, image loading, keyboard dismissal/focus restoration, form visibility and purchase-bar clearance.
6. Run the production frontend build and existing relevant tests. Save visual evidence and an audit-results record; update the checkpoint and create one final local commit.

## Constraints and delivery

- Preserve Coming Soon at `/`, the light collection, dark gift guide, email OTP, guest checkout, recommendation state and route-scoped Meta Pixel.
- No backend/API changes, provider mutations, payment, refund, pickup or automatic deployment.
- Leave original photographs in `9inone/` untouched and untracked.
- GitHub push requires fresh explicit permission.

Implementation results are recorded separately in `mobile-ux-audit-results.md`.
