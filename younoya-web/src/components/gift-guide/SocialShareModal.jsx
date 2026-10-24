import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Share2, Download, MessageCircle } from 'lucide-react'
import { renderSocialCardToCanvas, generateSocialCardBlob, downloadSocialCard } from '../../lib/socialCardGenerator'
import '../../styles/SocialShareModal.css'

export default function SocialShareModal({ data, onClose, presentation = 'chapter' }) {
  const dialogRef = useRef(null)
  const canvasRef = useRef(null)
  const closeRef = useRef(onClose)
  const timerRef = useRef(null)
  closeRef.current = onClose
  const headingId = useId()
  const descriptionId = useId()
  const gift = presentation === 'gift'
  const [format, setFormat] = useState('feed')
  const [theme, setTheme] = useState(data?.defaultTheme || 'atelier')
  const [toast, setToast] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    const trigger = document.activeElement
    const overflow = document.body.style.overflow
    const lenis = window.__lenis
    const restart = lenis && !lenis.isStopped
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    if (restart) lenis.stop()
    return () => {
      clearTimeout(timerRef.current)
      dialog.close()
      document.body.style.overflow = overflow
      if (restart) lenis.start()
      if (trigger?.isConnected) trigger.focus({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    Promise.resolve(document.fonts?.ready).then(() => {
      if (!cancelled && canvasRef.current) return renderSocialCardToCanvas(canvasRef.current, data, { format, theme })
    }).catch(() => { if (!cancelled) setToast('We couldn’t prepare the card. Please try again.') })
    return () => { cancelled = true }
  }, [data, format, theme])

  function notify(message) {
    clearTimeout(timerRef.current)
    setToast(message)
    timerRef.current = setTimeout(() => setToast(''), 4000)
  }
  const shareUrl = gift ? data.shareUrl : 'https://younoya.com/find-a-gift?utm_source=whatsapp_share&utm_medium=chat&utm_campaign=prophecy'
  function handleWhatsAppShare() {
    const text = gift ? `${data.anchorPiece} · YOUNOYA\n\n${data.prophecy}\n\n${shareUrl}` : `✦ Aster revealed my chapter prophecy for ${data.sign} ${data.signSymbol || ''}:\n\n"${data.prophecy || ''}"\n\nCurated at: ${shareUrl}`
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }
  async function handleDownload() {
    setBusy(true)
    try {
      const saved = await downloadSocialCard(data, { format, theme }, `younoya-${data.sign?.toLowerCase() || 'gift'}-${format}-${theme}.png`)
      if (!saved) throw new Error('No card')
      notify('Card saved to your downloads.')
    } catch { notify('We couldn’t save the card. Please try again.') }
    finally { setBusy(false) }
  }
  async function handleNativeShare() {
    setBusy(true)
    try {
      const blob = await generateSocialCardBlob(data, { format, theme })
      if (!blob) throw new Error('No card')
      const file = new File([blob], `younoya-${data.sign?.toLowerCase() || 'gift'}-${format}.png`, { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: gift ? `${data.anchorPiece} | YOUNOYA` : `${data.sign} Chapter Revelation | YOUNOYA`, text: `${data.prophecy} · ${shareUrl}`, files: [file] })
        notify('Shared successfully.')
      } else {
        const saved = await downloadSocialCard(data, { format, theme }, file.name)
        if (!saved) throw new Error('No card')
        notify('Card saved to your downloads.')
      }
    } catch (error) { if (error.name !== 'AbortError') notify('Sharing is unavailable. You can download the card instead.') }
    finally { setBusy(false) }
  }
  function containFocus(event) {
    if (event.key !== 'Tab') return
    const controls = [...event.currentTarget.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]')]
    const first = controls[0]
    const last = controls.at(-1)
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }
  return createPortal(<dialog ref={dialogRef} className={`social-share-dialog${gift ? ' social-share-dialog--gift' : ''}`}
    aria-labelledby={headingId} aria-describedby={descriptionId}
    onKeyDown={containFocus}
    onCancel={event => { event.preventDefault(); closeRef.current() }}
    onClick={event => { if (event.target === dialogRef.current) closeRef.current() }}>
    <div className="social-share-modal">
      <button type="button" className="social-share-modal__close" onClick={onClose} aria-label="Close share dialog" autoFocus><X size={18} /></button>
      <header className="social-share-modal__head"><span className="social-share-modal__eyebrow">{gift ? 'Your gift edition' : 'Chapter Folio'}</span><h3 id={headingId} className="social-share-modal__title">{gift ? 'Keep the intention close.' : 'The Written Revelation'}</h3><p id={descriptionId} className="social-share-modal__desc">{gift ? 'Save the note from this edition, or share it with someone.' : 'A quiet contemplation drawn from your celestial transit. Prepared for your journal or story.'}</p></header>
      <div className="social-share-modal__controls">
        <div className="social-share-modal__toggles" role="group" aria-label="Card format">{[['feed','Post'],['story','Story']].map(([value,label]) => <button key={value} type="button" className={`social-share-modal__toggle-btn ${format === value ? 'active' : ''}`} aria-pressed={format === value} onClick={() => setFormat(value)}>{label}</button>)}</div>
        <div className="social-share-modal__themes" role="group" aria-label="Visual edition">{[['atelier','Ivory'],['nocturne','Nocturne']].map(([value,label]) => <button key={value} type="button" className={`social-share-modal__theme-btn ${theme === value ? 'active' : ''}`} aria-pressed={theme === value} onClick={() => setTheme(value)}>{label}</button>)}</div>
      </div>
      <div className="social-share-modal__canvas-wrap"><canvas ref={canvasRef} className={`social-share-modal__canvas social-share-modal__canvas--${format}`} role="img" aria-label={`${data.anchorPiece || data.chapter}: ${data.prophecy}`} /></div>
      <div className="social-share-modal__actions"><button type="button" className="social-share-btn-primary" disabled={busy} onClick={handleDownload}><Download size={16} />{busy ? 'Preparing…' : 'Download Card'}</button><div className="social-share-modal__actions-row"><button type="button" className="social-share-btn-secondary" disabled={busy} onClick={handleNativeShare}><Share2 size={15} />Share Image</button><button type="button" className="social-share-btn-whatsapp" disabled={busy} onClick={handleWhatsAppShare}><MessageCircle size={15} />WhatsApp</button></div></div>
      {toast && <p className="social-share-modal__toast" role="status">{toast}</p>}
    </div>
  </dialog>, document.body)
}
