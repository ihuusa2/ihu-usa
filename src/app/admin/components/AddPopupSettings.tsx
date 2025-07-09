'use client'

import React, { useState, useEffect } from 'react'
import Spinner from '@/components/Spinner'
import { updatePopupSettings } from '@/Server/PopupSettings'
import { PopupSettings } from '@/Types/PopupSettings'
import { 
    FaCheck, 
    FaExclamationTriangle, 
    FaTimes, 
    FaCalendarAlt, 
    FaGraduationCap, 
    FaInfoCircle, 
    FaLink, 
    FaToggleOff, 
    FaToggleOn,
    FaUser,
    FaBuilding
} from 'react-icons/fa'

type Props = {
    setData: React.Dispatch<React.SetStateAction<PopupSettings | null>>
    onClose?: () => void
    isEdit?: boolean
    editData?: PopupSettings
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

// Custom Toggle Component
const CustomToggle = ({ 
    label, 
    value, 
    onChange, 
    disabled = false
}: {
    label: string
    value: boolean
    onChange: (value: boolean) => void
    disabled?: boolean
}) => (
    <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
            {label}
        </label>
        <div 
            className={`flex items-center gap-3 cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={() => !disabled && onChange(!value)}
        >
            {value ? (
                <FaToggleOn size={32} className="text-green-500" />
            ) : (
                <FaToggleOff size={32} className="text-gray-400" />
            )}
            <span className={`text-sm font-medium ${value ? 'text-green-600' : 'text-gray-500'}`}>
                {value ? 'Active - Popup will show on homepage' : 'Inactive - Popup will not show'}
            </span>
        </div>
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

const AddPopupSettings = ({ setData, onClose, isEdit, editData }: Props) => {
    const [value, setValue] = useState<PopupSettings>(isEdit ? editData as PopupSettings : {
        isActive: false,
        title: 'Upcoming Course',
        courseName: '',
        startDate: '',
        description: '',
        buttonText: 'Learn More & Enroll Now',
        courseLink: '',
        organization: '',
        instructor: ''
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState<'success' | 'error'>('error')
    const [errors, setErrors] = useState<{[key: string]: string}>({})

    useEffect(() => {
        if (isEdit && editData) {
            setValue(editData)
        }
    }, [isEdit, editData])

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {}
        
        if (!value.courseName.trim()) {
            newErrors.courseName = 'Course name is required'
        }
        
        if (!value.startDate.trim()) {
            newErrors.startDate = 'Start date is required'
        }
        
        if (!value.description.trim()) {
            newErrors.description = 'Description is required'
        }
        
        if (!value.courseLink.trim()) {
            newErrors.courseLink = 'Course link is required'
        }
        
        if (value.courseLink && !value.courseLink.startsWith('/') && !value.courseLink.startsWith('http')) {
            newErrors.courseLink = 'Course link must be a valid URL or start with /'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        if (!validateForm()) {
            setMessage('Please fix the errors above')
            setMessageType('error')
            return
        }

        setLoading(true)
        setMessage('')

        try {
            const result = await updatePopupSettings(value)
            if (result) {
                setData(result)
                setMessage('Popup settings updated successfully!')
                setMessageType('success')
                setTimeout(() => {
                    onClose?.()
                }, 1500)
            } else {
                throw new Error('Failed to update settings')
            }
        } catch (error) {
            console.error('Error updating popup settings:', error)
            setMessage('Error updating popup settings. Please try again.')
            setMessageType('error')
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field: keyof PopupSettings, value: string | boolean) => {
        setValue(prev => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <FaInfoCircle size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Popup Settings</h2>
                            <p className="text-blue-100 text-sm">Manage the upcoming course popup display</p>
                        </div>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
                        >
                            <FaTimes size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-b-2xl p-6 space-y-6">
                {/* Message */}
                {message && (
                    <div className={`p-4 rounded-xl border-l-4 ${
                        messageType === 'success' 
                            ? 'bg-green-50 border-green-400 text-green-700' 
                            : 'bg-red-50 border-red-400 text-red-700'
                    }`}>
                        <div className="flex items-center gap-2">
                            {messageType === 'success' ? <FaCheck size={16} /> : <FaExclamationTriangle size={16} />}
                            <p className="font-medium">{message}</p>
                        </div>
                    </div>
                )}

                {/* Toggle Active Status */}
                <div className="bg-gray-50 rounded-xl p-4">
                    <CustomToggle
                        label="Popup Status"
                        value={value.isActive}
                        onChange={(newValue) => handleInputChange('isActive', newValue)}
                        disabled={loading}
                    />
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CustomInput
                        label="Popup Title"
                        value={value.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="e.g., Upcoming Course"
                        disabled={loading}
                        icon={FaInfoCircle}
                    />

                    <CustomInput
                        label="Course Name"
                        value={value.courseName}
                        onChange={(e) => handleInputChange('courseName', e.target.value)}
                        placeholder="e.g., Natural Health Science"
                        disabled={loading}
                        required
                        icon={FaGraduationCap}
                        error={errors.courseName}
                    />

                    <CustomInput
                        label="Start Date"
                        value={value.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        placeholder="e.g., 7th July 2025"
                        disabled={loading}
                        required
                        icon={FaCalendarAlt}
                        error={errors.startDate}
                    />

                    <CustomInput
                        label="Button Text"
                        value={value.buttonText}
                        onChange={(e) => handleInputChange('buttonText', e.target.value)}
                        placeholder="e.g., Learn More & Enroll Now"
                        disabled={loading}
                        icon={FaLink}
                    />

                    <CustomInput
                        label="Course Link"
                        value={value.courseLink}
                        onChange={(e) => handleInputChange('courseLink', e.target.value)}
                        placeholder="e.g., /Course/natural-health-science"
                        disabled={loading}
                        required
                        icon={FaLink}
                        error={errors.courseLink}
                    />

                    <CustomInput
                        label="Organization"
                        value={value.organization || ''}
                        onChange={(e) => handleInputChange('organization', e.target.value)}
                        placeholder="e.g., IMANAH, USA"
                        disabled={loading}
                        icon={FaBuilding}
                    />

                    <CustomInput
                        label="Instructor"
                        value={value.instructor || ''}
                        onChange={(e) => handleInputChange('instructor', e.target.value)}
                        placeholder="e.g., Dr. Arun Sharma, ND"
                        disabled={loading}
                        icon={FaUser}
                    />
                </div>

                {/* Description */}
                <CustomTextarea
                    label="Description"
                    value={value.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter a detailed description of the course..."
                    disabled={loading}
                    required
                    rows={4}
                    icon={FaInfoCircle}
                    error={errors.description}
                />

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pt-4">
                    {onClose && (
                        <CustomButton
                            variant="secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </CustomButton>
                    )}
                    <CustomButton
                        type="submit"
                        disabled={loading}
                        variant="success"
                    >
                        {loading ? <Spinner /> : <FaCheck size={16} />}
                        {loading ? 'Saving...' : 'Save Settings'}
                    </CustomButton>
                </div>
            </form>
        </div>
    )
}

export default AddPopupSettings 