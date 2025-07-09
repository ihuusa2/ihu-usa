'use client'

import type { Volunteer } from "@/Types/Form"
import { VolunteerArea, AvailabilityType } from "@/Types/Form"
import Container from '@/components/Container'
import { H1, H2, H4 } from '@/components/Headings'
import { createVolunteerForm } from '@/Server/Volunteer'
import React from 'react'
import { FaHeart, FaGraduationCap, FaCog, FaCalendarAlt, FaBullhorn, FaFlask, FaHandsHelping, FaDollarSign, FaUserGraduate, FaPlus, FaTimes, FaCheckCircle, FaExclamationCircle, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaStar, FaSpinner } from 'react-icons/fa'

const initialValue: Volunteer = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: new Date(),
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    areas: [],
    skills: [],
    availability: [],
    hoursPerWeek: 0,
    startDate: new Date(),
    value: '',
    experiences: '',
    about: '',
    motivation: '',
    previousVolunteerWork: '',
    languages: [],
    education: '',
    profession: '',
    emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
    }
}

const volunteerAreas = [
    {
        value: VolunteerArea.EDUCATION,
        label: 'Education & Teaching',
        icon: FaGraduationCap,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        description: 'Help with curriculum development, teaching, and educational programs'
    },
    {
        value: VolunteerArea.ADMINISTRATION,
        label: 'Administration',
        icon: FaCog,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        description: 'Support office operations, data management, and administrative tasks'
    },
    {
        value: VolunteerArea.EVENTS,
        label: 'Events & Programs',
        icon: FaCalendarAlt,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        description: 'Organize and support university events, workshops, and programs'
    },
    {
        value: VolunteerArea.TECHNOLOGY,
        label: 'Technology & IT',
        icon: FaCog,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        description: 'IT support, website development, and digital infrastructure'
    },
    {
        value: VolunteerArea.MARKETING,
        label: 'Marketing & Communications',
        icon: FaBullhorn,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        description: 'Social media, content creation, and promotional activities'
    },
    {
        value: VolunteerArea.RESEARCH,
        label: 'Research & Development',
        icon: FaFlask,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        description: 'Academic research, curriculum development, and innovation'
    },
    {
        value: VolunteerArea.COMMUNITY_OUTREACH,
        label: 'Community Outreach',
        icon: FaHandsHelping,
        color: 'text-pink-600',
        bgColor: 'bg-pink-50',
        description: 'Community engagement, partnerships, and outreach programs'
    },
    {
        value: VolunteerArea.FUNDRAISING,
        label: 'Fundraising',
        icon: FaDollarSign,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        description: 'Donation campaigns, grant writing, and fundraising events'
    },
    {
        value: VolunteerArea.TUTORING,
        label: 'Tutoring & Mentoring',
        icon: FaUserGraduate,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        description: 'One-on-one tutoring, mentoring, and student support'
    }
]

const availabilityOptions = [
    { value: AvailabilityType.WEEKDAYS, label: 'Weekdays (Mon-Fri)', icon: FaClock },
    { value: AvailabilityType.WEEKENDS, label: 'Weekends (Sat-Sun)', icon: FaClock },
    { value: AvailabilityType.EVENINGS, label: 'Evenings', icon: FaClock },
    { value: AvailabilityType.FLEXIBLE, label: 'Flexible Schedule', icon: FaClock }
]

const commonSkills = [
    'Teaching', 'Administration', 'Event Planning', 'Social Media', 'Writing', 'Photography',
    'Web Development', 'Graphic Design', 'Public Speaking', 'Project Management', 'Research',
    'Customer Service', 'Leadership', 'Translation', 'Marketing', 'Fundraising', 'Mentoring',
    'Data Entry', 'Accounting', 'Legal', 'Healthcare', 'Music', 'Art', 'Technology Support'
]

