import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock3, MapPin, Sparkles } from 'lucide-react'
import { PRODUCTS } from '../data/products'
import '../styles/GiftFinder.css'

const EVENTS = [
  { id: 'birthday', label: 'A birthday', note: 'Another year of becoming', handles: ['confidence-personal-power', 'love-connection', 'dream-jar'] },
  { id: 'anniversary', label: 'An anniversary', note: 'A bond worth honouring', handles: ['love-connection', 'toucan-keepsake', 'hero-threshold'] },
  { id: 'beginning', label: 'A new beginning', note: 'A brave chapter ahead', handles: ['hero-threshold', 'beetle-keepsake', 'confidence-personal-power'] },
  { id: 'gratitude', label: 'A thank you', note: 'For what words cannot hold', handles: ['toucan-keepsake', 'love-connection', 'vitality-inner-balance'] },
  { id: 'presence', label: 'Simply because', note: 'No occasion needed', handles: ['dream-jar', 'vitality-inner-balance', 'love-connection'] },
]

const RELATIONS = ['Partner', 'Parent', 'Sibling', 'Friend', 'Colleague', 'Someone special']
const ELEMENT_HANDLES = {
  fire: ['confidence-personal-power', 'hero-threshold'],
  earth: ['wealth-prosperity', 'vitality-inner-balance'],
  air: ['toucan-keepsake', 'love-connection'],
  water: ['dream-jar', 'love-connection'],
}
const SIGN_DATA = [
  ['Capricorn', 'earth', 120], ['Aquarius', 'air', 219], ['Pisces', 'water', 321],
  ['Aries', 'fire', 420], ['Taurus', 'earth', 521], ['Gemini', 'air', 621],
  ['Cancer', 'water', 723], ['Leo', 'fire', 823], ['Virgo', 'earth', 923],
  ['Libra', 'air', 1023], ['Scorpio', 'water', 1122], ['Sagittarius', 'fire', 1222],
  ['Capricorn', 'earth', 1232],
]
const TODAY = new Date().toISOString().slice(0, 10)

function getSolarSignature(date) {
  const [, month, day] = date.split('-').map(Number)
  const marker = month * 100 + day
  const found = SIGN_DATA.find(([, , end]) => marker <= end) || SIGN_DATA[0]
  return { sign: found[0], element: found[1] }
}

function uniqueProducts(handles) {
  return [...new Set(handles)].map(handle => PRODUCTS.find(product => product.handle === handle)).filter(Boolean).slice(0, 3)
}

