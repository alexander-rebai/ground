'use client'

import { useState, useCallback } from 'react'
import { Habit, DayData, StreamEntry } from '@/lib/types'
import { PRESET_HABITS } from '@/lib/constants'
import { todayStr } from '@/lib/dates'
import { useStorage } from '@/hooks/useStorage'
import { useStreak } from '@/hooks/useStreak'
import { ToastProvider } from '@/components/ui/Toast'
import WelcomeStep from '@/components/onboarding/WelcomeStep'
import HabitPicker from '@/components/onboarding/HabitPicker'
import Header from '@/components/shell/Header'
import Tabs, { TabId } from '@/components/shell/Tabs'
import HabitsCard from '@/components/today/HabitsCard'
import EnergyCard from '@/components/today/EnergyCard'
import StreamCard from '@/components/today/StreamCard'
import HistoryView from '@/components/history/HistoryView'
import ExportView from '@/components/export/ExportView'

type AppView = 'welcome' | 'pick-habits' | 'app' | 'edit-habits'

function GroundApp() {
  const [habits, setHabits, habitsLoaded] = useStorage<Habit[] | null>('g_habits', null)
  const [days, setDays] = useStorage<Record<string, DayData>>('g_days', {})
  const [stream, setStream] = useStorage<StreamEntry[]>('g_stream', [])
  const [activeTab, setActiveTab] = useState<TabId>('today')

  const [view, setView] = useState<AppView>('welcome')

  const effectiveView = !habitsLoaded
    ? null
    : habits
      ? view === 'edit-habits'
        ? 'edit-habits'
        : 'app'
      : view === 'pick-habits'
        ? 'pick-habits'
        : 'welcome'

  const streak = useStreak(days, stream)

  const today = todayStr()
  const dayData: DayData = days[today] || { energy: 0, habits: {}, at: 0 }

  const putDay = useCallback(
    (updates: Partial<DayData>) => {
      setDays((prev) => ({
        ...prev,
        [today]: { ...prev[today], ...updates, at: Date.now() },
      }))
    },
    [today, setDays]
  )

  const toggleHabit = useCallback(
    (id: string) => {
      const current = dayData.habits?.[id] || false
      putDay({ habits: { ...dayData.habits, [id]: !current }, energy: dayData.energy })
    },
    [dayData, putDay]
  )

  const setEnergy = useCallback(
    (n: number) => {
      putDay({ energy: n, habits: dayData.habits })
    },
    [dayData.habits, putDay]
  )

  const addEntry = useCallback(
    (text: string, src: 'kb' | 'voice') => {
      const now = new Date()
      const entry: StreamEntry = {
        id: 'e_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
        date: today,
        time: now.toTimeString().slice(0, 5),
        ts: now.getTime(),
        text,
        src,
      }
      setStream((prev) => [...prev, entry])
    },
    [today, setStream]
  )

  const deleteEntry = useCallback(
    (id: string) => {
      setStream((prev) => prev.filter((x) => x.id !== id))
    },
    [setStream]
  )

  const handleHabitsDone = useCallback(
    (newHabits: Habit[]) => {
      setHabits(newHabits)
      setView('app')
    },
    [setHabits]
  )

  const handleEditHabits = useCallback(() => {
    setView('edit-habits')
  }, [])

  const handleReset = useCallback(() => {
    if (!confirm('Delete ALL data? Cannot be undone.')) return
    if (!confirm('Really sure?')) return
    ;['g_days', 'g_stream', 'g_habits', 'g_weekly', 'g_one_bet'].forEach((k) =>
      localStorage.removeItem(k)
    )
    window.location.reload()
  }, [])

  if (effectiveView === null) return null

  if (effectiveView === 'welcome') {
    return (
      <div className="fixed inset-0 bg-bg z-[100] flex flex-col items-center justify-center p-6">
        <WelcomeStep onNext={() => setView('pick-habits')} />
      </div>
    )
  }

  if (effectiveView === 'pick-habits') {
    return (
      <div className="fixed inset-0 bg-bg z-[100] flex flex-col items-center justify-center p-6">
        <HabitPicker onDone={handleHabitsDone} />
      </div>
    )
  }

  if (effectiveView === 'edit-habits') {
    const currentHabits = habits || []
    const currentSelected = new Set(currentHabits.map((h) => h.id))
    const currentExtra = currentHabits.filter(
      (h) => !PRESET_HABITS.find((p) => p.id === h.id)
    )
    return (
      <div className="fixed inset-0 bg-bg z-[100] flex flex-col items-center justify-center p-6">
        <HabitPicker
          initialSelected={currentSelected}
          initialExtra={currentExtra}
          isEditing
          onDone={handleHabitsDone}
        />
      </div>
    )
  }

  return (
    <div className="max-w-[460px] mx-auto px-4 pb-[120px]">
      <Header streak={streak} />
      <Tabs active={activeTab} onChange={setActiveTab} />

      {activeTab === 'today' && (
        <>
          <HabitsCard
            habits={habits || []}
            dayData={dayData}
            onToggle={toggleHabit}
          />
          <EnergyCard energy={dayData.energy} onSet={setEnergy} />
          <StreamCard stream={stream} onAdd={addEntry} onDelete={deleteEntry} />
        </>
      )}

      {activeTab === 'history' && (
        <HistoryView habits={habits || []} days={days} stream={stream} />
      )}

      {activeTab === 'export' && (
        <ExportView
          habits={habits || []}
          days={days}
          stream={stream}
          onEditHabits={handleEditHabits}
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
