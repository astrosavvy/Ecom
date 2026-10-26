import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowDown, ArrowRight, Share2, Compass, Sparkles } from 'lucide-react'
import { getRevealEdition, getRevealShareData } from '../lib/giftReveal.js'
import SocialShareModal from '../components/gift-guide/SocialShareModal'
import '../styles/GiftReveal.css'

function ObjectImage({ item, hero = false }) {
  const [failed, setFailed] = useState(false)
  if (!item?.media) return null
  const media = item.media
  return <figure className={`gift-reveal__figure${hero ? ' gift-reveal__figure--hero' : ''}`}>
    <div className={`gift-reveal__image gift-reveal__image--${media.type}`}>
      {failed ? <span className="gift-reveal__image-error">Photograph unavailable</span> : <img
        src={media.src} srcSet={media.srcSet} sizes={hero ? '(min-width: 1440px) 650px, (min-width: 768px) 54vw, 100vw' : '(min-width: 768px) 45vw, 100vw'}
        width={media.width} height={media.height} alt={media.alt}
        loading={hero ? 'eager' : 'lazy'} fetchPriority={hero ? 'high' : 'auto'}
        onError={() => setFailed(true)} />}
    </div>
    <figcaption>{item.name}<span>{failed ? 'Image unavailable' : media.caption}</span></figcaption>
  </figure>
}

