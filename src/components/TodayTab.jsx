import { TRIP, getTodayDay, getDaysUntilTrip, isTripOver, formatDate } from '../data/tripData'

export default function TodayTab({ onViewDay }) {
  const todayDay = getTodayDay()
  const daysUntil = getDaysUntilTrip()
  const tripOver = isTripOver()

  const totalActivities = TRIP.days.reduce((n, d) => n + d.activities.length, 0)
  const koreaDays = TRIP.days.filter(d => d.country === 'korea').length
  const japanDays = TRIP.days.filter(d => d.country === 'japan').length

  return (
    <div className="fade-in">
      {/* Hero */}
      <div className="today-hero">
        <span className="trip-emoji">✈️</span>
        <h1>Annyeong Hase-Lowe</h1>
        <p className="subtitle">Korea & Japan — Jun–Jul 2026</p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4, letterSpacing: '0.05em' }}>v1.3</p>

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
          <div className="stat-number">23</div>
          <div className="stat-label">Days</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{koreaDays}+{japanDays}</div>
          <div className="stat-label">KR+JP days</div>
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
            <div className={`today-day-header day-header-${todayDay.country}`}>
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
          {(todayDay
            ? TRIP.days.filter(d => d.dayNumber > todayDay.dayNumber && d.dayNumber <= todayDay.dayNumber + 2)
            : TRIP.days.slice(0, 2)
          ).map(day => (
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
                <li>{formatDate(TRIP.startDate)} — Depart for Seoul (ICN)</li>
                <li>Check packing list, travel insurance, T-money card</li>
                <li>Download offline maps for Seoul, Sapporo &amp; Osaka</li>
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
            <ItinRow icon="🇰🇷" title="Seoul & Asan" sub="Days 1–4 · 20–23 Jun" />
            <ItinDivider icon="✈️" label="Fly CJJ → CTS" />
            <ItinRow icon="🦀" title="Hokkaido" sub="Days 5–7 · 24–26 Jun" />
            <ItinDivider icon="✈️" label="Fly CTS → KIX" />
            <ItinRow icon="⛩️" title="Kyoto · Arima · Osaka" sub="Days 8–12 · 27 Jun–1 Jul" />
            <ItinDivider icon="✈️" label="Fly KIX → GMP" />
            <ItinRow icon="🇰🇷" title="Ulsan & Incheon" sub="Days 13–23 · 2–12 Jul" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ItinRow({ icon, title, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 24 }}>{icon}</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{title}</div>
        <div style={{ fontSize: 12, color: '#6B7280' }}>{sub}</div>
      </div>
    </div>
  )
}

function ItinDivider({ icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
      <span style={{ fontSize: 11, color: '#9CA3AF' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
    </div>
  )
}
