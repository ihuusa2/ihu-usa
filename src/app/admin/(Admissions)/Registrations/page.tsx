'use client'

import React, { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner'
import { getAllRegistration, getRegistrationStats } from '@/Server/Registration'
import Pagination from '@/components/Pagination'
import { useSearchParams } from 'next/navigation'
import { RegisterForm } from '@/Types/Form'
import Update from './Update'
import Add from './Add'
import { formatDate } from '@/utils/dateFormatter'
import { 
    FaUser, 
    FaUsers, 
    FaUserCheck, 
    FaUserTimes, 
    FaClock, 
    FaSearch, 
    FaPlus, 
    FaEdit, 
    FaClipboardCheck, 
    FaEnvelope, 
    FaGraduationCap,
    FaCalendarAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationTriangle,
    FaBars,
    FaTh,
    FaList,
    FaTimes,
    FaUndo
} from 'react-icons/fa'

const AdminRegistrations = () => {
    const searchParams = useSearchParams()
    const [data, setData] = useState<RegisterForm[]>([])
    const [loading, setLoading] = useState(true)
    const [count, setCount] = useState(0)
    const [activeTab, setActiveTab] = useState(() => {
        const status = searchParams.get('status')
        if (status) {
            return status.toLowerCase()
        }
        return 'all'
    })
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [selectedRegistration, setSelectedRegistration] = useState<RegisterForm | null>(null)
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [stats, setStats] = useState<{
        total: number;
        approved: number;
        pending: number;
        rejected: number;
        completed: number;
        failed: number;
        refunded: number;
        pendingPayment: number;
    } | null>(null)
    const [sortField, setSortField] = useState<'date' | 'name'>('date')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 500) // 500ms delay

        return () => clearTimeout(timer)
    }, [searchTerm])

    const refreshData = () => {
        setRefreshTrigger(prev => prev + 1)
    }

    // Helper function to highlight search terms
    const highlightSearchTerm = (text: string, searchTerm: string) => {
        if (!searchTerm || !text) return text;
        
        const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
    }

    useEffect(() => {
        (async () => {
            setLoading(true)
            try {
                // Create search params with status filter if a specific tab is selected
                const currentSearchParams = Object.fromEntries(searchParams.entries())
                if (activeTab !== 'all') {
                    currentSearchParams.status = activeTab.toUpperCase()
                }
                
                // Add search term to backend query if it exists
                if (debouncedSearchTerm.trim()) {
                    currentSearchParams.search = debouncedSearchTerm.trim()
                }
                
                const [registrations, statsData] = await Promise.all([
                    getAllRegistration({ searchParams: currentSearchParams }),
                    getRegistrationStats()
                ])
                
                if (registrations) {
                    setData(registrations.list)
                    setCount(registrations.count)
                }
                
                if (statsData) {
                    setStats(statsData)
                }
            } catch (error) {
                console.error('Error loading registrations:', error)
            } finally {
                setLoading(false)
            }
        })()
    }, [searchParams, activeTab, refreshTrigger, debouncedSearchTerm])

    // Sort data based on current sort settings
    const sortedData = data.sort((a, b) => {
        let compare = 0
        if (sortField === 'date') {
            compare = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        } else if (sortField === 'name') {
            const nameA = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase()
            const nameB = `${b.firstName || ''} ${b.lastName || ''}`.toLowerCase()
            compare = nameA.localeCompare(nameB)
        }
        return sortOrder === 'asc' ? compare : -compare
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <FaCheckCircle className="mr-1.5 h-3 w-3" />
                        Approved
                    </span>
                )
            case 'PENDING':
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <FaClock className="mr-1.5 h-3 w-3" />
                        Pending
                    </span>
                )
            case 'REJECTED':
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                        <FaTimesCircle className="mr-1.5 h-3 w-3" />
                        Rejected
                    </span>
                )
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                        <FaExclamationTriangle className="mr-1.5 h-3 w-3" />
                        Unknown
                    </span>
                )
        }
    }

    const getPaymentBadge = (paymentStatus: string) => {
        switch (paymentStatus) {
            case 'COMPLETED':
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <FaCheckCircle className="mr-1.5 h-3 w-3" />
                        Completed
                    </span>
                )
            case 'FAILED':
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                        <FaTimesCircle className="mr-1.5 h-3 w-3" />
                        Failed
                    </span>
                )
            case 'REFUNDED':
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                        <FaUndo className="mr-1.5 h-3 w-3" />
                        Refunded
                    </span>
                )
            case 'PENDING':
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
                        <FaClock className="mr-1.5 h-3 w-3" />
                        Pending
                    </span>
                )
        }
    }

    const handleEdit = (registration: RegisterForm) => {
        setSelectedRegistration(registration)
        setShowEditModal(true)
    }

    const handleStatusUpdate = (registration: RegisterForm) => {
        setSelectedRegistration(registration)
        setShowStatusModal(true)
    }

    const handleRowClick = (registration: RegisterForm) => {
        setSelectedRegistration(registration)
        setShowDetailModal(true)
    }



    // Use server stats if available, otherwise fallback to calculated stats
    const displayStats = stats || {
        total: count,
        approved: data.filter(item => item.status === 'APPROVED').length,
        pending: data.filter(item => item.status === 'PENDING').length,
        rejected: data.filter(item => item.status === 'REJECTED').length,
        completed: 0,
        failed: 0,
        refunded: 0,
        pendingPayment: 0
    }

    // Get data based on active tab - now handled server-side
    const getTabData = () => {
        return sortedData
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-2 sm:px-4 md:px-8">
            <div className="py-4 sm:py-6 lg:py-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <FaUsers className="text-white text-lg sm:text-xl" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                    Course Registrations
                                </h1>
                                <p className="text-gray-600 text-sm sm:text-base">Manage student registrations and applications</p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                            <button 
                                onClick={() => setShowAddModal(true)}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
                            >
                                <FaPlus className="h-4 w-4" />
                                <span className="hidden sm:inline">Add Registration</span>
                                <span className="sm:hidden">Add</span>
                            </button>
                        </div>
                    </div>
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-600 font-semibold text-xs sm:text-sm">Total</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-blue-800">{displayStats.total}</p>
                                    <p className="text-xs text-blue-600 mt-1">All applications</p>
                                </div>
                                <div className="p-2 sm:p-3 bg-blue-500 rounded-xl shadow-lg">
                                    <FaUsers className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-600 font-semibold text-xs sm:text-sm">Approved</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-green-800">{displayStats.approved}</p>
                                    <p className="text-xs text-green-600 mt-1">
                                        {displayStats.total > 0 ? Math.round((displayStats.approved / displayStats.total) * 100) : 0}% of total
                                    </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-green-500 rounded-xl shadow-lg">
                                    <FaUserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-yellow-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-600 font-semibold text-xs sm:text-sm">Pending</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-yellow-800">{displayStats.pending}</p>
                                    <p className="text-xs text-yellow-600 mt-1">Awaiting review</p>
                                </div>
                                <div className="p-2 sm:p-3 bg-yellow-500 rounded-xl shadow-lg">
                                    <FaClock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-red-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-red-600 font-semibold text-xs sm:text-sm">Rejected</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-red-800">{displayStats.rejected}</p>
                                    <p className="text-xs text-red-600 mt-1">Not approved</p>
                                </div>
                                <div className="p-2 sm:p-3 bg-red-500 rounded-xl shadow-lg">
                                    <FaUserTimes className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Registration Management Section */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* Section Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-2 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <FaClipboardCheck className="text-white text-sm sm:text-lg" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Registration Management</h2>
                                        <p className="text-gray-600 text-xs sm:text-sm">Comprehensive management system for student registrations</p>
                                    </div>
                                </div>
                                {/* Mobile Menu Button */}
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="lg:hidden inline-flex items-center p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                                    aria-label="Toggle menu"
                                >
                                    <FaBars className="h-5 w-5" />
                                </button>
                            </div>
                            {/* Controls - Desktop */}
                            <div className="hidden lg:flex gap-3 items-center w-full">
                                {/* View Mode Toggle */}
                                <div className="flex items-center bg-white border border-gray-300 rounded-lg p-1 shadow-sm">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                                            viewMode === 'grid'
                                                ? 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                        }`}
                                    >
                                        <FaTh className="h-4 w-4" />
                                        Grid
                                    </button>
                                    <button
                                        onClick={() => setViewMode('table')}
                                        className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                                            viewMode === 'table'
                                                ? 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                        }`}
                                    >
                                        <FaList className="h-4 w-4" />
                                        Table
                                    </button>
                                </div>
                                {/* Sorting Controls */}
                                <div className="flex items-center gap-2">
                                  <select
                                    value={sortField}
                                    onChange={e => setSortField(e.target.value as 'date' | 'name')}
                                    className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                                  >
                                    <option value="date">Sort by Date</option>
                                    <option value="name">Sort by Name</option>
                                  </select>
                                  <button
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                                    title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                                  >
                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                  </button>
                                </div>
                                <div className="relative flex-1 max-w-md">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, or reg number..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                    {searchTerm !== debouncedSearchTerm && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                        </div>
                                    )}
                                    {searchTerm && searchTerm === debouncedSearchTerm && (
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <FaTimes className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            {/* Controls - Mobile */}
                            <div className={`lg:hidden space-y-3 ${isMobileMenuOpen ? 'block' : 'hidden'}`}> 
                                {/* View Mode Toggle */}
                                <div className="flex items-center bg-white border border-gray-300 rounded-lg p-1 shadow-sm">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                            viewMode === 'grid'
                                                ? 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                        }`}
                                    >
                                        <FaTh className="h-4 w-4" />
                                        Grid
                                    </button>
                                    <button
                                        onClick={() => setViewMode('table')}
                                        className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                            viewMode === 'table'
                                                ? 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                        }`}
                                    >
                                        <FaList className="h-4 w-4" />
                                        Table
                                    </button>
                                </div>
                                {/* Sorting Controls */}
                                <div className="flex items-center gap-2">
                                  <select
                                    value={sortField}
                                    onChange={e => setSortField(e.target.value as 'date' | 'name')}
                                    className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                                  >
                                    <option value="date">Sort by Date</option>
                                    <option value="name">Sort by Name</option>
                                  </select>
                                  <button
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                                    title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                                  >
                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                  </button>
                                </div>
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search registrations..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                    {searchTerm !== debouncedSearchTerm && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                        </div>
                                    )}
                                    {searchTerm && searchTerm === debouncedSearchTerm && (
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <FaTimes className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Tabs */}
                    <div className="px-2 sm:px-6 py-2 sm:py-4 bg-gray-50 border-b border-gray-200 overflow-x-auto">
                        <div className="flex flex-nowrap gap-2">
                            <button
                                onClick={() => {
                                    setActiveTab('all')
                                    // Reset to first page when switching tabs
                                    const url = new URL(window.location.href)
                                    url.searchParams.delete('page')
                                    window.history.replaceState({}, '', url.toString())
                                }}
                                className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    activeTab === 'all'
                                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <FaUsers className="h-4 w-4" />
                                <span className="hidden sm:inline">All</span>
                                <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                                    {displayStats.total}
                                </span>
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('approved')
                                    // Reset to first page when switching tabs
                                    const url = new URL(window.location.href)
                                    url.searchParams.delete('page')
                                    window.history.replaceState({}, '', url.toString())
                                }}
                                className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    activeTab === 'approved'
                                        ? 'bg-green-100 text-green-700 border border-green-200'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <FaUserCheck className="h-4 w-4" />
                                <span className="hidden sm:inline">Approved</span>
                                <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                                    {displayStats.approved}
                                </span>
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('pending')
                                    // Reset to first page when switching tabs
                                    const url = new URL(window.location.href)
                                    url.searchParams.delete('page')
                                    window.history.replaceState({}, '', url.toString())
                                }}
                                className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    activeTab === 'pending'
                                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <FaClock className="h-4 w-4" />
                                <span className="hidden sm:inline">Pending</span>
                                <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                                    {displayStats.pending}
                                </span>
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('rejected')
                                    // Reset to first page when switching tabs
                                    const url = new URL(window.location.href)
                                    url.searchParams.delete('page')
                                    window.history.replaceState({}, '', url.toString())
                                }}
                                className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    activeTab === 'rejected'
                                        ? 'bg-red-100 text-red-700 border border-red-200'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <FaUserTimes className="h-4 w-4" />
                                <span className="hidden sm:inline">Rejected</span>
                                <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                                    {displayStats.rejected}
                                </span>
                            </button>
                        </div>
                    </div>
                    {/* Content */}
                    <div className="w-full">
                        {/* Search Results Info */}
                        {debouncedSearchTerm && (
                            <div className="px-2 sm:px-6 py-3 bg-blue-50 border-b border-blue-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FaSearch className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm text-blue-800">
                                            Search results for &quot;{debouncedSearchTerm}&quot;: {count} registration{count !== 1 ? 's' : ''} found
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                                    >
                                        Clear search
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <Spinner />
                            </div>
                        ) : (
                            <>
                                {getTabData().length > 0 ? (
                                    viewMode === 'grid' ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 p-2 sm:p-6">
                                            {getTabData().map((registration, index) => (
                                                <div 
                                                    key={index} 
                                                    onClick={() => handleRowClick(registration)}
                                                    className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer group"
                                                >
                                                    {/* Header with Status */}
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                                                            <FaUser className="text-white text-xs" />
                                                        </div>
                                                        {getStatusBadge(registration.status)}
                                                    </div>

                                                    {/* Name and Email */}
                                                    <div className="mb-3">
                                                        <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                                                            <span dangerouslySetInnerHTML={{
                                                                __html: highlightSearchTerm(
                                                                    `${registration.firstName || ''} ${registration.middleName || ''} ${registration.lastName || ''}`.trim(),
                                                                    debouncedSearchTerm
                                                                )
                                                            }} />
                                                        </h3>
                                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                                            <FaEnvelope className="h-3 w-3" />
                                                            <span className="truncate" dangerouslySetInnerHTML={{
                                                                __html: highlightSearchTerm(registration.emailAddress, debouncedSearchTerm)
                                                            }} />
                                                        </div>
                                                    </div>

                                                    {/* Registration Number */}
                                                    <div className="mb-3">
                                                        <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-center">
                                                            {registration.registrationNumber ? (
                                                                <span dangerouslySetInnerHTML={{
                                                                    __html: highlightSearchTerm(registration.registrationNumber, debouncedSearchTerm)
                                                                }} />
                                                            ) : (
                                                                <span className="text-gray-400">Not assigned</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Course Info */}
                                                    <div className="mb-3">
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                                            <FaGraduationCap className="h-3 w-3" />
                                                            {registration.courseType}
                                                        </span>
                                                    </div>

                                                    {/* Payment Status */}
                                                    <div className="mb-3">
                                                        {getPaymentBadge(registration.paymentStatus)}
                                                    </div>

                                                    {/* Date */}
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <FaCalendarAlt className="h-3 w-3" />
                                                        {formatDate(registration.createdAt)}
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleEdit(registration)
                                                            }}
                                                            className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-200"
                                                        >
                                                            <FaEdit className="h-3 w-3" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleStatusUpdate(registration)
                                                            }}
                                                            className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 text-xs text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors duration-200"
                                                        >
                                                            <FaClipboardCheck className="h-3 w-3" />
                                                            Status
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-[700px] text-xs sm:text-sm">
                                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                                    <tr>
                                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Student</th>
                                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Course</th>
                                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Payment</th>
                                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {getTabData().map((registration, index) => (
                                                        <tr key={index} className="hover:bg-blue-50 transition-colors duration-200 cursor-pointer" onClick={() => handleRowClick(registration)}>
                                                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                                                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            handleEdit(registration)
                                                                        }}
                                                                        className="inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-colors duration-200 border border-blue-200"
                                                                    >
                                                                        <FaEdit className="h-3 w-3" />
                                                                        <span className="hidden sm:inline">Edit</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            handleStatusUpdate(registration)
                                                                        }}
                                                                        className="inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-green-600 hover:text-green-800 hover:bg-green-100 rounded-md transition-colors duration-200 border border-green-200"
                                                                    >
                                                                        <FaClipboardCheck className="h-3 w-3" />
                                                                        <span className="hidden sm:inline">Status</span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                                                {getStatusBadge(registration.status)}
                                                            </td>
                                                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                                                <div className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                                                                    <span dangerouslySetInnerHTML={{
                                                                        __html: highlightSearchTerm(
                                                                            `${registration.firstName || ''} ${registration.middleName || ''} ${registration.lastName || ''}`.trim(),
                                                                            debouncedSearchTerm
                                                                        )
                                                                    }} />
                                                                </div>
                                                            </td>
                                                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                                                <div className="flex items-center gap-2 sm:gap-3">
                                                                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                                                                        <FaUser className="text-white text-xs sm:text-base" />
                                                                    </div>
                                                                    <div className="flex flex-col min-w-0">
                                                                        <span className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                                                                            {`${registration.firstName || ''} ${registration.middleName || ''} ${registration.lastName || ''}`.trim()}
                                                                        </span>
                                                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                                                            <FaEnvelope className="h-3 w-3" />
                                                                            <span className="truncate max-w-[120px] sm:max-w-[200px]" dangerouslySetInnerHTML={{
                                                                                __html: highlightSearchTerm(registration.emailAddress, debouncedSearchTerm)
                                                                            }} />
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 font-mono">
                                                                            {registration.registrationNumber ? (
                                                                                <span dangerouslySetInnerHTML={{
                                                                                    __html: highlightSearchTerm(registration.registrationNumber, debouncedSearchTerm)
                                                                                }} />
                                                                            ) : (
                                                                                'No reg. number'
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                                                <div className="flex flex-col text-xs sm:text-sm space-y-1">
                                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 w-fit">
                                                                        <FaGraduationCap className="h-3 w-3" />
                                                                        {registration.courseType}
                                                                    </span>
                                                                    <span className="text-gray-600 font-medium">{registration.enrollmentType}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                                                {getPaymentBadge(registration.paymentStatus)}
                                                            </td>
                                                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                                    <FaCalendarAlt className="h-3 w-3 text-gray-400" />
                                                                    <span className="font-medium">{formatDate(registration.createdAt)}</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                                        <FaUserTimes className="h-12 w-12 mb-4 text-gray-300" />
                                        <h3 className="text-lg font-semibold mb-2">No registrations found</h3>
                                        <p className="text-sm">No registrations match your current filters.</p>
                                    </div>
                                )}
                                
                                {getTabData().length > 0 && (
                                    <div className="px-2 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
                                        <Pagination count={count} />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl md:max-w-3xl h-[90vh] flex flex-col">
                        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <FaPlus className="text-white text-xs sm:text-sm" />
                                    </div>
                                    <h2 className="text-base sm:text-lg font-bold text-gray-800">Add New Registration</h2>
                                </div>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                                    aria-label="Close add modal"
                                >
                                    <FaTimes className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 sm:p-4">
                            <Add setData={setData} setOpen={setShowAddModal} onSuccess={refreshData} />
                        </div>
                    </div>
                </div>
            )}
            {/* Edit Modal */}
            {showEditModal && selectedRegistration && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl md:max-w-3xl h-[90vh] flex flex-col">
                        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <FaEdit className="text-white text-xs sm:text-sm" />
                                    </div>
                                    <h2 className="text-base sm:text-lg font-bold text-gray-800">Update Registration</h2>
                                </div>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                                    aria-label="Close edit modal"
                                >
                                    <FaTimes className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 sm:p-4">
                            <Add setData={setData} editData={selectedRegistration} setOpen={setShowEditModal} isEdit={true} onSuccess={refreshData} />
                        </div>
                    </div>
                </div>
            )}
            {/* Status Update Modal */}
            {showStatusModal && selectedRegistration && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl md:max-w-3xl h-[95vh] flex flex-col">
                        <div className="flex-shrink-0 px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                                        <FaClipboardCheck className="text-white text-xs sm:text-sm" />
                                    </div>
                                    <h2 className="text-base sm:text-lg font-bold text-gray-800">Update Registration Status</h2>
                                </div>
                                <button
                                    onClick={() => setShowStatusModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                                    aria-label="Close status modal"
                                >
                                    <FaTimes className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 sm:p-4 lg:p-6">
                            <Update data={selectedRegistration} setData={setData} onSuccess={refreshData} />
                        </div>
                    </div>
                </div>
            )}
            {/* Detail Modal */}
            {showDetailModal && selectedRegistration && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl md:max-w-3xl h-[90vh] flex flex-col">
                        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <FaUser className="text-white text-xs sm:text-sm" />
                                    </div>
                                    <h2 className="text-base sm:text-lg font-bold text-gray-800">Registration Details</h2>
                                </div>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                                    aria-label="Close details modal"
                                >
                                    <FaTimes className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 sm:p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Personal Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Personal Information</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Full Name</label>
                                            <p className="text-gray-900">{`${selectedRegistration.firstName || ''} ${selectedRegistration.middleName || ''} ${selectedRegistration.lastName || ''}`.trim()}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Email Address</label>
                                            <p className="text-gray-900">{selectedRegistration.emailAddress}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Phone Number</label>
                                            <p className="text-gray-900">{selectedRegistration.phone}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                                            <p className="text-gray-900">{selectedRegistration.dateOfBirth}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Gender</label>
                                            <p className="text-gray-900">{selectedRegistration.gender}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Address Information</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Address</label>
                                            <p className="text-gray-900">{selectedRegistration.address}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">City</label>
                                            <p className="text-gray-900">{selectedRegistration.city}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">State</label>
                                            <p className="text-gray-900">{selectedRegistration.state}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">ZIP/Postal Code</label>
                                            <p className="text-gray-900">{selectedRegistration.zipOrPostalCode}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Country/Region</label>
                                            <p className="text-gray-900">{selectedRegistration.countryOrRegion}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Course Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Course Information</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Course Type</label>
                                            <p className="text-gray-900">{selectedRegistration.courseType}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Enrollment Type</label>
                                            <p className="text-gray-900">{selectedRegistration.enrollmentType}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Registration Number</label>
                                            <p className="text-gray-900 font-mono">{selectedRegistration.registrationNumber || 'Not assigned'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Status & Payment */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Status & Payment</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Status</label>
                                            <div className="mt-1">{getStatusBadge(selectedRegistration.status)}</div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Payment Status</label>
                                            <div className="mt-1">{getPaymentBadge(selectedRegistration.paymentStatus)}</div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Date Applied</label>
                                            <p className="text-gray-900">{formatDate(selectedRegistration.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        setShowDetailModal(false)
                                        handleEdit(selectedRegistration)
                                    }}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    <FaEdit className="h-4 w-4" />
                                    Edit Registration
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDetailModal(false)
                                        handleStatusUpdate(selectedRegistration)
                                    }}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-200"
                                >
                                    <FaClipboardCheck className="h-4 w-4" />
                                    Update Status
                                </button>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminRegistrations