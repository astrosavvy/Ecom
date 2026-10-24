/**
 * YOUNOYA Luxury Social Share Card Generator
 * Inspired by Anthropic Editorial Broadsheets & Vercel Geist Swiss Precision.
 * Synthesizes museum-grade 1080x1080 (1:1 Square Post - DEFAULT) and 1080x1920 (9:16 Story)
 * directly in browser canvas.
 * 
 * Free of AI-slop cliches:
 * - Zero muddy yellow gradients or scattered clip-art stars
 * - Double-bezel architectural hairline framing with precision registration marks
 * - Literary Cormorant Garamond serif typography with balanced editorial line wrapping
 * - Passive-voice cosmic alignment text
 * - Dual themes: 'atelier' (Warm Alabaster/Ivory Paper - Default) & 'nocturne' (Architectural Obsidian)
 */

export async function renderSocialCardToCanvas(canvas, data, options = {}) {
  if (typeof document !== 'undefined' && document.fonts?.ready) await document.fonts.ready
  if (data.presentation === 'gift') return renderGiftNote(canvas, data, options)
  const {
    format = 'feed', // 'feed' (1:1 Square - Default) or 'story' (9:16)
    theme = 'atelier', // 'atelier' (Warm Ivory - Default) or 'nocturne' (Deep Obsidian)
  } = options

  const width = 1080
  const height = format === 'feed' ? 1080 : 1920
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const {
    name = 'You',
    sign = 'Aries',
    signSymbol = '♈',
    chapter = 'Career & Confidence',
    prophecy = 'A long-held threshold is quietly crossed under this transit. What was once withheld in uncertainty is now yielded with grace; new authority is recognized where silent dedication was kept.',
    anchorPiece = 'The Consecrated Keepsake',
  } = data

  const isDark = theme === 'nocturne'

  // ── 1. Canvas Palette Definition ──
  const colors = isDark ? {
    bg: '#0D0B0A',
    bgGrad: '#161311',
    borderOuter: 'rgba(214, 176, 106, 0.35)',
    borderInner: 'rgba(255, 255, 255, 0.07)',
    crossMark: 'rgba(214, 176, 106, 0.6)',
    brand: '#FAF7F2',
    eyebrow: '#D6B06A',
    divider: 'rgba(214, 176, 106, 0.25)',
    astrolabe: '#C5A059',
    textPrimary: '#FAF7F2',
    textSecondary: '#E8DECC',
    quoteGlyph: 'rgba(214, 176, 106, 0.28)',
    pillBg: 'rgba(214, 176, 106, 0.1)',
    pillBorder: 'rgba(214, 176, 106, 0.3)',
    pillText: '#D6B06A',
    footerText: '#A39688',
    footerAccent: '#D6B06A',
  } : {
    // Anthropic Warm Paper Palette
    bg: '#FAF7F2',
    bgGrad: '#F3EDE3',
    borderOuter: 'rgba(160, 122, 52, 0.28)',
    borderInner: 'rgba(24, 20, 18, 0.08)',
    crossMark: 'rgba(160, 122, 52, 0.45)',
    brand: '#1C1917',
    eyebrow: '#8C6F3E',
    divider: 'rgba(160, 122, 52, 0.2)',
    astrolabe: '#8C6F3E',
    textPrimary: '#1C1917',
    textSecondary: '#332D28',
    quoteGlyph: 'rgba(160, 122, 52, 0.25)',
    pillBg: 'rgba(160, 122, 52, 0.07)',
    pillBorder: 'rgba(160, 122, 52, 0.22)',
    pillText: '#6E552E',
    footerText: '#7A6D5E',
    footerAccent: '#8C6F3E',
  }

  // ── 2. Background Canvas & Paper Vignette ──
  const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 80, width / 2, height / 2, width * 0.8)
  bgGrad.addColorStop(0, colors.bg)
  bgGrad.addColorStop(1, colors.bgGrad)
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // ── 3. Double-Bezel Architectural Framing ──
  const outerPad = format === 'feed' ? 56 : 72
  const innerPad = outerPad + 14

  // Outer Hairline
  ctx.strokeStyle = colors.borderOuter
  ctx.lineWidth = 1.2
  ctx.strokeRect(outerPad, outerPad, width - outerPad * 2, height - outerPad * 2)

  // Inner Hairline
  ctx.strokeStyle = colors.borderInner
  ctx.lineWidth = 1
  ctx.strokeRect(innerPad, innerPad, width - innerPad * 2, height - innerPad * 2)

  // Precision Registration Crosshairs at 4 Corners (Swiss Lithograph Art Print style)
  function drawRegistrationCross(x, y, arm = 8) {
    ctx.strokeStyle = colors.crossMark
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(x - arm, y)
    ctx.lineTo(x + arm, y)
    ctx.moveTo(x, y - arm)
    ctx.lineTo(x, y + arm)
    ctx.stroke()
  }
  drawRegistrationCross(outerPad, outerPad)
  drawRegistrationCross(width - outerPad, outerPad)
  drawRegistrationCross(outerPad, height - outerPad)
  drawRegistrationCross(width - outerPad, height - outerPad)

  // ── 4. Brand Masthead (Anthropic Quiet Restraint) ──
  const mastheadY = format === 'feed' ? 148 : 220
  ctx.textAlign = 'center'

  // Letterspaced Brandmark
  ctx.fillStyle = colors.brand
  ctx.font = '400 28px "Plus Jakarta Sans", -apple-system, sans-serif'
  ctx.letterSpacing = '14px'
  ctx.fillText('Y O U N O Y A', width / 2 + 7, mastheadY)

  // Folio Tag
  ctx.fillStyle = colors.eyebrow
  ctx.font = '600 13px "Plus Jakarta Sans", sans-serif'
  ctx.letterSpacing = '4px'
  const folioText = `FOLIO NO. 04  •  VEDIC CHRONICLES  •  ${signSymbol} ${sign.toUpperCase()}`
  ctx.fillText(folioText, width / 2 + 2, mastheadY + 36)

  // ── 5. Astrolabe Celestial Transit Line ──
  const astrolabeY = mastheadY + 76
  const lineHalfW = 160

  ctx.strokeStyle = colors.divider
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(width / 2 - lineHalfW, astrolabeY)
  ctx.lineTo(width / 2 - 28, astrolabeY)
  ctx.moveTo(width / 2 + 28, astrolabeY)
  ctx.lineTo(width / 2 + lineHalfW, astrolabeY)
  ctx.stroke()

  // Central Celestial Ring & Star
  ctx.strokeStyle = colors.astrolabe
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(width / 2, astrolabeY, 12, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = colors.astrolabe
  ctx.font = '12px serif'
  ctx.letterSpacing = '0px'
  ctx.fillText('✦', width / 2, astrolabeY + 4)

  // Transit Sub-tag
  const transitTagY = astrolabeY + 36
  ctx.fillStyle = colors.footerText
  ctx.font = '500 12.5px "Plus Jakarta Sans", sans-serif'
  ctx.letterSpacing = '2.5px'
  ctx.fillText(`LUNAR TRANSIT  •  ${chapter.toUpperCase()}`, width / 2, transitTagY)

  // ── 6. Central Prophecy Block (Passive Voice Poetry) ──
  // Decorative Opening Quote Symbol
  const quoteStartY = format === 'feed' ? 440 : 740
  ctx.font = 'normal 400 96px "Cormorant Garamond", Georgia, serif'
  ctx.fillStyle = colors.quoteGlyph
  ctx.fillText('“', width / 2, quoteStartY - 24)

  // Balanced Line Wrapping for Literary Serif
  const maxTextWidth = format === 'feed' ? width - 240 : width - 240
  const lineHeight = format === 'feed' ? 62 : 76
  const fontSize = format === 'feed' ? 38 : 46

  ctx.font = `italic 400 ${fontSize}px "Cormorant Garamond", Georgia, serif`
  ctx.letterSpacing = '-0.2px'

  const words = prophecy.split(' ')
  const lines = []
  let currentLine = words[0] || ''

  for (let i = 1; i < words.length; i++) {
    const testLine = currentLine + ' ' + words[i]
    if (ctx.measureText(testLine).width < maxTextWidth) {
      currentLine = testLine
    } else {
      lines.push(currentLine)
      currentLine = words[i]
    }
  }
  lines.push(currentLine)

  let textY = quoteStartY + 30
  for (let i = 0; i < lines.length; i++) {
    ctx.fillStyle = i === 0 ? colors.textPrimary : colors.textSecondary
    ctx.fillText(lines[i], width / 2, textY)
    textY += lineHeight
  }

  // ── 7. Consecrated Anchor Footnote ──
  if (anchorPiece) {
    const anchorY = format === 'feed' ? Math.max(textY + 44, 780) : Math.max(textY + 60, 1380)
    const anchorText = `CONSECRATED ANCHOR  —  ${anchorPiece.toUpperCase()}`
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif'
    ctx.letterSpacing = '2.5px'

    const pillW = Math.min(width - 240, ctx.measureText(anchorText).width + 44)
    const pillH = 34

    ctx.fillStyle = colors.pillBg
    ctx.beginPath()
    ctx.roundRect(width / 2 - pillW / 2, anchorY - pillH / 2, pillW, pillH, 17)
    ctx.fill()
    ctx.strokeStyle = colors.pillBorder
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.fillStyle = colors.pillText
    ctx.fillText(anchorText, width / 2, anchorY + 4.5)
  }

  // ── 8. Provenance & Referral Stamp (CAC Reduction) ──
  const footerY = format === 'feed' ? height - 120 : height - 160

  // Hairline rule
  ctx.strokeStyle = colors.divider
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(width / 2 - 140, footerY - 32)
  ctx.lineTo(width / 2 + 140, footerY - 32)
  ctx.stroke()

  ctx.fillStyle = colors.footerAccent
  ctx.font = '600 16px "Plus Jakarta Sans", sans-serif'
  ctx.letterSpacing = '3px'
  ctx.fillText('YOUNOYA.COM / FIND-A-GIFT', width / 2, footerY)

  ctx.fillStyle = colors.footerText
  ctx.font = '400 12.5px "Plus Jakarta Sans", sans-serif'
  ctx.letterSpacing = '1.5px'
  ctx.fillText('Astrology-Backed Gifting  •  Intentionally Curated', width / 2, footerY + 26)
}

