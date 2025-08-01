/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { parseQuery } from "@/functions/serverActions";
import { db } from "@/lib/mongo"
import type { Events } from "@/Types/Gallery"
import { InsertOneResult, ObjectId } from "mongodb";

const Events = db.collection('Events');

export const createEvent = async ({ _id, ...rest }: Events): Promise<InsertOneResult> => {
    const result = await Events.insertOne({ ...rest })
    return JSON.parse(JSON.stringify(result))
}

export const getAllEvents = async ({ searchParams }: {
    searchParams: { [key: string]: string | string[] | undefined }
}): Promise<{ list: Events[]; count: number } | null> => {

    const { page = 0, pageSize = 10, sortBy = 'date', sortOrder = 'desc', search, futureOnly, currentYearOnly, ...query } = parseQuery(searchParams) as { page: string; pageSize: string; sortBy?: string; sortOrder?: string; search?: string; futureOnly?: string; currentYearOnly?: string; [key: string]: unknown };
    const pageNumber: number = Number(page);
    const pageSizeNumber: number = Number(pageSize);
    const sortField = typeof sortBy === 'string' ? sortBy : 'date';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    let mongoQuery = { ...query };
    
    // Add date filtering for future events only
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

    const list = await Events.find(mongoQuery)
        .sort({ [sortField]: sortDirection })
        .skip(pageNumber * pageSizeNumber)
        .limit(pageSizeNumber)
        .toArray()

    const count = await Events.countDocuments(mongoQuery)

    if (!list) return null

    return JSON.parse(JSON.stringify({ list, count }))
}

export const getEventById = async (id: string): Promise<Events | null> => {
    const result = await Events.findOne({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const updateEvent = async ({ _id, ...rest }: Events): Promise<Events | null> => {
    const result = await Events.findOneAndUpdate({ _id: new ObjectId(_id as string) }, { $set: { ...rest } }, { returnDocument: 'after' });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const deleteEvent = async (id: string): Promise<Events | null> => {
    const result = await Events.findOneAndDelete({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const countEvents = async (): Promise<number> => {
    const count = await Events.countDocuments();
    return JSON.parse(JSON.stringify(count));
}