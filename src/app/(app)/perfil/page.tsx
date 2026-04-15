"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { User, Save, Loader2, CheckCircle2, Plus, Trash2, Building2, Car, ChevronUp } from "lucide-react";
import type { Aseguradora, TipoSeguro } from "@/lib/types";
import { COMPANIAS_ASEGURADORAS, TIPOS_SEGURO } from "@/lib/constants";

interface ProfileData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  dni: string;
}

interface NuevaAseguradora {
  alias: string;
  compania_aseguradora: string;
  numero_poliza: string;
  tipo_seguro: TipoSeguro | "";
  vehiculo_marca: string;
  vehiculo_modelo: string;
  vehiculo_anio: string;
  vehiculo_patente: string;
}

const NUEVA_ASEGURADORA_EMPTY: NuevaAseguradora = {
  alias: "",
  compania_aseguradora: "",
  numero_poliza: "",
  tipo_seguro: "",
  vehiculo_marca: "",
  vehiculo_modelo: "",
  vehiculo_anio: "",
  vehiculo_patente: "",
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

  // Aseguradoras state
  const [aseguradoras, setAseguradoras] = useState<Aseguradora[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [nueva, setNueva] = useState<NuevaAseguradora>(NUEVA_ASEGURADORA_EMPTY);
  const [savingAseg, setSavingAseg] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile({
        nombre: data?.nombre || user.user_metadata?.nombre || "",
        apellido: data?.apellido || user.user_metadata?.apellido || "",
        email: data?.email || user.email || "",
        telefono: data?.telefono || "",
        dni: data?.dni || "",
      });
      setLoading(false);
    }
    load();

    fetch("/api/aseguradoras")
      .then((r) => r.json())
      .then(setAseguradoras)
      .catch(() => {});
  }, []);

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
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  function handleChange(field: keyof ProfileData, value: string) {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleAddAseguradora(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!nueva.alias || !nueva.compania_aseguradora || !nueva.numero_poliza || !nueva.tipo_seguro) return;
    setSavingAseg(true);
    try {
      const res = await fetch("/api/aseguradoras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "mock-user-123",
          alias: nueva.alias,
          compania_aseguradora: nueva.compania_aseguradora,
          numero_poliza: nueva.numero_poliza,
          tipo_seguro: nueva.tipo_seguro,
          vehiculo_marca: nueva.vehiculo_marca || null,
          vehiculo_modelo: nueva.vehiculo_modelo || null,
          vehiculo_anio: nueva.vehiculo_anio ? parseInt(nueva.vehiculo_anio) : null,
          vehiculo_patente: nueva.vehiculo_patente || null,
        }),
      });
      const created = await res.json();
      setAseguradoras((prev) => [...prev, created]);
      setShowForm(false);
      setNueva(NUEVA_ASEGURADORA_EMPTY);
    } finally {
      setSavingAseg(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await fetch(`/api/aseguradoras?id=${id}`, { method: "DELETE" });
      setAseguradoras((prev) => prev.filter((a) => a.id !== id));
    } finally {
      setDeletingId(null);
    }
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

      {/* Mis aseguradoras */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Building2 size={20} className="text-primary" />
            <div>
              <h2 className="text-base font-bold text-gray-900">Mis aseguradoras</h2>
              <p className="text-xs text-gray-500">Cargalas una vez y seleccionalas al hacer una denuncia</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition",
              showForm
                ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                : "bg-primary text-white hover:bg-primary-light"
            )}
          >
            {showForm ? (
              <>
                <ChevronUp size={16} />
                Cancelar
              </>
            ) : (
              <>
                <Plus size={16} />
                Agregar
              </>
            )}
          </button>
        </div>

        {/* Formulario nueva aseguradora */}
        {showForm && (
          <form
            onSubmit={handleAddAseguradora}
            className="mb-5 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4"
          >
            <p className="text-sm font-bold text-gray-800">Nueva aseguradora</p>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-600">
                Nombre para identificarla <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={nueva.alias}
                onChange={(e) => setNueva((p) => ({ ...p, alias: e.target.value }))}
                placeholder='Ej: "Auto Fiat Cronos" o "Moto Honda"'
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-600">
                  Compañía aseguradora <span className="text-danger">*</span>
                </label>
                <select
                  value={nueva.compania_aseguradora}
                  onChange={(e) => setNueva((p) => ({ ...p, compania_aseguradora: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white appearance-none"
                >
                  <option value="">Seleccioná</option>
                  {COMPANIAS_ASEGURADORAS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-600">
                  Número de póliza <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={nueva.numero_poliza}
                  onChange={(e) => setNueva((p) => ({ ...p, numero_poliza: e.target.value }))}
                  placeholder="Ej: 12345678"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-600">
                Tipo de seguro <span className="text-danger">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {TIPOS_SEGURO.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setNueva((p) => ({ ...p, tipo_seguro: t.value }))}
                    className={cn(
                      "px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all",
                      nueva.tipo_seguro === t.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {nueva.tipo_seguro === "automotor" && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-1.5">
                  <Car size={14} className="text-primary" />
                  <p className="text-xs font-bold text-gray-700">Datos del vehículo</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-600">Marca</label>
                    <input
                      type="text"
                      value={nueva.vehiculo_marca}
                      onChange={(e) => setNueva((p) => ({ ...p, vehiculo_marca: e.target.value }))}
                      placeholder="Ej: Toyota"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-600">Modelo</label>
                    <input
                      type="text"
                      value={nueva.vehiculo_modelo}
                      onChange={(e) => setNueva((p) => ({ ...p, vehiculo_modelo: e.target.value }))}
                      placeholder="Ej: Corolla"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-600">Año</label>
                    <input
                      type="number"
                      value={nueva.vehiculo_anio}
                      onChange={(e) => setNueva((p) => ({ ...p, vehiculo_anio: e.target.value }))}
                      placeholder="Ej: 2022"
                      min="1950"
                      max={new Date().getFullYear() + 1}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-600">Patente</label>
                    <input
                      type="text"
                      value={nueva.vehiculo_patente}
                      onChange={(e) =>
                        setNueva((p) => ({ ...p, vehiculo_patente: e.target.value.toUpperCase() }))
                      }
                      placeholder="Ej: AB123CD"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary uppercase"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={savingAseg || !nueva.alias || !nueva.compania_aseguradora || !nueva.numero_poliza || !nueva.tipo_seguro}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition",
                "bg-primary text-white hover:bg-primary-light",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {savingAseg ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Guardar aseguradora
                </>
              )}
            </button>
          </form>
        )}

        {/* Lista de aseguradoras */}
        {aseguradoras.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Building2 size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No tenés aseguradoras guardadas todavía</p>
            <p className="text-xs mt-1">Agregá las de tus vehículos para usarlas rápido al denunciar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {aseguradoras.map((aseg) => (
              <div
                key={aseg.id}
                className="flex items-start justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div className="space-y-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{aseg.alias}</p>
                  <p className="text-sm text-gray-600">{aseg.compania_aseguradora}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5">
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
                <button
                  onClick={() => handleDelete(aseg.id)}
                  disabled={deletingId === aseg.id}
                  className="ml-3 shrink-0 p-2 rounded-xl text-gray-400 hover:text-danger hover:bg-danger/10 transition-colors disabled:opacity-50"
                >
                  {deletingId === aseg.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
