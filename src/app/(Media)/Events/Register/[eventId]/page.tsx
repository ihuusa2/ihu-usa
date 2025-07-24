'use client'

import Container from '@/components/Container'
import { H1, H2 } from '@/components/Headings'
import { getAllEvents } from '@/Server/Events'
import type { Events } from '@/Types/Gallery'
import React, { useEffect, useState } from 'react'
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle, FaExclamationCircle, FaArrowLeft } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/utils/dateFormatter'
import { useParams } from 'next/navigation'

interface EventRegistration {
    eventId: string
    eventTitle: string
    firstName: string
    lastName: string
    email: string
    phone: string
    organization?: string
    dietaryRestrictions?: string
    specialRequirements?: string
    howDidYouHear?: string
    additionalComments?: string
    registrationDate: Date
}

const initialValue: EventRegistration = {
    eventId: '',
    eventTitle: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    dietaryRestrictions: '',
    specialRequirements: '',
    howDidYouHear: '',
    additionalComments: '',
    registrationDate: new Date()
}

const EventRegistrationPage = () => {
    const params = useParams()
    const eventId = params.eventId as string
    
    const [event, setEvent] = useState<Events | null>(null)
    const [value, setValue] = useState<EventRegistration>(initialValue)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({})

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const eventsData = await getAllEvents({ searchParams: {} }) as { list: Events[], count: number }
                const foundEvent = eventsData.list.find(e => e._id === eventId)
                if (foundEvent) {
                    setEvent(foundEvent)
                    setValue(prev => ({
                        ...prev,
                        eventId: eventId,
                        eventTitle: foundEvent.title
                    }))
                } else {
                    setError('Event not found')
                }
            } catch {
                setError('Failed to load event details')
            }
        }

        if (eventId) {
            fetchEvent()
        }
    }, [eventId])

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const validatePhone = (phone: string) => {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/
        return phoneRegex.test(phone)
    }

    const validateFields = () => {
        const errors: {[key: string]: string} = {}

        if (!value.firstName.trim()) {
            errors.firstName = 'First name is required'
        }

        if (!value.lastName.trim()) {
            errors.lastName = 'Last name is required'
        }

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

        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!validateFields()) {
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/event-registrations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    ...value,
                    registrationDate: new Date().toISOString()
                }),
            })
            
            const result = await response.json()
            
            if (response.ok && result.success) {
                setSuccess(true)
                setValue(initialValue)
            } else {
                setError(result.error || 'Failed to register for event. Please try again.')
            }
        } catch {
            setError('Failed to register for event. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (field: keyof EventRegistration, value: string) => {
        setValue(prev => ({ ...prev, [field]: value }))
        
        // Clear field error when user starts typing
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    if (error && !event) {
        return (
            <Container className='min-h-[60vh] flex items-center justify-center'>
                <div className='text-center space-y-6 max-w-2xl mx-auto'>
                    <div className='w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center'>
                        <FaExclamationCircle className='w-10 h-10 text-red-600' />
                    </div>
                    <H1 className='text-3xl font-bold text-gray-800'>
                        Event Not Found
                    </H1>
                    <p className='text-gray-600 text-lg'>
                        The event you&apos;re looking for doesn&apos;t exist or has been removed.
                    </p>
                    <Link
                        href='/Events'
                        className='inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200'
                    >
                        <FaArrowLeft className='w-4 h-4' />
                        Back to Events
                    </Link>
                </div>
            </Container>
        )
    }

    if (success) {
        return (
            <Container className='min-h-[60vh] flex items-center justify-center'>
                <div className='text-center space-y-6 max-w-2xl mx-auto'>
                    <div className='w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center'>
                        <FaCheckCircle className='w-10 h-10 text-green-600' />
                    </div>
                    <H1 className='text-3xl font-bold text-gray-800'>
                        Registration Successful!
                    </H1>
                    <p className='text-gray-600 text-lg'>
                        Thank you for registering for <span className='font-semibold text-orange-600'>{event?.title}</span>. 
                        We&apos;ve sent a confirmation email to {value.email}.
                    </p>
                    <div className='space-y-3'>
                        <Link
                            href='/Events'
                            className='inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200'
                        >
                            <FaArrowLeft className='w-4 h-4' />
                            Back to Events
                        </Link>
                    </div>
                </div>
            </Container>
        )
    }

    if (!event) {
        return (
            <Container className='min-h-[60vh] flex items-center justify-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500'></div>
            </Container>
        )
    }

    const eventDate = new Date(event.date)
    const isPastEvent = eventDate < new Date()

    return (
        <div className='min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-red-50'>
            <Container className='py-8'>
                {/* Back Button */}
                <div className='mb-8'>
                    <Link
                        href='/Events'
                        className='inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200'
                    >
                        <FaArrowLeft className='w-4 h-4' />
                        Back to Events
                    </Link>
                </div>

                <div className='max-w-4xl mx-auto'>
                    {/* Event Details Header */}
                    <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8'>
                        <div className='md:flex'>
                            {event.image && (
                                <div className='md:w-1/3 relative h-64 md:h-auto'>
                                    <Image
                                        src={event.image as string}
                                        alt={event.title}
                                        fill
                                        className='object-cover'
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                </div>
                            )}
                            <div className='md:w-2/3 p-6 md:p-8'>
                                <div className='flex items-center gap-2 mb-4'>
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                        isPastEvent 
                                            ? 'bg-gray-500 text-white' 
                                            : 'bg-orange-500 text-white'
                                    }`}>
                                        {isPastEvent ? 'Past Event' : 'Upcoming Event'}
                                    </span>
                                </div>
                                
                                <H1 className='text-2xl md:text-3xl font-bold text-gray-900 mb-4'>
                                    {event.title}
                                </H1>
                                
                                <p className='text-gray-600 mb-6 leading-relaxed'>
                                    {event.description}
                                </p>

                                <div className='space-y-3'>
                                    <div className='flex items-center gap-3 text-gray-600'>
                                        <FaCalendarAlt className='w-4 h-4 text-orange-500' />
                                        <span>{formatDate(eventDate)}</span>
                                    </div>
                                    
                                    {event.location && (
                                        <div className='flex items-center gap-3 text-gray-600'>
                                            <FaMapMarkerAlt className='w-4 h-4 text-red-500' />
                                            <span>{event.location}</span>
                                        </div>
                                    )}

                                    {event.attendees && event.attendees.length > 0 && (
                                        <div className='flex items-center gap-3 text-gray-600'>
                                            <FaUser className='w-4 h-4 text-green-500' />
                                            <span>{event.attendees.length} registered attendees</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registration Form */}
                    {isPastEvent ? (
                        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center'>
                            <div className='w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
                                <FaCalendarAlt className='w-8 h-8 text-gray-400' />
                            </div>
                            <H2 className='text-2xl font-bold text-gray-800 mb-4'>
                                Registration Closed
                            </H2>
                            <p className='text-gray-600 mb-6'>
                                This event has already taken place. Registration is no longer available.
                            </p>
                            <Link
                                href='/Events'
                                className='inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200'
                            >
                                View Other Events
                            </Link>
                        </div>
                    ) : (
                        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8'>
                            <div className='text-center mb-8'>
                                <H2 className='text-2xl font-bold text-gray-800 mb-2'>
                                    Register for Event
                                </H2>
                                <p className='text-gray-600'>
                                    Please fill out the form below to register for this event.
                                </p>
                            </div>

                            {error && (
                                <div className='mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className='space-y-6'>
                                {/* Personal Information */}
                                <div className='grid md:grid-cols-2 gap-6'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            <FaUser className='inline mr-2' size={14} />
                                            First Name *
                                        </label>
                                        <input
                                            type='text'
                                            value={value.firstName}
                                            onChange={(e) => handleChange('firstName', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                                                fieldErrors.firstName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                                            }`}
                                            disabled={loading}
                                            placeholder='Enter your first name'
                                        />
                                        {fieldErrors.firstName && (
                                            <p className='text-red-500 text-xs mt-1'>{fieldErrors.firstName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            <FaUser className='inline mr-2' size={14} />
                                            Last Name *
                                        </label>
                                        <input
                                            type='text'
                                            value={value.lastName}
                                            onChange={(e) => handleChange('lastName', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                                                fieldErrors.lastName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                                            }`}
                                            disabled={loading}
                                            placeholder='Enter your last name'
                                        />
                                        {fieldErrors.lastName && (
                                            <p className='text-red-500 text-xs mt-1'>{fieldErrors.lastName}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className='grid md:grid-cols-2 gap-6'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            <FaEnvelope className='inline mr-2' size={14} />
                                            Email Address *
                                        </label>
                                        <input
                                            type='email'
                                            value={value.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                                                fieldErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                                            }`}
                                            disabled={loading}
                                            placeholder='Enter your email address'
                                        />
                                        {fieldErrors.email && (
                                            <p className='text-red-500 text-xs mt-1'>{fieldErrors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            <FaPhone className='inline mr-2' size={14} />
                                            Phone Number *
                                        </label>
                                        <input
                                            type='tel'
                                            value={value.phone}
                                            onChange={(e) => handleChange('phone', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                                                fieldErrors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                                            }`}
                                            disabled={loading}
                                            placeholder='Enter your phone number'
                                        />
                                        {fieldErrors.phone && (
                                            <p className='text-red-500 text-xs mt-1'>{fieldErrors.phone}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div className='grid md:grid-cols-2 gap-6'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Organization/Company
                                        </label>
                                        <input
                                            type='text'
                                            value={value.organization}
                                            onChange={(e) => handleChange('organization', e.target.value)}
                                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200'
                                            disabled={loading}
                                            placeholder='Enter your organization (optional)'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            How did you hear about this event?
                                        </label>
                                        <select
                                            value={value.howDidYouHear}
                                            onChange={(e) => handleChange('howDidYouHear', e.target.value)}
                                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200'
                                            disabled={loading}
                                        >
                                            <option value=''>Select an option</option>
                                            <option value='website'>Website</option>
                                            <option value='social-media'>Social Media</option>
                                            <option value='email'>Email Newsletter</option>
                                            <option value='friend'>Friend/Family</option>
                                            <option value='other'>Other</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Special Requirements */}
                                <div className='grid md:grid-cols-2 gap-6'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Dietary Restrictions
                                        </label>
                                        <input
                                            type='text'
                                            value={value.dietaryRestrictions}
                                            onChange={(e) => handleChange('dietaryRestrictions', e.target.value)}
                                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200'
                                            disabled={loading}
                                            placeholder='Any dietary restrictions? (optional)'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Special Requirements
                                        </label>
                                        <input
                                            type='text'
                                            value={value.specialRequirements}
                                            onChange={(e) => handleChange('specialRequirements', e.target.value)}
                                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200'
                                            disabled={loading}
                                            placeholder='Any special requirements? (optional)'
                                        />
                                    </div>
                                </div>

                                {/* Additional Comments */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Additional Comments
                                    </label>
                                    <textarea
                                        value={value.additionalComments}
                                        onChange={(e) => handleChange('additionalComments', e.target.value)}
                                        rows={4}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200'
                                        disabled={loading}
                                        placeholder='Any additional comments or questions? (optional)'
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className='flex items-center justify-center pt-6'>
                                    <button
                                        type='submit'
                                        disabled={loading}
                                        className='px-8 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2'
                                    >
                                        {loading ? (
                                            <>
                                                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                                                Registering...
                                            </>
                                        ) : (
                                            <>
                                                <FaCheckCircle className='w-5 h-5' />
                                                Register for Event
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default EventRegistrationPage 