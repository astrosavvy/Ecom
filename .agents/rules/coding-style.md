# Coding Style & Quality Rules

## 1. Zero Stubs & Zero Placeholders Mandate
- **Complete Implementations**: Never leave `// TODO: implement later`, placeholder functions, or truncated mock payloads in production routes or UI components.
- If a feature is deferred, do not add dummy buttons or unhandled click handlers to the UI. Keep components cleanly disabled or omit until ready.

## 2. Storefront Coding Standards (Vite + React 19)
- **Component Architecture**: Functional components with React hooks.
- **Styling Architecture**: Semantic CSS classes scoped in `src/styles/*.css`, leveraging design tokens defined in `src/styles/variables.css` and `CinematicHome.css`.
- **Motion & Interactions**:
  - Use `framer-motion` for UI component transitions, modal open/close, and notification banners.
  - Use `lenis` for smooth scrolling.
  - Use requestAnimationFrame loops for fluid cursor aura tracking.
  - Video scrub engine maps `window.scrollY` / container scroll progress to `video.currentTime`.
- **Media Seeking**: Always fetch video as a `Blob` and map to an Object URL (`URL.createObjectURL(blob)`) to avoid static HTTP server seek range lockups.

## 3. Backend Coding Standards (Medusa 2.18)
- **Business Logic Placement**: Place business logic inside Medusa modules (`src/modules/*`) and workflows, never directly in raw route handlers.
- **Role Guards**:
  - Staff routes require `usersGuard` (`/admin/users/me`).
  - Blog editing requires `blogRoleGuard` (admin & marketing).
  - File uploads require `fileGuard` (`/admin/files*`).
- **Data Schemas**: MikroORM / Medusa v2 data models with explicit migration scripts (`migrations/Migration<timestamp>.ts`).
