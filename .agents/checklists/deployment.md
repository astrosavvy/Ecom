# Deployment Verification Checklist

## 1. Cloudflare Pages Storefront Deployment
- [ ] Push to `main` branch on `astrosavvy/Ecom`.
- [ ] Cloudflare Pages triggers automated build with `npm run build` in root `younoya-web`.
- [ ] Verify `https://younoya.com` loads the 32-second portrait hero film smoothly.
- [ ] Verify SPA routing handles refreshing on nested routes.
- [ ] Confirm `public/_redirects` contains no catch-all loop.

## 2. VPS Backend Deployment (Oracle VPS 140.245.7.165)
- [ ] Build Medusa locally: `cd backend && npm run build`.
- [ ] Package release: `tar -czf medusa-deploy.tar.gz .medusa src package.json medusa-config.ts`.
- [ ] Transfer to VPS: `scp -i ~/.ssh/id_ed25519_clean medusa-deploy.tar.gz ubuntu@140.245.7.165:/tmp/`.
- [ ] SSH to VPS, extract archive into `/home/ubuntu/younoya/`.
- [ ] Run migrations: `npx medusa db:migrate`.
- [ ] Reload process: `pm2 restart younoya-backend && pm2 save`.
- [ ] Verify API health: `curl -s https://api.younoya.com/health` returns OK.
