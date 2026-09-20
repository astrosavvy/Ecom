# Testing & Build Verification Rules

## 1. Mandatory Build Pass Verification
- Before completing any task or committing changes:
  - Run `npm run build` in `younoya-web/` (or from root `npm run build`).
  - The build MUST exit with code 0 and output complete distribution assets.
  - Fix all TypeScript errors, missing asset imports, or CSS bundling issues immediately. Never suppress errors with `@ts-ignore` without documented rationale.

## 2. Zero Test Session Residue Mandate
- When testing backend endpoints (OTP generation, checkout, cart operations):
  - Do not create persistent rows in production database tables.
  - Tests must clean up after themselves (`afterEach`, rollback transactions, or isolated dev DB).

## 3. Video & Media Verification Standard
- Whenever video or hero media is modified:
  - Verify video loads as a Blob with seekable range matching full duration (~32 seconds).
  - Test on desktop wide viewport (1440px+) and mobile portrait viewport (390×844).
  - Verify no horizontal overflow (`overflow-x: hidden`).
  - Verify zero console errors or uncaught promise rejections.
