import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/storage";

async function getPolizas() {
  return readData("polizas");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patente = searchParams.get("patente");
  const compania = searchParams.get("compania");

  const all = await getPolizas();

  if (patente) {
    const normalizada = patente.replace(/\s/g, "").toUpperCase();
    const found = all.find(
      (p: any) => p.patente.replace(/\s/g, "").toUpperCase() === normalizada
    );
    if (!found) return NextResponse.json(null);
    return NextResponse.json(found);
  }

  const dni = searchParams.get("dni");
  if (dni) {
    const found = all.filter((p: any) => p.asegurado_dni === dni.trim());
    if (found.length === 0) return NextResponse.json(null);
    return NextResponse.json(found);
  }

  if (compania) {
    return NextResponse.json(all.filter((p: any) => p.compania === compania));
  }

  return NextResponse.json(all);
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const all = await getPolizas();

    // Validate: same DNI must have same nombre (DNI+nombre is the person identifier)
    const mismosDni = all.filter(
      (p: any) => p.asegurado_dni === payload.asegurado_dni
    );
    if (mismosDni.length > 0) {
      const nombreExistente = mismosDni[0].asegurado_nombre?.trim().toLowerCase();
      const nombreNuevo = payload.asegurado_nombre?.trim().toLowerCase();
      if (nombreExistente !== nombreNuevo) {
        return NextResponse.json(
          { error: "Ya existe una póliza con ese DNI registrada a nombre de otra persona." },
          { status: 409 }
        );
      }
    }

    const newRecord = {
      ...payload,
      patente: payload.patente.replace(/\s/g, "").toUpperCase(),
      id: `pol-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    all.push(newRecord);
    await writeData("polizas", all);
    return NextResponse.json(newRecord, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const all = await getPolizas();
    const filtered = all.filter((p: any) => p.id !== id);
    await writeData("polizas", filtered);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
