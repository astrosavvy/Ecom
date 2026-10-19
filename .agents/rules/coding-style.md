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

## 4. Separation of Developer Instructions from User-Facing Copy (Inviolable Law)
- **Zero Literal Prompt Leakage**: Never copy/paste prompt instructions, technical requirements, aspect ratios, or developer jargon directly into customer- or admin-facing UI strings.
  - Prompts communicate instructions *to the AI agent* (e.g. "make the squared post as the default", "do not say on website just saying it to you", "1:1 square post", "CAC reduction", "Cartier-grade prophecy synthesized").
  - These technical directives must NEVER appear verbatim in buttons, labels, titles, badges, or descriptions.
- **Customer-Facing Editorial Common Sense**:
  - Write exclusively from the perspective of an elite, quiet luxury atelier (Anthropic, Cartier, Aesop, Apple).
  - Buttons and labels must use natural, clean, dignified consumer language:
    - Instead of technical aspect ratios like `"Download 1:1 Square Card"`, write `"Download Card"` or `"Save Card"`.
    - Instead of `"1:1 Square Post"` in toggles, use `"Post"` (vs `"Story"`).
    - Instead of `"CHAPTER FOLIO • 1:1 SQUARE POST"`, write `"Chapter Folio"` or `"Celestial Keepsake"`.
    - Instead of `"Open 1:1 Social Folio"`, write `"Share Keepsake"` or `"Share Chapter"`.
    - Instead of self-aggrandizing meta-hype like `"An electric, Cartier-grade prophecy synthesized for your current chapter"`, write quiet, understated human prose: `"A personal reflection drawn from your celestial transit. Prepared for your journal or story."`
- **Pre-Output Copy Audit**: Before delivering any code, scan all user-facing strings to ensure zero internal instructions or developer artifacts are exposed.
