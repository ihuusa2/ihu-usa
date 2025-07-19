import Container from '@/components/Container'
import React from 'react'
import { H1 } from '@/components/Headings'
import { getCourseBySlug } from '@/Server/Course'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import CourseGallery from './CourseGallery'
import CourseVideoPlayer from './CourseVideoPlayer'

export const metadata: Metadata = {
    title: 'Courses - International Hindu University',
    description: 'Explore the diverse degree programs offered at IHU, including Vedic Studies, Yoga, Ayurveda, and more. Join today for quality Hindu spiritual education. Visit now'
}

type Props = {
    params: Promise<{ course: string }>
}

const SingleCourse = async ({ params }: Props) => {
    const paramsList = await params
    console.log('Course slug from params:', paramsList?.course);
    
    const data = await getCourseBySlug(paramsList?.course)
    console.log('Course data fetched:', data);

    // Function to extract YouTube video ID
    const getYouTubeVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    // Function to determine if URL is YouTube
    const isYouTubeUrl = (url: string) => {
        return url.includes('youtube.com') || url.includes('youtu.be');
    }

    // Function to strip HTML tags and get plain text
    const stripHtml = (html: string) => {
        return html.replace(/<[^>]+>/g, '').trim();
    }

    // Function to truncate text
    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    if (!data) {
        console.error('Course not found for slug:', paramsList?.course);
        notFound();
    }

    // Debug logging
    console.log('Course data:', data);
    console.log('Course title:', data.title);
    console.log('Course type:', data.type);

    // Validate required fields
    if (!data.title || !data.type) {
        console.error('Course data missing required fields:', { title: data.title, type: data.type });
    }

    // Create registration URL with course information
    const registrationUrl = `/Registration-Form?course=${encodeURIComponent(data.title || 'Unknown Course')}&courseType=${encodeURIComponent(data.type || 'General')}`
    
    console.log('Generated registration URL:', registrationUrl);

    // Course statistics
    const courseStats = [
        { label: 'Students Enrolled', value: '500+', color: 'text-[var(--orange-saffron)]', icon: '👥' },
        { label: 'Average Rating', value: '4.9', color: 'text-[var(--wisdom-green)]', icon: '⭐' },
        { label: 'Completion Rate', value: '95%', color: 'text-[var(--spiritual-blue)]', icon: '🎯' },
        { label: 'Lifetime Access', value: '∞', color: 'text-[var(--amber-gold)]', icon: '🔓' }
    ];

    // Course benefits
    const courseBenefits = [
        'Comprehensive Study Materials',
        'Expert Instructor Support',
        'Certificate of Completion',
        'Lifetime Access to Content',
        'Interactive Learning Modules',
        'Community Support Forum'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-[var(--orange-saffron)] to-[var(--amber-gold)] min-h-[400px] flex flex-col justify-center items-center text-center overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--orange-saffron)]/20 to-[var(--amber-gold)]/20"></div>
                
                {/* Floating Elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
                <div className="absolute bottom-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-float animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float animation-delay-4000"></div>
                
                <div className="relative z-5 py-12 md:py-20 w-full max-w-5xl mx-auto px-4">
                    {/* Course Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-sm font-semibold mb-6 shadow-lg border border-white/30">
                        <span className="w-3 h-3 bg-[var(--amber-gold)] rounded-full animate-pulse"></span>
                        {data.type} Course
                    </div>
                    
                    {/* Course Title */}
                    <H1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-2xl mb-4 leading-tight">
                        {data.title}
                    </H1>
                    
                    {/* Decorative Line */}
                    <div className="w-32 h-1 bg-white mx-auto rounded-full mb-6 shadow-lg"></div>
                    
                    {/* Course Description */}
                    <p className="text-lg md:text-xl text-white/90 font-medium mb-8 max-w-3xl mx-auto leading-relaxed">
                        {truncateText(stripHtml(data.description), 200)}
                    </p>
                    
                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                        <Link 
                            href={registrationUrl} 
                            className="group px-8 py-4 bg-white text-[var(--orange-saffron)] font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 text-lg hover:scale-105 transform hover:-translate-y-1 animate-bounce-gentle cursor-pointer"
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Register Now
                            </span>
                        </Link>
                        <Link 
                            href="/Contact" 
                            className="px-8 py-4 border-2 border-white text-white font-semibold rounded-2xl hover:bg-white hover:text-[var(--orange-saffron)] transition-all duration-300 text-lg hover:scale-105 transform hover:-translate-y-1"
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Ask Questions
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            <Container className="py-16">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[65%_35%] gap-12">
                    {/* LEFT: Course Details */}
                    <div className="space-y-10">
                        {/* Course Overview Card */}
                        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 hover:shadow-3xl transition-all duration-300">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-gradient-to-r from-[var(--orange-saffron)] to-[var(--amber-gold)] rounded-2xl flex items-center justify-center shadow-lg">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold text-[var(--spiritual-blue)]">Course Overview</h2>
                            </div>
                            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: data.description }} />
                        </div>

                        {/* Benefits Checklist */}
                        <div className="bg-gradient-to-br from-[var(--amber-gold)]/10 to-[var(--wisdom-green)]/10 rounded-3xl p-8 border border-[var(--amber-gold)]/30 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-[var(--wisdom-green)] rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-[var(--wisdom-green)]">What You&apos;ll Get</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courseBenefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-white/50 rounded-xl hover:bg-white/70 transition-colors duration-200">
                                        <span className="w-6 h-6 bg-[var(--amber-gold)] rounded-full flex items-center justify-center text-white shadow-md">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                                            </svg>
                                        </span>
                                        <span className="text-gray-700 font-medium">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>



                        {/* Gallery */}
                        {data.galleryImages && data.galleryImages.length > 0 && (
                            <CourseGallery 
                                images={data.galleryImages as string[]} 
                                title={data.title} 
                            />
                        )}

                        {/* Statistics & Social Proof */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {courseStats.map((stat, index) => (
                                <div key={index} className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
                                    <div className={`text-4xl mb-2 ${stat.color} font-bold`}>{stat.value}</div>
                                    <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                                    <div className="text-2xl mt-2">{stat.icon}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Sidebar */}
                    <div className="space-y-8">
                        {/* Course Image Card */}
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-3xl transition-all duration-300">
                            <div className="relative">
                                <Image 
                                    width={400} 
                                    height={300} 
                                    src={data.images?.[0] as string || '/Images/Programs/image1.png'} 
                                    alt={data.title + ' course image'} 
                                    className="w-full h-64 object-cover" 
                                    loading="lazy" 
                                />
                                <div className="absolute top-4 right-4 bg-[var(--orange-saffron)] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                                    Featured
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                    <svg className="w-4 h-4 text-[var(--amber-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-medium">Self-Paced Learning</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <svg className="w-4 h-4 text-[var(--wisdom-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-medium">Certificate Included</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Info Card */}
                        <div className="bg-gradient-to-br from-[var(--spiritual-blue)]/10 to-[var(--amber-gold)]/10 rounded-3xl p-6 border border-[var(--spiritual-blue)]/20 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-[var(--spiritual-blue)] to-[var(--amber-gold)] rounded-2xl flex items-center justify-center shadow-lg">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-[var(--spiritual-blue)]">Course Details</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-[var(--spiritual-blue)]/10">
                                    <span className="text-gray-700 font-medium">Category:</span>
                                    <span className="text-gray-900 font-semibold bg-[var(--amber-gold)]/20 px-3 py-1 rounded-full text-sm">{data.type}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-[var(--spiritual-blue)]/10">
                                    <span className="text-gray-700 font-medium">Format:</span>
                                    <span className="text-gray-900 font-semibold">Online</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-[var(--spiritual-blue)]/10">
                                    <span className="text-gray-700 font-medium">Duration:</span>
                                    <span className="text-gray-900 font-semibold">{data.duration || 'Self-Paced'}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-[var(--spiritual-blue)]/10">
                                    <span className="text-gray-700 font-medium">Level:</span>
                                    <span className="text-gray-900 font-semibold">{data.level || 'All Levels'}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-[var(--spiritual-blue)]/10">
                                    <span className="text-gray-700 font-medium">Start Date:</span>
                                    <span className="text-gray-900 font-semibold">
                                        {data.startDate ? 
                                            new Date(data.startDate).toLocaleDateString('en-US', { 
                                                weekday: 'long',
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            }) : 
                                            'To be announced'
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-[var(--spiritual-blue)]/10">
                                    <span className="text-gray-700 font-medium">End Date:</span>
                                    <span className="text-gray-900 font-semibold">
                                        {data.endDate ? 
                                            new Date(data.endDate).toLocaleDateString('en-US', { 
                                                weekday: 'long',
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            }) : 
                                            'To be announced'
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-gray-700 font-medium">Language:</span>
                                    <span className="text-gray-900 font-semibold">English/Hindi</span>
                                </div>
                            </div>
                        </div>

                        {/* Instructor Info */}
                        {data.instructor && (
                            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-[var(--wisdom-green)] to-[var(--amber-gold)] rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[var(--spiritual-blue)]">Instructor</h4>
                                        <p className="text-gray-600 text-sm">{data.instructor}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* FAQs */}
                        {data.faqs && data.faqs.length > 0 && (
                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[var(--spiritual-blue)]/5 to-[var(--amber-gold)]/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-[var(--spiritual-blue)] rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-[var(--spiritual-blue)]">Frequently Asked Questions</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-3">
                                        {data.faqs.map((faq, index) => (
                                            <details key={faq._id || index} className="group border border-gray-200 rounded-xl overflow-hidden hover:border-[var(--amber-gold)] transition-all duration-300 hover:shadow-md">
                                                <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-[var(--spiritual-blue)]/5 hover:to-[var(--amber-gold)]/5 transition-all duration-300 select-none flex items-center justify-between group-open:bg-gradient-to-r group-open:from-[var(--spiritual-blue)]/10 group-open:to-[var(--amber-gold)]/10">
                                                    <span className="line-clamp-2 group-open:line-clamp-none">{faq.question}</span>
                                                    <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 group-open:text-[var(--amber-gold)] transition-all duration-300 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </summary>
                                                <div className="px-4 pb-3 text-gray-600 leading-relaxed text-sm bg-gradient-to-b from-transparent to-gray-50/50 group-open:animate-slideDown" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                            </details>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Testimonial Videos */}
                        {data.testimonialVideos && data.testimonialVideos.length > 0 && (
                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[var(--spiritual-blue)]/5 to-[var(--amber-gold)]/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-[var(--spiritual-blue)] rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-[var(--spiritual-blue)]">Student Testimonials</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {data.testimonialVideos.map((video, index) => (
                                            <details key={video._id || index} className="group border border-gray-200 rounded-xl overflow-hidden hover:border-[var(--amber-gold)] transition-all duration-300 hover:shadow-md">
                                                <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-[var(--spiritual-blue)]/5 hover:to-[var(--amber-gold)]/5 transition-all duration-300 select-none flex items-center justify-between group-open:bg-gradient-to-r group-open:from-[var(--spiritual-blue)]/10 group-open:to-[var(--amber-gold)]/10">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-[var(--amber-gold)] rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                                            </svg>
                                                        </div>
                                                        <span className="line-clamp-1 group-open:line-clamp-none">{video.title}</span>
                                                    </div>
                                                    <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 group-open:text-[var(--amber-gold)] transition-all duration-300 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </summary>
                                                <div className="px-4 pb-4 bg-gradient-to-b from-transparent to-gray-50/50 group-open:animate-slideDown">
                                                    <CourseVideoPlayer
                                                        videoUrl={video.videoUrl}
                                                        title={video.title}
                                                        description={video.description}
                                                        thumbnail={video.thumbnail}
                                                        isYouTube={isYouTubeUrl(video.videoUrl)}
                                                        youtubeId={isYouTubeUrl(video.videoUrl) ? getYouTubeVideoId(video.videoUrl) || undefined : undefined}
                                                    />
                                                </div>
                                            </details>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quick Actions */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 pointer-events-auto">
                            <h4 className="font-bold text-[var(--spiritual-blue)] mb-4 text-lg">Quick Actions</h4>
                            <div className="space-y-3">
                                <Link 
                                    href={registrationUrl}
                                    className="block w-full py-3 bg-gradient-to-r from-[var(--orange-saffron)] to-[var(--amber-gold)] text-white font-bold rounded-xl text-center hover:from-[var(--amber-gold)] hover:to-[var(--orange-saffron)] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
                                >
                                    Enroll Now
                                </Link>
                                <Link 
                                    href="/Contact"
                                    className="block w-full py-3 border-2 border-[var(--spiritual-blue)] text-[var(--spiritual-blue)] font-semibold rounded-xl text-center hover:bg-[var(--spiritual-blue)] hover:text-white transition-all duration-300"
                                >
                                    Contact Instructor
                                </Link>
                                <Link 
                                    href="/Courses"
                                    className="block w-full py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl text-center hover:bg-gray-50 transition-all duration-300"
                                >
                                    Browse More Courses
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Sticky Registration CTA */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-5 w-full max-w-md px-4 pointer-events-auto">
                <Link 
                    href={registrationUrl} 
                    className="block w-full py-4 bg-gradient-to-r from-[var(--orange-saffron)] to-[var(--amber-gold)] text-white text-xl font-bold rounded-2xl shadow-2xl text-center hover:from-[var(--amber-gold)] hover:to-[var(--orange-saffron)] transition-all duration-300 animate-glow hover:scale-105 transform hover:-translate-y-1 cursor-pointer"
                >
                    <span className="flex items-center justify-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Register for this Course
                    </span>
                </Link>
            </div>
        </div>
    )
}

export default SingleCourse
