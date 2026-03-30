'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface SpeechHook {
  isAvailable: boolean
  isRecording: boolean
  start: () => void
  stop: () => void
  transcript: string
  resetTranscript: () => void
}

export function useSpeech(): SpeechHook {
  const [isAvailable, setIsAvailable] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    const SR =
      typeof window !== 'undefined'
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null
    if (!SR) return

    setIsAvailable(true)
    const rec = new SR()
    rec.continuous = false
    rec.interimResults = true
    rec.lang = 'en-US'
    rec.onresult = (e: SpeechRecognitionEvent) => {
      let t = ''
      for (let i = 0; i < e.results.length; i++) {
        t += e.results[i][0].transcript
      }
      setTranscript(t)
    }
    rec.onend = () => setIsRecording(false)
    rec.onerror = () => setIsRecording(false)
    recRef.current = rec
  }, [])

  const start = useCallback(() => {
    if (!recRef.current) return
    setIsRecording(true)
    recRef.current.start()
  }, [])

  const stop = useCallback(() => {
    if (!recRef.current) return
    recRef.current.stop()
  }, [])

  const resetTranscript = useCallback(() => setTranscript(''), [])

  return { isAvailable, isRecording, start, stop, transcript, resetTranscript }
}
