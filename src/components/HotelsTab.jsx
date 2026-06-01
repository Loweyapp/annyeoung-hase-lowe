import { MapPin, Phone, Key, Calendar, ExternalLink } from 'lucide-react'
import { TRIP, formatDateShort } from '../data/tripData'

export default function HotelsTab() {
  const koreaHotels = TRIP.hotels.filter(h => h.country === 'korea')
  const japanHotels = TRIP.hotels.filter(h => h.country === 'japan')

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Hotels</h1>
        <p>3 properties · {TRIP.hotels.length} nights total</p>
      </div>

      <div className="hotels-list">
        <div className="country-label" style={{ padding: '0 4px', marginBottom: 10 }}>
          <span>🇰🇷</span>
          <span>South Korea</span>
        </div>
        {koreaHotels.map(hotel => <HotelCard key={hotel.id} hotel={hotel} />)}

        <div className="country-label" style={{ padding: '0 4px', marginBottom: 10, marginTop: 16 }}>
          <span>🇯🇵</span>
          <span>Japan</span>
        </div>
        {japanHotels.map(hotel => <HotelCard key={hotel.id} hotel={hotel} />)}
      </div>
    </div>
  )
}

function HotelCard({ hotel }) {
  const gmapsUrl = `https://maps.google.com/?q=${encodeURIComponent(hotel.mapsQuery || hotel.address)}`

  const nights = Math.round(
    (new Date(hotel.checkOut) - new Date(hotel.checkIn)) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="hotel-card" style={{ marginBottom: 16 }}>
      <div className={`hotel-card-header day-header-${hotel.country}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3>{hotel.emoji} {hotel.name}</h3>
            <p>{hotel.city} · {nights} night{nights !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <div className="hotel-card-body">
        <div className="hotel-detail-row">
          <span className="hotel-detail-icon"><Calendar size={16} color="#6B7280" /></span>
          <div className="hotel-detail-content">
            <div className="hotel-detail-label">Check-in / Check-out</div>
            <div className="hotel-detail-value">
              {formatDateShort(hotel.checkIn)} → {formatDateShort(hotel.checkOut)}
            </div>
          </div>
        </div>

        <div className="hotel-detail-row">
          <span className="hotel-detail-icon"><MapPin size={16} color="#6B7280" /></span>
          <div className="hotel-detail-content">
            <div className="hotel-detail-label">Address</div>
            <div className="hotel-detail-value">{hotel.address}</div>
          </div>
        </div>

        {hotel.confirmRef && (
          <div className="hotel-detail-row">
            <span className="hotel-detail-icon"><Key size={16} color="#6B7280" /></span>
            <div className="hotel-detail-content">
              <div className="hotel-detail-label">Confirmation Ref</div>
              <div className="hotel-detail-value" style={{ fontFamily: 'monospace', letterSpacing: 0.5 }}>
                {hotel.confirmRef}
              </div>
            </div>
          </div>
        )}

        {hotel.phone && (
          <div className="hotel-detail-row">
            <span className="hotel-detail-icon"><Phone size={16} color="#6B7280" /></span>
            <div className="hotel-detail-content">
              <div className="hotel-detail-label">Phone</div>
              <div className="hotel-detail-value">
                <a href={`tel:${hotel.phone}`} style={{ color: '#0066CC', textDecoration: 'none' }}>
                  {hotel.phone}
                </a>
              </div>
            </div>
          </div>
        )}

        {hotel.notes && (
          <div className="hotel-detail-row" style={{ borderBottom: 'none' }}>
            <span className="hotel-detail-icon">💡</span>
            <div className="hotel-detail-content">
              <div className="hotel-detail-label">Notes</div>
              <div className="hotel-detail-value" style={{ color: '#6B7280' }}>{hotel.notes}</div>
            </div>
          </div>
        )}
      </div>

      <a
        href={gmapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hotel-map-link"
      >
        <MapPin size={16} />
        Open in Google Maps
        <ExternalLink size={14} style={{ marginLeft: 4 }} />
      </a>
    </div>
  )
}
