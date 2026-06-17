"use client";

import { useMemo } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  AlertTriangle,
  Car,
  FileText,
  User,
  Camera,
  Users,
  Pencil,
  CheckCircle2,
} from "lucide-react";
import type { WizardData } from "@/lib/types";
import { TIPOS_SINIESTRO, SUBTIPOS_CHOQUE, TIPOS_SEGURO } from "@/lib/constants";
import { formatFecha, formatHora } from "@/lib/utils";

interface Paso6ConfirmacionProps {
  data: WizardData;
  onGoToStep: (step: number) => void;
}

function SectionHeader({
  icon,
  title,
  step,
  onEdit,
}: {
  icon: React.ReactNode;
  title: string;
  step: number;
  onEdit: (step: number) => void;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-bold text-gray-900">{title}</h3>
      </div>
      <button
        type="button"
        onClick={() => onEdit(step)}
        className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-light transition-colors"
      >
        <Pencil className="w-3.5 h-3.5" />
        Editar
      </button>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string | undefined | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide shrink-0">
        {label}
      </span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}

export default function Paso6Confirmacion({ data, onGoToStep }: Paso6ConfirmacionProps) {
  const tipoLabel =
    TIPOS_SINIESTRO.find((t) => t.value === data.tipo_siniestro)?.label || data.tipo_siniestro;
  const subtipoLabel =
    SUBTIPOS_CHOQUE.find((s) => s.value === data.subtipo_choque)?.label || "";
  const tipoSeguroLabel =
    TIPOS_SEGURO.find((t) => t.value === data.tipo_seguro)?.label || "";

  const fotoPreviews = useMemo(() => {
    return data.fotos.map((file) => URL.createObjectURL(file));
  }, [data.fotos]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Confirmación</h2>
        <p className="text-gray-500 text-sm">
          Revisá que todos los datos sean correctos antes de enviar
        </p>
      </div>

      {/* Paso 1 - Situación */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 space-y-2">
        <SectionHeader
          icon={<MapPin className="w-5 h-5 text-primary" />}
          title="Situación"
          step={1}
          onEdit={onGoToStep}
        />
        <DataRow
          label="En el lugar"
          value={
            data.en_lugar_hecho === true
              ? "Sí"
              : data.en_lugar_hecho === false
              ? "No"
              : "No especificado"
          }
        />
        <DataRow label="Ubicación" value={data.ubicacion} />
        <DataRow
          label="Fecha"
          value={data.fecha_siniestro ? formatFecha(data.fecha_siniestro) : ""}
        />
        <DataRow
          label="Hora"
          value={data.hora_siniestro ? formatHora(data.hora_siniestro) : ""}
        />
      </div>

      {/* Paso 2 - Qué pasó */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 space-y-2">
        <SectionHeader
          icon={<Car className="w-5 h-5 text-primary" />}
          title="¿Qué pasó?"
          step={2}
          onEdit={onGoToStep}
        />
        <DataRow label="Tipo" value={tipoLabel} />
        {subtipoLabel && <DataRow label="Subtipo" value={subtipoLabel} />}
        <DataRow label="Descripción" value={data.descripcion} />
        <DataRow label="Vehículos" value={String(data.cantidad_vehiculos)} />
      </div>

      {/* Paso 3 - Guía */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 space-y-2">
        <SectionHeader
          icon={<CheckCircle2 className="w-5 h-5 text-primary" />}
          title="Guía"
          step={3}
          onEdit={onGoToStep}
        />
        <DataRow
          label="Recomendaciones leídas"
          value={data.guia_leida ? "Sí" : "No"}
        />
      </div>

      {/* Paso 4 - Datos */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 space-y-2">
        <SectionHeader
          icon={<FileText className="w-5 h-5 text-primary" />}
          title="Seguro y vehículo"
          step={4}
          onEdit={onGoToStep}
        />
        <DataRow label="Aseguradora" value={data.compania_aseguradora} />
        <DataRow label="Póliza" value={data.numero_poliza} />
        <DataRow label="Tipo de seguro" value={tipoSeguroLabel} />
        {data.tipo_seguro === "automotor" && (
          <>
            <DataRow
              label="Vehículo"
              value={
                [data.vehiculo_marca, data.vehiculo_modelo, data.vehiculo_anio]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
            />
            <DataRow label="Patente" value={data.vehiculo_patente} />
          </>
        )}
        <div className="border-t border-gray-100 my-2 pt-2">
          <div className="flex items-center gap-1 mb-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-500 uppercase">Asegurado</span>
          </div>
          <DataRow label="Nombre" value={data.asegurado_nombre} />
          <DataRow label="DNI" value={data.asegurado_dni} />
          <DataRow label="Teléfono" value={data.asegurado_telefono} />
          <DataRow label="Email" value={data.asegurado_email} />
        </div>
      </div>

      {/* Paso 5 - Fotos y tercero */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 space-y-3">
        <SectionHeader
          icon={<Camera className="w-5 h-5 text-primary" />}
          title="Fotos y evidencia"
          step={5}
          onEdit={onGoToStep}
        />

        {data.fotos.length > 0 ? (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {fotoPreviews.map((src, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl overflow-hidden border border-gray-200"
              >
                <img
                  src={src}
                  alt={`Foto ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No se subieron fotos</p>
        )}

        {(data.tercero_nombre || data.tercero_dni || data.tercero_patente || data.tercero_aseguradora) && (
          <div className="border-t border-gray-100 pt-2 space-y-1">
            <div className="flex items-center gap-1 mb-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-semibold text-gray-500 uppercase">Tercero</span>
            </div>
            <DataRow label="Nombre" value={data.tercero_nombre} />
            <DataRow label="DNI" value={data.tercero_dni} />
            <DataRow label="Patente" value={data.tercero_patente} />
            <DataRow label="Aseguradora" value={data.tercero_aseguradora} />
          </div>
        )}
      </div>

      {/* Banner de confirmación */}
      <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-5 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-gray-700">
          Revisá los datos antes de enviar. Una vez enviada la denuncia, podrás seguir el estado
          desde tu panel.
        </p>
      </div>
    </div>
  );
}
