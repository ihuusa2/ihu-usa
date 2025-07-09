'use client'

import type { Course } from "@/Types/Courses"; 
import React, { useState } from 'react'
import AddCourse from "../../components/AddCourse";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AddCoursePage = () => {
    const [, setData] = useState<Course[]>([])
    const router = useRouter()

    const handleCourseAdded = () => {
        router.push('/admin/Courses')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Link 
                            href="/admin/Courses"
                            className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            <svg 
                                className="w-5 h-5" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M15 19l-7-7 7-7" 
                                />
                            </svg>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                Add New Course
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Create a new course for your platform
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Course Information
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Fill in the details below to create your course
                        </p>
                    </div>
                    
                    <div className="p-8">
                        <AddCourse 
                            setData={setData} 
                            onSuccess={handleCourseAdded}
                        />
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        All fields marked with an asterisk (*) are required
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AddCoursePage 