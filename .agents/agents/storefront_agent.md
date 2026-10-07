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
