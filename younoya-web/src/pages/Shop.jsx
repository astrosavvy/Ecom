import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { PRODUCTS } from '../data/products'
import '../styles/Shop.css'

export default function Shop() {
  return (
    <section className="shop-page" aria-labelledby="shop-title">
      <header className="shop-heading">
        <Link to="/" className="shop-back">Younoya / The atelier</Link>
        <span className="shop-eyebrow">THE COMPLETE COLLECTION</span>
        <h1 id="shop-title">For every person.<br /><em>For every chapter.</em></h1>
        <p>Explore our collection of meaningful keepsakes, chosen with intention and guided by astrological insight.</p>
      </header>
      <div className="shop-collection-label"><h2>All products</h2><span>{PRODUCTS.length} keepsakes</span></div>
      <div className="shop-grid">
        {PRODUCTS.map((product, index) => (
          <Link key={product.id} className="shop-product" to={`/product/${product.handle}`} aria-label={`View ${product.name}`}>
            <div className="shop-product__image">
              <img src={product.primaryImage} alt={product.name} loading={index < 3 ? 'eager' : 'lazy'} />
              <span>{product.badge}</span>
              <i aria-hidden="true"><ArrowUpRight size={19} strokeWidth={1.5} /></i>
            </div>
            <div className="shop-product__details">
              <h3>{product.name}</h3>
              <p>{product.tagline}</p>
              <span className="shop-product__price">{product.price}</span>
            </div>
          </Link>
        ))}
      </div>
      <footer className="shop-footer"><span>YOUNOYA / FOR EVERY CHAPTER</span><Link to="/">Return to the story <ArrowUpRight size={15} /></Link></footer>
    </section>
  )
}
