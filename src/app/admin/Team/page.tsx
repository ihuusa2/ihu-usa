'use client'

import type { Team } from "@/Types/User";
import { H1 } from '@/components/Headings/index'
import React, { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner'
import { deleteTeam, getAllTeams, getTeamCategory } from '@/Server/Team'
import Pagination from '@/components/Pagination'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Image from "next/image";
import AddTeamMember from "../components/AddTeam";

import { 
    FaUsers, 
    FaUserTie, 
    FaChalkboardTeacher,
    FaEdit,
    FaTrash,
    FaPlus,
    FaSearch,
    FaEye,
    FaTimesCircle,
    FaInfoCircle,
    FaBuilding,
    FaIdBadge,
    FaUserFriends,
    FaStar,
    FaImage
} from 'react-icons/fa'

const AdminTeam = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const [data, setData] = useState<Team[]>([])
    const [loading, setLoading] = useState(true)
    const [count, setCount] = useState(0)
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
    const [totalCategories, setTotalCategories] = useState(0)
    const [withDescriptionsCount, setWithDescriptionsCount] = useState(0)
    const [withImagesCount, setWithImagesCount] = useState(0)

    // Handle search input changes
    const handleSearchChange = (value: string) => {
        console.log('handleSearchChange called with:', value)
        setSearchTerm(value)
        const params = new URLSearchParams(searchParams.toString())
        
        if (value.trim()) {
            params.set('search', value)
        } else {
            params.delete('search')
        }
        
        // Reset to first page when searching
        params.delete('page')
        
        const newUrl = `${pathname}?${params.toString()}`
        console.log('Navigating to:', newUrl)
        router.push(newUrl)
    }

    useEffect(() => {
        (async () => {
            setLoading(true)
            const params = Object.fromEntries(searchParams.entries())
            console.log('Client sending params:', params)
            
            // Fetch team members and total categories in parallel
            const [members, categories] = await Promise.all([
                getAllTeams({ searchParams: params }),
                getTeamCategory()
            ])
            
            if (members) {
                setData(members.list)
                setCount(members.count)
                setWithDescriptionsCount(members.withDescriptionsCount)
                setWithImagesCount(members.withImagesCount)
            }
            
            if (categories) {
                setTotalCategories(categories.length)
            }
            
            setLoading(false)
        })()
    }, [searchParams])

    // Use data directly since server-side filtering handles the search
    const filteredData = data

    const getCategoryBadge = (category: string) => {
        const categoryLower = category?.toLowerCase();
        if (categoryLower?.includes('faculty') || categoryLower?.includes('teacher')) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    <FaChalkboardTeacher className="mr-1 h-3 w-3" /> 
                    {category}
                </span>
            )
        } else if (categoryLower?.includes('admin') || categoryLower?.includes('management')) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                    <FaUserTie className="mr-1 h-3 w-3" /> 
                    {category}
                </span>
            )
        } else if (categoryLower?.includes('staff')) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    <FaUserFriends className="mr-1 h-3 w-3" /> 
                    {category}
                </span>
            )
        } else {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                    <FaUsers className="mr-1 h-3 w-3" /> 
                    {category}
                </span>
            )
        }
    }

    // Statistics
    const stats = {
        total: count, // Use total count from server
        categories: totalCategories, // Use total available categories
        withImages: withImagesCount, // Use total from server
        withDescriptions: withDescriptionsCount // Use total from server
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-gray-50 via-white to-indigo-50">
            <div className='py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-6'>
                {/* Header Section */}
                <div className="mb-8 sm:mb-10">
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <FaUsers className="text-white text-xl" />
                            </div>
                            <div>
                                <H1 className="mb-1 text-3xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                    Team Members
                                </H1>
                                <p className="text-gray-600 text-base">Manage team members, roles and organizational structure</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setOpen(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <FaPlus className="h-4 w-4" />
                                Add Member
                            </button>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-indigo-600 font-semibold text-sm">Total Members</p>
                                        <p className="text-2xl font-bold text-indigo-800">{stats.total}</p>
                                        <p className="text-xs text-indigo-600 mt-1">Active team members</p>
                                    </div>
                                    <div className="p-3 bg-indigo-500 rounded-xl">
                                        <FaUsers className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-600 font-semibold text-sm">Departments</p>
                                        <p className="text-2xl font-bold text-purple-800">{stats.categories}</p>
                                        <p className="text-xs text-purple-600 mt-1">Total categories available</p>
                                    </div>
                                    <div className="p-3 bg-purple-500 rounded-xl">
                                        <FaBuilding className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-600 font-semibold text-sm">With Photos</p>
                                        <p className="text-2xl font-bold text-green-800">{stats.withImages}</p>
                                        <p className="text-xs text-green-600 mt-1">Profile pictures</p>
                                    </div>
                                    <div className="p-3 bg-green-500 rounded-xl">
                                        <FaImage className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-600 font-semibold text-sm">Complete Profiles</p>
                                        <p className="text-2xl font-bold text-blue-800">{stats.withDescriptions}</p>
                                        <p className="text-xs text-blue-600 mt-1">With descriptions</p>
                                    </div>
                                    <div className="p-3 bg-blue-500 rounded-xl">
                                        <FaInfoCircle className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
                                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <FaUsers className="text-white text-sm" />
                                    </div>
                                    Team Directory
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 ml-2">
                                        {count} Members
                                    </span>
                                </h2>
                                <p className="mt-2 text-gray-600 text-sm">
                                    View and manage all team members, their roles and departments
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search team members..."
                                        value={searchTerm}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                        className="pl-10 pr-4 py-2 w-80 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Card Content */}
                    <div className="p-0">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-gray-50/30">
                                <div className="mb-4">
                                    <Spinner />
                                </div>
                                <p className="text-gray-500 text-sm">Loading team members...</p>
                            </div>
                        ) : filteredData.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-gray-50/30">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                    <FaUsers className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-gray-700">No Team Members Found</h3>
                                <p className="text-sm text-gray-500 text-center max-w-md">
                                    {searchTerm ? `No team members match "${searchTerm}". Try adjusting your search.` : 
                                     'No team members have been added yet. Click "Add Member" to get started.'}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Table Header Info */}
                                <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <p className="text-sm text-gray-600">
                                            Showing <span className="font-semibold text-gray-800">{filteredData.length}</span> of <span className="font-semibold text-gray-800">{count}</span> team members
                                        </p>
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                                                <span className="text-gray-600">Total ({stats.total})</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                <span className="text-gray-600">With Photos ({stats.withImages})</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Team Members Grid */}
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredData.map((member) => (
                                            <TeamMemberCard 
                                                key={member._id?.toString()} 
                                                member={member} 
                                                setData={setData}
                                                getCategoryBadge={getCategoryBadge}
                                            />
                                        ))}
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

            {/* Add Member Modal */}
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800">
                                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <FaPlus className="text-white text-sm" />
                                    </div>
                                    Add Team Member
                                </h3>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <FaTimesCircle className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <AddTeamMember setData={setData} setOpen={setOpen} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

