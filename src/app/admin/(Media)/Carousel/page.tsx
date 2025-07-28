'use client'

import type { CarouselImage } from "@/Types/Carousel";
import { H1 } from '@/components/Headings/index'
import React, { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner'
import { ColumnDef, Row, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { deleteCarouselImage, getAllCarouselImages } from '@/Server/Carousel'
import Pagination from '@/components/Pagination'
import { useSearchParams } from 'next/navigation'
import AddCarouselImage from "../../components/AddCarouselImage";
import Image from "next/image";
import { FaImages, FaPlus, FaEdit, FaTrash, FaEye, FaImage, FaTimes, FaSort, FaToggleOn, FaToggleOff, FaArrowsAltV } from 'react-icons/fa';

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
    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
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

const AdminCarousel = () => {
    const searchParams = useSearchParams()
    const [data, setData] = useState<CarouselImage[]>([])
    const [loading, setLoading] = useState(true)
    const [count, setCount] = useState(0)
    const [open, setOpen] = useState(false)
    const [viewImage, setViewImage] = useState<string | null>(null)

    useEffect(() => {
        (async () => {
            setLoading(true)
            await getAllCarouselImages().then((carouselImages) => {
                if (carouselImages && carouselImages?.length > 0) {
                    setData(carouselImages)
                    setCount(carouselImages.length)
                }
            }).finally(() => {
                setLoading(false)
            })
        })()
    }, [searchParams])

    // Calculate statistics
    const totalImages = data.length
    const activeImages = data.filter(image => image.isActive).length
    const imagesWithTitles = data.filter(image => image.title && image.title.trim() !== '').length
    const imagesWithDescriptions = data.filter(image => image.description && image.description.trim() !== '').length

    const formatDate = (date: Date | undefined) => {
        if (!date) return 'Not set'
        return new Date(date).toLocaleDateString()
    }

    const columns: ColumnDef<CarouselImage>[] = [
        {
            accessorKey: "src",
            header: () => (
                <div className="flex items-center gap-2 font-semibold text-gray-700">
                    <FaImage className="w-4 h-4 text-blue-500" />
                    Carousel Image Details
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-start gap-4 py-2">
                    <div className="relative">
                        <Image
                            src={row.original.src}
                            alt={row.original.alt}
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-lg object-cover border-2 border-blue-200 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
                            onClick={() => setViewImage(row.original.src)}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
                            <FaEye className="w-4 h-4 text-white" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                            {row.original.title || 'No title'}
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                            {row.original.description || 'No description available'}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                            {row.original.isActive ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                    <FaToggleOn className="w-3 h-3 mr-1" />
                                    Active
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                    <FaToggleOff className="w-3 h-3 mr-1" />
                                    Inactive
                                </span>
                            )}
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                <FaSort className="w-3 h-3 mr-1" />
                                {row.original.displayOrder}
                            </span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "alt",
            header: () => (
                <div className="flex items-center gap-2 font-semibold text-gray-700">
                    <FaImages className="w-4 h-4 text-purple-500" />
                    Alt Text & Info
                </div>
            ),
            cell: ({ row }) => (
                <div className="space-y-3">
                    <div>
                        <p className="text-sm text-gray-900 font-medium">Alt Text:</p>
                        <p className="text-xs text-gray-600 break-all">
                            {row.original.alt}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                            <FaArrowsAltV className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">Order: {row.original.displayOrder}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <FaTimes className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">Created: {formatDate(row.original.createdAt)}</span>
                        </div>
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <FaImages className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <H1 className="text-2xl font-bold text-gray-900 mb-1">Carousel Management</H1>
                                    <p className="text-gray-600 text-sm">Manage hero carousel images for the home screen</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setOpen(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                <FaPlus className="w-4 h-4" />
                                Add New Image
                            </button>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600 mb-1">Total Images</p>
                                    <p className="text-2xl font-bold text-gray-900">{totalImages}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                    <FaImages className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-green-200 shadow-lg hover:shadow-xl transition-all duration-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600 mb-1">Active Images</p>
                                    <p className="text-2xl font-bold text-gray-900">{activeImages}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                    <FaToggleOn className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-600 mb-1">With Titles</p>
                                    <p className="text-2xl font-bold text-gray-900">{imagesWithTitles}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <FaImage className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-indigo-200 shadow-lg hover:shadow-xl transition-all duration-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-indigo-600 mb-1">With Descriptions</p>
                                    <p className="text-2xl font-bold text-gray-900">{imagesWithDescriptions}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <FaImages className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Carousel Images Table Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200 shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                                    <FaImages className="w-5 h-5 text-blue-500" />
                                    Carousel Images ({totalImages})
                                </h2>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                        {activeImages} active
                                    </span>
                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                        {imagesWithTitles} with titles
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
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No carousel images found</h3>
                                    <p className="text-gray-600 mb-6">Start building your carousel by adding your first hero image.</p>
                                    <button 
                                        onClick={() => setOpen(true)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200"
                                    >
                                        <FaPlus className="w-4 h-4" />
                                        Add First Image
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

            {/* Add Carousel Image Modal */}
            <Modal isOpen={open} onClose={() => setOpen(false)}>
                <ModalHeader onClose={() => setOpen(false)}>
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FaPlus className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Add New Carousel Image</h2>
                </ModalHeader>
                <ModalContent>
                    <AddCarouselImage setData={setData} setOpen={setOpen} />
                </ModalContent>
            </Modal>

            {/* Image View Modal */}
            <Modal isOpen={!!viewImage} onClose={() => setViewImage(null)}>
                <ModalHeader onClose={() => setViewImage(null)}>
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FaEye className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">View Carousel Image</h2>
                </ModalHeader>
                <ModalContent>
                    {viewImage && (
                        <div className="flex items-center justify-center">
                            <Image
                                src={viewImage}
                                alt="Carousel image preview"
                                width={800}
                                height={600}
                                className="max-w-full max-h-[60vh] object-contain rounded-lg border border-gray-200"
                            />
                        </div>
                    )}
                </ModalContent>
            </Modal>

            {/* Edit Carousel Image Modal - Outside Table */}
            <EditCarouselImageModal setData={setData} />
        </div>
    )
}

// Edit Carousel Image Modal Component - Outside the main component
const EditCarouselImageModal = ({ setData }: { setData: React.Dispatch<React.SetStateAction<CarouselImage[]>> }) => {
    const [editData, setEditData] = useState<CarouselImage | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    // Global function to open edit modal
    const openEditModal = (data: CarouselImage) => {
        setEditData(data)
        setIsOpen(true)
    }

    // Expose the function globally
    React.useEffect(() => {
        (window as { openEditCarouselImageModal?: (data: CarouselImage) => void }).openEditCarouselImageModal = openEditModal
        return () => {
            delete (window as { openEditCarouselImageModal?: (data: CarouselImage) => void }).openEditCarouselImageModal
        }
    }, [])

    return (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <ModalHeader onClose={() => setIsOpen(false)}>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <FaEdit className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Edit Carousel Image</h2>
            </ModalHeader>
            <ModalContent>
                {editData && (
                    <AddCarouselImage 
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
    row: Row<CarouselImage>
    setData: React.Dispatch<React.SetStateAction<CarouselImage[]>>
}

const Action = ({ row, setData }: ActionProps) => {
    const [deletePopup, setDeletePopup] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        await deleteCarouselImage(row.original._id as string).then(() => {
            setData((prev) => prev.filter((image) => image._id !== row.original._id))
            setDeletePopup(false)
        }).finally(() => setLoading(false))
    }

    const handleEdit = () => {
        // Use the global edit modal
        const globalEditModal = (window as { openEditCarouselImageModal?: (data: CarouselImage) => void }).openEditCarouselImageModal
        if (globalEditModal) {
            globalEditModal(row.original)
        }
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
                    <h2 className="text-xl font-semibold text-gray-900">Delete Carousel Image</h2>
                </ModalHeader>
                <ModalContent>
                    <div className='space-y-4'>
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800">
                                Are you sure you want to delete <strong>&quot;{row.original.title || 'this image'}&quot;</strong>? This action cannot be undone.
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
                                {loading ? 'Deleting...' : 'Delete Image'}
                            </button>
                        </div>
                    </div>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AdminCarousel 