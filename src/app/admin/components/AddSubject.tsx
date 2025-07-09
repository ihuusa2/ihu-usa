'use client'

import type { Subject } from "@/Types/Courses";
import React, { useState, useEffect } from 'react';
import { createSubject, updateSubject } from '@/Server/Subjects';
import Spinner from '@/components/Spinner';
import Jodit from "./jodit";
import { useParams } from "next/navigation";

type Props = {
    setData: React.Dispatch<React.SetStateAction<Subject[]>>
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>
    isEdit?: boolean
    editData?: Subject
    onDelete?: (subject: Subject) => void
    showActions?: boolean
    isModal?: boolean
}

const AddSubject = ({ setData, setOpen, isEdit, editData, onDelete, showActions = false, isModal = false }: Props) => {
    const params = useParams()

    const [value, setValue] = useState<Subject>(isEdit ? editData as Subject : {
        title: '',
        slug: '',
        courseId: '',
        price: [
            {
                type: 'INR',
                amount: 0,
            },
            {
                type: 'USD',
                amount: 0,
            },
        ],
        description: '',
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isEdit) {
            setValue(editData as Subject);
        }
    }, [isEdit, editData]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (value.title.trim() === '' || value.description.trim() === '') return;

        setLoading(true);

        const formData: Subject = {
            ...value,
            slug: value.slug ?
                value.slug.replace(/\s+/g, '-').toLowerCase() :
                value.title.replace(/\s+/g, '-').toLowerCase(),
        };

        if (isEdit) {
            await updateSubject(formData).then((res) => {
                if (res) {
                    setData((prev) => prev.map((subject) => subject._id === res._id ? res : subject));
                    if (setOpen) {
                        setOpen(false);
                    }
                }
            })
                .catch(() => {
                    setMessage('Something went wrong.');
                })
                .finally(() => setLoading(false));
        } else {
            await createSubject(params.slug as string, formData).then((res) => {
                if (res?._id) {
                    setData((prev) => [
                        ...prev,
                        res as Subject,
                    ]);
                    if (setOpen) {
                        setOpen(false);
                    }
                }
            }).catch(() => {
                setMessage('Something went wrong.');
            })
                .finally(() => setLoading(false));
        }
    };

    if (isModal) {
        return (
            <div className="space-y-6">
                {/* Error Message */}
                {message && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-700 font-medium">{message}</span>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title Field */}
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                            Subject Title *
                        </label>
                        <input
                            disabled={loading}
                            type="text"
                            id="title"
                            name="title"
                            value={value.title}
                            onChange={(e) => setValue({ ...value, title: e.target.value })}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed placeholder-gray-400"
                            placeholder="Enter subject title"
                        />
                    </div>

                    {/* Slug Field */}
                    <div className="space-y-2">
                        <label htmlFor="slug" className="block text-sm font-semibold text-gray-700">
                            Slug
                        </label>
                        <input
                            disabled={loading}
                            type="text"
                            id="slug"
                            name="slug"
                            value={value.slug}
                            onChange={(e) => setValue({ ...value, slug: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed placeholder-gray-400"
                            placeholder="Enter slug (optional)"
                        />
                        <p className="text-xs text-gray-500">
                            Leave empty to auto-generate from title
                        </p>
                    </div>

                    {/* Price Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="inr-price" className="block text-sm font-semibold text-gray-700">
                                INR Price *
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                    ₹
                                </span>
                                <input
                                    disabled={loading}
                                    type="number"
                                    id="inr-price"
                                    name="inr-price"
                                    value={value.price[0].amount}
                                    onChange={(e) => setValue({ 
                                        ...value, 
                                        price: [
                                            { type: 'INR', amount: parseFloat(e.target.value) || 0 }, 
                                            { type: 'USD', amount: value.price[1].amount }
                                        ] 
                                    })}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed placeholder-gray-400"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="usd-price" className="block text-sm font-semibold text-gray-700">
                                USD Price *
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                    $
                                </span>
                                <input
                                    disabled={loading}
                                    type="number"
                                    id="usd-price"
                                    name="usd-price"
                                    value={value.price[1].amount}
                                    onChange={(e) => setValue({ 
                                        ...value, 
                                        price: [
                                            { type: 'INR', amount: value.price[0].amount }, 
                                            { type: 'USD', amount: parseFloat(e.target.value) || 0 }
                                        ] 
                                    })}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed placeholder-gray-400"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Description Field */}
                    <div className="space-y-2">
                        <Jodit
                            content={value.description}
                            setContent={(content) => setValue({ ...value, description: content })}
                            label="Description *"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <Spinner size="1.5rem" color="text-white" />
                                    <span className="ml-3">Processing...</span>
                                </div>
                            ) : (
                                <span>{isEdit ? 'Update Subject' : 'Create Subject'}</span>
                            )}
                        </button>
                    </div>

                    {/* Actions Section - Only show when not in modal mode */}
                    {showActions && isEdit && editData && !isModal && (
                        <div className="pt-6 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={() => onDelete && onDelete(editData)}
                                    disabled={loading}
                                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete Subject
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOpen && setOpen(false)}
                                    disabled={loading}
                                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 sm:px-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                            {isEdit ? 'Edit Subject' : 'Add New Subject'}
                        </h1>
                        <p className="text-blue-100 text-sm sm:text-base">
                            {isEdit ? 'Update the subject information below' : 'Fill in the details to create a new subject'}
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-6 sm:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Error Message */}
                            {message && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-red-700 font-medium">{message}</span>
                                    </div>
                                </div>
                            )}

                            {/* Title Field */}
                            <div className="space-y-2">
                                <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                                    Subject Title *
                                </label>
                                <input
                                    disabled={loading}
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={value.title}
                                    onChange={(e) => setValue({ ...value, title: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed placeholder-gray-400"
                                    placeholder="Enter subject title"
                                />
                            </div>

                            {/* Slug Field */}
                            <div className="space-y-2">
                                <label htmlFor="slug" className="block text-sm font-semibold text-gray-700">
                                    Slug
                                </label>
                                <input
                                    disabled={loading}
                                    type="text"
                                    id="slug"
                                    name="slug"
                                    value={value.slug}
                                    onChange={(e) => setValue({ ...value, slug: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed placeholder-gray-400"
                                    placeholder="Enter slug (optional)"
                                />
                                <p className="text-xs text-gray-500">
                                    Leave empty to auto-generate from title
                                </p>
                            </div>

                            {/* Price Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="inr-price" className="block text-sm font-semibold text-gray-700">
                                        INR Price *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                            ₹
                                        </span>
                                        <input
                                            disabled={loading}
                                            type="number"
                                            id="inr-price"
                                            name="inr-price"
                                            value={value.price[0].amount}
                                            onChange={(e) => setValue({ 
                                                ...value, 
                                                price: [
                                                    { type: 'INR', amount: parseFloat(e.target.value) || 0 }, 
                                                    { type: 'USD', amount: value.price[1].amount }
                                                ] 
                                            })}
                                            required
                                            min="0"
                                            step="0.01"
                                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed placeholder-gray-400"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="usd-price" className="block text-sm font-semibold text-gray-700">
                                        USD Price *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                            $
                                        </span>
                                        <input
                                            disabled={loading}
                                            type="number"
                                            id="usd-price"
                                            name="usd-price"
                                            value={value.price[1].amount}
                                            onChange={(e) => setValue({ 
                                                ...value, 
                                                price: [
                                                    { type: 'INR', amount: value.price[0].amount }, 
                                                    { type: 'USD', amount: parseFloat(e.target.value) || 0 }
                                                ] 
                                            })}
                                            required
                                            min="0"
                                            step="0.01"
                                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed placeholder-gray-400"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Description Field */}
                            <div className="space-y-2">
                                <Jodit
                                    content={value.description}
                                    setContent={(content) => setValue({ ...value, description: content })}
                                    label="Description *"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6">
                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <Spinner size="1.5rem" color="text-white" />
                                            <span className="ml-3">Processing...</span>
                                        </div>
                                    ) : (
                                        <span>{isEdit ? 'Update Subject' : 'Create Subject'}</span>
                                    )}
                                </button>
                            </div>

                            {/* Actions Section */}
                            {showActions && isEdit && editData && (
                                <div className="pt-6 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            type="button"
                                            onClick={() => onDelete && onDelete(editData)}
                                            disabled={loading}
                                            className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete Subject
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setOpen && setOpen(false)}
                                            disabled={loading}
                                            className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSubject;