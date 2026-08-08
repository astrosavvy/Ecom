# Example: Single-Viewport Hero with Video Background

Illustrates: a one-section full-viewport page, a background video treated as a structural layer (not per-section content), a responsive navbar with an animated hamburger/mobile-menu, and CSS-keyframe-driven (not Framer Motion) staggered text reveal. Note how every value below is a concrete class string, hex code, or exact copy string — never a description.

---

Create a fullscreen hero landing page for a creative studio called "Foldcraft" using React, Tailwind CSS, and Lucide React icons. The page is a single viewport-height section with a looping background video, a responsive navbar, a mobile menu, and staggered-animated hero text.

**Video Background:** exact CDN URL; attributes `autoPlay, muted, loop, playsInline`; `absolute` positioned, full width/height, `object-cover`, `object-position` at 70% horizontal center; sits behind all content with no explicit z-index.

**Font:** Google Fonts Geist (weights 300–700) loaded via `<link>`; Tailwind config extends `fontFamily` with `geist: ['Geist', 'sans-serif']`; applied as `font-geist` on the root container; body CSS adds font-smoothing rules.

**Root container:** `relative h-screen w-full overflow-hidden bg-black font-geist`

**Navbar (z-30):** flex/space-between, exact padding per breakpoint; logo text with exact classes; desktop nav links (hidden on mobile, flex on md+) with exact hover-color transition; desktop CTA button with exact rounded/hover-scale classes; mobile hamburger toggle (40×40, z-50) with Menu/X icons cross-fading and rotating via exact duration/transform values, `active:scale-90`.

**Mobile menu (z-20):** absolute full-screen overlay, `bg-black/98 backdrop-blur-xl`, exact transition duration/easing toggling between open/closed states via height+opacity; inner content vertically centered with a delayed fade+translate; links and CTA styled with exact size/color classes; every link/button calls the close handler on click.

**Hero content (z-10):** flex column, `justify-between`, exact height calc and padding per breakpoint. Top section: a small badge line with a CSS-keyframe fade-slide-up animation (`animate-[fadeSlideUp_0.8s_ease_0.2s_both]`); an h1 with exact copy (including a deliberate line-break placement) and exact responsive size classes, using the same keyframe with a later delay. Bottom section: a supporting paragraph (exact copy, exact color/size/max-width classes) and a CTA button with an icon, each with the same keyframe pattern at staggered delays (0.7s, 0.9s).

**CSS animation** (defined once in `index.css`, reused via Tailwind's arbitrary `animate-[...]` syntax):
```css
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**CSS reset:** universal margin/padding/box-sizing reset.

**Dependencies:** React, `lucide-react` (specific icons: ArrowRight, Menu, X), Tailwind CSS, Google Fonts Geist.

---

Takeaways for writing specs like this: name the exact keyframe and give its full CSS; give the exact stagger delay for every animated element rather than saying "staggered"; specify z-index layering explicitly since video-behind-content stacking is easy to get wrong; call out every exact icon name used.
