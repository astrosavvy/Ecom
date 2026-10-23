import photos from './moneyAmplifierPhotos.json' with { type: 'json' }

export const MONEY_AMPLIFIER_HIGHLIGHTS = [
  ['Iridescent Crystal Kurma', 'Hand-carved crystalline tortoise symbolizing continuous wealth generation, stability, and enduring prosperity under Lord Vishnu and Goddess Lakshmi.'],
  ['Blue Marbled Hamsa Altar', 'Artisan hand-shaped mineral plate embodying the ancient sacred shield against evil nazar, jealousy, and unexpected financial drainage.'],
  ['2-in-1 Abundance Alchemy', 'A harmonious synergy designed to unblock earning opportunities while safeguarding and sustaining accumulated wealth.'],
  ['Consecrated Presentation', 'Accompanied by the YOUNOYA signature keepsake box, sacred placement guidance, and velvet resting cushioning.']
]

export const MONEY_AMPLIFIER_PRODUCT = {
  id: 'money-amplifier-protector-set',
  handle: 'money-amplifier-protector-set',
  sku: 'YN-MONEY-AMPLIFIER-001',
  kind: 'money-amplifier',
  name: 'YOUNOYA Money Amplifier & Protector Set',
  displayName: 'YOUNOYA Money Amplifier & Protector Set',
  shopName: 'MONEY AMPLIFIER & PROTECTOR SET',
  chapter: 'Abundance & Shield',
  badge: 'FESTIVE WEALTH EDIT',
  subtitle: 'Crystalline Kurma & Hamsa Evil Eye talisman',
  tagline: 'Amplify wealth flow · shield against evil nazar',
  motif: 'Wealth acceleration and sacred financial protection',
  price: '₹ 7,799',
  priceNum: 7799,
  currency: '₹',
  intention: 'wealth-prosperity',
  primaryImage: photos[0].src,
  cardImage: '/media/money-amplifier/card.webp',
  cardImageFallback: photos[0].fallback.thumbnail,
  gallery: photos,
  seoTitle: 'Money Amplifier & Protector Set | Younoya',
  seoDescription: 'Amplify your wealth and protect your financial sanctuary from evil nazar. Hand-carved crystal Kurma and blue marbled Hamsa altar by Younoya. ₹7,799.',
  intentionStory: 'Whether seeking new avenues of abundance or preserving and growing what has already been built, this 2-in-1 combination curated by YOUNOYA unites the wealth-multiplying resonance of the crystalline Kurma with the time-honoured shielding power of the blue marbled Hamsa plate. A considered festive keepsake for enduring prosperity and peace.',
  specs: {
    material: 'Precious crystal & artisan mineral composite',
    weight: '400g (piece) · 700g (with presentation box)',
    dimensions: '5 × 7.2 × 3.5 inches (12.7 × 18.3 × 8.9 cm)',
    care: 'Wipe gently with soft dry microfiber cloth'
  },
  delicateNote: 'Consecrated with care for your sacred altar or living sanctuary.',
  relatedHandles: ['diwali-wealth-kalash', 'golden-instinct', 'the-inner-kingdom']
}
