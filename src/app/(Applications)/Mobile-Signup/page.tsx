'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PaymentStatus, RegisterForm, Status } from '@/Types/Form'
import { getAllCourseTypesForSelect } from '@/Server/CourseType'
import type { CourseType } from '@/Types/Courses'
import { User, Mail, MapPin, GraduationCap, CheckCircle, AlertCircle, CreditCard, ChevronRight, ChevronLeft } from 'lucide-react'
import Spinner from '@/components/Spinner'
import InitiatePayment from '../Registration-Form/Checkout/InitiatePayment'

const initialValue: RegisterForm = {
    firstName: '',
    middleName: '',
    lastName: '',
    formerOrMaidenName: '',
    dateOfBirth: '',
    gender: '',
    emailAddress: '',
    countryCode: '',
    phone: '',
    address: '',
    streetAddress2: '',
    city: '',
    state: '',
    countryOrRegion: '',
    zipOrPostalCode: '',
    resident: '',
    enrollmentType: '',
    courseType: '',
    presentLevelOfEducation: '',
    graduationYear: '',
    howDidYouHearAboutIHU: '',
    objectives: '',
    signature: '',
    recieved: {
        diploma: false,
        homeSchool: false,
        ged: false,
        other: false
    },
    paymentStatus: PaymentStatus.PENDING,
    status: Status.PENDING,
    createdAt: new Date()
}

const STEPS = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Contact', icon: Mail },
    { id: 3, title: 'Address', icon: MapPin },
    { id: 4, title: 'Academic', icon: GraduationCap },
    { id: 5, title: 'Review', icon: CheckCircle }
]

