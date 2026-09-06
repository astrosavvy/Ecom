import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

export default function HomePage() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    // Subtle interval to cycle personalization preview steps if reduced motion is not preferred
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mediaQuery.matches) return

    const timer = window.setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3)
    }, 4500)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="yn-atelier-home">
      {/* =========================================================================
          SECTION 1: ATELIER SPLIT HERO (Layout Family 1: Asymmetric Cinematic Split)
          Discipline: H1 max 2 lines, subtext < 20 words, primary CTAs visible at 1280x800.
          Max 4 text elements: Headline, Subtext, Dual CTAs.
          ========================================================================= */}
      <section className="yn-hero-section">
        <div className="yn-container yn-hero-grid">
          <div className="yn-hero-copy">
            <h1 className="yn-hero-title">
              Gifts shaped by intention, <br />
              <span className="yn-italic-accent">chosen by your stars.</span>
            </h1>
            <p className="yn-hero-subtext">
              Curated keepsakes consecrated for the moments that matter. Browse our collection or let our concierge personalize your gift.
            </p>
            <div className="yn-hero-actions">
              <Link to="/shop" className="yn-btn-primary">
                Shop the Collection
              </Link>
              <Link to="/personalise" className="yn-btn-secondary">
                Find Their Gift
              </Link>
            </div>
          </div>

          <div className="yn-hero-visual" aria-hidden="true">
            <div className="yn-hero-frame">
              <div className="yn-hero-glow" />
              <img
                src="/products/sphatik-shree-yantra-pendant.webp"
                alt="Sphatik Quartz Consecrated Keepsake"
                className="yn-hero-product-img"
              />
              <div className="yn-hero-caption">
                <span className="yn-caption-dot" />
                <span>Sphatik Quartz Keepsake / Consecrated 108 Times</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: DUAL-PATHWAY PORTAL (Layout Family 2: Balanced Architectural Dual-Pillar)
          Purpose: Differentiates standard shopping from intelligent personalization.
          Includes Eyebrow 1 of 2.
          ========================================================================= */}
      <section className="yn-portal-section">
        <div className="yn-container">
          <div className="yn-section-header yn-text-center">
            <span className="yn-eyebrow">Two Paths to Discovery</span>
            <h2 className="yn-section-title">Choose your way to gift</h2>
            <p className="yn-section-sub">
              Whether browsing freely or seeking guidance tailored to a recipient, every keepsake is crafted to honor personal chapters.
            </p>
          </div>

          <div className="yn-portal-grid">
            {/* Pillar 1: Shop the Collection */}
            <div className="yn-portal-card">
              <div className="yn-portal-badge">Normal Discovery</div>
              <h3 className="yn-portal-title">Shop the Collection</h3>
              <p className="yn-portal-desc">
                Explore our catalog of crystal trees, hand-finished cufflinks, natural gemstone pendants, and prosperity hangings without providing personal details.
              </p>
              <div className="yn-portal-preview-row">
                <div className="yn-portal-chip">Brooches & Cufflinks</div>
                <div className="yn-portal-chip">Crystal Trees</div>
                <div className="yn-portal-chip">Sacred Jewellery</div>
              </div>
              <div className="yn-portal-action">
                <Link to="/shop" className="yn-btn-outline">
                  Browse Collection
                </Link>
              </div>
            </div>

            {/* Pillar 2: Find Their Gift */}
            <div className="yn-portal-card yn-portal-card--highlight">
              <div className="yn-portal-badge yn-portal-badge--gold">Intelligent Concierge</div>
              <h3 className="yn-portal-title">Find Their Gift</h3>
              <p className="yn-portal-desc">
                Share what you know about them. Our concierge matches their planetary energy and life chapter to unveil one ideal keepsake plus alternatives.
              </p>
              <div className="yn-portal-steps-mini">
                <span className="yn-mini-step">Recipient</span>
                <span className="yn-mini-sep">→</span>
                <span className="yn-mini-step">Numerology / Astrology</span>
                <span className="yn-mini-sep">→</span>
                <span className="yn-mini-step">One Hero Match</span>
              </div>
              <div className="yn-portal-action">
                <Link to="/personalise" className="yn-btn-gold">
                  Begin Personalization
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: CURATED KEEPSAKES (Layout Family 3: Asymmetric Staggered Gallery)
          Purpose: Curated real products with varying heights, offsets, and authentic prices.
          No eyebrow.
          ========================================================================= */}
      <section className="yn-showcase-section">
        <div className="yn-container">
          <div className="yn-section-header">
            <h2 className="yn-section-title">Keepsakes of enduring presence</h2>
            <p className="yn-section-sub">
              Each creation unites unheated gemstones, sacred metal alloys, and deliberate geometric proportion.
            </p>
          </div>

          <div className="yn-staggered-grid">
            {/* Card 1: Emerald Pendant (Aspect 3/4) */}
            <div className="yn-stagger-item yn-stagger-item--1">
              <Link to="/product/emerald-budha-vani-pendant" className="yn-product-card">
                <div className="yn-product-media yn-ratio-3-4">
                  <img
                    src="/products/emerald-budha-vani-pendant.webp"
                    alt="Budha Emerald Vani Pendant"
                    loading="lazy"
                  />
                </div>
                <div className="yn-product-meta">
                  <div className="yn-product-name">Budha Emerald Vani Pendant</div>
                  <div className="yn-product-specs">Natural Zambian Emerald / 18K Gold Vermeil</div>
                  <div className="yn-product-price">Rs. 14,800</div>
                </div>
              </Link>
            </div>

            {/* Card 2: Sphatik Shree Yantra (Aspect 1/1, offset down) */}
            <div className="yn-stagger-item yn-stagger-item--2">
              <Link to="/product/sphatik-shree-yantra-pendant" className="yn-product-card">
                <div className="yn-product-media yn-ratio-1-1">
                  <img
                    src="/products/sphatik-shree-yantra-pendant.webp"
                    alt="Sphatik Shree Yantra Keepsake"
                    loading="lazy"
                  />
                </div>
                <div className="yn-product-meta">
                  <div className="yn-product-name">Sphatik Shree Yantra Keepsake</div>
                  <div className="yn-product-specs">Himalayan Clear Quartz / Silver Geometry</div>
                  <div className="yn-product-price">Rs. 7,200</div>
                </div>
              </Link>
            </div>

            {/* Card 3: Pearl Bracelet (Aspect 4/5, offset up) */}
            <div className="yn-stagger-item yn-stagger-item--3">
              <Link to="/product/pearl-chandra-sukh-bracelet" className="yn-product-card">
                <div className="yn-product-media yn-ratio-4-5">
                  <img
                    src="/products/pearl-chandra-sukh-bracelet.webp"
                    alt="Pearl Chandra Sukh Bracelet"
                    loading="lazy"
                  />
                </div>
                <div className="yn-product-meta">
                  <div className="yn-product-name">Pearl Chandra Sukh Bracelet</div>
                  <div className="yn-product-specs">South Sea Cultured Pearl / Silk Thread</div>
                  <div className="yn-product-price">Rs. 4,800</div>
                </div>
              </Link>
            </div>

            {/* Card 4: Sapphire Ring (Aspect 1/1, offset down) */}
            <div className="yn-stagger-item yn-stagger-item--4">
              <Link to="/product/yellow-sapphire-guru-blessing-ring" className="yn-product-card">
                <div className="yn-product-media yn-ratio-1-1">
                  <img
                    src="/products/yellow-sapphire-guru-blessing-ring.webp"
                    alt="Guru Blessing Sapphire Ring"
                    loading="lazy"
                  />
                </div>
                <div className="yn-product-meta">
                  <div className="yn-product-name">Guru Blessing Sapphire Ring</div>
                  <div className="yn-product-specs">Natural Ceylon Pukhraj / Panchaloha Band</div>
                  <div className="yn-product-price">Rs. 16,500</div>
                </div>
              </Link>
            </div>
          </div>

          <div className="yn-showcase-footer">
            <Link to="/shop" className="yn-text-link">
              Explore all 14 curated keepsakes →
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: PERSONALIZATION PROGRESSION (Layout Family 4: Sticky 2-Column Progressive Flow)
          Purpose: Demonstrates the intelligence layer as an effortless concierge.
          Includes Eyebrow 2 of 2.
          ========================================================================= */}
      <section className="yn-narrative-section">
        <div className="yn-container yn-narrative-grid">
          {/* Left Column: Sticky architectural summary */}
          <div className="yn-sticky-panel">
            <span className="yn-eyebrow">Intelligent Concierge</span>
            <h2 className="yn-section-title">Gifting with quiet intelligence</h2>
            <p className="yn-section-sub">
              We do not believe in generic recommendations. Personalization progresses with the depth of knowledge you hold, crafting relevance without complexity.
            </p>
            <div className="yn-sticky-action">
              <Link to="/personalise" className="yn-btn-primary">
                Begin Gift Journey
              </Link>
            </div>
          </div>

          {/* Right Column: Progressive step reveals */}
          <div className="yn-progression-track">
            {/* Step 1 */}
            <div
              className={`yn-step-card ${activeStep === 0 ? "yn-step-card--active" : ""}`}
              onClick={() => setActiveStep(0)}
              role="button"
              tabIndex={0}
            >
              <div className="yn-step-num">Step 01</div>
              <h3 className="yn-step-title">The Recipient</h3>
              <p className="yn-step-desc">
                Select whether this keepsake is for yourself or someone meaningful: a partner, sibling, parent, mentor, or friend.
              </p>
              <div className="yn-pill-group">
                <span className="yn-sample-pill">Self</span>
                <span className="yn-sample-pill">Partner</span>
                <span className="yn-sample-pill">Sibling</span>
                <span className="yn-sample-pill">Friend</span>
              </div>
            </div>

            {/* Step 2 */}
            <div
              className={`yn-step-card ${activeStep === 1 ? "yn-step-card--active" : ""}`}
              onClick={() => setActiveStep(1)}
              role="button"
              tabIndex={0}
            >
              <div className="yn-step-num">Step 02</div>
              <h3 className="yn-step-title">What You Know</h3>
              <p className="yn-step-desc">
                Name only opens the numerology path. Adding birth date, time, and city unlocks planetary alignment and dasha timing.
              </p>
              <div className="yn-data-mode-preview">
                <div className="yn-mode-box">
                  <div className="yn-mode-label">Name Only</div>
                  <div className="yn-mode-value">Numerology Rhythm</div>
                </div>
                <div className="yn-mode-box yn-mode-box--pro">
                  <div className="yn-mode-label">Name + Birth Time</div>
                  <div className="yn-mode-value">Vedic Ephemeris</div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div
              className={`yn-step-card ${activeStep === 2 ? "yn-step-card--active" : ""}`}
              onClick={() => setActiveStep(2)}
              role="button"
              tabIndex={0}
            >
              <div className="yn-step-num">Step 03</div>
              <h3 className="yn-step-title">Occasion & Recommendation</h3>
              <p className="yn-step-desc">
                Mark a birthday, anniversary, wedding, or transition. You receive exactly one hero match paired with three refined alternatives.
              </p>
              <div className="yn-recommendation-sketch">
                <div className="yn-rec-hero-pill">
                  <span className="yn-rec-crown">✦</span>
                  <span>1 Hero Recommendation (Primary Match)</span>
                </div>
                <div className="yn-rec-alt-row">
                  <span>+ 3 Thoughtful Alternatives</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: CRAFT & CONSECRATION BREAKOUT (Layout Family 5: Full-Width Story Banner)
          Purpose: Highlights authentic Indian luxury craftsmanship without religious clichés.
          No eyebrow.
          ========================================================================= */}
      <section className="yn-breakout-section">
        <div className="yn-breakout-backdrop" aria-hidden="true">
          <img
            src="/scenes/threshold-c.webp"
            alt="YOUNOYA Atelier Atmosphere"
            className="yn-breakout-bg-img"
          />
          <div className="yn-breakout-overlay" />
        </div>

        <div className="yn-container yn-breakout-content">
          <h2 className="yn-breakout-title">
            Consecrated by intention, <br />
            <span className="yn-italic-accent">perfected by hand.</span>
          </h2>
          <p className="yn-breakout-sub">
            Every piece is energized through 108 chants aligned with planetary frequencies. We source untreated minerals, noble metals, and archival presentation cases to turn each gift into a lasting personal token.
          </p>

          <div className="yn-metrics-strip">
            <div className="yn-metric-cell">
              <div className="yn-metric-val">108</div>
              <div className="yn-metric-lbl">Vedic Consecrations</div>
            </div>
            <div className="yn-metric-cell">
              <div className="yn-metric-val">100%</div>
              <div className="yn-metric-lbl">Untreated Natural Minerals</div>
            </div>
            <div className="yn-metric-cell">
              <div className="yn-metric-val">Express</div>
              <div className="yn-metric-lbl">Insured Air Dispatch</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: CHAPTER INTENTION BENTO (Layout Family 6: Asymmetric 3-Cell Bento)
          Purpose: Connects gifting to human intentions (Love, Becoming, Shelter).
          No eyebrow.
          ========================================================================= */}
      <section className="yn-bento-section">
        <div className="yn-container">
          <div className="yn-section-header yn-text-center">
            <h2 className="yn-section-title">Gifts curated for life chapters</h2>
            <p className="yn-section-sub">
              Select by the emotional chapter you wish to honor in their journey.
            </p>
          </div>

          <div className="yn-asym-bento">
            {/* Cell 1: Large Chapter of Love (8 cols) */}
            <Link to="/shop?chapter=love" className="yn-bento-cell yn-bento-cell--lead">
              <div className="yn-bento-bg">
                <img
                  src="/products/pearl-chandra-sukh-bracelet.webp"
                  alt="Chapter of Love Keepsake"
                  loading="lazy"
                />
                <div className="yn-bento-scrim" />
              </div>
              <div className="yn-bento-content">
                <div className="yn-bento-tag">Chapter 01</div>
                <h3 className="yn-bento-title">Love & Harmony</h3>
                <p className="yn-bento-text">
                  Venus-led keepsakes celebrating devotion, affection, and mutual respect. Crafted with cultured pearls, rose quartz, and delicate silver links.
                </p>
                <div className="yn-bento-cta">Explore Love Tokens →</div>
              </div>
            </Link>

            {/* Cell 2: Chapter of Becoming (4 cols, top) */}
            <Link to="/shop?chapter=becoming" className="yn-bento-cell yn-bento-cell--sub">
              <div className="yn-bento-bg">
                <img
                  src="/products/yellow-sapphire-guru-blessing-ring.webp"
                  alt="Chapter of Becoming Keepsake"
                  loading="lazy"
                />
                <div className="yn-bento-scrim" />
              </div>
              <div className="yn-bento-content">
                <div className="yn-bento-tag">Chapter 02</div>
                <h3 className="yn-bento-title">Becoming</h3>
                <p className="yn-bento-text">
                  Jupiter and Mercury keepsakes for milestones, professional growth, and clear purpose.
                </p>
                <div className="yn-bento-cta">Career & Growth →</div>
              </div>
            </Link>

            {/* Cell 3: Chapter of Shelter (4 cols, bottom) */}
            <Link to="/shop?chapter=shelter" className="yn-bento-cell yn-bento-cell--sub">
              <div className="yn-bento-bg">
                <img
                  src="/products/sphatik-shree-yantra-pendant.webp"
                  alt="Chapter of Shelter Keepsake"
                  loading="lazy"
                />
                <div className="yn-bento-scrim" />
              </div>
              <div className="yn-bento-content">
                <div className="yn-bento-tag">Chapter 03</div>
                <h3 className="yn-bento-title">Shelter</h3>
                <p className="yn-bento-text">
                  Lunar peace, vastu harmony, and protective stones for sanctuaries and families.
                </p>
                <div className="yn-bento-cta">Home & Calm →</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: ATELIER CONCIERGE SANCTUARY (Layout Family 7: Inset Contained Banner)
          Purpose: High-contrast framed sanctuary box inviting seekers to begin discovery.
          No eyebrow.
          ========================================================================= */}
      <section className="yn-sanctuary-section">
        <div className="yn-container">
          <div className="yn-sanctuary-box">
            <div className="yn-sanctuary-inner">
              <h2 className="yn-sanctuary-title">
                Ready to find a gift they will never forget?
              </h2>
              <p className="yn-sanctuary-sub">
                Begin with birth details for an intelligent recommendation, or explore our handcrafted catalog at your own pace.
              </p>
              <div className="yn-sanctuary-actions">
                <Link to="/personalise" className="yn-btn-primary">
                  Start Personalization
                </Link>
                <Link to="/shop" className="yn-btn-secondary">
                  View Full Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: BRAND ATELIER FOOTER (Layout Family 8: Architectural Multi-Column Directory)
          Purpose: Restrained luxury footer with zero em-dashes and authentic credentials.
          No eyebrow.
          ========================================================================= */}
      <footer className="yn-atelier-footer">
        <div className="yn-container">
          <div className="yn-footer-grid">
            {/* Brand column */}
            <div className="yn-footer-brand-col">
              <Link to="/" className="yn-footer-brand" aria-label="YOUNOYA Home">
                <img src="/younoya-gold.svg" alt="YOUNOYA" className="yn-footer-logo" />
              </Link>
              <p className="yn-footer-desc">
                Personalized Indian gifting atelier. Keepsakes curated by planetary rhythm and energized with intention.
              </p>
              <div className="yn-footer-origin">Jaipur, India</div>
              <a href="mailto:hello@younoya.com" className="yn-footer-email">
                hello@younoya.com
              </a>
            </div>

            {/* Links column 1 */}
            <div className="yn-footer-col">
              <div className="yn-footer-heading">Collection</div>
              <ul className="yn-footer-list">
                <li><Link to="/shop">All Keepsakes</Link></li>
                <li><Link to="/shop?category=pendants">Gemstone Pendants</Link></li>
                <li><Link to="/shop?category=bracelets">Crystal Bracelets</Link></li>
                <li><Link to="/shop?category=cufflinks">Brooches & Cufflinks</Link></li>
                <li><Link to="/shop?category=decor">Prosperity Decor</Link></li>
              </ul>
            </div>

            {/* Links column 2 */}
            <div className="yn-footer-col">
              <div className="yn-footer-heading">Chapters</div>
              <ul className="yn-footer-list">
                <li><Link to="/shop?chapter=love">Love & Devotion</Link></li>
                <li><Link to="/shop?chapter=becoming">Career & Becoming</Link></li>
                <li><Link to="/shop?chapter=shelter">Shelter & Home</Link></li>
                <li><Link to="/personalise">Personalized Concierge</Link></li>
              </ul>
            </div>

            {/* Links column 3 */}
            <div className="yn-footer-col">
              <div className="yn-footer-heading">Atelier</div>
              <ul className="yn-footer-list">
                <li><Link to="/about">Our Philosophy</Link></li>
                <li><Link to="/journal">Journal & Insights</Link></li>
                <li><Link to="/contact">Private Consultation</Link></li>
                <li><span className="yn-footer-pill">Shiprocket Insured Air</span></li>
              </ul>
            </div>
          </div>

          <div className="yn-footer-bottom">
            <div className="yn-footer-copy">
              © {new Date().getFullYear()} YOUNOYA. All rights reserved.
            </div>
            <div className="yn-footer-legal">
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/contact">Concierge</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
