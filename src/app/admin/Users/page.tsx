'use client'

import { UserRole, type User } from "@/Types/User";
import { H1 } from '@/components/Headings/index'
import React, { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner'
import { deleteUser, getAllUsers } from '@/Server/User'
import Pagination from '@/components/Pagination'
import { useSearchParams } from 'next/navigation'
import Image from "next/image";
import AddUser from "../components/AddUser";
import { 
    FaUser, 
    FaUsers, 
    FaUserTie, 
    FaUserGraduate, 
    FaUserShield,
    FaEnvelope, 
    FaPhone, 
    FaMapMarkerAlt,
    FaEdit,
    FaTrash,
    FaPlus,
    FaSearch,
    FaTimesCircle,
    FaCrown,
    FaTimes
} from 'react-icons/fa'

const AdminUsers = () => {
    const searchParams = useSearchParams()
    const [data, setData] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [count, setCount] = useState(0)
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [editUser, setEditUser] = useState<User|null>(null)

    useEffect(() => {
        (async () => {
            setLoading(true)
            await getAllUsers({ searchParams: Object.fromEntries(searchParams.entries()) }).then((users) => {
                if (users && users?.list?.length > 0) {
                    setData(users.list)
                    setCount(users.count)
                }
            }).finally(() => {
                setLoading(false)
            })
        })()
    }, [searchParams])

    // Filter data based on search term
    const filteredData = data.filter(item => 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getRoleBadge = (role: UserRole) => {
        switch (role) {
            case UserRole.Admin:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-200">
                        <FaCrown className="mr-1 h-3 w-3" /> 
                        Admin
                    </span>
                )
            case UserRole.Staff:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200">
                        <FaUserTie className="mr-1 h-3 w-3" /> 
                        Staff
                    </span>
                )
            case UserRole.User:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200">
                        <FaUserGraduate className="mr-1 h-3 w-3" /> 
                        Student
                    </span>
                )
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        <FaUser className="mr-1 h-3 w-3" /> 
                        Unknown
                    </span>
                )
        }
    }

    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case UserRole.Admin:
                return <FaUserShield className="text-red-500" />
            case UserRole.Staff:
                return <FaUserTie className="text-blue-500" />
            case UserRole.User:
                return <FaUserGraduate className="text-green-500" />
            default:
                return <FaUser className="text-gray-500" />
        }
    }

    // Statistics
    const stats = {
        total: data.length,
        admins: data.filter(item => item.role === UserRole.Admin).length,
        staff: data.filter(item => item.role === UserRole.Staff).length,
        students: data.filter(item => item.role === UserRole.User).length
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <div className='py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-6'>
                {/* Header Section */}
                <div className="mb-8 sm:mb-10">
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                                <FaUsers className="text-white text-xl" />
                            </div>
                            <div>
                                <H1 className="mb-1 text-3xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                    Users Management
                                </H1>
                                <p className="text-gray-600 text-base">Manage system users, roles and permissions</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setOpen(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <FaPlus className="h-4 w-4" />
                                Add User
                            </button>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-600 font-semibold text-sm">Total Users</p>
                                        <p className="text-2xl font-bold text-purple-800">{stats.total}</p>
                                        <p className="text-xs text-purple-600 mt-1">All system users</p>
                                    </div>
                                    <div className="p-3 bg-purple-500 rounded-xl">
                                        <FaUsers className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-red-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-red-600 font-semibold text-sm">Administrators</p>
                                        <p className="text-2xl font-bold text-red-800">{stats.admins}</p>
                                        <p className="text-xs text-red-600 mt-1">Full access users</p>
                                    </div>
                                    <div className="p-3 bg-red-500 rounded-xl">
                                        <FaUserShield className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-600 font-semibold text-sm">Staff Members</p>
                                        <p className="text-2xl font-bold text-blue-800">{stats.staff}</p>
                                        <p className="text-xs text-blue-600 mt-1">Limited access</p>
                                    </div>
                                    <div className="p-3 bg-blue-500 rounded-xl">
                                        <FaUserTie className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-600 font-semibold text-sm">Students</p>
                                        <p className="text-2xl font-bold text-green-800">{stats.students}</p>
                                        <p className="text-xs text-green-600 mt-1">Student accounts</p>
                                    </div>
                                    <div className="p-3 bg-green-500 rounded-xl">
                                        <FaUserGraduate className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
                                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                        <FaUsers className="text-white text-sm" />
                                    </div>
                                    Users Management
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 ml-2">
                                        {data.length} Total
                                    </span>
                                </h2>
                                <p className="mt-2 text-gray-600 text-sm">
                                    View and manage all system users, roles and permissions
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 w-80 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-0">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-gray-50/30">
                                <div className="mb-4">
                                    <Spinner />
                                </div>
                                <p className="text-gray-500 text-sm">Loading users...</p>
                            </div>
                        ) : filteredData.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-gray-50/30">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                    <FaUsers className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-gray-700">No Users Found</h3>
                                <p className="text-sm text-gray-500 text-center max-w-md">
                                    {searchTerm ? `No users match "${searchTerm}". Try adjusting your search.` : 
                                     'No users are registered in the system yet.'}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Table Header Info */}
                                <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <p className="text-sm text-gray-600">
                                            Showing <span className="font-semibold text-gray-800">{filteredData.length}</span> of <span className="font-semibold text-gray-800">{data.length}</span> users
                                        </p>
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                <span className="text-gray-600">Admins ({stats.admins})</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                <span className="text-gray-600">Staff ({stats.staff})</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                <span className="text-gray-600">Students ({stats.students})</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Responsive Table */}
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gradient-to-r from-gray-100 to-gray-50 sticky top-0">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide border-b-2 border-gray-200">
                                                    <div className="flex items-center gap-2">
                                                        <FaUser className="h-4 w-4" />
                                                        <span>User Profile</span>
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide border-b-2 border-gray-200">
                                                    <div className="flex items-center gap-2">
                                                        <FaPhone className="h-4 w-4" />
                                                        <span>Contact Info</span>
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide border-b-2 border-gray-200">
                                                    <div className="flex items-center gap-2">
                                                        <FaUserTie className="h-4 w-4" />
                                                        <span>Role & Access</span>
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide border-b-2 border-gray-200">
                                                    <div className="flex items-center gap-2">
                                                        <FaEdit className="h-4 w-4" />
                                                        <span>Actions</span>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {filteredData.map((user) => (
                                                <tr key={user._id?.toString()} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative">
                                                                {user.image ? (
                                                                    <Image
                                                                        src={user.image as string} 
                                                                        alt={user.name}
                                                                        width={48} 
                                                                        height={48}
                                                                        className="w-12 h-12 rounded-full object-cover shadow-sm border-2 border-white"
                                                                    />
                                                                ) : (
                                                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-sm">
                                                                        <span className="text-white text-lg font-semibold">
                                                                            {user.name?.charAt(0)?.toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                                    {getRoleIcon(user.role)}
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-gray-900 text-sm">
                                                                    {user.name}
                                                                </span>
                                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                                    <FaEnvelope className="h-3 w-3" />
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <FaPhone className="h-3 w-3 text-green-500" />
                                                                <span className="text-gray-700">{user.contact || 'Not provided'}</span>
                                                            </div>
                                                            {user.address && (
                                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                    <FaMapMarkerAlt className="h-3 w-3 text-red-500" />
                                                                    <span className="truncate max-w-[200px]">{user.address}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col gap-2">
                                                            {getRoleBadge(user.role)}
                                                            <span className="text-xs text-gray-500">
                                                                {user.role === UserRole.Admin ? 'Full Access' : 
                                                                 user.role === UserRole.Staff ? 'Limited Access' : 'Student Access'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Action user={user} setData={setData} data={data} onEdit={setEditUser} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
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

            {/* Add User Modal */}
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                    <FaPlus className="text-white text-sm" />
                                </div>
                                Add New User
                            </h3>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FaTimes className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <AddUser setData={setData} setOpen={setOpen} />
                        </div>
                    </div>
                </div>
            )}

            {editUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="flex items-center gap-3 text-lg font-bold text-gray-800">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                    <FaEdit className="text-white text-sm" />
                                </div>
                                Edit User
                            </h3>
                            <button
                                onClick={() => setEditUser(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FaTimes className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <AddUser setData={setData} setOpen={() => setEditUser(null)} isEdit={true} editData={editUser} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

type ActionProps = {
    user: User
    setData: React.Dispatch<React.SetStateAction<User[]>>,
    data?: User[]
    onEdit: React.Dispatch<React.SetStateAction<User|null>>
}

const Action = ({ user, setData, data, onEdit }: ActionProps) => {
    const [deletePopup, setDeletePopup] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        await deleteUser(user._id as string).then(() => {
            setData((prev) => prev.filter((u) => u._id !== user._id))
            setDeletePopup(false)
        }).finally(() => setLoading(false))
    }

    const canDelete = () => {
        if (user.role === UserRole.Admin) {
            return data && data.filter(i => i.role === UserRole.Admin).length > 1
        }
        return true
    }

    return (
        <>
            <div className='flex items-center gap-2'>
                <button 
                    onClick={() => onEdit(user)}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                >
                    <FaEdit className="h-3 w-3" />
                    Edit
                </button>
                
                {canDelete() && (
                    <button 
                        onClick={() => setDeletePopup(true)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                    >
                        <FaTrash className="h-3 w-3" />
                        Delete
                    </button>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deletePopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="flex items-center gap-3 text-lg font-bold text-gray-800">
                                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                                    <FaTrash className="text-white text-sm" />
                                </div>
                                Delete User
                            </h3>
                            <button
                                onClick={() => !loading && setDeletePopup(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                disabled={loading}
                            >
                                <FaTimes className="h-6 w-6" />
                            </button>
                        </div>
                        <div className='p-6'>
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                                <div className="flex items-start gap-3">
                                    <FaTimesCircle className="text-red-500 mt-0.5" />
                                    <div>
                                        <p className="text-red-800 font-medium">Are you sure you want to delete this user?</p>
                                        <p className="text-red-600 text-sm mt-1">
                                            User: <span className="font-semibold">{user.name}</span>
                                        </p>
                                        <p className="text-red-600 text-sm">This action cannot be undone.</p>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-end gap-3'>
                                <button 
                                    onClick={() => !loading && setDeletePopup(false)} 
                                    disabled={loading}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleDelete} 
                                    disabled={loading}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <Spinner />
                                            <span>Deleting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaTrash className="h-3 w-3" />
                                            <span>Delete</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AdminUsers