'use client'

import type { Course, CourseType, TestimonialVideo, CourseFAQ } from "@/Types/Courses";
import React, { useState, useEffect } from 'react'
import { createCourse, updateCourse } from '@/Server/Course'
import Spinner from '@/components/Spinner'
import cloudinaryImageUploadMethod, { cloudinaryVideoUploadMethod } from '@/functions/cloudinary'
import Jodit from "./jodit";
import Image from "next/image";
import { MdDelete, MdAdd, MdInfo, MdUpload, MdVideoLibrary, MdQuestionAnswer, MdPhotoLibrary, MdSettings } from "react-icons/md";
import { getAllCourseTypesForSelect } from "@/Server/CourseType";

type Props = {
    setData: React.Dispatch<React.SetStateAction<Course[]>>
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>
    onSuccess?: () => void
    isEdit?: boolean
    editData?: Course
}

const AddCourse = ({ setData, setOpen, onSuccess, isEdit, editData }: Props) => {
    const [value, setValue] = useState<Course>(isEdit ? editData as Course : {
        title: '',
        slug: '',
        images: [],
        description: '',
        type: '',
        price: [
            { type: 'INR', amount: 0 },
            { type: 'USD', amount: 0 }
        ],
        duration: '',
        level: 'Beginner',
        instructor: '',
        status: 'active',
        startDate: '',
        endDate: '',
        testimonialVideos: [],
        faqs: [],
        galleryImages: []
    })
    const [courseTypes, setCourseTypes] = useState<CourseType[]>([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [activeTab, setActiveTab] = useState('basic')
    const [showTypeDropdown, setShowTypeDropdown] = useState(false)

    useEffect(() => {
        if (isEdit) {
            setValue({
                ...editData as Course,
                price: editData?.price || [
                    { type: 'INR', amount: 0 },
                    { type: 'USD', amount: 0 }
                ],
                duration: editData?.duration || '',
                level: editData?.level || 'Beginner',
                instructor: editData?.instructor || '',
                status: editData?.status || 'active',
                startDate: editData?.startDate || '',
                endDate: editData?.endDate || '',
                testimonialVideos: editData?.testimonialVideos || [],
                faqs: editData?.faqs || [],
                galleryImages: editData?.galleryImages || []
            })
        }
    }, [isEdit, editData])

    // Add new testimonial video
    const addTestimonialVideo = () => {
        const newVideo: TestimonialVideo = {
            _id: `testimonial-${value.testimonialVideos?.length || 0}-${Date.now()}`,
            title: '',
            description: '',
            videoUrl: ''
        }
        setValue({ 
            ...value, 
            testimonialVideos: [...(value.testimonialVideos || []), newVideo] 
        })
    }

    // Remove testimonial video
    const removeTestimonialVideo = (index: number) => {
        const updated = value.testimonialVideos?.filter((_, i) => i !== index) || []
        setValue({ ...value, testimonialVideos: updated })
    }

    // Update testimonial video
    const updateTestimonialVideo = (index: number, field: keyof TestimonialVideo, val: string | File) => {
        const updated = [...(value.testimonialVideos || [])]
        updated[index] = { ...updated[index], [field]: val }
        setValue({ ...value, testimonialVideos: updated })
    }

    // Add new FAQ
    const addFAQ = () => {
        const newFAQ: CourseFAQ = {
            _id: `faq-${value.faqs?.length || 0}-${Date.now()}`,
            question: '',
            answer: ''
        }
        setValue({ 
            ...value, 
            faqs: [...(value.faqs || []), newFAQ] 
        })
    }

    // Remove FAQ
    const removeFAQ = (index: number) => {
        const updated = value.faqs?.filter((_, i) => i !== index) || []
        setValue({ ...value, faqs: updated })
    }

    // Update FAQ
    const updateFAQ = (index: number, field: keyof CourseFAQ, val: string) => {
        const updated = [...(value.faqs || [])]
        updated[index] = { ...updated[index], [field]: val }
        setValue({ ...value, faqs: updated })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (value.title.trim() === '' || value.slug.trim() === '' || value.description.trim() === '') return

        setLoading(true)

        let newImages = value.images as string[]
        let newGalleryImages = value.galleryImages as string[]

        // Upload main images
        if (value.images.some(image => image instanceof File)) {
            try {
                const uploadPromises = (value.images as File[]).map(image => cloudinaryImageUploadMethod(image))
                const uploadResults = await Promise.all(uploadPromises)
                newImages = uploadResults.map(result => result.secure_url)
            } catch {
                setMessage('Main image upload failed.')
                setLoading(false)
                return
            }
        }

        // Upload gallery images
        if (value.galleryImages && value.galleryImages.some(image => image instanceof File)) {
            try {
                const uploadPromises = (value.galleryImages as File[]).map(image => cloudinaryImageUploadMethod(image))
                const uploadResults = await Promise.all(uploadPromises)
                newGalleryImages = uploadResults.map(result => result.secure_url)
            } catch {
                setMessage('Gallery image upload failed.')
                setLoading(false)
                return
            }
        }

        // Upload testimonial videos
        let updatedTestimonialVideos = value.testimonialVideos || []
        if (value.testimonialVideos && value.testimonialVideos.some(video => video.videoFile instanceof File)) {
            try {
                const videoUploadPromises = value.testimonialVideos.map(async (video) => {
                    if (video.videoFile instanceof File) {
                        const uploadResult = await cloudinaryVideoUploadMethod(video.videoFile)
                        return {
                            ...video,
                            videoUrl: uploadResult.secure_url,
                            videoFile: undefined // Remove the file after upload
                        }
                    }
                    return video
                })
                updatedTestimonialVideos = await Promise.all(videoUploadPromises)
            } catch {
                setMessage('Video upload failed.')
                setLoading(false)
                return
            }
        }

        const formData: Course = {
            ...value,
            slug: value.slug ?
                value.slug.replace(/\s+/g, '-').toLowerCase() :
                value.title.replace(/\s+/g, '-').toLowerCase(),
            images: newImages,
            galleryImages: newGalleryImages,
            testimonialVideos: updatedTestimonialVideos,
        }

        if (isEdit) {
            await updateCourse(formData).then((res) => {
                if (res) {
                    setData((prev) => prev.map((course) => course._id === res._id ? res : course))
                    if (setOpen) {
                        setOpen(false)
                    } else if (onSuccess) {
                        onSuccess()
                    }
                }
            })
                .catch(() => {
                    setMessage('Something went wrong.')
                })
                .finally(() => setLoading(false))
        } else {
            await createCourse(formData).then((res) => {
                if (res?.insertedId) {
                    setData((prev) => [
                        ...prev,
                        { ...formData, _id: String(res.insertedId) },
                    ])
                    if (setOpen) {
                        setOpen(false)
                    } else if (onSuccess) {
                        onSuccess()
                    }
                }
            }).catch(() => {
                setMessage('Something went wrong.')
            })
                .finally(() => setLoading(false))
        }
    }

    useEffect(() => {
        (async() => {
            await getAllCourseTypesForSelect().then((courseTypes) => {
                if (courseTypes) {
                    setCourseTypes(courseTypes)
                }
            })
        })()
    },[])

    const tabs = [
        { id: 'basic', label: 'Basic Info', icon: <MdSettings className="w-4 h-4" /> },
        { id: 'testimonials', label: 'Testimonials', icon: <MdVideoLibrary className="w-4 h-4" /> },
        { id: 'faqs', label: 'FAQs', icon: <MdQuestionAnswer className="w-4 h-4" /> },
        { id: 'gallery', label: 'Gallery', icon: <MdPhotoLibrary className="w-4 h-4" /> }
    ]

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {message && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                                <MdInfo className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-red-700 text-sm">{message}</p>
                            </div>
                        )}
                        
                        {/* Tab Navigation */}
                        <div className="mb-8">
                            <div className="flex flex-wrap gap-2 sm:gap-4 border-b border-gray-200">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`${
                                            activeTab === tab.id
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-800'
                                        } flex items-center gap-2 px-4 py-3 rounded-t-xl border-b-2 font-medium text-sm transition-all duration-200`}
                                    >
                                        {tab.icon}
                                        <span className="hidden sm:inline">{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Basic Information Tab */}
                        {activeTab === 'basic' && (
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <MdSettings className="w-5 h-5 text-blue-600" />
                                        Basic Course Information
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="title" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                Course Title
                                            </label>
                                            <input
                                                disabled={loading}
                                                type="text"
                                                id="title"
                                                name="title"
                                                value={value.title}
                                                onChange={(e) => setValue({ ...value, title: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                                                placeholder="Enter course title"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="slug" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                URL Slug
                                            </label>
                                            <input
                                                disabled={loading}
                                                type="text"
                                                id="slug"
                                                name="slug"
                                                value={value.slug}
                                                onChange={(e) => setValue({ ...value, slug: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                                                placeholder="course-url-slug"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                            Course Type
                                        </label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                disabled={loading}
                                                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-left flex justify-between items-center"
                                            >
                                                <span className={value.type ? 'text-gray-900' : 'text-gray-500'}>
                                                    {value.type || 'Select a course type'}
                                                </span>
                                                <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showTypeDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            {showTypeDropdown && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
                                                    {courseTypes.map((type) => (
                                                        <button
                                                            key={type._id as string}
                                                            type="button"
                                                            onClick={() => {
                                                                setValue({ ...value, type: type.title as string })
                                                                setShowTypeDropdown(false)
                                                            }}
                                                            className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                                                        >
                                                            {type.title}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Pricing Section */}
                                    <div className="mt-6">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            Course Pricing
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="inr-price" className="block text-sm font-medium text-gray-700">
                                                    INR Price (₹)
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                                        ₹
                                                    </span>
                                                    <input
                                                        disabled={loading}
                                                        type="number"
                                                        id="inr-price"
                                                        name="inr-price"
                                                        value={value.price?.[0]?.amount || 0}
                                                        onChange={(e) => setValue({ 
                                                            ...value, 
                                                            price: [
                                                                { type: 'INR', amount: parseFloat(e.target.value) || 0 }, 
                                                                { type: 'USD', amount: value.price?.[1]?.amount || 0 }
                                                            ] 
                                                        })}
                                                        min="0"
                                                        step="0.01"
                                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="usd-price" className="block text-sm font-medium text-gray-700">
                                                    USD Price ($)
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                                        $
                                                    </span>
                                                    <input
                                                        disabled={loading}
                                                        type="number"
                                                        id="usd-price"
                                                        name="usd-price"
                                                        value={value.price?.[1]?.amount || 0}
                                                        onChange={(e) => setValue({ 
                                                            ...value, 
                                                            price: [
                                                                { type: 'INR', amount: value.price?.[0]?.amount || 0 }, 
                                                                { type: 'USD', amount: parseFloat(e.target.value) || 0 }
                                                            ] 
                                                        })}
                                                        min="0"
                                                        step="0.01"
                                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Course Details Section */}
                                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="duration" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                                Duration
                                            </label>
                                            <input
                                                disabled={loading}
                                                type="text"
                                                id="duration"
                                                name="duration"
                                                value={value.duration || ''}
                                                onChange={(e) => setValue({ ...value, duration: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                                                placeholder="e.g., 8 weeks, 3 months"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="level" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                Level
                                            </label>
                                            <select
                                                disabled={loading}
                                                id="level"
                                                name="level"
                                                value={value.level || 'Beginner'}
                                                onChange={(e) => setValue({ ...value, level: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                                            >
                                                <option value="Beginner">Beginner</option>
                                                <option value="Intermediate">Intermediate</option>
                                                <option value="Advanced">Advanced</option>
                                                <option value="All Levels">All Levels</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="instructor" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                                                Meet the Dean
                                            </label>
                                            <input
                                                disabled={loading}
                                                type="text"
                                                id="instructor"
                                                name="instructor"
                                                value={value.instructor || ''}
                                                onChange={(e) => setValue({ ...value, instructor: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                                                placeholder="Instructor name"
                                            />
                                        </div>
                                    </div>

                                    {/* Course Schedule Section */}
                                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="startDate" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                                Start Date
                                            </label>
                                            <input
                                                disabled={loading}
                                                type="date"
                                                id="startDate"
                                                name="startDate"
                                                value={value.startDate || ''}
                                                onChange={(e) => setValue({ ...value, startDate: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="endDate" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                                                End Date
                                            </label>
                                            <input
                                                disabled={loading}
                                                type="date"
                                                id="endDate"
                                                name="endDate"
                                                value={value.endDate || ''}
                                                onChange={(e) => setValue({ ...value, endDate: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-2">
                                        <label htmlFor="images" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <MdUpload className="w-4 h-4" />
                                            Main Images
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
                                            <input
                                                disabled={loading}
                                                type="file"
                                                accept="image/*"
                                                id="images"
                                                name="images"
                                                multiple
                                                onChange={(e) =>
                                                    e.target.files && setValue({ ...value, images: Array.from(e.target.files) })
                                                }
                                                className="hidden"
                                            />
                                            <label htmlFor="images" className="cursor-pointer">
                                                <MdUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                <p className="text-sm text-gray-600">
                                                    Click to upload images or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    PNG, JPG, GIF up to 10MB each
                                                </p>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    {value.images.length > 0 && (
                                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                            {value.images.map((image, index) => (
                                                <div key={index} className="relative group">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setValue({ 
                                                            ...value, 
                                                            images: value.images.filter((_, i) => i !== index) as unknown as string[] 
                                                        })}
                                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                                                    >
                                                        <MdDelete size={14}/>
                                                    </button>
                                                    <Image
                                                        src={image instanceof File ? URL.createObjectURL(image) : (image as string)}
                                                        alt={`course image ${index + 1}`}
                                                        width={120}
                                                        height={120}
                                                        className="w-full h-24 object-cover rounded-xl border-2 border-gray-200 group-hover:border-blue-300 transition-colors duration-200"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-6 space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                            Description
                                        </label>
                                        <Jodit
                                            content={value.description}
                                            setContent={(content) => setValue({ ...value, description: content })}
                                            label=""
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Testimonials Tab */}
                        {activeTab === 'testimonials' && (
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                            <MdVideoLibrary className="w-5 h-5 text-green-600" />
                                            Testimonial Videos
                                        </h3>
                                        <button 
                                            type="button" 
                                            onClick={addTestimonialVideo}
                                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors duration-200 font-medium"
                                        >
                                            <MdAdd className="w-5 h-5" /> Add Video
                                        </button>
                                    </div>
                                    
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                                        <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                            <MdInfo className="w-4 h-4" />
                                            Video Upload Options
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-blue-800">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                <strong>YouTube URL:</strong> Paste any YouTube video link
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                <strong>Video File:</strong> Upload MP4, MOV, AVI files (max 100MB)
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                                <strong>External URL:</strong> Use direct video links from other platforms
                                            </div>
                                        </div>
                                    </div>

                                    {value.testimonialVideos && value.testimonialVideos.length > 0 ? (
                                        <div className="space-y-6">
                                            {value.testimonialVideos.map((video, index) => (
                                                <div key={video._id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                                    <div className="flex justify-between items-center mb-6">
                                                        <h4 className="font-semibold text-gray-900 text-lg">Video {index + 1}</h4>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTestimonialVideo(index)}
                                                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors duration-200"
                                                        >
                                                            <MdDelete className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-semibold text-gray-700">Title</label>
                                                            <input
                                                                value={video.title}
                                                                onChange={(e) => updateTestimonialVideo(index, 'title', e.target.value)}
                                                                placeholder="Video title"
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-semibold text-gray-700">Video URL (YouTube/External)</label>
                                                            <input
                                                                value={video.videoUrl}
                                                                onChange={(e) => {
                                                                    updateTestimonialVideo(index, 'videoUrl', e.target.value)
                                                                    if (video.videoFile) {
                                                                        updateTestimonialVideo(index, 'videoFile', undefined as unknown as File)
                                                                    }
                                                                }}
                                                                placeholder="https://youtube.com/watch?v=..."
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                            />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mt-6 space-y-2">
                                                        <label className="text-sm font-semibold text-gray-700">Or Upload Video File</label>
                                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-green-400 transition-colors duration-200">
                                                            <input
                                                                type="file"
                                                                accept="video/*"
                                                                onChange={(e) => {
                                                                    if (e.target.files && e.target.files[0]) {
                                                                        updateTestimonialVideo(index, 'videoFile', e.target.files[0])
                                                                        if (video.videoUrl) {
                                                                            updateTestimonialVideo(index, 'videoUrl', '')
                                                                        }
                                                                    }
                                                                }}
                                                                className="hidden"
                                                                id={`video-file-${index}`}
                                                            />
                                                            <label htmlFor={`video-file-${index}`} className="cursor-pointer">
                                                                <MdUpload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                                                <p className="text-sm text-gray-600">Click to upload video file</p>
                                                            </label>
                                                        </div>
                                                        {video.videoFile && (
                                                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                                <p className="text-sm text-green-700 flex items-center gap-2">
                                                                    <MdInfo className="w-4 h-4" />
                                                                    File selected: {video.videoFile.name}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="mt-6 space-y-2">
                                                        <label className="text-sm font-semibold text-gray-700">Description</label>
                                                        <textarea
                                                            value={video.description || ''}
                                                            onChange={(e) => updateTestimonialVideo(index, 'description', e.target.value)}
                                                            placeholder="Video description"
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                                                            rows={3}
                                                        />
                                                    </div>
                                                    
                                                    {/* Video Preview */}
                                                    {(video.videoUrl || video.videoFile) && (
                                                        <div className="mt-6 space-y-2">
                                                            <label className="text-sm font-semibold text-gray-700">Video Preview</label>
                                                            <div className="p-4 bg-gray-50 rounded-xl">
                                                                {video.videoFile ? (
                                                                    <video
                                                                        className="w-full max-w-md h-auto rounded-lg mx-auto"
                                                                        controls
                                                                        preload="metadata"
                                                                    >
                                                                        <source src={URL.createObjectURL(video.videoFile)} type="video/mp4" />
                                                                        Your browser does not support the video tag.
                                                                    </video>
                                                                ) : video.videoUrl && (
                                                                    <div className="text-sm text-gray-600 space-y-2">
                                                                        <p><strong>Video URL:</strong> {video.videoUrl}</p>
                                                                        {video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be') ? (
                                                                            <p className="text-blue-600 flex items-center gap-2">
                                                                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                                                YouTube video detected
                                                                            </p>
                                                                        ) : (
                                                                            <p className="text-green-600 flex items-center gap-2">
                                                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                                                External video URL
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-gray-500">
                                            <MdVideoLibrary className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <p className="text-lg font-medium mb-2">No testimonial videos added yet</p>
                                            <p className="text-sm">Click &quot;Add Video&quot; to get started with your course testimonials</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* FAQs Tab */}
                        {activeTab === 'faqs' && (
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                            <MdQuestionAnswer className="w-5 h-5 text-purple-600" />
                                            Course FAQs
                                        </h3>
                                        <button 
                                            type="button" 
                                            onClick={addFAQ}
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors duration-200 font-medium"
                                        >
                                            <MdAdd className="w-5 h-5" /> Add FAQ
                                        </button>
                                    </div>

                                    {value.faqs && value.faqs.length > 0 ? (
                                        <div className="space-y-6">
                                            {value.faqs.map((faq, index) => (
                                                <div key={faq._id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                                    <div className="flex justify-between items-center mb-6">
                                                        <h4 className="font-semibold text-gray-900 text-lg">FAQ {index + 1}</h4>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFAQ(index)}
                                                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors duration-200"
                                                        >
                                                            <MdDelete className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                    
                                                    <div className="space-y-6">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-semibold text-gray-700">Question</label>
                                                            <input
                                                                value={faq.question}
                                                                onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                                                                placeholder="Enter the question"
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-semibold text-gray-700">Answer</label>
                                                            <textarea
                                                                value={faq.answer}
                                                                onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                                                                placeholder="Enter the answer"
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                                                                rows={4}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-gray-500">
                                            <MdQuestionAnswer className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <p className="text-lg font-medium mb-2">No FAQs added yet</p>
                                            <p className="text-sm">Click &quot;Add FAQ&quot; to start building your course FAQ section</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Gallery Tab */}
                        {activeTab === 'gallery' && (
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-xl border border-orange-200">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                        <MdPhotoLibrary className="w-5 h-5 text-orange-600" />
                                        Additional Gallery Images
                                    </h3>
                                    
                                    <div className="space-y-2">
                                        <label htmlFor="galleryImages" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <MdUpload className="w-4 h-4" />
                                            Gallery Images
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition-colors duration-200">
                                            <input
                                                disabled={loading}
                                                type="file"
                                                accept="image/*"
                                                id="galleryImages"
                                                name="galleryImages"
                                                multiple
                                                onChange={(e) =>
                                                    e.target.files && setValue({ ...value, galleryImages: Array.from(e.target.files) })
                                                }
                                                className="hidden"
                                            />
                                            <label htmlFor="galleryImages" className="cursor-pointer">
                                                <MdUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                <p className="text-sm text-gray-600">
                                                    Click to upload gallery images or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    PNG, JPG, GIF up to 10MB each
                                                </p>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    {value.galleryImages && value.galleryImages.length > 0 && (
                                        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                            {value.galleryImages.map((image, index) => (
                                                <div key={index} className="relative group">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setValue({ 
                                                            ...value, 
                                                            galleryImages: value.galleryImages?.filter((_, i) => i !== index) as unknown as string[] 
                                                        })}
                                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                                                    >
                                                        <MdDelete size={14}/>
                                                    </button>
                                                    <Image
                                                        src={image instanceof File ? URL.createObjectURL(image) : (image as string)}
                                                        alt={`gallery image ${index + 1}`}
                                                        width={120}
                                                        height={120}
                                                        className="w-full h-24 object-cover rounded-xl border-2 border-gray-200 group-hover:border-orange-300 transition-colors duration-200"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-end pt-8 border-t border-gray-200 mt-8">
                            <button 
                                disabled={loading} 
                                type="submit" 
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                                {loading ? (
                                    <>
                                        <Spinner />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <MdSettings className="w-5 h-5" />
                                        {isEdit ? 'Update Course' : 'Create Course'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
    )
}

export default AddCourse