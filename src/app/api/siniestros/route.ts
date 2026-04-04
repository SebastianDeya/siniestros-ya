import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "siniestros.json");

async function getSiniestros() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading db:", error);
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  
  const all = await getSiniestros();
  
  if (id) {
    const single = all.find((s: any) => s.id === id);
    if (!single) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(single);
  }
  
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const all = await getSiniestros();
    
    const newRecord = {
      ...payload,
      id: payload.id || `mock-id-${Date.now()}`,
      created_at: payload.created_at || new Date().toISOString()
    };
    
    all.push(newRecord);
    
    await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), "utf-8");
    
    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error("Error writing db:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
