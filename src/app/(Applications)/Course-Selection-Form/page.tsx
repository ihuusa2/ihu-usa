/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import InitiatePayment from '@/app/Cart/InitiatePayment'
import Container from '@/components/Container'
import { H1, H4 } from '@/components/Headings'
import Spinner from '@/components/Spinner'
import { getAllCourses } from '@/Server/Course'
import { createMultiCourseRegForm } from '@/Server/CourseRegForm'
import { getAllCourseTypesForSelect } from '@/Server/CourseType'
import { getSubjectByCourseTitle } from '@/Server/Subjects'
import { Cart } from '@/Types/Cart'
import { Course, CourseType, SelectSubject } from '@/Types/Courses'
import { PaymentStatus } from '@/Types/Form'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import ReactSelect, { StylesConfig } from 'react-select'

const initialValue: Cart = {
    userId: '',
    registrationNumber: '',
    course: '',
    program: '',
    subjects: [],
    price: {
        amount: 0,
        type: 'USD'
    },
    createdAt: new Date(),
}

const CourseSelectionForm = () => {
    const { data: session } = useSession()
    const route = useRouter()
    const [value, setValue] = React.useState<Cart>(initialValue)
    const [registrationNumber, setRegistrationNumber] = React.useState('')
    const [selectedValue, setSelectedValue] = React.useState<Cart[]>()
    const [loading, setLoading] = React.useState(false)
    const [msg, setMsg] = React.useState('')
    const [error, setError] = React.useState('')
    const [courseType, setCourseType] = React.useState<CourseType[]>([])
    const [programType, setProgramType] = React.useState<Course[]>([])
    const [subjectType, setSubjectType] = React.useState<SelectSubject[]>([])
    const [showModal, setShowModal] = React.useState(false)
    const [registrationValidation, setRegistrationValidation] = React.useState({
        checking: false,
        exists: false,
        message: '',
        countryOrRegion: null as string | null
    })
    const [validationTimeout, setValidationTimeout] = React.useState<NodeJS.Timeout | null>(null)

    useEffect(() => {
        (async () => {
            await getAllCourseTypesForSelect().then((res) => {
                if (res.length > 0) {
                    setCourseType(res)
                }
            })
        })()
    }, [])

    useEffect(() => {
        if (registrationNumber && registrationNumber.trim() !== '') {
            validateRegistrationNumber(registrationNumber)
        }
        
        // Cleanup timeout on unmount
        return () => {
            if (validationTimeout) {
                clearTimeout(validationTimeout)
            }
        }
    }, [registrationNumber, validationTimeout])

    const requiredFields: Array<keyof Cart> = [
        'course',
        'program',
        'subjects'
    ]

    const validateValueFields = () => {
        const isValid = requiredFields.every(field => {
            if (field === 'subjects') {
                return value[field].length > 0
            }
            return value[field] !== ''
        })

        return isValid
    }

    const validateFields = () => {
        const isValid = selectedValue && selectedValue?.length > 0
        return isValid
    }

    const validateRegistrationNumber = async (regNumber: string) => {
        if (!regNumber || regNumber.trim() === '') {
            setRegistrationValidation({
                checking: false,
                exists: false,
                message: '',
                countryOrRegion: null
            })
            return
        }

        setRegistrationValidation(prev => ({ ...prev, checking: true, message: '', countryOrRegion: null }))

        try {
            const response = await fetch(`/api/check-registration-number?registrationNumber=${encodeURIComponent(regNumber)}`)
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const data = await response.json()

            setRegistrationValidation({
                checking: false,
                exists: data.exists,
                message: data.message,
                countryOrRegion: data.countryOrRegion
            })
        } catch (error) {
            console.error('Error validating registration number:', error)
            setRegistrationValidation({
                checking: false,
                exists: false,
                message: 'Error checking registration number availability',
                countryOrRegion: null
            })
        }
    }

    // Helper function to check if user is from India
    const isUserFromIndia = () => {
        return registrationValidation.countryOrRegion?.toLowerCase().includes('india') || 
               registrationValidation.countryOrRegion?.toLowerCase().includes('indian')
    }

    // Helper function to get price type based on user's country
    const getPriceType = () => {
        return isUserFromIndia() ? 'INR' : 'USD'
    }

    // Helper function to format price display
    const formatPrice = (amount: number, type: string) => {
        const symbol = type === 'INR' ? '₹' : '$'
        return `${symbol} ${amount} ${type}`
    }

    const isDisabled = loading || !validateFields() || registrationNumber === '' || selectedValue?.length === 0 || !registrationValidation.exists

    const customSelectStyles: StylesConfig<{ value: string; label: string }, true> = {
        container: (provided) => ({
            ...provided,
            width: '100%',
        }),
        control: (provided, state) => ({
            ...provided,
            minHeight: '44px',
            border: state.isFocused ? '2px solid #3b82f6' : '1px solid #d1d5db',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
            '&:hover': {
                borderColor: '#9ca3af',
            },
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: '0 12px',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#9ca3af',
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#eff6ff',
            borderRadius: '6px',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: '#1e40af',
            fontSize: '14px',
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: '#6b7280',
            '&:hover': {
                backgroundColor: '#dbeafe',
                color: '#dc2626',
            },
        }),
    }

    return (
        <>
            <Container className='mt-20 mb-10'>
                <title>
                    Course Selection Form - International Hindu University
                </title>
                <H1 className='text-center'>Course Selection Form</H1>

                <div className='mt-20'>
                    <H4 className='mb-5'>Student Information</H4>

                    {msg && (
                        <div className='mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg'>
                            {msg}
                        </div>
                    )}
                    {error && (
                        <div className='mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg'>
                            {error}
                        </div>
                    )}

                    <div className='flex flex-wrap -mx-2 gap-10'>

                        {/* Registration Number */}
                        <div className='w-full px-2 mb-4'>
                            <label className='block text-sm font-medium mb-2 text-gray-700'>
                                Registration Number *
                            </label>
                            <div className='relative'>
                                <input
                                    type='text'
                                    value={registrationNumber}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        setRegistrationNumber(value)
                                        
                                        // Clear previous timeout
                                        if (validationTimeout) {
                                            clearTimeout(validationTimeout)
                                        }
                                        
                                        // Clear validation when user starts typing
                                        if (registrationValidation.message) {
                                            setRegistrationValidation({
                                                checking: false,
                                                exists: false,
                                                message: '',
                                                countryOrRegion: null
                                            })
                                        }
                                        
                                        // Debounced validation after 500ms
                                        if (value.trim() !== '') {
                                            const timeout = setTimeout(() => {
                                                validateRegistrationNumber(value)
                                            }, 500)
                                            setValidationTimeout(timeout)
                                        }
                                    }}
                                    onBlur={(e) => {
                                        validateRegistrationNumber(e.target.value)
                                    }}
                                    disabled={loading}
                                    required
                                    className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                                        registrationValidation.checking 
                                            ? 'border-yellow-300 bg-yellow-50' 
                                            : registrationValidation.exists 
                                                ? 'border-green-300 bg-green-50' 
                                                : registrationValidation.message && !registrationValidation.exists 
                                                    ? 'border-red-300 bg-red-50' 
                                                    : 'border-gray-300'
                                    }`}
                                    placeholder='Enter your registration number'
                                />
                                {registrationValidation.checking && (
                                    <div className='absolute inset-y-0 right-0 flex items-center px-3'>
                                        <Spinner />
                                    </div>
                                )}
                                {!registrationValidation.checking && registrationValidation.exists && (
                                    <div className='absolute inset-y-0 right-0 flex items-center px-3'>
                                        <svg className='w-5 h-5 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                        </svg>
                                    </div>
                                )}
                                {!registrationValidation.checking && registrationValidation.message && !registrationValidation.exists && (
                                    <div className='absolute inset-y-0 right-0 flex items-center px-3'>
                                        <svg className='w-5 h-5 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {registrationValidation.message && (
                                <p className={`mt-2 text-sm ${
                                    registrationValidation.exists ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {registrationValidation.message}
                                </p>
                            )}
                        </div>

                        {/* Form Grid */}
                        <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 w-full'>
                            
                            {/* Course Selection */}
                            <div className='w-full px-2 mb-4'>
                                <label className='block text-sm font-medium mb-2 text-gray-700'>
                                    Select Course *
                                </label>
                                <div className='relative'>
                                    <select
                                        value={value.course}
                                        onChange={async (e) => {
                                            setValue(prev => ({ ...prev, course: e.target.value, subjects: [] }))
                                            if (e.target.value) {
                                                await getAllCourses({
                                                    params: { type: e.target.value }, searchParams: {
                                                        pageSize: '100'
                                                    }
                                                }).then((res) => {
                                                    if (res) {
                                                        setProgramType(res.list)
                                                    }
                                                })
                                            }
                                        }}
                                        disabled={loading}
                                        className='w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white'
                                    >
                                        <option value="">Select Course</option>
                                        {courseType.map((item) => (
                                            <option key={item._id as string} value={item.title}>
                                                {item.title}
                                            </option>
                                        ))}
                                    </select>
                                    <div className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none'>
                                        <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Program Selection */}
                            <div className='w-full px-2 mb-4'>
                                <label className='block text-sm font-medium mb-2 text-gray-700'>
                                    Select Program *
                                </label>
                                <div className='relative'>
                                    <select
                                        value={value.program}
                                        onChange={async (e) => {
                                            setValue({ ...value, program: e.target.value, subjects: [] })
                                            if (e.target.value) {
                                                await getSubjectByCourseTitle(e.target.value, registrationValidation.countryOrRegion || undefined).then((res) => {
                                                    if (res) {
                                                        setSubjectType(res)
                                                    }
                                                })
                                            }
                                        }}
                                        disabled={loading}
                                        className='w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white'
                                    >
                                        <option value="">Select Program</option>
                                        {programType.map((item) => (
                                            <option key={item._id as string} value={item.title}>
                                                {item.title}
                                            </option>
                                        ))}
                                    </select>
                                    <div className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none'>
                                        <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Subject Selection */}
                            <div className='w-full px-2 mb-4'>
                                <label className='block text-sm font-medium mb-2 text-gray-700'>
                                    Select Subjects *
                                </label>
                                <ReactSelect
                                    options={subjectType.map(subject => ({ value: subject.title, label: subject.title }))}
                                    isSearchable
                                    isMulti
                                    value={value.subjects.map(subject => ({ value: subject, label: subject }))}
                                    onChange={(selectedOptions) => {
                                        const selectedValues = selectedOptions.map(option => option.value)
                                        const priceType = getPriceType()
                                        const selectedPrice = subjectType.reduce((total, subject) => {
                                            const matchedSubject = selectedValues.find(item => item === subject.title)
                                            return matchedSubject
                                                ? total + (subject.price.amount || 0)
                                                : total
                                        }, 0)

                                        setValue({
                                            ...value, subjects: selectedValues,
                                            price: { amount: selectedPrice, type: priceType }
                                        })
                                    }}
                                    styles={customSelectStyles}
                                    placeholder="Select subjects..."
                                />
                            </div>
                        </div>

                        {/* Add Course Button */}
                        <button
                            disabled={loading || !validateValueFields()}
                            type='button'
                            onClick={() => {
                                if (selectedValue?.find(i => i.course == value.course && i.program == value.program && value.subjects.some(subject => i.subjects.includes(subject)))) {
                                    setError('Already Added')
                                    return
                                }

                                setValue(initialValue)
                                setError('')
                                setSelectedValue(prev =>
                                    prev
                                        ? prev.some(item => item.course === value.course && item.program === value.program)
                                            ? prev.map(item => {
                                                if (item.course === value.course && item.program === value.program) {

                                                    const mergedSubjects = Array.from(new Set([...item.subjects, ...value.subjects]));

                                                    const newSubjects = value.subjects.filter(subject => !item.subjects.includes(subject));

                                                    const additionalAmount = subjectType
                                                        .filter(subject => newSubjects.includes(subject.title))
                                                        .reduce((sum, subject) => sum + (subject.price.amount || 0), 0);
                                                    return {
                                                        ...item,
                                                        subjects: mergedSubjects,
                                                        price: {
                                                            ...item.price,
                                                            amount: item.price.amount + additionalAmount
                                                        },
                                                        createdAt: new Date()
                                                    };
                                                }
                                                return item;
                                            })
                                            : [...prev, { ...value, createdAt: new Date() }]
                                        : [{ ...value, createdAt: new Date() }]
                                )
                            }}
                            className='px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                        >
                            Add this course
                        </button>
                    </div>

                    {/* Selected Courses Table */}
                    <div className='mt-10 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
                        <div className='text-lg font-semibold w-full p-6 bg-gray-50 border-b border-gray-200'>
                            Selected Courses
                        </div>
                        <div className='p-6'>
                            {selectedValue && selectedValue.length > 0 ? (
                                <div className='overflow-x-auto'>
                                    <table className='w-full'>
                                        <thead>
                                            <tr className='border-b border-gray-200'>
                                                <th className='text-left py-3 px-4 font-medium text-gray-700'>Course</th>
                                                <th className='text-left py-3 px-4 font-medium text-gray-700'>Program</th>
                                                <th className='text-left py-3 px-4 font-medium text-gray-700'>Price</th>
                                                <th className='text-left py-3 px-4 font-medium text-gray-700'>Subjects</th>
                                                <th className='text-left py-3 px-4 font-medium text-gray-700'>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedValue.map((item, index) => (
                                                <tr key={index} className='border-b border-gray-100 hover:bg-gray-50'>
                                                    <td className='py-3 px-4 text-gray-900'>{item.course}</td>
                                                    <td className='py-3 px-4 text-gray-900'>{item.program}</td>
                                                    <td className='py-3 px-4 text-gray-900'>
                                                        {formatPrice(item.price.amount, item.price.type)}
                                                    </td>
                                                    <td className='py-3 px-4'>
                                                        <div className='flex flex-wrap gap-1'>
                                                            {item.subjects.map((subject, idx) => (
                                                                <span key={idx} className='inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full'>
                                                                    {subject}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className='py-3 px-4'>
                                                        <button
                                                            onClick={() => {
                                                                const newSelectedValue = selectedValue?.filter((_, idx) => idx !== index)
                                                                setSelectedValue(newSelectedValue)
                                                            }}
                                                            className='px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors duration-200'
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className='text-center py-12 text-gray-500'>
                                    No courses selected yet. Add a course to get started.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Total Amount */}
                    <div className="flex items-center justify-between mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
                        <div className="text-2xl font-bold text-blue-600">
                            {isUserFromIndia() ? '₹' : '$'} {selectedValue && selectedValue.length > 0 ? selectedValue.reduce((total, item) => total + item.price.amount, 0) : 0}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button 
                    disabled={isDisabled}
                    onClick={() => setShowModal(true)}
                    className='w-full md:w-auto px-8 py-4 bg-green-600 text-white font-semibold text-lg rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mt-10'
                >
                    {loading ? <Spinner /> : 'Proceed to Payment'}
                </button>
                
                {!registrationValidation.exists && registrationNumber && (
                    <div className='mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg'>
                        <p className='font-medium'>Invalid Registration Number</p>
                        <p className='text-sm mt-1'>Please register first before selecting courses. You can register <a href='/Registration-Form' className='underline hover:text-red-800'>here</a>.</p>
                    </div>
                )}
            </Container>

            {/* Custom Modal */}
            {showModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto'>
                        <div className='sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between'>
                            <h2 className='text-xl font-semibold text-gray-900'>Selected Courses</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className='p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200'
                            >
                                <svg className='w-6 h-6 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                </svg>
                            </button>
                        </div>
                        
                        <div className='p-6'>
                            {selectedValue && selectedValue.length > 0 ? (
                                <div className='overflow-x-auto mb-6'>
                                    <table className='w-full'>
                                        <thead>
                                            <tr className='border-b border-gray-200'>
                                                <th className='text-left py-3 px-4 font-medium text-gray-700'>Course</th>
                                                <th className='text-left py-3 px-4 font-medium text-gray-700'>Program</th>
                                                <th className='text-left py-3 px-4 font-medium text-gray-700'>Price</th>
                                                <th className='text-left py-3 px-4 font-medium text-gray-700'>Subjects</th>
                                                <th className='text-left py-3 px-4 font-medium text-gray-700'>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedValue.map((item, index) => (
                                                <tr key={index} className='border-b border-gray-100 hover:bg-gray-50'>
                                                    <td className='py-3 px-4 text-gray-900'>{item.course}</td>
                                                    <td className='py-3 px-4 text-gray-900'>{item.program}</td>
                                                    <td className='py-3 px-4 text-gray-900'>
                                                        {formatPrice(item.price.amount, item.price.type)}
                                                    </td>
                                                    <td className='py-3 px-4'>
                                                        <div className='flex flex-wrap gap-1'>
                                                            {item.subjects.map((subject, idx) => (
                                                                <span key={idx} className='inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full'>
                                                                    {subject}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className='py-3 px-4'>
                                                        <button
                                                            onClick={() => {
                                                                const newSelectedValue = selectedValue?.filter((_, idx) => idx !== index)
                                                                setSelectedValue(newSelectedValue)
                                                            }}
                                                            className='px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors duration-200'
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className='text-center py-12 text-gray-500'>
                                    No courses selected.
                                </div>
                            )}
                            
                            <InitiatePayment cart={selectedValue?.map((item) => ({
                                ...item,
                                registrationNumber: registrationNumber,
                                userId: session?.user.id as string,
                            })) || []} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default CourseSelectionForm