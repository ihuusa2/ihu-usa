// Conditional import for ObjectId - only available on server side
type ObjectId = string;

export interface Course {
    _id?: ObjectId | string
    title: string
    slug: string
    images: File[] | string[]
    description: string
    type: string
    price?: {
        type: string
        amount: number
    }[]
    duration?: string
    level?: string
    instructor?: string
    status?: 'active' | 'inactive'
    testimonialVideos?: TestimonialVideo[]
    faqs?: CourseFAQ[]
    galleryImages?: File[] | string[]
}

export interface TestimonialVideo {
    _id?: string
    title: string
    description?: string
    videoUrl: string
    videoFile?: File
    thumbnail?: string
}

export interface CourseFAQ {
    _id?: string
    question: string
    answer: string
}

export interface CourseType {
    _id?: ObjectId | string
    title: string
}

export interface Subject {
    _id?: ObjectId | string
    title: string
    slug: string
    courseId: string
    price: {
        type: string
        amount: number
    }[]
    description: string
}

export interface SelectSubject {
    _id?: ObjectId | string
    title: string
    slug: string
    courseId: string
    price: {
        type: string
        amount: number
    }
    description: string
}