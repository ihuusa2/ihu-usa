'use client'

import React, { useEffect, useState } from 'react'
import { createUser, updateUser } from '@/Server/User'
import { User, UserRole } from '@/Types/User'
import Spinner from '@/components/Spinner'
import Image from 'next/image'
import cloudinaryImageUploadMethod from '@/functions/cloudinary'

type Props = {
    setData: React.Dispatch<React.SetStateAction<User[]>>
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>
    isEdit?: boolean
    editData?: User
}

const AddUser = ({ setData, setOpen, isEdit, editData }: Props) => {
    const [value, setValue] = useState<User>(isEdit ? editData as User : {
        name: '',
        email: '',
        role: UserRole.User,
        password: '',
        contact: '',
        address: '',
        image: '',
        registrationNumber: '',
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [blobUrl, setBlobUrl] = useState<string | null>(null)

    useEffect(() => {
        if (isEdit && editData) {
            setValue(editData as User)
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

    // Cleanup blob URL on component unmount
    useEffect(() => {
        return () => {
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl)
            }
        }
    }, [blobUrl])

    console.log(editData)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (value.name.trim() === '' || value.email.trim() === '' || value?.password?.trim() === '' || value.contact.trim() === '' || value.address.trim() === '') return

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

        const formData: User = {
            ...value,
            image: newImage as string,
        };

        if (isEdit) {
            await updateUser(formData).then((res) => {
                if (res) {
                    setData((prev) => prev.map((user) => user._id === res._id ? res : user))
                    if (setOpen) {
                        setOpen(false)
                    }
                }
            })
                .catch(() => {
                    setMessage('Something went wrong.')
                })
                .finally(() => setLoading(false))
        }
        else {

            await createUser(formData).then((res) => {
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                            {isEdit ? 'Edit User' : 'Add New User'}
                        </h2>
                        <p className="text-gray-600">
                            {isEdit ? 'Update user information below' : 'Fill in the details to create a new user'}
                        </p>
                    </div>

                    {message && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm font-medium">{message}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Upload Section */}
                        <div className="space-y-4">
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                Profile Image
                            </label>
                            <div className="flex flex-col sm:flex-row gap-4 items-start">
                                <div className="flex-1">
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
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                
                                {/* Image Preview */}
                                {value.image && (
                                    <div className="flex-shrink-0">
                                        {value.image instanceof File && blobUrl ? (
                                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                                                <Image
                                                    src={blobUrl}
                                                    alt="Profile preview"
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                                                <Image
                                                    src={value.image as string}
                                                    alt="Profile image"
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <input
                                disabled={loading}
                                type="text"
                                id="name"
                                name="name"
                                value={value.name}
                                onChange={(e) => setValue({ ...value, name: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-400"
                                placeholder="Enter full name"
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address *
                            </label>
                            <input
                                disabled={loading}
                                type="email"
                                id="email"
                                name="email"
                                value={value.email}
                                onChange={(e) => setValue({ ...value, email: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-400"
                                placeholder="Enter email address"
                            />
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                                User Role
                            </label>
                            <select
                                value={value.role}
                                onChange={(e) => setValue({ ...value, role: e.target.value as UserRole })}
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                            >
                                {Object.values(UserRole).map((role) => (
                                    <option key={role} value={role} className="capitalize">
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Registration Number Field */}
                        <div>
                            <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                Registration Number {!isEdit && '(Auto-generated if left blank)'}
                            </label>
                            <input
                                disabled={loading}
                                type="text"
                                id="registrationNumber"
                                name="registrationNumber"
                                value={value.registrationNumber || ''}
                                onChange={(e) => setValue({ ...value, registrationNumber: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-400"
                                placeholder={isEdit ? "Enter registration number" : "Leave blank for auto-generation"}
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                {isEdit ? 'New Password (leave blank to keep current)' : 'Password *'}
                            </label>
                            <input
                                disabled={loading}
                                type="password"
                                id="password"
                                name="password"
                                value={value.password}
                                onChange={(e) => setValue({ ...value, password: e.target.value })}
                                required={!isEdit}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-400"
                                placeholder={isEdit ? "Enter new password (optional)" : "Enter password"}
                            />
                        </div>

                        {/* Contact Field */}
                        <div>
                            <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                                Contact Number *
                            </label>
                            <input
                                disabled={loading}
                                type="text"
                                id="contact"
                                name="contact"
                                value={value.contact}
                                onChange={(e) => setValue({ ...value, contact: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-400"
                                placeholder="Enter contact number"
                            />
                        </div>

                        {/* Address Field */}
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                Address *
                            </label>
                            <textarea
                                disabled={loading}
                                id="address"
                                name="address"
                                value={value.address}
                                onChange={(e) => setValue({ ...value, address: e.target.value })}
                                required
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-400 resize-none"
                                placeholder="Enter full address"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <Spinner size="1.5rem" color="text-white" />
                                        <span>Processing...</span>
                                    </div>
                                ) : (
                                    <span>{isEdit ? 'Update User' : 'Add User'}</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddUser