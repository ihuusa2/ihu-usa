/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { parseQuery } from "@/functions/serverActions";
import { db } from "@/lib/mongo";
import type { User, UserRole } from "@/Types/User";
import { InsertOneResult, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

const Users = db.collection('Users');

export const createUser = async ({ _id, password, ...rest }: User): Promise<InsertOneResult> => {
    if (!password) throw new Error('Password is required');
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await Users.insertOne({ ...rest, password: hashedPassword });
    return JSON.parse(JSON.stringify(result));
}

export const getAllUsers = async ({ searchParams }: {
    searchParams: { [key: string]: string | string[] | undefined }
}): Promise<{ list: User[]; count: number } | null> => {

    const { page = 0, pageSize = 10, ...query } = parseQuery(searchParams) as { page: string; pageSize: string;[key: string]: unknown };
    const pageNumber: number = Number(page);
    const pageSizeNumber: number = Number(pageSize);

    const list = await Users.find(query, { projection: { password: 0 } })
        .skip(pageNumber * pageSizeNumber)
        .limit(pageSizeNumber)
        .toArray();

    const count = await Users.countDocuments(query);

    if (!list) return null;

    return JSON.parse(JSON.stringify({ list, count }));
}

export const getUserById = async (id: string): Promise<User | null> => {
    // Validate that id is a valid ObjectId format (24 character hex string)
    if (!id || !ObjectId.isValid(id)) {
        return null;
    }
    
    const result = await Users.findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const updateUser = async ({ _id, password, ...rest }: User): Promise<User | null> => {
    // Validate that _id is a valid ObjectId format
    if (!_id || !ObjectId.isValid(_id as string)) {
        return null;
    }
    
    const obj: { [key: string]: unknown } = { ...rest };
    const checkIsPasswordSame = await Users.findOne({ _id: new ObjectId(_id as string) }, { projection: { password: 1 } });

    const isPassSame = password && await bcrypt.compare(password, checkIsPasswordSame?.password as string);

    if (!isPassSame && password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        obj.password = hashedPassword;
    } else {
        obj.password = checkIsPasswordSame?.password;
    }

    const result = await Users.findOneAndUpdate(
        { _id: new ObjectId(_id as string) },
        { $set: { ...obj } },
        { returnDocument: 'after', projection: { password: 0 } }
    );
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const deleteUser = async (id: string): Promise<User | null> => {
    // Validate that id is a valid ObjectId format
    if (!id || !ObjectId.isValid(id)) {
        return null;
    }
    
    const result = await Users.findOneAndDelete({ _id: new ObjectId(id) }, { projection: { password: 0 } });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const signInUser = async ({ email, password }: { email: string; password: string }): Promise<User | {
    message: string;
}> => {
    const user = await Users.findOne({ email });
    if (!user) return { message: 'User not found' };

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return { message: 'Invalid password' };

    return JSON.parse(JSON.stringify(user));
}

export const countUsers = async ({ role }: { role?: UserRole }): Promise<number> => {
    const query = role ? { role } : {};
    const count = await Users.countDocuments(query);
    return JSON.parse(JSON.stringify(count));
}