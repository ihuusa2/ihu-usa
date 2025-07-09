// Conditional import for ObjectId - only available on server side
type ObjectId = string;

export interface PhotoGallery {
    _id?: ObjectId | string
    title: string
    description: string
    image: File | string
}

export interface VideoGallery {
    _id?: ObjectId | string
    title: string
    description: string
    link: string
}

export interface Events {
    _id?: ObjectId | string
    title: string
    description: string
    date: Date
    location: string
    attendees: string[]
    image: File | string
    link: string
}

export interface Webinars {
    _id?: ObjectId | string
    title: string
    description: string
    date: Date
    location: string
    attendees: string[]
    image: File | string
    link: string
}

export interface FAQ {
    _id?: ObjectId | string
    question: string
    answer: string
}