'use client'

import type { Course } from "@/Types/Courses"; 
import React, { useState, useEffect } from 'react'
import AddCourse from "../../../components/AddCourse";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCourseById } from "@/Server/Course";

type Props = {
    params: Promise<{ id: string }>
}

// Custom Button Component to replace shadcn UI
const Button = ({ 
    children, 
    variant = "primary", 
    size = "md", 
    className = "", 
    ...props 
}: {
    children: React.ReactNode;
    variant?: "primary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm",
        outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
        ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm"
    };
    
    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base"
    };
    
    return (
        <button 
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

// Custom Icon Button Component
const IconButton = ({ 
    children, 
    variant = "outline", 
    size = "md", 
    className = "", 
    ...props 
}: {
    children: React.ReactNode;
    variant?: "primary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    const baseClasses = "inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm",
        outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
        ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500"
    };
    
    const sizes = {
        sm: "p-1.5",
        md: "p-2",
        lg: "p-3"
    };
    
    return (
        <button 
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

// Arrow Left Icon Component
const ArrowLeftIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg 
        className={className} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10 19l-7-7m0 0l7-7m-7 7h18" 
        />
    </svg>
);

// Custom Spinner Component
const Spinner = ({ size = "2rem", color = "text-blue-500" }: { size?: string; color?: string }) => (
    <div className="flex justify-center items-center">
        <div
            className={`animate-spin rounded-full border-4 border-solid border-gray-200 ${color}`}
            style={{
                width: size,
                height: size,
                borderTopColor: "currentColor",
            }}
        />
    </div>
);

const EditCoursePage = ({ params }: Props) => {
    const [, setData] = useState<Course[]>([])
    const [editData, setEditData] = useState<Course | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true)
                const resolvedParams = await params
                const course = await getCourseById(resolvedParams.id)
                if (course) {
                    setEditData(course)
                }
            } catch (error) {
                console.error('Failed to fetch course:', error)
                router.push('/admin/Courses')
            } finally {
                setLoading(false)
            }
        }

        fetchCourse()
    }, [params, router])

    const handleCourseUpdated = () => {
        router.push('/admin/Courses')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <Spinner size="3rem" color="text-blue-600" />
                    <p className="mt-4 text-gray-600 font-medium">Loading course data...</p>
                </div>
            </div>
        )
    }

    if (!editData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Course Not Found</h2>
                    <p className="text-gray-600 mb-6">The course you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                    <Link href="/admin/Courses">
                        <Button className="w-full sm:w-auto">
                            Back to Courses
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link href="/admin/Courses">
                                <IconButton variant="outline" className="hover:bg-gray-50">
                                    <ArrowLeftIcon />
                                </IconButton>
                            </Link>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Course</h1>
                                <p className="text-sm text-gray-500 hidden sm:block">Update course information and settings</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Link href="/admin/Courses">
                                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Strip */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                            </span>
                            <span className="text-sm text-gray-600">
                                Last Updated: {new Date().toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <h2 className="text-lg font-semibold text-gray-900">Course Details</h2>
                        <p className="text-sm text-gray-600 mt-1">Update the course information below</p>
                    </div>
                    <div className="p-6">
                        <AddCourse 
                            setData={setData} 
                            isEdit={true}
                            editData={editData}
                            onSuccess={handleCourseUpdated}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditCoursePage 