import { Link } from 'react-router-dom'
import { ArrowRight, Play, Star } from 'lucide-react'

export default function ShopHero() {
  return (
    <section className="livora-hero-bar" aria-label="Atelier Hero">
      <div className="livora-hero-bar__left">
        <span className="livora-kicker">TRENDING HEIRLOOMS ✦</span>
        <h1 className="livora-hero-bar__title">
          Consecrated in<br />
          <em>Style. Every Day.</em>
        </h1>
        <p className="livora-hero-bar__desc">
          Astrology-backed keepsakes and consecrated heirlooms that keep your intentions aligned 
          and your sacred space effortlessly elegant.
        </p>

        <div className="livora-hero-bar__buttons">
          <a href="#pieces" className="livora-btn livora-btn--terracotta">
            Shop the Collection
          </a>
          <Link to="/find-a-gift" className="livora-btn-watch">
            <span className="livora-play-icon">
              <Play size={12} fill="#1F1914" />
            </span>
            <span>Watch Video</span>
          </Link>
        </div>

        <div className="livora-hero-bar__proof">
          <div className="livora-hero-bar__avatars">
            <img src="/media/guide-listen.webp" alt="Cherished Seeker" />
            <img src="/media/guide-speak.webp" alt="Cherished Seeker" />
            <img src="/media/guide-blink.webp" alt="Cherished Seeker" />
            <span className="livora-hero-bar__avatar-more">+</span>
          </div>
          <div className="livora-hero-bar__proof-text">
            <span>Loved by 10,000+ cherished seekers</span>
          </div>
        </div>
      </div>

      <div className="livora-hero-bar__right">
        <div className="livora-hero-bar__arch-frame">
          <img 
            src="/media/younoya-hamper-hero-landscape-16x9.jpg" 
            alt="YOUNOYA Consecrated Atelier Hamper" 
            fetchPriority="high"
          />
        </div>

        <div className="livora-hero-bar__floating-card">
          <h4>The Consecrated Hamper</h4>
          <strong>₹4,200</strong>
          <div className="livora-swatches-row">
            <span>Finishes</span>
            <div className="livora-swatches-dots">
              <span className="dot dot--obsidian" title="Obsidian Altar" />
              <span className="dot dot--brass" title="Antique Jewelers Brass" />
              <span className="dot dot--gold" title="24K Sovereign Gold" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
