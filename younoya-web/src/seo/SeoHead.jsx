import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getSeo, getInitialSeo, SITE_URL } from './metadata'
import { useSiteConfig } from '../context/SiteConfigContext'
import { fetchBlogPostResult, fetchBlogPosts, readBlogBootstrap } from '../lib/api'
import { absoluteImage, blogSlug, getBlogSeo } from './blog'

function setMeta(attribute, key, content) {
  const elements = [...document.head.querySelectorAll(`meta[${attribute}="${key}"]`)]
  let element = elements.shift()
  elements.forEach(element => element.remove())
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

export default function SeoHead() {
  const { pathname } = useLocation()
  const { storefrontMode } = useSiteConfig()
  useEffect(() => {
    let active = true
    const slug = blogSlug(pathname)
    const bootstrap = readBlogBootstrap()
    // Preserve the edge's article metadata while its content is being loaded.
    const initial = getInitialSeo(pathname, storefrontMode, bootstrap)
    applySeo(initial)
    if (slug) fetchBlogPostResult(slug).then(({ post, unavailable }) => {
      if (!active || unavailable) return
      applySeo(post ? getBlogSeo(post) : { path: pathname, title: 'Chapter not found | Younoya', description: 'This story is not available. Explore the Younoya Journal.', noindex: true })
    })
    else if (pathname.replace(/\/+$/, '') === '/blog') fetchBlogPosts().then(({ posts }) => { if (active) applySeo(getSeo('/blog', storefrontMode, posts)) })
    return () => { active = false }
  }, [pathname,storefrontMode])
  return null
}

function applySeo(seo) {
  document.title = seo.title
  setMeta('name', 'description', seo.description)
  setMeta('name', 'robots', seo.noindex ? 'noindex,follow' : 'index,follow')
  setMeta('property', 'og:title', seo.title)
  setMeta('property', 'og:description', seo.description)
  document.head.querySelectorAll('meta[name="googlebot"], meta[name="bingbot"]').forEach(element => element.remove())
  setMeta('property', 'og:type', seo.product ? 'product' : seo.article ? 'article' : 'website')
  setMeta('property', 'og:url', `${SITE_URL}${seo.path}`)
  if (absoluteImage(seo.image)) setMeta('property', 'og:image', absoluteImage(seo.image))
  else document.head.querySelector('meta[property="og:image"]')?.remove()
  setMeta('name', 'twitter:card', 'summary_large_image')
  const canonicals = [...document.head.querySelectorAll('link[rel="canonical"]')]
  let canonical = canonicals.shift()
  canonicals.forEach(element => element.remove())
  if (!seo.noindex) {
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
    canonical.href = `${SITE_URL}${seo.path}`
  } else canonical?.remove()
  document.head.querySelectorAll('script[data-younoya-seo]').forEach(element => element.remove())
  if (seo.schema) {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.younoyaSeo = ''
    script.textContent = JSON.stringify(seo.schema).replace(/</g, '\\u003c')
    document.head.appendChild(script)
  }
}
