'use client'

import { H1 } from '@/components/Headings/index'
import React, { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner'
import { ColumnDef } from "@tanstack/react-table"
import { getAllCourseRegForm, updateCourseRegFormById } from '@/Server/CourseRegForm'
import Pagination from '@/components/Pagination'
import { useSearchParams } from 'next/navigation'
import { CourseForm, PaymentStatus } from '@/Types/Form'
import { DataTable } from '@/components/ui/data-table'
import { formatDateTime } from '@/utils/dateFormatter'
import { 
  FaGraduationCap, 
  FaUser, 
  FaBookOpen, 
  FaCalendarAlt, 
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEye,
  FaTimes,
  FaEdit,
  FaUndo
} from 'react-icons/fa'

const AdminCourseSelections = () => {
    const searchParams = useSearchParams()
    const [data, setData] = useState<CourseForm[]>([])
    const [loading, setLoading] = useState(true)
    const [count, setCount] = useState(0)
    const [selectedRegistration, setSelectedRegistration] = useState<CourseForm | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [updatingStatus, setUpdatingStatus] = useState(false)
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    useEffect(() => {
        (async () => {
            setLoading(true)
            await getAllCourseRegForm({ searchParams: Object.fromEntries(searchParams.entries()) }).then((courseSelections) => {
                console.log(courseSelections)
                if (courseSelections && courseSelections?.list?.length > 0) {
                    setData(courseSelections.list)
                    setCount(courseSelections.count)
                }
            }).finally(() => {
                setLoading(false)
            })
        })()
    }, [searchParams])

    const getStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FaCheckCircle className="mr-1 h-3 w-3" />
                        Completed
                    </span>
                )
            case 'pending':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <FaClock className="mr-1 h-3 w-3" />
                        Pending
                    </span>
                )
            case 'failed':
            case 'cancelled':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <FaTimesCircle className="mr-1 h-3 w-3" />
                        Failed
                    </span>
                )
            case 'refunded':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <FaUndo className="mr-1 h-3 w-3" />
                        Refunded
                    </span>
                )
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <FaClock className="mr-1 h-3 w-3" />
                        {status || 'Unknown'}
                    </span>
                )
        }
    }

    const openModal = (registration: CourseForm) => {
        setSelectedRegistration(registration)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedRegistration(null)
        setStatusMessage(null)
    }

    const handleStatusUpdate = async (newStatus: PaymentStatus) => {
        if (!selectedRegistration?._id) return
        
        setUpdatingStatus(true)
        setStatusMessage(null)
        
        try {
            const updatedRegistration = await updateCourseRegFormById(selectedRegistration._id as string, { status: newStatus })
            
            if (updatedRegistration) {
                // Update the data in the table
                setData(prevData => prevData.map(item => 
                    item._id === selectedRegistration._id 
                        ? { ...item, status: newStatus }
                        : item
                ))
                
                // Update the selected registration in modal
                setSelectedRegistration(updatedRegistration)
                
                setStatusMessage({
                    type: 'success',
                    message: `Status updated to ${newStatus} successfully!`
                })
            } else {
                setStatusMessage({
                    type: 'error',
                    message: 'Failed to update status. Please try again.'
                })
            }
        } catch {
            setStatusMessage({
                type: 'error',
                message: 'An error occurred while updating status.'
            })
        } finally {
            setUpdatingStatus(false)
        }
    }

    const columns: ColumnDef<CourseForm>[] = [
        {
            accessorKey: "registrationNumber",
            header: () => (
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                    <FaUser className="h-4 w-4" />
                    <span>Registration Number</span>
                </div>
            ),
            cell: ({ row }) => {
                if (!row.original.registrationData) return (
                    <div className="text-gray-400 font-mono text-xs bg-gray-100 px-3 py-1 rounded-full">
                        No Data
                    </div>
                )
                return (
                    <button
                        onClick={() => openModal(row.original)}
                        className="group w-full text-left"
                    >
                        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-200">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                                <FaEye className="text-white text-xs" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-mono text-sm font-medium text-blue-700 group-hover:text-blue-800">
                                    {row.original.registrationNumber}
                                </span>
                                <span className="text-xs text-gray-500">Click to view details</span>
                            </div>
                        </div>
                    </button>
                )
            }
        },
        {
            accessorKey: "studentName",
            header: () => (
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                    <FaUsers className="h-4 w-4" />
                    <span>Student Name</span>
                </div>
            ),
            cell: ({ row }) => {
                if (!row.original.registrationData) return (
                    <div className="text-gray-400 text-sm">No student data</div>
                )
                const { firstName, middleName, lastName } = row.original.registrationData
                const fullName = `${firstName} ${middleName} ${lastName}`.trim()
                return (
                    <div className="flex items-center gap-3 py-1">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white text-sm font-semibold">
                                {firstName?.charAt(0)}{lastName?.charAt(0)}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 text-sm">{fullName}</span>
                            <span className="text-xs text-gray-500">Student</span>
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: "course",
            header: () => (
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                    <FaBookOpen className="h-4 w-4" />
                    <span>Course</span>
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        <FaBookOpen className="mr-1 h-3 w-3" />
                        {row.original.course}
                    </span>
                </div>
            )
        },
        {
            accessorKey: "program",
            header: () => (
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                    <FaGraduationCap className="h-4 w-4" />
                    <span>Program</span>
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                        <FaGraduationCap className="mr-1 h-3 w-3" />
                        {row.original.program}
                    </span>
                </div>
            )
        },
        {
            accessorKey: "subjects",
            header: () => (
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                    <FaBookOpen className="h-4 w-4" />
                    <span>Subjects</span>
                </div>
            ),
            cell: ({ row }) => {
                const subjects = row.original.subjects;
                if (!subjects || subjects.length === 0) {
                    return <span className="text-gray-400 text-sm">No subjects</span>
                }
                if (subjects.length <= 2) {
                    return (
                        <div className="flex flex-wrap gap-1">
                            {subjects.map((subject, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                    {subject}
                                </span>
                            ))}
                        </div>
                    );
                }
                return (
                    <div className="flex flex-wrap items-center gap-1">
                        {subjects.slice(0, 2).map((subject, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                {subject}
                            </span>
                        ))}
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
                            +{subjects.length - 2} more
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "status",
            header: () => (
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                    <FaCheckCircle className="h-4 w-4" />
                    <span>Payment Status</span>
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex justify-start">
                    {getStatusBadge(row.original.status)}
                </div>
            )
        },
        {
            accessorKey: "createdAt",
            header: () => (
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                    <FaCalendarAlt className="h-4 w-4" />
                    <span>Enrolled At</span>
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-700">
                        <FaCalendarAlt className="text-gray-400 h-3 w-3" />
                        <span className="text-sm font-medium">{formatDateTime(row.original.createdAt)}</span>
                    </div>
                    <span className="text-xs text-gray-500">Registration date</span>
                </div>
            )
        },
    ]

    return (
        <div className="min-h-full bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <div className='py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-6'>
                {/* Header Section */}
                <div className="mb-8 sm:mb-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <FaGraduationCap className="text-white text-xl" />
                            </div>
                            <div>
                                <H1 className="mb-1 text-3xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                    Course Selections
                                </H1>
                                <p className='text-gray-600 text-base'>Manage student course registrations and applications</p>
                            </div>
                        </div>


                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-600 font-semibold text-sm">Total Registrations</p>
                                        <p className="text-2xl font-bold text-blue-800">{count}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FaUsers className="text-blue-500 text-xl" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-600 font-semibold text-sm">Completed</p>
                                        <p className="text-2xl font-bold text-green-800">
                                            {data.filter(item => item.status?.toLowerCase() === 'completed').length}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <FaCheckCircle className="text-green-500 text-xl" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-yellow-600 font-semibold text-sm">Pending</p>
                                        <p className="text-2xl font-bold text-yellow-800">
                                            {data.filter(item => item.status?.toLowerCase() === 'pending').length}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <FaClock className="text-yellow-500 text-xl" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-600 font-semibold text-sm">Active Courses</p>
                                        <p className="text-2xl font-bold text-purple-800">
                                            {new Set(data.map(item => item.course)).size}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <FaBookOpen className="text-purple-500 text-xl" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Table Section */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <FaUsers className="text-white text-sm" />
                                    </div>
                                    Course Registrations
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                                        {data.length} Total
                                    </span>
                                </div>
                                <p className="mt-2 text-gray-600 text-sm">
                                    View and manage all student course selections and registrations
                                </p>
                            </div>
                            

                        </div>
                    </div>
                    
                    <div className="p-0">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-gray-50/30">
                                <div className="mb-4">
                                    <Spinner />
                                </div>
                                <p className="text-gray-500 text-sm">Loading course registrations...</p>
                            </div>
                        ) : data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-gray-50/30">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                    <FaUsers className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-gray-700">No Course Registrations Found</h3>
                                <p className="text-sm text-gray-500 text-center max-w-md">
                                    There are no course registrations to display at this time. 
                                    Registrations will appear here once students start enrolling.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Table Header Info */}
                                <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <p className="text-sm text-gray-600">
                                            Showing <span className="font-semibold text-gray-800">{data.length}</span> registrations
                                        </p>
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                <span className="text-gray-600">Completed ({data.filter(item => item.status?.toLowerCase() === 'completed').length})</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                <span className="text-gray-600">Pending ({data.filter(item => item.status?.toLowerCase() === 'pending').length})</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Responsive Table Container */}
                                <div className="overflow-x-auto">
                                    <div className="min-w-full">
                                        <DataTable
                                            classNames={{
                                                tableCell: 'py-4 px-6 text-sm border-b border-gray-100 whitespace-nowrap',
                                                tableHead: 'py-4 px-6 bg-gradient-to-r from-gray-100 to-gray-50 font-semibold text-gray-700 text-sm uppercase tracking-wide border-b-2 border-gray-200 sticky top-0'
                                            }}
                                            columns={columns} 
                                            data={JSON.parse(JSON.stringify(data))} 
                                        />
                                    </div>
                                </div>
                                
                                {/* Footer with Pagination */}
                                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="text-sm text-gray-600">
                                            Total records: <span className="font-semibold text-gray-800">{count}</span>
                                        </div>
                                        <Pagination count={count} />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && selectedRegistration && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <FaUser className="text-white text-sm" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Registration Details</h2>
                            </div>
                            <button
                                onClick={closeModal}
                                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                            >
                                <FaTimes className="text-gray-600" />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            {/* Status Update Section */}
                            <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <FaCheckCircle className="text-blue-600" />
                                        <h3 className="text-lg font-semibold text-gray-800">Payment Status</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(selectedRegistration.status)}
                                    </div>
                                </div>
                                
                                {/* Status Message */}
                                {statusMessage && (
                                    <div className={`mb-4 p-3 rounded-lg ${
                                        statusMessage.type === 'success' 
                                            ? 'bg-green-100 text-green-800 border border-green-200' 
                                            : 'bg-red-100 text-red-800 border border-red-200'
                                    }`}>
                                        <div className="flex items-center gap-2">
                                            {statusMessage.type === 'success' ? (
                                                <FaCheckCircle className="h-4 w-4" />
                                            ) : (
                                                <FaTimesCircle className="h-4 w-4" />
                                            )}
                                            <span className="text-sm font-medium">{statusMessage.message}</span>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Status Update Buttons */}
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => handleStatusUpdate(PaymentStatus.PENDING)}
                                        disabled={updatingStatus || selectedRegistration.status === PaymentStatus.PENDING}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            selectedRegistration.status === PaymentStatus.PENDING
                                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300 cursor-not-allowed'
                                                : 'bg-yellow-500 hover:bg-yellow-600 text-white border border-yellow-500 hover:border-yellow-600'
                                        }`}
                                    >
                                        <FaClock className="h-4 w-4" />
                                        Set Pending
                                    </button>
                                    
                                    <button
                                        onClick={() => handleStatusUpdate(PaymentStatus.COMPLETED)}
                                        disabled={updatingStatus || selectedRegistration.status === PaymentStatus.COMPLETED}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            selectedRegistration.status === PaymentStatus.COMPLETED
                                                ? 'bg-green-100 text-green-800 border border-green-300 cursor-not-allowed'
                                                : 'bg-green-500 hover:bg-green-600 text-white border border-green-500 hover:border-green-600'
                                        }`}
                                    >
                                        <FaCheckCircle className="h-4 w-4" />
                                        Mark Completed
                                    </button>
                                    
                                    <button
                                        onClick={() => handleStatusUpdate(PaymentStatus.FAILED)}
                                        disabled={updatingStatus || selectedRegistration.status === PaymentStatus.FAILED}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            selectedRegistration.status === PaymentStatus.FAILED
                                                ? 'bg-red-100 text-red-800 border border-red-300 cursor-not-allowed'
                                                : 'bg-red-500 hover:bg-red-600 text-white border border-red-500 hover:border-red-600'
                                        }`}
                                    >
                                        <FaTimesCircle className="h-4 w-4" />
                                        Mark Failed
                                    </button>
                                    
                                    <button
                                        onClick={() => handleStatusUpdate(PaymentStatus.REFUNDED)}
                                        disabled={updatingStatus || selectedRegistration.status === PaymentStatus.REFUNDED}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            selectedRegistration.status === PaymentStatus.REFUNDED
                                                ? 'bg-purple-100 text-purple-800 border border-purple-300 cursor-not-allowed'
                                                : 'bg-purple-500 hover:bg-purple-600 text-white border border-purple-500 hover:border-purple-600'
                                        }`}
                                    >
                                        <FaTimesCircle className="h-4 w-4" />
                                        Mark Refunded
                                    </button>
                                </div>
                                
                                {updatingStatus && (
                                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                                        <Spinner size="1rem" />
                                        <span>Updating status...</span>
                                    </div>
                                )}
                                
                                {/* Edit Button */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => {
                                            setStatusMessage({
                                                type: 'success',
                                                message: 'Edit functionality will be implemented in the next update!'
                                            })
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-200"
                                    >
                                        <FaEdit className="h-4 w-4" />
                                        Edit Registration
                                    </button>
                                </div>
                            </div>
                            
                            {selectedRegistration.registrationData && (
                                <>
                                    {/* Student Overview Card */}
                                    <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaGraduationCap className="text-blue-600" />
                                            <h3 className="text-lg font-semibold text-gray-800">Student Information</h3>
                                        </div>
                                        <h4 className="text-2xl font-bold text-gray-800 mb-4">
                                            {selectedRegistration.registrationData.firstName} {selectedRegistration.registrationData.middleName} {selectedRegistration.registrationData.lastName}
                                        </h4>
                                        <div className="flex flex-wrap gap-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <FaEnvelope className="text-blue-500" />
                                                <span>{selectedRegistration.registrationData.emailAddress}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <FaPhone className="text-green-500" />
                                                <span>{selectedRegistration.registrationData.countryCode} {selectedRegistration.registrationData.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <FaMapMarkerAlt className="text-red-500" />
                                                <span>{selectedRegistration.registrationData.city}, {selectedRegistration.registrationData.state}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Personal Information */}
                                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4">
                                                <h3 className="flex items-center gap-2 font-semibold">
                                                    <FaUser />
                                                    Personal Information
                                                </h3>
                                            </div>
                                            <div className="p-6 space-y-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">First Name</span>
                                                        <span className="block text-base font-medium mt-1">{selectedRegistration.registrationData.firstName}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">Middle Name</span>
                                                        <span className="block text-base font-medium mt-1">{selectedRegistration.registrationData.middleName}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">Last Name</span>
                                                        <span className="block text-base font-medium mt-1">{selectedRegistration.registrationData.lastName}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">Former/Maiden Name</span>
                                                        <span className="block text-base font-medium mt-1">{selectedRegistration.registrationData.formerOrMaidenName || 'N/A'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">Date of Birth</span>
                                                        <span className="block text-base font-medium mt-1">{selectedRegistration.registrationData.dateOfBirth}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">Gender</span>
                                                        <span className="block text-base font-medium mt-1">{selectedRegistration.registrationData.gender}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Information */}
                                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4">
                                                <h3 className="flex items-center gap-2 font-semibold">
                                                    <FaEnvelope />
                                                    Contact Information
                                                </h3>
                                            </div>
                                            <div className="p-6 space-y-4">
                                                <div>
                                                    <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">Email Address</span>
                                                    <span className="block text-base font-medium mt-1">{selectedRegistration.registrationData.emailAddress}</span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">Country Code</span>
                                                        <span className="block text-base font-medium mt-1">{selectedRegistration.registrationData.countryCode}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">Phone</span>
                                                        <span className="block text-base font-medium mt-1">{selectedRegistration.registrationData.phone}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">Address</span>
                                                    <span className="block text-base font-medium mt-1">{selectedRegistration.registrationData.address}</span>
                                                </div>
                                                {selectedRegistration.registrationData.streetAddress2 && (
                                                    <div>
                                                        <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">Street Address 2</span>
                                                        <span className="block text-base font-medium mt-1">{selectedRegistration.registrationData.streetAddress2}</span>
                                                    </div>
                                                )}
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                    <div>
                                                        <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">City</span>
                                                        <span className="block text-base font-medium mt-1">{selectedRegistration.registrationData.city}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">State</span>
                                                        <span className="block text-base font-medium mt-1">{selectedRegistration.registrationData.state}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">Zip Code</span>
                                                        <span className="block text-base font-medium mt-1">{selectedRegistration.registrationData.zipOrPostalCode}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">Country/Region</span>
                                                    <span className="block text-base font-medium mt-1">{selectedRegistration.registrationData.countryOrRegion}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Academic Information */}
                                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-4">
                                                <h3 className="flex items-center gap-2 font-semibold">
                                                    <FaBookOpen />
                                                    Academic Information
                                                </h3>
                                            </div>
                                            <div className="p-6 space-y-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">Resident</span>
                                                        <span className="block text-base font-medium mt-1">{selectedRegistration.registrationData.resident}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">Enrollment Type</span>
                                                        <span className="block text-base font-medium mt-1">{selectedRegistration.registrationData.enrollmentType}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">Course Type</span>
                                                        <span className="block text-base font-medium mt-1">{selectedRegistration.registrationData.courseType}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">Graduation Year</span>
                                                        <span className="block text-base font-medium mt-1">{selectedRegistration.registrationData.graduationYear}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">Present Level of Education</span>
                                                    <span className="block text-base font-medium mt-1">{selectedRegistration.registrationData.presentLevelOfEducation}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">How Did You Hear About IHU</span>
                                                    <span className="block text-base font-medium mt-1">{selectedRegistration.registrationData.howDidYouHearAboutIHU}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">Objectives</span>
                                                    <span className="block text-base font-medium mt-1">{selectedRegistration.registrationData.objectives}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Additional Information */}
                                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4">
                                                <h3 className="flex items-center gap-2 font-semibold">
                                                    <FaCalendarAlt />
                                                    Additional Information
                                                </h3>
                                            </div>
                                            <div className="p-6 space-y-4">
                                                <div>
                                                    <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">Signature</span>
                                                    <span className="block text-base font-medium mt-1">{selectedRegistration.registrationData.signature}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">Received Credentials</span>
                                                    <div className="mt-2 space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            {selectedRegistration.registrationData.recieved.diploma ? 
                                                                <FaCheckCircle className="text-green-500" /> : 
                                                                <FaTimesCircle className="text-red-500" />
                                                            }
                                                            <span className="text-sm">Diploma</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {selectedRegistration.registrationData.recieved.homeSchool ? 
                                                                <FaCheckCircle className="text-green-500" /> : 
                                                                <FaTimesCircle className="text-red-500" />
                                                            }
                                                            <span className="text-sm">Home School</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {selectedRegistration.registrationData.recieved.ged ? 
                                                                <FaCheckCircle className="text-green-500" /> : 
                                                                <FaTimesCircle className="text-red-500" />
                                                            }
                                                            <span className="text-sm">GED</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {selectedRegistration.registrationData.recieved.other ? 
                                                                <FaCheckCircle className="text-green-500" /> : 
                                                                <FaTimesCircle className="text-red-500" />
                                                            }
                                                            <span className="text-sm">Other</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">Created At</span>
                                                        <span className="block text-base font-medium mt-1">{formatDateTime(selectedRegistration.registrationData.createdAt)}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-gray-500 font-semibold text-xs uppercase tracking-wide">Transaction ID</span>
                                                        <span className="block text-base font-medium mt-1">{selectedRegistration.registrationData.orderId || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminCourseSelections
