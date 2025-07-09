'use client'

import { DataTable } from '@/components/ui/data-table'
import { CourseForm } from '@/Types/Form'
import React from 'react'

const Courses = ({ courses }: {
    courses: CourseForm[]
}) => {
    return (
        <div>
            <DataTable
                columns={[
                    { accessorKey: 'course', header: 'Course' },
                    { accessorKey: 'program', header: 'Program' },
                    {
                        accessorKey: 'price', header: 'Price', cell: ({ row }) => {
                            const price = row.getValue('price') as { amount: number, type: string }
                            return <span>{price?.amount} {price?.type}</span>
                        }
                    },
                    {
                        accessorKey: 'subjects', header: 'Subjects', cell: ({ row }) => {
                            const subjects = row.getValue('subjects') as string[]
                            return subjects.map((subject, index) => (
                                <span key={index} className="block">{subject}</span>
                            ))
                        }
                    },
                ]}
                data={courses}
            />
        </div>
    )
}

export default Courses