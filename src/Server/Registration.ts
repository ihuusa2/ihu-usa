'use server'

import handleMail from "@/app/api/mail"
import { parseQuery } from "@/functions/serverActions"
import { db } from "@/lib/mongo"
import { RegistrationMailTemplate, RegistrationMailTemplateForStudent } from "@/Template"
import { PaymentStatus, RegisterForm, Status } from "@/Types/Form"
import { Collection, InsertOneResult, ObjectId } from "mongodb"
import { getNextRegistrationNumber } from "@/functions"
const Registration: Collection<RegisterForm> = db.collection("Registration")

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createRegisterForm = async ({ _id: _, ...rest }: RegisterForm): Promise<InsertOneResult> => {

    const isEmailExist = await Registration.findOne({ emailAddress: rest.emailAddress })

    if (isEmailExist) {
        return null as unknown as InsertOneResult
    }

    const isMobileExist = await Registration.findOne({ 
        countryCode: rest.countryCode,
        phone: rest.phone 
    })

    if (isMobileExist) {
        return null as unknown as InsertOneResult
    }

    // Generate registration number
    const today = new Date()
    const existingRegistrations = await Registration.find({ 
        createdAt: { 
            $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
        } 
    }).toArray()
    
    const existingNumbers = existingRegistrations
        .map(reg => reg.registrationNumber)
        .filter((num): num is string => num !== undefined && num.startsWith('IHU'))
    
    const registrationNumber = getNextRegistrationNumber(today, existingNumbers)

    const result = await Registration.insertOne({ 
        ...rest, 
        registrationNumber,
        paymentStatus: PaymentStatus.PENDING, 
        status: Status.PENDING, 
        createdAt: new Date() 
    })

    // Send confirmation email to the user with BCC to admin for sent box copy
    try {
        await handleMail({
            email: `${rest.emailAddress}, ${process.env.CONTACT_FORM_EMAIL}`,
            html: RegistrationMailTemplateForStudent({ data: { ...rest, registrationNumber } }),
            sub: "Application Received - IHU",
        })
        console.log('Confirmation email sent to:', rest.emailAddress)
    } catch (error) {
        console.error('Failed to send confirmation email:', error)
        // Don't fail the registration if email fails
    }

    // Send notification email to admin
    try {
        await handleMail({
            email: process.env.REGISTRATION_FORM_EMAIL as string,
            html: RegistrationMailTemplate({ data: { ...rest, registrationNumber } }),
            sub: "New Registration - IHU"
        })
        console.log('Admin notification email sent to:', process.env.REGISTRATION_FORM_EMAIL)
    } catch (error) {
        console.error('Failed to send admin notification email:', error)
        // Don't fail the registration if email fails
    }

    return JSON.parse(JSON.stringify(result))
}

export const checkEmailAlreadyExists = async (email: string): Promise<boolean> => {
    const result = await Registration.findOne({ emailAddress: email })
    if (!result) return false
    return true
}

export const checkMobileAlreadyExists = async (countryCode: string, phone: string): Promise<boolean> => {
    const result = await Registration.findOne({ 
        countryCode: countryCode,
        phone: phone 
    })
    if (!result) return false
    return true
}

export const getAllRegistration = async ({ searchParams }: {
    searchParams: { [key: string]: string | string[] | undefined }
}): Promise<{ list: RegisterForm[]; count: number } | null> => {

    const { page = 0, pageSize = 10, ...query } = parseQuery(searchParams) as { page: string; pageSize: string;[key: string]: unknown };
    const pageNumber: number = Number(page);
    const pageSizeNumber: number = Number(pageSize);

    const result = await Registration.find(query)
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order (newest first)
        .skip(pageNumber * pageSizeNumber)
        .limit(pageSizeNumber)
        .toArray()
    const count = await Registration.countDocuments(query)

    return {
        list: JSON.parse(JSON.stringify(result)),
        count
    };
}

