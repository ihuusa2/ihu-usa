'use client'

import type { Volunteer } from "@/Types/Form";
import { VolunteerStatus, VolunteerArea } from "@/Types/Form";
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getAllVolunteerForm, updateVolunteerStatus, getVolunteerStats } from '@/Server/Volunteer'
import { FaUser, FaUsers, FaEnvelope, FaPhone, FaEye, FaCheck, FaSearch, FaFilter, FaClock, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaTimes, FaMapMarkerAlt, FaStar, FaHeart, FaSpinner } from 'react-icons/fa';

const AdminVolunteers = () => {
    const searchParams = useSearchParams()
    const [data, setData] = useState<Volunteer[]>([])
    const [loading, setLoading] = useState(true)
    const [count, setCount] = useState(0)
    const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterArea, setFilterArea] = useState('all')
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
    const [stats, setStats] = useState<{
        total: number;
        pending: number;
        approved: number;
        active: number;
        rejected: number;
        byArea: Array<{ _id: string; count: number }>;
        recentApplications: number;
    } | null>(null)

    useEffect(() => {
        (async () => {
            setLoading(true)
            try {
                const [volunteersResult, statsResult] = await Promise.all([
                    getAllVolunteerForm({ searchParams: Object.fromEntries(searchParams.entries()) }),
                    getVolunteerStats()
                ])
                
                if (volunteersResult) {
                    setData(volunteersResult.list)
                    setCount(volunteersResult.count)
                }
                
                if (statsResult) {
                    setStats(statsResult)
                }
            } catch (error) {
                console.error('Error loading volunteers:', error)
            } finally {
                setLoading(false)
            }
        })()
    }, [searchParams])

    const filteredData = data.filter(volunteer => {
        const matchesSearch = searchTerm === '' || 
            volunteer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            volunteer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            volunteer.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
            volunteer.value.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesStatus = filterStatus === 'all' || volunteer.status === filterStatus
        const matchesArea = filterArea === 'all' || volunteer.areas?.includes(filterArea as VolunteerArea)
        
        return matchesSearch && matchesStatus && matchesArea
    })

    const handleStatusUpdate = async (volunteerId: string, newStatus: string) => {
        setUpdatingStatus(volunteerId)
        
        try {
            const success = await updateVolunteerStatus(volunteerId, newStatus)
            if (success) {
                setData(prev => prev.map(v => 
                    v._id === volunteerId 
                        ? { ...v, status: newStatus as VolunteerStatus }
                        : v
                ))
                
                if (selectedVolunteer?._id === volunteerId) {
                    setSelectedVolunteer(prev => prev ? { ...prev, status: newStatus as VolunteerStatus } : null)
                }
                
                // Refresh stats
                const updatedStats = await getVolunteerStats()
                if (updatedStats) setStats(updatedStats)
            }
        } catch (error) {
            console.error('Status update error:', error)
        } finally {
            setUpdatingStatus(null)
        }
    }

    const getStatusColor = (status?: string) => {
        switch (status) {
            case VolunteerStatus.APPROVED:
            case VolunteerStatus.ACTIVE:
                return 'bg-emerald-50 text-emerald-700 border-emerald-200'
            case VolunteerStatus.PENDING:
                return 'bg-amber-50 text-amber-700 border-amber-200'
            case VolunteerStatus.REJECTED:
            case VolunteerStatus.INACTIVE:
                return 'bg-red-50 text-red-700 border-red-200'
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200'
        }
    }

    const formatDate = (volunteer: Volunteer) => {
        try {
            let dateToFormat: Date | null = null
            
            if (volunteer.createdAt) {
                dateToFormat = new Date(volunteer.createdAt)
            } else if (volunteer._id && typeof volunteer._id === 'string' && volunteer._id.length >= 8) {
                const timestamp = parseInt(volunteer._id.substring(0, 8), 16) * 1000
                dateToFormat = new Date(timestamp)
            }
            
            if (dateToFormat && !isNaN(dateToFormat.getTime())) {
                const now = new Date()
                const diff = now.getTime() - dateToFormat.getTime()
                const days = Math.floor(diff / (1000 * 60 * 60 * 24))
                
                if (days === 0) {
                    const hours = Math.floor(diff / (1000 * 60 * 60))
                    return hours <= 1 ? 'Just now' : `${hours}h ago`
                } else if (days === 1) {
                    return 'Yesterday'
                } else if (days < 7) {
                    return `${days}d ago`
                } else {
                    return dateToFormat.toLocaleDateString()
                }
            }
            
            return 'Recently'
        } catch {
            return 'Recently'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                Volunteers Dashboard
                            </h1>
                            <p className="text-gray-600 mt-2 text-sm sm:text-base">
                                Manage volunteer applications and track community engagement
                            </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                {stats?.total || 0} Total
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                                {stats?.approved || 0} Approved
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                {stats?.pending || 0} Pending
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="px-4 sm:px-6 lg:px-8 py-6 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl p-4 border border-purple-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-200 rounded-lg">
                                    <FaUsers className="text-purple-700" size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-medium">Total Volunteers</p>
                                    <p className="text-xl font-bold text-gray-900">{stats?.total || 0}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl p-4 border border-emerald-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-200 rounded-lg">
                                    <FaCheckCircle className="text-emerald-700" size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-medium">Approved</p>
                                    <p className="text-xl font-bold text-gray-900">{stats?.approved || 0}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-xl p-4 border border-amber-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-200 rounded-lg">
                                    <FaClock className="text-amber-700" size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-medium">Pending Review</p>
                                    <p className="text-xl font-bold text-gray-900">{stats?.pending || 0}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-blue-50 to-sky-100 rounded-xl p-4 border border-blue-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-200 rounded-lg">
                                    <FaCalendarAlt className="text-blue-700" size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-medium">Recent (30d)</p>
                                    <p className="text-xl font-bold text-gray-900">{stats?.recentApplications || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-7xl mx-auto flex flex-col gap-6">
                    {/* Search and Filter */}
                    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1 relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search volunteers by name, email, or skills..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <FaFilter className="text-gray-400" size={16} />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-3 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                                >
                                    <option value="all">All Status</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="APPROVED">Approved</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>
                                <select
                                    value={filterArea}
                                    onChange={(e) => setFilterArea(e.target.value)}
                                    className="px-3 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                                >
                                    <option value="all">All Areas</option>
                                    <option value="EDUCATION">Education</option>
                                    <option value="TECHNOLOGY">Technology</option>
                                    <option value="EVENTS">Events</option>
                                    <option value="MARKETING">Marketing</option>
                                    <option value="RESEARCH">Research</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Volunteers Grid */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="flex items-center gap-3">
                                <FaSpinner className="animate-spin text-blue-600" size={32} />
                                <span className="text-gray-600 font-medium">Loading volunteers...</span>
                            </div>
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaUsers className="text-gray-400" size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">No volunteers found</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                {searchTerm || filterStatus !== 'all' || filterArea !== 'all'
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'No volunteer applications received yet'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                            {filteredData.map((volunteer) => (
                                <div key={volunteer._id as string} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                                    {/* Header */}
                                    <div className="p-4 sm:p-6 border-b border-gray-100">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                                    {volunteer.firstName[0]}{volunteer.lastName[0]}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                                                        <FaUser size={12} className="text-gray-500" />
                                                        <span className="truncate">{volunteer.firstName} {volunteer.lastName}</span>
                                                    </h3>
                                                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                                        <FaEnvelope size={10} className="text-gray-400" />
                                                        <span className="truncate">{volunteer.email}</span>
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-2">
                                                        <FaMapMarkerAlt size={10} className="text-gray-400" />
                                                        <span className="text-xs text-gray-500">
                                                            {volunteer.areas?.slice(0, 2).join(', ')}
                                                            {volunteer.areas && volunteer.areas.length > 2 && ' +more'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 flex flex-col items-end gap-2">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(volunteer.status)}`}>
                                                    {volunteer.status || 'PENDING'}
                                                </span>
                                                <span className="hidden sm:inline text-xs">{formatDate(volunteer)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="p-4 sm:p-6">
                                        <div className="space-y-3 mb-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium text-gray-700">Hours/Week:</span>
                                                <span className="text-gray-600">{volunteer.hoursPerWeek || 'Not specified'}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium text-gray-700">Skills:</span>
                                                <span className="text-right text-gray-600 max-w-[60%]">
                                                    {volunteer.skills?.slice(0, 2).join(', ') || 'None listed'}
                                                    {volunteer.skills && volunteer.skills.length > 2 && '...'}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2 justify-end flex-wrap">
                                            <button
                                                onClick={() => setSelectedVolunteer(volunteer)}
                                                className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                            >
                                                <FaEye size={12} className="mr-1" />
                                                View
                                            </button>
                                            
                                            {volunteer.status === VolunteerStatus.PENDING && (
                                                <button
                                                    onClick={() => handleStatusUpdate(volunteer._id as string, VolunteerStatus.APPROVED)}
                                                    disabled={updatingStatus === volunteer._id}
                                                    className="inline-flex items-center px-3 py-2 text-xs font-medium text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-lg hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 disabled:opacity-50"
                                                >
                                                    {updatingStatus === volunteer._id ? (
                                                        <FaSpinner className="animate-spin mr-1" size={12} />
                                                    ) : (
                                                        <FaCheck size={12} className="mr-1" />
                                                    )}
                                                    Approve
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && count > 0 && (
                        <div className="flex justify-center items-center py-6">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Showing {filteredData.length} of {count} volunteers</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Volunteer Detail Modal */}
            {selectedVolunteer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                                        {selectedVolunteer.firstName[0]}{selectedVolunteer.lastName[0]}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {selectedVolunteer.firstName} {selectedVolunteer.lastName}
                                        </h2>
                                        <p className="text-sm text-gray-500">Volunteer Application Details</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedVolunteer(null)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>
                        </div>
                        
                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Contact & Basic Info */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                        <FaEnvelope className="text-gray-500" size={16} />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-medium">Email</p>
                                            <p className="font-medium text-gray-900">{selectedVolunteer.email}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                        <FaPhone className="text-gray-500" size={16} />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-medium">Phone</p>
                                            <p className="font-medium text-gray-900">{selectedVolunteer.phone}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                        <FaClock className="text-gray-500" size={16} />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-medium">Hours/Week</p>
                                            <p className="font-medium text-gray-900">{selectedVolunteer.hoursPerWeek || 'Not specified'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500 uppercase font-medium mb-2">Status</p>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedVolunteer.status)}`}>
                                            {selectedVolunteer.status || 'PENDING'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Areas & Skills */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-blue-500" size={14} />
                                        Volunteer Areas
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedVolunteer.areas?.map((area) => (
                                            <span key={area} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
                                                {area.replace('_', ' ')}
                                            </span>
                                        )) || <span className="text-gray-500">None specified</span>}
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <FaStar className="text-yellow-500" size={14} />
                                        Skills
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedVolunteer.skills?.map((skill) => (
                                            <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 border border-gray-200">
                                                {skill}
                                            </span>
                                        )) || <span className="text-gray-500">None listed</span>}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Text Fields */}
                            <div className="space-y-4">
                                {[
                                    { label: 'How they want to add value', content: selectedVolunteer.value, icon: FaHeart },
                                    { label: 'Experience', content: selectedVolunteer.experiences, icon: FaStar },
                                    { label: 'About', content: selectedVolunteer.about, icon: FaUser },
                                    { label: 'Motivation', content: selectedVolunteer.motivation, icon: FaHeart }
                                ].map((field) => field.content && (
                                    <div key={field.label}>
                                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                            <field.icon className="text-purple-500" size={14} />
                                            {field.label}
                                        </h4>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{field.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                                <button
                                    onClick={() => window.open(`mailto:${selectedVolunteer.email}?subject=Volunteer Application - IHU`, '_blank')}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    <FaEnvelope size={14} />
                                    Contact Volunteer
                                </button>
                                
                                {selectedVolunteer.status === VolunteerStatus.PENDING && (
                                    <>
                                        <button
                                            onClick={() => handleStatusUpdate(selectedVolunteer._id as string, VolunteerStatus.APPROVED)}
                                            disabled={updatingStatus === selectedVolunteer._id}
                                            className="bg-emerald-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {updatingStatus === selectedVolunteer._id ? (
                                                <FaSpinner className="animate-spin" size={14} />
                                            ) : (
                                                <FaCheckCircle size={14} />
                                            )}
                                            Approve
                                        </button>
                                        
                                        <button
                                            onClick={() => handleStatusUpdate(selectedVolunteer._id as string, VolunteerStatus.REJECTED)}
                                            disabled={updatingStatus === selectedVolunteer._id}
                                            className="bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {updatingStatus === selectedVolunteer._id ? (
                                                <FaSpinner className="animate-spin" size={14} />
                                            ) : (
                                                <FaTimesCircle size={14} />
                                            )}
                                            Reject
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminVolunteers