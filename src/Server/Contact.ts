/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import handleMail from "@/app/api/mail";
import { parseQuery } from "@/functions/serverActions";
import { db } from "@/lib/mongo"
import { ContactFormMailTemplate } from "@/Template";
import type { Contact } from "@/Types/Form"
import { InsertOneResult, ObjectId } from "mongodb";
const Contact = db.collection('Contact');

export const createContactForm = async ({ _id, ...rest }: Contact): Promise<InsertOneResult> => {
    const contactData = {
        ...rest,
        status: 'unread' as const,
        createdAt: new Date()
    }
    
    const result = await Contact.insertOne(contactData)
    
    // Try to send email notification, but don't fail if it doesn't work
    try {
        await handleMail({
            email: process.env.CONTACT_FORM_EMAIL as string,
            html: ContactFormMailTemplate({ data: contactData }),
            sub: 'Contact Form Submission',
        })
    } catch (error) {
        // Don't throw error - the form data was saved successfully
    }
    
    return JSON.parse(JSON.stringify(result))
}

export const getAllContactForm = async ({ searchParams }: {
    searchParams: { [key: string]: string | string[] | undefined }
}): Promise<{ list: Contact[], count: number } | null> => {
    const { page = 0, pageSize = 10, status, ...query } = parseQuery(searchParams) as { 
        page: string; 
        pageSize: string; 
        status?: string;
        [key: string]: unknown 
    };
    const pageNumber: number = Number(page);
    const pageSizeNumber: number = Number(pageSize);

    // Build filter query
    const filterQuery: { status?: string } = {};
    if (status && status !== 'all') {
        filterQuery.status = status;
    }

    const list = await Contact.find(filterQuery)
        .sort({ createdAt: -1 }) // Sort by newest first
        .skip(pageNumber * pageSizeNumber)
        .limit(pageSizeNumber)
        .toArray()

    const count = await Contact.countDocuments(filterQuery)

    if (!list || list.length === 0) return null;

    return {
        list: JSON.parse(JSON.stringify(list)),
        count: count
    };
}

export const getContactFormById = async (id: string): Promise<Contact | null> => {
    const result = await Contact.findOne({ _id: new ObjectId(id) })
    if (!result) return null
    return JSON.parse(JSON.stringify(result))
}

export const markContactAsRead = async (id: string): Promise<boolean> => {
    try {
        const result = await Contact.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: 'read' } }
        )
        return result.modifiedCount > 0
    } catch (error) {
        return false
    }
}

export const deleteContactForm = async (id: string): Promise<boolean> => {
    try {
        const result = await Contact.deleteOne({ _id: new ObjectId(id) })
        return result.deletedCount > 0
    } catch (error) {
        return false
    }
}

export const getContactStats = async (): Promise<{
    total: number;
    unread: number;
    read: number;
} | null> => {
    try {
        const total = await Contact.countDocuments({})
        const unread = await Contact.countDocuments({ status: 'unread' })
        const read = await Contact.countDocuments({ status: 'read' })
        
        return { total, unread, read }
    } catch (error) {
        return null
    }
}