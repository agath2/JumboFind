import { openDb } from "@/app/db";
import tags from "@/app/models/tags"
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
      tags TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(tags)),
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
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL
    )
  `)
  // Populate Locations
  let locraw: any[] = JSON.parse(fs.readFileSync("./app/models/medford-locations.json").toString()).maps[0].locations;

    let locations = locraw.map((loc: any) => {
        return {
            name: loc.name,
            address: loc.address1,
            lat: loc.latitude,
            lng: loc.longitude
        }
    })
    const loc_placeholders = locations.map(() => "(?, ?, ?, ?)").join(", ");
    const values = locations.flatMap((loc) => [
        loc.name,
        loc.address,
        loc.lat,
        loc.lng,
    ]);

    await db.run(
        `INSERT INTO locations (name, address, lat, lng)
         VALUES ${loc_placeholders}`,
        values
    );

  await db.exec(`
  CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
  `)

  const tags_placeholders = tags.map(() => "(?)").join(", ");
  await db.run(
    `INSERT INTO tags (name)
    VALUES ${tags_placeholders}`,
    tags
  )

  console.log("Database setup complete.");
  await db.close();
}

setup().catch(console.error);
