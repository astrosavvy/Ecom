# YOUNOYA Automated Development & Deployment Workflows

This document outlines the standard operational workflows for building, testing, and deploying the YOUNOYA astrology storefront and backend API.

---

## 1. Storefront Build & Cloudflare Deployment Workflow

### Pre-requisites:
- Node.js 18+
- Git repository synced with `https://github.com/astrosavvy/Ecom.git` on branch `main`.

### Workflow Steps:
1. **Run Local Production Build & Static Typecheck**:
   ```bash
   cd storefront
   npm run build
   ```
   *Expected Output*: `✓ Compiled successfully` with all routes marked `○ (Static)` or `● (SSG)`.

2. **Commit & Push to Main**:
   ```bash
   git add .
   git commit -m "feat(scope): descriptive commit message"
   git push origin main
   ```
3. **Cloudflare Automated Edge Deployment**:
   - Cloudflare Pages listens to commits on `main` and automatically builds and deploys to `younoya.com` within ~60 seconds.

---

## 2. Backend API & Medusa VPS Deployment Workflow (Zero GitHub Involvement)

> [!IMPORTANT]
> **DIRECT SSH DEPLOYMENT ONLY**: Whenever updating the backend Medusa server, execute this strict 3-step cycle. **DURING THIS WHOLE PROCESS NO GITHUB IS INVOLVED**.

### Target Server:
- **IP**: `140.245.7.165` (`api.younoya.com`)
- **User**: `ubuntu`
- **SSH Key**: `~/.ssh/id_ed25519_clean` (or `C:\Users\Palak\.ssh\id_ed25519_clean`)
- **Server Path / Service**: `/var/www/medusa/` (systemd service `younoya-medusa` / PM2)

### The 3-Step Backend Update Lifecycle:
1. **Build the Backend Code Locally**:
   ```bash
   cd backend
   npm run build
   ```
   *Constraint*: NEVER run `npm run build` on the VPS — it has a 956MB RAM ceiling and will crash with an OOM error.

2. **Push via SSH to Backend VPS**:
   Package the built artifacts and transfer directly via SCP/SSH:
   ```bash
   tar -czf /tmp/medusa-dist.tar.gz .medusa src package.json medusa-config.ts
   scp -i ~/.ssh/id_ed25519_clean /tmp/medusa-dist.tar.gz ubuntu@140.245.7.165:/tmp/medusa-dist.tar.gz
   ```

3. **Deploy & Run on VPS**:
   Connect via SSH, extract the updated artifacts, run non-destructive migrations, and restart the service:
   ```bash
   ssh -i ~/.ssh/id_ed25519_clean ubuntu@140.245.7.165 "tar -xzf /tmp/medusa-dist.tar.gz -C /var/www/medusa/ && cd /var/www/medusa/ && npx medusa db:migrate && sudo systemctl restart younoya-medusa"
   ```

4. **Verify Live Health**:
   ```bash
   curl -s https://api.younoya.com/health
   ```

---

## 3. Astrological Onboarding Testing Workflow

### Available Test Modes:
1. **New User Flow**:
   - Click **"✦ Calculate Kundali"** or open the onboarding deck.
   - Enter mobile number -> Receive/Bypass OTP -> Fill Name, DOB, Time & Place of Birth -> Select Gift Recipient -> View synergy score & personalized keepsakes.
2. **Returning User Fast-Track**:
   - Click **"✦ Returning User"** in the top test bar of the modal to instantly load a pre-computed Vedic profile (Aaditya Sharma, Leo/Surya, Pushya Nakshatra) and test the Gift Recipient and Bubble Dissolve mechanics.
