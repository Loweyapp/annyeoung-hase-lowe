import { useState, useEffect } from 'react'

const CATEGORIES = [
  {
    id: 'docs',
    label: 'Documents & Money',
    icon: '📄',
    items: [
      { id: 'passport', text: 'Passport (valid 6+ months)' },
      { id: 'travel-insurance', text: 'Travel insurance docs' },
      { id: 'flight-confirmations', text: 'Flight confirmations printed/saved offline' },
      { id: 'hotel-confirmations', text: 'Hotel confirmations' },
      { id: 'cash-krw', text: 'Korean Won (KRW) cash' },
      { id: 'cash-jpy', text: 'Japanese Yen (JPY) cash' },
      { id: 'credit-card', text: 'Credit card (no foreign fees)' },
      { id: 'tmoney', text: 'T-money card (Seoul transit)' },
      { id: 'icoca', text: 'IC card for Japan transit' },
      { id: 'emergency-contacts', text: 'Emergency contacts written down' },
    ],
  },
  {
    id: 'tech',
    label: 'Tech & Power',
    icon: '🔌',
    items: [
      { id: 'phone-charger', text: 'Phone charger' },
      { id: 'power-bank', text: 'Power bank' },
      { id: 'adapter', text: 'Universal travel adapter (Type C/A)' },
      { id: 'earphones', text: 'Earphones / AirPods' },
      { id: 'offline-maps', text: 'Offline maps downloaded (Seoul, Sapporo, Osaka)' },
      { id: 'esim', text: 'eSIM / SIM card sorted' },
      { id: 'camera', text: 'Camera + memory card' },
    ],
  },
  {
    id: 'clothes',
    label: 'Clothes',
    icon: '👕',
    items: [
      { id: 't-shirts', text: 'T-shirts (lightweight)' },
      { id: 'shirts', text: 'Shirts / smart casual' },
      { id: 'shorts', text: 'Shorts' },
      { id: 'trousers', text: 'Trousers / jeans' },
      { id: 'underwear', text: 'Underwear' },
      { id: 'socks', text: 'Socks (easy-off for temples)' },
      { id: 'light-jacket', text: 'Light jacket / hoodie' },
      { id: 'rain-layer', text: 'Rain layer (Jun–Jul is rainy season)' },
      { id: 'swim-shorts', text: 'Swim shorts' },
      { id: 'pjs', text: 'Pyjamas' },
      { id: 'smart-shoes', text: 'Smart shoes' },
      { id: 'comfy-shoes', text: 'Comfortable walking shoes' },
      { id: 'flip-flops', text: 'Flip flops' },
    ],
  },
  {
    id: 'toiletries',
    label: 'Toiletries',
    icon: '🧴',
    items: [
      { id: 'toothbrush', text: 'Toothbrush & toothpaste' },
      { id: 'deodorant', text: 'Deodorant' },
      { id: 'shampoo', text: 'Shampoo / conditioner' },
      { id: 'sunscreen', text: 'Sunscreen SPF 50' },
      { id: 'razor', text: 'Razor' },
      { id: 'moisturiser', text: 'Moisturiser' },
      { id: 'lip-balm', text: 'Lip balm' },
      { id: 'hand-sanitiser', text: 'Hand sanitiser' },
    ],
  },
  {
    id: 'health',
    label: 'Health & Meds',
    icon: '💊',
    items: [
      { id: 'prescription', text: 'Prescription medication (enough supply)' },
      { id: 'paracetamol', text: 'Paracetamol / ibuprofen' },
      { id: 'antihistamine', text: 'Antihistamine' },
      { id: 'immodium', text: 'Imodium / rehydration sachets' },
      { id: 'plasters', text: 'Plasters & blister pads' },
      { id: 'eye-drops', text: 'Eye drops' },
    ],
  },
  {
    id: 'misc',
    label: 'Miscellaneous',
    icon: '🎒',
    items: [
      { id: 'day-bag', text: 'Day bag / small backpack' },
      { id: 'reusable-bag', text: 'Reusable shopping bag' },
      { id: 'travel-pillow', text: 'Travel pillow (long flights)' },
      { id: 'eye-mask', text: 'Eye mask & ear plugs' },
      { id: 'padlock', text: 'Small padlock (for lockers)' },
      { id: 'umbrella', text: 'Compact umbrella' },
      { id: 'chopsticks', text: 'Chopstick skills practised 😅' },
    ],
  },
]

