"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPopupSettings } from '@/Server/PopupSettings';
import { PopupSettings } from '@/Types/PopupSettings';
import HydrationGuard from '@/components/HydrationGuard';
import { FaTimes, FaArrowRight } from 'react-icons/fa';

const UpcomingCoursePopup = () => {
  const [open, setOpen] = useState(false);
  const [popupData, setPopupData] = useState<PopupSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPopupData = async () => {
      try {
        const data = await getPopupSettings();
        if (data && data.isActive) {
          setPopupData(data);
          setOpen(true);
        }
      } catch (error) {
        console.error('Error loading popup settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPopupData();
  }, []);

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (loading || !popupData || !popupData.isActive) {
    return null;
  }

  return (
    <HydrationGuard fallback={null}>
      {/* Modal Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={handleBackdropClick}
        >
          {/* Modal Content */}
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-scale">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-400 to-amber-400 px-4 sm:px-8 py-3 sm:py-4 flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-white">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                  <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-wide">
                {popupData.title || 'Upcoming Course'}
              </h2>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close modal"
              className="absolute top-3 right-3 z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/90 text-orange-600 hover:text-white hover:bg-orange-600 shadow-lg transition-all duration-200 border border-orange-200 hover:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
            >
              <FaTimes className="text-sm sm:text-base" />
            </button>
            
            {/* Content */}
            <div className="flex flex-col items-center gap-4 sm:gap-6 px-4 sm:px-8 py-6 sm:py-8 bg-white">
              <div className="w-full flex flex-col gap-3 sm:gap-4 items-center text-center">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
                  {popupData.courseName}
                </h3>
                
                <span className="inline-block bg-green-50 text-green-700 font-semibold px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm w-fit mb-3 border border-green-200 shadow-sm">
                  Online Batch Starts: <span className="font-bold text-green-800">{popupData.startDate}</span>
                </span>
                
                <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base max-w-lg">
                  {popupData.description}
                  {popupData.organization && (
                    <span> in collaboration with <span className="font-semibold text-gray-800">{popupData.organization}</span></span>
                  )}
                  {popupData.instructor && (
                    <span>, under the guidance of <span className="font-semibold text-gray-800">{popupData.instructor}</span></span>
                  )}.
                </p>
                
                <Link href={popupData.courseLink} className="mt-2 w-fit">
                  <button className="group bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 transform hover:scale-105">
                    <span>{popupData.buttonText || 'Learn More & Enroll Now'}</span>
                    <FaArrowRight className="text-sm sm:text-base group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </HydrationGuard>
  ); 
};

export default UpcomingCoursePopup; 
