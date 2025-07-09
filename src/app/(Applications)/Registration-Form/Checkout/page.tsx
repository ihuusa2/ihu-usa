import Container from '@/components/Container'
import { getRegistrationById } from '@/Server/Registration'
import { Status } from '@/Types/Form'
import React from 'react'
import { formatDateTime } from '@/utils/dateFormatter'
// import InitiatePayment from './InitiatePayment'

interface Props {
    searchParams: Promise<{ id: string }>
}

const Checkout = async ({ searchParams }: Props) => {
    const searchParamsList = await searchParams

    const registration = await getRegistrationById(searchParamsList.id)

    if (!registration) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <h1 className='text-2xl font-bold'>No Registration Found</h1>
            </div>
        )
    }

    console.log(registration)

    if (registration.status !== Status.PENDING) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <h1 className='text-2xl font-bold'>Already Registered</h1>
            </div>
        )
    }

    return (
        <>
            <Container className="bg-white rounded-xl shadow-lg p-8 my-10">
                <h2 className="text-2xl font-bold mb-6 text-center">Registration Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="mb-4">
                            <span className="block text-gray-500 font-semibold text-sm">First Name</span>
                            <span className="block text-base">{registration.firstName}</span>
                        </div>
                        <div className="mb-4">
                            <span className="block text-gray-500 font-semibold text-sm">Middle Name</span>
                            <span className="block text-base">{registration.middleName}</span>
                        </div>
                        <div className="mb-4">
                            <span className="block text-gray-500 font-semibold text-sm">Last Name</span>
                            <span className="block text-base">{registration.lastName}</span>
                        </div>
                        <div className="mb-4">
                            <span className="block text-gray-500 font-semibold text-sm">Former/Maiden Name</span>
                            <span className="block text-base">{registration.formerOrMaidenName}</span>
                        </div>
                        <div className="mb-4">
                            <span className="block text-gray-500 font-semibold text-sm">Date of Birth</span>
                            <span className="block text-base">{registration.dateOfBirth}</span>
                        </div>
                        <div className="mb-4">
                            <span className="block text-gray-500 font-semibold text-sm">Gender</span>
                            <span className="block text-base">{registration.gender}</span>
                        </div>
                        <div className="mb-4">
                            <span className="block text-gray-500 font-semibold text-sm">Email Address</span>
                            <span className="block text-base">{registration.emailAddress}</span>
                        </div>
                        <div className="mb-4">
                            <span className="block text-gray-500 font-semibold text-sm">Country Code</span>
                            <span className="block text-base">{registration.countryCode}</span>
                        </div>
                        <div className="mb-4">
                            <span className="block text-gray-500 font-semibold text-sm">Phone</span>
                            <span className="block text-base">{registration.phone}</span>
                        </div>
                        <div className="mb-4">
                            <span className="block text-gray-500 font-semibold text-sm">Address</span>
                            <span className="block text-base">{registration.address}</span>
                        </div>
                        <div className="mb-4">
                            <span className="block text-gray-500 font-semibold text-sm">Street Address 2</span>
                            <span className="block text-base">{registration.streetAddress2}</span>
                        </div>
                        <div className="mb-4">
                            <span className="block text-gray-500 font-semibold text-sm">City</span>
                            <span className="block text-base">{registration.city}</span>
                        </div>
                    </div>
                    <div>
                        <div className="mb-4">
                            <span className="block text-gray-500 font-semibold text-sm">State</span>
                            <span className="block text-base">{registration.state}</span>
                        </div>
                        <div className="mb-4">
                            <span className="block text-gray-500 font-semibold text-sm">Country/Region</span>
                            <span className="block text-base">{registration.countryOrRegion}</span>
                        </div>
                        <div className="mb-4">
                            <span className="block text-gray-500 font-semibold text-sm">Zip/Postal Code</span>
                            <span className="block text-base">{registration.zipOrPostalCode}</span>
                        </div>
                        <div className="mb-4">
                            <span className="block text-gray-500 font-semibold text-sm">Resident</span>
                            <span className="block text-base">{registration.resident}</span>
                        </div>
                        <div className="mb-4">
                            <span className="block text-gray-500 font-semibold text-sm">Enrollment Type</span>
                            <span className="block text-base">{registration.enrollmentType}</span>
                        </div>
                        <div className="mb-4"></div>
                        <span className="block text-gray-500 font-semibold text-sm">Course Type</span>
                        <span className="block text-base">{registration.courseType}</span>
                    </div>
                    <div className="mb-4">
                        <span className="block text-gray-500 font-semibold text-sm">Present Level of Education</span>
                        <span className="block text-base">{registration.presentLevelOfEducation}</span>
                    </div>
                    <div className="mb-4">
                        <span className="block text-gray-500 font-semibold text-sm">Graduation Year</span>
                        <span className="block text-base">{registration.graduationYear}</span>
                    </div>
                    <div className="mb-4">
                        <span className="block text-gray-500 font-semibold text-sm">How Did You Hear About IHU</span>
                        <span className="block text-base">{registration.howDidYouHearAboutIHU}</span>
                    </div>
                    <div className="mb-4">
                        <span className="block text-gray-500 font-semibold text-sm">Objectives</span>
                        <span className="block text-base">{registration.objectives}</span>
                    </div>
                    <div className="mb-4">
                        <span className="block text-gray-500 font-semibold text-sm">Signature</span>
                        <span className="block text-base">{registration.signature}</span>
                    </div>
                    <div className="mb-4">
                        <span className="block text-gray-500 font-semibold text-sm">Received</span>
                        <ul className="ml-4 text-base list-disc">
                            <li>Diploma: {registration.recieved.diploma ? 'Yes' : 'No'}</li>
                            <li>Home School: {registration.recieved.homeSchool ? 'Yes' : 'No'}</li>
                            <li>GED: {registration.recieved.ged ? 'Yes' : 'No'}</li>
                            <li>Other: {registration.recieved.other ? 'Yes' : 'No'}</li>
                        </ul>
                    </div>
                    <div className="mb-4">
                        <span className="block text-gray-500 font-semibold text-sm">Status</span>
                        <span className="block text-base">{registration.status}</span>
                    </div>
                    <div className="mb-4">
                        <span className="block text-gray-500 font-semibold text-sm">Created At</span>
                                                                        <span className="block text-base">{formatDateTime(registration.createdAt)}</span>
                    </div>
                </div>
            </Container>


            {/* <Container>
                <InitiatePayment
                    _id={searchParamsList.id}
                />
            </Container> */}
        </>
    )
}

export default Checkout