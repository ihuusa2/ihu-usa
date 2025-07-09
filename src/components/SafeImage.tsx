'use client'

import Image from 'next/image'
import { useState } from 'react'
import { getValidImageUrl } from '@/utils/imageUtils'
import HydrationGuard from './HydrationGuard'

interface SafeImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  fallbackSrc?: string
}

export default function SafeImage({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  priority = false,
  fallbackSrc = '/Images/Programs/image1.png'
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(getValidImageUrl(src))
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      console.error('Image failed to load:', imgSrc)
      setImgSrc(fallbackSrc)
      setHasError(true)
    }
  }

  return (
    <HydrationGuard fallback={
      <div 
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{ width, height }}
      />
    }>
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        onError={handleError}
      />
    </HydrationGuard>
  )
} 