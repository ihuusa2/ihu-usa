import Container from '@/components/Container'
import React from 'react'
import Gallery from '@/components/Gallery'
import { H1 } from '@/components/Headings'
import { getAllPhotos } from '@/Server/PhotoGallery'
import { PhotoGallery as PhotoGalleryType } from '@/Types/Gallery'
import { Metadata } from 'next'
import FadeContainer from '@/components/FadeContainer'

export const metadata: Metadata = {
    title: 'Photo Gallery - International Hindu University',
    description: 'Explore our diverse photo gallery showcasing events and activities at International Hindu University.'
}

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const PhotoGallery = async ({ searchParams }: Props) => {
    const searchParamsList = await searchParams
    const data: { list: PhotoGalleryType[], count: number } = await getAllPhotos({ searchParams: searchParamsList }) as { list: PhotoGalleryType[], count: number }

    // const img = { image: '/public/Images/Banners/banner2.jpeg', title: 'Photo Gallery', description: 'Explore our diverse photo gallery showcasing events and activities at International Hindu University.' }

    if (data.count === 0) {
        return (
            <FadeContainer>
                <Container className='my-20'>
                    <div className='flex flex-col items-center justify-center min-h-[50vh]'>
                        <H1 className='text-center text-3xl md:text-4xl font-bold text-slate-800'>
                            No Photos Available
                        </H1>
                        <p className='text-slate-600 mt-4 text-center'>
                            Check back later for new photo updates.
                        </p>
                    </div>
                </Container>
            </FadeContainer>
        )
    }

    return (
        <FadeContainer>
            <Container className='my-20'>
                <div className='flex flex-col items-center mb-12'>
                    <p className='text-slate-600 text-sm md:text-base mb-2'>Our Visual Journey</p>
                    <H1 className='text-center text-3xl md:text-4xl font-bold text-slate-800'>
                        Explore Our Photo Gallery
                    </H1>
                    <p className='text-slate-600 mt-4 text-center max-w-2xl'>
                        Discover the vibrant moments and memorable events that shape our university community.
                    </p>
                </div>

                <Gallery 
                    data={data?.list.map(photo => ({ 
                        ...photo, 
                        _id: photo._id?.toString() 
                    })) as { _id: string, image: string, title: string, description: string }[]} 
                />
            </Container>
        </FadeContainer>
    )
}

export default PhotoGallery