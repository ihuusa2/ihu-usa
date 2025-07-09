/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'
import { parseQuery } from "@/functions/serverActions";
import { db } from "@/lib/mongo";

import type { FAQ } from "@/Types/Gallery";
import { InsertOneResult, ObjectId } from "mongodb";
const FAQ = db.collection('FAQ');

export const createFAQ = async ({ _id, ...rest }: FAQ): Promise<InsertOneResult> => {
    const result = await FAQ.insertOne({ ...rest });
    return JSON.parse(JSON.stringify(result));
}

export const getAllFAQs = async ({ searchParams }: {
    searchParams: { [key: string]: string | string[] | undefined }
}): Promise<{ list: FAQ[]; count: number } | null> => {

    const { page = 0, pageSize = 10, ...query } = parseQuery(searchParams) as { page: string; pageSize: string; [key: string]: unknown };
    const pageNumber: number = Number(page);
    const pageSizeNumber: number = Number(pageSize);

    const list = await FAQ.find(query)
        .skip(pageNumber * pageSizeNumber)
        .limit(pageSizeNumber)
        .toArray();

    const count = await FAQ.countDocuments(query);

    if (!list) return null;

    return JSON.parse(JSON.stringify({ list, count }));
}

export const getFAQById = async (id: string): Promise<FAQ | null> => {
    const result = await FAQ.findOne({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const updateFAQ = async ({ _id, ...rest }: FAQ): Promise<FAQ | null> => {
    const result = await FAQ.findOneAndUpdate({ _id: new ObjectId(_id as string) }, { $set: { ...rest } }, { returnDocument: 'after' });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const deleteFAQ = async (id: string): Promise<FAQ | null> => {
    const result = await FAQ.findOneAndDelete({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}