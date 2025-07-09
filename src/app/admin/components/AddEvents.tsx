'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Spinner from '@/components/Spinner'
import { createEvent, updateEvent } from '@/Server/Events'
import { Events } from '@/Types/Gallery'
import cloudinaryImageUploadMethod from '@/functions/cloudinary'

type Props = {
    setData: React.Dispatch<React.SetStateAction<Events[]>>
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>
    isEdit?: boolean
    editData?: Events
}

const AddEvents = ({ setData, isEdit, editData, setOpen }: Props) => {
    const [value, setValue] = useState<Events>(isEdit ? {
        ...editData as Events,
        date: editData?.date ? new Date(editData.date) : new Date(),
        attendees: Array.isArray(editData?.attendees) ? editData.attendees : []
    } : {
        title: '',
        description: '',
        date: new Date(),
        location: '',
        attendees: [],
        image: '',
        link: ''
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [imageError, setImageError] = useState(false)

    useEffect(() => {
        if (isEdit && editData) {
            setValue({
                ...editData,
                date: editData.date ? new Date(editData.date) : new Date(),
                attendees: Array.isArray(editData.attendees) ? editData.attendees : []
            })
            setImageError(false)
        }
    }, [isEdit, editData])

    useEffect(() => {
        setImageError(false)
    }, [value.image])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (value.title.trim() === '') return

        setLoading(true)
        let newImage = value.image as string

        if (value.image instanceof File) {
            try {
                const data = await cloudinaryImageUploadMethod(value.image)
                newImage = data.secure_url
            } catch {
                setMessage('Image upload failed.')
                setLoading(false)
                return
            }
        }

        const formData: Events = {
            ...value,
            image: newImage as string,
        };

        if (isEdit) {
            await updateEvent({ ...formData }).then((res) => {
                if (res) {
                    setData((prev) =>
                        prev.map((item) => (item._id === res._id ? res : item))
                    )
                    if (setOpen) {
                        setOpen(false)
                    }
                } else {
                    setMessage('Failed to update event.')
                }
            }).catch((error) => {
                console.error('Update error:', error)
                setMessage('Something went wrong.')
            })
                .finally(() => setLoading(false))
        }
        else {
            await createEvent(formData).then((res) => {
                if (res?.insertedId) {
                    setData((prev) => [
                        ...prev,
                        { ...formData, _id: String(res.insertedId) },
                    ])
                    if (setOpen) {
                        setOpen(false)
                    }
                }
            }).catch(() => {
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

                {/* Basic Information Section */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Event Title <span className="text-red-500">*</span>
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
                                placeholder="Enter event title"
                            />
                        </div>

                        <div className="md:col-span-2">
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
                                placeholder="Enter event description"
                            />
                        </div>
                    </div>
                </div>

                {/* Event Details Section */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Event Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                                Event Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                disabled={loading}
                                type="date"
                                id="date"
                                name="date"
                                value={value.date instanceof Date ? value.date.toISOString().split('T')[0] : new Date(value.date).toISOString().split('T')[0]}
                                onChange={(e) => setValue({ ...value, date: new Date(e.target.value) })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                Location <span className="text-red-500">*</span>
                            </label>
                            <input
                                disabled={loading}
                                type="text"
                                id="location"
                                name="location"
                                value={value.location}
                                onChange={(e) => setValue({ ...value, location: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                                placeholder="Enter event location"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="attendees" className="block text-sm font-medium text-gray-700 mb-2">
                                Attendees
                            </label>
                            <input
                                disabled={loading}
                                type="text"
                                id="attendees"
                                name="attendees"
                                value={Array.isArray(value.attendees) ? value.attendees.join(', ') : ''}
                                onChange={(e) => setValue({ ...value, attendees: e.target.value.split(', ').filter(item => item.trim() !== '') })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                                placeholder="Enter attendees separated by commas"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                                Event Link
                            </label>
                            <input
                                disabled={loading}
                                type="text"
                                id="link"
                                name="link"
                                value={value.link}
                                onChange={(e) => setValue({ ...value, link: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                                placeholder="Enter event URL or link"
                            />
                        </div>
                    </div>
                </div>

                {/* Image Upload Section */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Event Image</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Image
                            </label>
                            <div className="relative">
                                <input
                                    disabled={loading}
                                    type="file"
                                    accept="image/*"
                                    id="image"
                                    name="image"
                                    onChange={(e) =>
                                        e.target.files && setValue({ ...value, image: e.target.files[0] })
                                    }
                                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {/* Image Preview */}
                        {value.image && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700 mb-3">Image Preview:</p>
                                <div className="relative inline-block">
                                    {value.image instanceof File ? (
                                        <Image
                                            src={URL.createObjectURL(value.image)}
                                            alt="event image preview"
                                            width={128}
                                            height={128}
                                            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                                        />
                                    ) : imageError ? (
                                        <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-gray-200 shadow-sm flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    ) : (
                                        <Image
                                            src={value.image as string}
                                            alt="event image preview"
                                            width={128}
                                            height={128}
                                            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                                            onError={() => setImageError(true)}
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 rounded-lg"></div>
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
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
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
                                <span>{isEdit ? 'Update Event' : 'Create Event'}</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddEvents