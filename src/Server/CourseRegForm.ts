/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { parseQuery } from "@/functions/serverActions"
import { db } from "@/lib/mongo"
import { CourseForm, RegisterForm } from "@/Types/Form"
import { Collection, InsertOneResult, ObjectId } from "mongodb"
import { type Cart } from "@/Types/Cart";
const CourseRegForm = db.collection("CourseRegForm")
const Cart: Collection<Cart> = db.collection("Cart")
const Registration: Collection<RegisterForm> = db.collection("Registration")

// export const createCourseRegForm = async ({ _id, ...rest }: CourseForm): Promise<InsertOneResult> => {
//     const registrationNumber = await Users.findOne({ registrationNumber: rest.registrationNumber });
//     if (!registrationNumber) throw new Error('Registration number not found');

//     const result = await CourseRegForm.insertOne({ ...rest, createdAt: new Date() })

//     await handleMail({
//         email: process.env.NODEMAILER_PUBLIC_EMAIL as string,
//         html: CourseMailTemplate({ data: rest }),
//         sub: "New Course Registration",
//     })

//     return JSON.parse(JSON.stringify(result))
// }


export const createMultiCourseRegForm = async (forms: CourseForm[]): Promise<InsertOneResult[]> => {
    const data = forms.flatMap(({ _id, ...rest }) => ({ ...rest, createdAt: new Date() }))
    const result = await CourseRegForm.insertMany(data)
    await Cart.deleteMany({ registrationNumber: { $in: data.map(item => item.registrationNumber) } })

    return JSON.parse(JSON.stringify(result))
}

export const getAllCourseRegForm = async ({ searchParams }: {
    searchParams: { [key: string]: string | string[] | undefined }
}): Promise<{ list: CourseForm[]; count: number } | null> => {

    const { page = 0, pageSize = 10, ...query } = parseQuery(searchParams) as { page: string; pageSize: string;[key: string]: unknown };
    const pageNumber: number = Number(page);
    const pageSizeNumber: number = Number(pageSize);

    const list = await CourseRegForm.aggregate([
        {
            $match: query
        },
        {
            $lookup: {
                from: "Registration",
                localField: "registrationNumber",
                foreignField: "registrationNumber",
                as: "registrationData"
            }
        },
        {
            $unwind: {
                path: "$registrationData",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $skip: pageNumber * pageSizeNumber
        },
        {
            $limit: pageSizeNumber
        }
    ]).toArray()

    const count = await CourseRegForm.countDocuments(query)

    if (!list) return null

    return JSON.parse(JSON.stringify({ list, count }))
}

export const countCourseRegForm = async (): Promise<number> => {
    const count = await CourseRegForm.countDocuments()
    return JSON.parse(JSON.stringify(count))
}


export const getCourseRegFormById = async (id: string): Promise<CourseForm | null> => {
    const result = await CourseRegForm.findOne({ _id: new ObjectId(id) })
    if (!result) return null

    return JSON.parse(JSON.stringify(result))
}

export const getCourseRegFormByRegistrationNumber = async (registrationNumber: string): Promise<CourseForm | null> => {
    const result = await CourseRegForm.findOne({
        registrationNumber
    })
    if (!result) return null
    return JSON.parse(JSON.stringify(result))
}


export const getCourseRegFormsByRegistrationNumber = async (registrationNumber: string, skip: number): Promise<CourseForm[]> => {
    const result = await CourseRegForm.find({
        registrationNumber
    }).skip(skip || 0).limit(10).toArray()

    return JSON.parse(JSON.stringify(result))
}

export const updateCourseRegFormById = async (id: string, data: Partial<CourseForm>): Promise<CourseForm | null> => {
    const result = await CourseRegForm.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: data },
        { returnDocument: "after" }
    )
    if (!result) return null

    return JSON.parse(JSON.stringify(result))
}
