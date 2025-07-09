'use client'

import type { Webinars } from "@/Types/Gallery";
import React, { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner'
import { ColumnDef, Row } from "@tanstack/react-table"
import { deleteWebinar as deleteWebinarAPI, getAllWebinars } from '@/Server/Webinars'
import Pagination from '@/components/Pagination'
import { useSearchParams } from 'next/navigation'
import { DataTable } from '@/components/ui/data-table'
import AddWebinars from "../../components/AddWebinars";
import Image from "next/image";
import { formatDate } from '@/utils/dateFormatter';
import { FaCalendar, FaMapMarkerAlt, FaUsers, FaImage, FaExternalLinkAlt, FaEdit, FaTrash, FaTimes, FaPlus } from 'react-icons/fa';

const AdminWebinars = () => {
    const searchParams = useSearchParams()
    const [data, setData] = useState<Webinars[]>([])
    const [loading, setLoading] = useState(true)
    const [count, setCount] = useState(0)
    const [open, setOpen] = useState(false)
    const [deleteWebinar, setDeleteWebinar] = useState<Webinars | null>(null)
    const [editWebinar, setEditWebinar] = useState<Webinars | null>(null)

    const [imageViewModal, setImageViewModal] = useState<{ isOpen: boolean; src: string; alt: string }>({
        isOpen: false,
        src: '',
        alt: ''
    });

    useEffect(() => {
        (async () => {
            setLoading(true)
            await getAllWebinars({ searchParams: Object.fromEntries(searchParams.entries()) }).then((data) => {
                if (data && data?.list?.length > 0) {
                    setData(data.list)
                    setCount(data.count)
                }
            }).finally(() => {
                setLoading(false)
            })
        })()
    }, [searchParams])

    // Calculate statistics
    const totalWebinars = data.length;
    const upcomingWebinars = data.filter(webinar => new Date(webinar.date) > new Date()).length;
    const pastWebinars = data.filter(webinar => new Date(webinar.date) <= new Date()).length;
    const webinarsWithImages = data.filter(webinar => webinar.image && typeof webinar.image === 'string' && webinar.image.trim() !== '').length;

    const openImageModal = (src: string, alt: string) => {
        setImageViewModal({ isOpen: true, src, alt });
    };

    const closeImageModal = () => {
        setImageViewModal({ isOpen: false, src: '', alt: '' });
    };

    const columns: ColumnDef<Webinars>[] = [
        {
            accessorKey: "webinarDetails",
            header: () => (
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                    <FaCalendar className="text-emerald-500" />
                    Webinar Details
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-start gap-3 max-w-sm">
                    {row.original.image && (
                        <div 
                            className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => openImageModal(row.original.image as string, row.original.title)}
                        >
                            <Image
                                src={row.original.image as string} 
                                alt={row.original.title}
                                width={64} 
                                height={64}
                                className="w-16 h-16 object-cover rounded-lg border-2 border-emerald-200 hover:border-emerald-400 transition-colors"
                            />
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                            {row.original.title}
                        </h3>
                        <p className="text-gray-600 text-xs line-clamp-2 mb-2">
                            {row.original.description}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit">
                            <FaCalendar className="text-[10px]" />
                            {formatDate(row.original.date)}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "locationAndAttendees",
            header: () => (
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                    <FaMapMarkerAlt className="text-blue-500" />
                    Location & Attendees
                </div>
            ),
            cell: ({ row }) => (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <FaMapMarkerAlt className="text-blue-500 text-xs flex-shrink-0" />
                        <span className="text-gray-700 truncate max-w-[150px]" title={row.original.location}>
                            {row.original.location}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaUsers className="text-purple-500 text-xs flex-shrink-0" />
                        <div className="flex flex-wrap gap-1">
                            {row.original.attendees.slice(0, 2).map((attendee, index) => (
                                <span key={index} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                    {attendee}
                                </span>
                            ))}
                            {row.original.attendees.length > 2 && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                    +{row.original.attendees.length - 2}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "webinarLink",
            header: () => (
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                    <FaExternalLinkAlt className="text-indigo-500" />
                    Webinar Link
                </div>
            ),
            cell: ({ row }) => (
                <div className="space-y-2">
                    {row.original.link ? (
                        <a 
                            href={row.original.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-500 text-white text-xs rounded-lg hover:bg-indigo-600 transition-colors"
                        >
                            <FaExternalLinkAlt />
                            Join Webinar
                        </a>
                    ) : (
                        <span className="text-gray-400 text-xs">No Link</span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "action",
            header: () => (
                <div className="text-gray-700 font-semibold text-center">
                    Actions
                </div>
            ),
            cell: ({ row }) => <Action row={row} setDeleteWebinar={setDeleteWebinar} setEditWebinar={setEditWebinar} />
        },
    ]

    if (loading) {
    return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <Spinner />
                    <p className="mt-4 text-gray-600">Loading webinars...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 px-4 sm:px-6 lg:px-8">
            <div className="w-full py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                Webinars Management
                            </h1>
                            <p className="text-gray-600 mt-1">Manage your webinars and online events</p>
                        </div>
                        <button
                            onClick={() => setOpen(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <FaPlus />
                            Add Webinar
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-emerald-600 text-sm font-medium">Total Webinars</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{totalWebinars}</p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
                                <FaCalendar className="text-white text-xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-600 text-sm font-medium">Upcoming</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{upcomingWebinars}</p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl">
                                <FaCalendar className="text-white text-xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-600 text-sm font-medium">Past Events</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{pastWebinars}</p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                                <FaCalendar className="text-white text-xl" />
                            </div>
                        </div>
            </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-teal-100 hover:shadow-xl transition-all duration-200">
                        <div className="flex items-center justify-between">
            <div>
                                <p className="text-teal-600 text-sm font-medium">With Images</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{webinarsWithImages}</p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl">
                                <FaImage className="text-white text-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
                    <div className="p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                        <h2 className="text-xl font-semibold text-gray-900">All Webinars</h2>
                        <p className="text-gray-600 text-sm mt-1">
                            {totalWebinars} webinar{totalWebinars !== 1 ? 's' : ''} total
                        </p>
                    </div>
                    
                    {data.length === 0 ? (
                        <div className="text-center py-12">
                            <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No webinars found</h3>
                            <p className="text-gray-500 mb-6">Get started by creating your first webinar</p>
                            <button
                                onClick={() => setOpen(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200"
                            >
                                <FaPlus />
                                Add Your First Webinar
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                        <DataTable
                            classNames={{
                                    tableCell: 'p-4 border-b border-gray-100',
                                    tableHead: 'p-4 bg-gray-50/50 border-b border-gray-200 font-semibold'
                                }}
                                columns={columns} 
                                data={JSON.parse(JSON.stringify(data))} 
                            />
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {count > 10 && (
                    <div className="mt-8">
                        <Pagination count={count} />
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-white">Add New Webinar</h2>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                            <AddWebinars setData={setData} setOpen={setOpen} />
                        </div>
                    </div>
                </div>
            )}

            {/* Image View Modal */}
            {imageViewModal.isOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-white">Webinar Image</h3>
                            <button
                                onClick={closeImageModal}
                                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="p-6">
                            <Image
                                src={imageViewModal.src}
                                alt={imageViewModal.alt}
                                width={800}
                                height={600}
                                className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editWebinar && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-white">Edit Webinar</h2>
                            <button
                                onClick={() => setEditWebinar(null)}
                                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                            <AddWebinars 
                                key={String(editWebinar._id)} 
                                setData={setData} 
                                setOpen={(value: boolean | ((prev: boolean) => boolean)) => {
                                    const shouldClose = typeof value === 'boolean' ? !value : !value(true);
                                    if (shouldClose) {
                                        setEditWebinar(null);
                                    }
                                }} 
                                isEdit={true} 
                                editData={editWebinar} 
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteWebinar && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto transform scale-100 opacity-100 transition-all duration-300">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 px-8 py-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                                        <FaTrash className="text-lg text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Delete Webinar</h3>
                                </div>
                                <button
                                    onClick={() => setDeleteWebinar(null)}
                                    className="rounded-full p-2 text-white transition-colors hover:bg-white/20"
                                >
                                    <FaTimes className="text-lg" />
                                </button>
                            </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-8">
                            <div className="text-center mb-8">
                                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 border-4 border-red-200">
                                    <FaTrash className="text-3xl text-red-500" />
                                </div>
                                <h4 className="mb-4 text-2xl font-bold text-gray-900">Are you absolutely sure?</h4>
                                <div className="text-base text-gray-600 leading-relaxed">
                                    <p className="mb-2">This action cannot be undone. This will permanently delete:</p>
                                    <p className="font-semibold text-gray-800 bg-gray-100 px-4 py-2 rounded-lg">
                                        &quot;{deleteWebinar.title}&quot;
                                    </p>
                                    <p className="mt-2 text-sm text-red-600">All associated data will be permanently removed.</p>
                                </div>
                            </div>
                            
                            {/* Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setDeleteWebinar(null)}
                                    className="flex-1 rounded-xl border-2 border-gray-300 px-6 py-4 text-lg font-semibold text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={async () => {
                                        const webinarToDelete = deleteWebinar;
                                        setDeleteWebinar(null);
                                        await deleteWebinarAPI(webinarToDelete._id as string);
                                        setData((prev) => prev.filter((d) => d._id !== webinarToDelete._id));
                                    }}
                                    className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:from-red-600 hover:to-pink-600 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300"
                                >
                                    <FaTrash className="text-lg" />
                                    <span>Delete Webinar</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

type ActionProps = {
    row: Row<Webinars>
    setDeleteWebinar: React.Dispatch<React.SetStateAction<Webinars | null>>
    setEditWebinar: React.Dispatch<React.SetStateAction<Webinars | null>>
}

const Action = ({ row, setDeleteWebinar, setEditWebinar }: ActionProps) => {
    return (
        <div className='flex items-center justify-center gap-1'>
            <button 
                onClick={() => setEditWebinar(row.original)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit webinar"
            >
                <FaEdit />
            </button>
            <button 
                onClick={() => setDeleteWebinar(row.original)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete webinar"
            >
                <FaTrash />
            </button>
        </div>
    )
}

export default AdminWebinars