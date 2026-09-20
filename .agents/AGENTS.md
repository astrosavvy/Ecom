# YOUNOYA — Executive Architecture & Master Agent Navigation Index

> **Universal Operational Standard for AI Agents & Developers**  
> Supersedes all prior legacy/EverShop documentation. Live canonical commit base: 2026-09-20.  
> Applicable to **Cursor**, **Antigravity**, **Claude Code**, and all automated workflows.

---

## 1. 🧭 Universal IDE-Agnostic Checkpoint Law

> [!IMPORTANT]
> **EVERY AGENT ON EVERY TURN MUST EXECUTE THIS 2-STEP CYCLE:**
> 1. **TURN START (Step 1)**: Read [`.agents/CHECKPOINT.md`](file:///F:/Savvy_Ecom/.agents/CHECKPOINT.md) FIRST to know the exact project status, last completed milestone, active work, and constraints.
> 2. **TURN FINISH (Step 4)**: Update [`.agents/CHECKPOINT.md`](file:///F:/Savvy_Ecom/.agents/CHECKPOINT.md) BEFORE concluding your turn, recording your completed work, test results, next immediate tasks, and any blockers.

---

## 2. 🏛️ Core Brand Mission & Architecture Overview

**YOUNOYA — For every chapter.** A luxury personalised gifting atelier combining Cartier-level spatial aesthetic, Vedic astrology/numerology guidance, and consecration with modern high-performance e-commerce.

### System Topology:
1. **Frontend Storefront**: [`younoya-web/`](file:///F:/Savvy_Ecom/younoya-web) — Vite 6 + React 19 + Framer Motion + Lenis + React Router 7. Features a 32-second scroll-scrubbed portrait film (`/media/younoya-category-film-mobile.mp4`), fluid cursor aura, 3D intention cylinder, and luxury cart drawer.
2. **Commerce & Astro Backend**: [`backend/`](file:///F:/Savvy_Ecom/backend) — Medusa 2.18, Node 20+, PostgreSQL 15 (`younoya_db`), Redis. Custom modules: `younoya-otp`, `younoya-blog`, `younoya-themes`, `younoya-toolkits`, `younoya-recipients`.
3. **Creative Media Engine**: [`creative/younoya-scroll-film/`](file:///F:/Savvy_Ecom/creative/younoya-scroll-film) — 4-leg continuous lets-scroll film chain, prompt packages, seam-grid QA evidence, and raw renders.
4. **Physical Photoshoot Archive**: `2026_09_09/` — 283 raw camera photoshoot photos (~2.4 GB). Preserved, ignored in git.
5. **Edge & Cloud**: Cloudflare Pages (`younoya-web` root -> `dist/`) + Cloudflare Zero Trust Tunnel (`api.younoya.com` -> VPS 140.245.7.165 port 80/9000).

---

## 3. 📂 The 7-Subsystem Directory Hierarchy

```
F:\Savvy_Ecom/
├── .cursorrules                             # Master Cursor IDE auto-loader (points to .agents/)
├── .agents/                                 # Master Agent Knowledge Base & Living Memory
│   ├── AGENTS.md                            # THIS DOCUMENT: Executive entry point & navigation
│   ├── CHECKPOINT.md                        # Living state & multi-agent handoff journal (SSOT)
│   ├── rules/                               # Hard System Constraints (auto-loaded into runtime)
│   │   ├── checkpoint-protocol.md           # Mandatory IDE-agnostic handoff law
│   │   ├── architecture.md                  # Monorepo topology, ports, Edge & VPS constraints
│   │   ├── coding-style.md                  # React 19, zero stubs, CSS tokens, seeking rules
│   │   ├── testing.md                       # Build verification (exit code 0), zero residue
│   │   ├── git.md                           # GitHub PAT instructions, ignore rules, commits
│   │   ├── security.md                      # OTP PBKDF2-SHA512, JWT 10-min tokens, CORS
│   │   └── no_drift_clarification.md        # Halt on uncertainty, zero concrete examples
│   ├── context/                             # Static project & domain background
│   │   ├── project.md                       # Infrastructure, repos, photoshoot, server URLs
│   │   ├── domain.md                        # 4 gift intentions, Vedic astrology concept
│   │   ├── glossary.md                      # Design tokens, color palette, terminology
│   │   └── references/                      # Preserved design specifications and prompts
│   ├── memory/                              # Deep subsystem domain specifications
│   │   ├── scroll_film_engine.md            # Video scrub pipeline, blob seek, seam rules
│   │   ├── commerce_api.md                  # Medusa 2.18 endpoints, OTP auth state machine
│   │   └── gift_intentions.md               # 4 gift intention chapters, copy, and keepsakes
│   ├── agents/                              # Specialized AI agent personas & boundaries
│   │   ├── README.md                        # Agent roster & delegation matrix
│   │   ├── storefront_agent.md              # Owns younoya-web/
│   │   ├── commerce_backend_agent.md        # Owns backend/
│   │   └── creative_media_agent.md          # Owns creative/
│   ├── checklists/                          # Operational checklists
│   │   ├── agent_turn_start.md              # Checkpoint read procedure
│   │   ├── agent_turn_finish.md             # Checkpoint update procedure
│   │   ├── pre-commit.md                    # Build verification checklist
│   │   └── deployment.md                    # Cloudflare Pages + VPS deployment checklist
│   └── workflows/                           # Actionable step-by-step developer guides
│       ├── development_workflow.md          # Local setup and build commands
│       ├── checkpoint_handoff_workflow.md   # Multi-agent handoff SOP (Cursor <-> Antigravity)
│       └── deployment_and_testing.md        # Staging & production deployment guide
├── younoya-web/                             # Single Canonical Frontend Storefront
│   ├── src/                                 # Active React 19 application
│   ├── public/                              # Video master, webp stills, _headers, _redirects
│   ├── package.json                         # Dependencies & build scripts
│   ├── vite.config.js                       # Vite build configuration
│   └── wrangler.jsonc                       # Cloudflare Pages configuration
├── backend/                                 # Medusa 2.18 Commerce Backend
├── creative/                                # Creative Media Assets & Prompts
│   └── younoya-scroll-film/                 # Master film legs, seam reviews, prompts
├── 2026_09_09/                              # Raw camera photoshoot (preserved, gitignored)
├── package.json                             # Monorepo orchestration scripts
└── serve.js                                 # Local static server for built dist
```

---

## 4. 🗺️ Subsystem Navigation Matrix

| If You Need To... | Consult First |
|:---|:---|
| **Know what to do right now on this turn** | [`.agents/CHECKPOINT.md`](file:///F:/Savvy_Ecom/.agents/CHECKPOINT.md) |
| **Understand the scroll-scrubbed hero film** | [`.agents/memory/scroll_film_engine.md`](file:///F:/Savvy_Ecom/.agents/memory/scroll_film_engine.md) |
| **Check design tokens, colors & typography** | [`.agents/context/glossary.md`](file:///F:/Savvy_Ecom/.agents/context/glossary.md) |
| **Understand Medusa modules & OTP auth** | [`.agents/memory/commerce_api.md`](file:///F:/Savvy_Ecom/.agents/memory/commerce_api.md) |
| **Work on storefront UI / React components** | [`.agents/agents/storefront_agent.md`](file:///F:/Savvy_Ecom/.agents/agents/storefront_agent.md) |
| **Commit and push changes to remote** | [`.agents/rules/git.md`](file:///F:/Savvy_Ecom/.agents/rules/git.md) / [`.agents/workflows/git_workflow.md`](file:///F:/Savvy_Ecom/.agents/workflows/git_workflow.md) |
| **Deploy to Cloudflare Pages or VPS** | [`.agents/workflows/deployment_and_testing.md`](file:///F:/Savvy_Ecom/.agents/workflows/deployment_and_testing.md) |
| **Verify system rules & anti-drift policies** | [`.agents/rules/no_drift_clarification.md`](file:///F:/Savvy_Ecom/.agents/rules/no_drift_clarification.md) |

---

## 5. 🔄 The Mandatory Same-Turn Synchronization Law

Whenever you modify application code, data models, or assets:
1. **Never postpone documentation**: Update the affected `.agents/memory/`, `.agents/context/`, or `.agents/rules/` file in the **exact same turn**.
2. **Update the checkpoint**: Log the completion in [`.agents/CHECKPOINT.md`](file:///F:/Savvy_Ecom/.agents/CHECKPOINT.md) before yielding.
3. **Verify the build**: Run `npm run build` in `younoya-web/` (or root `npm run build`) to ensure zero errors.

---

## 6. 🚀 Universal Git Commit & Push Protocol (Root `F:\Savvy_Ecom`)

> [!CAUTION]
> **SINGLE FINAL COMMIT ONLY — NO MICRO-COMMITS**:
> Never commit intermediate changes or make a separate commit just to record a commit hash. Update `.agents/CHECKPOINT.md` in the working tree, verify `npm run build` exits 0, and commit all changes (code, config, docs, checkpoint) together in ONE single final commit when the turn/task is complete.

Always execute from **repository root (`F:\Savvy_Ecom`)**:
```bash
# 1. Update Checkpoint in working tree FIRST (.agents/CHECKPOINT.md)

# 2. Build Verification (MUST exit 0)
npm run build

# 3. Stage All Changes Together (code + configs + dist + .agents/)
git add -A

# 4. Single Final Semantic Commit
git commit -m "<feat|fix|chore|docs>(<scope>): concise message"

# 5. Push to Origin Main (triggers single Cloudflare CI deployment)
git push origin main
# If 403 Forbidden: git -c credential.helper= push https://x-access-token:<PAT>@github.com/astrosavvy/Ecom.git main
```

