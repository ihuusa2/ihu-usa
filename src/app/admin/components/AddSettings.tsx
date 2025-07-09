'use client'

import React, { useState, useEffect } from 'react'
import Spinner from '@/components/Spinner'
import Image from 'next/image'
import cloudinaryImageUploadMethod from '@/functions/cloudinary'
import { updateSettings } from '@/Server/Settings'
import { Settings } from '@/Types/Settings'
import { FaUpload, FaImage, FaShare, FaInfoCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaLinkedin, FaCheck, FaExclamationTriangle, FaTimes } from 'react-icons/fa'

type Props = {
    setData: React.Dispatch<React.SetStateAction<Settings>>
    onClose?: () => void
    isEdit?: boolean
    editData?: Settings
}

// Custom Input Component
const CustomInput = ({ 
    label, 
    type = 'text', 
    value, 
    onChange, 
    placeholder, 
    disabled = false, 
    required = false,
    accept,
    icon: Icon,
    error
}: {
    label: string
    type?: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    disabled?: boolean
    required?: boolean
    accept?: string
    icon?: React.ComponentType<{size?: number, className?: string}>
    error?: string
}) => (
    <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
            {Icon && <Icon size={14} className="inline mr-2 text-gray-500" />}
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                accept={accept}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 ${
                    error 
                        ? 'border-red-300 focus:border-red-500 bg-red-50' 
                        : 'border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300'
                } ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
            />
        </div>
        {error && (
            <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                <FaExclamationTriangle size={10} />
                {error}
            </p>
        )}
    </div>
)

// Custom Textarea Component
const CustomTextarea = ({ 
    label, 
    value, 
    onChange, 
    placeholder, 
    disabled = false, 
    required = false,
    rows = 4,
    icon: Icon,
    error
}: {
    label: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    placeholder?: string
    disabled?: boolean
    required?: boolean
    rows?: number
    icon?: React.ComponentType<{size?: number, className?: string}>
    error?: string
}) => (
    <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
            {Icon && <Icon size={14} className="inline mr-2 text-gray-500" />}
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                rows={rows}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 resize-none ${
                    error 
                        ? 'border-red-300 focus:border-red-500 bg-red-50' 
                        : 'border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300'
                } ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
            />
        </div>
        {error && (
            <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                <FaExclamationTriangle size={10} />
                {error}
            </p>
        )}
    </div>
)

// Custom Button Component
const CustomButton = ({ 
    children, 
    onClick, 
    type = 'button', 
    disabled = false, 
    variant = 'primary',
    size = 'md',
    className = ''
}: {
    children: React.ReactNode
    onClick?: () => void
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    variant?: 'primary' | 'secondary' | 'danger' | 'success'
    size?: 'sm' | 'md' | 'lg'
    className?: string
}) => {
    const baseClasses = "font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-4 transform hover:scale-105 active:scale-95"
    
    const variantClasses = {
        primary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg focus:ring-blue-200",
        secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 border-2 border-gray-200 focus:ring-gray-200",
        danger: "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg focus:ring-red-200",
        success: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg focus:ring-green-200"
    }
    
    const sizeClasses = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    }
    
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed transform-none hover:scale-100' : ''} ${className}`}
        >
            {children}
        </button>
    )
}

