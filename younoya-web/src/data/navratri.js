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
  subtitle: 'Nine daily kits · one complete set', tagline: 'Nine days of colour, devotion and ritual', motif: 'Navratri daily rituals',
  price: '₹ 1,499', priceNum: 1499, currency: '₹', intention: 'festive-rituals',
  primaryImage: '/media/navratri/navratri-box-1024.webp', cardImage: '/media/navratri/navratri-box-600.webp',
  galleryImages: ['/media/navratri/navratri-box-1024.webp', ...['red-kit','green-kit','blue-kit','orange-kit','pink-kit','yellow-kit'].map(name => `/media/navratri/${name}-1200.webp`)],
  galleryDimensions: [{ width: 1024, height: 1024 }, ...Array.from({ length: 6 }, () => ({ width: 1200, height: 1600 }))],
  galleryCaptions: ['Navratri 9-in-1 box', 'Red daily kit detail · mehendi is included on Day 8', 'Green daily kit detail', 'Dark blue daily kit detail', 'Orange daily kit detail', 'Dark pink daily kit detail', 'Yellow daily kit detail'],
  intentionStory: 'A complete nine-day Navratri shringaar set, with a colour and devotional keepsake for each day. Nine individually packed daily kits arrive together in one outer box.',
  relatedHandles: ['wild-poise', 'flamingo-grace', 'the-verdant-rising'],
}
