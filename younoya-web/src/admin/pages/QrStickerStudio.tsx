import React, { useState, useMemo } from 'react'
import { Printer, Download, ExternalLink, Sparkles, Filter } from 'lucide-react'
import { CATEGORIES, RASHIS, resolveCategory, resolveRashi } from '../../lib/categoryMapping'
import { generateQrSvgString, drawQrToCanvas } from '../../lib/qrGenerator'
import '../../styles/QrStickerStudio.css'

export default function QrStickerStudio() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [rashiFilter, setRashiFilter] = useState<string>('all')

  const items = useMemo(() => {
    const list: Array<{ category: any; rashi: any; url: string; key: string }> = []
    
    const cats = categoryFilter === 'all' 
      ? Object.values(CATEGORIES) 
      : [resolveCategory(categoryFilter)]
    
    const rashis = rashiFilter === 'all' 
      ? RASHIS 
      : [resolveRashi(rashiFilter)]

    for (const cat of cats) {
      for (const r of rashis) {
        list.push({
          category: cat,
          rashi: r,
          url: `https://younoya.com/reveal/${cat.slug}/${r.slug}`,
          key: `${cat.slug}-${r.slug}`,
        })
      }
    }

    return list
  }, [categoryFilter, rashiFilter])

  function handlePrintSheet() {
    window.print()
  }

  function handleDownloadItem(item: { category: any; rashi: any; url: string }) {
    const canvas = document.createElement('canvas')
    const size = 1200
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, size, size)

    ctx.strokeStyle = '#D8CFC2'
    ctx.lineWidth = 4
    ctx.strokeRect(30, 30, size - 60, size - 60)

    ctx.fillStyle = '#1A140E'
    ctx.font = 'bold 54px Georgia, serif'
    ctx.textAlign = 'center'
    ctx.fillText('YOUNOYA', size / 2, 120)

    ctx.fillStyle = '#7A6F62'
    ctx.font = '600 32px "Plus Jakarta Sans", sans-serif'
    ctx.fillText('SACRED GIFT UNBOXING', size / 2, 175)

    const qrCanvas = document.createElement('canvas')
    drawQrToCanvas(qrCanvas, item.url, {
      size: 660,
      fgColor: '#120F0D',
      bgColor: '#FFFFFF',
      quietZone: 2,
      centerEmblem: true,
    })
    ctx.drawImage(qrCanvas, (size - 660) / 2, 230)

    const badgeY = 960
    ctx.fillStyle = '#1A140E'
    const badgeText = `${item.rashi.symbol} ${item.rashi.name.toUpperCase()} • ${item.category.label.toUpperCase()}`
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif'
    const textWidth = ctx.measureText(badgeText).width
    const badgePadX = 36
    const badgeHeight = 64
    ctx.fillRect((size - textWidth) / 2 - badgePadX, badgeY - 44, textWidth + badgePadX * 2, badgeHeight)

    ctx.fillStyle = '#FAF4EB'
    ctx.fillText(badgeText, size / 2, badgeY)

    ctx.fillStyle = '#5C5245'
    ctx.font = '500 28px "Plus Jakarta Sans", sans-serif'
    ctx.fillText('Scan with phone camera to reveal sacred ritual & chapter wisdom', size / 2, 1070)

    ctx.font = '400 24px "Plus Jakarta Sans", sans-serif'
    ctx.fillStyle = '#8C6A24'
    ctx.fillText(item.url, size / 2, 1120)

    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `younoya-box-qr-${item.category.slug}-${item.rashi.slug}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="ad__page">
      <header className="ad__head ad__head--row">
        <div>
          <h1>Box QR Sticker Studio</h1>
          <p>Generate, preview, and print 50mm × 50mm sticky paper labels for gift packaging.</p>
        </div>
        <div>
          <button 
            type="button" 
            className="order-box-label__btn-print"
            onClick={handlePrintSheet}
          >
            <Printer size={15} />
            <span>Print Current Selection ({items.length})</span>
          </button>
        </div>
      </header>

      {/* Filters */}
      <section className="ad-card">
        <div className="sticker-studio__controls">
          <div className="sticker-studio__field">
            <label>Filter Category</label>
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All 4 Gift Intentions</option>
              {Object.values(CATEGORIES).map(c => (
                <option key={c.slug} value={c.slug}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="sticker-studio__field">
            <label>Filter Rashi (Zodiac)</label>
            <select 
              value={rashiFilter} 
              onChange={(e) => setRashiFilter(e.target.value)}
            >
              <option value="all">All 12 Vedic Rashis</option>
              {RASHIS.map(r => (
                <option key={r.slug} value={r.slug}>{r.symbol} {r.name} ({r.sanskrit})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sticker Grid */}
        <div className="sticker-studio__grid">
          {items.map((it) => {
            const svgString = generateQrSvgString(it.url, {
              size: 120,
              fgColor: '#120F0D',
              bgColor: '#FFFFFF',
              quietZone: 2,
              centerEmblem: true,
            })

            return (
              <div key={it.key} className="sticker-studio__item">
                <span className="sticker-studio__brand">YOUNOYA</span>
                <div 
                  className="sticker-studio__qr" 
                  dangerouslySetInnerHTML={{ __html: svgString }} 
                />
                <div className="sticker-studio__badge">
                  {it.rashi.symbol} {it.rashi.name} • {it.category.slug.toUpperCase()}
                </div>
                <span className="sticker-studio__instruction">
                  Scan to reveal sacred ritual
                </span>

                <div className="sticker-studio__item-actions">
                  <button 
                    type="button" 
                    onClick={() => handleDownloadItem(it)}
                    title="Download 600 DPI PNG"
                  >
                    <Download size={13} />
                    <span>PNG</span>
                  </button>
                  <a 
                    href={it.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="Test reveal URL"
                  >
                    <ExternalLink size={13} />
                    <span>View</span>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
