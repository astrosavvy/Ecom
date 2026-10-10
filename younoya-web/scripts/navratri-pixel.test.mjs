import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'

test('loads once, deduplicates effect replay and tracks a return visit only on Navratri', async () => {
  const { trackNavratriVisit, NAVRATRI_PIXEL_PATH } = await import('../src/lib/navratriPixel.js?fresh')
  const scripts = []
  globalThis.window = {}
  globalThis.document = { createElement: tag => ({ tag }), head: { appendChild: script => scripts.push(script) } }
  try {
    trackNavratriVisit('/shop')
    assert.equal(window.fbq, undefined)
    assert.equal(scripts.length, 0)
    trackNavratriVisit(NAVRATRI_PIXEL_PATH)
    trackNavratriVisit(NAVRATRI_PIXEL_PATH)
    assert.equal(scripts.length, 1)
    assert.equal(scripts[0].async, true)
    assert.equal(scripts[0].src, 'https://connect.facebook.net/en_US/fbevents.js')
    assert.deepEqual(window.fbq.queue.map(args => [...args]), [['init', '1812138199833737'], ['track', 'PageView']])
    // Once the provider loads, the same function dispatches instead of queuing.
    const delivered = []
    window.fbq.callMethod = (...args) => delivered.push(args)
    trackNavratriVisit('/product/wild-poise')
    trackNavratriVisit('/checkout')
    assert.deepEqual(delivered, [])
    trackNavratriVisit(NAVRATRI_PIXEL_PATH)
    trackNavratriVisit(NAVRATRI_PIXEL_PATH)
    assert.deepEqual(delivered, [['track', 'PageView']])
    assert.equal(scripts.length, 1)
  } finally {
    delete globalThis.window
    delete globalThis.document
  }
})

test('uses an existing Meta loader without inserting another script', async () => {
  const { trackNavratriVisit, NAVRATRI_PIXEL_PATH } = await import('../src/lib/navratriPixel.js?existing')
  const calls = []
  globalThis.window = { fbq: (...args) => calls.push(args) }
  globalThis.document = { createElement: () => { throw new Error('Must reuse existing loader') } }
  try {
    trackNavratriVisit(NAVRATRI_PIXEL_PATH)
    trackNavratriVisit(NAVRATRI_PIXEL_PATH)
    assert.deepEqual(calls, [['init', '1812138199833737'], ['track', 'PageView']])
  } finally {
    delete globalThis.window
    delete globalThis.document
  }
})

test('built no-JavaScript tracking image appears only in the Navratri route shell', async () => {
  const files = (await readdir(new URL('../dist/', import.meta.url), { recursive: true })).filter(file => file.endsWith('.html'))
  assert.ok(files.length > 20)
  for (const file of files) {
    const html = await readFile(new URL(`../dist/${file.replaceAll('\\', '/')}`, import.meta.url), 'utf8')
    const pixel = /<img[^>]+src="https:\/\/www\.facebook\.com\/tr\?id=1812138199833737[^>]+>/g
    const matches = [...html.matchAll(pixel)]
    assert.equal(matches.length, file.replaceAll('\\', '/') === 'product/navratri-shringaar-box/index.html' ? 1 : 0, file)
    if (matches.length) assert.match(html, /<noscript>[\s\S]*facebook\.com\/tr\?id=1812138199833737[\s\S]*<\/noscript>/)
  }
})
