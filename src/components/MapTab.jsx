import { useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { TRIP } from '../data/tripData'

function emojiIcon(emoji, size = 28) {
  return L.divIcon({
    html: `<div style="font-size:${size}px;line-height:1;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.35))">${emoji}</div>`,
    className: 'custom-emoji-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}

const FILTERS = [
  { id: 'all', label: '🗺 All' },
  { id: 'korea', label: '🇰🇷 Korea' },
  { id: 'japan', label: '🇯🇵 Japan' },
  { id: 'hotels', label: '🏨 Hotels' },
  { id: 'food', label: '🍜 Food' },
  { id: 'sightseeing', label: '📸 Sights' },
]

export default function MapTab() {
  const [filter, setFilter] = useState('all')

  const allActivities = useMemo(() => {
    return TRIP.days.flatMap(day =>
      day.activities
        .filter(a => a.lat && a.lng)
        .map(a => ({ ...a, country: day.country, dayNumber: day.dayNumber, city: day.city }))
    )
  }, [])

  const filteredActivities = useMemo(() => {
    if (filter === 'all') return allActivities
    if (filter === 'korea') return allActivities.filter(a => a.country === 'korea')
    if (filter === 'japan') return allActivities.filter(a => a.country === 'japan')
    if (filter === 'hotels') return []
    if (filter === 'food') return allActivities.filter(a => a.type === 'food')
    if (filter === 'sightseeing') return allActivities.filter(a => a.type === 'sightseeing')
    return allActivities
  }, [filter, allActivities])

  const showHotels = filter === 'all' || filter === 'hotels' ||
    filter === 'korea' || filter === 'japan'

  const filteredHotels = useMemo(() => {
    if (!showHotels) return []
    if (filter === 'korea') return TRIP.hotels.filter(h => h.country === 'korea')
    if (filter === 'japan') return TRIP.hotels.filter(h => h.country === 'japan')
    return TRIP.hotels
  }, [filter, showHotels])

  // Compute map bounds
  const allPoints = [
    ...filteredActivities.map(a => [a.lat, a.lng]),
    ...filteredHotels.map(h => [h.lat, h.lng]),
  ]

  const defaultCenter = filter === 'korea'
    ? [37.5665, 126.9780]
    : filter === 'japan'
      ? [35.6762, 139.6503]
      : [36.2048, 138.2529]

  const defaultZoom = filter === 'all' ? 5 : filter === 'hotels' ? 5 : 11

  return (
    <div className="map-tab-container fade-in">
      {/* Filter chips */}
      <div className="map-filters">
        {FILTERS.map(f => (
          <button
            key={f.id}
            className={`filter-chip ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="full-map">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ width: '100%', height: '100%' }}
          zoomControl={true}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap"
          />

          {filteredHotels.map(hotel => (
            <Marker
              key={hotel.id}
              position={[hotel.lat, hotel.lng]}
              icon={emojiIcon(hotel.emoji, 32)}
            >
              <Popup>
                <strong>{hotel.name}</strong>
                <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>{hotel.city}</div>
                <div style={{ fontSize: 12, color: '#555' }}>{hotel.address}</div>
              </Popup>
            </Marker>
          ))}

          {filteredActivities.map(act => (
            <Marker
              key={`${act.id}-${act.dayNumber}`}
              position={[act.lat, act.lng]}
              icon={emojiIcon(act.icon)}
            >
              <Popup>
                <strong>{act.name}</strong>
                {act.nameKo && <div style={{ fontSize: 12, color: '#666' }}>{act.nameKo}</div>}
                {act.nameJa && <div style={{ fontSize: 12, color: '#666' }}>{act.nameJa}</div>}
                <div style={{ fontSize: 12, marginTop: 4 }}>
                  Day {act.dayNumber} · {act.city}
                </div>
                {act.time && <div style={{ fontSize: 12 }}>{act.time}</div>}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
