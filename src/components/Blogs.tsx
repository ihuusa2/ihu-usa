'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import SafeImage from './SafeImage'
import { getValidImageUrl } from '@/utils/imageUtils'
import Container from './Container'
import Link from 'next/link'
import FadeContainer from './FadeContainer'
import { Blog } from '@/Types/Blogs'
import { ArrowRight, Clock, User, ChevronLeft, ChevronRight, BookOpen, TrendingUp } from 'lucide-react'

type Props = {
    data: {list: Blog[], count: number}
}

const Blogs = ({ data }: Props) => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const carouselRef = useRef<HTMLDivElement>(null)
    const autoplayRef = useRef<NodeJS.Timeout | null>(null)

    const totalSlides = data?.list?.length || 0
    const slidesPerView = 4 // Number of slides visible at once
    const maxSlides = Math.max(0, totalSlides - slidesPerView)

    const nextSlide = useCallback(() => {
        setCurrentSlide(prev => prev >= maxSlides ? 0 : prev + 1)
    }, [maxSlides])

    const prevSlide = useCallback(() => {
        setCurrentSlide(prev => prev <= 0 ? maxSlides : prev - 1)
    }, [maxSlides])

    const goToSlide = useCallback((index: number) => {
        setCurrentSlide(index)
    }, [])

    // Autoplay functionality
    useEffect(() => {
        if (isAutoPlaying && totalSlides > slidesPerView) {
            autoplayRef.current = setInterval(() => {
                nextSlide()
            }, 5000)
        }

        return () => {
            if (autoplayRef.current) {
                clearInterval(autoplayRef.current)
            }
        }
    }, [isAutoPlaying, currentSlide, totalSlides, nextSlide])

    const handleMouseEnter = () => setIsAutoPlaying(false)
    const handleMouseLeave = () => setIsAutoPlaying(true)

    return (
        <section className='relative py-24 overflow-hidden bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/50'>
            {/* Enhanced Background decoration */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-amber-400/5 rounded-full -translate-x-48 -translate-y-48 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-saffron-500/8 to-orange-400/5 rounded-full translate-x-60 translate-y-60 blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-amber-400/5 to-orange-400/5 rounded-full -translate-x-32 -translate-y-32 blur-2xl"></div>
            </div>
            
            <Container className='relative z-10'>
                {/* Enhanced Header Section */}
                <div className='text-center mb-20'>
                    <FadeContainer direction="up" delay={0.2}>
                        <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md border border-orange-200/50 rounded-full px-8 py-4 mb-8 shadow-lg shadow-orange-100/50">
                            <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full">
                                <BookOpen className="text-white w-4 h-4" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">Latest Articles</span>
                        </div>
                    </FadeContainer>
                    
                    <FadeContainer direction="up" delay={0.4}>
                        <h2 className='text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 text-gray-900 leading-tight'>
                            Explore Our
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 block">
                                Knowledge Hub
                            </span>
                        </h2>
                    </FadeContainer>
                    
                    <FadeContainer direction="up" delay={0.6}>
                        <p className='text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-0 font-medium'>
                            Discover insights, wisdom, and knowledge from our expert instructors and community members. 
                            Dive into articles that bridge ancient traditions with modern understanding.
                        </p>
                    </FadeContainer>
                </div>

                {/* Enhanced Blogs Carousel Section */}
                <div className='mt-20'>
                    <FadeContainer direction="up" delay={0.8}>
                        <div className='relative group'>
                            {/* Enhanced Navigation Buttons */}
                            <button
                                onClick={prevSlide}
                                className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 w-14 h-14 bg-white/95 backdrop-blur-md border-2 border-orange-200 text-orange-600 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 hover:text-white shadow-xl hover:shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 rounded-full flex items-center justify-center transform hover:scale-110"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            
                            <button
                                onClick={nextSlide}
                                className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 w-14 h-14 bg-white/95 backdrop-blur-md border-2 border-orange-200 text-orange-600 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 hover:text-white shadow-xl hover:shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 rounded-full flex items-center justify-center transform hover:scale-110"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            {/* Enhanced Carousel Container */}
                            <div 
                                className='w-full overflow-hidden rounded-3xl'
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div 
                                    ref={carouselRef}
                                    className='flex transition-transform duration-700 ease-out'
                                    style={{
                                        transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)`
                                    }}
                                >
                                    {data?.list?.map((blog, index) => (
                                        <div 
                                            key={index} 
                                            className='flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-3'
                                        >
                                            <div className='group h-full'>
                                                <div className='w-full h-full bg-white/90 backdrop-blur-md border border-gray-100/50 hover:border-orange-200 shadow-xl hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 transform hover:-translate-y-3 rounded-3xl overflow-hidden flex flex-col relative'>
                                                    {/* Enhanced Image Container */}
                                                    <div className='relative overflow-hidden h-56 sm:h-60 lg:h-64'>
                                                        <SafeImage
                                                            height={300}
                                                            width={400}
                                                            alt={blog.title || 'Blog image'}
                                                            src={getValidImageUrl(blog.image)}
                                                            className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                                                        />
                                                        {/* Enhanced Overlay */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                        
                                                        {/* Enhanced Category Badge */}
                                                        <div className="absolute top-5 left-5">
                                                            <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg shadow-orange-500/25">
                                                                Article
                                                            </span>
                                                        </div>

                                                        {/* Reading Time Badge */}
                                                        <div className="absolute top-5 right-5">
                                                            <span className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                                                                5 min read
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Enhanced Content */}
                                                    <div className='p-6 sm:p-7 lg:p-8 flex-1 flex flex-col'>
                                                        <div className='flex items-center gap-3 text-sm text-gray-500 mb-4'>
                                                            <div className='flex items-center gap-2'>
                                                                <div className="p-1.5 bg-orange-100 rounded-full">
                                                                    <User className='w-3 h-3 text-orange-600' />
                                                                </div>
                                                                <span className="font-medium">IHU Team</span>
                                                            </div>
                                                            <div className='flex items-center gap-2'>
                                                                <div className="p-1.5 bg-amber-100 rounded-full">
                                                                    <Clock className='w-3 h-3 text-amber-600' />
                                                                </div>
                                                                <span className="font-medium">5 min read</span>
                                                            </div>
                                                        </div>
                                                        
                                                        <h3 className='text-lg sm:text-xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300 flex-1 leading-tight'>
                                                            {blog.title}
                                                        </h3>
                                                        
                                                        <div className='text-sm sm:text-base text-gray-600 line-clamp-3 leading-relaxed mb-6'>
                                                            {blog.description}
                                                        </div>
                                                    </div>

                                                    {/* Enhanced Footer */}
                                                    <div className='p-6 sm:p-7 lg:p-8 pt-0 mt-auto'>
                                                        <Link 
                                                            href={`/Blogs/${blog.slug}`} 
                                                            className='group/btn w-full block'
                                                        >
                                                            <button 
                                                                className='w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-4 text-base font-semibold rounded-2xl transition-all duration-300 transform group-hover/btn:scale-105 shadow-lg hover:shadow-xl hover:shadow-orange-500/30 flex items-center justify-center gap-3'
                                                            >
                                                                <span>Read Article</span>
                                                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                                            </button>
                                                        </Link>
                                                    </div>

                                                    {/* Hover Effect Border */}
                                                    <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-orange-200/50 transition-colors duration-500 pointer-events-none"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </FadeContainer>

                    {/* Enhanced Dots Indicator */}
                    <FadeContainer direction="up" delay={1.0}>
                        <div className='flex justify-center mt-12'>
                            <div className='flex space-x-3'>
                                {Array.from({ length: Math.min(6, Math.ceil(totalSlides / slidesPerView)) }, (_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`w-4 h-4 rounded-full transition-all duration-300 ${
                                            index === currentSlide 
                                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/25 scale-125' 
                                                : 'bg-gray-300 hover:bg-orange-400 hover:scale-110'
                                        }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </FadeContainer>
                </div>

                {/* Enhanced View All Button */}
                <FadeContainer direction="up" delay={1.2}>
                    <div className='text-center mt-20'>
                        <Link href="/Blogs">
                            <button 
                                className='group relative overflow-hidden border-2 border-orange-500 text-orange-600 hover:text-white px-10 py-5 text-xl font-semibold rounded-2xl transition-all duration-500 transform hover:scale-105 backdrop-blur-sm bg-transparent flex items-center mx-auto gap-3'
                            >
                                <span className="relative z-10">View All Articles</span>
                                <ArrowRight className="relative z-10 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                            </button>
                        </Link>
                    </div>
                </FadeContainer>

                {/* Enhanced Stats */}
                <FadeContainer direction="up" delay={1.4}>
                    <div className="flex flex-wrap justify-center gap-12 mt-20 pt-12 border-t border-gray-200/50">
                        {[
                            { number: `${data?.count || 0}+`, label: "Articles Published", icon: BookOpen },
                            { number: "50K+", label: "Monthly Readers", icon: TrendingUp },
                            { number: "100+", label: "Expert Authors", icon: User }
                        ].map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl mb-4 shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform duration-300">
                                    <stat.icon className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                                <div className="text-base text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </FadeContainer>
            </Container>
        </section>
    )
}

export default Blogs