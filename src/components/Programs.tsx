'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Programs = () => {
    const programs = [
        {
            id: 1,
            image: '/Images/Programs/image1.png',
            title: 'Spiritual Education',
            description: 'Comprehensive spiritual learning programs designed to deepen your understanding and practice.',
            icon: '🧘‍♀️',
            link: '/Courses/spiritual-education'
        },
        {
            id: 2,
            image: '/Images/Programs/image2.png',
            title: 'Meditation & Wellness',
            description: 'Transform your life through guided meditation and wellness practices.',
            icon: '🌿',
            link: '/Courses/meditation-wellness'
        },
        {
            id: 3,
            image: '/Images/Programs/image3.png',
            title: 'Community Service',
            description: 'Join our community service initiatives and make a positive impact in society.',
            icon: '🤝',
            link: '/Courses/community-service'
        }
    ]

    return (
        <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                        Explore Our Programs of Study
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        Discover Our
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Programs</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Embark on a transformative journey with our comprehensive spiritual and educational programs designed to nurture your mind, body, and soul
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {programs.map((program) => (
                            <div key={program.id} className="group cursor-pointer">
                                {/* Card Container */}
                                <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 h-full transform hover:-translate-y-2">
                                    {/* Image Container */}
                                    <div className="relative overflow-hidden rounded-t-2xl">
                                        <Image
                                            height={400}
                                            width={600}
                                            alt={program.title}
                                            src={program.image}
                                            className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-110"
                                        />
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        
                                        {/* Icon Badge */}
                                        <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                            {program.icon}
                                        </div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                                            {program.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            {program.description}
                                        </p>
                                        
                                        {/* Learn More Button */}
                                        <Link href={program.link} className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300 group/btn">
                                            Learn More
                                            <svg className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enhanced Call to Action */}
                <div className="text-center mt-16">
                    <Link href="/Courses/programs">
                    <button className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl overflow-hidden">
                        <span className="relative z-10">Explore All Programs</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <svg className="w-5 h-5 ml-2 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                    </Link>
                </div>
            </div>

            {/* Custom CSS for animation delays */}
            <style jsx>{`
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </section>
    )
}

export default Programs