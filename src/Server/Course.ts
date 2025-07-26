/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import type { Course } from "@/Types/Courses";
import { parseQuery } from "@/functions/serverActions";
import { db } from "@/lib/mongo";
import { InsertOneResult, ObjectId } from "mongodb";
const Courses = db.collection('Courses');

export const createCourse = async ({ _id, ...rest }: Course): Promise<InsertOneResult> => {
    const courseData = {
        ...rest,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    const result = await Courses.insertOne(courseData);
    return JSON.parse(JSON.stringify(result));
}

export const getAllCourses = async ({ params, searchParams }: {
    params?: { [key: string]: unknown },
    searchParams: { [key: string]: string | string[] | undefined }
}): Promise<{ list: Course[]; count: number } | null> => {

    const { page = 0, pageSize = 10, sort, search, ...query } = parseQuery(searchParams) as { page: string; pageSize: string; sort?: string; search?: string; [key: string]: unknown };
    const pageNumber: number = Number(page);
    const pageSizeNumber: number = Number(pageSize);

    // Determine sort object for MongoDB
    let sortObj: Record<string, 1 | -1> = { createdAt: -1, _id: -1 }; // Default: newest first, with _id fallback
    if (typeof sort === 'string') {
        if (sort === 'newest') sortObj = { createdAt: -1, _id: -1 };
        else if (sort === 'oldest') sortObj = { createdAt: 1, _id: 1 };
        else if (sort === 'title-asc') sortObj = { title: 1 };
        else if (sort === 'title-desc') sortObj = { title: -1 };
    }

    // Build the query object
    let mongoQuery: Record<string, unknown> = { ...params, ...query };
    
    // If search parameter exists, create a $or query to search across multiple fields
    if (search && typeof search === 'string' && search.trim()) {
        const searchRegex = new RegExp(search, 'i');
        mongoQuery = {
            ...mongoQuery,
            $or: [
                { title: searchRegex },
                { slug: searchRegex },
                { description: searchRegex },
                { type: searchRegex }
            ]
        };
    }

    const list = await Courses.find(mongoQuery)
        .sort(sortObj)
        .skip(pageNumber * pageSizeNumber)
        .limit(pageSizeNumber)
        .toArray();

    const count = await Courses.countDocuments(mongoQuery);

    if (!list) return null;

    return JSON.parse(JSON.stringify({ list, count }));
}

export const getCourseById = async (id: string): Promise<Course | null> => {
    const result = await Courses.findOne({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const updateCourse = async ({ _id, ...rest }: Course): Promise<Course | null> => {
    const updateData = {
        ...rest,
        updatedAt: new Date()
    };
    const result = await Courses.findOneAndUpdate({ _id: new ObjectId(_id as string) }, { $set: updateData }, { returnDocument: 'after' });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const deleteCourse = async (id: string): Promise<Course | null> => {
    const result = await Courses.findOneAndDelete({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const countCourses = async (): Promise<number> => {
    const count = await Courses.countDocuments();
    return JSON.parse(JSON.stringify(count));
}

export const getCourseBySlug = async (slug: string): Promise<Course | null> => {
    const result = await Courses.findOne({ slug: slug });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const searchAllCourses = async (searchTerm: string): Promise<Course[]> => {
    if (!searchTerm || searchTerm.trim() === '') {
        return [];
    }

    const searchRegex = new RegExp(searchTerm, 'i');
    
    const list = await Courses.find({
        title: searchRegex
    }).toArray();

    if (!list) return [];

    return JSON.parse(JSON.stringify(list));
}

export const getCoursesByType = async (type: string): Promise<Course[]> => {
    if (!type || type.trim() === '') {
        return [];
    }

    const list = await Courses.find({ type: type }).toArray();

    if (!list) return [];

    return JSON.parse(JSON.stringify(list));
}
