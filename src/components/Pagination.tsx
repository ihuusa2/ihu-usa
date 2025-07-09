'use client'

import React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Props {
    count: number
}

const Pagination = ({ count }: Props) => {
    const searchParams = useSearchParams()

    const filter = {
        page: searchParams.get('page') ? Number(searchParams.get('page')) : 0,
        pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 10,
    }

    const isPreviousDisabled = filter.page === 0
    const isNextDisabled = (filter.page + 1) * filter.pageSize >= count

    return (
        <div className='flex justify-center items-center gap-4 mt-8'>
            {filter.page > 0 && (
                <Link href={`?page=${filter.page - 1}&pageSize=${filter.pageSize}`}>
                    <button
                        disabled={isPreviousDisabled}
                        className={`
                            px-6 py-2 rounded-lg font-medium transition-all duration-200
                            ${isPreviousDisabled 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg'
                            }
                        `}
                    >
                        Previous
                    </button>
                </Link>
            )}

            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                    Page {filter.page + 1} of {Math.ceil(count / filter.pageSize)}
                </span>
            </div>

            {(filter.page + 1) * filter.pageSize < count && (
                <Link href={`?page=${filter.page + 1}&pageSize=${filter.pageSize}`}>
                    <button
                        disabled={isNextDisabled}
                        className={`
                            px-6 py-2 rounded-lg font-medium transition-all duration-200
                            ${isNextDisabled 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg'
                            }
                        `}
                    >
                        Next
                    </button>
                </Link>
            )}
        </div>
    )
}

export default Pagination