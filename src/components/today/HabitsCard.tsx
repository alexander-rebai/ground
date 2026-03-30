'use client'

import { Habit, DayData } from '@/lib/types'

interface HabitsCardProps {
  habits: Habit[]
  dayData: DayData
  onToggle: (id: string) => void
}

export default function HabitsCard({ habits, dayData, onToggle }: HabitsCardProps) {
  return (
    <div className="bg-surface border border-border rounded-[10px] p-3.5 mb-2.5">
      <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-text-3 mb-2.5">
        Habits
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {habits.map((h) => {
          const on = dayData.habits?.[h.id] || false
          return (
            <button
              key={h.id}
              className={`flex items-center gap-[7px] py-[9px] px-2.5 rounded-lg border-[1.5px] text-[13px] font-medium cursor-pointer transition-all duration-[120ms] select-none whitespace-nowrap overflow-hidden ${
                on
                  ? 'border-done-border bg-done-dim text-done'
                  : 'border-border text-text-2'
              }`}
              onClick={() => onToggle(h.id)}
            >
              <span className="flex-1 text-left overflow-hidden text-ellipsis">
                {h.label}
              </span>
              <span
                className={`w-4 h-4 rounded-full shrink-0 border-[1.5px] flex items-center justify-center text-[9px] transition-all duration-[120ms] ${
                  on
                    ? 'bg-done border-done text-[#111]'
                    : 'border-border'
                }`}
              >
                {on ? '✓' : ''}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
