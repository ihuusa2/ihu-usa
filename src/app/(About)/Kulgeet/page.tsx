import Container from '@/components/Container'
import { H1 } from '@/components/Headings'
import Image from 'next/image'
import React from 'react'

import { Metadata } from 'next'
export const metadata: Metadata = {
    title: 'IHU Anthem - The Kulgeet of International Hindu University',
    description: 'Listen to the IHU Anthem, a tribute to the values and mission of International Hindu University. Celebrate our spirit and dedication to Hindu education..'
}

const Kulgeet = () => {
    return (
        <Container className='my-16'>
            <H1 className='font-bold'>IHU Anthem</H1>
            <div className='shadow border border-slate-200 p-10 rounded-md mt-10'>
                <Image
                    src={"/Images/anthem.png"}
                    alt="Anthem Image"
                    width={0}
                    height={0}
                    sizes='100vw'
                    className='w-full h-auto rounded-md'
                />
            </div>
        </Container>
    )
}

export default Kulgeet