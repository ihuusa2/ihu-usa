import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Course } from '@/Types/Courses'

interface Props {
    item: Course,
    className?: string
    isHighlighted?: boolean
}

const CourseCard = async ({ item, className = '', isHighlighted = false }: Props) => {
    return (
        <div className={`group relative flex flex-col bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 hover:border-orange-400 ${className} ${isHighlighted ? 'ring-2 ring-orange-500 ring-opacity-50' : ''}`}>
            {/* Featured Badge */}
            {isHighlighted && (
                <div className="absolute top-3 left-3 z-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    ⭐ FEATURED
                </div>
            )}

            {/* Image Section */}
            <div className='relative w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden'>
                <Image 
                    src={item.images?.[0] as string} 
                    alt={item.title}
                    fill
                    className='object-cover object-center group-hover:scale-105 transition-transform duration-700'
                    priority={isHighlighted}
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                
                {/* Gradient Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                
                {/* Hover Content */}
                <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-100 scale-95'>
                    <Link 
                        href={`/Course/${item?.slug}`} 
                        className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 text-sm sm:text-base"
                    >
                        <span>Explore Course</span>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </div>


            </div>

            {/* Content Section */}
            <div className='flex-1 flex flex-col space-y-3 sm:space-y-4 p-4 sm:p-6 bg-white'>
                {/* Course Title */}
                <div className="space-y-2">
                    <h2 className='text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300 min-h-[3rem] sm:min-h-[3.5rem] leading-tight sm:leading-7'>
                        {item.title}
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            {item.type}
                        </span>
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm text-gray-600 font-medium">4.9</span>
                        </div>
                    </div>
                </div>

                {/* Course Description Preview */}
                <div 
                    className='text-gray-600 text-sm line-clamp-3 leading-relaxed flex-1'
                    dangerouslySetInnerHTML={{ 
                        __html: item.description?.replace(/<[^>]*>/g, '').substring(0, 120) + '...' || 'Course description not available.' 
                    }} 
                />

                {/* Course Features */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3 sm:gap-4 text-sm text-gray-500 flex-wrap">
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs sm:text-sm">{item.duration || 'Self-Paced'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs sm:text-sm">Certificate</span>
                        </div>
                        {item.startDate && (
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs sm:text-sm">
                                    {new Date(item.startDate).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Enhanced CTA Buttons */}
                    <div className="flex flex-col gap-2 pt-2">
                        <Link href={`/Course/${item?.slug}`} className='w-full block'>
                            <button 
                                className={`w-full py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base ${
                                    isHighlighted 
                                        ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white' 
                                        : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white'
                                }`}
                            >
                                {isHighlighted ? '🔥 Explore Featured Course' : 'View Course Details'}
                            </button>
                        </Link>
                        
                        <Link href={`/Registration-Form?course=${encodeURIComponent(item.title)}&courseType=${encodeURIComponent(item.type)}`} className='w-full block'>
                            <button 
                                className="w-full py-2 sm:py-2.5 px-4 rounded-lg border-2 border-orange-400 text-orange-600 hover:bg-orange-50 hover:border-orange-500 transition-all duration-300 font-medium text-sm sm:text-base"
                            >
                                Quick Enroll →
                            </button>
                        </Link>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default CourseCard
