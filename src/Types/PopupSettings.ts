// Conditional import for ObjectId - only available on server side
type ObjectId = string;

export interface PopupSettings {
    _id?: ObjectId | string;
    isActive: boolean;
    title: string;
    courseName: string;
    startDate: string;
    description: string;
    buttonText: string;
    courseLink: string;
    organization?: string;
    instructor?: string;
    createdAt?: Date;
    updatedAt?: Date;
} 