'use client'

import { useMemo } from 'react'
import { DayData, StreamEntry } from '@/lib/types'

export function useStreak(
  days: Record<string, DayData>,
  stream: StreamEntry[]
): number {
  return useMemo(() => {
    let n = 0
    const d = new Date()
    while (true) {
      const s = d.toISOString().slice(0, 10)
      const hasStream = stream.some((x) => x.date === s)
      const hasHabits =
        days[s] && Object.values(days[s].habits || {}).some(Boolean)
      if (hasStream || hasHabits) {
        n++
        d.setDate(d.getDate() - 1)
      } else {
        break
      }
    }
    return n
  }, [days, stream])
}