type TeamMemberCardProps = {
    member: Team
    setData: React.Dispatch<React.SetStateAction<Team[]>>
    getCategoryBadge: (category: string) => React.ReactElement
}

const TeamMemberCard = ({ member, setData, getCategoryBadge }: TeamMemberCardProps) => {
    const [showDetails, setShowDetails] = useState(false)
    const [edit, setEdit] = useState(false)
    const [deletePopup, setDeletePopup] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        await deleteTeam(member._id as string).then(() => {
            setData((prev) => prev.filter((m) => m._id !== member._id))
            setDeletePopup(false)
        }).finally(() => setLoading(false))
    }

    return (
        <>
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group">
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            {member.image ? (
                                <Image
                                    src={member.image as string} 
                                    alt={member.name}
                                    width={64} 
                                    height={64}
                                    className="w-16 h-16 rounded-full object-cover shadow-lg border-3 border-white"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-white text-xl font-semibold">
                                        {member.name?.charAt(0)?.toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                <FaStar className="text-white text-xs" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">
                                {member.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                <FaIdBadge className="h-3 w-3" />
                                {member.role || 'No role specified'}
                            </div>
                            {member.category && getCategoryBadge(member.category)}
                        </div>
                    </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-gray-50">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowDetails(true)}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <FaEye className="h-3 w-3" />
                            View Details
                        </button>
                        <button
                            onClick={() => setEdit(true)}
                            className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                        >
                            <FaEdit className="h-3 w-3" />
                        </button>
                        <button
                            onClick={() => setDeletePopup(true)}
                            className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                            <FaTrash className="h-3 w-3" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Details Modal */}
            {showDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <FaInfoCircle className="text-white text-sm" />
                                    </div>
                                    Team Member Details
                                </h3>
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <FaTimesCircle className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            {/* Member Profile Section */}
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mb-6">
                                {member.image ? (
                                    <Image
                                        src={member.image as string} 
                                        alt={member.name}
                                        width={80} 
                                        height={80}
                                        className="w-20 h-20 rounded-full object-cover shadow-lg border-4 border-white"
                                    />
                                ) : (
                                    <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-white text-2xl font-semibold">
                                            {member.name?.charAt(0)?.toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                                    <p className="text-gray-600">{member.role}</p>
                                    {member.category && getCategoryBadge(member.category)}
                                </div>
                            </div>
                            
                            {/* Description Section */}
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <FaInfoCircle className="text-blue-500" />
                                    About {member.name}
                                </h4>
                                <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: member.description }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {edit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                        <FaEdit className="text-white text-sm" />
                                    </div>
                                    Edit Team Member
                                </h3>
                                <button
                                    onClick={() => setEdit(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <FaTimesCircle className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <AddTeamMember setData={setData} setOpen={setEdit} isEdit={true} editData={member} />
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletePopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="flex items-center gap-3 text-lg font-bold text-gray-800">
                                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                                        <FaTrash className="text-white text-sm" />
                                    </div>
                                    Delete Team Member
                                </h3>
                                <button
                                    onClick={() => !loading && setDeletePopup(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    disabled={loading}
                                >
                                    <FaTimesCircle className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                                <div className="flex items-start gap-3">
                                    <FaTimesCircle className="text-red-500 mt-0.5" />
                                    <div>
                                        <p className="text-red-800 font-medium">Are you sure you want to delete this team member?</p>
                                        <p className="text-red-600 text-sm mt-1">
                                            Member: <span className="font-semibold">{member.name}</span>
                                        </p>
                                        <p className="text-red-600 text-sm">Role: <span className="font-semibold">{member.role}</span></p>
                                        <p className="text-red-600 text-sm mt-1">This action cannot be undone.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-3">
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
                                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <Spinner />
                                            <span>Deleting...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <FaTrash className="h-3 w-3" />
                                            <span>Delete</span>
                                        </div>
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

export default AdminTeam