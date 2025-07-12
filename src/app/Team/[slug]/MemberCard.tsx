import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Team } from '@/Types/User'
import { Course } from '@/Types/Courses'

interface Props {
    item: Team | Course
}

const stripHtml = (html: string) => html.replace(/<[^>]+>/g, '');

const MemberCard = ({ item }: Props) => {
    const displayName = 'name' in item ? item.name : item.title
    const imageSrc = 'image' in item ? item.image : item.images?.[0]
    const description = item.description

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            {/* Image */}
            <div className="relative w-full aspect-square bg-gray-100">
                {imageSrc ? (
                    <Image
                        src={imageSrc as string}
                        alt={displayName as string}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover object-center"
                        priority={false}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {displayName}
                </h3>

                {description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {stripHtml(description)}
                    </p>
                )}

                <Link 
                    href={`/Member/${item._id}`} 
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                    View Profile
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    )
}

export default MemberCard