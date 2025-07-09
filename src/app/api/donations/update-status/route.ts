import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/mongo";
import { ObjectId } from "mongodb";

interface UpdateData {
    status: string;
    updatedAt: Date;
    transactionId?: string;
    orderId?: string;
}

const Donate = db.collection('Donate');

export async function POST(req: NextRequest) {
    try {
        const { donationId, status, transactionId, orderId } = await req.json();

        if (!donationId || !status) {
            return NextResponse.json(
                { error: 'Donation ID and status are required' },
                { status: 400 }
            );
        }

        const updateData: UpdateData = {
            status: status,
            updatedAt: new Date()
        };

        if (transactionId) {
            updateData.transactionId = transactionId;
        }

        if (orderId) {
            updateData.orderId = orderId;
        }

        const result = await Donate.updateOne(
            { _id: new ObjectId(donationId) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: 'Donation not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Donation status updated successfully'
        });

    } catch (error) {
        console.error('Error updating donation status:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 