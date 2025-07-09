export interface Blog {
    _id?: string;
    title: string;
    description: string;
    image: File | string;
    content: string;
    author?: string;
    slug: string; // Now required since we auto-generate it
}