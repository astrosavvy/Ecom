import { SITE_URL } from './site.js'
import { absoluteImage, getBlogSeo, plainText } from './blog.js'

export const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
const jsonForHtml = value => JSON.stringify(value).replace(/</g, '\\u003c')

export function renderSitemap(routes) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(routes)].map(route => `  <url><loc>${escapeHtml(`${SITE_URL}${route}`)}</loc></url>`).join('\n')}\n</urlset>\n`
}

export function articleFallback(post) {
  const paragraphs = plainText(post.content).split(/\n\s*\n/).filter(Boolean)
  return `<main><article><nav><a href="/blog">The Journal</a></nav><h1>${escapeHtml(plainText(post.title))}</h1><p>By ${escapeHtml(post.author || 'YOUNOYA Atelier')}</p>${paragraphs.map(text => `<p>${escapeHtml(text)}</p>`).join('')}<p><a href="/shop">Explore the collection</a></p></article></main>`
}

export function journalFallback(posts) {
  return `<main><h1>The Younoya Journal</h1><ul>${posts.map(post => `<li><a href="/blog/${escapeHtml(post.slug)}">${escapeHtml(plainText(post.title))}</a><p>${escapeHtml(getBlogSeo(post).description)}</p></li>`).join('')}</ul><a href="/shop">Explore the collection</a></main>`
}

// Used by both the build and the edge: replace, never accumulate conflicting tags.
export function renderSeoHtml(template, seo, { fallback = '', bootstrap } = {}) {
  const canonical = `${SITE_URL}${seo.path}`
  const tags = [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}">`,
    `<meta name="robots" content="${seo.noindex ? 'noindex,follow' : 'index,follow'}">`,
    ...(!seo.noindex ? [`<link rel="canonical" href="${escapeHtml(canonical)}">`, '<link rel="describedby" href="/llms.txt" type="text/plain">'] : []),
    '<meta property="og:site_name" content="Younoya">',
    '<meta property="og:locale" content="en_IN">',
    `<meta property="og:type" content="${seo.product ? 'product' : seo.article ? 'article' : 'website'}">`,
    `<meta property="og:title" content="${escapeHtml(seo.title)}">`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}">`,
    `<meta property="og:url" content="${escapeHtml(canonical)}">`,
    ...(absoluteImage(seo.image) ? [`<meta property="og:image" content="${escapeHtml(absoluteImage(seo.image))}">`] : []),
    '<meta name="twitter:card" content="summary_large_image">',
    ...(seo.schema ? [`<script type="application/ld+json" data-younoya-seo>${jsonForHtml(seo.schema)}</script>`] : []),
    ...(bootstrap ? [`<script type="application/json" id="younoya-blog-data">${jsonForHtml(bootstrap)}</script>`] : []),
  ]
  return template
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\b[^>]*(?:name=["'](?:description|robots|googlebot|bingbot|twitter:[^"']+)["']|property=["']og:[^"']+["'])[^>]*>/gi, '')
    .replace(/<link\b[^>]*rel=["'](?:canonical|describedby)["'][^>]*>/gi, '')
    .replace(/<script\b[^>]*(?:data-younoya-seo|id=["']younoya-blog-data["'])[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, '')
    .replace('</head>', `${tags.join('\n    ')}\n  </head>`)
    .replace('</body>', `${fallback ? `<noscript>${fallback}</noscript>` : ''}\n  </body>`)
    .replace(/^[\t ]+$/gm, '')
}
