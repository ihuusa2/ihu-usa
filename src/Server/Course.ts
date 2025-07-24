/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import type { Course } from "@/Types/Courses";
import { parseQuery } from "@/functions/serverActions";
import { db } from "@/lib/mongo";
import { InsertOneResult, ObjectId } from "mongodb";
const Courses = db.collection('Courses');

export const createCourse = async ({ _id, ...rest }: Course): Promise<InsertOneResult> => {
    const result = await Courses.insertOne({ ...rest });
    return JSON.parse(JSON.stringify(result));
}

export const getAllCourses = async ({ params, searchParams }: {
    params?: { [key: string]: unknown },
    searchParams: { [key: string]: string | string[] | undefined }
}): Promise<{ list: Course[]; count: number } | null> => {

    const { page = 0, pageSize = 10, sort, ...query } = parseQuery(searchParams) as { page: string; pageSize: string; sort?: string; [key: string]: unknown };
    const pageNumber: number = Number(page);
    const pageSizeNumber: number = Number(pageSize);

    // Determine sort object for MongoDB
    let sortObj: Record<string, 1 | -1> = { createdAt: -1 }; // Default: newest first
    if (typeof sort === 'string') {
        if (sort === 'newest') sortObj = { createdAt: -1 };
        else if (sort === 'oldest') sortObj = { createdAt: 1 };
        else if (sort === 'title-asc') sortObj = { title: 1 };
        else if (sort === 'title-desc') sortObj = { title: -1 };
    }

    const list = await Courses.find({ ...params, ...query })
        .sort(sortObj)
        .skip(pageNumber * pageSizeNumber)
        .limit(pageSizeNumber)
        .toArray();

    const count = await Courses.countDocuments({ ...params, ...query });

    if (!list) return null;

    return JSON.parse(JSON.stringify({ list, count }));
}

export const getCourseById = async (id: string): Promise<Course | null> => {
    const result = await Courses.findOne({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const updateCourse = async ({ _id, ...rest }: Course): Promise<Course | null> => {
    const result = await Courses.findOneAndUpdate({ _id: new ObjectId(_id as string) }, { $set: { ...rest } }, { returnDocument: 'after' });
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
