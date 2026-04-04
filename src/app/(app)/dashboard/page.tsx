"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Siniestro } from "@/lib/types";
import { ESTADO_CONFIG } from "@/lib/constants";
import { formatFechaCorta, tipoSiniestroLabel, cn } from "@/lib/utils";
import {
  PlusCircle,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Inbox,
} from "lucide-react";

export default function DashboardPage() {
  const [siniestros, setSiniestros] = useState<Siniestro[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setUserName(user.user_metadata?.nombre || "");

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

  const activos = siniestros.filter(
    (s) => s.estado !== "caso_cerrado"
  ).length;
  const resueltos = siniestros.filter(
    (s) => s.estado === "caso_cerrado"
  ).length;
  const recientes = siniestros.slice(0, 5);

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
        <h1 className="text-2xl font-bold text-gray-900">
          {userName ? `¡Hola, ${userName}!` : "¡Hola!"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Bienvenido a tu panel de siniestros
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={18} className="text-primary" />
            <span className="text-xs text-gray-500 font-medium">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {siniestros.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} className="text-warning" />
            <span className="text-xs text-gray-500 font-medium">Activos</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{activos}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={18} className="text-success" />
            <span className="text-xs text-gray-500 font-medium">
              Resueltos
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{resueltos}</p>
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/siniestros/nuevo"
        className="flex items-center justify-center gap-3 w-full bg-primary hover:bg-primary-light text-white font-semibold py-4 px-6 rounded-2xl transition mb-6 shadow-sm"
      >
        <PlusCircle size={22} />
        Cargar nuevo siniestro
      </Link>

      {/* Recent */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Siniestros recientes
        </h2>

        {recientes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <Inbox size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              No tenés siniestros cargados
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Cargá tu primer siniestro para comenzar
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recientes.map((s) => {
              const config = ESTADO_CONFIG[s.estado] || ESTADO_CONFIG.denuncia_recibida;
              return (
                <Link
                  key={s.id}
                  href={`/siniestros/${s.id}`}
                  className="block bg-white rounded-2xl border border-gray-200 p-4 hover:border-primary/30 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-sm font-medium text-primary">
                        {s.numero_seguimiento}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        {tipoSiniestroLabel(s.tipo_siniestro)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatFechaCorta(s.fecha_siniestro)}
                        {s.compania_aseguradora &&
                          ` · ${s.compania_aseguradora}`}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium px-3 py-1 rounded-full",
                        config.bgColor,
                        config.color
                      )}
                    >
                      {config.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