const MobileSignup = () => {
    const router = useRouter()
    const [value, setValue] = useState<RegisterForm>(initialValue)
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')
    const [error, setError] = useState('')
    const [show, setShow] = useState(false)
    const [registrationId, setRegistrationId] = useState<string>('')
    const [currentStep, setCurrentStep] = useState(1)
    const [courseTypes, setCourseTypes] = useState<CourseType[]>([])
    // registrationId is not used, so removed
    const [paymentComplete, setPaymentComplete] = useState(false)

    // Email validation state
    const [emailValidation, setEmailValidation] = useState({
        checking: false,
        exists: false,
        message: ''
    })
    const [emailTimeout, setEmailTimeout] = useState<NodeJS.Timeout | null>(null)

    // Mobile validation state
    const [mobileValidation, setMobileValidation] = useState({
        checking: false,
        exists: false,
        message: ''
    })
    const [mobileTimeout, setMobileTimeout] = useState<NodeJS.Timeout | null>(null)

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (emailTimeout) {
                clearTimeout(emailTimeout)
            }
            if (mobileTimeout) {
                clearTimeout(mobileTimeout)
            }
        }
    }, [emailTimeout, mobileTimeout])

    // Fetch course types
    useEffect(() => {
        const fetchCourseTypes = async () => {
            try {
                const types = await getAllCourseTypesForSelect()
                setCourseTypes(types)
            } catch (error) {
                console.error('Error fetching course types:', error)
            }
        }
        fetchCourseTypes()
    }, [])

    const requiredFields: Array<keyof RegisterForm> = [
        'firstName', 'lastName', 'dateOfBirth', 'emailAddress', 'countryCode', 'phone', 'address', 'city', 'state', 'countryOrRegion', 'zipOrPostalCode', 'resident', 'enrollmentType', 'courseType', 'graduationYear', 'howDidYouHearAboutIHU', 'objectives', 'signature'
    ]

    const validateFields = () => {
        for (const field of requiredFields) {
            if (!value[field]) {
                console.log(`Missing required field: ${field}`, value[field]);
                return false;
            }
        }

        // Check if email is valid and doesn't exist
        if (emailValidation.exists || emailValidation.checking) {
            console.log('Email validation failed:', emailValidation);
            return false;
        }

        // Check if mobile is valid and doesn't exist
        if (mobileValidation.exists || mobileValidation.checking) {
            console.log('Mobile validation failed:', mobileValidation);
            return false;
        }
        
        return true;
    }

    const getMissingFields = () => {
        const missing = [];
        for (const field of requiredFields) {
            if (!value[field]) {
                missing.push(field);
            }
        }
        return missing;
    }

    // Email validation function
    const validateEmail = async (email: string) => {
        if (!email || email.length < 3) {
            setEmailValidation({
                checking: false,
                exists: false,
                message: ''
            })
            return
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setEmailValidation({
                checking: false,
                exists: false,
                message: 'Please enter a valid email address'
            })
            return
        }

        setEmailValidation(prev => ({ ...prev, checking: true, message: '' }))

        try {
            const response = await fetch(`/api/check-email?email=${encodeURIComponent(email)}`)
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const data = await response.json()

            setEmailValidation({
                checking: false,
                exists: data.exists,
                message: data.exists ? 'This email is already registered' : 'Email is available'
            })
        } catch (error) {
            console.error('Error validating email:', error)
            setEmailValidation({
                checking: false,
                exists: false,
                message: 'Error checking email availability'
            })
        }
    }

    // Debounced email validation
    const handleEmailChange = (email: string) => {
        setValue({ ...value, emailAddress: email })
        
        // Clear existing timeout
        if (emailTimeout) {
            clearTimeout(emailTimeout)
        }

        // Clear validation if email is empty or too short
        if (!email || email.length < 3) {
            setEmailValidation({
                checking: false,
                exists: false,
                message: ''
            })
            return
        }

        // Set new timeout for debounced validation
        const timeout = setTimeout(() => {
            validateEmail(email)
        }, 500) // 500ms delay

        setEmailTimeout(timeout)
    }

    // Mobile validation function
    const validateMobile = async (countryCode: string, phone: string) => {
        if (!countryCode || !phone || phone.length < 5) {
            setMobileValidation({
                checking: false,
                exists: false,
                message: ''
            })
            return
        }

        // Basic phone format validation (at least 5 digits)
        const phoneRegex = /^\d{5,}$/
        if (!phoneRegex.test(phone)) {
            setMobileValidation({
                checking: false,
                exists: false,
                message: 'Please enter a valid phone number (at least 5 digits)'
            })
            return
        }

        setMobileValidation(prev => ({ ...prev, checking: true, message: '' }))

        try {
            const response = await fetch(`/api/check-mobile?countryCode=${encodeURIComponent(countryCode)}&phone=${encodeURIComponent(phone)}`)
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const data = await response.json()

            setMobileValidation({
                checking: false,
                exists: data.exists,
                message: data.exists ? 'This mobile number is already registered' : 'Mobile number is available'
            })
        } catch (error) {
            console.error('Error validating mobile:', error)
            setMobileValidation({
                checking: false,
                exists: false,
                message: 'Error checking mobile number availability'
            })
        }
    }

    // Debounced mobile validation
    const handleMobileChange = (countryCode: string, phone: string) => {
        setValue({ ...value, countryCode, phone })
        
        // Clear existing timeout
        if (mobileTimeout) {
            clearTimeout(mobileTimeout)
        }

        // Clear validation if phone is empty or too short
        if (!countryCode || !phone || phone.length < 5) {
            setMobileValidation({
                checking: false,
                exists: false,
                message: ''
            })
            return
        }

        // Set new timeout for debounced validation
        const timeout = setTimeout(() => {
            validateMobile(countryCode, phone)
        }, 500) // 500ms delay

        setMobileTimeout(timeout)
    }

    const validateCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return value.firstName && value.lastName && value.dateOfBirth
            case 2:
                return value.emailAddress && value.countryCode && value.phone && 
                       !emailValidation.exists && !emailValidation.checking &&
                       !mobileValidation.exists && !mobileValidation.checking
            case 3:
                return value.address && value.city && value.state && value.countryOrRegion && value.zipOrPostalCode
            case 4:
                return value.resident && value.enrollmentType && value.courseType && value.graduationYear && value.howDidYouHearAboutIHU && value.objectives && value.signature
            case 5:
                return true
            default:
                return false
        }
    }

    const handleSubmit = async () => {
        setLoading(true)
        setError("")
        setMsg("")
        // Check email validation
        if (emailValidation.exists) {
            setError('Email already exists. Please use a different email address.');
            setLoading(false)
            return;
        }
        // Check mobile number
        if (mobileValidation.exists) {
            setError('Mobile number already exists. Please use a different mobile number.');
            setLoading(false)
            return;
        }
        try {
            // Submit application (without payment)
            const response = await fetch('/api/registrations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(value),
            })
            const data = await response.json()
            if (!response.ok || !data.insertedId) {
                setError(data.error || 'Failed to submit application.')
                setLoading(false)
                return
            }
            setRegistrationId(data.insertedId) // Store registration ID
            setShow(true) // Open payment modal
        } catch {
            setError('Failed to submit application. Please try again.')
        }
        setLoading(false)
    }

    const nextStep = () => {
        if (currentStep < STEPS.length && validateCurrentStep()) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const isDisabled = loading || !validateFields()
    const isStepValid = validateCurrentStep()

    const getApplicationFee = () => {
        if (value.resident === 'Indian Resident') {
            return { amount: 20, currency: 'USD' }
        }
        return { amount: 20, currency: 'USD' }
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">First Name *</label>
                            <input
                                type="text"
                                value={value.firstName}
                                onChange={(e) => setValue({ ...value, firstName: e.target.value })}
                                disabled={loading}
                                placeholder="Enter your first name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base disabled:bg-gray-50 disabled:cursor-not-allowed"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Last Name *</label>
                            <input
                                type="text"
                                value={value.lastName}
                                onChange={(e) => setValue({ ...value, lastName: e.target.value })}
                                disabled={loading}
                                placeholder="Enter your last name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base disabled:bg-gray-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Date of Birth *</label>
                            <input
                                type="date"
                                value={value.dateOfBirth}
                                onChange={(e) => setValue({ ...value, dateOfBirth: e.target.value })}
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base disabled:bg-gray-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Gender</label>
                            <select
                                value={value.gender}
                                onChange={(e) => setValue({ ...value, gender: e.target.value })}
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base disabled:bg-gray-50 disabled:cursor-not-allowed bg-white"
                            >
                                <option value="">Select your gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Email Address *</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={value.emailAddress}
                                    onChange={(e) => handleEmailChange(e.target.value)}
                                    disabled={loading}
                                    placeholder="Enter your email address"
                                    className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-base disabled:bg-gray-50 disabled:cursor-not-allowed ${
                                        emailValidation.checking 
                                            ? 'border-yellow-400 focus:ring-yellow-400' 
                                            : emailValidation.exists 
                                                ? 'border-red-400 focus:ring-red-400' 
                                                : emailValidation.message && !emailValidation.exists 
                                                    ? 'border-green-400 focus:ring-green-400' 
                                                    : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    {emailValidation.checking && (
                                        <Spinner size="w-4 h-4" color="text-yellow-600" />
                                    )}
                                    {!emailValidation.checking && emailValidation.exists && (
                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                    )}
                                    {!emailValidation.checking && emailValidation.message && !emailValidation.exists && (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                    )}
                                </div>
                            </div>
                            {emailValidation.message && (
                                <p className={`text-xs ${
                                    emailValidation.exists 
                                        ? 'text-red-600' 
                                        : emailValidation.message === 'Email is available' 
                                            ? 'text-green-600' 
                                            : 'text-gray-500'
                                }`}>
                                    {emailValidation.message}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Country Code *</label>
                                <input
                                    type="number"
                                    value={value.countryCode}
                                    onChange={(e) => handleMobileChange(e.target.value, value.phone)}
                                    disabled={loading}
                                    placeholder="+1, +91"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-base disabled:bg-gray-50 disabled:cursor-not-allowed ${
                                        mobileValidation.checking 
                                            ? 'border-yellow-400 focus:ring-yellow-400' 
                                            : mobileValidation.exists 
                                                ? 'border-red-400 focus:ring-red-400' 
                                                : mobileValidation.message && !mobileValidation.exists 
                                                    ? 'border-green-400 focus:ring-green-400' 
                                                    : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Phone Number *</label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        value={value.phone}
                                        onChange={(e) => handleMobileChange(value.countryCode, e.target.value)}
                                        disabled={loading}
                                        placeholder="Enter phone number"
                                        className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-base disabled:bg-gray-50 disabled:cursor-not-allowed ${
                                            mobileValidation.checking 
                                                ? 'border-yellow-400 focus:ring-yellow-400' 
                                                : mobileValidation.exists 
                                                    ? 'border-red-400 focus:ring-red-400' 
                                                    : mobileValidation.message && !mobileValidation.exists 
                                                        ? 'border-green-400 focus:ring-green-400' 
                                                        : 'border-gray-300 focus:ring-blue-500'
                                        }`}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        {mobileValidation.checking && (
                                            <Spinner size="w-4 h-4" color="text-yellow-600" />
                                        )}
                                        {!mobileValidation.checking && mobileValidation.exists && (
                                            <AlertCircle className="h-4 w-4 text-red-500" />
                                        )}
                                        {!mobileValidation.checking && mobileValidation.message && !mobileValidation.exists && (
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                        )}
                                    </div>
                                </div>
                                {mobileValidation.message && (
                                    <p className={`text-xs ${
                                        mobileValidation.exists 
                                            ? 'text-red-600' 
                                            : mobileValidation.message === 'Mobile number is available' 
                                                ? 'text-green-600' 
                                                : 'text-gray-500'
                                    }`}>
                                        {mobileValidation.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Street Address *</label>
                            <input
                                type="text"
                                value={value.address}
                                onChange={(e) => setValue({ ...value, address: e.target.value })}
                                disabled={loading}
                                placeholder="Enter your street address"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base disabled:bg-gray-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">City *</label>
                                <input
                                    type="text"
                                    value={value.city}
                                    onChange={(e) => setValue({ ...value, city: e.target.value })}
                                    disabled={loading}
                                    placeholder="Enter your city"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base disabled:bg-gray-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">State *</label>
                                <input
                                    type="text"
                                    value={value.state}
                                    onChange={(e) => setValue({ ...value, state: e.target.value })}
                                    disabled={loading}
                                    placeholder="Enter your state"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base disabled:bg-gray-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Country *</label>
                                <input
                                    type="text"
                                    value={value.countryOrRegion}
                                    onChange={(e) => setValue({ ...value, countryOrRegion: e.target.value })}
                                    disabled={loading}
                                    placeholder="Enter your country"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base disabled:bg-gray-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">ZIP Code *</label>
                                <input
                                    type="text"
                                    value={value.zipOrPostalCode}
                                    onChange={(e) => setValue({ ...value, zipOrPostalCode: e.target.value })}
                                    disabled={loading}
                                    placeholder="Enter ZIP code"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base disabled:bg-gray-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                )

            case 4:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Resident Status *</label>
                                <select
                                    value={value.resident}
                                    onChange={(e) => setValue({ ...value, resident: e.target.value })}
                                    disabled={loading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base disabled:bg-gray-50 disabled:cursor-not-allowed bg-white"
                                >
                                    <option value="">Select status</option>
                                    <option value="Indian Resident">Indian Resident</option>
                                    <option value="Non-Indian Resident">Non-Indian Resident</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Enrollment Type *</label>
                                <select
                                    value={value.enrollmentType}
                                    onChange={(e) => setValue({ ...value, enrollmentType: e.target.value })}
                                    disabled={loading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base disabled:bg-gray-50 disabled:cursor-not-allowed bg-white"
                                >
                                    <option value="">Select type</option>
                                    <option value="Full Time">Full Time</option>
                                    <option value="Part Time">Part Time</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Course Type *</label>
                                <select
                                    value={value.courseType}
                                    onChange={(e) => setValue({ ...value, courseType: e.target.value })}
                                    disabled={loading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base disabled:bg-gray-50 disabled:cursor-not-allowed bg-white"
                                >
                                    <option value="">Select course</option>
                                    {courseTypes.map((courseType) => (
                                        <option key={courseType._id} value={courseType.title}>
                                            {courseType.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Graduation Year *</label>
                                <input
                                    type="text"
                                    value={value.graduationYear}
                                    onChange={(e) => setValue({ ...value, graduationYear: e.target.value })}
                                    disabled={loading}
                                    placeholder="e.g., 2025"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base disabled:bg-gray-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">How did you hear about us? *</label>
                            <select
                                value={value.howDidYouHearAboutIHU}
                                onChange={(e) => setValue({ ...value, howDidYouHearAboutIHU: e.target.value })}
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base disabled:bg-gray-50 disabled:cursor-not-allowed bg-white"
                            >
                                <option value="">Select option</option>
                                <option value="Social Media">Social Media</option>
                                <option value="Website">Website</option>
                                <option value="Friend/Family">Friend/Family</option>
                                <option value="Advertisement">Advertisement</option>
                                <option value="Search Engine">Search Engine</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Personal Objectives *</label>
                            <textarea
                                value={value.objectives}
                                onChange={(e) => setValue({ ...value, objectives: e.target.value })}
                                disabled={loading}
                                placeholder="Describe your educational and career objectives..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base disabled:bg-gray-50 disabled:cursor-not-allowed resize-none min-h-[120px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Digital Signature *</label>
                            <input
                                type="text"
                                value={value.signature}
                                onChange={(e) => setValue({ ...value, signature: e.target.value })}
                                disabled={loading}
                                placeholder="Type your full legal name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base disabled:bg-gray-50 disabled:cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500">By typing your name, you confirm all information is accurate</p>
                        </div>
                    </div>
                )

            case 5:
                return (
                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="h-5 w-5 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Application Summary</h3>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex justify-between md:block">
                                        <span className="font-semibold text-gray-700">Name:</span>
                                        <span className="text-gray-900">{value.firstName} {value.lastName}</span>
                                    </div>
                                    
                                    <div className="flex justify-between md:block">
                                        <span className="font-semibold text-gray-700">Email:</span>
                                        <span className="text-gray-900 break-all">{value.emailAddress}</span>
                                    </div>
                                    
                                    <div className="flex justify-between md:block">
                                        <span className="font-semibold text-gray-700">Phone:</span>
                                        <span className="text-gray-900">{value.countryCode} {value.phone}</span>
                                    </div>
                                    
                                    <div className="flex justify-between md:block">
                                        <span className="font-semibold text-gray-700">Course:</span>
                                        <span className="text-gray-900">{value.courseType}</span>
                                    </div>
                                    
                                    <div className="flex justify-between md:block">
                                        <span className="font-semibold text-gray-700">Resident:</span>
                                        <span className="text-gray-900">{value.resident}</span>
                                    </div>
                                    
                                    <div className="flex justify-between md:block">
                                        <span className="font-semibold text-gray-700">Fee:</span>
                                        <span className="font-bold text-green-600">{getApplicationFee().currency} {getApplicationFee().amount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    // Payment success handler
    const handlePaymentSuccess = () => {
        setShow(false)
        setPaymentComplete(true)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Apply for Admission</h1>
                    <p className="text-gray-600 text-lg">International Hindu University</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        {STEPS.map((step) => {
                            const Icon = step.icon
                            const isActive = currentStep === step.id
                            const isCompleted = currentStep > step.id
                            
                            return (
                                <div key={step.id} className="flex flex-col items-center flex-1">
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                                        isCompleted ? 'bg-green-500 text-white shadow-lg' :
                                        isActive ? 'bg-blue-500 text-white shadow-lg' :
                                        'bg-gray-200 text-gray-400'
                                    }`}>
                                        {isCompleted ? <CheckCircle className="h-5 w-5 md:h-6 md:w-6" /> : <Icon className="h-5 w-5 md:h-6 md:w-6" />}
                                    </div>
                                    <span className={`text-xs md:text-sm text-center ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-400'} hidden md:block`}>
                                        {step.title}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500 md:hidden">
                        <span>Step {currentStep}</span>
                        <span>of {STEPS.length}</span>
                    </div>
                </div>

                {/* Form Content */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                    {(() => {
                                        const Icon = STEPS[currentStep - 1].icon
                                        return <Icon className="h-4 w-4 text-white" />
                                    })()}
                                </div>
                                <h2 className="text-lg md:text-xl font-semibold text-white">
                                    {STEPS[currentStep - 1].title}
                                </h2>
                            </div>
                            <div className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
                                {currentStep}/{STEPS.length}
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        {renderStepContent()}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                    {currentStep > 1 && (
                        <button
                            onClick={prevStep}
                            className="flex-1 md:flex-none md:w-32 h-12 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="hidden md:inline">Previous</span>
                        </button>
                    )}
                    
                    {currentStep < STEPS.length ? (
                        <button
                            onClick={nextStep}
                            disabled={!isStepValid || loading}
                            className="flex-1 h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            <span className="hidden md:inline">Next</span>
                            <ChevronRight className="h-4 w-4" />
                        </button>
                                            ) : (
                            <div className="w-full space-y-3">
                                {/* Payment Info Banner */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                            <CreditCard className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-blue-900">Application Fee: {getApplicationFee().currency} {getApplicationFee().amount}</h4>
                                            <p className="text-sm text-blue-700">Payment will be processed securely after form submission</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Missing Fields Warning */}
                                {!validateFields() && (
                                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-amber-900">Please complete all required fields</h4>
                                                <p className="text-sm text-amber-700 mt-1">
                                                    Missing: {getMissingFields().join(', ')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <button
                                    onClick={handleSubmit}
                                    disabled={isDisabled}
                                    className="w-full h-12 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <Spinner />
                                            <span className="ml-2">Processing...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <CreditCard className="h-4 w-4" />
                                            <span>Submit Application & Proceed to Payment</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                </div>

                {/* Back to Full Form Link */}
                <div className="text-center mt-8">
                    <button
                        onClick={() => router.push('/Registration-Form')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium underline hover:no-underline transition-all duration-200"
                    >
                        Use full application form instead
                    </button>
                </div>
            </div>

            {/* Error and Message Modals */}
            {msg && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Success!</h3>
                        </div>
                        <p className="text-gray-600 mb-4">{msg}</p>
                        <p className="text-sm text-gray-500 mb-6">You will be redirected to the payment page.</p>
                        <button
                            onClick={() => setMsg('')}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertCircle className="h-5 w-5 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Application Error</h3>
                        </div>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => setError('')}
                            className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            <InitiatePayment
                registration={value}
                price={getApplicationFee().amount.toString()}
                show={show}
                onClose={() => setShow(false)}
                onPaymentSuccess={handlePaymentSuccess}
                registrationId={registrationId}
            />
            {/* Payment Complete Modal */}
            {paymentComplete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Payment Complete!</h3>
                        </div>
                        <p className="text-gray-600 mb-4">Your application and payment have been received successfully.</p>
                        <button
                            onClick={() => { setPaymentComplete(false); router.push('/') }}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MobileSignup 