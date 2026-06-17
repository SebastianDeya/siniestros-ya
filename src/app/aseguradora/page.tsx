"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Siniestro } from "@/lib/types";
import { ESTADO_CONFIG } from "@/lib/constants";
import { formatFechaCorta, tipoSiniestroLabel, cn } from "@/lib/utils";
import {
  Shield,
  FileText,
  ChevronRight,
  Inbox,
  LogOut,
  CheckCircle2,
  Clock,
  BookOpen,
} from "lucide-react";

type Filtro = "todos" | "pendientes" | "cerrados";

const ETAPAS_ORDER = [
  "denuncia_recibida",
  "en_revision",
  "perito_asignado",
  "peritaje_realizado",
  "resolucion_emitida",
  "caso_cerrado",
];

export default function AseguradoraDashboard() {
  const router = useRouter();
  const [compania, setCompania] = useState<string | null>(null);
  const [siniestros, setSiniestros] = useState<Siniestro[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<Filtro>("todos");

  useEffect(() => {
    const raw = localStorage.getItem("aseguradora_session");
    if (!raw) {
      router.replace("/aseguradora/login");
      return;
    }
    const session = JSON.parse(raw);
    setCompania(session.compania);

    fetch("/api/siniestros", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: Siniestro[]) => {
        const propios = data.filter(
          (s) => s.compania_aseguradora === session.compania
        );
        // newest first
        propios.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setSiniestros(propios);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("aseguradora_session");
    router.push("/aseguradora/login");
  }

  const filtrados = siniestros.filter((s) => {
    if (filtro === "pendientes") return s.estado !== "caso_cerrado";
    if (filtro === "cerrados") return s.estado === "caso_cerrado";
    return true;
  });

  const pendientes = siniestros.filter((s) => s.estado !== "caso_cerrado").length;
  const cerrados = siniestros.filter((s) => s.estado === "caso_cerrado").length;

  const tabs: { key: Filtro; label: string; count: number }[] = [
    { key: "todos", label: "Todos", count: siniestros.length },
    { key: "pendientes", label: "Pendientes", count: pendientes },
    { key: "cerrados", label: "Cerrados", count: cerrados },
  ];

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
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60 leading-none mb-0.5">Portal aseguradoras</p>
              <p className="font-semibold text-sm leading-none">{compania}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/aseguradora/polizas"
              className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition"
            >
              <BookOpen size={16} />
              Pólizas
            </Link>
            <span className="text-white/20">|</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition"
            >
              <LogOut size={16} />
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{siniestros.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-warning">{pendientes}</p>
            <p className="text-xs text-gray-500 mt-1">Pendientes</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-success">{cerrados}</p>
            <p className="text-xs text-gray-500 mt-1">Cerrados</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 bg-gray-100 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFiltro(tab.key)}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1.5",
                filtro === tab.key
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full",
                  filtro === tab.key
                    ? "bg-primary/10 text-primary"
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* List */}
        {filtrados.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <Inbox size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No hay denuncias en esta categoría</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtrados.map((s) => {
              const config = ESTADO_CONFIG[s.estado] || ESTADO_CONFIG.denuncia_recibida;
              const etapaIdx = ETAPAS_ORDER.indexOf(s.estado);
              const isNuevo = s.estado === "denuncia_recibida";

              return (
                <Link
                  key={s.id}
                  href={`/aseguradora/${s.id}`}
                  className="block bg-white rounded-2xl border border-gray-200 p-4 hover:border-primary/30 transition active:scale-[0.98]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center mt-0.5">
                          <FileText size={20} className="text-primary" />
                        </div>
                        {isNuevo && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-sm font-medium text-primary">
                            {s.numero_seguimiento}
                          </p>
                          {isNuevo && (
                            <span className="text-xs bg-danger/10 text-danger font-medium px-1.5 py-0.5 rounded-full">
                              Nueva
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mt-0.5">
                          {tipoSiniestroLabel(s.tipo_siniestro)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatFechaCorta(s.fecha_siniestro)}
                          {s.asegurado_nombre && ` · ${s.asegurado_nombre}`}
                        </p>
                        {/* Progress bar */}
                        <div className="flex gap-0.5 mt-2">
                          {ETAPAS_ORDER.map((_, i) => (
                            <div
                              key={i}
                              className={cn(
                                "h-1 flex-1 rounded-full",
                                i <= etapaIdx ? "bg-primary" : "bg-gray-100"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={cn(
                          "text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap",
                          config.bgColor,
                          config.color
                        )}
                      >
                        {config.label}
                      </span>
                      <ChevronRight size={16} className="text-gray-300" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
