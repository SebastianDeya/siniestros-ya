"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Car, User, Shield, CreditCard, Search } from "lucide-react";
import type { WizardData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Paso4DatosProps {
  data: WizardData;
  onUpdate: (data: Partial<WizardData>) => void;
}

type Poliza = {
  id: string;
  compania: string;
  patente: string;
  numero_poliza: string;
  tipo_seguro: string;
  vehiculo_marca: string;
  vehiculo_modelo: string;
  vehiculo_anio: number;
  asegurado_nombre: string;
  asegurado_dni: string;
  asegurado_telefono: string;
  asegurado_email: string;
};

async function fetchPolizasByDni(dni: string): Promise<Poliza[] | null> {
  const res = await fetch(`/api/polizas?dni=${encodeURIComponent(dni)}`);
  if (!res.ok) return null;
  const data = await res.json();
  if (!data) return null;
  return Array.isArray(data) ? data : [data];
}

function applyPoliza(poliza: Poliza, onUpdate: Paso4DatosProps["onUpdate"]) {
  onUpdate({
    vehiculo_patente: poliza.patente,
    compania_aseguradora: poliza.compania,
    numero_poliza: poliza.numero_poliza,
    tipo_seguro: poliza.tipo_seguro as any,
    vehiculo_marca: poliza.vehiculo_marca,
    vehiculo_modelo: poliza.vehiculo_modelo,
    vehiculo_anio: String(poliza.vehiculo_anio),
    asegurado_nombre: poliza.asegurado_nombre,
    asegurado_dni: poliza.asegurado_dni,
    asegurado_telefono: poliza.asegurado_telefono,
    asegurado_email: poliza.asegurado_email,
  });
}

export default function Paso4Datos({ data, onUpdate }: Paso4DatosProps) {
  const [estado, setEstado] = useState<"loading" | "selecting" | "found" | "notfound" | "nodns">("loading");
  const [polizas, setPolizas] = useState<Poliza[]>([]);
  const [poliza, setPoliza] = useState<Poliza | null>(null);
  const [dniManual, setDniManual] = useState("");
  const [buscandoManual, setBuscandoManual] = useState(false);

  useEffect(() => {
    const dni = localStorage.getItem("user_dni");
    if (!dni) { setEstado("nodns"); return; }
    fetchPolizasByDni(dni).then((found) => {
      if (!found || found.length === 0) { setEstado("notfound"); return; }
      if (found.length === 1) {
        setPoliza(found[0]);
        applyPoliza(found[0], onUpdate);
        setEstado("found");
      } else {
        setPolizas(found);
        setEstado("selecting");
      }
    });
  }, []);

  function seleccionarPoliza(p: Poliza) {
    setPoliza(p);
    applyPoliza(p, onUpdate);
    setEstado("found");
  }

  async function buscarManual() {
    if (!dniManual.trim()) return;
    setBuscandoManual(true);
    const found = await fetchPolizasByDni(dniManual.trim());
    if (!found || found.length === 0) {
      setEstado("notfound");
    } else if (found.length === 1) {
      setPoliza(found[0]);
      applyPoliza(found[0], onUpdate);
      setEstado("found");
    } else {
      setPolizas(found);
      setEstado("selecting");
    }
    setBuscandoManual(false);
  }

  if (estado === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-gray-500">Buscando tu póliza...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Datos del seguro</h2>
        <p className="text-gray-500 text-sm">
          Buscamos tu póliza automáticamente usando el DNI de tu perfil.
        </p>
      </div>

      {/* Múltiples pólizas — selector */}
      {estado === "selecting" && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700">
            Encontramos {polizas.length} pólizas asociadas a tu DNI. ¿Con cuál querés hacer la denuncia?
          </p>
          {polizas.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => seleccionarPoliza(p)}
              className="w-full text-left p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-primary hover:bg-primary/5 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-gray-900">{p.compania}</p>
                  <p className="text-sm text-gray-600">
                    {p.vehiculo_marca} {p.vehiculo_modelo} {p.vehiculo_anio}
                  </p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-gray-400 font-mono">{p.patente}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-400">Póliza {p.numero_poliza}</span>
                  </div>
                </div>
                <Car className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Póliza encontrada */}
      {estado === "found" && poliza && (
        <>
          <div className="border-2 border-success/30 bg-success/5 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-success font-semibold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              Póliza encontrada
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <DataField icon={<Shield className="w-3.5 h-3.5" />} label="Compañía" value={poliza.compania} />
              <DataField icon={<CreditCard className="w-3.5 h-3.5" />} label="N° póliza" value={poliza.numero_poliza} mono />
              <DataField icon={<Car className="w-3.5 h-3.5" />} label="Vehículo" value={`${poliza.vehiculo_marca} ${poliza.vehiculo_modelo} ${poliza.vehiculo_anio}`} />
              <DataField icon={<Car className="w-3.5 h-3.5" />} label="Patente" value={poliza.patente} mono />
            </div>
          </div>

          {/* Datos del asegurado editables */}
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-gray-900">Confirmá tus datos</h3>
              <span className="text-xs text-gray-400">Podés editarlos si es necesario</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700">Nombre completo</label>
                <input type="text" value={data.asegurado_nombre}
                  onChange={(e) => onUpdate({ asegurado_nombre: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">DNI</label>
                <input type="text" value={data.asegurado_dni}
                  onChange={(e) => onUpdate({ asegurado_dni: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Teléfono</label>
                <input type="tel" value={data.asegurado_telefono}
                  onChange={(e) => onUpdate({ asegurado_telefono: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700">Email</label>
                <input type="email" value={data.asegurado_email}
                  onChange={(e) => onUpdate({ asegurado_email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white" />
              </div>
            </div>
          </div>
        </>
      )}

      {/* No encontrada o sin DNI en perfil — búsqueda manual */}
      {(estado === "notfound" || estado === "nodns") && (
        <div className="space-y-4">
          <div className="border-2 border-warning/30 bg-warning/5 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-warning">
                {estado === "nodns"
                  ? "No tenés DNI guardado en tu perfil"
                  : "No encontramos póliza para tu DNI"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {estado === "nodns"
                  ? "Guardá tu DNI en el perfil para que lo busquemos automáticamente, o ingresalo acá."
                  : "Verificá que tu DNI sea correcto en el perfil, o ingresá uno diferente acá."}
              </p>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-100 rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">Buscar por DNI</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={dniManual}
                onChange={(e) => setDniManual(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && buscarManual()}
                placeholder="Ej: 46003134"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={buscarManual}
                disabled={!dniManual.trim() || buscandoManual}
                className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-50"
              >
                {buscandoManual ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Buscar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DataField({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-1.5">
      <span className="text-gray-400 mt-0.5">{icon}</span>
      <div>
        <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
        <p className={cn("text-xs text-gray-800 font-medium", mono && "font-mono")}>{value}</p>
      </div>
    </div>
  );
}
