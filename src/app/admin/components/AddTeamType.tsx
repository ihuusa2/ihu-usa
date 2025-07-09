'use client'

import React, { useState, useEffect } from 'react'
import { createTeamType, updateTeamType } from '@/Server/TeamType'
import Spinner from '@/components/Spinner'
import type { TeamType } from '@/Types/User'

type Props = {
    setData: React.Dispatch<React.SetStateAction<TeamType[]>>
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>
    isEdit?: boolean
    editData?: TeamType
}

const AddTeamType = ({ setData, setOpen, isEdit, editData }: Props) => {
    const [value, setValue] = useState<TeamType>(isEdit ? editData as TeamType : {
        title: '',
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    useEffect(() => {
        if (isEdit) {
            setValue(editData as TeamType)
        }
    }, [isEdit, editData])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (value.title.trim() === '') return

        setLoading(true)
        setMessage('')

        const formData: TeamType = {
            ...value,
        }

        if (isEdit) {
            await updateTeamType(formData).then((res) => {
                if (res) {
                    console.log(res)
                    setData((prev) => prev.map((teamType) => teamType._id === res._id ? res : teamType))
                    if (setOpen) {
                        setOpen(false)
                    }
                }
            })
                .catch(() => {
                    setMessage('Something went wrong. Please try again.')
                })
                .finally(() => setLoading(false))
        } else {
            await createTeamType(formData).then((res) => {
                if (res?.insertedId) {
                    setData((prev) => [
                        ...prev,
                        { ...formData, _id: res.insertedId.toString() },
                    ])
                    if (setOpen) {
                        setOpen(false)
                    }
                }
            }).catch(() => {
                setMessage('Something went wrong. Please try again.')
            })
                .finally(() => setLoading(false))
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                        {isEdit ? 'Edit Team Type' : 'Add New Team Type'}
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base">
                        {isEdit ? 'Update the team type information below.' : 'Create a new team type for your organization.'}
                    </p>
                </div>

                {/* Error Message */}
                {message && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-700 text-sm font-medium">{message}</span>
                        </div>
                    </div>
                )}

                {/* Form Fields */}
                <div className="space-y-6">
                    {/* Title Input */}
                    <div className="relative">
                        <label 
                            htmlFor="title" 
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Team Type Title
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={value.title}
                                onChange={(e) => setValue({ ...value, title: e.target.value })}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                disabled={loading}
                                required
                                className={`
                                    w-full px-4 py-3 text-gray-900 bg-white border rounded-lg transition-all duration-200 ease-in-out
                                    ${isFocused 
                                        ? 'border-blue-500 ring-2 ring-blue-200 shadow-sm' 
                                        : 'border-gray-300 hover:border-gray-400'
                                    }
                                    ${loading ? 'opacity-50 cursor-not-allowed' : 'focus:outline-none'}
                                    placeholder-gray-400
                                `}
                                placeholder="Enter team type title..."
                            />
                            {isFocused && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            This will be used to categorize team members
                        </p>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading || value.title.trim() === ''}
                        className={`
                            w-full flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg transition-all duration-200 ease-in-out
                            ${loading || value.title.trim() === ''
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                            }
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                        `}
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <Spinner size="1.25rem" color="text-white" />
                                <span className="ml-2">Processing...</span>
                            </div>
                        ) : (
                            <div className="flex items-center">
                                {isEdit ? (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Update Team Type
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Create Team Type
                                    </>
                                )}
                            </div>
                        )}
                    </button>
                </div>

                {/* Cancel Button (if editing) */}
                {isEdit && setOpen && (
                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                            className="w-full px-6 py-3 text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </form>
        </div>
    )
}

export default AddTeamType