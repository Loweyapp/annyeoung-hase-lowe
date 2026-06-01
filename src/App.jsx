import { useState } from 'react'
import BottomNav from './components/BottomNav'
import TodayTab from './components/TodayTab'
import DaysTab from './components/DaysTab'
import DayDetail from './components/DayDetail'
import HotelsTab from './components/HotelsTab'
import MapTab from './components/MapTab'

export default function App() {
  const [activeTab, setActiveTab] = useState('today')
  const [selectedDayId, setSelectedDayId] = useState(null)

  function handleViewDay(dayId) {
    setSelectedDayId(dayId)
    setActiveTab('days')
  }

  function handleTabChange(tab) {
    setActiveTab(tab)
    if (tab !== 'days') setSelectedDayId(null)
  }

  function handleBack() {
    setSelectedDayId(null)
  }

  function handleNavigate(dayId) {
    setSelectedDayId(dayId)
  }

  return (
    <div className="app-shell">
      <main className="tab-content">
        {activeTab === 'today' && (
          <TodayTab onViewDay={handleViewDay} />
        )}
        {activeTab === 'days' && !selectedDayId && (
          <DaysTab onViewDay={handleViewDay} />
        )}
        {activeTab === 'days' && selectedDayId && (
          <DayDetail
            dayId={selectedDayId}
            onBack={handleBack}
            onNavigate={handleNavigate}
          />
        )}
        {activeTab === 'hotels' && <HotelsTab />}
        {activeTab === 'map' && <MapTab />}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  )
}
