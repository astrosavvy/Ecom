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
            <img src="/favicon.png" alt="" /> Aster · {result.previewOnly ? 'Collection preview' : result.method === 'astrology' ? 'Vedic Astrology Alignment' : 'Personal Edit'}
          </span>
          {result.guide?.moonSign && (
            <div className="astro-pill-tags">
              <span className="astro-pill">
                {ZodiacIcon && <ZodiacIcon size={14} className="astro-pill-icon" />}
                <span>{result.guide.moonSign} Moon</span>
              </span>
              {result.guide.antardasha && (
                <span className="astro-pill">
                  {DashaIcon && <DashaIcon size={14} className="astro-pill-icon" />}
                  <span>{result.guide.antardasha} Dasha</span>
                </span>
              )}
            </div>
          )}
        </div>

        <h1 id="guide-result-title">
          {combination?.setTitle ? (
            <><em>{combination.setTitle}</em></>
          ) : hasProducts ? (
            <>A little meaning, <em>chosen for you.</em></>
          ) : (
            <>Your Celestial <em>Reading.</em></>
          )}
        </h1>

        {combination?.tagline && (
          <p className="guide-result__tagline">{combination.tagline}</p>
        )}

        {/* RECTANGULAR EDITORIAL BOX 1: WHAT YOU MIGHT BE GOING THROUGH */}
        {whatYouMightBeGoingThrough && (
          <div className="guide-editorial-card guide-editorial-card--experience">
            <div className="guide-editorial-card__header">
              <span className="guide-editorial-card__badge">
                <Sparkles size={13} /> WHAT YOU MIGHT BE GOING THROUGH
              </span>
              <span className="guide-editorial-card__sub">The Emotional Crossroad & Life Chapter</span>
            </div>
            <div className="guide-editorial-card__body">
              <TypewriterText text={whatYouMightBeGoingThrough} speed={14} />
            </div>
          </div>
        )}

        {/* RECTANGULAR EDITORIAL BOX 2: WHY THIS WAS CHOSEN FOR YOU */}
        {whyChosen && (
          <div className="guide-editorial-card guide-editorial-card--rationale">
            <div className="guide-editorial-card__header">
              <span className="guide-editorial-card__badge">
                <Compass size={13} /> WHY THIS WAS CHOSEN FOR YOU
              </span>
              <span className="guide-editorial-card__sub">The Physical Anchor & Intentional Rationale</span>
            </div>
            <div className="guide-editorial-card__body">
              <TypewriterText text={whyChosen} speed={14} />
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

      {/* Case A: Products are available (Mercury/Ketu Hamper) */}
      {hasProducts && lead && (
        <>
          <article className="guide-result__lead guide-result__lead--hamper">
            {image(lead) && (
              <Link className="guide-result__image" to={destination(lead)}>
                <img src={image(lead)} alt={lead.title} />
              </Link>
            )}
            <div className="guide-result__copy">
              <span className="guide-eyebrow">
                <Compass size={13} /> {lead.isHamper ? 'Your Curated Set' : 'Your Chosen Piece'}
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
                  <ShoppingBag size={16} /> Order this Curated Set
                </button>
              </div>
            </div>
          </article>

          {/* Secondary Companion Pieces */}
          {secondaryOffers.length > 0 && (
            <div className="guide-result__others">
              <div className="guide-result__others-header">
                <span className="guide-eyebrow">Companion Keepsakes</span>
                <h3>Complementary Atelier Pieces</h3>
              </div>
              <div>
                {secondaryOffers.map(offer => (
                  <article key={offer.id}>
                    <Link to={destination(offer)}>
                      {image(offer) && <img src={image(offer)} alt="" />}
                      <span>{title(offer.title)}<small>{money(offer.price)}</small></span>
                      <ArrowUpRight size={16} />
                    </Link>
                    {offer.variantId && (
                      <button type="button" aria-label={`Order ${offer.title}`} onClick={() => onOrder(offer)}>
                        <ShoppingBag size={16} />
                      </button>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Case B: No products available for this Dasha period */}
      {!hasProducts && (
        <div className="guide-unsupported-dasha-container">

          <div className="guide-unsupported-dasha-card">
            <div className="guide-unsupported-dasha-card__icon">
              <Compass size={24} />
            </div>
            <h3>Atelier Crafting In Progress</h3>
            <p className="guide-unsupported-dasha-card__desc">
              For your active <strong>{result.guide?.antardasha || 'planetary'}</strong> period, dedicated curation sets are not yet available in our portfolio / store. The atelier is currently handcrafting keepsakes and rituals for upcoming planetary chapters.
            </p>
            <div className="guide-unsupported-dasha-card__actions">
              <Link to="/shop" className="guide-primary">
                Explore All Products <ArrowUpRight size={15} />
              </Link>
              <button type="button" className="guide-btn-luxury-secondary" onClick={onRestart}>
                <RotateCcw size={14} /> <span>Begin Again</span>
              </button>
            </div>
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
