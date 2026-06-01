import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown, Clock, DollarSign, MapPin, ExternalLink } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { TRIP, formatDate } from '../data/tripData'

function emojiIcon(emoji, size = 28) {
  return L.divIcon({
    html: `<div style="font-size:${size}px;line-height:1;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.3))">${emoji}</div>`,
    className: 'custom-emoji-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}

export default function DayDetail({ dayId, onBack, onNavigate }) {
  const dayIndex = TRIP.days.findIndex(d => d.id === dayId)
  const day = TRIP.days[dayIndex]
  const prevDay = dayIndex > 0 ? TRIP.days[dayIndex - 1] : null
  const nextDay = dayIndex < TRIP.days.length - 1 ? TRIP.days[dayIndex + 1] : null

  const [expanded, setExpanded] = useState({})
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    setExpanded({})
    setMapReady(false)
    const t = setTimeout(() => setMapReady(true), 100)
    return () => clearTimeout(t)
  }, [dayId])

  if (!day) return null

  const toggleExpand = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }))

  const mappableActivities = day.activities.filter(a => a.lat && a.lng)

  return (
    <div className="day-detail fade-in">
      {/* Header */}
      <div className={`day-detail-header day-header-${day.country}`}>
        <button className="back-btn" onClick={onBack}>
          <ChevronLeft size={16} />
          All Days
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>Day {day.dayNumber}</h1>
            <p className="day-meta">{day.theme}</p>
            <div style={{ marginTop: 8 }}>
              <span className="location-tag">
                {day.country === 'korea' ? '🇰🇷' : '🇯🇵'} {day.city} · {formatDate(day.date)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Timeline */}
      <div className="activities-section">
        <p className="section-title">Activities</p>
        <div className="timeline">
          {day.activities.map((activity, idx) => (
            <div key={activity.id} className="timeline-item">
              <div
                className="timeline-dot"
                style={{
                  background: expanded[activity.id]
                    ? (day.country === 'korea' ? '#BE1E2D' : '#BC002D')
                    : undefined
                }}
              />
              <div className="activity-card" onClick={() => toggleExpand(activity.id)}>
                <div className="activity-card-header">
                  <div className="activity-icon-wrap">{activity.icon}</div>
                  <div className="activity-info">
                    <h4>{activity.name}</h4>
                    <p className="activity-native">
                      {activity.nameKo || activity.nameJa || activity.type}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span className="activity-time">{activity.time}</span>
                    <ChevronDown
                      size={16}
                      className={`chevron ${expanded[activity.id] ? 'open' : ''}`}
                      color="#9CA3AF"
                    />
                  </div>
                </div>

                {expanded[activity.id] && (
                  <div className="activity-expand" onClick={e => e.stopPropagation()}>
                    {activity.notes && (
                      <p style={{ fontSize: 13, color: '#374151', marginBottom: 10, lineHeight: 1.5 }}>
                        {activity.notes}
                      </p>
                    )}

                    <div className="expand-row">
                      {activity.cost && (
                        <span className="expand-badge">
                          <DollarSign size={14} />
                          {activity.cost}
                        </span>
                      )}
                      {activity.openingHours && (
                        <span className="expand-badge">
                          <Clock size={14} />
                          {activity.openingHours}
                        </span>
                      )}
                    </div>

                    {activity.tips && activity.tips.length > 0 && (
                      <ul className="tips-list">
                        {activity.tips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    )}

                    <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                      {activity.mapsQuery && (
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(activity.mapsQuery)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="activity-link"
                        >
                          <MapPin size={13} />
                          Google Maps
                        </a>
                      )}
                      {activity.link && (
                        <a
                          href={activity.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="activity-link"
                        >
                          <ExternalLink size={13} />
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      {mappableActivities.length > 0 && mapReady && (
        <div className="day-map-section">
          <p className="section-title">Map</p>
          <div className="day-map-container">
            <MapContainer
              center={day.mapCenter}
              zoom={day.mapZoom}
              style={{ width: '100%', height: '100%' }}
              zoomControl={false}
              attributionControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap"
              />
              {mappableActivities.map(act => (
                <Marker
                  key={act.id}
                  position={[act.lat, act.lng]}
                  icon={emojiIcon(act.icon)}
                >
                  <Popup>
                    <strong>{act.name}</strong>
                    {act.nameKo && <div style={{ fontSize: 12, color: '#666' }}>{act.nameKo}</div>}
                    {act.nameJa && <div style={{ fontSize: 12, color: '#666' }}>{act.nameJa}</div>}
                    {act.time && <div style={{ fontSize: 12 }}>{act.time}</div>}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      )}

      {/* Transport */}
      {day.transport && day.transport.length > 0 && (
        <div className="transport-section">
          <p className="section-title">Getting Around</p>
          <div className="transport-card">
            {day.transport.map((t, i) => (
              <div key={i} className="transport-item">
                <span className="transport-icon">{t.icon}</span>
                <div className="transport-info">
                  <h4>{t.name}</h4>
                  <p>{t.description}</p>
                  {t.detail && <p style={{ marginTop: 3 }}>{t.detail}</p>}
                  {t.link && (
                    <a href={t.link} target="_blank" rel="noopener noreferrer" className="transport-link">
                      <ExternalLink size={12} />
                      Timetable / Book
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {day.suggestions && day.suggestions.length > 0 && (
        <div className="suggestions-section">
          <p className="section-title">Tips & Suggestions</p>
          <div className="suggestion-card">
            <h4>💡 Local tips</h4>
            <ul>
              {day.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Prev / Next Nav */}
      <div className="day-nav">
        <button
          className="day-nav-btn"
          onClick={() => prevDay && onNavigate(prevDay.id)}
          disabled={!prevDay}
        >
          <ChevronLeft size={16} />
          {prevDay ? `Day ${prevDay.dayNumber}` : 'First day'}
        </button>
        <button
          className="day-nav-btn"
          onClick={() => nextDay && onNavigate(nextDay.id)}
          disabled={!nextDay}
        >
          {nextDay ? `Day ${nextDay.dayNumber}` : 'Last day'}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
