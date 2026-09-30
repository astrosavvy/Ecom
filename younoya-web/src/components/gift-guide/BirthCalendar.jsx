import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

const today = new Date()
const earliest = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())
const months = Array.from({ length: 12 }, (_, index) => new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(2020, index, 1)))
const key = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export default function BirthCalendar({ value, onChange }) {
  const reducedMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => value ? new Date(`${value}T12:00:00`) : new Date(today.getFullYear() - 25, today.getMonth(), 1))
  const root = useRef(null)
  const year = view.getFullYear(), month = view.getMonth()
  const offset = (new Date(year, month, 1).getDay() + 6) % 7
  const days = new Date(year, month + 1, 0).getDate()
  useEffect(() => {
    if (!open) return undefined
    const close = event => { if (!root.current?.contains(event.target)) setOpen(false) }
    const escape = event => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', close); document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', escape) }
  }, [open])
  return <div className="guide-calendar" ref={root}>
    <label>Date of birth <span>Optional</span></label>
    <button type="button" className="guide-calendar__trigger" aria-expanded={open} onClick={() => setOpen(!open)}>
      {value ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T12:00:00`)) : 'Select a date'}
      <CalendarDays size={18} />
    </button>
    <AnimatePresence>{open && <motion.div className="guide-calendar__popover" initial={reducedMotion ? false : { opacity: 0, y: 9, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reducedMotion ? undefined : { opacity: 0, y: 7, scale: .97 }} transition={{ duration: reducedMotion ? 0 : .22 }}>
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
    </motion.div>}</AnimatePresence>
  </div>
}
