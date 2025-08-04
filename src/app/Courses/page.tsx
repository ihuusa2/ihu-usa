import { Metadata } from 'next'
import CoursesClient from './[slug]/page'

export const metadata: Metadata = {
  title: 'Courses - International Hindu University',
  description: 'Explore comprehensive online courses in Vedic Studies, Yoga, Ayurveda, and Hindu philosophy at International Hindu University. Enroll in master\'s degree programs and certificate courses.',
  keywords: [
    'Vedic Studies Courses',
    'Yoga Teacher Training',
    'Ayurveda Courses',
    'Hindu Philosophy',
    'Online Education',
    'Spiritual Courses',
    'Religious Education',
    'Certificate Programs',
    'Master\'s Degree'
  ],
  openGraph: {
    title: 'Courses - International Hindu University',
    description: 'Explore comprehensive online courses in Vedic Studies, Yoga, Ayurveda, and Hindu philosophy at International Hindu University.',
    url: 'https://ihu-usa.org/Courses',
    siteName: 'International Hindu University',
    images: ['/Images/logo.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Courses - International Hindu University',
    description: 'Explore comprehensive online courses in Vedic Studies, Yoga, Ayurveda, and Hindu philosophy.',
    images: ['/Images/logo.png'],
  },
  alternates: {
    canonical: '/Courses',
  },
}

export default function CoursesPage() {
  return <CoursesClient params={Promise.resolve({ slug: 'all' })} searchParams={Promise.resolve({})} />
} 