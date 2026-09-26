import { PRODUCTS } from '../data/products.js'

export const SITE_URL = 'https://younoya.com'

export const KNOWN_POSTS = [
  {
    slug: 'thoughtful-gifts-inspired-by-astrology',
    title: 'Thoughtful Gifts Inspired by Astrology',
    description: 'Explore how aligning keepsakes with planetary energies and sacred intentions creates gifts of enduring resonance.',
    image: 'https://api.younoya.com/static/1788765534846-ChatGPT%20Image%20Sep%207,%202026,%2012_48_28%20PM.png',
    published_at: '2026-09-07T07:18:57.806Z',
  },
]

const absolute = path => `${SITE_URL}${path}`
const cleanPath = path => path === '/' ? '/' : path.replace(/\/+$/, '')

export function getSeo(pathname) {
  const path = cleanPath(pathname)

  if (path === '/') return {
    path,
    title: 'YOUNOYA — Coming Soon | Astrology-Backed Gifting',
    description: 'Younoya is preparing to open its doors. Astrology-backed gifting, curated gift hampers, and consecrated Vedic keepsakes for every chapter.',
    image: '/media/diorama-arrival-desktop.webp',
    schema: [
      { '@context': 'https://schema.org', '@type': 'Organization', name: 'Younoya', url: SITE_URL, logo: absolute('/brand.webp') },
      { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Younoya', url: SITE_URL, description: 'Astrology-backed gifting, curated gift hampers, and consecrated keepsakes.' },
    ],
  }

  if (path === '/shop') return {
    path,
    title: 'Explore Meaningful Gifts & Keepsakes | Younoya',
    description: 'Explore eight considered Younoya keepsakes for connection, new beginnings, balance and abundance. Discover each object’s story, materials and price.',
    image: PRODUCTS[0].primaryImage,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'The Younoya Collection',
      url: absolute(path),
      description: 'Considered keepsakes for the people and moments that matter.',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: PRODUCTS.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: product.name,
          url: absolute(`/product/${product.handle}`),
        })),
      },
    },
  }

  if (path === '/find-a-gift') return {
    path,
    title: 'Let Younoya Help You Choose a Gift',
    description: 'Tell us the occasion and the person you have in mind. Explore a guided Younoya gift edit with meaningful keepsakes chosen for your moment.',
    image: '/media/guide-listen.webp',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Let Younoya Help You Choose a Gift',
      url: absolute(path),
    },
  }

  if (path === '/blog' || path === '/journal') return {
    path: '/blog',
    title: 'The Journal — Stories of Intention, Ritual & Affection | Younoya',
    description: 'Explore Younoya’s reflections on astrology-backed gifting, planetary resonance, and the sacred art of intentional keepsakes.',
    image: '/media/diorama-handover-desktop.webp',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'The Younoya Journal',
      url: absolute('/blog'),
      description: 'Stories of intention, ritual, and affection by Younoya Atelier.',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: KNOWN_POSTS.map((post, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: post.title,
          url: absolute(`/blog/${post.slug}`),
        })),
      },
    },
  }

  const blogSlug = path.match(/^\/blog\/([a-z0-9-]+)$/)?.[1]
  const blogPost = KNOWN_POSTS.find(item => item.slug === blogSlug)
  if (blogPost) return {
    path,
    title: `${blogPost.title} | Younoya Journal`,
    description: blogPost.description,
    image: blogPost.image,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: blogPost.title,
        description: blogPost.description,
        image: blogPost.image,
        datePublished: blogPost.published_at,
        author: { '@type': 'Organization', name: 'YOUNOYA Atelier', url: SITE_URL },
        publisher: { '@type': 'Organization', name: 'Younoya', logo: { '@type': 'ImageObject', url: absolute('/brand.webp') } },
        mainEntityOfPage: { '@type': 'WebPage', '@id': absolute(path) },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'The Journal', item: absolute('/blog') },
          { '@type': 'ListItem', position: 3, name: blogPost.title, item: absolute(path) },
        ],
      },
    ],
  }

  const handle = path.match(/^\/product\/([a-z0-9-]+)$/)?.[1]
  const product = PRODUCTS.find(item => item.handle === handle)
  if (product) return {
    path,
    title: `${product.name} | Younoya`,
    description: `${product.name} — ${product.tagline}. Discover its story and materials at Younoya.`,
    image: product.primaryImage,
    product,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: absolute(product.primaryImage),
        description: product.intentionStory,
        brand: { '@type': 'Brand', name: 'Younoya' },
        offers: { '@type': 'Offer', url: absolute(path), priceCurrency: 'INR', price: product.priceNum },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'The collection', item: absolute('/shop') },
          { '@type': 'ListItem', position: 3, name: product.name, item: absolute(path) },
        ],
      },
    ],
  }

  if (path.startsWith('/admin')) return {
    path,
    title: 'Console | Younoya',
    description: 'Younoya Management Console.',
    noindex: true,
  }

  return {
    path,
    title: 'Page not found | Younoya',
    description: 'Explore the Younoya collection of meaningful gifts and keepsakes.',
    noindex: true,
  }
}

export function indexableRoutes() {
  return [
    '/',
    '/shop',
    '/find-a-gift',
    '/blog',
    ...KNOWN_POSTS.map(post => `/blog/${post.slug}`),
    ...PRODUCTS.map(product => `/product/${product.handle}`),
  ]
}
