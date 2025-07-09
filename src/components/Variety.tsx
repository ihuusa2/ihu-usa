'use client'

import React, { useState, useEffect, useCallback } from 'react'

const Variety = () => {
    const [currentSlide, setCurrentSlide] = useState(0)

    const data = [
        {
            title: "Varied Programs and Courses",
            desc: "Our vision includes the promotion of ideas and practices that will benefit Humanity and promote mutual respect and pluralism. While the scope of work for the University is all the curriculum areas of arts, science and technology, the University will develop a niche-expertise with primary focus in Vedic knowledge/practices and secondary focus in other India based knowledge systems that are part of Dharmic traditions. The reason for developing this niche is to promote world harmony and peace by resurfacing forgotten / ignored knowledge systems that can contribute to sustaining global populations of all religions, sects, creeds, races, etc."
        },
        {
            title: "Virtual Courses",
            desc: "Our vision includes the promotion of ideas and practices that will benefit Humanity and promote mutual respect and pluralism. While the scope of work for the University is all the curriculum areas of arts, science and technology, the University will develop a niche-expertise with primary focus in Vedic knowledge/practices and secondary focus in other India based knowledge systems that are part of Dharmic traditions. The reason for developing this niche is to promote world harmony and peace by resurfacing forgotten/ ignored knowledge systems that can contribute to sustaining global populations of all religions, sects, creeds, races, etc."
        },
        {
            title: "Versatile Faculty",
            desc: "International Hindu University has online access to the vast treasures of wisdom teachings of India and the world. Students are not required to purchase text books for any of the courses in the School of Divinity. Resources and references have been provided as part of the courses. As far as possible access to texts is provided through online searches and links. IHU shares knowledge of Best Practices from other Institutions of Higher Learning around the world.Benchmarking with other Dharmic institutions to ensure the highest standards and quality. We are committed to global outreach for student, faculty and advisors; place high value on our resilience and ability to pivot based on the dynamics of customer needs in global marketplace."
        },
        {
            title: "Varied Programs & Courses",
            desc: "As a global leader in providing Dharma based education we will achieve our mission to promote the understanding of the Hindu way of life in a world in need of peace, co-existence, and mutual respect. We are committed to global outreach for student, faculty and advisors; place high value on our resilience and ability to pivot based on the dynamics of customer needs in global marketplace."
        }
    ]

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % data.length)
    }, [data.length])

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + data.length) % data.length)
    }, [data.length])

    const goToSlide = useCallback((index: number) => {
        setCurrentSlide(index)
    }, [])

    // Autoplay functionality
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide()
        }, 5000) // Change slide every 5 seconds

        return () => clearInterval(interval)
    }, [nextSlide])

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-12">
            <h3 className="text-center text-3xl font-bold text-gray-800 mb-8">
                What Distinguishes Us From The Rest &quot;Varied Programs and Courses&quot;
            </h3>
            
            {/* Carousel Container */}
            <div className="relative w-full overflow-hidden rounded-xl">
                {/* Carousel Track */}
                <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                        transform: `translateX(-${currentSlide * (100 / Math.min(3, data.length))}%)`,
                        width: `${(data.length / Math.min(3, data.length)) * 100}%`
                    }}
                >
                    {data.map((item, index) => (
                        <div 
                            key={index} 
                            className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 p-4"
                        >
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-full hover:shadow-xl transition-shadow duration-300 group">
                                <div className="p-6">
                                    <h4 className="text-xl font-semibold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                                        {item.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-5 group-hover:line-clamp-none transition-all duration-300">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Previous slide"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Next slide"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {data.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === currentSlide 
                                    ? 'bg-blue-600 scale-110' 
                                    : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Variety