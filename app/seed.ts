import { openDb } from "@/app/db";
import * as fs from "node:fs";

async function setup() {
  fs.mkdirSync("data/img", { recursive: true });
  const db = await openDb();
  await db.exec (`DROP TABLE IF EXISTS items;
                  DROP TABLE IF EXISTS locations;
                  DROP TABLE IF EXISTS tags;`)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      desc TEXT NOT NULL,
      tags TEXT NOT NULL,
      location TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      picture TEXT NOT NULL,
      found BOOL NOT NULL DEFAULT FALSE,
      date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      phone TEXT,
      email TEXT
    )
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
    `)
  // TODO POPULATE LOCATION TABLE
  await db.exec(`
  CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
  `)
  // TODO POPULATE TAGS
    
  console.log("Database setup complete.");
  await db.close();
}

setup().catch(console.error);
