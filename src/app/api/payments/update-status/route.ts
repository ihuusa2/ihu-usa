import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mongo";

import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
    try {
        const { registrationId, email, registrationNumber, orderId, status } = await req.json();

        const validStatuses = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'];
        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json(
                { error: 'Valid status is required (PENDING, COMPLETED, FAILED, REFUNDED)' },
                { status: 400 }
            );
        }

        // Build query based on provided parameters
        const query: Record<string, unknown> = {};
        
        if (registrationId) {
            query._id = new ObjectId(registrationId);
        } else if (email) {
            query.emailAddress = email;
        } else if (registrationNumber) {
            query.registrationNumber = registrationNumber;
        } else if (orderId) {
            query.orderId = orderId;
        } else {
            return NextResponse.json(
                { error: 'Either registrationId, email, registrationNumber, or orderId is required' },
                { status: 400 }
            );
        }

        console.log('🔍 Searching for registration with query:', query);

        // Update Registration collection
        const registrationResult = await db.collection('Registration').updateMany(
            query,
            { 
                $set: { 
                    paymentStatus: status,
                    updatedAt: new Date()
                } 
            }
        );

        console.log('📝 Registration update result:', registrationResult);

        // If we have registration numbers, also update CourseRegForm
        let courseRegFormResult = null;
        if (registrationResult.matchedCount > 0) {
            // Get the updated registrations to find their registration numbers
            const updatedRegistrations = await db.collection('Registration').find(query).toArray();
            
            if (updatedRegistrations.length > 0) {
                const registrationNumbers = updatedRegistrations.map(reg => reg.registrationNumber).filter(Boolean);
                
                if (registrationNumbers.length > 0) {
                    courseRegFormResult = await db.collection('CourseRegForm').updateMany(
                        { registrationNumber: { $in: registrationNumbers } },
                        { 
                            $set: { 
                                status: status,
                                updatedAt: new Date()
                            } 
                        }
                    );
                    console.log('📚 CourseRegForm update result:', courseRegFormResult);
                }
            }
        }

        if (registrationResult.matchedCount === 0) {
            return NextResponse.json(
                { error: 'No registration found with the provided criteria' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Payment status updated to ${status} successfully`,
            details: {
                registrationsUpdated: registrationResult.modifiedCount,
                courseRegFormsUpdated: courseRegFormResult?.modifiedCount || 0
            }
        });

    } catch (error) {
        console.error('❌ Error updating payment status:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 