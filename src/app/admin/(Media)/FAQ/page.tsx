'use client'

import type { FAQ } from "@/Types/Gallery";
import React, { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner'
import { ColumnDef } from "@tanstack/react-table"
import { deleteFAQ, getAllFAQs } from '@/Server/FAQ'
import Pagination from '@/components/Pagination'
import { useSearchParams } from 'next/navigation'
import { DataTable } from '@/components/ui/data-table'
import AddFAQ from "../../components/AddFAQ";
import { FaQuestionCircle, FaCommentDots, FaPlus, FaEdit, FaTrash, FaTimes, FaExpand } from 'react-icons/fa';

const AdminFAQ = () => {
    const searchParams = useSearchParams()
    const [data, setData] = useState<FAQ[]>([])
    const [loading, setLoading] = useState(true)
    const [count, setCount] = useState(0)
    const [open, setOpen] = useState(false)
    const [viewModal, setViewModal] = useState<{ isOpen: boolean; faq: FAQ | null }>({
        isOpen: false,
        faq: null
    });
    const [editModal, setEditModal] = useState<{ isOpen: boolean; faq: FAQ | null }>({
        isOpen: false,
        faq: null
    });
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; faq: FAQ | null }>({
        isOpen: false,
        faq: null
    });

    useEffect(() => {
        (async () => {
            setLoading(true)
            await getAllFAQs({ searchParams: Object.fromEntries(searchParams.entries()) }).then((faqs) => {
                if (faqs && faqs?.list?.length > 0) {
                    setData(faqs.list)
                    setCount(faqs.count)
                }
            }).finally(() => {
                setLoading(false)
            })
        })()
    }, [searchParams])

    // Calculate statistics
    const totalFAQs = data.length;
    const shortQuestions = data.filter(faq => faq.question.length <= 50).length;
    const longAnswers = data.filter(faq => faq.answer.length > 100).length;

    const openViewModal = (faq: FAQ) => {
        setViewModal({ isOpen: true, faq });
    };

    const closeViewModal = () => {
        setViewModal({ isOpen: false, faq: null });
    };

    const openEditModal = (faq: FAQ) => {
        setEditModal({ isOpen: true, faq });
    };

    const closeEditModal = () => {
        setEditModal({ isOpen: false, faq: null });
    };

    const openDeleteModal = (faq: FAQ) => {
        setDeleteModal({ isOpen: true, faq });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, faq: null });
    };

    const handleDelete = async () => {
        if (!deleteModal.faq) return;
        await deleteFAQ(deleteModal.faq._id as string).then(() => {
            setData((prev) => prev.filter((faq) => faq._id !== deleteModal.faq?._id))
            closeDeleteModal();
        });
    };

    const columns: ColumnDef<FAQ>[] = [
        {
            accessorKey: "faqDetails",
            header: () => (
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                    <FaQuestionCircle className="text-indigo-500" />
                    FAQ Details
                </div>
            ),
            cell: ({ row }) => (
                <div className="max-w-lg">
                    <div className="mb-3">
                        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                            {row.original.question}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full w-fit">
                            <FaQuestionCircle className="text-[10px]" />
                            Question
                        </div>
                    </div>
                    
                    <div>
                        <p className="text-gray-600 text-xs line-clamp-3 mb-2">
                            {row.original.answer}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit">
                            <FaCommentDots className="text-[10px]" />
                            Answer ({row.original.answer.length} chars)
                        </div>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "actions",
            header: () => (
                <div className="text-gray-700 font-semibold text-center">
                    Actions
                </div>
            ),
            cell: ({ row }) => (
                <div className='flex items-center justify-center gap-2'>
                    <button 
                        onClick={() => openViewModal(row.original)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View full FAQ"
                    >
                        <FaExpand />
                    </button>
                    <button 
                        onClick={() => openEditModal(row.original)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit FAQ"
                    >
                        <FaEdit />
                    </button>
                    <button 
                        onClick={() => openDeleteModal(row.original)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete FAQ"
                    >
                        <FaTrash />
                    </button>
                </div>
            )
        },
    ]

    if (loading) {
    return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <Spinner />
                    <p className="mt-4 text-gray-600">Loading FAQs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 sm:px-6 lg:px-8">
            <div className="w-full py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                FAQs Management
                            </h1>
                            <p className="text-gray-600 mt-1">Manage frequently asked questions and answers</p>
                        </div>
                        <button
                            onClick={() => setOpen(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <FaPlus />
                            Add FAQ
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-indigo-100 hover:shadow-xl transition-all duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-indigo-600 text-sm font-medium">Total FAQs</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{totalFAQs}</p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                                <FaQuestionCircle className="text-white text-xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-600 text-sm font-medium">Short Questions</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{shortQuestions}</p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                                <FaQuestionCircle className="text-white text-xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-emerald-600 text-sm font-medium">Detailed Answers</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{longAnswers}</p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
                                <FaCommentDots className="text-white text-xl" />
                            </div>
                        </div>
            </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-600 text-sm font-medium">Long Questions</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{data.filter(faq => faq.question.length > 50).length}</p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                                <FaQuestionCircle className="text-white text-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
                    <div className="p-6 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                        <h2 className="text-xl font-semibold text-gray-900">All FAQs</h2>
                        <p className="text-gray-600 text-sm mt-1">
                            {totalFAQs} FAQ{totalFAQs !== 1 ? 's' : ''} total
                        </p>
                    </div>
                    
                    {data.length === 0 ? (
                        <div className="text-center py-12">
                            <FaQuestionCircle className="text-6xl text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No FAQs found</h3>
                            <p className="text-gray-500 mb-6">Get started by creating your first FAQ</p>
                            <button
                                onClick={() => setOpen(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
                            >
                                <FaPlus />
                                Add Your First FAQ
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
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-white">Add New FAQ</h2>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                            <AddFAQ setData={setData} setOpen={setOpen} />
                        </div>
                    </div>
                </div>
            )}

            {/* Edit FAQ Modal */}
            {editModal.isOpen && editModal.faq && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-white">Edit FAQ</h2>
                            <button
                                onClick={closeEditModal}
                                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                            <AddFAQ setData={setData} setOpen={closeEditModal} isEdit={true} editData={editModal.faq} />
                        </div>
                    </div>
                </div>
            )}

            {/* Delete FAQ Modal */}
            {deleteModal.isOpen && deleteModal.faq && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <h3 className="text-xl font-semibold text-white">Delete FAQ</h3>
                            <button
                                onClick={closeDeleteModal}
                                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="text-center mb-6">
                                <FaTrash className="text-4xl text-red-500 mx-auto mb-4" />
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Are you sure?</h4>
                                <p className="text-gray-600">This action cannot be undone. This will permanently delete the FAQ.</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={closeDeleteModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <FaTrash />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View FAQ Modal */}
            {viewModal.isOpen && viewModal.faq && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-white">FAQ Details</h3>
                            <button
                                onClick={closeViewModal}
                                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                                            <FaQuestionCircle className="text-white text-lg" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-900">Question</h4>
                                    </div>
                                    <p className="text-gray-800 leading-relaxed">{viewModal.faq.question}</p>
                                </div>

                                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                                            <FaCommentDots className="text-white text-lg" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-900">Answer</h4>
                                    </div>
                                    <p className="text-gray-800 leading-relaxed whitespace-pre-line">{viewModal.faq.answer}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}



export default AdminFAQ