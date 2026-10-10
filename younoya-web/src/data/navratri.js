import boxPhotos from './navratriPhotos.json' with { type: 'json' }

// Owner-supplied contents. Unconfirmed materials and measurements are deliberately omitted.
export const NAVRATRI_DAYS = [
  ['White', 'Maa Shailputri', 'माँ शैलपुत्री', 'Mitti diya', ['Chandrama + moti keepsake']],
  ['Red', 'Maa Brahmacharini', 'माँ ब्रह्मचारिणी', 'Red coloured diya', ['Copper ring']],
  ['Light pink', 'Maa Chandra Ghanta', 'माँ चंद्रघंटा', 'Pink mitti diya', ['Itr']],
  ['Orange', 'Maa Kushmanda', 'माँ कूष्मांडा', 'Orange mitti diya', ['Copper Surya']],
  ['Green', 'Maa Skandmata', 'माँ स्कंदमाता', 'Green coloured diya', ['Green stone']],
  ['Yellow', 'Maa Katyayni', 'माँ कात्यायनी', 'Yellow coloured diya', ['Brass key']],
  ['Dark blue', 'Maa Kaalratri', 'माँ कालरात्रि', 'Blue coloured diya', ['Iron ring']],
  ['Red', 'Maa Mahagauri', 'माँ महागौरी', 'Red coloured diya', ['Silver-coloured Om Namah Shivay Bel Patra devotional item', 'Mehendi cone']],
  ['Dark pink', 'Maa Siddhidatri', 'माँ सिद्धिदात्री', 'Pink coloured diya', ['Five-mukhi rudraksh']],
].map(([colour, deity, hindi, diya, extras], index) => ({
  day: index + 1, colour, deity, hindi,
  contents: [`${colour} chunari`, `${colour} bindi${index ? ' · 1 piece' : ''}`, `${colour} bangles${index ? ' · 1 pair' : ''}`, `${diya} + cotton wick (rui jyot)`, 'Pooja dhoop', ...extras],
  note: index === 1 ? 'Mehendi is included in Day 8 only.' : '',
}))

export const NAVRATRI_PRODUCT = {
  id: 'navratri-shringaar-box', handle: 'navratri-shringaar-box', sku: 'YN-NAVRATRI-9D-001', kind: 'ritual-box',
  name: '9 Days Navratri Shringaar Box', shopName: 'NAVRATRI SHRINGAAR BOX', chapter: 'Navratri', badge: 'NINE DAYS, ONE BOX',
  displayName: 'YOUNOYA 9 Kit Shringaar Kit', displaySubtitle: 'Special Navratri Pooja Shringaar Set',
  seoTitle: '9 Kit Shringaar Kit for Navratri | Younoya',
  seoDescription: 'Celebrate Navratri with nine daily shringaar kits for Maa Durga: chunaris, bindi and bangles, clay diyas, pooja dhoop and devotional offerings. ₹1,499.',
  subtitle: 'Nine daily kits · one complete set', tagline: 'Nine days of colour, devotion and ritual', motif: 'Navratri daily rituals',
  price: '₹ 1,499', priceNum: 1499, currency: '₹', intention: 'festive-rituals',
  primaryImage: boxPhotos[0].src, cardImage: boxPhotos[0].thumbnail, cardImageFallback: boxPhotos[0].fallback.thumbnail,
  gallery: [...boxPhotos, ...[
    ['red-kit', 'Red daily kit detail · mehendi is included on Day 8'],
    ['green-kit', 'Green daily kit detail'],
    ['blue-kit', 'Dark blue daily kit detail'],
    ['orange-kit', 'Orange daily kit detail'],
    ['pink-kit', 'Dark pink daily kit detail'],
    ['yellow-kit', 'Yellow daily kit detail'],
  ].map(([id, caption]) => ({ id, caption, src: `/media/navratri/${id}-1200.webp`, thumbnail: `/media/navratri/${id}-600.webp`, width: 1200, height: 1600 }))],
  intentionStory: 'Thoughtfully curated for devotional offerings to Maa Durga, this Navratri shringaar set brings together nine coloured chunaris, bindi and bangles, clay diyas with cotton wicks, fragrant pooja dhoop cones and nine devotional offerings in one box.',
  relatedHandles: ['wild-poise', 'flamingo-grace', 'the-verdant-rising'],
}
