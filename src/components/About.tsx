import React from 'react'
import Container from './Container'
import Image from 'next/image'
import { CiCircleCheck } from "react-icons/ci";

const About = () => {
    return (
        <section className="py-16 lg:py-24 bg-white">
            <Container>
                <div className='flex flex-col lg:flex-row gap-12 lg:gap-16 items-center'>
                    {/* Image Section */}
                    <div className='w-full lg:w-[40%]'>
                        <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                            <Image
                                src="/Images/Banners/banner1.jpeg"
                                alt='International Hindu University'
                                width={600}
                                height={400}
                                className='w-full h-auto object-cover'
                            />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className='w-full lg:w-[60%] space-y-6'>
                        {/* Header */}
                        <div className='text-center lg:text-left'>
                            <p className='text-sm lg:text-base text-primary-600 font-semibold mb-2'>About Us</p>
                            <h2 className='text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4'>
                                Who We Are
                                <div className='w-20 h-1 bg-primary-500 mt-2 mx-auto lg:mx-0' />
                            </h2>
                        </div>

                        {/* Description */}
                        <p className='text-base lg:text-lg text-gray-600 leading-relaxed text-center lg:text-left'>
                            International Hindu University is a not-for-profit, post-secondary degree-granting institution recognized by the Florida Department of Education and the Florida Commission on Independent Education under the authority of Florida State Statutes, Section 1005.06.
                        </p>

                        {/* Features */}
                        <div className='space-y-4'>
                            <div className='flex items-start gap-4 p-4 bg-gray-50 rounded-lg'>
                                <CiCircleCheck className="text-primary-500 flex-shrink-0 mt-1 w-6 h-6" />
                                <p className='text-base lg:text-lg text-gray-700'>Dedicated to preserving and promoting Hindu traditions</p>
                            </div>
                            
                            <div className='flex items-start gap-4 p-4 bg-gray-50 rounded-lg'>
                                <CiCircleCheck className="text-primary-500 flex-shrink-0 mt-1 w-6 h-6" />
                                <p className='text-base lg:text-lg text-gray-700'>Offering comprehensive religious and secular education</p>
                            </div>
                            
                            <div className='flex items-start gap-4 p-4 bg-gray-50 rounded-lg'>
                                <CiCircleCheck className="text-primary-500 flex-shrink-0 mt-1 w-6 h-6" />
                                <p className='text-base lg:text-lg text-gray-700'>Building bridges between ancient wisdom and modern knowledge</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default About