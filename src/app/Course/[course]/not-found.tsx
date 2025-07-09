import Container from '@/components/Container'
import { H1 } from '@/components/Headings'
import Link from 'next/link'

export default function CourseNotFound() {
    return (
        <Container className='min-h-[60vh] flex items-center justify-center'>
            <div className='text-center space-y-8 max-w-2xl mx-auto px-4'>
                {/* Animated Icon */}
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[var(--orange-saffron)]/20 to-[var(--amber-gold)]/20 rounded-full flex items-center justify-center animate-pulse">
                    <svg className="w-16 h-16 text-[var(--orange-saffron)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                
                {/* Title */}
                <H1 className='text-4xl md:text-5xl font-bold text-[var(--spiritual-blue)]'>Course Not Found</H1>
                
                {/* Description */}
                <p className='text-gray-600 text-lg leading-relaxed max-w-lg mx-auto'>
                    The course you&apos;re looking for doesn&apos;t exist or may have been moved. Please check back later or explore our other courses.
                </p>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <Link 
                        href="/Courses" 
                        className='inline-flex items-center gap-2 px-8 py-4 border border-transparent rounded-2xl bg-gradient-to-r from-[var(--orange-saffron)] to-[var(--amber-gold)] text-white font-semibold hover:from-[var(--amber-gold)] hover:to-[var(--orange-saffron)] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Browse All Courses
                    </Link>
                    <Link 
                        href="/Contact" 
                        className='inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-300 rounded-2xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 font-medium'
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Contact Support
                    </Link>
                </div>
                
                {/* Additional Help */}
                <div className="mt-8 p-6 bg-gradient-to-r from-[var(--spiritual-blue)]/5 to-[var(--amber-gold)]/5 rounded-2xl border border-[var(--spiritual-blue)]/10">
                    <h3 className="font-semibold text-[var(--spiritual-blue)] mb-2">Need Help?</h3>
                    <p className="text-gray-600 text-sm">
                        If you believe this is an error, please contact our support team. We&apos;re here to help you find the right course.
                    </p>
                </div>
            </div>
        </Container>
    )
} 