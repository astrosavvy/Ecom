# Public page indexing repair — 12 October 2026

The Search Console report for `/blog/navratri-shringaar-box` was correct: the client SEO resolver recognised only two older journal slugs and applied the 404 `noindex` directive to newer published articles. The live article's initial HTTP response was also the Coming Soon shell, with its title and a canonical pointing to `/`.

## Indexing rules

- Public Shop, all eleven current product routes, Journal/list/articles and five policy/contact pages: `index,follow` with a canonical pointing to the public production URL.
- `/` and `/find-a-gift`: `noindex,follow`, omitted from the sitemap as requested. Crawling remains allowed so crawlers can see the exclusion.
- Private checkout, customer orders, admin, private offers and missing pages retain `noindex`; authenticated customer data is never put into the sitemap or public HTML.
- `robots.txt` continues allowing crawling, and advertises `https://younoya.com/sitemap.xml`.

## Implementation

`younoya-web/worker/index.js` runs first only for `/blog`, `/blog/*`, journal aliases and `/sitemap.xml`. Both Wrangler configurations now bind `ASSETS` and reference this Worker. Other pages/media remain asset-served.

The Worker reads the existing **public, published-only** Medusa journal endpoints. Valid published articles receive route-specific robots, canonical, title, description, social image, BlogPosting/Breadcrumb JSON-LD, full escaped article text in the no-JavaScript fallback, and safely encoded public bootstrap data. The browser reuses fresh bootstrap data; SPA navigation resolves real published posts rather than a static slug allowlist. Duplicate metadata is replaced, and asynchronous responses cannot overwrite a different route after navigation.

The Journal fallback includes crawlable article links. The sitemap paginates through the published feed, includes new articles without a frontend rebuild and omits unpublishing/removals. Missing/unpublished posts return HTTP 404/noindex. Network errors, timeouts or malformed provider responses return uncached HTTP 503 with Retry-After, rather than a successful empty page or an indexing ban. Current backend endpoints themselves map database errors to 404/empty listings; this pre-existing API behaviour limits how precisely the edge can distinguish those particular failures.

The build also snapshots published posts across pagination and produces static route HTML for local/static previews. If the public API cannot be reached during a build, it logs a warning and uses existing legacy metadata for the static preview; production blog HTML and sitemap remain authoritative through the Worker. The snapshot is an ignored `.tmp` artifact, never a private API or draft export.

No backend API, database, checkout, product copy, photography or layout change is required. The Worker needs no private credentials: only the existing public Medusa storefront key. Optional `PUBLIC_API_BASE`/`PUBLIC_STOREFRONT_KEY` Worker variables and `SEO_API_BASE`/`VITE_PUBLISHABLE_KEY` build variables can target another public environment.

## Verification

- `npm --prefix younoya-web run test:seo`: metadata exclusions, new slugs, bootstrap expiry/navigation, duplicate directives, safe JSON encoding, pagination, drafts, missing posts, provider errors, GET/HEAD, aliases, asset passthrough and shared browser requests.
- `npm run build`: generate 22 indexable route shells from four published articles, four excluded shells, twelve admin shells and synchronize both tracked distributions. The existing Vite bundle-size advisory is unchanged.
- `npx --yes wrangler@4 deploy --dry-run`: validates the edge bundle and ASSETS binding without deploying.
- Local Wrangler HTTP checks: article returns 200/index with its own canonical; nonexistent article 404/noindex; home/Q&A noindex; Shop/product/contact index; sitemap includes both Navratri articles and excludes home/Q&A/private pages; robots permits crawling.
- Browser checks: direct article and journal loading, SPA navigation, article schema/canonical consistency, public product/policy metadata and excluded home/Q&A metadata. No order, charge, OTP or backend write is used.

For local Wrangler testing, set `$env:CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV = 'false'` before `npx --yes wrangler@4 dev --local --ip 127.0.0.1 --port 5175`. This avoids loading unrelated legacy root `.env` credentials. Stop Wrangler before the root build: its Windows asset-directory watcher can prevent `scripts/sync-dist.mjs` from replacing `dist`.

## Release and recrawl

One final local commit includes source, configurations, generated output and checkpoint. GitHub push needs fresh explicit user permission. Release the complete Worker plus static assets; uploading static assets alone would not fix future admin-published articles. No backend SSH deployment is needed.

After release, inspect the live Navratri article in Search Console, run Test Live URL and request indexing. Resubmit `/sitemap.xml`. Confirm indexing is allowed and the user-declared canonical is the article URL. Search engines still decide whether/when to index an eligible page; deployment does not immediately erase historical Search Console results.

References: [Google noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing), [Cloudflare selective Worker/asset routing](https://developers.cloudflare.com/workers/static-assets/binding/), [Cloudflare local environment isolation](https://developers.cloudflare.com/workers/local-development/environment-variables/).
