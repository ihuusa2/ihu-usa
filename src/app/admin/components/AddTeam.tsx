'use client'

import React, { useEffect, useState } from 'react'
import { createTeam, updateTeam } from '@/Server/Team'
import { Team, TeamType } from '@/Types/User'
import Spinner from '@/components/Spinner'
import Image from 'next/image'
import { getAllTeamTypesForSelect } from '@/Server/TeamType'
import Jodit from './jodit'
import cloudinaryImageUploadMethod from '@/functions/cloudinary'
import { 
    FaUser, 
    FaIdBadge, 
    FaImage, 
    FaFileAlt, 
    FaBuilding, 
    FaPlus, 
    FaEdit, 
    FaCheckCircle,
    FaExclamationTriangle,
    FaTimes,
    FaInfoCircle,
    FaUserTie,
    FaCloudUploadAlt
} from 'react-icons/fa'

type Props = {
    setData: React.Dispatch<React.SetStateAction<Team[]>>
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>
    isEdit?: boolean
    editData?: Team
}

const AddTeam = ({ setData, setOpen, isEdit, editData }: Props) => {
    const [value, setValue] = useState<Team>(isEdit ? editData as Team : {
        name: '',
        role: '',
        image: '',
        description: '',
        category: '',
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState<'success' | 'error'>('error')
    const [teamTypes, setTeamTypes] = useState<TeamType[]>()
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})
    const [blobUrl, setBlobUrl] = useState<string | null>(null)

    useEffect(() => {
        if (isEdit) {
            setValue(editData as Team)
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

    const validateForm = () => {
        const errors: {[key: string]: string} = {}
        
        if (!value.name.trim()) {
            errors.name = 'Name is required'
        }
        if (!value.description.trim()) {
            errors.description = 'Description is required'
        }
        if (!value.category.trim()) {
            errors.category = 'Category is required'
        }
        
        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validateForm()) {
            setMessage('Please fill in all required fields')
            setMessageType('error')
            return
        }

        setLoading(true)
        setMessage('')

        let newImage = value.image as string

        if (value.image instanceof File) {
            try {
                const data = await cloudinaryImageUploadMethod(value.image)
                newImage = data.secure_url
            } catch {
                setMessage('Image upload failed. Please try again.')
                setMessageType('error')
                setLoading(false)
                return
            }
        }

        const formData: Team = {
            ...value,
            image: newImage as string,
        };

        if (isEdit) {
            await updateTeam(formData).then((res) => {
                if (res) {
                    setData((prev) => prev.map((team) => team._id === res._id ? res : team))
                    setMessage('Team member updated successfully!')
                    setMessageType('success')
                    if (setOpen) {
                        setTimeout(() => setOpen(false), 1500)
                    }
                }
            })
                .catch(() => {
                    setMessage('Failed to update team member. Please try again.')
                    setMessageType('error')
                })
                .finally(() => setLoading(false))
        }
        else {
            await createTeam(formData).then((res) => {
                if (res?.insertedId) {
                    setData((prev) => [
                        ...prev,
                        { ...formData, _id: String(res.insertedId) },
                    ])
                    setMessage('Team member added successfully!')
                    setMessageType('success')
                    if (setOpen) {
                        setTimeout(() => setOpen(false), 1500)
                    }
                }
            }).catch(() => {
                setMessage('Failed to add team member. Please try again.')
                setMessageType('error')
            })
                .finally(() => setLoading(false))
        }
    }

    useEffect(() => {
        (async () => {
            await getAllTeamTypesForSelect().then((teamTypes) => {
                if (teamTypes) {
                    setTeamTypes(teamTypes)
                }
            })
        })()
    }, [])

    const getCategoryIcon = (category: string) => {
        const categoryLower = category?.toLowerCase();
        if (categoryLower?.includes('faculty') || categoryLower?.includes('teacher')) {
            return <FaUserTie className="w-4 h-4 text-blue-500" />
        } else if (categoryLower?.includes('admin') || categoryLower?.includes('management')) {
            return <FaUser className="w-4 h-4 text-purple-500" />
        } else {
            return <FaBuilding className="w-4 h-4 text-gray-500" />
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Status Message */}
                {message && (
                    <div className={`border-0 rounded-lg shadow-lg ${messageType === 'success' ? 'bg-gradient-to-r from-green-50 to-green-100' : 'bg-gradient-to-r from-red-50 to-red-100'}`}>
                        <div className="p-4">
                            <div className="flex items-center gap-3">
                                {messageType === 'success' ? (
                                    <FaCheckCircle className="text-green-500 w-5 h-5" />
                                ) : (
                                    <FaExclamationTriangle className="text-red-500 w-5 h-5" />
                                )}
                                <span className={`font-medium ${messageType === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                                    {message}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Image Upload Section */}
                <div className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg overflow-hidden">
                    <div className="p-6 pb-4">
                        <div className="flex items-center gap-3 text-lg text-gray-800 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <FaImage className="text-white text-sm" />
                            </div>
                            <h3 className="font-semibold">Profile Picture</h3>
                        </div>
                        <p className="text-gray-600 text-sm">Upload a professional photo for the team member</p>
                    </div>
                    <div className="px-6 pb-6 space-y-4">
                        <div className="flex flex-col lg:flex-row gap-6 items-start">
                            {/* Image Preview */}
                            <div className="flex-shrink-0">
                                {value.image ? (
                                    <div className="relative group">
                                        {value.image instanceof File && blobUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={blobUrl}
                                                alt="Preview"
                                                className="w-30 h-30 rounded-xl object-cover shadow-lg border-4 border-white"
                                            />
                                        ) : (
                                            <Image
                                                src={value.image as string}
                                                alt="Current image"
                                                width={120}
                                                height={120}
                                                className="w-30 h-30 rounded-xl object-cover shadow-lg border-4 border-white"
                                            />
                                        )}
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                                            <FaCheckCircle className="text-white text-sm" />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setValue({ ...value, image: '' })}
                                            className="absolute -top-1 -left-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <FaTimes className="text-white text-xs" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-30 h-30 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                                        <FaUser className="w-8 h-8 text-gray-400 mb-2" />
                                        <span className="text-xs text-gray-500 text-center">No image</span>
                                    </div>
                                )}
                            </div>

                            {/* Upload Input */}
                            <div className="flex-1">
                                <label htmlFor="image" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <FaCloudUploadAlt className="w-4 h-4" />
                                    Choose Image File
                                </label>
                                <input
                        disabled={loading}
                        type="file"
                        accept="image/*"
                        id="image"
                        name="image"
                        onChange={(e) =>
                            e.target.files && setValue({ ...value, image: e.target.files[0] })
                        }
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm focus:border-indigo-500 focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                                <p className="text-xs text-gray-500 mt-2">
                                    Supported formats: JPG, PNG, GIF. Max size: 5MB
                                </p>
                </div>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg overflow-hidden">
                    <div className="p-6 pb-4">
                        <div className="flex items-center gap-3 text-lg text-gray-800 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                <FaUser className="text-white text-sm" />
                            </div>
                            <h3 className="font-semibold">Personal Information</h3>
                        </div>
                        <p className="text-gray-600 text-sm">Basic details about the team member</p>
                    </div>
                    <div className="px-6 pb-6 space-y-5">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <FaUser className="w-3 h-3" />
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                        disabled={loading}
                        type="text"
                        id="name"
                        name="name"
                        value={value.name}
                                    onChange={(e) => {
                                        setValue({ ...value, name: e.target.value })
                                        if (formErrors.name) {
                                            setFormErrors({ ...formErrors, name: '' })
                                        }
                                    }}
                                    className={`w-full px-3 py-2 border rounded-lg bg-white/80 backdrop-blur-sm focus:outline-none transition-colors ${formErrors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                                    placeholder="Enter full name"
                        required
                    />
                                {formErrors.name && (
                                    <p className="text-red-500 text-xs flex items-center gap-1">
                                        <FaExclamationTriangle className="w-3 h-3" />
                                        {formErrors.name}
                                    </p>
                                )}
                </div>

                            {/* Role Field */}
                            <div className="space-y-2">
                                <label htmlFor="role" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <FaIdBadge className="w-3 h-3" />
                                    Job Title / Position
                                </label>
                                <input
                        disabled={loading}
                        type="text"
                        id="role"
                        name="role"
                        value={value.role}
                        onChange={(e) => setValue({ ...value, role: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="e.g., Professor, Administrator, Staff"
                                />
                                <p className="text-xs text-gray-500">
                                    Optional: Specific role or job title
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Department/Category */}
                <div className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg overflow-hidden">
                    <div className="p-6 pb-4">
                        <div className="flex items-center gap-3 text-lg text-gray-800 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                <FaBuilding className="text-white text-sm" />
                            </div>
                            <h3 className="font-semibold">Department & Category</h3>
                        </div>
                        <p className="text-gray-600 text-sm">Organizational structure and categorization</p>
                </div>
                    <div className="px-6 pb-6 space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="category" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <FaBuilding className="w-3 h-3" />
                                Department/Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={value.category} 
                                onChange={(e) => {
                                    setValue({ ...value, category: e.target.value })
                                    if (formErrors.category) {
                                        setFormErrors({ ...formErrors, category: '' })
                                    }
                                }}
                        required
                                className={`w-full px-3 py-2 border rounded-lg bg-white/80 backdrop-blur-sm focus:outline-none transition-colors ${formErrors.category ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'}`}
                        >
                                <option value="">Select department or category</option>
                            {teamTypes?.map((category) => (
                                    <option
                                    key={category.title}
                                    value={category.title}
                                >
                                    {category.title}
                                    </option>
                                ))}
                            </select>
                            {formErrors.category && (
                                <p className="text-red-500 text-xs flex items-center gap-1">
                                    <FaExclamationTriangle className="w-3 h-3" />
                                    {formErrors.category}
                                </p>
                            )}
                            
                            {/* Category Preview */}
                            {value.category && (
                                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Selected Category:</span>
                                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 hover:from-purple-200 hover:to-purple-300">
                                            {getCategoryIcon(value.category)}
                                            <span className="ml-1">{value.category}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg overflow-hidden">
                    <div className="p-6 pb-4">
                        <div className="flex items-center gap-3 text-lg text-gray-800 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <FaFileAlt className="text-white text-sm" />
                            </div>
                            <h3 className="font-semibold">Bio & Description</h3>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Detailed information about the team member <span className="text-red-500">*</span>
                        </p>
                    </div>
                    <div className="px-6 pb-6">
                        <div className={`${formErrors.description ? 'ring-2 ring-red-200 rounded-lg' : ''}`}>
                            <Jodit
                                label=''
                                content={value.description}
                                setContent={(e) => {
                                    setValue({ ...value, description: e })
                                    if (formErrors.description) {
                                        setFormErrors({ ...formErrors, description: '' })
                                    }
                                }}
                            />
                        </div>
                        {formErrors.description && (
                            <p className="text-red-500 text-xs flex items-center gap-1 mt-2">
                                <FaExclamationTriangle className="w-3 h-3" />
                                {formErrors.description}
                            </p>
                        )}
                        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
                            <div className="flex items-start gap-2">
                                <FaInfoCircle className="text-green-500 mt-0.5 w-4 h-4" />
                                <div className="text-sm text-green-700">
                                    <p className="font-medium mb-1">Description Guidelines:</p>
                                    <ul className="list-disc list-inside space-y-1 text-xs">
                                        <li>Include educational background and qualifications</li>
                                        <li>Mention key achievements and experience</li>
                                        <li>Add areas of expertise or specialization</li>
                                        <li>Keep it professional and concise</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button 
                        type="button"
                        onClick={() => setOpen && setOpen(false)}
                        disabled={loading}
                        className="flex-1 sm:flex-none sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Cancel
                    </button>
                    
                    <button 
                        disabled={loading} 
                        type="submit" 
                        className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Spinner />
                                <span>{isEdit ? 'Updating...' : 'Adding...'}</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                {isEdit ? <FaEdit className="w-4 h-4" /> : <FaPlus className="w-4 h-4" />}
                                <span>{isEdit ? 'Update Team Member' : 'Add Team Member'}</span>
                            </div>
                        )}
                    </button>
            </div>
        </form>
        </div>
    )
}

export default AddTeam