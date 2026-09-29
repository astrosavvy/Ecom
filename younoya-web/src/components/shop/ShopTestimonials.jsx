import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote: "The Golden Flight arrived in the midnight obsidian box with the consecrated scroll attuned to my sister's birth chart. The emotional reaction was unforgettable.",
    author: "Ananya Sharma",
    city: "Mumbai",
    rating: 5,
    piece: "Phoenix Renewal",
  },
  {
    quote: "Unlike mass-produced jewelry, you immediately feel the weight, craftsmanship and reverence in this piece. The 24K gold finish has an authentic antique luster.",
    author: "Devansh Mehta",
    city: "Bengaluru",
    rating: 5,
    piece: "Wild Poise",
  },
  {
    quote: "Aster's gift recommendation for my partner's Lagna was spot-on. The packaging and Vedic blessing made it the most meaningful gift I have ever given.",
    author: "Pooja Kapoor",
    city: "New Delhi",
    rating: 5,
    piece: "Flamingo Grace",
  },
]

export default function ShopTestimonials() {
  return (
    <section className="livora-reviews">
      <div className="livora-reviews__header">
        <span className="livora-kicker">WHAT OUR RECIPIENTS SAY</span>
        <h2>Loved by seekers across <em>every chapter.</em></h2>
      </div>

      <div className="livora-reviews__grid">
        {TESTIMONIALS.map((item, idx) => (
          <div key={idx} className="livora-review-card">
            <div className="livora-review-card__stars">
              {[...Array(item.rating)].map((_, i) => (
                <Star key={i} size={15} fill="#B8860B" stroke="none" />
              ))}
            </div>
            <blockquote className="livora-review-card__quote">
              "{item.quote}"
            </blockquote>
            <div className="livora-review-card__author">
              <div className="livora-review-card__avatar">
                {item.author.charAt(0)}
              </div>
              <div>
                <strong>{item.author}</strong>
                <small>{item.city} • Verified Buyer ({item.piece})</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
