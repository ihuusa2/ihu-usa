import { auth } from '@/auth'
import Container from '@/components/Container'
import { H1, H3 } from '@/components/Headings'
import { getCourseRegFormsByRegistrationNumber } from '@/Server/CourseRegForm'
import { getUserById, getUserByRegistrationNumber } from '@/Server/User'
import { CourseForm } from '@/Types/Form'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React from 'react'
import { formatDate } from '@/utils/dateFormatter'

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const Profile = async ({ searchParams }: Props) => {
    const searchParamsList = await searchParams
    const skip = searchParamsList.page ? Number(searchParamsList.page) : 0
    const session = await auth()

    if (!session) {
        redirect('/SignIn?redirectUrl=/Profile')
    }

    // Check if the ID is a valid ObjectId (for admin users) or registration number (for students)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(session.user.id);
    
    let user;
    if (isValidObjectId) {
        // Admin user - use ObjectId
        user = await getUserById(session.user.id);
    } else {
        // Student user - use registration number
        user = await getUserByRegistrationNumber(session.user.id);
    }

    if (!user) {
        return (
            <Container className="py-10 flex flex-col items-center gap-8">
                <H3 className="text-center text-red-500">User not found</H3>
            </Container>)
    }

    const appliedCourses = await getCourseRegFormsByRegistrationNumber(user.registrationNumber, skip)

    return (
        <Container className="py-10 flex flex-col items-center gap-8 max-w-lg mx-auto">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-md mb-4 items-center justify-center flex">
                <Image
                    src={typeof user.image === 'string' ? user.image : URL.createObjectURL(user.image)}
                    alt={user.name}
                    width={128}
                    height={128}
                />
            </div>
            <H1 className="text-3xl font-bold mb-2">{user.name}</H1>
            <div className="w-full bg-white rounded-lg shadow p-6 flex flex-col gap-4">
                <div>
                    <span className="font-semibold">Email:</span>
                    <span className="ml-2 text-gray-700">{user.email}</span>
                </div>
                <div>
                    <span className="font-semibold">Contact:</span>
                    <span className="ml-2 text-gray-700">{user.contact}</span>
                </div>
                <div>
                    <span className="font-semibold">Address:</span>
                    <span className="ml-2 text-gray-700">{user.address}</span>
                </div>
                {user.registrationNumber && <div>
                    <span className="font-semibold">Registration Number:</span>
                    <span className="ml-2 text-gray-700">{user.registrationNumber}</span>
                </div>}
            </div>

            <div className="w-full">
                <H3 className="mb-4">Applied Courses</H3>
                {appliedCourses.length === 0 ? (
                    <div className="text-gray-500 text-center">No courses applied yet.</div>
                ) : (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                        {appliedCourses.map((course: CourseForm) => (
                            <div
                                key={course._id as string}
                                className="bg-gray-50 rounded-lg shadow p-4 flex flex-col gap-2 border border-gray-200"
                            >
                                <div className="flex flex-col gap-2">
                                    <div>
                                        <span className="font-semibold text-blue-700">Course:</span>
                                        <span className="ml-2 text-lg">{course.course}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-blue-700">Program:</span>
                                        <span className="ml-2">{course.program}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-blue-700">Subjects:</span>
                                        <ul className="flex flex-wrap gap-2 mt-2">
                                            {course.subjects.map((subject: string, idx: number) => (
                                                <li
                                                    key={idx}
                                                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-[10px] text-xs font-medium shadow"
                                                >
                                                    {subject}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <span className="font-semibold">Applied On:</span>
                                    <span className="ml-2">{formatDate(course.createdAt)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Container>
    )
}

export default Profile