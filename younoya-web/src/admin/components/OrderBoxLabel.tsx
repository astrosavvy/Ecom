import React, { useState, useMemo, useRef } from 'react'
import { Printer, Download, ExternalLink, QrCode } from 'lucide-react'
import { CATEGORIES, RASHIS, resolveCategory, resolveRashi } from '../../lib/categoryMapping'
import { generateQrSvgString, drawQrToCanvas } from '../../lib/qrGenerator'
import '../../styles/OrderBoxLabel.css'

interface OrderBoxLabelProps {
  order: {
    id: string
    display_id?: number
    items?: Array<{ id: string; title: string }>
    shipping_address?: { first_name?: string; last_name?: string }
  }
}

export default function OrderBoxLabel({ order }: OrderBoxLabelProps) {
  // Try to intelligently detect category and rashi from order item titles
  const defaultDetection = useMemo(() => {
    let matchedCat = 'career'
    let matchedRashi = 'aries'

    const itemTitles = (order.items || []).map(it => it.title.toLowerCase()).join(' ')
    
    // Check categories
    if (itemTitles.includes('love') || itemTitles.includes('passion') || itemTitles.includes('connection')) matchedCat = 'love'
    else if (itemTitles.includes('vital') || itemTitles.includes('peace') || itemTitles.includes('balance')) matchedCat = 'vitality'
    else if (itemTitles.includes('wealth') || itemTitles.includes('abundance') || itemTitles.includes('prosperity') || itemTitles.includes('kalash')) matchedCat = 'wealth'
    else if (itemTitles.includes('power') || itemTitles.includes('confidence') || itemTitles.includes('career') || itemTitles.includes('horse')) matchedCat = 'career'

    // Check rashis
    for (const r of RASHIS) {
      if (itemTitles.includes(r.slug) || itemTitles.includes(r.vedic) || itemTitles.includes(r.name.toLowerCase())) {
        matchedRashi = r.slug
        break
      }
    }

    return { category: matchedCat, rashi: matchedRashi }
  }, [order.items])

  const [selectedCatSlug, setSelectedCatSlug] = useState(defaultDetection.category)
  const [selectedRashiSlug, setSelectedRashiSlug] = useState(defaultDetection.rashi)
  const [selectedDasha, setSelectedDasha] = useState<string>('')
  const [selectedExperience, setSelectedExperience] = useState<string>('other')

  const activeCategory = resolveCategory(selectedCatSlug)
  const activeRashi = resolveRashi(selectedRashiSlug)

  const queryParams = new URLSearchParams()
  if (selectedRashiSlug === 'taurus' && selectedDasha) {
    queryParams.set('dasha', selectedDasha)
    if (selectedExperience) queryParams.set('exp', selectedExperience)
  }
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''
  const revealUrl = `https://younoya.com/reveal/${activeCategory.slug}/${activeRashi.slug}${queryString}`
  const orderRef = order.display_id ? `#YOU-${String(order.display_id).padStart(4, '0')}` : `#${order.id.slice(0, 8)}`
  const recipientName = [order.shipping_address?.first_name, order.shipping_address?.last_name].filter(Boolean).join(' ')

  // Generate SVG string for live rendering
  const qrSvg = useMemo(() => {
    return generateQrSvgString(revealUrl, {
      size: 130,
      fgColor: '#120F0D',
      bgColor: '#FFFFFF',
      quietZone: 2,
      centerEmblem: true,
    })
  }, [revealUrl])

  function handlePrint() {
    window.print()
  }

  function handleDownloadPng() {
    const canvas = document.createElement('canvas')
    const size = 1200 // Crisp 600 DPI print scale
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw white sticker background
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, size, size)

    // Border hairline
    ctx.strokeStyle = '#D8CFC2'
    ctx.lineWidth = 4
    ctx.strokeRect(30, 30, size - 60, size - 60)

    // Header: YOUNOYA
    ctx.fillStyle = '#1A140E'
    ctx.font = 'bold 54px Georgia, serif'
    ctx.textAlign = 'center'
    ctx.fillText('YOUNOYA', size / 2, 120)

    ctx.fillStyle = '#7A6F62'
    ctx.font = '600 32px "Plus Jakarta Sans", sans-serif'
    ctx.fillText(`ORDER ${orderRef}${recipientName ? ` • ${recipientName.toUpperCase()}` : ''}`, size / 2, 175)

    // Draw QR Code
    const qrCanvas = document.createElement('canvas')
    drawQrToCanvas(qrCanvas, revealUrl, {
      size: 660,
      fgColor: '#120F0D',
      bgColor: '#FFFFFF',
      quietZone: 2,
      centerEmblem: true,
    })
    ctx.drawImage(qrCanvas, (size - 660) / 2, 230)

    // Badge: RASHI & CATEGORY
    const badgeY = 960
    ctx.fillStyle = '#1A140E'
    const badgeText = `${activeRashi.symbol} ${activeRashi.name.toUpperCase()} • ${activeCategory.label.toUpperCase()}`
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif'
    const textWidth = ctx.measureText(badgeText).width
    const badgePadX = 36
    const badgeHeight = 64
    ctx.fillRect((size - textWidth) / 2 - badgePadX, badgeY - 44, textWidth + badgePadX * 2, badgeHeight)

    ctx.fillStyle = '#FAF4EB'
    ctx.fillText(badgeText, size / 2, badgeY)

    // Footer instruction
    ctx.fillStyle = '#5C5245'
    ctx.font = '500 28px "Plus Jakarta Sans", sans-serif'
    ctx.fillText('Scan with phone camera to reveal sacred ritual & chapter wisdom', size / 2, 1070)

    ctx.font = '400 24px "Plus Jakarta Sans", sans-serif'
    ctx.fillStyle = '#8C6A24'
    ctx.fillText(revealUrl, size / 2, 1120)

    // Trigger download
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `younoya-box-qr-${orderRef.replace('#', '')}-${activeCategory.slug}-${activeRashi.slug}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <section className="ad-card order-box-label-card">
      <div className="ad-card__head">
        <h2>
          <QrCode size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: 6 }} />
          Box Unboxing QR Sticker
        </h2>
        <span className="ad-note">Print for box packaging (50mm × 50mm sticky label)</span>
      </div>

      {/* Selectors */}
      <div className="order-box-label__controls">
        <div className="order-box-label__field">
          <label>Gift Category</label>
          <select 
            value={selectedCatSlug} 
            onChange={(e) => setSelectedCatSlug(e.target.value)}
          >
            {Object.values(CATEGORIES).map(cat => (
              <option key={cat.slug} value={cat.slug}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className="order-box-label__field">
          <label>Vedic Rashi (Sign)</label>
          <select 
            value={selectedRashiSlug} 
            onChange={(e) => setSelectedRashiSlug(e.target.value)}
          >
            {RASHIS.map(r => (
              <option key={r.slug} value={r.slug}>{r.symbol} {r.name} ({r.sanskrit})</option>
            ))}
          </select>
        </div>

        {selectedRashiSlug === 'taurus' && (
          <>
            <div className="order-box-label__field">
              <label>Taurus Dasha Chapter</label>
              <select 
                value={selectedDasha} 
                onChange={(e) => setSelectedDasha(e.target.value)}
              >
                <option value="">Default (Mercury Baseline)</option>
                <option value="Ketu">Ketu (The Beauty of Enough)</option>
                <option value="Venus">Venus (The Art of Adoration)</option>
                <option value="Sun">Sun (Leads with Heart)</option>
                <option value="Moon">Moon (Feels Like Home)</option>
                <option value="Mars">Mars (Inspires to Grow)</option>
                <option value="Rahu">Rahu (Tactical Ambition)</option>
                <option value="Jupiter">Jupiter (Hope & Perspective)</option>
                <option value="Saturn">Saturn (Endurance & Abundance)</option>
                <option value="Mercury">Mercury (Time Wisdom)</option>
              </select>
            </div>

            <div className="order-box-label__field">
              <label>Experience Tone</label>
              <select 
                value={selectedExperience} 
                onChange={(e) => setSelectedExperience(e.target.value)}
              >
                <option value="other">Gifting Someone Else</option>
                <option value="self">Buying For Myself</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* Sticker Preview */}
      <div className="order-box-label__preview-wrap">
        <div id="printable-box-label" className="order-box-label__sticker">
          <div className="order-box-label__sticker-header">
            <span className="order-box-label__sticker-brand">YOUNOYA</span>
            <span className="order-box-label__sticker-ref">
              {orderRef}{recipientName ? ` • ${recipientName}` : ''}
            </span>
          </div>

          <div 
            className="order-box-label__qr-wrap" 
            dangerouslySetInnerHTML={{ __html: qrSvg }} 
          />

          <div className="order-box-label__sticker-footer">
            <div className="order-box-label__sticker-badge">
              {activeRashi.symbol} {activeRashi.name} • {activeCategory.slug.toUpperCase()}
            </div>
            <p className="order-box-label__sticker-instruction">
              Scan with phone camera to reveal sacred ritual & chapter wisdom
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="order-box-label__actions">
        <button 
          type="button" 
          className="order-box-label__btn-print"
          onClick={handlePrint}
        >
          <Printer size={15} />
          <span>Print Sticky Label (50×50mm)</span>
        </button>

        <button 
          type="button" 
          className="order-box-label__btn-download"
          onClick={handleDownloadPng}
        >
          <Download size={15} />
          <span>Download 600 DPI PNG</span>
        </button>

        <a 
          href={revealUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="order-box-label__link-preview"
        >
          <ExternalLink size={14} />
          <span>Test Live Reveal Page</span>
        </a>
      </div>
    </section>
  )
}
