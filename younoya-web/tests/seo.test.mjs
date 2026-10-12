import { test } from 'node:test'
import assert from 'node:assert/strict'
import worker from '../worker/index.js'
import { getSeo, getInitialSeo, indexableRoutes, SITE_URL } from '../src/seo/metadata.js'
import { getBlogSeo } from '../src/seo/blog.js'
import { renderSeoHtml } from '../src/seo/html.js'
import { readPublishedPost, readPublishedPosts } from '../src/seo/publicBlog.js'
import { fetchBlogPostResult, fetchBlogPosts, readBlogBootstrap } from '../src/lib/api.js'

const post = { slug: 'navratri-shringaar-box', title: 'Navratri Shringaar Box', content: '<h2>A daily ritual</h2><p>Nine kits for Maa Durga.</p>', excerpt: 'Devotion &amp; thoughtful gifting.', cover_image: 'https://api.younoya.com/static/navratri.webp', published: true, published_at: '2026-10-12T10:26:36.062Z' }
const template = '<!doctype html><html><head><title>Coming Soon</title><meta name="description" content="Home"><meta name="robots" content="noindex"><meta name="googlebot" content="noindex"><link rel="canonical" href="https://younoya.com/"><meta property="og:image" content="old"><script type="application/ld+json" data-younoya-seo>{}</script></head><body><div id="root"></div><script type="module" src="/assets/app.js"></script><noscript>Home</noscript></body></html>'
const json = (value, status = 200) => Response.json(value, { status })
const env = { ASSETS: { fetch: async () => new Response(template, { headers: { 'Content-Type': 'text/html' } }) } }

test('public pages index; home, Q&A and private routes stay excluded', () => {
  for (const route of ['/shop', '/blog', '/product/navratri-shringaar-box', '/terms-and-conditions', '/privacy-policy', '/shipping-policy', '/contact', '/cancellation-and-refunds']) assert.equal(Boolean(getSeo(route).noindex), false, route)
  for (const route of ['/', '/find-a-gift', '/checkout', '/account/orders', '/account/orders/order_1', '/admin', '/admin/orders', '/offer/private', '/missing']) assert.equal(getSeo(route).noindex, true, route)
  const routes = indexableRoutes([post])
  assert(routes.includes('/blog/navratri-shringaar-box'))
  assert(!routes.includes('/'))
  assert(!routes.includes('/find-a-gift'))
})

test('an admin-published slug receives article metadata without a hard-coded allowlist', () => {
  const seo = getSeo('/blog/new-story', undefined, [{ ...post, slug: 'new-story' }])
  assert.equal(seo.path, '/blog/new-story')
  assert.equal(seo.article, true)
  assert.equal(seo.description, 'Devotion & thoughtful gifting.')
  assert.equal(seo.schema[0].image, post.cover_image)
  assert.equal(seo.schema[0].mainEntityOfPage['@id'], `${SITE_URL}/blog/new-story`)
  assert.equal(Boolean(getSeo('/blog/new-story').noindex), false, 'loading a new slug must not inject noindex')
})

test('SPA navigation with expired or unrelated bootstrap data retains correct route metadata', () => {
  for (const route of ['/blog', '/shop', '/', '/find-a-gift', '/contact']) {
    assert.deepEqual(getInitialSeo(route, 'coming-soon', null), getSeo(route))
    assert.deepEqual(getInitialSeo(route, 'coming-soon', { post }), getSeo(route))
  }
  assert.deepEqual(getInitialSeo(`/blog/${post.slug}`, 'coming-soon', { post }), getBlogSeo(post))
})

test('HTML replaces conflicting directives and safely escapes published text/bootstrap', () => {
  const malicious = { ...post, title: '<img src=x onerror=alert(1)>Title', content: '</script><script>alert(1)</script><p>Real article</p>' }
  const html = renderSeoHtml(template, getBlogSeo(malicious), { bootstrap: { post: malicious } })
  assert.equal((html.match(/name="robots"/g) || []).length, 1)
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1)
  assert.equal((html.match(/data-younoya-seo/g) || []).length, 1)
  assert(!html.includes('noindex'))
  assert(!html.includes('<script>alert(1)'))
  assert(html.includes('src="/assets/app.js"'), 'retain the React bundle')
  assert(html.includes('\\u003c/script>'))
})

