'use client'

import { useState, useCallback, useEffect, KeyboardEvent } from 'react'
import { PromiseDef, DayData } from '@/lib/types'
import { getStorage } from '@/lib/storage'

interface TodayViewProps {
  promises: PromiseDef[]
  dayData: DayData
  tomorrowData: DayData
  onToggle: (id: string) => void
  onSetTomorrowIntention: (text: string) => void
}

export default function TodayView({
  promises,
  dayData,
  tomorrowData,
  onToggle,
  onSetTomorrowIntention,
}: TodayViewProps) {
  const [isEvening, setIsEvening] = useState(false)
  const [intentionInput, setIntentionInput] = useState('')

  useEffect(() => {
    const check = () => {
      const eveningHour = getStorage('g_evening_hour', 20)
      setIsEvening(new Date().getHours() >= eveningHour)
    }
    check()
    const interval = setInterval(check, 60_000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setIntentionInput(tomorrowData.intention || '')
  }, [tomorrowData.intention])

  const morningPromises = promises.filter((p) => p.group === 'morning')
  const eveningPromises = promises.filter((p) => p.group === 'evening')

  const keptCount = promises.filter((p) => dayData.promises?.[p.id]).length
  const totalCount = promises.length

  const saveIntention = useCallback(() => {
    const trimmed = intentionInput.trim()
    if (trimmed !== (tomorrowData.intention || '')) {
      onSetTomorrowIntention(trimmed)
    }
  }, [intentionInput, tomorrowData.intention, onSetTomorrowIntention])

  const handleIntentionKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        saveIntention()
        ;(e.target as HTMLInputElement).blur()
      }
    },
    [saveIntention]
  )

  const intention = dayData.intention

  return (
    <div>
      {/* Intention from yesterday */}
      <div className="bg-surface border border-border rounded-[10px] p-3.5 mb-2.5">
        {intention ? (
          <div className={`text-[15px] font-medium leading-[1.5] ${isEvening ? 'text-text-3' : 'text-text'}`}>
            {intention}
          </div>
        ) : (
          <div className="text-[13px] text-text-3 leading-[1.6]">
            No intention set. That&apos;s okay.
            <br />
            Pick it up today. Become who you are.
          </div>
        )}
      </div>

      {/* Morning promises */}
      <div className="bg-surface border border-border rounded-[10px] p-3.5 mb-2.5">
        <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-text-3 mb-2.5">
          Morning
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {morningPromises.map((p) => {
            const kept = dayData.promises?.[p.id] || false
            return (
              <button
                key={p.id}
                className={`flex items-center gap-[7px] py-[9px] px-2.5 rounded-lg border-[1.5px] text-[13px] font-medium cursor-pointer transition-all duration-[120ms] select-none whitespace-nowrap overflow-hidden ${
                  kept
                    ? 'border-accent-border bg-accent-dim text-accent'
                    : isEvening
                      ? 'border-border text-text-3'
                      : 'border-border text-text-2'
                }`}
                onClick={() => onToggle(p.id)}
              >
                <span className="flex-1 text-left overflow-hidden text-ellipsis">
                  {p.label}
                </span>
                <span
                  className={`w-4 h-4 rounded-full shrink-0 border-[1.5px] flex items-center justify-center transition-all duration-[120ms] ${
                    kept ? 'bg-accent border-accent' : 'border-border'
                  }`}
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* Evening promises */}
      <div className="bg-surface border border-border rounded-[10px] p-3.5 mb-2.5">
        <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-text-3 mb-2.5">
          Evening
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {eveningPromises.map((p) => {
            const kept = dayData.promises?.[p.id] || false
            return (
              <button
                key={p.id}
                className={`flex items-center gap-[7px] py-[9px] px-2.5 rounded-lg border-[1.5px] text-[13px] font-medium cursor-pointer transition-all duration-[120ms] select-none whitespace-nowrap overflow-hidden ${
                  kept
                    ? 'border-accent-border bg-accent-dim text-accent'
                    : isEvening
                      ? 'border-border text-text-2'
                      : 'border-border text-text-3'
                }`}
                onClick={() => onToggle(p.id)}
              >
                <span className="flex-1 text-left overflow-hidden text-ellipsis">
                  {p.label}
                </span>
                <span
                  className={`w-4 h-4 rounded-full shrink-0 border-[1.5px] flex items-center justify-center transition-all duration-[120ms] ${
                    kept ? 'bg-accent border-accent' : 'border-border'
                  }`}
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* Summary */}
      {keptCount > 0 && (
        <div className="text-center text-[12px] text-text-3 font-medium mb-2.5">
          {keptCount} of {totalCount}
        </div>
      )}

      {/* Tomorrow's intention — evening only */}
      {isEvening && (
        <div className="bg-surface border border-border rounded-[10px] p-3.5 mb-2.5">
          <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-text-3 mb-2.5">
            Tomorrow
          </div>
          <input
            className="w-full py-[9px] px-3.5 rounded-pill border-[1.5px] border-border bg-surface-2 text-text text-sm outline-none transition-colors duration-150 placeholder:text-text-3 focus:border-accent-border"
            placeholder="Tomorrow I will..."
            maxLength={200}
            autoComplete="off"
            value={intentionInput}
            onChange={(e) => setIntentionInput(e.target.value)}
            onBlur={saveIntention}
            onKeyDown={handleIntentionKeyDown}
          />
        </div>
      )}
    </div>
  )
}
