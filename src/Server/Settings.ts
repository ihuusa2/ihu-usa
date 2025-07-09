/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import type { Settings } from "@/Types/Settings";
import { db } from "@/lib/mongo";
import { InsertOneResult } from "mongodb";

const SettingsCollection = db.collection('Settings');

export const createSettings = async ({ _id, ...settings }: Settings): Promise<InsertOneResult> => {
    console.log('Creating settings:', settings);
    const result = await SettingsCollection.insertOne(settings);
    return JSON.parse(JSON.stringify(result));
}

export const getSettings = async (): Promise<Settings | null> => {
    const result = await SettingsCollection.findOne({});
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const updateSettings = async (settings: Settings): Promise<Settings | null> => {
    // Remove _id field to avoid MongoDB immutable field error
    const { _id, ...updateData } = settings as Omit<Settings, '_id'> & { _id?: unknown };
    const result = await SettingsCollection.findOneAndUpdate({}, { $set: updateData }, { returnDocument: 'after', upsert: true });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const deleteSettings = async (): Promise<Settings | null> => {
    const result = await SettingsCollection.findOneAndDelete({});
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}