import fs from "fs/promises";
import path from "path";

const isNetlify = !!process.env.NETLIFY;

async function getBlobs(storeName: string) {
  const { getStore } = await import("@netlify/blobs");
  return getStore(storeName);
}

export async function readData(name: string): Promise<any[]> {
  const filePath = path.join(process.cwd(), "data", `${name}.json`);

  if (isNetlify) {
    try {
      const store = await getBlobs(name);
      const data = await store.get("data", { type: "json" });
      if (data !== null) return data as any[];

      // First deploy: seed from committed JSON file
      const raw = await fs.readFile(filePath, "utf-8").catch(() => "[]");
      const initial = JSON.parse(raw);
      await store.setJSON("data", initial);
      return initial;
    } catch {
      return [];
    }
  }

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function writeData(name: string, data: any[]): Promise<void> {
  if (isNetlify) {
    const store = await getBlobs(name);
    await store.setJSON("data", data);
    return;
  }

  const filePath = path.join(process.cwd(), "data", `${name}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}
