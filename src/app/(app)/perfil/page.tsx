"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { User, Save, Loader2, CheckCircle2, Shield, Car, CreditCard } from "lucide-react";

interface ProfileData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  dni: string;
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
};

export default function PerfilPage() {
  const [profile, setProfile] = useState<ProfileData>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    dni: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [polizas, setPolizas] = useState<Poliza[]>([]);
  const [loadingPolizas, setLoadingPolizas] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();

      const nombre = data?.nombre || user.user_metadata?.nombre || "";
      const apellido = data?.apellido || user.user_metadata?.apellido || "";
      const dni = data?.dni || "";

      setProfile({ nombre, apellido, email: data?.email || user.email || "", telefono: data?.telefono || "", dni });

      if (dni) cargarPolizas(dni, nombre, apellido);
      setLoading(false);
    }
    load();
  }, []);

  function cargarPolizas(dni: string, nombre: string, apellido: string) {
    setLoadingPolizas(true);
    fetch(`/api/polizas?dni=${encodeURIComponent(dni)}`)
      .then((r) => r.json())
      .then((data) => {
        const todas: any[] = Array.isArray(data) ? data : data ? [data] : [];
        const nombreCompleto = `${nombre} ${apellido}`.trim().toLowerCase();
        const filtradas = todas.filter(
          (p) => p.asegurado_nombre?.trim().toLowerCase() === nombreCompleto
        );
        setPolizas(filtradas);
        setLoadingPolizas(false);
      })
      .catch(() => setLoadingPolizas(false));
  }

  async function handleSave(e: React.SyntheticEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        nombre: profile.nombre,
        apellido: profile.apellido,
        telefono: profile.telefono || null,
        dni: profile.dni || null,
        email: profile.email || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    setSaving(false);

    if (updateError) {
      setError("No se pudo guardar. Intenta de nuevo.");
    } else {
      if (profile.dni) {
        localStorage.setItem("user_dni", profile.dni.trim());
        cargarPolizas(profile.dni.trim(), profile.nombre, profile.apellido);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  function handleChange(field: keyof ProfileData, value: string) {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const fields: {
    key: keyof ProfileData;
    label: string;
    type: string;
    placeholder: string;
    readOnly?: boolean;
  }[] = [
    { key: "nombre", label: "Nombre", type: "text", placeholder: "Tu nombre" },
    { key: "apellido", label: "Apellido", type: "text", placeholder: "Tu apellido" },
    { key: "email", label: "Email", type: "email", placeholder: "tu@email.com", readOnly: true },
    { key: "telefono", label: "Teléfono", type: "tel", placeholder: "Ej: 11 1234-5678" },
    { key: "dni", label: "DNI", type: "text", placeholder: "Ej: 12345678" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi perfil</h1>
        <p className="text-gray-500 text-sm mt-1">Administra tus datos personales</p>
      </div>

      {/* Datos personales */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <User size={28} className="text-white" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {profile.nombre} {profile.apellido}
            </p>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {field.label}
              </label>
              <input
                type={field.type}
                value={profile[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                readOnly={field.readOnly}
                placeholder={field.placeholder}
                className={cn(
                  "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm transition",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                  field.readOnly && "bg-gray-50 text-gray-500 cursor-not-allowed"
                )}
              />
            </div>
          ))}

          {error && (
            <div className="bg-danger-light text-danger text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {saved && (
            <div className="bg-success-light text-success text-sm px-4 py-3 rounded-xl flex items-center gap-2">
              <CheckCircle2 size={16} />
              Datos guardados correctamente
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold transition",
              "bg-primary text-white hover:bg-primary-light",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={18} />
                Guardar cambios
              </>
            )}
          </button>
        </form>
      </div>

      {/* Mis pólizas */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-5">
          <Shield size={20} className="text-primary" />
          <div>
            <h2 className="text-base font-bold text-gray-900">Mis pólizas</h2>
            <p className="text-xs text-gray-500">
              {profile.dni ? "Pólizas asociadas a tu DNI" : "Guardá tu DNI para ver tus pólizas"}
            </p>
          </div>
        </div>

        {!profile.dni ? (
          <div className="text-center py-8 text-gray-400">
            <Shield size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Completá tu DNI en los datos personales y guardá</p>
          </div>
        ) : loadingPolizas ? (
          <div className="flex justify-center py-8">
            <Loader2 size={24} className="text-primary animate-spin" />
          </div>
        ) : polizas.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Shield size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No hay pólizas registradas para tu DNI</p>
            <p className="text-xs mt-1">Tu aseguradora debe cargar tus datos en el sistema</p>
          </div>
        ) : (
          <div className="space-y-3">
            {polizas.map((pol) => (
              <div key={pol.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Car size={18} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900">{pol.compania}</p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {pol.vehiculo_marca} {pol.vehiculo_modelo} {pol.vehiculo_anio}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Car size={10} /> <span className="font-mono">{pol.patente}</span>
                      </span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <CreditCard size={10} /> {pol.numero_poliza}
                      </span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400 capitalize">{pol.tipo_seguro}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
