import Container from '@/components/Container'
import { H1 } from '@/components/Headings'
import { getAllEvents } from '@/Server/Events'
import type { Events } from '@/Types/Gallery'
import Image from 'next/image'
import React from 'react'

import { Metadata } from 'next'
export const metadata: Metadata = {
    title: 'Events - International Hindu University',
    description: 'Discover the latest events at International Hindu University. Join us for enriching experiences and community engagement.'
}

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const Events = async({ searchParams }: Props) => {
    const searchParamsList = await searchParams
    const data: { list: Events[], count: number } = await getAllEvents({ searchParams: searchParamsList }) as { list: Events[], count: number }

    if (data.count === 0) {
        return (
            <Container className='min-h-[60vh] flex items-center justify-center'>
                <div className='text-center space-y-6 max-w-2xl mx-auto'>
                    <div className='relative'>
                        <div className='absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full blur-3xl opacity-20 scale-150'></div>
                        <div className='relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100'>
                            <div className='w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center'>
                                <svg className='w-10 h-10 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                </svg>
                            </div>
                            <H1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
                                No Events Available
                            </H1>
                            <p className='text-gray-600 text-lg leading-relaxed'>
                                We&apos;re currently planning exciting events for our community. Stay tuned for upcoming announcements and engaging activities.
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        )
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-red-50'>
            {/* Hero Section */}
            <div className='relative overflow-hidden'>
                {/* Background decoration */}
                <div className='absolute inset-0'>
                    <div className='absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse'></div>
                    <div className='absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-red-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000'></div>
                    <div className='absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-tr from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000'></div>
                </div>
                
                <Container className='relative py-20 md:py-28'>
                    <div className='max-w-5xl mx-auto text-center space-y-8'>
                        {/* Main Title */}
                        <div className='space-y-6'>
                            <div className='inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200 text-orange-600 font-medium'>
                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                </svg>
                                University Events
                            </div>
                            
                            <H1 className='text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight'>
                                Discover Amazing
                                <span className='block bg-gradient-to-r from-orange-600 via-pink-600 to-red-600 bg-clip-text text-transparent'>
                                    Events & Activities
                                </span>
                            </H1>
                            
                            <p className='text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light'>
                                Join our vibrant community for enriching experiences, cultural celebrations, and educational activities at 
                                <span className='font-semibold text-orange-600'> International Hindu University</span>
                            </p>
                        </div>

                        {/* Stats */}
                        <div className='flex flex-wrap justify-center gap-8 pt-8'>
                            <div className='text-center'>
                                <div className='text-3xl md:text-4xl font-bold text-orange-600'>{data.count}+</div>
                                <div className='text-gray-600 font-medium'>Events</div>
                            </div>
                            <div className='text-center'>
                                <div className='text-3xl md:text-4xl font-bold text-pink-600'>Live</div>
                                <div className='text-gray-600 font-medium'>Updates</div>
                            </div>
                            <div className='text-center'>
                                <div className='text-3xl md:text-4xl font-bold text-red-600'>24/7</div>
                                <div className='text-gray-600 font-medium'>Community</div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className='grid md:grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto'>
                            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:bg-white/90 transition-all duration-300'>
                                <div className='w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4'>
                                    <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
                                    </svg>
                                </div>
                                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Community Gatherings</h3>
                                <p className='text-gray-600 text-sm'>Connect with fellow students and faculty members</p>
                            </div>
                            
                            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:bg-white/90 transition-all duration-300'>
                                <div className='w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4'>
                                    <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
                                    </svg>
                                </div>
                                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Cultural Celebrations</h3>
                                <p className='text-gray-600 text-sm'>Experience rich traditions and cultural diversity</p>
                            </div>
                            
                            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:bg-white/90 transition-all duration-300'>
                                <div className='w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4'>
                                    <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' />
                                    </svg>
                                </div>
                                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Educational Workshops</h3>
                                <p className='text-gray-600 text-sm'>Enhance your skills through interactive sessions</p>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Events Section */}
            <Container className='pb-20'>
                <div className='max-w-7xl mx-auto'>
                    {/* Section Header */}
                    <div className='text-center mb-16'>
                        <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
                            Upcoming Events
                        </h2>
                        <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
                            Explore our exciting lineup of events designed to inspire, educate, and bring our community together
                        </p>
                    </div>

                    {/* Events Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {data?.list?.map((item) => {
                            const imageUrl = typeof item.image === 'string' ? item.image : ''
                            return (
                                <div key={item._id?.toString()} className='group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-gray-100'>
                                    {/* Event Image */}
                                    <div className='relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200'>
                                        {imageUrl ? (
                                            <Image
                                                src={imageUrl}
                                                alt={item.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className='object-contain group-hover:scale-105 transition-transform duration-500 p-4'
                                                priority={false}
                                            />
                                        ) : (
                                            <div className='flex items-center justify-center h-full bg-gradient-to-br from-orange-100 to-pink-100'>
                                                <svg className='w-16 h-16 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                                </svg>
                                            </div>
                                        )}
                                        
                                        {/* Event Category Badge */}
                                        <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-orange-600'>
                                            Event
                                        </div>
                                        
                                        {/* Date Badge */}
                                        <div className='absolute top-4 right-4 bg-orange-600 text-white rounded-xl px-3 py-2 text-sm font-bold shadow-lg'>
                                            <div className='text-center'>
                                                <div className='text-xs opacity-90'>Dec</div>
                                                <div className='text-lg leading-none'>25</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Event Content */}
                                    <div className='p-6 space-y-4'>
                                        <h3 className='text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300'>
                                            {item.title}
                                        </h3>
                                        
                                        <p className='text-gray-600 line-clamp-3 leading-relaxed'>
                                            {item.description}
                                        </p>

                                        {/* Event Details */}
                                        <div className='flex items-center gap-4 text-sm text-gray-500 pt-2'>
                                            <div className='flex items-center gap-1'>
                                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                                                </svg>
                                                <span>6:00 PM</span>
                                            </div>
                                            <div className='flex items-center gap-1'>
                                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                                                </svg>
                                                <span>Main Hall</span>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <button className='w-full mt-6 px-6 py-3 bg-gradient-to-r from-orange-600 to-pink-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-pink-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transform hover:scale-[1.02]'>
                                            Learn More
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Events Stats */}
                    <div className="mt-16 text-center">
                        <div className="inline-flex items-center gap-8 bg-white/60 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/80">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">{data.count}</div>
                                <div className="text-sm text-gray-600">Total Events</div>
                            </div>
                            <div className="w-px h-8 bg-gray-300"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-pink-600">Live</div>
                                <div className="text-sm text-gray-600">Coverage</div>
                            </div>
                            <div className="w-px h-8 bg-gray-300"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">∞</div>
                                <div className="text-sm text-gray-600">Memories</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Events