"use client";

import { useRef, useState, useMemo } from "react";
import {
  Camera,
  Upload,
  X,
  ImagePlus,
  Car,
  FileText,
  Eye,
  Users,
} from "lucide-react";
import type { WizardData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Paso5FotosProps {
  data: WizardData;
  onUpdate: (data: Partial<WizardData>) => void;
}

const SUGERENCIAS_FOTOS = [
  { icon: <Car className="w-5 h-5" />, text: "Daños a tu vehículo (todos los ángulos)" },
  { icon: <Car className="w-5 h-5" />, text: "Daños al otro vehículo" },
  { icon: <FileText className="w-5 h-5" />, text: "Patentes de los vehículos involucrados" },
  { icon: <Eye className="w-5 h-5" />, text: "Vista panorámica del lugar" },
  { icon: <FileText className="w-5 h-5" />, text: "Señalización y semáforos cercanos" },
];

const MAX_FOTOS = 10;

export default function Paso5Fotos({ data, onUpdate }: Paso5FotosProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const previews = useMemo(() => {
    return data.fotos.map((file) => URL.createObjectURL(file));
  }, [data.fotos]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const remaining = MAX_FOTOS - data.fotos.length;
    const newFiles = imageFiles.slice(0, remaining);
    if (newFiles.length > 0) {
      onUpdate({ fotos: [...data.fotos, ...newFiles] });
    }
  };

  const removePhoto = (index: number) => {
    const updated = data.fotos.filter((_, i) => i !== index);
    onUpdate({ fotos: updated });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Fotos y evidencia</h2>
        <p className="text-gray-500 text-sm">
          Subí fotos del siniestro e ingresá los datos del tercero
        </p>
      </div>

      {/* Sugerencias */}
      <div className="bg-accent/5 border-2 border-accent/20 rounded-2xl p-4 space-y-3">
        <p className="text-sm font-semibold text-accent">Fotos recomendadas:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SUGERENCIAS_FOTOS.map((sug, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-accent/60">{sug.icon}</span>
              {sug.text}
            </div>
          ))}
        </div>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 bg-gray-50 hover:border-primary hover:bg-primary/5",
          data.fotos.length >= MAX_FOTOS && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={data.fotos.length >= MAX_FOTOS}
        />
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            {dragActive ? (
              <ImagePlus className="w-7 h-7 text-primary" />
            ) : (
              <Upload className="w-7 h-7 text-primary" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">
              {data.fotos.length >= MAX_FOTOS
                ? "Máximo de fotos alcanzado"
                : "Arrastrá fotos o tocá para subir"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {data.fotos.length}/{MAX_FOTOS} fotos - JPG, PNG
            </p>
          </div>
          <button
            type="button"
            disabled={data.fotos.length >= MAX_FOTOS}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            <Camera className="w-4 h-4" />
            Elegir fotos
          </button>
        </div>
      </div>

      {/* Preview grid */}
      {data.fotos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {previews.map((src, i) => (
            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
              <img
                src={src}
                alt={`Foto ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-danger text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-md">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Datos del tercero */}
      <div className="space-y-4 bg-white border-2 border-gray-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-gray-900">Datos del tercero (opcional)</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Nombre</label>
            <input
              type="text"
              value={data.tercero_nombre}
              onChange={(e) => onUpdate({ tercero_nombre: e.target.value })}
              placeholder="Nombre del otro conductor"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">DNI</label>
            <input
              type="text"
              value={data.tercero_dni}
              onChange={(e) => onUpdate({ tercero_dni: e.target.value })}
              placeholder="DNI del tercero"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Patente</label>
            <input
              type="text"
              value={data.tercero_patente}
              onChange={(e) =>
                onUpdate({ tercero_patente: e.target.value.toUpperCase() })
              }
              placeholder="Patente del otro vehículo"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white uppercase"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Aseguradora</label>
            <input
              type="text"
              value={data.tercero_aseguradora}
              onChange={(e) => onUpdate({ tercero_aseguradora: e.target.value })}
              placeholder="Aseguradora del tercero"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
