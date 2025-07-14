/* eslint-disable @typescript-eslint/no-unused-vars */
import InitiatePayment from '@/app/(Applications)/Registration-Form/Checkout/InitiatePayment'
import Spinner from '@/components/Spinner'
import { checkEmailAlreadyExists, createRegisterForm, updateRegistration, getRegistrationById } from '@/Server/Registration'
import { PaymentStatus, RegisterForm, Status } from '@/Types/Form'
import { User, Mail, Phone, MapPin, GraduationCap, FileText, CreditCard, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, X } from 'lucide-react'
import React from 'react'

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

type Props = {
    setData: React.Dispatch<React.SetStateAction<RegisterForm[]>>
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>
    isEdit?: boolean
    editData?: RegisterForm
}

const STEPS = [
    { id: 1, title: 'Personal Info', icon: User, description: 'Basic personal details' },
    { id: 2, title: 'Contact Info', icon: Mail, description: 'Email, phone, and address' },
    { id: 3, title: 'Location', icon: MapPin, description: 'Address and location info' },
    { id: 4, title: 'Academic Info', icon: GraduationCap, description: 'Education and course details' },
    { id: 5, title: 'Additional Info', icon: FileText, description: 'Objectives and requirements' },
    { id: 6, title: 'Review', icon: CreditCard, description: 'Payment options and final review' }
]

