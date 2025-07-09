/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { parseQuery } from "@/functions/serverActions"
import { db } from "@/lib/mongo"
import { Collection, InsertManyResult, InsertOneResult, ObjectId } from "mongodb"
import type { ServerCart } from "@/Types/ServerTypes";
import type { CourseForm, RegisterForm } from "@/Types/Form";
const Cart: Collection<ServerCart> = db.collection("Cart")
const CourseForm: Collection<CourseForm> = db.collection("CourseRegForm")
const Registration: Collection<RegisterForm> = db.collection("Registration")


export const createCart = async ({ _id, ...rest }: ServerCart): Promise<InsertOneResult> => {
    const registrationNumber = await Registration.findOne({ registrationNumber: rest.registrationNumber });
    if (!registrationNumber) throw new Error('Registration number not found');

    const existingCart = await Cart.findOne({ registrationNumber: rest.registrationNumber, subjects: { $in: rest.subjects } });
    const isAppliedCourse = await CourseForm.findOne({ registrationNumber: rest.registrationNumber, subjects: { $in: rest.subjects } });

    if (existingCart) throw new Error('Subjects already selected');
    if (isAppliedCourse) throw new Error('Course already applied for this registration number');

    const result = await Cart.insertOne({ ...rest, createdAt: new Date() })
    return JSON.parse(JSON.stringify(result))
}

export const createMultipleCart = async (carts: ServerCart[]): Promise<InsertManyResult<ServerCart>> => {
    // Validate all carts before insertion
    for (const { _id, ...rest } of carts) {
        const registrationNumber = await Registration.findOne({ registrationNumber: rest.registrationNumber });
        if (!registrationNumber) throw new Error('Registration number not found');

        const existingCart = await Cart.findOne({ registrationNumber: rest.registrationNumber, subjects: { $in: rest.subjects } });
        const isAppliedCourse = await CourseForm.findOne({ registrationNumber: rest.registrationNumber, subjects: { $in: rest.subjects } });

        if (existingCart) throw new Error('Subjects already selected');
        if (isAppliedCourse) throw new Error('Course already applied for this registration number');
    }

    // Prepare documents for insertion
    const docs = carts.map(({ _id, ...rest }) => ({
        ...rest,
        createdAt: new Date()
    }));

    const result = await Cart.insertMany(docs);
    // Convert InsertManyResult to array of InsertOneResult-like objects
    return result
};

export const getAllCart = async ({ searchParams }: {
    searchParams: { [key: string]: string | string[] | undefined }
}): Promise<{ list: ServerCart[]; count: number } | null> => {

    const { page = 0, pageSize = 10, ...query } = parseQuery(searchParams) as { page: string; pageSize: string;[key: string]: unknown };
    const pageNumber: number = Number(page);
    const pageSizeNumber: number = Number(pageSize);

    const list = await Cart.find(query)
        .skip(pageNumber * pageSizeNumber)
        .limit(pageSizeNumber)
        .toArray()

    const count = await Cart.countDocuments(query)

    if (!list) return null

    return JSON.parse(JSON.stringify({ list, count }))
}

export const removeCartById = async (id: string) => {
    const result = await Cart.deleteOne({ _id: new ObjectId(id) });
    return JSON.parse(JSON.stringify(result));
};
