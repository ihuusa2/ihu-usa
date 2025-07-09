/**
 * Utility functions to prevent hydration errors in Next.js applications
 */

/**
 * Safely format dates to prevent hydration mismatches
 * Ensures consistent formatting between server and client
 */
export const safeFormatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Use consistent format regardless of locale
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  
  return `${month}/${day}/${year}`
}

/**
 * Safely format relative time to prevent hydration mismatches
 */
export const safeFormatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - dateObj.getTime()
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))
  
  if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'} ago`
  } else if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  } else if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  } else {
    return 'Just now'
  }
}

/**
 * Generate deterministic random-like values for SSR
 * Use this instead of Math.random() to prevent hydration mismatches
 */
export const deterministicRandom = (seed: number, max: number = 1): number => {
  const x = Math.sin(seed) * 10000
  return (x - Math.floor(x)) * max
}

/**
 * Create a deterministic array of random-like values
 */
export const createDeterministicArray = (length: number, seed: number = 0): number[] => {
  return Array.from({ length }, (_, i) => deterministicRandom(seed + i))
}

/**
 * Check if code is running on the client side
 */
export const isClient = typeof window !== 'undefined'

/**
 * Check if code is running on the server side
 */
export const isServer = typeof window === 'undefined'

/**
 * Safely access browser APIs
 */
export const safeBrowserAPI = {
  localStorage: {
    getItem: (key: string): string | null => {
      if (isClient) {
        try {
          return localStorage.getItem(key)
        } catch {
          return null
        }
      }
      return null
    },
    setItem: (key: string, value: string): void => {
      if (isClient) {
        try {
          localStorage.setItem(key, value)
        } catch {
          // Ignore errors
        }
      }
    }
  },
  sessionStorage: {
    getItem: (key: string): string | null => {
      if (isClient) {
        try {
          return sessionStorage.getItem(key)
        } catch {
          return null
        }
      }
      return null
    },
    setItem: (key: string, value: string): void => {
      if (isClient) {
        try {
          sessionStorage.setItem(key, value)
        } catch {
          // Ignore errors
        }
      }
    }
  },
  window: {
    innerWidth: isClient ? window.innerWidth : 0,
    innerHeight: isClient ? window.innerHeight : 0
  }
}

/**
 * Utilities for handling hydration mismatches and ensuring consistent server/client rendering
 */

import { useEffect, useState } from 'react'

/**
 * Hook to safely use values that differ between server and client
 * Prevents hydration mismatches by ensuring consistent initial render
 */
export function useHydrationSafe<T>(serverValue: T, clientValue: T): T {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  return isClient ? clientValue : serverValue
}

/**
 * Hook to safely access browser APIs
 * Returns null during SSR and the actual value on client
 */
export function useBrowserAPI<T>(getValue: () => T): T | null {
  const [value, setValue] = useState<T | null>(null)
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
    setValue(getValue())
  }, [getValue])
  
  return isClient ? value : null
}

/**
 * Hook to safely use window dimensions
 * Prevents hydration mismatch by starting with fallback values
 */
export function useSafeWindowDimensions() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  return { ...dimensions, isClient }
}

/**
 * Hook to safely use localStorage
 * Prevents hydration mismatch by handling SSR gracefully
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
    }
  }, [key])

  const setValue = (value: T | ((val: T) => T)) => {
    if (!isClient) return
    
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}

/**
 * Hook to safely use sessionStorage
 * Prevents hydration mismatch by handling SSR gracefully
 */
export function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    try {
      const item = window.sessionStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error)
    }
  }, [key])

  const setValue = (value: T | ((val: T) => T)) => {
    if (!isClient) return
    
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}

/**
 * Hook to safely use cookies
 * Prevents hydration mismatch by handling SSR gracefully
 */
export function useCookie(key: string, initialValue: string = '') {
  const [value, setValue] = useState(initialValue)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift()
      return undefined
    }
    
    const cookieValue = getCookie(key)
    if (cookieValue) {
      setValue(cookieValue)
    }
  }, [key])

  const setCookie = (newValue: string, options: { expires?: number; path?: string } = {}) => {
    if (!isClient) return
    
    const { expires = 7, path = '/' } = options
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + expires)
    
    document.cookie = `${key}=${newValue}; expires=${expiryDate.toUTCString()}; path=${path}`
    setValue(newValue)
  }

  return [value, setCookie] as const
}

/**
 * Hook to safely use media queries
 * Prevents hydration mismatch by starting with a default value
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const media = window.matchMedia(query)
    
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return isClient ? matches : false
}

/**
 * Hook to safely use system preferences (dark mode, etc.)
 * Prevents hydration mismatch by starting with a default value
 */
export function useSystemPreference(preference: 'color-scheme' | 'reduced-motion' | 'prefers-contrast'): string {
  const [value, setValue] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const getPreference = () => {
      switch (preference) {
        case 'color-scheme':
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        case 'reduced-motion':
          return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduce' : 'no-preference'
        case 'prefers-contrast':
          return window.matchMedia('(prefers-contrast: high)').matches ? 'high' : 'normal'
        default:
          return ''
      }
    }
    
    setValue(getPreference())
    
    const mediaQuery = window.matchMedia(`(prefers-${preference}: ${preference === 'color-scheme' ? 'dark' : preference === 'reduced-motion' ? 'reduce' : 'high'})`)
    const listener = () => setValue(getPreference())
    mediaQuery.addEventListener('change', listener)
    
    return () => mediaQuery.removeEventListener('change', listener)
  }, [preference])

  return isClient ? value : ''
}

/**
 * Utility to generate consistent IDs for SSR
 * Prevents hydration mismatch by using predictable values
 */
export function generateConsistentId(prefix: string, index: number): string {
  return `${prefix}-${index}`
}

 