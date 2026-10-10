import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { PRODUCTS } from '../src/data/products.js'
import { NAVRATRI_DAYS } from '../src/data/navratri.js'
import { getSeo, indexableRoutes, SITE_URL } from '../src/seo/metadata.js'
import { POLICY_ROUTES, policySections } from '../src/data/policies.js'

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicRoot = path.join(appRoot, 'public')
const distRoot = path.join(appRoot, 'dist')
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
const escapeXml = escapeHtml
const routes = indexableRoutes()
let site = { storefrontMode: 'coming-soon', policiesPublished: false, business: { legalName: 'YOUNOYA HOUSE OF ASTRO PRIVATE LIMITED', supportEmail: 'support@younoya.com', dispatchHours: 24, deliveryMinDays: 3, deliveryMaxDays: 5 } }
try {
  const response = await fetch(`${process.env.SEO_API_BASE || 'https://api.younoya.com'}/store/site-config`, { signal: AbortSignal.timeout(4000), headers: { 'x-publishable-api-key': process.env.VITE_PUBLISHABLE_KEY || 'pk_d4577228b532cf8c81a5b63e898652da2dbaf9730acd3f8f449ccda1f8482c75' } })
  if (response.ok) { const value = await response.json(); if (value.business?.legalName && value.business?.supportEmail) site = value }
} catch { /* Use confirmed draft information if the backend cannot be reached during a build. */ }

const ADMIN_SHELL_ROUTES = [
  '/admin',
  '/admin/login',
  '/admin/orders',
  '/admin/customers',
  '/admin/products',
  '/admin/journal',
  '/admin/journal/new',
  '/admin/team',
  '/admin/themes',
  '/admin/rules',
  '/admin/metadata',
  '/admin/launch',
]

async function writeDiscoveryFiles() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(route => `  <url><loc>${escapeXml(`${SITE_URL}${route}`)}</loc></url>`).join('\n')}\n</urlset>\n`
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
  const listing = PRODUCTS.map(product => `- [${product.name}](${SITE_URL}/product/${product.handle}): ${product.tagline}. Displayed price ${product.price}.`).join('\n')
  const llms = `# Younoya\n\n> Intentional gifting and considered keepsakes inspired by astrology. Operated by ${site.business.legalName}.\n\n## Explore\n\n- [Younoya](${SITE_URL}/): ${site.storefrontMode === 'coming-soon' ? 'the coming-soon introduction' : 'the current collection'}.\n- [The collection](${SITE_URL}/shop): keepsakes with product details and displayed prices.\n- [Let Younoya choose](${SITE_URL}/find-a-gift): optional astrology-inspired guidance and intentional gift curation.\n- [The Journal](${SITE_URL}/blog): stories of intention, ritual and astrology-backed gifting.\n\n## Policies and support\n\n${Object.entries(POLICY_ROUTES).map(([route,title]) => `- [${title}](${SITE_URL}${route})`).join('\n')}\n\nSupport: ${site.business.supportEmail}. ${site.policiesPublished ? 'Published policy information is available at the links above.' : 'Policy information is in draft while online ordering is prepared.'}\n\n## The collection\n\n${listing}\n\n## Notes\n\nProduct pages describe displayed prices, materials, intentions and care. Prices, serviceability, availability and the final payable total are confirmed at checkout when ordering is enabled.\n`
  await Promise.all([
    writeFile(path.join(publicRoot, 'sitemap.xml'), sitemap, 'utf8'),
    writeFile(path.join(publicRoot, 'robots.txt'), robots, 'utf8'),
    writeFile(path.join(publicRoot, 'llms.txt'), llms, 'utf8'),
    writeFile(path.join(publicRoot, 'llm.txt'), llms, 'utf8'),
  ])
  console.log(`Generated sitemap.xml, robots.txt, llms.txt and llm.txt for ${routes.length} pages.`)
}

