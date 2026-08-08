# Cloudflare Pages Storefront Configuration

The Next.js 14 Storefront is decoupled from the VM and ready for instant deployment on **Cloudflare Pages**.

---

## 1. Step-by-Step Cloudflare Pages Setup (2 Minutes)

1. Open **[Cloudflare Dashboard](https://dash.cloudflare.com/)** → Go to **Compute (Workers & Pages)** → Click **Create Application** → Select **Pages** tab.
2. Click **Connect to Git** → Select repository: **`astrosavvy/Ecom`**.
3. Configure the Build Settings:
   - **Framework Preset:** `Next.js`
   - **Root directory:** `storefront`
   - **Build command:** `npm run build` (or `npx @cloudflare/next-on-pages@1`)
   - **Output directory:** `.next`
4. Add **Environment Variables**:
   - `NEXT_PUBLIC_MEDUSA_BACKEND_URL`: `https://api.younoya.com` (or `http://80.225.232.27:9000`)
5. Click **Save and Deploy**.

---

## 2. Cloudflare Zero Trust Tunnel Routing for Backend API

In **Cloudflare Zero Trust Dashboard** (`dash.cloudflare.com` → Networks → Tunnels → `younoya`):
- **Add Public Hostname:**
  - **Subdomain:** `api`
  - **Domain:** `younoya.com`
  - **Service Type:** `HTTP`
  - **URL:** `backend:9000` (or `127.0.0.1:9000`)

---

## 3. Advantages of This Separated Setup
- **Storefront Speed:** Served from 300+ Edge locations globally (< 35ms TTFB in India).
- **Zero Server CPU Load:** Storefront builds on Cloudflare's servers, not your VPS.
- **Backend Isolation:** VPS resources are 100% dedicated to database transactions, Redis cache, and Razorpay checkout webhooks.
