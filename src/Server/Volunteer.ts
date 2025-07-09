/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import type { Volunteer } from "@/Types/Form"
import { VolunteerStatus } from "@/Types/Form"
import { parseQuery } from "@/functions/serverActions";
import { db } from "@/lib/mongo";
import { InsertOneResult, ObjectId } from "mongodb";

const VolunteerCollection = db.collection('Volunteer');

export const createVolunteerForm = async ({ _id, ...rest }: Volunteer): Promise<InsertOneResult> => {
    const volunteerData = {
        ...rest,
        status: VolunteerStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date()
    }
    
    const result = await VolunteerCollection.insertOne(volunteerData);
    return JSON.parse(JSON.stringify(result));
};

export const getAllVolunteerForm = async ({ searchParams }: {
    searchParams: { [key: string]: string | string[] | undefined }
}): Promise<{ list: Volunteer[], count: number } | null> => {
    const { page = 0, pageSize = 10, status, area, search, ...query } = parseQuery(searchParams) as { 
        page: string; 
        pageSize: string; 
        status?: string;
        area?: string;
        search?: string;
        [key: string]: unknown 
    };
    const pageNumber: number = Number(page);
    const pageSizeNumber: number = Number(pageSize);

    // Build filter query
    const filterQuery: { [key: string]: unknown } = {};
    
    if (status && status !== 'all') {
        filterQuery.status = status;
    }
    
    if (area && area !== 'all') {
        filterQuery.areas = { $in: [area] };
    }
    
    if (search && search.trim()) {
        filterQuery.$or = [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { skills: { $elemMatch: { $regex: search, $options: 'i' } } },
            { value: { $regex: search, $options: 'i' } },
            { experiences: { $regex: search, $options: 'i' } },
            { about: { $regex: search, $options: 'i' } }
        ];
    }

    const list = await VolunteerCollection.find(filterQuery)
        .sort({ createdAt: -1 }) // Sort by newest first
        .skip(pageNumber * pageSizeNumber)
        .limit(pageSizeNumber)
        .toArray();

    const count = await VolunteerCollection.countDocuments(filterQuery);

    if (!list || list.length === 0) return null;

    return {
        list: JSON.parse(JSON.stringify(list)),
        count: count
    };
};

export const getVolunteerFormById = async (id: string): Promise<Volunteer | null> => {
    const result = await VolunteerCollection.findOne({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
};

export const updateVolunteerStatus = async (id: string, status: string, notes?: string, approvedBy?: string): Promise<boolean> => {
    try {
        const updateData: { [key: string]: unknown } = {
            status: status,
            updatedAt: new Date()
        };
        
        if (notes) {
            updateData.notes = notes;
        }
        
        if (status === VolunteerStatus.APPROVED) {
            updateData.approvedAt = new Date();
            if (approvedBy) {
                updateData.approvedBy = approvedBy;
            }
        }
        
        const result = await VolunteerCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
        
        return result.modifiedCount > 0;
    } catch (error) {
        console.error('Error updating volunteer status:', error);
        return false;
    }
};

export const deleteVolunteer = async (id: string): Promise<boolean> => {
    try {
        const result = await VolunteerCollection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    } catch (error) {
        console.error('Error deleting volunteer:', error);
        return false;
    }
};

export const getVolunteerStats = async (): Promise<{
    total: number;
    pending: number;
    approved: number;
    active: number;
    rejected: number;
    byArea: Array<{ _id: string; count: number }>;
    recentApplications: number;
} | null> => {
    try {
        const [totalStats, statusStats, areaStats] = await Promise.all([
            // Total volunteers
            VolunteerCollection.countDocuments({}),
            
            // Stats by status
            VolunteerCollection.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ]).toArray(),
            
            // Stats by area
            VolunteerCollection.aggregate([
                { $unwind: "$areas" },
                {
                    $group: {
                        _id: "$areas",
                        count: { $sum: 1 }
                    }
                }
            ]).toArray()
        ]);

        // Get recent applications (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentApplications = await VolunteerCollection.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        const pending = statusStats.find(s => s._id === VolunteerStatus.PENDING)?.count || 0;
        const approved = statusStats.find(s => s._id === VolunteerStatus.APPROVED)?.count || 0;
        const active = statusStats.find(s => s._id === VolunteerStatus.ACTIVE)?.count || 0;
        const rejected = statusStats.find(s => s._id === VolunteerStatus.REJECTED)?.count || 0;
        
        return {
            total: totalStats,
            pending,
            approved,
            active,
            rejected,
            byArea: JSON.parse(JSON.stringify(areaStats)),
            recentApplications
        };
    } catch (error) {
        console.error('Error getting volunteer stats:', error);
        return null;
    }
};

export const updateVolunteerNotes = async (id: string, notes: string): Promise<boolean> => {
    try {
        const result = await VolunteerCollection.updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: { 
                    notes: notes,
                    updatedAt: new Date()
                }
            }
        );
        return result.modifiedCount > 0;
    } catch (error) {
        console.error('Error updating volunteer notes:', error);
        return false;
    }
};