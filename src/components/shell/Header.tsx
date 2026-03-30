'use client'

interface HeaderProps {
  streak: number
}

export default function Header({ streak }: HeaderProps) {
  return (
    <header className="flex items-center justify-between pt-4 pb-3 sticky top-0 z-10 bg-bg">
      <div className="text-lg font-bold tracking-[-0.3px] flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" /> Ground
      </div>
      <div className="text-[11px] font-semibold text-accent bg-accent-dim border border-accent-border px-2.5 py-1 rounded-pill">
        {streak} day streak
      </div>
    </header>
  )
}
