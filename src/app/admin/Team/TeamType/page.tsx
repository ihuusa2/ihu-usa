'use client'

import type { TeamType } from "@/Types/User";
import React, { useEffect, useState } from 'react'
import { deleteTeamType, getAllTeamTypes } from '@/Server/TeamType'
import { useSearchParams } from 'next/navigation'
import AddTeamType from "../../components/AddTeamType";

const AdminTeamType = () => {
    const searchParams = useSearchParams()
    const [data, setData] = useState<TeamType[]>([])
    const [loading, setLoading] = useState(true)
    const [count, setCount] = useState(0)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        (async () => {
            setLoading(true)
            await getAllTeamTypes({ searchParams: Object.fromEntries(searchParams.entries()) }).then((teamTypes) => {
                if (teamTypes) {
                    setData(teamTypes.list)
                    setCount(teamTypes.count)
                }
            }).finally(() => {
                setLoading(false)
            })
        })()
    }, [searchParams])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                                Team Types
                            </h1>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Manage and organize your team member categories
                            </p>
                        </div>
                        <button 
                            onClick={() => setOpen(true)}
                            className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
                        >
                            <svg className="w-5 h-5 mr-2 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Team Type
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Types</p>
                                <p className="text-2xl font-bold text-gray-900">{count}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active</p>
                                <p className="text-2xl font-bold text-gray-900">{data.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">This Page</p>
                                <p className="text-2xl font-bold text-gray-900">{data.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                                <p className="text-2xl font-bold text-gray-900">Today</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative">
                                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                </div>
                                <p className="text-gray-600 font-medium">Loading team types...</p>
                            </div>
                        </div>
                    ) : data.length === 0 ? (
                        <div className="text-center py-16 px-6">
                            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No team types found</h3>
                            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                                Get started by creating your first team type to organize your team members effectively.
                            </p>
                            <button 
                                onClick={() => setOpen(true)}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Create First Team Type
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden lg:block">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Team Type
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Created
                                                </th>
                                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {data.map((teamType) => (
                                                <tr key={String(teamType._id)} className="hover:bg-gray-50 transition-colors duration-200">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                                                <span className="text-sm font-semibold text-white">
                                                                    {teamType.title.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-semibold text-gray-900">
                                                                    {teamType.title}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    ID: {String(teamType._id).slice(-8)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            Recently
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Action teamType={teamType} setData={setData} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Tablet Table */}
                            <div className="hidden md:block lg:hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Team Type
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {data.map((teamType) => (
                                                <tr key={String(teamType._id)} className="hover:bg-gray-50 transition-colors duration-200">
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                                                <span className="text-xs font-semibold text-white">
                                                                    {teamType.title.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <div className="ml-3">
                                                                <div className="text-sm font-semibold text-gray-900">
                                                                    {teamType.title}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                        <Action teamType={teamType} setData={setData} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden">
                                <div className="divide-y divide-gray-100">
                                    {data.map((teamType) => (
                                        <div key={String(teamType._id)} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center flex-1 min-w-0">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                                        <span className="text-sm font-semibold text-white">
                                                            {teamType.title.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="ml-3 flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                                            {teamType.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            ID: {String(teamType._id).slice(-8)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="ml-4 flex-shrink-0">
                                                    <Action teamType={teamType} setData={setData} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Pagination */}
                {count > 0 && (
                    <div className="mt-8">
                        <Pagination count={count} />
                    </div>
                )}

                {/* Add/Edit Modal */}
                {open && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            {/* Background overlay */}
                            <div 
                                className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm"
                                onClick={() => setOpen(false)}
                            ></div>

                            {/* Modal panel */}
                            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full mx-4">
                                <div className="bg-white px-6 pt-6 pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                            <AddTeamType setData={setData} setOpen={setOpen} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

type ActionProps = {
    teamType: TeamType
    setData: React.Dispatch<React.SetStateAction<TeamType[]>>
}

const Action = ({ teamType, setData }: ActionProps) => {
    const [edit, setEdit] = useState(false)
    const [deletePopup, setDeletePopup] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        await deleteTeamType(teamType._id as string).then(() => {
            setData((prev) => prev.filter((item) => item._id !== teamType._id))
            setDeletePopup(false)
        }).finally(() => setLoading(false))
    }

    return (
        <>
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setEdit(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="hidden sm:inline">Edit</span>
                </button>
                <button 
                    onClick={() => setDeletePopup(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="hidden sm:inline">Delete</span>
                </button>
            </div>

            {/* Edit Modal */}
            {edit && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div 
                            className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm"
                            onClick={() => setEdit(false)}
                        ></div>

                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full mx-4">
                            <div className="bg-white px-6 pt-6 pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                        <AddTeamType setData={setData} setOpen={setEdit} isEdit={true} editData={teamType} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletePopup && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div 
                            className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm"
                            onClick={() => !loading && setDeletePopup(false)}
                        ></div>

                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full mx-4">
                            <div className="bg-white px-6 pt-6 pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-semibold text-gray-900">
                                            Delete Team Type
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-600">
                                                Are you sure you want to delete &quot;{teamType.title}&quot;? This action cannot be undone and will affect all associated team members.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse rounded-b-2xl">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="w-full inline-flex justify-center items-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Deleting...
                                        </>
                                    ) : (
                                        'Delete'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => !loading && setDeletePopup(false)}
                                    disabled={loading}
                                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

// Custom Pagination Component
const Pagination = ({ count }: { count: number }) => {
    const searchParams = useSearchParams()

    const filter = {
        page: searchParams.get('page') ? Number(searchParams.get('page')) : 0,
        pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 10,
    }

    const isPreviousDisabled = filter.page === 0
    const isNextDisabled = (filter.page + 1) * filter.pageSize >= count
    const totalPages = Math.ceil(count / filter.pageSize)

    return (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <div className="flex items-center gap-2">
                {filter.page > 0 && (
                    <a href={`?page=${filter.page - 1}&pageSize=${filter.pageSize}`}>
                        <button
                            disabled={isPreviousDisabled}
                            className={`
                                inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                                ${isPreviousDisabled 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm hover:shadow-md'
                                }
                            `}
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous
                        </button>
                    </a>
                )}

                <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + 1
                        const isActive = filter.page + 1 === pageNum
                        return (
                            <a key={pageNum} href={`?page=${pageNum - 1}&pageSize=${filter.pageSize}`}>
                                <button
                                    className={`
                                        px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                                        ${isActive 
                                            ? 'bg-blue-600 text-white shadow-md' 
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm hover:shadow-md'
                                        }
                                    `}
                                >
                                    {pageNum}
                                </button>
                            </a>
                        )
                    })}
                </div>

                {(filter.page + 1) * filter.pageSize < count && (
                    <a href={`?page=${filter.page + 1}&pageSize=${filter.pageSize}`}>
                        <button
                            disabled={isNextDisabled}
                            className={`
                                inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                                ${isNextDisabled 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm hover:shadow-md'
                                }
                            `}
                        >
                            Next
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </a>
                )}
            </div>

            <div className="text-sm text-gray-600">
                Showing {filter.page * filter.pageSize + 1} to {Math.min((filter.page + 1) * filter.pageSize, count)} of {count} results
            </div>
        </div>
    )
}

export default AdminTeamType