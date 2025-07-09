/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { parseQuery } from "@/functions/serverActions";
import { db } from "@/lib/mongo"
import type { PhotoGallery } from "@/Types/Gallery"
import { InsertOneResult, ObjectId } from "mongodb";


const PhotoGallery = db.collection('PhotoGallery');

export const createPhoto = async ({ _id, ...rest }: PhotoGallery): Promise<InsertOneResult> => {
    const result = await PhotoGallery.insertOne({ ...rest })
    return JSON.parse(JSON.stringify(result))
}

export const getAllPhotos = async ({ searchParams }: {
    searchParams: { [key: string]: string | string[] | undefined }
}): Promise<{ list: PhotoGallery[]; count: number } | null> => {

    const { page = 0, pageSize = 10, ...query } = parseQuery(searchParams) as { page: string; pageSize: string;[key: string]: unknown };
    const pageNumber: number = Number(page);
    const pageSizeNumber: number = Number(pageSize);

    const list = await PhotoGallery.find({})
        .skip(pageNumber * pageSizeNumber)
        .limit(pageSizeNumber)
        .toArray()

    const count = await PhotoGallery.countDocuments(query)

    if (!list) return null

    return JSON.parse(JSON.stringify({ list, count }))
}

export const getPhotoById = async (id: string): Promise<PhotoGallery | null> => {
    const result = await PhotoGallery.findOne({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const updatePhoto = async ({ _id, ...rest }: PhotoGallery): Promise<PhotoGallery | null> => {
    const result = await PhotoGallery.findOneAndUpdate({ _id: new ObjectId(_id as string) }, { $set: { ...rest } }, { returnDocument: 'after' });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const deletePhoto = async (id: string): Promise<PhotoGallery | null> => {
    const result = await PhotoGallery.findOneAndDelete({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}