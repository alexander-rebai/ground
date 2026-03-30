'use client'

import { useState, useEffect, useCallback } from 'react'
import { getStorage, setStorage } from '@/lib/storage'

export function useStorage<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setValue(getStorage(key, fallback))
    setLoaded(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof v === 'function' ? (v as (prev: T) => T)(prev) : v
        setStorage(key, next)
        return next
      })
    },
    [key]
  )

  return [value, set, loaded] as const
}
