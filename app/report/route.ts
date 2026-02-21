import { NextResponse } from "next/server";
import sharp from "sharp";
import { openDb } from "../db";

type LostItemPayload = {
  name: string;
  desc: string;
  tags: string[];
  location: string;
  lat: number;
  lng: number;
  picture: string;
  phoneNumber: string;
  email: string;
};

function splitTags(input: FormDataEntryValue | null): string[] {
  if (!input) return [];
  return String(input)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  let payload: LostItemPayload;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();

    const file = formData.get("img");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          ok: false,
          msg: "Image must be uploaded as a file.",
        },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          ok: false,
          msg: "Uploaded file must be an image.",
        },
        { status: 400 }
      );
    }

    // convert img to webp
    let picture: string;
    try {
      const buffer = await file.arrayBuffer();
      const webp = sharp(Buffer.from(buffer)).webp({ quality: 80 });

      const hash = require("crypto").createHash("sha256").update(await webp.toBuffer()).digest("hex");
      await webp.toFile(`./data/img/${hash}.webp`);
      picture = `${hash}`;
    } catch (error) {
      console.error("[report] Failed to convert image to WebP:", error);
      return NextResponse.json(
        {
          ok: false,
          msg: "Failed to convert image to WebP format.",
        },
        { status: 500 }
      );
    }

    payload = {
      name: String(formData.get("name")),
      desc: String(formData.get("desc")),
      tags: splitTags(formData.get("tags")),
      location: String(formData.get("loc")),
      lat: Number(formData.get("lat")),
      lng: Number(formData.get("lng")),
      picture,
      phoneNumber: String(formData.get("phoneNumber")),
      email: String(formData.get("email")),
    };
  } else {
    return NextResponse.json(
      {
        ok: false,
        msg: "Unsupported content type. Use multipart/form-data.",
      },
      { status: 415 }
    );
  }

  if (!payload.name || !payload.desc || !payload.location || !payload.picture) {
    return NextResponse.json(
      {
        ok: false,
        msg: "name, desc, and loc, and img are required.",
      },
      { status: 400 }
    );
  }

  console.log("[report] Lost item payload:", payload);
  const db = await openDb();
  await db.run(
    `INSERT INTO items (name, desc, tags, location, lat, lng, picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    payload.name,
    payload.desc,
    JSON.stringify(payload.tags),
    payload.location,
    payload.lat,
    payload.lng,
    payload.picture,
    payload.phoneNumber,
    payload.email
  );
  await db.close();
  console.log("[report] Lost item saved to database.");

  return NextResponse.json({
    ok: true,
    msg: "Report received.",
    data: payload,
  });
}
