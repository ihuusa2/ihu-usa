'use server'

/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Blog } from "@/Types/Blogs";
import { parseQuery } from "@/functions/serverActions";
import { generateSlug } from "@/functions";
import { db } from "@/lib/mongo";
import { InsertOneResult, ObjectId } from "mongodb";

const Blogs = db.collection('Blogs');

// Helper function to validate and process image
const processImageUrl = (image: File | string | undefined | null): string => {
    // If image is undefined, null, or empty string, return fallback
    if (!image || (typeof image === 'string' && image.trim() === '')) {
        // Silently use fallback without logging
        return '/Images/Programs/image1.png';
    }
    
    // Handle empty string specifically
    if (typeof image === 'string' && image === '') {
        // Silently use fallback without logging
        return '/Images/Programs/image1.png';
    }
    
    if (typeof image === 'string') {
        const trimmed = image.trim();
        
        // Only log in development mode to reduce noise
        if (process.env.NODE_ENV === 'development') {
            console.log('processImageUrl: Processing string image:', trimmed);
        }
        
        // If it's already a valid URL or relative path, return as is
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
            if (process.env.NODE_ENV === 'development') {
                console.log('processImageUrl: Valid URL/path, returning as is');
            }
            return trimmed;
        }
        
        // If it's a Cloudinary URL (common case for uploaded images)
        if (trimmed.includes('cloudinary.com')) {
            if (process.env.NODE_ENV === 'development') {
                console.log('processImageUrl: Cloudinary URL detected');
            }
            return trimmed;
        }
        
        // If it's just a filename without path, assume it's in the public folder
        if (!trimmed.includes('/') && !trimmed.includes('\\')) {
            const publicPath = `/${trimmed}`;
            if (process.env.NODE_ENV === 'development') {
                console.log('processImageUrl: Filename detected, adding public path:', publicPath);
            }
            return publicPath;
        }
        
        // If it's a relative path without leading slash, add it
        if (!trimmed.startsWith('/')) {
            const relativePath = `/${trimmed}`;
            if (process.env.NODE_ENV === 'development') {
                console.log('processImageUrl: Relative path detected, adding leading slash:', relativePath);
            }
            return relativePath;
        }
        
        // If none of the above, return fallback
        if (process.env.NODE_ENV === 'development') {
            console.log('processImageUrl: No valid format detected, using fallback');
        }
        return '/Images/Programs/image1.png';
    }
    
    // If it's a File object, this shouldn't happen at this point
    if (process.env.NODE_ENV === 'development') {
        console.log('processImageUrl: File object detected, using fallback');
    }
    return '/Images/Programs/image1.png';
};

export const createBlog = async ({ _id, ...rest }: Blog): Promise<InsertOneResult> => {
    // Auto-generate slug if not provided
    if (!rest.slug && rest.title) {
        const existingSlugs = await getAllExistingSlugs();
        const baseSlug = generateSlug(rest.title);
        rest.slug = await generateUniqueSlugFromBase(baseSlug, existingSlugs);
    }
    
    // Process image to ensure it's a valid URL
    const originalImage = rest.image;
    const processedImage = processImageUrl(rest.image);
    
    if (process.env.NODE_ENV === 'development') {
        console.log(`Creating blog "${rest.title}": image ${originalImage} -> ${processedImage}`);
    }
    
    const result = await Blogs.insertOne({ ...rest, image: processedImage });
    return JSON.parse(JSON.stringify(result));
}

export const getAllBlogs = async ({ searchParams }: {
    searchParams: { [key: string]: string | string[] | undefined }
}): Promise<{ list: Blog[]; count: number } | null> => {

    try {
        const { page = 0, pageSize = 10, ...query } = parseQuery(searchParams) as { page: string; pageSize: string;[key: string]: unknown };
        const pageNumber: number = Number(page);
        const pageSizeNumber: number = Number(pageSize);

        console.log('Attempting to fetch blogs from database...');
        
        const list = await Blogs.find(query)
            .skip(pageNumber * pageSizeNumber)
            .limit(pageSizeNumber)
            .toArray();

        console.log(`Successfully fetched ${list.length} blogs`);

        const count = await Blogs.countDocuments(query);
        console.log(`Total blog count: ${count}`);

        if (!list) return null;

    // Process images in the returned blogs to ensure they're valid URLs
    const processedList = list.map(blog => {
        const originalImage = blog.image;
        const processedImage = processImageUrl(blog.image);
        
        // Log image processing for debugging (only in development)
        if (originalImage !== processedImage && process.env.NODE_ENV === 'development') {
            console.log(`Processing blog "${blog.title}": ${originalImage} -> ${processedImage}`);
        }
        
        // Ensure we never return empty strings for images
        const finalImage = processedImage || '/Images/Programs/image1.png';
        
        return {
            ...blog,
            image: finalImage
        };
    });

        return JSON.parse(JSON.stringify({ list: processedList, count }));
    } catch (error) {
        console.error('Error fetching blogs from database:', error);
        throw error;
    }
}

export const getBlogById = async (id: string): Promise<Blog | null> => {
    const result = await Blogs.findOne({ _id: new ObjectId(id) });
    if (!result) return null;
    
    // Process image to ensure it's a valid URL
    const processedImage = processImageUrl(result.image);
    const finalImage = processedImage || '/Images/Programs/image1.png';
    
    const processedResult = {
        ...result,
        image: finalImage
    };
    
    return JSON.parse(JSON.stringify(processedResult));
}

