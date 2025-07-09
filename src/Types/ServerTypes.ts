import { ObjectId } from "mongodb";

export enum UserRole {
    Admin = 'admin',
    User = 'user',
    Staff = 'staff'
}

export interface ServerUser {
    _id?: ObjectId;
    email: string;
    name: string;
    password: string;
    contact: string;
    address: string;
    role: UserRole;
    image: File | string;
    registrationNumber: string;
}

export interface ServerTeam {
    _id?: ObjectId;
    name: string;
    role: string;
    image: File | string;
    description: string;
    category: string
}

export interface ServerTeamType {
    _id?: ObjectId;
    title: string;
}

export interface ServerSettings {
    _id?: ObjectId;
    title: string;
    description: string;
    logo: string;
    favicon: string;
    email: string;
    phone: string;
    address: string;
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
    linkedin: string;
    footerText: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ServerPopupSettings {
    _id?: ObjectId;
    title: string;
    description: string;
    image: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ServerPhotoGallery {
    _id?: ObjectId;
    title: string;
    description: string;
    image: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ServerVideoGallery {
    _id?: ObjectId;
    title: string;
    description: string;
    videoUrl: string;
    thumbnail: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ServerBlogs {
    _id?: ObjectId;
    title: string;
    description: string;
    content: string;
    image: string;
    author: string;
    category: string;
    tags: string[];
    status: 'draft' | 'published';
    createdAt: Date;
    updatedAt: Date;
}

export interface ServerCourses {
    _id?: ObjectId;
    title: string;
    description: string;
    content: string;
    image: string;
    price: number;
    duration: string;
    level: string;
    category: string;
    instructor: string;
    status: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
}

export interface ServerCart {
    _id?: ObjectId;
    registrationNumber: string;
    subjects: string[];
    course: string;
    program: string;
    price: {
        amount: number;
        type: string;
    };
    createdAt: Date;
}

export interface ServerDonation {
    _id?: ObjectId;
    name: string;
    email: string;
    amount: number;
    message?: string;
    status: 'pending' | 'completed' | 'failed';
    transactionId?: string;
    createdAt: Date;
} 