const AddSettings = ({ setData, onClose, isEdit, editData }: Props) => {
    const [value, setValue] = useState<Settings>(isEdit ? editData as Settings : {
        logo: '',
        social: {
            facebook: '',
            instagram: '',
            twitter: '',
            youtube: '',
            linkedin: '',
        },
        address: '',
        email: '',
        phone: '',
        about: '',
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState<'success' | 'error'>('error')
    const [activeTab, setActiveTab] = useState('general')
    const [dragOver, setDragOver] = useState(false)
    const [errors, setErrors] = useState<{[key: string]: string}>({})

    useEffect(() => {
        if (isEdit && editData) {
            setValue(editData)
        }
    }, [isEdit, editData])

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {}
        
        // Only validate General tab fields if we're on the General tab
        if (activeTab === 'general') {
            if (!value.email.trim()) {
                newErrors.email = 'Email is required'
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) {
                newErrors.email = 'Please enter a valid email address'
            }
            
            if (!value.phone.trim()) {
                newErrors.phone = 'Phone number is required'
            }
            
            if (!value.address.trim()) {
                newErrors.address = 'Address is required'
            }
        }
        
        // Validate Social Media tab fields if we're on the Social tab
        if (activeTab === 'social') {
            // Optional: Add social media URL validation if needed
            Object.entries(value.social).forEach(([platform, url]) => {
                if (url && url.trim() && !url.startsWith('http')) {
                    newErrors[`social.${platform}`] = 'Please enter a valid URL starting with http:// or https://'
                }
            })
        }
        
        // Branding tab doesn't need validation as logo is optional
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragOver(false)
        
        const files = e.dataTransfer.files
        if (files.length > 0) {
            const file = files[0]
            if (file.type.startsWith('image/')) {
                setValue({ ...value, logo: file })
            }
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragOver(false)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        if (!validateForm()) {
            setMessage('Please fix the errors below')
            setMessageType('error')
            return
        }
        
        setLoading(true)
        setMessage('')
        let newLogo = value.logo as string

        // Handle logo upload if a new file is selected
        if (value.logo instanceof File) {
            try {
                setMessage('Uploading image...')
                setMessageType('success')
                const data = await cloudinaryImageUploadMethod(value.logo)
                newLogo = data.secure_url
            } catch (error) {
                console.error('Image upload error:', error)
                setMessage('Image upload failed. Please try again.')
                setMessageType('error')
                setLoading(false)
                return
            }
        }

        const formData: Settings = {
            ...value,
            logo: newLogo as string,
        };

        try {
            setMessage('Saving settings...')
            setMessageType('success')
            const res = await updateSettings(formData)
            if (res) {
                setData(formData)
                setMessage('Settings updated successfully!')
                setMessageType('success')
                setTimeout(() => {
                    if (onClose) onClose()
                }, 1500)
            } else {
                setMessage('Failed to update settings. Please try again.')
                setMessageType('error')
            }
        } catch (error) {
            console.error('Settings update error:', error)
            setMessage(`Failed to update settings: ${error instanceof Error ? error.message : 'Unknown error'}`)
            setMessageType('error')
        } finally {
            setLoading(false)
        }
    }

    const tabs = [
        { id: 'general', label: 'General', icon: FaInfoCircle },
        { id: 'branding', label: 'Branding', icon: FaImage },
        { id: 'social', label: 'Social Media', icon: FaShare }
    ]

    const socialPlatforms = [
        { key: 'facebook', label: 'Facebook', icon: FaFacebook, color: 'text-blue-600', placeholder: 'https://facebook.com/yourpage' },
        { key: 'instagram', label: 'Instagram', icon: FaInstagram, color: 'text-pink-600', placeholder: 'https://instagram.com/yourprofile' },
        { key: 'twitter', label: 'Twitter', icon: FaTwitter, color: 'text-sky-500', placeholder: 'https://twitter.com/yourprofile' },
        { key: 'youtube', label: 'YouTube', icon: FaYoutube, color: 'text-red-600', placeholder: 'https://youtube.com/yourchannel' },
        { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedin, color: 'text-blue-700', placeholder: 'https://linkedin.com/company/yourcompany' }
    ]

    return (
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl mx-auto overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Website Settings</h2>
                        <p className="text-blue-100">Configure your site settings and preferences</p>
                    </div>
                    <CustomButton
                        variant="secondary"
                        size="sm"
                        onClick={onClose}
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                        <FaTimes size={14} />
                    </CustomButton>
                </div>
            </div>

            {/* Status Message */}
            {message && (
                <div className={`mx-8 mt-6 p-4 rounded-xl border-l-4 ${
                    messageType === 'success' 
                        ? 'bg-green-50 border-green-400 text-green-800' 
                        : 'bg-red-50 border-red-400 text-red-800'
                }`}>
                    <div className="flex items-center gap-3">
                        {messageType === 'success' ? (
                            <FaCheck className="text-green-600" size={16} />
                        ) : (
                            <FaExclamationTriangle className="text-red-600" size={16} />
                        )}
                        <span className="font-medium">{message}</span>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="px-8 pt-6">
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setActiveTab(tab.id)
                                }}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all duration-200 z-10 relative ${
                                    activeTab === tab.id
                                        ? 'bg-white text-blue-600 shadow-md'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
                {/* General Tab */}
                {activeTab === 'general' && (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <CustomInput
                                label="Email Address"
                                type="email"
                                value={value.email}
                                onChange={(e) => setValue({ ...value, email: e.target.value })}
                                placeholder="contact@yoursite.com"
                                disabled={loading}
                                required
                                icon={FaEnvelope}
                                error={errors.email}
                            />
                            
                            <CustomInput
                                label="Phone Number"
                                type="tel"
                                value={value.phone}
                                onChange={(e) => setValue({ ...value, phone: e.target.value })}
                                placeholder="+1 (555) 123-4567"
                                disabled={loading}
                                required
                                icon={FaPhone}
                                error={errors.phone}
                            />
                        </div>
                        
                        <CustomTextarea
                            label="Address"
                            value={value.address}
                            onChange={(e) => setValue({ ...value, address: e.target.value })}
                            placeholder="Enter your complete address..."
                        disabled={loading}
                            required
                            rows={3}
                            icon={FaMapMarkerAlt}
                            error={errors.address}
                        />
                        
                        <CustomTextarea
                            label="About"
                            value={value.about}
                            onChange={(e) => setValue({ ...value, about: e.target.value })}
                            placeholder="Tell us about your organization..."
                        disabled={loading}
                            rows={4}
                            icon={FaInfoCircle}
                    />
                </div>
                )}

                {/* Branding Tab */}
                {activeTab === 'branding' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                <FaImage size={14} className="inline mr-2 text-gray-500" />
                                Website Logo
                            </label>
                            
                            {/* Logo Upload Area */}
                            <div
                                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                                    dragOver 
                                        ? 'border-blue-400 bg-blue-50' 
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                            >
                                {value.logo ? (
                                    <div className="space-y-4">
                                        <div className="relative inline-block">
                                            <Image
                                                src={value.logo instanceof File ? URL.createObjectURL(value.logo) : value.logo}
                                                alt="Logo"
                                                width={200}
                                                height={100}
                                                className="max-h-24 object-contain rounded-lg border"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    setValue({ ...value, logo: '' })
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                                            >
                                                <FaTimes size={12} />
                                            </button>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {value.logo instanceof File ? 'New logo selected' : 'Current logo'}
                                        </div>
                                        <CustomButton
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => {
                                                const input = document.createElement('input')
                                                input.type = 'file'
                                                input.accept = 'image/*'
                                                input.onchange = (event) => {
                                                    const files = (event.target as HTMLInputElement).files
                                                    if (files && files[0]) {
                                                        setValue({ ...value, logo: files[0] })
                                                    }
                                                }
                                                input.click()
                                            }}
                                            className="z-10 relative"
                                        >
                                            <FaUpload size={14} />
                                            Change Logo
                                        </CustomButton>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <FaUpload className="mx-auto text-4xl text-gray-400" />
                                        <div>
                                            <p className="text-lg font-semibold text-gray-700">Upload Logo</p>
                                            <p className="text-gray-500">Drag and drop your logo here, or click to browse</p>
                                        </div>
                                        <CustomButton
                                            type="button"
                                            variant="primary"
                                            size="md"
                                            onClick={() => {
                                                const input = document.createElement('input')
                                                input.type = 'file'
                                                input.accept = 'image/*'
                                                input.onchange = (event) => {
                                                    const files = (event.target as HTMLInputElement).files
                                                    if (files && files[0]) {
                                                        setValue({ ...value, logo: files[0] })
                                                    }
                                                }
                                                input.click()
                                            }}
                                            className="z-10 relative"
                                        >
                                            <FaUpload size={14} />
                                            Choose File
                                        </CustomButton>
                </div>
                                )}
                                
                                {/* Hidden file input for drag and drop only */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setValue({ ...value, logo: e.target.files[0] })
                                        }
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 pointer-events-none z-0"
                        disabled={loading}
                                    tabIndex={-1}
                                    style={{ pointerEvents: dragOver ? 'auto' : 'none' }}
                    />
                </div>
                            
                            <p className="text-xs text-gray-500 mt-2">
                                Supported formats: PNG, JPG, SVG. Recommended size: 300x150px
                            </p>
                        </div>
                    </div>
                )}

                {/* Social Media Tab */}
                {activeTab === 'social' && (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Social Media Links</h3>
                            <p className="text-gray-600">Add your social media profiles to increase engagement</p>
                        </div>
                        
                        <div className="space-y-4">
                            {socialPlatforms.map((platform) => {
                                const Icon = platform.icon
                                return (
                                    <div key={platform.key} className="relative">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <Icon size={14} className={`inline mr-2 ${platform.color}`} />
                                            {platform.label}
                                        </label>
                                        <input
                                            type="url"
                                            value={value.social[platform.key as keyof typeof value.social]}
                                            onChange={(e) => setValue({ 
                                                ...value, 
                                                social: { 
                                                    ...value.social, 
                                                    [platform.key]: e.target.value 
                                                } 
                                            })}
                                            placeholder={platform.placeholder}
                        disabled={loading}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:border-blue-500 hover:border-gray-300"
                    />
                </div>
                                )
                            })}
                </div>
                </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                    <CustomButton
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </CustomButton>
                    
                    <CustomButton
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        className="min-w-[140px]"
                    >
                        {loading ? (
                            <>
                                <Spinner size="1rem" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <FaCheck size={14} />
                                Save Settings
                            </>
                        )}
                    </CustomButton>
                </div>
            </form>
            </div>
    )
}

export default AddSettings