export default function GiftReveal() {
  const { category, rashi } = useParams()
  const [searchParams] = useSearchParams()
  const dasha = searchParams.get('dasha')
  const exp = searchParams.get('exp')

  const edition = getRevealEdition(category, rashi, { dasha, experience: exp })
  const [sharing, setSharing] = useState(false)
  useEffect(() => { setSharing(false) }, [category, rashi, dasha, exp])

  if (edition.status !== 'ready') return <article className="gift-reveal gift-reveal--unavailable">
    <p className="gift-reveal__eyebrow">Younoya · Gift editions</p>
    <h1>This gift guide is unavailable.</h1>
    <p>Please check the link on your gift, or get in touch and we’ll help you find the right edition.</p>
    <div className="gift-reveal__unavailable-links"><Link to="/shop">Explore the collection <ArrowRight size={16} /></Link><Link to="/contact">Contact Younoya</Link></div>
  </article>

  if (edition.isDashaEdition) {
    return <article className="gift-reveal gift-reveal--dasha" aria-labelledby="gift-edition-title" data-edition={edition.key}>
      <div className="gift-reveal__container">
        <p className="gift-reveal__eyebrow">The gift editions <span aria-hidden="true">/</span> Taurus Moon · {edition.dasha} Dasha</p>
        <div className="gift-reveal__hero">
          <header className="gift-reveal__identity">
            <p className="gift-reveal__sign">{edition.rashi.name} <span aria-hidden="true">·</span> {edition.rashi.sanskrit} · {edition.dasha} Chapter</p>
            <h1 id="gift-edition-title">{edition.title}</h1>
            {edition.productsSummary && <p className="gift-reveal__edition-note">{edition.productsSummary}</p>}
          </header>
          {edition.heroItem && <ObjectImage key={edition.heroItem?.media?.src} item={edition.heroItem} hero />}
          <div className="gift-reveal__welcome">
            <p className="gift-reveal__intro">{edition.intro}</p>
            <a className="gift-reveal__text-link" href="#edition-pieces">Explore your gift <ArrowDown size={17} aria-hidden="true" /></a>
            <p className="gift-reveal__edition-note">Curated celestial unboxing for {edition.rashi.name}.</p>
          </div>
        </div>

        <section className="gift-reveal__chapter" aria-labelledby="gift-chapter-title">
          <div>
            <p className="gift-reveal__eyebrow">{edition.chapterTitle}</p>
            <h2 id="gift-chapter-title">{edition.heading}</h2>
          </div>
          <p>{edition.chapterText}</p>
        </section>

        <section className="gift-reveal__inside-box" aria-labelledby="gift-inside-title">
          <div>
            <p className="gift-reveal__eyebrow">Inside the box</p>
            <h2 id="gift-inside-title">What this gift means</h2>
          </div>
          <div>
            <p>{edition.meaning}</p>
            {edition.intentionStatement && (
              <div className="gift-reveal__intention-block">
                <span className="gift-reveal__intention-badge">
                  <Sparkles size={13} /> {edition.intentionHeading || 'Intention'}
                </span>
                <blockquote className="gift-reveal__statement">
                  “{edition.intentionStatement}”
                </blockquote>
              </div>
            )}
            {edition.contemplationPrompt && (
              <div className="gift-reveal__contemplation">
                <small>A thought to sit with</small>
                <p>{edition.contemplationPrompt}</p>
              </div>
            )}
          </div>
        </section>

        <section className="gift-reveal__pieces" id="edition-pieces" aria-labelledby="gift-pieces-title">
          <div className="gift-reveal__section-head">
            <p className="gift-reveal__eyebrow">A closer look</p>
            <h2 id="gift-pieces-title">The pieces in this edition.</h2>
          </div>
          <div className="gift-reveal__objects">
            {edition.items.map((item, index) => <section className="gift-reveal__object gift-reveal__object--text" key={item.id} aria-labelledby={`object-${item.id}`}>
              <div className="gift-reveal__object-copy">
                <span className="gift-reveal__object-index">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <span className="gift-reveal__role-tag">{item.role}</span>
                  <h3 id={`object-${item.id}`}>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            </section>)}
          </div>
        </section>

        {edition.vastu && (
          <section className="gift-reveal__vastu" aria-labelledby="gift-vastu-title">
            <div>
              <p className="gift-reveal__eyebrow"><Compass size={13} /> Sanctuary Direction (Vastu)</p>
              <h2 id="gift-vastu-title">Sacred placement · {edition.vastu.direction}</h2>
            </div>
            <div>
              <p>{edition.vastu.instructions}</p>
              {edition.vastu.room && <p className="gift-reveal__vastu-room"><strong>Recommended space:</strong> {edition.vastu.room}</p>}
            </div>
          </section>
        )}

        {edition.howToUse && (
          <section className="gift-reveal__how-to-use" aria-labelledby="gift-usage-title">
            <div>
              <p className="gift-reveal__eyebrow">Ritual & care</p>
              <h2 id="gift-usage-title">How to use your keepsake</h2>
            </div>
            <div>
              <p>{edition.howToUse}</p>
            </div>
          </section>
        )}

        {edition.disclaimer && (
          <aside className="gift-reveal__disclaimer" aria-label="Disclaimer">
            <p><strong>Note:</strong> {edition.disclaimer}</p>
          </aside>
        )}

        <section className="gift-reveal__closing" aria-labelledby="gift-closing-title">
          <div>
            <p className="gift-reveal__eyebrow">Keep the note</p>
            <h2 id="gift-closing-title">A thought to return to.</h2>
            <p>Keep this edition close, or share the intention behind it.</p>
          </div>
          <div className="gift-reveal__actions">
            <button type="button" onClick={() => setSharing(true)}><Share2 size={17} />Share this gift</button>
            <Link className="gift-reveal__text-link" to="/find-a-gift?utm_source=unboxing_qr&utm_medium=box_label&utm_campaign=gift_reveal">Choose a gift <ArrowRight size={17} /></Link>
          </div>
        </section>
        <footer className="gift-reveal__footer">
          <p>YOUNOYA <span>For every chapter.</span></p>
          <nav aria-label="Gift guide footer">
            <Link to="/shop">Collection</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/terms-and-conditions">Terms</Link>
            <Link to="/privacy-policy">Privacy</Link>
            <Link to="/shipping-policy">Shipping</Link>
            <Link to="/cancellation-and-refunds">Cancellations & refunds</Link>
          </nav>
        </footer>
      </div>
      {sharing && <SocialShareModal data={getRevealShareData(edition)} presentation="gift" onClose={() => setSharing(false)} />}
    </article>
  }

  return <article className="gift-reveal" aria-labelledby="gift-edition-title" data-edition={edition.key}>
    <div className="gift-reveal__container">
      <p className="gift-reveal__eyebrow">The gift editions <span aria-hidden="true">/</span> {edition.category.label}</p>
      <div className="gift-reveal__hero">
      <header className="gift-reveal__identity">
        <p className="gift-reveal__sign">{edition.rashi.name} <span aria-hidden="true">·</span> {edition.rashi.sanskrit}</p>
        <h1 id="gift-edition-title">{edition.title}</h1>
      </header>
        <ObjectImage key={edition.heroItem?.media?.src} item={edition.heroItem} hero />
        <div className="gift-reveal__welcome">
          <p className="gift-reveal__intro">{edition.intro}</p>
          <a className="gift-reveal__text-link" href="#edition-pieces">Explore your gift <ArrowDown size={17} aria-hidden="true" /></a>
          <p className="gift-reveal__edition-note">An edition for {edition.category.label.toLowerCase()}.</p>
        </div>
      </div>
      <section className="gift-reveal__meaning" aria-labelledby="gift-meaning-title">
        <div><p className="gift-reveal__eyebrow">The meaning behind the selection</p><h2 id="gift-meaning-title">{edition.heading}</h2></div>
        <p>{edition.meaning}</p>
      </section>
      <section className="gift-reveal__pieces" id="edition-pieces" aria-labelledby="gift-pieces-title">
        <div className="gift-reveal__section-head"><p className="gift-reveal__eyebrow">A closer look</p><h2 id="gift-pieces-title">The pieces in this edition.</h2></div>
        <div className="gift-reveal__objects">{edition.items.map((item, index) => <section className={`gift-reveal__object${!item.media ? ' gift-reveal__object--text' : ''}`} key={item.id} aria-labelledby={`object-${item.id}`}>
          <ObjectImage key={item.media?.src} item={item} />
          <div className="gift-reveal__object-copy"><span className="gift-reveal__object-index">{String(index + 1).padStart(2, '0')}</span><div><h3 id={`object-${item.id}`}>{item.name}</h3><p>{item.description}</p>{item.care && <p className="gift-reveal__care">{item.care}</p>}</div></div>
        </section>)}</div>
      </section>
      <section className="gift-reveal__reflection" aria-labelledby="gift-reflection-title">
        <div><p className="gift-reveal__eyebrow">Make it your own</p><h2 id="gift-reflection-title">A moment with your gift.</h2></div>
        <div><p>Take a moment to notice the forms, colours and textures. Consider which part of the intention feels most useful to you, and choose a place where the keepsake can be part of your day.</p><p className="gift-reveal__intention">{edition.reflection.join(' · ')}</p></div>
      </section>
      <section className="gift-reveal__closing" aria-labelledby="gift-closing-title">
        <div><p className="gift-reveal__eyebrow">Keep the note</p><h2 id="gift-closing-title">A thought to return to.</h2><p>Keep this edition close, or share the intention behind it.</p></div>
        <div className="gift-reveal__actions"><button type="button" onClick={() => setSharing(true)}><Share2 size={17} />Share this gift</button><Link className="gift-reveal__text-link" to="/find-a-gift?utm_source=unboxing_qr&utm_medium=box_label&utm_campaign=gift_reveal">Choose a gift <ArrowRight size={17} /></Link></div>
      </section>
      <footer className="gift-reveal__footer"><p>YOUNOYA <span>For every chapter.</span></p><nav aria-label="Gift guide footer"><Link to="/shop">Collection</Link><Link to="/contact">Contact</Link><Link to="/terms-and-conditions">Terms</Link><Link to="/privacy-policy">Privacy</Link><Link to="/shipping-policy">Shipping</Link><Link to="/cancellation-and-refunds">Cancellations & refunds</Link></nav></footer>
    </div>
    {sharing && <SocialShareModal data={getRevealShareData(edition)} presentation="gift" onClose={() => setSharing(false)} />}
  </article>
}