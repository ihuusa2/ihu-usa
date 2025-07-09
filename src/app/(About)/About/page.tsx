import Container from '@/components/Container'
import FadeContainer from '@/components/FadeContainer'
import { H2 } from '@/components/Headings'
import { Style } from '@/constant'
import { Metadata } from 'next'
import Image from 'next/image'
import React from 'react'
import { CiCircleCheck } from 'react-icons/ci'

export const metadata: Metadata = {
    title: 'Our Journey: The History of International Hindu University',
    description: 'Learn about the rich history of International Hindu University, a leading religious institution dedicated to preserving and teaching Hindu traditions and knowledge.'
}

const About = () => {
    return (
        <div className="py-12 sm:py-16 lg:py-20 xl:py-24 2xl:py-32 bg-white">
            <Container className='space-y-20 lg:space-y-28'>
                <div className='flex flex-col gap-8 lg:gap-12 xl:gap-16 2xl:gap-20 group'>
                    <FadeContainer direction='right' className='w-full flex justify-center'>
                        <div className='w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl aspect-video bg-gradient-to-r from-primary-500 to-transparent rounded-lg xl:rounded-xl 2xl:rounded-2xl shadow-xl xl:shadow-2xl 2xl:shadow-3xl overflow-hidden relative'>
                            <Image
                                src={"/Images/about1.png"}
                                alt='about image'
                                width={400}
                                height={200}
                                className='w-full h-full object-cover'
                            />
                        </div>
                    </FadeContainer>
                    <FadeContainer direction='left' className='w-full flex flex-col p-4 lg:p-6 xl:p-8 justify-center max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto'>
                        <p className='text-sm sm:text-base lg:text-lg xl:text-xl text-slate-500 mb-2 lg:mb-3 text-center'>About Us</p>
                        <H2 className='mb-6 lg:mb-8 w-fit mx-auto text-center'>Who We Are
                            <div className='border-b-4 w-16 xl:w-20 border-primary-500 group-hover:w-full transition-all' />
                        </H2>
                        <p className='text-sm sm:text-base lg:text-lg xl:text-xl text-slate-500 mb-6 lg:mb-8 leading-relaxed text-center'>
                            International Hindu University is a not-for-profit, post-secondary degree-granting institution recognized by the Florida Department of Education and the Florida Commission on Independent Education under the authority of Florida State Statutes, Section 1005.06.
                        </p>
                        <p className='text-sm sm:text-base lg:text-lg xl:text-xl text-slate-500 mb-6 lg:mb-8 leading-relaxed text-center'>
                            Religious institutions that meet the requirements found in Section 1005.06(1)(f), Florida Statutes and Rule 6E-5.001, Florida Administrative Code are not under the jurisdiction or purview of the Commission for Independent Education and are not required to obtain licensure. Section 1005.06(1)(f), F.S. reads:
                        </p>
                        <ul className='list-disc list-inside text-sm sm:text-base lg:text-lg xl:text-xl text-slate-500 space-y-3 lg:space-y-4 max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto'>
                            <li className='flex items-start'>
                                <span className='mr-2 flex-shrink-0'><CiCircleCheck color={Style.primaryColor} size={20} /></span>
                                Not-for-profit, post-secondary degree-granting institution.
                            </li>
                            <li className='flex items-start'>
                                <span className='mr-2 flex-shrink-0'><CiCircleCheck color={Style.primaryColor} size={20} /></span>
                                Recognized by the Florida Department of Education and the Florida Commission on Independent Education.
                            </li>
                            <li className='flex items-start'>
                                <span className='mr-2 flex-shrink-0'><CiCircleCheck color={Style.primaryColor} size={20} /></span>
                                Meets requirements found in Section 1005.06(1)(f), Florida Statutes and Rule 6E-5.001, Florida Administrative Code.
                            </li>
                            <li className='flex items-start'>
                                <span className='mr-2 flex-shrink-0'><CiCircleCheck color={Style.primaryColor} size={20} /></span>
                                Not required to obtain licensure from the Commission for Independent Education.
                            </li>
                        </ul>
                    </FadeContainer>
                </div>

                <div className='flex flex-col gap-8 lg:gap-12 xl:gap-16 2xl:gap-20 group'>
                    <FadeContainer direction='right' className='w-full flex flex-col p-4 lg:p-6 xl:p-8 justify-center max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto'>
                        <h3 className='text-sm sm:text-base lg:text-lg xl:text-xl text-slate-500 mb-2 lg:mb-3 text-center'>About Us</h3>
                        <h2 className='text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mt-4 mb-6 lg:mb-8 w-fit mx-auto text-center'>
                            What does the word &quot;Hindu&quot; mean?
                            <div className='border-b-4 w-16 xl:w-20 border-primary group-hover:w-full transition-all' />
                        </h2>
                        <p className='text-sm sm:text-base lg:text-lg xl:text-xl text-slate-500 mb-6 lg:mb-8 leading-relaxed text-center'>
                            &ldquo;Hinduism ... gave itself no name, because it set itself no sectarian limits; it claimed no universal adhesion, asserted no sole infallible dogma, set up no single narrow path or gate of salvation; it was less a creed or cult than a continuously enlarging tradition of the God ward endeavor of the human spirit. An immense many-sided and many staged provision for a spiritual self-building and self-finding, it had some right to speak of itself by the only name it knew, the eternal religion, Santana Dharma...&rdquo; – Sri Aurobindo
                        </p>
                    </FadeContainer>
                    <FadeContainer direction='left' className='w-full flex justify-center'>
                        <div className='w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl aspect-video bg-gradient-to-r from-primary-500 to-transparent rounded-lg xl:rounded-xl 2xl:rounded-2xl shadow-xl xl:shadow-2xl 2xl:shadow-3xl overflow-hidden relative'>
                            <Image
                                src={"/Images/about2.png"}
                                alt='about image'
                                width={400}
                                height={200}
                                className='w-full h-full object-cover'
                            />
                        </div>
                    </FadeContainer>
                </div>
            </Container>
        </div>
    )
}

export default About