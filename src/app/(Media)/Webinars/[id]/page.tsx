import Container from '@/components/Container'
import { H1, H2 } from '@/components/Headings'
import { getWebinarById } from '@/Server/Webinars'
import Image from 'next/image'
import React from 'react'
import { formatDate } from '@/utils/dateFormatter'
import { FaCalendar, FaMapMarkerAlt, FaUsers, FaExternalLinkAlt, FaPlay, FaArrowLeft, FaClock, FaGlobe } from 'react-icons/fa'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

type Props = {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const paramsList = await params
    const webinar = await getWebinarById(paramsList.id)
    
    if (!webinar) {
        return {
            title: 'Webinar Not Found - International Hindu University',
            description: 'The requested webinar could not be found.'
        }
    }

    return {
        title: `${webinar.title} - International Hindu University`,
        description: webinar.description.substring(0, 160) + '...'
    }
}

const WebinarDetail = async ({ params }: Props) => {
    const paramsList = await params
    const webinar = await getWebinarById(paramsList.id)

    if (!webinar) {
        notFound()
    }

    const isUpcoming = new Date(webinar.date) > new Date()
    const isToday = new Date(webinar.date).toDateString() === new Date().toDateString()
    const isPast = new Date(webinar.date) < new Date()

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
                    <div className='max-w-6xl mx-auto'>
                        {/* Back Button */}
                        <div className='mb-8'>
                            <Link 
                                href='/Webinars'
                                className='inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 text-gray-700 hover:bg-white transition-all duration-300'
                            >
                                <FaArrowLeft className='w-4 h-4' />
                                Back to Webinars
                            </Link>
                        </div>

                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
                            {/* Left: Content */}
                            <div className='space-y-6'>
                                {/* Status Badge */}
                                <div className='inline-flex items-center gap-2'>
                                    {isToday ? (
                                        <div className='bg-red-500 text-white rounded-full px-4 py-2 text-sm font-medium animate-pulse'>
                                            <div className='flex items-center gap-2'>
                                                <div className='w-2 h-2 bg-white rounded-full'></div>
                                                Happening Today
                                            </div>
                                        </div>
                                    ) : isUpcoming ? (
                                        <div className='bg-green-500 text-white rounded-full px-4 py-2 text-sm font-medium'>
                                            <div className='flex items-center gap-2'>
                                                <FaCalendar className='w-4 h-4' />
                                                Upcoming Webinar
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='bg-gray-500 text-white rounded-full px-4 py-2 text-sm font-medium'>
                                            <div className='flex items-center gap-2'>
                                                <FaCalendar className='w-4 h-4' />
                                                Past Webinar
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Title */}
                                <H1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight'>
                                    {webinar.title}
                                </H1>

                                {/* Description */}
                                <p className='text-xl text-gray-600 leading-relaxed'>
                                    {webinar.description}
                                </p>

                                {/* Key Details */}
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div className='flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50'>
                                        <FaCalendar className='w-5 h-5 text-teal-600' />
                                        <div>
                                            <div className='text-sm text-gray-500'>Date & Time</div>
                                            <div className='font-semibold text-gray-900'>{formatDate(webinar.date)}</div>
                                        </div>
                                    </div>

                                    {webinar.location && (
                                        <div className='flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50'>
                                            <FaMapMarkerAlt className='w-5 h-5 text-blue-600' />
                                            <div>
                                                <div className='text-sm text-gray-500'>Location</div>
                                                <div className='font-semibold text-gray-900'>{webinar.location}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className='flex flex-col sm:flex-row gap-4 pt-4'>
                                    {webinar.link ? (
                                        <a 
                                            href={webinar.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className='inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 shadow-lg hover:shadow-xl'
                                        >
                                            <FaExternalLinkAlt className='w-5 h-5' />
                                            {isPast ? 'View Recording' : 'Join Webinar'}
                                        </a>
                                    ) : (
                                        <button className='inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-300 text-gray-600 font-semibold rounded-xl cursor-not-allowed'>
                                            <FaGlobe className='w-5 h-5' />
                                            Link Not Available
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Right: Image */}
                            <div className='relative'>
                                {webinar.image && typeof webinar.image === 'string' ? (
                                    <div className='relative rounded-3xl overflow-hidden shadow-2xl'>
                                        <Image
                                            src={webinar.image}
                                            alt={webinar.title}
                                            width={600}
                                            height={400}
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className='w-full h-auto object-contain'
                                            priority
                                        />
                                    </div>
                                ) : (
                                    <div className='relative h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center'>
                                        <FaPlay className='w-24 h-24 text-gray-400' />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Detailed Information Section */}
            <Container className='py-20'>
                <div className='max-w-6xl mx-auto'>
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
                        {/* Main Content */}
                        <div className='lg:col-span-2 space-y-8'>
                            {/* About This Webinar */}
                            <div className='bg-white rounded-3xl shadow-xl p-8 border border-gray-100'>
                                <div className='flex items-center gap-4 mb-6'>
                                    <div className='w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center'>
                                        <FaPlay className='w-6 h-6 text-white' />
                                    </div>
                                    <H2 className='text-2xl font-bold text-gray-900'>About This Webinar</H2>
                                </div>
                                <div className='prose prose-lg max-w-none text-gray-700 leading-relaxed'>
                                    <p>{webinar.description}</p>
                                </div>
                            </div>

                            {/* Webinar Details */}
                            <div className='bg-white rounded-3xl shadow-xl p-8 border border-gray-100'>
                                <div className='flex items-center gap-4 mb-6'>
                                    <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center'>
                                        <FaCalendar className='w-6 h-6 text-white' />
                                    </div>
                                    <H2 className='text-2xl font-bold text-gray-900'>Webinar Details</H2>
                                </div>
                                
                                <div className='space-y-6'>
                                    <div className='flex items-center justify-between py-4 border-b border-gray-100'>
                                        <div className='flex items-center gap-3'>
                                            <FaCalendar className='w-5 h-5 text-teal-600' />
                                            <span className='font-medium text-gray-700'>Date & Time</span>
                                        </div>
                                        <span className='text-gray-900 font-semibold'>{formatDate(webinar.date)}</span>
                                    </div>

                                    {webinar.location && (
                                        <div className='flex items-center justify-between py-4 border-b border-gray-100'>
                                            <div className='flex items-center gap-3'>
                                                <FaMapMarkerAlt className='w-5 h-5 text-blue-600' />
                                                <span className='font-medium text-gray-700'>Location</span>
                                            </div>
                                            <span className='text-gray-900 font-semibold'>{webinar.location}</span>
                                        </div>
                                    )}

                                    {webinar.link && (
                                        <div className='flex items-center justify-between py-4 border-b border-gray-100'>
                                            <div className='flex items-center gap-3'>
                                                <FaGlobe className='w-5 h-5 text-indigo-600' />
                                                <span className='font-medium text-gray-700'>Platform</span>
                                            </div>
                                            <a 
                                                href={webinar.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className='text-indigo-600 font-semibold hover:text-indigo-700 transition-colors'
                                            >
                                                Join Webinar
                                            </a>
                                        </div>
                                    )}

                                    <div className='flex items-center justify-between py-4'>
                                        <div className='flex items-center gap-3'>
                                            <FaClock className='w-5 h-5 text-purple-600' />
                                            <span className='font-medium text-gray-700'>Status</span>
                                        </div>
                                        <span className={`font-semibold ${
                                            isToday ? 'text-red-600' : 
                                            isUpcoming ? 'text-green-600' : 
                                            'text-gray-600'
                                        }`}>
                                            {isToday ? 'Happening Today' : 
                                             isUpcoming ? 'Upcoming' : 
                                             'Completed'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className='space-y-6'>
                            {/* Attendees */}
                            {webinar.attendees && webinar.attendees.length > 0 && (
                                <div className='bg-white rounded-3xl shadow-xl p-6 border border-gray-100'>
                                    <div className='flex items-center gap-3 mb-4'>
                                        <FaUsers className='w-5 h-5 text-purple-600' />
                                        <H2 className='text-lg font-bold text-gray-900'>Attendees</H2>
                                    </div>
                                    <div className='space-y-2'>
                                        {webinar.attendees.map((attendee, index) => (
                                            <div key={index} className='flex items-center gap-3 p-3 bg-purple-50 rounded-xl'>
                                                <div className='w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold'>
                                                    {attendee.charAt(0).toUpperCase()}
                                                </div>
                                                <span className='text-gray-700 font-medium'>{attendee}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div className='bg-white rounded-3xl shadow-xl p-6 border border-gray-100'>
                                <H2 className='text-lg font-bold text-gray-900 mb-4'>Quick Actions</H2>
                                <div className='space-y-3'>
                                    {webinar.link && (
                                        <a 
                                            href={webinar.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className='w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-300'
                                        >
                                            <FaExternalLinkAlt className='w-4 h-4' />
                                            {isPast ? 'View Recording' : 'Join Now'}
                                        </a>
                                    )}
                                    
                                    <Link 
                                        href='/Webinars'
                                        className='w-full inline-flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-300'
                                    >
                                        <FaArrowLeft className='w-4 h-4' />
                                        Back to Webinars
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default WebinarDetail 