import Container from '@/components/Container'
import { H1, H4 } from '@/components/Headings'
import { getBlogBySlug, getAllBlogs } from '@/Server/Blogs'
import type { Blog } from '@/Types/Blogs'
import SafeImage from '@/components/SafeImage'
import { getValidImageUrl } from '@/utils/imageUtils'
import Link from 'next/link'
import React from 'react'
import { Metadata } from 'next'
import { ArrowLeft, Calendar, Clock, BookOpen, ChevronRight, User, Eye, AlertCircle } from 'lucide-react'
import BlogNavigation from './BlogNavigation'
import ShareButton from '@/components/ShareButton'
import FloatingShareButton from '@/components/FloatingShareButton'
import Script from 'next/script'

type Props = {
    params: Promise<{ slug: string }>
}

// Helper function to validate content
const getValidContent = (content: string | undefined | null): string => {
    if (typeof content === 'string' && content.trim() !== '') {
        return content;
    }
    return '<p>Content is currently being updated. Please check back later.</p>';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const paramsList = await params
    const data = await getBlogBySlug(paramsList.slug)
    
    if (!data) {
        return {
            title: 'Blog Not Found - International Hindu University',
            description: 'The requested blog article could not be found.'
        }
    }

    return {
        title: `${data.title} - International Hindu University`,
        description: data.description || 'Read this article on International Hindu University blog',
        keywords: [
            data.title,
            'Vedic Studies',
            'Yoga',
            'Ayurveda',
            'Hindu Philosophy',
            'Spiritual Education',
            'Blog'
        ],
        openGraph: {
            title: data.title,
            description: data.description || 'Read this article on International Hindu University blog',
            url: `https://ihu-usa.org/Blogs/${data.slug}`,
            siteName: 'International Hindu University',
            images: [getValidImageUrl(data.image)],
            type: 'article',
            authors: [data.author || 'International Hindu University'],
        },
        twitter: {
            card: 'summary_large_image',
            title: data.title,
            description: data.description || 'Read this article on International Hindu University blog',
            images: [getValidImageUrl(data.image)],
        },
        alternates: {
            canonical: `/Blogs/${data.slug}`,
        },
    }
}

