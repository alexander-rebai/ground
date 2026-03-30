'use client'

export type TabId = 'today' | 'mirror' | 'export'

interface TabsProps {
  active: TabId
  onChange: (tab: TabId) => void
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'mirror', label: 'Mirror' },
  { id: 'export', label: 'Export' },
]

export default function Tabs({ active, onChange }: TabsProps) {
  return (
    <div className="flex gap-0.5 bg-surface rounded-pill p-[3px] mb-3.5 border border-border">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`flex-1 py-[7px] text-center text-xs font-semibold rounded-pill cursor-pointer transition-all duration-150 ${
            active === t.id ? 'bg-surface-2 text-text' : 'text-text-3'
          }`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
