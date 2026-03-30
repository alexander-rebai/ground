import { PromiseDef, DayData, PromiseStats, WeekDay } from './types'

function getAllDates(days: Record<string, DayData>): string[] {
  return Object.keys(days).sort()
}

export function computePromiseStats(
  promises: PromiseDef[],
  days: Record<string, DayData>
): PromiseStats[] {
  const dates = getAllDates(days)
  if (dates.length === 0) return []

  return promises.map((p) => {
    let kept = 0
    let total = 0
    let currentStreak = 0
    let longestStreak = 0
    let streakBroken = false

    // Walk dates in reverse for current streak calculation
    const reverseDates = [...dates].reverse()

    for (const date of reverseDates) {
      const dayPromises = days[date]?.promises
      if (!dayPromises || dayPromises[p.id] === undefined) continue

      total++
      if (dayPromises[p.id]) {
        kept++
        if (!streakBroken) currentStreak++
      } else {
        streakBroken = true
      }
    }

    // Calculate longest streak (forward pass)
    let streak = 0
    for (const date of dates) {
      if (days[date]?.promises?.[p.id]) {
        streak++
        if (streak > longestStreak) longestStreak = streak
      } else {
        streak = 0
      }
    }

    return {
      id: p.id,
      label: p.label,
      kept,
      total: total || dates.length,
      rate: total > 0 ? kept / total : 0,
      currentStreak,
      longestStreak,
    }
  })
}

export function getWeekData(
  days: Record<string, DayData>,
  weeksBack: number = 1
): WeekDay[][] {
  const weeks: WeekDay[][] = []
  const today = new Date()

  for (let w = 0; w < weeksBack; w++) {
    const week: WeekDay[] = []
    for (let d = 6; d >= 0; d--) {
      const date = new Date(today)
      date.setDate(today.getDate() - (w * 7 + d))
      const dateStr = date.toISOString().slice(0, 10)
      week.push({
        date: dateStr,
        promises: days[dateStr]?.promises || {},
      })
    }
    weeks.push(week)
  }

  return weeks
}

export function getLongestOverallStreak(days: Record<string, DayData>): number {
  const dates = getAllDates(days)
  let longest = 0
  let current = 0
  let prevDate: Date | null = null

  for (const dateStr of dates) {
    const hasAny = Object.values(days[dateStr]?.promises || {}).some(Boolean)
    if (!hasAny) {
      current = 0
      prevDate = null
      continue
    }

    const thisDate = new Date(dateStr + 'T12:00:00')
    if (prevDate) {
      const diffDays = Math.round(
        (thisDate.getTime() - prevDate.getTime()) / 86400000
      )
      if (diffDays === 1) {
        current++
      } else {
        current = 1
      }
    } else {
      current = 1
    }

    if (current > longest) longest = current
    prevDate = thisDate
  }

  return longest
}

export function detectPatterns(
  promises: PromiseDef[],
  days: Record<string, DayData>
): string[] {
  const dates = getAllDates(days)
  if (dates.length < 14) return []

  const patterns: string[] = []
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  for (const p of promises) {
    // Day-of-week tendency: check last 4 weeks
    const recentDates = dates.slice(-28)
    const missedByDay: Record<number, number> = {}
    const totalByDay: Record<number, number> = {}

    for (const dateStr of recentDates) {
      const dow = new Date(dateStr + 'T12:00:00').getDay()
      totalByDay[dow] = (totalByDay[dow] || 0) + 1
      if (days[dateStr]?.promises?.[p.id] === false) {
        missedByDay[dow] = (missedByDay[dow] || 0) + 1
      }
    }

    for (const [dow, missed] of Object.entries(missedByDay)) {
      const total = totalByDay[Number(dow)] || 1
      if (missed >= 3 && missed / total >= 0.6) {
        patterns.push(
          `You tend to miss ${p.label} on ${dayNames[Number(dow)]}s`
        )
      }
    }

    // Perfect streak detection
    const last21 = dates.slice(-21)
    const keptLast21 = last21.filter((d) => days[d]?.promises?.[p.id]).length
    if (keptLast21 === last21.length && last21.length >= 7) {
      const weeks = Math.floor(last21.length / 7)
      patterns.push(`${p.label} has been perfect for ${weeks}+ weeks`)
    }
  }

  // Last break detection
  const reverseDates = [...dates].reverse()
  let lastBreakDaysAgo = 0
  for (const dateStr of reverseDates) {
    const hasAny = Object.values(days[dateStr]?.promises || {}).some(Boolean)
    if (!hasAny) {
      if (lastBreakDaysAgo > 0) {
        patterns.push(`Last time you broke the chain was ${lastBreakDaysAgo} days ago`)
      }
      break
    }
    lastBreakDaysAgo++
  }

  return patterns
}
