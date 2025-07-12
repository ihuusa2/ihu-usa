/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { parseQuery } from "@/functions/serverActions";
import { db } from "@/lib/mongo";
import type { Team } from "@/Types/User"; // Assuming Team type is defined in the same file
import { InsertOneResult, ObjectId } from "mongodb";

const Teams = db.collection('Teams');

export const createTeam = async ({ _id, ...rest }: Team): Promise<InsertOneResult> => {
    const result = await Teams.insertOne({ ...rest });
    return JSON.parse(JSON.stringify(result));
}

export const getAllTeams = async ({ params, searchParams }: {
    params?: { [key: string]: unknown },
    searchParams?: { [key: string]: string | string[] | undefined }
}): Promise<{ list: Team[]; count: number } | null> => {

    const { page = 0, pageSize = 10, ...query } = parseQuery(searchParams || {}) as { page: string; pageSize: string;[key: string]: unknown };
    const pageNumber: number = Number(page);
    const pageSizeNumber: number = Number(pageSize);

    const list = await Teams.find({ ...params, ...query })
        .skip(pageNumber * pageSizeNumber)
        .limit(pageSizeNumber)
        .toArray();

    const count = await Teams.countDocuments({ ...params, ...query });

    if (!list) return null;

    return JSON.parse(JSON.stringify({ list, count }));
}

export const getTeamById = async (id: string): Promise<Team | null> => {
    const result = await Teams.findOne({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const updateTeam = async ({ _id, ...rest }: Team): Promise<Team | null> => {
    const result = await Teams.findOneAndUpdate({ _id: new ObjectId(_id as string) }, { $set: { ...rest } }, { returnDocument: 'after' });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const deleteTeam = async (id: string): Promise<Team | null> => {
    const result = await Teams.findOneAndDelete({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const getTeamCategory = async (): Promise<{ _id: string; name: string }[] | null> => {
    const categories = await Teams.aggregate([
        { $group: { _id: "$category" } }
    ]).toArray();

    const result = categories.map(category => category._id);
    if (!result) return null;
    return JSON.parse(JSON.stringify(result.map((item) => ({ _id: item, name: item }))));
}

export const countTeams = async (): Promise<number> => {
    const count = await Teams.countDocuments();
    return JSON.parse(JSON.stringify(count));
}