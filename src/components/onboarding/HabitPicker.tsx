'use client'

import { useState, useCallback, KeyboardEvent } from 'react'
import { Habit } from '@/lib/types'
import { PRESET_HABITS } from '@/lib/constants'
import { useToast } from '@/components/ui/Toast'

interface HabitPickerProps {
  initialSelected?: Set<string>
  initialExtra?: Habit[]
  isEditing?: boolean
  onDone: (habits: Habit[]) => void
}

export default function HabitPicker({
  initialSelected,
  initialExtra,
  isEditing,
  onDone,
}: HabitPickerProps) {
  const toast = useToast()
  const [selected, setSelected] = useState<Set<string>>(
    () => initialSelected ?? new Set(['move', 'cold', 'bed11', 'meditate'])
  )
  const [extra, setExtra] = useState<Habit[]>(() => initialExtra ?? [])
  const [customInput, setCustomInput] = useState('')

  const allHabits = [...PRESET_HABITS, ...extra]

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const addCustom = useCallback(() => {
    const v = customInput.trim()
    if (!v) return
    const id = 'c_' + v.toLowerCase().replace(/\s+/g, '_')
    if (allHabits.find((h) => h.id === id)) return
    setExtra((prev) => [...prev, { id, label: v }])
    setSelected((prev) => new Set(prev).add(id))
    setCustomInput('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customInput, allHabits])

  const handleDone = useCallback(() => {
    if (selected.size === 0) {
      toast('Pick at least one')
      return
    }
    const habits = [...PRESET_HABITS, ...extra].filter((h) => selected.has(h.id))
    onDone(habits)
  }, [selected, extra, onDone, toast])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') addCustom()
    },
    [addCustom]
  )

  return (
    <div className="flex flex-col items-center gap-3.5 max-w-[380px] w-full">
      <div className="text-[22px] font-bold tracking-[-0.5px]">Your habits</div>
      <div className="text-[13px] text-text-2 leading-[1.55] text-center">
        Pick what you want to track daily.
        <br />
        You can always change these later.
      </div>
      <div className="flex flex-col gap-1.5 w-full">
        {allHabits.map((h) => (
          <div
            key={h.id}
            className={`flex items-center gap-[9px] py-[11px] px-3 rounded-lg border-[1.5px] cursor-pointer transition-all duration-[120ms] select-none ${
              selected.has(h.id)
                ? 'border-done-border bg-done-dim'
                : 'border-border'
            }`}
            onClick={() => toggle(h.id)}
          >
            <span className="text-[13px] font-medium flex-1 text-left">
              {h.label}
            </span>
            <span
              className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center text-[10px] transition-all duration-[120ms] ${
                selected.has(h.id)
                  ? 'bg-done border-done text-[#111]'
                  : 'border-border'
              }`}
            >
              {selected.has(h.id) ? '✓' : ''}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 w-full mt-0.5">
        <input
          className="flex-1 py-[9px] px-3 rounded-lg border-[1.5px] border-border bg-surface text-text text-[13px] outline-none placeholder:text-text-3 focus:border-accent-border"
          placeholder="Add custom habit..."
          maxLength={20}
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="w-9 h-9 text-base rounded-full shrink-0 border-[1.5px] border-accent-border text-accent flex items-center justify-center cursor-pointer transition-all duration-[120ms] active:scale-[0.92]"
          onClick={addCustom}
        >
          +
        </button>
      </div>
      <button
        className="w-full py-[13px] rounded-pill border-none bg-accent text-[#111] text-sm font-bold cursor-pointer mt-2 transition-all duration-[120ms] active:scale-[0.97] disabled:opacity-25 disabled:cursor-default"
        onClick={handleDone}
      >
        {isEditing ? 'Save habits' : 'Start journaling'}
      </button>
    </div>
  )
}
