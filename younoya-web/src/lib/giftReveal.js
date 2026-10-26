import { CATEGORIES, RASHIS } from './categoryMapping.js'
import { REVEAL_EDITION_BINDINGS } from '../data/giftRevealBindings.js'
import { REVEAL_EDITION_NOTES } from '../data/giftRevealEditions.js'
import { GIFT_REVEAL_ITEMS } from '../data/giftRevealItems.js'
import taurusDashas from '../data/taurusDashas.json' with { type: 'json' }

const normalise = value => typeof value === 'string' ? value.trim().toLowerCase() : ''

export function getRevealEdition(categoryInput, rashiInput, options = {}) {
  const categoryKey = normalise(categoryInput)
  const rashiKey = normalise(rashiInput)
  const category = Object.values(CATEGORIES).find(c => c.slug === categoryKey || c.id === categoryKey || c.aliases.includes(categoryKey))
  const rashi = RASHIS.find(r => [r.slug, r.vedic, r.name.toLowerCase(), r.sanskrit.toLowerCase()].includes(rashiKey))
  if (!category || !rashi) return { status: 'unavailable' }

  // Check if this is a Taurus Dasha unboxing request
  if (rashi.slug === 'taurus' && options?.dasha) {
    const rawDasha = normalise(options.dasha)
    const validDashas = ['ketu', 'venus', 'sun', 'moon', 'mars', 'rahu', 'jupiter', 'saturn', 'mercury']
    const matchedDasha = validDashas.find(d => d === rawDasha)
    if (matchedDasha) {
      const dashaTitle = matchedDasha.charAt(0).toUpperCase() + matchedDasha.slice(1)
      const comb = taurusDashas[matchedDasha] || taurusDashas[dashaTitle]
      if (comb && comb.experiences) {
        const isSelf = options.experience === 'self'
        const expKey = isSelf ? 'buying_for_myself' : 'gifting_someone_else'
        const exp = comb.experiences[expKey] || comb.experiences.gifting_someone_else

        const items = [
          {
            id: 'keepsake',
            name: comb.keepsake.name,
            description: comb.keepsake.description,
            role: comb.keepsake.role || 'KEEPSAKE',
          },
          {
            id: 'ritual',
            name: comb.ritual.name,
            description: comb.ritual.description,
            role: comb.ritual.role || 'RITUAL',
          }
        ]

        // Find fallback photo/illustration from default binding if available
        const defaultBinding = REVEAL_EDITION_BINDINGS[`${category.slug}/${rashi.slug}`]
        const fallbackItems = defaultBinding?.itemIds?.map(id => GIFT_REVEAL_ITEMS[id]).filter(Boolean) || []
        const heroItem = fallbackItems.find(item => item.media?.type === 'photograph') || fallbackItems.find(item => item.media) || null

        return {
          status: 'ready',
          isDashaEdition: true,
          key: `${category.slug}/${rashi.slug}?dasha=${matchedDasha}&exp=${isSelf ? 'self' : 'other'}`,
          category,
          rashi,
          dasha: dashaTitle,
          editionId: comb.combinationId,
          title: comb.setTitle,
          productsSummary: comb.productsSummary,
          heading: exp.headline,
          intro: exp.subtitle,
          chapterTitle: exp.chapterTitle,
          chapterText: exp.chapterText,
          meaning: exp.whatThisGiftMeans,
          whyChosen: exp.whyChosen,
          luxuryDescription: exp.luxuryDescription,
          intentionHeading: exp.intentionHeading,
          intentionStatement: exp.intentionStatement,
          howToUse: exp.howToUse,
          vastu: comb.vastuPlacement,
          contemplationPrompt: exp.contemplationPrompt || comb.vastuPlacement?.contemplationPrompt || null,
          disclaimer: comb.disclaimer,
          items,
          heroItem,
          path: `/reveal/${category.slug}/${rashi.slug}?dasha=${matchedDasha}&exp=${isSelf ? 'self' : 'other'}`,
          reflection: [
            comb.vastuPlacement ? `Vastu: ${comb.vastuPlacement.direction}` : 'Sacred Placement',
            exp.intentionHeading || 'Intention',
            'Mindful Ritual'
          ],
        }
      }
    }
  }

  // Standard 48 Mercury Editions fallback (100% backward compatible)
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
    chapter: edition.category.label, prophecy: edition.intentionStatement || edition.intro,
    anchorPiece: edition.title, defaultTheme: 'atelier',
    shareUrl: `https://younoya.com${edition.path}`,
  }
}
