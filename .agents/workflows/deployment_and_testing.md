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
   git push https://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@github.com/astrosavvy/Ecom.git main
   ```
3. **Cloudflare Automated Edge Deployment**:
   - Cloudflare Pages listens to commits on `main` and automatically builds and deploys to `younoya.com` within ~60 seconds.

---

## 2. Backend API & Database VPS Deployment Workflow (Rule 9)

### Target Server:
- **IP**: `140.245.7.165` (`api.younoya.com`)
- **User**: `ubuntu`
- **SSH Key**: `C:\Users\Palak\.ssh\id_ed25519_clean`
- **Web Root**: `/var/www/younoya/backend/public/`

### Workflow Steps:
1. **Lint PHP Code**:
   ```bash
   php -l backend/public/index.php
   ```

2. **Transfer Files via SCP**:
   ```bash
   scp -i "C:\Users\Palak\.ssh\id_ed25519_clean" backend/public/index.php ubuntu@140.245.7.165:/tmp/index.php
   ```

3. **Deploy & Reload FPM/Nginx on VPS**:
   ```bash
   ssh -i "C:\Users\Palak\.ssh\id_ed25519_clean" ubuntu@140.245.7.165 "sudo cp /tmp/index.php /var/www/younoya/backend/public/index.php && sudo chown www-data:www-data /var/www/younoya/backend/public/index.php && sudo systemctl restart php8.4-fpm nginx"
   ```

4. **Verify Health Endpoint**:
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
