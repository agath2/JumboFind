import {NextResponse} from "next/server";
import {openDb} from "../db";
import {LostItem} from "../item";

export async function GET(request: Request) {
    const url = new URL(request.url);
    type SearchParams = {
        name?: string;
        date?: string;
        location?: string;
        tags?: string[];
        found?: boolean;
    };

    const search_params: SearchParams = {
        name: url.searchParams.get("name") || undefined,
        date: url.searchParams.get("date") || undefined,
        location: url.searchParams.get("location") || undefined,
        tags: url.searchParams.getAll("tags") || undefined,
        found: false
    };

    const db = await openDb();

    // Base query
    let sql = `SELECT *
               FROM items
               WHERE found = ?`;
    const params: any[] = [search_params.found];

    // Dynamically add filters
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
        sql += ` AND tag IN (${placeholders})`;
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
