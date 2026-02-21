import { NextResponse } from "next/server";
import sharp from "sharp";

type LostItemPayload = {
  name: string;
  desc: string;
  tags: string[];
  location: string;
  picture: string;
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
      const webpBuffer = await sharp(Buffer.from(buffer))
        .webp({ quality: 80 })
        .toBuffer();

      picture = `image(path=${file.name}, type=${file.type}, size=${webpBuffer.length} bytes)`;
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
      name: String(formData.get("name") ?? ""),
      desc: String(formData.get("desc") ?? ""),
      tags: splitTags(formData.get("tags")),
      location: String(formData.get("loc") ?? ""),
      picture,
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

  return NextResponse.json({
    ok: true,
    msg: "Report received.",
    data: payload,
  });
}
