'use client'

import { signOut } from 'next-auth/react'
import Container from '@/components/Container'
import { H1 } from '@/components/Headings'
import { getCourseRegFormsByRegistrationNumber } from '@/Server/CourseRegForm'
import { getRegistrationByRegNum } from '@/Server/Registration'
import { isValidObjectId } from '@/lib/utils'
import React, { useState } from 'react'
import Courses from './Courses'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, GraduationCap, User, Clock, DollarSign, LogOut } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { RegisterForm, CourseForm } from '@/Types/Form'

const StudentPanel = () => {
    const [isSigningOut, setIsSigningOut] = useState(false)
    const { data: session, status } = useSession()
    const [registration, setRegistration] = useState<RegisterForm | null>(null)
    const [courses, setCourses] = useState<CourseForm[]>([])

    // Load data on component mount
    React.useEffect(() => {
        const loadData = async () => {
            try {
                if (!session) return

                if (!session.user.id || isValidObjectId(session.user.id)) {
                    return
                }

                const regData = await getRegistrationByRegNum(session.user.id)
                setRegistration(regData)

                if (regData) {
                    const coursesData = await getCourseRegFormsByRegistrationNumber(regData.registrationNumber as string, 0)
                    setCourses(coursesData)
                }
            } catch (error) {
                console.error('Error loading data:', error)
            }
        }

        if (status === 'authenticated') {
            loadData()
        }
    }, [session, status])

    const handleSignOut = async () => {
        setIsSigningOut(true)
        try {
            await signOut({
                redirect: true,
                callbackUrl: '/'
            })
        } catch (error) {
            console.error('Sign out error:', error)
            window.location.href = '/'
        } finally {
            setIsSigningOut(false)
        }
    }

    // Show loading state while session is being fetched
    if (status === 'loading') {
        return (
            <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
                <Card className='w-full max-w-md shadow-lg'>
                    <CardContent className='p-8 text-center'>
                        <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
                        </div>
                        <h1 className='text-2xl font-bold text-gray-800 mb-2'>Loading...</h1>
                        <p className='text-gray-600'>Please wait while we verify your session.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!session) {
        return (
            <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
                <Card className='w-full max-w-md shadow-lg'>
                    <CardContent className='p-8 text-center'>
                        <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <User className='w-8 h-8 text-red-600' />
                        </div>
                        <h1 className='text-2xl font-bold text-gray-800 mb-2'>Access Denied</h1>
                        <p className='text-gray-600'>You need to be logged in to access the student panel.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!session.user.id || isValidObjectId(session.user.id)) {
        return (
            <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
                <Card className='w-full max-w-md shadow-lg'>
                    <CardContent className='p-8 text-center'>
                        <div className='w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <GraduationCap className='w-8 h-8 text-yellow-600' />
                        </div>
                        <h1 className='text-2xl font-bold text-gray-800 mb-2'>Permission Required</h1>
                        <p className='text-gray-600'>You do not have permission to access the student panel.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!registration) {
        return (
            <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
                <Card className='w-full max-w-md shadow-lg'>
                    <CardContent className='p-8 text-center'>
                        <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <BookOpen className='w-8 h-8 text-orange-600' />
                        </div>
                        <h1 className='text-2xl font-bold text-gray-800 mb-2'>Registration Not Found</h1>
                        <p className='text-gray-600'>Your student registration could not be found.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Calculate statistics
    const totalCourses = courses.length
    const completedCourses = courses.filter(course => course.status === 'COMPLETED').length
    const pendingCourses = courses.filter(course => course.status === 'PENDING').length
    const totalAmount = courses.reduce((sum, course) => sum + (course.price?.amount || 0), 0)

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
            <Container className='py-8'>
                {/* Header Section */}
                <div className='mb-8'>
                    <div className='flex items-center justify-between mb-4'>
                        <div className='flex items-center gap-3'>
                            <div className='w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center'>
                                <GraduationCap className='w-6 h-6 text-white' />
                            </div>
                            <div>
                                <H1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                                    Student Dashboard
                                </H1>
                                <p className='text-gray-600'>Welcome back, {registration.firstName}!</p>
                            </div>
                        </div>
                        
                        {/* Logout Button */}
                        <button
                            onClick={handleSignOut}
                            disabled={isSigningOut}
                            className="flex items-center gap-2 bg-white hover:bg-red-50 border border-red-200 text-red-600 hover:text-red-700 hover:border-red-300 px-4 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>{isSigningOut ? 'Signing Out...' : 'Logout'}</span>
                        </button>
                    </div>
                </div>

                {/* User Info Card */}
                <Card className='mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm'>
                    <CardHeader className='pb-4'>
                        <CardTitle className='flex items-center gap-2 text-xl'>
                            <User className='w-5 h-5 text-blue-600' />
                            Student Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                            <div className='space-y-1'>
                                <p className='text-sm text-gray-500'>Registration Number</p>
                                <p className='font-semibold text-gray-900'>{registration.registrationNumber}</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='text-sm text-gray-500'>Full Name</p>
                                <p className='font-semibold text-gray-900'>
                                    {registration.firstName} {registration.middleName} {registration.lastName}
                                </p>
                            </div>
                            <div className='space-y-1'>
                                <p className='text-sm text-gray-500'>Email</p>
                                <p className='font-semibold text-gray-900'>{registration.emailAddress}</p>
                            </div>
                            <div className='space-y-1'>
                                <p className='text-sm text-gray-500'>Enrollment Type</p>
                                <Badge variant='secondary' className='text-xs'>
                                    {registration.enrollmentType}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics Cards */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                    <Card className='shadow-lg border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white'>
                        <CardContent className='p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-blue-100 text-sm font-medium'>Total Courses</p>
                                    <p className='text-3xl font-bold'>{totalCourses}</p>
                                </div>
                                <BookOpen className='w-8 h-8 text-blue-200' />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='shadow-lg border-0 bg-gradient-to-r from-green-500 to-green-600 text-white'>
                        <CardContent className='p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-green-100 text-sm font-medium'>Completed</p>
                                    <p className='text-3xl font-bold'>{completedCourses}</p>
                                </div>
                                <GraduationCap className='w-8 h-8 text-green-200' />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='shadow-lg border-0 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'>
                        <CardContent className='p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-yellow-100 text-sm font-medium'>Pending</p>
                                    <p className='text-3xl font-bold'>{pendingCourses}</p>
                                </div>
                                <Clock className='w-8 h-8 text-yellow-200' />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='shadow-lg border-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white'>
                        <CardContent className='p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-purple-100 text-sm font-medium'>Total Investment</p>
                                    <p className='text-3xl font-bold'>${totalAmount}</p>
                                </div>
                                <DollarSign className='w-8 h-8 text-purple-200' />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Courses Section */}
                <Card className='shadow-lg border-0 bg-white/80 backdrop-blur-sm'>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2 text-xl'>
                            <BookOpen className='w-5 h-5 text-blue-600' />
                            Your Courses
                        </CardTitle>
                        <CardDescription>
                            Manage and track your enrolled courses
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Courses courses={courses} />
                    </CardContent>
                </Card>
            </Container>
        </div>
    )
}

export default StudentPanel