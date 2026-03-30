'use client'

import { useEffect, useState, useCallback, createContext, useContext } from 'react'

type ToastContextType = (message: string) => void

const ToastContext = createContext<ToastContextType>(() => {})

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => setVisible(false), 1600)
    return () => clearTimeout(t)
  }, [visible, message])

  const show = useCallback((msg: string) => {
    setMessage(msg)
    setVisible(true)
  }, [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        className={`fixed bottom-5 left-1/2 -translate-x-1/2 bg-surface-2 border border-border text-text py-2 px-[18px] rounded-pill text-xs font-medium transition-all duration-[250ms] z-[200] pointer-events-none ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[60px]'
        }`}
      >
        {message}
      </div>
    </ToastContext.Provider>
  )
}
