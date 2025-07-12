import { auth } from '@/auth'
import { H1 } from '@/components/Headings'
import { getUserById } from '@/Server/User'
import { UserRole } from '@/Types/User'
import { Session } from 'next-auth'
import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { isValidObjectId } from '@/lib/utils'
import AdminSidebar from './components/AdminSidebar'
import AdminLayoutWrapper from '@/components/AdminLayoutWrapper'
import { FaExclamationTriangle, FaLock, FaUserSlash } from 'react-icons/fa'

export const metadata: Metadata = {
    title: 'Admin - International Hindu University',
    description: 'Manage your admin settings and access controls.'
}

const AdminLayout = async ({ children }: {
    children: React.ReactNode
}) => {
    const session: Session = await auth() as Session

    if (!session) {
        return (
            <AdminLayoutWrapper>
                <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4'>
                    <div className='max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center'>
                        <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                            <FaUserSlash className='text-red-500 text-2xl' />
                        </div>
                        <H1 className='text-2xl font-bold text-gray-900 mb-3'>Access Denied</H1>
                        <p className='text-gray-600 mb-6'>You need to be logged in to access the admin panel.</p>
                        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                            <div className='flex items-center gap-3'>
                                <FaExclamationTriangle className='text-red-500 flex-shrink-0' />
                                <p className='text-red-700 text-sm'>Please sign in with your admin credentials.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayoutWrapper>
        )
    }

    if (isValidObjectId(session.user.id) === false) {
        return (
            <AdminLayoutWrapper>
                <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4'>
                    <div className='max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center'>
                        <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                            <FaLock className='text-orange-500 text-2xl' />
                        </div>
                        <H1 className='text-2xl font-bold text-gray-900 mb-3'>Invalid User ID</H1>
                        <p className='text-gray-600 mb-6'>Your user account appears to be invalid or corrupted.</p>
                        <div className='bg-orange-50 border border-orange-200 rounded-lg p-4'>
                            <div className='flex items-center gap-3'>
                                <FaExclamationTriangle className='text-orange-500 flex-shrink-0' />
                                <p className='text-orange-700 text-sm'>Please contact system administrator for assistance.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayoutWrapper>
        )
    }

    const user = await getUserById(session.user.id)

    if (!user || user.role !== UserRole.Admin) {
        return (
            <AdminLayoutWrapper>
                <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4'>
                    <div className='max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center'>
                        <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                            <FaLock className='text-red-500 text-2xl' />
                        </div>
                        <H1 className='text-2xl font-bold text-gray-900 mb-3'>Permission Denied</H1>
                        <p className='text-gray-600 mb-6'>You do not have admin privileges to access this panel.</p>
                        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                            <div className='flex items-center gap-3'>
                                <FaExclamationTriangle className='text-red-500 flex-shrink-0' />
                                <p className='text-red-700 text-sm'>Admin role required. Contact your administrator.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayoutWrapper>
        )
    }

    return (
        <AdminLayoutWrapper>
            <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
                {/* Sidebar */}
                <AdminSidebar />
                
                {/* Main Content Area */}
                <main className="flex-1 overflow-hidden flex flex-col">
                    {/* Top Header Bar */}
                    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-6 py-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-gray-600 font-medium">Admin Panel</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-gray-500">
                                    Welcome back, <span className="font-semibold text-gray-700">{user.name || 'Admin'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-auto p-6">
                        <Suspense fallback={
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <div className="relative">
                                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                                        <div className="w-12 h-12 border-4 border-transparent border-t-purple-600 rounded-full animate-spin absolute top-0 left-1/2 transform -translate-x-1/2" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                    <p className="text-gray-600 font-medium">Loading admin panel...</p>
                                </div>
                            </div>
                        }>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 min-h-full">
                                {children}
                            </div>
                        </Suspense>
                    </div>
                </main>
            </div>
        </AdminLayoutWrapper>
    )
}

export default AdminLayout