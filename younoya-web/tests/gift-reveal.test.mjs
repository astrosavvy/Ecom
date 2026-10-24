import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { CATEGORIES, RASHIS, resolveCategory } from '../src/lib/categoryMapping.js'
import { getRevealEdition, getRevealShareData } from '../src/lib/giftReveal.js'
import { REVEAL_EDITION_NOTES } from '../src/data/giftRevealEditions.js'
import { REVEAL_ITEM_ALIASES } from '../src/data/giftRevealItems.js'
import { renderSocialCardToCanvas } from '../src/lib/socialCardGenerator.js'

const root = new URL('../', import.meta.url)
const sourcePath = new URL('src/data/combinations.json', root)
const matrix = JSON.parse(fs.readFileSync(sourcePath))
const audit = JSON.parse(fs.readFileSync(new URL('../.agents/handoff_plan/reveal-premium-redesign/audit.json', root)))

test('all 48 public editions retain the independently audited matrix identities and exact object selection', () => {
  assert.equal(Object.keys(REVEAL_EDITION_NOTES).length, 48)
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(sourcePath)).digest('hex'), audit.matrixSha256)
  for (const row of audit.routes) {
    const [, , category, rashi] = row.path.split('/')
    const edition = getRevealEdition(category, rashi)
    assert.equal(edition.status, 'ready', row.path)
    assert.equal(edition.matrixKey, row.matrixKey)
    assert.equal(edition.combinationId, row.combinationId)
    assert.match(edition.matrixKey, /-Mercury-/)
    const expectedItems = [row.keepsake, row.ritual].map(name => REVEAL_ITEM_ALIASES[name.split(' — ')[0]])
    assert.deepEqual(edition.items.map(item => item.id), expectedItems, row.path)
    assert.equal(new Set(edition.items.map(item => item.id)).size, edition.items.length)
    assert(edition.intro.length > 100 && edition.meaning.length > 180, row.path)
    assert(edition.heroItem?.media, row.path)
  }
})

test('unknown and incomplete public identities never silently select career or Aries', () => {
  for (const pair of [['unknown','aries'],['career','unknown'],['',''],[null,'aries'],['career',null],[{},'aries']]) assert.equal(getRevealEdition(...pair).status, 'unavailable')
  assert.equal(getRevealShareData({ status: 'unavailable' }), null)
  assert.equal(resolveCategory('unknown').slug, 'career') // Shared admin contract stays intact.
})

test('all supported aliases resolve to the same canonical QR identity', () => {
  for (const category of Object.values(CATEGORIES)) for (const rashi of RASHIS) {
    const canonical = getRevealEdition(category.slug, rashi.slug)
    for (const alias of category.aliases) assert.equal(getRevealEdition(alias, rashi.vedic).path, canonical.path)
    assert.equal(getRevealEdition(category.id.toUpperCase(), rashi.sanskrit.toUpperCase()).combinationId, canonical.combinationId)
  }
})

test('bottles remain distinct from fragrance; care and material details are not guessed', () => {
  const bottle = getRevealEdition('wealth','taurus').items.find(item => item.id === 'tiger-eye-bottle')
  assert(bottle)
  assert.doesNotMatch(bottle.description, /botanical|oil|apply|nervous system/i)
  assert.equal(bottle.care, null)
  const scent = getRevealEdition('love','cancer').items.find(item => item.id === 'garnet-itr')
  assert.match(scent.description, /fragrance/)
  assert.notEqual(bottle.id, scent.id)
  assert.equal(bottle.media.type, 'illustration')
  assert.match(bottle.media.alt, /not an exact product photograph/)
})

test('all referenced photos/illustrations exist and illustration labels are explicit', () => {
  for (const category of Object.values(CATEGORIES)) for (const rashi of RASHIS) {
    const edition = getRevealEdition(category.slug, rashi.slug)
    for (const item of edition.items) {
      if (!item.media) continue
      const media = item.media
      assert(fs.existsSync(new URL(`public${media.src}`, root)))
      assert(media.width > 0 && media.height > 0)
      for (const candidate of media.srcSet.split(', ')) assert(fs.existsSync(new URL(`public${candidate.split(' ')[0]}`, root)))
      if (media.type === 'illustration') assert.match(media.caption, /Illustration/)
    }
  }
})

test('share notes follow the selected edition and never claim an invented transit', () => {
  for (const row of audit.routes) {
    const [, , category, rashi] = row.path.split('/')
    const edition = getRevealEdition(category,rashi)
    const data = getRevealShareData(edition)
    assert.equal(data.prophecy, edition.intro)
    assert.equal(data.shareUrl, `https://younoya.com${row.path}`)
    assert.equal(data.anchorPiece, matrix[row.matrixKey].setTitle)
    assert.equal(data.defaultTheme, 'atelier')
    assert.doesNotMatch(data.prophecy, /your.*transit|season of effortless|birth chart/i)
  }
})

test('gift export contains current edition text, stays within the canvas and avoids the prophecy labels', async () => {
  for (const format of ['feed','story']) for (const row of audit.routes) {
    const texts = []
    const ctx = {
      font: '', fillRect(){}, beginPath(){}, moveTo(){}, lineTo(){}, stroke(){},
      measureText(text){ return {width: text.length * (Number.parseFloat(this.font) || 20) * .52} },
      fillText(text,x,y){ texts.push({text,x,y}) },
    }
    const canvas = { getContext: () => ctx }
    const [, , category, rashi] = row.path.split('/')
    const edition = getRevealEdition(category,rashi)
    await renderSocialCardToCanvas(canvas,getRevealShareData(edition),{format})
    assert.equal(canvas.width,1080)
    assert.equal(canvas.height,format === 'feed' ? 1080 : 1920)
    assert(texts.some(t=>t.text === edition.category.label))
    assert(texts.every(t=>t.y > 0 && t.y < canvas.height))
    assert.doesNotMatch(texts.map(t=>t.text).join(' '), /LUNAR TRANSIT|FOLIO NO|CONSECRATED ANCHOR/)
  }
})
