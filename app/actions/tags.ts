"use server";

import {openDb} from "@/app/db";

export async function getTags(): Promise<string[]> {
    const db = await openDb();
    const rows = await db.all(`SELECT * FROM tags`);
    await db.close();
    return rows.map((row) => row.name);
}