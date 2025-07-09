'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Spinner from '@/components/Spinner'
import { createPhoto, updatePhoto } from '@/Server/PhotoGallery'
import { PhotoGallery } from '@/Types/Gallery'
import cloudinaryImageUploadMethod from '@/functions/cloudinary'

type Props = {
    setData: React.Dispatch<React.SetStateAction<PhotoGallery[]>>
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>
    isEdit?: boolean
    editData?: PhotoGallery
}

const AddPhotoGallery = ({ setData, isEdit, editData, setOpen }: Props) => {
    const [value, setValue] = useState<PhotoGallery>(isEdit ? editData as PhotoGallery : {
        title: '',
        description: '',
        image: '',
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (isEdit) {
            setValue(editData as PhotoGallery)
        }
    }, [isEdit, editData])

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

        const formData: PhotoGallery = {
            ...value,
            image: newImage as string,
        }

        if (isEdit) {
            await updatePhoto({ ...formData }).then((res) => {
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
            await createPhoto(formData).then((res) => {
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
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Photo Information</h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Photo Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                disabled={loading}
                                type="text"
                                id="title"
                                name="title"
                                value={value.title}
                                onChange={(e) => setValue({ ...value, title: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                                placeholder="Enter photo title"
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none disabled:bg-gray-50 disabled:text-gray-500"
                                placeholder="Enter photo description (optional)"
                            />
                        </div>
                    </div>
                </div>

                {/* Image Upload Section */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Upload Photo</h3>
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
                                    onChange={(e) =>
                                        e.target.files && setValue({ ...value, image: e.target.files[0] })
                                    }
                                    required={!isEdit}
                                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 disabled:opacity-50"
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
                        {value.image && (
                            <div className="mt-6">
                                <p className="text-sm font-medium text-gray-700 mb-3">Image Preview:</p>
                                <div className="relative inline-block">
                                    {value.image instanceof File ? (
                                        <Image
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            src={URL.createObjectURL(value.image)}
                                            alt="photo gallery preview"
                                            className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200 shadow-lg"
                                        />
                                    ) : (
                                        <Image
                                            src={value.image as string}
                                            alt="photo gallery preview"
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200 shadow-lg"
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
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
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
                                <span>{isEdit ? 'Update Photo' : 'Add Photo'}</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddPhotoGallery