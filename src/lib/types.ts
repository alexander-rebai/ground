export type Habit = {
  id: string
  label: string
}

export type DayData = {
  energy: number
  habits: Record<string, boolean>
  at: number
}

export type StreamEntry = {
  id: string
  date: string
  time: string
  ts: number
  text: string
  src: 'kb' | 'voice' | 'migrated'
}
