import { getAllBlogs } from '@/Server/Blogs';
import { getActiveCarouselImages } from '@/Server/Carousel';
import { Blog } from '@/Types/Blogs';
import { CarouselImage } from '@/Types/Carousel';
import HomeClientNew from './HomeClientNew';
import { Metadata } from 'next';
import Script from 'next/script';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] }>;
}

export const metadata: Metadata = {
  title: 'International Hindu University (IHU-USA) - Vedic Studies, Yoga & Ayurveda',
  description: "Discover comprehensive online courses in Vedic Studies, Yoga, Ayurveda, and Hindu philosophy at International Hindu University (IHU-USA). Enroll in master's degree programs and certificate courses.",
  keywords: [
    'Vedic Studies',
    'Yoga',
    'Ayurveda',
    'Hindu University',
    'Online Courses',
    'Spiritual Education',
    'Vedic Philosophy',
    'Yoga Teacher Training',
    'Ayurvedic Medicine',
    'Hindu Studies',
    'Religious Education',
    'Distance Learning'
  ],
  openGraph: {
    title: 'International Hindu University (IHU-USA) - Vedic Studies, Yoga & Ayurveda',
    description: 'Discover comprehensive online courses in Vedic Studies, Yoga, Ayurveda, and Hindu philosophy at International Hindu University (IHU-USA).',
    url: 'https://ihu-usa.org',
    siteName: 'International Hindu University',
    images: [
      {
        url: '/Images/logo.png',
        width: 1200,
        height: 630,
        alt: 'International Hindu University Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'International Hindu University (IHU-USA) - Vedic Studies, Yoga & Ayurveda',
    description: 'Discover comprehensive online courses in Vedic Studies, Yoga, Ayurveda, and Hindu philosophy.',
    images: ['/Images/logo.png'],
  },
  alternates: {
    canonical: '/',
  },
};

const Home = async ({ searchParams }: Props) => {
  const searchParamsList = await searchParams
  const blogs: { list: Blog[], count: number } = await getAllBlogs({ searchParams: searchParamsList }) as { list: Blog[], count: number }
  
  // Fetch active carousel images
  const carouselImages: CarouselImage[] = await getActiveCarouselImages()

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "International Hindu University (IHU-USA)",
            "description": "A leading institution offering comprehensive online courses in Vedic Studies, Yoga, Ayurveda, and Hindu philosophy.",
            "url": "https://ihu-usa.org",
            "logo": "https://ihu-usa.org/Images/logo.png",
            "sameAs": [
              "https://www.facebook.com/ihuusa",
              "https://www.twitter.com/ihu_usa",
              "https://www.instagram.com/ihu_usa"
            ],
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "US"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "email": "info@ihu-usa.org"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Educational Programs",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Course",
                    "name": "Vedic Studies",
                    "description": "Comprehensive study of Vedic texts and philosophy"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Course",
                    "name": "Yoga Teacher Training",
                    "description": "Professional yoga teacher certification program"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Course",
                    "name": "Ayurveda",
                    "description": "Traditional Indian medicine and wellness practices"
                  }
                }
              ]
            }
          })
        }}
      />
      <HomeClientNew blogs={blogs} carouselImages={carouselImages} />
    </>
  )
}

export default Home
