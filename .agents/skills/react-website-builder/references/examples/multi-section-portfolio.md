# Example: Multi-Section Scrolling Portfolio

Illustrates: a full multi-section page (five sections, explicit order), a shared gradient-text CSS class reused across headings, three named custom motion components (`FadeIn`, `Magnet`, `AnimatedText`) each specified as their own reusable primitive, per-element animation timing given individually rather than as a general rule, and a scroll-driven "sticky-stacking cards" effect specified with the actual math.

---

Build a 3D Creator portfolio landing page for "Jack" using React, TypeScript, Tailwind CSS, Framer Motion, and Lucide React. Dark theme (#0C0C0C background), font Kanit (Google Fonts, weights 300–900), page title "Jack -- 3D Creator".

**Global styles:** background color applied consistently across `html`, `body`, `#root`, and the main wrapper; font-family; box-sizing reset; a shared `.hero-heading` class (a specific `linear-gradient` + `background-clip: text` recipe) reused by every section heading; the main wrapper sets `overflowX: 'clip'` to allow full-bleed horizontal elements without introducing a scrollbar.

**Section order** stated explicitly as an ordered list (Hero → Marquee → About → Services → Projects) so structure is never ambiguous.

**Per-section detail example (Hero):** full-viewport flex column; a navbar with exact link list, colors, casing, and hover transition; a massive gradient-text `<h1>` with exact copy (down to a deliberate lowercase letter and a specific apostrophe character) and a responsive `text-[Nvw]` size cascade across four breakpoints; a bottom bar pairing a tagline (exact copy, color, per-breakpoint max-width) with a CTA button; a centered portrait image wrapped in a custom `Magnet` component with exact physics parameters (padding, strength, both transition curves). Every one of these elements gets its **own** FadeIn delay/offset pair specified individually (navbar: delay 0, y -20; heading: delay 0.15, y 40; etc.) rather than one blanket "everything fades in" instruction.

**Marquee section:** two rows of tripled images scrolling in opposite directions, with the exact scroll-offset formula given as math (`(window.scrollY - sectionTop + window.innerHeight) * 0.3`), exact tile dimensions, and explicit performance notes (`willChange: 'transform'`, passive scroll listener).

**About section:** four decorative images positioned absolutely in the four corners, each with its own per-corner FadeIn delay/direction; a heading using the shared gradient class; a paragraph using a custom `AnimatedText` component (character-by-character scroll-linked opacity, with the exact scroll offset range given).

**Services section:** a numbered list of items, each with an exact typographic spec for the number vs. the name vs. the description, a shared border-separator treatment, and a staggered per-item FadeIn delay formula (`i * 0.1`).

**Projects section:** a scroll-driven "sticky-stacking cards" effect specified with the actual scale formula (`1 - (totalCards - 1 - index) * 0.03`) and per-card top-offset formula — this is exactly the kind of interaction that would be impossible to build correctly from a vague description like "cards that stack as you scroll," but is fully specified here as math. Each project's exact image URLs are listed individually rather than described.

**Reusable components:** `ContactButton` and `LiveProjectButton` (exact gradient/shadow/outline recipes), `FadeIn` (a generic wrapper with delay/duration/x/y props and defaults, using `whileInView` + a specific viewport margin/amount + a specific easing curve), `Magnet` (mouse-following hover physics), `AnimatedText` (the scroll-linked character reveal) — each described as a standalone primitive other sections reference by name, not re-explained per use.

**Key dependencies:** exact package names with realistic version ranges.

**Responsive breakpoints:** confirms Tailwind's default breakpoints are used, mobile-first, with heavy reliance on `clamp()` for fluid type — and calls out the one meaningful breakpoint-dependent repositioning (the hero portrait centers vertically on mobile, then anchors to the bottom on sm+) explicitly rather than leaving it to be inferred.

---

Takeaways for writing specs like this: state the section order as an explicit list up front; give per-element (not per-section) animation timing when elements are meant to cascade in sequence; name and fully specify any reusable component once, then just reference it by name everywhere it's used; when an effect depends on a formula (stacking scale, scroll offset, stagger delay), write the actual formula, not a description of the effect.
