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
                <div className='flex items-center justify-center h-screen'>
                    <H1 className='text-2xl font-bold'>You are not logged in</H1>
                </div>
            </AdminLayoutWrapper>
        )
    }

    if (isValidObjectId(session.user.id) === false) {
        return (
            <AdminLayoutWrapper>
                <div className='flex items-center justify-center h-screen'>
                    <H1 className='text-2xl font-bold'>
                        You do not have permission to access this page
                    </H1>
                </div>
            </AdminLayoutWrapper>
        )
    }

    const user = await getUserById(session.user.id)

    if (!user || user.role !== UserRole.Admin) {
        return (
            <AdminLayoutWrapper>
                <div className='flex items-center justify-center h-screen'>
                    <H1 className='text-2xl font-bold'>
                        You do not have permission to access this page
                    </H1>
                </div>
            </AdminLayoutWrapper>
        )
    }

    return (
        <AdminLayoutWrapper>
            <div className="flex h-screen bg-gray-50">
                {/* Sidebar */}
                <AdminSidebar />
                
                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <Suspense fallback={
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    }>
                        {children}
                    </Suspense>
                </main>
            </div>
        </AdminLayoutWrapper>
    )
}

export default AdminLayout