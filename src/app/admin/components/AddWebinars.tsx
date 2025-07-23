'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Spinner from '@/components/Spinner'
import { createWebinar, updateWebinar } from '@/Server/Webinars'
import cloudinaryImageUploadMethod from '@/functions/cloudinary'
import { Webinars } from '@/Types/Gallery'
import { FaCalendar, FaMapMarkerAlt, FaUsers, FaImage, FaLink, FaUpload, FaCheck } from 'react-icons/fa'

type Props = {
    setData: React.Dispatch<React.SetStateAction<Webinars[]>>
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>
    isEdit?: boolean
    editData?: Webinars
}

const AddWebinars = ({ setData, isEdit, editData, setOpen }: Props) => {
    const [value, setValue] = useState<Webinars>({
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
    const [success, setSuccess] = useState('')
    const [blobUrl, setBlobUrl] = useState<string | null>(null)

    useEffect(() => {
        if (isEdit && editData) {
            try {
                // Ensure date is properly converted to Date object
                const editDataWithProperDate = {
                    ...editData,
                    date: editData.date instanceof Date ? editData.date : new Date(editData.date)
                }
                setValue(editDataWithProperDate)
            } catch (error) {
                console.error('Error setting edit data:', error)
                setMessage('Error loading webinar data for editing')
            }
        }
    }, [isEdit, editData])

    // Handle blob URL creation and cleanup for image preview
    useEffect(() => {
        if (value.image instanceof File) {
            const url = URL.createObjectURL(value.image)
            setBlobUrl(url)
            
            // Cleanup function
            return () => {
                URL.revokeObjectURL(url)
                setBlobUrl(null)
            }
        } else {
            // Clean up any existing blob URL
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl)
                setBlobUrl(null)
            }
        }
    }, [value.image, blobUrl])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (value.title.trim() === '') {
            setMessage('Title is required.')
            return
        }

        setLoading(true)
        setMessage('')
        setSuccess('')
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

        const formData: Webinars = {
            ...value,
            image: newImage as string,
        };

        if (isEdit) {
            await updateWebinar({ ...formData }).then((res) => {
                if (res) {
                    setData((prev) =>
                        prev.map((item) => (item._id === res._id ? res : item))
                    )
                    setSuccess('Webinar updated successfully!')
                    setTimeout(() => {
                        if (setOpen) {
                            setOpen(false)
                        }
                    }, 1500)
                } else {
                    setMessage('Failed to update webinar. Please try again.')
                }
            }).catch((error) => {
                console.error('Update error:', error)
                setMessage('Something went wrong while updating the webinar.')
            })
                .finally(() => setLoading(false))
        }
        else {
            await createWebinar(formData).then((res) => {
                if (res?.insertedId) {
                    setData((prev) => [
                        ...prev,
                        { ...formData, _id: String(res.insertedId) },
                    ])
                    setSuccess('Webinar created successfully!')
                    setTimeout(() => {
                        if (setOpen) {
                            setOpen(false)
                        }
                    }, 1500)
                }
            }).catch(() => {
                setMessage('Something went wrong.')
            })
                .finally(() => setLoading(false))
        }
    }

    return (
        <div className="space-y-6">
            {/* Messages */}
            {message && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {message}
                </div>
            )}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <FaCheck className="text-green-500" />
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                            <FaCalendar className="text-white text-lg" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Webinar Title *
                            </label>
                            <input
                                disabled={loading}
                                type="text"
                                id="title"
                                name="title"
                                value={value.title || ''}
                                onChange={(e) => setValue({ ...value, title: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-100"
                                placeholder="Enter webinar title"
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
                                value={value.description || ''}
                                onChange={(e) => setValue({ ...value, description: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-100 resize-none"
                                placeholder="Enter webinar description"
                            />
                        </div>

                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                                Date *
                            </label>
                            <input
                                disabled={loading}
                                type="date"
                                id="date"
                                name="date"
                                value={value.date instanceof Date ? value.date.toISOString().split('T')[0] : new Date(value.date).toISOString().split('T')[0]}
                                onChange={(e) => setValue({ ...value, date: new Date(e.target.value) })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                                <FaMapMarkerAlt className="text-blue-500" />
                                Location *
                            </label>
                            <input
                                disabled={loading}
                                type="text"
                                id="location"
                                name="location"
                                value={value.location || ''}
                                onChange={(e) => setValue({ ...value, location: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-100"
                                placeholder="Enter location (e.g., Online, Zoom, Conference Hall)"
                            />
                        </div>
                    </div>
                </div>

                {/* Attendees and Link */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                            <FaUsers className="text-white text-lg" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Attendees & Access</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="attendees" className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <FaUsers className="text-purple-500" />
                                Attendees
                            </label>
                            <input
                                disabled={loading}
                                type="text"
                                id="attendees"
                                name="attendees"
                                value={Array.isArray(value.attendees) ? value.attendees.join(', ') : ''}
                                onChange={(e) => setValue({ ...value, attendees: e.target.value.split(', ').filter(item => item.trim() !== '') })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100"
                                placeholder="Enter attendee names separated by commas"
                            />
                            <p className="text-xs text-gray-500 mt-1">Separate multiple attendees with commas</p>
                        </div>

                        <div>
                            <label htmlFor="link" className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <FaLink className="text-indigo-500" />
                                Webinar Link
                            </label>
                            <input
                                disabled={loading}
                                type="url"
                                id="link"
                                name="link"
                                value={value.link || ''}
                                onChange={(e) => setValue({ ...value, link: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100"
                                placeholder="https://example.com/webinar"
                            />
                        </div>
                    </div>
                </div>

                {/* Image Upload */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                            <FaImage className="text-white text-lg" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Webinar Image</h3>
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
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                />
                                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 transition-colors bg-white">
                                    <div className="text-center">
                                        <FaUpload className="text-3xl text-purple-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium text-purple-600">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Image Preview */}
                        {value.image && (
                            <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-purple-200">
                                <div className="flex-shrink-0">
                                    {value.image instanceof File && blobUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={blobUrl}
                                            alt="Webinar preview"
                                            className="w-20 h-20 object-cover rounded-lg border-2 border-purple-200"
                                        />
                                    ) : (
                                        <Image
                                            width={80}
                                            height={80}
                                            src={value.image as string}
                                            alt="Webinar preview"
                                            className="w-20 h-20 object-cover rounded-lg border-2 border-purple-200"
                                        />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {value.image instanceof File ? value.image.name : 'Current image'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {value.image instanceof File ? 
                                            `${(value.image.size / 1024 / 1024).toFixed(2)} MB` : 
                                            'Uploaded image'
                                        }
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                    <button
                        disabled={loading}
                        type="submit"
                        className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-teal-600 focus:ring-4 focus:ring-emerald-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center"
                    >
                        {loading ? (
                            <>
                                <Spinner />
                                Processing...
                            </>
                        ) : (
                            <>
                                <FaCheck />
                                {isEdit ? 'Update Webinar' : 'Create Webinar'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddWebinars