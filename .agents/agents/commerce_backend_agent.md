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
1. ZERO BUILD ON VPS: Always build locally and transfer artifacts via SCP.
2. Put business logic in Medusa modules and workflows, not in raw route handlers.
3. Protect admin routes with appropriate guards (`fileGuard`, `blogRoleGuard`, `usersGuard`).
4. Force-add custom backend files if `.gitignore` ignores `backend/`.
