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

    const { page = 0, pageSize = 10, ...query } = parseQuery(searchParams) as { page: string; pageSize: string;[key: string]: unknown };
    const pageNumber: number = Number(page);
    const pageSizeNumber: number = Number(pageSize);

    const list = await Webinars.find(query)
        .skip(pageNumber * pageSizeNumber)
        .limit(pageSizeNumber)
        .toArray()

    const count = await Webinars.countDocuments(query)

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