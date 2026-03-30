'use client'

import { PromiseDef, DayData } from '@/lib/types'
import { exportJSON, exportMarkdown } from '@/lib/export'
import { useToast } from '@/components/ui/Toast'

interface ExportViewProps {
  promises: PromiseDef[]
  days: Record<string, DayData>
  onEditPromises: () => void
  onReset: () => void
}

export default function ExportView({
  promises,
  days,
  onEditPromises,
  onReset,
}: ExportViewProps) {
  const toast = useToast()

  const handleJSON = () => {
    exportJSON(promises, days)
    toast('JSON exported')
  }

  const handleMarkdown = () => {
    exportMarkdown(promises, days)
    toast('Markdown exported')
  }

  return (
    <>
      <div className="bg-surface border border-border rounded-[10px] p-3.5 mb-2.5">
        <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-text-3 mb-2.5">
          Export your data
        </div>
        <div className="text-xs text-text-2 leading-[1.55] text-left mb-2.5">
          Download your promise data for backup.
        </div>
        <div className="flex gap-1.5 mb-1.5">
          <button
            className="flex-1 p-[11px] rounded-lg border-[1.5px] border-border bg-surface-2 text-text-2 text-xs font-semibold cursor-pointer transition-all duration-[120ms] active:border-accent-border active:text-accent active:scale-[0.97]"
            onClick={handleJSON}
          >
            JSON (AI-ready)
          </button>
          <button
            className="flex-1 p-[11px] rounded-lg border-[1.5px] border-border bg-surface-2 text-text-2 text-xs font-semibold cursor-pointer transition-all duration-[120ms] active:border-accent-border active:text-accent active:scale-[0.97]"
            onClick={handleMarkdown}
          >
            Markdown
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
            onClick={onEditPromises}
          >
            Edit promises
          </button>
          <button
            className="flex-1 p-[11px] rounded-lg border-[1.5px] border-border bg-surface-2 text-text-2 text-xs font-semibold cursor-pointer transition-all duration-[120ms] active:border-accent-border active:text-accent active:scale-[0.97]"
            onClick={onReset}
          >
            Reset data
          </button>
        </div>
      </div>
    </>
  )
}
