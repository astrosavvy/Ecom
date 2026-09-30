import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PRODUCTS } from '../data/products'
import { getCustomerToken, storeRequest } from '../lib/giftGuideApi'
import AsterStage from '../components/gift-guide/AsterStage'
import GuideConversation from '../components/gift-guide/GuideConversation'
import GuideResult from '../components/gift-guide/GuideResult'
import GuideLogin from '../components/gift-guide/GuideLogin'
import '../styles/GiftFinder.css'

const EMPTY = { forWhom: '', name: '', relation: '', moment: '', intention: '', dob: '', tob: '', placeId: null, placeLabel: '' }
const readSession = key => { try { return JSON.parse(sessionStorage.getItem(key)) } catch { return null } }
const preview = answers => ({ method: 'intention', previewOnly: true,
  explanation: 'These pieces reflect your chosen intention. The personal guide is temporarily unavailable, so this is a collection preview.',
  offers: PRODUCTS.filter(item => item.intention === answers.intention).slice(0, 3).map(item => ({
    id: item.id, handle: item.handle, title: item.shopName, image: item.primaryImage, price: item.priceNum * 100,
  })),
})

export default function GiftFinder() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [values, setValues] = useState(() => readSession('yn_guide_answers') || EMPTY)
  const [result, setResult] = useState(() => readSession('yn_guide_result'))
  const [saved, setSaved] = useState(false)
  const [savedList, setSavedList] = useState(null)
  const [loginFor, setLoginFor] = useState('')
  const [pendingOffer, setPendingOffer] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [mood, setMood] = useState('listening')
  const [signedIn, setSignedIn] = useState(false)
  useEffect(() => {
    if (getCustomerToken()) storeRequest('/store/customers/me', { auth: true }).then(() => setSignedIn(true)).catch(() => setSignedIn(false))
  }, [])
  useEffect(() => { sessionStorage.setItem('yn_guide_answers', JSON.stringify(values)) }, [values])
  useEffect(() => { if (result) sessionStorage.setItem('yn_guide_result', JSON.stringify(result)); else sessionStorage.removeItem('yn_guide_result') }, [result])
  useEffect(() => { setMood('asking'); const timer = setTimeout(() => setMood('listening'), 1500); return () => clearTimeout(timer) }, [step, result])

  async function reveal() {
    setBusy(true); setError('')
    try { setResult(await storeRequest('/store/gift-guide/recommend', { body: values })) }
    catch (issue) { setResult(preview(values)); setNotice(issue.message) }
    finally {
      setValues(current => ({ ...current, dob: '', tob: '', placeId: null, placeLabel: '' }))
      setBusy(false)
    }
  }
  async function save() {
    if (!getCustomerToken()) { setLoginFor('save this recommendation'); return }
    setBusy(true); setNotice('')
    try { await storeRequest('/store/gift-guide/saved', { body: { token: result.token }, auth: true }); setSaved(true); setNotice('Saved to your account.') }
    catch (issue) { setNotice(issue.message) }
    finally { setBusy(false) }
  }
  function order(offer) {
    if (!offer.variantId) { setNotice('Ordering will be available when this piece is confirmed in the live catalog.'); return }
    sessionStorage.setItem('yn_selected_offer', JSON.stringify(offer))
    if (!getCustomerToken()) { setPendingOffer(offer); setLoginFor('order this selection'); return }
    navigate('/checkout')
  }
  async function showSaved() {
    if (!getCustomerToken()) { setLoginFor('reopen saved recommendations'); return }
    setBusy(true); setError('')
    try { setSavedList((await storeRequest('/store/gift-guide/saved', { auth: true })).saved) }
    catch (issue) { setError(issue.message) }
    finally { setBusy(false) }
  }
  async function openSaved(id) {
    setBusy(true); setError('')
    try {
      const data = await storeRequest(`/store/gift-guide/saved/${encodeURIComponent(id)}`, { auth: true })
      setResult({ method: data.saved.astro_snapshot?.method, guide: data.saved.astro_snapshot?.guide,
        setTitle: data.saved.astro_snapshot?.setTitle, explanation: data.saved.personalised_explanation, offers: data.offers })
      setSaved(true); setSavedList(null)
      if (data.changed) setNotice('Availability has changed since you saved this. Current offers are shown.')
    } catch (issue) { setError(issue.message) }
    finally { setBusy(false) }
  }
  async function loggedIn() {
    setSignedIn(true)
    const action = loginFor
    setLoginFor('')
    if (action.startsWith('save')) await save()
    else if (action.startsWith('order') && pendingOffer) order(pendingOffer)
    else if (action.startsWith('reopen')) await showSaved()
  }
  function restart() {
    setStep(0); setValues(EMPTY); setResult(null); setSaved(false); setSavedList(null); setNotice(''); setError('')
  }
  const message = result ? 'A piece with a story of its own.' : savedList ? 'Your moments are here to revisit.' : [
    'Let us begin with who matters.', 'Tell me about your connection.', 'Every story has a turning point.',
    'I am listening for the meaning.', 'Only what you wish to share.',
  ][step]
  return <section className="guide-page">
    <div className="guide-page__main">
      <nav className="guide-page__top" aria-label="Gift guide navigation"><Link to="/shop">← The collection</Link>{signedIn && <button type="button" onClick={showSaved}>Saved recommendations ↗</button>}</nav>
      <AsterStage mood={busy ? 'thinking' : mood} message={message} />
      {savedList ? <div className="guide-saved"><span className="guide-eyebrow">YOUR PRIVATE EDIT</span><h1>Pieces worth <em>revisiting.</em></h1>
        {savedList.length ? savedList.map(item => <button key={item.id} type="button" onClick={() => openSaved(item.id)}><strong>{item.recipient_name}</strong><span>{item.occasion}</span><span>Open ↗</span></button>) : <p>Nothing saved yet. Let us begin with a new gift conversation.</p>}
        <button className="guide-primary" type="button" onClick={restart}>Begin a new conversation</button>
      </div> : result ? <GuideResult values={values} result={result} onSave={save} onOrder={order} onRestart={restart} saved={saved} notice={notice} />
        : <GuideConversation step={step} setStep={setStep} values={values} setValues={setValues} onReveal={reveal} busy={busy} error={error} />}
      {error && savedList && <p className="guide-error" role="alert">{error}</p>}
    </div>
    {loginFor && <GuideLogin purpose={loginFor} onCancel={() => { setLoginFor(''); setPendingOffer(null) }} onSuccess={loggedIn} />}
  </section>
}
