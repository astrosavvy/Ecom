import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight, Clock3, MapPin, Sparkles } from 'lucide-react'
import { PRODUCTS } from '../data/products'
import '../styles/GiftFinder.css'

const EVENTS = [
  { id: 'milestone', label: 'A milestone achievement', note: 'Honouring bravery & sovereign elevation', handles: ['the-golden-flight', 'vivid-toucan-muse', 'solar-embrace'] },
  { id: 'anniversary', label: 'An anniversary or union', note: 'A sacred bond worth honouring', handles: ['flamingo-grace', 'the-inner-kingdom', 'flamingo-aura'] },
  { id: 'beginning', label: 'A brave new chapter', note: 'Fresh horizons & grounded renewal', handles: ['the-verdant-rising', 'the-golden-flight', 'solar-embrace'] },
  { id: 'gratitude', label: 'Deep gratitude & wisdom', note: 'For what words cannot hold', handles: ['golden-instinct', 'cats-eye', 'the-inner-kingdom'] },
  { id: 'protection', label: 'Sacred protection & boundary', note: 'Inner alchemy & fierce sanctuary', handles: ['fire-and-radiance', 'cats-eye', 'the-golden-flight'] },
]

const RELATIONS = ['Partner', 'Parent', 'Sibling', 'Friend', 'Colleague', 'Someone special']

const RELATION_HANDLES = {
  Partner: 'flamingo-grace',
  Parent: 'the-inner-kingdom',
  Sibling: 'vivid-toucan-muse',
  Friend: 'the-verdant-rising',
  Colleague: 'golden-instinct',
  'Someone special': 'the-golden-flight',
  self: 'solar-embrace',
}

const ELEMENT_HANDLES = {
  fire: ['the-golden-flight', 'fire-and-radiance'],
  earth: ['golden-instinct', 'the-verdant-rising'],
  air: ['vivid-toucan-muse', 'solar-embrace'],
  water: ['flamingo-grace', 'flamingo-aura'],
}

const ELEMENT_TONE = {
  fire: 'bold sovereign expression and breakthrough radiance',
  earth: 'steady grounding, wisdom, and multiplied harvest',
  air: 'charismatic vision, lightness, and keen perception',
  water: 'intuitive devotion, deep serenity, and protective harmony',
}

const SIGN_DATA = [
  ['Capricorn', 'earth', 120], ['Aquarius', 'air', 219], ['Pisces', 'water', 321],
  ['Aries', 'fire', 420], ['Taurus', 'earth', 521], ['Gemini', 'air', 621],
  ['Cancer', 'water', 723], ['Leo', 'fire', 823], ['Virgo', 'earth', 923],
  ['Libra', 'air', 1023], ['Scorpio', 'water', 1122], ['Sagittarius', 'fire', 1222],
  ['Capricorn', 'earth', 1232],
]

const today = new Date()
const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate())
const earliest = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())
const MONTHS = Array.from({ length: 12 }, (_, month) => new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(2020, month, 1)))
const initialValues = { event: '', forWhom: '', relation: '', name: '', dob: '', tob: '', pob: '', timeUnknown: false }
const portrait = { listen: '/media/guide-listen.webp', speak: '/media/guide-speak.webp', blink: '/media/guide-blink.webp' }

function getSolarSignature(date) {
  const [, month, day] = date.split('-').map(Number)
  const found = SIGN_DATA.find(([, , end]) => month * 100 + day <= end) || SIGN_DATA[0]
  return { sign: found[0], element: found[1] }
}

