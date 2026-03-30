import { CORE_PROMISES } from './constants'

export function migrateIfNeeded(): void {
  try {
    const version = localStorage.getItem('g_version')

    // v1 → v2: habits → promises
    if (!version || version === '1') {
      const rawHabits = localStorage.getItem('g_habits')
      if (rawHabits) {
        const habits = JSON.parse(rawHabits) as { id: string; label: string }[]
        const promises = habits.map((h) => {
          const core = CORE_PROMISES.find((p) => p.id === h.id)
          return core ?? { id: h.id, label: h.label, description: '', group: 'morning' as const }
        })
        for (const core of CORE_PROMISES) {
          if (!promises.find((p) => p.id === core.id)) {
            promises.push(core)
          }
        }
        localStorage.setItem('g_promises', JSON.stringify(promises))
        localStorage.removeItem('g_habits')
      }

      const rawDays = localStorage.getItem('g_days')
      if (rawDays) {
        const days = JSON.parse(rawDays) as Record<string, Record<string, unknown>>
        for (const date of Object.keys(days)) {
          const day = days[date]
          if (day.habits && !day.promises) {
            day.promises = day.habits
            delete day.habits
          }
        }
        localStorage.setItem('g_days', JSON.stringify(days))
      }

      const rawStream = localStorage.getItem('g_stream')
      if (rawStream) {
        const stream = JSON.parse(rawStream) as Record<string, unknown>[]
        for (const entry of stream) {
          if (!entry.kind) entry.kind = 'writing'
        }
        localStorage.setItem('g_stream', JSON.stringify(stream))
      }
    }

    // v2 → v3: add group field to promises, strip unused fields
    if (!version || version === '1' || version === '2') {
      const rawPromises = localStorage.getItem('g_promises')
      if (rawPromises) {
        const promises = JSON.parse(rawPromises) as Record<string, unknown>[]
        for (const p of promises) {
          if (!p.group) {
            const core = CORE_PROMISES.find((c) => c.id === p.id)
            p.group = core?.group ?? 'morning'
          }
          if (!p.description && p.description !== '') {
            const core = CORE_PROMISES.find((c) => c.id === p.id)
            p.description = core?.description ?? ''
          }
        }
        localStorage.setItem('g_promises', JSON.stringify(promises))
      }
    }

    localStorage.setItem('g_version', '3')
  } catch {
    // Migration failed silently — app works with fresh data
  }
}
