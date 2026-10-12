import { SITE_URL } from './site.js'

export const blogSlug = path => path.replace(/\/+$/, '').match(/^\/blog\/([a-z0-9-]+)$/)?.[1]
export const isPublishedPost = post => Boolean(post?.published === true && /^[a-z0-9-]+$/.test(post.slug) && typeof post.title === 'string' && post.title.trim() && typeof post.content === 'string')

export function plainText(value = '') {
  return String(value)
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<\/(?:p|div|h[1-6]|li|blockquote)>|<br\s*\/?>/gi, '\n\n')
    .replace(/<[^>]*>/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/(^|\n)#{1,6}\s+/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/&(?:amp|lt|gt|quot|apos|nbsp);|&#(?:\d+|x[0-9a-f]+);/gi, entity => {
      const named = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'", '&nbsp;': ' ' }
      if (named[entity.toLowerCase()]) return named[entity.toLowerCase()]
      const code = entity[2].toLowerCase() === 'x' ? parseInt(entity.slice(3, -1), 16) : Number(entity.slice(2, -1))
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : ''
    })
    .trim()
}

export function absoluteImage(image) {
  if (!image) return undefined
  try {
    const url = new URL(image, SITE_URL)
    return ['https:', 'http:'].includes(url.protocol) ? url.href : undefined
  } catch { return undefined }
}

export function getBlogSeo(post) {
  const path = `/blog/${post.slug}`
  const description = plainText(post.excerpt || post.description || post.content).replace(/\s+/g, ' ').slice(0, 180)
  const image = absoluteImage(post.cover_image || post.image)
  const date = value => value && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : undefined
  return {
    path,
    title: `${plainText(post.title)} | Younoya Journal`,
    description,
    image,
    article: true,
    schema: [
      {
        '@context': 'https://schema.org', '@type': 'BlogPosting',
        headline: plainText(post.title), description,
        ...(image ? { image } : {}),
        ...(date(post.published_at) ? { datePublished: date(post.published_at) } : {}),
        ...(date(post.updated_at) ? { dateModified: date(post.updated_at) } : {}),
        author: { '@type': 'Organization', name: post.author || 'YOUNOYA Atelier', url: SITE_URL },
        publisher: { '@type': 'Organization', name: 'Younoya', logo: { '@type': 'ImageObject', url: `${SITE_URL}/brand.webp` } },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${path}` },
      },
      {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'The collection', item: `${SITE_URL}/shop` },
          { '@type': 'ListItem', position: 2, name: 'The Journal', item: `${SITE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: plainText(post.title), item: `${SITE_URL}${path}` },
        ],
      },
    ],
  }
}
