'use client'

import { PromiseDef, WeekDay } from '@/lib/types'
import { todayStr } from '@/lib/dates'

interface WeekGridProps {
  promises: PromiseDef[]
  week: WeekDay[]
}

const SHORT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function WeekGrid({ promises, week }: WeekGridProps) {
  const today = todayStr()

  // Reorder week to start Monday
  const sortedWeek = [...week].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[280px]">
        {/* Day headers */}
        <div className="flex gap-0.5 mb-1.5">
          <div className="w-24 shrink-0" />
          {sortedWeek.map((day, i) => {
            const isToday = day.date === today
            const dayOfWeek = new Date(day.date + 'T12:00:00').getDay()
            const label = SHORT_DAYS[dayOfWeek === 0 ? 6 : dayOfWeek - 1]
            return (
              <div
                key={day.date}
                className={`flex-1 text-center text-[10px] font-semibold ${
                  isToday ? 'text-accent' : 'text-text-3'
                }`}
              >
                {label}
              </div>
            )
          })}
        </div>

        {/* Promise rows */}
        {promises.map((p) => (
          <div key={p.id} className="flex gap-0.5 items-center mb-1">
            <div className="w-24 shrink-0 text-[11px] text-text-3 truncate pr-1">
              {p.label}
            </div>
            {sortedWeek.map((day) => {
              const kept = day.promises[p.id]
              const hasData = kept !== undefined
              return (
                <div key={day.date} className="flex-1 flex justify-center py-0.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      kept
                        ? 'bg-accent'
                        : hasData
                          ? 'bg-surface-2 border border-border'
                          : 'bg-surface-2 opacity-30'
                    }`}
                  />
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
