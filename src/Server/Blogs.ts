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
        return '/Images/Programs/image1.png';
    }
    
    if (typeof image === 'string') {
        const trimmed = image.trim();
        
        // If it's already a valid URL or relative path, return as is
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
            return trimmed;
        }
        
        // If it's a Cloudinary URL (common case for uploaded images)
        if (trimmed.includes('cloudinary.com')) {
            return trimmed;
        }
        
        // If it's just a filename without path, assume it's in the public folder
        if (!trimmed.includes('/') && !trimmed.includes('\\')) {
            return `/${trimmed}`;
        }
        
        // If it's a relative path without leading slash, add it
        if (!trimmed.startsWith('/')) {
            return `/${trimmed}`;
        }
        
        // If none of the above, return fallback
        return '/Images/Programs/image1.png';
    }
    
    // If it's a File object, this shouldn't happen at this point
    // Return fallback image
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
    
    console.log(`Creating blog "${rest.title}": image ${originalImage} -> ${processedImage}`);
    
    const result = await Blogs.insertOne({ ...rest, image: processedImage });
    return JSON.parse(JSON.stringify(result));
}

export const getAllBlogs = async ({ searchParams }: {
    searchParams: { [key: string]: string | string[] | undefined }
}): Promise<{ list: Blog[]; count: number } | null> => {

    const { page = 0, pageSize = 10, ...query } = parseQuery(searchParams) as { page: string; pageSize: string;[key: string]: unknown };
    const pageNumber: number = Number(page);
    const pageSizeNumber: number = Number(pageSize);

    const list = await Blogs.find(query)
        .skip(pageNumber * pageSizeNumber)
        .limit(pageSizeNumber)
        .toArray();

    const count = await Blogs.countDocuments(query);

    if (!list) return null;

    // Process images in the returned blogs to ensure they're valid URLs
    const processedList = list.map(blog => {
        const originalImage = blog.image;
        const processedImage = processImageUrl(blog.image);
        
        // Log image processing for debugging
        if (originalImage !== processedImage) {
            console.log(`Processing blog "${blog.title}": ${originalImage} -> ${processedImage}`);
        }
        
        return {
            ...blog,
            image: processedImage
        };
    });

    return JSON.parse(JSON.stringify({ list: processedList, count }));
}

export const getBlogById = async (id: string): Promise<Blog | null> => {
    const result = await Blogs.findOne({ _id: new ObjectId(id) });
    if (!result) return null;
    
    // Process image to ensure it's a valid URL
    const processedResult = {
        ...result,
        image: processImageUrl(result.image)
    };
    
    return JSON.parse(JSON.stringify(processedResult));
}

export const getBlogBySlug = async (slug: string): Promise<Blog | null> => {
    const result = await Blogs.findOne({ slug });
    if (!result) return null;
    
    // Process image to ensure it's a valid URL
    const processedResult = {
        ...result,
        image: processImageUrl(result.image)
    };
    
    return JSON.parse(JSON.stringify(processedResult));
}

export const updateBlog = async ({ _id, ...rest }: Blog): Promise<Blog | null> => {
    // Auto-generate slug if not provided
    if (!rest.slug && rest.title) {
        const existingSlugs = await getAllExistingSlugs();
        const baseSlug = generateSlug(rest.title);
        rest.slug = await generateUniqueSlugFromBase(baseSlug, existingSlugs);
    }
    
    // Process image to ensure it's a valid URL
    const originalImage = rest.image;
    const processedImage = processImageUrl(rest.image);
    
    console.log(`Updating blog "${rest.title}": image ${originalImage} -> ${processedImage}`);
    
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
 */
export const checkSlugExists = async (slug: string): Promise<boolean> => {
    const count = await Blogs.countDocuments({ slug });
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
    
    console.log(`Checking ${allBlogs.length} blogs for invalid images...`);
    
    for (const blog of allBlogs) {
        const originalImage = blog.image;
        const processedImage = processImageUrl(blog.image);
        
        // If the processed image is different from the original, update it
        if (originalImage !== processedImage) {
            console.log(`Fixing blog "${blog.title}": ${originalImage} -> ${processedImage}`);
            await Blogs.updateOne(
                { _id: blog._id },
                { $set: { image: processedImage } }
            );
            updatedCount++;
        } else {
            console.log(`Blog "${blog.title}" has valid image: ${originalImage}`);
        }
    }
    
    console.log(`Fixed ${updatedCount} blogs with invalid images`);
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
        const isValid = originalImage === processedImage;
        
        return {
            title: blog.title,
            image: originalImage,
            isValid
        };
    });
}