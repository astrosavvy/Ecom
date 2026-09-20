# Git Commit, Push & Deployment Workflow

This Standard Operating Procedure (SOP) ensures that any agent or human developer working in Cursor or Antigravity can execute clean, safe commits and pushes without hunting for directories or syntax.

---

## 1. Quick Copy-Paste One-Liner (Standard Turn Push)

From repository root (`F:\Savvy_Ecom`):
```bash
npm run build && git add -A && git commit -m "feat(scope): your descriptive message" && git push origin main
```

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

### 2. Inspect Changes
```bash
git status
```
Confirm:
- Only intentional changes in `younoya-web/`, `dist/`, `.agents/`, or root configs are present.
- `2026_09_09/` is NOT staged.
- No temporary `.zip`, `.mp4` scratch files, or `.tools` folders are present.

### 3. Stage & Commit
```bash
git add -A
git commit -m "feat: your concise commit message"
```

### 4. Push to Origin
```bash
git push origin main
```

### 5. Fallback if 403 Forbidden
If git outputs:
`remote: Permission to astrosavvy/Ecom.git denied to ... fatal: unable to access ... 403`
Run:
```bash
git -c credential.helper= push https://x-access-token:<GITHUB_PAT_TOKEN>@github.com/astrosavvy/Ecom.git main
```

### 6. Sync Checkpoint
Record the commit in [`.agents/CHECKPOINT.md`](file:///F:/Savvy_Ecom/.agents/CHECKPOINT.md):
```markdown
- **Git Commit**: `<hash>` (`main -> origin/main` pushed successfully)
```
