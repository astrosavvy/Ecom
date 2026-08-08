# Build Guide

This skill's primary deliverable is the build-spec document described in `references/spec-template.md` — this guide is the technical reference used in two ways: (1) while *writing* the spec, to keep every technical claim in it accurate (correct library choices, correct caveats, realistic version numbers) even though no code is being executed yet, and (2) if the user asks you to actually scaffold the project after the spec is delivered, as the literal setup steps to follow.

## Project setup

```bash
npm create vite@latest <project-name> -- --template react-ts
cd <project-name>
npm install
npm install framer-motion lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

`tailwind.config.js` — set `content` to scan `./index.html` and `./src/**/*.{ts,tsx}`, and extend `theme.extend` with any confirmed brand colors/fonts rather than hardcoding them ad hoc in components.

`index.html` — set `<title>` to the confirmed page title, and add the Google Fonts `<link>` for the confirmed font family/weights.

`src/index.css` — global reset (box-sizing: border-box, margin/padding 0), background color on `html, body, #root`, base font-family.

## File organization

```
src/
├── components/
│   ├── sections/       one file per page section (HeroSection.tsx, AboutSection.tsx, ...)
│   ├── ui/              reusable primitives (buttons, FadeIn, Magnet, AnimatedText)
│   └── App.tsx          assembles sections in the confirmed order
├── index.css
└── main.tsx
```

Keep each section in its own file once a page has more than ~2-3 sections — a single monolithic file gets unwieldy fast and makes it harder to iterate on one section without touching others.

## Common reusable component patterns

These recur across most of these builds. Only include the ones the checklist actually calls for — don't add motion/interaction components the user didn't ask for.

**FadeIn wrapper** — a Framer Motion wrapper component used to fade+slide content in on scroll:
```tsx
const FadeIn = ({ children, delay = 0, duration = 0.7, x = 0, y = 30, as = 'div' }) => {
  const Component = motion.create(as);
  return (
    <Component
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </Component>
  );
};
```

**Magnet (magnetic hover)** — tracks mouse position relative to an element's center and translates it slightly toward the cursor when nearby, easing back out when the cursor leaves. Use a fast ease-out transition while active and a slower ease-in-out when resetting, and set `willChange: 'transform'` on the animated element for performance.

**AnimatedText (scroll-reveal per character)** — splits text into individual characters, each animating opacity based on scroll progress through the paragraph (Framer Motion `useScroll` with an offset like `['start 0.8', 'end 0.2']`). Useful for hero/about copy the user wants to feel "written on" as you scroll — don't reach for this by default, only when the checklist confirms heavy scroll-driven animation.

**Pill buttons** — a primary/CTA variant (often a gradient background, rounded-full) and a ghost/outline variant (border only, transparent background, subtle hover fill). Centralize these as one `Button` component with a `variant` prop rather than duplicating markup per section.

**Sticky-stacking cards** — for project/portfolio sections where cards should stack and scale down as the user scrolls past: each card is `position: sticky` within its own tall container, and Framer Motion's `useScroll`/`useTransform` drive a `scale` value that decreases slightly for each card based on its index, so earlier cards appear to recede behind later ones.

**Scroll-driven marquee** — rows of images/logos that translate horizontally based on `window.scrollY` rather than a fixed CSS animation, so the movement is tied to scroll position. Attach the scroll listener with `{ passive: true }` and set `willChange: 'transform'` on the moving row for performance; triple the image list so the loop doesn't visibly reset.

## SEO setup (when confirmed)

- Prefer `react-helmet-async` (or hand-written `<head>` tags if the build is simple enough) for per-page title/meta description/Open Graph/Twitter card tags.
- Add a `sitemap.xml` and `robots.txt` in `public/` reflecting the confirmed page/route list.
- Add JSON-LD structured data matching the confirmed schema type (Organization/Person for a portfolio, Article/BlogPosting for blog posts) via a script tag in the head.
- Use one `<h1>` per page, real semantic landmarks (`<nav>`, `<main>`, `<footer>`), and meaningful `alt` text on every image per the confirmed alt-text policy.
- **Important limitation to flag to the user**: a plain Vite/React SPA renders its `<head>` tags client-side, after JavaScript runs. Google generally executes JS and can pick this up, but link-preview crawlers for social platforms (Twitter/X, Facebook, LinkedIn, Slack, iMessage) do **not** run JavaScript — they only read the static HTML that's served, so client-injected Open Graph tags won't show up in shared-link previews, and a multi-page site (especially one with a blog) will only ever serve one generic `index.html` to crawlers regardless of route. If the user cares about real link previews or multi-page SEO (not just the single-page basics), say so explicitly and offer a prerendering step (e.g. `vite-plugin-ssr`, a static prerender pass, or migrating the framework choice to something like Astro/Next.js) rather than quietly shipping client-only meta tags and calling it done. For a single-page site with no blog, this limitation matters much less — the static `index.html` head tags cover it.

## Blog setup (when confirmed)

- For a simple, no-CMS blog: store posts as MDX or Markdown files under `src/content/posts/`, parse frontmatter (title, date, tags, description) with a small utility, and generate listing + detail routes from that.
- For a headless CMS: scaffold a thin data-fetching layer (fetch calls or the CMS's SDK) behind a consistent `Post` type so the listing/detail components don't care where the data came from.
- A blog means multiple routes — install `react-router-dom` and set up `BrowserRouter`/`Routes` rather than trying to fake multiple pages inside one component tree. This applies to any confirmed multi-page structure, not just the blog.
- Listing page: grid or list per the confirmed design, with tag/category filtering if requested.
- Detail page: post content, author/date metadata, related posts if requested — and make sure each post gets its own SEO meta tags if SEO was confirmed (see the SPA/prerendering caveat above — per-post social previews need the same prerendering treatment).

## 3D / award-winning effects (when confirmed)

- For real WebGL: use `@react-three/fiber` + `@react-three/drei` rather than raw Three.js — they integrate far more cleanly with React's component model and handle a lot of the setup boilerplate (canvas, camera, lighting helpers).
- Load `.glb`/`.gltf` models with `useGLTF` from drei; if the user doesn't have a model, say so clearly rather than fabricating a specific asset URL — either source a generic placeholder model or ask the user to provide one.
- Always implement the confirmed performance fallback: detect `prefers-reduced-motion` and/or lack of WebGL support and swap in the agreed fallback (static image, simplified scene, or no 3D at all) — a heavy 3D scene with no fallback is not production-ready no matter how good it looks on a powerful machine.
- Where "3D-feeling" (not literal WebGL) was what the user meant, lean on the Magnet/parallax/scroll-depth patterns above instead of pulling in Three.js at all — don't add the dependency weight of a 3D engine unless real 3D was actually confirmed.

## Assets

- If the user supplied real image/video URLs, hotlink them directly unless they've asked you to download and self-host.
- If the checklist marked content sourcing as "AI-generated placeholders needed," generate those images (or note where the user should) rather than leaving broken `<img>` tags — but flag clearly in your final summary which assets are placeholders to swap out.
- Never fabricate specific real-world image URLs that weren't provided or generated — use a clearly-labeled placeholder service or generated image instead.

## Final delivery

When the build is done, tell the user plainly: what was built, how to run it (`npm run dev`), and a short list of anything still placeholder (copy, images, contact form backend, etc.) so they know what to swap before shipping.
