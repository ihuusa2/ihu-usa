'use client'

import type { Course } from "@/Types/Courses";
import { H1 } from '@/components/Headings/index'
import React, { useEffect, useState } from 'react' 

import Spinner from '@/components/Spinner' 
import { deleteCourse, getAllCourses } from '@/Server/Course' 
import { getAllCourseTypesForSelect } from '@/Server/CourseType'

import Pagination from '@/components/Pagination' 
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Image from "next/image";
import Link from "next/link";
import { Search, Eye, Edit, Trash2, Plus, BookOpen, Image as ImageIcon, X } from "lucide-react";
import type { CourseType } from '@/Types/Courses'

const AdminCourse = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const [data, setData] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [count, setCount] = useState(0)
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
    const [selectedImageModal, setSelectedImageModal] = useState<{ images: string[], title: string } | null>(null)
    const [selectedDescriptionModal, setSelectedDescriptionModal] = useState<{ description: string, title: string } | null>(null)
    const [sort, setSort] = useState<'newest' | 'oldest' | 'title-asc' | 'title-desc'>((searchParams.get('sort') as 'newest' | 'oldest' | 'title-asc' | 'title-desc') || 'newest')
    const [category, setCategory] = useState<string>(searchParams.get('type') || '')
    const [courseTypes, setCourseTypes] = useState<CourseType[]>([])

    // Update URL params when search, sort, or category changes
    useEffect(() => {
        const params = new URLSearchParams(Array.from(searchParams.entries()))
        if (searchTerm) params.set('search', searchTerm)
        else params.delete('search')
        // Always set sort parameter to ensure proper sorting
        params.set('sort', sort)
        if (category) params.set('type', category)
        else params.delete('type')
        router.replace(`${pathname}?${params.toString()}`)
    }, [searchTerm, sort, category, router, pathname, searchParams])

    // Fetch course types for category filter
    useEffect(() => {
        getAllCourseTypesForSelect().then((types) => {
            setCourseTypes(types || [])
        })
    }, [])

    useEffect(() => {
        (async () => {
            setLoading(true)
            const params: { [key: string]: string | string[] | undefined } = Object.fromEntries(searchParams.entries())
            await getAllCourses({ searchParams: params }).then((courses) => {
                if (courses) {
                    setData(courses.list)
                    setCount(courses.count)
                }
            }).finally(() => {
                setLoading(false)
            })
        })()
    }, [searchParams])

    // Use data directly since server-side filtering handles the search
    const displayData = data

    return (
        <div className="w-full min-h-full bg-gray-50">
            <div className='py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-8 space-y-6'>
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                        <div>
                            <H1 className="flex items-center gap-2">
                                <BookOpen className="text-blue-600" size={28} />
                                Courses Management
                            </H1>
                            <p className="text-gray-600 mt-1">Manage your course content and settings</p>
                        </div>
                        <Link href="/admin/Courses/Add">
                            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md">
                                <Plus size={16} />
                                Add New Course
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Search, Sort, and Stats */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search courses by title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />

                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                            {/* Sort Dropdown */}
                            <select
                                value={sort}
                                onChange={e => setSort(e.target.value as 'newest' | 'oldest' | 'title-asc' | 'title-desc')}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="title-asc">Title A-Z</option>
                                <option value="title-desc">Title Z-A</option>
                            </select>
                            {/* Category Dropdown */}
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Categories</option>
                                {courseTypes.map((ct) => (
                                    <option key={ct._id} value={ct.title}>{ct.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>Total: {count}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Showing: {displayData.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Spinner />
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Preview</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Course Details</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {displayData.map((course) => (
                                            <tr key={course._id?.toString()} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {course.images && course.images.length > 0 ? (
                                                            <div className="relative cursor-pointer group">
                                                                <Image 
                                                                    src={course.images[0] as string} 
                                                                    alt={course.title || 'Course image'} 
                                                                    width={60} 
                                                                    height={40} 
                                                                    className="rounded-lg object-cover border-2 border-gray-200 group-hover:border-blue-400 transition-colors"
                                                                    onClick={() => setSelectedImageModal({ images: course.images as string[], title: course.title || '' })}
                                                                />
                                                                {course.images.length > 1 && (
                                                                    <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs px-1 py-0 rounded-full">
                                                                        +{course.images.length - 1}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="w-[60px] h-[40px] bg-gray-100 rounded-lg flex items-center justify-center">
                                                                <ImageIcon size={20} className="text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="font-semibold text-gray-900 line-clamp-2">
                                                            {course.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
                                                            /{course.slug}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300">
                                                        {course.type || 'No Type'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="max-w-xs">
                                                        <div className="cursor-pointer group">
                                                            <p className="text-sm text-gray-600 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                                {(course.description || 'No description available').replace(/<[^>]*>/g, '').substring(0, 100)}
                                                                {(course.description || '').replace(/<[^>]*>/g, '').length > 100 ? '...' : ''}
                                                            </p>
                                                            <button 
                                                                className="mt-1 p-0 h-auto text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                                onClick={() => setSelectedDescriptionModal({ 
                                                                    description: course.description || 'No description available', 
                                                                    title: course.title || '' 
                                                                })}
                                                            >
                                                                <Eye size={12} />
                                                                Read more
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Action course={course} setData={setData} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="lg:hidden">
                                {displayData.map((course) => (
                                    <div key={course._id?.toString()} className="p-4 border-b border-gray-200 last:border-b-0">
                                        <div className="flex items-start gap-4">
                                            {/* Image */}
                                            <div className="flex-shrink-0">
                                                {course.images && course.images.length > 0 ? (
                                                    <div className="relative cursor-pointer group">
                                                        <Image 
                                                            src={course.images[0] as string} 
                                                            alt={course.title || 'Course image'} 
                                                            width={60} 
                                                            height={40} 
                                                            className="rounded-lg object-cover border-2 border-gray-200 group-hover:border-blue-400 transition-colors"
                                                            onClick={() => setSelectedImageModal({ images: course.images as string[], title: course.title || '' })}
                                                        />
                                                        {course.images.length > 1 && (
                                                            <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs px-1 py-0 rounded-full">
                                                                +{course.images.length - 1}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="w-[60px] h-[40px] bg-gray-100 rounded-lg flex items-center justify-center">
                                                        <ImageIcon size={20} className="text-gray-400" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="space-y-2">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                                                            {course.title}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded mt-1">
                                                            /{course.slug}
                                                        </p>
                                                    </div>
                                                    
                                                    <div>
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300">
                                                            {course.type || 'No Type'}
                                                        </span>
                                                    </div>

                                                    <div>
                                                        {(course.startDate || course.endDate) && (
                                                            <div className="flex flex-wrap gap-2">
                                                                {course.startDate && (
                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                        📅 Start: {new Date(course.startDate).toLocaleDateString('en-US', { 
                                                                            month: 'short', 
                                                                            day: 'numeric',
                                                                            year: 'numeric'
                                                                        })}
                                                                    </span>
                                                                )}
                                                                {course.endDate && (
                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                                        🏁 End: {new Date(course.endDate).toLocaleDateString('en-US', { 
                                                                            month: 'short', 
                                                                            day: 'numeric',
                                                                            year: 'numeric'
                                                                        })}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <p className="text-sm text-gray-600 line-clamp-2">
                                                            {(course.description || 'No description available').replace(/<[^>]*>/g, '').substring(0, 80)}
                                                            {(course.description || '').replace(/<[^>]*>/g, '').length > 80 ? '...' : ''}
                                                        </p>
                                                        <button 
                                                            className="mt-1 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                            onClick={() => setSelectedDescriptionModal({ 
                                                                description: course.description || 'No description available', 
                                                                title: course.title || '' 
                                                            })}
                                                        >
                                                            <Eye size={12} />
                                                            Read more
                                                        </button>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 pt-2">
                                                        <Action course={course} setData={setData} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    
                    {!loading && displayData.length === 0 && searchTerm && (
                        <div className="text-center py-12">
                            <Search className="mx-auto text-gray-400 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                            <p className="text-gray-600">Try adjusting your search criteria</p>
                            <button 
                                className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                onClick={() => {
                                    setSearchTerm('')
                                    setSort('newest')
                                    setCategory('')
                                }}
                            >
                                Clear search
                            </button>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <Pagination count={count} />
            </div>

            {/* Image Modal */}
            {selectedImageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <ImageIcon size={20} />
                                    Course Images ({selectedImageModal.images.length})
                                </h3>
                                <button 
                                    onClick={() => setSelectedImageModal(null)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                {selectedImageModal.images.map((image, index) => (
                                    <div key={index} className="relative">
                                        <Image 
                                            src={image} 
                                            alt={`${selectedImageModal.title} - Image ${index + 1}`} 
                                            width={400} 
                                            height={300} 
                                            className="rounded-lg object-cover w-full"
                                        />
                                        <span className="absolute top-2 left-2 bg-white text-gray-800 text-xs px-2 py-1 rounded border border-gray-300">
                                            {index + 1}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Description Modal */}
            {selectedDescriptionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl max-h-[80vh] overflow-y-auto w-full">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Course Description</h3>
                                <button 
                                    onClick={() => setSelectedDescriptionModal(null)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedDescriptionModal.description }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

type ActionProps = {
    course: Course
    setData: React.Dispatch<React.SetStateAction<Course[]>>
}

const Action = ({ course, setData }: ActionProps) => {
    const [deletePopup, setDeletePopup] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        await deleteCourse(course._id as string).then(() => {
            // Remove from data
            setData((prev) => prev.filter((c) => c._id !== course._id))
            setDeletePopup(false)
        }).finally(() => setLoading(false))
    }

    return (
        <>
            <div className='flex items-center gap-2 flex-wrap'>
                <Link href={`/admin/Courses/${course.slug}`}>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                        <BookOpen size={14} />
                        <span className="hidden sm:inline">Subjects</span>
                    </button>
                </Link>
                <Link href={`/admin/Courses/Edit/${course._id}`}>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                        <Edit size={14} />
                        <span className="hidden sm:inline">Edit</span>
                    </button>
                </Link>
                <button 
                    className="flex items-center gap-1 px-3 py-1.5 text-xs border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
                    onClick={() => setDeletePopup(true)}
                >
                    <Trash2 size={14} />
                    <span className="hidden sm:inline">Delete</span>
                </button>
            </div>

            {/* Delete Modal */}
            {deletePopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center gap-2 text-red-600">
                                <Trash2 size={20} />
                                <h3 className="text-lg font-semibold">Delete Course</h3>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-800 break-words whitespace-normal w-full break-all">
                                    Are you sure you want to delete?
                                    <strong className="break-words whitespace-normal w-full max-w-full block break-all">
                                        &ldquo;{course.title}&rdquo;
                                    </strong>
                                    This action cannot be undone.
                                </p>
                            </div>
                            <div className='flex justify-end gap-3'>
                                <button 
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                    onClick={() => !loading && setDeletePopup(false)} 
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
                                    onClick={handleDelete} 
                                    disabled={loading}
                                >
                                    {loading ? <Spinner /> : <Trash2 size={16} />}
                                    {loading ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AdminCourse
