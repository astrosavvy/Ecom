import { useState } from 'react'

export default function ShopCommunity() {
  const [email, setEmail] = useState('')

  function requestUpdates(event) {
    event.preventDefault()
    const address = email.trim()
    if (!address) return
    const subject = encodeURIComponent('Younoya atelier updates')
    const body = encodeURIComponent(`Please add ${address} to Younoya atelier updates.`)
    window.location.href = `mailto:care@younoya.com?subject=${subject}&body=${body}`
  }

  return (
    <section className="atelier-community" aria-labelledby="atelier-community-title">
      <div className="atelier-community__copy">
        <span className="atelier-community__eyebrow">LET MEANING FIND YOU</span>
        <h2 id="atelier-community-title">Notes from <em>the atelier.</em></h2>
        <p>New pieces, thoughtful stories and occasions worth celebrating, sent with care.</p>
      </div>
      <div className="atelier-community__action">
        <form onSubmit={requestUpdates}>
          <label className="sr-only" htmlFor="atelier-community-email">Email address</label>
          <input id="atelier-community-email" type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="Your email address" autoComplete="email" required />
          <button type="submit">Request updates <span aria-hidden="true">↗</span></button>
        </form>
        <small>Opens your email app to request atelier updates.</small>
      </div>
      <div className="atelier-community__visual" aria-hidden="true">
        <img src="/media/intentions/love-devotion-light.jpg" alt="" loading="lazy" />
      </div>
    </section>
  )
}