const STORAGE_KEY = 'packing-checked'

export default function PackTab() {
  const [checked, setChecked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
    } catch { return {} }
  })
  const [expanded, setExpanded] = useState(() => {
    const init = {}
    CATEGORIES.forEach(c => { init[c.id] = true })
    return init
  })
  const [showOnlyUnchecked, setShowOnlyUnchecked] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked))
  }, [checked])

  function toggle(id) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function toggleCategory(catId) {
    setExpanded(prev => ({ ...prev, [catId]: !prev[catId] }))
  }

  function resetAll() {
    if (confirm('Clear all checks?')) setChecked({})
  }

  const totalItems = CATEGORIES.reduce((n, c) => n + c.items.length, 0)
  const checkedCount = Object.values(checked).filter(Boolean).length
  const pct = Math.round((checkedCount / totalItems) * 100)

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="today-hero" style={{ paddingBottom: 24 }}>
        <span className="trip-emoji">🎒</span>
        <h1>Packing List</h1>
        <p className="subtitle">{checkedCount} / {totalItems} packed</p>

        {/* Progress bar */}
        <div style={{ width: '100%', maxWidth: 280, margin: '12px auto 0', background: 'rgba(255,255,255,0.2)', borderRadius: 8, height: 8, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? '#4ADE80' : '#E9C46A', borderRadius: 8, transition: 'width 0.3s' }} />
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>
          {pct === 100 ? '✅ All packed — bon voyage!' : `${pct}% packed`}
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 16px', alignItems: 'center' }}>
        <button
          className={`filter-chip ${showOnlyUnchecked ? 'active' : ''}`}
          onClick={() => setShowOnlyUnchecked(v => !v)}
        >
          Show missing only
        </button>
        <button
          className="filter-chip"
          onClick={resetAll}
          style={{ marginLeft: 'auto', color: '#EF4444' }}
        >
          Reset
        </button>
      </div>

      {/* Categories */}
      <div style={{ padding: '0 16px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CATEGORIES.map(cat => {
          const catChecked = cat.items.filter(i => checked[i.id]).length
          const visibleItems = showOnlyUnchecked ? cat.items.filter(i => !checked[i.id]) : cat.items
          if (showOnlyUnchecked && visibleItems.length === 0) return null

          return (
            <div key={cat.id} className="card" style={{ overflow: 'hidden', padding: 0 }}>
              {/* Category header */}
              <button
                onClick={() => toggleCategory(cat.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: expanded[cat.id] ? '1px solid #E5E7EB' : 'none',
                }}
              >
                <span style={{ fontSize: 20 }}>{cat.icon}</span>
                <span style={{ fontWeight: 700, fontSize: 15, flex: 1, textAlign: 'left' }}>{cat.label}</span>
                <span style={{ fontSize: 12, color: catChecked === cat.items.length ? '#16A34A' : '#6B7280', fontWeight: 600 }}>
                  {catChecked}/{cat.items.length}
                </span>
                <span style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 6 }}>
                  {expanded[cat.id] ? '▲' : '▼'}
                </span>
              </button>

              {/* Items */}
              {expanded[cat.id] && (
                <div>
                  {visibleItems.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => toggle(item.id)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer',
                        borderBottom: idx < visibleItems.length - 1 ? '1px solid #F3F4F6' : 'none',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{
                        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                        border: checked[item.id] ? 'none' : '2px solid #D1D5DB',
                        background: checked[item.id] ? '#16A34A' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}>
                        {checked[item.id] && <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>✓</span>}
                      </div>
                      <span style={{
                        fontSize: 14, color: checked[item.id] ? '#9CA3AF' : '#1A1A2E',
                        textDecoration: checked[item.id] ? 'line-through' : 'none',
                        transition: 'all 0.15s',
                      }}>
                        {item.text}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
