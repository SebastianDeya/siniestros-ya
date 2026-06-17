"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Siniestro, SiniestroEvento, SiniestroArchivo } from "@/lib/types";
import { ESTADO_CONFIG, ETAPAS_SINIESTRO } from "@/lib/constants";
import { formatFecha, tipoSiniestroLabel, cn } from "@/lib/utils";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Car,
  Shield,
  FileText,
  CheckCircle2,
  Circle,
  Camera,
  AlertTriangle,
  Clock,
  Info,
} from "lucide-react";

export default function SiniestroDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [siniestro, setSiniestro] = useState<Siniestro | null>(null);
  const [eventos, setEventos] = useState<SiniestroEvento[]>([]);
  const [archivos, setArchivos] = useState<SiniestroArchivo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const [siniestroRes, eventosRes, archivosRes] = await Promise.all([
        supabase.from("siniestros").select("*").eq("id", id).single(),
        supabase
          .from("siniestro_eventos")
          .select("*")
          .eq("siniestro_id", id)
          .order("fecha", { ascending: true }),
        supabase
          .from("siniestro_archivos")
          .select("*")
          .eq("siniestro_id", id),
      ]);

      // API returns {error:...} when not found — treat as null
      const sinData = siniestroRes.data;
      setSiniestro(sinData && sinData.id ? sinData : null);
      setEventos(eventosRes.data || []);
      setArchivos(archivosRes.data || []);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!siniestro) {
    return (
      <div className="text-center py-20">
        <AlertTriangle size={48} className="text-warning mx-auto mb-3" />
        <p className="text-gray-700 font-medium">Siniestro no encontrado</p>
        <Link
          href="/siniestros"
          className="text-primary text-sm mt-2 inline-block hover:underline"
        >
          Volver a mis siniestros
        </Link>
      </div>
    );
  }

  const estadoConfig =
    ESTADO_CONFIG[siniestro.estado] || ESTADO_CONFIG.denuncia_recibida;

  // Determine the index of the current stage
  const currentEtapaIndex = ETAPAS_SINIESTRO.findIndex(
    (e) => e.value === siniestro.estado
  );

  // Get photo URLs
  function getPhotoUrl(path: string) {
    const supabase = createClient();
    const { data } = supabase.storage
      .from("siniestro-archivos")
      .getPublicUrl(path);
    return data.publicUrl;
  }

  return (
    <div>
      {/* Back button */}
      <Link
        href="/siniestros"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition mb-4"
      >
        <ArrowLeft size={16} />
        Volver a mis siniestros
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-lg font-bold text-primary">
              {siniestro.numero_seguimiento}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {tipoSiniestroLabel(siniestro.tipo_siniestro)}
            </p>
          </div>
          <span
            className={cn(
              "text-xs font-medium px-3 py-1.5 rounded-full",
              estadoConfig.bgColor,
              estadoConfig.color
            )}
          >
            {estadoConfig.label}
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
        <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Info size={18} className="text-primary" />
          Datos del siniestro
        </h2>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Calendar size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Fecha
              </p>
              <p className="text-sm text-gray-700">
                {formatFecha(siniestro.fecha_siniestro)}
                {siniestro.hora_siniestro && ` - ${siniestro.hora_siniestro} hs`}
              </p>
            </div>
          </div>

          {siniestro.ubicacion && (
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Ubicacion
                </p>
                <p className="text-sm text-gray-700">{siniestro.ubicacion}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <FileText size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Descripcion
              </p>
              <p className="text-sm text-gray-700">{siniestro.descripcion}</p>
            </div>
          </div>

          {siniestro.compania_aseguradora && (
            <div className="flex items-start gap-3">
              <Shield size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Compania aseguradora
                </p>
                <p className="text-sm text-gray-700">
                  {siniestro.compania_aseguradora}
                </p>
                {siniestro.numero_poliza && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Poliza: {siniestro.numero_poliza}
                  </p>
                )}
              </div>
            </div>
          )}

          {(siniestro.vehiculo_marca || siniestro.vehiculo_patente) && (
            <div className="flex items-start gap-3">
              <Car size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Vehiculo
                </p>
                <p className="text-sm text-gray-700">
                  {[
                    siniestro.vehiculo_marca,
                    siniestro.vehiculo_modelo,
                    siniestro.vehiculo_anio,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                </p>
                {siniestro.vehiculo_patente && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Patente: {siniestro.vehiculo_patente}
                  </p>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
        <div className="flex items-start justify-between gap-3 mb-5">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            Seguimiento
          </h2>
          {(() => {
            const dias = Math.floor(
              (Date.now() - new Date(siniestro.created_at).getTime()) /
                (1000 * 60 * 60 * 24)
            );
            return (
              <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full whitespace-nowrap">
                {dias === 0
                  ? "Ingresado hoy"
                  : dias === 1
                  ? "Hace 1 día"
                  : `Hace ${dias} días`}
              </span>
            );
          })()}
        </div>

        <div className="relative">
          {ETAPAS_SINIESTRO.map((etapa, index) => {
            const isCompleted = index < currentEtapaIndex;
            const isCurrent = index === currentEtapaIndex;
            const isPending = index > currentEtapaIndex;
            const evento = eventos.find((ev) => ev.etapa === etapa.value);

            return (
              <div key={etapa.value} className="relative flex gap-4 pb-6 last:pb-0">
                {/* Vertical line */}
                {index < ETAPAS_SINIESTRO.length - 1 && (
                  <div
                    className={cn(
                      "absolute left-[15px] top-[30px] w-0.5 h-[calc(100%-14px)]",
                      isCompleted ? "bg-success" : isCurrent ? "bg-accent" : "bg-gray-200"
                    )}
                  />
                )}

                {/* Dot */}
                <div className="relative flex-shrink-0">
                  {isCompleted ? (
                    <div className="w-[30px] h-[30px] rounded-full bg-success flex items-center justify-center">
                      <CheckCircle2 size={18} className="text-white" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-[30px] h-[30px] rounded-full bg-accent flex items-center justify-center timeline-pulse">
                      <Circle size={12} className="text-white fill-white" />
                    </div>
                  ) : (
                    <div className="w-[30px] h-[30px] rounded-full bg-gray-200 flex items-center justify-center">
                      <Circle size={12} className="text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="pt-1 min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCompleted ? "text-gray-900" : isCurrent ? "text-accent" : "text-gray-400"
                    )}
                  >
                    {etapa.label}
                  </p>
                  <p className={cn("text-xs mt-0.5", isPending ? "text-gray-300" : "text-gray-500")}>
                    {etapa.descripcion}
                  </p>
                  {isCurrent && "empatia" in etapa && (
                    <p className="text-xs text-accent/70 mt-1.5 italic">
                      {(etapa as any).empatia}
                    </p>
                  )}
                  {evento && (
                    <p className="text-xs text-gray-400 mt-1">
                      {formatFecha(evento.fecha)}
                      {evento.descripcion &&
                        evento.descripcion !== etapa.descripcion &&
                        ` — ${evento.descripcion}`}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Photo gallery */}
      {archivos.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Camera size={18} className="text-primary" />
            Fotos y archivos
          </h2>

          <div className="grid grid-cols-3 gap-2">
            {archivos.map((archivo) => {
              const isImage = archivo.tipo_archivo.startsWith("image/");
              return isImage ? (
                <a
                  key={archivo.id}
                  href={getPhotoUrl(archivo.storage_path)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 hover:border-primary/30 transition"
                >
                  <img
                    src={getPhotoUrl(archivo.storage_path)}
                    alt={archivo.nombre_archivo}
                    className="w-full h-full object-cover"
                  />
                </a>
              ) : (
                <a
                  key={archivo.id}
                  href={getPhotoUrl(archivo.storage_path)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square rounded-xl bg-gray-50 border border-gray-200 flex flex-col items-center justify-center p-2 hover:border-primary/30 transition"
                >
                  <FileText size={24} className="text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500 text-center truncate w-full">
                    {archivo.nombre_archivo}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
