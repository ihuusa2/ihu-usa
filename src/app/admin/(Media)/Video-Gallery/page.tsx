'use client'

import type { VideoGallery } from "@/Types/Gallery";
import { H1 } from '@/components/Headings/index'
import React, { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { deleteVideo, getAllVideos } from '@/Server/VideoGallery'
import Pagination from '@/components/Pagination'
import { useSearchParams } from 'next/navigation'
import AddVideoGallery from "../../components/AddVideoGallery";
import Image from "next/image";
import { FaVideo, FaPlay, FaPlus, FaEdit, FaTrash, FaExternalLinkAlt, FaYoutube, FaTimes } from 'react-icons/fa';

// Custom Table Components
const Table = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`relative w-full overflow-auto ${className}`}>
        <table className="w-full caption-bottom text-sm">
            {children}
        </table>
    </div>
);

const TableHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <thead className={`[&_tr]:border-b ${className}`}>
        {children}
    </thead>
);

const TableBody = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <tbody className={`[&_tr:last-child]:border-0 ${className}`}>
        {children}
    </tbody>
);

const TableRow = ({ children, className = "", ...props }: { children: React.ReactNode; className?: string; [key: string]: unknown }) => (
    <tr
        className={`border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-100 ${className}`}
        {...props}
    >
        {children}
    </tr>
);

const TableHead = ({ children, className = "", ...props }: { children: React.ReactNode; className?: string; [key: string]: unknown }) => (
    <th
        className={`h-12 px-4 text-left align-middle font-medium text-gray-700 [&:has([role=checkbox])]:pr-0 ${className}`}
        {...props}
    >
        {children}
    </th>
);

const TableCell = ({ children, className = "", ...props }: { children: React.ReactNode; className?: string; [key: string]: unknown }) => (
    <td
        className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
        {...props}
    >
        {children}
    </td>
);

// Custom DataTable Component
interface DataTableProps<TData, TValue> {
    loading?: boolean;
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

function DataTable<TData, TValue>({
    loading = false,
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="rounded-lg border border-gray-200 bg-white">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="bg-gray-50/50">
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-150"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="py-4 px-6 align-top">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        loading ? (
                            table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableCell key={header.id}>
                                            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                                    No Data Found
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

// Custom Modal Components
const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[95vh] overflow-y-auto">
                {children}
            </div>
        </div>
    );
};

const ModalHeader = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
            {children}
        </div>
        <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
            <FaTimes className="w-5 h-5 text-gray-500" />
        </button>
    </div>
);

const ModalContent = ({ children }: { children: React.ReactNode }) => (
    <div className="p-6">
        {children}
    </div>
);

