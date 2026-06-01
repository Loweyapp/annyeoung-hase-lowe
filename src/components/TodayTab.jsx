import { TRIP, getTodayDay, getDaysUntilTrip, isTripOver, formatDate } from '../data/tripData'

export default function TodayTab({ onViewDay }) {
  const todayDay = getTodayDay()
  const daysUntil = getDaysUntilTrip()
  const tripOver = isTripOver()

  const totalActivities = TRIP.days.reduce((n, d) => n + d.activities.length, 0)
  const seoulDays = TRIP.days.filter(d => d.country === 'korea').length
  const japanDays = TRIP.days.filter(d => d.country === 'japan').length

  return (
    <div className="fade-in">
      {/* Hero */}
      <div className="today-hero">
        <span className="trip-emoji">✈️</span>
        <h1>Annyeong Hase-Lowe</h1>
        <p className="subtitle">Korea & Japan — June 2026</p>

        {tripOver ? (
          <div className="countdown-box">
            <div className="countdown-number">🌸</div>
            <div className="countdown-label">What a trip!</div>
          </div>
        ) : todayDay ? (
          <div className="countdown-box">
            <div className="countdown-number">Day {todayDay.dayNumber}</div>
            <div className="countdown-label">{todayDay.theme}</div>
          </div>
        ) : (
          <div className="countdown-box">
            <div className="countdown-number">{daysUntil > 0 ? daysUntil : '🌸'}</div>
            <div className="countdown-label">
              {daysUntil > 0 ? `day${daysUntil === 1 ? '' : 's'} to go` : 'Bon voyage!'}
            </div>
          </div>
        )}
      </div>

      {/* Trip stats */}
      <div className="today-section">
        <p className="section-title">Trip Overview</p>
      </div>
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">11</div>
          <div className="stat-label">Days</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">3</div>
          <div className="stat-label">Cities</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalActivities}</div>
          <div className="stat-label">Activities</div>
        </div>
      </div>

      {/* Today's activities */}
      {todayDay && (
        <div className="today-section">
          <p className="section-title">Today — {todayDay.theme}</p>
          <div className="today-day-card" onClick={() => onViewDay(todayDay.id)}>
            <div
              className={`today-day-header day-header-${todayDay.country}`}
            >
              <div>
                <h3>Day {todayDay.dayNumber} · {todayDay.city}</h3>
                <p>{formatDate(todayDay.date)}</p>
              </div>
              <span style={{ fontSize: 22 }}>
                {todayDay.country === 'korea' ? '🇰🇷' : '🇯🇵'}
              </span>
            </div>
            <div className="today-day-body">
              {todayDay.activities.slice(0, 4).map(act => (
                <div className="mini-activity" key={act.id}>
                  <div className="mini-activity-icon">{act.icon}</div>
                  <div className="mini-activity-info">
                    <h4>{act.name}</h4>
                    <p>{act.time}{act.cost ? ` · ${act.cost}` : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upcoming days (next 2) */}
      {!tripOver && (
        <div className="today-section" style={{ paddingBottom: 24 }}>
          <p className="section-title">
            {todayDay ? 'Coming Up' : daysUntil <= 0 ? 'Trip Days' : 'First Days'}
          </p>
          {TRIP.days.slice(0, todayDay ? todayDay.dayNumber : 2).filter(d => {
            if (!todayDay) return d.dayNumber <= 2
            return d.dayNumber > todayDay.dayNumber && d.dayNumber <= todayDay.dayNumber + 2
          }).concat(
            !todayDay ? TRIP.days.slice(0, 2) : []
          ).filter((d, i, arr) => arr.indexOf(d) === i)
            .slice(0, todayDay ? 2 : 2)
            .map(day => (
              <div key={day.id} className="today-day-card" onClick={() => onViewDay(day.id)} style={{ marginBottom: 10 }}>
                <div className={`today-day-header day-header-${day.country}`}>
                  <div>
                    <h3>Day {day.dayNumber} · {day.city}</h3>
                    <p>{day.theme}</p>
                  </div>
                  <span style={{ fontSize: 22 }}>
                    {day.country === 'korea' ? '🇰🇷' : '🇯🇵'}
                  </span>
                </div>
                <div className="today-day-body">
                  <div className="activity-pills">
                    {day.activities.slice(0, 4).map(a => (
                      <span key={a.id} className="activity-pill">{a.icon}</span>
                    ))}
                    {day.activities.length > 4 && (
                      <span className="activity-pill" style={{ fontSize: 12, color: '#6B7280' }}>
                        +{day.activities.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

          {!todayDay && daysUntil > 0 && (
            <div className="suggestion-card" style={{ marginTop: 8 }}>
              <h4>✈️ Departure</h4>
              <ul>
                <li>{formatDate(TRIP.startDate)} — {TRIP.days[0].city}</li>
                <li>Check your packing list and travel insurance</li>
                <li>Download offline maps for Seoul and Tokyo</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Trip itinerary summary */}
      <div className="today-section" style={{ paddingBottom: 8 }}>
        <p className="section-title">Itinerary</p>
      </div>
      <div style={{ padding: '0 16px 24px' }}>
        <div className="card" style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>🇰🇷</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Seoul</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>
                  {seoulDays} days · Days 1–{seoulDays}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>✈️</span>
              <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>🗼</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Tokyo</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>
                  4 days · Days 5–8
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>🚄</span>
              <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>⛩️</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Kyoto</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>
                  3 days · Days 9–11
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
