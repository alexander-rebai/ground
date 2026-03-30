export type PromiseDef = {
  id: string
  label: string
  description: string
  group: 'morning' | 'evening'
}

export type DayData = {
  promises: Record<string, boolean>
  at: number
  intention?: string
  // Legacy fields (preserved in storage, not used by app)
  energy?: number
}

export type StreamEntry = {
  // Legacy type — kept for export/migration only
  id: string
  date: string
  time: string
  ts: number
  text: string
  src: 'kb' | 'voice' | 'migrated'
  kind: 'writing' | 'reflection' | 'resistance'
}

export type PromiseStats = {
  id: string
  label: string
  kept: number
  total: number
  rate: number
  currentStreak: number
  longestStreak: number
}

export type WeekDay = {
  date: string
  promises: Record<string, boolean>
}
