import { NextResponse } from 'next/server'
import { createCarouselImage } from '@/Server/Carousel'
import { CarouselImage } from '@/Types/Carousel'

export async function POST() {
  try {
    const initialCarouselData: Omit<CarouselImage, '_id'>[] = [
      {
        src: '/Images/Banners/banner1.jpeg',
        alt: 'International Hindu University Banner 1',
        title: 'Where Ancient Wisdom Meets Modern Education',
        description: 'Discover the perfect blend of traditional Hindu knowledge and contemporary learning',
        isActive: true,
        displayOrder: 1,
      },
      {
        src: '/Images/Banners/banner2.jpeg',
        alt: 'International Hindu University Banner 2',
        title: 'Building a Legacy of Excellence',
        description: 'Preserving Hindu traditions while advancing modern education through innovative programs',
        isActive: true,
        displayOrder: 2,
      },
      {
        src: '/Images/Banners/banner3.jpeg',
        alt: 'International Hindu University Banner 3',
        title: 'Join Our Global Community',
        description: 'Connect with students and scholars worldwide in a supportive environment',
        isActive: true,
        displayOrder: 3,
      },
    ]

    const results = []
    for (const carouselData of initialCarouselData) {
      try {
        const result = await createCarouselImage(carouselData)
        results.push(result)
      } catch (error) {
        console.error('Error creating carousel image:', error)
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully seeded ${results.length} carousel images`,
      results 
    })
  } catch (error) {
    console.error('Error seeding carousel data:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to seed carousel data' },
      { status: 500 }
    )
  }
} 