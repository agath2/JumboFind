import { NextResponse } from "next/server";
import { openDb } from "../db";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const jsonData = await request.json();

    const id = jsonData.id

    const db = await openDb();
    await db.run(
      `UPDATE items 
      SET found = true
      WHERE id = ?`,
      id
    );
    await db.close();
    console.log("Item reported to be found in database");

    return NextResponse.json({
      ok: true,
      msg: "item updated.",
    });
  } else {
    return NextResponse.json(
      {
        ok: false,
        msg: "Unsupported content type. Use application/json data.",
      }, 
      { status: 415 }
    );
  }
}

