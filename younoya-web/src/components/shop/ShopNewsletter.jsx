import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'

export default function ShopNewsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(e) {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <section className="livora-newsletter">
      <div className="livora-newsletter__box">
        <div className="livora-newsletter__copy">
          <span className="livora-kicker">ATELIER PRIVILEGES</span>
          <h2>Receive Auspicious Muhurta Alerts & <em>Private Drops.</em></h2>
          <p>Join our private circle for seasonal astrological transits, consecration calendars, and private editions.</p>
          
          {subscribed ? (
            <div className="livora-newsletter__success">
              <Check size={18} /> Thank you. Your email has been added to our private ledger.
            </div>
          ) : (
            <form className="livora-newsletter__form" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="Enter your email address..." 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <button type="submit" className="livora-btn livora-btn--dark">
                Subscribe <ArrowRight size={15} />
              </button>
            </form>
          )}
        </div>
        <div className="livora-newsletter__image">
          <img src="/media/hero-apple.webp" alt="Sandalwood ritual candle" />
        </div>
      </div>
    </section>
  )
}
