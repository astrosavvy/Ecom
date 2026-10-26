import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { getRevealEdition, getRevealShareData } from '../src/lib/giftReveal.js'
import taurusDashas from '../src/data/taurusDashas.json' with { type: 'json' }

const ALL_9_DASHAS = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury']

test('Taurus 9-Dasha Matrix: All 9 Dashas exist with authentic keepsakes, rituals, and dual experiences', () => {
  for (const dasha of ALL_9_DASHAS) {
    const record = taurusDashas[dasha]
    assert(record, `Missing Dasha record for ${dasha}`)
    assert.equal(record.sign, 'Taurus')
    assert.equal(record.signCode, 'TAU')
    assert.equal(record.signSymbol, '♉')
    assert.equal(record.dasha, dasha)

    // Set Title & Products
    assert(record.setTitle && record.setTitle.length > 5, `Missing setTitle for ${dasha}`)
    assert(record.productsSummary && record.productsSummary.length > 10, `Missing productsSummary for ${dasha}`)

    // Keepsake & Ritual
    assert(record.keepsake?.name, `Missing keepsake name for ${dasha}`)
    assert(record.keepsake?.description, `Missing keepsake description for ${dasha}`)
    assert.equal(record.keepsake.role, 'KEEPSAKE')
    assert(record.ritual?.name, `Missing ritual name for ${dasha}`)
    assert(record.ritual?.description, `Missing ritual description for ${dasha}`)
    assert.equal(record.ritual.role, 'RITUAL')

    // Vastu Placement
    assert(record.vastuPlacement?.direction, `Missing Vastu direction for ${dasha}`)
    assert(record.vastuPlacement?.instructions, `Missing Vastu instructions for ${dasha}`)

    // Dual-Experience Awareness
    const expOther = record.experiences?.gifting_someone_else
    const expSelf = record.experiences?.buying_for_myself

    assert(expOther, `Missing gifting_someone_else for ${dasha}`)
    assert(expSelf, `Missing buying_for_myself for ${dasha}`)

    // Experience 01 (For Someone Else)
    assert.equal(expOther.chapterTitle, 'A Chapter Worth Celebrating')
    assert(expOther.headline && expOther.headline.length > 10)
    assert(expOther.chapterText && expOther.chapterText.length > 50)
    assert(expOther.whyChosen && expOther.whyChosen.length > 30)
    assert(expOther.whatThisGiftMeans && expOther.whatThisGiftMeans.length > 30)
    assert.equal(expOther.intentionHeading, "The Giver's Intention")
    assert(expOther.intentionStatement && expOther.intentionStatement.length > 30)
    assert(expOther.howToUse && expOther.howToUse.length > 20)

    // Experience 02 (For Myself)
    assert.equal(expSelf.chapterTitle, "The Chapter You're In")
    assert(expSelf.headline && expSelf.headline.length > 10)
    assert(expSelf.chapterText && expSelf.chapterText.length > 50)
    assert(expSelf.whyChosen && expSelf.whyChosen.length > 30)
    assert(expSelf.whatThisGiftMeans && expSelf.whatThisGiftMeans.length > 30)
    assert.equal(expSelf.intentionHeading, 'Your Personal Intention')
    assert(expSelf.intentionStatement && expSelf.intentionStatement.length > 30)
    assert(expSelf.howToUse && expSelf.howToUse.length > 20)

    // Disclaimer
    assert(record.disclaimer && record.disclaimer.includes('YOUNOYA products are curated'))
  }
})

test('Vastu Directions: Each of the 9 Taurus Dashas aligns with authentic manuscript orientations', () => {
  const directions = {
    Ketu: 'Northeast',
    Venus: 'Dressing sanctuary / Wardrobe',
    Sun: 'East',
    Moon: 'Southwest',
    Mars: 'South',
    Rahu: 'North',
    Jupiter: 'Northeast',
    Saturn: 'North',
    Mercury: 'North or Northeast',
  }

  for (const [dasha, dir] of Object.entries(directions)) {
    assert.equal(taurusDashas[dasha].vastuPlacement.direction, dir, `Incorrect Vastu direction for ${dasha}`)
  }
})

