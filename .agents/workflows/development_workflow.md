# Local Development Workflow

## 1. Prerequisites
- Node.js 20+
- npm 9+
- Git

## 2. Storefront Development (`younoya-web/`)
From repository root:
```bash
# Start local Vite dev server with hot module replacement
npm run dev
# -> Opens http://localhost:5173/

# Compile production storefront build
npm run build
# -> Outputs optimized distribution bundle to younoya-web/dist/

# Preview production build locally
npm run preview
# or serve via local static server
npm run serve
# -> Serves younoya-web/dist/ at http://localhost:3000/
```

## 3. Backend Development (`backend/`)
From repository root:
```bash
# Start Medusa dev server with hot reload
npm run backend:dev
# -> Starts Medusa on http://localhost:9000/

# Compile Medusa build
npm run backend:build
```

## 4. Testing Media & Scroll Scrubbing
- Open `http://localhost:5173/` in a desktop browser.
- Open DevTools (F12) -> toggle Device Toolbar to iPhone 14 Pro (390×844) and verify smooth seeking.
- Toggle back to Responsive / Desktop (1440px+) and verify that the 9:16 portrait video sits inside the dark obsidian surround with readable gold typography.
