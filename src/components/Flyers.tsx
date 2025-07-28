'use client'

import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getActiveFlyers } from '@/Server/Flyers'
import { Flyers } from '@/Types/Gallery'
import { FaChevronLeft, FaChevronRight, FaExternalLinkAlt, FaPlay, FaPause, FaEye } from 'react-icons/fa'
import { useMobileDetection } from '@/hooks/useMobileDetection'

const FlyersSection = () => {
  const [flyers, setFlyers] = useState<Flyers[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const { isMobile } = useMobileDetection()

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  useEffect(() => {
    const fetchFlyers = async () => {
      try {
        const activeFlyers = await getActiveFlyers()
        setFlyers(activeFlyers)
      } catch (error) {
        console.error('Error fetching flyers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFlyers()
  }, [])

  // Auto-advance carousel
  useEffect(() => {
    if (flyers.length <= 1 || !isAutoPlaying || isHovered) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % flyers.length)
    }, 4000) // Change every 4 seconds

    return () => clearInterval(interval)
  }, [flyers.length, isAutoPlaying, isHovered])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flyers.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + flyers.length) % flyers.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  // Touch handlers for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextSlide()
    }
    if (isRightSwipe) {
      prevSlide()
    }
  }

  if (loading) {
    return (
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 relative overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-200 rounded-2xl sm:rounded-3xl"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (flyers.length === 0) {
    return (
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-40 sm:w-80 h-40 sm:h-80 bg-indigo-300/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-5">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-md border border-blue-200/60 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 shadow-lg">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-semibold text-gray-700">Latest Updates</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 text-gray-800 leading-tight">
              Stay Updated with Our
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 block">
                Latest Flyers
              </span>
            </h2>
            
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-blue-200/60 p-6 sm:p-8 md:p-12 max-w-2xl mx-auto">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FaEye className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <p className="text-gray-600 text-base sm:text-lg font-medium mb-2">No active flyers available at the moment.</p>
              <p className="text-gray-500 text-sm">Check back soon for exciting updates and announcements!</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-40 sm:w-80 h-40 sm:h-80 bg-indigo-300/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-96 h-48 sm:h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-5">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-md border border-blue-200/60 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 shadow-lg">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm font-semibold text-gray-700">Latest Updates</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 text-gray-800 leading-tight">
            Stay Updated with Our
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 block">
              Latest Flyers
            </span>
          </h2>
        </div>

        {/* Flyers Carousel */}
        <div 
          className="relative" 
          ref={carouselRef}
          onMouseEnter={() => !isMobile && setIsHovered(true)}
          onMouseLeave={() => !isMobile && setIsHovered(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          
          {/* Main Flyer Display */}
          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-blue-200/60 overflow-hidden group">
            <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[32rem] 2xl:h-[36rem]">
              {flyers.map((flyer, index) => (
                <div
                  key={flyer._id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                  }`}
                >
                  <div className="relative w-full h-full">
                    {/* Flyer Image */}
                    <Image
                      src={flyer.image as string}
                      alt={flyer.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                      priority={index === 0}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    
                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
                      <div className="max-w-2xl">
                        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 text-white leading-tight">
                          {flyer.title}
                        </h3>
                        {flyer.description && (
                          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 mb-4 sm:mb-6 md:mb-8 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                            {flyer.description}
                          </p>
                        )}
                        
                        {/* Action Button */}
                        {flyer.link && (
                          <Link 
                            href={flyer.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 sm:gap-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 border border-white/30 font-semibold text-xs sm:text-sm md:text-base group/btn touch-manipulation"
                          >
                            <span>Learn More</span>
                            <FaExternalLinkAlt className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows - Always visible on mobile */}
            {flyers.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className={`absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/30 touch-manipulation ${
                    isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                  aria-label="Previous flyer"
                >
                  <FaChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>
                
                <button
                  onClick={nextSlide}
                  className={`absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/30 touch-manipulation ${
                    isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                  aria-label="Next flyer"
                >
                  <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>
              </>
            )}

            {/* Auto-play Toggle */}
            {flyers.length > 1 && (
              <button
                onClick={toggleAutoPlay}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/30 touch-manipulation"
                aria-label={isAutoPlaying ? 'Pause auto-play' : 'Start auto-play'}
              >
                {isAutoPlaying ? <FaPause className="w-3 h-3 sm:w-4 sm:h-4" /> : <FaPlay className="w-3 h-3 sm:w-4 sm:h-4" />}
              </button>
            )}
          </div>

          {/* Dots Indicator */}
          {flyers.length > 1 && (
            <div className="flex justify-center mt-6 sm:mt-8 md:mt-10 space-x-2 sm:space-x-3 md:space-x-4">
              {flyers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 touch-manipulation ${
                    index === currentIndex
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 scale-125 shadow-lg'
                      : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
                  }`}
                  aria-label={`Go to flyer ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Flyer Counter */}
          {flyers.length > 1 && (
            <div className="text-center mt-4 sm:mt-6 md:mt-8">
              <span className="text-xs sm:text-sm md:text-base text-gray-600 font-medium bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full border border-gray-200">
                {currentIndex + 1} of {flyers.length}
              </span>
            </div>
          )}

          {/* Mobile Swipe Indicator */}
          {isMobile && flyers.length > 1 && (
            <div className="text-center mt-4">
              <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-gray-600 border border-gray-200">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
                <span>Swipe to navigate</span>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default FlyersSection 