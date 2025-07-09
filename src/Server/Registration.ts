'use server'

import handleMail from "@/app/api/mail"
import { parseQuery } from "@/functions/serverActions"
import { db } from "@/lib/mongo"
import { RegistrationNumberMailTemplate } from "@/Template"
import { PaymentStatus, RegisterForm, Status } from "@/Types/Form"
import { Collection, InsertOneResult } from "mongodb"
const Registration: Collection<RegisterForm> = db.collection("Registration")

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createRegisterForm = async ({ _id: _, ...rest }: RegisterForm): Promise<InsertOneResult> => {

    const isEmailExist = await Registration.findOne({ emailAddress: rest.emailAddress })

    if (isEmailExist) {
        return null as unknown as InsertOneResult
    }

    const result = await Registration.insertOne({ ...rest, paymentStatus: PaymentStatus.PENDING, status: Status.PENDING, createdAt: new Date() })

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
    const result = await Registration.findOne({ _id: id })

    if (!result) return null

    return JSON.parse(JSON.stringify(result))
}

export const getRegistrationByRegNum = async (registrationNumber: string): Promise<RegisterForm | null> => {
    const result = await Registration.findOne({ registrationNumber })

    if (!result) return null

    return JSON.parse(JSON.stringify(result))
}

export const updateRegistrationById = async (id: string, data: Partial<RegisterForm>): Promise<RegisterForm | null> => {
    const lastDocument = await Registration.aggregate([
        {
            $match: {
                registrationNumber: { $regex: /^IHU\d+$/ }
            }
        },
        {
            $addFields: {
                registrationNumberInt: {
                    $toInt: {
                        $substr: ["$registrationNumber", 3, -1]
                    }
                }
            }
        },
        {
            $sort: { registrationNumberInt: -1 }
        },
        {
            $limit: 1
        }
    ]).toArray();

    let registrationNumber: string;
    if (lastDocument.length > 0 && lastDocument[0].registrationNumberInt) {
        registrationNumber = `IHU${(lastDocument[0].registrationNumberInt + 1).toString().padStart(5, "0")}`;
    } else {
        registrationNumber = "IHU10000";
    }

    // Check if registrationNumber already exists for this document
    const existing = await Registration.findOne({ _id: id });

    // Remove _id from data to prevent immutable field error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...updateData } = data;
    if (!existing?.registrationNumber) {
        updateData.registrationNumber = registrationNumber;
    }

    const result = await Registration.findOneAndUpdate(
        { _id: id },
        { $set: updateData },
    )

    const res = await Registration.findOne({ _id: id })

    if (!existing?.registrationNumber && res?.registrationNumber) {
        await handleMail({
            email: res.emailAddress as string,
            html: RegistrationNumberMailTemplate({
                data: res
            }),
            sub: "Registration Confirmation"
        })
    }


    if (!result) return null

    return JSON.parse(JSON.stringify(res))
}

export const updateRegistrationByOrderId = async (orderId: string, data: Partial<RegisterForm>): Promise<RegisterForm | null> => {
    // Remove _id from data to prevent immutable field error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...updateData } = data;
    
    const result = await Registration.findOneAndUpdate(
        { orderId },
        { $set: updateData },
        { returnDocument: "after" }
    )
    if (!result) return null

    return JSON.parse(JSON.stringify(result))
}

export const updateRegistration = async (id: string, data: Partial<RegisterForm>): Promise<RegisterForm | null> => {
    // Remove _id from data to prevent immutable field error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...updateData } = data;
    
    const result = await Registration.findOneAndUpdate(
        { _id: id },
        { $set: updateData },
        { returnDocument: "after" }
    )
    if (!result) return null

    return JSON.parse(JSON.stringify(result))
}