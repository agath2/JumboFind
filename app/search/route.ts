import { NextResponse } from "next/server";
import sharp from "sharp";
import { openDb } from "../db";
import * as fs from "node:fs";


function splitTags(input: FormDataEntryValue | null): string[] {
  if (!input) return [];
  return String(input)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search_params = {
    name: "&percnt;" + url.searchParams.get("name") + "&percnt;",
    date: url.searchParams.get("date"),
    location: url.searchParams.get("location"),
    tags: url.searchParams.getAll("tags"),
    found: false
  }
  
  const db = await openDb();
  await db.run(
    `SELECT * FROM items 
    WHERE date < items.date AND items.name LIKE name 
      AND location = items.location AND tag IN item.tags
    VALUES (?, ?, ?, ?)
    `,
    
  );
  await db.close();
  console.log("[report] Lost item saved to database.");

  return NextResponse.json({
    ok: true,
    msg: "Search results.",
    
  });
}
