import { useState } from "react"

const MOCK_PRODUCTS = [
  { id: '1', name: 'Running Horses Sculpture' },
  { id: '2', name: 'Rose Quartz Mandarin Ducks' },
  { id: '3', name: 'Citrine Wealth Bowl' },
  { id: '4', name: 'Fluorite Butterfly' },
]

export default function ProductMetadata() {
  const [selectedProduct, setSelectedProduct] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'editorial' | 'themes' | 'details' | 'seo'>('editorial')

  return (
    <div className="ad__page">
      <header className="ad__head">
        <h1>Product Metadata Editor</h1>
        <p>Extended product editing for themes, editorial story, and SEO.</p>
      </header>

      <div style={{ marginBottom: '2rem' }}>
        <select 
          className="ad-search" 
          style={{ width: '100%', maxWidth: '400px', background: '#080A10', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '0.75rem', borderRadius: '4px' }}
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">-- Select a Product --</option>
          {MOCK_PRODUCTS.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {selectedProduct && (
        <div style={{ background: 'rgba(8,10,16,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', overflowX: 'auto' }}>
            {(['editorial', 'themes', 'details', 'seo'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ 
                  flex: 1, 
                  background: activeTab === tab ? 'transparent' : 'rgba(0,0,0,0.2)', 
                  border: 'none', 
                  borderBottom: activeTab === tab ? '2px solid #D4AF37' : '2px solid transparent',
                  color: activeTab === tab ? '#F5F0E8' : '#9CA3AF', 
                  padding: '1rem', 
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  fontWeight: activeTab === tab ? 'bold' : 'normal',
                  minWidth: '100px'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ padding: '2rem' }}>
            {activeTab === 'editorial' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#9CA3AF' }}>
                  Editorial Story
                  <textarea className="ad-search" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '4px', minHeight: '120px' }} placeholder="Enter the rich backstory of this product..." />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#9CA3AF' }}>
                  Symbolic Significance
                  <textarea className="ad-search" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '4px', minHeight: '120px' }} placeholder="What does this product symbolize in astrology/vastu?" />
                </label>
              </div>
            )}

            {activeTab === 'themes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ color: '#9CA3AF', margin: '0 0 1rem 0' }}>Assign themes and set their relevance priority.</p>
                {['Career & Growth', 'Love & Connection', 'Money & Prosperity', 'Calm & Balance', 'Home & Harmony'].map(theme => (
                  <div key={theme} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
                    <input type="checkbox" style={{ width: '16px', height: '16px' }} />
                    <span style={{ color: '#F5F0E8', flex: 1 }}>{theme}</span>
                    <select className="ad-search" style={{ background: '#080A10', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'details' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#9CA3AF' }}>
                  Materials
                  <input type="text" className="ad-search" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '4px' }} placeholder="e.g. Natural Rose Quartz, Brass" />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#9CA3AF' }}>
                  Dimensions
                  <input type="text" className="ad-search" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '4px' }} placeholder="e.g. 5 x 3 x 4 inches" />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#9CA3AF' }}>
                  Care Instructions
                  <textarea className="ad-search" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '4px', minHeight: '80px' }} placeholder="How to clean and care for this item..." />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#9CA3AF' }}>
                  Suitable For (Tags)
                  <input type="text" className="ad-search" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '4px' }} placeholder="e.g. Living Room, Office, Gift, Couple" />
                </label>
              </div>
            )}

            {activeTab === 'seo' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#9CA3AF' }}>
                  SEO Title
                  <input type="text" className="ad-search" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '4px' }} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#9CA3AF' }}>
                  URL Slug
                  <input type="text" className="ad-search" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '4px' }} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#9CA3AF' }}>
                  Meta Description
                  <textarea className="ad-search" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '4px', minHeight: '80px' }} />
                </label>
              </div>
            )}
            
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button style={{ background: '#D4AF37', border: 'none', color: '#000', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
