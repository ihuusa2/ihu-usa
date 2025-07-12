'use client'

import React from 'react';
import { ShimmerSkeleton } from '../ui/shimmer-skeleton';

const NavbarSkeleton = () => {
  return (
    <header className="bg-white shadow-sm animate-in fade-in duration-300">
      {/* Top Contact Bar Skeleton */}
      <div className="bg-[#333] py-1 sm:py-2 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 w-full">
            {/* Left: Social Media Icons */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((i) => (
                <ShimmerSkeleton 
                  key={i} 
                  className="h-8 w-8 rounded-full bg-gray-600" 
                  shimmerDelay={i * 100}
                />
              ))}
            </div>
            
            {/* Center: Search Bar */}
            <div className="flex-1 flex items-center justify-center max-w-md">
              <div className="hidden sm:flex items-center w-full bg-white rounded-md overflow-hidden shadow-sm">
                <ShimmerSkeleton className="flex-1 h-8 bg-gray-200" />
                <ShimmerSkeleton className="h-8 w-16 bg-gray-300" shimmerDelay={200} />
              </div>
            </div>
            
            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <ShimmerSkeleton className="h-8 w-16 rounded-md bg-gray-600" shimmerDelay={300} />
              <ShimmerSkeleton className="hidden sm:block h-8 w-20 rounded-md bg-gray-600" shimmerDelay={400} />
              <ShimmerSkeleton className="h-8 w-20 rounded-md bg-gray-600" shimmerDelay={500} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Skeleton */}
      <div className="bg-white py-1 sm:py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Mobile Layout: Hamburger on left, Logo center */}
            <div className="lg:hidden flex items-center justify-between w-full">
              {/* Left: Mobile Navigation */}
              <div className="flex-shrink-0">
                <ShimmerSkeleton className="h-10 w-10 rounded-xl" shimmerDelay={100} />
              </div>
              {/* Center: Logo */}
              <div className="flex-1 flex items-center justify-center">
                <ShimmerSkeleton className="h-12 w-32 sm:w-40 md:w-48" shimmerDelay={200} />
              </div>
              {/* Right: Empty space for balance */}
              <div className="flex-shrink-0 w-12"></div>
            </div>
            
            {/* Desktop Layout: Logo on left, Navigation center */}
            <div className="hidden lg:flex items-center justify-between w-full">
              {/* Left Section - Logo */}
              <div className="flex-shrink-0">
                <ShimmerSkeleton className="h-12 w-32 sm:w-40 md:w-48 lg:w-56" shimmerDelay={100} />
              </div>
              {/* Center Section - Navigation */}
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-4xl flex items-center justify-center space-x-8">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="flex items-center space-x-1">
                      <ShimmerSkeleton 
                        className="h-4 w-16" 
                        shimmerDelay={i * 50}
                      />
                      {i === 2 || i === 3 || i === 5 || i === 6 ? (
                        <ShimmerSkeleton 
                          className="h-3 w-3" 
                          shimmerDelay={i * 50 + 25}
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Skeleton */}
      <div className="sm:hidden bg-gradient-to-r from-gray-50 to-gray-100 py-2 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-sm mx-auto">
            <ShimmerSkeleton className="h-10 w-full rounded-lg" shimmerDelay={300} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavbarSkeleton; 