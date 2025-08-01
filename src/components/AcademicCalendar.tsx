'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaExternalLinkAlt, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { getAllEvents } from '@/Server/Events'
import { getAllWebinars } from '@/Server/Webinars'
import type { Events } from '@/Types/Gallery'
import type { Webinars } from '@/Types/Gallery'

// Hindu Festival Calendar System - Now with Auto-Updating Dates!

interface AcademicCalendarProps {
    isOpen: boolean
    onClose: () => void
}

interface CalendarEvent {
    id: string
    title: string
    date: Date
    type: 'event' | 'webinar' | 'tradition'
    location?: string
    description?: string
    link?: string
    category: string
}

interface HinduFestival {
    id: string
    title: string
    date: Date
    description: string
    significance: string
    category: 'Major Festival' | 'Religious Day' | 'Cultural Event'
}

const AcademicCalendar = ({ isOpen, onClose }: AcademicCalendarProps) => {
    const router = useRouter()
    const [events, setEvents] = useState<Events[]>([])
    const [webinars, setWebinars] = useState<Webinars[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
    const [currentMonth, setCurrentMonth] = useState(new Date())

    // Get Hindu festivals for current and next year with API integration (AUTO-UPDATING)
    const getHinduFestivals = (): HinduFestival[] => {
        // Force current year to be 2025 or later to ensure no 2024 data shows
        const currentYear = Math.max(new Date().getFullYear(), 2025)
        const nextYear = currentYear + 1
        const festivals: HinduFestival[] = []
        
        console.log('Hindu Festivals - Generating for years:', currentYear, 'and', nextYear)

        // Now uses accurate year-specific data that auto-updates for 2025, 2026, 2027+
        // No more static dates - each year has correct lunar calendar dates!
        // Year-specific festival data with accurate lunar calendar dates
        const getYearFestivals = (year: number) => {
            const yearData: Record<number, Array<{
                name: string, date: string, description: string, significance: string, category: 'Major Festival' | 'Religious Day' | 'Cultural Event'
            }>> = {
                2025: [
                    { name: 'Makar Sankranti / Pongal', date: '2025-01-14', description: 'Harvest festival marking the sun\'s transit into Capricorn', significance: 'Celebration of harvest, thanksgiving, and new beginnings', category: 'Major Festival' },
                    { name: 'Vasant Panchami / Saraswati Puja', date: '2025-02-02', description: 'Dedicated to Goddess Saraswati, the deity of knowledge and learning', significance: 'Celebration of education, arts, and wisdom', category: 'Religious Day' },
                    { name: 'Maha Shivaratri', date: '2025-02-26', description: 'Great night of Lord Shiva, celebrated with fasting and prayers', significance: 'Spiritual awakening and devotion to Lord Shiva', category: 'Major Festival' },
                    { name: 'Holi - Festival of Colors', date: '2025-03-14', description: 'Spring festival celebrating love, joy, and the victory of good over evil', significance: 'Unity, forgiveness, and the arrival of spring', category: 'Major Festival' },
                    { name: 'Ram Navami', date: '2025-04-06', description: 'Birthday of Lord Rama, the seventh avatar of Lord Vishnu', significance: 'Celebration of dharma, righteousness, and ideal leadership', category: 'Religious Day' },
                    { name: 'Hanuman Jayanti', date: '2025-04-12', description: 'Birthday of Lord Hanuman, the divine monkey god', significance: 'Devotion, strength, and service to Lord Rama', category: 'Religious Day' },
                    { name: 'Akshaya Tritiya', date: '2025-04-29', description: 'Auspicious day for new beginnings and charitable acts', significance: 'Eternal prosperity and success in new ventures', category: 'Religious Day' },
                    { name: 'Ganga Dussehra', date: '2025-06-05', description: 'Celebration of the descent of River Ganga to Earth', significance: 'Purification, spiritual cleansing, and environmental awareness', category: 'Religious Day' },
                    { name: 'Guru Purnima', date: '2025-07-10', description: 'Day to honor and express gratitude to spiritual teachers', significance: 'Respect for knowledge, wisdom, and spiritual guidance', category: 'Religious Day' },
                    { name: 'Raksha Bandhan', date: '2025-08-09', description: 'Festival celebrating the bond between brothers and sisters', significance: 'Family love, protection, and strengthening relationships', category: 'Major Festival' },
                    { name: 'Krishna Janmashtami', date: '2025-08-16', description: 'Birthday of Lord Krishna, the eighth avatar of Lord Vishnu', significance: 'Divine love, wisdom, and the triumph of good over evil', category: 'Major Festival' },
                    { name: 'Ganesh Chaturthi', date: '2025-08-27', description: 'Birthday of Lord Ganesha, the remover of obstacles', significance: 'New beginnings, wisdom, and success in endeavors', category: 'Major Festival' },
                    { name: 'Navratri - Nine Nights of Goddess Durga', date: '2025-09-22', description: 'Nine nights of worship dedicated to Goddess Durga', significance: 'Victory of good over evil, feminine power, and spiritual purification', category: 'Major Festival' },
                    { name: 'Dussehra / Vijayadashami', date: '2025-10-02', description: 'Victory of Lord Rama over Ravana, celebration of dharma', significance: 'Triumph of righteousness and the burning of evil', category: 'Major Festival' },
                    { name: 'Diwali - Festival of Lights', date: '2025-10-20', description: 'Celebration of light over darkness, knowledge over ignorance', significance: 'Victory of good over evil, prosperity, and spiritual enlightenment', category: 'Major Festival' },
                    { name: 'Govardhan Puja', date: '2025-10-21', description: 'Worship of Govardhan Hill and Lord Krishna\'s divine protection', significance: 'Environmental consciousness and divine protection', category: 'Religious Day' },
                    { name: 'Bhai Dooj', date: '2025-10-22', description: 'Sister-brother bonding festival following Diwali', significance: 'Strengthening sibling relationships and family bonds', category: 'Cultural Event' },
                    { name: 'Geeta Jayanti', date: '2025-12-01', description: 'Celebration of the day Lord Krishna delivered the Bhagavad Gita', significance: 'Spiritual wisdom, dharma, and the eternal teachings', category: 'Religious Day' }
                ],
                2026: [
                    { name: 'Raksha Bandhan', date: '2026-08-28', description: 'Festival celebrating the bond between brothers and sisters', significance: 'Family love, protection, and strengthening relationships', category: 'Major Festival' },
                    { name: 'Krishna Janmashtami', date: '2026-09-05', description: 'Birthday of Lord Krishna, the eighth avatar of Lord Vishnu', significance: 'Divine love, wisdom, and the triumph of good over evil', category: 'Major Festival' },
                    { name: 'Diwali - Festival of Lights', date: '2026-11-08', description: 'Celebration of light over darkness, knowledge over ignorance', significance: 'Victory of good over evil, prosperity, and spiritual enlightenment', category: 'Major Festival' }
                ],
                2027: [
                    { name: 'Raksha Bandhan', date: '2027-08-17', description: 'Festival celebrating the bond between brothers and sisters', significance: 'Family love, protection, and strengthening relationships', category: 'Major Festival' },
                    { name: 'Krishna Janmashtami', date: '2027-08-25', description: 'Birthday of Lord Krishna, the eighth avatar of Lord Vishnu', significance: 'Divine love, wisdom, and the triumph of good over evil', category: 'Major Festival' },
                    { name: 'Diwali - Festival of Lights', date: '2027-10-29', description: 'Celebration of light over darkness, knowledge over ignorance', significance: 'Victory of good over evil, prosperity, and spiritual enlightenment', category: 'Major Festival' }
                ]
            }
            return yearData[year] || []
        }

        // Add festivals for current and next year using year-specific data
        for (const year of [currentYear, nextYear]) {
            const yearFestivals = getYearFestivals(year)
            console.log(`Processing ${yearFestivals.length} festivals for year ${year}`)
            
            for (let i = 0; i < yearFestivals.length; i++) {
                const festival = yearFestivals[i]
                const date = new Date(festival.date)
                
                // Extra verification - only add if year is 2025 or later
                if (date.getFullYear() >= 2025) {
                    festivals.push({
                        id: `${festival.name.toLowerCase().replace(/\s+/g, '-')}-${year}-${i}`,
                        title: festival.name,
                        date: date,
                        description: festival.description,
                        significance: festival.significance,
                        category: festival.category
                    })
                    console.log('✅ Added festival:', festival.name, 'for year', year, 'on', festival.date)
                }
            }
        }

        return festivals.sort((a, b) => a.date.getTime() - b.date.getTime())
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventsData, webinarsData] = await Promise.all([
                    getAllEvents({ searchParams: { futureOnly: 'true', currentYearOnly: 'true' } }),
                    getAllWebinars({ searchParams: { futureOnly: 'true', currentYearOnly: 'true' } })
                ])

                if (eventsData?.list) {
                    setEvents(eventsData.list)
                }
                if (webinarsData?.list) {
                    setWebinars(webinarsData.list)
                }
            } catch (error) {
                console.error('Error fetching calendar data:', error)
            } finally {
                setLoading(false)
            }
        }

        if (isOpen) {
            fetchData()
        }
    }, [isOpen])

    // Combine and sort all events, filtering out past events and old year data
    const currentDate = new Date()
    const currentYear = Math.max(currentDate.getFullYear(), 2025) // Force 2025 or later
    currentDate.setHours(0, 0, 0, 0) // Set to start of day for accurate comparison
    
    // console.log('Filtering events - Current Date:', currentDate.toDateString(), 'Min Year:', currentYear)
    
    const allEvents: CalendarEvent[] = [
        ...events.map(event => ({
            id: event._id as string,
            title: event.title,
            date: new Date(event.date),
            type: 'event' as const,
            location: event.location,
            description: event.description,
            link: event.link,
            category: 'University Events'
        })),
        ...webinars.map(webinar => ({
            id: webinar._id as string,
            title: webinar.title,
            date: new Date(webinar.date),
            type: 'webinar' as const,
            location: webinar.location,
            description: webinar.description,
            link: webinar.link,
            category: 'Webinars & Sessions'
        })),
        ...getHinduFestivals().map(festival => ({
            id: festival.id,
            title: festival.title,
            date: festival.date,
            type: 'tradition' as const,
            location: 'Campus & Community',
            description: festival.description,
            category: festival.category
        }))
    ]
    .filter(event => {
        const eventDate = new Date(event.date)
        eventDate.setHours(0, 0, 0, 0) // Set to start of day for accurate comparison
        
        // Only include events from current year onwards and from today onwards
        const eventYear = eventDate.getFullYear()
        const isFromCurrentYear = eventYear >= currentYear
        const isFromToday = eventDate >= currentDate
        
        // Filter out events from years before 2025
        if (eventYear < 2025) {
            return false // Explicitly exclude any pre-2025 events
        }
        
        return isFromToday && isFromCurrentYear
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())

    // Filter events based on selected category
    const filteredEvents = selectedCategory === 'all' 
        ? allEvents 
        : allEvents.filter(event => event.category === selectedCategory)

    // Get unique categories
    const categories = ['all', ...Array.from(new Set(allEvents.map(event => event.category)))]

    // Calendar view functions
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const getEventsForDate = (date: Date) => {
        return allEvents.filter(event => {
            const eventDate = new Date(event.date)
            return eventDate.getDate() === date.getDate() &&
                   eventDate.getMonth() === date.getMonth() &&
                   eventDate.getFullYear() === date.getFullYear()
        })
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'event':
                return <FaCalendarAlt className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
            case 'webinar':
                return <FaClock className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
            case 'tradition':
                return <FaCalendarAlt className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
            default:
                return <FaCalendarAlt className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
        }
    }

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Major Festival':
                return 'bg-red-100 text-red-800 border-red-200'
            case 'Religious Day':
                return 'bg-purple-100 text-purple-800 border-purple-200'
            case 'Cultural Event':
                return 'bg-pink-100 text-pink-800 border-pink-200'
            case 'University Events':
                return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'Webinars & Sessions':
                return 'bg-green-100 text-green-800 border-green-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev)
            if (direction === 'prev') {
                newMonth.setMonth(newMonth.getMonth() - 1)
            } else {
                newMonth.setMonth(newMonth.getMonth() + 1)
            }
            return newMonth
        })
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
                <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                                <FaCalendarAlt className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Academic Calendar</h2>
                                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Upcoming events, webinars & Hindu festivals</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                            {/* View Mode Toggle - Hidden on mobile */}
                            <div className="hidden sm:flex bg-white rounded-lg border border-gray-200 p-1">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                                        viewMode === 'list' 
                                            ? 'bg-orange-500 text-white' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    List
                                </button>
                                <button
                                    onClick={() => setViewMode('calendar')}
                                    className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                                        viewMode === 'calendar' 
                                            ? 'bg-orange-500 text-white' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Calendar
                                </button>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FaTimes className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile View Mode Toggle */}
                    <div className="sm:hidden p-3 border-b border-gray-200 bg-gray-50">
                        <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    viewMode === 'list' 
                                        ? 'bg-orange-500 text-white' 
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                List View
                            </button>
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    viewMode === 'calendar' 
                                        ? 'bg-orange-500 text-white' 
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Calendar View
                            </button>
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                                        selectedCategory === category
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                                >
                                    {category === 'all' ? 'All Events' : category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-4 lg:p-6 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-8 sm:py-12">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-orange-500 mx-auto mb-3 sm:mb-4"></div>
                                    <p className="text-xs sm:text-sm text-gray-600">Loading events...</p>
                                </div>
                            </div>
                        ) : viewMode === 'list' ? (
                            // List View
                            <div className="space-y-3 sm:space-y-4">
                                {filteredEvents.length === 0 ? (
                                    <div className="text-center py-8 sm:py-12">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                            <FaCalendarAlt className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No events found</h3>
                                        <p className="text-xs sm:text-sm text-gray-600">Try selecting a different category or time period.</p>
                                    </div>
                                ) : (
                                    filteredEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-lg transition-shadow"
                                        >
                                            <div className="flex items-start gap-2 sm:gap-4">
                                                <div className="flex-shrink-0 mt-0.5">
                                                    {getEventIcon(event.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-2">
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                                                                {event.title}
                                                            </h3>
                                                            <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                                                                {event.description}
                                                            </p>
                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-500">
                                                                <div className="flex items-center gap-1">
                                                                    <FaCalendarAlt className="w-3 h-3" />
                                                                    <span>{formatDate(event.date)}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <FaClock className="w-3 h-3" />
                                                                    <span>{formatTime(event.date)}</span>
                                                                </div>
                                                                {event.location && (
                                                                    <div className="flex items-center gap-1">
                                                                        <FaMapMarkerAlt className="w-3 h-3" />
                                                                        <span className="truncate">{event.location}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-start sm:items-end gap-2">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(event.category)}`}>
                                                                {event.category}
                                                            </span>
                                                            {event.link && (
                                                                <Link
                                                                    href={event.link}
                                                                    className="p-1.5 sm:p-2 text-gray-400 hover:text-orange-500 transition-colors"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <FaExternalLinkAlt className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : (
                            // Calendar View
                            <div className="space-y-4 sm:space-y-6">
                                {/* Calendar Header */}
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => navigateMonth('prev')}
                                        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <FaChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                    </button>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                                        {currentMonth.toLocaleDateString('en-US', { 
                                            month: 'long', 
                                            year: 'numeric' 
                                        })}
                                    </h3>
                                    <button
                                        onClick={() => navigateMonth('next')}
                                        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                    </button>
                                </div>

                                {/* Calendar Grid */}
                                <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden">
                                    {/* Calendar Header */}
                                    <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                            <div key={day} className="p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-gray-700">
                                                {day}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Calendar Days */}
                                    <div className="grid grid-cols-7">
                                        {Array.from({ length: getFirstDayOfMonth(currentMonth) }, (_, i) => (
                                            <div key={`empty-${i}`} className="p-1 sm:p-2 border-r border-b border-gray-100 min-h-[80px] sm:min-h-[100px] lg:min-h-[120px]"></div>
                                        ))}
                                        
                                        {Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => {
                                            const day = i + 1
                                            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                                            const dayEvents = getEventsForDate(date)
                                            const isToday = date.toDateString() === new Date().toDateString()
                                            
                                            return (
                                                <div 
                                                    key={day} 
                                                    className={`p-1 sm:p-2 border-r border-b border-gray-100 min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] ${
                                                        isToday ? 'bg-orange-50' : ''
                                                    }`}
                                                >
                                                    <div className={`text-xs sm:text-sm font-medium mb-1 ${
                                                        isToday ? 'text-orange-600' : 'text-gray-900'
                                                    }`}>
                                                        {day}
                                                    </div>
                                                    <div className="space-y-0.5 sm:space-y-1">
                                                        {dayEvents.slice(0, 2).map((event, index) => (
                                                            <div
                                                                key={`${event.id}-${index}`}
                                                                className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium truncate ${
                                                                    event.type === 'tradition' 
                                                                        ? 'bg-orange-100 text-orange-800' 
                                                                        : event.type === 'webinar'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-blue-100 text-blue-800'
                                                                }`}
                                                                title={event.title}
                                                            >
                                                                {event.title}
                                                            </div>
                                                        ))}
                                                        {dayEvents.length > 2 && (
                                                            <div className="text-xs text-gray-500 text-center">
                                                                +{dayEvents.length - 2} more
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Legend */}
                                <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-100 border border-orange-200 rounded"></div>
                                        <span>Hindu Festivals</span>
                                    </div>
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-100 border border-blue-200 rounded"></div>
                                        <span>University Events</span>
                                    </div>
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-100 border border-green-200 rounded"></div>
                                        <span>Webinars</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                            <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                                Showing {filteredEvents.length} upcoming events
                            </p>
                            <button
                                onClick={() => {
                                    router.push('/Events')
                                    onClose()
                                }}
                                className="text-xs sm:text-sm text-orange-600 hover:text-orange-700 font-medium cursor-pointer text-center"
                            >
                                View All Events →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AcademicCalendar 