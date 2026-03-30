'use client'

interface HeaderProps {
  dayCount: number
}

export default function Header({ dayCount }: HeaderProps) {
  return (
    <header className="flex items-center justify-between pt-4 pb-3 sticky top-0 z-10 bg-bg">
      <div className="text-lg font-bold tracking-[-0.3px] flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" /> Ground
      </div>
      {dayCount > 0 && (
        <div className="text-[11px] font-medium text-text-3">
          Day {dayCount}
        </div>
      )}
    </header>
  )
}
