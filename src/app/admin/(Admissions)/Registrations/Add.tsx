/* eslint-disable @typescript-eslint/no-unused-vars */
import InitiatePayment from '@/app/(Applications)/Registration-Form/Checkout/InitiatePayment'
import Spinner from '@/components/Spinner'
import { checkEmailAlreadyExists, createRegisterForm, updateRegistration, getRegistrationById } from '@/Server/Registration'
import { getAllCourseTypesForSelect } from '@/Server/CourseType'
import { PaymentStatus, RegisterForm, Status } from '@/Types/Form'
import type { CourseType } from '@/Types/Courses'
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

const Add = ({ setData, setOpen, isEdit, editData }: Props) => {
    const [value, setValue] = React.useState<RegisterForm>(initialValue)
    const [loading, setLoading] = React.useState(false)
    const [msg, setMsg] = React.useState('')
    const [error, setError] = React.useState('')
    const [show, setShow] = React.useState(false)
    const [registrationId, setRegistrationId] = React.useState<string>('')
    const [withPayment, setWithPayment] = React.useState(isEdit ? false : true)
    const [paymentCost, setPaymentCost] = React.useState(1)
    const [courseTypes, setCourseTypes] = React.useState<CourseType[]>([])

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

    // Fetch course types
    React.useEffect(() => {
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
        if (emailValidation.exists || emailValidation.checking) {
            return false;
        }
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
            if (emailValidation.exists) {
                setError('Email already exists. Please use a different email address.');
                setLoading(false)
                return;
            }
            if (mobileValidation.exists) {
                setError('Mobile number already exists. Please use a different mobile number.');
                setLoading(false)
                return;
            }
            if (withPayment) {
                try {
                    const response = await fetch('/api/registrations', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(value),
                    });
                    const result = await response.json();
                    if (response.ok && result.success) {
                        setRegistrationId(result.insertedId);
                        setShow(true);
                    } else {
                        setError(result.error || 'Failed to save registration. Please try again.');
                        setLoading(false);
                        return;
                    }
                } catch (error) {
                    setError('An error occurred while saving registration. Please try again.');
                    setLoading(false);
                    return;
                }
            } else {
                const res = await createRegisterForm({
                    ...value,
                    orderId: '',
                })
                if (res && res.insertedId) {
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

    const isDisabled = loading || !validateFields()

                return (
        <div className="flex flex-col h-full">
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
            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-6">
                    {/* Flattened Form: All fields visible at once */}
                    <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                        {/* Personal Info */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2 min-w-0">
                                <label className="text-sm font-medium text-gray-700">First Name *</label>
                                <input
                                    type="text"
                                    value={value.firstName}
                                        onChange={e => setValue({ ...value, firstName: e.target.value })}
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
                                        onChange={e => setValue({ ...value, middleName: e.target.value })}
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
                                        onChange={e => setValue({ ...value, lastName: e.target.value })}
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
                                        onChange={e => setValue({ ...value, formerOrMaidenName: e.target.value })}
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
                                        onChange={e => setValue({ ...value, dateOfBirth: e.target.value })}
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Gender</label>
                                <select
                                    value={value.gender}
                                        onChange={e => setValue({ ...value, gender: e.target.value })}
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
                        {/* Contact Info */}
                        <div className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Email Address *</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={value.emailAddress}
                                            onChange={e => handleEmailChange(e.target.value)}
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
                                <select
                                    value={value.countryCode}
                                    onChange={e => handleMobileChange(e.target.value, value.phone)}
                                    disabled={loading}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                                        mobileValidation.checking 
                                            ? 'border-yellow-400 focus:ring-yellow-400' 
                                            : mobileValidation.exists 
                                                ? 'border-red-400 focus:ring-red-400' 
                                                : mobileValidation.message && !mobileValidation.exists 
                                                    ? 'border-green-400 focus:ring-green-400' 
                                                    : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                >
                                    <option value="">Select country code</option>
                                    <option value="+1">+1 (USA)</option>
                                    <option value="+91">+91 (India)</option>
                                    <option value="+44">+44 (UK)</option>
                                    <option value="+61">+61 (Australia)</option>
                                    <option value="+81">+81 (Japan)</option>
                                    <option value="+971">+971 (UAE)</option>
                                    <option value="+49">+49 (Germany)</option>
                                    <option value="+33">+33 (France)</option>
                                    <option value="+86">+86 (China)</option>
                                    <option value="+92">+92 (Pakistan)</option>
                                    <option value="+880">+880 (Bangladesh)</option>
                                    <option value="+234">+234 (Nigeria)</option>
                                    <option value="+7">+7 (Russia)</option>
                                    <option value="+55">+55 (Brazil)</option>
                                    <option value="+27">+27 (South Africa)</option>
                                    <option value="+82">+82 (South Korea)</option>
                                    <option value="+62">+62 (Indonesia)</option>
                                    <option value="+63">+63 (Philippines)</option>
                                    <option value="+20">+20 (Egypt)</option>
                                    <option value="+34">+34 (Spain)</option>
                                    {/* Add more as needed */}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    value={value.phone}
                                        onChange={e => handleMobileChange(value.countryCode, e.target.value)}
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
                        {/* Location */}
                        <div className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Address *</label>
                                <textarea
                                    value={value.address}
                                        onChange={e => setValue({ ...value, address: e.target.value })}
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
                                        onChange={e => setValue({ ...value, streetAddress2: e.target.value })}
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
                                        onChange={e => setValue({ ...value, city: e.target.value })}
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
                                        onChange={e => setValue({ ...value, state: e.target.value })}
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
                                        onChange={e => setValue({ ...value, zipOrPostalCode: e.target.value })}
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
                                    onChange={e => setValue({ ...value, countryOrRegion: e.target.value })}
                                disabled={loading}
                                placeholder="Enter country"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>
                        {/* Academic Info */}
                        <div className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Resident Status *</label>
                                <select
                                    value={value.resident}
                                        onChange={e => setValue({ ...value, resident: e.target.value })}
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
                                        onChange={e => setValue({ ...value, courseType: e.target.value })}
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">Select course type</option>
                                    {courseTypes.map((courseType) => (
                                        <option key={courseType._id} value={courseType.title}>
                                            {courseType.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Enrollment Type *</label>
                            <select
                                value={value.enrollmentType}
                                    onChange={e => setValue({ ...value, enrollmentType: e.target.value })}
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
                                        onChange={e => setValue({ ...value, presentLevelOfEducation: e.target.value })}
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
                                        onChange={e => setValue({ ...value, graduationYear: e.target.value })}
                                    disabled={loading}
                                    placeholder="Enter graduation year"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                        {/* Additional Info */}
                        <div className="space-y-6 mt-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">How Did You Hear About IHU? *</label>
                            <textarea
                                value={value.howDidYouHearAboutIHU}
                                    onChange={e => setValue({ ...value, howDidYouHearAboutIHU: e.target.value })}
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
                                    onChange={e => setValue({ ...value, objectives: e.target.value })}
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
                                    onChange={e => setValue({ ...value, signature: e.target.value })}
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
                                            onChange={e => setValue({ ...value, recieved: { ...value.recieved, diploma: e.target.checked } })}
                                        disabled={loading}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                    />
                                    <label className="text-sm text-gray-700">Diploma</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={value.recieved.homeSchool}
                                            onChange={e => setValue({ ...value, recieved: { ...value.recieved, homeSchool: e.target.checked } })}
                                        disabled={loading}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                    />
                                    <label className="text-sm text-gray-700">Home School</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={value.recieved.ged}
                                            onChange={e => setValue({ ...value, recieved: { ...value.recieved, ged: e.target.checked } })}
                                        disabled={loading}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                    />
                                    <label className="text-sm text-gray-700">GED</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={value.recieved.other}
                                            onChange={e => setValue({ ...value, recieved: { ...value.recieved, other: e.target.checked } })}
                                        disabled={loading}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                    />
                                    <label className="text-sm text-gray-700">Other</label>
                                </div>
                            </div>
                        </div>
                    </div>
                        {/* Payment and Summary (if not edit) */}
                        {!isEdit && (
                            <div className="border border-blue-200 bg-blue-50 rounded-lg p-6 mt-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <CreditCard className="h-5 w-5 text-blue-800" />
                                    <h3 className="text-lg font-semibold text-blue-800">Payment Options</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={withPayment}
                                            onChange={e => setWithPayment(e.target.checked)}
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
                                                    onChange={e => setPaymentCost(parseInt(e.target.value))}
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
                        {/* Registration Summary (optional, can be removed if not needed) */}
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mt-6">
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
                        {/* Submit Button */}
                        <div className="flex justify-end items-center pt-4 bg-white border-t border-gray-200 p-4 mt-6">
                        <button
                                type="submit"
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
            </div>
                    </form>
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
                            registrationId={registrationId}
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