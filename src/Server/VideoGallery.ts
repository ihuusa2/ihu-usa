/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { parseQuery } from "@/functions/serverActions";
import { db } from "@/lib/mongo"
import type { VideoGallery } from "@/Types/Gallery"
import { InsertOneResult, ObjectId } from "mongodb";

const VideoGallery = db.collection('VideoGallery');

export const createVideo = async ({ _id, ...rest }: VideoGallery): Promise<InsertOneResult> => {
    const result = await VideoGallery.insertOne({ ...rest })
    return JSON.parse(JSON.stringify(result))
}

export const getAllVideos = async ({ searchParams }: {
    searchParams: { [key: string]: string | string[] | undefined }
}): Promise<{ list: VideoGallery[]; count: number } | null> => {

    const { page = 0, pageSize = 10, ...query } = parseQuery(searchParams) as { page: string; pageSize: string; [key: string]: unknown };
    const pageNumber: number = Number(page);
    const pageSizeNumber: number = Number(pageSize);

    const list = await VideoGallery.find({})
        .sort({ _id: -1 }) // Sort by latest added first
        .skip(pageNumber * pageSizeNumber)
        .limit(pageSizeNumber)
        .toArray()

    const count = await VideoGallery.countDocuments(query)

    if (!list) return null

    return JSON.parse(JSON.stringify({ list, count }))
}

export const getVideoById = async (id: string): Promise<VideoGallery | null> => {
    const result = await VideoGallery.findOne({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const updateVideo = async ({ _id, ...rest }: VideoGallery): Promise<VideoGallery | null> => {
    const result = await VideoGallery.findOneAndUpdate({ _id: new ObjectId(_id as string) }, { $set: { ...rest } }, { returnDocument: 'after' });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const deleteVideo = async (id: string): Promise<VideoGallery | null> => {
    const result = await VideoGallery.findOneAndDelete({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}