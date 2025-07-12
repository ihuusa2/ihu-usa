'use client'

import { DataTable } from '@/components/ui/data-table'
import { CourseForm } from '@/Types/Form'
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Clock, AlertCircle, DollarSign } from 'lucide-react'

const Courses = ({ courses }: {
    courses: CourseForm[]
}) => {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return <CheckCircle className="w-4 h-4 text-green-600" />
            case 'PENDING':
                return <Clock className="w-4 h-4 text-yellow-600" />
            case 'FAILED':
                return <AlertCircle className="w-4 h-4 text-red-600" />
            default:
                return <Clock className="w-4 h-4 text-gray-600" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
            case 'PENDING':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
            case 'FAILED':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    if (courses.length === 0) {
        return (
            <Card className="border-dashed border-2 border-gray-200">
                <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Courses Enrolled</h3>
                    <p className="text-gray-500">You haven&apos;t enrolled in any courses yet.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            <DataTable
                columns={[
                    { 
                        accessorKey: 'course', 
                        header: 'Course',
                        cell: ({ row }) => (
                            <div className="font-semibold text-gray-900">
                                {row.getValue('course')}
                            </div>
                        )
                    },
                    { 
                        accessorKey: 'program', 
                        header: 'Program',
                        cell: ({ row }) => (
                            <div className="text-gray-700">
                                {row.getValue('program')}
                            </div>
                        )
                    },
                    {
                        accessorKey: 'price', 
                        header: 'Price', 
                        cell: ({ row }) => {
                            const price = row.getValue('price') as { amount: number, currency: string }
                            return (
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                    <span className="font-semibold text-green-700">
                                        {price?.amount} {price?.currency}
                                    </span>
                                </div>
                            )
                        }
                    },
                    {
                        accessorKey: 'status', 
                        header: 'Status', 
                        cell: ({ row }) => {
                            const status = row.getValue('status') as string
                            return (
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(status)}
                                    {getStatusBadge(status)}
                                </div>
                            )
                        }
                    },
                    {
                        accessorKey: 'subjects', 
                        header: 'Subjects', 
                        cell: ({ row }) => {
                            const subjects = row.getValue('subjects') as string[]
                            return (
                                <div className="space-y-1">
                                    {subjects.map((subject, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                            {subject}
                                        </Badge>
                                    ))}
                                </div>
                            )
                        }
                    },
                ]}
                data={courses}
            />
        </div>
    )
}

export default Courses