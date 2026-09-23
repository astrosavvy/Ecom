import { PRODUCTS } from '../data/products.js'

export const SITE_URL = 'https://younoya.com'

const absolute = path => `${SITE_URL}${path}`
const cleanPath = path => path === '/' ? '/' : path.replace(/\/+$/, '')

export function getSeo(pathname) {
  const path = cleanPath(pathname)
  if (path === '/') return {
    path, title: 'Meaningful Gifts & Keepsakes | Younoya',
    description: 'Explore Younoya’s intentional keepsakes and astrology-inspired gifting. Follow the boutique story, discover the collection, or let us guide your choice.',
    image: '/media/diorama-handover-desktop.webp',
    schema: [
      { '@context': 'https://schema.org', '@type': 'Organization', name: 'Younoya', url: SITE_URL, logo: absolute('/brand.webp') },
      { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Younoya', url: SITE_URL, description: 'Meaningful gifts and keepsakes chosen with intention.' },
    ],
  }
  if (path === '/shop') return {
    path, title: 'Explore Meaningful Gifts & Keepsakes | Younoya',
    description: 'Explore eight considered Younoya keepsakes for connection, new beginnings, balance and abundance. Discover each object’s story, materials and price.',
    image: PRODUCTS[0].primaryImage,
    schema: {
      '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'The Younoya Collection', url: absolute(path),
      description: 'Considered keepsakes for the people and moments that matter.',
      mainEntity: { '@type': 'ItemList', itemListElement: PRODUCTS.map((product, index) => ({ '@type': 'ListItem', position: index + 1, name: product.name, url: absolute(`/product/${product.handle}`) })) },
    },
  }
  if (path === '/find-a-gift') return {
    path, title: 'Let Younoya Help You Choose a Gift',
    description: 'Tell us the occasion and the person you have in mind. Explore a guided Younoya gift edit with meaningful keepsakes chosen for your moment.',
    image: '/media/guide-listen.webp',
    schema: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Let Younoya Help You Choose a Gift', url: absolute(path) },
  }
  const handle = path.match(/^\/product\/([a-z0-9-]+)$/)?.[1]
  const product = PRODUCTS.find(item => item.handle === handle)
  if (product) return {
    path, title: `${product.name} | Younoya`,
    description: `${product.name} — ${product.tagline}. Discover its story and materials at Younoya.`,
    image: product.primaryImage,
    product,
    schema: [
      {
        '@context': 'https://schema.org', '@type': 'Product', name: product.name,
        image: absolute(product.primaryImage), description: product.intentionStory,
        brand: { '@type': 'Brand', name: 'Younoya' },
        offers: { '@type': 'Offer', url: absolute(path), priceCurrency: 'INR', price: product.priceNum },
      },
      {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'The collection', item: absolute('/shop') },
          { '@type': 'ListItem', position: 3, name: product.name, item: absolute(path) },
        ],
      },
    ],
  }
  return { path, title: 'Page not found | Younoya', description: 'Explore the Younoya collection of meaningful gifts and keepsakes.', noindex: true }
}

export function indexableRoutes() {
  return ['/', '/shop', '/find-a-gift', ...PRODUCTS.map(product => `/product/${product.handle}`)]
}
