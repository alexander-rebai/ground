'use client'

import { Habit, DayData, StreamEntry } from '@/lib/types'
import { exportJSON, exportMarkdown } from '@/lib/export'
import { useToast } from '@/components/ui/Toast'

interface ExportViewProps {
  habits: Habit[]
  days: Record<string, DayData>
  stream: StreamEntry[]
  onEditHabits: () => void
  onReset: () => void
}

export default function ExportView({
  habits,
  days,
  stream,
  onEditHabits,
  onReset,
}: ExportViewProps) {
  const toast = useToast()

  const handleJSON = () => {
    exportJSON(habits, days, stream)
    toast('JSON exported')
  }

  const handleMarkdown = () => {
    exportMarkdown(habits, days, stream)
    toast('Markdown exported')
  }

  return (
    <>
      <div className="bg-surface border border-border rounded-[10px] p-3.5 mb-2.5">
        <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-text-3 mb-2.5">
          Export your data
        </div>
        <div className="text-xs text-text-2 leading-[1.55] text-left mb-2.5">
          Download for backup or to chat with an AI about your patterns.
        </div>
        <div className="flex gap-1.5 mb-1.5">
          <button
            className="flex-1 p-[11px] rounded-lg border-[1.5px] border-border bg-surface-2 text-text-2 text-xs font-semibold cursor-pointer transition-all duration-[120ms] active:border-accent-border active:text-accent active:scale-[0.97]"
            onClick={handleJSON}
          >
            📋 JSON (AI-ready)
          </button>
          <button
            className="flex-1 p-[11px] rounded-lg border-[1.5px] border-border bg-surface-2 text-text-2 text-xs font-semibold cursor-pointer transition-all duration-[120ms] active:border-accent-border active:text-accent active:scale-[0.97]"
            onClick={handleMarkdown}
          >
            📝 Markdown
          </button>
        </div>
      </div>
      <div className="bg-surface border border-border rounded-[10px] p-3.5 mb-2.5">
        <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-text-3 mb-2.5">
          Settings
        </div>
        <div className="flex gap-1.5 mb-1.5">
          <button
            className="flex-1 p-[11px] rounded-lg border-[1.5px] border-border bg-surface-2 text-text-2 text-xs font-semibold cursor-pointer transition-all duration-[120ms] active:border-accent-border active:text-accent active:scale-[0.97]"
            onClick={onEditHabits}
          >
            ✏️ Edit habits
          </button>
          <button
            className="flex-1 p-[11px] rounded-lg border-[1.5px] border-border bg-surface-2 text-text-2 text-xs font-semibold cursor-pointer transition-all duration-[120ms] active:border-accent-border active:text-accent active:scale-[0.97]"
            onClick={onReset}
          >
            🗑 Reset data
          </button>
        </div>
      </div>
    </>
  )
}