function fallbackContent(route, seo) {
  if (route.startsWith('/admin')) return `<main><h1>Younoya Console</h1><p>Administrative portal for the Younoya team.</p></main>`
  if (POLICY_ROUTES[route]) return `<main><h1>${escapeHtml(POLICY_ROUTES[route])}</h1><p>${site.policiesPublished ? 'Published policy' : 'Draft information. Online ordering is being prepared.'}</p>${policySections(route,site.business).map(([title,text]) => `<section><h2>${escapeHtml(title)}</h2><p>${escapeHtml(text)}</p></section>`).join('')}<a href="mailto:${escapeHtml(site.business.supportEmail)}">Contact support</a></main>`
  if (route === '/') return `<main><h1>${site.storefrontMode === 'coming-soon' ? 'YOUNOYA — Coming Soon' : 'The Younoya collection'}</h1><p>${escapeHtml(seo.description)}</p><a href="/shop">Explore the collection</a></main>`
  if (route === '/shop') return `<main><h1>The Younoya collection</h1><p>${escapeHtml(seo.description)}</p><ul>${PRODUCTS.map(product => `<li><a href="/product/${product.handle}">${escapeHtml(product.name)}</a> — ${escapeHtml(product.price)}</li>`).join('')}</ul></main>`
  if (route === '/find-a-gift') return `<main><h1>Let Younoya help you choose</h1><p>${escapeHtml(seo.description)}</p><p><a href="/shop">Explore the collection</a>.</p></main>`
  if (route === '/blog') return `<main><h1>The Younoya Journal</h1><p>${escapeHtml(seo.description)}</p><p><a href="/shop">Explore keepsakes</a> or read our stories.</p></main>`
  if (route.startsWith('/blog/')) return `<main><nav><a href="/blog">The Journal</a></nav><h1>${escapeHtml(seo.title)}</h1><p>${escapeHtml(seo.description)}</p><p><a href="/shop">Explore keepsakes</a>.</p></main>`
  const product = seo.product
  if (product?.kind === 'ritual-box') return `<main><nav><a href="/shop">The collection</a></nav><h1>${escapeHtml(product.displayName || product.name)}</h1><p>${escapeHtml(product.displaySubtitle)}</p><p>₹1,499 · complete nine-day set</p><p>${escapeHtml(product.intentionStory)}</p><p>Photographs show the complete box and daily kit details. Background flowers and idols are styling props and are not included.</p>${NAVRATRI_DAYS.map(day => `<section><h2>Day ${day.day}: ${escapeHtml(day.deity)}</h2><p lang="hi">${escapeHtml(day.hindi)}</p><p>${escapeHtml(day.colour)}</p><ul>${day.contents.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul></section>`).join('')}</main>`
  if (product) return `<main><nav><a href="/shop">The collection</a></nav><h1>${escapeHtml(product.name)}</h1><p>${escapeHtml(product.subtitle)}</p><p>${escapeHtml(product.price)}</p><p>${escapeHtml(product.intentionStory)}</p><h2>Piece details</h2><ul><li>Dimensions: ${escapeHtml(product.specs.dimensions)}</li><li>Weight: ${escapeHtml(product.specs.weight)}</li><li>Colour: ${escapeHtml(product.specs.color)}</li></ul></main>`
  return `<main><h1>${escapeHtml(seo.title)}</h1><p>${escapeHtml(seo.description)}</p></main>`
}

function routeHtml(template, route) {
  const seo = getSeo(route,site.storefrontMode)
  const tagList = [
    `<meta name="robots" content="${seo.noindex ? 'noindex,follow' : 'index,follow'}">`,
  ]
  if (!seo.noindex) {
    tagList.push(`<link rel="canonical" href="${SITE_URL}${route}">`)
    tagList.push(`<link rel="describedby" href="/llms.txt" type="text/plain">`)
  }
  tagList.push(`<meta property="og:site_name" content="Younoya">`)
  tagList.push(`<meta property="og:locale" content="en_IN">`)
  tagList.push(`<meta property="og:type" content="${seo.product ? 'product' : route.startsWith('/blog/') ? 'article' : 'website'}">`)
  tagList.push(`<meta property="og:title" content="${escapeHtml(seo.title)}">`)
  tagList.push(`<meta property="og:description" content="${escapeHtml(seo.description)}">`)
  tagList.push(`<meta property="og:url" content="${SITE_URL}${route}">`)
  if (seo.image) {
    tagList.push(`<meta property="og:image" content="${seo.image.startsWith('http') ? seo.image : `${SITE_URL}${seo.image}`}">`)
  }
  tagList.push(`<meta name="twitter:card" content="summary_large_image">`)
  if (seo.schema) {
    tagList.push(`<script type="application/ld+json" data-younoya-seo>${JSON.stringify(seo.schema).replace(/</g, '\\u003c')}</script>`)
  }
  const tags = tagList.join('\n    ')
  return template
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(seo.title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escapeHtml(seo.description)}">`)
    .replace('</head>', `    ${tags}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root"></div><noscript>${fallbackContent(route, seo)}</noscript>`)
}

async function safeWriteFile(target, content) {
  for (let i = 0; i < 5; i++) {
    try {
      await writeFile(target, content, 'utf8')
      return
    } catch (err) {
      if (i === 4) throw err
      await new Promise((r) => setTimeout(r, 150 * (i + 1)))
    }
  }
}

async function writeRoutePages() {
  const template = await readFile(path.join(distRoot, 'index.html'), 'utf8')
  for (const route of [...routes, ...ADMIN_SHELL_ROUTES]) {
    const target = route === '/' ? path.join(distRoot, 'index.html') : path.join(distRoot, route.slice(1), 'index.html')
    await mkdir(path.dirname(target), { recursive: true })
    await safeWriteFile(target, routeHtml(template, route))
  }
  const notFound = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,follow"><title>Page not found | Younoya</title></head><body><main><h1>This path has wandered.</h1><p><a href="/shop">Explore the Younoya collection</a>.</p></main></body></html>`
  await safeWriteFile(path.join(distRoot, '404.html'), notFound)
  console.log(`Generated ${routes.length} crawlable route shells, ${ADMIN_SHELL_ROUTES.length} admin shells, and 404.html.`)
}

if (process.argv[2] === 'public') await writeDiscoveryFiles()
else if (process.argv[2] === 'dist') await writeRoutePages()
else throw new Error('Usage: node scripts/generate-seo.mjs public|dist')
