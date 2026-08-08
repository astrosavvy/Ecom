# Requirements Checklist

Work through every category below — the answers here are what get folded into the final build-spec document (see `references/spec-template.md`), so treat "resolved" as "specific enough to write into that document as an exact value," not just "topic acknowledged." Not every website needs every item (a one-page portfolio doesn't need a routing plan) — use judgment on relevance, but don't skip a category just because it's more work to ask about.

## 1. Project identity & purpose
- Who/what is the site for (person, brand, product)? What's the page `<title>`?
- What's the primary goal (portfolio, lead-gen landing page, product marketing, personal site, dashboard)?
- Tone/vibe in a few words (e.g., "dark, moody, premium" vs. "bright, playful, approachable")

## 2. Global styles
- Color palette: background, text, accent colors (hex values if the user has brand colors)
- Theme: light / dark / both with a toggle
- Font family + source (Google Fonts name, weights needed) and fallback stack
- Any global CSS conventions to follow (reset behavior, box-sizing, base font size)
- Any signature reusable text/visual treatment (e.g., a gradient-text heading style) that recurs across sections

## 3. Page / section structure
- Full ordered list of sections/pages (hero, about, services, projects, testimonials, pricing, contact, footer, etc.)
- Single-page scroll vs. multi-page with routing
- Navigation: what links, where it lives, sticky vs. not

## 4. Per-section detail
For each section in the structure list, confirm:
- Layout (columns, alignment, full-viewport vs. content-height)
- Copy/content (real copy the user is providing vs. placeholder/lorem vs. AI-drafted — ask which)
- Assets: images/video/icons — real URLs or files the user is providing, vs. stock/AI-generated placeholders needed
- Any per-section animation or interaction beyond the site-wide defaults

## 5. Animation & interaction
- Overall animation level (minimal, moderate scroll-reveals, heavy motion-design)
- Specific effects mentioned or implied: scroll-driven parallax/marquee, sticky-stacking cards, magnetic hover, character-by-character text reveals, page-load fade-ins
- Timing/easing preferences if the user cares, otherwise a sensible default (e.g., Framer Motion's standard ease curves)

## 6. Reusable components
- Buttons (primary/CTA style, ghost/outline style) — visual treatment and labels
- Any custom interaction components implied by the animation section (magnetic wrapper, fade-in wrapper, animated text)
- Icon set (Lucide is the default under this skill; confirm if something else is needed)

## 7. Dependencies & tooling
- Confirm stack: React + TypeScript + Tailwind CSS + Framer Motion + Lucide React (this skill's default)
- Any additional libraries implied by the request (charts, forms, carousels, CMS integration)
- Build tool (Vite is the default) and whether the user needs a specific deployment target

## 8. Responsive behavior
- Breakpoints to support (Tailwind defaults — sm/md/lg — unless the user needs custom ones)
- Any behavior that should differ meaningfully by breakpoint beyond normal reflow (e.g., an element repositioning from center-screen on mobile to bottom-anchored on desktop)

## 9. Content sourcing
- Where real images/copy will come from: user will supply them, user wants AI-generated placeholders, or user wants generic stock-style placeholders
- If external image URLs are given, confirm they're meant to be used directly (hotlinked) vs. downloaded into the project

## 10. 3D & award-winning effects
This skill targets production-ready, Awwwards-caliber output by default, so always ask about this category rather than assuming plain 2D motion is enough.
- Does the site need actual 3D/WebGL elements (a Three.js/react-three-fiber scene, model viewer, particle field), or is "3D-feeling" motion (parallax depth, layered scroll, magnetic hover) enough?
- If real 3D: what's the subject (a product model, an abstract shape/scene, a character), and does the user have a 3D asset (.glb/.gltf) or need one generated/sourced?
- Performance fallback: what should happen on low-powered devices or if WebGL isn't supported (reduced-motion fallback, static image, simplified scene)?
- Any specific award-winning reference sites the user is drawing inspiration from

## 11. SEO (on by default)
Ask what the user needs here rather than whether they want SEO at all — most production sites need at least the basics.
- Meta tags: title/description per page, Open Graph + Twitter card images
- Structured data (JSON-LD) — relevant schema type if known (Organization, Person, Product, Article/BlogPosting)
- `sitemap.xml` and `robots.txt`
- Semantic HTML/heading structure and an alt-text policy for images
- Target keywords or competitor sites, if the user has any in mind
- Any analytics/search console setup they want wired in

## 12. Blog / content section (on by default)
Ask what's needed rather than whether a blog is wanted at all — flag it as easy to skip if genuinely out of scope for the project.
- Is a blog/content section needed at all for this project? (valid answer: no)
- If yes: content source — local MDX/Markdown files, a headless CMS (Contentful, Sanity, etc.), or something the user already has
- Listing page design (grid/list, filtering by category or tag) and post/detail page design
- Categories/tags taxonomy, author info, publish dates, related-posts

## 13. Production / deployment readiness
- Analytics (Google Analytics, Plausible, none)
- Favicon and social preview (og:image) assets
- Custom 404 page
- Deployment target (Vercel, Netlify, static export, user's own hosting)
- Accessibility pass expectations (basic semantic/contrast checks vs. a fuller WCAG pass)
