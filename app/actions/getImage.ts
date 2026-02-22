"use server";

import * as fs from "node:fs";

export default async function getImage(hash: string): Promise<string> {
    const data = fs.readFileSync(`./data/img/${hash}.webp`);
    return `data:image/webp;base64,${data.toString("base64")}`;
}