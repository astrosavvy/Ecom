import { ArrowRight } from 'lucide-react'

const INTENTIONS = [
  { id: 'confidence-power', title: 'Courage & Presence', deity: 'Surya (Sun) • Agni Fire', image: '/media/diorama/scene_1_start.jpg', tag: 'Courage →' },
  { id: 'vitality-balance', title: 'Growth & Vitality', deity: 'Budha (Mercury) • Prithvi Earth', image: '/media/diorama/scene_2_start.jpg', tag: 'Renewal →' },
  { id: 'love-connection', title: 'Love & Devotion', deity: 'Shukra (Venus) • Jala Water', image: '/media/diorama/scene_4_start.jpg', tag: 'Devotion →' },
  { id: 'protection', title: 'Instinct & Focus', deity: 'Ketu & Mars • Vayu Air', image: '/media/diorama/scene_3_start.jpg', tag: 'Protection →' },
]

export default function ShopIntentions({ onSelectIntention }) {
  return (
    <section className="livora-intentions">
      <div className="livora-intentions__header">
        <div>
          <span className="livora-kicker">SHOP BY CHAPTER</span>
          <h2>Find inspiration for <em>every intention.</em></h2>
        </div>
        <button type="button" className="livora-link-more" onClick={() => onSelectIntention('all')}>
          View All Intentions <ArrowRight size={15} />
        </button>
      </div>

      <div className="livora-intentions__grid">
        {INTENTIONS.map((item) => (
          <div key={item.id} className="livora-intent-card" onClick={() => onSelectIntention(item.id)}>
            <img src={item.image} alt={item.title} loading="lazy" />
            <div className="livora-intent-card__overlay">
              <div>
                <h3>{item.title}</h3>
                <small>{item.deity}</small>
              </div>
              <span className="livora-intent-card__tag">{item.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