const Add = ({ setData, setOpen, isEdit, editData }: Props) => {
    const [value, setValue] = React.useState<RegisterForm>(initialValue)
    const [loading, setLoading] = React.useState(false)
    const [msg, setMsg] = React.useState('')
    const [error, setError] = React.useState('')
    const [show, setShow] = React.useState(false)
    const [withPayment, setWithPayment] = React.useState(isEdit ? false : true)
    const [paymentCost, setPaymentCost] = React.useState(1)
    const [currentStep, setCurrentStep] = React.useState(1)

    // Email validation state
    const [emailValidation, setEmailValidation] = React.useState({
        checking: false,
        exists: false,
        message: ''
    })
    const [emailTimeout, setEmailTimeout] = React.useState<NodeJS.Timeout | null>(null)

    // Mobile validation state
    const [mobileValidation, setMobileValidation] = React.useState({
        checking: false,
        exists: false,
        message: ''
    })
    const [mobileTimeout, setMobileTimeout] = React.useState<NodeJS.Timeout | null>(null)

    React.useEffect(() => {
        if (isEdit && editData) {
            setValue(editData)
        }
    }, [isEdit, editData])

    // Cleanup timeout on unmount
    React.useEffect(() => {
        return () => {
            if (emailTimeout) {
                clearTimeout(emailTimeout)
            }
            if (mobileTimeout) {
                clearTimeout(mobileTimeout)
            }
        }
    }, [emailTimeout, mobileTimeout])

    const requiredFields: Array<keyof RegisterForm> = [
        'firstName', 'lastName', 'dateOfBirth', 'emailAddress', 'countryCode', 'phone', 'address', 'city', 'state', 'countryOrRegion', 'zipOrPostalCode', 'resident', 'enrollmentType', 'courseType', 'graduationYear', 'howDidYouHearAboutIHU', 'objectives', 'signature'
    ]

    const validateFields = () => {
        for (const field of requiredFields) {
            if (!value[field]) {
                return false;
            }
        }

        // Check if email is valid and doesn't exist
        if (emailValidation.exists || emailValidation.checking) {
            return false;
        }

        // Check if mobile is valid and doesn't exist
        if (mobileValidation.exists || mobileValidation.checking) {
            return false;
        }
        
        return true;
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
                return value.resident && value.enrollmentType && value.courseType && value.graduationYear
            case 5:
                return value.howDidYouHearAboutIHU && value.objectives && value.signature
            case 6:
                return true
            default:
                return false
        }
    }

    const handleSubmit = async () => {
        setLoading(true)

        if (isEdit) {
            await updateRegistration(value._id as string, value).finally(() => {
                setData((prev) => {
                    const index = prev.findIndex((item) => item._id === value._id)
                    if (index !== -1) {
                        const updatedData = [...prev]
                        updatedData[index] = value
                        return updatedData
                    }
                    return prev
                })
                setLoading(false)
                setOpen?.(false)
            })
        } else {
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
            if (withPayment) {
                setShow(true)
            } else {
                const res = await createRegisterForm({
                    ...value,
                    orderId: '',
                })

                if (res && res.insertedId) {
                    // Get the created registration to get the generated registration number
                    const createdRegistration = await getRegistrationById(res.insertedId.toString())
                    
                    setData((prev) => {
                        return [...prev, { 
                            ...value, 
                            ...createdRegistration,
                            orderId: '', 
                            _id: res.insertedId?.toString?.() ?? res.insertedId, 
                            paymentStatus: PaymentStatus.PENDING, 
                            status: Status.PENDING, 
                            createdAt: new Date() 
                        }]
                    })
                    setOpen?.(false)
                }
            }
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

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2 min-w-0">
                                <label className="text-sm font-medium text-gray-700">First Name *</label>
                                <input
                                    type="text"
                                    value={value.firstName}
                                    onChange={(e) => setValue({ ...value, firstName: e.target.value })}
                                    disabled={loading}
                                    placeholder="Enter first name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2 min-w-0">
                                <label className="text-sm font-medium text-gray-700">Middle Name</label>
                                <input
                                    type="text"
                                    value={value.middleName}
                                    onChange={(e) => setValue({ ...value, middleName: e.target.value })}
                                    disabled={loading}
                                    placeholder="Enter middle name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2 min-w-0">
                                <label className="text-sm font-medium text-gray-700">Last Name *</label>
                                <input
                                    type="text"
                                    value={value.lastName}
                                    onChange={(e) => setValue({ ...value, lastName: e.target.value })}
                                    disabled={loading}
                                    placeholder="Enter last name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Former/Maiden Name</label>
                                <input
                                    type="text"
                                    value={value.formerOrMaidenName}
                                    onChange={(e) => setValue({ ...value, formerOrMaidenName: e.target.value })}
                                    disabled={loading}
                                    placeholder="Enter former/maiden name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Date of Birth *</label>
                                <input
                                    type="date"
                                    value={value.dateOfBirth}
                                    onChange={(e) => setValue({ ...value, dateOfBirth: e.target.value })}
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Gender</label>
                                <select
                                    value={value.gender}
                                    onChange={(e) => setValue({ ...value, gender: e.target.value })}
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Email Address *</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={value.emailAddress}
                                        onChange={(e) => handleEmailChange(e.target.value)}
                                        disabled={loading}
                                        placeholder="Enter email address"
                                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
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
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
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
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Country Code *</label>
                                <input
                                    type="number"
                                    value={value.countryCode}
                                    onChange={(e) => handleMobileChange(e.target.value, value.phone)}
                                    disabled={loading}
                                    placeholder="e.g., +1"
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
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
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    value={value.phone}
                                    onChange={(e) => handleMobileChange(value.countryCode, e.target.value)}
                                    disabled={loading}
                                    placeholder="Enter phone number"
                                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
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
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
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
                )

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Address *</label>
                                <textarea
                                    value={value.address}
                                    onChange={(e) => setValue({ ...value, address: e.target.value })}
                                    disabled={loading}
                                    placeholder="Enter street address"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Street Address 2</label>
                                <textarea
                                    value={value.streetAddress2}
                                    onChange={(e) => setValue({ ...value, streetAddress2: e.target.value })}
                                    disabled={loading}
                                    placeholder="Apartment, suite, etc. (optional)"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">City *</label>
                                <input
                                    type="text"
                                    value={value.city}
                                    onChange={(e) => setValue({ ...value, city: e.target.value })}
                                    disabled={loading}
                                    placeholder="Enter city"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">State *</label>
                                <input
                                    type="text"
                                    value={value.state}
                                    onChange={(e) => setValue({ ...value, state: e.target.value })}
                                    disabled={loading}
                                    placeholder="Enter state"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Zip/Postal Code *</label>
                                <input
                                    type="text"
                                    value={value.zipOrPostalCode}
                                    onChange={(e) => setValue({ ...value, zipOrPostalCode: e.target.value })}
                                    disabled={loading}
                                    placeholder="Enter zip code"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Country/Region *</label>
                            <input
                                type="text"
                                value={value.countryOrRegion}
                                onChange={(e) => setValue({ ...value, countryOrRegion: e.target.value })}
                                disabled={loading}
                                placeholder="Enter country"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>
                )

            case 4:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Resident Status *</label>
                                <select
                                    value={value.resident}
                                    onChange={(e) => setValue({ ...value, resident: e.target.value })}
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">Select resident status</option>
                                    <option value="Indian Resident">Indian Resident</option>
                                    <option value="Outside India Resident">Outside India Resident</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Course Type *</label>
                                <select
                                    value={value.courseType}
                                    onChange={(e) => setValue({ ...value, courseType: e.target.value })}
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">Select course type</option>
                                    <option value="Degree">Degree</option>
                                    <option value="Certification">Certification</option>
                                    <option value="PhD">PhD</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Enrollment Type *</label>
                            <select
                                value={value.enrollmentType}
                                onChange={(e) => setValue({ ...value, enrollmentType: e.target.value })}
                                disabled={loading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">Select enrollment type</option>
                                <option value="Never enrolled in college or University before">Never enrolled in college or University before</option>
                                <option value="Enrolled in college or University but never attended IHU">Enrolled in college or University but never attended IHU</option>
                                <option value="Attended IHU and will continue same degree program">Attended IHU and will continue same degree program</option>
                                <option value="Attended IHU and will not continue in same degree program">Attended IHU and will not continue in same degree program</option>
                                <option value="Currently attending IHU Florida">Currently attending IHU Florida</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Present Level of Education</label>
                                <input
                                    type="text"
                                    value={value.presentLevelOfEducation}
                                    onChange={(e) => setValue({ ...value, presentLevelOfEducation: e.target.value })}
                                    disabled={loading}
                                    placeholder="Enter current education level"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Graduation Year *</label>
                                <input
                                    type="text"
                                    value={value.graduationYear}
                                    onChange={(e) => setValue({ ...value, graduationYear: e.target.value })}
                                    disabled={loading}
                                    placeholder="Enter graduation year"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                )

            case 5:
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">How Did You Hear About IHU? *</label>
                            <textarea
                                value={value.howDidYouHearAboutIHU}
                                onChange={(e) => setValue({ ...value, howDidYouHearAboutIHU: e.target.value })}
                                disabled={loading}
                                placeholder="Please describe how you learned about IHU"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Your Objectives and Background *</label>
                            <p className="text-xs text-gray-500 mb-2">
                                Please share your objectives for joining International Hindu University, ideals you cherish, your role-models/heroes, 
                                values/principles you are trying to live by or would like to develop. We would also appreciate learning about books, 
                                people, incidents, etc. that have influenced you significantly.
                            </p>
                            <textarea
                                value={value.objectives}
                                onChange={(e) => setValue({ ...value, objectives: e.target.value })}
                                disabled={loading}
                                placeholder="Please share your objectives, background, and influences..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                                rows={5}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Digital Signature *</label>
                            <p className="text-xs text-gray-500 mb-2">
                                By typing your name below, you confirm that all information provided is true and accurate to the best of your knowledge. 
                                You understand that any misrepresentation may result in expulsion from the University without refund.
                            </p>
                            <input
                                type="text"
                                value={value.signature}
                                onChange={(e) => setValue({ ...value, signature: e.target.value })}
                                disabled={loading}
                                placeholder="Type your full name as digital signature"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-medium text-gray-700">Documents Received/Expected</label>
                            <p className="text-xs text-gray-500">Please check what you have received or expect to receive:</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={value.recieved.diploma}
                                        onChange={(e) => setValue({ ...value, recieved: { ...value.recieved, diploma: e.target.checked } })}
                                        disabled={loading}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                    />
                                    <label className="text-sm text-gray-700">Diploma</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={value.recieved.homeSchool}
                                        onChange={(e) => setValue({ ...value, recieved: { ...value.recieved, homeSchool: e.target.checked } })}
                                        disabled={loading}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                    />
                                    <label className="text-sm text-gray-700">Home School</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={value.recieved.ged}
                                        onChange={(e) => setValue({ ...value, recieved: { ...value.recieved, ged: e.target.checked } })}
                                        disabled={loading}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                    />
                                    <label className="text-sm text-gray-700">GED</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={value.recieved.other}
                                        onChange={(e) => setValue({ ...value, recieved: { ...value.recieved, other: e.target.checked } })}
                                        disabled={loading}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                    />
                                    <label className="text-sm text-gray-700">Other</label>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 6:
                return (
                    <div className="space-y-6">
                        {!isEdit && (
                            <div className="border border-blue-200 bg-blue-50 rounded-lg p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <CreditCard className="h-5 w-5 text-blue-800" />
                                    <h3 className="text-lg font-semibold text-blue-800">Payment Options</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={withPayment}
                                            onChange={(e) => setWithPayment(e.target.checked)}
                                            disabled={loading}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                        />
                                        <label className="text-sm font-medium text-gray-700">Process payment with registration</label>
                                    </div>
                                    
                                    {withPayment && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Payment Amount (USD)</label>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-500">$</span>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={paymentCost}
                                                    onChange={(e) => setPaymentCost(parseInt(e.target.value))}
                                                    disabled={loading}
                                                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                />
                                                <span className="text-gray-500">USD</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="h-5 w-5 text-gray-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Registration Summary</h3>
                                </div>
                                <p className="text-sm text-gray-600">Please review your information before submitting</p>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-2">
                                        <div><span className="font-medium">Name:</span> {`${value.firstName} ${value.middleName} ${value.lastName}`.trim()}</div>
                                        <div><span className="font-medium">Email:</span> {value.emailAddress}</div>
                                        <div><span className="font-medium">Phone:</span> {value.countryCode} {value.phone}</div>
                                        <div><span className="font-medium">Date of Birth:</span> {value.dateOfBirth}</div>
                                        <div><span className="font-medium">Gender:</span> {value.gender}</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div><span className="font-medium">Course Type:</span> {value.courseType}</div>
                                        <div><span className="font-medium">Enrollment Type:</span> {value.enrollmentType}</div>
                                        <div><span className="font-medium">Resident Status:</span> {value.resident}</div>
                                        <div><span className="font-medium">Location:</span> {value.city}, {value.state}, {value.countryOrRegion}</div>
                                        <div><span className="font-medium">Graduation Year:</span> {value.graduationYear}</div>
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

    return (
        <div className="flex flex-col h-screen">
            {/* Fixed Header */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4">
                {/* Progress Indicator */}
                <div className="w-full">
                    <div className="flex items-center justify-between mb-4 relative overflow-x-auto scrollbar-hide">
                        <div className="flex items-center justify-between min-w-full px-2 gap-2">
                            {STEPS.map((step, index) => {
                                const Icon = step.icon
                                const isActive = currentStep === step.id
                                const isCompleted = currentStep > step.id
                                
                                return (
                                    <div key={step.id} className="flex flex-col items-center relative z-10 flex-shrink-0">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                                            isCompleted ? 'bg-green-500 text-white' :
                                            isActive ? 'bg-blue-500 text-white' :
                                            'bg-gray-200 text-gray-400'
                                        }`}>
                                            {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                                        </div>
                                        <div className="text-center min-w-0 px-1">
                                            <div className={`text-xs font-medium truncate ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                                                {step.title}
                                            </div>
                                            <div className="text-xs text-gray-400 hidden md:block truncate">{step.description}</div>
                                        </div>
                                    </div>
                                )
                            })}
                            {/* Progress Line */}
                            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                                <div 
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="p-4 space-y-6">
            
            {/* Error and Message Dialogs */}
            {msg && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <h3 className="text-lg font-semibold">{msg}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">You will be redirected to the payment page.</p>
                        <button
                            onClick={() => setMsg('')}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <h3 className="text-lg font-semibold">Error</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => setError('')}
                            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {/* Step Content */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm min-h-[400px] overflow-hidden">
                <div className="p-4 md:p-6 border-b border-gray-200 bg-white">
                    <div className="flex items-center gap-2 mb-2">
                        {React.createElement(STEPS[currentStep - 1].icon, { className: "h-5 w-5 text-gray-600 flex-shrink-0" })}
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{STEPS[currentStep - 1].title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 hidden md:block">{STEPS[currentStep - 1].description}</p>
                </div>
                <div className="p-4 md:p-6">
                    {renderStepContent()}
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4 bg-white border-t border-gray-200 p-4">
                <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1 || loading}
                    className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex items-center gap-1 md:gap-2">
                    <span className={`px-2 md:px-3 py-1 text-xs font-medium rounded-full ${
                        isStepValid ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                        <span className="hidden sm:inline">Step </span>{currentStep}<span className="hidden sm:inline"> of {STEPS.length}</span>
                    </span>
                    {!isStepValid && currentStep < STEPS.length && (
                        <span className="px-2 md:px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full hidden sm:inline">
                            Please complete required fields
                        </span>
                    )}
                </div>

                {currentStep < STEPS.length ? (
                    <button
                        type="button"
                        onClick={nextStep}
                        disabled={!isStepValid || loading}
                        className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="h-4 w-4" />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={isDisabled}
                        className="flex items-center gap-1 md:gap-2 px-4 md:px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? <Spinner size="1.4rem" /> : (
                            <>
                                <CheckCircle className="h-4 w-4" />
                                <span className="hidden sm:inline">{isEdit ? 'Update Registration' : 'Submit Registration'}</span>
                                <span className="sm:hidden">{isEdit ? 'Update' : 'Submit'}</span>
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Payment Dialog */}
            {show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold">Confirm Registration & Payment</h3>
                            <button
                                onClick={() => setShow(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Registration Summary */}
                            <div className="space-y-4">
                                <div className="bg-white border border-gray-200 rounded-lg">
                                    <div className="p-4 border-b border-gray-200">
                                        <h4 className="text-base font-semibold">Personal Information</h4>
                                    </div>
                                    <div className="p-4 text-sm space-y-2">
                                        <div><span className="font-medium">Name:</span> {`${value.firstName} ${value.middleName} ${value.lastName}`.trim()}</div>
                                        <div><span className="font-medium">Email:</span> {value.emailAddress}</div>
                                        <div><span className="font-medium">Phone:</span> {value.countryCode} {value.phone}</div>
                                        <div><span className="font-medium">Date of Birth:</span> {value.dateOfBirth}</div>
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg">
                                    <div className="p-4 border-b border-gray-200">
                                        <h4 className="text-base font-semibold">Academic Information</h4>
                                    </div>
                                    <div className="p-4 text-sm space-y-2">
                                        <div><span className="font-medium">Course Type:</span> {value.courseType}</div>
                                        <div><span className="font-medium">Enrollment Type:</span> {value.enrollmentType}</div>
                                        <div><span className="font-medium">Resident Status:</span> {value.resident}</div>
                                        <div><span className="font-medium">Graduation Year:</span> {value.graduationYear}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Section */}
                            <div className="space-y-4">
                                <div className="bg-white border border-gray-200 rounded-lg">
                                    <div className="p-4 border-b border-gray-200">
                                        <h4 className="text-base font-semibold">Payment Details</h4>
                                    </div>
                                    <div className="p-4">
                                        <div className="text-2xl font-bold text-blue-600 mb-4">
                                            ${paymentCost} USD
                                        </div>
                                        <InitiatePayment
                                            price={paymentCost.toString()}
                                            registration={value}
                                            show={show}
                                            onClose={() => setShow(false)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
                </div>
            </div>
        </div>
    )
}

export default Add 