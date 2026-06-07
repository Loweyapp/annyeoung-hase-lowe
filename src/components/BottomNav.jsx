import { Calendar, CalendarDays, Hotel, Map, Luggage } from 'lucide-react'

const TABS = [
  { id: 'today', label: 'Today', Icon: Calendar },
  { id: 'days', label: 'Days', Icon: CalendarDays },
  { id: 'hotels', label: 'Hotels', Icon: Hotel },
  { id: 'map', label: 'Map', Icon: Map },
  { id: 'pack', label: 'Pack', Icon: Luggage },
]

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="bottom-nav">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`nav-item ${activeTab === id ? 'active' : ''}`}
          onClick={() => onTabChange(id)}
          aria-label={label}
        >
          <Icon size={22} strokeWidth={activeTab === id ? 2.5 : 1.8} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
