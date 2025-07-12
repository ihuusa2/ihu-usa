import Container from '@/components/Container'
import { H1, H4 } from '@/components/Headings'
import { getAllBlogs } from '@/Server/Blogs'
import type { Blog } from '@/Types/Blogs'
import SafeImage from '@/components/SafeImage'
import { getValidImageUrl } from '@/utils/imageUtils'
import Link from 'next/link'
import React from 'react'

import { Metadata } from 'next'
import Pagination from '@/components/Pagination'
import SearchInput from '@/components/SearchInput'
import { Calendar, Clock, ArrowRight, BookOpen, Search, X } from 'lucide-react'



export const metadata: Metadata = {
  title: 'Educational Blogs - International Hindu University',
  description: 'Explore a range of educational blogs from International Hindu University. Dive into topics on Hindu studies, Yoga, Ayurveda, and more.'
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const Blogs = async ({ searchParams }: Props) => {
  const searchParamsList = await searchParams
  
  // Test database connection
  let blogs: { list: Blog[], count: number } | null = null;
  try {
    blogs = await getAllBlogs({ searchParams: searchParamsList }) as { list: Blog[], count: number };
  } catch (error) {
    console.error('Database connection failed:', error);
    blogs = { list: [], count: 0 };
  }

  if (!blogs || blogs.count === 0) {
    return (
      <Container className='my-20'>
        <div className='text-center py-16'>
          <div className='w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center'>
            <BookOpen className='w-12 h-12 text-gray-600' />
          </div>
          <H1 className='text-3xl font-bold text-gray-900 mb-4'>No Blogs Found</H1>
          <p className='text-gray-600 max-w-md mx-auto'>
            {!blogs ? 
              'Unable to load blogs at the moment. Please try again later.' :
              'We couldn&apos;t find any blogs matching your search. Try adjusting your search terms or explore our latest content.'
            }
          </p>
          {!blogs && (
            <div className='mt-6'>
              <button 
                onClick={() => window.location.reload()} 
                className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </Container>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
      <Container className='py-16'>
        {/* Hero Section */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full text-blue-700 text-sm font-medium mb-6'>
            <BookOpen className='w-4 h-4' />
            Educational Resources
          </div>
          
          <H1 className='text-5xl font-bold text-gray-900 mb-6'>
            Discover Knowledge
          </H1>
          
          <p className='text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8'>
            Explore the latest research, events, and academic insights from our university community. 
            Our blog showcases articles from faculty, students, and alumni, offering you a glimpse 
            into the vibrant intellectual life on campus and beyond.
          </p>

          <div className='flex items-center justify-center gap-4 text-sm text-gray-500 mb-12'>
            <div className='flex items-center gap-2'>
              <BookOpen className='w-4 h-4' />
              <span>{blogs.count} Articles</span>
            </div>
            <div className='w-1 h-1 bg-gray-400 rounded-full'></div>
            <div className='flex items-center gap-2'>
              <Calendar className='w-4 h-4' />
              <span>Weekly Updates</span>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className='max-w-3xl mx-auto mb-16'>
          <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-2'>
            <SearchInput>
              <div className='relative flex items-center'>
                <div className='absolute left-4 flex items-center pointer-events-none'>
                  <Search className='h-5 w-5 text-gray-400' />
                </div>
                <input 
                  type='search'
                  defaultValue={searchParamsList?.title as string || ''}
                  name='title' 
                  placeholder='Search articles by title, description, or author...' 
                  className='w-full pl-12 pr-28 py-4 text-lg border-0 bg-transparent focus:ring-0 focus:outline-none focus:border-transparent focus:shadow-none placeholder:text-gray-400' 
                  style={{ outline: 'none', boxShadow: 'none' }}
                />
                <div className='absolute right-2 flex items-center'>
                  <button 
                    type='submit'
                    className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2'
                  >
                    <Search className='h-4 w-4' />
                    Search
                  </button>
                </div>
              </div>
            </SearchInput>
          </div>
          
          {/* Search Results Info */}
          {searchParamsList?.title && (
            <div className='mt-4 text-center'>
              <div className='inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full text-sm text-blue-700'>
                <Search className='w-4 h-4' />
                <span>
                  Searching for: <span className='font-semibold text-blue-900'>&ldquo;{searchParamsList.title}&rdquo;</span>
                </span>
                <Link 
                  href='/Blogs'
                  className='ml-2 text-blue-400 hover:text-blue-600 transition-colors'
                  title='Clear search'
                >
                  <X className='w-4 h-4' />
                </Link>
              </div>
            </div>
          )}
        </div>





        {/* Featured Blog (if exists) */}
        {blogs?.list && blogs.list.length > 0 && blogs.list[0].slug && !searchParamsList?.title && (
          <div className='mb-16'>
            <h2 className='text-2xl font-bold text-gray-900 mb-8 text-center'>Featured Article</h2>
            <Link href={`/Blogs/${blogs.list[0].slug}`}>
              <div className='group hover:shadow-2xl transition-all duration-300 border border-gray-200 bg-white rounded-2xl overflow-hidden'>
                <div className='md:flex'>
                  <div className='md:w-1/2 bg-gray-100 relative overflow-hidden'>
                    <SafeImage
                      src={getValidImageUrl(blogs.list[0].image) || '/Images/Programs/image1.png'}
                      alt={blogs.list[0].title || 'Featured Article'}
                      width={600}
                      height={400}
                      className='w-full h-64 md:h-full object-cover bg-white group-hover:scale-105 transition-transform duration-300'
                    />
                  </div>
                  <div className='md:w-1/2 p-8 flex flex-col justify-center'>
                    <span className='self-start mb-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold'>
                      Featured
                    </span>
                    <H4 className='text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors'>
                      {blogs.list[0].title || 'Featured Article'}
                    </H4>
                    <p className='text-gray-600 leading-relaxed mb-6 line-clamp-3'>
                      {blogs.list[0].description || 'Discover this featured article with valuable insights and information.'}
                    </p>
                    <div className='flex items-center gap-4 text-sm text-gray-500 mb-6'>
                      <div className='flex items-center gap-1'>
                        <Calendar className='w-4 h-4' />
                        <span>Recent</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Clock className='w-4 h-4' />
                        <span>5 min read</span>
                      </div>
                    </div>
                    <div className='flex items-center gap-2 text-blue-600 font-medium group-hover:gap-4 transition-all'>
                      <span>Read Full Article</span>
                      <ArrowRight className='w-4 h-4' />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Blog Grid */}
        <div>
          <div className='flex items-center justify-between mb-8'>
            <h2 className='text-2xl font-bold text-gray-900'>
              {searchParamsList?.title ? 'Search Results' : 'Latest Articles'}
            </h2>
            {searchParamsList?.title && (
              <div className='text-sm text-gray-600'>
                {blogs?.list?.filter(item => item.slug).length || 0} articles found
              </div>
            )}
          </div>
          
          {(searchParamsList?.title ? blogs?.list?.filter(item => item.slug) : blogs?.list?.slice(1).filter(item => item.slug))?.length === 0 ? (
            <div className='text-center py-16'>
              <div className='w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center'>
                <Search className='w-10 h-10 text-gray-400' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                {searchParamsList?.title ? 'No articles found' : 'No articles available'}
              </h3>
              <p className='text-gray-600 max-w-md mx-auto mb-6'>
                {searchParamsList?.title ? (
                  <>We couldn&apos;t find any articles matching your search for &ldquo;{searchParamsList.title}&rdquo;. 
                  Try different keywords or browse our latest articles.</>
                ) : (
                  'There are no articles available at the moment. Please check back later.'
                )}
              </p>
              {searchParamsList?.title && (
                <Link href='/Blogs'>
                  <button className='border border-gray-200 text-gray-600 hover:bg-gray-50 px-6 py-2 rounded-lg transition-colors'>
                    Clear Search
                  </button>
                </Link>
              )}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {(searchParamsList?.title ? blogs?.list?.filter(item => item.slug) : blogs?.list?.slice(1).filter(item => item.slug))?.map((item, index) => {
                const cardImageUrl = getValidImageUrl(item.image) || '/Images/Programs/image1.png';
                
                return (
                  <Link key={index} href={`/Blogs/${item.slug}`}>
                    <div className='group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-200 bg-white rounded-2xl overflow-hidden h-full'>
                      <div className='relative overflow-hidden'>
                        <div className='relative bg-gray-100'>
                          <SafeImage
                            src={cardImageUrl}
                            alt={item.title || 'Blog Article'}
                            width={400}
                            height={250}
                            className='w-full h-auto min-h-[200px] max-h-[280px] object-contain bg-white group-hover:scale-105 transition-transform duration-500'
                          />
                          <div className='absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                        </div>
                      </div>
                      <div className='p-6 flex flex-col h-full'>
                        <div className='flex-1'>
                          <H4 className='font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2'>
                            {item.title || 'Untitled Article'}
                          </H4>
                          <p className='text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4'>
                            {item.description || 'Read this interesting article to learn more.'}
                          </p>
                        </div>
                        
                        <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
                          <div className='flex items-center gap-4 text-xs text-gray-500'>
                            <div className='flex items-center gap-1'>
                              <Clock className='w-3 h-3' />
                              <span>5 min read</span>
                            </div>
                          </div>
                          <div className='flex items-center gap-1 text-blue-600 text-sm font-medium group-hover:gap-2 transition-all'>
                            <span>Read More</span>
                            <ArrowRight className='w-3 h-3' />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className='mt-16'>
          <Pagination count={blogs.count} />
        </div>
      </Container>
    </div>
  )
}

export default Blogs