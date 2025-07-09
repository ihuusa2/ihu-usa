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

    const { page = 0, pageSize = 10, ...query } = parseQuery(searchParams) as { page: string; pageSize: string;[key: string]: unknown };
    const pageNumber: number = Number(page);
    const pageSizeNumber: number = Number(pageSize);

    const course = await Courses.findOne({ slug: courseSlug });

    if (!course) return null;

    const list = await Subjects.find({ ...query, courseId: course._id })
        .skip(pageNumber * pageSizeNumber)
        .limit(pageSizeNumber)
        .toArray();

    const count = await Subjects.countDocuments(query);

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

export const getSubjectByCourseTitle = async (title: string): Promise<SelectSubject[] | null> => {
    const response = await axios.get(`https://api.ipify.org/?format=json`);
    const userIP = response.data.ip;
    const countryResponse = await axios.get(`https://ipapi.co/${userIP}/country/`);

    const currency = 'USD'
    // countryResponse.data === 'IN' ? 'INR' : 'USD';

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