import { Star } from 'lucide-react'

const PRODUCT_REVIEWS = [
  {
    name: "Radhika Singhania",
    city: "Mumbai",
    rating: 5,
    date: "September 2026",
    text: "The finish and weight exceeded all expectations. It looks like an heirloom piece passed down through generations. Wearing it provides an undeniable sense of poise.",
  },
  {
    name: "Siddharth Verma",
    city: "Gurugram",
    rating: 5,
    date: "August 2026",
    text: "Gifted this to my fiancée for her venture launch. The obsidian packaging and personalized astrology scroll moved her to tears. Absolutely world-class.",
  },
  {
    name: "Meera Nair",
    city: "Kochi",
    rating: 5,
    date: "July 2026",
    text: "The crystal pavé catches light with unbelievable fire. Knowing it was consecrated with Vedic mantras gives it genuine sanctity.",
  },
]

export default function ProductReviews() {
  return (
    <section className="livora-reviews">
      <div className="livora-reviews__header">
        <span className="livora-kicker">CONSECRATED PRAISE</span>
        <h2>Reviews from <em>cherished seekers.</em></h2>
      </div>

      <div className="livora-reviews__grid">
        {PRODUCT_REVIEWS.map((rev, idx) => (
          <div key={idx} className="livora-review-card">
            <div className="livora-review-card__stars">
              {[...Array(rev.rating)].map((_, i) => (
                <Star key={i} size={15} fill="#B8860B" stroke="none" />
              ))}
            </div>
            <blockquote className="livora-review-card__quote">
              "{rev.text}"
            </blockquote>
            <div className="livora-review-card__author">
              <div className="livora-review-card__avatar">{rev.name.charAt(0)}</div>
              <div>
                <strong>{rev.name}</strong>
                <small>{rev.city} • Verified Buyer ({rev.date})</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
