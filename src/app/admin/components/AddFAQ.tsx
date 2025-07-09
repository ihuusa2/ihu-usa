'use client'

import React, { useState, useEffect } from 'react'
import Spinner from '@/components/Spinner'
import { createFAQ, updateFAQ } from '@/Server/FAQ'
import { FAQ } from '@/Types/Gallery'
import { FaQuestionCircle, FaCommentDots, FaCheck } from 'react-icons/fa'

type Props = {
    setData: React.Dispatch<React.SetStateAction<FAQ[]>>
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>
    isEdit?: boolean
    editData?: FAQ
}

const AddFAQ = ({ setData, isEdit, editData, setOpen }: Props) => {
    const [value, setValue] = useState<FAQ>(isEdit ? editData as FAQ : {
        question: '',
        answer: ''
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        if (isEdit) {
            setValue(editData as FAQ)
        }
    }, [isEdit, editData])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (value.question.trim() === '' || value.answer.trim() === '') {
            setMessage('Both question and answer are required.')
            return
        }

        setLoading(true)
        setMessage('')
        setSuccess('')

        const formData: FAQ = {
            ...value
        }

        if (isEdit) {
            await updateFAQ({ ...formData }).then((res) => {
                if (res) {
                    setData((prev) =>
                        prev.map((item) => (item._id === res._id ? res : item))
                    )
                    setSuccess('FAQ updated successfully!')
                    setTimeout(() => {
                        if (setOpen) {
                            setOpen(false)
                        }
                    }, 1500)
                }
            }).catch(() => {
                setMessage('Something went wrong.')
            })
                .finally(() => setLoading(false))
        }
        else {
            await createFAQ(formData).then((res) => {
                if (res?.insertedId) {
                    setData((prev) => [
                        ...prev,
                        { ...formData, _id: String(res.insertedId) },
                    ])
                    setSuccess('FAQ created successfully!')
                    setTimeout(() => {
                        if (setOpen) {
                            setOpen(false)
                        }
                    }, 1500)
                }
            }).catch(() => {
                setMessage('Something went wrong.')
            })
                .finally(() => setLoading(false))
        }
    }

    return (
        <div className="space-y-6">
            {/* Messages */}
            {message && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {message}
                </div>
            )}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <FaCheck className="text-green-500" />
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question Section */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                            <FaQuestionCircle className="text-white text-lg" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Question</h3>
                    </div>

                    <div>
                        <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                            FAQ Question *
                        </label>
                        <input
                            disabled={loading}
                            type="text"
                            id="question"
                            name="question"
                            value={value.question}
                            onChange={(e) => setValue({ ...value, question: e.target.value })}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-100"
                            placeholder="Enter the frequently asked question"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Character count: {value.question.length}
                        </p>
                    </div>
                </div>

                {/* Answer Section */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                            <FaCommentDots className="text-white text-lg" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Answer</h3>
                    </div>

                    <div>
                        <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                            FAQ Answer *
                        </label>
                        <textarea
                            disabled={loading}
                            id="answer"
                            name="answer"
                            value={value.answer}
                            onChange={(e) => setValue({ ...value, answer: e.target.value })}
                            required
                            rows={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-100 resize-none"
                            placeholder="Enter the detailed answer to the question"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Character count: {value.answer.length} | 
                            {value.answer.length > 100 ? 
                                <span className="text-emerald-600 ml-1">Detailed answer ✓</span> : 
                                <span className="text-amber-600 ml-1">Consider adding more detail</span>
                            }
                        </p>
                    </div>
                </div>

                {/* Preview Section */}
                {(value.question.trim() || value.answer.trim()) && (
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                                <FaCommentDots className="text-white text-lg" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Preview</h3>
                        </div>

                        <div className="space-y-4">
                            {value.question.trim() && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Q: {value.question}</h4>
                                </div>
                            )}
                            {value.answer.trim() && (
                                <div>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        <span className="font-medium">A:</span> {value.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                    <button
                        disabled={loading}
                        type="submit"
                        className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-600 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center"
                    >
                        {loading ? (
                            <>
                                <Spinner />
                                Processing...
                            </>
                        ) : (
                            <>
                                <FaCheck />
                                {isEdit ? 'Update FAQ' : 'Create FAQ'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddFAQ