'use client'

import { useState, useCallback, useEffect, useRef, KeyboardEvent } from 'react'
import { StreamEntry } from '@/lib/types'
import { todayStr, formatTime } from '@/lib/dates'
import { useSpeech } from '@/hooks/useSpeech'

interface StreamCardProps {
  stream: StreamEntry[]
  onAdd: (text: string, src: 'kb' | 'voice') => void
  onDelete: (id: string) => void
}

export default function StreamCard({ stream, onAdd, onDelete }: StreamCardProps) {
  const [input, setInput] = useState('')
  const srcRef = useRef<'kb' | 'voice'>('kb')
  const { isAvailable, isRecording, start, stop, transcript, resetTranscript } =
    useSpeech()

  useEffect(() => {
    if (transcript) {
      setInput(transcript)
      srcRef.current = 'voice'
    }
  }, [transcript])

  const handleSend = useCallback(() => {
    const text = input.trim()
    if (!text) return
    onAdd(text, srcRef.current)
    setInput('')
    srcRef.current = 'kb'
    resetTranscript()
  }, [input, onAdd, resetTranscript])

  const handleMic = useCallback(() => {
    if (isRecording) {
      stop()
    } else {
      start()
    }
  }, [isRecording, start, stop])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const todayEntries = stream
    .filter((x) => x.date === todayStr())
    .sort((a, b) => b.ts - a.ts)

  return (
    <div className="bg-surface border border-border rounded-[10px] p-3.5 mb-2.5">
      <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-text-3 mb-2.5">
        Journal stream
      </div>
      <div className="flex gap-1.5 items-center">
        <input
          className="flex-1 py-[9px] px-3.5 rounded-pill border-[1.5px] border-border bg-surface-2 text-text text-sm outline-none transition-colors duration-150 placeholder:text-text-3 focus:border-accent-border"
          placeholder="What's on your mind..."
          maxLength={500}
          autoComplete="off"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            srcRef.current = 'kb'
          }}
          onKeyDown={handleKeyDown}
        />
        {isAvailable && (
          <button
            className={`w-9 h-9 rounded-full shrink-0 border-[1.5px] flex items-center justify-center text-sm cursor-pointer transition-all duration-[120ms] active:scale-[0.92] ${
              isRecording
                ? 'border-red bg-red-dim text-red animate-pulse-rec'
                : 'border-border text-text-2'
            }`}
            onClick={handleMic}
            title="Voice"
          >
            🎤
          </button>
        )}
        <button
          className="w-9 h-9 rounded-full shrink-0 border-[1.5px] border-accent-border text-accent flex items-center justify-center text-sm cursor-pointer transition-all duration-[120ms] active:scale-[0.92]"
          onClick={handleSend}
          title="Send"
        >
          ↑
        </button>
      </div>
      <div className="mt-2.5">
        {todayEntries.length === 0 ? (
          <div className="text-center py-8 px-4 text-text-3 text-xs leading-[1.7]">
            No entries yet today.
            <br />
            Write something or tap 🎤
          </div>
        ) : (
          todayEntries.map((x) => (
            <div
              key={x.id}
              className="group flex items-start gap-2 py-2 border-b border-border last:border-b-0"
            >
              <span className="text-[11px] text-text-3 font-semibold min-w-[56px] pt-0.5 whitespace-nowrap">
                {formatTime(x.ts)}
                {x.src === 'voice' && (
                  <span className="text-[10px] opacity-50 ml-px"> 🎤</span>
                )}
              </span>
              <span className="text-[13px] text-text leading-[1.45] flex-1 break-words">
                {x.text}
              </span>
              <button
                className="border-none text-text-3 cursor-pointer text-xs p-0.5 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-[120ms] shrink-0"
                onClick={() => onDelete(x.id)}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
