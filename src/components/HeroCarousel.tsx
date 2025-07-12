'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Image from 'next/image'

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [imageError, setImageError] = useState<{[key: number]: boolean}>({})
  const [isHydrated, setIsHydrated] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const totalSlides = 3

  // Banner images array
  const bannerImages = useMemo(() => [
    '/Images/Banners/banner1.jpeg',
    '/Images/Banners/banner2.jpeg',
    '/Images/Banners/banner3.jpeg'
  ], [])

  // Set hydrated state after component mounts
  useEffect(() => {
    setIsHydrated(true)
  }, [])



  // Auto-advance slides
  useEffect(() => {
    if (isAutoPlaying && isHydrated) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides)
      }, 4000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying, totalSlides, isHydrated])

  // Touch handlers for mobile swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
    setIsAutoPlaying(false)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    } else if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
    }

    setTimeout(() => setIsAutoPlaying(true), 3000)
  }, [touchStart, touchEnd, totalSlides])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 3000)
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 3000)
  }, [totalSlides])

  const previousSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 3000)
  }, [totalSlides])

  const handleImageError = useCallback((index: number) => {
    console.error(`Failed to load image in carousel: ${bannerImages[index]}`)
    setImageError(prev => ({ ...prev, [index]: true }))
  }, [bannerImages])

  const handleImageLoad = useCallback((index: number) => {
    console.log(`Successfully loaded image in carousel: ${bannerImages[index]}`)
  }, [bannerImages])

  // Show skeleton only during initial load, not during hydration
  if (!isHydrated) {
    return (
      <div 
        className="relative bg-gray-900 overflow-hidden h-[250px] md:h-[350px] lg:h-[450px] xl:h-[500px] 2xl:h-[600px]"
        style={{
          width: '100%',
          minHeight: '250px'
        }}
      >
        {/* Skeleton background */}
        <div 
          className="w-full h-full animate-pulse"
          style={{
            background: 'linear-gradient(135deg, #fed7aa, #fbbf24)',
            width: '100%',
            height: '100%'
          }}
        />
        
        {/* Skeleton navigation buttons */}
        <div
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 rounded-full shadow-lg animate-pulse"
          style={{
            width: '36px',
            height: '36px'
          }}
        />
        
        <div
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 rounded-full shadow-lg animate-pulse"
          style={{
            width: '36px',
            height: '36px'
          }}
        />

        {/* Skeleton indicators */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="rounded-full animate-pulse"
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: 'rgba(255,255,255,0.5)'
              }}
            />
          ))}
        </div>

        {/* Skeleton progress bar */}
        <div 
          className="absolute bottom-0 left-0 w-full"
          style={{ height: '3px', backgroundColor: 'rgba(0,0,0,0.3)' }}
        >
          <div 
            className="h-full animate-pulse"
            style={{
              width: '33%',
              background: 'linear-gradient(to right, #f97316, #f59e0b)'
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div 
      className="relative bg-gray-900 overflow-hidden hero-carousel h-[250px] md:h-[350px] lg:h-[450px] xl:h-[500px] 2xl:h-[600px]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        width: '100%',
        minHeight: '250px',
        zIndex: 1,
        position: 'relative'
      }}
    >


      {/* Image slides with fade transition */}
      {Array.from({ length: totalSlides }, (_, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: index === currentSlide ? 1 : 0,
            zIndex: index === currentSlide ? 2 : 1
          }}
        >
          <div 
            className="relative w-full h-full"
            style={{ width: '100%', height: '100%' }}
          >
            {!imageError[index] ? (
              <Image
                src={bannerImages[index]}
                alt={`Hero Banner ${index + 1}`}
                fill
                className="object-cover object-center"
                onError={() => handleImageError(index)}
                onLoad={() => handleImageLoad(index)}
                priority={index === 0}
                sizes="100vw"
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #f97316, #f59e0b, #f97316)',
                  width: '100%',
                  height: '100%'
                }}
              >
                <div className="text-white text-center">
                  <div className="text-2xl font-bold mb-2">Banner {index + 1}</div>
                  <div className="text-sm">Image not available</div>
                  <div className="text-xs mt-1">{bannerImages[index]}</div>
                </div>
              </div>
            )}
            
            {/* Light overlay for better contrast */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.2), rgba(0,0,0,0.05), rgba(0,0,0,0.1))'
              }}
            />
          </div>
        </div>
      ))}

      {/* Navigation buttons */}
      <button
        onClick={previousSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 text-gray-800 rounded-full shadow-lg z-20 transition-all duration-300 hover:bg-opacity-100 hover:scale-110"
        style={{
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 text-gray-800 rounded-full shadow-lg z-20 transition-all duration-300 hover:bg-opacity-100 hover:scale-110"
        style={{
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide indicators */}
      <div 
        className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20"
      >
        {Array.from({ length: totalSlides }, (_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="rounded-full transition-all duration-300"
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
              transform: index === currentSlide ? 'scale(1.2)' : 'scale(1)'
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div 
        className="absolute bottom-0 left-0 w-full z-20"
        style={{ height: '3px', backgroundColor: 'rgba(0,0,0,0.3)' }}
      >
        <div 
          className="h-full transition-all duration-300 ease-out"
          style={{
            width: `${((currentSlide + 1) / totalSlides) * 100}%`,
            background: 'linear-gradient(to right, #f97316, #f59e0b)'
          }}
        />
      </div>
    </div>
  )
}

export default HeroCarousel