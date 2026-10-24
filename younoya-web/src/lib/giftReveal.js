import { CATEGORIES, RASHIS } from './categoryMapping.js'
import { REVEAL_EDITION_BINDINGS } from '../data/giftRevealBindings.js'
import { REVEAL_EDITION_NOTES } from '../data/giftRevealEditions.js'
import { GIFT_REVEAL_ITEMS } from '../data/giftRevealItems.js'

const normalise = value => typeof value === 'string' ? value.trim().toLowerCase() : ''

export function getRevealEdition(categoryInput, rashiInput) {
  const categoryKey = normalise(categoryInput)
  const rashiKey = normalise(rashiInput)
  const category = Object.values(CATEGORIES).find(c => c.slug === categoryKey || c.id === categoryKey || c.aliases.includes(categoryKey))
  const rashi = RASHIS.find(r => [r.slug, r.vedic, r.name.toLowerCase(), r.sanskrit.toLowerCase()].includes(rashiKey))
  if (!category || !rashi) return { status: 'unavailable' }
  const key = `${category.slug}/${rashi.slug}`
  const binding = REVEAL_EDITION_BINDINGS[key]
  const note = REVEAL_EDITION_NOTES[key]
  if (!binding || !note || !binding.itemIds.every(id => GIFT_REVEAL_ITEMS[id])) return { status: 'unavailable' }
  const items = binding.itemIds.map(id => GIFT_REVEAL_ITEMS[id])
  const heroItem = items.find(item => item.media?.type === 'photograph') || items.find(item => item.media)
  return {
    status: 'ready', key, category, rashi, ...binding, items, heroItem,
    heading: note[0], intro: note[1], meaning: note[2],
    path: `/reveal/${key}`,
    reflection: category.tagline.split(' • '),
  }
}

export function getRevealShareData(edition) {
  if (edition.status !== 'ready') return null
  return {
    presentation: 'gift', name: '', sign: edition.rashi.name, signSymbol: '',
    chapter: edition.category.label, prophecy: edition.intro,
    anchorPiece: edition.title, defaultTheme: 'atelier',
    shareUrl: `https://younoya.com${edition.path}`,
  }
}
