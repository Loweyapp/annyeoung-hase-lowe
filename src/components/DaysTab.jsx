import { ChevronRight } from 'lucide-react'
import { TRIP, formatDateShort } from '../data/tripData'

export default function DaysTab({ onViewDay }) {
  const koreaDays = TRIP.days.filter(d => d.country === 'korea')
  const japanDays = TRIP.days.filter(d => d.country === 'japan')

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>All Days</h1>
        <p>11 days · Seoul, Tokyo, Kyoto</p>
      </div>

      <div className="days-list">
        <CountrySection
          country="korea"
          flag="🇰🇷"
          label="South Korea"
          days={koreaDays}
          onViewDay={onViewDay}
        />
        <CountrySection
          country="japan"
          flag="🇯🇵"
          label="Japan"
          days={japanDays}
          onViewDay={onViewDay}
        />
      </div>
    </div>
  )
}

function CountrySection({ country, flag, label, days, onViewDay }) {
  return (
    <div className="country-section">
      <div className="country-label">
        <span>{flag}</span>
        <span>{label}</span>
      </div>
      {days.map(day => (
        <div key={day.id} className="day-card" onClick={() => onViewDay(day.id)}>
          <div className={`day-card-header day-header-${country}`}>
            <div className="day-card-header-left">
              <h3>Day {day.dayNumber} — {day.theme}</h3>
              <p>{formatDateShort(day.date)} · {day.city}</p>
            </div>
            <ChevronRight size={18} color="rgba(255,255,255,0.7)" />
          </div>
          <div className="day-card-body">
            <div className="activity-pills">
              {day.activities.map(a => (
                <span key={a.id} className="activity-pill" title={a.name}>{a.icon}</span>
              ))}
            </div>
            <span style={{ fontSize: 12, color: '#9CA3AF', flexShrink: 0, marginLeft: 8 }}>
              {day.activities.length} stops
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