const AdminVideoGallery = () => {
    const searchParams = useSearchParams()
    const [data, setData] = useState<VideoGallery[]>([])
    const [loading, setLoading] = useState(true)
    const [count, setCount] = useState(0)
    const [open, setOpen] = useState(false)
    const [viewVideo, setViewVideo] = useState<string | null>(null)
    const [editData, setEditData] = useState<VideoGallery | null>(null)
    const [showEditForm, setShowEditForm] = useState(false)

    useEffect(() => {
        (async () => {
            setLoading(true)
            await getAllVideos({ searchParams: Object.fromEntries(searchParams.entries()) }).then((videos) => {
                if (videos && videos?.list?.length > 0) {
                    setData(videos.list)
                    setCount(videos.count)
                }
            }).finally(() => {
                setLoading(false)
            })
        })()
    }, [searchParams])

    // Function to extract YouTube video ID
    const getYouTubeVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    // Function to get YouTube thumbnail
    const getYouTubeThumbnail = (url: string) => {
        const videoId = getYouTubeVideoId(url);
        return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
    }

    // Calculate statistics
    const totalVideos = data.length
    const videosWithDescription = data.filter(video => video.description && video.description.trim() !== '').length
    const youtubeVideos = data.filter(video => video.link.includes('youtube') || video.link.includes('youtu.be')).length
    const otherVideos = totalVideos - youtubeVideos

    const columns: ColumnDef<VideoGallery>[] = [
        {
            accessorKey: "video",
            header: () => (
                <div className="flex items-center gap-2 font-semibold text-gray-700">
                    <FaVideo className="w-4 h-4 text-blue-500" />
                    Video Preview
                </div>
            ),
            cell: ({ row }) => {
                const thumbnail = getYouTubeThumbnail(row.original.link);
                return (
                    <div className="flex items-start gap-4 py-2">
                        <div className="relative">
                            {thumbnail ? (
                                <div className="relative">
                                    <Image
                                        src={thumbnail}
                                        alt={row.original.title}
                                        width={120}
                                        height={90}
                                        className="w-30 h-[90px] rounded-lg object-cover border-2 border-blue-200 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
                                        onClick={() => setViewVideo(row.original.link)}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                                        <FaPlay className="w-6 h-6 text-white opacity-80" />
                                    </div>
                                </div>
                            ) : (
                                <div 
                                    className="w-30 h-[90px] rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center border-2 border-blue-200 cursor-pointer hover:shadow-md transition-all duration-200"
                                    onClick={() => setViewVideo(row.original.link)}
                                >
                                    <FaVideo className="w-8 h-8 text-blue-500" />
                                </div>
                            )}
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
                );
            },
        },
        {
            accessorKey: "details",
            header: () => (
                <div className="flex items-center gap-2 font-semibold text-gray-700">
                    <FaVideo className="w-4 h-4 text-cyan-500" />
                    Video Details
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
                        {row.original.link.includes('youtube') || row.original.link.includes('youtu.be') ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                <FaYoutube className="w-3 h-3 mr-1" />
                                YouTube
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                <FaVideo className="w-3 h-3 mr-1" />
                                Video
                            </span>
                        )}
                        {row.original.description && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 border border-cyan-200">
                                Description
                            </span>
                        )}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "link",
            header: () => (
                <div className="flex items-center gap-2 font-semibold text-gray-700">
                    <FaExternalLinkAlt className="w-4 h-4 text-green-500" />
                    Video Link
                </div>
            ),
            cell: ({ row }) => (
                <div className="space-y-2">
                    <a
                        href={row.original.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
                    >
                        <FaExternalLinkAlt className="w-3 h-3" />
                        Watch Video
                    </a>
                    <button
                        onClick={() => setViewVideo(row.original.link)}
                        className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200 border border-green-200"
                    >
                        <FaPlay className="w-3 h-3" />
                        Preview
                    </button>
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
            cell: ({ row }) => <Action row={row} setData={setData} setEditData={setEditData} setShowEditForm={setShowEditForm} />
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <FaVideo className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <H1 className="text-2xl font-bold text-gray-900 mb-1">Video Gallery</H1>
                                    <p className="text-gray-600 text-sm">Manage your video collection and content</p>
                                </div>
                            </div>
                                    <button 
                                        onClick={() => setOpen(true)}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                    >
                                        <FaPlus className="w-4 h-4" />
                                        Add New Video
                                    </button>
            </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600 mb-1">Total Videos</p>
                                    <p className="text-2xl font-bold text-gray-900">{totalVideos}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                    <FaVideo className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-red-200 shadow-lg hover:shadow-xl transition-all duration-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-red-600 mb-1">YouTube Videos</p>
                                    <p className="text-2xl font-bold text-gray-900">{youtubeVideos}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                                    <FaYoutube className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-cyan-200 shadow-lg hover:shadow-xl transition-all duration-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-cyan-600 mb-1">With Description</p>
                                    <p className="text-2xl font-bold text-gray-900">{videosWithDescription}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                    <FaVideo className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-teal-200 shadow-lg hover:shadow-xl transition-all duration-200">
                            <div className="flex items-center justify-between">
            <div>
                                    <p className="text-sm font-medium text-teal-600 mb-1">Other Sources</p>
                                    <p className="text-2xl font-bold text-gray-900">{otherVideos}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                                    <FaVideo className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Video Gallery Table Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200 shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                                    <FaVideo className="w-5 h-5 text-blue-500" />
                                    Video Gallery ({totalVideos})
                                </h2>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                        {youtubeVideos} YouTube
                                    </span>
                                    <span className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs font-medium">
                                        {videosWithDescription} with description
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
                                        <FaVideo className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
                                    <p className="text-gray-600 mb-6">Start building your video gallery by adding your first video.</p>
                                    <button 
                                        onClick={() => setOpen(true)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200"
                                    >
                                        <FaPlus className="w-4 h-4" />
                                        Add First Video
                                    </button>
                                </div>
                            ) : (
                    <>
                        <DataTable
                                        columns={columns} 
                                        data={JSON.parse(JSON.stringify(data))} 
                                        loading={loading}
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

            {/* Add Video Modal */}
            <Modal isOpen={open} onClose={() => setOpen(false)}>
                <ModalHeader onClose={() => setOpen(false)}>
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                        <FaPlus className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Add New Video</h2>
                </ModalHeader>
                <ModalContent>
                    <AddVideoGallery setData={setData} setOpen={setOpen} />
                </ModalContent>
            </Modal>

            {/* Edit Video Form - Outside Table */}
            {showEditForm && editData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => {
                        setShowEditForm(false)
                        setEditData(null)
                    }}></div>
                    <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[95vh] overflow-y-auto">
                        <ModalHeader onClose={() => {
                            setShowEditForm(false)
                            setEditData(null)
                        }}>
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                <FaEdit className="w-4 h-4 text-white" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Edit Video</h2>
                        </ModalHeader>
                        <ModalContent>
                            <AddVideoGallery 
                                setData={setData} 
                                setOpen={() => {
                                    setShowEditForm(false)
                                    setEditData(null)
                                }} 
                                isEdit={true} 
                                editData={editData} 
                            />
                        </ModalContent>
                    </div>
                </div>
            )}

            {/* Video View Modal */}
            <Modal isOpen={!!viewVideo} onClose={() => setViewVideo(null)}>
                <ModalHeader onClose={() => setViewVideo(null)}>
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                <FaPlay className="w-4 h-4 text-white" />
                            </div>
                    <h2 className="text-xl font-semibold text-gray-900">Video Preview</h2>
                </ModalHeader>
                <ModalContent>
                        {viewVideo && (
                            <div className="aspect-video w-full">
                                {getYouTubeVideoId(viewVideo) ? (
                                    <iframe
                                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(viewVideo)}`}
                                        title="Video player"
                                        className="w-full h-full rounded-lg border border-gray-200"
                                        allowFullScreen
                                    />
                                ) : (
                                    <video
                                        src={viewVideo}
                                        controls
                                        className="w-full h-full rounded-lg border border-gray-200"
                                    />
                                )}
                            </div>
                        )}
                </ModalContent>
            </Modal>
        </div>
    )
}

type ActionProps = {
    row: { original: VideoGallery }
    setData: React.Dispatch<React.SetStateAction<VideoGallery[]>>
    setEditData: React.Dispatch<React.SetStateAction<VideoGallery | null>>
    setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>
}

const Action = ({ row, setData, setEditData, setShowEditForm }: ActionProps) => {
    const [deletePopup, setDeletePopup] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        await deleteVideo(row.original._id as string).then(() => {
            setData((prev) => prev.filter((video) => video._id !== row.original._id))
            setDeletePopup(false)
        }).finally(() => setLoading(false))
    }

    return (
        <>
            <div className='flex items-center gap-2'>
                <button 
                    onClick={() => {
                        setEditData(row.original)
                        setShowEditForm(true)
                    }}
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
                <div className="max-w-md w-full mx-4">
                    <ModalHeader onClose={() => !loading && setDeletePopup(false)}>
                            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                                <FaTrash className="w-4 h-4 text-white" />
                            </div>
                        <h2 className="text-xl font-semibold text-gray-900">Delete Video</h2>
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
                                {loading ? 'Deleting...' : 'Delete Video'}
                            </button>
                        </div>
                    </div>
                    </ModalContent>
                </div>
            </Modal>
        </>
    )
}

export default AdminVideoGallery