test('published listing pagination discovers articles beyond the first page and omits drafts', async () => {
  const calls = []
  const entries = Array.from({ length: 30 }, (_, i) => ({ ...post, slug: `story-${i}`, published: i !== 2 }))
  const posts = await readPublishedPosts({ fetcher: async url => { const offset = Number(new URL(url).searchParams.get('offset')); calls.push(offset); return json({ posts: entries.slice(offset, offset + 24), count: 30 }) } })
  assert.deepEqual(calls, [0, 24])
  assert.equal(posts.length, 29)
  assert(posts.some(post => post.slug === 'story-29'))
  assert(!posts.some(post => post.slug === 'story-2'))
})

test('invalid or incomplete provider responses are errors, not empty successful sitemaps', async () => {
  await assert.rejects(readPublishedPosts({ fetcher: async () => json({ posts: [], count: 10 }) }), /Incomplete/)
  await assert.rejects(readPublishedPosts({ fetcher: async () => json({ posts: [], count: '10' }) }), /Invalid/)
  await assert.rejects(readPublishedPost(post.slug, { fetcher: async () => json({ post: { ...post, slug: 'wrong-slug' } }) }), /Invalid/)
  assert.equal(await readPublishedPost(post.slug, { fetcher: async () => json({ post: { ...post, published: false } }) }), null)
})

async function withProvider(fetcher, fn) {
  const previous = globalThis.fetch
  globalThis.fetch = fetcher
  try { await fn() } finally { globalThis.fetch = previous }
}

test('direct article GET serves indexable HTML, its own canonical and full text before JS', async () => {
  await withProvider(async (url, options) => {
    assert.equal(url, 'https://api.younoya.com/store/blog/posts/navratri-shringaar-box')
    assert.equal(options.headers.Cookie, undefined)
    return json({ post })
  }, async () => {
    const response = await worker.fetch(new Request(`${SITE_URL}/blog/${post.slug}`), env)
    const html = await response.text()
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('x-robots-tag'), 'index,follow')
    assert(html.includes(`href="${SITE_URL}/blog/${post.slug}"`))
    assert(html.includes('Nine kits for Maa Durga.'))
    assert(html.includes('id="younoya-blog-data"'))
    assert(!html.includes('Coming Soon'))
    assert(!html.includes('noindex'))
  })
})

test('the journal and sitemap reflect live publications, not legacy static routes', async () => {
  await withProvider(async () => json({ posts: [post, { ...post, slug: 'new-story' }], count: 2 }), async () => {
    const listing = await worker.fetch(new Request(`${SITE_URL}/blog`), env)
    const html = await listing.text()
    assert(html.includes('href="/blog/new-story"'))
    assert(html.includes(`${SITE_URL}/blog/new-story`))
    const sitemap = await worker.fetch(new Request(`${SITE_URL}/sitemap.xml`), env)
    const xml = await sitemap.text()
    assert.equal(sitemap.status, 200)
    assert(xml.includes(`<loc>${SITE_URL}/blog/new-story</loc>`))
    assert(!xml.includes(`<loc>${SITE_URL}/</loc>`))
    assert(!xml.includes('/find-a-gift'))
    assert(!xml.includes('/checkout'))
    assert(!xml.includes('/account/'))
    assert(!xml.includes('thoughtful-gifts-inspired-by-astrology'))
  })
})

test('missing and unpublished posts return noncached 404/noindex, never the home shell', async () => {
  for (const provider of [() => json({ message: 'Post not found' }, 404), () => json({ post: { ...post, published: false } })]) {
    await withProvider(provider, async () => {
      const response = await worker.fetch(new Request(`${SITE_URL}/blog/${post.slug}`), env)
      assert.equal(response.status, 404)
      assert.equal(response.headers.get('x-robots-tag'), 'noindex,follow')
      const html = await response.text()
      assert(!html.includes('rel="canonical"'))
      assert(!html.includes('Coming Soon'))
      assert(!html.includes('Nine kits for Maa Durga.'))
    })
  }
})

