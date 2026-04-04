"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Siniestro } from "@/lib/types";
import { ESTADO_CONFIG } from "@/lib/constants";
import { formatFechaCorta, tipoSiniestroLabel, cn } from "@/lib/utils";
import { FileText, Inbox, ChevronRight } from "lucide-react";

type Filtro = "todos" | "en_proceso" | "resueltos";

export default function SiniestrosPage() {
  const [siniestros, setSiniestros] = useState<Siniestro[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<Filtro>("todos");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("siniestros")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setSiniestros(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtrados = siniestros.filter((s) => {
    if (filtro === "en_proceso") return s.estado !== "caso_cerrado";
    if (filtro === "resueltos") return s.estado === "caso_cerrado";
    return true;
  });

  const tabs: { key: Filtro; label: string }[] = [
    { key: "todos", label: "Todos" },
    { key: "en_proceso", label: "En proceso" },
    { key: "resueltos", label: "Resueltos" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mis siniestros</h1>
        <p className="text-gray-500 text-sm mt-1">
          Historial de todos tus reclamos
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFiltro(tab.key)}
            className={cn(
              "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition",
              filtro === tab.key
                ? "bg-white text-primary shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Claims list */}
      {filtrados.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <Inbox size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">
            {filtro === "todos"
              ? "No tenes siniestros cargados"
              : filtro === "en_proceso"
              ? "No tenes siniestros en proceso"
              : "No tenes siniestros resueltos"}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {filtro === "todos"
              ? "Carga tu primer siniestro para comenzar"
              : "Los siniestros apareceran aca cuando corresponda"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtrados.map((s) => {
            const config =
              ESTADO_CONFIG[s.estado] || ESTADO_CONFIG.denuncia_recibida;
            return (
              <Link
                key={s.id}
                href={`/siniestros/${s.id}`}
                className="block bg-white rounded-2xl border border-gray-200 p-4 hover:border-primary/30 transition active:scale-[0.98]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FileText size={20} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-sm font-medium text-primary">
                        {s.numero_seguimiento}
                      </p>
                      <p className="text-sm text-gray-700 mt-0.5">
                        {tipoSiniestroLabel(s.tipo_siniestro)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatFechaCorta(s.fecha_siniestro)}
                        {s.compania_aseguradora &&
                          ` · ${s.compania_aseguradora}`}
                      </p>
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
  );
}
