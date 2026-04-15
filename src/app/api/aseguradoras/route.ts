import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "aseguradoras.json");

async function getAseguradoras() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET() {
  const all = await getAseguradoras();
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const all = await getAseguradoras();

    const newRecord = {
      ...payload,
      id: `aseg-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    all.push(newRecord);
    await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), "utf-8");

    return NextResponse.json(newRecord, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const all = await getAseguradoras();
    const filtered = all.filter((a: any) => a.id !== id);
    await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), "utf-8");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