const VolunteerForm = () => {
    const [value, setValue] = React.useState<Volunteer>(initialValue)
    const [loading, setLoading] = React.useState(false)
    const [msg, setMsg] = React.useState('')
    const [error, setError] = React.useState('')
    const [fieldErrors, setFieldErrors] = React.useState<{[key: string]: string}>({})
    const [currentStep, setCurrentStep] = React.useState(1)
    const [newSkill, setNewSkill] = React.useState('')
    const [newLanguage, setNewLanguage] = React.useState('')

    // Custom Spinner Component
    const Spinner = ({ size = "1rem" }: { size?: string }) => (
        <FaSpinner className="animate-spin" style={{ fontSize: size }} />
    )

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const validatePhone = (phone: string) => {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/
        return phoneRegex.test(phone)
    }

    const validateStep = (step: number) => {
        const errors: {[key: string]: string} = {}

        if (step === 1) {
            // Personal Information
            if (!value.firstName.trim()) errors.firstName = 'First name is required'
            if (!value.lastName.trim()) errors.lastName = 'Last name is required'
            if (!value.email.trim()) {
                errors.email = 'Email is required'
            } else if (!validateEmail(value.email)) {
                errors.email = 'Please enter a valid email address'
            }
            if (!value.phone.trim()) {
                errors.phone = 'Phone number is required'
            } else if (!validatePhone(value.phone)) {
                errors.phone = 'Please enter a valid phone number'
            }
            if (!value.dob) errors.dob = 'Date of birth is required'
        }

        if (step === 2) {
            // Volunteer Areas and Availability
            if (value.areas.length === 0) errors.areas = 'Please select at least one volunteer area'
            if (value.availability.length === 0) errors.availability = 'Please select your availability'
            if (!value.hoursPerWeek || value.hoursPerWeek <= 0) errors.hoursPerWeek = 'Please specify hours per week'
        }

        if (step === 3) {
            // Experience and Motivation
            if (!value.value.trim()) errors.value = 'Please describe how you want to add value'
            if (!value.experiences.trim()) errors.experiences = 'Please describe your experiences'
            if (!value.about.trim()) errors.about = 'Please tell us about yourself'
            if (!value.motivation?.trim()) errors.motivation = 'Please share your motivation'
        }

        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleChange = (field: keyof Volunteer, val: string | number | boolean | Date | string[] | VolunteerArea[] | AvailabilityType[] | object) => {
        setValue(prev => ({ ...prev, [field]: val }))
        
        // Clear field error when user starts typing
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: '' }))
        }
        
        // Clear general messages
        if (error) setError('')
        if (msg) setMsg('')
    }

    const handleAreaToggle = (area: VolunteerArea) => {
        const newAreas = value.areas.includes(area)
            ? value.areas.filter(a => a !== area)
            : [...value.areas, area]
        handleChange('areas', newAreas)
    }

    const handleAvailabilityToggle = (availability: AvailabilityType) => {
        const newAvailability = value.availability.includes(availability)
            ? value.availability.filter(a => a !== availability)
            : [...value.availability, availability]
        handleChange('availability', newAvailability)
    }

    const addSkill = () => {
        if (newSkill.trim() && !value.skills.includes(newSkill.trim())) {
            handleChange('skills', [...value.skills, newSkill.trim()])
            setNewSkill('')
        }
    }

    const removeSkill = (skill: string) => {
        handleChange('skills', value.skills.filter(s => s !== skill))
    }

    const addCommonSkill = (skill: string) => {
        if (!value.skills.includes(skill)) {
            handleChange('skills', [...value.skills, skill])
        }
    }

    const addLanguage = () => {
        if (newLanguage.trim() && !(value.languages || []).includes(newLanguage.trim())) {
            handleChange('languages', [...(value.languages || []), newLanguage.trim()])
            setNewLanguage('')
        }
    }

    const removeLanguage = (language: string) => {
        handleChange('languages', (value.languages || []).filter(l => l !== language))
    }

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1)
        }
    }

    const prevStep = () => {
        setCurrentStep(prev => prev - 1)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validateStep(3)) {
            setError('Please fill all required fields')
            return
        }

        setLoading(true)
        setError('')
        setMsg('')

        try {
            await createVolunteerForm(value)
            setValue(initialValue)
            setCurrentStep(1)
            setFieldErrors({})
            setMsg('Thank you for your volunteer application! We will review your application and contact you soon.')
        } catch (err) {
            setError('Failed to submit application. Please try again later.')
            console.error('Volunteer application error:', err)
        } finally {
            setLoading(false)
        }
    }

    const renderStep1 = () => (
        <div className="space-y-6">
            <div>
                <H2 className="text-gray-800 mb-4">Personal Information</H2>
                <p className="text-gray-600 mb-6">Let&apos;s start with your basic information.</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaUser className="inline mr-2" size={14} />
                            First Name *
                        </label>
                        <input
                            type="text"
                            value={value.firstName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('firstName', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed ${fieldErrors.firstName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}`}
                            disabled={loading}
                            placeholder="Enter your first name"
                        />
                        {fieldErrors.firstName && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaUser className="inline mr-2" size={14} />
                            Last Name *
                        </label>
                        <input
                            type="text"
                            value={value.lastName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('lastName', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed ${fieldErrors.lastName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}`}
                            disabled={loading}
                            placeholder="Enter your last name"
                        />
                        {fieldErrors.lastName && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaEnvelope className="inline mr-2" size={14} />
                            Email Address *
                        </label>
                        <input
                            type="email"
                            value={value.email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed ${fieldErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}`}
                            disabled={loading}
                            placeholder="your.email@example.com"
                        />
                        {fieldErrors.email && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaPhone className="inline mr-2" size={14} />
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            value={value.phone}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('phone', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed ${fieldErrors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}`}
                            disabled={loading}
                            placeholder="+1 (555) 123-4567"
                        />
                        {fieldErrors.phone && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date of Birth *
                        </label>
                        <input
                            type="date"
                            value={value.dob ? value.dob.toISOString().split('T')[0] : ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('dob', new Date(e.target.value))}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed ${fieldErrors.dob ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}`}
                            disabled={loading}
                        />
                        {fieldErrors.dob && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.dob}</p>
                        )}
                    </div>
                </div>
                
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                        <FaMapMarkerAlt className="inline mr-2" size={14} />
                        Address (Optional)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                value={value.address || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('address', e.target.value)}
                                disabled={loading}
                                placeholder="Street address"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                            />
                        </div>
                        <input
                            type="text"
                            value={value.city || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('city', e.target.value)}
                            disabled={loading}
                            placeholder="City"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                        <input
                            type="text"
                            value={value.state || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('state', e.target.value)}
                            disabled={loading}
                            placeholder="State/Province"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                        <input
                            type="text"
                            value={value.country || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('country', e.target.value)}
                            disabled={loading}
                            placeholder="Country"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                        <input
                            type="text"
                            value={value.zipCode || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('zipCode', e.target.value)}
                            disabled={loading}
                            placeholder="ZIP/Postal Code"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>
        </div>
    )

    const renderStep2 = () => (
        <div className="space-y-6">
            <div>
                <H2 className="text-gray-800 mb-4">Volunteer Preferences</H2>
                <p className="text-gray-600 mb-6">Tell us about your interests and availability.</p>
                
                {/* Volunteer Areas */}
                <div className="mb-8">
                    <label className="text-lg font-semibold text-gray-800 mb-4 block">
                        Volunteer Areas *
                    </label>
                    <p className="text-gray-600 mb-4">Select the areas where you&apos;d like to contribute (you can select multiple):</p>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {volunteerAreas.map((area) => {
                            const Icon = area.icon
                            const isSelected = value.areas.includes(area.value)
                            
                            return (
                                <div
                                    key={area.value}
                                    className={`bg-white border rounded-lg cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
                                        isSelected 
                                            ? 'ring-2 ring-orange-400 bg-orange-50 border-orange-200' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => handleAreaToggle(area.value)}
                                >
                                    <div className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg ${area.bgColor}`}>
                                                <Icon className={area.color} size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-800 mb-1">
                                                    {area.label}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {area.description}
                                                </p>
                                            </div>
                                            {isSelected && (
                                                <FaCheckCircle className="text-orange-500" size={20} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    
                    {fieldErrors.areas && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <FaExclamationCircle size={12} />
                            {fieldErrors.areas}
                        </p>
                    )}
                </div>
                
                {/* Availability */}
                <div className="mb-6">
                    <label className="text-lg font-semibold text-gray-800 mb-4 block">
                        Availability *
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                        {availabilityOptions.map((option) => {
                            const Icon = option.icon
                            const isSelected = value.availability.includes(option.value)
                            
                            return (
                                <div
                                    key={option.value}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                        isSelected 
                                            ? 'border-orange-400 bg-orange-50' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => handleAvailabilityToggle(option.value)}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={isSelected ? 'text-orange-600' : 'text-gray-500'} size={18} />
                                        <span className="font-medium">{option.label}</span>
                                        {isSelected && <FaCheckCircle className="text-orange-500 ml-auto" size={16} />}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    
                    {fieldErrors.availability && (
                        <p className="text-red-500 text-sm mt-2">{fieldErrors.availability}</p>
                    )}
                </div>
                
                {/* Hours per week and Start Date */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaClock className="inline mr-2" size={14} />
                            Hours per Week *
                        </label>
                        <input
                            type="number"
                            value={value.hoursPerWeek || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('hoursPerWeek', parseInt(e.target.value) || 0)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed ${fieldErrors.hoursPerWeek ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}`}
                            disabled={loading}
                            placeholder="e.g., 10"
                            min="1"
                            max="40"
                        />
                        {fieldErrors.hoursPerWeek && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.hoursPerWeek}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">How many hours per week can you commit?</p>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preferred Start Date
                        </label>
                        <input
                            type="date"
                            value={value.startDate ? value.startDate.toISOString().split('T')[0] : ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('startDate', new Date(e.target.value))}
                            disabled={loading}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">When would you like to start volunteering?</p>
                    </div>
                </div>
                
                {/* Skills */}
                <div>
                    <label className="text-lg font-semibold text-gray-800 mb-4 block">
                        <FaStar className="inline mr-2" size={16} />
                        Skills & Expertise
                    </label>
                    
                    {/* Common Skills */}
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-3">Select skills that apply to you:</p>
                        <div className="flex flex-wrap gap-2">
                            {commonSkills.map((skill) => (
                                <span
                                    key={skill}
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-all ${
                                        value.skills.includes(skill) 
                                            ? 'bg-orange-500 text-white hover:bg-orange-600' 
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-200'
                                    }`}
                                    onClick={() => addCommonSkill(skill)}
                                >
                                    {skill}
                                    {value.skills.includes(skill) && (
                                        <FaCheckCircle className="ml-1" size={12} />
                                    )}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    {/* Custom Skills */}
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Add custom skills:</p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSkill(e.target.value)}
                                placeholder="Enter a skill"
                                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                            />
                            <button 
                                type="button" 
                                onClick={addSkill} 
                                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
                            >
                                <FaPlus size={14} />
                            </button>
                        </div>
                    </div>
                    
                    {/* Selected Skills */}
                    {value.skills.length > 0 && (
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Your selected skills:</p>
                            <div className="flex flex-wrap gap-2">
                                {value.skills.map((skill) => (
                                    <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                        {skill}
                                        <FaTimes
                                            size={10}
                                            className="cursor-pointer hover:text-red-500"
                                            onClick={() => removeSkill(skill)}
                                        />
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

    const renderStep3 = () => (
        <div className="space-y-6">
            <div>
                <H2 className="text-gray-800 mb-4">About You</H2>
                <p className="text-gray-600 mb-6">Tell us more about yourself and your motivation.</p>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            How would you like to add value to IHU? *
                        </label>
                        <textarea
                            value={value.value}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('value', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed min-h-[100px] resize-none ${fieldErrors.value ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}`}
                            disabled={loading}
                            placeholder="Describe how you would like to contribute to IHU's mission and goals..."
                        />
                        {fieldErrors.value && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.value}</p>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Relevant Experience *
                        </label>
                        <textarea
                            value={value.experiences}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('experiences', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed min-h-[100px] resize-none ${fieldErrors.experiences ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}`}
                            disabled={loading}
                            placeholder="Describe your relevant work, education, or volunteer experience..."
                        />
                        {fieldErrors.experiences && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.experiences}</p>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tell us about yourself *
                        </label>
                        <textarea
                            value={value.about}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('about', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed min-h-[100px] resize-none ${fieldErrors.about ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}`}
                            disabled={loading}
                            placeholder="Share your background, interests, and what makes you unique..."
                        />
                        {fieldErrors.about && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.about}</p>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            What motivates you to volunteer? *
                        </label>
                        <textarea
                            value={value.motivation || ''}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('motivation', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed min-h-[100px] resize-none ${fieldErrors.motivation ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}`}
                            disabled={loading}
                            placeholder="Share your passion and what drives you to give back to the community..."
                        />
                        {fieldErrors.motivation && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.motivation}</p>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Education Background
                            </label>
                            <input
                                type="text"
                                value={value.education || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('education', e.target.value)}
                                disabled={loading}
                                placeholder="e.g., Bachelor's in Computer Science"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Profession
                            </label>
                            <input
                                type="text"
                                value={value.profession || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('profession', e.target.value)}
                                disabled={loading}
                                placeholder="e.g., Software Engineer"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>
                    
                    {/* Languages */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Languages Spoken
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={newLanguage}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLanguage(e.target.value)}
                                placeholder="Add a language"
                                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                            />
                            <button 
                                type="button" 
                                onClick={addLanguage} 
                                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
                            >
                                <FaPlus size={14} />
                            </button>
                        </div>
                        {(value.languages || []).length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {(value.languages || []).map((language) => (
                                    <span key={language} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                        {language}
                                        <FaTimes
                                            size={10}
                                            className="cursor-pointer hover:text-red-500"
                                            onClick={() => removeLanguage(language)}
                                        />
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-25 to-orange-25">
            <title>Volunteer with IHU - Make a Difference</title>
            
            {/* Hero Section */}
            <div className="relative py-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-100/30 to-orange-100/30"></div>
                <Container className="relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <H1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                            Join Our Volunteer Community
                        </H1>
                        <H4 className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
                            Your time and skills can help transform lives and preserve cultural heritage. 
                            Join us in building bridges between ancient wisdom and modern knowledge.
                        </H4>
                        
                        {/* Impact Stats */}
                        <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                            {[
                                { icon: FaUser, label: 'Active Volunteers', value: '150+', color: 'text-purple-600' },
                                { icon: FaHeart, label: 'Hours Contributed', value: '2,500+', color: 'text-orange-600' },
                                { icon: FaGraduationCap, label: 'Students Helped', value: '300+', color: 'text-blue-600' }
                            ].map((stat, index) => (
                                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-100 shadow-sm">
                                    <stat.icon className={`${stat.color} mx-auto mb-2`} size={24} />
                                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                                    <div className="text-sm text-gray-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </div>

            {/* Application Form */}
            <Container className="pb-16">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white shadow-lg border-0 overflow-hidden rounded-lg">
                        <div className="bg-gradient-to-r from-purple-50 to-orange-50 px-8 py-10 text-center border-b border-gray-100">
                            <H2 className="text-gray-800 text-2xl font-bold mb-3 flex items-center justify-center gap-3">
                                <FaHandsHelping className="text-orange-500" />
                                Volunteer Application
                            </H2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Complete this application to join our volunteer team and make a meaningful impact.
                            </p>
                            
                            {/* Progress Indicator */}
                            <div className="flex justify-center mt-6">
                                <div className="flex items-center space-x-4">
                                    {[1, 2, 3].map((step) => (
                                        <div key={step} className="flex items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                                step <= currentStep 
                                                    ? 'bg-orange-500 text-white' 
                                                    : 'bg-gray-200 text-gray-500'
                                            }`}>
                                                {step < currentStep ? <FaCheckCircle size={16} /> : step}
                                            </div>
                                            {step < 3 && (
                                                <div className={`w-8 h-1 mx-2 ${
                                                    step < currentStep ? 'bg-orange-500' : 'bg-gray-200'
                                                }`} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-8">
                            {/* Status Messages */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                                    <FaExclamationCircle className="text-red-500 flex-shrink-0" size={20} />
                                    <p className="text-red-700 font-medium">{error}</p>
                                </div>
                            )}
                            
                            {msg && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                                    <FaCheckCircle className="text-green-500 flex-shrink-0" size={20} />
                                    <p className="text-green-700 font-medium">{msg}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Render Current Step */}
                                {currentStep === 1 && renderStep1()}
                                {currentStep === 2 && renderStep2()}
                                {currentStep === 3 && renderStep3()}

                                {/* Navigation Buttons */}
                                <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        disabled={currentStep === 1 || loading}
                                        className={`px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${currentStep === 1 ? 'invisible' : ''}`}
                                    >
                                        Previous
                                    </button>
                                    
                                    {currentStep < 3 ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            disabled={loading}
                                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next Step
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <div className="flex items-center gap-2">
                                                    <Spinner size="1.2rem" />
                                                    Submitting Application...
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <FaHeart size={16} />
                                                    Submit Application
                                                </div>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default VolunteerForm