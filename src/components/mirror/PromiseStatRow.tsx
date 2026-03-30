'use client'

import { PromiseStats } from '@/lib/types'

interface PromiseStatRowProps {
  stat: PromiseStats
}

export default function PromiseStatRow({ stat }: PromiseStatRowProps) {
  const pct = Math.round(stat.rate * 100)

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border last:border-b-0">
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-text truncate">
          {stat.label}
        </div>
        <div className="text-[11px] text-text-3 mt-0.5">
          {stat.kept} of {stat.total} days
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {/* Rate bar */}
        <div className="w-16 h-1.5 rounded-full bg-surface-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="text-[13px] font-semibold text-accent w-10 text-right">
          {pct}%
        </div>
      </div>
      <div className="text-[11px] text-text-3 shrink-0 text-right w-16">
        <span className="text-text-2">{stat.currentStreak}</span>
        {stat.longestStreak > 0 && (
          <span className="ml-1 text-text-3">/ {stat.longestStreak}</span>
        )}
      </div>
    </div>
  )
}
