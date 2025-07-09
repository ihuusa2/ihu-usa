'use client'
import type { CourseType } from "@/Types/Courses";
import { H1 } from '@/components/Headings/index'
import React, { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner'
import { deleteCourseType, getAllCourseTypes } from '@/Server/CourseType'
import Pagination from '@/components/Pagination'
import { useSearchParams } from 'next/navigation'
import AddCourseType from "../../components/AddCourseType";

const AdminCourseType = () => {
    const searchParams = useSearchParams()
    const [data, setData] = useState<CourseType[]>([])
    const [loading, setLoading] = useState(true)
    const [count, setCount] = useState(0)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        (async () => {
            setLoading(true)
            await getAllCourseTypes({ searchParams: Object.fromEntries(searchParams.entries()) }).then((courseTypes) => {
                if (courseTypes) {
                    setData(courseTypes.list)
                    setCount(courseTypes.count)
                }
            }).finally(() => {
                setLoading(false)
            })
        })()
    }, [searchParams])

    return (
        <div className='max-w-7xl mx-auto w-full py-10 flex flex-col gap-5'>
            <div className='flex justify-between items-center'>
                <H1>Course Types</H1>
                <button 
                    onClick={() => setOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Add Course Type
                </button>
            </div>

            {/* Custom Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={2} className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <Spinner />
                                        </div>
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="px-6 py-4 text-center text-gray-500">
                                        No course types found
                                    </td>
                                </tr>
                            ) : (
                                data.map((courseType, index) => (
                                    <tr key={courseType._id?.toString() || `course-type-${index}`} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {courseType.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <Action courseType={courseType} setData={setData} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination count={count} />

            {/* Custom Modal */}
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[95vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Add Course Type</h3>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <AddCourseType setData={setData} setOpen={setOpen} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

type ActionProps = {
    courseType: CourseType
    setData: React.Dispatch<React.SetStateAction<CourseType[]>>
}

const Action = ({ courseType, setData }: ActionProps) => {
    const [edit, setEdit] = useState(false)
    const [deletePopup, setDeletePopup] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        await deleteCourseType(courseType._id as string).then(() => {
            setData((prev) => prev.filter((ct) => ct._id !== courseType._id))
            setDeletePopup(false)
        }).finally(() => setLoading(false))
    }

    return (
        <>
            <div className='flex items-center gap-2'>
                <button 
                    onClick={() => setEdit(true)}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-1.5 px-3 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                >
                    Edit
                </button>
                <button 
                    onClick={() => setDeletePopup(true)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-1.5 px-3 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                >
                    Delete
                </button>
            </div>

            {/* Edit Modal */}
            {edit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[95vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Edit Course Type</h3>
                            <button
                                onClick={() => setEdit(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <AddCourseType setData={setData} setOpen={setEdit} isEdit={true} editData={courseType} />
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletePopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Course Type</h3>
                            <p className="text-gray-600 mb-6">Are you sure you want to delete this course type?</p>
                            <div className='flex justify-end gap-3'>
                                <button 
                                    onClick={() => !loading && setDeletePopup(false)}
                                    disabled={loading}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading ? <Spinner /> : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AdminCourseType