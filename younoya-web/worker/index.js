import { blogSlug, getBlogSeo } from '../src/seo/blog.js'
import { getSeo, indexableRoutes } from '../src/seo/metadata.js'
import { articleFallback, journalFallback, renderSeoHtml, renderSitemap } from '../src/seo/html.js'
import { readPublishedPost, readPublishedPosts } from '../src/seo/publicBlog.js'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const path = url.pathname.replace(/\/+$/, '') || '/'
    const journalPath = path === '/journal' || path.startsWith('/journal/')
    if (journalPath || ((path === '/blog' || path.startsWith('/blog/')) && (url.pathname !== path || path.endsWith('/index.html')))) {
      url.pathname = path.replace(/^\/journal/, '/blog').replace(/\/index\.html$/, '')
      return Response.redirect(url.href, 301)
    }
    if (path !== '/sitemap.xml' && path !== '/blog' && !path.startsWith('/blog/')) return env.ASSETS.fetch(request)
    if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } })

    const options = { apiBase: env.PUBLIC_API_BASE, key: env.PUBLIC_STOREFRONT_KEY }
    try {
      if (path === '/sitemap.xml') {
        const posts = await readPublishedPosts(options)
        return new Response(request.method === 'HEAD' ? null : renderSitemap(indexableRoutes(posts)), { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=0, must-revalidate' } })
      }
      // Never reuse the home's noindex/canonical as an article's initial response.
      const assetUrl = new URL('/shop', url)
      const asset = await env.ASSETS.fetch(new Request(assetUrl, { headers: { Accept: 'text/html' } }))
      if (!asset.ok) throw new Error('Storefront HTML unavailable')
      const template = await asset.text()
      let seo, fallback, bootstrap, status = 200
      if (path === '/blog') {
        const posts = await readPublishedPosts(options)
        seo = getSeo('/blog', undefined, posts)
        fallback = journalFallback(posts)
        bootstrap = { posts, count: posts.length, generatedAt: Date.now() }
      } else {
        const slug = blogSlug(path)
        const post = slug ? await readPublishedPost(slug, options) : null
        if (post) {
          seo = getBlogSeo(post)
          fallback = articleFallback(post)
          bootstrap = { post, generatedAt: Date.now() }
        } else {
          status = 404
          seo = { path, title: 'Chapter not found | Younoya', description: 'This story is not available. Explore the Younoya Journal.', noindex: true }
          fallback = '<main><h1>Chapter not found</h1><a href="/blog">Return to the Journal</a></main>'
          bootstrap = { post: null, slug, generatedAt: Date.now() }
        }
      }
      const html = renderSeoHtml(template, seo, { fallback, bootstrap })
      return new Response(request.method === 'HEAD' ? null : html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache', 'X-Robots-Tag': seo.noindex ? 'noindex,follow' : 'index,follow' } })
    } catch {
      // A provider outage is transient, not an index-blocking 200 or cached 404.
      return new Response(request.method === 'HEAD' ? null : 'The Journal is temporarily unavailable. Please try again shortly.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'Retry-After': '60' } })
    }
  },
}
