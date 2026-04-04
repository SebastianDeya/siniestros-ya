"use client";

import { Building2, FileText, Car, User } from "lucide-react";
import type { WizardData } from "@/lib/types";
import { COMPANIAS_ASEGURADORAS, TIPOS_SEGURO } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Paso4DatosProps {
  data: WizardData;
  onUpdate: (data: Partial<WizardData>) => void;
}

export default function Paso4Datos({ data, onUpdate }: Paso4DatosProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Datos del seguro y vehículo</h2>
        <p className="text-gray-500 text-sm">Ingresá la información de tu póliza</p>
      </div>

      {/* Datos del seguro */}
      <div className="space-y-4 bg-white border-2 border-gray-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-gray-900">Datos del seguro</h3>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Compañía aseguradora
          </label>
          <select
            value={data.compania_aseguradora}
            onChange={(e) => onUpdate({ compania_aseguradora: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white appearance-none"
          >
            <option value="">Seleccioná tu aseguradora</option>
            {COMPANIAS_ASEGURADORAS.map((comp) => (
              <option key={comp} value={comp}>
                {comp}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            <FileText className="w-4 h-4 inline mr-1" />
            Número de póliza
          </label>
          <input
            type="text"
            value={data.numero_poliza}
            onChange={(e) => onUpdate({ numero_poliza: e.target.value })}
            placeholder="Ej: 12345678"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Tipo de seguro</label>
          <div className="flex flex-wrap gap-2">
            {TIPOS_SEGURO.map((tipo) => (
              <button
                key={tipo.value}
                type="button"
                onClick={() => onUpdate({ tipo_seguro: tipo.value })}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200",
                  data.tipo_seguro === tipo.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                )}
              >
                {tipo.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Datos del vehículo - solo si automotor */}
      {data.tipo_seguro === "automotor" && (
        <div className="space-y-4 bg-white border-2 border-gray-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Car className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-gray-900">Datos del vehículo</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Marca</label>
              <input
                type="text"
                value={data.vehiculo_marca}
                onChange={(e) => onUpdate({ vehiculo_marca: e.target.value })}
                placeholder="Ej: Toyota"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Modelo</label>
              <input
                type="text"
                value={data.vehiculo_modelo}
                onChange={(e) => onUpdate({ vehiculo_modelo: e.target.value })}
                placeholder="Ej: Corolla"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Año</label>
              <input
                type="number"
                value={data.vehiculo_anio}
                onChange={(e) => onUpdate({ vehiculo_anio: e.target.value })}
                placeholder="Ej: 2022"
                min="1950"
                max={new Date().getFullYear() + 1}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Patente</label>
              <input
                type="text"
                value={data.vehiculo_patente}
                onChange={(e) =>
                  onUpdate({ vehiculo_patente: e.target.value.toUpperCase() })
                }
                placeholder="Ej: AB123CD"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white uppercase"
              />
            </div>
          </div>
        </div>
      )}

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
