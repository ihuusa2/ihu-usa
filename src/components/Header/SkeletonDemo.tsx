'use client'

import React, { useState, useEffect } from 'react';
import NavbarSkeleton from './NavbarSkeleton';

const SkeletonDemo = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const resetDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-8 p-4 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Navbar Skeleton Demo</h1>
          <p className="text-gray-600 mb-4">
            This demo shows the navbar loading skeleton for both desktop and mobile devices.
            The skeleton accurately reflects the actual navbar structure with shimmer animations.
          </p>
          <button
            onClick={resetDemo}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Reset Demo
          </button>
        </div>
      </div>

      {isLoading ? (
        <NavbarSkeleton />
      ) : (
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Navbar Loaded!</h2>
              <p className="text-gray-600">The actual navbar would appear here.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-4 mt-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Features:</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Responsive design for both mobile and desktop
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Accurate representation of actual navbar structure
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Shimmer animations with staggered delays
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Smooth fade-in transition
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Proper spacing and proportions
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SkeletonDemo; 