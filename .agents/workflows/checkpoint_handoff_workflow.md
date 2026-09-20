# Multi-Agent Checkpoint & Handoff Workflow (Cursor <-> Antigravity)

This document describes the exact protocol for transferring tasks between different AI tools (e.g. Cursor, Antigravity, Claude Code) without token loss, context degradation, or duplicate work.

---

## 1. How the IDE-Agnostic Mechanism Works
1. **SSOT File**: [`.agents/CHECKPOINT.md`](file:///F:/Savvy_Ecom/.agents/CHECKPOINT.md) is the single shared memory plane.
2. **Cursor Discovery**:
   - Cursor reads `.cursorrules` and `.cursor/rules/agentic-scaffold.mdc`.
   - Both instruct Cursor to read `.agents/CHECKPOINT.md` on turn start and write to it on turn finish.
3. **Antigravity Discovery**:
   - Antigravity auto-loads `.agents/AGENTS.md` and `.agents/rules/*.md`.
   - Rule `checkpoint-protocol.md` instructs Antigravity to read `.agents/CHECKPOINT.md` on turn start and write to it on turn finish.

---

## 2. Handoff Scenario Walkthrough

### Scenario: Cursor Completes Task A, Antigravity Takes Over for Task B
1. **Cursor (Turn N)**:
   - Developer prompts Cursor: "Connect the CartDrawer to the local storage cart."
   - Cursor reads `.agents/CHECKPOINT.md` to confirm the context.
   - Cursor completes the code and verifies with `npm run build`.
   - Before completing, Cursor writes to `.agents/CHECKPOINT.md`:
     ```markdown
     - [2026-09-20] CartDrawer connected to local storage cart state. Verified with npm run build (0 errors).
     Active Task: Wire CartDrawer checkout button to /checkout route.
     ```
2. **Developer Switches to Antigravity**:
   - Developer prompts Antigravity: "Continue with the next task."
   - Antigravity's Step 1: Reads `.agents/CHECKPOINT.md`.
   - Antigravity immediately sees: "CartDrawer connected. Active Task: Wire CartDrawer checkout button to /checkout route."
   - Antigravity begins working on `/checkout` immediately with ZERO prompt repetition from the user!
3. **Antigravity Finishes Task B**:
   - Antigravity implements `/checkout`, runs `npm run build`, and updates `.agents/CHECKPOINT.md`.
   - If the developer switches back to Cursor, Cursor has the exact same updated context!
