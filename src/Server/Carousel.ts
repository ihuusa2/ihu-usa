'use server'

import type { CarouselImage } from "@/Types/Carousel";
import { db } from "@/lib/mongo";
import { InsertOneResult, ObjectId } from "mongodb";

const CarouselCollection = db.collection('CarouselImages');

export const createCarouselImage = async (carouselImage: CarouselImage): Promise<InsertOneResult> => {
    console.log('Creating carousel image:', carouselImage);
    const result = await CarouselCollection.insertOne({
        src: carouselImage.src,
        alt: carouselImage.alt,
        title: carouselImage.title,
        description: carouselImage.description,
        isActive: carouselImage.isActive,
        displayOrder: carouselImage.displayOrder,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    return JSON.parse(JSON.stringify(result));
}

export const getAllCarouselImages = async (): Promise<CarouselImage[]> => {
    const result = await CarouselCollection.find({}).sort({ displayOrder: 1, createdAt: -1 }).toArray();
    return JSON.parse(JSON.stringify(result));
}

export const getActiveCarouselImages = async (): Promise<CarouselImage[]> => {
    const result = await CarouselCollection.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 }).toArray();
    return JSON.parse(JSON.stringify(result));
}

export const getCarouselImageById = async (id: string): Promise<CarouselImage | null> => {
    const result = await CarouselCollection.findOne({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const updateCarouselImage = async (carouselImage: CarouselImage): Promise<CarouselImage | null> => {
    const { _id, ...updateData } = carouselImage;
    const result = await CarouselCollection.findOneAndUpdate(
        { _id: new ObjectId(_id as string) },
        { 
            $set: {
                ...updateData,
                updatedAt: new Date()
            }
        },
        { returnDocument: 'after' }
    );
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const deleteCarouselImage = async (id: string): Promise<CarouselImage | null> => {
    const result = await CarouselCollection.findOneAndDelete({ _id: new ObjectId(id) });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const updateCarouselImageOrder = async (id: string, displayOrder: number): Promise<CarouselImage | null> => {
    const result = await CarouselCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { 
            $set: {
                displayOrder,
                updatedAt: new Date()
            }
        },
        { returnDocument: 'after' }
    );
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

export const toggleCarouselImageStatus = async (id: string, isActive: boolean): Promise<CarouselImage | null> => {
    const result = await CarouselCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { 
            $set: {
                isActive,
                updatedAt: new Date()
            }
        },
        { returnDocument: 'after' }
    );
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
} 