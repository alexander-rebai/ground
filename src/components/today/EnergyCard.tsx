'use client'

interface EnergyCardProps {
  energy: number
  onSet: (n: number) => void
}

export default function EnergyCard({ energy, onSet }: EnergyCardProps) {
  return (
    <div className="bg-surface border border-border rounded-[10px] p-3.5 mb-2.5">
      <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-text-3 mb-2.5">
        Energy
      </div>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            className={`flex-1 h-[42px] rounded-lg border-[1.5px] text-[15px] font-bold cursor-pointer transition-all duration-[120ms] ${
              energy === n
                ? 'border-accent-border bg-accent-dim text-accent'
                : 'border-border text-text-3'
            }`}
            onClick={() => onSet(n)}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
