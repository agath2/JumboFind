"use server";
import {openDb} from "@/app/db";

export default async function getItems() {
    const db = await openDb();
    const rows = await db.all(`SELECT * FROM items`);
    await db.close();
    return rows;
}