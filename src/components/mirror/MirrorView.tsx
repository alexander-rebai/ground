'use client'

import { useMemo } from 'react'
import { PromiseDef, DayData } from '@/lib/types'
import {
  computePromiseStats,
  getWeekData,
  getLongestOverallStreak,
  detectPatterns,
} from '@/lib/analytics'
import PromiseStatRow from './PromiseStatRow'
import WeekGrid from './WeekGrid'
import PatternsList from './PatternsList'

interface MirrorViewProps {
  promises: PromiseDef[]
  days: Record<string, DayData>
  dayCount: number
}

export default function MirrorView({ promises, days, dayCount }: MirrorViewProps) {
  const stats = useMemo(() => computePromiseStats(promises, days), [promises, days])
  const weeks = useMemo(() => getWeekData(days, 1), [days])
  const longestStreak = useMemo(() => getLongestOverallStreak(days), [days])
  const patterns = useMemo(() => detectPatterns(promises, days), [promises, days])

  const totalDays = Object.keys(days).length

  if (totalDays === 0) {
    return (
      <div className="text-center py-12 px-4 text-text-3 text-[13px] leading-[1.7]">
        No data yet.
        <br />
        Start marking your promises.
      </div>
    )
  }

  return (
    <>
      {/* Streak banner */}
      <div className="bg-surface border border-border rounded-[10px] p-5 mb-2.5 text-center">
        <div className="text-[32px] font-bold text-text tracking-[-1px]">
          Day {dayCount}
        </div>
        {longestStreak > dayCount && (
          <div className="text-[12px] text-text-3 mt-1">
            Longest: {longestStreak} days
          </div>
        )}
      </div>

      {/* Promise stats */}
      <div className="bg-surface border border-border rounded-[10px] p-3.5 mb-2.5">
        <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-text-3 mb-1.5 flex items-center justify-between">
          <span>Promises</span>
          <span className="font-normal normal-case tracking-normal text-text-3">
            streak / best
          </span>
        </div>
        {stats.map((stat) => (
          <PromiseStatRow key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Week grid */}
      {weeks[0] && (
        <div className="bg-surface border border-border rounded-[10px] p-3.5 mb-2.5">
          <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-text-3 mb-2.5">
            This week
          </div>
          <WeekGrid promises={promises} week={weeks[0]} />
        </div>
      )}

      {/* Patterns */}
      <PatternsList patterns={patterns} />
    </>
  )
}
