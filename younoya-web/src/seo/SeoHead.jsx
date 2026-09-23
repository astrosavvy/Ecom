import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getSeo, SITE_URL } from './metadata'

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

export default function SeoHead() {
  const { pathname } = useLocation()
  useEffect(() => {
    const seo = getSeo(pathname)
    document.title = seo.title
    setMeta('name', 'description', seo.description)
    setMeta('name', 'robots', seo.noindex ? 'noindex,follow' : 'index,follow')
    setMeta('property', 'og:title', seo.title)
    setMeta('property', 'og:description', seo.description)
    setMeta('property', 'og:type', seo.product ? 'product' : 'website')
    setMeta('property', 'og:url', `${SITE_URL}${seo.path}`)
    if (seo.image) setMeta('property', 'og:image', `${SITE_URL}${seo.image}`)
    else document.head.querySelector('meta[property="og:image"]')?.remove()
    setMeta('name', 'twitter:card', 'summary_large_image')
    let canonical = document.head.querySelector('link[rel="canonical"]')
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
  }, [pathname])
  return null
}
