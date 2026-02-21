import { NextResponse } from "next/server";
import sharp from "sharp";
import { openDb } from "../db";
import * as fs from "node:fs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search_params = {
  name: "%" + (url.searchParams.get("name") ?? "") + "%",
  date: url.searchParams.get("date"),
  location: url.searchParams.get("location"),
  tags: url.searchParams.getAll("tags"),
  found: false
};

// Handle empty tags array
const tagPlaceholders = search_params.tags.length
  ? search_params.tags.map(() => "?").join(", ")
  : "NULL"; // or "''" depending on your use case
  
  const db = await openDb();

  const rows = await db.all(
    `
    SELECT * FROM items
    WHERE date < ? 
      AND name LIKE ? 
      AND location = ? 
      AND tag IN ? 
      AND found = ?
    `,
    search_params.date,
    search_params.name,
    search_params.location,
    ...search_params.tags,
    search_params.found
  );
  await db.close();
  console.log("[report] Searched for lost items");

  return NextResponse.json({
    ok: true,
    msg: "Search results.",
    data: rows
  });
}
