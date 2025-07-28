import Container from '@/components/Container'
import { H1 } from '@/components/Headings'
import { getAllWebinars } from '@/Server/Webinars'
import type { Webinars } from '@/Types/Gallery'
import Image from 'next/image'
import React from 'react'
import { formatDate } from '@/utils/dateFormatter'
import { FaCalendar, FaMapMarkerAlt, FaUsers, FaExternalLinkAlt, FaPlay } from 'react-icons/fa'
import Link from 'next/link'

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
                                <FaPlay className='w-10 h-10 text-white' />
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
                                <FaPlay className='w-5 h-5' />
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
                                <div className='text-3xl md:text-4xl font-bold text-teal-600'>{data.count}</div>
                                <div className='text-gray-600 font-medium'>Webinars</div>
                            </div>
                            <div className='text-center'>
                                <div className='text-3xl md:text-4xl font-bold text-cyan-600'>Live</div>
                                <div className='text-gray-600 font-medium'>Interactive</div>
                            </div>
                            <div className='text-center'>
                                <div className='text-3xl md:text-4xl font-bold text-blue-600'>Expert</div>
                                <div className='text-gray-600 font-medium'>Speakers</div>
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
                        {data?.list?.map((webinar) => {
                            const imageUrl = typeof webinar.image === 'string' ? webinar.image : ''
                            const isUpcoming = new Date(webinar.date) > new Date()
                            const isToday = new Date(webinar.date).toDateString() === new Date().toDateString()
                            
                            return (
                                <div key={webinar._id?.toString()} className='group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-gray-100'>
                                    {/* Webinar Image */}
                                    <div className='relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200'>
                                        {imageUrl ? (
                                            <Image
                                                src={imageUrl}
                                                alt={webinar.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className='object-cover group-hover:scale-105 transition-transform duration-500'
                                                priority={false}
                                            />
                                        ) : (
                                            <div className='flex items-center justify-center h-full bg-gradient-to-br from-teal-100 to-cyan-100'>
                                                <FaPlay className='w-16 h-16 text-gray-400' />
                                            </div>
                                        )}
                                        
                                        {/* Status Badge */}
                                        <div className='absolute top-4 left-4'>
                                            {isToday ? (
                                                <div className='bg-red-500 text-white rounded-full px-3 py-1 text-sm font-medium animate-pulse'>
                                                    <div className='flex items-center gap-1'>
                                                        <div className='w-2 h-2 bg-white rounded-full'></div>
                                                        Today
                                                    </div>
                                                </div>
                                            ) : isUpcoming ? (
                                                <div className='bg-green-500 text-white rounded-full px-3 py-1 text-sm font-medium'>
                                                    <div className='flex items-center gap-1'>
                                                        <FaCalendar className='w-3 h-3' />
                                                        Upcoming
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='bg-gray-500 text-white rounded-full px-3 py-1 text-sm font-medium'>
                                                    <div className='flex items-center gap-1'>
                                                        <FaCalendar className='w-3 h-3' />
                                                        Past
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Date Badge */}
                                        <div className='absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 text-sm font-bold text-gray-700'>
                                            <div className='flex items-center gap-1'>
                                                <FaCalendar className='w-4 h-4' />
                                                {formatDate(webinar.date)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Webinar Content */}
                                    <div className='p-6 space-y-4'>
                                        <div className='flex items-center gap-2 text-sm text-teal-600 font-medium'>
                                            <FaPlay className='w-4 h-4' />
                                            Webinar
                                        </div>
                                        
                                        <h3 className='text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-teal-600 transition-colors duration-300'>
                                            {webinar.title}
                                        </h3>
                                        
                                        <p className='text-gray-600 line-clamp-3 leading-relaxed'>
                                            {webinar.description}
                                        </p>

                                        {/* Webinar Details */}
                                        <div className='space-y-3 pt-2'>
                                            {/* Location */}
                                            {webinar.location && (
                                                <div className='flex items-center gap-2 text-sm text-gray-500'>
                                                    <FaMapMarkerAlt className='w-4 h-4 text-blue-500' />
                                                    <span className='line-clamp-1'>{webinar.location}</span>
                                                </div>
                                            )}
                                            
                                            {/* Attendees */}
                                            {webinar.attendees && webinar.attendees.length > 0 && (
                                                <div className='flex items-center gap-2 text-sm text-gray-500'>
                                                    <FaUsers className='w-4 h-4 text-purple-500' />
                                                    <div className='flex flex-wrap gap-1'>
                                                        {webinar.attendees.slice(0, 2).map((attendee, index) => (
                                                            <span key={index} className='text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full'>
                                                                {attendee}
                                                            </span>
                                                        ))}
                                                        {webinar.attendees.length > 2 && (
                                                            <span className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full'>
                                                                +{webinar.attendees.length - 2}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className='flex gap-3 mt-6'>
                                            {webinar.link ? (
                                                <a 
                                                    href={webinar.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className='flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center justify-center gap-2'
                                                >
                                                    <FaExternalLinkAlt className='w-4 h-4' />
                                                    Join Webinar
                                                </a>
                                            ) : (
                                                <button className='flex-1 px-4 py-3 bg-gray-300 text-gray-600 font-semibold rounded-xl cursor-not-allowed'>
                                                    Link Not Available
                                                </button>
                                            )}
                                            <Link 
                                                href={`/Webinars/${webinar._id}`}
                                                className='px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-300'
                                            >
                                                Details
                                            </Link>
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
                                <div className="text-2xl font-bold text-cyan-600">
                                    {data.list.filter(w => new Date(w.date) > new Date()).length}
                                </div>
                                <div className="text-sm text-gray-600">Upcoming</div>
                            </div>
                            <div className="w-px h-8 bg-gray-300"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {data.list.filter(w => new Date(w.date).toDateString() === new Date().toDateString()).length}
                                </div>
                                <div className="text-sm text-gray-600">Today</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Webinars