import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { readData, writeData } from "@/lib/storage";

async function getSiniestros() {
  return readData("siniestros");
}

async function sendSiniestroEmail(siniestro: any) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || `"Siniestros Ya" <no-reply@siniestrosya.com>`;
  const to = "sebastiandeya88@gmail.com";

  const emailSubject = `Nueva denuncia de siniestro - ${siniestro.numero_seguimiento}`;
  const emailHtml = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 8px;">Nueva Denuncia de Siniestro Recibida</h2>
      <p style="font-size: 16px;"><strong>Nro. de Seguimiento:</strong> <span style="font-family: monospace; font-weight: bold; font-size: 18px; color: #1d4ed8;">${siniestro.numero_seguimiento}</span></p>
      
      <h3 style="color: #1e3a8a; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-top: 24px;">Datos del Asegurado y Póliza</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 4px 0; font-weight: bold; width: 40%;">Nombre del Asegurado:</td><td style="padding: 4px 0;">${siniestro.asegurado_nombre || "No especificado"}</td></tr>
        <tr><td style="padding: 4px 0; font-weight: bold;">DNI:</td><td style="padding: 4px 0;">${siniestro.asegurado_dni || "No especificado"}</td></tr>
        <tr><td style="padding: 4px 0; font-weight: bold;">Teléfono:</td><td style="padding: 4px 0;">${siniestro.asegurado_telefono || "No especificado"}</td></tr>
        <tr><td style="padding: 4px 0; font-weight: bold;">Email:</td><td style="padding: 4px 0;">${siniestro.asegurado_email || "No especificado"}</td></tr>
        <tr><td style="padding: 4px 0; font-weight: bold;">Compañía Aseguradora:</td><td style="padding: 4px 0;">${siniestro.compania_aseguradora || "No especificada"}</td></tr>
        <tr><td style="padding: 4px 0; font-weight: bold;">Póliza Nro:</td><td style="padding: 4px 0;">${siniestro.numero_poliza || "No especificada"}</td></tr>
        <tr><td style="padding: 4px 0; font-weight: bold;">Tipo de Seguro:</td><td style="padding: 4px 0; text-transform: capitalize;">${siniestro.tipo_seguro || "No especificado"}</td></tr>
        <tr><td style="padding: 4px 0; font-weight: bold;">Vehículo:</td><td style="padding: 4px 0;">${[siniestro.vehiculo_marca, siniestro.vehiculo_modelo, siniestro.vehiculo_anio].filter(Boolean).join(" ") || "No especificado"}</td></tr>
        <tr><td style="padding: 4px 0; font-weight: bold;">Patente:</td><td style="padding: 4px 0; font-family: monospace;">${siniestro.vehiculo_patente || "No especificada"}</td></tr>
      </table>
      
      <h3 style="color: #1e3a8a; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-top: 24px;">Detalles del Hecho</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 4px 0; font-weight: bold; width: 40%;">Fecha y Hora:</td><td style="padding: 4px 0;">${siniestro.fecha_siniestro || "No especificada"} a las ${siniestro.hora_siniestro || "No especificada"} hs</td></tr>
        <tr><td style="padding: 4px 0; font-weight: bold;">Ubicación:</td><td style="padding: 4px 0;">${siniestro.ubicacion || "No especificada"}</td></tr>
        <tr><td style="padding: 4px 0; font-weight: bold;">Tipo de Siniestro:</td><td style="padding: 4px 0; text-transform: capitalize;">${siniestro.tipo_siniestro || "No especificado"} ${siniestro.subtipo_choque ? `(${siniestro.subtipo_choque})` : ""}</td></tr>
        <tr><td style="padding: 4px 0; font-weight: bold;">Cantidad de Vehículos:</td><td style="padding: 4px 0;">${siniestro.cantidad_vehiculos || "1"}</td></tr>
        <tr><td style="padding: 4px 0; font-weight: bold; vertical-align: top;">Descripción:</td><td style="padding: 4px 0; white-space: pre-wrap;">${siniestro.descripcion || "Sin descripción"}</td></tr>
      </table>
      
      <h3 style="color: #1e3a8a; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-top: 24px;">Datos del Tercero Involucrado</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 4px 0; font-weight: bold; width: 40%;">Nombre del Tercero:</td><td style="padding: 4px 0;">${siniestro.tercero_nombre || "No especificado"}</td></tr>
        <tr><td style="padding: 4px 0; font-weight: bold;">DNI del Tercero:</td><td style="padding: 4px 0;">${siniestro.tercero_dni || "No especificado"}</td></tr>
        <tr><td style="padding: 4px 0; font-weight: bold;">Patente del Tercero:</td><td style="padding: 4px 0; font-family: monospace;">${siniestro.tercero_patente || "No especificado"}</td></tr>
        <tr><td style="padding: 4px 0; font-weight: bold;">Aseguradora del Tercero:</td><td style="padding: 4px 0;">${siniestro.tercero_aseguradora || "No especificado"}</td></tr>
      </table>
      
      <div style="margin-top: 30px; font-size: 12px; color: #666; text-align: center; border-top: 1px solid #eee; padding-top: 10px;">
        Este es un correo automático generado por Siniestros Ya.
      </div>
    </div>
  `;

  if (!host || !user || !pass) {
    console.log("=========================================");
    console.log("FALLBACK: SMTP no configurado. Detalle del email:");
    console.log(`De: ${from}`);
    console.log(`Para: ${to}`);
    console.log(`Asunto: ${emailSubject}`);
    console.log("Contenido HTML:");
    console.log(emailHtml);
    console.log("=========================================");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(port) || 587,
      secure,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from,
      to,
      subject: emailSubject,
      html: emailHtml,
    });
    console.log(`Email enviado con éxito a ${to} para el siniestro ${siniestro.numero_seguimiento}`);
  } catch (error) {
    console.error("Error al enviar el correo electrónico via SMTP:", error);
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

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const body = await request.json();
    const all = await getSiniestros();

    const idx = all.findIndex((s: any) => s.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    all[idx] = { ...all[idx], ...body, updated_at: new Date().toISOString() };
    await writeData("siniestros", all);

    return NextResponse.json(all[idx]);
  } catch (error) {
    console.error("Error updating siniestro:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
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
    
    await writeData("siniestros", all);
    
    try {
      await sendSiniestroEmail(newRecord);
    } catch (mailError) {
      console.error("Fallo silencioso al enviar el mail:", mailError);
    }
    
    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error("Error writing db:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
