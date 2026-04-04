"use client";

import { CheckCircle2, XCircle, BookOpen } from "lucide-react";
import type { WizardData } from "@/lib/types";
import { GUIA_QUE_HACER, GUIA_QUE_NO_HACER } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Paso3GuiaProps {
  data: WizardData;
  onUpdate: (data: Partial<WizardData>) => void;
}

export default function Paso3Guia({ data, onUpdate }: Paso3GuiaProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Guía de acción</h2>
        <p className="text-gray-500 text-sm">
          Seguí estas recomendaciones para proteger tus derechos
        </p>
      </div>

      {/* Qué hacer */}
      <div className="bg-success/5 border-2 border-success/30 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-success" />
          <h3 className="font-bold text-success text-base">Qué hacer</h3>
        </div>
        <ul className="space-y-3">
          {GUIA_QUE_HACER.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                {i + 1}
              </span>
              <span className="text-sm text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Qué NO hacer */}
      <div className="bg-danger/5 border-2 border-danger/30 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <XCircle className="w-5 h-5 text-danger" />
          <h3 className="font-bold text-danger text-base">Qué NO hacer</h3>
        </div>
        <ul className="space-y-3">
          {GUIA_QUE_NO_HACER.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-danger/60 shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Checkbox confirmación */}
      <div
        className={cn(
          "rounded-2xl border-2 p-5 transition-all duration-200",
          data.guia_leida
            ? "border-primary bg-primary/5"
            : "border-gray-200 bg-white"
        )}
      >
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.guia_leida}
            onChange={(e) => onUpdate({ guia_leida: e.target.checked })}
            className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
          />
          <div>
            <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Leí y entendí las recomendaciones
            </span>
            <p className="text-xs text-gray-500 mt-1">
              Tenés que confirmar que leíste la guía para poder continuar
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
