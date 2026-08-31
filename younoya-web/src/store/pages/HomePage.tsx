import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import * as api from "../../lib/api"
import { useStore } from "../../lib/store"

export default function HomePage() {
  const [products, setProducts] = useState<api.Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<api.Product[]>([])
  const [posts, setPosts] = useState<api.BlogPost[]>([])
  const { addToCart } = useStore()
  const navigate = useNavigate()

  useEffect(() => {
    api.listProducts({ limit: 8 }).then((res) => {
      setProducts(res.products)
      setFeaturedProducts(res.products.slice(0, 4))
    })
    api.listPosts(3, 0).then((res) => setPosts(res.posts))
  }, [])

  return (
    <div className="homepage">
      {/* 1. Hero */}
      <section className="section" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "var(--color-canvas)", backgroundSize: "cover" }}>
        <h1 className="text-display" style={{ textAlign: "center", marginBottom: "1rem" }}>Meaning, Made Personal.</h1>
        <p className="section__subtitle" style={{ textAlign: "center", maxWidth: "600px", marginBottom: "2rem" }}>Discover objects aligned with your cosmic blueprint and personal intentions.</p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to="/products" className="cta-outline">Shop YOUNOYA</Link>
          <Link to="/personalise" className="cta-personal">Build My Toolkit</Link>
        </div>
      </section>

      {/* 2. Discover */}
      <section className="section" style={{ textAlign: "center", padding: "4rem 1rem" }}>
        <h2 className="text-editorial" style={{ fontSize: "2rem", maxWidth: "800px", margin: "0 auto" }}>"We believe every object you interact with should serve your highest good."</h2>
        <hr className="section__divider" style={{ margin: "2rem auto" }} />
      </section>

      {/* 3. Curated Products */}
      <section className="section">
        <h2 className="section__title">Curated Products</h2>
        <div className="product-grid" style={{ display: "flex", overflowX: "auto", gap: "1rem", paddingBottom: "1rem" }}>
          {products.map(p => {
            const price = api.variantPrice(p)
            return (
              <div key={p.id} className="product-card glass-card" style={{ minWidth: "250px" }}>
                <Link to={`/products/${p.handle}`} className="product-card__image-wrap">
                  {p.thumbnail && <img src={p.thumbnail} alt={p.title} className="product-card__image" style={{ width: "100%", height: "auto" }} />}
                  <span className="product-card__badge">Curated</span>
                </Link>
                <div className="product-card__info">
                  <h3 className="product-card__name">{p.title}</h3>
                  <p className="product-card__price">{api.formatINR(price.amount)}</p>
                  <button onClick={() => p.variants?.[0] && addToCart(p.variants[0].id)} className="cta-ghost">Add to Cart</button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 4. Make It Personal */}
      <section className="section" style={{ display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "center" }}>
        <div style={{ flex: "1 1 400px" }}>
          <span className="section__label">Personalise</span>
          <h2 className="section__title">Make It Personal</h2>
          <p className="text-editorial">Discover exactly what you need right now based on your unique astrological profile and current intentions.</p>
          <Link to="/personalise" className="cta-personal" style={{ marginTop: "1rem", display: "inline-block" }}>Build My Toolkit</Link>
        </div>
        <div className="glass-card" style={{ flex: "1 1 400px", padding: "2rem", textAlign: "center" }}>
          <p>Your Cosmic Toolkit Awaits</p>
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="section">
        <h2 className="section__title" style={{ textAlign: "center" }}>How It Works</h2>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center", marginTop: "2rem" }}>
          {[
            { step: "01", title: "Share Details", desc: "Tell us a bit about yourself or the recipient." },
            { step: "02", title: "Set Intentions", desc: "Choose what you want to manifest or support." },
            { step: "03", title: "Receive Insights", desc: "Get a curated selection of objects aligned with the stars." }
          ].map(s => (
            <div key={s.step} className="glass-card" style={{ padding: "2rem", maxWidth: "300px", textAlign: "center" }}>
              <h3 className="text-h2" style={{ color: "var(--color-gold)" }}>{s.step}</h3>
              <h4 className="text-h2">{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Explore by Intention */}
      <section className="section">
        <h2 className="section__title" style={{ textAlign: "center" }}>Explore by Intention</h2>
        <div className="intention-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginTop: "2rem" }}>
          {["Love", "Career", "Money", "Calm", "New Beginnings", "Confidence", "Focus", "Gifting"].map(intent => (
            <div key={intent} className="intention-card glass-card" style={{ padding: "1.5rem", textAlign: "center", cursor: "pointer" }} onClick={() => navigate("/products")}>
              <div className="intention-card__icon" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✨</div>
              <div className="intention-card__label">{intent}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Featured Products */}
      <section className="section">
        <h2 className="section__title">Featured Pieces</h2>
        <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "2rem" }}>
          {featuredProducts.map(p => {
            const price = api.variantPrice(p)
            return (
              <div key={p.id} className="product-card glass-card">
                <Link to={`/products/${p.handle}`} className="product-card__image-wrap">
                  {p.thumbnail && <img src={p.thumbnail} alt={p.title} className="product-card__image" style={{ width: "100%", height: "auto" }} />}
                </Link>
                <div className="product-card__info">
                  <h3 className="product-card__name">{p.title}</h3>
                  <p className="product-card__price">{api.formatINR(price.amount)}</p>
                  <button onClick={() => p.variants?.[0] && addToCart(p.variants[0].id)} className="cta-ghost">Add to Cart</button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 8. Personalised Gifting CTA */}
      <section className="section personal-banner" style={{ textAlign: "center", padding: "4rem 1rem", marginTop: "4rem", marginBottom: "4rem" }}>
        <div className="personal-banner__icon" style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎁</div>
        <h2 className="personal-banner__title text-h1">The Perfect Gift</h2>
        <p className="personal-banner__text section__subtitle" style={{ maxWidth: "600px", margin: "0 auto 2rem" }}>Give a gift that speaks to their soul. Build a personalised toolkit based on their astrological profile.</p>
        <Link to="/personalise" className="cta-personal">Start Gifting</Link>
      </section>

      {/* 9. Journal */}
      <section className="section">
        <h2 className="section__title" style={{ textAlign: "center", marginBottom: "2rem" }}>Journal</h2>
        <div className="journal-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
          {posts.map(post => (
            <Link to={`/journal/${post.slug}`} key={post.id} className="journal-card glass-card">
              {post.cover_image && <img src={post.cover_image} alt={post.title} className="journal-card__image" style={{ width: "100%", height: "200px", objectFit: "cover" }} />}
              <div style={{ padding: "1.5rem" }}>
                <div className="journal-card__meta" style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span className="journal-card__category">Astrology</span>
                  <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}</span>
                </div>
                <h3 className="journal-card__title text-h2" style={{ marginBottom: "1rem" }}>{post.title}</h3>
                <p className="journal-card__excerpt" style={{ color: "var(--color-muted)" }}>{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link to="/journal" className="cta-outline">View All Posts</Link>
        </div>
      </section>

      {/* 10. Final CTA */}
      <section className="section" style={{ textAlign: "center", padding: "6rem 1rem", borderTop: "1px solid var(--color-glass-border)", marginTop: "4rem" }}>
        <h2 className="text-display" style={{ marginBottom: "2rem" }}>Ready to Discover?</h2>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link to="/products" className="cta-outline">Shop Collection</Link>
          <Link to="/personalise" className="cta-personal">Build My Toolkit</Link>
        </div>
      </section>
    </div>
  )
}
