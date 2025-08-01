/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { parseQuery } from "@/functions/serverActions";
import { db } from "@/lib/mongo"
import type { Webinars } from "@/Types/Gallery"
import { InsertOneResult, ObjectId } from "mongodb";

const Webinars = db.collection('Webinars');

export const createWebinar = async ({ _id, ...rest }: Webinars): Promise<InsertOneResult> => {
    const result = await Webinars.insertOne({ ...rest })
    return JSON.parse(JSON.stringify(result))
}

export const getAllWebinars = async ({ searchParams }: {
    searchParams: { [key: string]: string | string[] | undefined }
}): Promise<{ list: Webinars[]; count: number } | null> => {

    const { page = 0, pageSize = 10, sortBy = 'date', sortOrder = 'desc', search, futureOnly, currentYearOnly, ...query } = parseQuery(searchParams) as { page: string; pageSize: string; sortBy?: string; sortOrder?: string; search?: string; futureOnly?: string; currentYearOnly?: string; [key: string]: unknown };
    const pageNumber: number = Number(page);
    const pageSizeNumber: number = Number(pageSize);
    const sortField = typeof sortBy === 'string' ? sortBy : 'date';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    let mongoQuery = { ...query };
    
    // Add date filtering for future webinars only
    if (futureOnly === 'true') {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Start of today
        mongoQuery.date = { $gte: now };
    }
    
    // Add year filtering for current year onwards only
    if (currentYearOnly === 'true') {
        const currentYear = new Date().getFullYear();
        const startOfCurrentYear = new Date(currentYear, 0, 1); // January 1st of current year
        mongoQuery.date = mongoQuery.date 
            ? { ...mongoQuery.date, $gte: startOfCurrentYear }
            : { $gte: startOfCurrentYear };
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
        mongoQuery = {
            ...mongoQuery,
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        };
    }

    const list = await Webinars.find(mongoQuery)
        .sort({ [sortField]: sortDirection })
        .skip(pageNumber * pageSizeNumber)
        .limit(pageSizeNumber)
        .toArray()

    const count = await Webinars.countDocuments(mongoQuery)

    if (!list) return null

    return JSON.parse(JSON.stringify({ list, count }))
}

export const getWebinarById = async (id: string): Promise<Webinars | null> => {
    const result = await Webinars.findOne({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const updateWebinar = async ({ _id, ...rest }: Webinars): Promise<Webinars | null> => {
    const result = await Webinars.findOneAndUpdate({ _id: new ObjectId(_id as string) }, { $set: { ...rest } }, { returnDocument: 'after' });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const deleteWebinar = async (id: string): Promise<Webinars | null> => {
    const result = await Webinars.findOneAndDelete({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}