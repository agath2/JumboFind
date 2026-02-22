"use server";
import {openDb} from "@/app/db";
import {LostItem} from "@/app/models/item";

export default async function getItems(): Promise<LostItem[]> {
    const db = await openDb();
    const rows = await db.all(`SELECT * FROM items`);
    await db.close();
    return rows;
}