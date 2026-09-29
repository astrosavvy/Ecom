import { Gift, Heart, MessageCircle, Sparkles } from 'lucide-react'

export default function ShopUspBar() {
  return (
    <section className="livora-usp" aria-label="The Younoya approach">
      <div className="livora-usp__box">
        <div className="livora-usp__item">
          <span className="livora-usp__icon"><Heart size={22} strokeWidth={1.5} /></span>
          <div>
            <strong>Meaningful symbols</strong>
            <small>Every motif has a story to carry</small>
          </div>
        </div>
        <div className="livora-usp__item">
          <span className="livora-usp__icon"><Sparkles size={22} strokeWidth={1.5} /></span>
          <div>
            <strong>Astrological insight</strong>
            <small>Guidance shaped around intention</small>
          </div>
        </div>
        <div className="livora-usp__item">
          <span className="livora-usp__icon"><Gift size={22} strokeWidth={1.5} /></span>
          <div>
            <strong>A personal touch</strong>
            <small>Add a note for someone special</small>
          </div>
        </div>
        <div className="livora-usp__item">
          <span className="livora-usp__icon"><MessageCircle size={22} strokeWidth={1.5} /></span>
          <div>
            <strong>Here to help</strong>
            <small>Write to care@younoya.com</small>
          </div>
        </div>
      </div>
    </section>
  )
}
