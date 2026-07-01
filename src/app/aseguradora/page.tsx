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
  BarChart2,
  List,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

type Filtro = "todos" | "pendientes" | "cerrados";
type Vista = "dashboard" | "lista";

const ETAPAS_ORDER = [
  "denuncia_recibida",
  "en_revision",
  "perito_asignado",
  "peritaje_realizado",
  "resolucion_emitida",
  "caso_cerrado",
];

const TIPO_LABELS: Record<string, string> = {
  choque: "Choque",
  robo_parcial: "Robo parcial",
  robo_total: "Robo total",
  granizo: "Granizo",
  inundacion: "Inundación",
  incendio: "Incendio",
  otro: "Otro",
};

const TIPO_COLORS: Record<string, string> = {
  choque: "bg-blue-500",
  robo_parcial: "bg-amber-500",
  robo_total: "bg-red-500",
  granizo: "bg-cyan-500",
  inundacion: "bg-indigo-500",
  incendio: "bg-orange-500",
  otro: "bg-gray-400",
};

function calcularDiasPromedio(lista: Siniestro[]): number | null {
  const cerrados = lista.filter((s) => s.estado === "caso_cerrado" && s.updated_at);
  if (cerrados.length === 0) return null;
  const total = cerrados.reduce((acc, s) => {
    const dias =
      (new Date(s.updated_at!).getTime() - new Date(s.created_at).getTime()) /
      (1000 * 60 * 60 * 24);
    return acc + dias;
  }, 0);
  return Math.round(total / cerrados.length);
}

