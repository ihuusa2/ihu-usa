'use client'

import React, { useState, useMemo } from 'react'
import { Course } from '@/Types/Courses'
import { getAllCourses } from '@/Server/Course'
import Link from 'next/link'
import Image from 'next/image'

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Custom Container Component
const Container = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
        {children}
    </div>
)

// Custom Pagination Component
const Pagination = ({ count }: { count: number }) => {
    return (
        <div className="flex justify-center items-center gap-4 mt-12">
            <button className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
            </button>
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                    Page 1 of {Math.ceil(count / 10)}
                </span>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 border border-transparent rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg">
                Next
            </button>
        </div>
    )
}

// Custom Course Card Component
const CourseCard = ({ item, isHighlighted = false }: { item: Course, isHighlighted?: boolean }) => {
    return (
        <div className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 hover:border-orange-400 ${isHighlighted ? 'ring-2 ring-orange-500 ring-opacity-50' : ''}`}>
            {/* Featured Badge */}
            {isHighlighted && (
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    ⭐ FEATURED
                </div>
            )}

            {/* Image Section */}
            <div className="relative w-full h-48 sm:h-52 md:h-56 lg:h-60 xl:h-64 overflow-hidden">
                <Image 
                    src={item.images?.[0] as string} 
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                    priority={isHighlighted}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Hover Content */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-100 scale-95">
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
            <div className="flex-1 flex flex-col space-y-3 sm:space-y-4 p-4 sm:p-6 bg-white">
                {/* Course Title */}
                <div className="space-y-2">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300 min-h-[3rem] sm:min-h-[3.5rem] leading-tight sm:leading-7">
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
                    className="text-gray-600 text-sm line-clamp-3 leading-relaxed flex-1"
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
                        <Link href={`/Course/${item?.slug}`} className="w-full block">
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
                        
                        <Link href={`/Registration-Form?course=${encodeURIComponent(item.title)}&courseType=${encodeURIComponent(item.type)}`} className="w-full block">
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

// Search and Filter Component
const SearchAndFilter = ({ 
    searchQuery, 
    setSearchQuery, 
    selectedLevel, 
    setSelectedLevel 
}: {
    searchQuery: string
    setSearchQuery: (query: string) => void
    selectedLevel: string
    setSelectedLevel: (level: string) => void
}) => {
    return (
        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Search courses..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full sm:w-80 transition-all duration-200"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
            <select 
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-all duration-200"
            >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
            </select>
        </div>
    )
}

// No Results Component
const NoResults = ({ searchQuery, selectedLevel }: { searchQuery: string, selectedLevel: string }) => {
    return (
        <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-4">
                {searchQuery && `No courses match "${searchQuery}"`}
                {selectedLevel && searchQuery && ' and '}
                {selectedLevel && `No courses match the "${selectedLevel}" level`}
                {!searchQuery && !selectedLevel && 'Try adjusting your search criteria'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                    Clear Filters
                </button>
                <Link href="/Contact" className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300">
                    Contact Us
                </Link>
            </div>
        </div>
    )
}

const Courses = ({ params, searchParams }: Props) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedLevel, setSelectedLevel] = useState('')
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [originalCount, setOriginalCount] = useState(0)

    // Fetch courses on component mount
    React.useEffect(() => {
        const fetchCourses = async () => {
            try {
                const paramsList = await params
                const slug = paramsList?.slug
                    .replaceAll('-', ' ')
                    .replace(/\b\w/g, char => char.toUpperCase())

                const searchParamsList = await searchParams
                const data: { list: Course[], count: number } = await getAllCourses({ 
                    params: { type: slug }, 
                    searchParams: searchParamsList 
                }) as { list: Course[], count: number }
                
                setCourses(data.list || [])
                setOriginalCount(data.count || 0)
            } catch (error) {
                console.error('Error fetching courses:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCourses()
    }, [params, searchParams])

    // Filter courses based on search query and level
    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchesSearch = !searchQuery || 
                course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.type?.toLowerCase().includes(searchQuery.toLowerCase())
            
            const matchesLevel = !selectedLevel || course.type === selectedLevel
            
            return matchesSearch && matchesLevel
        })
    }, [courses, searchQuery, selectedLevel])

    const [slug, setSlug] = React.useState('')

    React.useEffect(() => {
        const getSlug = async () => {
            try {
                const paramsList = await params
                const slugValue = paramsList?.slug
                    ?.replaceAll('-', ' ')
                    .replace(/\b\w/g, (char: string) => char.toUpperCase()) || ''
                setSlug(slugValue)
            } catch (error) {
                console.error('Error getting slug:', error)
            }
        }
        getSlug()
    }, [params])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 flex items-center justify-center">
                <Container>
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading courses...</p>
                    </div>
                </Container>
            </div>
        )
    }

    if (originalCount === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-orange-50">
                <Container>
                    <div className="text-center space-y-6 max-w-2xl mx-auto">
                        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                            <svg className="w-16 h-16 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">No {slug} Courses Available</h1>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            We&apos;re working on adding new courses in this category. Check back soon for exciting learning opportunities, or explore our other course categories.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                            <Link href="/Courses/Certification" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                Browse All Courses
                            </Link>
                            <Link href="/Contact" className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    const courseStats = {
        totalStudents: "10,000+",
        completionRate: "95%",
        satisfaction: "4.9/5"
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-600 via-red-500 to-orange-700 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 bg-[url('/Images/about1.png')] bg-cover bg-center opacity-10"></div>
                <Container className="relative py-20 md:py-28">
                    <div className="text-center max-w-4xl mx-auto space-y-6">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            {filteredCourses.length} of {originalCount} Courses Available
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                            Master {slug} with <span className="text-yellow-300">Expert Guidance</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                            Transform your spiritual journey with our comprehensive {slug.toLowerCase()} courses designed by renowned experts and spiritual masters.
                        </p>
                        
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
                            {Object.entries(courseStats).map(([key, value]) => (
                                <div key={key} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-yellow-300">{value}</div>
                                    <div className="text-white/80 capitalize font-medium mt-1">
                                        {key === 'totalStudents' ? 'Students Enrolled' : 
                                         key === 'completionRate' ? 'Completion Rate' : 
                                         'Average Rating'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </div>

            {/* Features Section */}
            <Container className="py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {[
                        {
                            icon: "🎓",
                            title: "Expert Instructors",
                            description: "Learn from recognized masters and scholars in the field"
                        },
                        {
                            icon: "📱",
                            title: "Flexible Learning",
                            description: "Study at your own pace with online and offline resources"
                        },
                        {
                            icon: "🏆",
                            title: "Certified Programs",
                            description: "Earn recognized certificates upon course completion"
                        }
                    ].map((feature, index) => (
                        <div key={index} className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* Course Grid Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Available {slug} Courses
                        </h2>
                        <p className="text-gray-600 text-lg">
                            {searchQuery || selectedLevel ? (
                                <>
                                    Found {filteredCourses.length} courses matching your criteria
                                    {(searchQuery || selectedLevel) && (
                                        <button 
                                            onClick={() => {
                                                setSearchQuery('')
                                                setSelectedLevel('')
                                            }}
                                            className="ml-2 text-orange-600 hover:text-orange-700 underline"
                                        >
                                            Clear filters
                                        </button>
                                    )}
                                </>
                            ) : (
                                `Choose from ${originalCount} carefully curated courses designed to deepen your understanding and practice.`
                            )}
                        </p>
                    </div>
                    
                    {/* Search and Filter */}
                    <SearchAndFilter 
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        selectedLevel={selectedLevel}
                        setSelectedLevel={setSelectedLevel}
                    />
                </div>

                {/* Course Grid */}
                {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
                        {filteredCourses.map((item, index) => (
                            <div key={item._id?.toString()} className="group">
                                <CourseCard 
                                    item={item} 
                                    isHighlighted={index < 3} // Highlight first 3 courses
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <NoResults searchQuery={searchQuery} selectedLevel={selectedLevel} />
                )}

                {/* Call to Action Section */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden mb-16">
                    <div className="absolute inset-0 bg-[url('/Images/mission.png')] bg-cover bg-center opacity-10"></div>
                    <div className="relative space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">Ready to Begin Your Spiritual Journey?</h2>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto">
                            Join thousands of students who have transformed their lives through our authentic spiritual education programs.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="/Registration-Form" className="inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                <span>Start Your Application</span>
                                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </a>
                            <a href="/Contact" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-medium rounded-xl hover:bg-white hover:text-orange-600 transition-all duration-300">
                                Talk to an Advisor
                            </a>
                        </div>
                    </div>
                </div>

                {/* Testimonials Preview */}
                <div className="mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
                        What Our Students Say
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                quote: "The depth of knowledge and spiritual guidance I received transformed my understanding completely.",
                                name: "Priya Sharma",
                                course: "Vedic Studies",
                                rating: 5
                            },
                            {
                                quote: "Expert instructors and flexible learning made it possible for me to balance my spiritual growth with daily life.",
                                name: "Raj Patel",
                                course: "Yoga Philosophy",
                                rating: 5
                            },
                            {
                                quote: "This program gave me authentic insights into ancient wisdom that I couldn't find anywhere else.",
                                name: "Maya Singh",
                                course: "Sanskrit Studies",
                                rating: 5
                            }
                        ].map((testimonial, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                <div className="flex mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                                <div>
                                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                    <div className="text-sm text-gray-500">{testimonial.course} Student</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination */}
                <Pagination count={filteredCourses.length} />
            </Container>
        </div>
    )
}   

export default Courses
