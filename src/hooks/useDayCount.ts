'use client'

import { useMemo } from 'react'
import { DayData } from '@/lib/types'

export function useDayCount(days: Record<string, DayData>): number {
  return useMemo(() => {
    let n = 0
    const d = new Date()
    while (true) {
      const s = d.toISOString().slice(0, 10)
      const hasPromises =
        days[s] && Object.values(days[s].promises || {}).some(Boolean)
      if (hasPromises) {
        n++
        d.setDate(d.getDate() - 1)
      } else {
        break
      }
    }
    return n
  }, [days])
}
