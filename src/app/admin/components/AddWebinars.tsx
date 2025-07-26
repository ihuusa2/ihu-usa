'use client'

import type { Webinars } from "@/Types/Gallery";
import React, { useState } from 'react'
import { createWebinar, updateWebinar } from '@/Server/Webinars'
import cloudinaryImageUploadMethod from '@/functions/cloudinary'
import { FaUpload, FaTimes, FaSave, FaSpinner } from 'react-icons/fa'

interface AddWebinarProps {
    setData: React.Dispatch<React.SetStateAction<Webinars[]>>
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    isEdit?: boolean
    editData?: Webinars
}

interface WebinarFormData {
    title: string
    description: string
    date: string
    location: string
    attendees: string[]
    image: string
    link: string
}

const AddWebinar = ({ setData, setOpen, isEdit = false, editData }: AddWebinarProps) => {
    const [formData, setFormData] = useState<WebinarFormData>({
        title: editData?.title || '',
        description: editData?.description || '',
        date: editData?.date ? new Date(editData.date).toISOString().split('T')[0] : '',
        location: editData?.location || '',
        attendees: editData?.attendees || [],
        image: typeof editData?.image === 'string' ? editData.image : '',
        link: editData?.link || ''
    })
    const [loading, setLoading] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [attendeeInput, setAttendeeInput] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            let imageUrl = formData.image as string

            if (imageFile) {
                const uploadResult = await cloudinaryImageUploadMethod(imageFile)
                imageUrl = uploadResult.secure_url
            }

            const webinarData = {
                ...formData,
                image: imageUrl,
                date: new Date(formData.date as string)
            }

            if (isEdit && editData?._id) {
                const updatedWebinar = await updateWebinar({
                    _id: editData._id,
                    ...webinarData
                } as Webinars)
                
                if (updatedWebinar) {
                    setData(prev => prev.map(webinar => 
                        webinar._id === editData._id ? updatedWebinar : webinar
                    ))
                }
            } else {
                await createWebinar(webinarData as Webinars)
                // Just close the modal; parent will refresh list
            }

            setOpen(false)
        } catch (error) {
            console.error('Error saving webinar:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
        }
    }

    const addAttendee = () => {
        if (attendeeInput.trim()) {
            setFormData(prev => ({
                ...prev,
                attendees: [...(prev.attendees || []), attendeeInput.trim()]
            }))
            setAttendeeInput('')
        }
    }

    const removeAttendee = (index: number) => {
        setFormData(prev => ({
            ...prev,
            attendees: prev.attendees?.filter((_, i) => i !== index) || []
        }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Webinar Title *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        placeholder="Enter webinar title"
                    />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                    </label>
                    <textarea
                        required
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        placeholder="Enter webinar description"
                    />
                </div>

                {/* Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                    </label>
                    <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                    </label>
                    <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        placeholder="Enter location"
                    />
                </div>

                {/* Link */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Webinar Link
                    </label>
                    <input
                        type="url"
                        value={formData.link}
                        onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        placeholder="Enter webinar link (Zoom, Teams, etc.)"
                    />
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Webinar Image
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="webinar-image"
                        />
                        <label
                            htmlFor="webinar-image"
                            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                        >
                            <FaUpload className="w-4 h-4" />
                            Upload Image
                        </label>
                        {imageFile && (
                            <span className="text-sm text-gray-600">
                                {imageFile.name}
                            </span>
                        )}
                        {(formData.image && !imageFile) && (
                            <span className="text-sm text-gray-600">
                                Current image uploaded
                            </span>
                        )}
                    </div>
                </div>

                {/* Attendees */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Attendees
                    </label>
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={attendeeInput}
                                onChange={(e) => setAttendeeInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                                placeholder="Add attendee name"
                            />
                            <button
                                type="button"
                                onClick={addAttendee}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                        {formData.attendees && formData.attendees.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.attendees.map((attendee, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                                    >
                                        {attendee}
                                        <button
                                            type="button"
                                            onClick={() => removeAttendee(index)}
                                            className="text-green-600 hover:text-green-800"
                                        >
                                            <FaTimes className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <FaSpinner className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <FaSave className="w-4 h-4" />
                            {isEdit ? 'Update Webinar' : 'Create Webinar'}
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}

export default AddWebinar