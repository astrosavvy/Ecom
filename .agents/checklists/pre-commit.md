# Pre-Commit & Pre-Push Checklist

Before pushing changes to GitHub:

- [ ] **1. Clean Build**: `npm run build` exits 0 with no bundling warnings.
- [ ] **2. Git Status Cleanliness**: Run `git status`. Ensure untracked temporary files (e.g. zips, test artifacts) are not being committed.
- [ ] **3. Photoshoot Safety**: Confirm `2026_09_09/` is NOT staged.
- [ ] **4. Backend Additions**: If custom Medusa modules or migrations changed, ensure they are staged (`git add -f backend/src/...`).
- [ ] **5. PAT Authentication**: If push encounters a `403` error due to Windows Credential Manager caching an old user, push explicitly using the active token:
  ```bash
  git -c credential.helper= push https://x-access-token:<GITHUB_PAT_TOKEN>@github.com/astrosavvy/Ecom.git main
  ```
- [ ] **6. Checkpoint Sync**: Record the new commit hash and push confirmation in `.agents/CHECKPOINT.md` before concluding.
