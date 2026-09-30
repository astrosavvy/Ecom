import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { storeRequest } from '../lib/giftGuideApi'
import '../styles/PrivateOffer.css'

export default function PrivateOffer() {
  const { handle } = useParams()
  const navigate = useNavigate()
  const [offer, setOffer] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    storeRequest(`/store/gift-guide/offers/${encodeURIComponent(handle)}`)
      .then(data => { if (active) setOffer(data.offer) })
      .catch(issue => { if (active) setError(issue.message) })
    return () => { active = false }
  }, [handle])
  function order() { sessionStorage.setItem('yn_selected_offer', JSON.stringify(offer)); navigate('/checkout') }
  return <main className="private-offer"><div className="private-offer__inner"><Link to="/find-a-gift">← Back to your guide</Link>
    {error && <div className="private-offer__empty"><h1>This edition is unavailable.</h1><p>{error}</p><Link to="/find-a-gift">Start a new recommendation ↗</Link></div>}
    {!offer && !error && <p>Opening your selection…</p>}
    {offer && <div className="private-offer__grid"><img src={offer.image} alt={offer.title} /><div><span>YOUNOYA · PRIVATE EDITION</span>
      <h1>{offer.title}</h1><p>{offer.description}</p>{offer.components?.length > 0 && <section><h2>Inside this edition</h2>
        <ul>{offer.components.map((part, index) => <li key={index}>{part.quantity} × {part.title}</li>)}</ul></section>}
      <strong>₹{(offer.price / 100).toLocaleString('en-IN')}</strong>
      <button type="button" disabled={!offer.available} onClick={order}>{offer.available ? 'Order this edition ↗' : 'Currently unavailable'}</button>
      <small>Price and availability are checked again at checkout.</small></div></div>}</div></main>
}
