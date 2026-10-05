const position = (value, total, radius) => ({ x: 50 + Math.sin(value / total * Math.PI * 2) * radius, y: 50 - Math.cos(value / total * Math.PI * 2) * radius })

export default function ClockDial({ unit, value, onChange, onCommit }) {
  const hours = unit === 'hour', total = hours ? 12 : 60
  const hand = position(value, total, 33)
  function choosePointer(event) {
    const bounds = event.currentTarget.getBoundingClientRect()
    const angle = Math.atan2(event.clientX - bounds.left - bounds.width / 2, -(event.clientY - bounds.top - bounds.height / 2))
    const next = (Math.round(angle / (Math.PI * 2) * total) + total) % total
    onChange(hours ? next || 12 : next)
  }
  return <div className="guide-clock" role="group" aria-label={hours ? 'Clock, choose an hour' : 'Clock, choose a minute'}
    onPointerDown={event => {
      if (event.button !== 0 || event.target.closest('button')) return
      event.currentTarget.setPointerCapture(event.pointerId); choosePointer(event)
    }}
    onPointerMove={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) choosePointer(event) }}
    onPointerUp={event => {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
      choosePointer(event); event.currentTarget.releasePointerCapture(event.pointerId); onCommit()
    }}>
    <svg viewBox="0 0 100 100" aria-hidden="true"><circle className="guide-clock__ring" cx="50" cy="50" r="40" />
      <line className="guide-clock__hand" x1="50" y1="50" x2={hand.x} y2={hand.y} />
      <circle className="guide-clock__tip" cx={hand.x} cy={hand.y} r="2" /><circle className="guide-clock__center" cx="50" cy="50" r="2" />
    </svg>
    {Array.from({ length: 12 }, (_, index) => {
      const tick = hours ? index || 12 : index * 5, point = position(index, 12, 40)
      return <button type="button" key={tick} className="guide-clock__number" style={{ '--clock-x': `${point.x}%`, '--clock-y': `${point.y}%` }}
        aria-label={`${hours ? 'Hour' : 'Minute'} ${hours ? tick : String(tick).padStart(2, '0')}`} aria-pressed={value === tick}
        onClick={() => { onChange(tick); onCommit() }} onKeyDown={event => {
          const direction = ['ArrowUp', 'ArrowRight'].includes(event.key) ? 1 : ['ArrowDown', 'ArrowLeft'].includes(event.key) ? -1 : 0
          if (!direction) return
          event.preventDefault(); const next = (value + direction + total) % total; onChange(hours ? next || 12 : next)
        }}>{hours ? tick : String(tick).padStart(2, '0')}</button>
    })}
  </div>
}
