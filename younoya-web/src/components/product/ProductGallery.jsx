import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function ProductGallery({ 
  product, 
  images, 
  activeImage, 
  onSelectImage, 
  onShiftImage, 
  reducedMotion 
}) {
  const currentImage = images[activeImage] || images[0]

  return (
    <div className="livora-gallery">
      <div className="livora-gallery__main">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={currentImage}
            src={currentImage}
            alt={`${product.name} view ${activeImage + 1}`}
            className="livora-gallery__image"
            initial={reducedMotion ? false : { opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25 }}
            fetchPriority="high"
          />
        </AnimatePresence>

        <div className="livora-gallery__tag">
          <span>YOUNOYA • OBJECT {product.chapter}</span>
          <span>{String(activeImage + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
        </div>

        {images.length > 1 && (
          <div className="livora-gallery__controls">
            <button type="button" onClick={() => onShiftImage(-1)} aria-label="Previous view">
              <ChevronLeft size={20} />
            </button>
            <button type="button" onClick={() => onShiftImage(1)} aria-label="Next view">
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="livora-gallery__thumbs">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              className={`livora-gallery__thumb ${activeImage === idx ? 'is-active' : ''}`}
              onClick={() => onSelectImage(idx)}
              aria-label={`View photo ${idx + 1}`}
            >
              <img src={img} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
