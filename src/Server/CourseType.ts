/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'
import type { CourseType } from "@/Types/Courses";
import { parseQuery } from "@/functions/serverActions";
import { db } from "@/lib/mongo";
import { InsertOneResult, ObjectId } from "mongodb";

const CourseTypes = db.collection('CourseTypes');

export const getAllCourseTypesForSelect = async (): Promise<CourseType[]> => {
    const result = await CourseTypes.find().toArray();
    return JSON.parse(JSON.stringify(result));
}

export const createCourseType = async ({ _id, ...rest }: CourseType): Promise<InsertOneResult> => {
    const result = await CourseTypes.insertOne({ ...rest });
    return JSON.parse(JSON.stringify(result));
}

export const getAllCourseTypes = async ({params, searchParams }: {
    params?: { [key: string]: unknown },
    searchParams?: { [key: string]: string | string[] | undefined }
}): Promise<{ list: CourseType[]; count: number } | null> => {

    const { page = 0, pageSize = 10, ...query } = parseQuery(searchParams || {}) as { page: string; pageSize: string; [key: string]: unknown };
    const pageNumber: number = Number(page);
    const pageSizeNumber: number = Number(pageSize);

    const list = await CourseTypes.find({ ...params, ...query })
        .skip(pageNumber * pageSizeNumber)
        .limit(pageSizeNumber)
        .toArray();

    const count = await CourseTypes.countDocuments({ ...params, ...query });

    if (!list) return null;

    return JSON.parse(JSON.stringify({ list, count }));
}

export const getCourseTypeById = async (id: string): Promise<CourseType | null> => {
    const result = await CourseTypes.findOne({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const updateCourseType = async ({ _id, ...rest }: CourseType): Promise<CourseType | null> => {
    const result = await CourseTypes.findOneAndUpdate({ _id: new ObjectId(_id as string) }, { $set: { ...rest } }, { returnDocument: 'after' });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const deleteCourseType = async (id: string): Promise<CourseType | null> => {
    const result = await CourseTypes.findOneAndDelete({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const countCourseTypes = async (): Promise<number> => {
    const count = await CourseTypes.countDocuments();
    return JSON.parse(JSON.stringify(count));
}