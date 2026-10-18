import photos from './kalashPhotos.json' with { type:'json' }

export const KALASH_CONTENTS = [
  ['Gomti chakra','Spiral shell pieces for your devotional arrangement.'],
  ['Kamal gatta','Lotus seeds, traditionally used in puja rituals.'],
  ['Kaudiyan','Cowrie shells to accompany your sacred space.'],
  ['Rose quartz crystals','Softly coloured crystal pieces for the ritual collection.'],
  ['Citrine crystals','Golden-toned crystal pieces for your arrangement.'],
  ['Coins','Coins to complete the devotional offering.'],
]
export const KALASH_PRODUCT = {
  id:'diwali-wealth-kalash',handle:'diwali-wealth-kalash',sku:'YN-DIWALI-KALASH-001',kind:'kalash',
  name:'YOUNOYA Diwali Wealth Kalash',displayName:'YOUNOYA Diwali Wealth Kalash',shopName:'DIWALI WEALTH KALASH',
  chapter:'Diwali',badge:'THE DIWALI EDIT',subtitle:'A considered ritual for prosperity',
  tagline:'Devotion, intention and a meaningful new beginning',motif:'Diwali puja and devotional gifting',
  price:'₹ 5,599',priceNum:5599,currency:'₹',intention:'festive-rituals',
  primaryImage:photos[0].src,cardImage:photos[0].thumbnail,cardImageFallback:photos[0].fallback.thumbnail,gallery:photos,
  seoTitle:'Diwali Wealth Kalash | Younoya',
  seoDescription:'Explore the Younoya Diwali Wealth Kalash with Gomti chakra, lotus seeds, cowrie shells, rose quartz, citrine and coins for devotional rituals. ₹5,599.',
  intentionStory:'Bring a considered intention to your Diwali rituals. A textured Kalash brings together Gomti chakra, kamal gatta, kaudiyan, rose quartz crystals, citrine crystals and coins for a meaningful devotional arrangement. Includes the YOUNOYA gift box, red samagri potli and an envelope with printed puja guidance.',
  relatedHandles:['navratri-shringaar-box','golden-instinct','the-inner-kingdom'],
}
