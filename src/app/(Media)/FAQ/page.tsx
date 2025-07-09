import Container from '@/components/Container'
import React from 'react'
import Image from 'next/image'
import { H1 } from '@/components/Headings'
import type { FAQ } from '@/Types/Gallery'
import { getAllFAQs } from '@/Server/FAQ'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'FAQs - International Hindu University',
    description: 'Find answers to common questions and learn more about our services at International Hindu University.'
}

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Client Component for Interactive FAQ
import { FAQClient } from './FAQClient'

const FAQPage = async ({ searchParams }: Props) => {
    const searchParamsList = await searchParams;
    const data: { list: FAQ[], count: number } = await getAllFAQs({ searchParams: searchParamsList }) as { list: FAQ[], count: number }

    if (data.count === 0) {
        return (
            <Container className='min-h-[60vh] flex items-center justify-center'>
                <div className='text-center space-y-6 max-w-2xl mx-auto'>
                    <div className='relative'>
                        <div className='absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full blur-3xl opacity-20 scale-150'></div>
                        <div className='relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100'>
                            <div className='w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center'>
                                <svg className='w-10 h-10 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                                </svg>
                            </div>
                            <H1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
                                No FAQs Available
                            </H1>
                            <p className='text-gray-600 text-lg leading-relaxed'>
                                We&apos;re building our FAQ section to help answer your questions. Please check back soon or contact us directly for assistance.
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        )
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50'>
            {/* Hero Section */}
            <div className='relative overflow-hidden'>
                {/* Background decoration */}
                <div className='absolute inset-0'>
                    <div className='absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse'></div>
                    <div className='absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000'></div>
                    <div className='absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-tr from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000'></div>
                </div>
                
                <Container className='relative py-20 md:py-28'>
                    <div className='max-w-5xl mx-auto text-center space-y-8'>
                        {/* Main Title */}
                        <div className='space-y-6'>
                            <div className='inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-purple-200 text-purple-600 font-medium'>
                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                                </svg>
                                Help Center
                            </div>
                            
                            <H1 className='text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight'>
                                Frequently Asked
                                <span className='block bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent'>
                                    Questions
                                </span>
                            </H1>
                            
                            <p className='text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light'>
                                Find quick answers to common questions about our programs, admissions, and services at 
                                <span className='font-semibold text-purple-600'> International Hindu University</span>
                            </p>
                        </div>

                        {/* Stats */}
                        <div className='flex flex-wrap justify-center gap-8 pt-8'>
                            <div className='text-center'>
                                <div className='text-3xl md:text-4xl font-bold text-purple-600'>{data.count}+</div>
                                <div className='text-gray-600 font-medium'>Questions</div>
                            </div>
                            <div className='text-center'>
                                <div className='text-3xl md:text-4xl font-bold text-indigo-600'>24/7</div>
                                <div className='text-gray-600 font-medium'>Support</div>
                            </div>
                            <div className='text-center'>
                                <div className='text-3xl md:text-4xl font-bold text-blue-600'>Fast</div>
                                <div className='text-gray-600 font-medium'>Answers</div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className='grid md:grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto'>
                            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:bg-white/90 transition-all duration-300'>
                                <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4'>
                                    <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                                    </svg>
                                </div>
                                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Quick Answers</h3>
                                <p className='text-gray-600 text-sm'>Get instant answers to common questions</p>
                            </div>
                            
                            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:bg-white/90 transition-all duration-300'>
                                <div className='w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4'>
                                    <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                                    </svg>
                                </div>
                                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Easy Search</h3>
                                <p className='text-gray-600 text-sm'>Find exactly what you&apos;re looking for</p>
                            </div>
                            
                            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:bg-white/90 transition-all duration-300'>
                                <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4'>
                                    <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.5a1.5 1.5 0 010 3 1.5 1.5 0 010-3zm0 17a1.5 1.5 0 010-3 1.5 1.5 0 010 3z' />
                                    </svg>
                                </div>
                                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Updated Daily</h3>
                                <p className='text-gray-600 text-sm'>Fresh and relevant information always</p>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* FAQ Content Section */}
            <Container className='pb-20'>
                <div className='max-w-7xl mx-auto'>
                    {/* Section Header */}
                    <div className='text-center mb-16'>
                        <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
                            Common Questions & Answers
                        </h2>
                        <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
                            Here are the most frequently asked questions from our community. Can&apos;t find what you&apos;re looking for? Feel free to contact us!
                        </p>
                    </div>

                    {/* FAQ Content */}
                    <div className='grid lg:grid-cols-2 gap-12 items-start'>
                        {/* FAQ Image */}
                        <div className='lg:sticky lg:top-8'>
                            <div className='relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100'>
                                <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl opacity-50'></div>
                                <div className='relative'>
                                    <Image
                                        src='/Images/faq.jpg'
                                        alt='FAQ Support'
                                        width={500}
                                        height={500}
                                        className='w-full h-auto object-contain rounded-2xl'
                                    />
                                    
                                    {/* Floating Elements */}
                                    <div className='absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg'>
                                        <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                                        </svg>
                                    </div>
                                    
                                    <div className='absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-lg border border-gray-200'>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                                                <svg className='w-4 h-4 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                                </svg>
                                            </div>
                                            <span className='text-sm font-medium text-gray-700'>Quick Help</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Items - Client Component */}
                        <FAQClient data={data} />
                    </div>

                    {/* Contact Section */}
                    <div className='mt-20 text-center'>
                        <div className='bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/50 shadow-xl max-w-4xl mx-auto'>
                            <h3 className='text-2xl md:text-3xl font-bold text-gray-900 mb-4'>
                                Still Have Questions?
                            </h3>
                            <p className='text-gray-600 text-lg mb-8 max-w-2xl mx-auto'>
                                Our support team is here to help you with any additional questions or concerns you may have.
                            </p>
                            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                                <button className='px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'>
                                    Contact Support
                                </button>
                                <button className='px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-300'>
                                    Browse Help Center
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Stats */}
                    <div className="mt-16 text-center">
                        <div className="inline-flex items-center gap-8 bg-white/60 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/80">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{data.count}</div>
                                <div className="text-sm text-gray-600">Total FAQs</div>
                            </div>
                            <div className="w-px h-8 bg-gray-300"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-indigo-600">24/7</div>
                                <div className="text-sm text-gray-600">Available</div>
                            </div>
                            <div className="w-px h-8 bg-gray-300"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">∞</div>
                                <div className="text-sm text-gray-600">Support</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default FAQPage