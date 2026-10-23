import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react'
import { KALASH_PRODUCT } from '../../data/kalash'
import { MONEY_AMPLIFIER_PRODUCT } from '../../data/moneyAmplifier'
import { NAVRATRI_PRODUCT } from '../../data/navratri'
import '../../styles/ShopEditions.css'

const slides = [
  { product:KALASH_PRODUCT,kicker:'THE DIWALI WEALTH KALASH',title:'An auspicious start.',emphasis:'An intention to keep.',
    description:'A textured Kalash, ritual essentials and a thoughtful intention for your Diwali celebrations.',cta:'Explore the Kalash',detail:'Diwali rituals · devotional gifting' },
  { product:MONEY_AMPLIFIER_PRODUCT,kicker:'THE WEALTH & SHIELD EDIT',title:'Continuous abundance.',emphasis:'Sacred protection.',
    description:'An iridescent crystal Kurma and artisan blue marbled Hamsa plate to amplify wealth flow and shield against evil nazar.',cta:'Explore the Set',detail:'Consecrated 2-in-1 set · delicate heirloom' },
  { product:NAVRATRI_PRODUCT,kicker:'THE YOUNOYA NAVRATRI EDIT',title:'Nine days of devotion.',emphasis:'Kept together.',
    description:'Shringaar, colour and devotional keepsakes. Nine daily kits, brought together in one complete box.',cta:'Explore the Navratri box',detail:'Nine daily kits · one complete set' },
]
export default function ShopEditions() {
  const [selected,setSelected] = useState(0)
  const [paused,setPaused] = useState(false)
  const [hovered,setHovered] = useState(false)
  const [focused,setFocused] = useState(false)
  const [visible,setVisible] = useState(true)
  const [documentVisible,setDocumentVisible] = useState(!document.hidden)
  const [failures,setFailures] = useState({})
  const root = useRef(null)
  const pointer = useRef(null)
  const swiped = useRef(false)
  const reducedMotion = useReducedMotion()
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting),{threshold:.35})
    observer.observe(root.current)
    const visibility = () => setDocumentVisible(!document.hidden)
    document.addEventListener('visibilitychange',visibility)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange',visibility) }
  },[])
  useEffect(() => {
    if (paused || hovered || focused || !visible || !documentVisible || reducedMotion) return
    const timer = setTimeout(() => setSelected(index => (index+1)%slides.length),8000)
    return () => clearTimeout(timer)
  },[selected,paused,hovered,focused,visible,documentVisible,reducedMotion])
  function shift(direction) { setSelected(index => (index+direction+slides.length)%slides.length) }
  function endPointer(event) {
    if (!pointer.current) return
    const dx = event.clientX-pointer.current.x, dy = event.clientY-pointer.current.y
    if (Math.abs(dx)>50 && Math.abs(dx)>Math.abs(dy)*1.4) { swiped.current=true; shift(dx<0 ? 1 : -1) }
    pointer.current=null
  }
  return <section ref={root} className="shop-editions" role="region" aria-roledescription="carousel" aria-label="Festive editions"
    onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true) }} onPointerLeave={() => { setHovered(false); pointer.current=null }}
    onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}
    onPointerDown={event => { swiped.current=false; if (event.button === 0 && !event.target.closest('button')) pointer.current={x:event.clientX,y:event.clientY} }}
    onPointerUp={endPointer} onPointerCancel={() => { pointer.current=null }}
    onDragStart={event => event.preventDefault()}
    onClickCapture={event => { if (swiped.current) { event.preventDefault(); event.stopPropagation(); swiped.current=false } }}>
    <div className="shop-editions__stage" aria-live={paused || focused || reducedMotion ? 'polite' : 'off'}>
      {slides.map((slide,index) => {
        const photo = slide.product.gallery[0]
        const failure = failures[index] || 0
        const image = failure === 1 ? photo.fallback : photo
        return <div className={`shop-editions__slide ${selected === index ? 'is-active' : ''}`} key={slide.product.id}
          role="group" aria-roledescription="slide" aria-label={`${index+1} of ${slides.length}: ${slide.product.name}`} aria-hidden={selected !== index} inert={selected !== index}>
          <div className="shop-editions__copy"><span className="livora-kicker">{slide.kicker}</span><h1>{slide.title}<br /><em>{slide.emphasis}</em></h1><p>{slide.description}</p><Link to={`/product/${slide.product.handle}`} className="livora-btn livora-btn--gold">{slide.cta}<ArrowRight size={17} /></Link><span className="shop-editions__detail">{slide.detail} · {slide.product.price}</span></div>
          <Link to={`/product/${slide.product.handle}`} className="shop-editions__image" aria-label={`Explore ${slide.product.name}`}>
            {failure < 2 ? <img src={image.src} srcSet={`${image.thumbnail} 600w, ${image.src} ${image.width}w`} width={image.width} height={image.height}
              sizes="(min-width:1512px) 650px, (min-width:960px) 46vw, calc(100vw - 40px)" alt={image.caption || photo.caption}
              loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} draggable={false}
              onError={() => setFailures(previous => ({...previous,[index]:failure === 0 && photo.fallback ? 1 : 2}))} />
              : <span>Explore {slide.product.name}</span>}
          </Link>
        </div>
      })}
    </div>
    <div className="shop-editions__controls"><div className="shop-editions__indicators" aria-label="Choose an edition">{slides.map((slide,index) => <button key={slide.product.id} type="button" aria-label={`Show ${slide.product.name}`} aria-pressed={selected === index} onClick={() => setSelected(index)}><span aria-hidden="true" /></button>)}</div><div className="shop-editions__arrows"><button type="button" aria-label="Previous edition" onClick={() => shift(-1)}><ArrowLeft size={18} /></button><button type="button" aria-label="Next edition" onClick={() => shift(1)}><ArrowRight size={18} /></button>{!reducedMotion && <button type="button" aria-label={paused ? 'Start automatic rotation' : 'Pause automatic rotation'} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={15} /> : <Pause size={15} />}</button>}</div></div>
  </section>
}
