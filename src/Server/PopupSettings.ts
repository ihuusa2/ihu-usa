'use server'

import type { PopupSettings } from "@/Types/PopupSettings";
import { db } from "@/lib/mongo";
import { InsertOneResult } from "mongodb";

const PopupSettingsCollection = db.collection('PopupSettings');

export const createPopupSettings = async (popupSettings: Omit<PopupSettings, '_id'>): Promise<InsertOneResult> => {
    console.log('Creating popup settings:', popupSettings);
    const result = await PopupSettingsCollection.insertOne({
        ...popupSettings,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    return JSON.parse(JSON.stringify(result));
}

export const getPopupSettings = async (): Promise<PopupSettings | null> => {
    const result = await PopupSettingsCollection.findOne({});
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const updatePopupSettings = async (popupSettings: PopupSettings): Promise<PopupSettings | null> => {
    // Remove _id field to avoid MongoDB immutable field error
    const updateData = { ...popupSettings };
    delete (updateData as Record<string, unknown>)._id;
    
    const result = await PopupSettingsCollection.findOneAndUpdate(
        {}, 
        { 
            $set: {
                ...updateData,
                updatedAt: new Date()
            }
        }, 
        { 
            returnDocument: 'after', 
            upsert: true 
        }
    );
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const deletePopupSettings = async (): Promise<PopupSettings | null> => {
    const result = await PopupSettingsCollection.findOneAndDelete({});
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
} 