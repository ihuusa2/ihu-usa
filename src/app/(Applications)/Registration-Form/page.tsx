/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { createRegisterForm } from '@/Server/Registration'
import { getAllCourseTypesForSelect } from '@/Server/CourseType'
import { PaymentStatus, RegisterForm, Status } from '@/Types/Form'
import type { CourseType } from '@/Types/Courses'
import React, { useEffect, Suspense } from 'react'
import { AlertCircle } from 'lucide-react'
import InitiatePayment from './Checkout/InitiatePayment'
import Select from 'react-select';

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

const Spinner = ({ size = "w-5 h-5", color = "text-blue-600" }: { size?: string, color?: string }) => (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-current ${size} ${color}`}></div>
)

const RegistrationLoading = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
            <Spinner size="w-8 h-8" />
            <p className="mt-4 text-gray-600">Loading registration form...</p>
        </div>
    </div>
)

const consentText = `I voluntarily provide my email address and cell phone number for the purpose of email and text correspondence and electronic information transactions with the university, including information about financial aid. Information will not be disclosed publicly without consent. All information provided here is true and accurate to the best of my knowledge and belief. I understand that any misrepresentation here will be ground for my being expelled from the university, without refund of monies paid for tuition or otherwise. (please type your name in the box, as your signature, to confirm)`;

const countryOptions = [
  { value: '+1', label: 'United States (+1)' },
  { value: '+91', label: 'India (+91)' },
  { value: '+44', label: 'United Kingdom (+44)' },
  { value: '+61', label: 'Australia (+61)' },
  { value: '+81', label: 'Japan (+81)' },
  { value: '+971', label: 'United Arab Emirates (+971)' },
  { value: '+49', label: 'Germany (+49)' },
  { value: '+33', label: 'France (+33)' },
  { value: '+86', label: 'China (+86)' },
  { value: '+92', label: 'Pakistan (+92)' },
  { value: '+880', label: 'Bangladesh (+880)' },
  { value: '+94', label: 'Sri Lanka (+94)' },
  { value: '+7', label: 'Russia (+7)' },
  { value: '+234', label: 'Nigeria (+234)' },
  { value: '+27', label: 'South Africa (+27)' },
  { value: '+82', label: 'South Korea (+82)' },
  { value: '+34', label: 'Spain (+34)' },
  { value: '+39', label: 'Italy (+39)' },
  { value: '+62', label: 'Indonesia (+62)' },
  { value: '+63', label: 'Philippines (+63)' },
  { value: '+60', label: 'Malaysia (+60)' },
  { value: '+65', label: 'Singapore (+65)' },
  { value: '+64', label: 'New Zealand (+64)' },
  { value: '+55', label: 'Brazil (+55)' },
  { value: '+52', label: 'Mexico (+52)' },
  { value: '+20', label: 'Egypt (+20)' },
  { value: '+966', label: 'Saudi Arabia (+966)' },
  { value: '+213', label: 'Algeria (+213)' },
  { value: '+212', label: 'Morocco (+212)' },
  { value: '+98', label: 'Iran (+98)' },
  { value: '+90', label: 'Turkey (+90)' },
  { value: '+353', label: 'Ireland (+353)' },
  { value: '+46', label: 'Sweden (+46)' },
  { value: '+47', label: 'Norway (+47)' },
  { value: '+358', label: 'Finland (+358)' },
  { value: '+41', label: 'Switzerland (+41)' },
  { value: '+43', label: 'Austria (+43)' },
  { value: '+48', label: 'Poland (+48)' },
  { value: '+420', label: 'Czech Republic (+420)' },
  { value: '+421', label: 'Slovakia (+421)' },
  { value: '+386', label: 'Slovenia (+386)' },
  { value: '+385', label: 'Croatia (+385)' },
  { value: '+36', label: 'Hungary (+36)' },
  { value: '+380', label: 'Ukraine (+380)' },
  { value: '+375', label: 'Belarus (+375)' },
  { value: '+351', label: 'Portugal (+351)' },
  { value: '+30', label: 'Greece (+30)' },
  { value: '+40', label: 'Romania (+40)' },
  { value: '+372', label: 'Estonia (+372)' },
  { value: '+371', label: 'Latvia (+371)' },
  { value: '+370', label: 'Lithuania (+370)' },
  { value: '+381', label: 'Serbia (+381)' },
  { value: '+382', label: 'Montenegro (+382)' },
  { value: '+383', label: 'Kosovo (+383)' },
  { value: '+389', label: 'North Macedonia (+389)' },
  { value: '+373', label: 'Moldova (+373)' },
  { value: '+995', label: 'Georgia (+995)' },
  { value: '+994', label: 'Azerbaijan (+994)' },
  { value: '+374', label: 'Armenia (+374)' },
  { value: '+972', label: 'Israel (+972)' },
  { value: '+962', label: 'Jordan (+962)' },
  { value: '+961', label: 'Lebanon (+961)' },
  { value: '+963', label: 'Syria (+963)' },
  { value: '+964', label: 'Iraq (+964)' },
  { value: '+965', label: 'Kuwait (+965)' },
  { value: '+968', label: 'Oman (+968)' },
  { value: '+974', label: 'Qatar (+974)' },
  { value: '+973', label: 'Bahrain (+973)' },
  { value: '+970', label: 'Palestine (+970)' },
];

const fieldLabels: Record<string, string> = {
  firstName: "First Name",
  lastName: "Last Name",
  dateOfBirth: "Date of Birth",
  emailAddress: "Email Address",
  phone: "Phone",
  address: "Address",
  city: "City",
  state: "State",
  countryOrRegion: "Country or Region",
  zipOrPostalCode: "Zip or Postal Code",
  resident: "Resident Status",
  courseType: "Course Type",
  graduationYear: "Graduation Year",
  howDidYouHearAboutIHU: "How Did You Hear About IHU",
  objectives: "Objectives",
  signature: "Signature",
};

const RegistrationForm = () => {
    const [value, setValue] = React.useState<RegisterForm>(initialValue)
    const [loading, setLoading] = React.useState(false)
    const [msg, setMsg] = React.useState('')
    const [error, setError] = React.useState('')
    const [show, setShow] = React.useState(false)
    const [registrationId, setRegistrationId] = React.useState<string>('')
    const [courseTypes, setCourseTypes] = React.useState<CourseType[]>([])

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
                return false
            }
        }
        return true
    }

    const getMissingFields = () => {
        const missing = []
        for (const field of requiredFields) {
            if (!value[field]) {
                missing.push(field)
            }
        }
        return missing
    }

    const handleSubmit = async () => {
        setLoading(true)
        setError('')
        setMsg('')
        try {
            const response = await fetch('/api/registrations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...value }),
            })
            const result = await response.json()
            if (response.ok && result.success) {
                setRegistrationId(result.insertedId)
                setShow(true)
            } else {
                setError(result.error || 'Failed to save application. Please try again.')
            }
        } catch (error) {
            setError('An error occurred while saving your application. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="w-full px-4 md:px-12 lg:px-32 pt-8 pb-4">
                <div className="bg-gradient-to-br from-yellow-50 via-white to-orange-50 border border-orange-200 rounded-2xl shadow-lg p-8 mb-8 w-full flex flex-col items-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-3 text-orange-700 flex items-center gap-2">
                        <span role="img" aria-label="Namaste">🙏</span> Namaste!
                    </h1>
                    <p className="text-gray-800 text-base md:text-lg text-center mb-4 max-w-2xl">
                        Thank you for choosing <span className="font-semibold text-orange-700">International Hindu University</span> for your learning journey!
                    </p>
                    <ul className="text-gray-700 text-sm md:text-base text-left mb-4 max-w-2xl space-y-2 list-disc list-inside">
                        <li>Please fill out this application to the best of your ability.</li>
                        <li>Once admission is granted, you may register for desired courses in consultation with your academic advisor at IHU.</li>
                        <li>Details of tuition and other fees are available on our website or can be obtained from the IHU office.</li>
                        <li>Contact us at <a href="mailto:contact@ihu-usa.org" className="text-blue-600 underline font-medium">contact@ihu-usa.org</a></li>
                    </ul>
                    <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
                        <div className="bg-green-100 border border-green-300 rounded-lg px-4 py-2 text-green-800 font-semibold text-sm flex items-center gap-2">
                            <span>One-time non-refundable application fee:</span>
                            <span className="bg-green-200 rounded px-2 py-1">$20</span>
                            {/* <span className="bg-green-200 rounded px-2 py-1">INR 750 (India)</span> */}
                        </div>
                    </div>
                    <ul className="text-gray-700 text-sm md:text-base text-left mb-4 max-w-2xl space-y-2 list-disc list-inside">
                        <li className="flex items-start gap-2"><span className="mt-1">⏱️</span> No need to wait months after applying. We will notify you of the acceptance decision within <span className="font-semibold text-orange-700">two weeks</span> of receiving your application and required material.</li>
                        <li className="flex items-start gap-2"><span className="mt-1">✅</span> After payment of registration fees and submission of your application form, your <span className="font-semibold text-orange-700">IHU ID</span> will be activated.</li>
                    </ul>
                    <p className="text-gray-600 text-xs text-center max-w-xl mt-2">Looking forward to having you become a part of the IHU family!</p>
                </div>
            </div>
            <div className="w-full px-4 md:px-12 lg:px-32 bg-white border border-gray-200 rounded-xl shadow-xl p-8 pb-16">
                <h2 className="text-xl font-semibold text-center mb-4">Apply For Admission</h2>
                <form className="space-y-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Student Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">First Name <span className="text-red-500">*</span></label>
                            <input type="text" value={value.firstName} onChange={e => setValue({ ...value, firstName: e.target.value })} disabled={loading} placeholder="Enter your first name" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Middle Name</label>
                            <input type="text" value={value.middleName} onChange={e => setValue({ ...value, middleName: e.target.value })} disabled={loading} placeholder="Enter your middle name" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Last Name <span className="text-red-500">*</span></label>
                            <input type="text" value={value.lastName} onChange={e => setValue({ ...value, lastName: e.target.value })} disabled={loading} placeholder="Enter your last name" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Former Or Maiden Name</label>
                            <input type="text" value={value.formerOrMaidenName} onChange={e => setValue({ ...value, formerOrMaidenName: e.target.value })} disabled={loading} placeholder="Enter your former or maiden name" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Date Of Birth <span className="text-red-500">*</span></label>
                            <input type="date" value={value.dateOfBirth} onChange={e => setValue({ ...value, dateOfBirth: e.target.value })} disabled={loading} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Gender</label>
                            <select value={value.gender} onChange={e => setValue({ ...value, gender: e.target.value })} disabled={loading} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md">
                                <option value="">Select Your Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Email Address <span className="text-red-500">*</span></label>
                            <input type="email" value={value.emailAddress} onChange={e => setValue({ ...value, emailAddress: e.target.value })} disabled={loading} placeholder="Enter your email address" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Country Code <span className="text-red-500">*</span></label>
                            <Select
                                options={countryOptions}
                                value={countryOptions.find(option => option.value === value.countryCode) || null}
                                onChange={option => setValue({ ...value, countryCode: option ? option.value : '' })}
                                isClearable
                                placeholder="Select Your Country Code"
                                isSearchable
                                classNamePrefix="react-select"
                                className="react-select-container"
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        minHeight: '48px',
                                        borderRadius: '0.75rem',
                                        borderColor: '#d1d5db',
                                        boxShadow: 'none',
                                        fontSize: '1rem',
                                    }),
                                    menu: (base) => ({ ...base, zIndex: 9999 }),
                                }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Phone <span className="text-red-500">*</span></label>
                            <input type="text" value={value.phone} onChange={e => setValue({ ...value, phone: e.target.value })} disabled={loading} placeholder="Enter your phone number" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Address <span className="text-red-500">*</span></label>
                            <input type="text" value={value.address} onChange={e => setValue({ ...value, address: e.target.value })} disabled={loading} placeholder="Enter your address" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Street Address2</label>
                            <input type="text" value={value.streetAddress2} onChange={e => setValue({ ...value, streetAddress2: e.target.value })} disabled={loading} placeholder="Enter your street address (optional)" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">City <span className="text-red-500">*</span></label>
                            <input type="text" value={value.city} onChange={e => setValue({ ...value, city: e.target.value })} disabled={loading} placeholder="Enter your city" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">State <span className="text-red-500">*</span></label>
                            <input type="text" value={value.state} onChange={e => setValue({ ...value, state: e.target.value })} disabled={loading} placeholder="Enter your state" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Country Or Region <span className="text-red-500">*</span></label>
                            <input type="text" value={value.countryOrRegion} onChange={e => setValue({ ...value, countryOrRegion: e.target.value })} disabled={loading} placeholder="Enter your country or region" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Zip Or Postal Code <span className="text-red-500">*</span></label>
                            <input type="text" value={value.zipOrPostalCode} onChange={e => setValue({ ...value, zipOrPostalCode: e.target.value })} disabled={loading} placeholder="Enter your zip or postal code" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Select Resident* <span className="text-red-500">*</span></label>
                            <select value={value.resident} onChange={e => setValue({ ...value, resident: e.target.value })} disabled={loading} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md">
                                <option value="">Choose Option</option>
                                <option value="Indian Resident">Indian Resident</option>
                                <option value="Non-Indian Resident">Non-Indian Resident</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Select Enrollment Type* <span className="text-red-500">*</span></label>
                            <select value={value.enrollmentType} onChange={e => setValue({ ...value, enrollmentType: e.target.value })} disabled={loading} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md">
                                <option value="">Choose Option</option>
                                <option value="Never enrolled in college or University before">Never enrolled in college or University before</option>
                                <option value="Enrolled in college or University but never attended IHU">Enrolled in college or University but never attended IHU</option>
                                <option value="Attended IHU and will continue same degree program">Attended IHU and will continue same degree program</option>
                                <option value="Attended IHU and will not continue in same degree program">Attended IHU and will not continue in same degree program</option>
                                <option value="Currently attending IHU Florida">Currently attending IHU Florida</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Courses you applied for* <span className="text-red-500">*</span></label>
                            <select value={value.courseType} onChange={e => setValue({ ...value, courseType: e.target.value })} disabled={loading} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md">
                                <option value="">Select Course</option>
                                {courseTypes.map((courseType) => (
                                    <option key={courseType._id} value={courseType.title}>{courseType.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Present Level Of Education</label>
                            <input type="text" value={value.presentLevelOfEducation} onChange={e => setValue({ ...value, presentLevelOfEducation: e.target.value })} disabled={loading} placeholder="Enter your present level of education" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Please check what you have received, or expect to receive</label>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" id="diploma" checked={value.recieved.diploma} onChange={() => setValue(prev => ({ ...prev, recieved: { ...prev.recieved, diploma: !prev.recieved.diploma } }))} disabled={loading} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                    <label htmlFor="diploma" className="text-sm text-gray-700">Diploma</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" id="homeSchool" checked={value.recieved.homeSchool} onChange={() => setValue(prev => ({ ...prev, recieved: { ...prev.recieved, homeSchool: !prev.recieved.homeSchool } }))} disabled={loading} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                    <label htmlFor="homeSchool" className="text-sm text-gray-700">Home School</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" id="ged" checked={value.recieved.ged} onChange={() => setValue(prev => ({ ...prev, recieved: { ...prev.recieved, ged: !prev.recieved.ged } }))} disabled={loading} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                    <label htmlFor="ged" className="text-sm text-gray-700">GED</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" id="other" checked={value.recieved.other} onChange={() => setValue(prev => ({ ...prev, recieved: { ...prev.recieved, other: !prev.recieved.other } }))} disabled={loading} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                    <label htmlFor="other" className="text-sm text-gray-700">Other</label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Graduation Year <span className="text-red-500">*</span></label>
                            <input type="number" value={value.graduationYear} onChange={e => setValue({ ...value, graduationYear: e.target.value })} disabled={loading} placeholder="Enter your graduation year" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">How Did You Hear About IHU: <span className="text-red-500">*</span></label>
                            <input type="text" value={value.howDidYouHearAboutIHU} onChange={e => setValue({ ...value, howDidYouHearAboutIHU: e.target.value })} disabled={loading} placeholder="How did you hear about IHU?" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700">Your Objectives For Joining International Hindu University... <span className="text-red-500">*</span></label>
                            <div className="text-xs text-gray-600 mb-2">
                                Your Objectives For Joining International Hindu University Ideals You Cherish, Your Role-models/heroes, Value/principles You Are Trying To Live By Or You Would Like To Develop. We Would Also Appreciate Your Letting Us Know Of The Books, People, Incidents, Etc. That Have Influenced You In A Significant Way:*
                            </div>
                            <textarea value={value.objectives} onChange={e => setValue({ ...value, objectives: e.target.value })} disabled={loading} placeholder="Ideals you cherish, your role-models/heroes, value/principles you are trying to live by or you would like to develop. We would also appreciate your letting us know of the books, people, incidents, etc. that have influenced you in a significant way." className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700">Consent & Declaration <span className="text-red-500">*</span></label>
                            <div className="text-xs text-gray-600 mb-2">
                                I Voluntarily Provide My Email Address And Cell Phone Number For The Purpose Of Email And Text Correspondence And Electronic Information Transactions With The University, Including Information About Financial Aid. Information Will Not Be Disclosed Publicly Without Consent. All Information Provided Here Is True And Accurate To The Best Of My Knowledge And Belief I Understand That Any Misrepresentation Here Will Be Ground For My Being Expelled From The University, Without Refund Of Monies Paid For Tuition Or Otherwise. (please Type Your Name In The Box, As Your Signature, To Confirm)*
                            </div>
                            <input type="text" value={value.signature} onChange={e => setValue({ ...value, signature: e.target.value })} disabled={loading} placeholder="Type your name as signature" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base bg-white shadow-sm hover:shadow-md" />
                        </div>
                    </div>
                    {!validateFields() && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-700">
                            <AlertCircle className="inline-block mr-2 text-amber-600" />
                            <div className="font-semibold mb-1">Please complete all required fields:</div>
                            <ul className="list-disc list-inside ml-6">
                                {getMissingFields().map(field => (
                                    <li key={field}>{fieldLabels[field] || field}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <button type="button" onClick={handleSubmit} disabled={loading || !validateFields()} className="w-full h-12 px-6 text-base bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl font-semibold">
                        {loading ? (
                            <>
                                <Spinner />
                                <span className="ml-2">Processing...</span>
                            </>
                        ) : (
                            <>Submit &amp; Proceed to Payment</>
                        )}
                    </button>
                    {msg && (
                        <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-green-800 text-center mt-2">{msg}</div>
                    )}
                    {error && (
                        <div className="bg-red-100 border border-red-300 rounded-lg p-4 text-red-800 text-center mt-2">{error}</div>
                    )}
                </form>
            </div>
            <InitiatePayment
                registration={value as RegisterForm}
                registrationId={registrationId}
                price={"20"}
                show={show}
                onClose={() => setShow(false)}
            />
        </div>
    )
}

const Registration = () => {
    return (
        <Suspense fallback={<RegistrationLoading />}>
            <RegistrationForm />
        </Suspense>
    )
}

export default Registration