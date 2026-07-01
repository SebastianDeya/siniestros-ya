"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Shield, Car, User, CreditCard, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TIPOS_SEGURO } from "@/lib/constants";

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

const EMPTY_FORM = {
  patente: "",
  numero_poliza: "",
  tipo_seguro: "automotor",
  vehiculo_marca: "",
  vehiculo_modelo: "",
  vehiculo_anio: "",
  asegurado_nombre: "",
  asegurado_dni: "",
  asegurado_telefono: "",
  asegurado_email: "",
};

export default function PolizasPage() {
  const router = useRouter();
  const [compania, setCompania] = useState<string | null>(null);
  const [polizas, setPolizas] = useState<Poliza[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("aseguradora_session");
    if (!raw) { router.replace("/iniciar-sesion"); return; }
    const session = JSON.parse(raw);
    setCompania(session.compania);

    fetch(`/api/polizas?compania=${encodeURIComponent(session.compania)}`)
      .then((r) => r.json())
      .then((data) => { setPolizas(data || []); setLoading(false); });
  }, [router]);

  async function handleSave() {
    if (!compania) return;
    setSaving(true);
    setSaveError(null);
    const res = await fetch("/api/polizas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, compania, vehiculo_anio: Number(form.vehiculo_anio) }),
    });
    if (res.ok) {
      const nueva = await res.json();
      setPolizas((p) => [...p, nueva]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } else {
      const body = await res.json().catch(() => ({}));
      setSaveError(body.error || "No se pudo guardar la póliza. Intentá de nuevo.");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    await fetch(`/api/polizas?id=${id}`, { method: "DELETE" });
    setPolizas((p) => p.filter((pol) => pol.id !== id));
    setDeletingId(null);
  }

  const f = (field: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href="/aseguradora"
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <p className="text-xs text-white/60 leading-none mb-0.5">{compania}</p>
            <p className="font-semibold text-sm leading-none">Gestión de pólizas</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-sm font-medium px-4 py-2 rounded-xl transition"
          >
            <Plus size={16} />
            Nueva póliza
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {polizas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <Shield size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No hay pólizas cargadas aún</p>
            <p className="text-gray-400 text-sm mt-1">
              Cargá las pólizas de tus asegurados para que puedan hacer denuncias.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-light transition"
            >
              <Plus size={16} />
              Cargar primera póliza
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {polizas.map((pol) => (
              <div key={pol.id} className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                      <Car size={20} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-mono text-sm font-bold text-primary">{pol.patente}</p>
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full capitalize">{pol.tipo_seguro}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-0.5">
                        {pol.vehiculo_marca} {pol.vehiculo_modelo} {pol.vehiculo_anio}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <User size={11} /> {pol.asegurado_nombre || "Sin nombre"}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <CreditCard size={11} /> {pol.numero_poliza}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(pol.id)}
                    disabled={deletingId === pol.id}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-danger hover:bg-danger/10 transition flex-shrink-0"
                  >
                    {deletingId === pol.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de nueva póliza */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Nueva póliza</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Vehículo */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Car size={12} /> Vehículo
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Patente *</label>
                    <input value={form.patente} onChange={f("patente")} placeholder="Ej: ABC123"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono uppercase focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Marca</label>
                    <input value={form.vehiculo_marca} onChange={f("vehiculo_marca")} placeholder="Toyota"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Modelo</label>
                    <input value={form.vehiculo_modelo} onChange={f("vehiculo_modelo")} placeholder="Corolla"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Año</label>
                    <input value={form.vehiculo_anio} onChange={f("vehiculo_anio")} placeholder="2020" type="number"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Tipo de seguro</label>
                    <select value={form.tipo_seguro} onChange={f("tipo_seguro")}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary bg-white">
                      {TIPOS_SEGURO.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Póliza */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Shield size={12} /> Póliza
                </p>
                <label className="block text-xs font-medium text-gray-600 mb-1">Número de póliza *</label>
                <input value={form.numero_poliza} onChange={f("numero_poliza")} placeholder="Ej: POL-12345"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-primary" />
              </div>

              {/* Asegurado */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <User size={12} /> Asegurado
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Nombre completo</label>
                    <input value={form.asegurado_nombre} onChange={f("asegurado_nombre")} placeholder="Juan Pérez"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">DNI</label>
                    <input value={form.asegurado_dni} onChange={f("asegurado_dni")} placeholder="30123456"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Teléfono</label>
                    <input value={form.asegurado_telefono} onChange={f("asegurado_telefono")} placeholder="11 2345-6789"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                    <input value={form.asegurado_email} onChange={f("asegurado_email")} placeholder="juan@email.com" type="email"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
                  </div>
                </div>
              </div>
            </div>

            {saveError && (
              <div className="mx-5 mb-1 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {saveError}
              </div>
            )}

            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button onClick={() => { setShowForm(false); setSaveError(null); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.patente || !form.numero_poliza}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-light transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                {saving ? "Guardando..." : "Guardar póliza"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
