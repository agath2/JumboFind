import {NextResponse} from "next/server";
import {openDb} from "../db";

export async function GET(request: Request) {
    const db = await openDb();

    const rows = await db.all(`
        SELECT * FROM locations
        `);
    
    
    await db.close();
    
    console.log("[report] Searched for all locations in DB");

    return NextResponse.json({
        ok: true,
        msg: "Search results.",
        data: rows
    });
}
