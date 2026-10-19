import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolveCategory, resolveRashi, getMatrixKey, CATEGORIES, RASHIS } from '../src/lib/categoryMapping.js'
import { createQrMatrix, generateQrSvg, generateQrSvgString } from '../src/lib/qrGenerator.js'
import { generateProphecy, PROPHECY_SYSTEM_PROMPT } from '../src/lib/prophecyGenerator.js'
import { getSeo, indexableRoutes } from '../src/seo/metadata.js'

test('categoryMapping resolves canonical categories and all 12 rashis', () => {
  // Categories
  assert.equal(resolveCategory('career').id, 'confidence-power')
  assert.equal(resolveCategory('confidence-power').slug, 'career')
  assert.equal(resolveCategory('love').slug, 'love')
  assert.equal(resolveCategory('vitality').id, 'vitality-balance')
  assert.equal(resolveCategory('wealth').slug, 'wealth')
  assert.equal(resolveCategory('unknown').slug, 'career') // Safe fallback

  // Rashis
  assert.equal(resolveRashi('aries').sanskrit, 'Mesha')
  assert.equal(resolveRashi('mesha').slug, 'aries')
  assert.equal(resolveRashi('taurus').sanskrit, 'Vrishabha')
  assert.equal(resolveRashi('vrishchika').name, 'Scorpio')
  assert.equal(resolveRashi('meena').name, 'Pisces')
  assert.equal(RASHIS.length, 12)

  // Matrix Key
  assert.equal(getMatrixKey('aries', 'career', 'Mercury'), 'ARIES-Mercury-confidence-power')
  assert.equal(getMatrixKey('leo', 'love', 'Ketu'), 'LEO-Ketu-love-connection')
})

test('qrGenerator generates valid matrix and SVG vector output', () => {
  const url = 'https://younoya.com/reveal/career/aries'
  const matrix = createQrMatrix(url)
  assert(matrix.length >= 21) // At least Version 1
  assert.equal(matrix.length, matrix[0].length) // Square matrix

  // Check SVG output
  const svg = generateQrSvg(url, { size: 240, centerEmblem: true })
  assert(svg.startsWith('<svg'))
  assert(svg.includes('viewBox="0 0'))
  assert(svg.includes('<rect'))
  assert(svg.includes('✦')) // Center emblem star
  assert(svg.endsWith('</svg>'))

  // Check alias
  const svgAlias = generateQrSvgString(url)
  assert.equal(svg, svgAlias)
})

test('prophecyGenerator synthesizes high-voltage 2-3 line prophecies', () => {
  const p1 = generateProphecy({ sign: 'Aries', category: 'career' })
  assert(typeof p1 === 'string')
  assert(p1.length > 50)
  assert(p1.includes('celestial transit') || p1.includes('decisive alignment') || p1.includes('clarity'))

  const p2 = generateProphecy({ name: 'Aarav', sign: 'Leo', category: 'love' })
  assert(p2.includes('Aarav') || p2.includes('lunar cycle') || p2.includes('heart'))

  assert(PROPHECY_SYSTEM_PROMPT.includes('Cartier-grade'))
  assert(PROPHECY_SYSTEM_PROMPT.includes('strictly 10–15% max'))
})

test('SEO protection: reveal pages are strictly hidden with noindex and omitted from indexable routes', () => {
  // Test direct route getSeo()
  const revealSeo = getSeo('/reveal/career/aries')
  assert.equal(revealSeo.noindex, true)
  assert.equal(revealSeo.title, 'Your Sacred Unboxing | Younoya')

  const unboxingSeo = getSeo('/unboxing/love/leo')
  assert.equal(unboxingSeo.noindex, true)

  // Test indexable routes omission
  const routes = indexableRoutes([])
  assert(!routes.includes('/reveal'))
  assert(!routes.includes('/reveal/career/aries'))
  assert(!routes.includes('/unboxing/love/leo'))
})
