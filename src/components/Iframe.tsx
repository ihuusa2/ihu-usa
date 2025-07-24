'use client'

import React from 'react'
import HydrationGuard from './HydrationGuard'

type Props = {
    data: { _id: string, title: string, description: string, link: string }[]
}

const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[1].length === 11) ? match[1] : null;
};

const getYouTubeEmbedUrl = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

const Iframe = ({ data }: Props) => {

    return (
        <HydrationGuard fallback={
            <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center rounded-3xl">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium">Loading videos...</p>
                </div>
            </div>
        }>
            <>
                <div className='flex flex-col gap-16'>
                    {data.reduce((acc: { _id: string, link: string, title: string, description: string }[][], item: { _id: string, link: string, title: string, description: string }, index: number) => {
                        const chunkIndex = Math.floor(index / 3);
                        if (!acc[chunkIndex]) {
                            acc[chunkIndex] = [];
                        }
                        acc[chunkIndex].push(item);
                        return acc;
                    }, []).map((chunk, chunkIndex) => (
                        <div key={chunkIndex} className='grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-2 gap-8'>
                            {chunk.map((item: { _id: string, link: string, title: string, description: string }, index) => {

                                const colStyle = index === 0 
                                    ? 'lg:col-span-4 lg:row-span-1' 
                                    : index === 1 
                                        ? 'lg:col-span-2 lg:row-span-1' 
                                        : 'lg:col-span-2 lg:row-span-1'

                                return (
                                    <div
                                        key={item._id}
                                        className={`group relative w-full lg:h-[28rem] bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-gray-100 hover:border-blue-200 ${colStyle}`}
                                    >
                                        {/* Enhanced Loading Animation */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50" id={`loader-${item._id}`}>
                                            <div className="text-center space-y-6">
                                                {/* Animated Loading Spinner */}
                                                <div className="relative w-20 h-20 mx-auto">
                                                    <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
                                                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                                                </div>
                                                
                                                {/* Enhanced Play Icon */}
                                                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                                                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z"/>
                                                    </svg>
                                                </div>
                                                
                                                {/* Loading Text with Progress */}
                                                <div className="space-y-3">
                                                    <p className="text-gray-700 font-semibold text-lg">Loading Video...</p>
                                                    <div className="w-40 h-3 bg-gray-200 rounded-full mx-auto overflow-hidden">
                                                        <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-full animate-pulse w-4/5"></div>
                                                    </div>
                                                    <p className="text-gray-500 text-sm">Please wait while we prepare your content</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Video Iframe or Video Tag */}
                                        {/(\.mp4$|\.webm$|\.ogg$|\.mov$|\.m4v$|\.avi$|\.wmv$|\.flv$|\.mkv$)/i.test(item.link) ? (
                                            <video
                                                className='w-full h-full rounded-3xl'
                                                src={item.link}
                                                controls
                                                poster={undefined}
                                                onLoadedData={() => {
                                                    const loader = document.getElementById(`loader-${item._id}`);
                                                    if (loader) {
                                                        loader.style.opacity = '0';
                                                        loader.style.transform = 'scale(0.95)';
                                                        setTimeout(() => loader.remove(), 400);
                                                    }
                                                }}
                                                title={item.title || `Video ${item._id}`}
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        ) : (
                                            <iframe
                                                className='w-full h-full rounded-3xl'
                                                src={
                                                    item.link.includes('youtube.com') || item.link.includes('youtu.be')
                                                        ? getYouTubeEmbedUrl(item.link)
                                                        : item.link
                                                }
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                onLoad={() => {
                                                    const loader = document.getElementById(`loader-${item._id}`);
                                                    if (loader) {
                                                        loader.style.opacity = '0';
                                                        loader.style.transform = 'scale(0.95)';
                                                        setTimeout(() => loader.remove(), 400);
                                                    }
                                                }}
                                                title={item.title || `Video ${item._id}`}
                                            ></iframe>
                                        )}

                                        {/* Enhanced Video Overlay Info */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8 transform translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-out">
                                            <div className="text-white">
                                                {item.title && (
                                                    <h3 className="font-bold text-xl mb-3 line-clamp-2 leading-tight">
                                                        {item.title}
                                                    </h3>
                                                )}
                                                {item.description && (
                                                    <p className="text-gray-200 text-base line-clamp-3 opacity-95 leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Enhanced Corner Badge */}
                                        <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md rounded-full p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110">
                                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>

                                        {/* Video Duration Badge */}
                                        <div className="absolute top-6 left-6 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                            <span className="text-white text-sm font-medium">HD</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>

                {/* Enhanced Video Gallery Stats */}
                <div className="mt-20 text-center">
                    <div className="inline-flex items-center gap-12 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-xl rounded-3xl px-12 py-6 border border-white/80 shadow-2xl">
                        <div className="text-center">
                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{data.length}</div>
                            <div className="text-sm text-gray-600 font-medium">Total Videos</div>
                        </div>
                        <div className="w-px h-12 bg-gradient-to-b from-gray-300 to-transparent"></div>
                        <div className="text-center">
                            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">HD</div>
                            <div className="text-sm text-gray-600 font-medium">Quality</div>
                        </div>
                        <div className="w-px h-12 bg-gradient-to-b from-gray-300 to-transparent"></div>
                        <div className="text-center">
                            <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">∞</div>
                            <div className="text-sm text-gray-600 font-medium">Learning</div>
                        </div>
                    </div>
                </div>
            </>
        </HydrationGuard>
    )
}

export default Iframe