export const getBlogBySlug = async (slug: string): Promise<Blog | null> => {
    const result = await Blogs.findOne({ slug });
    if (!result) return null;
    
    // Process image to ensure it's a valid URL
    const processedImage = processImageUrl(result.image);
    const finalImage = processedImage || '/Images/Programs/image1.png';
    
    const processedResult = {
        ...result,
        image: finalImage
    };
    
    return JSON.parse(JSON.stringify(processedResult));
}

export const updateBlog = async ({ _id, ...rest }: Blog): Promise<Blog | null> => {
    // Auto-generate slug if not provided
    if (!rest.slug && rest.title) {
        const existingSlugs = await getAllExistingSlugs();
        // Exclude the current blog's slug when generating a new one
        const currentBlog = await Blogs.findOne({ _id: new ObjectId(_id as string) }, { projection: { slug: 1 } });
        const filteredSlugs = currentBlog?.slug ? existingSlugs.filter(slug => slug !== currentBlog.slug) : existingSlugs;
        const baseSlug = generateSlug(rest.title);
        rest.slug = await generateUniqueSlugFromBase(baseSlug, filteredSlugs);
    }
    
    // Process image to ensure it's a valid URL
    const originalImage = rest.image;
    const processedImage = processImageUrl(rest.image);
    
    if (process.env.NODE_ENV === 'development') {
        console.log(`Updating blog "${rest.title}": image ${originalImage} -> ${processedImage}`);
    }
    
    const result = await Blogs.findOneAndUpdate(
        { _id: new ObjectId(_id as string) }, 
        { $set: { ...rest, image: processedImage } }, 
        { returnDocument: 'after' }
    );
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const deleteBlog = async (id: string): Promise<Blog | null> => {
    const result = await Blogs.findOneAndDelete({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

/**
 * Get all existing slugs from the database
 */
export const getAllExistingSlugs = async (): Promise<string[]> => {
    const blogs = await Blogs.find({}, { projection: { slug: 1 } }).toArray();
    return blogs.map(blog => blog.slug).filter(Boolean);
}

/**
 * Check if a slug already exists
 * @param slug - The slug to check
 * @param excludeId - Optional blog ID to exclude from the check (useful when editing)
 */
export const checkSlugExists = async (slug: string, excludeId?: string): Promise<boolean> => {
    const query: { slug: string; _id?: { $ne: ObjectId } } = { slug };
    
    // If excludeId is provided, exclude that blog from the check
    if (excludeId) {
        query._id = { $ne: new ObjectId(excludeId) };
    }
    
    const count = await Blogs.countDocuments(query);
    return count > 0;
}

/**
 * Generate unique slug from base slug
 */
export const generateUniqueSlugFromBase = async (baseSlug: string, existingSlugs?: string[]): Promise<string> => {
    const slugs = existingSlugs || await getAllExistingSlugs();
    let uniqueSlug = baseSlug;
    let counter = 1;
    
    while (slugs.includes(uniqueSlug)) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
    }
    
    return uniqueSlug;
}

/**
 * Fix blogs that don't have slugs by generating them from titles
 */
export const fixBlogsWithoutSlugs = async (): Promise<{ updated: number }> => {
    const blogsWithoutSlugs = await Blogs.find({ 
        $or: [
            { slug: { $exists: false } }, 
            { slug: null }, 
            { slug: "" }
        ] 
    }).toArray();
    
    if (blogsWithoutSlugs.length === 0) {
        return { updated: 0 };
    }
    
    const existingSlugs = await getAllExistingSlugs();
    let updatedCount = 0;
    
    for (const blog of blogsWithoutSlugs) {
        if (blog.title) {
            const baseSlug = generateSlug(blog.title);
            const uniqueSlug = await generateUniqueSlugFromBase(baseSlug, existingSlugs);
            
            await Blogs.updateOne(
                { _id: blog._id },
                { $set: { slug: uniqueSlug } }
            );
            
            existingSlugs.push(uniqueSlug);
            updatedCount++;
        }
    }
    
    return { updated: updatedCount };
}

/**
 * Fix blogs with invalid images by ensuring they have valid image URLs
 */
export const fixBlogsWithInvalidImages = async (): Promise<{ updated: number }> => {
    const allBlogs = await Blogs.find({}).toArray();
    let updatedCount = 0;
    
    if (process.env.NODE_ENV === 'development') {
        console.log(`Checking ${allBlogs.length} blogs for invalid images...`);
    }
    
    for (const blog of allBlogs) {
        const originalImage = blog.image;
        const processedImage = processImageUrl(blog.image);
        
        // If the processed image is different from the original, update it
        if (originalImage !== processedImage) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`Fixing blog "${blog.title}": ${originalImage} -> ${processedImage}`);
            }
            await Blogs.updateOne(
                { _id: blog._id },
                { $set: { image: processedImage } }
            );
            updatedCount++;
        } else if (process.env.NODE_ENV === 'development') {
            console.log(`Blog "${blog.title}" has valid image: ${originalImage}`);
        }
    }
    
    if (process.env.NODE_ENV === 'development') {
        console.log(`Fixed ${updatedCount} blogs with invalid images`);
    }
    return { updated: updatedCount };
}

/**
 * Get a summary of all blog images for debugging
 */
export const getBlogImagesSummary = async (): Promise<{ title: string; image: string; isValid: boolean }[]> => {
    const allBlogs = await Blogs.find({}).toArray();
    
    return allBlogs.map(blog => {
        const originalImage = blog.image;
        const processedImage = processImageUrl(blog.image);
        const finalImage = processedImage || '/Images/Programs/image1.png';
        
        // An image is valid if it's not empty and not the fallback image
        const isValid = originalImage && 
                       originalImage.trim() !== '' && 
                       originalImage !== '/Images/Programs/image1.png';
        
        return {
            title: blog.title,
            image: finalImage, // Return the processed image
            isValid
        };
    });
}