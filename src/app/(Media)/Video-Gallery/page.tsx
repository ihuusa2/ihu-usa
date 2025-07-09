import Container from '@/components/Container'
import React from 'react'
import Iframe from '@/components/Iframe'
import { H1 } from '@/components/Headings'
import type { VideoGallery } from '@/Types/Gallery'
import { getAllVideos } from '@/Server/VideoGallery'

import { Metadata } from 'next'
export const metadata: Metadata = {
    title: 'Video Gallery - International Hindu University',
    description: 'Explore our collection of videos highlighting events and educational content at International Hindu University.'
}

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const VideoGallery = async ({ searchParams }: Props) => {
    const searchParamsList = await searchParams;
    const data: { list: VideoGallery[], count: number } = await getAllVideos({ searchParams: searchParamsList }) as { list: VideoGallery[], count: number }

    if (data.count === 0) {
        return (
            <Container className='min-h-[60vh] flex items-center justify-center'>
                <div className='text-center space-y-6 max-w-2xl mx-auto'>
                    <div className='relative'>
                        <div className='absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-20 scale-150'></div>
                        <div className='relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100'>
                            <div className='w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
                                <svg className='w-10 h-10 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' />
                                </svg>
                            </div>
                            <H1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
                                No Videos Available
                            </H1>
                            <p className='text-gray-600 text-lg leading-relaxed'>
                                Our video collection is currently being updated. Please check back soon for inspiring educational content and event highlights.
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        )
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
            {/* Hero Section */}
            <div className='relative overflow-hidden'>
                {/* Background decoration */}
                <div className='absolute inset-0'>
                    <div className='absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse'></div>
                    <div className='absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-pink-400 to-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000'></div>
                    <div className='absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-tr from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000'></div>
                </div>
                
                <Container className='relative py-20 md:py-28'>
                    <div className='max-w-5xl mx-auto text-center space-y-8'>
                        {/* Main Title */}
                        <div className='space-y-6'>
                            <div className='inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200 text-blue-600 font-medium'>
                                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M8 5v14l11-7z'/>
                                </svg>
                                Video Gallery
                            </div>
                            
                            <H1 className='text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight'>
                                Explore Our
                                <span className='block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'>
                                    Video Gallery
                                </span>
                            </H1>
                            
                            <p className='text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light'>
                                Immerse yourself in our collection of educational videos, event highlights, and inspiring moments from 
                                <span className='font-semibold text-blue-600'> International Hindu University</span>
                            </p>
                        </div>

                        {/* Stats */}
                        <div className='flex flex-wrap justify-center gap-8 pt-8'>
                            <div className='text-center'>
                                <div className='text-3xl md:text-4xl font-bold text-blue-600'>{data.count}+</div>
                                <div className='text-gray-600 font-medium'>Videos</div>
                            </div>
                            <div className='text-center'>
                                <div className='text-3xl md:text-4xl font-bold text-purple-600'>HD</div>
                                <div className='text-gray-600 font-medium'>Quality</div>
                            </div>
                            <div className='text-center'>
                                <div className='text-3xl md:text-4xl font-bold text-indigo-600'>24/7</div>
                                <div className='text-gray-600 font-medium'>Access</div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className='grid md:grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto'>
                            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:bg-white/90 transition-all duration-300'>
                                <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4'>
                                    <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                                    </svg>
                                </div>
                                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Educational Content</h3>
                                <p className='text-gray-600 text-sm'>Learn through engaging video lectures and tutorials</p>
                            </div>
                            
                            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:bg-white/90 transition-all duration-300'>
                                <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4'>
                                    <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                    </svg>
                                </div>
                                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Event Highlights</h3>
                                <p className='text-gray-600 text-sm'>Relive memorable moments from university events</p>
                            </div>
                            
                            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:bg-white/90 transition-all duration-300'>
                                <div className='w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4'>
                                    <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                                    </svg>
                                </div>
                                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Inspiration</h3>
                                <p className='text-gray-600 text-sm'>Get inspired by success stories and achievements</p>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Video Gallery Section */}
            <Container className='pb-20'>
                <div className='max-w-7xl mx-auto'>
                    {/* Section Header */}
                    <div className='text-center mb-16'>
                        <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
                            Featured Videos
                        </h2>
                        <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
                            Browse through our carefully curated collection of videos showcasing the best of our university experience
                        </p>
                    </div>

                    {/* Video Grid */}
                    <div className='bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/50 shadow-xl'>
                        <Iframe 
                            data={data?.list.map(video => ({ 
                                ...video, 
                                _id: video._id?.toString() 
                            })) as { _id: string, link: string, title: string, description: string }[]} 
                        />
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default VideoGallery