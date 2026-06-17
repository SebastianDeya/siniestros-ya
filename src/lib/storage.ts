import fs from "fs/promises";
import path from "path";

// Module-level cache: survives between warm Lambda invocations on Netlify.
// When fs.writeFile fails (read-only filesystem), we still serve newly created
// records from memory so the immediate redirect to the detail page works.
const memoryStore: Record<string, any[]> = {};

async function readFromFile(name: string): Promise<any[]> {
  const filePath = path.join(process.cwd(), "data", `${name}.json`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function readData(name: string): Promise<any[]> {
  const fromFile = await readFromFile(name);

  // Merge: append any in-memory items that aren't in the file (written during this instance)
  const cached = memoryStore[name];
  if (!cached || cached.length === 0) return fromFile;

  const fileIds = new Set(fromFile.map((item: any) => item.id));
  const newItems = cached.filter((item: any) => !fileIds.has(item.id));
  return newItems.length > 0 ? [...fromFile, ...newItems] : fromFile;
}

export async function writeData(name: string, data: any[]): Promise<void> {
  // Always update memory cache first so the next read in this instance sees it
  memoryStore[name] = data;

  const filePath = path.join(process.cwd(), "data", `${name}.json`);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Read-only filesystem (Netlify production) — data lives in memoryStore only.
    // Survives warm lambda reuse; lost on cold start, which is acceptable for a demo.
  }
}
