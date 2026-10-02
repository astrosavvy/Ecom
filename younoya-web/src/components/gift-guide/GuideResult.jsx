import { useEffect, useRef } from 'react'
import { ArrowUpRight, Bookmark, ShoppingBag, Sparkles, Compass, ArrowRight, RotateCcw, Feather } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { getProductByHandle } from '../../data/products'
import GuideHistory from './GuideHistory'
import TypewriterText from './TypewriterText'
import WhatIsInside from './WhatIsInside'
import { getZodiacIcon, getDashaIcon } from './AstroIcons'

const money = value => `₹${((value || 0) / 100).toLocaleString('en-IN')}`
const destination = offer => `${offer.privateOffer ? '/offer/' : '/product/'}${offer.handle}`
const image = offer => !offer.privateOffer && getProductByHandle(offer.handle)?.shopCardImage || offer.image
const title = value => value === value.toUpperCase() ? value.toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase()) : value

export default function GuideResult({ values, result, onSave, onOrder, onRestart, saved, notice }) {
  const reduced = useReducedMotion(), region = useRef(null)
  const lead = result.primaryOffer || result.offers?.[0]
  const secondaryOffers = result.offers?.filter(o => o.id !== lead?.id) || []
  const hasProducts = Boolean(result.hasProducts && lead)
  const combination = result.combination

  const ZodiacIcon = getZodiacIcon(result.guide?.moonSign)
  const DashaIcon = getDashaIcon(result.guide?.antardasha)

  // Extract the 2 mandatory editorial sections
  const whatYouMightBeGoingThrough = 
    result.whatYouMightBeGoingThrough || 
    combination?.whatYouMightBeGoingThrough || 
    combination?.story || 
    result.explanation || 
    ''

  const whyChosen = 
    result.whyChosen || 
    combination?.whyChosen || 
    (!hasProducts ? result.explanation || '' : '')

  useEffect(() => {
    const frame = requestAnimationFrame(() => region.current?.querySelector('.guide-result__message')?.scrollIntoView({ block: 'start', behavior: reduced ? 'instant' : 'smooth' }))
    return () => cancelAnimationFrame(frame)
  }, [result, reduced])

  return (
    <motion.section
      ref={region}
      className="guide-result"
      aria-labelledby="guide-result-title"
      tabIndex={0}
      data-lenis-prevent
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.3 }}
    >
      {values.forWhom && <GuideHistory values={values} step={4} />}

      <div className="guide-result__message">
        <div className="guide-badges-ribbon">
          <span className="guide-eyebrow">
            <img src="/favicon.png" alt="" /> Aster · {result.previewOnly ? 'Collection preview' : 'Personal Atelier Curation'}
          </span>
          <div className="astro-pill-tags">
            <span className="astro-pill">
              <Sparkles size={13} className="astro-pill-icon" />
              <span>Personalized Chapter Alignment</span>
            </span>
          </div>
        </div>

        <h1 id="guide-result-title">
          {lead?.isHamper && combination?.setTitle ? (
            <><em>{combination.setTitle}</em></>
          ) : (
            <>Your Personal <em>Gifting Edit.</em></>
          )}
        </h1>

        {combination?.tagline && (
          <p className="guide-result__tagline">{combination.tagline}</p>
        )}

        {/* RECTANGULAR EDITORIAL BOX 1: WHAT YOU ARE EXPERIENCING */}
        {whatYouMightBeGoingThrough && (
          <div className="guide-editorial-card guide-editorial-card--experience">
            <div className="guide-editorial-card__header">
              <span className="guide-editorial-card__badge">
                <Sparkles size={13} /> WHAT YOU ARE EXPERIENCING
              </span>
              <span className="guide-editorial-card__sub">The Emotional & Life Chapter</span>
            </div>
            <div className="guide-editorial-card__body">
              <TypewriterText text={whatYouMightBeGoingThrough} speed={28} />
            </div>
          </div>
        )}

        {/* RECTANGULAR EDITORIAL BOX 2: WHY THESE ARE SUITED FOR YOU */}
        {whyChosen && (
          <div className="guide-editorial-card guide-editorial-card--rationale">
            <div className="guide-editorial-card__header">
              <span className="guide-editorial-card__badge">
                <Compass size={13} /> WHY THESE ARE SUITED FOR YOU
              </span>
              <span className="guide-editorial-card__sub">Your Intentional Keepsakes & Rituals</span>
            </div>
            <div className="guide-editorial-card__body">
              <TypewriterText text={whyChosen} speed={28} />
            </div>
          </div>
        )}

        {/* Intentional Shift Bar (Challenge -> Desired Shift) */}
        {combination && (combination.challenge || combination.desiredShift) && (
          <div className="guide-shift-bar">
            <div className="guide-shift-item challenge-tag">
              <span className="shift-label">Active Challenge</span>
              <span className="shift-val">{combination.challenge.replace(/_/g, ' ')}</span>
            </div>
            <ArrowRight size={14} className="shift-arrow" />
            <div className="guide-shift-item shift-tag">
              <span className="shift-label">Intentional Shift</span>
              <span className="shift-val">{combination.desiredShift.replace(/_/g, ' ')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Primary Category: The User's Selected Focus */}
      {lead && (
        <article className="guide-result__lead guide-result__lead--hamper">
          {image(lead) && (
            <Link className="guide-result__image" to={destination(lead)}>
              <img src={image(lead)} alt={lead.title} />
            </Link>
          )}
          <div className="guide-result__copy">
            <span className="guide-eyebrow">
              <Compass size={13} /> Primary Chapter · {result.primaryCategory?.categoryName || 'Your Selected Intention'}
            </span>
            <h2><Link to={destination(lead)}>{title(lead.title)}</Link></h2>
            {lead.story && <p className="guide-hamper-story">{lead.story}</p>}

            {/* What's Inside (Keepsake + Ritual Breakdown) */}
            <WhatIsInside combination={combination} offer={lead} />

            <div className="guide-lead-footer">
              <strong className="guide-result__price">{money(lead.price)}</strong>
              <button
                className="guide-primary guide-lead-cta"
                type="button"
                disabled={!lead.variantId}
                onClick={() => onOrder(lead)}
              >
                <ShoppingBag size={16} /> Order this Selection
              </button>
            </div>
          </div>
        </article>
      )}

      {/* Secondary & Tertiary Categories: Curations for the Other 3 Chapters */}
      {result.secondaryCategories && result.secondaryCategories.length > 0 && (
        <div className="guide-secondary-chapters">
          <div className="guide-secondary-chapters__header">
            <span className="guide-eyebrow">Complementary Curations</span>
            <h3>Across Your Other Life Chapters</h3>
            <p>Curated keepsakes tailored to accompany and ground your surrounding priorities.</p>
          </div>
          <div className="guide-secondary-chapters__grid">
            {result.secondaryCategories.map(cat => (
              <article key={cat.intention} className="guide-secondary-chapter-card">
                <div className="guide-secondary-chapter-card__top">
                  <span className="guide-secondary-chapter-card__badge">{cat.categoryName}</span>
                  <span className="guide-secondary-chapter-card__sub">{cat.subtitle}</span>
                </div>
                {cat.leadProduct && (
                  <div className="guide-secondary-chapter-card__body">
                    <Link to={destination(cat.leadProduct)} className="guide-secondary-chapter-card__image-link">
                      <img src={image(cat.leadProduct)} alt={cat.leadProduct.title} />
                    </Link>
                    <div className="guide-secondary-chapter-card__details">
                      <h4><Link to={destination(cat.leadProduct)}>{title(cat.leadProduct.title)}</Link></h4>
                      <strong className="guide-secondary-chapter-card__price">{money(cat.leadProduct.price)}</strong>
                    </div>
                    {cat.leadProduct.variantId && (
                      <button
                        type="button"
                        className="guide-secondary-chapter-card__btn"
                        onClick={() => onOrder(cat.leadProduct)}
                        aria-label={`Order ${cat.leadProduct.title}`}
                      >
                        <ShoppingBag size={14} /> Order
                      </button>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      )}

      {hasProducts && (
        <div className="guide-result__actions">
          {lead && (
            <button className="guide-primary" type="button" disabled={!lead.variantId} onClick={() => onOrder(lead)}>
              <ShoppingBag size={16} /> Order this selection
            </button>
          )}
          <button type="button" onClick={onSave} disabled={!lead?.variantId || saved}>
            <Bookmark size={16} /> {saved ? 'Saved to your account' : 'Save this edit'}
          </button>
          <button type="button" className="guide-btn-luxury-secondary" onClick={onRestart}>
            <RotateCcw size={14} /> <span>Begin Again</span>
          </button>
        </div>
      )}

      {notice && <p className="guide-note" role="status">{notice}</p>}
    </motion.section>
  )
}