test('outages, timeouts and malformed posts return retryable 503 without indexing directives', async () => {
  for (const provider of [() => { throw new Error('timeout') }, () => json({}, 502), () => json({ post: {} })]) {
    await withProvider(provider, async () => {
      const response = await worker.fetch(new Request(`${SITE_URL}/blog/${post.slug}`), env)
      assert.equal(response.status, 503)
      assert.equal(response.headers.get('retry-after'), '60')
      assert.equal(response.headers.get('cache-control'), 'no-store')
      assert.equal(response.headers.get('x-robots-tag'), null)
    })
  }
})

test('HEAD, canonical redirects, invalid nested slugs and asset passthrough', async () => {
  await withProvider(async () => json({ post }), async () => {
    const head = await worker.fetch(new Request(`${SITE_URL}/blog/${post.slug}`, { method: 'HEAD' }), env)
    assert.equal(head.status, 200)
    assert.equal(await head.text(), '')
  })
  for (const [path, target] of [['/journal/navratri-shringaar-box', '/blog/navratri-shringaar-box'], ['/blog/navratri-shringaar-box/', '/blog/navratri-shringaar-box'], ['/blog/index.html', '/blog']]) {
    const response = await worker.fetch(new Request(`${SITE_URL}${path}`), env)
    assert.equal(response.status, 301)
    assert.equal(response.headers.get('location'), `${SITE_URL}${target}`)
  }
  assert.equal((await worker.fetch(new Request(`${SITE_URL}/blog/${post.slug}`, { method: 'POST' }), env)).status, 405)
  assert.equal((await worker.fetch(new Request(`${SITE_URL}/blog/invalid/nested`), env)).status, 404)
  assert.equal(await (await worker.fetch(new Request(`${SITE_URL}/shop`), env)).text(), template)
})

test('client shares article requests and distinguishes removal from transient failure', async () => {
  let requests = 0
  await withProvider(async () => { requests++; return json({ post }) }, async () => {
    const results = await Promise.all([fetchBlogPostResult(post.slug), fetchBlogPostResult(post.slug)])
    assert.equal(requests, 1)
    assert.equal(results[0].post.slug, post.slug)
    assert.equal(results[1].unavailable, false)
  })
  await withProvider(async () => json({}, 404), async () => {
    const result = await fetchBlogPostResult('thoughtful-gifts-inspired-by-astrology')
    assert.equal(result.post, null, 'do not resurrect a removed article from the legacy fallback')
    assert.equal(result.unavailable, false)
  })
  await withProvider(async () => { throw new Error('network failure') }, async () => {
    assert.equal((await fetchBlogPostResult(post.slug)).unavailable, true)
  })
})

test('client honours an empty published list and rejects stale/draft bootstrap', async () => {
  await withProvider(async () => json({ posts: [], count: 0 }), async () => {
    assert.deepEqual(await fetchBlogPosts(), { posts: [], count: 0 })
  })
  const previous = globalThis.document
  let value
  globalThis.document = { getElementById: () => ({ textContent: JSON.stringify(value) }) }
  try {
    value = { post, generatedAt: Date.now() - 120000 }
    assert.equal(readBlogBootstrap(), null)
    value = { post: { ...post, published: false }, generatedAt: Date.now() }
    assert.equal(readBlogBootstrap(), null)
    value = { post, generatedAt: Date.now() }
    assert.equal(readBlogBootstrap().post.slug, post.slug)
    await withProvider(() => { throw new Error('must not refetch fresh bootstrap') }, async () => {
      assert.equal((await fetchBlogPostResult(post.slug)).unavailable, false)
    })
  } finally { if (previous === undefined) delete globalThis.document; else globalThis.document = previous }
})
