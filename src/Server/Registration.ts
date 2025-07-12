'use server'

import handleMail from "@/app/api/mail"
import { parseQuery } from "@/functions/serverActions"
import { db } from "@/lib/mongo"
import { RegistrationMailTemplateForStudent } from "@/Template"
import { PaymentStatus, RegisterForm, Status } from "@/Types/Form"
import { Collection, InsertOneResult, ObjectId } from "mongodb"
const Registration: Collection<RegisterForm> = db.collection("Registration")

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createRegisterForm = async ({ _id: _, ...rest }: RegisterForm): Promise<InsertOneResult> => {

    const isEmailExist = await Registration.findOne({ emailAddress: rest.emailAddress })

    if (isEmailExist) {
        return null as unknown as InsertOneResult
    }

    const result = await Registration.insertOne({ ...rest, paymentStatus: PaymentStatus.PENDING, status: Status.PENDING, createdAt: new Date() })

    // Send confirmation email to the user
    try {
        await handleMail({
            email: rest.emailAddress,
            html: RegistrationMailTemplateForStudent({ data: rest }),
            sub: "Application Received - IHU"
        })
        console.log('Confirmation email sent to:', rest.emailAddress)
    } catch (error) {
        console.error('Failed to send confirmation email:', error)
        // Don't fail the registration if email fails
    }

    return JSON.parse(JSON.stringify(result))
}

export const checkEmailAlreadyExists = async (email: string): Promise<boolean> => {
    const result = await Registration.findOne({ emailAddress: email })
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