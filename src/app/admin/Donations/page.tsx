'use client'

import type { Donation } from "@/Types/Donation";
import { DonationStatus } from "@/Types/Donation";
import React, { useEffect, useState } from 'react'
import { getAllDonateForm, deleteDonation, updateDonationStatus, getDonationStats } from '@/Server/Donate'
import Pagination from '@/components/Pagination'
import { useSearchParams } from 'next/navigation'
import { FaDollarSign, FaHeart, FaGraduationCap, FaBuilding, FaUsers, FaFlask, FaHandHoldingHeart, FaEye, FaTrash, FaSearch, FaFilter, FaChartLine, FaCheckCircle, FaClock, FaTimes, FaEnvelope, FaPhone, FaTimesCircle } from 'react-icons/fa'
import Spinner from '@/components/Spinner'

const AdminDonations = () => {
    const searchParams = useSearchParams()
    const [data, setData] = useState<Donation[]>([])
    const [loading, setLoading] = useState(true)
    const [count, setCount] = useState(0)
    const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterPurpose, setFilterPurpose] = useState('all')
    const [deletingDonation, setDeletingDonation] = useState<string | null>(null)
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
    const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{open: boolean, donationId: string, donorName: string}>({
        open: false,
        donationId: '',
        donorName: ''
    })
    const [stats, setStats] = useState<{
        total: number;
        totalAmount: number;
        completed: number;
        completedAmount: number;
        pending: number;
        pendingAmount: number;
        byPurpose: Array<{ _id: string; count: number; amount: number }>;
    } | null>(null)

    const purposeIcons: {[key: string]: React.ComponentType<{size?: number, className?: string}>} = {
        GENERAL: FaHeart,
        EDUCATION: FaGraduationCap,
        SCHOLARSHIPS: FaUsers,
        INFRASTRUCTURE: FaBuilding,
        RESEARCH: FaFlask,
        COMMUNITY: FaHandHoldingHeart
    }

    useEffect(() => {
        (async () => {
            setLoading(true)
            try {
                const [donationsResult, statsResult] = await Promise.all([
                    getAllDonateForm({ searchParams: Object.fromEntries(searchParams.entries()) }),
                    getDonationStats()
                ])
                
                if (donationsResult) {
                    setData(donationsResult.list)
                    setCount(donationsResult.count)
                }
                
                if (statsResult) {
                    setStats(statsResult)
                }
            } catch (error) {
                console.error('Error loading donations:', error)
            } finally {
                setLoading(false)
            }
        })()
    }, [searchParams])

    const filteredData = data.filter(donation => {
        const matchesSearch = searchTerm === '' || 
            donation.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donation.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (donation.message && donation.message.toLowerCase().includes(searchTerm.toLowerCase()))
        
        const matchesStatus = filterStatus === 'all' || donation.status === filterStatus
        const matchesPurpose = filterPurpose === 'all' || donation.purpose === filterPurpose
        
        return matchesSearch && matchesStatus && matchesPurpose
    })

    const handleViewDonation = (donation: Donation) => {
        setSelectedDonation(donation)
    }

    const handleDeleteClick = (donation: Donation) => {
        setDeleteConfirmDialog({
            open: true,
            donationId: donation._id as string,
            donorName: `${donation.firstName} ${donation.lastName}`
        })
    }

    const handleDeleteConfirm = async () => {
        const donationId = deleteConfirmDialog.donationId
        if (!donationId) return

        setDeletingDonation(donationId)
        
        try {
            const success = await deleteDonation(donationId)
            if (success) {
                setData(prev => prev.filter(d => d._id !== donationId))
                setCount(prev => prev - 1)
                
                if (selectedDonation?._id === donationId) {
                    setSelectedDonation(null)
                }
                
                // Refresh stats
                const updatedStats = await getDonationStats()
                if (updatedStats) setStats(updatedStats)
            } else {
                alert('Failed to delete donation. Please try again.')
            }
        } catch (error) {
            console.error('Delete error:', error)
            alert('An error occurred while deleting the donation.')
        } finally {
            setDeletingDonation(null)
            setDeleteConfirmDialog({ open: false, donationId: '', donorName: '' })
        }
    }

    const handleDeleteCancel = () => {
        setDeleteConfirmDialog({ open: false, donationId: '', donorName: '' })
    }

    const handleStatusUpdate = async (donationId: string, newStatus: string) => {
        setUpdatingStatus(donationId)
        
        try {
            const success = await updateDonationStatus(donationId, newStatus)
            if (success) {
                setData(prev => prev.map(d => 
                    d._id === donationId 
                        ? { ...d, status: newStatus as DonationStatus }
                        : d
                ))
                
                if (selectedDonation?._id === donationId) {
                    setSelectedDonation(prev => prev ? { ...prev, status: newStatus as DonationStatus } : null)
                }
                
                // Refresh stats
                const updatedStats = await getDonationStats()
                if (updatedStats) setStats(updatedStats)
            } else {
                alert('Failed to update status. Please try again.')
            }
        } catch (error) {
            console.error('Status update error:', error)
            alert('An error occurred while updating the status.')
        } finally {
            setUpdatingStatus(null)
        }
    }

    const formatDate = (donation: Donation) => {
        try {
            let dateToFormat: Date | null = null
            
            if (donation.createdAt) {
                dateToFormat = new Date(donation.createdAt)
            } else if (donation._id && typeof donation._id === 'string' && donation._id.length >= 8) {
                const timestamp = parseInt(donation._id.substring(0, 8), 16) * 1000
                dateToFormat = new Date(timestamp)
            }
            
            if (dateToFormat && !isNaN(dateToFormat.getTime())) {
                const now = new Date()
                const diff = now.getTime() - dateToFormat.getTime()
                const days = Math.floor(diff / (1000 * 60 * 60 * 24))
                
                if (days === 0) {
                    const hours = Math.floor(diff / (1000 * 60 * 60))
                    if (hours === 0) {
                        const minutes = Math.floor(diff / (1000 * 60))
                        return minutes <= 1 ? 'Just now' : `${minutes}m ago`
                    }
                    return `${hours}h ago`
                } else if (days === 1) {
                    return 'Yesterday'
                } else if (days < 7) {
                    return `${days}d ago`
                } else {
                    return dateToFormat.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })
                }
            }
            
            return 'Recently'
        } catch (error) {
            console.error('Date formatting error:', error)
            return 'Recently'
        }
    }

    const formatFullDate = (donation: Donation) => {
        try {
            let dateToFormat: Date | null = null
            
            if (donation.createdAt) {
                dateToFormat = new Date(donation.createdAt)
            } else if (donation._id && typeof donation._id === 'string' && donation._id.length >= 8) {
                const timestamp = parseInt(donation._id.substring(0, 8), 16) * 1000
                dateToFormat = new Date(timestamp)
            }
            
            if (dateToFormat && !isNaN(dateToFormat.getTime())) {
                return dateToFormat.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            }
            
            return 'Date unavailable'
        } catch (error) {
            console.error('Full date formatting error:', error)
            return 'Date unavailable'
        }
    }

    const getStatusColor = (status?: string) => {
        switch (status) {
            case DonationStatus.COMPLETED:
                return 'bg-emerald-50 text-emerald-700 border-emerald-200'
            case DonationStatus.PENDING:
                return 'bg-amber-50 text-amber-700 border-amber-200'
            case DonationStatus.FAILED:
                return 'bg-red-50 text-red-700 border-red-200'
            case DonationStatus.REFUNDED:
                return 'bg-slate-50 text-slate-700 border-slate-200'
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200'
        }
    }

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case DonationStatus.COMPLETED:
                return FaCheckCircle
            case DonationStatus.PENDING:
                return FaClock
            case DonationStatus.FAILED:
            case DonationStatus.REFUNDED:
                return FaTimesCircle
            default:
                return FaClock
        }
    }

    const DonationCard = ({ donation }: { donation: Donation }) => {
        const PurposeIcon = purposeIcons[donation.purpose || 'GENERAL'] || FaHeart
        const StatusIcon = getStatusIcon(donation.status)
        const statusColor = getStatusColor(donation.status)
        
        return (
            <div className="group relative bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden">
                {/* Gradient accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500"></div>
                
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                            <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    ${Math.floor(donation.amount)}
                                </div>
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-slate-200 flex items-center justify-center">
                                    <PurposeIcon size={10} className="text-slate-600" />
                                </div>
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-slate-800 text-base truncate">
                                        {donation.firstName} {donation.lastName}
                                    </h3>
                                    {donation.isAnonymous && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                            Anonymous
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-600 flex items-center gap-2 mb-1">
                                    <FaEnvelope size={12} className="text-slate-400 flex-shrink-0" />
                                    <span className="truncate">{donation.email}</span>
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">
                                        {donation.purpose?.replace('_', ' ') || 'General'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${statusColor}`}>
                                <StatusIcon size={12} className="mr-1.5" />
                                {donation.status || 'PENDING'}
                            </span>
                            <span className="text-xs text-slate-500">{formatDate(donation)}</span>
                        </div>
                    </div>
                    
                    {/* Amount and Message */}
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                            <span className="text-sm font-medium text-slate-700">Amount</span>
                            <span className="text-xl font-bold text-emerald-600">
                                ${donation.amount.toFixed(2)} {donation.currency || 'USD'}
                            </span>
                        </div>
                        
                        {donation.message && (
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed">
                                    &ldquo;{donation.message}&rdquo;
                                </p>
                            </div>
                        )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2 justify-end flex-wrap">
                        <button
                            onClick={() => handleViewDonation(donation)}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                            <FaEye size={14} className="mr-2" />
                            View
                        </button>
                        
                        {donation.status === DonationStatus.PENDING && (
                            <button
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-emerald-700 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-50 hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
                                onClick={() => handleStatusUpdate(donation._id as string, DonationStatus.COMPLETED)}
                                disabled={updatingStatus === donation._id}
                            >
                                {updatingStatus === donation._id ? (
                                    <Spinner size="14px" />
                                ) : (
                                    <FaCheckCircle size={14} className="mr-2" />
                                )}
                                Complete
                            </button>
                        )}
                        
                        <button
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation()
                                handleDeleteClick(donation)
                            }}
                            disabled={deletingDonation === donation._id}
                        >
                            {deletingDonation === donation._id ? (
                                <Spinner size="14px" />
                            ) : (
                                <FaTrash size={14} className="mr-2" />
                            )}
                            {deletingDonation === donation._id ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 mb-2">
                                Donations Dashboard
                            </h1>
                            <p className="text-slate-600 text-lg">
                                Manage donations and track fundraising progress
                            </p>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <FaDollarSign size={14} className="mr-2" />
                                ${stats?.totalAmount?.toFixed(2) || '0.00'} Total
                            </div>
                            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                <FaUsers size={14} className="mr-2" />
                                {count} Donations
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="px-4 sm:px-6 lg:px-8 py-8 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-100 rounded-xl">
                                    <FaDollarSign className="text-emerald-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 font-medium">Total Raised</p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        ${stats?.totalAmount?.toFixed(2) || '0.00'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-xl">
                                    <FaUsers className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 font-medium">Total Donors</p>
                                    <p className="text-2xl font-bold text-slate-800">{stats?.total || 0}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-amber-100 rounded-xl">
                                    <FaClock className="text-amber-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 font-medium">Pending</p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        ${stats?.pendingAmount?.toFixed(2) || '0.00'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-100 rounded-xl">
                                    <FaChartLine className="text-purple-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 font-medium">Completed</p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        ${stats?.completedAmount?.toFixed(2) || '0.00'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col gap-8">
                        {/* Search and Filter */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search donations by name, email, or message..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 placeholder-slate-500"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaFilter className="text-slate-400" size={16} />
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-slate-700"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="PENDING">Pending</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="FAILED">Failed</option>
                                        <option value="REFUNDED">Refunded</option>
                                    </select>
                                    <select
                                        value={filterPurpose}
                                        onChange={(e) => setFilterPurpose(e.target.value)}
                                        className="px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-slate-700"
                                    >
                                        <option value="all">All Purposes</option>
                                        <option value="GENERAL">General</option>
                                        <option value="EDUCATION">Education</option>
                                        <option value="SCHOLARSHIPS">Scholarships</option>
                                        <option value="INFRASTRUCTURE">Infrastructure</option>
                                        <option value="RESEARCH">Research</option>
                                        <option value="COMMUNITY">Community</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Donations Grid */}
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="flex flex-col items-center gap-4">
                                    <Spinner size="3rem" />
                                    <p className="text-slate-600">Loading donations...</p>
                                </div>
                            </div>
                        ) : filteredData.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FaDollarSign className="text-slate-400" size={32} />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-700 mb-2">No donations found</h3>
                                <p className="text-slate-500 max-w-md mx-auto">
                                    {searchTerm || filterStatus !== 'all' || filterPurpose !== 'all'
                                        ? 'Try adjusting your search or filter criteria to find more donations.'
                                        : 'No donations have been received yet. They will appear here once donors start contributing.'
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredData.map((donation) => (
                                    <DonationCard key={donation._id as string} donation={donation} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && count > 0 && (
                            <div className="flex justify-center">
                                <Pagination count={count} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Donation Detail Modal */}
            {selectedDonation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                        ${Math.floor(selectedDonation.amount)}
                                    </div>
                                    <div>
                                        <div className="text-xl font-semibold text-slate-800">
                                            {selectedDonation.firstName} {selectedDonation.lastName}
                                            {selectedDonation.isAnonymous && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 ml-3">
                                                    Anonymous
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            {formatFullDate(selectedDonation)}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedDonation(null)}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
                                >
                                    <FaTimes size={24} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-8">
                            {/* Donation Details */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <FaEnvelope className="text-slate-500" size={20} />
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Email</p>
                                            <p className="font-semibold text-slate-800">{selectedDonation.email}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <FaPhone className="text-slate-500" size={20} />
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Phone</p>
                                            <p className="font-semibold text-slate-800">{selectedDonation.phone}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <FaDollarSign className="text-slate-500" size={20} />
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Amount</p>
                                            <p className="font-bold text-2xl text-emerald-600">
                                                ${selectedDonation.amount.toFixed(2)} {selectedDonation.currency || 'USD'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        {(() => {
                                            const PurposeIcon = purposeIcons[selectedDonation.purpose || 'GENERAL'] || FaHeart
                                            return <PurposeIcon className="text-slate-500" size={20} />
                                        })()}
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Purpose</p>
                                            <p className="font-semibold text-slate-800">
                                                {selectedDonation.purpose?.replace('_', ' ') || 'General Support'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Status */}
                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-xl border border-slate-200">
                                <div>
                                    <p className="text-sm font-medium text-slate-700 mb-2">Status</p>
                                    <div>
                                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedDonation.status)}`}>
                                            {(() => {
                                                const StatusIcon = getStatusIcon(selectedDonation.status)
                                                return <StatusIcon size={16} className="mr-2" />
                                            })()}
                                            {selectedDonation.status || 'PENDING'}
                                        </span>
                                    </div>
                                </div>
                                
                                {selectedDonation.status === DonationStatus.PENDING && (
                                    <button
                                        onClick={() => handleStatusUpdate(selectedDonation._id as string, DonationStatus.COMPLETED)}
                                        disabled={updatingStatus === selectedDonation._id}
                                        className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                    >
                                        {updatingStatus === selectedDonation._id ? (
                                            <div className="flex items-center gap-2">
                                                <Spinner size="1rem" />
                                                Updating...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <FaCheckCircle size={16} />
                                                Mark as Completed
                                            </div>
                                        )}
                                    </button>
                                )}
                            </div>
                            
                            {/* Message */}
                            {selectedDonation.message && (
                                <div>
                                    <h4 className="text-sm font-medium text-slate-700 mb-4 uppercase tracking-wide">Donor Message</h4>
                                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-lg">
                                            &ldquo;{selectedDonation.message}&rdquo;
                                        </p>
                                    </div>
                                </div>
                            )}
                            
                            {/* Actions */}
                            <div className="flex gap-4 pt-6 border-t border-slate-200">
                                <button
                                    onClick={() => window.open(`mailto:${selectedDonation.email}?subject=Thank you for your donation to IHU`, '_blank')}
                                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg"
                                >
                                    <FaEnvelope className="mr-2" size={16} />
                                    Send Thank You
                                </button>
                                <button
                                    onClick={() => window.open(`tel:${selectedDonation.phone}`, '_blank')}
                                    className="inline-flex items-center px-6 py-3 text-emerald-700 bg-white border border-emerald-300 rounded-xl hover:bg-emerald-50 hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
                                >
                                    <FaPhone className="mr-2" size={16} />
                                    Call
                                </button>
                                <button
                                    className="inline-flex items-center px-6 py-3 text-red-700 bg-white border border-red-300 rounded-xl hover:bg-red-50 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                                    onClick={() => handleDeleteClick(selectedDonation)}
                                    disabled={deletingDonation === selectedDonation._id}
                                >
                                    {deletingDonation === selectedDonation._id ? (
                                        <div className="mr-2">
                                            <Spinner size="16px" />
                                        </div>
                                    ) : (
                                        <FaTrash className="mr-2" size={16} />
                                    )}
                                    {deletingDonation === selectedDonation._id ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {deleteConfirmDialog.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <FaTrash className="text-red-600" size={24} />
                                </div>
                                <span className="text-xl font-semibold text-slate-800">Delete Donation</span>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <p className="text-slate-700 mb-4 text-lg">
                                Are you sure you want to delete the donation from{' '}
                                <span className="font-semibold">{deleteConfirmDialog.donorName}</span>?
                            </p>
                            <p className="text-sm text-slate-500">
                                This action cannot be undone. The donation record will be permanently removed from the system.
                            </p>
                        </div>
                        
                        <div className="flex gap-3 justify-end p-6 border-t border-slate-200">
                            <button
                                onClick={handleDeleteCancel}
                                disabled={!!deletingDonation}
                                className="inline-flex items-center px-6 py-3 text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={!!deletingDonation}
                                className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                {deletingDonation ? (
                                    <div className="flex items-center gap-2">
                                        <Spinner size="1rem" />
                                        Deleting...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <FaTrash size={16} />
                                        Delete Donation
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminDonations