import { useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import GuideDialog from './GuideDialog'

const today = new Date()
const earliest = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())
const months = Array.from({ length: 12 }, (_, index) => new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(2020, index, 1)))
const key = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export default function BirthCalendar({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => value ? new Date(`${value}T12:00:00`) : new Date(today.getFullYear() - 25, today.getMonth(), 1))
  const year = view.getFullYear(), month = view.getMonth()
  const offset = (new Date(year, month, 1).getDay() + 6) % 7
  const days = new Date(year, month + 1, 0).getDate()
  return <div className="guide-calendar">
    <label htmlFor="guide-birth-date">Date of birth <span>Optional</span></label>
    <button id="guide-birth-date" type="button" className="guide-calendar__trigger" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
      {value ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T12:00:00`)) : 'Select a date'}
      <CalendarDays size={18} />
    </button>
    {open && <GuideDialog title="Select your date of birth" className="guide-dialog--calendar" onClose={() => setOpen(false)}><div className="guide-calendar__popover">
      <header>
        <button type="button" aria-label="Previous month" onClick={() => setView(new Date(year, month - 1, 1))}><ChevronLeft size={18} /></button>
        <select aria-label="Month" value={month} onChange={event => setView(new Date(year, Number(event.target.value), 1))}>{months.map((name, index) => <option key={name} value={index}>{name}</option>)}</select>
        <select aria-label="Year" value={year} onChange={event => setView(new Date(Number(event.target.value), month, 1))}>{Array.from({ length: 121 }, (_, index) => today.getFullYear() - index).map(item => <option key={item}>{item}</option>)}</select>
        <button type="button" aria-label="Next month" onClick={() => setView(new Date(year, month + 1, 1))}><ChevronRight size={18} /></button>
      </header>
      <div className="guide-calendar__days">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <span key={index}>{day}</span>)}
        {Array.from({ length: offset }, (_, index) => <i key={index} />)}
        {Array.from({ length: days }, (_, index) => {
          const date = new Date(year, month, index + 1), disabled = date < earliest || date > today
          return <button key={index} type="button" disabled={disabled} aria-label={new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)}
            className={value === key(date) ? 'is-selected' : ''} onClick={() => { onChange(key(date)); setOpen(false) }}>{index + 1}</button>
        })}
      </div>
    </div></GuideDialog>}
  </div>
}
