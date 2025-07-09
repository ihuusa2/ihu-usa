/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { checkEmailAlreadyExists, createRegisterForm } from '@/Server/Registration'
import { PaymentStatus, RegisterForm, Status } from '@/Types/Form'
import { useRouter, useSearchParams } from 'next/navigation'
import { User, Mail, Phone, MapPin, GraduationCap, FileText, CreditCard, CheckCircle, AlertCircle, Info, ArrowLeft, ArrowRight, Shield, Clock, GraduationCap as GraduationCapIcon } from 'lucide-react'
import React, { useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useMobileDetection } from '@/hooks/useMobileDetection'
import InitiatePayment from './Checkout/InitiatePayment'

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
    { id: 1, title: 'Personal Info', icon: User, description: 'Your basic personal details' },
    { id: 2, title: 'Contact Info', icon: Mail, description: 'Email, phone, and contact details' },
    { id: 3, title: 'Address', icon: MapPin, description: 'Your address and location' },
    { id: 4, title: 'Academic Info', icon: GraduationCap, description: 'Education and course preferences' },
    { id: 5, title: 'Personal Statement', icon: FileText, description: 'Your objectives and background' },
    { id: 6, title: 'Review & Submit', icon: CreditCard, description: 'Review and complete application' }
]

// Custom Spinner Component
const Spinner = ({ size = "w-5 h-5", color = "text-blue-600" }: { size?: string, color?: string }) => (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-current ${size} ${color}`}></div>
)

// Loading component for Suspense fallback
const RegistrationLoading = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
            <Spinner size="w-8 h-8" />
            <p className="mt-4 text-gray-600">Loading registration form...</p>
        </div>
    </div>
)

// Main registration component that uses useSearchParams
const RegistrationForm = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { isMobile } = useMobileDetection()
    const [value, setValue] = React.useState<RegisterForm>(initialValue)
    const [loading, setLoading] = React.useState(false)
    const [msg, setMsg] = React.useState('')
    const [error, setError] = React.useState('')
    const [show, setShow] = React.useState(false)
    const [currentStep, setCurrentStep] = React.useState(1)

    // Pre-fill course information from URL parameters
    useEffect(() => {
        const course = searchParams.get('course')
        const courseType = searchParams.get('courseType')
        
        console.log('URL Parameters - Course:', course);
        console.log('URL Parameters - CourseType:', courseType);
        console.log('All search params:', Object.fromEntries(searchParams.entries()));
        
        if (course || courseType) {
            setValue(prev => ({
                ...prev,
                courseType: courseType || prev.courseType,
                // You can add a custom field for the specific course if needed
            }))
            console.log('Updated form value with course info:', {
                courseType: courseType || 'default'
            });
        }
    }, [searchParams])

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

    const validateCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return value.firstName && value.lastName && value.dateOfBirth
            case 2:
                return value.emailAddress && value.countryCode && value.phone
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
        console.log('handleSubmit called!');
        console.log('Current form values:', value);
        console.log('Is form valid:', validateFields());
        console.log('Missing fields:', getMissingFields());
        
        setLoading(true)
        
        try {
            const emailExists = await checkEmailAlreadyExists(value.emailAddress);
            console.log('Email exists check result:', emailExists);
            
            if (emailExists) {
                setError('Email already exists. Please use a different email address.');
                setLoading(false)
                return;
            }
            
            console.log('Setting show to true - opening payment modal');
            setShow(true)
            setLoading(false)
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            setError('An error occurred. Please try again.');
            setLoading(false)
        }
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
    
    // Debug logging for form state
    console.log('Form state - courseType:', value.courseType);
    console.log('Form state - isDisabled:', isDisabled);
    console.log('Form state - isStepValid:', isStepValid);

    const getApplicationFee = () => {
        if (value.resident === 'Indian Resident') {
            return { amount: 750, currency: 'INR' }
        }
        return { amount: 20, currency: 'USD' }
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={value.firstName}
                                    onChange={(e) => setValue({ ...value, firstName: e.target.value })}
                                    disabled={loading}
                                    placeholder="Enter your first name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Middle Name</label>
                                <input
                                    type="text"
                                    value={value.middleName}
                                    onChange={(e) => setValue({ ...value, middleName: e.target.value })}
                                    disabled={loading}
                                    placeholder="Enter your middle name (optional)"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md"
                                />
                            </div>
                            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={value.lastName}
                                    onChange={(e) => setValue({ ...value, lastName: e.target.value })}
                                    disabled={loading}
                                    placeholder="Enter your last name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Former/Maiden Name</label>
                                <input
                                    type="text"
                                    value={value.formerOrMaidenName}
                                    onChange={(e) => setValue({ ...value, formerOrMaidenName: e.target.value })}
                                    disabled={loading}
                                    placeholder="Enter former/maiden name (if applicable)"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Date of Birth <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={value.dateOfBirth}
                                    onChange={(e) => setValue({ ...value, dateOfBirth: e.target.value })}
                                    disabled={loading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Gender</label>
                                <select
                                    value={value.gender}
                                    onChange={(e) => setValue({ ...value, gender: e.target.value })}
                                    disabled={loading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md"
                                >
                                    <option value="">Select your gender</option>
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
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={value.emailAddress}
                                    onChange={(e) => setValue({ ...value, emailAddress: e.target.value })}
                                    disabled={loading}
                                    placeholder="Enter your email address"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md"
                                />
                                <p className="text-xs text-gray-500">We&apos;ll use this email for all communications regarding your application</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Country Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={value.countryCode}
                                    onChange={(e) => setValue({ ...value, countryCode: e.target.value })}
                                    disabled={loading}
                                    placeholder="e.g., +1, +91"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={value.phone}
                                    onChange={(e) => setValue({ ...value, phone: e.target.value })}
                                    disabled={loading}
                                    placeholder="Enter your phone number"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md"
                                />
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-blue-900">Privacy Notice</h4>
                                    <p className="text-sm text-blue-700 mt-1">
                                        Your email and phone number will be used for communication about your application, 
                                        admission status, and university updates. Information will not be disclosed publicly without consent.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Street Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={value.address}
                                    onChange={(e) => setValue({ ...value, address: e.target.value })}
                                    disabled={loading}
                                    placeholder="Enter your street address"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Street Address 2 (Optional)</label>
                                <input
                                    type="text"
                                    value={value.streetAddress2}
                                    onChange={(e) => setValue({ ...value, streetAddress2: e.target.value })}
                                    disabled={loading}
                                    placeholder="Apartment, suite, etc. (optional)"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    City <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={value.city}
                                    onChange={(e) => setValue({ ...value, city: e.target.value })}
                                    disabled={loading}
                                    placeholder="Enter your city"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    State/Province <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={value.state}
                                    onChange={(e) => setValue({ ...value, state: e.target.value })}
                                    disabled={loading}
                                    placeholder="Enter your state/province"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Country/Region <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={value.countryOrRegion}
                                    onChange={(e) => setValue({ ...value, countryOrRegion: e.target.value })}
                                    disabled={loading}
                                    placeholder="Enter your country"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                ZIP/Postal Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={value.zipOrPostalCode}
                                onChange={(e) => setValue({ ...value, zipOrPostalCode: e.target.value })}
                                disabled={loading}
                                placeholder="Enter your ZIP/postal code"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md"
                            />
                        </div>
                    </div>
                )

            case 4:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Resident Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={value.resident}
                                    onChange={(e) => setValue({ ...value, resident: e.target.value })}
                                    disabled={loading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md"
                                >
                                    <option value="">Select your resident status</option>
                                    <option value="Indian Resident">Indian Resident</option>
                                    <option value="Non-Indian Resident">Non-Indian Resident</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Enrollment Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={value.enrollmentType}
                                    onChange={(e) => setValue({ ...value, enrollmentType: e.target.value })}
                                    disabled={loading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md"
                                >
                                    <option value="">Select enrollment type</option>
                                    <option value="Full Time">Full Time</option>
                                    <option value="Part Time">Part Time</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Course Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={value.courseType}
                                    onChange={(e) => setValue({ ...value, courseType: e.target.value })}
                                    disabled={loading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md"
                                >
                                    <option value="">Select course type</option>
                                    <option value="Certificate">Certificate</option>
                                    <option value="Diploma">Diploma</option>
                                    <option value="Bachelor">Bachelor</option>
                                    <option value="Master">Master</option>
                                    <option value="PhD">PhD</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Expected Graduation Year <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={value.graduationYear}
                                    onChange={(e) => setValue({ ...value, graduationYear: e.target.value })}
                                    disabled={loading}
                                    placeholder="e.g., 2025, 2026"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Present Level of Education</label>
                            <input
                                type="text"
                                value={value.presentLevelOfEducation}
                                onChange={(e) => setValue({ ...value, presentLevelOfEducation: e.target.value })}
                                disabled={loading}
                                placeholder="e.g., High School Graduate, Bachelor's, Master's"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md"
                            />
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <Info className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-green-900">Application Fee</h4>
                                    <p className="text-sm text-green-700 mt-1">
                                        {value.resident === 'Indian Resident' ? (
                                            <>Application fee: <strong>₹750 INR</strong></>
                                        ) : (
                                            <>Application fee: <strong>$20 USD</strong></>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 5:
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                How did you hear about IHU? <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={value.howDidYouHearAboutIHU}
                                onChange={(e) => setValue({ ...value, howDidYouHearAboutIHU: e.target.value })}
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md"
                            >
                                <option value="">Select how you heard about us</option>
                                <option value="Social Media">Social Media</option>
                                <option value="Website">Website</option>
                                <option value="Friend/Family">Friend/Family</option>
                                <option value="Advertisement">Advertisement</option>
                                <option value="Search Engine">Search Engine</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Personal Objectives <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={value.objectives}
                                onChange={(e) => setValue({ ...value, objectives: e.target.value })}
                                disabled={loading}
                                placeholder="Please describe your educational and career objectives..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base resize-none min-h-[120px] bg-white shadow-sm hover:shadow-md"
                            />
                            <p className="text-xs text-gray-500">Tell us about your goals and what you hope to achieve through this program</p>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Digital Signature <span className="text-red-500">*</span>
                            </label>
                            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl mb-3">
                                <p className="text-sm text-yellow-800">
                                    <strong>Legal Declaration:</strong> By typing your full name below, you confirm that:
                                    <br />• All information provided is true and accurate to the best of your knowledge
                                    <br />• You understand that misrepresentation may result in expulsion without refund
                                    <br />• You voluntarily provide your contact information for university communications
                                    <br />• You consent to electronic transactions with the university
                                </p>
                            </div>
                            <input
                                type="text"
                                value={value.signature}
                                onChange={(e) => setValue({ ...value, signature: e.target.value })}
                                disabled={loading}
                                placeholder="Type your full legal name as digital signature"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md"
                            />
                        </div>
                    </div>
                )

            case 6:
                return (
                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Application Summary</h3>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">Please review your information before submitting</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p><strong>Name:</strong> {value.firstName} {value.middleName} {value.lastName}</p>
                                            <p><strong>Date of Birth:</strong> {value.dateOfBirth}</p>
                                            <p><strong>Gender:</strong> {value.gender || 'Not specified'}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p><strong>Email:</strong> {value.emailAddress}</p>
                                            <p><strong>Phone:</strong> {value.countryCode} {value.phone}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p>{value.address}</p>
                                        {value.streetAddress2 && <p>{value.streetAddress2}</p>}
                                        <p>{value.city}, {value.state} {value.zipOrPostalCode}</p>
                                        <p>{value.countryOrRegion}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Academic Information</h4>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p><strong>Resident:</strong> {value.resident}</p>
                                            <p><strong>Enrollment:</strong> {value.enrollmentType}</p>
                                            <p><strong>Course:</strong> {value.courseType}</p>
                                            <p><strong>Graduation Year:</strong> {value.graduationYear}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Application Details</h4>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p><strong>Heard About:</strong> {value.howDidYouHearAboutIHU}</p>
                                            <p><strong>Fee:</strong> {getApplicationFee().currency} {getApplicationFee().amount}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
                            Apply For Admission
                        </h1>
                        <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed text-sm sm:text-base">
                            Thank you for choosing International Hindu University for your learning journey! Complete this application 
                            to begin your educational experience with us. We&apos;ll notify you of the admission decision within two weeks 
                            of receiving your complete application.
                        </p>
                        
                        {/* Mobile Signup Link */}
                        <div className="mt-4 sm:hidden">
                            <Link href="/Mobile-Signup" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
                                <span>📱</span>
                                Use mobile-optimized form
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Banner */}
            {isMobile && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">📱</span>
                                <div>
                                    <h3 className="font-semibold text-blue-900">Mobile User?</h3>
                                    <p className="text-sm text-blue-700">Try our mobile-optimized form for better experience</p>
                                </div>
                            </div>
                            <Link href="/Mobile-Signup">
                                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md">
                                    Switch to Mobile
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                {/* Progress Indicator */}
                <div className="w-full mb-6 sm:mb-8 lg:mb-12">
                    {/* Mobile Progress */}
                    <div className="sm:hidden mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-700">
                                Step {currentStep} of {STEPS.length}
                            </span>
                            <span className="text-sm text-gray-500">
                                {Math.round((currentStep / STEPS.length) * 100)}% Complete
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500 ease-in-out"
                                style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                            />
                        </div>
                        <div className="mt-3 text-center">
                            <h3 className="font-semibold text-gray-900">{STEPS[currentStep - 1].title}</h3>
                            <p className="text-sm text-gray-600">{STEPS[currentStep - 1].description}</p>
                        </div>
                    </div>

                    {/* Desktop Progress */}
                    <div className="hidden sm:block">
                        <div className="flex items-center justify-between mb-4 relative">
                            {STEPS.map((step, index) => {
                                const Icon = step.icon
                                const isActive = currentStep === step.id
                                const isCompleted = currentStep > step.id
                                
                                return (
                                    <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                                            isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' :
                                            isActive ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg' :
                                            'bg-gray-200 text-gray-400'
                                        }`}>
                                            {isCompleted ? <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" /> : <Icon className="h-5 w-5 sm:h-6 sm:w-6" />}
                                        </div>
                                        <div className="text-center">
                                            <div className={`text-xs font-semibold ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                                                {step.title}
                                            </div>
                                            <div className="text-xs text-gray-400 hidden lg:block">{step.description}</div>
                                        </div>
                                    </div>
                                )
                            })}
                            {/* Progress Line */}
                            <div className="absolute top-5 sm:top-6 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                                <div 
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-in-out"
                                    style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Information Banner */}
                {searchParams.get('course') && (
                    <div className="max-w-4xl mx-auto mb-6">
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                                    <GraduationCapIcon className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-orange-900">Course Registration</h3>
                                    <p className="text-sm text-orange-700">
                                        You are registering for: <strong>{searchParams.get('course')}</strong>
                                        {searchParams.get('courseType') && (
                                            <span> ({searchParams.get('courseType')})</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Content */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                        {/* Desktop Header */}
                        <div className="hidden sm:block p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
                                        {(() => {
                                            const Icon = STEPS[currentStep - 1].icon;
                                            return <Icon className="h-6 w-6 text-blue-600" />;
                                        })()}
                                        {STEPS[currentStep - 1].title}
                                    </h2>
                                    <p className="text-sm sm:text-base mt-2 text-gray-600">
                                        {STEPS[currentStep - 1].description}
                                    </p>
                                </div>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold">
                                    Step {currentStep} of {STEPS.length}
                                </span>
                            </div>
                        </div>
                        <div className="p-4 sm:p-6 space-y-6">
                            {renderStepContent()}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                        {currentStep > 1 && (
                            <button
                                onClick={prevStep}
                                className="flex-1 sm:flex-none h-12 sm:h-10 px-6 text-base sm:text-sm border border-gray-300 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Previous
                            </button>
                        )}
                        
                        {currentStep < STEPS.length ? (
                            <button
                                onClick={nextStep}
                                disabled={!isStepValid || loading}
                                className="flex-1 sm:flex-none h-12 sm:h-10 px-6 text-base sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
                            >
                                Next
                                <ArrowRight className="h-4 w-4 ml-2" />
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
                                            <h4 className="font-semibold text-blue-900">Application Fee: ${getApplicationFee().amount} {getApplicationFee().currency}</h4>
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
                                    className="w-full h-12 sm:h-12 px-6 text-base sm:text-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl font-semibold"
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <Spinner />
                                            <span className="ml-2">Processing...</span>
                                        </div>
                                    ) : (
                                        <>
                                            Submit Application & Proceed to Payment
                                            <CreditCard className="h-5 w-5 ml-2" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Error and Message Modals */}
            {msg && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <h3 className="text-lg font-semibold">{msg}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">You will be redirected to the payment page.</p>
                        <button 
                            onClick={() => setMsg('')}
                            className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <h3 className="text-lg font-semibold">Application Error</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{error}</p>
                        <button 
                            onClick={() => setError('')}
                            className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            OK
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
            />
        </div>
    )
}

// Main component that wraps RegistrationForm in Suspense
const Registration = () => {
    return (
        <Suspense fallback={<RegistrationLoading />}>
            <RegistrationForm />
        </Suspense>
    )
}

export default Registration