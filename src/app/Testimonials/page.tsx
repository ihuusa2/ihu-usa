import Container from '@/components/Container'
import React from 'react'

export default function page() {
  const videos = [
    {
      src: '/Videos/testimonialvideo.mp4',
      title: 'Natural Health Science'
    },
    {
      src: '/Videos/testimonialvideo2.mp4',
      title: 'Natural Health Science'
    },
    {
      src: '/Videos/testimonialvideo3.mp4',
      title: 'Natural Health Science'
    }
  ]

  return (
    <Container>
      <h1 className='text-3xl font-bold mb-8 text-center mt-5'>Testimonials</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {videos.map((video, index) => (
          <div key={index} className='rounded-lg overflow-hidden shadow-lg'>
            <video 
              className='w-full h-auto'
              controls
              preload="metadata"
            >
              <source src={video.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className='p-4'>
              <h2 className='text-lg font-semibold'>{video.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
