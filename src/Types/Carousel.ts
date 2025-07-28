

export interface CarouselImage {
    _id?: string;
    src: string;
    alt: string;
    title?: string;
    description?: string;
    isActive: boolean;
    displayOrder: number;
    createdAt?: Date;
    updatedAt?: Date;
} 