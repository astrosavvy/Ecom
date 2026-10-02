import { Sparkles, Compass, Feather } from 'lucide-react'

export default function WhatIsInside({ combination, offer }) {
  const keepsake = combination?.keepsake || (offer?.keepsake ? offer.keepsake : null)
  const ritual = combination?.ritual || (offer?.ritual ? offer.ritual : null)
  const luxury = combination?.luxuryAddOn || (offer?.luxuryAddOn ? offer.luxuryAddOn : null)

  if (!keepsake && !ritual) return null

  return (
    <div className="what-is-inside">
      <div className="what-is-inside__header">
        <span className="what-is-inside__eyebrow">
          <Sparkles size={13} /> Sacred Composition
        </span>
        <h3 className="what-is-inside__title">What’s Inside Your Curated Set</h3>
      </div>

      <div className="what-is-inside__grid">
        {keepsake?.name && (
          <div className="what-is-inside__card keepsake-card">
            <div className="what-is-inside__badge">
              <Compass size={13} /> {keepsake.role || 'Sacred Keepsake Anchor'}
            </div>
            <h4 className="what-is-inside__item-name">{keepsake.name}</h4>
            {keepsake.description && (
              <p className="what-is-inside__item-desc">{keepsake.description}</p>
            )}
          </div>
        )}

        {ritual?.name && (
          <div className="what-is-inside__card ritual-card">
            <div className="what-is-inside__badge">
              <Feather size={13} /> {ritual.role || 'Sensory Daily Ritual'}
            </div>
            <h4 className="what-is-inside__item-name">{ritual.name}</h4>
            {ritual.description && (
              <p className="what-is-inside__item-desc">{ritual.description}</p>
            )}
          </div>
        )}

        {luxury?.title && (
          <div className="what-is-inside__card luxury-card">
            <div className="what-is-inside__badge">
              <Sparkles size={13} /> Optional Atelier Signature Add-On
            </div>
            <h4 className="what-is-inside__item-name">{luxury.title}</h4>
            <span className="what-is-inside__price-note">{luxury.priceRange || 'Suggested Signature Add-On'}</span>
          </div>
        )}
      </div>
    </div>
  )
}
