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
                <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    ⭐ FEATURED
                </div>
            )}

            {/* Image Section */}
            <div className='relative w-full h-48 sm:h-52 md:h-56 lg:h-60 xl:h-64 overflow-hidden'>
                <Image 
                    src={item.images?.[0] as string} 
                    alt={item.title}
                    fill
                    sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw'
                    className='object-cover object-center group-hover:scale-110 transition-transform duration-700'
                    priority={isHighlighted}
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

                {/* Course Features Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-1 sm:gap-2">
                    {item.testimonialVideos && item.testimonialVideos.length > 0 && (
                        <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            </svg>
                            <span className="hidden sm:inline">{item.testimonialVideos.length} Videos</span>
                            <span className="sm:hidden">{item.testimonialVideos.length}</span>
                        </div>
                    )}
                    {item.faqs && item.faqs.length > 0 && (
                        <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                            <span className="hidden sm:inline">{item.faqs.length} FAQs</span>
                            <span className="sm:hidden">{item.faqs.length}</span>
                        </div>
                    )}
                    {item.galleryImages && item.galleryImages.length > 0 && (
                        <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            <span className="hidden sm:inline">{item.galleryImages.length} Images</span>
                            <span className="sm:hidden">{item.galleryImages.length}</span>
                        </div>
                    )}
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
                            <span className="text-xs sm:text-sm">Self-Paced</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs sm:text-sm">Certificate</span>
                        </div>
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

                {/* Quick Preview of Content */}
                {(item.testimonialVideos?.length || item.faqs?.length || item.galleryImages?.length) && (
                    <div className="pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 font-medium mb-2">Includes:</p>
                        <div className="flex flex-wrap gap-1">
                            {item.testimonialVideos && item.testimonialVideos.length > 0 && (
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                                    <span className="hidden sm:inline">📹 Testimonials</span>
                                    <span className="sm:hidden">📹</span>
                                </span>
                            )}
                            {item.faqs && item.faqs.length > 0 && (
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-700">
                                    <span className="hidden sm:inline">❓ FAQs</span>
                                    <span className="sm:hidden">❓</span>
                                </span>
                            )}
                            {item.galleryImages && item.galleryImages.length > 0 && (
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                                    <span className="hidden sm:inline">🖼️ Gallery</span>
                                    <span className="sm:hidden">🖼️</span>
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CourseCard
