import { auth } from '@/auth'
import Container from '@/components/Container'
import { H1 } from '@/components/Headings'
import { getCourseRegFormsByRegistrationNumber } from '@/Server/CourseRegForm'
import { getRegistrationByRegNum } from '@/Server/Registration'
import { isValidObjectId } from '@/lib/utils'
import React from 'react'
import Courses from './Courses'

const StudentPanel = async () => {
    const session = await auth()

    if (!session) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <h1 className='text-2xl font-bold'>You are not logged in</h1>
            </div>
        )
    }

    if (!session.user.id || isValidObjectId(session.user.id)) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <h1 className='text-2xl font-bold'>You do not have permission to access this page</h1>
            </div>
        )
    }

    const registration = await getRegistrationByRegNum(session.user.id)

    if (!registration) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <h1 className='text-2xl font-bold'>You do not have permission to access this page</h1>
            </div>
        )
    }

    const courses = await getCourseRegFormsByRegistrationNumber(registration.registrationNumber as string, 0)

    return (
        <Container className='py-10'>
            <H1 className='text-2xl font-bold'>Welcome to Student Panel</H1>

            <div className='mt-5'>
                <h2 className='text-xl font-bold mb-2'>Your Courses</h2>
                <Courses courses={courses} />
            </div>
        </Container>
    )
}

export default StudentPanel