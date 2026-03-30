'use client'

interface PatternsListProps {
  patterns: string[]
}

export default function PatternsList({ patterns }: PatternsListProps) {
  if (patterns.length === 0) return null

  return (
    <div className="bg-surface border border-border rounded-[10px] p-3.5 mb-2.5">
      <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-text-3 mb-2.5">
        Patterns
      </div>
      <div className="flex flex-col gap-2">
        {patterns.map((pattern, i) => (
          <div key={i} className="text-[13px] text-text-2 leading-[1.5]">
            {pattern}
          </div>
        ))}
      </div>
    </div>
  )
}
