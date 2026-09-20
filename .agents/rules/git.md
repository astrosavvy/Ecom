# Git & Deployment Rules

## 1. Remote Repository & Branching
- **Repository**: `https://github.com/astrosavvy/Ecom.git`
- **Main Branch**: `main` (auto-deploys to Cloudflare Pages for `younoya-web`).

## 2. GitHub Authentication & Push Protocol
- Windows Credential Manager sometimes caches an outdated token (`lenvthank-source`), resulting in `403 Permission denied`.
- If standard `git push origin main` fails with 403, push explicitly using the active PAT:
  ```bash
  git -c credential.helper= push https://x-access-token:<GITHUB_PAT_TOKEN>@github.com/astrosavvy/Ecom.git main
  ```

## 3. Ignored Directories & Force Add Policy
- Notice `.gitignore` rules:
  - `backend/` is ignored by default. Changes to custom backend modules/migrations must be force-added:
    ```bash
    git add -f backend/src/...
    ```
  - `younoya-web/dist/` is explicitly NOT ignored (`!younoya-web/dist/`) to allow Cloudflare Pages pre-built deployments if needed.
  - `2026_09_09/` is ignored (raw camera photoshoot). NEVER commit 2.4 GB of raw camera photos to Git.

## 4. Conventional Commit Messages
- Use standard semantic commit prefixes:
  - `feat(...)`: new functionality or page additions
  - `fix(...)`: bug fixes, style adjustments, or asset path corrections
  - `chore(...)`: dependency updates, agent memory updates, housekeeping
  - `refactor(...)`: codebase restructuring without behavior changes
