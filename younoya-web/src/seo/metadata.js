import { PRODUCTS } from '../data/products.js'
import { POLICY_ROUTES } from '../data/policies.js'

export const SITE_URL = 'https://younoya.com'

export const KNOWN_POSTS = [
  {
    slug: 'why-younoya-is-different-from-a-traditional-astrology-store',
    title: 'Why Younoya Is Different From a Traditional Astrology Store',
    description: 'Explore how Younoya reimagines astrology-inspired gifting through handcrafted keepsakes, intentional aesthetics, and authentic symbolism.',
    image: '/media/blog/why-younoya-is-different.webp',
    published_at: '2026-09-29T08:57:59.260Z',
  },
  {
    slug: 'thoughtful-gifts-inspired-by-astrology',
    title: 'Thoughtful Gifts Inspired by Astrology',
    description: 'Explore how aligning keepsakes with planetary energies and sacred intentions creates gifts of enduring resonance.',
    image: '/media/blog/thoughtful-gifts-inspired-by-astrology.webp',
    published_at: '2026-09-07T07:18:57.806Z',
  },
]

const absolute = path => `${SITE_URL}${path}`
const cleanPath = path => path === '/' ? '/' : path.replace(/\/+$/, '')

export function getSeo(pathname, storefrontMode = 'coming-soon') {
  const path = cleanPath(pathname)

  if (path === '/') return {
    path,
    title: storefrontMode === 'coming-soon' ? 'YOUNOYA — Coming Soon | Astrology-Backed Gifting' : 'YOUNOYA | Meaningful Gifts & Keepsakes',
    description: storefrontMode === 'coming-soon' ? 'Younoya is preparing to open its doors. Astrology-backed gifting for every chapter.' : 'Explore the Younoya collection of meaningful keepsakes and considered gifts, with personal guidance for every chapter.',
    image: '/media/diorama-arrival-desktop.webp',
    schema: [
      { '@context': 'https://schema.org', '@type': 'Organization', name: 'Younoya', url: SITE_URL, logo: absolute('/brand.webp') },
      { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Younoya', url: SITE_URL, description: 'Astrology-backed gifting, curated gift hampers, and consecrated keepsakes.' },
    ],
  }

  if (POLICY_ROUTES[path]) return { path, title: `${POLICY_ROUTES[path]} | Younoya`,
    description: `${POLICY_ROUTES[path]} for YOUNOYA HOUSE OF ASTRO PRIVATE LIMITED. Shipping, order care and assistance at support@younoya.com.`,
    schema: { '@context': 'https://schema.org', '@type': path === '/contact' ? 'ContactPage' : 'WebPage', name: POLICY_ROUTES[path], url: absolute(path) } }
  if (path.startsWith('/account/')) return { path, title: 'Your orders | Younoya', description: 'Your private Younoya order history and atelier support.', noindex: true }
  if (path === '/shop') return {
    path,
    title: 'Explore Meaningful Gifts & Keepsakes | Younoya',
    description: 'Discover the nine-day Navratri Shringaar Box and the Younoya brooch collection. Considered rituals and symbolic keepsakes for every chapter.',
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
    title: product.seoTitle || `${product.name} | Younoya`,
    description: product.seoDescription || `${product.name} — ${product.tagline}. Explore its symbolism, measured details and price at Younoya.`,
    image: product.primaryImage,
    product,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.displayName || product.name,
        image: product.gallery ? product.gallery.map(photo => absolute(photo.src)) : absolute(product.primaryImage),
        description: product.intentionStory,
        brand: { '@type': 'Brand', name: 'Younoya' },
        ...(product.kind === 'ritual-box' ? { sku: product.sku } : { offers: { '@type': 'Offer', url: absolute(path), priceCurrency: 'INR', price: product.priceNum } }),
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

  if (path === '/checkout' || path.startsWith('/offer/')) return {
    path,
    title: path === '/checkout' ? 'Secure checkout | Younoya' : 'Private edition | Younoya',
    description: 'A Younoya selection chosen with intention. Current price and availability are checked at checkout.',
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
    ...Object.keys(POLICY_ROUTES),
    ...KNOWN_POSTS.map(post => `/blog/${post.slug}`),
    ...PRODUCTS.map(product => `/product/${product.handle}`),
  ]
}
