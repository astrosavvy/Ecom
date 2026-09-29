import { Headphones, RotateCcw, ShieldCheck, Truck } from 'lucide-react'

export default function ShopUspBar() {
  return (
    <section className="livora-usp" aria-label="Brand Guarantees">
      <div className="livora-usp__box">
        <div className="livora-usp__item">
          <span className="livora-usp__icon"><Truck size={22} strokeWidth={1.5} /></span>
          <div>
            <strong>Free Insured Shipping</strong>
            <small>Complimentary express courier across India</small>
          </div>
        </div>
        <div className="livora-usp__item">
          <span className="livora-usp__icon"><RotateCcw size={22} strokeWidth={1.5} /></span>
          <div>
            <strong>Consecrated Exchange</strong>
            <small>30-day sacred replacement guarantee</small>
          </div>
        </div>
        <div className="livora-usp__item">
          <span className="livora-usp__icon"><ShieldCheck size={22} strokeWidth={1.5} /></span>
          <div>
            <strong>Secure Payment</strong>
            <small>100% encrypted & tamper-proof checkout</small>
          </div>
        </div>
        <div className="livora-usp__item">
          <span className="livora-usp__icon"><Headphones size={22} strokeWidth={1.5} /></span>
          <div>
            <strong>Atelier Support</strong>
            <small>Personalized astrological concierge assistance</small>
          </div>
        </div>
      </div>
    </section>
  )
}
