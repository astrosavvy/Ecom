import { useState } from 'react'
import { Clock3 } from 'lucide-react'
import GuideDialog from './GuideDialog'
import ClockDial from './ClockDial'
import '../../styles/GuideTimePicker.css'

const pad = value => String(value).padStart(2, '0')
const draftFrom = value => {
  const [hour, minute] = (value || '00:00').split(':').map(Number)
  return { hour: hour % 12 || 12, minute, period: hour >= 12 ? 'PM' : 'AM' }
}
const display = value => {
  const draft = draftFrom(value)
  return `${draft.hour}:${pad(draft.minute)} ${draft.period}`
}

export default function BirthTime({ value, onChange }) {
  const [open, setOpen] = useState(false), [unit, setUnit] = useState('hour')
  const [draft, setDraft] = useState(() => draftFrom(value))
  const update = (key, next) => setDraft(current => ({ ...current, [key]: next }))
  const close = () => setOpen(false)
  function confirm() {
    onChange(`${pad(draft.hour % 12 + (draft.period === 'PM' ? 12 : 0))}:${pad(draft.minute)}`)
    close()
  }
  return <div className="guide-time">
    <label htmlFor="guide-birth-time">Time of birth <span>Optional</span></label>
    <button id="guide-birth-time" type="button" className="guide-calendar__trigger guide-time__trigger" aria-haspopup="dialog" aria-expanded={open}
      onClick={() => { setDraft(draftFrom(value)); setUnit('hour'); setOpen(true) }}>
      <span>{value ? display(value) : 'Select time'}</span><Clock3 size={18} />
    </button>
    {open && <GuideDialog title="Select time of birth" className="guide-dialog--time" onClose={close}>
      <div className="guide-time-picker">
        <div className="guide-time-picker__dial"><p className="guide-time-picker__hint" aria-live="polite">{unit === 'hour' ? 'Choose the hour' : 'Choose the minute'}</p>
          <ClockDial unit={unit} value={draft[unit]} onChange={next => update(unit, next)} onCommit={() => setUnit('minute')} />
        </div>
        <div className="guide-time-picker__controls">
          <div className="guide-time-picker__units">
            <label htmlFor="guide-time-hour">Hour<select id="guide-time-hour" value={draft.hour} className={unit === 'hour' ? 'is-active' : ''} onFocus={() => setUnit('hour')}
              onChange={event => { update('hour', Number(event.target.value)); setUnit('minute') }}>{Array.from({ length: 12 }, (_, index) => <option key={index} value={index + 1}>{pad(index + 1)}</option>)}</select></label>
            <span aria-hidden="true">:</span>
            <label htmlFor="guide-time-minute">Minute<select id="guide-time-minute" value={draft.minute} className={unit === 'minute' ? 'is-active' : ''} onFocus={() => setUnit('minute')}
              onChange={event => update('minute', Number(event.target.value))}>{Array.from({ length: 60 }, (_, index) => <option key={index} value={index}>{pad(index)}</option>)}</select></label>
          </div>
          <div className="guide-time-picker__period" role="group" aria-label="Time of day">{['AM', 'PM'].map(period => <button type="button" key={period} aria-pressed={draft.period === period} onClick={() => update('period', period)}>{period}</button>)}</div>
          <p className="guide-time-picker__note">Choose any minute above, or use the clock.</p>
        </div>
      </div>
      <footer className="guide-time-picker__actions"><button type="button" className="guide-time-picker__clear" onClick={() => { onChange(''); close() }}>Clear time</button><button type="button" className="guide-time-picker__confirm" onClick={confirm}>Use {draft.hour}:{pad(draft.minute)} {draft.period}</button></footer>
    </GuideDialog>}
  </div>
}
