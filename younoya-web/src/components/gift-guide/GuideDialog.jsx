import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export default function GuideDialog({ title, onClose, children, className = '' }) {
  const dialog = useRef(null)
  useEffect(() => {
    const element = dialog.current
    const previousFocus = document.activeElement
    element.showModal()
    return () => { element.close(); if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true }) }
  }, [])
  return <dialog ref={dialog} className={`guide-dialog ${className}`} aria-label={title} data-lenis-prevent
    onCancel={event => { event.preventDefault(); onClose() }}
    onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <div className="guide-dialog__panel">
      <header className="guide-dialog__heading"><h2>{title}</h2><button type="button" onClick={onClose} aria-label={`Close ${title.toLowerCase()}`}><X size={19} /></button></header>
      {children}
    </div>
  </dialog>
}
