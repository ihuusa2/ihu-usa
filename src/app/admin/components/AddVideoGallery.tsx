'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Spinner from '@/components/Spinner'
import { createVideo, updateVideo } from '@/Server/VideoGallery'
import { VideoGallery } from '@/Types/Gallery'

type Props = {
    setData: React.Dispatch<React.SetStateAction<VideoGallery[]>>
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>
    isEdit?: boolean
    editData?: VideoGallery
}

const AddVideoGallery = ({ setData, isEdit, editData, setOpen }: Props) => {
    const [value, setValue] = useState<VideoGallery>(isEdit ? editData as VideoGallery : {
        title: '',
        description: '',
        link: '',
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (isEdit) {
            setValue(editData as VideoGallery)
        }
    }, [isEdit, editData])

    // Function to extract YouTube video ID
    const getYouTubeVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    // Function to get YouTube thumbnail
    const getYouTubeThumbnail = (url: string) => {
        const videoId = getYouTubeVideoId(url);
        return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (value.title.trim() === '' || value.link.trim() === '') return

        setLoading(true)

        const formData: VideoGallery = {
            ...value,
        }

        if (isEdit) {
            await updateVideo({ ...formData }).then((res) => {
                if (res) {
                    setData((prev) =>
                        prev.map((item) => (item._id === res._id ? res : item))
                    )
                    if (setOpen) {
                        setOpen(false)
                    }
                }
            }).catch(() => {
                setMessage('Something went wrong.')
            })
                .finally(() => setLoading(false))
        } else {
            await createVideo(formData).then((res) => {
                if (res?.insertedId) {
                    setData((prev) => [
                        ...prev,
                        { ...formData, _id: String(res.insertedId) },
                    ])
                    if (setOpen) {
                        setOpen(false)
                    }
                }
            })
                .catch(() => {
                    setMessage('Something went wrong.')
                })
                .finally(() => setLoading(false))
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {message && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {message}
                    </div>
                )}

                {/* Video Information Section */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Video Information</h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Video Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                disabled={loading}
                                type="text"
                                id="title"
                                name="title"
                                value={value.title}
                                onChange={(e) => setValue({ ...value, title: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                                placeholder="Enter video title"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                disabled={loading}
                                id="description"
                                name="description"
                                rows={4}
                                value={value.description}
                                onChange={(e) => setValue({ ...value, description: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none disabled:bg-gray-50 disabled:text-gray-500"
                                placeholder="Enter video description (optional)"
                            />
                        </div>
                    </div>
                </div>

                {/* Video Link Section */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Video Link</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                                Video URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                disabled={loading}
                                type="url"
                                id="link"
                                name="link"
                                value={value.link}
                                onChange={(e) => setValue({ ...value, link: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                                placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Supports YouTube, Vimeo, and direct video links
                            </p>
                        </div>

                        {/* Video Preview */}
                        {value.link && (
                            <div className="mt-6">
                                <p className="text-sm font-medium text-gray-700 mb-3">Video Preview:</p>
                                <div className="relative">
                                    {getYouTubeThumbnail(value.link) ? (
                                        <div className="relative inline-block">
                                            <Image
                                                src={getYouTubeThumbnail(value.link)!}
                                                alt="Video thumbnail"
                                                width={256}
                                                height={192}
                                                className="w-64 h-48 object-cover rounded-lg border-2 border-gray-200 shadow-lg"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                                                <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-80 text-white text-xs rounded">
                                                YouTube
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-64 h-48 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                                            <div className="text-center">
                                                <svg className="w-12 h-12 text-cyan-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-sm text-gray-600">Video Link</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <Spinner />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>{isEdit ? 'Update Video' : 'Add Video'}</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddVideoGallery