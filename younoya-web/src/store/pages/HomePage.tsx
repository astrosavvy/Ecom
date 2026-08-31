import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import * as api from "../../lib/api"
import { useStore } from "../../lib/store"
import HeroCinematic from "./HeroCinematic"

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
      <HeroCinematic />

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
        </div>
        <div className="glass-card" style={{ flex: "1 1 400px", padding: "2rem", textAlign: "center" }}>
          <p>Your Cosmic Toolkit Awaits</p>
        </div>
      </section>

      {/* 5. Explore by Intention */}
      <section className="section" style={{ background: '#FFFBF0', borderRadius: '24px', padding: '48px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto' }}>
          <span className="section__label" style={{ display: 'block', marginBottom: '10px' }}>Curated by meaning</span>
          <h2 className="section__title" style={{ textAlign: "center", color: '#1a1a1e', fontFamily: 'var(--yn-font-display)', fontWeight: 600 }}>Explore by Intention</h2>
          <p className="text-editorial" style={{ textAlign: 'center', marginTop: '10px', color: '#6b645c', fontSize: '14px' }}>Not by category — by what you want to invite. Tap an intention, see the objects that hold it.</p>
        </div>
        <div className="intention-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(148px, 1fr))", gap: "14px", marginTop: "28px" }}>
          {[
            { label: "Love", letter: "L" },
            { label: "Career", letter: "C" },
            { label: "Money", letter: "M" },
            { label: "Calm", letter: "C" },
            { label: "New Beginnings", letter: "N" },
            { label: "Confidence", letter: "C" },
            { label: "Focus", letter: "F" },
            { label: "Gifting", letter: "G" },
          ].map(intent => (
            <div key={intent.label} className="intention-card" style={{ padding: "18px 14px", textAlign: "center", cursor: "pointer", background: "#fff", border: "1px solid rgba(212,175,55,0.18)", borderRadius: "16px", boxShadow: "0 6px 18px -14px rgba(0,0,0,0.18)", transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s" }} onClick={() => navigate("/shop")} onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,175,55,0.42)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)' }} onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,175,55,0.18)'; (e.currentTarget as HTMLDivElement).style.transform = 'none' }}>
              <div className="intention-card__icon" style={{ width: "38px", height: "38px", borderRadius: "50%", display: "grid", placeItems: "center", margin: "0 auto 10px", background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.22)", fontFamily: "var(--yn-font-display)", fontWeight: 600, fontSize: "14px", color: "var(--yn-gold-strong)", letterSpacing: "0.04em" }}>{intent.letter}</div>
              <div className="intention-card__label" style={{ fontFamily: "var(--yn-font-label)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#1e1c16" }}>{intent.label}</div>
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

      {/* 8. The Perfect Gift — high contrast midnight card */}
      <section className="section" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="personal-banner" style={{ textAlign: "center", padding: "56px 28px", background: "#0B0E18", border: "1px solid rgba(212,175,55,0.22)", borderRadius: "24px", boxShadow: "0 18px 48px -24px rgba(0,0,0,0.55)", position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(212,175,55,0.10), transparent 62%)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <span style={{ display: "inline-block", fontFamily: "var(--yn-font-label)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--yn-gold)", border: "1px solid rgba(212,175,55,0.22)", background: "rgba(212,175,55,0.08)", padding: "6px 14px", borderRadius: "999px", marginBottom: "16px" }}>Editor&apos;s pick</span>
            <h2 className="personal-banner__title" style={{ fontFamily: "var(--yn-font-display)", fontWeight: 600, fontSize: "clamp(28px, 3.6vw, 38px)", lineHeight: 1.1, color: "#fff", letterSpacing: "-0.01em", margin: 0 }}>The Perfect Gift</h2>
            <p className="personal-banner__text" style={{ maxWidth: "560px", margin: "12px auto 0", fontFamily: "var(--yn-font-body)", fontSize: "15px", lineHeight: 1.65, color: "rgba(245,237,224,0.82)" }}>Give a gift that speaks to their soul. Curated by intention and chart — not by shelf. A personalised selection, made to be kept.</p>
            <Link to="/shop" className="cta-personal" style={{ marginTop: "22px", background: "var(--yn-gold)", color: "#0B0E18", padding: "12px 26px" }}>Explore Gifts</Link>
            <p style={{ marginTop: "10px", fontFamily: "var(--yn-font-label)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(245,237,224,0.45)" }}>No generic. Only personal.</p>
          </div>
        </div>
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
          <Link to="/shop" className="cta-personal">Shop Collection</Link>
        </div>
      </section>
    </div>
  )
}
