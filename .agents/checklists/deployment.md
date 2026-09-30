# Deployment Verification Checklist

## 1. Cloudflare Pages Storefront Deployment
- [ ] Push to `main` branch on `astrosavvy/Ecom`.
- [ ] Cloudflare Pages triggers automated build with `npm run build` in root `younoya-web`.
- [ ] Verify `https://younoya.com` loads the 32-second portrait hero film smoothly.
- [ ] Verify SPA routing handles refreshing on nested routes.
- [ ] Confirm `public/_redirects` contains no catch-all loop.

## 2. VPS Backend Deployment (Oracle VPS 140.245.7.165 — Zero GitHub Involvement)
> [!IMPORTANT]
> Backend updates are strictly direct local-to-VPS via SSH. During this whole process NO GITHUB IS INVOLVED.
- [ ] 1. Build Medusa locally outside VPS: `cd backend && npm run build` (NEVER build on VPS — 956MB RAM OOM).
- [ ] 2. Push via SSH to backend VPS: `tar -czf medusa-deploy.tar.gz .medusa src package.json medusa-config.ts` && `scp -i ~/.ssh/id_ed25519_clean medusa-deploy.tar.gz ubuntu@140.245.7.165:/tmp/`.
- [ ] 3. Deploy and run on VPS: SSH in, extract into `/var/www/medusa/`, run `npx medusa db:migrate`, and restart service (`sudo systemctl restart younoya-medusa`).
- [ ] 4. Verify API health: `curl -s https://api.younoya.com/health` returns OK.
