'use client'

import type { PhotoGallery } from "@/Types/Gallery";
import { H1 } from '@/components/Headings/index'
import React, { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner'
import { ColumnDef, Row, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { deletePhoto, getAllPhotos } from '@/Server/PhotoGallery'
import Pagination from '@/components/Pagination'
import { useSearchParams } from 'next/navigation'
import AddPhotoGallery from "../../components/AddPhotoGallery";
import Image from "next/image";
import { FaImages, FaPlus, FaEdit, FaTrash, FaEye, FaImage, FaTimes } from 'react-icons/fa';

// Custom Modal Components
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, className = "" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
                onClick={onClose}
            />
            <div className={`relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden ${className}`}>
                {children}
            </div>
        </div>
    );
};

const ModalHeader: React.FC<{ children: React.ReactNode; onClose?: () => void }> = ({ children, onClose }) => (
    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center gap-3">
            {children}
        </div>
        {onClose && (
            <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
                <FaTimes className="w-5 h-5" />
            </button>
        )}
    </div>
);

const ModalContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
        {children}
    </div>
);

// Custom Table Component
interface CustomDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

const CustomDataTable = <TData, TValue>({ columns, data }: CustomDataTableProps<TData, TValue>) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50/50">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="border-b border-gray-200">
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
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
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
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="h-24 text-center text-gray-500">
                                No Data Found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const AdminPhotoGallery = () => {
    const searchParams = useSearchParams()
    const [data, setData] = useState<PhotoGallery[]>([])
    const [loading, setLoading] = useState(true)
    const [count, setCount] = useState(0)
    const [open, setOpen] = useState(false)
    const [viewImage, setViewImage] = useState<string | null>(null)

    useEffect(() => {
        (async () => {
            setLoading(true)
            await getAllPhotos({ searchParams: Object.fromEntries(searchParams.entries()) }).then((photos) => {
                if (photos && photos?.list?.length > 0) {
                    setData(photos.list)
                    setCount(photos.count)
                }
            }).finally(() => {
                setLoading(false)
            })
        })()
    }, [searchParams])

    // Calculate statistics
    const totalPhotos = data.length
    const photosWithDescription = data.filter(photo => photo.description && photo.description.trim() !== '').length
    const recentPhotos = data.filter(() => {
        // Assuming photos have a date field or we can use _id for recent check
        return true // For now, showing all as recent
    }).length

    const columns: ColumnDef<PhotoGallery>[] = [
        {
            accessorKey: "image",
            header: () => (
                <div className="flex items-center gap-2 font-semibold text-gray-700">
                    <FaImage className="w-4 h-4 text-purple-500" />
                    Photo Details
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-start gap-4 py-2">
                    <div className="relative">
                        <Image
                            src={row.original.image as string}
                            alt={row.original.title}
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-lg object-cover border-2 border-purple-200 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
                            onClick={() => setViewImage(row.original.image as string)}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
                            <FaEye className="w-4 h-4 text-white" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                            {row.original.title}
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                            {row.original.description || 'No description available'}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "title",
            header: () => (
                <div className="flex items-center gap-2 font-semibold text-gray-700">
                    <FaImages className="w-4 h-4 text-pink-500" />
                    Title & Description
                </div>
            ),
            cell: ({ row }) => (
                <div className="space-y-2">
                    <div>
                        <h4 className="font-medium text-gray-900 text-sm mb-1">
                            {row.original.title}
                        </h4>
                        {row.original.description ? (
                            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                                {row.original.description}
                            </p>
                        ) : (
                            <span className="text-xs text-gray-400 italic">No description</span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                            Image
                        </span>
                        {row.original.description && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800 border border-pink-200">
                                Description
                            </span>
                        )}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "action",
            header: () => (
                <div className="flex items-center gap-2 font-semibold text-gray-700">
                    Actions
                </div>
            ),
            cell: ({ row }) => <Action row={row} setData={setData} />
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-200 shadow-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <FaImages className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <H1 className="text-2xl font-bold text-gray-900 mb-1">Photo Gallery</H1>
                                    <p className="text-gray-600 text-sm">Manage your photo collection and gallery</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setOpen(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                <FaPlus className="w-4 h-4" />
                                Add New Photo
                            </button>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-600 mb-1">Total Photos</p>
                                    <p className="text-2xl font-bold text-gray-900">{totalPhotos}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <FaImages className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-pink-200 shadow-lg hover:shadow-xl transition-all duration-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-pink-600 mb-1">With Description</p>
                                    <p className="text-2xl font-bold text-gray-900">{photosWithDescription}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                                    <FaImage className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-rose-200 shadow-lg hover:shadow-xl transition-all duration-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-rose-600 mb-1">Recent Photos</p>
                                    <p className="text-2xl font-bold text-gray-900">{recentPhotos}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-rose-600 rounded-lg flex items-center justify-center">
                                    <FaImages className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-indigo-200 shadow-lg hover:shadow-xl transition-all duration-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-indigo-600 mb-1">Gallery Items</p>
                                    <p className="text-2xl font-bold text-gray-900">{totalPhotos}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <FaImages className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Photo Gallery Table Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                                    <FaImages className="w-5 h-5 text-purple-500" />
                                    Photo Gallery ({totalPhotos})
                                </h2>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                        {photosWithDescription} with description
                                    </span>
                                    <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-medium">
                                        {totalPhotos - photosWithDescription} without description
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Spinner />
                                </div>
                            ) : data.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaImages className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No photos found</h3>
                                    <p className="text-gray-600 mb-6">Start building your photo gallery by adding your first photo.</p>
                                    <button 
                                        onClick={() => setOpen(true)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors duration-200"
                                    >
                                        <FaPlus className="w-4 h-4" />
                                        Add First Photo
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <CustomDataTable
                                        columns={columns} 
                                        data={JSON.parse(JSON.stringify(data))} 
                                    />
                                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
                                        <Pagination count={count} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Photo Modal */}
            <Modal isOpen={open} onClose={() => setOpen(false)}>
                <ModalHeader onClose={() => setOpen(false)}>
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <FaPlus className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Add New Photo</h2>
                </ModalHeader>
                <ModalContent>
                    <AddPhotoGallery setData={setData} setOpen={setOpen} />
                </ModalContent>
            </Modal>

            {/* Image View Modal */}
            <Modal isOpen={!!viewImage} onClose={() => setViewImage(null)}>
                <ModalHeader onClose={() => setViewImage(null)}>
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <FaEye className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">View Photo</h2>
                </ModalHeader>
                <ModalContent>
                    {viewImage && (
                        <div className="flex items-center justify-center">
                            <Image
                                src={viewImage}
                                alt="Gallery photo"
                                width={800}
                                height={600}
                                className="max-w-full max-h-[60vh] object-contain rounded-lg border border-gray-200"
                            />
                        </div>
                    )}
                </ModalContent>
            </Modal>

            {/* Edit Photo Modal - Outside Table */}
            <EditPhotoModal setData={setData} />
        </div>
    )
}

// Edit Photo Modal Component - Outside the main component
const EditPhotoModal = ({ setData }: { setData: React.Dispatch<React.SetStateAction<PhotoGallery[]>> }) => {
    const [editData, setEditData] = useState<PhotoGallery | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    // Global function to open edit modal
    const openEditModal = (data: PhotoGallery) => {
        setEditData(data)
        setIsOpen(true)
    }

    // Expose the function globally
    React.useEffect(() => {
        (window as { openEditPhotoModal?: (data: PhotoGallery) => void }).openEditPhotoModal = openEditModal
        return () => {
            delete (window as { openEditPhotoModal?: (data: PhotoGallery) => void }).openEditPhotoModal
        }
    }, [])

    return (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <ModalHeader onClose={() => setIsOpen(false)}>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <FaEdit className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Edit Photo</h2>
            </ModalHeader>
            <ModalContent>
                {editData && (
                    <AddPhotoGallery 
                        setData={setData} 
                        setOpen={setIsOpen} 
                        isEdit={true} 
                        editData={editData} 
                    />
                )}
            </ModalContent>
        </Modal>
    )
}

type ActionProps = {
    row: Row<PhotoGallery>
    setData: React.Dispatch<React.SetStateAction<PhotoGallery[]>>
}

const Action = ({ row, setData }: ActionProps) => {
    const [deletePopup, setDeletePopup] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        await deletePhoto(row.original._id as string).then(() => {
            setData((prev) => prev.filter((photo) => photo._id !== row.original._id))
            setDeletePopup(false)
        }).finally(() => setLoading(false))
    }

    const handleEdit = () => {
        // Use the global edit modal
        const globalEditModal = (window as { openEditPhotoModal?: (data: PhotoGallery) => void }).openEditPhotoModal
        if (globalEditModal) {
            globalEditModal(row.original)
        }
    }

    return (
        <>
            <div className='flex items-center gap-2'>
                <button 
                    onClick={handleEdit}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200 border border-purple-200"
                >
                    <FaEdit className="w-3 h-3" />
                    Edit
                </button>
                <button 
                    onClick={() => setDeletePopup(true)}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 border border-red-200"
                >
                    <FaTrash className="w-3 h-3" />
                    Delete
                </button>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={deletePopup} onClose={() => !loading && setDeletePopup(false)}>
                <ModalHeader onClose={() => !loading && setDeletePopup(false)}>
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                        <FaTrash className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Delete Photo</h2>
                </ModalHeader>
                <ModalContent>
                    <div className='space-y-4'>
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800">
                                Are you sure you want to delete <strong>&quot;{row.original.title}&quot;</strong>? This action cannot be undone.
                            </p>
                        </div>
                        <div className='flex justify-end gap-3 pt-2'>
                            <button 
                                onClick={() => !loading && setDeletePopup(false)} 
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
                                {loading ? 'Deleting...' : 'Delete Photo'}
                            </button>
                        </div>
                    </div>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AdminPhotoGallery