'use client'

import Spinner from '@/components/Spinner'
import { updateRegistrationById } from '@/Server/Registration'
import { RegisterForm, Status } from '@/Types/Form'
import React from 'react'
import { 
    FaCheckCircle, 
    FaClock, 
    FaTimesCircle, 
    FaEdit, 
    FaExclamationTriangle,
    FaUser,
    FaEnvelope,
    FaPhone
} from 'react-icons/fa'

const Update = ({ data, setData }: {
    data: RegisterForm,
    setData?: React.Dispatch<React.SetStateAction<RegisterForm[]>>
}) => {
    const [updatedStatus, setUpdatedStatus] = React.useState<Status>(data.status)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [success, setSuccess] = React.useState<string | null>(null)
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const getStatusInfo = (status: Status) => {
        switch (status) {
            case Status.APPROVED:
                return { 
                    icon: FaCheckCircle, 
                    color: 'text-green-600', 
                    bgColor: 'bg-green-50', 
                    borderColor: 'border-green-200',
                    ringColor: 'ring-green-200',
                    label: 'Approved'
                }
            case Status.PENDING:
                return { 
                    icon: FaClock, 
                    color: 'text-yellow-600', 
                    bgColor: 'bg-yellow-50', 
                    borderColor: 'border-yellow-200',
                    ringColor: 'ring-yellow-200',
                    label: 'Pending'
                }
            case Status.REJECTED:
                return { 
                    icon: FaTimesCircle, 
                    color: 'text-red-600', 
                    bgColor: 'bg-red-50', 
                    borderColor: 'border-red-200',
                    ringColor: 'ring-red-200',
                    label: 'Rejected'
                }
            default:
                return { 
                    icon: FaExclamationTriangle, 
                    color: 'text-gray-600', 
                    bgColor: 'bg-gray-50', 
                    borderColor: 'border-gray-200',
                    ringColor: 'ring-gray-200',
                    label: 'Unknown'
                }
        }
    }

    const updateForm = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        await updateRegistrationById(data._id as string, { status: updatedStatus }).then((res) => {
            if (res) {
                setData?.(prevData => prevData.map(item => item._id === data._id ? { ...item, status: updatedStatus, registrationNumber: res.registrationNumber } : item))
                setSuccess('Registration status updated successfully!')
            } else {
                setError('Error updating registration status')
            }
        })
            .catch(() => {
                setError('Error updating registration status')
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const currentStatusInfo = getStatusInfo(data.status)
    const newStatusInfo = getStatusInfo(updatedStatus)
    const CurrentIcon = currentStatusInfo.icon
    const NewIcon = newStatusInfo.icon

    const statusOptions = [
        { value: Status.PENDING, label: 'PENDING', icon: FaClock, color: 'text-yellow-500' },
        { value: Status.APPROVED, label: 'APPROVED', icon: FaCheckCircle, color: 'text-green-500' },
        { value: Status.REJECTED, label: 'REJECTED', icon: FaTimesCircle, color: 'text-red-500' }
    ]

    return (
        <div className="w-full space-y-4 sm:space-y-6">
            {/* Student Info Card */}
            <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-xl sm:rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <div className="p-2 sm:p-3 bg-orange-100 rounded-full">
                            <FaUser className="text-orange-600 text-lg sm:text-xl" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                                Student Information
                            </h2>
                            <p className="text-base sm:text-lg font-semibold text-orange-700">
                                {data.firstName} {data.lastName}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/60 rounded-lg">
                            <FaEnvelope className="text-orange-500 text-base sm:text-lg flex-shrink-0" />
                            <span className="text-gray-700 font-medium text-sm sm:text-base truncate">{data.emailAddress}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/60 rounded-lg">
                            <FaPhone className="text-orange-500 text-base sm:text-lg flex-shrink-0" />
                            <span className="text-gray-700 font-medium text-sm sm:text-base">{data.phone}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Current Status */}
            <div className={`rounded-xl sm:rounded-2xl shadow-lg border-2 ${currentStatusInfo.borderColor} ${currentStatusInfo.bgColor} overflow-hidden`}>
                <div className="p-4 sm:p-6 lg:p-8">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Current Status</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className={`p-2 rounded-full ${currentStatusInfo.bgColor} ${currentStatusInfo.borderColor} border`}>
                                <CurrentIcon className={`h-5 w-5 sm:h-6 sm:w-6 ${currentStatusInfo.color}`} />
                            </div>
                            <span className={`text-lg sm:text-xl font-bold ${currentStatusInfo.color}`}>
                                {currentStatusInfo.label}
                            </span>
                        </div>
                        {data.registrationNumber && (
                            <div className="sm:ml-auto">
                                <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 border border-gray-300 rounded-full text-xs sm:text-sm font-medium text-gray-700 shadow-sm">
                                    Reg: {data.registrationNumber}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Status Update Form */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-gray-200 rounded-full">
                            <FaEdit className="text-gray-600 text-base sm:text-lg" />
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Update Status</h3>
                            <p className="text-gray-600 text-sm sm:text-base">Change the registration status for this student</p>
                        </div>
                    </div>
                </div>
                
                <div className="p-4 sm:p-6 lg:p-8">
                    <form onSubmit={updateForm} className="space-y-4 sm:space-y-6">
                        {/* Status Feedback */}
                        {error && (
                            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl">
                                <FaTimesCircle className="text-red-500 text-lg sm:text-xl flex-shrink-0" />
                                <span className='text-red-700 font-medium text-sm sm:text-base'>{error}</span>
                            </div>
                        )}
                        
                        {success && (
                            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl">
                                <FaCheckCircle className="text-green-500 text-lg sm:text-xl flex-shrink-0" />
                                <span className='text-green-700 font-medium text-sm sm:text-base'>{success}</span>
                            </div>
                        )}

                        {/* Status Selector */}
                        <div className="space-y-2 sm:space-y-3">
                            <label className="block text-sm font-semibold text-gray-700">
                                New Status
                            </label>
                            
                            {/* Custom Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    disabled={loading}
                                    className="w-full h-12 sm:h-14 px-3 sm:px-4 bg-white border-2 border-gray-300 rounded-xl text-left focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            {(() => {
                                                const selectedOption = statusOptions.find(option => option.value === updatedStatus)
                                                const Icon = selectedOption?.icon || FaExclamationTriangle
                                                return (
                                                    <>
                                                        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${selectedOption?.color || 'text-gray-500'}`} />
                                                        <span className="font-medium text-gray-700 text-sm sm:text-base">
                                                            {selectedOption?.label || 'Select a status'}
                                                        </span>
                                                    </>
                                                )
                                            })()}
                                        </div>
                                        <svg 
                                            className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
                                        {statusOptions.map((option) => {
                                            const Icon = option.icon
                                            return (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => {
                                                        setUpdatedStatus(option.value)
                                                        setIsDropdownOpen(false)
                                                        setError(null)
                                                        setSuccess(null)
                                                    }}
                                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-2 sm:gap-3"
                                                >
                                                    <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${option.color}`} />
                                                    <span className="font-medium text-gray-700 text-sm sm:text-base">{option.label}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Preview New Status */}
                        {updatedStatus !== data.status && (
                            <div className={`rounded-xl border-2 ${newStatusInfo.borderColor} ${newStatusInfo.bgColor} p-4 sm:p-6`}>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className={`p-2 sm:p-3 rounded-full ${newStatusInfo.bgColor} ${newStatusInfo.borderColor} border`}>
                                        <NewIcon className={`h-5 w-5 sm:h-6 sm:w-6 ${newStatusInfo.color}`} />
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-gray-600">New Status Preview</p>
                                        <p className={`text-lg sm:text-xl font-bold ${newStatusInfo.color}`}>
                                            {newStatusInfo.label}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={updatedStatus === data.status || loading}
                            className="w-full h-12 sm:h-14 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2 sm:gap-3">
                                    <Spinner />
                                    <span className="text-sm sm:text-base">Updating...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2 sm:gap-3">
                                    <FaEdit className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <span className="text-sm sm:text-base">Update Status</span>
                                </div>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Update