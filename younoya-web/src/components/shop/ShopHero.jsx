import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight, Play, Sparkles, Star } from 'lucide-react'

export default function ShopHero() {
  return (
    <section className="livora-hero">
      <div className="livora-hero__content">
        <span className="livora-kicker">
          <Sparkles size={13} /> TIMELESS TALISMANS, CONSECRATED WITH INTENTION
        </span>
        <h1 className="livora-hero__title">
          Designed for the<br />
          <em>way you journey.</em>
        </h1>
        <p className="livora-hero__desc">
          YOUNOYA crafts astrology-backed keepsakes and consecrated heirlooms that blend 
          sacred Vedic wisdom with Cartier-level spatial beauty and intentional gifting.
        </p>
        <div className="livora-hero__buttons">
          <a href="#pieces" className="livora-btn livora-btn--dark">
            Shop Collection <ArrowDown size={15} />
          </a>
          <Link to="/find-a-gift" className="livora-btn livora-btn--outline">
            <Play size={14} fill="currentColor" /> Consult Aster
          </Link>
        </div>
        <div className="livora-hero__proof">
          <div className="livora-hero__avatars">
            <img src="/media/guide-listen.webp" alt="Seeker" />
            <img src="/media/guide-speak.webp" alt="Seeker" />
            <img src="/media/guide-blink.webp" alt="Seeker" />
            <span className="livora-hero__avatar-more">+</span>
          </div>
          <div className="livora-hero__proof-text">
            <div className="livora-hero__proof-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill="#B8860B" stroke="none" />
              ))}
            </div>
            <span>Loved by 10,000+ cherished seekers</span>
          </div>
        </div>
      </div>

      <div className="livora-hero__visual">
        <div className="livora-hero__frame">
          <img 
            src="/media/younoya-hamper-hero-landscape-16x9.jpg" 
            alt="YOUNOYA authentic luxury consecrated hamper" 
            fetchPriority="high"
          />
          <div className="livora-hero__badge">
            <div className="livora-hero__badge-thumb">
              <img src="/media/products/the-golden-flight-card.webp" alt="Phoenix Preview" />
            </div>
            <div className="livora-hero__badge-copy">
              <small>Consecrated Collection</small>
              <strong>The Ten Heirlooms</strong>
              <a href="#pieces">Explore Now <ArrowRight size={13} /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
