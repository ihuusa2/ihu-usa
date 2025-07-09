import Container from '@/components/Container'
import FadeContainer from '@/components/FadeContainer'
import { H2 } from '@/components/Headings'
import { Style } from '@/constant'
import Image from 'next/image'
import React from 'react'
import { CiCircleCheck } from 'react-icons/ci'

import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Our Mission & Vision - International Hindu University',
  description: 'Discover the mission and vision of International Hindu University, a premier institution focused on promoting the meaning of Hinduism in America. Explore Our Vision'
}

const Mission = () => {
  return (
    <Container className='my-20 space-y-28'>

      <div className='flex flex-col md:flex-row gap-10 group'>
        <FadeContainer direction='right' className='flex-1 relative p-1 flex items-center justify-center'>
          <Image
            src={"/Images/mission.png"}
            alt='about image'
            width={400}
            height={200}
            className='size-40 object-contain rounded-md aspect-video relative'
          />
        </FadeContainer>
        <FadeContainer direction='left' className='flex flex-col p-4 flex-1'>
          <p className='text-slate-500'>Mission</p>
          <H2 className='font-bold mb-8 w-fit'>Our Mission
            <div className='border-b-4 w-16 border-primary-500 group-hover:w-full transition-all' />
          </H2>
          <p className='text-md text-slate-500 mb-8 leading-relaxed'>
            To share the understanding of the Hindu dharmic way of life to nurture peace, co-existence, and mutual respect in the world.
          </p>
          <ul className='list-disc list-inside text-sm text-slate-500 space-y-5'>
            <li className='flex items-start'>
              <span className='mr-2'><CiCircleCheck color={Style.primaryColor} size={20} /></span>
              Promote peace and harmony.
            </li>
            <li className='flex items-start'>
              <span className='mr-2'><CiCircleCheck color={Style.primaryColor} size={20} /></span>
              Foster co-existence and mutual respect.
            </li>
            <li className='flex items-start'>
              <span className='mr-2'><CiCircleCheck color={Style.primaryColor} size={20} /></span>
              Share the understanding of the Hindu dharmic way of life.
            </li>
          </ul>
        </FadeContainer>
      </div>

      <div className='flex flex-col md:flex-row gap-10 group'>
        <FadeContainer direction='right' className='flex flex-col p-4 flex-1'>
          <p className='text-slate-500'>Vision</p>
          <H2 className='font-bold mb-8 w-fit'>Our Vision
            <div className='border-b-4 w-16 border-primary-500 group-hover:w-full transition-all' />
          </H2>
          <p className='text-md text-slate-500 mb-8 leading-relaxed'>
            Uniting ancient spiritual wisdom of the Hindu dharmic way of life with the curiosity of the West.
          </p>
          <ul className='list-disc list-inside text-sm text-slate-500 space-y-5'>
            <li className='flex items-start'>
              <span className='mr-2'><CiCircleCheck color={Style.primaryColor} size={20} /></span>
              Promote peace and harmony.
            </li>
            <li className='flex items-start'>
              <span className='mr-2'><CiCircleCheck color={Style.primaryColor} size={20} /></span>
              Foster co-existence and mutual respect.
            </li>
            <li className='flex items-start'>
              <span className='mr-2'><CiCircleCheck color={Style.primaryColor} size={20} /></span>
              Share the understanding of the Hindu dharmic way of life.
            </li>
          </ul>
        </FadeContainer>
        <FadeContainer direction='left' className='flex-1 relative p-1 flex items-center justify-center'>
          <Image
            src={"/Images/vision.png"}
            alt='about image'
            width={400}
            height={200}
            className='size-40 object-contain rounded-md aspect-video relative'
          />
        </FadeContainer>
      </div>

      <div className='flex flex-col md:flex-row gap-10 group'>
        <FadeContainer direction='right' className='flex-1 relative p-1 flex items-center justify-center'>
          <Image
            src={"/Images/goals.png"}
            alt='about image'
            width={400}
            height={200}
            className='size-40 object-contain rounded-md aspect-video relative'
          />
        </FadeContainer>
        <FadeContainer direction='left' className='flex flex-col p-4 flex-1'>
          <p className='text-md text-slate-500'>Goals</p>
          <H2 className='font-bold mb-8 w-fit'>Our Goals
            <div className='border-b-4 w-16 border-primary-500 group-hover:w-full transition-all' />
          </H2>
          <p className='text-md text-slate-500 mb-8 leading-relaxed'>
            To take our mission to students of all ages, faiths, disciplines, and degrees so that they can join us in exploring the modern legacy of the oldest religion on earth.
          </p>
          <ul className='list-disc list-inside text-sm text-slate-500 space-y-5'>
            <li className='flex items-start'>
              <span className='mr-2'><CiCircleCheck color={Style.primaryColor} size={20} /></span>
              Engage students of all ages and backgrounds.
            </li>
            <li className='flex items-start'>
              <span className='mr-2'><CiCircleCheck color={Style.primaryColor} size={20} /></span>
              Explore the modern legacy of ancient religions.
            </li>
            <li className='flex items-start'>
              <span className='mr-2'><CiCircleCheck color={Style.primaryColor} size={20} /></span>
              Promote interdisciplinary learning and respect.
            </li>
          </ul>
        </FadeContainer>
      </div>

      <div className='flex flex-col md:flex-row gap-10 group'>
        <FadeContainer direction='right' className='flex flex-col p-4 flex-1'>
          <p className='text-md text-slate-500'>Values</p>
          <H2 className='font-bold mb-8 w-fit'>Our Values
            <div className='border-b-4 w-16 border-primary-500 group-hover:w-full transition-all' />
          </H2>
          <p className='text-md text-slate-500 mb-8 leading-relaxed'>
            Our values are derived from the Vedic Values of the Sanatana Dharma, the principles of living in harmony with our Self and with the Universe.
          </p>
          <ul className='list-disc list-inside text-sm text-slate-500 space-y-5'>
            <li className='flex items-start'>
              <span className='mr-2'><CiCircleCheck color={Style.primaryColor} size={20} /></span>
              Living in harmony with our Self.
            </li>
            <li className='flex items-start'>
              <span className='mr-2'><CiCircleCheck color={Style.primaryColor} size={20} /></span>
              Living in harmony with the Universe.
            </li>
            <li className='flex items-start'>
              <span className='mr-2'><CiCircleCheck color={Style.primaryColor} size={20} /></span>
              Following Vedic Values of Sanatana Dharma.
            </li>
          </ul>
        </FadeContainer>
        <FadeContainer direction='left' className='flex-1 relative p-1 flex items-center justify-center'>
          <Image
            src={"/Images/values.png"}
            alt='about image'
            width={400}
            height={200}
            className='size-40 object-contain rounded-md aspect-video relative'
          />
        </FadeContainer>
      </div>
    </Container>
  )
}

export default Mission