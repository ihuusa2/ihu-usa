import React from 'react'
import type { Team } from '@/Types/User'
import { getAllTeams } from '@/Server/Team'
import { Metadata } from 'next'
import Link from 'next/link'
import MemberCard from '@/app/Team/[slug]/MemberCard'

export const metadata: Metadata = {
    title: 'Team - International Hindu University',
    description: 'Meet the dedicated team behind IHU, committed to promoting Hindu spiritual education and research. Learn more about our faculty, staff, and their expertise.'
}

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const Team = async ({ params, searchParams }: Props) => {
    const paramsList = await params
    const slug = paramsList?.slug
        .replaceAll('-', ' ')
        .replace(/\b\w/g, char => char.toUpperCase())

    const searchParamsList = await searchParams
    const data: { list: Team[], count: number } = await getAllTeams({ params: { category: slug }, searchParams: searchParamsList }) as { list: Team[], count: number }

    if (data?.count === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                    <div className="text-center">
                        <div className="mb-8">
                            <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                                No {slug} Found
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                We couldn&apos;t find any team members in this category. Please check back later or explore other sections of our team.
                            </p>
                        </div>
                        <div className="mt-8">
                            <Link 
                                href="/Team"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Team
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
            {/* Header Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-amber-600/10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                    <div className="text-center">
                        <div className="mb-4">
                            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 text-sm font-medium rounded-full mb-6">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Our Team
                            </div>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
                            {slug}
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Meet the dedicated professionals who make our mission possible. Each team member brings unique expertise and passion to our community.
                        </p>
                        <div className="mt-8 flex justify-center">
                            <div className="flex items-center text-sm text-gray-500">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {data?.count} team member{data?.count !== 1 ? 's' : ''} found
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Grid Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20">
                {/* Grid Container */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
                    {data?.list?.map((item) => (
                        <MemberCard item={item} key={item._id?.toString()} />
                    ))}
                </div>

                {/* Pagination */}
                {data?.count > 10 && (
                    <div className="mt-12 sm:mt-16">
                        <Pagination count={data?.count} />
                    </div>
                )}
            </div>
        </div>
    )
}

// Custom Pagination Component
const Pagination = ({ count }: { count: number }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Showing {Math.min(count, 10)} of {count} results
            </div>
            
            <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                </button>
                <div className="flex items-center gap-1">
                    <button className="px-3 py-2 text-sm font-medium text-white bg-orange-500 border border-orange-500 rounded-lg hover:bg-orange-600 transition-colors duration-200">
                        1
                    </button>
                    {Math.ceil(count / 10) > 1 && (
                        <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                            2
                        </button>
                    )}
                </div>
                <button className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                </button>
            </div>
        </div>
    )
}

export default Team