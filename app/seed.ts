import { openDb } from "@/app/db";

async function setup() {
  const db = await openDb();
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
      date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("Database setup complete.");
  await db.close();
}

setup().catch(console.error);
