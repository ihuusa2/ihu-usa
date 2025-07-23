import { Order } from "@paypal/paypal-server-sdk";
// Conditional import for ObjectId - only available on server side
type ObjectId = string;

export const enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}

export const enum Status {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export interface RegisterForm {
    _id?: ObjectId | string;
    orderId?: string;
    registrationNumber?: string;
    firstName: string;
    middleName: string;
    lastName: string;
    formerOrMaidenName: string;
    dateOfBirth: string;
    gender: string;
    emailAddress: string;
    countryCode: string;
    phone: string;
    address: string;
    streetAddress2: string;
    city: string;
    state: string;
    countryOrRegion: string;
    zipOrPostalCode: string;
    resident: string;
    enrollmentType: string;
    courseType: string;
    selectedCourse: string;
    presentLevelOfEducation: string;
    graduationYear: string;
    howDidYouHearAboutIHU: string;
    objectives: string;
    signature: string;
    recieved: {
        diploma: boolean;
        homeSchool: boolean;
        ged: boolean;
        other: boolean;
    };
    paymentStatus: PaymentStatus;
    status: Status;
    createdAt: Date;
}

export interface CourseForm {
    _id?: ObjectId | string;
    orderId?: string;
    registrationNumber: string;
    course: string;
    program: string;
    subjects: string[];
    createdAt: Date;
    status: PaymentStatus;
    paymentDetails?: Order;
    transactionId?: string;
    registrationData?: RegisterForm;
    price: {
        amount: number;
        currency: string;
    }
}

export interface Contact {
    _id?: ObjectId | string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    message: string;
    status?: 'unread' | 'read';
    createdAt?: Date;
}

export const enum VolunteerStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export const enum VolunteerArea {
    EDUCATION = 'EDUCATION',
    ADMINISTRATION = 'ADMINISTRATION',
    EVENTS = 'EVENTS',
    TECHNOLOGY = 'TECHNOLOGY',
    MARKETING = 'MARKETING',
    RESEARCH = 'RESEARCH',
    COMMUNITY_OUTREACH = 'COMMUNITY_OUTREACH',
    FUNDRAISING = 'FUNDRAISING',
    TUTORING = 'TUTORING',
    OTHER = 'OTHER',
}

export const enum AvailabilityType {
    WEEKDAYS = 'WEEKDAYS',
    WEEKENDS = 'WEEKENDS',
    EVENINGS = 'EVENINGS',
    FLEXIBLE = 'FLEXIBLE',
}

export interface Volunteer {
    _id?: ObjectId | string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: Date;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    emergencyContact?: {
        name: string;
        phone: string;
        relationship: string;
    };
    areas: VolunteerArea[];
    skills: string[];
    availability: AvailabilityType[];
    hoursPerWeek?: number;
    startDate?: Date;
    value: string;
    experiences: string;
    about: string;
    motivation?: string;
    previousVolunteerWork?: string;
    languages?: string[];
    education?: string;
    profession?: string;
    references?: {
        name: string;
        phone: string;
        email: string;
        relationship: string;
    }[];
    status?: VolunteerStatus;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
    approvedAt?: Date;
    approvedBy?: string;
}