/**
 * Generate a downloadable Blob (image/png) from prophecy data
 */
export async function generateSocialCardBlob(data, options = {}) {
  const canvas = document.createElement('canvas')
  await renderSocialCardToCanvas(canvas, data, options)
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png', 0.95)
  })
}

/**
 * Trigger immediate browser download of the social card
 */
export async function downloadSocialCard(data, options = {}, filename = 'younoya-1x1-prophecy-folio.png') {
  const blob = await generateSocialCardBlob(data, options)
  if (!blob) return false
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return true
}

// The public edition note has no computed transit or recipient-specific claim.
function renderGiftNote(canvas, data, { format = 'feed', theme = 'atelier' } = {}) {
  canvas.width = 1080
  canvas.height = format === 'story' ? 1920 : 1080
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const dark = theme === 'nocturne'
  const ink = dark ? '#faf7f2' : '#241c17'
  const muted = dark ? '#c9baa7' : '#655b50'
  const rule = dark ? '#5d4c36' : '#dcd2c3'
  const width = canvas.width
  const height = canvas.height
  ctx.fillStyle = dark ? '#17120f' : '#faf7f2'
  ctx.fillRect(0, 0, width, height)
  ctx.textAlign = 'left'
  ctx.letterSpacing = '0px'
  const wrap = (text, size, font, maxWidth = 880) => {
    ctx.font = `${size}px ${font}`
    const lines = []
    let line = ''
    for (const word of String(text || '').split(/\s+/)) {
      const next = line ? `${line} ${word}` : word
      if (line && ctx.measureText(next).width > maxWidth) { lines.push(line); line = word }
      else line = next
    }
    if (line) lines.push(line)
    return lines
  }
  ctx.fillStyle = ink
  ctx.font = '30px "Plus Jakarta Sans", sans-serif'
  ctx.fillText('YOUNOYA', 100, 130)
  ctx.fillStyle = muted
  ctx.font = '21px "Plus Jakarta Sans", sans-serif'
  ctx.fillText(data.chapter, 100, 220)
  const titleLines = wrap(data.anchorPiece, 76, '"Cormorant Garamond", Georgia, serif')
  ctx.fillStyle = ink
  titleLines.forEach((line, i) => ctx.fillText(line, 100, 310 + i * 80))
  const signY = 348 + (titleLines.length - 1) * 80
  ctx.fillStyle = muted
  ctx.font = '22px "Plus Jakarta Sans", sans-serif'
  ctx.fillText(data.sign, 100, signY)
  const footerY = height - 110
  const startY = format === 'story' ? Math.max(730, signY + 130) : signY + 100
  let size = format === 'story' ? 52 : 44
  let lines = wrap(data.prophecy, size, '"Cormorant Garamond", Georgia, serif')
  while (size > 28 && startY + lines.length * size * 1.3 > footerY - 80) {
    size -= 2
    lines = wrap(data.prophecy, size, '"Cormorant Garamond", Georgia, serif')
  }
  ctx.fillStyle = ink
  lines.forEach((line, i) => ctx.fillText(line, 100, startY + i * size * 1.3))
  ctx.strokeStyle = rule
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(100, footerY - 35); ctx.lineTo(width - 100, footerY - 35); ctx.stroke()
  ctx.fillStyle = muted
  ctx.font = '20px "Plus Jakarta Sans", sans-serif'
  ctx.fillText('For every chapter.', 100, footerY + 10)
  ctx.textAlign = 'right'
  ctx.fillText('YOUNOYA.COM', width - 100, footerY + 10)
}
