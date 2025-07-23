'use client'

import Container from '@/components/Container'
import { H1 } from '@/components/Headings'
import { getAllEvents } from '@/Server/Events'
import type { Events } from '@/Types/Gallery'
import React, { useEffect, useState } from 'react'
import { FaCalendarAlt, FaUser, FaEnvelope, FaPhone, FaDownload, FaEye, FaTrash, FaSearch } from 'react-icons/fa'
import { formatDate } from '@/utils/dateFormatter'

interface EventRegistration {
    _id: string
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

const EventRegistrationsPage = () => {
    const [events, setEvents] = useState<Events[]>([])
    const [registrations, setRegistrations] = useState<EventRegistration[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedEvent, setSelectedEvent] = useState<string>('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredRegistrations, setFilteredRegistrations] = useState<EventRegistration[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch events
                const eventsData = await getAllEvents({ searchParams: {} }) as { list: Events[], count: number }
                setEvents(eventsData.list)

                // Fetch all registrations
                const response = await fetch('/api/event-registrations')
                if (response.ok) {
                    const data = await response.json()
                    if (data.success) {
                        setRegistrations(data.registrations)
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        let filtered = registrations

        // Filter by event
        if (selectedEvent !== 'all') {
            filtered = filtered.filter(reg => reg.eventId === selectedEvent)
        }

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            filtered = filtered.filter(reg => 
                reg.firstName.toLowerCase().includes(term) ||
                reg.lastName.toLowerCase().includes(term) ||
                reg.email.toLowerCase().includes(term) ||
                reg.eventTitle.toLowerCase().includes(term)
            )
        }

        setFilteredRegistrations(filtered)
    }, [registrations, selectedEvent, searchTerm])

    const exportToCSV = () => {
        const headers = [
            'Event Title',
            'First Name',
            'Last Name',
            'Email',
            'Phone',
            'Organization',
            'Registration Date',
            'How Did You Hear',
            'Dietary Restrictions',
            'Special Requirements',
            'Additional Comments'
        ]

        const csvContent = [
            headers.join(','),
            ...filteredRegistrations.map(reg => [
                `"${reg.eventTitle}"`,
                `"${reg.firstName}"`,
                `"${reg.lastName}"`,
                `"${reg.email}"`,
                `"${reg.phone}"`,
                `"${reg.organization || ''}"`,
                `"${formatDate(new Date(reg.registrationDate))}"`,
                `"${reg.howDidYouHear || ''}"`,
                `"${reg.dietaryRestrictions || ''}"`,
                `"${reg.specialRequirements || ''}"`,
                `"${reg.additionalComments || ''}"`
            ].join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `event-registrations-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
    }

    const deleteRegistration = async (registrationId: string) => {
        if (!confirm('Are you sure you want to delete this registration?')) {
            return
        }

        try {
            const response = await fetch(`/api/event-registrations/${registrationId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setRegistrations(prev => prev.filter(reg => reg._id !== registrationId))
            } else {
                alert('Failed to delete registration')
            }
        } catch (error) {
            console.error('Error deleting registration:', error)
            alert('Failed to delete registration')
        }
    }

    if (loading) {
        return (
            <Container className='min-h-screen flex items-center justify-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500'></div>
            </Container>
        )
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <Container className='py-8'>
                <div className='max-w-7xl mx-auto'>
                    {/* Header */}
                    <div className='mb-8'>
                        <H1 className='text-3xl font-bold text-gray-900 mb-2'>
                            Event Registrations
                        </H1>
                        <p className='text-gray-600'>
                            Manage and view all event registrations
                        </p>
                    </div>

                    {/* Filters and Actions */}
                    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
                        <div className='grid md:grid-cols-3 gap-4 mb-4'>
                            {/* Event Filter */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Filter by Event
                                </label>
                                <select
                                    value={selectedEvent}
                                    onChange={(e) => setSelectedEvent(e.target.value)}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                                >
                                    <option value='all'>All Events</option>
                                    {events.map((event) => (
                                        <option key={event._id} value={event._id as string}>
                                            {event.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Search */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Search
                                </label>
                                <div className='relative'>
                                    <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                                    <input
                                        type='text'
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder='Search by name, email, or event...'
                                        className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                                    />
                                </div>
                            </div>

                            {/* Export Button */}
                            <div className='flex items-end'>
                                <button
                                    onClick={exportToCSV}
                                    disabled={filteredRegistrations.length === 0}
                                    className='w-full px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2'
                                >
                                    <FaDownload className='w-4 h-4' />
                                    Export CSV
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200'>
                            <div className='text-center'>
                                <div className='text-2xl font-bold text-orange-600'>{registrations.length}</div>
                                <div className='text-sm text-gray-600'>Total Registrations</div>
                            </div>
                            <div className='text-center'>
                                <div className='text-2xl font-bold text-blue-600'>{events.length}</div>
                                <div className='text-sm text-gray-600'>Total Events</div>
                            </div>
                            <div className='text-center'>
                                <div className='text-2xl font-bold text-green-600'>{filteredRegistrations.length}</div>
                                <div className='text-sm text-gray-600'>Filtered Results</div>
                            </div>
                            <div className='text-center'>
                                <div className='text-2xl font-bold text-purple-600'>
                                    {registrations.length > 0 ? Math.round((filteredRegistrations.length / registrations.length) * 100) : 0}%
                                </div>
                                <div className='text-sm text-gray-600'>Match Rate</div>
                            </div>
                        </div>
                    </div>

                    {/* Registrations Table */}
                    <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
                        <div className='overflow-x-auto'>
                            <table className='min-w-full divide-y divide-gray-200'>
                                <thead className='bg-gray-50'>
                                    <tr>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            Event
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            Attendee
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            Contact
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            Organization
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            Registration Date
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='bg-white divide-y divide-gray-200'>
                                    {filteredRegistrations.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className='px-6 py-12 text-center text-gray-500'>
                                                <div className='flex flex-col items-center'>
                                                    <FaCalendarAlt className='w-12 h-12 text-gray-300 mb-4' />
                                                    <p className='text-lg font-medium'>No registrations found</p>
                                                    <p className='text-sm'>Try adjusting your filters or search terms</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredRegistrations.map((registration) => (
                                            <tr key={registration._id} className='hover:bg-gray-50'>
                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    <div className='text-sm font-medium text-gray-900'>
                                                        {registration.eventTitle}
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    <div className='flex items-center'>
                                                        <div className='w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3'>
                                                            <FaUser className='w-4 h-4 text-orange-600' />
                                                        </div>
                                                        <div>
                                                            <div className='text-sm font-medium text-gray-900'>
                                                                {registration.firstName} {registration.lastName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    <div className='text-sm text-gray-900'>
                                                        <div className='flex items-center gap-2 mb-1'>
                                                            <FaEnvelope className='w-3 h-3 text-gray-400' />
                                                            {registration.email}
                                                        </div>
                                                        <div className='flex items-center gap-2'>
                                                            <FaPhone className='w-3 h-3 text-gray-400' />
                                                            {registration.phone}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    <div className='text-sm text-gray-900'>
                                                        {registration.organization || '-'}
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    <div className='text-sm text-gray-900'>
                                                        {formatDate(new Date(registration.registrationDate))}
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                                    <div className='flex items-center gap-2'>
                                                        <button
                                                            onClick={() => {
                                                                // View registration details
                                                                alert(`Registration Details:\n\nEvent: ${registration.eventTitle}\nName: ${registration.firstName} ${registration.lastName}\nEmail: ${registration.email}\nPhone: ${registration.phone}\nOrganization: ${registration.organization || 'N/A'}\nHow did you hear: ${registration.howDidYouHear || 'N/A'}\nDietary Restrictions: ${registration.dietaryRestrictions || 'N/A'}\nSpecial Requirements: ${registration.specialRequirements || 'N/A'}\nAdditional Comments: ${registration.additionalComments || 'N/A'}`)
                                                            }}
                                                            className='text-blue-600 hover:text-blue-900'
                                                        >
                                                            <FaEye className='w-4 h-4' />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteRegistration(registration._id)}
                                                            className='text-red-600 hover:text-red-900'
                                                        >
                                                            <FaTrash className='w-4 h-4' />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default EventRegistrationsPage 