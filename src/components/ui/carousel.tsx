"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselProps {
  children: React.ReactNode
  opts?: {
    loop?: boolean
    autoPlay?: boolean
    interval?: number
  }
  className?: string
}

interface CarouselContentProps {
  children: React.ReactNode
  className?: string
}

interface CarouselItemProps {
  children: React.ReactNode
  className?: string
}

interface CarouselPreviousProps {
  className?: string
  onClick?: () => void
}

interface CarouselNextProps {
  className?: string
  onClick?: () => void
}

interface CarouselIndicatorProps {
  className?: string
}

const CarouselContext = React.createContext<{
  currentSlide: number
  totalSlides: number
  setTotalSlides: (n: number) => void
  goToSlide: (index: number) => void
  nextSlide: () => void
  previousSlide: () => void
  loop: boolean
}>({
  currentSlide: 0,
  totalSlides: 0,
  setTotalSlides: () => {},
  goToSlide: () => {},
  nextSlide: () => {},
  previousSlide: () => {},
  loop: false,
})

function Carousel({ children, opts = {}, className }: CarouselProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [totalSlides, setTotalSlides] = React.useState(0)
  const { loop = false, autoPlay = false, interval = 5000 } = opts

  const goToSlide = React.useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index)
    } else if (loop) {
      if (index < 0) {
        setCurrentSlide(totalSlides - 1)
      } else {
        setCurrentSlide(0)
      }
    }
  }, [totalSlides, loop])

  const nextSlide = React.useCallback(() => {
    goToSlide(currentSlide + 1)
  }, [currentSlide, goToSlide])

  const previousSlide = React.useCallback(() => {
    goToSlide(currentSlide - 1)
  }, [currentSlide, goToSlide])

  // Auto-play functionality
  React.useEffect(() => {
    if (!autoPlay || totalSlides <= 1) return

    const timer = setInterval(() => {
      nextSlide()
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, nextSlide, totalSlides])

  const contextValue = React.useMemo(() => ({
    currentSlide,
    totalSlides,
    setTotalSlides,
    goToSlide,
    nextSlide,
    previousSlide,
    loop,
  }), [currentSlide, totalSlides, goToSlide, nextSlide, previousSlide, loop])

  return (
    <CarouselContext.Provider value={contextValue}>
      <div className={`relative w-full ${className || ''}`}>
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ children, className }: CarouselContentProps) {
  const { currentSlide, setTotalSlides } = React.useContext(CarouselContext)
  const childrenArray = React.Children.toArray(children)

  // Set totalSlides when children change
  React.useEffect(() => {
    setTotalSlides(childrenArray.length)
  }, [childrenArray.length, setTotalSlides])

  return (
    <div className={`overflow-hidden ${className || ''}`}>
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          width: `${childrenArray.length * 100}%`
        }}
      >
        {children}
      </div>
    </div>
  )
}

function CarouselItem({ children, className }: CarouselItemProps) {
  return (
    <div className={`flex-shrink-0 w-full ${className || ''}`}>
      {children}
    </div>
  )
}

function CarouselPrevious({ className, onClick }: CarouselPreviousProps) {
  const { previousSlide } = React.useContext(CarouselContext)
  
  const handleClick = () => {
    previousSlide()
    onClick?.()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        absolute left-4 top-1/2 -translate-y-1/2 
        rounded-full bg-white/90 dark:bg-gray-800/90 p-3 
        shadow-lg hover:bg-white dark:hover:bg-gray-800 
        focus:outline-none focus:ring-2 focus:ring-blue-500 
        transition-all duration-200 ease-in-out
        hover:scale-105 active:scale-95
        ${className || ''}
      `}
    >
      <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      <span className="sr-only">Previous slide</span>
    </button>
  )
}

function CarouselNext({ className, onClick }: CarouselNextProps) {
  const { nextSlide } = React.useContext(CarouselContext)
  
  const handleClick = () => {
    nextSlide()
    onClick?.()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        absolute right-4 top-1/2 -translate-y-1/2 
        rounded-full bg-white/90 dark:bg-gray-800/90 p-3 
        shadow-lg hover:bg-white dark:hover:bg-gray-800 
        focus:outline-none focus:ring-2 focus:ring-blue-500 
        transition-all duration-200 ease-in-out
        hover:scale-105 active:scale-95
        ${className || ''}
      `}
    >
      <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      <span className="sr-only">Next slide</span>
    </button>
  )
}

function CarouselIndicators({ className }: CarouselIndicatorProps) {
  const { currentSlide, totalSlides, goToSlide } = React.useContext(CarouselContext)

  if (totalSlides <= 1) return null

  return (
    <div className={`flex justify-center space-x-2 mt-4 ${className || ''}`}>
      {Array.from({ length: totalSlides }, (_, index) => (
        <button
          key={index}
          onClick={() => goToSlide(index)}
          className={`
            w-3 h-3 rounded-full transition-all duration-300 ease-in-out
            ${currentSlide === index 
              ? 'bg-blue-500 scale-110' 
              : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
            }
          `}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  )
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselIndicators,
}
