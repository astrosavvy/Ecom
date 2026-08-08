# Spec Output Template

This is the format the skill's **final deliverable** follows: a single, execution-ready build specification written with enough exactness that a different AI coding agent (or a fresh Claude session) could build the site correctly from the document alone, without needing to ask a single follow-up question. See `references/examples/` for three real specs written at this level of precision — study those for tone and density before writing your own.

## The core discipline: exactness over description

The difference between a usable spec and a vague one is that every value is a *number, hex code, exact string, or exact class name* — never an adjective. Compare:

- Vague: "a large gradient heading" → Exact: `.hero-heading` class using `background: linear-gradient(180deg, #646973 0%, #BBCCD7 100%)` with `-webkit-background-clip: text` and `-webkit-text-fill-color: transparent`; `font-black uppercase tracking-tight leading-none`; sizes `text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]`
- Vague: "fades in nicely" → Exact: Framer Motion, `initial={{opacity:0, y:40}}`, `whileInView={{opacity:1, y:0}}`, `delay: 0.15`, easing `[0.25, 0.1, 0.25, 1]`
- Vague: "some padding" → Exact: `px-6 md:px-10 pt-6 md:pt-8`

Every piece of copy that appears on the page is quoted verbatim (including deliberate stylistic choices like a lowercase "i'm" or a curly apostrophe) — not paraphrased or summarized. Every asset is either a real URL the user gave you, a real URL you sourced/generated, or an explicitly-labeled placeholder — never a vague description standing in for a URL.

## Standard sections

Not every project needs every section below (a single-viewport hero doesn't need a "page structure" list), but check off each one that applies. Use whichever heading style/casing fits the project — the examples use both Title Case headers and ALL-CAPS section markers; either is fine as long as it's consistent within one spec.

**1. One-line brief** — what's being built, for whom/what brand, using which exact tech stack (e.g. "React, TypeScript, Tailwind CSS, Framer Motion, and Lucide React"), and the overall shape (single full-viewport hero vs. multi-section scrolling page vs. multi-page app).

**2. Global styles / page frame**
- Root container classes (background color, min/max height, font family, overflow behavior)
- Font: exact family name, source (Google Fonts), weights, how it's loaded, fallback stack
- Global CSS reset conventions
- Any custom CSS classes or `@keyframes` defined globally and reused across sections (gradient-text classes, fade-slide-up keyframes, etc.) — give the exact CSS

**3. Assets** (when the design uses video/imagery as a structural element, not just per-section content)
- Exact URL (real, sourced, or clearly placeholder)
- Exact HTML attributes (`autoPlay`, `muted`, `loop`, `playsInline`, `object-cover`, `object-position`, poster fallback, etc.)
- Positioning/z-index relative to other layers

**4. Section-by-section breakdown** — one subsection per structural piece (Navbar, Mobile Menu, Hero Content, About, Services, Dashboard Preview, whatever the confirmed structure includes). For each:
- Container/layout classes (exact Tailwind utility strings, not descriptions)
- Copy verbatim, in quotes
- Colors as hex codes
- Responsive sizing per breakpoint (either a `sm:/md:/lg:` class cascade or a `clamp()` formula)
- Spacing per breakpoint
- Any interactive/stateful behavior (toggles, hover states, menu open/close) with the exact classes/transitions involved
- Animation: library used, and exact delay/duration/offset/transform/easing values per animated element
- Icon names (exact `lucide-react` import names) and sizes

**5. Reusable components** — every component referenced more than once (buttons, a FadeIn/Magnet/AnimatedText wrapper, a Gauge/chart primitive, a card). For each: exact visual spec (gradients, shadows, borders), exact prop signature/defaults if it takes configuration, and the exact label/text if it renders one.

**6. Colors** — a consolidated hex palette if the project has enough distinct colors that repeating hex codes throughout would get unwieldy (optional for very simple palettes covered inline in section 2).

**7. Icons** — the full list of exact icon names imported from `lucide-react` (or whatever icon set was confirmed), so nothing has to be guessed at build time.

**8. Key dependencies** — package names with realistic version ranges (react/react-dom, framer-motion, lucide-react, tailwindcss, vite, typescript, plus anything pulled in by confirmed SEO/blog/3D/routing decisions — e.g. `react-router-dom`, `react-helmet-async`, `@react-three/fiber`).

**9. File structure** (optional, but adds real value for anything beyond a single-file hero) — an explicit file tree so structure isn't left ambiguous.

**10. Responsive breakpoints / behavior notes** — which breakpoints are in play (Tailwind defaults unless confirmed otherwise) and anything that changes meaningfully across them beyond normal reflow (an element repositioning, a grid stepping from 1→2→3 columns, a nav collapsing to a hamburger).

## Folding the wider checklist categories in

This skill's requirements checklist also covers SEO, blog/content, 3D/award-winning effects, and production/deployment readiness — categories the three reference examples don't happen to need, since they're single-hero specs. When those are in scope for a given project, give them the same exactness treatment as everything else rather than a vague mention:
- SEO → specific meta tag content, structured data schema type, sitemap/robots.txt presence, the SPA/prerendering caveat from `references/build-guide.md` if it applies
- Blog → specific content source, listing/detail page layout, taxonomy
- 3D effects → specific library (`@react-three/fiber`, etc.), the model/subject, the confirmed performance fallback
- Production readiness → specific analytics choice (or explicitly none), favicon/social preview assets, 404 page, deployment target

## Delivery

Write the finished spec as a single markdown file and deliver it as a file (this is a standalone artifact meant to be copied elsewhere, not a conversational answer) — see the file-creation guidance for `.md` deliverables. After delivering it, offer to also scaffold the actual project from the spec using `references/build-guide.md` — but the spec document itself is the primary deliverable this skill produces.
