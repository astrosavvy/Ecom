import productEditorial from './productEditorial.js'

// Product facts and editorial copy come from the updated YOUNOYA brooch collection document.
// Names retain established storefront URLs where possible; imagery maps to P55–P64.
const catalog = [
  { handle: 'wild-poise', name: 'WILD POISE', motif: 'Jaguar', intention: 'confidence-power', element: 'earth', photos: 3, related: ['cats-eye', 'fire-and-radiance', 'the-inner-kingdom'] },
  { handle: 'the-golden-flight', name: 'PHOENIX RENEWAL — RISE', motif: 'Red Phoenix', intention: 'confidence-power', element: 'fire', photos: 3, related: ['the-verdant-rising', 'fire-and-radiance', 'wild-poise'] },
  { handle: 'the-verdant-rising', name: 'PHOENIX RENEWAL — FLOURISH', motif: 'Green Phoenix', intention: 'vitality-balance', element: 'earth', photos: 3, related: ['the-golden-flight', 'flamingo-grace', 'golden-instinct'] },
  { handle: 'flamingo-grace', name: 'FLAMINGO GRACE', motif: 'Flamingo', intention: 'love-connection', element: 'water', photos: 3, related: ['flamingo-aura', 'vivid-toucan-muse', 'the-verdant-rising'] },
  { handle: 'vivid-toucan-muse', name: 'VIVID TOUCAN MUSE', motif: 'Toucan', intention: 'confidence-power', element: 'air', photos: 3, related: ['flamingo-aura', 'the-golden-flight', 'cats-eye'] },
  { handle: 'golden-instinct', name: 'GOLDEN INSTINCT', motif: 'Squirrel', intention: 'wealth-prosperity', element: 'earth', photos: 3, related: ['the-inner-kingdom', 'wild-poise', 'the-verdant-rising'] },
  { handle: 'fire-and-radiance', name: 'FIRE & RADIANCE', motif: 'Scorpion', intention: 'protection', element: 'fire', photos: 3, related: ['wild-poise', 'the-golden-flight', 'cats-eye'] },
  { handle: 'flamingo-aura', name: 'FLAMINGO AURA', motif: 'Flamingo', intention: 'vitality-balance', element: 'water', photos: 3, related: ['flamingo-grace', 'vivid-toucan-muse', 'cats-eye'] },
  { handle: 'cats-eye', name: 'CAT’S EYE', motif: 'Cat', intention: 'protection', element: 'air', photos: 2, related: ['wild-poise', 'the-inner-kingdom', 'flamingo-aura'] },
  { handle: 'the-inner-kingdom', name: 'THE INNER KINGDOM', motif: 'Sculptural animals', intention: 'wealth-prosperity', element: 'earth', photos: 3, related: ['wild-poise', 'golden-instinct', 'cats-eye'] },
]

export const PRODUCTS = catalog.map((item, index) => {
  const editorial = productEditorial[item.handle]
  const photoRoot = `/media/products/${item.handle}`
  return {
    id: item.handle,
    handle: item.handle,
    chapter: String(index + 1).padStart(2, '0'),
    badge: `PIECE ${String(index + 1).padStart(2, '0')}`,
    name: item.name,
    shopName: {
      'the-golden-flight': 'PHOENIX RISE',
      'the-verdant-rising': 'PHOENIX FLOURISH',
      'vivid-toucan-muse': 'TOUCAN MUSE',
    }[item.handle] || item.name,
    subtitle: editorial.subtitle,
    tagline: editorial.intention.split('\n').find(line => line.includes(' · ')).split(' · ').slice(0, 3).join(' · '),
    motif: item.motif,
    price: `₹ ${editorial.priceNum.toLocaleString('en-IN')}`,
    priceNum: editorial.priceNum,
    currency: '₹',
    intention: item.intention,
    element: item.element,
    primaryImage: `${photoRoot}-01.webp`,
    cardImage: `${photoRoot}-card.webp`,
    shopCardImage: index < 5 ? `/media/shop-${item.handle}-card.webp` : undefined,
    galleryImages: Array.from({ length: item.photos }, (_, imageIndex) => `${photoRoot}-${String(imageIndex + 1).padStart(2, '0')}.webp`),
    intentionStory: editorial.intro,
    editorial,
    specs: { dimensions: editorial.dimensions, weight: editorial.weight, color: editorial.color, pack: editorial.pack },
    relatedHandles: item.related,
  }
})

export function getProductByHandle(handle) {
  return PRODUCTS.find(product => product.handle === handle)
}

export function getRelatedProducts(product) {
  return product.relatedHandles.map(handle => getProductByHandle(handle)).filter(Boolean)
}
