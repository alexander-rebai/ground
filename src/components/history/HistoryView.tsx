'use client'

import { Habit, DayData, StreamEntry } from '@/lib/types'
import { formatDate, formatTime } from '@/lib/dates'

interface HistoryViewProps {
  habits: Habit[]
  days: Record<string, DayData>
  stream: StreamEntry[]
}

export default function HistoryView({ habits, days, stream }: HistoryViewProps) {
  const dates = [
    ...new Set([...Object.keys(days), ...stream.map((x) => x.date)]),
  ]
    .sort()
    .reverse()

  if (dates.length === 0) {
    return (
      <div className="text-center py-8 px-4 text-text-3 text-xs leading-[1.7]">
        No history yet.
      </div>
    )
  }

  return (
    <>
      {dates.map((date) => {
        const d = days[date] || ({} as DayData)
        const ents = stream
          .filter((x) => x.date === date)
          .sort((a, b) => a.ts - b.ts)
        const habitKeys = Object.keys(d.habits || {})

        return (
          <div
            key={date}
            className="bg-surface border border-border rounded-[10px] p-3.5 mb-2.5"
          >
            <div className="text-xs font-bold text-text-2 mb-1.5 flex items-center gap-1.5">
              {formatDate(date)}
              {d.energy ? (
                <span className="text-[10px] font-semibold bg-accent-dim text-accent py-0.5 px-[7px] rounded-pill">
                  ⚡{d.energy}
                </span>
              ) : null}
            </div>
            {habitKeys.length > 0 && (
              <div className="flex gap-1 flex-wrap mb-1.5">
                {habits.map((h) =>
                  d.habits?.[h.id] !== undefined ? (
                    <span
                      key={h.id}
                      className={`text-[10px] py-0.5 px-[7px] rounded-pill font-medium ${
                        d.habits[h.id]
                          ? 'bg-done-dim text-done'
                          : 'bg-surface-2 text-text-3 line-through'
                      }`}
                    >
                      {h.label}
                    </span>
                  ) : null
                )}
              </div>
            )}
            {ents.map((x) => (
              <div
                key={x.id}
                className="flex items-start gap-2 py-2 border-b border-border last:border-b-0"
              >
                <span className="text-[11px] text-text-3 font-semibold min-w-[56px] pt-0.5 whitespace-nowrap">
                  {formatTime(x.ts)}
                  {x.src === 'voice' && (
                    <span className="text-[10px] opacity-50 ml-px"> 🎤</span>
                  )}
                </span>
                <span className="text-[13px] text-text leading-[1.45] flex-1 break-words">
                  {x.text}
                </span>
              </div>
            ))}
            {ents.length === 0 && habitKeys.length === 0 && (
              <div className="text-text-3 text-xs">No entries</div>
            )}
          </div>
        )
      })}
    </>
  )
}
