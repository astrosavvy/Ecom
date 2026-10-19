import React, { useEffect, useRef, useState } from 'react'
import { X, Share2, Download, MessageCircle, Sparkles } from 'lucide-react'
import { renderSocialCardToCanvas, generateSocialCardBlob, downloadSocialCard } from '../../lib/socialCardGenerator'
import '../../styles/SocialShareModal.css'

export default function SocialShareModal({ data, onClose }) {
  const canvasRef = useRef(null)
  const [format, setFormat] = useState('story') // 'story' (9:16) or 'feed' (1:1)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (canvasRef.current) {
      renderSocialCardToCanvas(canvasRef.current, data, { format })
    }
  }, [data, format])

  function showNotification(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  function handleWhatsAppShare() {
    const prophecyText = data.prophecy || ''
    const shareText = `✨ Aster revealed my chapter prophecy for ${data.sign} ${data.signSymbol || ''}:\n\n"${prophecyText}"\n\nDiscover what your chapter holds: https://younoya.com/find-a-gift?utm_source=whatsapp_share&utm_medium=chat&utm_campaign=prophecy`
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  async function handleNativeShare() {
    try {
      const blob = await generateSocialCardBlob(data, { format })
      if (!blob) return

      const file = new File([blob], `younoya-${data.sign?.toLowerCase() || 'chapter'}-prophecy.png`, { type: 'image/png' })
      const shareData = {
        title: `${data.sign} Chapter Prophecy | YOUNOYA`,
        text: `"${data.prophecy}" • Find your chapter at younoya.com/find-a-gift`,
        files: [file]
      }

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share(shareData)
        showNotification('Shared successfully!')
      } else {
        // Fallback: download and instruct
        await downloadSocialCard(data, { format }, file.name)
        showNotification('High-res card saved! Ready to post on Instagram Stories.')
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        await downloadSocialCard(data, { format })
        showNotification('Card saved to your device.')
      }
    }
  }

  async function handleDownload() {
    const filename = `younoya-${data.sign?.toLowerCase() || 'chapter'}-${format}.png`
    await downloadSocialCard(data, { format }, filename)
    showNotification('Card saved to your downloads in crystal-clear HD.')
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
          <X size={18} />
        </button>

        <header className="social-share-modal__head">
          <span className="social-share-modal__eyebrow">
            <Sparkles size={13} />
            <span>Chapter Prophecy</span>
          </span>
          <h3 className="social-share-modal__title">Share Your Revelation</h3>
          <p className="social-share-modal__desc">
            An electric, Cartier-grade prophecy synthesized for your current chapter. Ready for Instagram Stories and WhatsApp.
          </p>
        </header>

        {/* Format Selectors */}
        <div className="social-share-modal__toggles">
          <button
            type="button"
            className={`social-share-modal__toggle-btn ${format === 'story' ? 'active' : ''}`}
            onClick={() => setFormat('story')}
          >
            9:16 Story / Status
          </button>
          <button
            type="button"
            className={`social-share-modal__toggle-btn ${format === 'feed' ? 'active' : ''}`}
            onClick={() => setFormat('feed')}
          >
            1:1 Square Post
          </button>
        </div>

        {/* Live Canvas Preview */}
        <div className="social-share-modal__canvas-wrap">
          <canvas 
            ref={canvasRef} 
            className="social-share-modal__canvas" 
          />
        </div>

        {/* Share Action Buttons */}
        <div className="social-share-modal__actions">
          <button
            type="button"
            className="social-share-btn-whatsapp"
            onClick={handleWhatsAppShare}
          >
            <MessageCircle size={18} />
            <span>Share on WhatsApp</span>
          </button>

          <button
            type="button"
            className="social-share-btn-story"
            onClick={handleNativeShare}
          >
            <Share2 size={18} />
            <span>Share to Instagram / Device</span>
          </button>

          <button
            type="button"
            className="social-share-btn-download"
            onClick={handleDownload}
          >
            <Download size={16} />
            <span>Download 1080p HD Image</span>
          </button>
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
