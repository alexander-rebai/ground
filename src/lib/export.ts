import { Habit, DayData, StreamEntry } from './types'
import { formatDate, formatTime } from './dates'

function buildExportData(
  habits: Habit[],
  days: Record<string, DayData>,
  stream: StreamEntry[]
) {
  const dates = [
    ...new Set([...Object.keys(days), ...stream.map((x) => x.date)]),
  ].sort()
  const n = dates.length
  const energies = dates.map((d) => days[d]?.energy).filter(Boolean) as number[]
  const avg = energies.length
    ? (energies.reduce((a, b) => a + b, 0) / energies.length).toFixed(1)
    : '0'
  const rates: Record<string, string> = {}
  habits.forEach((h) => {
    const done = dates.filter((d) => days[d]?.habits?.[h.id]).length
    rates[h.label] = n ? Math.round((done / n) * 100) + '%' : '0%'
  })
  return { n, avg, rates, habits, days, stream, dates }
}

function download(name: string, content: string, type: string) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([content], { type }))
  a.download = name
  a.click()
  URL.revokeObjectURL(a.href)
}

export function exportJSON(
  habits: Habit[],
  days: Record<string, DayData>,
  stream: StreamEntry[]
) {
  const x = buildExportData(habits, days, stream)
  const o = {
    exported: new Date().toISOString(),
    summary: {
      total_days: x.n,
      avg_energy: x.avg,
      habit_completion: x.rates,
      total_entries: x.stream.length,
    },
    habits_tracked: x.habits.map((h) => h.label),
    days: x.dates.map((d) => ({
      date: d,
      energy: x.days[d]?.energy || null,
      habits: x.habits.reduce(
        (a, h) => {
          a[h.label] = x.days[d]?.habits?.[h.id] || false
          return a
        },
        {} as Record<string, boolean>
      ),
      entries: x.stream
        .filter((e) => e.date === d)
        .sort((a, b) => a.ts - b.ts)
        .map((e) => ({ time: e.time, text: e.text, source: e.src })),
    })),
  }
  download('ground-export.json', JSON.stringify(o, null, 2), 'application/json')
}

export function exportMarkdown(
  habits: Habit[],
  days: Record<string, DayData>,
  stream: StreamEntry[]
) {
  const x = buildExportData(habits, days, stream)
  let md = `# Ground Journal Export\n\n**Days:** ${x.n} | **Avg energy:** ${x.avg} | **Entries:** ${x.stream.length}\n\n`
  md += `## Habit Completion\n${Object.entries(x.rates)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n')}\n\n---\n\n`
  ;[...x.dates].reverse().forEach((date) => {
    const d = x.days[date] || ({} as DayData)
    md += `## ${formatDate(date)} (${date})\n`
    if (d.energy)
      md += `Energy: ${'●'.repeat(d.energy)}${'○'.repeat(5 - d.energy)} (${d.energy}/5)\n`
    const done = x.habits.filter((h) => d.habits?.[h.id])
    const missed = x.habits.filter((h) => d.habits?.[h.id] === false)
    if (done.length)
      md += `Done: ${done.map((h) => h.label).join(', ')}\n`
    if (missed.length)
      md += `Missed: ${missed.map((h) => h.label).join(', ')}\n`
    x.stream
      .filter((e) => e.date === date)
      .sort((a, b) => a.ts - b.ts)
      .forEach((e) => {
        md += `- ${formatTime(e.ts)} ${e.src === 'voice' ? '🎤 ' : ''}${e.text}\n`
      })
    md += '\n'
  })
  download('ground-export.md', md, 'text/markdown')
}
