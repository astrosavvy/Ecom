import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Compass, Heart, Share2, ArrowRight, ShieldCheck, Gift } from 'lucide-react'
import { resolveCategory, resolveRashi, getMatrixKey } from '../lib/categoryMapping'
import combinationsData from '../data/combinations.json'
import SocialShareModal from '../components/gift-guide/SocialShareModal'
import '../styles/GiftReveal.css'

export default function GiftReveal() {
  const { category: catParam, rashi: rashiParam } = useParams()
  const [showShareModal, setShowShareModal] = useState(false)

  const category = resolveCategory(catParam)
  const rashi = resolveRashi(rashiParam)

  // Resolve authentic chapter combination from 96-matrix
  const mercuryKey = getMatrixKey(rashi.slug, category.slug, 'Mercury')
  const ketuKey = getMatrixKey(rashi.slug, category.slug, 'Ketu')
  const combo = combinationsData[mercuryKey] || combinationsData[ketuKey] || {}

  // Fallbacks if matrix has sparse entries
  const setTitle = combo.setTitle || `The ${category.label.split('&')[0].trim()} Set`
  const story = combo.story || combo.whatYouMightBeGoingThrough || 
    `For the chapter where your inner intention aligns with purposeful action. In the cosmic dance of ${rashi.name}, this moment invites steady conviction and sacred clarity.`
  const whyChosen = combo.whyChosen || 
    `These sacred pieces were chosen to harmonize with the celestial element of ${rashi.element} and anchor your daily focus for ${category.label}.`
  
  const keepsakeName = combo.keepsake?.name || `${rashi.name} Sacred Altar Keepsake`
  const keepsakeDesc = combo.keepsake?.description || 
    `An authentic sculptural piece designed to anchor quiet presence in your workspace or personal altar.`
  
  const ritualName = combo.ritual?.name || `Artisan Scented Consecration Oil`
  const ritualDesc = combo.ritual?.description || 
    `A sensory anchor crafted with botanical essences to calm the nervous system before important conversations and rituals.`

  // Elemental class for dynamic cosmic aura (fire, earth, air, water)
  const elementClass = rashi?.element ? `gift-reveal--${rashi.element.toLowerCase()}` : 'gift-reveal--fire'

  const shareData = {
    name: 'You',
    sign: rashi.name,
    signSymbol: rashi.symbol,
    chapter: category.label,
    prophecy: `Under your ${rashi.name} transit, a quiet shift is clearing your path. What felt delayed was merely gathering force—trust your instincts over haste. Your season of effortless authority begins now.`,
    anchorPiece: keepsakeName.split('—')[0].trim(),
    defaultTheme: 'nocturne',
  }

  return (
    <div className={`gift-reveal ${elementClass}`}>
      <div className="gift-reveal__bg" aria-hidden="true">
        <div className="gift-reveal__nebula gift-reveal__nebula--primary" />
        <div className="gift-reveal__nebula gift-reveal__nebula--secondary" />
        <div className="gift-reveal__stars" />
      </div>
      
      <div className="gift-reveal__container">
        {/* Header / Brand Emblem */}
        <header className="gift-reveal__header">
          <div className="gift-reveal__emblem-halo">
            <div className="gift-reveal__emblem">
              <img src="/brand.webp" alt="YOUNOYA" />
            </div>
          </div>

          <div className="gift-reveal__badge-wrap">
            <div className="gift-reveal__badge">
              <span className="gift-reveal__badge-symbol">{rashi.symbol}</span>
              <span>{rashi.name} ({rashi.sanskrit}) • {category.label}</span>
            </div>
          </div>

          <h1 className="gift-reveal__title">
            Your Sacred Gift <em>Reveal</em>
          </h1>
          <p className="gift-reveal__subtitle">
            Someone chose this gift for you with deliberate intention and astrological guidance. Here is the wisdom and purpose behind what is inside your box.
          </p>
        </header>

        {/* Narrative Revelation Card (Double-Bezel Architecture) */}
        <motion.div 
          className="gift-reveal__card-shell"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="gift-reveal__card-core">
            <div className="gift-reveal__card-eyebrow">
              <Sparkles size={14} />
              <span>The Chapter Insight • {setTitle}</span>
            </div>

            <div className="gift-reveal__story">
              "{story}"
            </div>

            <div className="gift-reveal__why-chosen">
              <strong>Why this was consecrated for you:</strong> {whyChosen}
            </div>
          </div>
        </motion.div>

        {/* The Unboxed Treasures */}
        <h2 className="gift-reveal__section-title">
          Inside Your Box
        </h2>

        <div className="gift-reveal__treasures">
          {/* Keepsake Card */}
          <div className="gift-reveal__treasure-shell">
            <div className="gift-reveal__treasure-item">
              <span className="gift-reveal__treasure-tag">The Sacred Keepsake</span>
              <h3 className="gift-reveal__treasure-name">{keepsakeName.split('—')[0].trim()}</h3>
              <p className="gift-reveal__treasure-desc">{keepsakeDesc}</p>
              <div className="gift-reveal__treasure-placement">
                <Compass size={15} style={{ flexShrink: 0, marginTop: 2 }} />
                <span><strong>Placement:</strong> Position in the North-East corner of your desk or bedside table to ground positive momentum.</span>
              </div>
            </div>
          </div>

          {/* Ritual Card */}
          <div className="gift-reveal__treasure-shell">
            <div className="gift-reveal__treasure-item">
              <span className="gift-reveal__treasure-tag">The Consecration Ritual</span>
              <h3 className="gift-reveal__treasure-name">{ritualName.split('—')[0].trim()}</h3>
              <p className="gift-reveal__treasure-desc">{ritualDesc}</p>
              <div className="gift-reveal__treasure-placement">
                <Heart size={15} style={{ flexShrink: 0, marginTop: 2 }} />
                <span><strong>Ritual:</strong> Engage with this sensory tool for 60 seconds whenever you need to quiet mental turbulence.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Step Consecration Vidhi (Illuminated Timeline) */}
        <div className="gift-reveal__ritual-shell">
          <div className="gift-reveal__ritual-box">
            <div className="gift-reveal__ritual-heading">
              <span className="gift-reveal__ritual-eyebrow">Consecration Protocol</span>
              <h3>Three-Step Activation Vidhi</h3>
              <p>Perform this simple consecration upon unboxing to dedicate your keepsake to your chapter.</p>
            </div>

            <div className="gift-reveal__steps">
              <div className="gift-reveal__timeline-line" aria-hidden="true" />

              <div className="gift-reveal__step">
                <div className="gift-reveal__step-num-wrap">
                  <div className="gift-reveal__step-num">01</div>
                </div>
                <div className="gift-reveal__step-content">
                  <h4>Shuddhi • The Awakening</h4>
                  <p>Hold the keepsake gently between your palms. Inhale deeply for three counts under natural morning light to awaken the object's presence in your hands.</p>
                </div>
              </div>

              <div className="gift-reveal__step">
                <div className="gift-reveal__step-num-wrap">
                  <div className="gift-reveal__step-num">02</div>
                </div>
                <div className="gift-reveal__step-content">
                  <h4>Sankalpa • The Intention</h4>
                  <p>Silently hold your core chapter intention: <em>"{category.tagline}"</em>. Allow this affirmation to anchor what you are cultivating in this phase of life.</p>
                </div>
              </div>

              <div className="gift-reveal__step">
                <div className="gift-reveal__step-num-wrap">
                  <div className="gift-reveal__step-num">03</div>
                </div>
                <div className="gift-reveal__step-content">
                  <h4>Sthapana • Sacred Placement</h4>
                  <p>Place your keepsake in its dedicated sanctuary space. It now serves as an unwavering physical anchor of clarity whenever your eyes meet it.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Viral Share & Growth CTA */}
        <div className="gift-reveal__cta-wrap">
          <h3 className="gift-reveal__cta-title">Deeply Moved by Your Reveal?</h3>
          <p className="gift-reveal__cta-desc">
            Pass on the feeling of being truly seen. Commission an astrology-backed bespoke gift for someone dear, or share your chapter revelation.
          </p>

          <div className="gift-reveal__cta-buttons">
            <Link 
              to="/find-a-gift?utm_source=unboxing_qr&utm_medium=box_label&utm_campaign=gift_reveal"
              className="gift-reveal__btn-primary"
            >
              <Gift size={16} />
              <span>Curate a Gift for Someone</span>
              <span className="gift-reveal__btn-arrow" aria-hidden="true">
                <ArrowRight size={14} />
              </span>
            </Link>

            <button
              type="button"
              className="gift-reveal__btn-secondary"
              onClick={() => setShowShareModal(true)}
            >
              <Share2 size={16} />
              <span>Share Your Revelation</span>
            </button>
          </div>

          <p className="gift-reveal__footer-note">
            YOUNOYA ATELIER • For every chapter. Private edition reveal link.
          </p>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <SocialShareModal
          data={shareData}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  )
}
