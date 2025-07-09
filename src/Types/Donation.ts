// Conditional import for ObjectId - only available on server side
type ObjectId = string;

export const enum DonationStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}

export const enum DonationPurpose {
    GENERAL = 'GENERAL',
    EDUCATION = 'EDUCATION',
    INFRASTRUCTURE = 'INFRASTRUCTURE',
    SCHOLARSHIPS = 'SCHOLARSHIPS',
    RESEARCH = 'RESEARCH',
    COMMUNITY = 'COMMUNITY',
}

export interface Donation {
    _id?: ObjectId | string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    amount: number;
    currency?: string;
    purpose?: DonationPurpose;
    message?: string;
    isAnonymous?: boolean;
    status?: DonationStatus;
    paymentMethod?: string;
    transactionId?: string;
    orderId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}