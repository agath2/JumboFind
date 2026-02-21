import { NextResponse } from "next/server";

type LostItemPayload = {
  name: string;
  desc: string;
  tags: string[];
  location: string;
  picture: string | null;
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
    let picture: string | null = null;

    if (file instanceof File) {
      picture = `uploaded-file:${file.name} (${file.type || "unknown-type"}, ${file.size} bytes)`;
    } else if (typeof file === "string") {
      picture = file;
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
        error: "Unsupported content type. Use multipart/form-data.",
      },
      { status: 415 }
    );
  }

  if (!payload.name || !payload.desc || !payload.location) {
    return NextResponse.json(
      {
        ok: false,
        error: "name, desc, and loc are required.",
      },
      { status: 400 }
    );
  }

  console.log("[report] Lost item payload:", payload);

  return NextResponse.json({
    ok: true,
    message: "Report received.",
    data: payload,
  });
}
