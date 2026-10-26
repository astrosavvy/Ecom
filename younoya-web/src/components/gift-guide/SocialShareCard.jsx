import React, { useState } from 'react'
import { Sparkles, Share2, MessageCircle } from 'lucide-react'
import { generateProphecy } from '../../lib/prophecyGenerator'
import SocialShareModal from './SocialShareModal'
import '../../styles/SocialShareCard.css'

export default function SocialShareCard({ values, result }) {
  const [modalOpen, setModalOpen] = useState(false)

  const sign = result?.guide?.moonSign || result?.combination?.sign || 'Aries'
  const signSymbol = result?.combination?.signSymbol || '♈'
  const name = values?.name || 'You'
  const category = values?.intention || result?.primaryCategory?.intention || 'career'
  const chapterName = result?.primaryCategory?.categoryName || 'Career & Confidence'
  const anchorPiece = result?.primaryOffer?.title || result?.combination?.keepsake?.name?.split('—')[0]?.trim() || 'Sacred Keepsake'

  const prophecy = result?.intentionStatement || generateProphecy({ name, sign, category })
  const citation = result?.intentionHeading 
    ? `${result.intentionHeading} • ${chapterName}` 
    : `Drawn from lunar transit • ${chapterName}`

  const shareData = {
    name,
    sign,
    signSymbol,
    chapter: chapterName,
    prophecy,
    anchorPiece,
  }

  function handleQuickWhatsApp() {
    const text = `✦ Aster revealed my chapter prophecy for ${sign} ${signSymbol}:\n\n"${prophecy}"\n\nCurated at: https://younoya.com/find-a-gift?utm_source=whatsapp_share&utm_medium=chat&utm_campaign=prophecy`
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <section className="guide-prophecy-folio" aria-label="Personal chapter prophecy">
        <div className="guide-prophecy-folio__frame">
          <div className="guide-prophecy-folio__head">
            <span className="guide-prophecy-folio__badge">
              <Sparkles size={12} />
              <span>Chapter Folio • {sign} {signSymbol}</span>
            </span>
          </div>

          <blockquote className="guide-prophecy-folio__quote">
            "{prophecy}"
          </blockquote>

          <footer className="guide-prophecy-folio__footer">
            <span className="guide-prophecy-folio__citation">
              {citation}
            </span>

            <div className="guide-prophecy-folio__actions">
              <button
                type="button"
                className="guide-prophecy-folio__btn-open"
                onClick={() => setModalOpen(true)}
              >
                <Share2 size={15} />
                <span>Share Keepsake</span>
              </button>

              <button
                type="button"
                className="guide-prophecy-folio__btn-wa"
                onClick={handleQuickWhatsApp}
                title="Share directly via WhatsApp"
              >
                <MessageCircle size={15} className="guide-prophecy-folio__btn-wa-icon" />
                <span>Share via WhatsApp</span>
              </button>
            </div>
          </footer>
        </div>
      </section>

      {modalOpen && (
        <SocialShareModal
          data={shareData}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}
