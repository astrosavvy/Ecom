# Git Commit, Push & Deployment Workflow (Codex & Antigravity)

This Standard Operating Procedure (SOP) ensures that any agent (OpenAI Codex, Antigravity) or developer executes clean, safe commits and strictly asks for permission before pushing to GitHub.

---

## 1. 🛑 NON-NEGOTIABLE HARD RULES

> [!CAUTION]
> 1. **NEVER PUSH WITHOUT EXPLICIT USER PERMISSION**:
>    - NEVER run `git push` automatically.
>    - You MUST ask the user: *"Would you like me to push these changes to GitHub now?"*
>    - Without explicit user approval, DO NOT push.
> 2. **SINGLE FINAL COMMIT ONLY (NO MICRO-COMMITS)**:
>    - Do not commit on intermediate edits.
>    - Batch all code, config, and `CHECKPOINT.md` updates into ONE final commit.

---

## 2. Step-by-Step Procedure

### 1. Build Verification
Always verify the storefront builds cleanly:
```bash
# Working Directory: F:\Savvy_Ecom
npm run build
```
Expected output:
```
✓ 2271 modules transformed.
dist/index.html ...
dist/assets/index-...js ...
✓ built in ~4s
```

### 2. Update Checkpoint in Working Tree
Before staging, update [`.agents/CHECKPOINT.md`](file:///F:/Savvy_Ecom/.agents/CHECKPOINT.md) with details of completed work, test results, and next immediate tasks.

### 3. Inspect Changes
```bash
git status
```
Confirm:
- Only intentional changes in `younoya-web/`, `dist/`, `.agents/`, or root configs (`CODEX.md`, `AGENTS.md`) are present.
- `2026_09_09/` is NOT staged.
- No temporary `.zip`, `.mp4` scratch files, or `.tools` folders are present.

### 4. Stage & Commit Everything in ONE Semantic Commit
```bash
# Stage all changes (code + configs + dist + .agents/CHECKPOINT.md)
git add -A
git commit -m "feat(scope): your concise commit message"
```

### 5. STOP & ASK USER FOR PERMISSION BEFORE PUSHING
Ask the user:
> *"Changes are verified and committed locally. Would you like me to push to GitHub origin main?"*

**ONLY AFTER receiving explicit permission from the user**:
```bash
git push origin main
```

### 6. Fallback if 403 Forbidden
If git outputs:
`remote: Permission to astrosavvy/Ecom.git denied to ... fatal: unable to access ... 403`
Run:
```bash
git -c credential.helper= push https://x-access-token:<GITHUB_PAT_TOKEN>@github.com/astrosavvy/Ecom.git main
```

