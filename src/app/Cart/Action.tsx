'use client'

import Spinner from '@/components/Spinner'
import { removeCartById } from '@/Server/Cart'
import { Cart } from '@/Types/Cart'
import { useRouter } from 'next/navigation'
import React from 'react'

const Action = ({ item }: { item: Cart }) => {
    const router = useRouter()
    const [sureDelete, setSureDelete] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState('')

    const handleDelete = async () => {
        setLoading(true)
        console.log(item._id, 'ID')
        await removeCartById(item._id as string).then((res) => {
            if (res) {
                router.refresh()
            } else {
                setError('Failed to delete item')
            }
        })
            .catch(() => {
                setError('Failed to delete item')
            })
            .finally(() => {
                setLoading(false)
                setSureDelete(false)
            })
    }

    return (
        <>
            {/* Delete Button */}
            <button
                onClick={() => setSureDelete(true)}
                disabled={loading}
                className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:bg-red-700 disabled:bg-red-400 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-fit"
            >
                Delete
            </button>

            {/* Modal Overlay */}
            {sureDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    {/* Modal Content */}
                    <div className="relative w-full max-w-md mx-auto bg-white rounded-lg shadow-xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Confirm Deletion
                            </h3>
                            <button
                                onClick={() => setSureDelete(false)}
                                disabled={loading}
                                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                                Are you sure you want to delete this item? This action cannot be undone.
                            </p>
                            
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                                <button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:bg-red-700 disabled:bg-red-400 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <Spinner size="1rem" color="text-white" />
                                            <span>Deleting...</span>
                                        </div>
                                    ) : (
                                        'Delete'
                                    )}
                                </button>
                                
                                <button
                                    onClick={() => setSureDelete(false)}
                                    disabled={loading}
                                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:bg-gray-50 disabled:bg-gray-100 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

export default Action