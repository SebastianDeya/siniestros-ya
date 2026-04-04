"use client";

import { useState, useCallback } from "react";
import {
  MapPin,
  AlertTriangle,
  Phone,
  Navigation,
  Loader2,
  Calendar,
  Clock,
} from "lucide-react";
import type { WizardData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Paso1SituacionProps {
  data: WizardData;
  onUpdate: (data: Partial<WizardData>) => void;
}

export default function Paso1Situacion({ data, onUpdate }: Paso1SituacionProps) {
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const captureLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError("Tu navegador no soporta geolocalización. Ingresá la dirección manualmente.");
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onUpdate({
          ubicacion_lat: position.coords.latitude,
          ubicacion_lng: position.coords.longitude,
          ubicacion: `Lat: ${position.coords.latitude.toFixed(6)}, Lng: ${position.coords.longitude.toFixed(6)}`,
        });
        setGeoLoading(false);
      },
      (error) => {
        const messages: Record<number, string> = {
          1: "Permiso de ubicación denegado. Ingresá la dirección manualmente.",
          2: "No se pudo determinar tu ubicación. Ingresá la dirección manualmente.",
          3: "La solicitud de ubicación expiró. Intentá de nuevo o ingresá la dirección manualmente.",
        };
        setGeoError(messages[error.code] || "Error desconocido al obtener la ubicación.");
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [onUpdate]);

  const handleEnLugarChange = (value: boolean) => {
    onUpdate({ en_lugar_hecho: value });
    if (value) {
      captureLocation();
      const now = new Date();
      onUpdate({
        en_lugar_hecho: value,
        fecha_siniestro: now.toISOString().split("T")[0],
        hora_siniestro: now.toTimeString().slice(0, 5),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Situación inmediata</h2>
        <p className="text-gray-500 text-sm">Contanos dónde estás y qué pasó</p>
      </div>

      {/* En el lugar */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">
          ¿Estás en el lugar del hecho?
        </label>
        <div className="flex gap-3">
          {[
            { value: true, label: "Sí, estoy acá" },
            { value: false, label: "No, estoy en otro lado" },
          ].map((option) => (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => handleEnLugarChange(option.value)}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl text-sm font-semibold border-2 transition-all duration-200",
                data.en_lugar_hecho === option.value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ubicación */}
      {data.en_lugar_hecho !== null && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            <MapPin className="w-4 h-4 inline mr-1" />
            {data.en_lugar_hecho ? "Tu ubicación actual" : "Dirección del siniestro"}
          </label>

          {data.en_lugar_hecho && geoLoading && (
            <div className="flex items-center gap-2 text-accent text-sm p-3 bg-accent/5 rounded-xl">
              <Loader2 className="w-4 h-4 animate-spin" />
              Obteniendo tu ubicación...
            </div>
          )}

          {data.en_lugar_hecho && geoError && (
            <div className="text-sm text-warning bg-warning-light p-3 rounded-xl">
              {geoError}
            </div>
          )}

          {data.en_lugar_hecho && data.ubicacion_lat && data.ubicacion_lng && (
            <div className="flex items-center gap-2 text-success text-sm p-3 bg-success-light rounded-xl">
              <Navigation className="w-4 h-4" />
              Ubicación capturada correctamente
            </div>
          )}

          <input
            type="text"
            value={data.ubicacion}
            onChange={(e) => onUpdate({ ubicacion: e.target.value })}
            placeholder={
              data.en_lugar_hecho
                ? "Se completará automáticamente o ingresá la dirección"
                : "Ej: Av. Corrientes 1234, CABA"
            }
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white"
          />

          {data.en_lugar_hecho && !geoLoading && (
            <button
              type="button"
              onClick={captureLocation}
              className="text-sm text-accent hover:text-accent-light font-medium flex items-center gap-1"
            >
              <Navigation className="w-3.5 h-3.5" />
              Reintentar obtener ubicación
            </button>
          )}
        </div>
      )}

      {/* Heridos */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">
          ¿Hay personas heridas?
        </label>
        <div className="flex gap-3">
          {[
            { value: true, label: "Sí" },
            { value: false, label: "No" },
          ].map((option) => (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onUpdate({ hay_heridos: option.value })}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl text-sm font-semibold border-2 transition-all duration-200",
                data.hay_heridos === option.value
                  ? option.value
                    ? "border-danger bg-danger/5 text-danger"
                    : "border-success bg-success/5 text-success"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alert heridos */}
      {data.hay_heridos === true && (
        <div className="bg-danger/5 border-2 border-danger rounded-2xl p-5 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-danger shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-danger text-base">Atención: hay personas heridas</p>
              <p className="text-sm text-gray-700 mt-1">
                Si hay heridos, llam&aacute; inmediatamente al <strong>107 (SAME)</strong> o al{" "}
                <strong>911</strong>. No muevas a las personas heridas salvo que est&eacute;n en
                peligro inmediato.
              </p>
            </div>
          </div>
          <a
            href="tel:107"
            className="flex items-center justify-center gap-2 w-full bg-danger text-white py-3 px-4 rounded-xl font-bold text-base hover:bg-danger/90 transition-colors"
          >
            <Phone className="w-5 h-5" />
            Llamar al 107 (SAME)
          </a>
        </div>
      )}

      {/* Fecha y hora */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            <Calendar className="w-4 h-4 inline mr-1" />
            Fecha del siniestro
          </label>
          <input
            type="date"
            value={data.fecha_siniestro}
            onChange={(e) => onUpdate({ fecha_siniestro: e.target.value })}
            max={new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            <Clock className="w-4 h-4 inline mr-1" />
            Hora aproximada
          </label>
          <input
            type="time"
            value={data.hora_siniestro}
            onChange={(e) => onUpdate({ hora_siniestro: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white"
          />
        </div>
      </div>
    </div>
  );
}
