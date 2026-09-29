import { Link } from 'react-router-dom'

const ARTICLES = [
  {
    id: 1,
    slug: 'thoughtful-gifts-inspired-by-astrology',
    date: 'August 10, 2026',
    category: 'Vedic Rituals',
    title: 'Thoughtful Gifts Inspired by Planetary Alignment & Intention',
    image: '/media/blog/thoughtful-gifts-inspired-by-astrology.webp'
  },
  {
    id: 2,
    slug: 'why-younoya-is-different-from-a-traditional-astrology-store',
    date: 'August 08, 2026',
    category: 'The Atelier',
    title: 'Why Consecrated Keepsakes Transcend Traditional Gifting',
    image: '/media/blog/why-younoya-is-different.webp'
  },
  {
    id: 3,
    slug: null,
    date: 'A personal conversation',
    category: 'Gift Guide',
    title: 'Find the piece that speaks to their moment',
    image: '/media/intentions/growth-vitality-light.jpg'
  }
]

export default function ShopInspiration() {
  return (
    <section className="livora-inspiration" aria-label="Atelier Inspiration">
      <div className="livora-inspiration__header">
        <h2>Atelier Inspiration</h2>
        <p>Stories, symbolism and thoughtful ways to give.</p>
      </div>

      <div className="livora-inspiration__grid">
        {ARTICLES.map(article => (
          <Link key={article.id} to={article.slug ? `/blog/${article.slug}` : '/find-a-gift'} className="livora-inspo-card">
            <div className="livora-inspo-card__media">
              <img src={article.image} alt={article.title} loading="lazy" />
            </div>
            <div className="livora-inspo-card__body">
              <span className="livora-inspo-card__meta">{article.date} • {article.category}</span>
              <h3>{article.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
