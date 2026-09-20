# Git Commit & Push Rules (Universal Standard for Cursor & Antigravity)

> [!IMPORTANT]
> **Universal Agent Execution Standard**:
> All git operations must be executed from the **repository root directory** (`F:\Savvy_Ecom`). Follow this exact 5-step checklist so every agent (Cursor or Antigravity) operates with zero confusion.

---

## 1. The Standard 5-Step Commit & Push Sequence

Always run these commands from `F:\Savvy_Ecom`:

### Step 1: Pre-Commit Build Verification
```bash
# MUST be run from root F:\Savvy_Ecom (builds younoya-web and syncs dist/)
npm run build
```
Confirm build exits with code `0`. Do NOT commit if build fails.

### Step 2: Check Git Status & Staging Rules
```bash
git status
```
- **Files to Stage**: Source code in `younoya-web/`, build output in `younoya-web/dist/` and `dist/`, memory/rules in `.agents/`, root configs (`package.json`, `serve.js`, `.cursorrules`).
- **Files NEVER to Stage**:
  - `2026_09_09/` (283 raw camera photoshoot JPGs, ~2.4 GB) — must remain ignored.
  - Temporary test scratch files or `.zip` files.
- **Backend Module Force-Add**: Since `backend/` is ignored in `.gitignore`, stage custom backend files explicitly:
  ```bash
  git add -f backend/src/...
  ```

### Step 3: Stage Changes
```bash
git add -A
```
Verify `git status` shows intended files staged in green.

### Step 4: Semantic Commit
```bash
git commit -m "<type>(<scope>): <concise description of what changed>"
```
**Allowed Types**:
- `feat`: New customer features, components, or pages (e.g. `feat(flow): add 3d spatial flow animation`)
- `fix`: Bug fixes, CSS styling patches, asset path adjustments (e.g. `fix(hero): scale video to eliminate letterbox voids`)
- `docs`: Documentation, memory updates, or checkpoint updates (e.g. `docs(checkpoint): update active milestone`)
- `chore`: Dependency updates, config adjustments (e.g. `chore: unify build scripts`)

### Step 5: Push to Remote
```bash
git push origin main
```

---

## 2. Remote Authentication & Fallback Protocol

- **Primary Remote**: `git@github.com:astrosavvy/Ecom.git` (branch `main`).
- **Standard Push**: `git push origin main`.
- **403 Fallback (Credential Helper Glitch)**:
  If Windows Credential Manager caches an outdated user (`lenvthank-source`) and returns `403 Permission denied`, run:
  ```bash
  git -c credential.helper= push https://x-access-token:<GITHUB_PAT_TOKEN>@github.com/astrosavvy/Ecom.git main
  ```
  *(PAT permissions: `Contents: Read & write` on `astrosavvy/Ecom`).*

---

## 3. Mandatory Same-Turn Checkpoint Sync
Immediately after pushing:
1. Note the commit hash (e.g. `git log -n 1 --oneline`).
2. Update [`.agents/CHECKPOINT.md`](file:///F:/Savvy_Ecom/.agents/CHECKPOINT.md) with the new commit hash and push status in the same turn.
