# Example: SaaS Hero with Dashboard Preview

Illustrates: a clipped/rounded "frame" hero pattern, a floating-pill navbar, a mixed-font headline (a serif accent word inside a sans-serif heading), a reusable data-viz primitive (a circular gauge) specified down to the SVG math, and an explicit file structure.

---

Build a fully responsive, full-viewport hero section for a PR-agency SaaS called "Convix Software" with these exact specs:

**Page frame:** outer wrapper `min-h-screen w-full bg-[#ededed] p-3 sm:p-4`, font Inter; inner hero container clips everything inside it — `relative w-full h-[calc(100vh-24px)] sm:h-[calc(100vh-32px)] overflow-hidden bg-[#d9d9d9] rounded-2xl sm:rounded-3xl`.

**Background video:** exact URL; `absolute inset-0 w-full h-full object-cover pointer-events-none`; full attribute list including cross-browser inline-playback attributes and a poster fallback image URL; a `bg-white/10` overlay sits above the video; foreground content wrapper is `relative z-10`.

**Fonts:** Inter (400/500/600/700) + Instrument Serif (regular + italic) imported in a dedicated fonts.css file.

**Navbar:** a floating centered pill (`bg-white rounded-full shadow-sm border ... max-w-[760px]`) containing: a custom inline SVG logo (exact geometry — 8 circles at a given radius plus a center circle, exact viewBox), desktop nav links with one link carrying a small colored-dot accent, a right-side icon + primary pill CTA button whose label text changes between desktop/mobile, and a `md:hidden` hamburger that opens an absolutely-positioned dropdown panel with the same nav items — state managed with a single `useState` toggle.

**Hero content:** centered column; a small pill badge; an `<h1>` using inline `style={{fontSize: clamp(...), lineHeight, fontWeight, letterSpacing}}` (not Tailwind classes, since the exact clamp formula matters more than a class name) that mixes a serif italic accent word into an otherwise sans-serif heading via a nested `<span style={{fontFamily: "'Instrument Serif', serif", fontStyle: 'italic'}}>`; a subtitle with its own clamp formula; a CTA button with a nested icon-in-circle treatment.

**Dashboard preview:** a mockup UI block below the hero content, in its own tray-colored wrapper, laid out as a responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) of stat cards. Each card is specified with its exact header text, big-number formatting, a trend-indicator pill (up or down, with exact color classes), a caption line, and — for two of the three cards — an instance of a reusable **Gauge** component at a specific value/color. The whole preview block is designed to visually bleed off the bottom edge of the rounded hero frame.

**Gauge component (reusable):** described down to implementation level since it's custom SVG — props (`value, color, showLabels, min, max`), viewBox, the exact tick-mark math (40 ticks across a 180° arc, active-tick count derived from `value`), stroke width/cap style, center text formatting, and an optional min/max label row.

**Colors:** a consolidated hex palette section listing every color used across the whole hero (primary accent, dark CTA, page/hero/tray backgrounds) rather than repeating hex codes inline everywhere.

**Icons:** an explicit list of exact `lucide-react` icon names used anywhere in the design.

**File structure:** an explicit tree (`src/app/App.tsx`, `src/app/components/Navbar.tsx`, `src/app/components/DashboardPreview.tsx`, `src/app/components/Gauge.tsx`, `src/styles/fonts.css`).

**Behavior notes:** explicitly states there are *no* custom animations beyond the native looping video — an important negative constraint, since otherwise an agent might assume Framer Motion reveals are wanted by default. Also explicitly confirms the responsive column-stepping behavior of the dashboard grid.

---

Takeaways for writing specs like this: when a value needs to vary continuously rather than snap between breakpoints, specify the exact `clamp()` formula rather than a Tailwind class cascade; for any custom SVG/canvas component, give the actual geometry/math, not just "a gauge chart"; state explicit negative constraints ("no custom animations") when the default assumption might otherwise be wrong; give an explicit file tree once the component count grows past a couple of files.
