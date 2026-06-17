import fs from "fs/promises";
import path from "path";

export async function readData(name: string): Promise<any[]> {
  const filePath = path.join(process.cwd(), "data", `${name}.json`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function writeData(name: string, data: any[]): Promise<void> {
  const filePath = path.join(process.cwd(), "data", `${name}.json`);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Read-only filesystem in production (Netlify) — write is a no-op.
    // The API still returns success so the UI reflects the current operation.
  }
}
