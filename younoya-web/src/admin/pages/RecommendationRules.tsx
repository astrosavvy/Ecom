import { useState } from "react"

const MOCK_RULES = [
  { id: '1', name: 'Aries Career', conditions: { rashi: 'Mesha', theme: 'Career' }, products: [{ name: 'Running Horses', priority: 'high' }, { name: 'Fluorite Butterfly', priority: 'medium' }], active: true },
  { id: '2', name: 'Venus Dasha Love', conditions: { dasha: 'Venus', theme: 'Relationship' }, products: [{ name: 'Rose Quartz Ducks', priority: 'high' }, { name: 'Scented Candle', priority: 'medium' }], active: true },
  { id: '3', name: 'Saturn Dasha Finance', conditions: { dasha: 'Saturn', theme: 'Finance' }, products: [{ name: 'Pyrite Keychain', priority: 'high' }, { name: 'Citrine Bowl', priority: 'medium' }], active: false },
]

export default function RecommendationRules() {
  const [rules] = useState(MOCK_RULES)
  const [showModal, setShowModal] = useState(false)
  const [editRule, setEditRule] = useState<any>(null)

  const openModal = (r: any = null) => {
    setEditRule(r)
    setShowModal(true)
  }

  return (
    <div className="ad__page">
      <header className="ad__head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Recommendation Rules</h1>
          <p>Visual rule builder for the recommendation engine.</p>
        </div>
        <button className="ad-btn" onClick={() => openModal()} style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid #D4AF37', color: '#D4AF37', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Create New Rule</button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {rules.map(r => (
          <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(8,10,16,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, color: '#F5F0E8' }}>{r.name}</h3>
                <span className={`ad-chip ${r.active ? 'ad-chip--ok' : 'ad-chip--mut'}`}>{r.active ? 'Active' : 'Inactive'}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {Object.entries(r.conditions).map(([k, v]) => (
                  <span key={k} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: '#9CA3AF' }}>{k}: {v}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {r.products.map((p, i) => (
                  <span key={i} style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    <span style={{ color: p.priority === 'high' ? '#D4AF37' : '#9CA3AF' }}>■</span> {p.name}
                  </span>
                ))}
              </div>
            </div>
            <button onClick={() => openModal(r)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#080A10', padding: '2rem', borderRadius: '8px', border: '1px solid #D4AF37', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>{editRule ? 'Edit Rule' : 'Create Rule'}</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#9CA3AF' }}>
                Rule Name
                <input type="text" className="ad-search" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '4px' }} defaultValue={editRule?.name} />
              </label>
              
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#F5F0E8' }}>Conditions</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: '#9CA3AF' }}>
                    <span style={{ width: '60px' }}>IF Rashi</span>
                    <select className="ad-search" style={{ flex: 1, background: '#080A10', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.5rem', borderRadius: '4px' }} defaultValue={editRule?.conditions?.rashi}>
                      <option value="">Any</option>
                      <option value="Mesha">Mesha (Aries)</option>
                      <option value="Vrishabha">Vrishabha (Taurus)</option>
                      <option value="Mithuna">Mithuna (Gemini)</option>
                    </select>
                  </label>
                  <label style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: '#9CA3AF' }}>
                    <span style={{ width: '60px' }}>AND Dasha</span>
                    <select className="ad-search" style={{ flex: 1, background: '#080A10', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.5rem', borderRadius: '4px' }} defaultValue={editRule?.conditions?.dasha}>
                      <option value="">Any</option>
                      <option value="Sun">Sun</option>
                      <option value="Moon">Moon</option>
                      <option value="Venus">Venus</option>
                      <option value="Saturn">Saturn</option>
                    </select>
                  </label>
                  <label style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: '#9CA3AF' }}>
                    <span style={{ width: '60px' }}>THEN Theme</span>
                    <select className="ad-search" style={{ flex: 1, background: '#080A10', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.5rem', borderRadius: '4px' }} defaultValue={editRule?.conditions?.theme}>
                      <option value="">Any</option>
                      <option value="Career">Career & Growth</option>
                      <option value="Relationship">Love & Connection</option>
                      <option value="Finance">Money & Prosperity</option>
                    </select>
                  </label>
                </div>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#F5F0E8' }}>Product Assignments</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {editRule?.products?.map((p: any, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                      <input type="text" className="ad-search" style={{ flex: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.5rem', borderRadius: '4px' }} defaultValue={p.name} />
                      <select className="ad-search" style={{ flex: 1, background: '#080A10', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.5rem', borderRadius: '4px' }} defaultValue={p.priority}>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  ))}
                  <button style={{ alignSelf: 'flex-start', marginTop: '0.5rem', background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)', color: '#9CA3AF', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>+ Add Product</button>
                </div>
              </div>

              <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#F5F0E8', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked={editRule ? editRule.active : true} />
                Rule is active
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => setShowModal(false)} style={{ background: '#D4AF37', border: 'none', color: '#000', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
