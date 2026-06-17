"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff } from "lucide-react";

const CUENTAS = [
  { usuario: "sancor", password: "demo2026", compania: "Sancor Seguros" },
  { usuario: "lacaja", password: "demo2026", compania: "La Caja" },
  { usuario: "allianz", password: "demo2026", compania: "Allianz Argentina" },
  { usuario: "cajaseguros", password: "demo2026", compania: "Caja de Seguros" },
];

export default function AseguradoraLoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cuenta = CUENTAS.find(
      (c) => c.usuario === usuario.trim() && c.password === password
    );
    if (!cuenta) {
      setError("Usuario o contraseña incorrectos.");
      return;
    }
    localStorage.setItem(
      "aseguradora_session",
      JSON.stringify({ compania: cuenta.compania })
    );
    router.push("/aseguradora");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            Portal de Aseguradoras
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Acceso exclusivo para compañías de seguros
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Usuario
            </label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => {
                setUsuario(e.target.value);
                setError("");
              }}
              placeholder="ej: sancor"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-primary transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-danger bg-danger-light rounded-xl px-4 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-3 rounded-xl transition text-sm"
          >
            Ingresar
          </button>
        </form>

        {/* Demo hint */}
        <div className="mt-4 bg-warning-light border border-warning/20 rounded-xl p-4">
          <p className="text-xs font-semibold text-warning mb-2">Credenciales de demo</p>
          <div className="space-y-1">
            {CUENTAS.map((c) => (
              <p key={c.usuario} className="text-xs text-gray-600 font-mono">
                {c.usuario} / {c.password}{" "}
                <span className="text-gray-400 font-sans">— {c.compania}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
