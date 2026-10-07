import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export default function LoginDialog({ onClose, children }) {
  const dialog = useRef(null)
  useEffect(() => {
    const element = dialog.current
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    element.showModal()
    let frame
    const fit = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const viewport = window.visualViewport
        const height = viewport?.height || window.innerHeight
        element.style.setProperty('--login-height', `${height}px`)
        const top = (viewport?.offsetTop || 0) + Math.max(12, (height - element.getBoundingClientRect().height) / 2)
        element.style.top = `${top}px`
        element.style.bottom = 'auto'
        element.style.marginBlock = '0'
      })
    }
    const observer = new ResizeObserver(fit)
    observer.observe(element)
    window.visualViewport?.addEventListener('resize', fit)
    window.visualViewport?.addEventListener('scroll', fit)
    window.addEventListener('resize', fit)
    fit()
    return () => {
      observer.disconnect(); cancelAnimationFrame(frame)
      window.visualViewport?.removeEventListener('resize', fit)
      window.visualViewport?.removeEventListener('scroll', fit)
      window.removeEventListener('resize', fit)
      element.close(); document.body.style.overflow = previousOverflow
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [])
  const containFocus = event => {
    if (event.key !== 'Tab') return
    const controls = [...dialog.current.querySelectorAll('button:not(:disabled), input:not(:disabled), a[href], [tabindex="0"]')]
      .filter(control => control.getClientRects().length > 0)
    const first = controls[0], last = controls.at(-1)
    if (!first) { event.preventDefault(); return }
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus()
    }
  }
  return <dialog ref={dialog} className="login-modal" aria-labelledby="login-title" data-lenis-prevent
    onKeyDown={containFocus}
    onCancel={event => { event.preventDefault(); onClose() }}
    onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <button className="login-close" type="button" onClick={onClose} aria-label="Close sign in"><X size={18} /></button>
    {children}
  </dialog>
}
