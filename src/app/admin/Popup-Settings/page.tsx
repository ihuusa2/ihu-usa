'use client'

import React, { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner'
import { getPopupSettings, deletePopupSettings } from '@/Server/PopupSettings'
import { PopupSettings } from '@/Types/PopupSettings'
import AddPopupSettings from '../components/AddPopupSettings'
import { 
    FaInfoCircle, 
    FaEdit, 
    FaTrash, 
    FaPlus, 
    FaEye, 
    FaToggleOn, 
    FaToggleOff,
    FaCalendarAlt,
    FaGraduationCap,
    FaLink,
    FaUser,
    FaBuilding,
    FaExclamationTriangle,
    FaCheckCircle,
    FaTimes
} from 'react-icons/fa'

const AdminPopupSettings = () => {
    const [data, setData] = useState<PopupSettings | null>(null)
    const [loading, setLoading] = useState(true)
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const result = await getPopupSettings()
            setData(result)
        } catch (error) {
            console.error('Error loading popup settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        setDeleteLoading(true)
        try {
            await deletePopupSettings()
            setData(null)
            setShowDeleteDialog(false)
        } catch (error) {
            console.error('Error deleting popup settings:', error)
        } finally {
            setDeleteLoading(false)
        }
    }

    const handleSeedData = async () => {
        setDeleteLoading(true)
        try {
            const response = await fetch('/api/seed-popup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const result = await response.json()
            if (result.success) {
                setData(result.data)
            } else {
                console.error('Error seeding data:', result.message)
            }
        } catch (error) {
            console.error('Error seeding popup data:', error)
        } finally {
            setDeleteLoading(false)
        }
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not set'
        return dateString
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="w-full min-h-full bg-gray-50">
            <div className='py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-8 space-y-6'>
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-100">
                    <div className="p-6">
                        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                                        <FaInfoCircle className="text-white text-xl" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-800">Popup Settings</h1>
                                    {data && (
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            data.isActive 
                                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                                        }`}>
                                            {data.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-600 ml-15">
                                    Manage the upcoming course popup that displays on the homepage
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowAddDialog(true)}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium"
                                >
                                    {data ? (
                                        <>
                                            <FaEdit size={16} />
                                            Edit Settings
                                        </>
                                    ) : (
                                        <>
                                            <FaPlus size={16} />
                                            Create Popup
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                {data ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="border-b border-gray-100 p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded-full ${data.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                                    <h2 className="text-xl font-semibold text-gray-800">Current Popup Configuration</h2>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowAddDialog(true)}
                                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                                    >
                                        <FaEdit size={14} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteDialog(true)}
                                        className="flex items-center gap-2 px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                                    >
                                        <FaTrash size={14} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Status */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        {data.isActive ? <FaToggleOn className="text-green-500" /> : <FaToggleOff className="text-gray-400" />}
                                        Status
                                    </label>
                                    <div className={`px-4 py-3 rounded-xl border-2 ${
                                        data.isActive 
                                            ? 'border-green-200 bg-green-50' 
                                            : 'border-gray-200 bg-gray-50'
                                    }`}>
                                        <span className={`font-medium ${
                                            data.isActive ? 'text-green-700' : 'text-gray-700'
                                        }`}>
                                            {data.isActive ? 'Active - Showing on homepage' : 'Inactive - Hidden from homepage'}
                                        </span>
                                    </div>
                                </div>

                                {/* Title */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <FaInfoCircle className="text-blue-500" />
                                        Title
                                    </label>
                                    <div className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50">
                                        <span className="text-gray-800">{data.title || 'Not set'}</span>
                                    </div>
                                </div>

                                {/* Course Name */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <FaGraduationCap className="text-purple-500" />
                                        Course Name
                                    </label>
                                    <div className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50">
                                        <span className="text-gray-800 font-medium">{data.courseName || 'Not set'}</span>
                                    </div>
                                </div>

                                {/* Start Date */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <FaCalendarAlt className="text-orange-500" />
                                        Start Date
                                    </label>
                                    <div className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50">
                                        <span className="text-gray-800">{formatDate(data.startDate)}</span>
                                    </div>
                                </div>

                                {/* Course Link */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <FaLink className="text-green-500" />
                                        Course Link
                                    </label>
                                    <div className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50">
                                        <span className="text-blue-600 font-mono text-sm break-all">{data.courseLink || 'Not set'}</span>
                                    </div>
                                </div>

                                {/* Button Text */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <FaEye className="text-indigo-500" />
                                        Button Text
                                    </label>
                                    <div className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50">
                                        <span className="text-gray-800">{data.buttonText || 'Not set'}</span>
                                    </div>
                                </div>

                                {/* Organization */}
                                {data.organization && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <FaBuilding className="text-cyan-500" />
                                            Organization
                                        </label>
                                        <div className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50">
                                            <span className="text-gray-800">{data.organization}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Instructor */}
                                {data.instructor && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <FaUser className="text-pink-500" />
                                            Instructor
                                        </label>
                                        <div className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50">
                                            <span className="text-gray-800">{data.instructor}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mt-8 space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <FaInfoCircle className="text-blue-500" />
                                    Description
                                </label>
                                <div className="px-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50">
                                    <p className="text-gray-800 leading-relaxed">{data.description || 'No description set'}</p>
                                </div>
                            </div>

                            {/* Timestamps */}
                            {(data.createdAt || data.updatedAt) && (
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-500">
                                        {data.createdAt && (
                                            <div>
                                                <span className="font-medium">Created:</span> {new Date(data.createdAt).toLocaleString()}
                                            </div>
                                        )}
                                        {data.updatedAt && (
                                            <div>
                                                <span className="font-medium">Last Updated:</span> {new Date(data.updatedAt).toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                        <div className="p-12 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaInfoCircle size={40} className="text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Popup Configured</h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                Create your first popup to display upcoming course information on the homepage.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={handleSeedData}
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium"
                                    disabled={deleteLoading}
                                >
                                    <FaCheckCircle size={16} />
                                    Load Default Data
                                </button>
                                <button
                                    onClick={() => setShowAddDialog(true)}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium"
                                >
                                    <FaPlus size={16} />
                                    Create Popup Settings
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add/Edit Dialog */}
                {showAddDialog && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {data ? 'Edit Popup Settings' : 'Create Popup Settings'}
                                </h2>
                                <button
                                    onClick={() => setShowAddDialog(false)}
                                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                >
                                    <FaTimes size={16} className="text-gray-600" />
                                </button>
                            </div>
                            <div className="p-6">
                                <AddPopupSettings
                                    setData={setData}
                                    onClose={() => setShowAddDialog(false)}
                                    isEdit={!!data}
                                    editData={data || undefined}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                {showDeleteDialog && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                        <FaExclamationTriangle size={20} className="text-red-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">Delete Popup Settings</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                        <p className="text-sm text-red-800">
                                            Are you sure you want to delete the popup settings? This will remove the popup from the homepage and cannot be undone.
                                        </p>
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <button 
                                            onClick={() => !deleteLoading && setShowDeleteDialog(false)} 
                                            disabled={deleteLoading}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={handleDelete} 
                                            disabled={deleteLoading}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {deleteLoading ? <Spinner /> : <FaTrash size={16} />}
                                            {deleteLoading ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminPopupSettings 