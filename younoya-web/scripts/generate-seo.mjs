import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { PRODUCTS } from '../src/data/products.js'
import { getSeo, indexableRoutes, SITE_URL } from '../src/seo/metadata.js'

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicRoot = path.join(appRoot, 'public')
const distRoot = path.join(appRoot, 'dist')
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
const escapeXml = escapeHtml
const routes = indexableRoutes()

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
]

async function writeDiscoveryFiles() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(route => `  <url><loc>${escapeXml(`${SITE_URL}${route}`)}</loc></url>`).join('\n')}\n</urlset>\n`
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
  const listing = PRODUCTS.map(product => `- [${product.name}](${SITE_URL}/product/${product.handle}): ${product.tagline}. Displayed price ${product.price}.`).join('\n')
  const llms = `# Younoya\n\n> Intentional gifting and considered keepsakes inspired by astrology. Younoya helps visitors explore meaningful objects for people, occasions and new beginnings.\n\n## Explore\n\n- [The boutique story](${SITE_URL}/): a scroll-led visit to Younoya.\n- [The collection](${SITE_URL}/shop): eight keepsakes with product details and displayed prices.\n- [Let Younoya choose](${SITE_URL}/find-a-gift): an interactive, local gift-selection preview. The current preview is not a full Vedic astrology or AI reading.\n- [The Journal](${SITE_URL}/blog): stories of intention, ritual and astrology-backed gifting.\n\n## The collection\n\n${listing}\n\n## Notes\n\nProduct pages describe each object’s displayed price, materials, intentions and care. Prices and availability should be confirmed on the storefront before purchasing.\n`
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
  if (route === '/') return `<main><h1>Younoya — meaningful gifts and keepsakes</h1><p>${escapeHtml(seo.description)}</p><p><a href="/shop">Explore the collection</a> or <a href="/find-a-gift">let Younoya help you choose</a>.</p></main>`
  if (route === '/shop') return `<main><h1>The Younoya collection</h1><p>${escapeHtml(seo.description)}</p><ul>${PRODUCTS.map(product => `<li><a href="/product/${product.handle}">${escapeHtml(product.name)}</a> — ${escapeHtml(product.price)}</li>`).join('')}</ul></main>`
  if (route === '/find-a-gift') return `<main><h1>Let Younoya help you choose</h1><p>${escapeHtml(seo.description)}</p><p><a href="/shop">Explore the collection</a>.</p></main>`
  if (route === '/blog') return `<main><h1>The Younoya Journal</h1><p>${escapeHtml(seo.description)}</p><p><a href="/shop">Explore keepsakes</a> or read our stories.</p></main>`
  if (route.startsWith('/blog/')) return `<main><nav><a href="/blog">The Journal</a></nav><h1>${escapeHtml(seo.title)}</h1><p>${escapeHtml(seo.description)}</p><p><a href="/shop">Explore keepsakes</a>.</p></main>`
  const product = seo.product
  if (product) return `<main><nav><a href="/shop">The collection</a></nav><h1>${escapeHtml(product.name)}</h1><p>${escapeHtml(product.subtitle)}</p><p>${escapeHtml(product.price)}</p><p>${escapeHtml(product.intentionStory)}</p><h2>Materials</h2><ul>${Object.values(product.materials).map(value => `<li>${escapeHtml(value)}</li>`).join('')}</ul></main>`
  return `<main><h1>${escapeHtml(seo.title)}</h1><p>${escapeHtml(seo.description)}</p></main>`
}

function routeHtml(template, route) {
  const seo = getSeo(route)
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

async function writeRoutePages() {
  const template = await readFile(path.join(distRoot, 'index.html'), 'utf8')
  for (const route of [...routes, ...ADMIN_SHELL_ROUTES]) {
    const target = route === '/' ? path.join(distRoot, 'index.html') : path.join(distRoot, route.slice(1), 'index.html')
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, routeHtml(template, route), 'utf8')
  }
  const notFound = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,follow"><title>Page not found | Younoya</title></head><body><main><h1>This path has wandered.</h1><p><a href="/shop">Explore the Younoya collection</a>.</p></main></body></html>`
  await writeFile(path.join(distRoot, '404.html'), notFound, 'utf8')
  console.log(`Generated ${routes.length} crawlable route shells, ${ADMIN_SHELL_ROUTES.length} admin shells, and 404.html.`)
}

if (process.argv[2] === 'public') await writeDiscoveryFiles()
else if (process.argv[2] === 'dist') await writeRoutePages()
else throw new Error('Usage: node scripts/generate-seo.mjs public|dist')
