'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

interface CourseGalleryProps {
    images: string[]
    title: string
}

export default function CourseGallery({ images, title }: CourseGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<number | null>(null)

    const openModal = (index: number) => {
        setSelectedImage(index)
        document.body.style.overflow = 'hidden'
    }

    const closeModal = () => {
        setSelectedImage(null)
        document.body.style.overflow = 'unset'
    }

    const nextImage = () => {
        if (selectedImage !== null) {
            setSelectedImage((selectedImage + 1) % images.length)
        }
    }

    const prevImage = () => {
        if (selectedImage !== null) {
            setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            closeModal()
        } else if (e.key === 'ArrowRight') {
            nextImage()
        } else if (e.key === 'ArrowLeft') {
            prevImage()
        }
    }

    return (
        <>
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-[var(--wisdom-green)]/5 to-[var(--amber-gold)]/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--wisdom-green)] rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-[var(--wisdom-green)]">Course Gallery</h3>
                    </div>
                </div>
                <div className="p-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((imageSrc, index) => (
                            <div 
                                key={index} 
                                className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                                onClick={() => openModal(index)}
                            >
                                <Image 
                                    src={imageSrc} 
                                    alt={`${title} Course Image ${index + 1}`} 
                                    width={300} 
                                    height={200} 
                                    className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute bottom-2 left-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Image {index + 1}
                                </div>
                                <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {selectedImage !== null && (
                <div 
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={closeModal}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                >
                    <div className="relative max-w-4xl max-h-full">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors duration-200"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        {/* Navigation Buttons */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                prevImage()
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors duration-200"
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                nextImage()
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors duration-200"
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Image */}
                        <div onClick={(e) => e.stopPropagation()}>
                            <Image
                                src={images[selectedImage]}
                                alt={`${title} Course Image ${selectedImage + 1}`}
                                width={800}
                                height={600}
                                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                            />
                        </div>

                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                            {selectedImage + 1} of {images.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
} 