export default function AseguradoraDashboard() {
  const router = useRouter();
  const [compania, setCompania] = useState<string | null>(null);
  const [siniestros, setSiniestros] = useState<Siniestro[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [vista, setVista] = useState<Vista>("dashboard");

  useEffect(() => {
    const raw = localStorage.getItem("aseguradora_session");
    if (!raw) {
      router.replace("/iniciar-sesion");
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
    router.push("/iniciar-sesion");
  }

  const pendientes = siniestros.filter((s) => s.estado !== "caso_cerrado").length;
  const cerrados = siniestros.filter((s) => s.estado === "caso_cerrado").length;
  const nuevas = siniestros.filter((s) => s.estado === "denuncia_recibida").length;
  const diasPromedio = calcularDiasPromedio(siniestros);

  const filtrados = siniestros.filter((s) => {
    if (filtro === "pendientes") return s.estado !== "caso_cerrado";
    if (filtro === "cerrados") return s.estado === "caso_cerrado";
    return true;
  });

  const tabs: { key: Filtro; label: string; count: number }[] = [
    { key: "todos", label: "Todos", count: siniestros.length },
    { key: "pendientes", label: "Pendientes", count: pendientes },
    { key: "cerrados", label: "Cerrados", count: cerrados },
  ];

  // Distribución por tipo
  const porTipo = siniestros.reduce<Record<string, number>>((acc, s) => {
    const t = s.tipo_siniestro || "otro";
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  const tipoEntries = Object.entries(porTipo).sort((a, b) => b[1] - a[1]);
  const maxTipo = tipoEntries[0]?.[1] || 1;

  // Distribución por estado (solo pendientes)
  const porEstado = siniestros
    .filter((s) => s.estado !== "caso_cerrado")
    .reduce<Record<string, number>>((acc, s) => {
      acc[s.estado] = (acc[s.estado] || 0) + 1;
      return acc;
    }, {});
  const estadoEntries = ETAPAS_ORDER.filter((e) => e !== "caso_cerrado" && porEstado[e]).map(
    (e) => [e, porEstado[e]] as [string, number]
  );
  const maxEstado = Math.max(...estadoEntries.map(([, v]) => v), 1);

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
        {/* Vista toggle */}
        <div className="flex gap-2 mb-5 bg-gray-100 rounded-xl p-1 w-fit">
          <button
            onClick={() => setVista("dashboard")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition",
              vista === "dashboard"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <BarChart2 size={15} />
            Dashboard
          </button>
          <button
            onClick={() => setVista("lista")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition",
              vista === "lista"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <List size={15} />
            Denuncias
            {nuevas > 0 && (
              <span className="bg-danger text-white text-xs px-1.5 py-0.5 rounded-full leading-none">
                {nuevas}
              </span>
            )}
          </button>
        </div>

        {vista === "dashboard" && (
          <div className="space-y-5">
            {/* KPI cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <p className="text-xs text-gray-400 mb-1">Total denuncias</p>
                <p className="text-3xl font-bold text-gray-900">{siniestros.length}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <p className="text-xs text-gray-400 mb-1">En curso</p>
                <p className="text-3xl font-bold text-amber-500">{pendientes}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <p className="text-xs text-gray-400 mb-1">Resueltos</p>
                <p className="text-3xl font-bold text-success">{cerrados}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <p className="text-xs text-gray-400 mb-1">Días promedio</p>
                <p className="text-3xl font-bold text-primary">
                  {diasPromedio !== null ? diasPromedio : "—"}
                </p>
              </div>
            </div>

            {/* Alerta nuevas denuncias */}
            {nuevas > 0 && (
              <div className="bg-danger/5 border border-danger/20 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <AlertCircle size={20} className="text-danger flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-danger">
                      {nuevas === 1 ? "1 denuncia nueva sin revisar" : `${nuevas} denuncias nuevas sin revisar`}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Requieren atención</p>
                  </div>
                </div>
                <button
                  onClick={() => { setVista("lista"); setFiltro("pendientes"); }}
                  className="text-xs font-semibold text-danger hover:underline whitespace-nowrap"
                >
                  Ver →
                </button>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
              {/* Por tipo de siniestro */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-primary" />
                  <h3 className="text-sm font-bold text-gray-900">Por tipo de siniestro</h3>
                </div>
                {tipoEntries.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">Sin datos</p>
                ) : (
                  <div className="space-y-3">
                    {tipoEntries.map(([tipo, count]) => (
                      <div key={tipo}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600 font-medium">
                            {TIPO_LABELS[tipo] || tipo}
                          </span>
                          <span className="text-xs font-bold text-gray-900">{count}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all", TIPO_COLORS[tipo] || "bg-gray-400")}
                            style={{ width: `${(count / maxTipo) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Por estado (solo pendientes) */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={16} className="text-primary" />
                  <h3 className="text-sm font-bold text-gray-900">Estado de casos en curso</h3>
                </div>
                {estadoEntries.length === 0 ? (
                  <div className="text-center py-4">
                    <CheckCircle2 size={28} className="text-success mx-auto mb-1" />
                    <p className="text-sm text-gray-400">No hay casos pendientes</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {estadoEntries.map(([estado, count]) => {
                      const config = ESTADO_CONFIG[estado] || ESTADO_CONFIG.denuncia_recibida;
                      return (
                        <div key={estado}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600 font-medium">{config.label}</span>
                            <span className="text-xs font-bold text-gray-900">{count}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${(count / maxEstado) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Últimas denuncias */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900">Últimas denuncias</h3>
                <button
                  onClick={() => setVista("lista")}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Ver todas →
                </button>
              </div>
              {siniestros.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Sin denuncias</p>
              ) : (
                <div className="space-y-2">
                  {siniestros.slice(0, 4).map((s) => {
                    const config = ESTADO_CONFIG[s.estado] || ESTADO_CONFIG.denuncia_recibida;
                    return (
                      <Link
                        key={s.id}
                        href={`/aseguradora/${s.id}`}
                        className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-gray-50 transition"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-mono font-medium text-primary truncate">
                            {s.numero_seguimiento}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {tipoSiniestroLabel(s.tipo_siniestro)} · {formatFechaCorta(s.fecha_siniestro)}
                            {s.asegurado_nombre && ` · ${s.asegurado_nombre}`}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0",
                            config.bgColor,
                            config.color
                          )}
                        >
                          {config.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {vista === "lista" && (
          <div>
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
          </div>
        )}
      </main>
    </div>
  );
}
