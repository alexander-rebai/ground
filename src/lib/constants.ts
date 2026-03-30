import { PromiseDef } from './types'

export const CORE_PROMISES: PromiseDef[] = [
  { id: 'rise', label: 'Rise with intention', description: 'Out of bed, not drift', group: 'morning' },
  { id: 'move', label: 'Move', description: 'Work out, get the body right', group: 'morning' },
  { id: 'write', label: 'Write', description: 'Daily, messy, honest', group: 'morning' },
  { id: 'work', label: 'Work', description: 'Show up for the mission', group: 'morning' },
  { id: 'silence', label: 'Sit in silence', description: 'Meditate, come back to center', group: 'evening' },
  { id: 'read', label: 'Read', description: 'Feed the mind', group: 'evening' },
]
