---
name: react-website-builder
description: Use whenever the user asks to build, create, design, or scaffold a website, landing page, portfolio site, or web app using React, TypeScript, Tailwind CSS, Framer Motion, and/or Lucide React — even if a detailed spec is already attached, since thoroughness in the prompt isn't the same as completeness. Targets production-ready, award-winning-caliber sites (3D/WebGL effects where appropriate) and by default gathers requirements for SEO and a blog/content section too — user can opt out per-project, but never assume unwanted without asking. This skill's primary deliverable is a single, execution-ready build-spec document (the kind of exhaustive, exact-values prompt that could hand off to any AI coding agent) — not scaffolded code — so do not write that spec before running the full requirements checklist, and do not scaffold actual project files unless the user separately asks for that after the spec is delivered.
---

# React Website Builder

Building a website from a single prompt is a high-variance task: dozens of small decisions (exact colors, spacing, animation timing, breakpoint behavior, image sources, copy, SEO setup, whether there's a blog) are all invisible until someone asks about them. If Claude guesses at these instead of confirming them, the result technically "works" but doesn't match what the user actually pictured, and the user has to spend a review cycle catching every mismatch instead of one clarification cycle. This skill exists to front-load that clarification — and because the target output is a *production-ready, hand-off-quality* spec, not a quick mockup, the checklist deliberately collects more than the bare minimum a typical site request would need.

**What this skill actually produces:** a single, comprehensive build-specification document — the same kind of exhaustive, exact-values prompt shown in `references/examples/` — precise enough that a different AI coding agent (or a fresh session) could build the site correctly from that document alone. It is not, by default, the scaffolded React project itself. Think of this skill as a spec-writer that turns a vague idea into a production-grade brief, not a page-builder that turns a prompt straight into files.

**The rule: do not write the final spec until the requirements checklist below is fully resolved.** "Resolved" means every category has either (a) a concrete answer stated by the user, extracted from an attached spec/reference, or (b) an explicit default that you proposed and the user confirmed. Silently filling gaps with assumptions is what this skill is designed to prevent — a spec built on guesses just relocates the mismatch problem into the handoff document instead of solving it.

**Ask through every category, not just the obvious ones.** This skill's whole value is in surfacing categories the user wouldn't have thought to mention — SEO metadata, a blog/content section, 3D/award-winning interaction details, production/deployment concerns. Don't quietly batch these away or skip them because the user's prompt didn't bring them up; ask about each category explicitly. SEO and a blog are **on by default** for this skill (most production sites want both) — ask what they need rather than whether they want it at all, and let the user say "skip the blog" or "no SEO work needed" if it doesn't apply to their project.

## Workflow

### 1. Extract what's already known

Before asking anything, read the user's prompt and any attached files (specs, screenshots, Figma exports, reference sites) closely and fill in as much of the checklist as you can from what's already there. `references/examples/` holds three real specs at the level of detail a *fully specified* request looks like — section-by-section layout, exact colors/fonts, asset URLs, animation parameters, dependency versions. Use them to calibrate completeness, not as templates to copy content from.

### 2. Build the checklist and mark gaps

Open `references/requirements-checklist.md` for the full category list. Go through it and mark each item:
- **Known** — stated by the user or in an attached file (note where it came from)
- **Default available** — not stated, but there's a sensible, common default you can propose
- **Missing** — needs the user's input, no reasonable default exists (e.g., real content/copy, brand assets, specific page names)

Show the user this checklist status directly (a short table or grouped list is fine) so they can see what's covered and what isn't — don't just silently proceed. This is also a good checkpoint for the user to correct anything you extracted wrong.

### 3. Ask through each category explicitly

Go category by category (see `references/requirements-checklist.md` for the full list — global styles, page structure, per-section content, animation, 3D/award-winning effects, reusable components, SEO, blog/content, dependencies, responsive behavior, production/deployment) and ask a question for each one rather than silently folding it into a default or skipping it because the user's prompt didn't mention it. This is a wider net than a typical "build me a site" request needs — that's intentional, since the target is a production-ready, award-caliber spec, not a quick mockup.

`ask_user_input_v0` caps out at 3 questions per call and ends your turn once you call it, so 12 categories can't literally become 12 (or even 4) rounds of button-prompts without exhausting the user's patience. Split by question type instead of trying to force everything into buttons:
- **Small, discrete choices** (theme, animation intensity, whether real 3D/WebGL is wanted, blog yes/no, deployment target) fit `ask_user_input_v0` well — pick the 3 most decision-critical ones for a single call.
- **Everything else** (section list, specific copy/content source, brand colors, asset sourcing, SEO specifics, production details) goes in the same message as plain conversational questions, grouped by category with short labels, sent alongside (not instead of) the button call. The user can answer the buttons and the prose questions together in one reply — don't spread this across many sequential turns just because the categories are numerous.

For "Default available" items within a category, propose the default alongside the question ("for SEO I'd set up meta tags, Open Graph, and a sitemap by default — want anything beyond that, or should I skip SEO for this project?") so the user is choosing to keep or override it, not being asked to invent one from nothing. **SEO and blog/content are on by default** — frame those as "what do you need" rather than "do you want this," and let the user explicitly opt out per project if it doesn't apply. Silence/approval on a batch of proposed defaults counts as confirmation.

When the user defers on SEO or blog specifically ("whatever you think"), default to including baseline SEO (meta tags, sitemap, structured data — low cost, near-universally useful) but *not* a blog unless the project type implies ongoing content (an agency, a newsletter-driven personal brand, a company site) — state that assumption plainly rather than picking silently. Likewise, default analytics to **off** unless requested — don't add a third-party tracker the user didn't ask for.

If the user says something like "just use your best judgment" or "you decide," that's a valid resolution for the categories they said it about — record your chosen defaults, state them back briefly, and move on. Don't keep re-asking after that.

### 4. Confirm before writing the spec

Once every checklist category is resolved, give a brief final summary of what the spec is about to cover (section list, stack, key visual direction) and then proceed directly to composing it — no need for a second confirmation round if the user already answered everything in steps 2–3.

### 5. Compose the final build spec

This is the deliverable. Open `references/spec-template.md` for the canonical structure (global styles, assets, section-by-section breakdown, reusable components, colors, icons, dependencies, file structure, responsive behavior) and write one cohesive markdown document following it, folding in every resolved checklist answer with the same exactness the three examples use: real hex codes, real Tailwind class strings, verbatim copy in quotes, exact animation timing values, real dependency version numbers, and either real asset URLs or clearly-labeled placeholders — never a vague description standing in for a concrete value. Use `references/build-guide.md` as your technical reference to keep implementation details (correct Framer Motion patterns, correct SEO/blog/3D caveats, correct library choices) accurate while writing the spec.

Create it as a single markdown file (this is a standalone artifact meant to be copied elsewhere or handed to another agent, not a conversational answer) and deliver it as a file. Don't pad it with meta-commentary about the process that produced it — the document itself should read like the three reference examples: a direct, execution-ready brief.

### 6. Offer to build it (optional, only after the spec is delivered)

After the spec is delivered, offer — don't assume — to also scaffold the actual project from it. If the user says yes, follow `references/build-guide.md`'s project setup and component patterns to build for real. If they don't ask, the spec alone is a complete, successful outcome of this skill.

## Category checklist at a glance

At minimum, make sure each of these gets an explicit question (details for each in `references/requirements-checklist.md`):

1. Project identity & purpose
2. Global styles (palette, theme, font, signature treatments)
3. Page/section structure & navigation
4. Per-section content, layout, and assets
5. Animation & interaction level
6. **3D / award-winning effects** — WebGL/Three.js elements, mouse-follow/parallax depth, whether the site should aim for an Awwwards-style showcase feel, and performance fallbacks for lower-powered devices
7. Reusable components (buttons, motion wrappers, icon set)
8. **SEO** (on by default) — meta tags/Open Graph/Twitter cards, structured data (JSON-LD), sitemap.xml + robots.txt, semantic heading structure, alt text policy, target keywords if the user has any
9. **Blog/content section** (on by default) — whether it's needed, content source (MDX files, a headless CMS, none), listing + detail page design, categories/tags
10. Dependencies & tooling
11. Responsive breakpoints
12. Production/deployment readiness — analytics, favicon/social preview image, 404 page, deployment target, accessibility pass

## When the user pushes back on the process

If the user seems impatient with the checklist ("just build something, I'll fix it after"), that's a valid resolution too — treat every remaining "Missing" item as "use a reasonable placeholder/default," say so explicitly, and proceed straight to writing the spec. The goal is confirmed completeness, not friction for its own sake.
