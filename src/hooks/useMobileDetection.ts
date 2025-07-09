import { useState, useEffect } from 'react'

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const checkDevice = () => {
      const width = window.innerWidth
      const userAgent = navigator.userAgent.toLowerCase()
      
      // Check for mobile user agent as fallback
      const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      
      setIsMobile(width < 768 || isMobileUserAgent)
      setIsTablet(width >= 768 && width < 1024)
      setIsDesktop(width >= 1024)
    }

    // Check on mount
    checkDevice()

    // Add event listener for resize
    window.addEventListener('resize', checkDevice)

    // Cleanup
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return { isMobile: isClient ? isMobile : false, isTablet: isClient ? isTablet : false, isDesktop: isClient ? isDesktop : true, isClient }
}

export const useMobileRedirect = () => {
  const { isMobile, isClient } = useMobileDetection()
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    if (isClient && isMobile) {
      setShouldRedirect(true)
    }
  }, [isMobile, isClient])

  return { shouldRedirect, isMobile: isClient ? isMobile : false }
} 