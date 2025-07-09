import { useState, useEffect } from 'react'

/**
 * Hook to safely use client-side only values
 * Prevents hydration mismatches by ensuring consistent server/client rendering
 */
export function useClientOnly<T>(value: T, fallback: T): T {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  return mounted ? value : fallback
}

/**
 * Hook to check if component has mounted (client-side)
 * Useful for preventing hydration mismatches
 */
export function useHasMounted(): boolean {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return hasMounted
}

/**
 * Hook to safely access window dimensions
 * Prevents hydration mismatch by starting with fallback values
 */
export function useWindowDimensions() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
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

  return { ...dimensions, mounted }
} 