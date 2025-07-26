'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getActiveFlyers } from '@/Server/Flyers'
import { Flyers } from '@/Types/Gallery'
import { FaChevronLeft, FaChevronRight, FaExternalLinkAlt } from 'react-icons/fa'

const FlyersSection = () => {
  const [flyers, setFlyers] = useState<Flyers[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

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
    if (flyers.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % flyers.length)
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [flyers.length])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flyers.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + flyers.length) % flyers.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (loading) {
    return (
      <section className="py-8 sm:py-12 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-64 sm:h-80 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (flyers.length === 0) {
    return null // Don't render anything if no flyers
  }

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-purple-300/30 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-md border border-blue-200/60 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6 shadow-lg">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
            <span className="text-xs sm:text-sm font-semibold text-gray-700">Latest Updates</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-800">
            Stay Updated with Our
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 block">
              Latest Flyers
            </span>
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our latest announcements, events, and important information through our promotional flyers.
          </p>
        </div>

        {/* Flyers Carousel */}
        <div className="relative">
          {/* Main Flyer Display */}
          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-blue-200/60 overflow-hidden">
            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[28rem]">
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
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                    />
                    
                    {/* Overlay with content */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">
                          {flyer.title}
                        </h3>
                        {flyer.description && (
                          <p className="text-sm sm:text-base text-gray-200 mb-4 sm:mb-6 line-clamp-2">
                            {flyer.description}
                          </p>
                        )}
                        
                        {/* Action Button */}
                        {flyer.link && (
                          <Link 
                            href={flyer.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 transform hover:scale-105 border border-white/30"
                          >
                            <span className="text-sm sm:text-base font-semibold">Learn More</span>
                            <FaExternalLinkAlt className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {flyers.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/30"
                  aria-label="Previous flyer"
                >
                  <FaChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/30"
                  aria-label="Next flyer"
                >
                  <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </>
            )}
          </div>

          {/* Dots Indicator */}
          {flyers.length > 1 && (
            <div className="flex justify-center mt-6 sm:mt-8 space-x-2 sm:space-x-3">
              {flyers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to flyer ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Flyer Counter */}
          {flyers.length > 1 && (
            <div className="text-center mt-4 sm:mt-6">
              <span className="text-sm sm:text-base text-gray-600 font-medium">
                {currentIndex + 1} of {flyers.length}
              </span>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-xs sm:text-sm text-gray-500">
            Click on the flyers to learn more about our latest updates and announcements.
          </p>
        </div>
      </div>
    </section>
  )
}

export default FlyersSection 