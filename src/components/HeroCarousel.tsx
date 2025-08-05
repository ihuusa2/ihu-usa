'use client'

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface CarouselImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

interface HeroCarouselProps {
  images: CarouselImage[];
  autoPlay?: boolean;
  interval?: number;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ 
  images, 
  autoPlay = true, 
  interval = 5000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const { isMobile } = useMobileDetection();

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, images.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  // Touch handlers for mobile swipe - optimized for mobile
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    
    // Prevent default scrolling on horizontal swipe for mobile
    if (isMobile && touchStart !== null) {
      const distance = Math.abs(touchStart - e.targetTouches[0].clientX);
      if (distance > 10) {
        e.preventDefault();
      }
    }
  }, [isMobile, touchStart]);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const swipeThreshold = isMobile ? 30 : 50; // Lower threshold for mobile
    const isLeftSwipe = distance > swipeThreshold;
    const isRightSwipe = distance < -swipeThreshold;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, goToNext, goToPrevious, isMobile]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section 
      className={`relative w-full overflow-hidden ${
        isMobile 
          ? 'h-[50vw] min-h-[200px] max-h-[300px]' // Use viewport width for better mobile scaling
          : 'h-[350px] md:h-[500px] lg:h-[650px] xl:h-[750px] 2xl:h-[850px] 3xl:h-[900px]'
      }`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Carousel Container */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Image */}
            <div className={`relative w-full h-full ${isMobile ? 'p-2' : ''}`}>
              <div className="relative w-full h-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className={`${
                    isMobile 
                      ? 'object-contain object-center' // Use object-contain for mobile to prevent cropping
                      : 'object-cover object-center'   // Keep object-cover for desktop
                  } transition-transform duration-300`}
                  priority={index === 0}
                  sizes={
                    isMobile 
                      ? '100vw' // Simplified for mobile
                      : '(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw'
                  }
                  style={{
                    // Ensure images are properly centered
                    objectPosition: 'center center'
                  }}
                />
                {/* Gradient Overlay - lighter on mobile for better visibility */}
                <div className={`absolute inset-0 ${
                  isMobile 
                    ? 'bg-gradient-to-br from-black/10 via-black/5 to-black/10'
                    : 'bg-gradient-to-br from-black/20 via-black/10 to-black/20'
                }`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Smaller Size */}
      <button
        onClick={goToPrevious}
        className={`absolute top-1/2 transform -translate-y-1/2 bg-white/40 hover:bg-white/60 backdrop-blur-sm text-white rounded-full transition-all duration-300 hover:scale-105 z-10 shadow-md hover:shadow-lg ${
          isMobile 
            ? 'left-2 w-8 h-8 flex items-center justify-center' // Smaller mobile buttons
            : 'left-3 md:left-4 lg:left-5 w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 flex items-center justify-center'
        }`}
        aria-label="Previous slide"
      >
        <FaChevronLeft className={`${
          isMobile 
            ? 'text-xs' // Smaller icon for mobile
            : 'text-xs md:text-sm lg:text-base'
        }`} />
      </button>
      
      <button
        onClick={goToNext}
        className={`absolute top-1/2 transform -translate-y-1/2 bg-white/40 hover:bg-white/60 backdrop-blur-sm text-white rounded-full transition-all duration-300 hover:scale-105 z-10 shadow-md hover:shadow-lg ${
          isMobile 
            ? 'right-2 w-8 h-8 flex items-center justify-center' // Smaller mobile buttons
            : 'right-3 md:right-4 lg:right-5 w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 flex items-center justify-center'
        }`}
        aria-label="Next slide"
      >
        <FaChevronRight className={`${
          isMobile 
            ? 'text-xs' // Smaller icon for mobile
            : 'text-xs md:text-sm lg:text-base'
        }`} />
      </button>

      {/* Dots Indicator - Mobile Optimized */}
      <div className={`absolute left-1/2 transform -translate-x-1/2 flex z-10 ${
        isMobile 
          ? 'bottom-4 space-x-2' // Better spacing and positioning for mobile
          : 'bottom-2 sm:bottom-4 md:bottom-6 lg:bottom-8 xl:bottom-10 2xl:bottom-12 3xl:bottom-16 space-x-1 sm:space-x-1.5 md:space-x-2 lg:space-x-2.5 xl:space-x-3 2xl:space-x-3.5 3xl:space-x-4'
      }`}>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all duration-300 ${
              isMobile 
                ? 'w-2.5 h-2.5 sm:w-3 sm:h-3' // Larger, more touchable dots for mobile
                : 'w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 lg:w-2.5 lg:h-2.5 xl:w-3 xl:h-3 2xl:w-3.5 2xl:h-3.5 3xl:w-4 3xl:h-4'
            } ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar - Hidden on mobile for cleaner look */}
      {autoPlay && !isMobile && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 sm:h-1 md:h-1.5 lg:h-2 xl:h-2.5 2xl:h-3 3xl:h-4 bg-white/20">
          <div 
            className="h-full bg-white transition-all duration-1000 ease-linear"
            style={{ 
              width: `${((currentIndex + 1) / images.length) * 100}%` 
            }}
          />
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;