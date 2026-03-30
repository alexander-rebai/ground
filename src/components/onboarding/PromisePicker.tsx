'use client'

import { useState, useCallback, KeyboardEvent } from 'react'
import { PromiseDef } from '@/lib/types'
import { CORE_PROMISES } from '@/lib/constants'
import { useToast } from '@/components/ui/Toast'

interface PromisePickerProps {
  initialSelected?: Set<string>
  initialExtra?: PromiseDef[]
  isEditing?: boolean
  onDone: (promises: PromiseDef[]) => void
}

const coreIds = new Set(CORE_PROMISES.map((p) => p.id))

export default function PromisePicker({
  initialSelected,
  initialExtra,
  isEditing,
  onDone,
}: PromisePickerProps) {
  const toast = useToast()
  const [selected, setSelected] = useState<Set<string>>(
    () => initialSelected ?? new Set(CORE_PROMISES.map((p) => p.id))
  )
  const [extra, setExtra] = useState<PromiseDef[]>(() => initialExtra ?? [])
  const [customInput, setCustomInput] = useState('')

  const allPromises = [...CORE_PROMISES, ...extra]

  const toggle = useCallback((id: string) => {
    if (coreIds.has(id)) return // Core promises cannot be deselected
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
    if (allPromises.find((p) => p.id === id)) return
    setExtra((prev) => [...prev, { id, label: v, description: '', group: 'morning' as const }])
    setSelected((prev) => new Set(prev).add(id))
    setCustomInput('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customInput, allPromises])

  const handleDone = useCallback(() => {
    if (selected.size === 0) {
      toast('Pick at least one')
      return
    }
    const promises = [...CORE_PROMISES, ...extra].filter((p) => selected.has(p.id))
    onDone(promises)
  }, [selected, extra, onDone, toast])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') addCustom()
    },
    [addCustom]
  )

  return (
    <div className="flex flex-col items-center gap-3.5 max-w-[380px] w-full">
      <div className="text-[22px] font-bold tracking-[-0.5px]">Your promises</div>
      <div className="text-[13px] text-text-2 leading-[1.55] text-center">
        The six promises come standard.
        <br />
        Add your own below.
      </div>
      <div className="flex flex-col gap-1.5 w-full">
        {allPromises.map((p) => {
          const isCore = coreIds.has(p.id)
          const isSelected = selected.has(p.id)
          return (
            <div
              key={p.id}
              className={`flex items-center gap-[9px] py-[11px] px-3 rounded-lg border-[1.5px] transition-all duration-[120ms] select-none ${
                isCore
                  ? 'border-accent-border bg-accent-dim cursor-default'
                  : isSelected
                    ? 'border-done-border bg-done-dim cursor-pointer'
                    : 'border-border cursor-pointer'
              }`}
              onClick={() => toggle(p.id)}
            >
              <div className="flex-1">
                <span className="text-[13px] font-medium">
                  {p.label}
                </span>
                {p.description && (
                  <span className="text-[11px] text-text-3 ml-1.5">
                    {p.description}
                  </span>
                )}
              </div>
              <span
                className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center text-[10px] transition-all duration-[120ms] ${
                  isCore
                    ? 'bg-accent border-accent'
                    : isSelected
                      ? 'bg-done border-done text-[#111]'
                      : 'border-border'
                }`}
              >
                {isSelected && !isCore ? '✓' : ''}
              </span>
            </div>
          )
        })}
      </div>
      <div className="flex gap-1.5 w-full mt-0.5">
        <input
          className="flex-1 py-[9px] px-3 rounded-lg border-[1.5px] border-border bg-surface text-text text-[13px] outline-none placeholder:text-text-3 focus:border-accent-border"
          placeholder="Add a personal promise..."
          maxLength={30}
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
        {isEditing ? 'Save promises' : 'Begin'}
      </button>
    </div>
  )
}
