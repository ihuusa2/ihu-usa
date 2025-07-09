/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { parseQuery } from "@/functions/serverActions";
import { db } from "@/lib/mongo";
import type { Donation } from "@/Types/Donation";
import { InsertOneResult, ObjectId } from "mongodb";


const Donate = db.collection('Donate');

export const createDonateForm = async ({ _id, ...rest }: Donation): Promise<InsertOneResult> => {
    const donationData = {
        ...rest,
        currency: rest.currency || 'USD',
        status: 'PENDING' as const,
        createdAt: new Date(),
        updatedAt: new Date()
    }
    
    const result = await Donate.insertOne(donationData);
    return JSON.parse(JSON.stringify(result));
};

export const getAllDonateForm = async ({ searchParams }: {
    searchParams: { [key: string]: string | string[] | undefined }
}): Promise<{ list: Donation[], count: number } | null> => {
    const { page = 0, pageSize = 10, status, purpose, ...query } = parseQuery(searchParams) as { 
        page: string; 
        pageSize: string; 
        status?: string;
        purpose?: string;
        [key: string]: unknown 
    };
    const pageNumber: number = Number(page);
    const pageSizeNumber: number = Number(pageSize);

    // Build filter query
    const filterQuery: { [key: string]: string } = {};
    if (status && status !== 'all') {
        filterQuery.status = status;
    }
    if (purpose && purpose !== 'all') {
        filterQuery.purpose = purpose;
    }

    const list = await Donate.find(filterQuery)
        .sort({ createdAt: -1 }) // Sort by newest first
        .skip(pageNumber * pageSizeNumber)
        .limit(pageSizeNumber)
        .toArray();

    const count = await Donate.countDocuments(filterQuery);

    if (!list || list.length === 0) return null;

    return {
        list: JSON.parse(JSON.stringify(list)),
        count: count
    };
};

export const getDonateFormById = async (id: string): Promise<Donation | null> => {
    const result = await Donate.findOne({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
};

export const totalDonationAmount = async (): Promise<number> => {
    const count = await Donate.aggregate([
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount" }
            }
        }
    ]).toArray();

    const totalAmount = count.length > 0 ? count[0].totalAmount : 0;
    return JSON.parse(JSON.stringify(totalAmount));
}

export const deleteDonation = async (id: string): Promise<boolean> => {
    try {
        const result = await Donate.deleteOne({ _id: new ObjectId(id) })
        return result.deletedCount > 0
    } catch (error) {
        console.error('Error deleting donation:', error)
        return false
    }
}

export const updateDonationStatus = async (id: string, status: string): Promise<boolean> => {
    try {
        const result = await Donate.updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: { 
                    status: status,
                    updatedAt: new Date()
                }
            }
        )
        return result.modifiedCount > 0
    } catch (error) {
        console.error('Error updating donation status:', error)
        return false
    }
}

export const getDonationStats = async (): Promise<{
    total: number;
    totalAmount: number;
    completed: number;
    completedAmount: number;
    pending: number;
    pendingAmount: number;
    byPurpose: Array<{ _id: string; count: number; amount: number }>;
} | null> => {
    try {
        const [totalStats, statusStats, purposeStats] = await Promise.all([
            // Total donations and amount
            Donate.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        totalAmount: { $sum: "$amount" }
                    }
                }
            ]).toArray(),
            
            // Stats by status
            Donate.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 },
                        amount: { $sum: "$amount" }
                    }
                }
            ]).toArray(),
            
            // Stats by purpose
            Donate.aggregate([
                {
                    $group: {
                        _id: "$purpose",
                        count: { $sum: 1 },
                        amount: { $sum: "$amount" }
                    }
                }
            ]).toArray()
        ])

        const total = totalStats[0]?.total || 0
        const totalAmount = totalStats[0]?.totalAmount || 0
        
        const completed = statusStats.find(s => s._id === 'COMPLETED')?.count || 0
        const completedAmount = statusStats.find(s => s._id === 'COMPLETED')?.amount || 0
        const pending = statusStats.find(s => s._id === 'PENDING')?.count || 0
        const pendingAmount = statusStats.find(s => s._id === 'PENDING')?.amount || 0
        
        return {
            total,
            totalAmount,
            completed,
            completedAmount,
            pending,
            pendingAmount,
            byPurpose: JSON.parse(JSON.stringify(purposeStats))
        }
    } catch (error) {
        console.error('Error getting donation stats:', error)
        return null
    }
}