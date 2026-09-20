# OpenAI Codex Project Instructions — YOUNOYA Monorepo

> **Universal Operational Standard for OpenAI Codex & Antigravity**  
> Master living memory & state: [`.agents/CHECKPOINT.md`](file:///F:/Savvy_Ecom/.agents/CHECKPOINT.md)  
> Architectural Index: [`.agents/AGENTS.md`](file:///F:/Savvy_Ecom/.agents/AGENTS.md)

---

## 1. 🧭 Mandatory Checkpoint Protocol (Every Session & Turn)

Every Codex run in this repository MUST follow this 2-step lifecycle:

1. **SESSION / TURN START (Step 1)**:
   - Always read [`.agents/CHECKPOINT.md`](file:///F:/Savvy_Ecom/.agents/CHECKPOINT.md) FIRST before writing code, editing files, or running commands.
   - Identify: Current Phase, Last Completed Milestone, Active Tasks, and Inviolable Constraints.
   - Align your proposed changes strictly with the active roadmap in the checkpoint.

2. **SESSION / TURN FINISH (Step 4)**:
   - Always update [`.agents/CHECKPOINT.md`](file:///F:/Savvy_Ecom/.agents/CHECKPOINT.md) in the working tree BEFORE committing or yielding to the user.
   - Record completed work, test verification results (`npm run build` exit 0), next immediate tasks, and any blockers.

---

## 2. 🛑 Inviolable Git Rules: Single Commit & Explicit Push Permission

> [!CAUTION]
> **HARD SYSTEM RULES (NON-NEGOTIABLE)**:
> 1. **NEVER PUSH WITHOUT EXPLICIT USER PERMISSION**:
>    - NEVER execute `git push` automatically.
>    - You MUST ASK the user: *"Would you like me to push these changes to GitHub now?"*
>    - WITHOUT the user's explicit permission / approval, DO NOT push.
> 2. **SINGLE FINAL COMMIT ONLY (NO MICRO-COMMITS)**:
>    - NEVER create intermediate commits for individual file edits or partial scratch work.
>    - NEVER create a separate follow-up commit just to update a commit hash in `CHECKPOINT.md`.
>    - Every push to `origin main` triggers Cloudflare CI and deploys a live Worker version. Multiple micro-commits waste CI resources and deploy half-finished states.
>    - Batch all code edits, asset additions, config tweaks, and `CHECKPOINT.md` updates into **ONE single final commit**.

### The Standard Execution Sequence (from repo root `F:\Savvy_Ecom`):
```bash
# 1. Update .agents/CHECKPOINT.md in working tree first
# 2. Verify build (MUST exit code 0)
npm run build

# 3. Stage everything together
git add -A

# 4. Single semantic commit
git commit -m "<feat|fix|chore|docs>(<scope>): concise message"

# 5. STOP & ASK USER FOR PERMISSION BEFORE PUSHING:
# Ask: "Changes are committed locally and verified. Would you like me to push to GitHub origin main?"
# ONLY if the user explicitly says YES / pushes:
git push origin main
# Fallback if 403: git -c credential.helper= push https://x-access-token:<PAT>@github.com/astrosavvy/Ecom.git main
```

---

## 3. 🏛️ Repository Topology & Inviolable Invariants

1. **Frontend Storefront**: [`younoya-web/`](file:///F:/Savvy_Ecom/younoya-web)
   - Vite 6 + React 19 + Framer Motion + Lenis + React Router 7.
   - Local dev: `npm run dev` (root) or `npm --prefix younoya-web run dev`.
   - Production build: `npm run build` (outputs to `younoya-web/dist/` and mirrors to root `dist/`).
   - Hero video: 32-second portrait scroll-scrubbed film (`/media/younoya-category-film-mobile.mp4`) loaded via Blob URL.
   - Minimalist hero invariant: Keep the first screen sparse ("A gift should feel inevitable"). Never add product grids, banners, or form fields to the hero.
   - Mascot PNG (`aster-mascot.png`) is rejected from the UI. Keep it out.

2. **Cloudflare Edge Deployment**:
   - The live production site is deployed as a **Cloudflare Worker with Static Assets** (project `ecom`).
   - Config: [`wrangler.jsonc`](file:///F:/Savvy_Ecom/wrangler.jsonc) with `assets: { directory: "dist", ... }`.
   - Deploy command: `npx wrangler deploy` (invoked via `npm run deploy` in CI). Creates a new version in Version History and routes 100% traffic to it.

3. **Commerce Backend**: [`backend/`](file:///F:/Savvy_Ecom/backend)
   - Medusa 2.18, Node 20+, PostgreSQL 15, Redis.
   - Zero builds on VPS (956MB RAM OOM). Local packaging -> scp -> PM2 reload.
   - Passwordless OTP auth (PBKDF2-SHA512, 100k iterations, 10-min expiry).

4. **Preserved Raw Media Archive**:
   - `2026_09_09/` contains 283 raw camera photoshoot JPGs (~2.4 GB). **DO NOT DELETE. Keep gitignored.**
   - `creative/younoya-scroll-film/` contains lets-scroll film legs and prompts.

---

## 4. 📂 Detailed Knowledge Base Navigation

| For Detailed Rules On... | Read This File |
|:---|:---|
| Living project state & next immediate tasks | [`.agents/CHECKPOINT.md`](file:///F:/Savvy_Ecom/.agents/CHECKPOINT.md) |
| Universal system architecture & index | [`.agents/AGENTS.md`](file:///F:/Savvy_Ecom/.agents/AGENTS.md) |
| Hard constraints & coding standards | [`.agents/rules/coding-style.md`](file:///F:/Savvy_Ecom/.agents/rules/coding-style.md) |
| Git commit & push law | [`.agents/rules/git.md`](file:///F:/Savvy_Ecom/.agents/rules/git.md) |
| Checkpoint lifecycle protocol | [`.agents/rules/checkpoint-protocol.md`](file:///F:/Savvy_Ecom/.agents/rules/checkpoint-protocol.md) |
| Scroll film seek & canvas pipeline | [`.agents/memory/scroll_film_engine.md`](file:///F:/Savvy_Ecom/.agents/memory/scroll_film_engine.md) |
| Medusa backend & OTP state machine | [`.agents/memory/commerce_api.md`](file:///F:/Savvy_Ecom/.agents/memory/commerce_api.md) |
| Design tokens, typography & palette | [`.agents/context/glossary.md`](file:///F:/Savvy_Ecom/.agents/context/glossary.md) |
