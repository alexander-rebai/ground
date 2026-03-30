'use client'

import { useState, useCallback } from 'react'
import { PromiseDef, DayData } from '@/lib/types'
import { CORE_PROMISES } from '@/lib/constants'
import { migrateIfNeeded } from '@/lib/migration'
import { todayStr } from '@/lib/dates'
import { useStorage } from '@/hooks/useStorage'
import { useDayCount } from '@/hooks/useDayCount'
import { ToastProvider } from '@/components/ui/Toast'
import WelcomeStep from '@/components/onboarding/WelcomeStep'
import PromisePicker from '@/components/onboarding/PromisePicker'
import Header from '@/components/shell/Header'
import Tabs, { TabId } from '@/components/shell/Tabs'
import TodayView from '@/components/today/TodayView'
import MirrorView from '@/components/mirror/MirrorView'
import ExportView from '@/components/export/ExportView'

if (typeof window !== 'undefined') migrateIfNeeded()

type AppView = 'welcome' | 'pick-promises' | 'app' | 'edit-promises'

function GroundApp() {
  const [promises, setPromises, promisesLoaded] = useStorage<PromiseDef[] | null>('g_promises', null)
  const [days, setDays] = useStorage<Record<string, DayData>>('g_days', {})
  const [activeTab, setActiveTab] = useState<TabId>('today')

  const [view, setView] = useState<AppView>('welcome')

  const effectiveView = !promisesLoaded
    ? null
    : promises
      ? view === 'edit-promises'
        ? 'edit-promises'
        : 'app'
      : view === 'pick-promises'
        ? 'pick-promises'
        : 'welcome'

  const dayCount = useDayCount(days)

  const today = todayStr()
  const dayData: DayData = days[today] || { promises: {}, at: 0 }

  // Tomorrow's date for the intention bridge
  const tomorrowDate = new Date()
  tomorrowDate.setDate(tomorrowDate.getDate() + 1)
  const tomorrowStr = tomorrowDate.toISOString().slice(0, 10)
  const tomorrowData: DayData = days[tomorrowStr] || { promises: {}, at: 0 }

  const putDay = useCallback(
    (date: string, updates: Partial<DayData>) => {
      setDays((prev) => ({
        ...prev,
        [date]: { ...prev[date], ...updates, at: Date.now() },
      }))
    },
    [setDays]
  )

  const togglePromise = useCallback(
    (id: string) => {
      const current = dayData.promises?.[id] || false
      putDay(today, { promises: { ...dayData.promises, [id]: !current } })
    },
    [dayData, putDay, today]
  )

  const setTomorrowIntention = useCallback(
    (text: string) => {
      putDay(tomorrowStr, { intention: text })
    },
    [putDay, tomorrowStr]
  )

  const handlePromisesDone = useCallback(
    (newPromises: PromiseDef[]) => {
      setPromises(newPromises)
      setView('app')
    },
    [setPromises]
  )

  const handleEditPromises = useCallback(() => {
    setView('edit-promises')
  }, [])

  const handleReset = useCallback(() => {
    if (!confirm('Delete ALL data? Cannot be undone.')) return
    if (!confirm('Really sure?')) return
    ;['g_days', 'g_stream', 'g_promises', 'g_version', 'g_evening_hour'].forEach((k) =>
      localStorage.removeItem(k)
    )
    window.location.reload()
  }, [])

  if (effectiveView === null) return null

  if (effectiveView === 'welcome') {
    return (
      <div className="fixed inset-0 bg-bg z-[100] flex flex-col items-center justify-center p-6">
        <WelcomeStep onNext={() => setView('pick-promises')} />
      </div>
    )
  }

  if (effectiveView === 'pick-promises') {
    return (
      <div className="fixed inset-0 bg-bg z-[100] flex flex-col items-center justify-center p-6">
        <PromisePicker onDone={handlePromisesDone} />
      </div>
    )
  }

  if (effectiveView === 'edit-promises') {
    const currentPromises = promises || []
    const currentSelected = new Set(currentPromises.map((p) => p.id))
    const currentExtra = currentPromises.filter(
      (p) => !CORE_PROMISES.find((c) => c.id === p.id)
    )
    return (
      <div className="fixed inset-0 bg-bg z-[100] flex flex-col items-center justify-center p-6">
        <PromisePicker
          initialSelected={currentSelected}
          initialExtra={currentExtra}
          isEditing
          onDone={handlePromisesDone}
        />
      </div>
    )
  }

  return (
    <div className={`mx-auto px-4 pb-[120px] ${activeTab === 'mirror' ? 'max-w-[540px] lg:max-w-[720px]' : 'max-w-[540px]'}`}>
      <Header dayCount={dayCount} />
      <Tabs active={activeTab} onChange={setActiveTab} />

      {activeTab === 'today' && (
        <TodayView
          promises={promises || []}
          dayData={dayData}
          tomorrowData={tomorrowData}
          onToggle={togglePromise}
          onSetTomorrowIntention={setTomorrowIntention}
        />
      )}

      {activeTab === 'mirror' && (
        <MirrorView
          promises={promises || []}
          days={days}
          dayCount={dayCount}
        />
      )}

      {activeTab === 'export' && (
        <ExportView
          promises={promises || []}
          days={days}
          onEditPromises={handleEditPromises}
          onReset={handleReset}
        />
      )}
    </div>
  )
}

export default function Home() {
  return (
    <ToastProvider>
      <GroundApp />
    </ToastProvider>
  )
}
