import { NextResponse } from "next/server";
import { db } from "@/lib/supabase/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patente = searchParams.get("patente");
  const dni = searchParams.get("dni");
  const compania = searchParams.get("compania");

  if (patente) {
    const normalizada = patente.replace(/\s/g, "").toUpperCase();
    const { data } = await db
      .from("polizas")
      .select("*")
      .ilike("patente", normalizada);
    const found = (data || []).find(
      (p: any) => p.patente.replace(/\s/g, "").toUpperCase() === normalizada
    );
    return NextResponse.json(found || null);
  }

  if (dni) {
    const { data } = await db
      .from("polizas")
      .select("*")
      .eq("asegurado_dni", dni.trim());
    const found = data || [];
    return NextResponse.json(found.length === 0 ? null : found);
  }

  if (compania) {
    const { data } = await db
      .from("polizas")
      .select("*")
      .eq("compania", compania);
    return NextResponse.json(data || []);
  }

  const { data } = await db.from("polizas").select("*").order("created_at", { ascending: false });
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Validate: same DNI must have same nombre
    const { data: mismosDni } = await db
      .from("polizas")
      .select("asegurado_nombre")
      .eq("asegurado_dni", payload.asegurado_dni);

    if (mismosDni && mismosDni.length > 0) {
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

    const { data, error } = await db.from("polizas").insert(newRecord).select().single();
    if (error) {
      console.error("Error inserting poliza:", error);
      return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const { error } = await db.from("polizas").delete().eq("id", id);
    if (error) return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
