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
    // Merge pageSize=1000 into searchParamsList
    const mergedSearchParams = { ...(searchParamsList || {}), pageSize: '1000' }
    const data: { list: Team[], count: number } = await getAllTeams({ params: { category: slug }, searchParams: mergedSearchParams }) as { list: Team[], count: number }

    if (data?.count === 0) {
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-4xl mx-auto px-4 py-16">
                    <div className="text-center">
                        <div className="mb-8">
                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                                No {slug} Found
                            </h1>
                            <p className="text-gray-600">
                                We couldn&apos;t find any team members in this category. Please check back later.
                            </p>
                        </div>
                        <Link 
                            href="/Team"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Team
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-gray-50 border-b">
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            {slug}
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Meet our dedicated team members who contribute to our mission and vision.
                        </p>
                        <div className="mt-4 text-sm text-gray-500">
                            {data?.count} team member{data?.count !== 1 ? 's' : ''}
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Grid */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data?.list?.map((item) => (
                        <MemberCard item={item} key={item._id?.toString()} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Team