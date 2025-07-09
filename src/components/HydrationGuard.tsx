'use client'

import { useEffect, useState } from 'react'

interface HydrationGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  debug?: boolean
  clientOnly?: boolean
  suppressHydrationWarning?: boolean
}

/**
 * HydrationGuard component to prevent hydration mismatches
 * caused by browser extensions that modify the DOM or client-side state
 */
export default function HydrationGuard({ 
  children, 
  fallback = null, 
  debug = false,
  clientOnly = false,
  suppressHydrationWarning = false
}: HydrationGuardProps) {
  const [hasMounted, setHasMounted] = useState(false)
  const [hydrationError, setHydrationError] = useState(false)

  useEffect(() => {
    // Check for hydration errors and browser extension interference
    const checkHydrationError = () => {
      try {
        // Check for React hydration warnings in console
        const originalError = console.error
        let hasHydrationWarning = false
        
        console.error = (...args) => {
          const message = args.join(' ')
          if (message.includes('hydration') || message.includes('server rendered HTML') || message.includes('client properties')) {
            hasHydrationWarning = true
            if (debug) {
              console.warn('Hydration warning detected:', message)
            }
          }
          originalError.apply(console, args)
        }

        // Check for browser extension attributes that might cause issues
        const htmlElement = document.documentElement
        const hasExtensionAttributes = htmlElement.hasAttribute('foxified') || 
                                     htmlElement.hasAttribute('data-extension') ||
                                     htmlElement.hasAttribute('data-browser-extension')

        if (hasExtensionAttributes && debug) {
          console.warn('Browser extension attributes detected:', {
            foxified: htmlElement.getAttribute('foxified'),
            dataExtension: htmlElement.getAttribute('data-extension'),
            dataBrowserExtension: htmlElement.getAttribute('data-browser-extension')
          })
        }

        // Check for hydration errors in DOM
        const hydrationErrors = document.querySelectorAll('[data-hydration-error]')
        if (hydrationErrors.length > 0) {
          if (debug) {
            console.warn('Hydration errors detected in DOM:', hydrationErrors)
          }
          setHydrationError(true)
        }

        // Set error state if any issues detected
        if (hasHydrationWarning || hasExtensionAttributes) {
          setHydrationError(true)
        }

        // Restore original console.error
        setTimeout(() => {
          console.error = originalError
        }, 100)

      } catch (error) {
        if (debug) {
          console.warn('Error checking hydration status:', error)
        }
        // If there's an error checking, assume there might be a hydration issue
        setHydrationError(true)
      }
    }

    // Set mounted state
    setHasMounted(true)
    
    // Check for hydration errors after a short delay
    const timer = setTimeout(checkHydrationError, 100)
    
    return () => clearTimeout(timer)
  }, [debug])

  // Show fallback if there's a hydration error, component hasn't mounted, or clientOnly is true
  if (!hasMounted || hydrationError || clientOnly) {
    if (debug && hydrationError) {
      console.warn('HydrationGuard: Showing fallback due to hydration error')
    }
    if (debug && clientOnly) {
      console.log('HydrationGuard: Showing fallback due to clientOnly flag')
    }
    return <>{fallback}</>
  }

  return (
    <div suppressHydrationWarning={suppressHydrationWarning}>
      {children}
    </div>
  )
}

/**
 * Hook to check if component has mounted (client-side)
 * Useful for preventing hydration mismatches
 */
export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return hasMounted
}

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
 * Component wrapper for client-only content
 * Automatically shows fallback during SSR and initial render
 */
export function ClientOnly({ 
  children, 
  fallback = null 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  return (
    <HydrationGuard fallback={fallback} clientOnly={true}>
      {children}
    </HydrationGuard>
  )
}

/**
 * Component wrapper for content that might be affected by browser extensions
 * Automatically handles hydration mismatches caused by browser extensions
 */
export function BrowserExtensionSafe({ 
  children, 
  fallback = null,
  debug = false
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode
  debug?: boolean
}) {
  return (
    <HydrationGuard fallback={fallback} debug={debug} suppressHydrationWarning={true}>
      {children}
    </HydrationGuard>
  )
} 