test('QR Unboxing Resolver: Taurus Moon correctly resolves Dasha & Experience queries', () => {
  // Test 1: Taurus Mars Gifting Someone Else
  const marsOther = getRevealEdition('career', 'taurus', { dasha: 'mars', experience: 'other' })
  assert.equal(marsOther.status, 'ready')
  assert.equal(marsOther.isDashaEdition, true)
  assert.equal(marsOther.dasha, 'Mars')
  assert.equal(marsOther.title, 'The Courage & Transformation Set')
  assert.equal(marsOther.vastu.direction, 'South')
  assert.equal(marsOther.intentionHeading, "The Giver's Intention")
  assert(marsOther.intentionStatement.includes('I admire your strength'))
  assert(marsOther.meaning.includes('crescent moon celebrates transformation'))

  // Test 2: Taurus Sun Buying For Myself
  const sunSelf = getRevealEdition('career', 'taurus', { dasha: 'sun', experience: 'self' })
  assert.equal(sunSelf.status, 'ready')
  assert.equal(sunSelf.isDashaEdition, true)
  assert.equal(sunSelf.dasha, 'Sun')
  assert.equal(sunSelf.title, 'The Dignity & Protection Set')
  assert.equal(sunSelf.vastu.direction, 'East')
  assert.equal(sunSelf.intentionHeading, 'Your Personal Intention')
  assert(sunSelf.intentionStatement.includes('I honour my kindness'))
  assert(sunSelf.contemplationPrompt.includes('I deserve to be heard'))

  // Test 3: Taurus Ketu For Myself
  const ketuSelf = getRevealEdition('vitality', 'taurus', { dasha: 'ketu', experience: 'self' })
  assert.equal(ketuSelf.status, 'ready')
  assert.equal(ketuSelf.isDashaEdition, true)
  assert.equal(ketuSelf.title, 'The Beauty of Enough Set')
  assert.equal(ketuSelf.vastu.direction, 'Northeast')
  assert.equal(ketuSelf.intentionHeading, 'Your Personal Intention')
  assert(ketuSelf.intentionStatement.includes('I give myself permission to appreciate the life I\'m creating'))
  assert(ketuSelf.contemplationPrompt.includes('Reflect on one thing you feel grateful for'))

  // Test 4: Social Share Data from Dasha Edition
  const shareData = getRevealShareData(marsOther)
  assert.equal(shareData.sign, 'Taurus')
  assert.equal(shareData.anchorPiece, 'The Courage & Transformation Set')
  assert(shareData.shareUrl.includes('dasha=mars&exp=other'))
})

test('Sign-Scoping Law: Non-Taurus signs NEVER resolve unmapped Dashas to Taurus editions', () => {
  // Aries with dasha=mars should NOT return a Dasha edition; it returns standard canonical Aries edition
  const ariesMars = getRevealEdition('career', 'aries', { dasha: 'mars' })
  assert.equal(ariesMars.status, 'ready')
  assert.equal(ariesMars.isDashaEdition, undefined)
  assert.equal(ariesMars.rashi.slug, 'aries')
  assert.equal(ariesMars.title, 'The Precision Set') // Standard canonical Mercury edition

  // Leo with dasha=sun should NOT return a Taurus Dasha edition
  const leoSun = getRevealEdition('career', 'leo', { dasha: 'sun' })
  assert.equal(leoSun.status, 'ready')
  assert.equal(leoSun.isDashaEdition, undefined)
  assert.equal(leoSun.rashi.slug, 'leo')

  // Cancer with dasha=moon should NOT return a Taurus Dasha edition
  const cancerMoon = getRevealEdition('love', 'cancer', { dasha: 'moon' })
  assert.equal(cancerMoon.status, 'ready')
  assert.equal(cancerMoon.isDashaEdition, undefined)
  assert.equal(cancerMoon.rashi.slug, 'cancer')
})

test('Single-Product Law & Zero-Companions UI Verification', () => {
  // Verify GuideResult.jsx does not import or render GuideCompanions
  const guideResultSource = fs.readFileSync('younoya-web/src/components/gift-guide/GuideResult.jsx', 'utf8')
  assert(!guideResultSource.includes('GuideCompanions'), 'GuideResult.jsx must NOT import or render GuideCompanions')
  assert(!guideResultSource.includes('<GuideCompanions'), 'GuideResult.jsx must NOT contain <GuideCompanions')

  // Verify backend gift-guide.ts enforces single product and empty secondaryCategories
  const backendGuideSource = fs.readFileSync('backend/src/modules/younoya-astro/gift-guide.ts', 'utf8')
  assert(backendGuideSource.includes('secondaryCategories: any[] = []'), 'backend gift-guide.ts must return empty secondaryCategories')
  assert(backendGuideSource.includes('TAURUS_DASHAS'), 'backend gift-guide.ts must contain TAURUS_DASHAS scope guard')
  assert(backendGuideSource.includes('isTaurus ? TAURUS_DASHAS.includes(astrologyData.antardasha)'), 'backend must scope 9 Dashas strictly to Taurus')
})
