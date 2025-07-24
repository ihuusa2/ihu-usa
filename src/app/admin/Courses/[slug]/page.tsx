'use client'

import type { Subject } from "@/Types/Courses";
import React, { useEffect, useState, useCallback } from 'react'
import Spinner from '@/components/Spinner'
import { deleteSubject, getAllSubjects } from '@/Server/Subjects'
import Pagination from '@/components/Pagination'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import AddSubject from "../../components/AddSubject";

const AdminSubject = () => {
    const params = useParams()
    const searchParams = useSearchParams()
    const router = useRouter()
    const [data, setData] = useState<Subject[]>([])
    const [loading, setLoading] = useState(true)
    const [count, setCount] = useState(0)
    const [open, setOpen] = useState(false)
    const [editSubject, setEditSubject] = useState<Subject | null>(null)
    const [deleteSubject, setDeleteSubject] = useState<Subject | null>(null)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
    const [filterBy, setFilterBy] = useState<'all' | 'free' | 'paid'>(searchParams.get('filterBy') as 'all' | 'free' | 'paid' || 'all')

    // Function to update URL parameters
    const updateURLParams = useCallback((newSearchTerm: string, newFilterBy: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (newSearchTerm) {
            params.set('search', newSearchTerm)
        } else {
            params.delete('search')
        }
        if (newFilterBy && newFilterBy !== 'all') {
            params.set('filterBy', newFilterBy)
        } else {
            params.delete('filterBy')
        }
        params.delete('page') // Reset to first page when searching/filtering
        router.push(`?${params.toString()}`)
    }, [searchParams, router])

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            updateURLParams(searchTerm, filterBy)
        }, 500) // 500ms delay

        return () => clearTimeout(timeoutId)
    }, [searchTerm, filterBy, updateURLParams])


    useEffect(() => {
        (async () => {
            setLoading(true)
            const page = parseInt(searchParams.get('page') || '0', 10);
            await getAllSubjects({
                courseSlug: params.slug as string,
                searchParams: { 
                    ...Object.fromEntries(searchParams.entries()), 
                    page: page.toString()
                }
            }).then((subjects) => {
                if (subjects) {
                    setData(subjects.list)
                    setCount(subjects.count)
                }
            }).finally(() => {
                setLoading(false)
            })
        })()
    }, [searchParams, params.slug])

    // Use data directly since filtering is now server-side
    const filteredData = data



    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {/* Enhanced Header Section */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 sm:space-x-3 ">
                                <div className="flex-shrink-0 pb-8">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 truncate pb-4">
                                        Subjects Management
                                    </h1>
                                    <p className="mt-1 text-sm sm:text-base text-gray-600">
                                        Course: <span className="font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{params.slug}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <button 
                                onClick={() => setOpen(true)}
                                className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span className="text-sm sm:text-base">Add Subject</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Enhanced Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Subjects</p>
                                <p className="text-2xl font-bold text-gray-900">{filteredData.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center">
                            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Subjects</p>
                                <p className="text-2xl font-bold text-gray-900">{filteredData.filter(s => s.title).length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center">
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Paid Subjects</p>
                                <p className="text-2xl font-bold text-gray-900">{filteredData.filter(s => s.price && s.price.length > 0).length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center">
                            <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Free Subjects</p>
                                <p className="text-2xl font-bold text-gray-900">{filteredData.filter(s => !s.price || s.price.length === 0).length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Search and Filter Section */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1 max-w-lg">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search subjects..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <select
                                value={filterBy}
                                onChange={(e) => setFilterBy(e.target.value as 'all' | 'free' | 'paid')}
                                className="px-3 py-2.5 border border-gray-300 rounded-xl bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            >
                                <option value="all">All Subjects</option>
                                <option value="free">Free Only</option>
                                <option value="paid">Paid Only</option>
                            </select>
                            
                            <div className="flex bg-gray-100 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        viewMode === 'list' 
                                            ? 'bg-white text-gray-900 shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        viewMode === 'grid' 
                                            ? 'bg-white text-gray-900 shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-12">
                        <div className="flex flex-col items-center justify-center">
                            <Spinner size="3rem" color="text-blue-500" />
                            <p className="mt-4 text-sm text-gray-500">Loading subjects...</p>
                        </div>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-12">
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm || filterBy !== 'all' ? 'No subjects found' : 'No subjects yet'}
                            </h3>
                            <p className="text-gray-500 mb-6 text-center max-w-md">
                                {searchTerm || filterBy !== 'all' 
                                    ? 'Try adjusting your search or filter criteria.' 
                                    : 'Get started by creating your first subject for this course.'}
                            </p>
                            <button 
                                onClick={() => setOpen(true)}
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add First Subject
                            </button>
                        </div>
                    </div>
                ) : viewMode === 'grid' ? (
                    <GridView data={filteredData} setEditSubject={setEditSubject} setDeleteSubject={setDeleteSubject} />
                ) : (
                    <ListView data={filteredData} setEditSubject={setEditSubject} setDeleteSubject={setDeleteSubject} />
                )}

                {/* Enhanced Pagination */}
                {!loading && filteredData.length > 0 && (
                    <div className="mt-8">
                        <Pagination count={count} />
                    </div>
                )}

                {/* Add Subject Modal */}
                <Modal open={open} onClose={() => setOpen(false)} title="Add New Subject" size="lg">
                    <AddSubject setData={setData} setOpen={setOpen} isModal={true} />
                </Modal>

                {/* Edit Subject Modal */}
                {editSubject && (
                    <Modal open={!!editSubject} onClose={() => setEditSubject(null)} title="Edit Subject" size="lg">
                        <AddSubject 
                            setData={setData} 
                            setOpen={() => setEditSubject(null)} 
                            isEdit={true} 
                            editData={editSubject}
                            isModal={true}
                        />
                    </Modal>
                )}

                {/* Delete Subject Modal */}
                {deleteSubject && (
                    <Modal open={!!deleteSubject} onClose={() => setDeleteSubject(null)} title="Delete Subject Confirmation" size="md">
                        <DeleteConfirmation 
                            subject={deleteSubject} 
                            setData={setData} 
                            onClose={() => setDeleteSubject(null)}
                            onEditClose={() => setEditSubject(null)}
                        />
                    </Modal>
                )}
            </div>
        </div>
    )
}

