import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import BirthDetails from './BirthDetails'

const relationChoices = ['Partner', 'Parent', 'Sibling', 'Friend', 'Colleague', 'Extended family', 'Other']
const moments = {
  self: ['Starting something new', 'Building something meaningful', 'Growing what matters', 'Finding my balance', 'Exploring what is next'],
  other: ['A new beginning', 'A milestone', 'A bond', 'A new journey', 'Just them'],
}
const intentions = [
  { id: 'love-connection', name: 'A deeper connection', note: 'Care, gratitude and bonds that last' },
  { id: 'confidence-power', name: 'Quiet confidence', note: 'Courage, direction and presence' },
  { id: 'vitality-balance', name: 'A gentler rhythm', note: 'Renewal, balance and room to breathe' },
  { id: 'wealth-prosperity', name: 'Room to flourish', note: 'Growth, possibility and purposeful progress' },
]
const titles = [
  <>Who is this <em>for?</em></>,
  <>What may I <em>call them?</em></>,
  <>What is <em>unfolding?</em></>,
  <>What should this gift <em>carry?</em></>,
  <>Shall we read <em>the stars?</em></>,
]
const prefaces = [
  'A beautiful place to begin.', 'I would love to know a little more.',
  'Every gift begins with a moment.', 'Let us choose the meaning first.', 'Only if you would like to share.',
]

export default function GuideConversation({ step, setStep, values, setValues, onReveal, busy, error }) {
  const reducedMotion = useReducedMotion()
  const choose = (key, value) => { setValues(current => ({ ...current, [key]: value })); setStep(step + 1) }
  const back = () => setStep(Math.max(0, step - 1))
  const person = values.forWhom === 'self' ? 'you' : values.name || 'them'
  return <div className="guide-conversation">
    <div className="guide-progress"><span>THE GIFT CONVERSATION</span><div aria-label={`Step ${step + 1} of 5`}>{Array.from({ length: 5 }, (_, index) => <i key={index} className={index <= step ? 'is-active' : ''} />)}</div><span>0{step + 1} / 05</span></div>
    <div className="guide-history">{[
      values.forWhom && `For ${values.forWhom === 'self' ? 'myself' : 'someone else'}`,
      values.name && values.name,
      values.moment && values.moment,
      values.intention && intentions.find(item => item.id === values.intention)?.name,
    ].filter(Boolean).slice(0, step).map((answer, index) => <span key={`${answer}-${index}`}>{answer}</span>)}</div>
    <AnimatePresence mode="wait"><motion.div className="guide-conversation__step" key={step} initial={reducedMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? undefined : { opacity: 0, y: -16 }} transition={{ duration: reducedMotion ? 0 : .33 }}>
      <div className="guide-question"><div className="guide-question__spark"><Sparkles size={17} /></div><div><span>{prefaces[step]}</span><h1>{titles[step]}</h1></div></div>
      {step === 0 && <div className="guide-choices guide-choices--duo">
        <button type="button" onClick={() => choose('forWhom', 'self')}>For myself <ArrowRight size={18} /></button>
        <button type="button" onClick={() => choose('forWhom', 'other')}>For someone I cherish <ArrowRight size={18} /></button>
      </div>}
      {step === 1 && <form className="guide-fields" onSubmit={event => { event.preventDefault(); if (values.name.trim() && (values.forWhom === 'self' || values.relation)) setStep(2) }}>
        <label>{values.forWhom === 'self' ? 'Your name' : 'Their name'}<input autoFocus maxLength={70} required value={values.name} onChange={event => setValues(current => ({ ...current, name: event.target.value }))} placeholder={values.forWhom === 'self' ? 'What may I call you?' : 'Their first name'} /></label>
        {values.forWhom === 'other' && <fieldset><legend>How do you know them?</legend><div className="guide-chips">{relationChoices.map(relation => <button type="button" className={values.relation === relation ? 'is-selected' : ''} key={relation} onClick={() => setValues(current => ({ ...current, relation }))}>{relation}</button>)}</div></fieldset>}
        <button className="guide-primary" type="submit">Continue <ArrowRight size={18} /></button>
      </form>}
      {step === 2 && <div className="guide-choices">{moments[values.forWhom].map(moment => <button type="button" key={moment} onClick={() => choose('moment', moment)}>{moment}<ArrowRight size={17} /></button>)}</div>}
      {step === 3 && <div className="guide-choices">{intentions.map(item => <button type="button" key={item.id} onClick={() => choose('intention', item.id)}><span>{item.name}<small>{item.note}</small></span><ArrowRight size={17} /></button>)}</div>}
      {step === 4 && <div><BirthDetails values={values} setValues={setValues} /><button type="button" className="guide-primary guide-reveal" disabled={busy} onClick={onReveal}>{busy ? 'Choosing with care…' : `Find a piece for ${person}`} <Sparkles size={18} /></button>{error && <p className="guide-error" role="alert">{error}</p>}</div>}
      {step > 0 && <button className="guide-back" type="button" onClick={back}><ArrowLeft size={16} /> Go back</button>}
    </motion.div></AnimatePresence>
  </div>
}