export const getRegistrationByEmail = async (email: string): Promise<RegisterForm[] | null> => {
    const result = await Registration.find({ email }).toArray()
    if (!result) return null

    return JSON.parse(JSON.stringify(result))
}

export const getRegistrationById = async (id: string): Promise<RegisterForm | null> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await Registration.findOne({ _id: new ObjectId(id) } as any)

    if (!result) return null

    return JSON.parse(JSON.stringify(result))
}

export const getRegistrationByRegNum = async (registrationNumber: string): Promise<RegisterForm | null> => {
    const result = await Registration.findOne({ registrationNumber })

    if (!result) return null

    return JSON.parse(JSON.stringify(result))
}

export const updateRegistrationById = async (id: string, data: Partial<RegisterForm>): Promise<RegisterForm | null> => {
    console.log('=== updateRegistrationById START ===');
    console.log('Called with ID:', id);
    console.log('Called with data:', data);
    
    try {
        // Validate input parameters
        if (!id || typeof id !== 'string') {
            console.error('❌ Invalid ID provided:', id);
            return null;
        }

        if (!data || typeof data !== 'object') {
            console.error('❌ Invalid data provided:', data);
            return null;
        }

        // Validate that the ID is a valid ObjectId format
        if (id.length !== 24) {
            console.error('❌ Invalid ObjectId format (length):', id);
            return null;
        }

        // Test if the ID can be converted to ObjectId
        try {
            new ObjectId(id);
        } catch {
            console.error('❌ Invalid ObjectId format (conversion failed):', id);
            return null;
        }

        console.log('✅ ID format is valid');

        // Check if document exists first
        console.log('🔍 Finding existing document with ID:', id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const existing = await Registration.findOne({ _id: new ObjectId(id) } as any);
        console.log('📄 Existing document found:', existing ? 'Yes' : 'No');
        
        if (existing) {
            console.log('📋 Existing document data:', {
                _id: existing._id,
                firstName: existing.firstName,
                lastName: existing.lastName,
                status: existing.status,
                paymentStatus: existing.paymentStatus
            });
        }

        if (!existing) {
            console.log('❌ Document not found with ID:', id);
            return null;
        }

        // Remove _id from data to prevent immutable field error
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id: _, ...updateData } = data;

        // Validate that we have data to update
        if (Object.keys(updateData).length === 0) {
            console.log('⚠️ No data to update');
            return existing;
        }

        console.log('🔄 Updating with data:', updateData);
        const result = await Registration.findOneAndUpdate(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            { _id: new ObjectId(id) } as any,
            { $set: updateData },
            { returnDocument: "after" }
        )
        console.log('📊 Update result:', result ? 'Success' : 'Failed');

        if (!result) {
            console.log('❌ No result returned from update operation');
            return null;
        }

        console.log('✅ Update successful, returning document');
        const serializedResult = JSON.parse(JSON.stringify(result));
        console.log('📤 Serialized result:', {
            _id: serializedResult._id,
            firstName: serializedResult.firstName,
            lastName: serializedResult.lastName,
            status: serializedResult.status,
            paymentStatus: serializedResult.paymentStatus
        });
        console.log('=== updateRegistrationById END ===');
        return serializedResult;
    } catch (error) {
        console.error('❌ Error in updateRegistrationById:', error);
        console.log('=== updateRegistrationById ERROR END ===');
        throw error;
    }
}

export const updateRegistrationByOrderId = async (orderId: string, data: Partial<RegisterForm>): Promise<RegisterForm | null> => {
    // Remove _id from data to prevent immutable field error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id: _, ...updateData } = data;
    
    const result = await Registration.findOneAndUpdate(
        { orderId },
        { $set: updateData },
        { returnDocument: "after" }
    )
    if (!result) return null

    return JSON.parse(JSON.stringify(result))
}

