'use client'

interface WelcomeStepProps {
  onNext: () => void
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="flex flex-col items-center gap-3.5 max-w-[380px] w-full">
      <div className="text-[36px]">&#9673;</div>
      <div className="text-[22px] font-bold tracking-[-0.5px]">Ground</div>
      <div className="text-[13px] text-text-2 leading-[1.55] text-center">
        Six promises. One mirror. Every day.
      </div>
      <button
        className="w-full py-[13px] rounded-pill border-none bg-accent text-[#111] text-sm font-bold cursor-pointer mt-2 transition-all duration-[120ms] active:scale-[0.97]"
        onClick={onNext}
      >
        Begin
      </button>
    </div>
  )
}
