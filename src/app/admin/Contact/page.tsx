'use client'

import type { Contact } from "@/Types/Form";
import { H1 } from '@/components/Headings/index'
import React, { useEffect, useState } from 'react'
import { getAllContactForm, deleteContactForm, markContactAsRead } from '@/Server/Contact'
import Pagination from '@/components/Pagination'
import { useSearchParams } from 'next/navigation'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser, FaClock, FaEye, FaTrash, FaReply, FaSearch, FaFilter, FaTimes } from 'react-icons/fa'
import Spinner from '@/components/Spinner'

const AdminContact = () => {
    const searchParams = useSearchParams()
    const [data, setData] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)
    const [count, setCount] = useState(0)
    const [selectedMessage, setSelectedMessage] = useState<Contact | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [readMessages, setReadMessages] = useState<Set<string>>(new Set())
    const [deletingMessage, setDeletingMessage] = useState<string | null>(null)
    const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{open: boolean, messageId: string, messageName: string}>({
        open: false,
        messageId: '',
        messageName: ''
    })

    useEffect(() => {
        (async () => {
            setLoading(true)
            await getAllContactForm({ searchParams: Object.fromEntries(searchParams.entries()) }).then((contacts) => {
                if (contacts) {
                    setData(contacts.list)
                    setCount(contacts.count)
                }
            }).finally(() => {
                setLoading(false)
            })
        })()
    }, [searchParams])

    const filteredData = data.filter(message => {
        const matchesSearch = searchTerm === '' || 
            message.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.message.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesFilter = filterStatus === 'all' || 
            (filterStatus === 'read' && readMessages.has(message._id as string)) ||
            (filterStatus === 'unread' && !readMessages.has(message._id as string))
        
        return matchesSearch && matchesFilter
    })

    const markAsRead = async (messageId: string) => {
        setReadMessages(prev => new Set(prev).add(messageId))
        // Also update on server
        try {
            await markContactAsRead(messageId)
        } catch (error) {
            console.error('Failed to mark message as read:', error)
        }
    }

    const handleViewMessage = (message: Contact) => {
        setSelectedMessage(message)
        markAsRead(message._id as string)
    }

    const handleDeleteClick = (message: Contact) => {
        setDeleteConfirmDialog({
            open: true,
            messageId: message._id as string,
            messageName: `${message.firstName} ${message.lastName}`
        })
    }

    const handleDeleteConfirm = async () => {
        const messageId = deleteConfirmDialog.messageId
        if (!messageId) return

        setDeletingMessage(messageId)
        
        try {
            const success = await deleteContactForm(messageId)
            if (success) {
                // Remove from local state
                setData(prev => prev.filter(msg => msg._id !== messageId))
                setCount(prev => prev - 1)
                
                // Close modal if this message was selected
                if (selectedMessage?._id === messageId) {
                    setSelectedMessage(null)
                }
                
                // Remove from read messages
                setReadMessages(prev => {
                    const newSet = new Set(prev)
                    newSet.delete(messageId)
                    return newSet
                })
            } else {
                alert('Failed to delete message. Please try again.')
            }
        } catch (error) {
            console.error('Delete error:', error)
            alert('An error occurred while deleting the message.')
        } finally {
            setDeletingMessage(null)
            setDeleteConfirmDialog({ open: false, messageId: '', messageName: '' })
        }
    }

    const handleDeleteCancel = () => {
        setDeleteConfirmDialog({ open: false, messageId: '', messageName: '' })
    }

    const formatDate = (message: Contact) => {
        try {
            let dateToFormat: Date | null = null
            
            // First try to use createdAt if it exists
            if (message.createdAt) {
                dateToFormat = new Date(message.createdAt)
            }
            // Fallback: Extract timestamp from MongoDB ObjectId
            else if (message._id && typeof message._id === 'string' && message._id.length >= 8) {
                // MongoDB ObjectId first 8 characters represent timestamp in seconds since epoch
                const timestamp = parseInt(message._id.substring(0, 8), 16) * 1000
                dateToFormat = new Date(timestamp)
            }
            
            if (dateToFormat && !isNaN(dateToFormat.getTime())) {
                const now = new Date()
                const diff = now.getTime() - dateToFormat.getTime()
                const days = Math.floor(diff / (1000 * 60 * 60 * 24))
                
                // Show relative time for recent messages
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
                    // Show full date for older messages
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

    const formatFullDate = (message: Contact) => {
        try {
            let dateToFormat: Date | null = null
            
            if (message.createdAt) {
                dateToFormat = new Date(message.createdAt)
            } else if (message._id && typeof message._id === 'string' && message._id.length >= 8) {
                const timestamp = parseInt(message._id.substring(0, 8), 16) * 1000
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

    const MessageCard = ({ message }: { message: Contact }) => {
        const isRead = readMessages.has(message._id as string)
        
        return (
            <div className={`relative bg-white rounded-xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                isRead ? 'border-gray-200' : 'border-orange-200 bg-gradient-to-br from-orange-50/50 to-amber-50/30'
            } overflow-hidden group`}>
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-lg">
                                {message.firstName.charAt(0)}{message.lastName.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
                                    <FaUser className="text-gray-500 flex-shrink-0" size={12} />
                                    <span className="truncate">{message.firstName} {message.lastName}</span>
                                    {!isRead && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200 flex-shrink-0">
                                            New
                                        </span>
                                    )}
                                </h3>
                                <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                    <FaEnvelope className="text-gray-400 flex-shrink-0" size={10} />
                                    <span className="truncate">{message.email}</span>
                                </p>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 flex-shrink-0">
                            <FaClock size={10} />
                            <span className="hidden sm:inline">{formatDate(message)}</span>
                        </div>
                    </div>
                </div>
                
                {/* Content */}
                <div className="p-4 sm:p-6">
                    <div className="space-y-3 mb-4">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                            <FaPhone className="text-gray-400 flex-shrink-0" size={10} />
                            <span className="truncate">{message.phone}</span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-start gap-2">
                            <FaMapMarkerAlt className="text-gray-400 mt-0.5 flex-shrink-0" size={10} />
                            <span className="line-clamp-2">{message.address}</span>
                        </p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                            {message.message}
                        </p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-end flex-wrap">
                        <button
                            onClick={() => handleViewMessage(message)}
                            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
                        >
                            <FaEye size={12} />
                            <span className="hidden sm:inline">View</span>
                            <span className="sm:hidden">V</span>
                        </button>
                        
                        <button
                            onClick={() => window.open(`mailto:${message.email}`, '_blank')}
                            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-blue-600 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        >
                            <FaReply size={12} />
                            <span className="hidden sm:inline">Reply</span>
                            <span className="sm:hidden">R</span>
                        </button>
                        
                        <button
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation()
                                handleDeleteClick(message)
                            }}
                            disabled={deletingMessage === message._id}
                            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 hover:border-red-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {deletingMessage === message._id ? (
                                <Spinner size="12px" />
                            ) : (
                                <FaTrash size={12} />
                            )}
                            <span className="hidden sm:inline">
                                {deletingMessage === message._id ? 'Deleting...' : 'Delete'}
                            </span>
                            <span className="sm:hidden">
                                {deletingMessage === message._id ? '...' : 'D'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='w-full h-full flex flex-col bg-gradient-to-br from-gray-50 via-orange-50/20 to-amber-50/20'>
            {/* Header Section */}
            <div className='bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6 shadow-sm'>
                <div className='max-w-none flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
                    <div>
                        <H1 className="text-gray-800 text-2xl sm:text-3xl font-bold">Contact Messages</H1>
                        <p className="text-gray-600 mt-1 text-sm sm:text-base">
                            Manage and respond to contact form submissions
                        </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200">
                            {filteredData.filter(m => !readMessages.has(m._id as string)).length} Unread
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                            {count} Total
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className='flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-6'>
                <div className='max-w-none flex flex-col gap-6'>

                    {/* Search and Filter */}
                    <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search messages by name, email, or content..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <FaFilter className="text-gray-400" size={14} />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-3 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white"
                            >
                                <option value="all">All Messages</option>
                                <option value="unread">Unread Only</option>
                                <option value="read">Read Only</option>
                            </select>
                        </div>
                    </div>

                    {/* Messages Grid */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Spinner size="2rem" />
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <FaEnvelope className="mx-auto text-gray-300 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-gray-700 mb-2">No messages found</h3>
                            <p className="text-gray-500">
                                {searchTerm || filterStatus !== 'all' 
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'No contact messages have been received yet'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                            {filteredData.map((message) => (
                                <MessageCard key={message._id as string} message={message} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && count > 0 && <Pagination count={count} />}
                </div>
            </div>

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold">
                                        {selectedMessage.firstName.charAt(0)}{selectedMessage.lastName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold text-gray-800">
                                            {selectedMessage.firstName} {selectedMessage.lastName}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {formatFullDate(selectedMessage)}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>
                        </div>
                        
                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Contact Information */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <FaEnvelope className="text-gray-500" size={16} />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                                            <p className="font-medium">{selectedMessage.email}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <FaPhone className="text-gray-500" size={16} />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                                            <p className="font-medium">{selectedMessage.phone}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <FaMapMarkerAlt className="text-gray-500 mt-1" size={16} />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                                        <p className="font-medium leading-relaxed">{selectedMessage.address}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Message */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">Message</h4>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {selectedMessage.message}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: Your Contact Form Message`, '_blank')}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                                >
                                    <FaReply size={14} />
                                    Reply via Email
                                </button>
                                <button
                                    onClick={() => window.open(`tel:${selectedMessage.phone}`, '_blank')}
                                    className="px-4 py-2 text-green-600 bg-white border border-green-300 rounded-lg hover:bg-green-50 hover:border-green-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center gap-2"
                                >
                                    <FaPhone size={14} />
                                    Call
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(selectedMessage)}
                                    disabled={deletingMessage === selectedMessage._id}
                                    className="px-4 py-2 text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 hover:border-red-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {deletingMessage === selectedMessage._id ? (
                                        <Spinner size="14px" />
                                    ) : (
                                        <FaTrash size={14} />
                                    )}
                                    {deletingMessage === selectedMessage._id ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {deleteConfirmDialog.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                        {/* Dialog Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <FaTrash className="text-red-600" size={20} />
                                </div>
                                <span className="text-lg font-semibold text-red-600">Delete Message</span>
                            </div>
                        </div>
                        
                        {/* Dialog Content */}
                        <div className="p-6">
                            <p className="text-gray-700 mb-4">
                                Are you sure you want to delete the message from{' '}
                                <span className="font-semibold">{deleteConfirmDialog.messageName}</span>?
                            </p>
                            <p className="text-sm text-gray-500">
                                This action cannot be undone. The message will be permanently removed from the system.
                            </p>
                        </div>
                        
                        {/* Dialog Actions */}
                        <div className="flex gap-3 justify-end p-6 border-t border-gray-200">
                            <button
                                onClick={handleDeleteCancel}
                                disabled={!!deletingMessage}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={!!deletingMessage}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {deletingMessage ? (
                                    <>
                                        <Spinner size="1rem" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <FaTrash size={14} />
                                        Delete Message
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminContact