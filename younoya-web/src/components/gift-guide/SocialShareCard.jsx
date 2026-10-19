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

  const prophecy = generateProphecy({ name, sign, category })

  const shareData = {
    name,
    sign,
    signSymbol,
    chapter: chapterName,
    prophecy,
    anchorPiece,
  }

  function handleQuickWhatsApp() {
    const text = `✨ Aster revealed my chapter prophecy for ${sign} ${signSymbol}:\n\n"${prophecy}"\n\nFind your chapter at: https://younoya.com/find-a-gift?utm_source=whatsapp_share&utm_medium=chat&utm_campaign=prophecy`
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <section className="guide-prophecy-card" aria-label="Personal chapter prophecy">
        <div className="guide-prophecy-card__content">
          <div className="guide-prophecy-card__badge">
            <Sparkles size={13} />
            <span>Chapter Prophecy • {sign} {signSymbol}</span>
          </div>

          <h3 className="guide-prophecy-card__title">
            Your Personal Prophecy is Ready
          </h3>

          <p className="guide-prophecy-card__text">
            "{prophecy}"
          </p>

          <div className="guide-prophecy-card__actions">
            <button
              type="button"
              className="guide-prophecy-btn-share"
              onClick={() => setModalOpen(true)}
            >
              <Share2 size={16} />
              <span>Share to Stories & WhatsApp</span>
            </button>

            <button
              type="button"
              className="guide-prophecy-btn-wa"
              onClick={handleQuickWhatsApp}
              title="Share directly to WhatsApp"
            >
              <MessageCircle size={16} />
              <span>1-Tap WhatsApp</span>
            </button>
          </div>
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
