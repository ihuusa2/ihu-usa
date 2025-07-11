import { NextResponse } from 'next/server';
import { getAllBlogs, getBlogImagesSummary } from '@/Server/Blogs';

export async function GET() {
  try {
    console.log('Testing blog data...');
    
    // Get all blogs
    const blogs = await getAllBlogs({ searchParams: {} });
    
    // Get image summary
    const imageSummary = await getBlogImagesSummary();
    
    return NextResponse.json({
      success: true,
      data: {
        totalBlogs: blogs?.count || 0,
        blogs: blogs?.list || [],
        imageSummary
      }
    });
  } catch (error) {
    console.error('Test blogs error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 