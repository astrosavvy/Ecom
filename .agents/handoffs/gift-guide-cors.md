# Backend request: allow the local Younoya gift guide origin

Requested by the user: 2026-10-01. Status: ready for the backend agent; not applied or deployed by the storefront agent.

## Problem and confirmed evidence

The frontend runs at http://127.0.0.1:5175/find-a-gift and defaults to https://api.younoya.com (no VITE_API_BASE override). The guide shows Collection preview because the recommendation fetch fails and GiftFinder.jsx catches it.

Checks against the live API on 2026-10-01:

- GET /health: HTTP 200, OK. The backend is online.
- POST /store/gift-guide/recommend with an empty JSON body and the existing storefront publishable key: HTTP 400, message Choose who the gift is for. The route is deployed and validates requests.
- OPTIONS /store/gift-guide/recommend with Origin http://127.0.0.1:5175, Access-Control-Request-Method POST and requested headers content-type,x-publishable-api-key: HTTP 204 but no Access-Control-Allow-Origin. The browser therefore blocks the local-origin request.

No personal birth details, OTP requests, saved results or payments were submitted during diagnosis. Do not misdiagnose this as an offline API or remove the truthful frontend preview fallback to hide the failure.

## Requested fix

1. Read AGENTS.md, .agents/CHECKPOINT.md, backend/medusa-config.ts and .agents/handoffs/gift-guide-backend.md first.
2. Inspect the live process environment and actual STORE_CORS configuration privately. Do not print credentials or complete environment files. Existing defaults in medusa-config.ts include localhost:5173, not the active 127.0.0.1:5175 origin; a live environment variable may override those defaults.
3. Add the exact local development origins http://127.0.0.1:5175 and http://localhost:5175 to STORE_CORS, preserving existing approved production origins. Confirm the environment value is comma-separated and the deployed Medusa process reads it.
4. Include those same origins in AUTH_CORS if needed for the existing local OTP/customer login flow. Do not broaden ADMIN_CORS unless local admin access is separately required. Do not use wildcard origins with credentials or disable CORS protections.
5. Update repository configuration/documentation so a future deployment does not revert the fix. A default-code edit alone cannot replace an overriding live STORE_CORS environment value.
6. Follow the backend update law: build backend artifacts locally, transfer via SSH/scp to ubuntu@140.245.7.165, migrate only if needed, and restart the relevant backend service. No VPS builds or admin dashboard, and no GitHub involvement in backend deployment. Preserve existing uploads and server configuration. Follow checkpoint/single-final-commit rules; ask for permission before any GitHub push.

## Acceptance checks

- OPTIONS for both local origins returns Access-Control-Allow-Origin matching the exact requesting origin, permits POST, and permits content-type, x-publishable-api-key and authorization when applicable. Credential behavior stays compatible with Medusa.
- A valid anonymous intention-only recommendation request reaches the endpoint from the local browser and returns a real eligible offer when the live catalog is configured. If catalog availability causes a separate server error, report that separately rather than claiming CORS is fixed end-to-end.
- Backend validation failures can be read by the local browser as JSON rather than masked as a CORS network failure.
- Existing https://younoya.com access still works. Unapproved origins remain excluded.
- For AUTH_CORS, verify preflight/read-only access first; do not send real OTP messages or create persistent test rows without the applicable authorization and cleanup plan.
- On the frontend, restart or Begin again and rerun the guide after the fix: yn_guide_result in sessionStorage can retain an earlier preview even after CORS is corrected. Do not overwrite a visitor's current result silently.

## Completion report

Update .agents/CHECKPOINT.md with the exact origins enabled, local build results, live deployment/restart details, preflight headers, browser verification and any remaining catalog/auth blockers. Report whether a real recommendation returned successfully. The frontend UI and animation require no redesign for this fix.
