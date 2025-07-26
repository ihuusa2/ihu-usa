'use server'

import { parseQuery } from "@/functions/serverActions";
import { db } from "@/lib/mongo"
import type { Flyers } from "@/Types/Gallery"
import { InsertOneResult, ObjectId } from "mongodb";

const FlyersCollection = db.collection('Flyers');

export const createFlyer = async ({ ...rest }: Omit<Flyers, '_id'>): Promise<InsertOneResult> => {
    const result = await FlyersCollection.insertOne({ ...rest })
    return JSON.parse(JSON.stringify(result))
}

export const getAllFlyers = async ({ searchParams }: {
    searchParams: { [key: string]: string | string[] | undefined }
}): Promise<{ list: Flyers[]; count: number } | null> => {

    const { page = 0, pageSize = 10, ...query } = parseQuery(searchParams) as { page: string; pageSize: string;[key: string]: unknown };
    const pageNumber: number = Number(page);
    const pageSizeNumber: number = Number(pageSize);

    const list = await FlyersCollection.find({})
        .sort({ displayOrder: 1, createdAt: -1 })
        .skip(pageNumber * pageSizeNumber)
        .limit(pageSizeNumber)
        .toArray()

    const count = await FlyersCollection.countDocuments(query)

    if (!list) return null

    return JSON.parse(JSON.stringify({ list, count }))
}

export const getActiveFlyers = async (): Promise<Flyers[]> => {
    const currentDate = new Date();
    const list = await FlyersCollection.find({
        isActive: true,
        $and: [
            {
                $or: [
                    { startDate: { $lte: currentDate } },
                    { startDate: { $exists: false } }
                ]
            },
            {
                $or: [
                    { endDate: { $gte: currentDate } },
                    { endDate: { $exists: false } }
                ]
            }
        ]
    })
    .sort({ displayOrder: 1, createdAt: -1 })
    .toArray()

    return JSON.parse(JSON.stringify(list))
}

export const getFlyerById = async (id: string): Promise<Flyers | null> => {
    const result = await FlyersCollection.findOne({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const updateFlyer = async ({ _id, ...rest }: Flyers): Promise<Flyers | null> => {
    const result = await FlyersCollection.findOneAndUpdate(
        { _id: new ObjectId(_id as string) }, 
        { $set: { ...rest } }, 
        { returnDocument: 'after' }
    );
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const deleteFlyer = async (id: string): Promise<Flyers | null> => {
    const result = await FlyersCollection.findOneAndDelete({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const updateFlyerOrder = async (flyerId: string, newOrder: number): Promise<Flyers | null> => {
    const result = await FlyersCollection.findOneAndUpdate(
        { _id: new ObjectId(flyerId) },
        { $set: { displayOrder: newOrder } },
        { returnDocument: 'after' }
    );
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
} 