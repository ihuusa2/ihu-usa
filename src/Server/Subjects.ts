/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import type { SelectSubject, Subject } from "@/Types/Courses";
import { parseQuery } from "@/functions/serverActions";
import { db } from "@/lib/mongo";
import { ObjectId } from "mongodb";
const Subjects = db.collection('Subjects');
const Courses = db.collection('Courses');
import axios from "axios";

export const createSubject = async (courseSlug: string, { _id, ...rest }: Subject): Promise<Subject> => {
    const course = await Courses.findOne({ slug: courseSlug });
    if (!course) throw new Error('Course not found');

    const result = await Subjects.insertOne({ ...rest, courseId: course._id });
    const newSubject = await Subjects.findOne({ _id: result.insertedId });
    return JSON.parse(JSON.stringify(newSubject));
}

export const getAllSubjects = async ({ searchParams, courseSlug }: {
    searchParams: { [key: string]: string | string[] | undefined },
    courseSlug: string
}): Promise<{ list: Subject[]; count: number } | null> => {

    // Extract search and filter parameters before parsing
    const search = searchParams.search as string;
    const filterBy = searchParams.filterBy as string;
    
    const { page = 0, pageSize = 10, ...query } = parseQuery(searchParams) as { 
        page: string; 
        pageSize: string; 
        [key: string]: unknown 
    };
    const pageNumber: number = Number(page);
    const pageSizeNumber: number = Number(pageSize) || 10; // Ensure we have a valid page size

    const course = await Courses.findOne({ slug: courseSlug });
    console.log('Course lookup for slug:', courseSlug, 'Found:', !!course);

    if (!course) return null;
    
    // Debug: Check if Subjects collection is accessible
    const totalSubjectsInCollection = await Subjects.countDocuments({});
    console.log('Total subjects in collection:', totalSubjectsInCollection);

    // Build the query object
    let mongoQuery: Record<string, unknown> = { courseId: course._id };
    
    // Build search and filter conditions
    const searchCondition = search && search.trim() ? {
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { slug: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ]
    } : null;

    const filterCondition = filterBy && filterBy !== 'all' ? 
        (filterBy === 'free' ? {
            $or: [
                { price: { $exists: false } },
                { price: { $size: 0 } },
                { price: null }
            ]
        } : {
            price: { $exists: true, $ne: null, $not: { $size: 0 } }
        }) : null;

    // Combine conditions
    if (searchCondition && filterCondition) {
        mongoQuery = {
            ...mongoQuery,
            $and: [searchCondition, filterCondition]
        };
    } else if (searchCondition) {
        mongoQuery = {
            ...mongoQuery,
            ...searchCondition
        };
    } else if (filterCondition) {
        mongoQuery = {
            ...mongoQuery,
            ...filterCondition
        };
    }

    console.log('MongoDB Query:', JSON.stringify(mongoQuery, null, 2));
    console.log('Course ID:', course._id);
    console.log('Page:', pageNumber, 'PageSize:', pageSizeNumber);

    // Debug: Check total subjects for this course
    const totalSubjectsForCourse = await Subjects.countDocuments({ courseId: course._id });
    console.log('Total subjects for course:', totalSubjectsForCourse);
    
    // Debug: Check a few sample subjects to see their structure
    const sampleSubjects = await Subjects.find({ courseId: course._id }).limit(3).toArray();
    console.log('Sample subjects:', JSON.stringify(sampleSubjects, null, 2));

    const list = await Subjects.find(mongoQuery)
        .skip(pageNumber * pageSizeNumber)
        .limit(pageSizeNumber)
        .toArray();

    const count = await Subjects.countDocuments(mongoQuery);

    console.log('Found subjects:', list.length, 'Total count:', count);

    if (!list) return null;

    return JSON.parse(JSON.stringify({ list, count }));
}

export const getSubjectById = async (id: string): Promise<Subject | null> => {
    const result = await Subjects.findOne({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const updateSubject = async ({ _id, courseId, ...rest }: Subject): Promise<Subject | null> => {
    const result = await Subjects.findOneAndUpdate({ _id: new ObjectId(_id as string) }, { $set: { ...rest } }, { returnDocument: 'after' });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const deleteSubject = async (id: string): Promise<Subject | null> => {
    const result = await Subjects.findOneAndDelete({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const countSubjects = async (): Promise<number> => {
    const count = await Subjects.countDocuments();
    return JSON.parse(JSON.stringify(count));
}

// Debug function to get all subjects for a course without any filtering
export const getAllSubjectsDebug = async (courseSlug: string): Promise<Subject[] | null> => {
    const course = await Courses.findOne({ slug: courseSlug });
    if (!course) return null;
    
    console.log('Debug: Course found:', course._id);
    
    const subjects = await Subjects.find({ courseId: course._id }).toArray();
    console.log('Debug: Found subjects:', subjects.length);
    console.log('Debug: First subject:', subjects[0]);
    
    return JSON.parse(JSON.stringify(subjects));
}

export const getSubjectByCourseTitle = async (title: string, countryOrRegion?: string): Promise<SelectSubject[] | null> => {
    // Determine currency based on country/region
    const isIndia = countryOrRegion?.toLowerCase().includes('india') || 
                   countryOrRegion?.toLowerCase().includes('indian');
    const currency = isIndia ? 'INR' : 'USD';

    const course = await Courses.findOne({ title: title });
    const result = await Subjects.aggregate([
        { $match: { courseId: course?._id } },
        {
            $project: {
                title: 1,
                price: {
                    $arrayElemAt: [
                        {
                            $filter: {
                                input: "$price",
                                as: "p",
                                cond: { $eq: ["$$p.type", currency] }
                            }
                        },
                        0
                    ]
                }
            }
        }
    ]).toArray();
    console.log(result)
    if (!result || result.length === 0) return null;
    return JSON.parse(JSON.stringify(result));
}