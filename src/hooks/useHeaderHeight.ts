'use client'

import { useEffect, useState } from 'react'

export const useHeaderHeight = () => {
  const [headerHeight, setHeaderHeight] = useState(0)

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header')
      if (header) {
        const height = header.offsetHeight
        setHeaderHeight(height)
        document.body.style.paddingTop = `${height}px`
      } else {
        // Fallback: set a reasonable default height if header is not found
        const defaultHeight = 120 // Approximate header height
        setHeaderHeight(defaultHeight)
        document.body.style.paddingTop = `${defaultHeight}px`
      }
    }

    // Initial calculation with a small delay to ensure DOM is ready
    const initialTimer = setTimeout(updateHeaderHeight, 100)

    // Update on window resize
    window.addEventListener('resize', updateHeaderHeight)

    // Update when DOM changes (for dynamic content)
    const observer = new MutationObserver(updateHeaderHeight)
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    })

    return () => {
      clearTimeout(initialTimer)
      window.removeEventListener('resize', updateHeaderHeight)
      observer.disconnect()
      // Reset padding when component unmounts
      document.body.style.paddingTop = '0px'
    }
  }, [])

  return headerHeight
} 