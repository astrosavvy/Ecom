# YOUNOYA — Master System Navigation & Verification Ledger

> **Canonical URL Index for Storefront, Catalog, Editorial Journal, Admin Console, and REST APIs**  
> **Environment Targets**:  
> • **Production (Live)**: `https://younoya.com`  
> • **Local Development**: `http://localhost:5173`  
> • **Local Preview (Built Dist)**: `http://localhost:3000`  
> • **Headless Backend (VPS)**: `https://api.younoya.com`

---

## 1. 🌐 Core Storefront Routes

| Page / Feature | Production Link | Local Dev Link | Description & Verification Criteria |
|:---|:---|:---|:---|
| **Coming Soon Facade (Root)** | [younoya.com/](https://younoya.com/) | [localhost:5173/](http://localhost:5173/) | Production arrival landing facade. Displays diorama arrival visual, brand crest, and VIP email invite form. |
| **The Atelier Shop (Catalog)** | [younoya.com/shop](https://younoya.com/shop) | [localhost:5173/shop](http://localhost:5173/shop) | Full catalog of 10 handcrafted consecrated brooches with ivory luxury styling, filter chips, and add-to-cart drawers. |
| **Aster Gift Consultation** | [younoya.com/find-a-gift](https://younoya.com/find-a-gift) | [localhost:5173/find-a-gift](http://localhost:5173/find-a-gift) | Interactive 4-step astrology & intention consultation flow. Guided date-of-birth picker and solar sign recommendations. |
| **The Journal (Blog Hub)** | [younoya.com/blog](https://younoya.com/blog) | [localhost:5173/blog](http://localhost:5173/blog) | Editorial storytelling hub. Dynamic category filter pills, reading time estimates, 16:9 compressed WebP cover thumbnails. |
| **Legacy Journal Redirect** | [younoya.com/journal](https://younoya.com/journal) | [localhost:5173/journal](http://localhost:5173/journal) | Permanent client redirect routing automatically to `/blog`. |

---

## 2. 💎 Consecrated Keepsakes (All 10 Product Routes)

| Product Motif & Chapter | Production Link | Local Dev Link | Key Details |
|:---|:---|:---|:---|
| **01. The Golden Flight** | [younoya.com/product/the-golden-flight](https://younoya.com/product/the-golden-flight) | [localhost:5173/product/the-golden-flight](http://localhost:5173/product/the-golden-flight) | Rising Phoenix Brooch • Warm Gold Finish & Clear White Crystals (₹ 2,499) |
| **02. The Verdant Rising** | [younoya.com/product/the-verdant-rising](https://younoya.com/product/the-verdant-rising) | [localhost:5173/product/the-verdant-rising](http://localhost:5173/product/the-verdant-rising) | Green Crystal Phoenix • Emerald Radiance & Vitality (₹ 2,350) |
| **03. Flamingo Grace** | [younoya.com/product/flamingo-grace](https://younoya.com/product/flamingo-grace) | [localhost:5173/product/flamingo-grace](http://localhost:5173/product/flamingo-grace) | Crystal Flamingo Brooch • Ruby Accent Stone & Poise (₹ 2,350) |
| **04. Vivid Toucan Muse** | [younoya.com/product/vivid-toucan-muse](https://younoya.com/product/vivid-toucan-muse) | [localhost:5173/product/vivid-toucan-muse](http://localhost:5173/product/vivid-toucan-muse) | Multicolor Crystal Toucan • Red Enamel Beak & Charisma (₹ 2,550) |
| **05. Golden Instinct** | [younoya.com/product/golden-instinct](https://younoya.com/product/golden-instinct) | [localhost:5173/product/golden-instinct](http://localhost:5173/product/golden-instinct) | Black Metal Squirrel Brooch • Gold Detailing & Acorn Crystal (₹ 2,450) |
| **06. Solar Embrace** | [younoya.com/product/solar-embrace](https://younoya.com/product/solar-embrace) | [localhost:5173/product/solar-embrace](http://localhost:5173/product/solar-embrace) | Dragonfly Brooch • Gold Finish with Pavé Clear Crystals (₹ 2,250) |
| **07. Fire & Radiance** | [younoya.com/product/fire-and-radiance](https://younoya.com/product/fire-and-radiance) | [localhost:5173/product/fire-and-radiance](http://localhost:5173/product/fire-and-radiance) | Scorpion Brooch • Red & Orange Crystals & Protective Power (₹ 2,099) |
| **08. Flamingo Aura** | [younoya.com/product/flamingo-aura](https://younoya.com/product/flamingo-aura) | [localhost:5173/product/flamingo-aura](http://localhost:5173/product/flamingo-aura) | Purple Crystal Flamingo • Amethyst Hue & Silver Frame (₹ 2,550) |
| **09. Cat's Eye** | [younoya.com/product/cats-eye](https://younoya.com/product/cats-eye) | [localhost:5173/product/cats-eye](http://localhost:5173/product/cats-eye) | Long-Tailed Cat Brooch • Silver Metal with Green Crystal Eyes (₹ 2,099) |
| **10. The Inner Kingdom** | [younoya.com/product/the-inner-kingdom](https://younoya.com/product/the-inner-kingdom) | [localhost:5173/product/the-inner-kingdom](http://localhost:5173/product/the-inner-kingdom) | Multi-Animal Sculptural Brooch • Silver Metal & Green Crystals (₹ 1,500) |

---

## 3. 📰 The Journal & Editorial Stories (Backlinks QA)

| Article Title & Slug | Production Link | Local Dev Link | Verification Purpose |
|:---|:---|:---|:---|
| **Why Younoya is Different**<br>`why-younoya-is-different-from-a-traditional-astrology-store` | [younoya.com/blog/why-younoya-is-different-from-a-traditional-astrology-store](https://younoya.com/blog/why-younoya-is-different-from-a-traditional-astrology-store) | [localhost:5173/blog/why-younoya-is-different-from-a-traditional-astrology-store](http://localhost:5173/blog/why-younoya-is-different-from-a-traditional-astrology-store) | Live Medusa post test. Verifies compressed WebP cover (103 KB), amber/gold inline backlinks (`#A37B24`), Aster CTA, and zero trailing product grid. |
| **Thoughtful Gifts Inspired by Astrology**<br>`thoughtful-gifts-inspired-by-astrology` | [younoya.com/blog/thoughtful-gifts-inspired-by-astrology](https://younoya.com/blog/thoughtful-gifts-inspired-by-astrology) | [localhost:5173/blog/thoughtful-gifts-inspired-by-astrology](http://localhost:5173/blog/thoughtful-gifts-inspired-by-astrology) | In-depth editorial guide. Verifies rich inline backlinks to `/shop` and `/find-a-gift` with client-side React Router navigation. |
| **Legacy Slug Redirect Test** | [younoya.com/journal/thoughtful-gifts-inspired-by-astrology](https://younoya.com/journal/thoughtful-gifts-inspired-by-astrology) | [localhost:5173/journal/thoughtful-gifts-inspired-by-astrology](http://localhost:5173/journal/thoughtful-gifts-inspired-by-astrology) | Verifies backward compatibility route rewriting `/journal/:slug` → `/blog/:slug`. |

---

## 4. 🛡️ Edge-Hosted Admin Management Console

> [!NOTE]
> All admin routes run 100% on the Cloudflare edge as a client-side SPA with **zero RAM overhead on the VPS**.

| Admin Module | Production Link | Local Dev Link | Capabilities |
|:---|:---|:---|:---|
| **Admin Dashboard** | [younoya.com/admin](https://younoya.com/admin) | [localhost:5173/admin](http://localhost:5173/admin) | Overview metrics, quick links, recent order activities. |
| **Journal (Blog Manager)** | [younoya.com/admin/journal](https://younoya.com/admin/journal) | [localhost:5173/admin/journal](http://localhost:5173/admin/journal) | Table of articles, publication statuses, author attribution, and action buttons. |
| **TipTap Block Editor (New Post)** | [younoya.com/admin/journal/new](https://younoya.com/admin/journal/new) | [localhost:5173/admin/journal/new](http://localhost:5173/admin/journal/new) | **Strapi v5 TipTap visual editor**. Test inline hyperlinks, `Ctrl+K` popover, quick route presets (`/shop`, `/find-a-gift`), and copy-paste backlink preservation. |
| **Orders Management** | [younoya.com/admin/orders](https://younoya.com/admin/orders) | [localhost:5173/admin/orders](http://localhost:5173/admin/orders) | View placed orders, fulfillment states, and payment statuses. |
| **Customers Directory** | [younoya.com/admin/customers](https://younoya.com/admin/customers) | [localhost:5173/admin/customers](http://localhost:5173/admin/customers) | Verified phone-authenticated buyer profiles and astrology consult logs. |
| **Products Catalog** | [younoya.com/admin/products](https://younoya.com/admin/products) | [localhost:5173/admin/products](http://localhost:5173/admin/products) | Inventory tracking, brooch descriptions, and pricing adjustments. |
| **Themes & Intentions** | [younoya.com/admin/themes](https://younoya.com/admin/themes) | [localhost:5173/admin/themes](http://localhost:5173/admin/themes) | 4 core intention configurations: Love & Connection, Power, Vitality, Wealth. |
| **Recommendation Rules** | [younoya.com/admin/rules](https://younoya.com/admin/rules) | [localhost:5173/admin/rules](http://localhost:5173/admin/rules) | Astrological affinity rules mapping birth charts & planetary signs to keepsakes. |
| **Product Metadata** | [younoya.com/admin/metadata](https://younoya.com/admin/metadata) | [localhost:5173/admin/metadata](http://localhost:5173/admin/metadata) | Custom fields, astrological badges, mantra consecration notes. |
| **Team & Permissions** | [younoya.com/admin/team](https://younoya.com/admin/team) | [localhost:5173/admin/team](http://localhost:5173/admin/team) | Role-based access control (Admin, Support, Marketing). |
| **Team Invite Acceptance** | [younoya.com/admin/invite](https://younoya.com/admin/invite) | [localhost:5173/admin/invite](http://localhost:5173/admin/invite) | Token validation view for new team member onboarding. |

---

## 5. 🔍 SEO, Metadata & Discovery Files

| Endpoint / File | Production Link | Description & Search Engine Usage |
|:---|:---|:---|
| **Sitemap XML** | [younoya.com/sitemap.xml](https://younoya.com/sitemap.xml) | Canonical XML sitemap indexing all active storefront routes, 10 products, and published blog articles. |
| **Robots TXT** | [younoya.com/robots.txt](https://younoya.com/robots.txt) | Crawl directives allowing indexation of public pages and referencing `sitemap.xml`. |
| **LLMs Context Spec** | [younoya.com/llms.txt](https://younoya.com/llms.txt) | Open standard file for AI crawlers (Perplexity, ChatGPT, Claude) summarizing brand architecture and products. |
| **LLM Alternate Spec** | [younoya.com/llm.txt](https://younoya.com/llm.txt) | Secondary alias for AI agent discovery engines. |

---

## 6. ⚡ Headless Commerce Backend REST Endpoints (`api.younoya.com`)

| Service & Endpoint | Production Link | Protocol & Method | Purpose |
|:---|:---|:---|:---|
| **Blog Posts Listing** | [api.younoya.com/store/blog/posts](https://api.younoya.com/store/blog/posts) | `GET` (JSON) | Public REST endpoint querying published blog articles from PostgreSQL. |
| **Single Blog Post by Slug** | `https://api.younoya.com/store/blog/posts/:slug` | `GET` (JSON) | Returns complete HTML/Markdown content and metadata for a specific article. |
| **Astro Recommendation** | `https://api.younoya.com/store/astro/recommend` | `POST` (JSON) | Computes Vedic planetary attunements for Aster gift consultation. |
| **Store Themes Listing** | [api.younoya.com/store/themes](https://api.younoya.com/store/themes) | `GET` (JSON) | Returns active gift intention themes and associated keepsakes. |
| **OTP Request** | `https://api.younoya.com/store/otp/request` | `POST` (JSON) | Triggers phone authentication OTP for customer accounts and checkout. |
| **OTP Verification** | `https://api.younoya.com/store/otp/verify` | `POST` (JSON) | Validates OTP and returns PBKDF2-signed JWT authentication session. |
| **Admin Blog CRUD** | `https://api.younoya.com/admin/blog/posts` | `GET`, `POST`, `PUT`, `DELETE` | Authenticated editorial post authoring endpoint used by TipTap editor. |
| **Admin Team Management** | `https://api.younoya.com/admin/team` | `GET`, `POST` | Authenticated staff user management and permissions. |
| **Static Uploaded Media** | `https://api.younoya.com/static/...` | `GET` (Image/WebP) | Cloudflare edge-cached persistent media disk storage (`max-age=31536000`). |

---

## 7. 🧪 Testing & Verification Checklist

When validating any deployment or feature release, verify:
- [ ] `/` displays the Coming Soon facade with no broken images or text selection artifacts.
- [ ] `/shop` renders all 10 brooches with correct INR pricing, tags, and drawer responsiveness.
- [ ] `/find-a-gift` executes the 4-step Aster consultation flow without console errors.
- [ ] `/blog` renders editorial story cards with category filters and estimated read times.
- [ ] `/blog/why-younoya-is-different-from-a-traditional-astrology-store` renders amber inline backlinks without page refreshes.
- [ ] `/admin/journal/new` loads the TipTap visual block editor, supports `Ctrl+K` hyperlink insertion, and preserves links on paste.
- [ ] `/sitemap.xml` returns valid XML with HTTP status 200.
