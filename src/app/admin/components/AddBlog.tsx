'use client'

import type { Blog } from "@/Types/Blogs";
import React, { useState, useEffect } from 'react'
import { createBlog, updateBlog, checkSlugExists } from '@/Server/Blogs'
import Spinner from '@/components/Spinner'
import SafeImage from '@/components/SafeImage'
import cloudinaryImageUploadMethod from '@/functions/cloudinary'
import Jodit from "./jodit";
import { FaFileAlt, FaImage, FaUser, FaEdit, FaCheck, FaUpload } from 'react-icons/fa';

type Props = {
    setData: React.Dispatch<React.SetStateAction<Blog[]>>
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>
    isEdit?: boolean
    editData?: Blog
}

const AddBlog = ({ setData, setOpen, isEdit, editData }: Props) => {
    const [value, setValue] = useState<Blog>(isEdit ? editData as Blog : {
        title: '',
        description: '',
        image: '',
        content: '',
        author: '',
        slug: '',
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [success, setSuccess] = useState('')
    const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
    const [blobUrl, setBlobUrl] = useState<string | null>(null)

    useEffect(() => {
        if (isEdit) {
            setValue(editData as Blog)
        }
    }, [isEdit, editData])

    // Check slug availability when slug changes
    useEffect(() => {
        if (value.slug && value.slug.trim()) {
            checkSlugExists(value.slug, isEdit ? editData?._id as string : undefined).then(exists => {
                setSlugAvailable(!exists)
            }).catch(() => {
                setSlugAvailable(null)
            })
        }
    }, [value.slug, isEdit, editData?._id])

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

    // Cleanup blob URL on component unmount
    useEffect(() => {
        return () => {
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl)
            }
        }
    }, [blobUrl])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (value.title.trim() === '' || value.description.trim() === '' || value.content.trim() === '') {
            setMessage('Title, description, and content are required.')
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

        const formData: Blog = {
            ...value,
            image: newImage as string,
        };

        if (isEdit) {
            await updateBlog(formData).then((res) => {
                if (res) {
                    setData((prev) => prev.map((blog) => blog._id === res._id ? res : blog))
                    setSuccess('Blog updated successfully!')
                    setTimeout(() => {
                        if (setOpen) {
                            setOpen(false)
                        }
                    }, 1500)
                }
            })
                .catch(() => {
                    setMessage('Something went wrong.')
                })
                .finally(() => setLoading(false))
        }
        else {
            await createBlog(formData).then((res) => {
                if (res?.insertedId) {
                    setData((prev) => [
                        ...prev,
                        { ...formData, _id: String(res.insertedId) },
                    ])
                    setSuccess('Blog created successfully!')
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
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                            <FaFileAlt className="text-white text-lg" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Blog Title *
                            </label>
                            <input
                                disabled={loading}
                                type="text"
                                id="title"
                                name="title"
                                value={value.title}
                                onChange={(e) => setValue({ ...value, title: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100"
                                placeholder="Enter blog title"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                                URL Slug *
                            </label>
                            <div className="relative">
                                <input
                                    disabled={loading}
                                    type="text"
                                    id="slug"
                                    name="slug"
                                    value={value.slug || ''}
                                    onChange={(e) => setValue({ ...value, slug: e.target.value })}
                                    required
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors pr-10 bg-white ${
                                        slugAvailable === false ? 'border-red-500 focus:ring-red-500' : 
                                        slugAvailable === true ? 'border-green-500 focus:ring-green-500' : 
                                        'border-gray-300 focus:border-blue-500'
                                    }`}
                                    placeholder="blog-url-slug"
                                />
                                {slugAvailable !== null && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        {slugAvailable ? (
                                            <FaCheck className="text-green-500" />
                                        ) : (
                                            <span className="text-red-500 text-sm">✗</span>
                                        )}
                                    </div>
                                )}
                            </div>
                            {slugAvailable === false && (
                                <p className="text-red-500 text-xs mt-1">This slug is already taken. Please choose a different one.</p>
                            )}
                            {slugAvailable === true && (
                                <p className="text-green-500 text-xs mt-1">This slug is available!</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                URL: /Blogs/{value.slug || 'your-blog-slug'}
                            </p>
                        </div>

                        <div>
                            <label htmlFor="author" className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <FaUser className="text-blue-500" />
                                Author
                            </label>
                            <input
                                disabled={loading}
                                type="text"
                                id="author"
                                name="author"
                                value={value.author}
                                onChange={(e) => setValue({ ...value, author: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100"
                                placeholder="Enter author name"
                            />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                            <FaEdit className="text-white text-lg" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Description</h3>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Blog Description *
                        </label>
                        <textarea
                            disabled={loading}
                            id="description"
                            name="description"
                            value={value.description}
                            onChange={(e) => setValue({ ...value, description: e.target.value })}
                            required
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-100 resize-none"
                            placeholder="Enter blog description (this will appear in blog previews and search results)"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Character count: {value.description.length}
                        </p>
                    </div>
                </div>

                {/* Featured Image */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                            <FaImage className="text-white text-lg" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Featured Image</h3>
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
                                        <SafeImage
                                            width={120}
                                            height={80}
                                            src={blobUrl}
                                            alt="Blog featured image"
                                            className="w-30 h-20 object-cover rounded-lg border-2 border-purple-200"
                                        />
                                    ) : (
                                        <SafeImage
                                            width={120}
                                            height={80}
                                            src={value.image as string}
                                            alt="Blog featured image"
                                            className="w-30 h-20 object-cover rounded-lg border-2 border-purple-200"
                                        />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {value.image instanceof File ? value.image.name : 'Current featured image'}
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

                {/* Content Editor */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg">
                            <FaEdit className="text-white text-lg" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Blog Content *</h3>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Write your blog content
                        </label>
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                            <Jodit
                                label="Content"
                                content={value.content}
                                setContent={(content) => setValue({ ...value, content })}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Use the editor above to format your blog content with rich text, images, and links.
                        </p>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                    <button
                        disabled={loading}
                        type="submit"
                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center"
                    >
                        {loading ? (
                            <>
                                <Spinner />
                                Processing...
                            </>
                        ) : (
                            <>
                                <FaCheck />
                                {isEdit ? 'Update Blog' : 'Create Blog'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddBlog