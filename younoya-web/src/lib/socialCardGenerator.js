/**
 * YOUNOYA Luxury Social Share Card Generator
 * Synthesizes high-resolution 1080x1920 (9:16 Story) and 1080x1080 (1:1 Feed) social cards directly in browser canvas.
 * Cartier-grade obsidian & celestial gold aesthetic designed for viral Instagram Stories, WhatsApp status, and CAC reduction.
 */

export async function renderSocialCardToCanvas(canvas, data, options = {}) {
  const {
    format = 'story', // 'story' (9:16) or 'feed' (1:1)
  } = options

  const width = 1080
  const height = format === 'story' ? 1920 : 1080
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const {
    name = 'You',
    sign = 'Aries',
    signSymbol = '♈',
    chapter = 'Career & Confidence',
    prophecy = 'A quiet shift is clearing your path. What felt delayed was merely gathering force—trust your instincts over haste. Your season of effortless authority begins now.',
    anchorPiece = 'The Precision Keepsake',
  } = data

  // 1. Deep Obsidian Luxury Canvas
  ctx.fillStyle = '#120F0D'
  ctx.fillRect(0, 0, width, height)

  // 2. Subtle Radiant Amber/Gold Celestial Aura
  const gradCenterY = format === 'story' ? height * 0.42 : height * 0.48
  const aura = ctx.createRadialGradient(width / 2, gradCenterY, 40, width / 2, gradCenterY, width * 0.75)
  aura.addColorStop(0, 'rgba(196, 151, 59, 0.22)')
  aura.addColorStop(0.4, 'rgba(196, 151, 59, 0.08)')
  aura.addColorStop(1, 'rgba(18, 15, 13, 0)')
  ctx.fillStyle = aura
  ctx.fillRect(0, 0, width, height)

  // 3. Stardust & Constellation Accent Glyphs
  ctx.fillStyle = 'rgba(230, 210, 165, 0.35)'
  const stars = [
    [160, 220, 2], [240, 360, 1.5], [890, 280, 2.5], [940, 440, 1.5],
    [180, 1400, 1.8], [910, 1480, 2], [540, 200, 1.5], [850, 850, 1.2],
    [220, 920, 1.5], [320, 1680, 2], [760, 1720, 1.6]
  ]
  for (const [sx, sy, sr] of stars) {
    if (sy < height - 60) {
      ctx.beginPath()
      ctx.arc(sx, sy, sr, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // 4. Elegant Double Gold Hairline Border
  const pad = format === 'story' ? 70 : 54
  ctx.strokeStyle = 'rgba(214, 176, 106, 0.38)'
  ctx.lineWidth = 1.5
  ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2)

  ctx.strokeStyle = 'rgba(214, 176, 106, 0.18)'
  ctx.lineWidth = 1
  ctx.strokeRect(pad + 12, pad + 12, width - (pad + 12) * 2, height - (pad + 12) * 2)

  // Corner Diamond Accents
  function drawDiamond(x, y, sz = 5) {
    ctx.fillStyle = '#D6B06A'
    ctx.beginPath()
    ctx.moveTo(x, y - sz)
    ctx.lineTo(x + sz, y)
    ctx.lineTo(x, y + sz)
    ctx.lineTo(x - sz, y)
    ctx.closePath()
    ctx.fill()
  }
  drawDiamond(pad, pad)
  drawDiamond(width - pad, pad)
  drawDiamond(pad, height - pad)
  drawDiamond(width - pad, height - pad)

  // 5. Brand Header
  const headerY = format === 'story' ? 210 : 150
  ctx.textAlign = 'center'
  ctx.fillStyle = '#FAF7F2'
  ctx.font = '300 38px "Plus Jakarta Sans", -apple-system, sans-serif'
  ctx.letterSpacing = '10px'
  ctx.fillText('Y O U N O Y A', width / 2 + 5, headerY)

  ctx.fillStyle = '#D6B06A'
  ctx.font = '600 16px "Plus Jakarta Sans", sans-serif'
  ctx.letterSpacing = '4px'
  ctx.fillText('✦  CELESTIAL PROPHECY • ASTER  ✦', width / 2 + 2, headerY + 44)

  // Divider Line with Central Star
  const lineY = headerY + 80
  ctx.strokeStyle = 'rgba(214, 176, 106, 0.3)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(width / 2 - 180, lineY)
  ctx.lineTo(width / 2 - 30, lineY)
  ctx.moveTo(width / 2 + 30, lineY)
  ctx.lineTo(width / 2 + 180, lineY)
  ctx.stroke()

  ctx.fillStyle = '#D6B06A'
  ctx.font = '16px serif'
  ctx.letterSpacing = '0px'
  ctx.fillText('✧', width / 2, lineY + 5)

  // 6. Recipient Chapter Pill
  const pillY = format === 'story' ? headerY + 160 : headerY + 130
  const pillText = `${name.toUpperCase()}  •  ${signSymbol} ${sign.toUpperCase()}  •  ${chapter.toUpperCase()}`
  ctx.font = '600 17px "Plus Jakarta Sans", sans-serif'
  const pillW = Math.min(width - 240, ctx.measureText(pillText).width + 60)
  const pillH = 46

  ctx.fillStyle = 'rgba(214, 176, 106, 0.12)'
  ctx.beginPath()
  ctx.roundRect(width / 2 - pillW / 2, pillY - pillH / 2, pillW, pillH, 23)
  ctx.fill()
  ctx.strokeStyle = 'rgba(214, 176, 106, 0.45)'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.fillStyle = '#F5EBD7'
  ctx.letterSpacing = '2px'
  ctx.fillText(pillText, width / 2, pillY + 6)

  // 7. Large Serif Quotation / Prophecy Body
  const quoteStartY = format === 'story' ? height * 0.40 : height * 0.44
  ctx.font = 'italic 400 50px "Cormorant Garamond", Georgia, serif'
  ctx.letterSpacing = '-0.5px'
  ctx.fillStyle = '#FAF7F2'

  // Decorative Opening Quote Symbol
  ctx.font = 'normal 400 90px "Cormorant Garamond", Georgia, serif'
  ctx.fillStyle = 'rgba(214, 176, 106, 0.4)'
  ctx.fillText('“', width / 2, quoteStartY - 20)

  // Wrap Text into clean 3-4 lines
  ctx.font = 'normal 400 42px "Cormorant Garamond", Georgia, serif'
  ctx.fillStyle = '#FAF7F2'
  const maxTextWidth = width - 260
  const lineHeight = 66
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

  let textY = quoteStartY + 45
  for (let i = 0; i < lines.length; i++) {
    // Highlight first line and key momentum words in warm gold
    if (i === 0 || i === lines.length - 1) {
      ctx.fillStyle = '#FDFBF7'
    } else {
      ctx.fillStyle = '#EBDDC5'
    }
    ctx.fillText(lines[i], width / 2, textY)
    textY += lineHeight
  }

  // 8. Talisman / Keepsake Anchor Badge
  if (anchorPiece) {
    const anchorY = format === 'story' ? Math.max(textY + 60, height * 0.72) : textY + 50
    ctx.fillStyle = 'rgba(214, 176, 106, 0.16)'
    const badgeText = `ANCHORED BY: ${anchorPiece.toUpperCase()}`
    ctx.font = '600 15px "Plus Jakarta Sans", sans-serif'
    ctx.letterSpacing = '3px'
    const badgeW = ctx.measureText(badgeText).width + 48
    ctx.beginPath()
    ctx.roundRect(width / 2 - badgeW / 2, anchorY - 18, badgeW, 36, 18)
    ctx.fill()
    ctx.strokeStyle = 'rgba(214, 176, 106, 0.35)'
    ctx.stroke()

    ctx.fillStyle = '#D6B06A'
    ctx.fillText(badgeText, width / 2, anchorY + 5)
  }

  // 9. Watermark Footer & Referral URL (CAC Reduction Hook)
  const footerY = format === 'story' ? height - 160 : height - 120
  ctx.strokeStyle = 'rgba(214, 176, 106, 0.25)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(width / 2 - 140, footerY - 40)
  ctx.lineTo(width / 2 + 140, footerY - 40)
  ctx.stroke()

  ctx.fillStyle = '#FAF7F2'
  ctx.font = '500 20px "Plus Jakarta Sans", sans-serif'
  ctx.letterSpacing = '2px'
  ctx.fillText('DISCOVER YOUR CHAPTER AT', width / 2, footerY)

  ctx.fillStyle = '#E5C07B'
  ctx.font = '700 26px "Plus Jakarta Sans", sans-serif'
  ctx.letterSpacing = '1px'
  ctx.fillText('younoya.com/find-a-gift', width / 2, footerY + 38)

  ctx.fillStyle = 'rgba(250, 247, 242, 0.5)'
  ctx.font = '400 15px "Plus Jakarta Sans", sans-serif'
  ctx.letterSpacing = '1px'
  ctx.fillText('Astrology-Backed Gifting • Intentionally Curated', width / 2, footerY + 70)
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
export async function downloadSocialCard(data, options = {}, filename = 'younoya-chapter-prophecy.png') {
  const blob = await generateSocialCardBlob(data, options)
  if (!blob) return
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
