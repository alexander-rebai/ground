export function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export function formatDate(d: string): string {
  if (d === todayStr()) return 'Today'
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10)
  if (d === yesterday) return 'Yesterday'
  return new Date(d + 'T12:00:00').toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}
