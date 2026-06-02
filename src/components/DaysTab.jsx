import { ChevronRight } from 'lucide-react'
import { getDaysBySegment, SEGMENT_LABELS, formatDateShort } from '../data/tripData'

export default function DaysTab({ onViewDay }) {
  const segments = getDaysBySegment()

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>All Days</h1>
        <p>23 days · Seoul · Hokkaido · Kansai · Ulsan</p>
      </div>

      <div className="days-list">
        {segments.map(({ segment, days }) => {
          const { flag, text } = SEGMENT_LABELS[segment]
          return (
            <div key={segment} className="country-section">
              <div className="country-label">
                <span>{flag}</span>
                <span>{text}</span>
              </div>
              {days.map(day => (
                <div key={day.id} className="day-card" onClick={() => onViewDay(day.id)}>
                  <div className={`day-card-header day-header-${day.country}`}>
                    <div className="day-card-header-left">
                      <h3>
                        Day {day.dayNumber} — {day.theme}
                        {day.splitDay && (
                          <span style={{
                            marginLeft: 6,
                            fontSize: 11,
                            background: 'rgba(255,255,255,0.25)',
                            borderRadius: 4,
                            padding: '1px 5px',
                            verticalAlign: 'middle',
                          }}>split day</span>
                        )}
                      </h3>
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
        })}
      </div>
    </div>
  )
}
