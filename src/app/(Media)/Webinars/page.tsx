import Container from '@/components/Container'
import { H1 } from '@/components/Headings'
import { getAllWebinars } from '@/Server/Webinars'
import type { Webinars } from '@/Types/Gallery'
import Image from 'next/image'
import React from 'react'

import { Metadata } from 'next'
export const metadata: Metadata = {
    title: 'Webinars - International Hindu University',
    description: 'Explore our engaging webinars covering a variety of topics at International Hindu University.'
}

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const Webinars = async({ searchParams }: Props) => {
    const searchParamsList = await searchParams
    const data: { list: Webinars[], count: number } = await getAllWebinars({ searchParams: searchParamsList }) as { list: Webinars[], count: number }

    if (data.count === 0) {
        return (
            <Container className='min-h-[60vh] flex items-center justify-center'>
                <div className='text-center space-y-6 max-w-2xl mx-auto'>
                    <div className='relative'>
                        <div className='absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full blur-3xl opacity-20 scale-150'></div>
                        <div className='relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100'>
                            <div className='w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center'>
                                <svg className='w-10 h-10 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' />
                                </svg>
                            </div>
                            <H1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
                                No Webinars Available
                            </H1>
                            <p className='text-gray-600 text-lg leading-relaxed'>
                                We&apos;re preparing exciting webinar sessions for our community. Stay tuned for upcoming educational and interactive online events.
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        )
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50'>
            {/* Hero Section */}
            <div className='relative overflow-hidden'>
                {/* Background decoration */}
                <div className='absolute inset-0'>
                    <div className='absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse'></div>
                    <div className='absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000'></div>
                    <div className='absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-tr from-cyan-400 to-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000'></div>
                </div>
                
                <Container className='relative py-20 md:py-28'>
                    <div className='max-w-5xl mx-auto text-center space-y-8'>
                        {/* Main Title */}
                        <div className='space-y-6'>
                            <div className='inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-teal-200 text-teal-600 font-medium'>
                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                </svg>
                                Online Learning
                            </div>
                            
                            <H1 className='text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight'>
                                Expert-Led
                                <span className='block bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent'>
                                    Webinars & Sessions
                                </span>
                            </H1>
                            
                            <p className='text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light'>
                                Join our interactive webinars featuring industry experts, thought leaders, and educators from 
                                <span className='font-semibold text-teal-600'> International Hindu University</span>
                            </p>
                        </div>

                        {/* Stats */}
                        <div className='flex flex-wrap justify-center gap-8 pt-8'>
                            <div className='text-center'>
                                <div className='text-3xl md:text-4xl font-bold text-teal-600'>{data.count}+</div>
                                <div className='text-gray-600 font-medium'>Webinars</div>
                            </div>
                            <div className='text-center'>
                                <div className='text-3xl md:text-4xl font-bold text-cyan-600'>HD</div>
                                <div className='text-gray-600 font-medium'>Streaming</div>
                            </div>
                            <div className='text-center'>
                                <div className='text-3xl md:text-4xl font-bold text-blue-600'>Live</div>
                                <div className='text-gray-600 font-medium'>Interactive</div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className='grid md:grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto'>
                            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:bg-white/90 transition-all duration-300'>
                                <div className='w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4'>
                                    <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                                    </svg>
                                </div>
                                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Expert Knowledge</h3>
                                <p className='text-gray-600 text-sm'>Learn from industry professionals and academics</p>
                            </div>
                            
                            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:bg-white/90 transition-all duration-300'>
                                <div className='w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4'>
                                    <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
                                    </svg>
                                </div>
                                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Interactive Q&A</h3>
                                <p className='text-gray-600 text-sm'>Engage directly with speakers and get answers</p>
                            </div>
                            
                            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:bg-white/90 transition-all duration-300'>
                                <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4'>
                                    <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                                    </svg>
                                </div>
                                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Flexible Schedule</h3>
                                <p className='text-gray-600 text-sm'>Join live or watch recorded sessions anytime</p>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Webinars Section */}
            <Container className='pb-20'>
                <div className='max-w-7xl mx-auto'>
                    {/* Section Header */}
                    <div className='text-center mb-16'>
                        <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
                            Featured Webinars
                        </h2>
                        <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
                            Discover our collection of educational webinars designed to enhance your knowledge and skills
                        </p>
                    </div>

                    {/* Webinars Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {data?.list?.map((item) => {
                            const imageUrl = typeof item.image === 'string' ? item.image : ''
                            return (
                                <div key={item._id?.toString()} className='group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-gray-100'>
                                    {/* Webinar Image */}
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
                                            <div className='flex items-center justify-center h-full bg-gradient-to-br from-teal-100 to-cyan-100'>
                                                <svg className='w-16 h-16 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' />
                                                </svg>
                                            </div>
                                        )}
                                        
                                        {/* Live Badge */}
                                        <div className='absolute top-4 left-4 bg-red-500 text-white rounded-full px-3 py-1 text-sm font-medium animate-pulse'>
                                            <div className='flex items-center gap-1'>
                                                <div className='w-2 h-2 bg-white rounded-full'></div>
                                                Live
                                            </div>
                                        </div>
                                        
                                        {/* Duration Badge */}
                                        <div className='absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 text-sm font-bold text-gray-700'>
                                            <div className='flex items-center gap-1'>
                                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                                                </svg>
                                                45min
                                            </div>
                                        </div>
                                    </div>

                                    {/* Webinar Content */}
                                    <div className='p-6 space-y-4'>
                                        <div className='flex items-center gap-2 text-sm text-teal-600 font-medium'>
                                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                            </svg>
                                            Webinar
                                        </div>
                                        
                                        <h3 className='text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-teal-600 transition-colors duration-300'>
                                            {item.title}
                                        </h3>
                                        
                                        <p className='text-gray-600 line-clamp-3 leading-relaxed'>
                                            {item.description}
                                        </p>

                                        {/* Webinar Details */}
                                        <div className='flex items-center gap-4 text-sm text-gray-500 pt-2'>
                                            <div className='flex items-center gap-1'>
                                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                                </svg>
                                                <span>Today 2:00 PM</span>
                                            </div>
                                            <div className='flex items-center gap-1'>
                                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
                                                </svg>
                                                <span>150+ Attending</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className='flex gap-3 mt-6'>
                                            <button className='flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2'>
                                                Join Now
                                            </button>
                                            <button className='px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-300'>
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Webinars Stats */}
                    <div className="mt-16 text-center">
                        <div className="inline-flex items-center gap-8 bg-white/60 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/80">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-teal-600">{data.count}</div>
                                <div className="text-sm text-gray-600">Total Webinars</div>
                            </div>
                            <div className="w-px h-8 bg-gray-300"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-cyan-600">HD</div>
                                <div className="text-sm text-gray-600">Quality</div>
                            </div>
                            <div className="w-px h-8 bg-gray-300"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">∞</div>
                                <div className="text-sm text-gray-600">Learning</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Webinars