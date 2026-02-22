export type LostItem = {
    id: number;
    name: string;
    desc: string;
    tags: string[];
    location: string;
    lat: number;
    lng: number;
    picture: string; // hash
    found: boolean;
    date: string;
    phone?: string;
    email?: string;
};