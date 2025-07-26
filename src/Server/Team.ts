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
}): Promise<{ list: Team[]; count: number; withDescriptionsCount: number; withImagesCount: number } | null> => {

    console.log('Raw searchParams:', searchParams);
    
    // Extract search parameter before parsing other parameters
    const searchTerm = searchParams?.search as string;
    console.log('Extracted searchTerm:', searchTerm);
    
    // Remove search from searchParams before parsing
    const { search, ...otherParams } = searchParams || {};
    
    const { page = 0, pageSize = 10, ...query } = parseQuery(otherParams) as { 
        page: string; 
        pageSize: string; 
        [key: string]: unknown 
    };
    const pageNumber: number = Number(page);
    const pageSizeNumber: number = Number(pageSize);

    // Build the query object
    let mongoQuery: Record<string, unknown> = { ...params, ...query };
    
    // If search parameter exists, create a $or query to search across multiple fields
    if (searchTerm && searchTerm.trim()) {
        mongoQuery = {
            ...mongoQuery,
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { role: { $regex: searchTerm, $options: 'i' } },
                { category: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ]
        };
        console.log('Search query created:', JSON.stringify(mongoQuery, null, 2));
    }

    const list = await Teams.find(mongoQuery)
        .skip(pageNumber * pageSizeNumber)
        .limit(pageSizeNumber)
        .toArray();

    const count = await Teams.countDocuments(mongoQuery);

    // Count all team members with a non-empty description (not paginated, not filtered by search)
    const withDescriptionsCount = await Teams.countDocuments({ description: { $exists: true, $ne: "" } });

    // Count all team members with an image (not paginated, not filtered by search)
    const withImagesCount = await Teams.countDocuments({ image: { $exists: true, $ne: "" } });

    console.log('Found', list.length, 'results out of', count, 'total');

    if (!list) return null;

    return JSON.parse(JSON.stringify({ list, count, withDescriptionsCount, withImagesCount }));
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