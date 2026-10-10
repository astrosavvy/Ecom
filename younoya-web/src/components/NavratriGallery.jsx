import { useState } from 'react'

export default function NavratriGallery({ photos }) {
  const [selected, setSelected] = useState(0)
  const [failures, setFailures] = useState({})
  const photo = photos[selected]
  const level = failures[photo.id] || 0
  const image = level === 1 ? photo.fallback : photo

  function failed(item, expectedLevel) {
    setFailures(previous => (previous[item.id] || 0) !== expectedLevel ? previous : { ...previous, [item.id]: expectedLevel || !item.fallback ? 2 : 1 })
  }

  return <div className="navratri-gallery">
    <figure>
      <div className="navratri-gallery__stage">
        {level < 2 ? <img
          key={`${photo.id}-${level}`}
          src={image.src}
          className={level === 1 && photo.id === 'closed-box' ? 'navratri-gallery__original-closed' : undefined}
          srcSet={`${image.thumbnail} 600w, ${image.src} ${image.width}w`}
          sizes="(min-width: 1400px) 602px, (min-width: 960px) 48vw, calc(100vw - 40px)"
          alt={photo.caption}
          width={image.width}
          height={image.height}
          fetchPriority="high"
          onError={() => failed(photo, level)}
        /> : <p className="navratri-gallery__unavailable" role="status">This photograph is unavailable. Choose another view below.</p>}
      </div>
      <figcaption>{photo.caption}{photo.styled && <span>Background flowers and idols are styling props and are not included.</span>}</figcaption>
    </figure>
    <div className="navratri-thumbnails" aria-label="Product photographs">
      {photos.map((item, index) => {
        const thumbnail = failures[item.id] === 1 ? item.fallback.thumbnail : item.thumbnail
        return <button key={item.id} type="button" aria-label={item.caption} aria-pressed={selected === index} onClick={() => setSelected(index)}>
          {failures[item.id] !== 2 ? <img src={thumbnail} className={failures[item.id] === 1 && item.id === 'closed-box' ? 'navratri-gallery__original-closed' : undefined} alt="" width="64" height="64" loading="lazy" onError={() => failed(item, failures[item.id] || 0)} /> : <span>{String(index + 1).padStart(2, '0')}</span>}
        </button>
      })}
    </div>
  </div>
}