function uniqueProducts(handles) {
  return [...new Set(handles)]
    .map(handle => PRODUCTS.find(product => product.handle === handle))
    .filter(Boolean)
    .slice(0, 3)
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function formatDate(value) {
  return value
    ? new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T12:00:00`))
    : 'Choose a date'
}

function BirthCalendar({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const [view, setView] = useState(() => value ? new Date(`${value}T12:00:00`) : new Date(today.getFullYear() - 25, today.getMonth(), 1))
  const year = view.getFullYear()
  const month = view.getMonth()
  const offset = (new Date(year, month, 1).getDay() + 6) % 7
  const days = new Date(year, month + 1, 0).getDate()
  const move = delta => setView(new Date(year, month + delta, 1))
  const choose = day => { onChange(dateKey(new Date(year, month, day))); setOpen(false) }

  useEffect(() => {
    if (!open) return undefined
    const closeOutside = event => { if (!rootRef.current?.contains(event.target)) setOpen(false) }
    const closeEscape = event => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeEscape)
    }
  }, [open])

  return (
    <div className="oracle-calendar" ref={rootRef}>
      <span className="oracle__field-label"><CalendarDays size={14} /> Date of birth</span>
      <button
        type="button"
        className={`oracle-calendar__trigger${value ? ' is-filled' : ''}`}
        aria-expanded={open}
        onClick={() => setOpen(current => !current)}
      >
        {formatDate(value)}
        <CalendarDays size={18} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="oracle-calendar__popover"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.22 }}
          >
            <div className="oracle-calendar__head">
              <button type="button" aria-label="Previous month" onClick={() => move(-1)}>
                <ChevronLeft size={18} />
              </button>
              <div>
                <select
                  aria-label="Birth month"
                  value={month}
                  onChange={event => setView(new Date(year, Number(event.target.value), 1))}
                >
                  {MONTHS.map((name, index) => (
                    <option value={index} key={name}>{name}</option>
                  ))}
                </select>
                <select
                  aria-label="Birth year"
                  value={year}
                  onChange={event => setView(new Date(Number(event.target.value), month, 1))}
                >
                  {Array.from({ length: today.getFullYear() - earliest.getFullYear() + 1 }, (_, index) => today.getFullYear() - index).map(item => (
                    <option value={item} key={item}>{item}</option>
                  ))}
                </select>
              </div>
              <button type="button" aria-label="Next month" onClick={() => move(1)}>
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="oracle-calendar__days">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((label, index) => (
                <span key={index}>{label}</span>
              ))}
              {Array.from({ length: offset }, (_, index) => (
                <i key={`blank-${index}`} />
              ))}
              {Array.from({ length: days }, (_, index) => {
                const day = index + 1
                const date = new Date(year, month, day)
                const disabled = date < earliest || date > todayLocal
                return (
                  <button
                    type="button"
                    key={day}
                    disabled={disabled}
                    className={value === dateKey(date) ? 'is-selected' : ''}
                    onClick={() => choose(day)}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
            <p>Choose a date within the past 120 years.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const panelMotion = {
  initial: { opacity: 0, x: 24, y: 10 },
  animate: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: -18, y: -8 },
  transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
}

export default function GiftFinder() {
  const [step, setStep] = useState(0)
  const [reading, setReading] = useState(false)
  const [values, setValues] = useState(initialValues)
  const [expression, setExpression] = useState('listen')
  const reducedMotion = useReducedMotion()

  const selectedEvent = EVENTS.find(item => item.id === values.event)
  const signature = values.dob ? getSolarSignature(values.dob) : null

  const matches = useMemo(() => uniqueProducts([
    selectedEvent?.handles[0],
    RELATION_HANDLES[values.forWhom === 'self' ? 'self' : values.relation],
    ...(ELEMENT_HANDLES[signature?.element] || []),
    ...(selectedEvent?.handles || []),
  ]), [selectedEvent, signature?.element, values.forWhom, values.relation])

  const recipient = values.forWhom === 'self' ? 'you' : values.name || 'them'
  const totalSteps = values.forWhom === 'self' ? 4 : 5
  const progress = Math.min(values.forWhom === 'self' && step >= 3 ? step - 1 : step, totalSteps - 1)

  const history = [
    step > 0 && ['The moment', selectedEvent?.label],
    step > 1 && ['For whom', values.forWhom === 'self' ? 'For me' : 'For someone'],
    step > 2 && values.forWhom === 'other' && ['Connection', values.relation],
    step > 3 && [values.forWhom === 'self' ? 'Your name' : 'Their name', values.name],
  ].filter(Boolean).slice(-2)

  // Dynamic Resonance Calculation
  const resonanceScore = useMemo(() => {
    let score = 70
    if (values.event) score += 8
    if (values.forWhom) score += 6
    if (values.relation || values.forWhom === 'self') score += 6
    if (values.name) score += 4
    if (values.dob) score += 6
    return Math.min(score, 98)
  }, [values])

  useEffect(() => {
    if (reducedMotion) return undefined
    setExpression('speak')
    const speaking = window.setTimeout(() => setExpression('listen'), 1450)
    const blinking = window.setInterval(() => {
      setExpression('blink')
      window.setTimeout(() => setExpression('listen'), 280)
    }, 5500)
    return () => {
      window.clearTimeout(speaking)
      window.clearInterval(blinking)
    }
  }, [step, reducedMotion])

  const choose = (key, value, next) => {
    setValues(current => ({ ...current, [key]: value }))
    window.setTimeout(() => setStep(next), reducedMotion ? 0 : 160)
  }

  const goBack = () => {
    if (step === 3 && values.forWhom === 'self') setStep(1)
    else setStep(current => Math.max(0, current - 1))
  }

  const reveal = event => {
    event.preventDefault()
    const date = new Date(`${values.dob}T12:00:00`)
    if (!values.dob || date < earliest || date > todayLocal || !values.pob.trim() || (!values.timeUnknown && !values.tob)) return
    setReading(true)
    window.setTimeout(() => {
      setReading(false)
      setStep(5)
    }, 1400)
  }

  const restart = () => {
    setValues(initialValues)
    setStep(0)
  }

  const onGuideMove = event => {
    if (event.pointerType === 'touch' || reducedMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--look-x', `${((event.clientX - rect.left) / rect.width - 0.5) * 18}px`)
    event.currentTarget.style.setProperty('--look-y', `${((event.clientY - rect.top) / rect.height - 0.5) * 12}px`)
  }

  const resetGuide = event => {
    event.currentTarget.style.setProperty('--look-x', '0px')
    event.currentTarget.style.setProperty('--look-y', '0px')
  }

  return (
    <section className="oracle oracle--chat" aria-labelledby="oracle-title">
      {/* LEFT COLUMN: Representative Persona & Celestial Shrine */}
      <aside
        className={`oracle__guide oracle__guide--step-${step}`}
        onPointerMove={onGuideMove}
        onPointerLeave={resetGuide}
      >
        <Link className="oracle__return" to="/">
          Return to Home <ArrowUpRight size={14} />
        </Link>
        <div className="oracle__guide-glow" aria-hidden="true" />
        
        {/* Guide Portrait */}
        <div className="oracle__portrait">
          <AnimatePresence mode="wait">
            <motion.img
              key={expression}
              src={portrait[expression]}
              alt="The Younoya boutique representative, your gift guide"
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.22 }}
            />
          </AnimatePresence>
        </div>

        {/* Identity & Status */}
        <div className="oracle__identity">
          <div className="oracle__status-badge">
            <span className="oracle__status-dot" />
            <span>ASTER • SANCTUM GUIDE</span>
          </div>
          <strong>Let’s find the right heirloom.</strong>
          <small>
            {reading
              ? 'Divining planetary alignments & consecrated harmonics…'
              : step === 5
              ? 'A curated edit of authentic handcrafted brooches'
              : 'Here with you, one intention at a time'}
          </small>

          {/* Resonance Harmonic Gauge */}
          <div className="oracle__resonance-box">
            <div className="oracle__resonance-header">
              <span>Celestial Resonance</span>
              <strong>{resonanceScore}% Harmonics</strong>
            </div>
            <div className="oracle__resonance-track">
              <div
                className="oracle__resonance-fill"
                style={{ width: `${resonanceScore}%` }}
              />
            </div>
            {signature && (
              <span className="oracle__element-tag">
                Solar Sign: {signature.sign} ({signature.element.toUpperCase()})
              </span>
            )}
          </div>
        </div>
      </aside>

      {/* RIGHT COLUMN: Conversational Stage Engine */}
      <div className="oracle__conversation">
        {step < 5 && (
          <div className="oracle__progress" aria-label={`Step ${progress + 1} of ${totalSteps}`}>
            <span>CONSECRATION STAGE</span>
            <div>
              {Array.from({ length: totalSteps }, (_, index) => (
                <i className={index <= progress ? 'is-active' : ''} key={index} />
              ))}
            </div>
            <span>0{progress + 1} / 0{totalSteps}</span>
          </div>
        )}

        {step > 0 && step < 5 && (
          <div className="oracle__history" aria-label="Your earlier answers">
            {history.map(([label, answer]) => (
              <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <span>{label}</span>
                <strong>{answer}</strong>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 0: THE OCCASION */}
          {step === 0 && (
            <motion.div className="oracle__panel" key="event" {...panelMotion}>
              <div className="oracle__message">
                <span className="oracle__message-mark"><Sparkles size={17} /></span>
                <div>
                  <p>Welcome. Let’s begin with the moment.</p>
                  <h1 id="oracle-title">What are we<br /><em>consecrating?</em></h1>
                </div>
              </div>
              <div className="oracle__options oracle__options--events">
                {EVENTS.map(item => (
                  <button type="button" key={item.id} onClick={() => choose('event', item.id, 1)}>
                    <span>{item.label}</span>
                    <small>{item.note}</small>
                    <ArrowUpRight size={18} />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 1: RECIPIENT */}
          {step === 1 && (
            <motion.div className="oracle__panel" key="recipient" {...panelMotion}>
              <div className="oracle__message">
                <span className="oracle__message-mark"><Sparkles size={17} /></span>
                <div>
                  <p>A noble intention. Tell me...</p>
                  <h1 id="oracle-title">Who is this<br /><em>for?</em></h1>
                </div>
              </div>
              <div className="oracle__options oracle__options--duo">
                <button type="button" onClick={() => choose('forWhom', 'self', 3)}>
                  <span>For myself</span>
                  <small>Personal alignment & daily sovereignty</small>
                  <ArrowUpRight size={18} />
                </button>
                <button type="button" onClick={() => choose('forWhom', 'other', 2)}>
                  <span>For someone cherished</span>
                  <small>A blessed gift for a bond I hold close</small>
                  <ArrowUpRight size={18} />
                </button>
              </div>
              <button className="oracle__back" type="button" onClick={goBack}>
                <ArrowLeft size={15} /> Go back
              </button>
            </motion.div>
          )}

          {/* STEP 2: RELATIONSHIP */}
          {step === 2 && (
            <motion.div className="oracle__panel" key="relation" {...panelMotion}>
              <div className="oracle__message">
                <span className="oracle__message-mark"><Sparkles size={17} /></span>
                <div>
                  <p>That connection holds sacred meaning.</p>
                  <h1 id="oracle-title">How do you<br /><em>know them?</em></h1>
                </div>
              </div>
              <div className="oracle__chips">
                {RELATIONS.map(relation => (
                  <button type="button" key={relation} onClick={() => choose('relation', relation, 3)}>
                    {relation}
                    <ArrowUpRight size={15} />
                  </button>
                ))}
              </div>
              <button className="oracle__back" type="button" onClick={goBack}>
                <ArrowLeft size={15} /> Go back
              </button>
            </motion.div>
          )}

          {/* STEP 3: NAME */}
          {step === 3 && (
            <motion.form
              className="oracle__panel"
              key="name"
              {...panelMotion}
              onSubmit={event => {
                event.preventDefault()
                if (values.name.trim()) setStep(4)
              }}
            >
              <div className="oracle__message">
                <span className="oracle__message-mark"><Sparkles size={17} /></span>
                <div>
                  <p>Every name carries a vibrational rhythm.</p>
                  <h1 id="oracle-title">What should I<br /><em>call {values.forWhom === 'self' ? 'you' : 'them'}?</em></h1>
                </div>
              </div>
              <label className="oracle__line-input">
                <span>{values.forWhom === 'self' ? 'Your name' : 'Their name'}</span>
                <input
                  autoFocus
                  required
                  maxLength={60}
                  value={values.name}
                  onChange={event => setValues(current => ({ ...current, name: event.target.value }))}
                  placeholder="Type a name"
                />
              </label>
              <div className="oracle__form-actions">
                <button className="oracle__back" type="button" onClick={goBack}>
                  <ArrowLeft size={15} /> Go back
                </button>
                <button className="oracle__continue" type="submit">
                  Continue to astrological coordinates <ArrowRight size={17} />
                </button>
              </div>
            </motion.form>
          )}

          {/* STEP 4: BIRTH COORDINATES */}
          {step === 4 && (
            <motion.form className="oracle__panel" key="birth" {...panelMotion} onSubmit={reveal}>
              <div className="oracle__message">
                <span className="oracle__message-mark"><Sparkles size={17} /></span>
                <div>
                  <p>Thank you, {values.name}. One last detail.</p>
                  <h1 id="oracle-title">
                    When and where<br />
                    <em>{values.forWhom === 'self' ? 'were you born?' : 'were they born?'}</em>
                  </h1>
                </div>
              </div>
              <div className="oracle__birth-grid">
                <BirthCalendar value={values.dob} onChange={dob => setValues(current => ({ ...current, dob }))} />
                <label className="oracle__time">
                  <span className="oracle__field-label"><Clock3 size={14} /> Time of birth</span>
                  <input
                    required={!values.timeUnknown}
                    disabled={values.timeUnknown}
                    type="time"
                    value={values.tob}
                    onChange={event => setValues(current => ({ ...current, tob: event.target.value }))}
                  />
                </label>
                <label className="oracle__place">
                  <span className="oracle__field-label"><MapPin size={14} /> Place of birth</span>
                  <input
                    required
                    maxLength={100}
                    value={values.pob}
                    onChange={event => setValues(current => ({ ...current, pob: event.target.value }))}
                    placeholder="City, country"
                  />
                </label>
              </div>
              <label className="oracle__unknown">
                <input
                  type="checkbox"
                  checked={values.timeUnknown}
                  onChange={event => setValues(current => ({
                    ...current,
                    timeUnknown: event.target.checked,
                    tob: event.target.checked ? '' : current.tob,
                  }))}
                />
                <span>I do not know the exact birth time</span>
              </label>
              <p className="oracle__privacy">Coordinates remain strictly in your browser session for this local preview.</p>
              <div className="oracle__form-actions">
                <button className="oracle__back" type="button" onClick={goBack}>
                  <ArrowLeft size={15} /> Go back
                </button>
                <button className="oracle__continue" type="submit" disabled={reading || !values.dob}>
                  {reading ? 'Divining Planetary Harmonics…' : 'Reveal Consecrated Keepsake'} <Sparkles size={16} />
                </button>
              </div>
            </motion.form>
          )}

          {/* STEP 5: CONSECRATED RESULT */}
          {step === 5 && (
            <motion.div className="oracle__panel oracle__panel--result" key="result" {...panelMotion}>
              <div className="oracle__message">
                <span className="oracle__message-mark"><Sparkles size={17} /></span>
                <div>
                  <p>A consecrated edit for {recipient}</p>
                  <h1 id="oracle-title">
                    An heirloom for<br />
                    <em>{selectedEvent?.label.toLowerCase()}.</em>
                  </h1>
                </div>
              </div>
              <p className="oracle__reading">
                “{values.forWhom === 'self' ? 'Your' : `${values.name}’s`} {signature?.sign} solar signature suggests {ELEMENT_TONE[signature?.element]}. For this moment, our atelier presents these handcrafted consecrated brooches.”
              </p>
              
              <div className="oracle__products">
                {matches.map((product, index) => (
                  <Link to={`/product/${product.handle}`} key={product.id} className="oracle__product">
                    <div>
                      <img src={product.primaryImage} alt={product.name} />
                      <span>0{index + 1}</span>
                    </div>
                    <h2>{product.name}</h2>
                    <p className="oracle__product-specs">
                      {product.specs?.dimensions} • {product.specs?.weight}
                    </p>
                    <p className="oracle__product-subtitle">{product.subtitle}</p>
                    <strong>{product.price}</strong>
                    <i><ArrowUpRight size={17} /></i>
                  </Link>
                ))}
              </div>

              <p className="oracle__disclosure">
                Matches are determined by astrological solar alignment, intention, and elemental harmony. Full Vedic Janam Kundali attunement is conducted upon order consecration.
              </p>
              
              <div className="oracle__result-actions">
                <button type="button" onClick={restart}>Begin again</button>
                <Link to="/shop">Explore all 10 brooches <ArrowUpRight size={15} /></Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
