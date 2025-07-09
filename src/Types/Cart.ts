// Import ObjectId type for compatibility with ServerCart
import { ObjectId } from "mongodb";

export interface Cart {
    _id?: ObjectId | string;
    userId?: string;
    registrationNumber: string;
    course: string;
    program: string;
    subjects: string[];
    price: {
        amount: number;
        type: string;
    },
    createdAt: Date;
}