const Blog = async ({ params }: Props) => {
    const paramsList = await params
    
    // Check if slug is valid
    if (!paramsList.slug || paramsList.slug.trim() === '' || paramsList.slug === 'undefined') {
        return (
            <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
                <Container className='py-20'>
                    <div className='text-center'>
                        <div className='w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg'>
                            <BookOpen className='w-12 h-12 text-orange-600' />
                        </div>
                        <H1 className='text-3xl font-bold text-gray-900 mb-4'>Invalid Blog Link</H1>
                        <p className='text-gray-600 max-w-md mx-auto mb-8'>
                            The blog link appears to be invalid or incomplete.
                        </p>
                        <Link href='/Blogs'>
                            <button className='bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center mx-auto'>
                                <ArrowLeft className='w-5 h-5 mr-2' />
                                Back to Blogs
                            </button>
                        </Link>
                    </div>
                </Container>
            </div>
        )
    }
    
    const data = await getBlogBySlug(paramsList.slug)

    if (!data) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
                <Container className='py-20'>
                    <div className='text-center'>
                        <div className='w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg'>
                            <BookOpen className='w-12 h-12 text-orange-600' />
                        </div>
                        <H1 className='text-3xl font-bold text-gray-900 mb-4'>Blog Not Found</H1>
                        <p className='text-gray-600 max-w-md mx-auto mb-8'>
                            The blog article you&apos;re looking for doesn&apos;t exist or has been moved.
                        </p>
                        <Link href='/Blogs'>
                            <button className='bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center mx-auto'>
                                <ArrowLeft className='w-5 h-5 mr-2' />
                                Back to Blogs
                            </button>
                        </Link>
                    </div>
                </Container>
            </div>
        )
    }

    // Get related blogs
    const relatedBlogs = await getAllBlogs({ searchParams: { limit: '3' } }) as { list: Blog[], count: number }

    // Get validated image URL
    const heroImageUrl = getValidImageUrl(data.image);
    const validContent = getValidContent(data.content);

    return (
        <>
            <Script
                id="blog-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": data.title,
                        "description": data.description,
                        "author": {
                            "@type": "Organization",
                            "name": data.author || "International Hindu University"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "International Hindu University",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://ihu-usa.org/Images/logo.png"
                            }
                        },
                        "datePublished": new Date().toISOString(),
                        "dateModified": new Date().toISOString(),
                        "image": getValidImageUrl(data.image),
                        "url": `https://ihu-usa.org/Blogs/${data.slug}`,
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": `https://ihu-usa.org/Blogs/${data.slug}`
                        }
                    })
                }}
            />
            <article className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
            {/* Breadcrumbs - Just below navbar */}
            <div className='bg-white pt-2 pb-4 border-b border-gray-100 shadow-sm'>
                <Container>
                    <div className='flex items-center gap-2 text-gray-600 text-sm pl-0.5'>
                        <Link href='/' className='hover:text-orange-600 transition-colors font-medium'>Home</Link>
                        <ChevronRight className='w-4 h-4' />
                        <Link href='/Blogs' className='hover:text-orange-600 transition-colors font-medium'>Blogs</Link>
                        <ChevronRight className='w-4 h-4' />
                        <span className='text-gray-900 font-medium truncate max-w-md'>{data?.title || 'Article'}</span>
                    </div>
                </Container>
            </div>

            {/* Hero Section */}
            <div className='bg-white pt-6 pb-16 shadow-sm'>
                <Container>
                    <div className='max-w-6xl mx-auto'>
                        {/* Article Header */}
                        <div className='text-center mb-12'>
                            <div className='flex items-center justify-center gap-4 mb-6'>
                                <span className='bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 text-sm font-bold rounded-full shadow-lg'>
                                    ✨ Featured Article
                                </span>
                                <span className='border-2 border-gray-300 text-gray-700 bg-gray-50 px-4 py-2 rounded-full font-semibold flex items-center'>
                                    <BookOpen className='w-4 h-4 mr-2' />
                                    Educational
                                </span>
                            </div>
                            
                            <H1 className='text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight max-w-5xl mx-auto'>
                                {data?.title || 'Blog Article'}
                            </H1>
                            
                            <p className='text-xl md:text-2xl text-gray-600 leading-relaxed mb-12 max-w-4xl mx-auto font-light'>
                                {data?.description || 'Explore this insightful article on our blog.'}
                            </p>
                        </div>

                        {/* Featured Image */}
                        <div className='mb-12'>
                            <div className='relative overflow-hidden rounded-3xl shadow-2xl bg-white p-3'>
                                <SafeImage
                                    src={heroImageUrl}
                                    alt={data?.title || 'Blog Article'}
                                    width={1200}
                                    height={600}
                                    className='w-full h-auto object-contain rounded-2xl max-h-[70vh]'
                                    priority
                                />
                            </div>
                        </div>

                        {/* Article Meta */}
                        <div className='flex flex-wrap items-center justify-center gap-4 max-w-5xl mx-auto mb-8'>
                            <div className='flex items-center gap-3 bg-white text-gray-900 rounded-full px-6 py-3 shadow-lg border border-gray-200 hover:shadow-xl transition-all'>
                                <User className='w-5 h-5 text-gray-700' />
                                <span className='font-bold text-sm'>{data?.author || 'IHU'}</span>
                            </div>
                            <div className='flex items-center gap-3 bg-white text-gray-900 rounded-full px-6 py-3 shadow-lg border border-gray-200 hover:shadow-xl transition-all'>
                                <Calendar className='w-5 h-5 text-gray-700' />
                                <span className='font-bold text-sm'>Published Recently</span>
                            </div>
                            <div className='flex items-center gap-3 bg-white text-gray-900 rounded-full px-6 py-3 shadow-lg border border-gray-200 hover:shadow-xl transition-all'>
                                <Clock className='w-5 h-5 text-gray-700' />
                                <span className='font-bold text-sm'>8 min read</span>
                            </div>
                            <div className='flex items-center gap-3 bg-white text-gray-900 rounded-full px-6 py-3 shadow-lg border border-gray-200 hover:shadow-xl transition-all'>
                                <Eye className='w-5 h-5 text-gray-700' />
                                <span className='font-bold text-sm'>2.5k views</span>
                            </div>
                        </div>

                        {/* Share Button */}
                        <div className='flex justify-center mb-8'>
                            <ShareButton 
                                url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://ihu-usa.org'}/Blogs/${paramsList.slug}`}
                                title={data?.title || 'Blog Article'}
                                description={data?.description || 'Check out this interesting article'}
                            />
                        </div>
                    </div>
                </Container>
            </div>

            {/* Article Content */}
            <Container className='py-16 relative z-10'>
                <div className='max-w-7xl mx-auto'>
                    {/* Back Button */}
                    <div className='mb-12'>
                        <Link href='/Blogs'>
                            <button className='border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-orange-400 px-8 py-4 font-bold text-base shadow-md hover:shadow-lg transition-all rounded-xl flex items-center'>
                                <ArrowLeft className='w-5 h-5 mr-3' />
                                Back to All Blogs
                            </button>
                        </Link>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-5 gap-16'>
                        {/* Main Content */}
                        <div className='lg:col-span-4'>
                            {/* Article Introduction */}
                            <div className='bg-white shadow-2xl rounded-3xl overflow-hidden mb-10 hover:shadow-3xl transition-shadow duration-300'>
                                <div className='p-10 md:p-12'>
                                    <div className='max-w-none'>
                                        <div className='flex items-center gap-3 mb-8'>
                                            <div className='w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center'>
                                                <BookOpen className='w-4 h-4 text-white' />
                                            </div>
                                            <h2 className='text-3xl font-bold text-gray-900'>
                                                Article Overview
                                            </h2>
                                        </div>
                                        <div className='prose prose-xl max-w-none'>
                                            <p className='text-xl text-gray-700 leading-relaxed mb-0 font-medium'>
                                                {data?.description || 'This article provides valuable insights and information. Continue reading to learn more.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Article Content */}
                            <div className='bg-white shadow-2xl rounded-3xl overflow-hidden hover:shadow-3xl transition-shadow duration-300'>
                                <div className='p-10 md:p-12'>
                                    <div className='max-w-none'>
                                        <div className='flex items-center gap-3 mb-10 pb-6 border-b-2 border-gray-100'>
                                            <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center'>
                                                <BookOpen className='w-4 h-4 text-white' />
                                            </div>
                                            <h2 className='text-3xl font-bold text-gray-900'>
                                                Full Article
                                            </h2>
                                        </div>
                                        
                                        {/* Content Display with Error Handling */}
                                        {data?.content && data.content.trim() !== '' ? (
                                            <div 
                                                className='prose prose-xl max-w-none relative overflow-hidden
                                                           [&_*]:!relative [&_*]:!z-auto
                                                           prose-headings:text-gray-900 prose-headings:font-bold prose-headings:leading-tight
                                                           prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-12 prose-h1:text-gray-900 prose-h1:border-b-2 prose-h1:border-gray-200 prose-h1:pb-4
                                                           prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:text-gray-800 prose-h2:border-l-4 prose-h2:border-orange-500 prose-h2:pl-6
                                                           prose-h3:text-2xl prose-h3:mb-5 prose-h3:mt-8 prose-h3:text-gray-700 prose-h3:font-bold
                                                           prose-h4:text-xl prose-h4:mb-4 prose-h4:mt-6 prose-h4:text-gray-700 prose-h4:font-bold
                                                           prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
                                                           prose-a:text-orange-600 prose-a:font-bold prose-a:underline prose-a:decoration-2 prose-a:underline-offset-4 hover:prose-a:text-orange-700
                                                           prose-strong:text-gray-900 prose-strong:font-bold
                                                           prose-em:text-gray-600 prose-em:italic
                                                           prose-ul:text-gray-700 prose-ul:mb-6 prose-ul:pl-8
                                                           prose-ol:text-gray-700 prose-ol:mb-6 prose-ol:pl-8
                                                           prose-li:text-lg prose-li:mb-3 prose-li:leading-relaxed
                                                           prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50 prose-blockquote:ml-0
                                                           prose-blockquote:text-gray-800 prose-blockquote:not-italic prose-blockquote:font-medium prose-blockquote:px-8 prose-blockquote:py-6 prose-blockquote:rounded-r-xl prose-blockquote:my-8
                                                           prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-3 prose-code:py-2 prose-code:rounded-lg prose-code:font-mono prose-code:text-base prose-code:font-bold
                                                           prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-2xl prose-pre:p-8 prose-pre:overflow-x-auto prose-pre:my-8
                                                           prose-img:rounded-2xl prose-img:shadow-xl prose-img:mb-8 prose-img:mt-8 prose-img:border-2 prose-img:border-gray-200
                                                           prose-hr:border-gray-300 prose-hr:my-10 prose-hr:border-t-2
                                                           prose-table:border-2 prose-table:border-gray-200 prose-table:rounded-xl prose-table:overflow-hidden prose-table:my-8
                                                           prose-th:bg-gray-100 prose-th:text-gray-900 prose-th:font-bold prose-th:p-5 prose-th:text-left
                                                           prose-td:p-5 prose-td:border-t prose-td:border-gray-100 prose-td:text-gray-700'
                                                style={{ contain: 'layout style paint' }}
                                                dangerouslySetInnerHTML={{ __html: validContent }} 
                                            />
                                        ) : (
                                            // Empty content fallback
                                            <div className='text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl'>
                                                <div className='w-20 h-20 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center shadow-lg'>
                                                    <AlertCircle className='w-10 h-10 text-amber-600' />
                                                </div>
                                                <h3 className='text-2xl font-bold text-gray-900 mb-4'>Content Not Available</h3>
                                                <p className='text-gray-600 mb-8 text-lg max-w-md mx-auto'>
                                                    The content for this article is currently being updated. Please check back later.
                                                </p>
                                                <Link href='/Blogs'>
                                                    <button className='bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-8 py-4 font-bold text-base shadow-lg hover:shadow-xl transition-all rounded-xl flex items-center mx-auto'>
                                                        <ArrowLeft className='w-5 h-5 mr-3' />
                                                        Browse Other Articles
                                                    </button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className='lg:col-span-1'>
                            <div className='sticky top-8'>
                                <BlogNavigation />
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Related Articles */}
            {relatedBlogs?.list && relatedBlogs.list.length > 0 && (
                <div className='bg-gradient-to-br from-white via-gray-50 to-white border-t border-gray-200'>
                    <Container className='py-20'>
                        <div className='text-center mb-20'>
                            <div className='inline-flex items-center gap-3 bg-gradient-to-r from-orange-100 to-orange-50 px-8 py-4 rounded-full text-orange-700 text-base font-bold mb-8 shadow-md'>
                                <BookOpen className='w-5 h-5' />
                                Continue Reading
                            </div>
                            <h2 className='text-5xl font-bold text-gray-900 mb-6'>
                                Related Articles
                            </h2>
                            <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
                                Explore more educational content and insights from our knowledge base
                            </p>
                        </div>
                        
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
                            {relatedBlogs.list.slice(0, 3).map((item, index) => {
                                const relatedImageUrl = getValidImageUrl(item.image);
                                
                                return (
                                    <Link key={index} href={`/Blogs/${item.slug}`}>
                                        <div className='group hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 bg-white shadow-xl overflow-hidden h-full rounded-2xl'>
                                            <div className='relative overflow-hidden'>
                                                <SafeImage
                                                    src={relatedImageUrl}
                                                    alt={item.title || 'Related Article'}
                                                    width={400}
                                                    height={250}
                                                    className='w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500'
                                                />
                                                <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                            </div>
                                            <div className='p-8 flex flex-col h-full'>
                                                <div className='flex-1'>
                                                    <H4 className='text-xl font-bold text-gray-800 mb-4 group-hover:text-gray-700 transition-colors line-clamp-2 leading-tight'>
                                                        {item.title || 'Untitled Article'}
                                                    </H4>
                                                    <p className='text-gray-600 leading-relaxed line-clamp-3 mb-6 text-base'>
                                                        {item.description || 'Read this interesting article to learn more.'}
                                                    </p>
                                                </div>
                                                
                                                <div className='flex items-center justify-between pt-6 border-t border-gray-100'>
                                                    <div className='flex items-center gap-4 text-sm text-gray-500'>
                                                        <div className='flex items-center gap-2'>
                                                            <Clock className='w-4 h-4' />
                                                            <span className='font-medium'>5 min</span>
                                                        </div>
                                                    </div>
                                                    <div className='flex items-center gap-2 text-orange-600 text-sm font-bold group-hover:gap-3 transition-all'>
                                                        <span>Read More</span>
                                                        <ChevronRight className='w-4 h-4' />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                        
                        <div className='text-center mt-20'>
                            <Link href='/Blogs'>
                                <button className='bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-16 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center mx-auto'>
                                    <BookOpen className='w-6 h-6 mr-3' />
                                    View All Articles
                                </button>
                            </Link>
                        </div>
                    </Container>
                </div>
            )}

            {/* Floating Share Button */}
            <FloatingShareButton 
                url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://ihu-usa.org'}/Blogs/${paramsList.slug}`}
                title={data?.title || 'Blog Article'}
                description={data?.description || 'Check out this interesting article'}
            />
        </article>
        </>
    )
}

export default Blog