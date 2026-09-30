# Fluid gift-guide redesign — Codex implementation prompt

```text
Goal
Redesign /find-a-gift in F:/Savvy_Ecom as a light Younoya interpretation of the supplied 10.2-second chatbot animation. Implement the page, not a static mockup.

Context
The storefront uses React 19, Vite, Framer Motion, Lucide and semantic CSS. Read AGENTS.md and .agents/CHECKPOINT.md first. The reference video is D:/C Downloads/From Klickpin.com- Beachy sea breeze moments with timeless style that feel fresh and shareable for coastal mood boards-pin-id-533676624618895828.mp4. Inspect its actual frames: it shows an ambient metallic orb, gentle transitions, small rounded suggestions and alternating assistant/user bubbles. Translate the motion language into ivory, champagne gold and warm brown. Preserve Younoya's lady artwork; the earlier procedural 3D face was rejected and MUST NOT return.

Scope
Edit younoya-web/src/pages/GiftFinder.jsx, src/components/gift-guide/ and src/styles/GiftFinder.css, plus the guide-only Navbar class and its stylesheet rules, the optimized Aster image and a scoped copy module if useful. Preserve the existing API contracts, recommendation rules, product facts, authentication gates, checkout and calendar date limits. Keep raw birth details optional and clear them after recommendation. Login is required only for saving, reopening and ordering; no budget questions. Do not change backend, dependencies, the appearance of other pages or deployment configuration.

Design and behavior
Build one focused conversational canvas with a single larger Aster lady in refined 3D-style rendered artwork; remove the orb completely. Keep the full face, hairstyle and hands undistorted. Place readable alternating chat bubbles in a scrollable history, with the current question and rounded reply pills at the bottom of the viewport. Use subtle pointer attraction, press compression and restrained spring release. Keep text crisp while controls move. Show one active question at a time with a short stagger and smooth bubble entrance; every earlier reply remains available in the scroll region without collapse or truncation. Keep optional birth controls scrollable too, with the calendar and city choices accessible. Reduce only the gift-guide header height to 72px. Give name, relationship and optional birth details the same composed chat treatment. Keep birthday navigation usable and accessible. Make the date control a full-width rounded composer, and present the final explanation as an Aster message with compact rounded product cards, matching studio imagery where available and standard price numerals. Preserve the full history on the result screen. Show actual busy feedback only while choosing; no fabricated AI status or voice controls.
Use these existing Younoya steps: self/someone else; name and relationship if relevant; occasion/life moment; desired intention; optional birth date/time/resolved city. Use self-aware copy such as “What may I call you?” for self, “What may I call them?” for a recipient. Preserve the current choice values sent to the API. Show Saved recommendations only after verifying a signed-in customer. Remove the Explore freely sign-in caption. Preserve guest viewing and existing login gates. Describe the generated lady honestly as 3D-style artwork, not a rigged 3D model.
Use the existing brand fonts and standard tabular numeric font. Maintain a fully light page and readable contrast. Controls MUST support touch, keyboard, visible focus and reduced motion. Reduced motion MUST remove looping movement, magnetic movement and transition delays. Scope decorative layers so they cannot intercept input. Do not copy the reference's dark red palette, phone hardware, crypto copy or microphone actions.

Verification and finish
Complete the guest journey at desktop and 360/430px widths using non-sensitive test answers, including back navigation, calendar, skip-birth path and API-unavailable fallback. Confirm no horizontal overflow, full portrait framing, visible keyboard focus, and no console errors. Run npm run build from the repository root and fix failures. Save screenshots. Update the checkpoint and create one final local commit including generated dist. Do not push or deploy without explicit new permission. Stop when the requested UI works and is visually verified; report changes, checks and remaining limitations concisely.
```

🎯 Target: Codex. 💡 Grounded in the inspected reference and scoped to visual interaction while preserving live recommendation and login behavior.

This prompt is for an agentic tool with real system access. Review the scope locks, forbidden actions, and stop conditions before pasting. Confirm file paths, directories, and permissions match the actual project.
