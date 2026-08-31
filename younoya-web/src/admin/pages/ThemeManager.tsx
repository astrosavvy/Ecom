import { useState } from "react"

const MOCK_THEMES = [
  { id: '1', name: 'Love & Connection', slug: 'love-connection', category: 'relationship', description: 'Products associated with romantic relationships, partnerships, and emotional bonds.', productCount: 8, icon: '💕' },
  { id: '2', name: 'Career & Growth', slug: 'career-growth', category: 'career', description: 'Products symbolizing professional advancement, ambition, and recognition.', productCount: 6, icon: '📈' },
  { id: '3', name: 'Money & Prosperity', slug: 'money-prosperity', category: 'finance', description: 'Products associated with financial abundance, wealth retention, and opportunity.', productCount: 5, icon: '💰' },
  { id: '4', name: 'Calm & Balance', slug: 'calm-balance', category: 'wellbeing', description: 'Products supporting emotional equilibrium, mindfulness, and inner peace.', productCount: 4, icon: '🧘' },
  { id: '5', name: 'New Beginnings', slug: 'new-beginnings', category: 'growth', description: 'Products symbolizing transformation, fresh starts, and change.', productCount: 3, icon: '🌱' },
  { id: '6', name: 'Confidence', slug: 'confidence', category: 'growth', description: 'Products associated with self-assurance, courage, and personal power.', productCount: 3, icon: '💪' },
  { id: '7', name: 'Focus & Direction', slug: 'focus-direction', category: 'career', description: 'Products supporting clarity, decision-making, and purposeful action.', productCount: 4, icon: '🎯' },
  { id: '8', name: 'Home & Harmony', slug: 'home-harmony', category: 'home_vastu', description: 'Products for creating balanced, positive living spaces.', productCount: 5, icon: '🏠' },
]

export default function ThemeManager() {
  const [themes] = useState(MOCK_THEMES)
  const [showModal, setShowModal] = useState(false)
  const [editTheme, setEditTheme] = useState<any>(null)

  const openModal = (t: any = null) => {
    setEditTheme(t)
    setShowModal(true)
  }

  const closeModal = () => {
    setEditTheme(null)
    setShowModal(false)
  }

  return (
    <div className="ad__page">
      <header className="ad__head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Theme Manager</h1>
          <p>Manage product themes for personalisation and recommendations.</p>
        </div>
        <button className="ad-btn" onClick={() => openModal()} style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid #D4AF37', color: '#D4AF37', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Create New Theme</button>
      </header>

      <div className="ad-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', display: 'grid' }}>
        {themes.map(t => (
          <div className="ad-card" key={t.id} style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', background: 'rgba(8,10,16,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>{t.icon}</span>
              <span className="ad-chip" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', textTransform: 'uppercase' }}>{t.category}</span>
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#F5F0E8' }}>{t.name}</h3>
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '1.5rem', flex: 1 }}>{t.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
              <small style={{ color: '#6B7280' }}>{t.productCount} products</small>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => openModal(t)} style={{ background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>Edit</button>
                <button style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#080A10', padding: '2rem', borderRadius: '8px', border: '1px solid #D4AF37', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>{editTheme ? 'Edit Theme' : 'Create Theme'}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#9CA3AF' }}>
                Theme Name
                <input type="text" className="ad-search" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '4px' }} defaultValue={editTheme?.name} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#9CA3AF' }}>
                Slug
                <input type="text" className="ad-search" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '4px' }} defaultValue={editTheme?.slug} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#9CA3AF' }}>
                Category
                <select className="ad-search" style={{ background: '#080A10', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '4px' }} defaultValue={editTheme?.category}>
                  <option value="relationship">Relationship</option>
                  <option value="career">Career</option>
                  <option value="finance">Finance</option>
                  <option value="wellbeing">Wellbeing</option>
                  <option value="home_vastu">Home Vastu</option>
                  <option value="gifting">Gifting</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="growth">Growth</option>
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#9CA3AF' }}>
                Description
                <textarea className="ad-search" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '4px', minHeight: '100px' }} defaultValue={editTheme?.description} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#9CA3AF' }}>
                Icon (Emoji)
                <input type="text" className="ad-search" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '4px' }} defaultValue={editTheme?.icon} />
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button onClick={closeModal} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={closeModal} style={{ background: '#D4AF37', border: 'none', color: '#000', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
