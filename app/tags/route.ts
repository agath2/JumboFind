import {NextResponse} from "next/server";
import {openDb} from "../db";

export async function GET(request: Request) {
    const db = await openDb();

    const rows = await db.all(`
        SELECT * FROM tags
        `);
    
    
    await db.close();
    
    console.log("[report] Searched for all tags in DB");

    return NextResponse.json({
        ok: true,
        msg: "Search results.",
        data: rows
    });
}
