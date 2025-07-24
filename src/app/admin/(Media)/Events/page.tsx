'use client'

import type { Events } from "@/Types/Gallery";
import { H1 } from '@/components/Headings/index'
import React, { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner'
import { ColumnDef, Row, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { deleteEvent, getAllEvents } from '@/Server/Events'
import Pagination from '@/components/Pagination'
import { useSearchParams } from 'next/navigation'
import AddEvent from "../../components/AddEvents";
import Image from "next/image";
import { formatDate } from '@/utils/dateFormatter';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaPlus, FaEdit, FaTrash, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation'

// Custom Modal Component
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, maxWidth = "max-w-4xl" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[95vh] overflow-hidden`}>
                {title && (
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </div>
                )}
                <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Custom Table Component
interface CustomTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    loading?: boolean;
}

const CustomTable = <TData,>({ data, columns, loading = false }: CustomTableProps<TData>) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spinner />
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCalendarAlt className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600">Get started by creating your first event.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="text-left py-4 px-6 font-semibold text-gray-700"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr
                            key={row.id}
                            className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-150"
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="py-4 px-6 align-top">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const AdminEvents = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [data, setData] = useState<Events[]>([])
    const [loading, setLoading] = useState(true)
    const [count, setCount] = useState(0)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<Events | null>(null)
    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [sortOrder] = useState('desc') // Always descending

    // Update URL params when search or sort changes
    useEffect(() => {
        const params = new URLSearchParams(Array.from(searchParams.entries()))
        if (search) params.set('search', search)
        else params.delete('search')
        if (sortOrder) params.set('sortOrder', sortOrder)
        else params.delete('sortOrder')
        params.set('sortBy', 'date')
        router.replace(`?${params.toString()}`)
        // eslint-disable-next-line
    }, [search, sortOrder])

    useEffect(() => {
        (async () => {
            setLoading(true)
            await getAllEvents({ searchParams: Object.fromEntries(searchParams.entries()) }).then((events) => {
                if (events && events?.list?.length > 0) {
                    setData(events.list)
                    setCount(events.count)
                } else {
                    setData([])
                    setCount(0)
                }
            }).finally(() => {
                setLoading(false)
            })
        })()
    }, [searchParams])

    // Calculate statistics
    const totalEvents = data.length
    const pastEvents = data.filter(event => new Date(event.date) <= new Date()).length
    const eventsWithImages = data.filter(event => event.image && event.image !== '').length
    const upcomingEvents = data.filter(event => new Date(event.date) > new Date())

    const columns: ColumnDef<Events>[] = [
        {
            accessorKey: "title",
            header: () => (
                <div className="flex items-center gap-2 font-semibold text-gray-700">
                    <FaCalendarAlt className="w-4 h-4 text-blue-500" />
                    Event Details
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-start gap-4 py-2">
                    <div className="relative">
                        {row.original.image ? (
                            <Image
                                src={row.original.image as string}
                                alt={row.original.title}
                                width={60}
                                height={60}
                                className="w-15 h-15 rounded-lg object-cover border-2 border-gray-200"
                            />
                        ) : (
                            <div className="w-15 h-15 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border-2 border-gray-200">
                                <FaCalendarAlt className="w-6 h-6 text-blue-500" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                            {row.original.title}
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                            {row.original.description || 'No description available'}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "date",
            header: () => (
                <div className="flex items-center gap-2 font-semibold text-gray-700">
                    <FaCalendarAlt className="w-4 h-4 text-green-500" />
                    Date & Location
                </div>
            ),
            cell: ({ row }) => (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <FaCalendarAlt className="w-3 h-3 text-green-500" />
                        <span className="text-sm font-medium text-gray-900">
                            {formatDate(row.original.date)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="w-3 h-3 text-red-500" />
                        <span className="text-sm text-gray-600">
                            {row.original.location || 'No location specified'}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "attendees",
            header: () => (
                <div className="flex items-center gap-2 font-semibold text-gray-700">
                    <FaUsers className="w-4 h-4 text-purple-500" />
                    Attendees
                </div>
            ),
            cell: ({ row }) => (
                <div className="space-y-1">
                    {row.original.attendees && row.original.attendees.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {row.original.attendees.slice(0, 2).map((attendee, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200"
                                >
                                    {attendee}
                                </span>
                            ))}
                            {row.original.attendees.length > 2 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                    +{row.original.attendees.length - 2} more
                                </span>
                            )}
                        </div>
                    ) : (
                        <span className="text-xs text-gray-500 italic">No attendees specified</span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "link",
            header: () => (
                <div className="flex items-center gap-2 font-semibold text-gray-700">
                    <FaExternalLinkAlt className="w-4 h-4 text-blue-500" />
                    Link
                </div>
            ),
            cell: ({ row }) => (
                row.original.link ? (
                    <a
                        href={row.original.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
                    >
                        <FaExternalLinkAlt className="w-3 h-3" />
                        View
                    </a>
                ) : (
                    <span className="text-xs text-gray-500 italic">No link available</span>
                )
            ),
        },
        {
            accessorKey: "action",
            header: () => (
                <div className="flex items-center gap-2 font-semibold text-gray-700">
                    Actions
                </div>
            ),
            cell: ({ row }) => <Action row={row} setData={setData} setEditingEvent={setEditingEvent} setIsEditModalOpen={setIsEditModalOpen} />
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-200 shadow-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <FaCalendarAlt className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <H1 className="text-2xl font-bold text-gray-900 mb-1">Events Management</H1>
                                    <p className="text-gray-600 text-sm">Manage your events and activities</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsAddModalOpen(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                <FaPlus className="w-4 h-4" />
                                Add New Event
                            </button>
                        </div>
                    </div>

                    {/* Search and Sort Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                    </div>
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600 mb-1">Total Events</p>
                                    <p className="text-2xl font-bold text-gray-900">{totalEvents}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                    <FaCalendarAlt className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Event Box (moved here) */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-green-200 shadow-lg hover:shadow-xl transition-all duration-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600 mb-1">Upcoming Events</p>
                                    <p className="text-2xl font-bold text-gray-900">{upcomingEvents.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                    <FaCalendarAlt className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-600 mb-1">Past Events</p>
                                    <p className="text-2xl font-bold text-gray-900">{pastEvents}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <FaCalendarAlt className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-orange-600 mb-1">With Images</p>
                                    <p className="text-2xl font-bold text-gray-900">{eventsWithImages}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                                    <FaCalendarAlt className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>



                    {/* Events Table Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-200 shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-500/10 to-amber-500/10">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                                    <FaCalendarAlt className="w-5 h-5 text-orange-500" />
                                    All Events ({totalEvents})
                                </h2>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                                        {pastEvents} Past
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Spinner />
                                </div>
                            ) : data.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaCalendarAlt className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                                    <p className="text-gray-600 mb-6">Get started by creating your first event.</p>
                                    <button 
                                        onClick={() => setIsAddModalOpen(true)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200"
                                    >
                                        <FaPlus className="w-4 h-4" />
                                        Add First Event
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <CustomTable
                                        data={JSON.parse(JSON.stringify(data))}
                                        columns={columns}
                                        loading={loading}
                                    />
                                    <div className="mt-6 pt-4 border-t border-gray-200">
                                        <Pagination count={count} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Event Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Event"
                maxWidth="max-w-4xl"
            >
                <div className="p-6">
                    <AddEvent setData={setData} setOpen={setIsAddModalOpen} />
                </div>
            </Modal>

            {/* Edit Event Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setEditingEvent(null)
                }}
                title="Edit Event"
                maxWidth="max-w-4xl"
            >
                <div className="p-6">
                    {editingEvent && (
                        <AddEvent 
                            setData={setData} 
                            setOpen={() => {
                                setIsEditModalOpen(false)
                                setEditingEvent(null)
                            }} 
                            isEdit={true} 
                            editData={editingEvent} 
                        />
                    )}
                </div>
            </Modal>
        </div>
    )
}

type ActionProps = {
    row: Row<Events>
    setData: React.Dispatch<React.SetStateAction<Events[]>>
    setEditingEvent: React.Dispatch<React.SetStateAction<Events | null>>
    setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Action = ({ row, setData, setEditingEvent, setIsEditModalOpen }: ActionProps) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleEdit = () => {
        setEditingEvent(row.original)
        setIsEditModalOpen(true)
    }

    const handleDelete = async () => {
        setLoading(true)
        await deleteEvent(row.original._id as string).then(() => {
            setData((prev) => prev.filter((event) => event._id !== row.original._id))
            setIsDeleteModalOpen(false)
        }).finally(() => setLoading(false))
    }

    return (
        <>
            <div className='flex items-center gap-2'>
                <button 
                    onClick={handleEdit}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
                >
                    <FaEdit className="w-3 h-3" />
                    Edit
                </button>
                <button 
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 border border-red-200"
                >
                    <FaTrash className="w-3 h-3" />
                    Delete
                </button>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => !loading && setIsDeleteModalOpen(false)}
                title="Delete Event"
                maxWidth="max-w-md"
            >
                <div className='p-6 space-y-4'>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                            Are you sure you want to delete <strong>&quot;{row.original.title}&quot;</strong>? This action cannot be undone.
                        </p>
                    </div>
                    <div className='flex justify-end gap-3 pt-2'>
                        <button 
                            onClick={() => !loading && setIsDeleteModalOpen(false)} 
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleDelete} 
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        >
                            {loading ? <Spinner /> : <FaTrash className="w-3 h-3" />}
                            {loading ? 'Deleting...' : 'Delete Event'}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default AdminEvents