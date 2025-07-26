'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Spinner from '@/components/Spinner'
import { createFlyer, updateFlyer } from '@/Server/Flyers'
import { Flyers } from '@/Types/Gallery'
import cloudinaryImageUploadMethod from '@/functions/cloudinary'

type Props = {
    setData: React.Dispatch<React.SetStateAction<Flyers[]>>
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>
    isEdit?: boolean
    editData?: Flyers
}

const AddFlyer = ({ setData, isEdit, editData, setOpen }: Props) => {
    const [value, setValue] = useState<Flyers>(isEdit ? editData as Flyers : {
        title: '',
        description: '',
        image: '',
        link: '',
        isActive: true,
        displayOrder: 1,
        startDate: undefined,
        endDate: undefined,
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [blobUrl, setBlobUrl] = useState<string | null>(null)

    useEffect(() => {
        if (isEdit) {
            setValue(editData as Flyers)
        }
    }, [isEdit, editData])

    // Handle blob URL creation and cleanup for image preview
    useEffect(() => {
        console.log('Image value changed:', value.image)
        
        // Clean up previous blob URL if it exists
        if (blobUrl) {
            URL.revokeObjectURL(blobUrl)
        }

        if (value.image instanceof File) {
            console.log('Creating blob URL for file:', value.image.name)
            const url = URL.createObjectURL(value.image)
            console.log('Blob URL created:', url)
            setBlobUrl(url)
        } else {
            console.log('Setting blobUrl to null')
            setBlobUrl(null)
        }
    }, [value.image, blobUrl])

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

        const formData: Flyers = {
            ...value,
            image: newImage as string,
        }

        if (isEdit) {
            await updateFlyer({ ...formData }).then((res) => {
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
        }
        else {
            await createFlyer(formData).then((res) => {
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

    const formatDateForInput = (date: Date | undefined) => {
        if (!date) return ''
        return new Date(date).toISOString().split('T')[0]
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
                        <h3 className="text-lg font-semibold text-gray-900">Flyer Information</h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Flyer Title <span className="text-red-500">*</span>
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
                                placeholder="Enter flyer title"
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
                                placeholder="Enter flyer description (optional)"
                            />
                        </div>

                        <div>
                            <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                                Link URL
                            </label>
                            <input
                                disabled={loading}
                                type="url"
                                id="link"
                                name="link"
                                value={value.link}
                                onChange={(e) => setValue({ ...value, link: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                                placeholder="https://example.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Display Settings Section */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Display Settings</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Active Status
                                </label>
                                <p className="text-xs text-gray-500">Show this flyer on the home screen</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={value.isActive}
                                    onChange={(e) => setValue({ ...value, isActive: e.target.checked })}
                                    disabled={loading}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div>
                            <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 mb-2">
                                Display Order
                            </label>
                            <input
                                disabled={loading}
                                type="number"
                                id="displayOrder"
                                name="displayOrder"
                                min="1"
                                value={value.displayOrder}
                                onChange={(e) => setValue({ ...value, displayOrder: parseInt(e.target.value) || 1 })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                                placeholder="1"
                            />
                            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date (Optional)
                                </label>
                                <input
                                    disabled={loading}
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={formatDateForInput(value.startDate)}
                                    onChange={(e) => setValue({ 
                                        ...value, 
                                        startDate: e.target.value ? new Date(e.target.value) : undefined 
                                    })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date (Optional)
                                </label>
                                <input
                                    disabled={loading}
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    value={formatDateForInput(value.endDate)}
                                    onChange={(e) => setValue({ 
                                        ...value, 
                                        endDate: e.target.value ? new Date(e.target.value) : undefined 
                                    })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>
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
                        <h3 className="text-lg font-semibold text-gray-900">Upload Flyer Image</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                                Select Image File {!isEdit && <span className="text-red-500">*</span>}
                            </label>
                            <div className="relative">
                                <input
                                    disabled={loading}
                                    type="file"
                                    accept="image/*"
                                    id="image"
                                    name="image"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            console.log('File selected:', file.name, file.type, file.size)
                                            setValue({ ...value, image: file })
                                        }
                                    }}
                                    required={!isEdit}
                                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 disabled:opacity-50"
                                />
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                    <div className="text-center">
                                        {!value.image && (
                                            <>
                                                <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className="text-xs text-gray-500">Click to upload or drag and drop</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Image Preview */}
                        {(value.image || blobUrl) && (
                            <div className="mt-6">
                                <p className="text-sm font-medium text-gray-700 mb-3">Image Preview:</p>
                                <div className="relative inline-block">
                                    {value.image instanceof File && blobUrl ? (
                                        <div>
                                            <p className="text-xs text-gray-500 mb-2">File preview (blob URL)</p>
                                            <Image
                                                src={blobUrl}
                                                alt="flyer preview"
                                                width={192}
                                                height={192}
                                                className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200 shadow-lg"
                                                unoptimized
                                                onError={(e) => {
                                                    console.error('Image failed to load:', e)
                                                }}
                                            />
                                        </div>
                                    ) : typeof value.image === 'string' && value.image ? (
                                        <div>
                                            <p className="text-xs text-gray-500 mb-2">URL preview</p>
                                            <Image
                                                src={value.image}
                                                alt="flyer preview"
                                                width={192}
                                                height={192}
                                                className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200 shadow-lg"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-48 h-48 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                                            <p className="text-xs text-gray-500">No image to preview</p>
                                        </div>
                                    )}
                                    <div className="absolute inset-0  bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 rounded-lg"></div>
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
                                <span>{isEdit ? 'Update Flyer' : 'Add Flyer'}</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddFlyer 