# Multi-Agent Checkpoint & Handoff Workflow (Codex <-> Antigravity)

This document describes the exact protocol for transferring tasks between different AI tools (e.g. OpenAI Codex, Antigravity, Claude Code) without token loss, context degradation, or duplicate work.

---

## 1. How the Cross-Agent Mechanism Works
1. **SSOT File**: [`.agents/CHECKPOINT.md`](file:///F:/Savvy_Ecom/.agents/CHECKPOINT.md) is the single shared memory plane.
2. **OpenAI Codex Discovery**:
   - Codex reads root `CODEX.md` and root `AGENTS.md`.
   - Both instruct Codex to read `.agents/CHECKPOINT.md` on turn start and write to it on turn finish, and strictly enforce the single commit & push permission laws.
3. **Antigravity Discovery**:
   - Antigravity auto-loads root `AGENTS.md`, `.agents/AGENTS.md`, and `.agents/rules/*.md`.
   - Rule `checkpoint-protocol.md` instructs Antigravity to read `.agents/CHECKPOINT.md` on turn start and write to it on turn finish.

---

## 2. Handoff Scenario Walkthrough

### Scenario: Codex Completes Task A, Antigravity Takes Over for Task B
1. **Codex (Turn N)**:
   - Developer prompts Codex: "Connect the CartDrawer to the local storage cart."
   - Codex reads `.agents/CHECKPOINT.md` to confirm the context.
   - Codex completes the code and verifies with `npm run build`.
   - Before completing, Codex writes to `.agents/CHECKPOINT.md`:
     ```markdown
     - [2026-09-20] CartDrawer connected to local storage cart state. Verified with npm run build (0 errors).
     Active Task: Wire CartDrawer checkout button to /checkout route.
     ```
   - Codex commits locally in ONE atomic commit and asks the user: *"Would you like me to push to GitHub origin main?"*
2. **Developer Switches to Antigravity**:
   - Developer prompts Antigravity: "Continue with the next task."
   - Antigravity's Step 1: Reads `.agents/CHECKPOINT.md`.
   - Antigravity immediately sees: "CartDrawer connected. Active Task: Wire CartDrawer checkout button to /checkout route."
   - Antigravity begins working on `/checkout` immediately with ZERO prompt repetition from the user!
3. **Antigravity Finishes Task B**:
   - Antigravity implements `/checkout`, runs `npm run build`, and updates `.agents/CHECKPOINT.md`.
   - Antigravity commits locally and asks the user for push permission.
   - If the developer switches back to Codex, Codex has the exact same updated context!
