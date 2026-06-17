"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Siniestro } from "@/lib/types";
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
  AlertTriangle,
  Clock,
  User,
  Phone,
  Mail,
  CreditCard,
  ChevronRight,
  Loader2,
} from "lucide-react";

const ETAPAS_ORDER = [
  "denuncia_recibida",
  "en_revision",
  "perito_asignado",
  "peritaje_realizado",
  "resolucion_emitida",
  "caso_cerrado",
] as const;

type EstadoSiniestro = (typeof ETAPAS_ORDER)[number];

export default function AseguradoraDetallePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [compania, setCompania] = useState<string | null>(null);
  const [siniestro, setSiniestro] = useState<Siniestro | null>(null);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("aseguradora_session");
    if (!raw) {
      router.replace("/aseguradora/login");
      return;
    }
    setCompania(JSON.parse(raw).compania);

    fetch(`/api/siniestros?id=${id}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setSiniestro(Array.isArray(data) ? data[0] : data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, router]);

  async function avanzarEstado() {
    if (!siniestro) return;
    const idx = ETAPAS_ORDER.indexOf(siniestro.estado as EstadoSiniestro);
    if (idx === -1 || idx >= ETAPAS_ORDER.length - 1) return;

    const nextEstado = ETAPAS_ORDER[idx + 1];
    setAdvancing(true);

    const res = await fetch(`/api/siniestros?id=${siniestro.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nextEstado }),
    });

    if (res.ok) {
      const updated = await res.json();
      setSiniestro(updated);
    }
    setAdvancing(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!siniestro) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-3">
        <AlertTriangle size={48} className="text-warning" />
        <p className="text-gray-700 font-medium">Siniestro no encontrado</p>
        <Link href="/aseguradora" className="text-primary text-sm hover:underline">
          Volver al dashboard
        </Link>
      </div>
    );
  }

  const estadoConfig = ESTADO_CONFIG[siniestro.estado] || ESTADO_CONFIG.denuncia_recibida;
  const currentIdx = ETAPAS_ORDER.indexOf(siniestro.estado as EstadoSiniestro);
  const isCerrado = siniestro.estado === "caso_cerrado";
  const nextEtapa = !isCerrado ? ETAPAS_SINIESTRO[currentIdx + 1] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href="/aseguradora"
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <p className="text-xs text-white/60 leading-none mb-0.5">{compania}</p>
            <p className="font-semibold text-sm font-mono leading-none">
              {siniestro.numero_seguimiento}
            </p>
          </div>
          <span
            className={cn(
              "ml-auto text-xs font-medium px-3 py-1.5 rounded-full",
              estadoConfig.bgColor,
              estadoConfig.color
            )}
          >
            {estadoConfig.label}
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">

        {/* Avanzar estado — acción principal */}
        {!isCerrado && nextEtapa && (
          <div className="bg-white rounded-2xl border border-primary/20 p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Acción disponible
            </p>
            <p className="text-sm text-gray-700 mb-4">
              Avanzar al siguiente estado:{" "}
              <span className="font-semibold text-primary">{nextEtapa.label}</span>
            </p>
            <button
              onClick={avanzarEstado}
              disabled={advancing}
              className="flex items-center gap-2 bg-primary hover:bg-primary-light text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition disabled:opacity-60"
            >
              {advancing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ChevronRight size={16} />
              )}
              {advancing ? "Actualizando..." : `Marcar como: ${nextEtapa.label}`}
            </button>
          </div>
        )}

        {isCerrado && (
          <div className="bg-success/10 border border-success/20 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle2 size={20} className="text-success flex-shrink-0" />
            <p className="text-sm text-success font-medium">
              Este siniestro fue cerrado. No hay acciones pendientes.
            </p>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            Estado del expediente
          </h2>
          <div className="relative">
            {ETAPAS_SINIESTRO.map((etapa, index) => {
              const isCompleted = index < currentIdx;
              const isCurrent = index === currentIdx;
              return (
                <div key={etapa.value} className="relative flex gap-4 pb-5 last:pb-0">
                  {index < ETAPAS_SINIESTRO.length - 1 && (
                    <div
                      className={cn(
                        "absolute left-[15px] top-[30px] w-0.5 h-[calc(100%-14px)]",
                        isCompleted ? "bg-success" : isCurrent ? "bg-accent" : "bg-gray-200"
                      )}
                    />
                  )}
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
                  <div className="pt-1">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        isCompleted ? "text-gray-900" : isCurrent ? "text-accent" : "text-gray-400"
                      )}
                    >
                      {etapa.label}
                    </p>
                    <p className={cn("text-xs mt-0.5", index > currentIdx ? "text-gray-300" : "text-gray-500")}>
                      {etapa.descripcion}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Asegurado */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User size={18} className="text-primary" />
            Datos del asegurado
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <DataRow icon={<User size={16} />} label="Nombre" value={siniestro.asegurado_nombre} />
            <DataRow icon={<CreditCard size={16} />} label="DNI" value={siniestro.asegurado_dni} />
            <DataRow icon={<Phone size={16} />} label="Teléfono" value={siniestro.asegurado_telefono} />
            <DataRow icon={<Mail size={16} />} label="Email" value={siniestro.asegurado_email} />
          </div>
        </div>

        {/* Vehículo y póliza */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Car size={18} className="text-primary" />
            Vehículo y póliza
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <DataRow icon={<Car size={16} />} label="Vehículo" value={[siniestro.vehiculo_marca, siniestro.vehiculo_modelo, siniestro.vehiculo_anio].filter(Boolean).join(" ")} />
            <DataRow icon={<FileText size={16} />} label="Patente" value={siniestro.vehiculo_patente} monospace />
            <DataRow icon={<Shield size={16} />} label="Tipo de seguro" value={siniestro.tipo_seguro} />
            <DataRow icon={<CreditCard size={16} />} label="N° de póliza" value={siniestro.numero_poliza} monospace />
          </div>
        </div>

        {/* Hecho */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={18} className="text-primary" />
            Detalles del hecho
          </h2>
          <div className="space-y-4">
            <DataRow icon={<Calendar size={16} />} label="Fecha y hora" value={`${formatFecha(siniestro.fecha_siniestro)}${siniestro.hora_siniestro ? ` — ${siniestro.hora_siniestro} hs` : ""}`} />
            {siniestro.ubicacion && (
              <DataRow icon={<MapPin size={16} />} label="Ubicación" value={siniestro.ubicacion} />
            )}
            <DataRow
              icon={<FileText size={16} />}
              label="Tipo de siniestro"
              value={`${tipoSiniestroLabel(siniestro.tipo_siniestro)}${siniestro.subtipo_choque ? ` (${siniestro.subtipo_choque})` : ""}`}
            />
            {siniestro.descripcion && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Descripción</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 leading-relaxed">
                  {siniestro.descripcion}
                </p>
              </div>
            )}
            <div className="flex gap-4">
              <div className={cn("flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full", siniestro.hay_heridos ? "bg-danger/10 text-danger" : "bg-success/10 text-success")}>
                {siniestro.hay_heridos ? "Hay heridos" : "Sin heridos"}
              </div>
              <div className={cn("flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600")}>
                {siniestro.en_lugar_hecho ? "Estaba en el lugar" : "No estaba en el lugar"}
              </div>
            </div>
          </div>
        </div>

        {/* Tercero */}
        {(siniestro.tercero_nombre || siniestro.tercero_patente) && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={18} className="text-warning" />
              Tercero involucrado
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <DataRow icon={<User size={16} />} label="Nombre" value={siniestro.tercero_nombre} />
              <DataRow icon={<CreditCard size={16} />} label="DNI" value={siniestro.tercero_dni} />
              <DataRow icon={<Car size={16} />} label="Patente" value={siniestro.tercero_patente} monospace />
              <DataRow icon={<Shield size={16} />} label="Aseguradora" value={siniestro.tercero_aseguradora} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function DataRow({
  icon,
  label,
  value,
  monospace,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | number | null;
  monospace?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
        <p className={cn("text-sm text-gray-800 mt-0.5", monospace && "font-mono")}>
          {value}
        </p>
      </div>
    </div>
  );
}
