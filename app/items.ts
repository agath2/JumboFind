"use server";

export type LostItem = {
    id: number;
    title: string;
    description?: string;
    location: string;
    category: string;
    isFound: boolean;
    date: string;
    imageUrl: string;
    contactInfo?: string;
};