// Grid View Component
const GridView = ({ 
    data, 
    setEditSubject, 
    setDeleteSubject 
}: { 
    data: Subject[]; 
    setEditSubject: React.Dispatch<React.SetStateAction<Subject | null>>;
    setDeleteSubject: React.Dispatch<React.SetStateAction<Subject | null>>;
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {data.map((subject) => (
                <div key={subject._id?.toString()} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6 hover:shadow-lg hover:scale-105 transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-lg font-bold text-white">
                                {subject.title?.charAt(0).toUpperCase() || 'S'}
                            </span>
                        </div>
                        <div className="flex space-x-2">
                            {subject.price && subject.price.length > 0 ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Paid
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Free
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{subject.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Slug:</span> {subject.slug}
                        </p>
                        {subject.description && (
                            <div className="text-sm text-gray-600 line-clamp-3" dangerouslySetInnerHTML={{ __html: subject.description }} />
                        )}
                    </div>
                    
                    {subject.price && subject.price.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Pricing:</p>
                            <div className="flex flex-wrap gap-2">
                                {subject.price.map((p: { amount: number; type: string }, idx: number) => (
                                    <span key={idx} className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800">
                                        ${p.amount} {p.type}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditSubject(subject);
                                }}
                                className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                            </button>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteSubject(subject);
                                }}
                                className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

// List View Component
const ListView = ({ 
    data, 
    setEditSubject, 
    setDeleteSubject 
}: { 
    data: Subject[]; 
    setEditSubject: React.Dispatch<React.SetStateAction<Subject | null>>;
    setDeleteSubject: React.Dispatch<React.SetStateAction<Subject | null>>;
}) => {
    return (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 overflow-hidden">
            {/* Mobile Cards */}
            <div className="block sm:hidden">
                {data.map((subject) => (
                    <div key={subject._id?.toString()} className="border-b border-gray-200 last:border-b-0 p-4">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-lg font-bold text-white">
                                    {subject.title?.charAt(0).toUpperCase() || 'S'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900 truncate">{subject.title}</h3>
                                    <div className="flex space-x-2">
                                        {subject.price && subject.price.length > 0 ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800">
                                                Paid
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-800">
                                                Free
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                    <span className="font-medium">Slug:</span> {subject.slug}
                                </p>
                                {subject.description && (
                                    <div className="text-sm text-gray-600 mb-3 line-clamp-2" dangerouslySetInnerHTML={{ __html: subject.description }} />
                                )}
                                {subject.price && subject.price.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {subject.price.map((p: { amount: number; type: string }, idx: number) => (
                                            <span key={idx} className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800">
                                                ${p.amount} {p.type}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditSubject(subject);
                                        }}
                                        className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteSubject(subject);
                                        }}
                                        className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    Title
                                </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Slug</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {data.map((subject) => (
                            <tr 
                                key={subject._id?.toString()} 
                                className="hover:bg-gray-50/50 transition-colors duration-150"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                            <span className="text-sm font-bold text-white">
                                                {subject.title?.charAt(0).toUpperCase() || 'S'}
                                            </span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-semibold text-gray-900">{subject.title}</div>
                                            <div className="text-sm text-gray-500">ID: {subject._id?.toString().slice(-8)}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {subject.slug}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Subject
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {subject.price && subject.price.length > 0 ? (
                                        <div className="space-y-1">
                                            {subject.price.map((p: { amount: number; type: string }, idx: number) => (
                                                <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    ${p.amount} {p.type}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            Free
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <DescriptionCell description={subject.description} />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditSubject(subject);
                                            }}
                                            className="inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteSubject(subject);
                                            }}
                                            className="inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// Enhanced Popup Modal Component (Table ke bahar display hota hai)
const Modal = ({ open, onClose, title, children, size = 'md' }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
    if (!open) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl'
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
            <div className={`bg-white rounded-xl shadow-2xl ${sizeClasses[size]} w-full max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-100`}>
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            {title.includes('Delete') ? (
                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                            ) : title.includes('Add') ? (
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                            ) : (
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                            )}
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="p-6 bg-white">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Enhanced Description Cell Component
const DescriptionCell = ({ description }: { description?: string }) => {
    const [showFull, setShowFull] = useState(false);

    if (!description) return (
        <span className="text-gray-400 italic text-sm">No description available</span>
    );

    const shortDescription = description.substring(0, 80) + (description.length > 80 ? '...' : '');

    return (
        <div className="max-w-xs">
            {showFull ? (
                <div className="space-y-2">
                    <div 
                        className="text-sm text-gray-900 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: description }} 
                    />
                    <button
                        onClick={() => setShowFull(false)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors duration-200"
                    >
                        Show less
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    <div 
                        className="text-sm text-gray-600 leading-relaxed overflow-hidden"
                        style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                        }}
                        dangerouslySetInnerHTML={{ __html: shortDescription }} 
                    />
                    {description.length > 80 && (
                        <button
                            onClick={() => setShowFull(true)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors duration-200"
                        >
                            Read more
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

// Delete Confirmation Component
const DeleteConfirmation = ({ 
    subject, 
    setData, 
    onClose, 
    onEditClose 
}: { 
    subject: Subject; 
    setData: React.Dispatch<React.SetStateAction<Subject[]>>; 
    onClose: () => void; 
    onEditClose: () => void;
}) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        await deleteSubject(subject._id as string).then(() => {
            setData((prev) => prev.filter((s) => s._id !== subject._id));
            onClose();
            onEditClose();
        }).finally(() => setLoading(false));
    };

    return (
        <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                        <p className="text-red-800 font-medium">Are you sure you want to delete this subject?</p>
                        <p className="text-red-600 text-sm mt-1">
                            Subject: <span className="font-semibold">{subject.title}</span>
                        </p>
                        <p className="text-red-600 text-sm">Slug: <span className="font-semibold">{subject.slug}</span></p>
                        <p className="text-red-600 text-sm mt-1">This action cannot be undone.</p>
                    </div>
                </div>
            </div>
            
            <div className="flex justify-end gap-3">
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Spinner size="1rem" color="text-white" />
                            <span>Deleting...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AdminSubject