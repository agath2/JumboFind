import {NextResponse} from "next/server";
import {openDb} from "../db";
import {LostItem} from "../models/item";
import {SearchParams} from "../models/searchParams";


export async function GET(request: Request) {
    const url = new URL(request.url);

    const search_params: SearchParams = {
        name: url.searchParams.get("name") || undefined,
        date: url.searchParams.get("date") || undefined,
        location: url.searchParams.get("location") || undefined,
        tags: url.searchParams.getAll("tags") || undefined,
        found: url.searchParams.get("found") ? url.searchParams.get("found") === "true" : undefined
    };

    console.log("[report] Received search request with parameters:", search_params);

    const db = await openDb();

    // Base query
    let sql = `SELECT * FROM items`;
    const params = [];

    // Dynamically add filters
    if (search_params.found !== undefined) {
        sql += ` WHERE found = ?`;
        params.push(search_params.found ? 1 : 0);
    }

    if (search_params.name) {
        sql += ` AND name LIKE ?`;
        params.push(`%${search_params.name}%`);
    }

    if (search_params.date) {
        sql += ` AND date < ?`;
        params.push(search_params.date);
    }

    if (search_params.location) {
        sql += ` AND location = ?`;
        params.push(search_params.location);
    }

    if (search_params.tags && search_params.tags.length > 0) {
        const placeholders = search_params.tags.map(() => '?').join(',');
        sql += ` AND EXISTS (SELECT 1 FROM json_each(items.tags) WHERE value IN (${placeholders}))`;
        params.push(...search_params.tags);
    }

    const rows = await db.all(sql, params);
    await db.close();
    const items: LostItem[] = rows.map((row) => {
        return {
            ...row,
            tags: JSON.parse(row.tags)
        }
    });
    console.log("[report] Searched for lost items");

    return NextResponse.json({
        ok: true,
        msg: "Search results.",
        data: items
    });
}
