import React, { useEffect, useRef, useState } from 'react'
import { X, Share2, Download, MessageCircle, Sparkles } from 'lucide-react'
import { renderSocialCardToCanvas, generateSocialCardBlob, downloadSocialCard } from '../../lib/socialCardGenerator'
import '../../styles/SocialShareModal.css'

export default function SocialShareModal({ data, onClose }) {
  const canvasRef = useRef(null)
  // Default format is strictly 1:1 Square Post ('feed') as requested
  const [format, setFormat] = useState('feed') 
  const [theme, setTheme] = useState(data?.defaultTheme || 'atelier') // 'atelier' (Warm Ivory) or 'nocturne' (Deep Obsidian)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (canvasRef.current) {
      renderSocialCardToCanvas(canvasRef.current, data, { format, theme })
    }
  }, [data, format, theme])

  function showNotification(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  function handleWhatsAppShare() {
    const prophecyText = data.prophecy || ''
    const shareText = `✦ Aster revealed my chapter prophecy for ${data.sign} ${data.signSymbol || ''}:\n\n"${prophecyText}"\n\nCurated at: https://younoya.com/find-a-gift?utm_source=whatsapp_share&utm_medium=chat&utm_campaign=prophecy`
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  async function handleNativeShare() {
    try {
      const blob = await generateSocialCardBlob(data, { format, theme })
      if (!blob) return

      const file = new File([blob], `younoya-${data.sign?.toLowerCase() || 'chapter'}-${format}.png`, { type: 'image/png' })
      const shareData = {
        title: `${data.sign} Chapter Revelation | YOUNOYA`,
        text: `"${data.prophecy}" • younoya.com/find-a-gift`,
        files: [file]
      }

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share(shareData)
        showNotification('Shared successfully.')
      } else {
        await downloadSocialCard(data, { format, theme }, file.name)
        showNotification('High-resolution art card saved to your device.')
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        await downloadSocialCard(data, { format, theme })
        showNotification('Card saved to your device.')
      }
    }
  }

  async function handleDownload() {
    const filename = `younoya-${data.sign?.toLowerCase() || 'chapter'}-${format}-${theme}.png`
    await downloadSocialCard(data, { format, theme }, filename)
    showNotification('High-resolution art card saved to your downloads.')
  }

  return (
    <div className="social-share-backdrop" onClick={onClose}>
      <div className="social-share-modal" onClick={(e) => e.stopPropagation()}>
        <button 
          type="button" 
          className="social-share-modal__close" 
          onClick={onClose}
          aria-label="Close share dialog"
        >
          <X size={16} />
        </button>

        <header className="social-share-modal__head">
          <span className="social-share-modal__eyebrow">
            <Sparkles size={12} />
            <span>Chapter Folio</span>
          </span>
          <h3 className="social-share-modal__title">The Written Revelation</h3>
          <p className="social-share-modal__desc">
            A quiet contemplation drawn from your celestial transit. Formatted as an editorial art print for your feed or story.
          </p>
        </header>

        {/* Dual Segmented Controls: Format & Theme */}
        <div className="social-share-modal__controls">
          <div className="social-share-modal__toggles" role="tablist" aria-label="Card format">
            <button
              type="button"
              className={`social-share-modal__toggle-btn ${format === 'feed' ? 'active' : ''}`}
              onClick={() => setFormat('feed')}
            >
              Post
            </button>
            <button
              type="button"
              className={`social-share-modal__toggle-btn ${format === 'story' ? 'active' : ''}`}
              onClick={() => setFormat('story')}
            >
              Story
            </button>
          </div>

          <div className="social-share-modal__themes" role="tablist" aria-label="Visual edition">
            <button
              type="button"
              className={`social-share-modal__theme-btn ${theme === 'atelier' ? 'active' : ''}`}
              onClick={() => setTheme('atelier')}
              title="Atelier Warm Ivory (Editorial Parchment)"
            >
              <span className="theme-dot theme-dot--ivory" />
              <span>Atelier Ivory</span>
            </button>
            <button
              type="button"
              className={`social-share-modal__theme-btn ${theme === 'nocturne' ? 'active' : ''}`}
              onClick={() => setTheme('nocturne')}
              title="Nocturne Noir (Architectural Obsidian)"
            >
              <span className="theme-dot theme-dot--noir" />
              <span>Nocturne</span>
            </button>
          </div>
        </div>

        {/* Exhibition Matting Preview */}
        <div className="social-share-modal__canvas-wrap">
          <canvas 
            ref={canvasRef} 
            className={`social-share-modal__canvas social-share-modal__canvas--${format}`} 
          />
        </div>

        {/* Restrained Luxury Action Controls */}
        <div className="social-share-modal__actions">
          <button
            type="button"
            className="social-share-btn-primary"
            onClick={handleDownload}
          >
            <Download size={16} />
            <span>Download Card</span>
          </button>

          <div className="social-share-modal__actions-row">
            <button
              type="button"
              className="social-share-btn-secondary"
              onClick={handleNativeShare}
            >
              <Share2 size={15} />
              <span>Share Image</span>
            </button>

            <button
              type="button"
              className="social-share-btn-whatsapp"
              onClick={handleWhatsAppShare}
            >
              <MessageCircle size={15} className="social-share-btn-whatsapp__icon" />
              <span>Share via WhatsApp</span>
            </button>
          </div>
        </div>

        {toast && (
          <p className="social-share-modal__toast" role="status">
            {toast}
          </p>
        )}
      </div>
    </div>
  )
}
