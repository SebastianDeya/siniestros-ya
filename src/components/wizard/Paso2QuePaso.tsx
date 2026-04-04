"use client";

import {
  Car,
  ShieldOff,
  Flame,
  Users,
  CloudRain,
  Droplets,
  HelpCircle,
  Minus,
  Plus,
  KeyRound,
} from "lucide-react";
import type { WizardData } from "@/lib/types";
import { TIPOS_SINIESTRO, SUBTIPOS_CHOQUE } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Paso2QuePasoProps {
  data: WizardData;
  onUpdate: (data: Partial<WizardData>) => void;
}

const ICONOS_TIPO: Record<string, React.ReactNode> = {
  choque: <Car className="w-6 h-6" />,
  robo_total: <ShieldOff className="w-6 h-6" />,
  robo_parcial: <KeyRound className="w-6 h-6" />,
  incendio: <Flame className="w-6 h-6" />,
  dano_terceros: <Users className="w-6 h-6" />,
  granizo: <CloudRain className="w-6 h-6" />,
  inundacion: <Droplets className="w-6 h-6" />,
  otro: <HelpCircle className="w-6 h-6" />,
};

export default function Paso2QuePaso({ data, onUpdate }: Paso2QuePasoProps) {
  const handleCantidad = (delta: number) => {
    const next = Math.max(1, Math.min(10, data.cantidad_vehiculos + delta));
    onUpdate({ cantidad_vehiculos: next });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">¿Qué pasó?</h2>
        <p className="text-gray-500 text-sm">Seleccioná el tipo de siniestro y danos los detalles</p>
      </div>

      {/* Tipo de siniestro */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">Tipo de siniestro</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TIPOS_SINIESTRO.map((tipo) => (
            <button
              key={tipo.value}
              type="button"
              onClick={() =>
                onUpdate({
                  tipo_siniestro: tipo.value,
                  subtipo_choque: tipo.value !== "choque" ? "" : data.subtipo_choque,
                })
              }
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 text-center",
                data.tipo_siniestro === tipo.value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              {ICONOS_TIPO[tipo.value]}
              <span className="text-xs font-semibold">{tipo.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Subtipo choque */}
      {data.tipo_siniestro === "choque" && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">Tipo de choque</label>
          <div className="flex flex-wrap gap-2">
            {SUBTIPOS_CHOQUE.map((sub) => (
              <button
                key={sub.value}
                type="button"
                onClick={() => onUpdate({ subtipo_choque: sub.value })}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200",
                  data.subtipo_choque === sub.value
                    ? "border-accent bg-accent/5 text-accent"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                )}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Descripción */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Descripción de lo ocurrido
        </label>
        <textarea
          value={data.descripcion}
          onChange={(e) => onUpdate({ descripcion: e.target.value })}
          placeholder="Contanos qué pasó con tus palabras. Ej: Iba por Av. Libertador y un auto se pasó el semáforo en rojo impactando el lateral derecho de mi vehículo..."
          rows={4}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white resize-none"
        />
      </div>

      {/* Cantidad de vehículos */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Cantidad de vehículos involucrados
        </label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => handleCantidad(-1)}
            disabled={data.cantidad_vehiculos <= 1}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-colors",
              data.cantidad_vehiculos <= 1
                ? "border-gray-100 text-gray-300 cursor-not-allowed"
                : "border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
            )}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-2xl font-bold text-gray-900 w-8 text-center">
            {data.cantidad_vehiculos}
          </span>
          <button
            type="button"
            onClick={() => handleCantidad(1)}
            disabled={data.cantidad_vehiculos >= 10}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-colors",
              data.cantidad_vehiculos >= 10
                ? "border-gray-100 text-gray-300 cursor-not-allowed"
                : "border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
            )}
          >
            <Plus className="w-4 h-4" />
          </button>
          {data.cantidad_vehiculos >= 5 && (
            <span className="text-xs text-gray-400">5+</span>
          )}
        </div>
      </div>
    </div>
  );
}
