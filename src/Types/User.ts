// Conditional import for ObjectId - only available on server side
type ObjectId = string;

export enum UserRole {
    Admin = 'admin',
    User = 'user',
    Staff = 'staff'
}

export interface User {
    _id?: ObjectId | string;
    email: string;
    name: string;
    password: string;
    contact: string;
    address: string;
    role: UserRole;
    image: File | string;
    registrationNumber: string;
}

export interface Team {
    _id?: ObjectId | string;
    name: string;
    role: string;
    image: File | string;
    description: string;
    category: string
}

export interface TeamType {
    _id?: ObjectId | string;
    title: string;
}