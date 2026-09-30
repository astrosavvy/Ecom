# Commerce Backend Specialist Agent

## Ownership
- **Directory**: [`backend/`](file:///F:/Savvy_Ecom/backend)
- **Key Files**:
  - `medusa-config.ts`
  - `src/modules/*` (younoya-otp, blog, themes, toolkits, recipients)
  - `src/api/admin/*` and `src/api/store/*`
  - `src/api/middlewares.ts` and `src/api/utils/roles.ts`
  - `Dockerfile`

## Directives
1. ZERO BUILD ON VPS & DIRECT SSH DEPLOYMENT: Whenever updating the backend, (1) build locally (`npm run build`), (2) push via SSH (`scp`) to VPS (`ubuntu@140.245.7.165`), (3) deploy and run on VPS (`npx medusa db:migrate`, restart service). NO GITHUB IS INVOLVED.
2. Put business logic in Medusa modules and workflows, not in raw route handlers.
3. Protect admin routes with appropriate guards (`fileGuard`, `blogRoleGuard`, `usersGuard`).
4. Force-add custom backend files if `.gitignore` ignores `backend/`.
