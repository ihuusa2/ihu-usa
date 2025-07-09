/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import type { TeamType } from "@/Types/User";
import { parseQuery } from "@/functions/serverActions";
import { db } from "@/lib/mongo";
import { InsertOneResult, ObjectId } from "mongodb";

const TeamTypes = db.collection('TeamTypes');

export const getAllTeamTypesForSelect = async (): Promise<TeamType[]> => {
    const result = await TeamTypes.find().toArray();
    return JSON.parse(JSON.stringify(result));
}

export const createTeamType = async ({ _id, ...rest }: TeamType): Promise<InsertOneResult> => {
    const result = await TeamTypes.insertOne({ ...rest });
    return JSON.parse(JSON.stringify(result));
}

export const getAllTeamTypes = async ({ params, searchParams }: {
    params?: { [key: string]: unknown },
    searchParams?: { [key: string]: string | string[] | undefined }
}): Promise<{ list: TeamType[]; count: number } | null> => {

    const { page = 0, pageSize = 10, ...query } = parseQuery(searchParams || {}) as { page: string; pageSize: string; [key: string]: unknown };
    const pageNumber: number = Number(page);
    const pageSizeNumber: number = Number(pageSize);

    const list = await TeamTypes.find({ ...params, ...query })
        .skip(pageNumber * pageSizeNumber)
        .limit(pageSizeNumber)
        .toArray();

    const count = await TeamTypes.countDocuments({ ...params, ...query });

    if (!list) return null;

    return JSON.parse(JSON.stringify({ list, count }));
}

export const getTeamTypeById = async (id: string): Promise<TeamType | null> => {
    const result = await TeamTypes.findOne({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const updateTeamType = async ({ _id, ...rest }: TeamType): Promise<TeamType | null> => {
    const result = await TeamTypes.findOneAndUpdate({ _id: new ObjectId(_id as string) }, { $set: { ...rest } }, { returnDocument: 'after' });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const deleteTeamType = async (id: string): Promise<TeamType | null> => {
    const result = await TeamTypes.findOneAndDelete({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const countTeamTypes = async (): Promise<number> => {
    const count = await TeamTypes.countDocuments();
    return JSON.parse(JSON.stringify(count));
}