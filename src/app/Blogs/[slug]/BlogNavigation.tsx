'use client'

import { ArrowLeft, BookOpen, Eye, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useHasMounted } from '@/hooks/useClientOnly'

export default function BlogNavigation() {
    const hasMounted = useHasMounted()

    const scrollToTop = () => {
        if (hasMounted && typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    const scrollToOverview = () => {
        if (hasMounted && typeof window !== 'undefined') {
            const headers = Array.from(document.querySelectorAll('h2'));
            const overview = headers.find(h => h.textContent?.includes('Article Overview'));
            overview?.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const scrollToFullArticle = () => {
        if (hasMounted && typeof window !== 'undefined') {
            const headers = Array.from(document.querySelectorAll('h2'));
            const fullArticle = headers.find(h => h.textContent?.includes('Full Article'));
            fullArticle?.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return (
        <div className='sticky top-4 w-full min-w-[320px]'>
            <div className='bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 w-full'>
                {/* Header */}
                <div className='px-8 pt-8 pb-4'>
                    <div className='flex items-center gap-3 mb-2'>
                        <div className='w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg'>
                            <BookOpen className='w-5 h-5 text-white' />
                        </div>
                        <h3 className='text-xl font-bold text-gray-900'>Quick Navigation</h3>
                    </div>
                </div>
                
                {/* Content */}
                <div className='px-8 pb-8'>
                    {/* Navigation Links */}
                    <div className='space-y-3 mb-8'>
                        <button 
                            onClick={scrollToTop}
                            className='w-full flex items-center gap-4 px-6 py-4 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded-xl transition-all duration-200 group border border-transparent hover:border-orange-200 hover:shadow-md'
                        >
                            <span className='text-xl'>📑</span>
                            <span className='font-semibold text-base'>Back to Top</span>
                        </button>
                        <button 
                            onClick={scrollToOverview}
                            className='w-full flex items-center gap-4 px-6 py-4 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded-xl transition-all duration-200 group border border-transparent hover:border-orange-200 hover:shadow-md'
                        >
                            <span className='text-xl'>📋</span>
                            <span className='font-semibold text-base'>Article Overview</span>
                        </button>
                        <button 
                            onClick={scrollToFullArticle}
                            className='w-full flex items-center gap-4 px-6 py-4 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded-xl transition-all duration-200 group border border-transparent hover:border-orange-200 hover:shadow-md'
                        >
                            <span className='text-xl'>📖</span>
                            <span className='font-semibold text-base'>Full Article</span>
                        </button>
                    </div>

                    {/* Article Stats */}
                    <div className='border-t border-gray-100 pt-8'>
                        <h4 className='text-base font-bold text-gray-900 mb-6 uppercase tracking-wide flex items-center gap-2'>
                            <div className='w-2 h-2 bg-orange-400 rounded-full'></div>
                            Article Stats
                        </h4>
                        
                        {/* Reading Time - Featured */}
                        <div className='mb-6 p-5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100 shadow-sm'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-3'>
                                    <Clock className='w-5 h-5 text-orange-600' />
                                    <span className='text-base font-semibold text-orange-700'>Reading Time</span>
                                </div>
                                <div className='text-right'>
                                    <div className='text-2xl font-bold text-orange-700'>8</div>
                                    <div className='text-sm text-orange-600 font-medium'>Minutes</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Stats Grid */}
                        <div className='grid grid-cols-1 gap-4 mb-8'>
                            <div className='text-center p-4 bg-blue-50 rounded-xl border border-blue-100 shadow-sm'>
                                <div className='flex items-center justify-center gap-2 mb-2'>
                                    <Eye className='w-4 h-4 text-blue-600' />
                                    <span className='text-sm font-semibold text-blue-700'>Views</span>
                                </div>
                                <div className='text-xl font-bold text-blue-700'>2.5k</div>
                            </div>
                            <div className='text-center p-4 bg-green-50 rounded-xl border border-green-100 shadow-sm'>
                                <div className='flex items-center justify-center gap-2 mb-2'>
                                    <TrendingUp className='w-4 h-4 text-green-600' />
                                    <span className='text-sm font-semibold text-green-700'>Status</span>
                                </div>
                                <div className='text-xl font-bold text-green-700'>New</div>
                            </div>
                        </div>
                    </div>

                    {/* Back to All Articles */}
                    <div className='border-t border-gray-100 pt-8'>
                        <Link href='/Blogs' className='block'>
                            <button className='w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-semibold rounded-xl py-4 text-base shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3'>
                                <ArrowLeft className='w-5 h-5' />
                                All Articles
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
} 