import Container from '@/components/Container'
import { getTeamById } from '@/Server/Team'
import React from 'react'
import Image from 'next/image'
import BackButton from '@/components/BackButton'

type Props = {
    params: Promise<{
        slug: string
    }>
}

const Member = async ({ params }: Props) => {
    const paramList = await params
    const { slug } = paramList
    const data = await getTeamById(slug)

    if (!data) {
        return (
            <Container>
                <div className="flex flex-col items-center justify-center h-screen text-center">
                    <h1 className="text-4xl font-bold text-gray-900">Member Not Found</h1>
                    <p className="text-gray-600 mt-2">The requested team member could not be found.</p>
                </div>
            </Container>
        )
    }

    return (
        <Container className="flex flex-col items-center justify-center min-h-[80vh] py-10">
            <div className="w-full max-w-2xl mx-auto">
                {/* Member Profile Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                    {/* Header with Image */}
                    <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600">
                        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                            <div className="flex items-end space-x-6">
                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                                    <Image
                                        src={data.image as string}
                                        alt={data.name}
                                        fill
                                        className="object-cover object-center"
                                        priority={true}
                                    />
                                </div>
                                <div className="flex-1 mb-2">
                                    <h1 className="text-3xl font-bold text-white mb-1">{data.name}</h1>
                                    <div className="inline-block px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full">
                                        <span className="text-gray-900 font-medium">{data.role}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-strong:text-gray-900 prose-strong:font-semibold">
                            <div 
                                className="text-gray-700 leading-relaxed space-y-4"
                                dangerouslySetInnerHTML={{ __html: data.description }} 
                            />
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <BackButton label="Back to Team" />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Member