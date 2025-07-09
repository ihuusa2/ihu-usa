// Conditional import for ObjectId - only available on server side
type ObjectId = string;

export interface Settings {
    _id?: ObjectId | string;
    logo: File | string;
    social: {
        facebook: string;
        instagram: string;
        twitter: string;
        youtube: string;
        linkedin: string;
    },
    address: string;
    email: string;
    phone: string;
    about: string;
}