import { PromiseDef, DayData, StreamEntry } from './types'
import { formatDate } from './dates'
import { computePromiseStats, getLongestOverallStreak } from './analytics'

function download(name: string, content: string, type: string) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([content], { type }))
  a.download = name
  a.click()
  URL.revokeObjectURL(a.href)
}

function getLegacyStream(): StreamEntry[] {
  try {
    const raw = localStorage.getItem('g_stream')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function exportJSON(
  promises: PromiseDef[],
  days: Record<string, DayData>
) {
  const dates = Object.keys(days).sort()
  const stats = computePromiseStats(promises, days)
  const longestStreak = getLongestOverallStreak(days)
  const legacyStream = getLegacyStream()

  const o: Record<string, unknown> = {
    exported: new Date().toISOString(),
    summary: {
      total_days: dates.length,
      longest_streak: longestStreak,
      promise_stats: stats.map((s) => ({
        promise: s.label,
        rate: Math.round(s.rate * 100) + '%',
        kept: s.kept,
        total: s.total,
        current_streak: s.currentStreak,
        longest_streak: s.longestStreak,
      })),
    },
    promises_tracked: promises.map((p) => p.label),
    days: dates.map((d) => ({
      date: d,
      intention: days[d]?.intention || null,
      promises: promises.reduce(
        (a, p) => {
          a[p.label] = days[d]?.promises?.[p.id] || false
          return a
        },
        {} as Record<string, boolean>
      ),
    })),
  }

  if (legacyStream.length > 0) {
    o.legacy_entries = legacyStream.map((e) => ({
      date: e.date,
      time: e.time,
      text: e.text,
      kind: e.kind,
    }))
  }

  download('ground-export.json', JSON.stringify(o, null, 2), 'application/json')
}

export function exportMarkdown(
  promises: PromiseDef[],
  days: Record<string, DayData>
) {
  const dates = Object.keys(days).sort()
  const stats = computePromiseStats(promises, days)
  const longestStreak = getLongestOverallStreak(days)

  let md = `# Ground Export\n\n**Days:** ${dates.length} | **Longest streak:** ${longestStreak}\n\n`
  md += `## Promise Stats\n`
  for (const s of stats) {
    md += `- ${s.label}: ${Math.round(s.rate * 100)}% (${s.kept}/${s.total}) — streak: ${s.currentStreak}, best: ${s.longestStreak}\n`
  }
  md += `\n---\n\n`

  ;[...dates].reverse().forEach((date) => {
    const d = days[date]
    if (!d) return
    md += `## ${formatDate(date)} (${date})\n`
    if (d.intention) md += `> ${d.intention}\n\n`
    const kept = promises.filter((p) => d.promises?.[p.id])
    const missed = promises.filter(
      (p) => d.promises?.[p.id] === false
    )
    if (kept.length) md += `Kept: ${kept.map((p) => p.label).join(', ')}\n`
    if (missed.length) md += `Missed: ${missed.map((p) => p.label).join(', ')}\n`
    md += '\n'
  })

  download('ground-export.md', md, 'text/markdown')
}