export const updateRegistration = async (id: string, data: Partial<RegisterForm>): Promise<RegisterForm | null> => {
    console.log('updateRegistration called with:', { id, data }); // DEBUG LOG
    // Remove _id from data to prevent immutable field error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id: _, ...updateData } = data;

    const result = await Registration.findOneAndUpdate(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { _id: new ObjectId(id) } as any,
        { $set: updateData },
        { returnDocument: "after" }
    )
    if (!result) {
        console.error('updateRegistration failed for id:', id, 'data:', data); // DEBUG LOG
        return null
    }

    return JSON.parse(JSON.stringify(result))
}

export const countRegistration = async (): Promise<number> => {
    const count = await Registration.countDocuments()
    return JSON.parse(JSON.stringify(count))
}

export const getRegistrationStats = async (): Promise<{
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    completed: number;
    failed: number;
    refunded: number;
    pendingPayment: number;
} | null> => {
    try {
        const [totalStats, statusStats, paymentStats] = await Promise.all([
            // Total registrations
            Registration.countDocuments({}),
            
            // Stats by status
            Registration.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ]).toArray(),
            
            // Stats by payment status
            Registration.aggregate([
                {
                    $group: {
                        _id: "$paymentStatus",
                        count: { $sum: 1 }
                    }
                }
            ]).toArray()
        ]);

        const approved = statusStats.find(s => s._id === 'APPROVED')?.count || 0;
        const pending = statusStats.find(s => s._id === 'PENDING')?.count || 0;
        const rejected = statusStats.find(s => s._id === 'REJECTED')?.count || 0;
        
        const completed = paymentStats.find(s => s._id === 'COMPLETED')?.count || 0;
        const failed = paymentStats.find(s => s._id === 'FAILED')?.count || 0;
        const refunded = paymentStats.find(s => s._id === 'REFUNDED')?.count || 0;
        const pendingPayment = paymentStats.find(s => s._id === 'PENDING')?.count || 0;
        
        return {
            total: totalStats,
            approved,
            pending,
            rejected,
            completed,
            failed,
            refunded,
            pendingPayment
        };
    } catch (error) {
        console.error('Error getting registration stats:', error);
        return null;
    }
}

/**
 * Assign registration numbers to existing registrations that don't have them
 * This function should be run once to fix existing data
 */
export const assignRegistrationNumbersToExisting = async (): Promise<{ success: boolean; count: number; errors: string[] }> => {
    try {
        const registrationsWithoutNumber = await Registration.find({ 
            $or: [
                { registrationNumber: { $exists: false } },
                { registrationNumber: "" }
            ]
        }).sort({ createdAt: 1 }).toArray()

        let count = 0
        const errors: string[] = []

        for (const registration of registrationsWithoutNumber) {
            try {
                const registrationDate = registration.createdAt || new Date()
                const existingRegistrations = await Registration.find({ 
                    createdAt: { 
                        $gte: new Date(registrationDate.getFullYear(), registrationDate.getMonth(), registrationDate.getDate()),
                        $lt: new Date(registrationDate.getFullYear(), registrationDate.getMonth(), registrationDate.getDate() + 1)
                    },
                    registrationNumber: { $exists: true, $nin: [""] }
                }).toArray()
                
                const existingNumbers = existingRegistrations
                    .map(reg => reg.registrationNumber)
                    .filter((num): num is string => num !== undefined && num.startsWith('IHU'))
                
                const registrationNumber = getNextRegistrationNumber(registrationDate, existingNumbers)

                await Registration.updateOne(
                    { _id: registration._id },
                    { $set: { registrationNumber } }
                )

                count++
                console.log(`Assigned registration number ${registrationNumber} to ${registration.firstName} ${registration.lastName}`)
            } catch (error) {
                const errorMsg = `Failed to assign registration number to ${registration.firstName} ${registration.lastName}: ${error}`
                errors.push(errorMsg)
                console.error(errorMsg)
            }
        }

        return { success: true, count, errors }
    } catch (error) {
        console.error('Error in assignRegistrationNumbersToExisting:', error)
        return { success: false, count: 0, errors: [error instanceof Error ? error.message : 'Unknown error'] }
    }
}