const panelMotion = {
  initial: { opacity: 0, y: 24, filter: 'blur(7px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -16, filter: 'blur(5px)' },
  transition: { duration: .45, ease: [.22, 1, .36, 1] },
}

export default function GiftFinder() {
  const [step, setStep] = useState(0)
  const [reading, setReading] = useState(false)
  const [values, setValues] = useState({ event: '', forWhom: '', relation: '', name: '', dob: '', tob: '', pob: '', timeUnknown: false })
  const selectedEvent = EVENTS.find(item => item.id === values.event)
  const signature = values.dob ? getSolarSignature(values.dob) : null
  const matches = useMemo(() => uniqueProducts([...(selectedEvent?.handles || []), ...(ELEMENT_HANDLES[signature?.element] || [])]), [selectedEvent, signature?.element])
  const recipient = values.forWhom === 'self' ? 'you' : values.name || 'them'
  const progress = Math.min(step, 4)

  const choose = (key, value, next) => {
    setValues(current => ({ ...current, [key]: value }))
    window.setTimeout(() => setStep(next), 220)
  }
  const goBack = () => {
    if (step === 3 && values.forWhom === 'self') setStep(1)
    else setStep(current => Math.max(0, current - 1))
  }
  const reveal = event => {
    event.preventDefault()
    if (!values.dob || !values.pob || (!values.timeUnknown && !values.tob)) return
    setReading(true)
    window.setTimeout(() => { setReading(false); setStep(5) }, 1500)
  }
  const restart = () => {
    setValues({ event: '', forWhom: '', relation: '', name: '', dob: '', tob: '', pob: '', timeUnknown: false })
    setStep(0)
  }

  return <section className="oracle" aria-labelledby="oracle-title">
    <aside className={`oracle__guide oracle__guide--step-${step}`}>
      <Link className="oracle__return" to="/">Return to the story <ArrowUpRight size={14} /></Link>
      <div className="oracle__constellation" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <div className="oracle__halo" aria-hidden="true" />
      <motion.img
        className="oracle__mascot"
        src="/media/aster-mascot.png"
        alt="Aster, Younoya’s celestial gift guide"
        animate={reading ? { y: [0, -14, 0], rotate: [-2, 2, -2], scale: [1, 1.035, 1] } : { y: [0, -9, 0], rotate: [-1.2, 1.2, -1.2] }}
        transition={{ duration: reading ? 1.25 : 4.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="oracle__identity"><span>YOUR GUIDE</span><strong>Aster</strong><small>{reading ? 'Reading the moment…' : step === 5 ? 'A thoughtful match' : 'Listening closely'}</small></div>
    </aside>

    <div className="oracle__conversation">
      {step < 5 && <div className="oracle__progress" aria-label={`Step ${progress + 1} of 5`}>
        <span>0{progress + 1}</span><div>{[0, 1, 2, 3, 4].map(index => <i className={index <= progress ? 'is-active' : ''} key={index} />)}</div><span>05</span>
      </div>}

      <AnimatePresence mode="wait">
        {step === 0 && <motion.div className="oracle__panel" key="event" {...panelMotion}>
          <p className="oracle__voice"><Sparkles size={15} /> Let’s begin with the moment.</p>
          <h1 id="oracle-title">What brings you<br /><em>to Younoya?</em></h1>
          <div className="oracle__options oracle__options--events">
            {EVENTS.map(item => <button key={item.id} type="button" onClick={() => choose('event', item.id, 1)}>
              <span>{item.label}</span><small>{item.note}</small><ArrowRight size={18} />
            </button>)}
          </div>
        </motion.div>}

        {step === 1 && <motion.div className="oracle__panel" key="recipient" {...panelMotion}>
          <p className="oracle__voice">A beautiful reason. Now tell me—</p>
          <h1 id="oracle-title">Who is this<br /><em>chapter for?</em></h1>
          <div className="oracle__options oracle__options--duo">
            <button type="button" onClick={() => choose('forWhom', 'self', 3)}><span>For me</span><small>A gift for my own becoming</small><ArrowRight size={18} /></button>
            <button type="button" onClick={() => choose('forWhom', 'other', 2)}><span>For someone</span><small>A person held close</small><ArrowRight size={18} /></button>
          </div>
          <button className="oracle__back" type="button" onClick={goBack}><ArrowLeft size={15} /> Back</button>
        </motion.div>}

        {step === 2 && <motion.div className="oracle__panel" key="relation" {...panelMotion}>
          <p className="oracle__voice">The bond gives the gift its language.</p>
          <h1 id="oracle-title">How do they<br /><em>belong to you?</em></h1>
          <div className="oracle__chips">
            {RELATIONS.map(relation => <button type="button" key={relation} onClick={() => choose('relation', relation, 3)}>{relation}<ArrowRight size={15} /></button>)}
          </div>
          <button className="oracle__back" type="button" onClick={goBack}><ArrowLeft size={15} /> Back</button>
        </motion.div>}

        {step === 3 && <motion.form className="oracle__panel" key="name" {...panelMotion} onSubmit={event => { event.preventDefault(); if (values.name.trim()) setStep(4) }}>
          <p className="oracle__voice">Names make intentions feel real.</p>
          <h1 id="oracle-title">What shall I<br /><em>call {values.forWhom === 'self' ? 'you' : 'them'}?</em></h1>
          <label className="oracle__line-input"><span>{values.forWhom === 'self' ? 'Your name' : 'Their name'}</span><input autoFocus required value={values.name} onChange={event => setValues(current => ({ ...current, name: event.target.value }))} placeholder="Type a name" /></label>
          <div className="oracle__form-actions"><button className="oracle__back" type="button" onClick={goBack}><ArrowLeft size={15} /> Back</button><button className="oracle__continue" type="submit">Continue <ArrowRight size={17} /></button></div>
        </motion.form>}

        {step === 4 && <motion.form className="oracle__panel" key="birth" {...panelMotion} onSubmit={reveal}>
          <p className="oracle__voice">Thank you, {values.name}. One final constellation.</p>
          <h1 id="oracle-title">Where did this<br /><em>story begin?</em></h1>
          <div className="oracle__birth-grid">
            <label><span>Date of birth</span><input required type="date" max={TODAY} value={values.dob} onChange={event => setValues(current => ({ ...current, dob: event.target.value }))} /></label>
            <label><span><Clock3 size={13} /> Time of birth</span><input required={!values.timeUnknown} disabled={values.timeUnknown} type="time" value={values.tob} onChange={event => setValues(current => ({ ...current, tob: event.target.value }))} /></label>
            <label className="oracle__place"><span><MapPin size={13} /> Place of birth</span><input required value={values.pob} onChange={event => setValues(current => ({ ...current, pob: event.target.value }))} placeholder="City, country" /></label>
          </div>
          <label className="oracle__unknown"><input type="checkbox" checked={values.timeUnknown} onChange={event => setValues(current => ({ ...current, timeUnknown: event.target.checked, tob: event.target.checked ? '' : current.tob }))} /><span>I don’t know the exact time</span></label>
          <p className="oracle__privacy">Kept in this session only. Your details are not sent or stored.</p>
          <div className="oracle__form-actions"><button className="oracle__back" type="button" onClick={goBack}><ArrowLeft size={15} /> Back</button><button className="oracle__continue" type="submit" disabled={reading}>{reading ? 'Reading the moment…' : 'Reveal the edit'} <Sparkles size={16} /></button></div>
        </motion.form>}

        {step === 5 && <motion.div className="oracle__panel oracle__panel--result" key="result" {...panelMotion}>
          <p className="oracle__voice"><Sparkles size={15} /> Aster’s edit for {recipient}</p>
          <h1 id="oracle-title">A gift for<br /><em>{selectedEvent?.label.toLowerCase()}.</em></h1>
          <p className="oracle__reading">“For {recipient}, I’d choose something that speaks to {signature?.sign} warmth and {signature?.element} energy—considered, lasting, and quietly personal.”</p>
          <div className="oracle__products">
            {matches.map((product, index) => <Link to={`/product/${product.handle}`} key={product.id} className="oracle__product">
              <div><img src={product.primaryImage} alt="" /><span>0{index + 1}</span></div>
              <h2>{product.name}</h2><p>{product.tagline}</p><strong>{product.price}</strong><i><ArrowUpRight size={17} /></i>
            </Link>)}
          </div>
          <p className="oracle__disclosure">This preview uses gifting context and a solar signature. A complete Vedic recommendation will connect to Younoya’s authenticated birth-chart service.</p>
          <div className="oracle__result-actions"><button type="button" onClick={restart}>Begin again</button><Link to="/shop">Explore the full collection <ArrowUpRight size={15} /></Link></div>
        </motion.div>}
      </AnimatePresence>
    </div>
  </section>
}
