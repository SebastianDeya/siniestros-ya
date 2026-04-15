"use client";

import { useEffect, useState } from "react";
import { Building2, User, CheckCircle2, ExternalLink, Loader2 } from "lucide-react";
import type { WizardData, Aseguradora } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Paso4DatosProps {
  data: WizardData;
  onUpdate: (data: Partial<WizardData>) => void;
}

export default function Paso4Datos({ data, onUpdate }: Paso4DatosProps) {
  const [aseguradoras, setAseguradoras] = useState<Aseguradora[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/aseguradoras")
      .then((r) => r.json())
      .then((list) => {
        setAseguradoras(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function selectAseguradora(aseg: Aseguradora) {
    onUpdate({
      aseguradora_id: aseg.id,
      compania_aseguradora: aseg.compania_aseguradora,
      numero_poliza: aseg.numero_poliza,
      tipo_seguro: aseg.tipo_seguro,
      vehiculo_marca: aseg.vehiculo_marca ?? "",
      vehiculo_modelo: aseg.vehiculo_modelo ?? "",
      vehiculo_anio: aseg.vehiculo_anio ? String(aseg.vehiculo_anio) : "",
      vehiculo_patente: aseg.vehiculo_patente ?? "",
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Datos del seguro y vehículo</h2>
        <p className="text-gray-500 text-sm">Seleccioná la póliza con la que vas a hacer la denuncia</p>
      </div>

      {/* Selector de aseguradora */}
      <div className="space-y-3 bg-white border-2 border-gray-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-gray-900">Tu aseguradora</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : aseguradoras.length === 0 ? (
          <div className="text-center py-6 space-y-3">
            <Building2 className="w-10 h-10 mx-auto text-gray-300" />
            <div>
              <p className="text-sm font-semibold text-gray-700">No tenés aseguradoras guardadas</p>
              <p className="text-xs text-gray-400 mt-1">
                Guardá tus pólizas en el perfil para seleccionarlas acá
              </p>
            </div>
            <a
              href="/perfil"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary-light transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Ir a mi perfil
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            {aseguradoras.map((aseg) => {
              const selected = data.aseguradora_id === aseg.id;
              return (
                <button
                  key={aseg.id}
                  type="button"
                  onClick={() => selectAseguradora(aseg)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                    selected
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{aseg.alias}</p>
                      <p className="text-sm text-gray-600">{aseg.compania_aseguradora}</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                        <span className="text-xs text-gray-500">Póliza: {aseg.numero_poliza}</span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-500 capitalize">{aseg.tipo_seguro}</span>
                        {aseg.vehiculo_patente && (
                          <>
                            <span className="text-xs text-gray-400">·</span>
                            <span className="text-xs text-gray-500 font-mono">{aseg.vehiculo_patente}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {selected && (
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Datos del asegurado */}
      <div className="space-y-4 bg-white border-2 border-gray-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-gray-900">Datos del asegurado</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700">Nombre completo</label>
            <input
              type="text"
              value={data.asegurado_nombre}
              onChange={(e) => onUpdate({ asegurado_nombre: e.target.value })}
              placeholder="Ej: Juan Pérez"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">DNI</label>
            <input
              type="text"
              value={data.asegurado_dni}
              onChange={(e) => onUpdate({ asegurado_dni: e.target.value })}
              placeholder="Ej: 30123456"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Teléfono</label>
            <input
              type="tel"
              value={data.asegurado_telefono}
              onChange={(e) => onUpdate({ asegurado_telefono: e.target.value })}
              placeholder="Ej: 11 2345-6789"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              value={data.asegurado_email}
              onChange={(e) => onUpdate({ asegurado_email: e.target.value })}
              placeholder="Ej: juan@email.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
