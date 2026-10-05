import { ArrowLeft, ArrowUp, Sparkles } from 'lucide-react'
import BirthDetails from './BirthDetails'
import FluidReply from './FluidReply'
import { intentions, moments, relations } from './guideCopy'

export default function GuideReplyDock({ step, setStep, values, setValues, onReveal, busy, error }) {
  const self = values.forWhom === 'self'
  const choose = (key, value) => { setValues(current => ({ ...current, [key]: value })); setStep(step + 1) }
  return <div className="guide-reply-dock" data-lenis-prevent aria-label="Reply to Aster">
    {step === 0 && <div className="guide-choices guide-choices--duo">
      <FluidReply selected={values.forWhom === 'self'} aria-pressed={values.forWhom === 'self'} note="A piece for my own chapter" onClick={() => choose('forWhom', 'self')}>For myself</FluidReply>
      <FluidReply selected={values.forWhom === 'other'} aria-pressed={values.forWhom === 'other'} note="A thoughtful gift, chosen just for them" index={1} onClick={() => choose('forWhom', 'other')}>For someone I cherish</FluidReply>
    </div>}
    {step === 1 && <form className="guide-fields" onSubmit={event => { event.preventDefault(); if (values.name.trim() && (self || values.relation)) setStep(2) }}>
      <div className="guide-composer"><label htmlFor="guide-name">{self ? 'Your name' : 'Their name'}</label><div><input id="guide-name" maxLength={70} required value={values.name} onChange={event => setValues(current => ({ ...current, name: event.target.value }))} placeholder={self ? 'You can call me…' : 'Their first name…'} /><button type="submit" aria-label="Send name and continue" disabled={!values.name.trim() || (!self && !values.relation)}><ArrowUp size={19} /></button></div></div>
      {!self && <fieldset><legend>Your connection</legend><div className="guide-chips">{relations.map((relation, index) => <FluidReply compact aria-pressed={values.relation === relation} selected={values.relation === relation} index={index} key={relation} onClick={() => setValues(current => ({ ...current, relation }))}>{relation}</FluidReply>)}</div></fieldset>}
    </form>}
    {step === 2 && <div className="guide-choices">{moments[values.forWhom].map((moment, index) => <FluidReply selected={values.moment === moment} aria-pressed={values.moment === moment} index={index} key={moment} onClick={() => choose('moment', moment)}>{moment}</FluidReply>)}</div>}
    {step === 3 && <div className="guide-choices guide-choices--intentions">{intentions.map((item, index) => <FluidReply selected={values.intention === item.id} aria-pressed={values.intention === item.id} index={index} key={item.id} note={item.note} onClick={() => choose('intention', item.id)}>{item.name}</FluidReply>)}</div>}
    {step === 4 && <div><BirthDetails values={values} setValues={setValues} /><button type="button" className="guide-primary guide-reveal" disabled={busy} onClick={onReveal}>{busy ? <><span className="guide-typing" aria-hidden="true"><i /><i /><i /></span> Choosing with care…</> : <>Find a piece for {self ? 'you' : values.name || 'them'} <Sparkles size={17} /></>}</button>{error && <p className="guide-error" role="alert">{error}</p>}</div>}
    {step > 0 && <button className="guide-back" type="button" onClick={() => setStep(step - 1)}><ArrowLeft size={16} /> Go back</button>}
  </div>
}
