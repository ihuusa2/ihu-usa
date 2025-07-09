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
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 border border-gray-100 flex flex-col h-full relative">
            {/* Image Container */}
            <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50">
                {imageSrc ? (
                    <Image
                        src={imageSrc as string}
                        alt={displayName as string}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                        className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                        priority={false}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
                        <div className="text-4xl sm:text-5xl text-orange-400">👤</div>
                    </div>
                )}
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Status indicator */}
                <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
            </div>

            {/* Content Container */}
            <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-1">
                {/* Title */}
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-orange-600 transition-colors duration-300 overflow-hidden text-ellipsis whitespace-nowrap">
                    {displayName}
                </h3>

                {/* Description */}
                {description && (
                    <div className="mb-4 sm:mb-5 lg:mb-6 flex-1">
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed overflow-hidden" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical'
                        }}>
                            {stripHtml(description)}
                        </p>
                    </div>
                )}

                {/* Button Container */}
                <div className="mt-auto pt-2">
                    <Link 
                        href={`/Member/${item._id}`} 
                        className="block w-full"
                    >
                        <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-md hover:shadow-lg text-sm sm:text-base group-hover:shadow-xl">
                            <span className="flex items-center justify-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                View Profile
                            </span>
                        </button>
                    </Link>
                </div>
            </div>

            {/* Decorative accent */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500 to-amber-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top"></div>
            
            {/* Corner decoration */}
            <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
    )
}

export default MemberCard